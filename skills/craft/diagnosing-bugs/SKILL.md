---
name: diagnosing-bugs
description: Systematic diagnosis loop for bugs, test failures, and performance regressions — reproduce, minimise, hypothesise, instrument, fix, regression-test. Use when the user says "debug this" or "diagnose", reports something broken, throwing, failing, flaky, or slow, or when a fix has already been attempted and did not hold.
---

# Diagnosing Bugs

A discipline for hard bugs. Skip a phase only when you can say out loud why it does not apply.

## The Iron Law

```
NO FIX WITHOUT A REPRODUCTION AND A ROOT CAUSE
```

A fix applied before the cause is understood is a guess. Guesses that happen to make
the symptom disappear are worse than failures — they hide the bug and cost the next
person a day.

Use this loop for any technical issue: test failures, production bugs, unexpected
behavior, performance problems, build failures, integration breakage.

**Use it especially when:**

- You are under time pressure — emergencies make guessing tempting, and systematic is
  faster than thrashing.
- The bug "looks obvious" — obvious causes are the ones that anchor you wrongly.
- You have already tried a fix and it did not work.
- You do not fully understand the system involved.

## Start here — free evidence

Before building anything, spend two minutes on the evidence you already have:

- **Read the error completely.** Full stack trace, line numbers, file paths, error
  codes. Errors often contain the exact answer and are routinely skimmed past.
- **Capture the user's exact symptom** in their words. You will verify against this
  later, and "a nearby failure" is a different bug.
- **Check what changed.** Recent commits, dependency bumps, config edits, environment
  differences. A bug that appeared between two known-good states is half solved.

## Phase 1 — Build a feedback loop

**This is the skill.** Everything else is mechanical. If you have a **tight** pass/fail
signal for the bug — one that goes red on _this_ bug — you will find the cause;
bisection, hypothesis-testing, and instrumentation all just consume it. If you don't
have one, no amount of staring at code will save you.

Spend disproportionate effort here. **Be aggressive. Be creative. Refuse to give up.**

### Ways to construct one — try them in roughly this order

1. **Failing test** at whatever seam reaches the bug — unit, integration, end-to-end.
2. **HTTP request script** against a running dev server.
3. **Command-line invocation** with a fixture input, diffing output against a
   known-good snapshot.
4. **Headless browser script** — drives the UI, asserts on the DOM, console, or network.
5. **Replay a captured trace.** Save a real request, payload, or event log to disk;
   replay it through the code path in isolation.
6. **Throwaway harness.** Spin up a minimal subset of the system (one service, mocked
   deps) that exercises the bug code path with a single function call.
7. **Property / fuzz loop.** If the bug is "sometimes wrong output", run a thousand
   random inputs and look for the failure mode.
8. **Bisection harness.** If the bug appeared between two known states (commit,
   dataset, version), automate "boot at state X, check, repeat" so the version-control
   bisect command can drive it.
9. **Differential loop.** Run the same input through old-version vs new-version (or two
   configs) and diff outputs.
10. **Human-in-the-loop script.** Last resort. If a human must click, drive _them_ with
    a script that prints one instruction at a time and reads their answers back — see
    `hitl-loop.template.sh` in this folder — so the loop is still structured and its
    output still feeds back to you.

Build the right feedback loop, and the bug is 90% fixed.

### Tighten the loop

Treat the loop as a product. Once you have _a_ loop, **tighten** it:

- Can I make it faster? (Cache setup, skip unrelated init, narrow the test scope.)
- Can I make the signal sharper? (Assert on the specific symptom, not "didn't crash".)
- Can I make it more deterministic? (Pin time, seed randomness, isolate the filesystem,
  freeze the network.)

A 30-second flaky loop is barely better than no loop; a 2-second deterministic one is
tight — a debugging superpower.

### Non-deterministic bugs

The goal is not a clean repro but a **higher reproduction rate**. Loop the trigger a
hundred times, parallelise, add stress, narrow timing windows, perturb the schedule. A
50%-flake bug is debuggable; 1% is not — keep raising the rate until it's debuggable.

If the flakiness comes from waiting, replace fixed sleeps with **condition polling**:
poll for the state you actually need, with a timeout, instead of guessing a duration.
Fixed sleeps are both slower and less reliable, and they hide the real race.

### When you genuinely cannot build a loop

Stop and say so explicitly. List what you tried. Ask the user for: (a) access to
whatever environment reproduces it, (b) a captured artifact (network capture, log dump,
core dump, screen recording with timestamps), or (c) permission to add temporary
production instrumentation. Do **not** proceed to hypothesise without a loop.

### Completion criterion — a tight loop that goes red

Phase 1 is done when the loop is **tight** and **red-capable**: you can name **one
command** — a script path, a test invocation, a request — that you have **already run at
least once** (paste the invocation and its output), and that is:

- [ ] **Red-capable** — it drives the actual bug code path and asserts the **user's
      exact symptom**, so it can go red on this bug and green once fixed. Not "runs
      without erroring" — it must be able to _catch this specific bug_.
- [ ] **Deterministic** — same verdict every run (flaky bugs: a pinned, high
      reproduction rate, per above).
- [ ] **Fast** — seconds, not minutes.
- [ ] **Runnable unattended** — no human in the loop except through a structured
      human-in-the-loop script.

If you catch yourself reading code to build a theory before this command exists,
**stop — jumping straight to a hypothesis is the exact failure this skill prevents.**
No red-capable command, no Phase 2.

## Phase 2 — Reproduce + minimise

Run the loop. Watch it go red — the bug appears.

Confirm:

- [ ] The loop produces the failure mode the **user** described — not a different
      failure that happens to be nearby. Wrong bug = wrong fix.
- [ ] The failure is reproducible across multiple runs (or, for non-deterministic bugs,
      reproducible at a high enough rate to debug against).
- [ ] You have captured the exact symptom (error message, wrong output, slow timing) so
      later phases can verify the fix actually addresses it.

### Minimise

Once it's red, shrink the repro to the **smallest scenario that still goes red**. Cut
inputs, callers, config, data, and steps **one at a time**, re-running the loop after
each cut — keep only what's load-bearing for the failure.

Why bother: a minimal repro shrinks the hypothesis space in Phase 3 (fewer moving parts
left to suspect) and becomes the clean regression test in Phase 5.

Done when **every remaining element is load-bearing** — removing any one of them makes
the loop go green.

Do not proceed until you have reproduced **and** minimised.

## Phase 3 — Hypothesise

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis
generation anchors on the first plausible idea.

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear /
> <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe — discard or sharpen it.

### Generating candidates: compare against what works

The fastest source of hypotheses is a working analogue:

- **Find working examples.** Locate similar code in the same codebase that does work.
- **List every difference** between working and broken, however small. Do not
  pre-filter with "that can't matter" — that judgement is what put you here.
- **Read reference implementations completely.** If you are following a pattern from a
  library or another module, read all of it. Partial understanding of a pattern is a
  reliable bug source, and "the reference is long, I'll adapt it" is how the bug got in.
- **Check the dependencies and assumptions** the broken path needs: config, environment,
  ordering, initialisation.

**Show the ranked list to the user before testing.** They often have domain knowledge
that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've
already ruled out. Cheap checkpoint, big time saver. Don't block on it — proceed with
your ranking if the user is away.

## Phase 4 — Instrument

Each probe must map to a specific prediction from Phase 3. **Change one variable at a
time.**

Tool preference:

1. **Debugger or interactive inspection** if the environment supports it. One
   breakpoint beats ten logs.
2. **Targeted logs** at the boundaries that distinguish hypotheses.
3. Never "log everything and grep".

**Tag every debug log** with a unique prefix, e.g. `[DEBUG-a4f2]`. Cleanup at the end
becomes a single search. Untagged logs survive; tagged logs die.

### Multi-component systems: instrument the boundaries

When the failure crosses components (pipeline → build → sign, API → service →
database), do not guess which one is at fault. For each boundary, log what data enters,
what data exits, and whether config and environment propagated. Run once to gather
evidence showing **where** it breaks, then investigate only that component. One
evidence-gathering run beats four speculative fixes.

### Trace backward to the source

When the error surfaces deep in a call stack, the place it surfaces is a symptom, not a
cause. Trace backward: what value was wrong, who passed it, who called them, up until
you reach the original trigger. Fix at the source. Full technique in
[root-cause-tracing.md](root-cause-tracing.md).

### Performance branch

For performance regressions, logs are usually wrong. Instead: establish a baseline
measurement (timing harness, high-resolution timer, profiler, query plan), then bisect.
Measure first, fix second — an unmeasured optimisation is another guess.

## Phase 5 — Fix + regression test

State the confirmed root cause in one sentence before you touch code. If you can't, you
are still in Phase 3.

Write the regression test **before the fix** — but only if there is a **correct seam**
for it.

A correct seam is one where the test exercises the **real bug pattern** as it occurs at
the call site. If the only available seam is too shallow (single-caller test when the
bug needs multiple callers, unit test that can't replicate the chain that triggered the
bug), a regression test there gives false confidence.

**If no correct seam exists, that itself is the finding.** Note it. The codebase
architecture is preventing the bug from being locked down. Flag it in the post-mortem.

If a correct seam exists:

1. Turn the minimised repro into a failing test at that seam (see the `tdd` skill for
   writing it well).
2. Watch it fail.
3. Apply the fix — **one change, addressing the root cause**. No "while I'm here"
   improvements, no bundled refactoring; they destroy your ability to attribute the
   result.
4. Watch it pass, and watch the rest of the suite stay green.
5. Re-run the Phase 1 feedback loop against the original (un-minimised) scenario.

### Consider defense in depth

A single validation point can be bypassed by another code path, a refactor, or a mock.
When the bug was caused by invalid data flowing through layers, add checks at each layer
it passes through — entry-point validation, business-logic invariants, environment
guards for context-specific dangers. One check fixes the bug; layered checks make it
structurally impossible. Do this after the root-cause fix, not instead of it.

### If the fix doesn't work

STOP. Count how many fixes you have attempted.

- **Fewer than 3:** return to Phase 3 with the new information. Do not stack another fix
  on top of the last one.
- **3 or more:** stop fixing and **question the architecture**. The pattern — each fix
  reveals new coupling somewhere else, each fix needs "a massive refactor", each fix
  creates a new symptom — is not a failed hypothesis. It is a wrong design. Raise it
  with the user before attempting fix #4.

## Phase 6 — Cleanup + post-mortem

Required before declaring done. Run the commands; do not assert success from memory:

- [ ] Original repro no longer reproduces (re-run the Phase 1 loop, paste the output)
- [ ] Regression test passes (or absence of a correct seam is documented)
- [ ] Full test suite passes — nothing else broke
- [ ] All `[DEBUG-...]` instrumentation removed (search for the prefix)
- [ ] Throwaway prototypes deleted, or moved to a clearly-marked debug location
- [ ] The hypothesis that turned out correct is stated in the commit or change
      description — so the next debugger learns

**Then ask: what would have prevented this bug?** If the answer is architectural (no
good test seam, tangled callers, hidden coupling), write the specifics down and hand
them to `/refine`, which is where interfaces get reshaped. Make the recommendation
**after** the fix is in, not before — you know far more now than when you started.

## When investigation finds no root cause

If systematic investigation genuinely shows the issue is environmental, timing-driven,
or external: document what you ruled out, implement appropriate handling (retry,
timeout, clear error message), and add monitoring so the next occurrence carries
evidence.

But be honest — most "no root cause" verdicts are incomplete investigations.

## Red flags — stop and restart the loop

If you catch yourself thinking any of these, return to Phase 1:

- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Let me change a few things and run the tests"
- "Skip the test, I'll verify by hand"
- "It's probably X, let me fix that"
- "I don't fully understand this, but this might work"
- "The reference is long, I'll adapt the pattern"
- Listing fixes before tracing the data flow
- "One more fix attempt" — after two have already failed
- Each fix reveals a new problem somewhere else

The user saying "stop guessing", "is that actually happening?", "will that show us
anything?", or "we're stuck?" means the same thing: you left the loop. Go back to
Phase 1.

## Common rationalizations

| Excuse | Reality |
|--------|---------|
| "This bug is simple, I don't need the process" | Simple bugs have root causes too, and the process is fast on them. |
| "Emergency, no time for process" | Systematic debugging is faster than guess-and-check thrashing. |
| "Try this first, investigate if it fails" | The first fix sets the pattern. Do it right from the start. |
| "I'll write the regression test after confirming the fix" | Untested fixes don't stick, and a test written after never proved it can fail. |
| "Multiple changes at once saves time" | Then you can't tell which one worked, and you've added new bugs. |
| "I can see the problem" | Seeing the symptom is not understanding the cause. |
| "One more fix attempt" (after 2+) | Three failures means the architecture is wrong, not the hypothesis. |

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) and [obra/superpowers](https://github.com/obra/superpowers), MIT.*
