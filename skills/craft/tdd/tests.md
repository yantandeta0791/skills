# Good and Bad Tests

Load this when writing or changing any test.

A test exists to catch a specific break. If you cannot name the break, the test is
decoration.

## Name the break first

Before writing the body, answer: **what production change would make this test fail —
and is that change a bug or a decision?**

A test earns its place by catching a wrong branch, a missing side effect, a wrong
argument, a boundary case, or a broken contract.

```
BEFORE writing the test body:
  Name the production change that would make this test fail.

  Cannot name one            → redesign around an observable behavior
  "The source text changed"  → run the artifact and assert its effects
  Only intentional decisions → change detector; test the behavior
                               that depends on the decision instead

  Confirm the expected value is derived without the code under test.
  If it reuses the code's logic or helpers:
    replace it with a literal or a hand-checked fixture.
```

## Test behavior through the public interface

```typescript
// GOOD: observable behavior, public API only
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics: tests what callers care about, uses the public API only, survives
internal refactors, describes WHAT not HOW, one logical assertion.

```typescript
// BAD: coupled to internal structure
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags: mocking internal collaborators, testing private methods, asserting on call
counts or ordering that isn't part of the contract, breaking on refactors that changed
no behavior, a name that describes HOW.

## Verify through the interface, not a side channel

```typescript
// BAD: bypasses the interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: verifies through the interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

## Derive expected values independently

An expectation computed by the code under test — or by its helpers — passes no matter
what that code does.

```typescript
// BAD: expected value is recomputed the way the code computes it
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: expected value is an independent, known literal
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

```typescript
// BAD: mirror assertion — the same builder computes both sides, always true
const expected = buildSearchQuery({ tag: 'urgent' });
expect(buildSearchQuery({ tag: 'urgent' })).toBe(expected);

// GOOD: hand-derived literal
expect(buildSearchQuery({ tag: 'urgent' })).toBe('tag:"urgent"');
```

Table-driven tests with literal `want` values are the preferred shape.

## No change detectors

If only an intentional decision could fail the test — a constant's value, exact message
wording, a private structure — it fires on every redesign and sleeps through real bugs.
Test the behavior that depends on the decision: not `expect(MAX_RETRIES).toBe(5)`, but
"a failing call is retried 5 times and the 6th attempt never happens."

## Assert behavior, not text

Asserting that a script or config file contains an exact line proves only that the
source is the source. Run the artifact against controlled inputs and assert its outputs,
side effects, or exit code.

## Test your code, not the framework

Test the contract your code makes at its boundaries — the route you register, the query
you emit, the payload you produce. Upstream mechanics belong to their maintainers'
tests. The classic mistake: asserting that your router invokes a handler you registered.

When upstream behavior genuinely surprised you, write one narrow characterization test
that names the assumption.

The same boundary applies inside your own code. Constructors, getters, constants, and
trivial forwarding earn tests only when they validate, normalize, default, derive,
enforce, or cause a side effect. Otherwise assert the first consumer-visible result that
depends on them.

## Warning signs

- Setup and assertion share the same object, guaranteeing equality
- The test can only fail through a crash or a missing selector
- The test fails on every intentional change and never on accidental breakage
- Expected values are hidden behind loops, builders, or helpers
- The test greps source text, or asserts that a removed symbol stays removed
- The test would still pass if only the framework remained
- The test exists for coverage and checks no outcome or side effect
- An assertion checks for a mock's presence, or fails when you remove the mock
- A production method is called only from test files
