# Mocking

Load this before adding a mock, a fake, or a test-only helper.

## Mock at system boundaries only

Mock:

- External APIs (payment, email, third-party services)
- Databases (sometimes — prefer a real test database)
- Time and randomness
- The filesystem (sometimes)

Don't mock:

- Your own classes and modules
- Internal collaborators
- Anything you control

## Mock at the right level

Learn every side effect of the real method **before** replacing it. Mock the slow or
external operation, and keep the parts the test depends on real. When unsure, run the
test against the real implementation first and observe what actually happens.

```typescript
// BAD: the mock swallows the config write that duplicate detection reads
vi.mock('ToolCatalog', () => ({
  discoverAndCacheTools: vi.fn().mockResolvedValue(undefined)
}));

// GOOD: mock only the slow server startup; the config write stays real
vi.mock('MCPServerManager');
```

## The mock earns no assertions

An assertion on a mock passes when the mock is present and fails when it is absent. It
says nothing about your component.

```typescript
// GOOD: real behavior
expect(screen.getByRole('navigation')).toBeInTheDocument();

// BAD: asserts a mock exists
expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
```

If the mock is what you're checking, unmock it or delete the assertion. The question to
ask yourself: *am I testing the behavior of a mock?*

## Make doubles specific

When arguments, call counts, or ordering are genuinely part of the contract, assert
them — a fake that accepts anything verifies nothing. Give each branch (success, error,
malformed) its own fixture or spy, so the wrong branch cannot satisfy the expectation.

## Mirror real data completely

Mock the complete structure as it exists in reality — all documented fields — not just
the ones your test reads. Partial mocks fail silently when downstream code reads an
omitted field: the test passes while the integration breaks.

## Design for mockability at the boundary

**Inject dependencies** rather than constructing them internally:

```typescript
// Easy to substitute
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to substitute
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**Prefer specific operations over one generic fetcher.** One function per external
operation instead of a single call with conditional logic:

```typescript
// GOOD: each function is independently substitutable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: substituting this requires conditional logic inside the double
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

Each double then returns one specific shape, test setup carries no branching, and it is
obvious which operations a test exercises.

## Production classes carry production methods only

Cleanup that only tests need belongs in test utilities, never as a `destroy()` on the
production class. Ask: is this method called only from tests? Does this class actually
own that resource's lifecycle? Wrong answers mean it is a test utility.

## Prefer real components over elaborate mocks

Switch to an integration test with real components when mock setup outgrows the test
logic, when the mock is missing methods the real component has, or when tests break
because the mock changed. The question to ask yourself: *do we need a mock here at all?*

## Gate

```
BEFORE adding a mock or test helper:
  List the real method's side effects; keep the ones the test
  depends on real — mock the slow or external level below them.

  Mock responses mirror the complete real structure.

  A method only tests call belongs in test utilities, not production.

  About to assert on the mock itself?
    Unmock it, or delete the assertion.
```

Warning signs: mock setup is more than half the test, you can't explain why the mock is
needed, or you're mocking "just to be safe".
