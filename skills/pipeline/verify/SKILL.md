---
name: verify
description: Review the diff on two axes — does it follow the repo's standards, and does it faithfully implement the spec — then prove it works by running things. Use before merging, before claiming work is done, or when the user asks for a review. Produces a verdict backed by command output.
disable-model-invocation: true
---

# Verify

Stage 6 of 6. The gate between "I wrote code" and "this is done".

Two axes, run as parallel subagents, plus one rule that overrides everything else in this repo:

> **Evidence before assertions.** Never claim something works, passes, or is fixed without having run the command and read the output in this session. "Should work" is not a verdict.

## Process

### 1. Fix the review point

Establish what is being reviewed: the diff since a named commit, branch, tag, or merge-base. State it explicitly — a review of an unclear range reviews nothing.

### 2. Run both axes in parallel

Dispatch two independent subagents. They must not see each other's findings; independence is what makes the second axis worth running.

**Axis A — Standards.** Does the code follow this repo's documented conventions, and does it hold up against a general quality baseline?

- the repo's own coding standards and existing patterns — match, do not invent
- error handling at the edges: nothing swallowed, nothing silently defaulted
- validation at trust boundaries; no secrets in source
- duplication that has become real, not speculative
- functions and files that have outgrown comprehension
- names that lie about what the thing does
- tests that assert behaviour rather than implementation

**Axis B — Spec fidelity.** Does the diff implement what was asked?

- every acceptance criterion in the relevant `.pipeline/work/<nn>-*.md`, checked one by one against the code
- decisions and vocabulary in `.pipeline/REQUIREMENTS.md`, respected
- non-goals from `.pipeline/VISION.md`, not quietly implemented anyway
- scope creep: code in the diff that no criterion asked for
- criteria silently dropped — the most common and most expensive finding

### 3. Verify the findings before reporting them

Reviewers produce plausible-sounding findings that are wrong. Before a finding reaches the user, confirm it against the actual code: quote the line, state the concrete failure — the input or state that produces the wrong output. A finding you cannot make concrete gets dropped.

### 4. Run the checks

Actually run them, in this session:

- the test suite
- the type checker, linter, and build
- where behaviour is user-visible, exercise it — start the thing, hit the endpoint, click the button

Read the output. Paste the relevant part into your report. If something fails, that is the finding.

### 5. Report

Findings ordered by severity, each with file, line, the concrete failure, and a suggested fix. Then the verdict:

- **Pass** — no blocking findings, checks run and green, output shown
- **Pass with follow-ups** — nothing blocking, non-blocking items listed
- **Blocked** — blocking findings listed, with what must change

State plainly what you could not verify. An unverified area named is useful; an unverified area implied to be fine is a lie.

## Failure modes

| Temptation | Reality |
|---|---|
| "Tests should pass" | Run them. Show the output. |
| "The change is obviously correct" | Obvious changes break builds daily. |
| "I fixed it" (without re-running) | You changed it. Running it is what makes it fixed. |
| "Mostly working" | Name exactly what does not work. |
| A finding that sounds right | Quote the line and the failing input, or drop it. |

## Exit criteria

- [ ] Both axes ran independently
- [ ] Every reported finding is concrete, with file, line and failure
- [ ] Tests, types, lint and build were run this session, with output shown
- [ ] The verdict is stated, and unverified areas are named

## Next

If blocked: fix, then re-run `/verify`. If passing: mark the work items `done`; when the epic's last item passes, mark the epic `done` in `.pipeline/ROADMAP.md`; then move to the next epic via `/refine`.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) and [obra/superpowers](https://github.com/obra/superpowers), MIT.*
