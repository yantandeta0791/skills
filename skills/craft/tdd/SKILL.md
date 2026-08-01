---
name: tdd
description: Red-green-refactor discipline for writing features and fixing bugs test-first, plus the rules that make the resulting tests worth keeping. Use when the user wants to build or fix something test-first, mentions TDD or "red-green-refactor", asks for tests to be written, or is about to write implementation code for new behavior.
---

# Test-Driven Development

Write the test first. Watch it fail. Write the minimum code that makes it pass.

**Core principle:** if you didn't watch the test fail, you don't know whether it tests
the right thing — or anything at all.

This skill is both the loop and the reference that makes the loop produce tests worth
keeping: what a good test is, where tests go, the anti-patterns, and the rules of the
cycle. Every section applies on every cycle — consult them during the loop, not after.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Wrote the code before the test? Delete it and start over. Not "keep it as reference",
not "adapt it while writing the test" — you will adapt it, and that is testing after.
Implement fresh from the test.

**Always applies:** new features, bug fixes, behavior changes.

**Ask the user before skipping:** throwaway prototypes, generated code, configuration.

Thinking "skip TDD just this once"? That thought is the rationalization, not the
exception.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. The code
can change entirely; the tests shouldn't. A good test reads like a specification —
"user can checkout with valid cart" tells you exactly what capability exists — and
survives refactors because it doesn't care about internal structure.

Two rules govern everything:

1. **Every test names the break it catches.** Before writing the body, answer: what
   production change would make this test fail, and is that change a bug or a decision?
   If only a deliberate decision could fail it, it is a change detector — it fires on
   redesign and sleeps through bugs.
2. **Every test exercises the real thing.** Real code paths, real components, real
   collaborators. Mocks are earned at system boundaries, never assumed.

See [tests.md](tests.md) for good and bad examples, and [mocking.md](mocking.md) for
when and how to mock.

## Seams — where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior
without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under
test and confirm them with the user. No test is written at an unconfirmed seam. You
can't test everything — agreeing the seams up front is how testing effort lands on
critical paths and complex logic instead of on every edge case.

Ask: "What's the public interface, and which seams should we test?"

Working from a pipeline work item? `/refine` already named its test seam. Use that one
rather than renegotiating it. Name tests in the project's domain vocabulary — see
`.pipeline/REQUIREMENTS.md` if it exists — so a test name reads as a statement about the
product, not about the code.

## The loop

### RED — write one failing test

One behavior. Clear name. Real code.

```typescript
// Good — clear name, real behavior, one thing
test('retries failed operations 3 times', async () => {
  let attempts = 0;
  const operation = () => {
    attempts++;
    if (attempts < 3) throw new Error('fail');
    return 'success';
  };

  const result = await retryOperation(operation);

  expect(result).toBe('success');
  expect(attempts).toBe(3);
});
```

```typescript
// Bad — vague name, and it tests the mock rather than the code
test('retry works', async () => {
  const mock = jest.fn()
    .mockRejectedValueOnce(new Error())
    .mockRejectedValueOnce(new Error())
    .mockResolvedValueOnce('success');
  await retryOperation(mock);
  expect(mock).toHaveBeenCalledTimes(3);
});
```

If the name needs an "and", it is two tests.

### Verify RED — watch it fail

**Mandatory. Never skip.** Run the single test file and read the output.

Confirm all three:

- It **fails**, rather than erroring on a typo or import.
- The failure message is the one you expected.
- It fails **because the behavior is missing**.

**Passes already?** You are testing behavior that already exists. Fix the test.
**Errors?** Fix the error and rerun until it fails for the right reason.

### GREEN — minimal code

Write the simplest thing that passes the test. No extra options, no speculative
parameters, no "while I'm here" improvements.

```typescript
// Good — just enough to pass
async function retryOperation<T>(fn: () => Promise<T>): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === 2) throw e;
    }
  }
  throw new Error('unreachable');
}
```

An implementation with `maxRetries`, `backoff`, and an `onRetry` callback when one test
asked for three retries is not thoroughness, it is untested code.

### Verify GREEN — watch it pass

**Mandatory.** Run the test file, then the rest of the suite.

- Target test passes.
- Every other test still passes.
- Output is pristine — no stray errors, no new warnings.

**Test fails?** Fix the code, not the test. **Other tests fail?** Fix them now, not
later.

### REFACTOR — clean up while green

Only after green, and only behavior-preserving: remove duplication, improve names,
extract helpers. Add no behavior, and keep the suite green after every step.

Anything bigger — reshaping an interface, moving responsibilities, restructuring
modules — is not part of this cycle. It belongs to a deliberate review pass, where it
gets its own attention instead of riding along inside a feature change.

### Repeat — one vertical slice at a time

One seam, one test, one minimal implementation, then the next. Each test is a **tracer
bullet** that responds to what the last cycle taught you.

Do **not** write all the tests first and then all the implementation. Bulk tests verify
_imagined_ behavior: you end up testing the shape of things rather than user-facing
behavior, the tests go insensitive to real changes, and you commit to a test structure
before you understand the implementation.

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private methods, or
  verifies through a side channel (querying the database directly instead of using the
  interface). The tell: the test breaks when you refactor, but behavior hasn't changed.
- **Tautological** — the assertion recomputes the expected value the way the code does
  (`expect(add(a, b)).toBe(a + b)`, a snapshot derived by hand the same way, a constant
  asserted equal to itself), so it passes by construction and can never disagree with
  the code. Expected values must come from an independent source of truth — a known-good
  literal, a worked example, the specification.
- **Horizontal slicing** — all tests first, then all implementation. See the loop above.
- **Asserting on mocks** — a mock assertion passes when the mock is present and fails
  when it is absent. It says nothing about your code.
- **Testing the framework** — the route your code registers is your contract; that the
  router then invokes the handler is the framework's test to write, not yours.

## The mutation check

Before calling a test file done, mentally mutate the production code. At least one test
should fail for each realistic mutation:

- Wrong constant or argument
- Wrong branch taken
- Missing state change or side effect
- Empty or default return
- Missing validation for zero, empty, null, unauthorized, or malformed input

A mutation nothing catches means the behavior is unprotected, or the test is
tautological.

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. The test takes thirty seconds. |
| "I'll test after" | Tests written after pass immediately, which proves nothing. You never watched it fail, so you never proved it can catch the bug. |
| "Tests after achieve the same thing — spirit, not ritual" | Tests-after answer "what does this do?"; tests-first answer "what should this do?" Tests written after are biased by the code you already wrote. |
| "Already tested it by hand" | Manual testing has no record, no rerun, and no coverage of the case you forgot under pressure. |
| "Deleting hours of work is wasteful" | Sunk cost — that time is spent either way. The choice is confidence versus code you can't trust. |
| "Keep it as reference, write the tests first" | You'll adapt it. That's testing after. |
| "I need to explore first" | Fine. Throw the exploration away, then start with TDD. |
| "This is hard to test" | Listen to the test. Hard to test means hard to use. |
| "TDD will slow me down" | TDD is the pragmatic path: it catches bugs before commit and lets you refactor without fear. The shortcut ends in production debugging. |
| "This code has no tests already" | You're improving it. Add tests for what you touch. |

## Red flags — stop and start over

Code before test · test written after implementation · test passed on the first run ·
can't explain why it failed · "tests will come later" · "just this once" · "keep it as
reference" · "I already tested it manually" · "TDD is dogmatic, I'm being pragmatic" ·
"this case is different because…"

All of these mean the same thing: delete the code, start with the test.

## When stuck

| Problem | Solution |
|---------|----------|
| Don't know how to test it | Write the API you wish existed. Write the assertion first. Ask the user. |
| Test is too complicated | The design is too complicated. Simplify the interface. |
| Must mock everything | The code is too coupled. Inject dependencies. |
| Setup is enormous | Extract helpers. Still complex? Simplify the design. |

## Fixing bugs

Never fix a bug without a test that reproduces it. Write the failing test first, then
run the loop — it both proves the fix and prevents the regression. For bugs where the
cause isn't yet known, diagnose first with the `diagnosing-bugs` skill; the minimised
reproduction it produces is your failing test.

## Verification checklist

Before calling the work complete:

- [ ] Every new behavior is covered by a test at an agreed seam
- [ ] You watched each test fail before implementing
- [ ] Each test failed for the expected reason
- [ ] You wrote the minimum code to pass each test
- [ ] The full suite passes and the output is pristine
- [ ] Tests exercise real code; mocks only at system boundaries
- [ ] Edge cases and error paths are covered
- [ ] The mutation check passes

Can't check every box? You skipped TDD.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) and [obra/superpowers](https://github.com/obra/superpowers), MIT.*
