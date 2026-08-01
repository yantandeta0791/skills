# Root Cause Tracing

Bugs often surface deep in the call stack: a repository initialised in the wrong
directory, a file written to the wrong location, a database opened with the wrong path.
The instinct is to fix where the error appears. That is treating a symptom.

**Core principle:** trace backward through the call chain until you find the original
trigger, then fix at the source.

**Use when:** the error happens far from the entry point, the stack trace is long, it is
unclear where an invalid value came from, or you need to find which caller or test
triggers the problem.

## The tracing process

**1. Observe the symptom.**

```
Error: repository init failed in ~/project/packages/core
```

**2. Find the immediate cause.** What code directly performs the failing operation?

```typescript
await run('git', ['init'], { cwd: projectDir });
```

**3. Ask what called it,** and keep walking up:

```
WorktreeManager.createSessionWorktree(projectDir, sessionId)
  ← Session.initializeWorkspace()
    ← Session.create()
      ← test setup at Project.create()
```

**4. Follow the value, not just the frames.** What was actually passed?

- `projectDir` was `''`
- an empty `cwd` resolves to the current working directory
- which was the source tree

**5. Find the original trigger.** Where did the empty string come from?

```typescript
const context = setupCoreTest(); // returns { tempDir: '' } until setup runs
Project.create('name', context.tempDir); // read before setup!
```

Root cause: a top-level initialiser read a value before it was populated. The fix goes
there — make `tempDir` a getter that throws when read too early — not at the failing
operation five frames down.

## When you cannot trace by reading

Add instrumentation that captures the call chain at the dangerous operation:

```typescript
async function gitInit(directory: string) {
  console.error('[DEBUG-a4f2] git init', {
    directory,
    cwd: process.cwd(),
    env: process.env.NODE_ENV,
    stack: new Error().stack,
  });

  await run('git', ['init'], { cwd: directory });
}
```

- **Log before the dangerous operation**, not after it fails — after may never run.
- **Write to the standard error stream** in tests; application loggers are often
  suppressed by the test runner.
- **Include context:** the argument, the working directory, relevant environment
  variables, timestamps.
- **Capture the stack** so you get the whole chain in one run.

Then run the failing scenario and filter the output for your tag.

## Finding which test causes pollution

If bad state appears during a test run but you cannot tell which test creates it,
bisect: run the suite one file at a time (or halve it repeatedly), checking for the
polluting side effect after each run, and stop at the first file that produces it. Once
you have the file, repeat within it at test level.

## Then make it impossible

After fixing at the source, add validation at each layer the bad value passed through —
entry point, business logic, environment guard. Different layers catch different cases:
alternate code paths bypass entry validation, mocks bypass business-logic checks, and
platform-specific edge cases need environment guards.

**Never fix only where the error appears.**
