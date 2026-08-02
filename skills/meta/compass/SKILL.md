---
name: compass
description: Work out which pipeline stage or craft skill fits the situation. Use when unsure where to start, when picking up work mid-flight, when asked "what should I do next", or when resuming a project after time away.
disable-model-invocation: true
---

# Compass

A router, not a stage. It reads where the work actually is and points at the one skill that fits.

## How to route

### 1. Look before asking

If `.pipeline/` exists, read it — `REQUIREMENTS.md` first, then whichever of `VISION.md`, `BLUEPRINT.md`, `ROADMAP.md` and `work/` are present. The state files usually answer "where am I" without a single question.

Check git state too: an in-progress merge or rebase, or a branch with uncommitted work, changes the answer.

### 2. Route

**By what is missing:**

| Situation | Skill |
|---|---|
| An existing codebase nobody has surveyed — no `.pipeline/CODEBASE.md` | `/discover` |
| Work is huge and the way there is fogged — decisions outnumber answers | `/wayfinder` |
| Idea is vague, or you are guessing at intent | `/vision` |
| Intent is clear, design is not | `/blueprint` |
| Design is clear, work spans weeks or subsystems | `/roadmap` |
| One epic ready, needs buildable items | `/refine` |
| Work items exist and are unblocked | `/implement` |
| Code is written, not yet proven | `/verify` |

**By what is happening right now:**

| Situation | Skill |
|---|---|
| A plan or decision needs stress-testing through live questioning | `grilling` |
| Something is broken, failing, or slow | `diagnosing-bugs` |
| About to build logic with branches, parsing, money or auth | `tdd` |
| A term keeps meaning two things | `domain-modeling` |
| Code is hard to test, or a seam is in the wrong place | `codebase-design` |
| A design question needs an answer before committing to it | `prototype` |
| An external fact is unverified — an API, a limit, a version's behaviour | `research` |
| Mid-merge or mid-rebase with conflicts | `resolving-merge-conflicts` |
| Writing or fixing a skill in this repo | `writing-skills` |

### 3. Say why, then hand off

Name the skill and say in one sentence what evidence pointed there. Do not narrate the whole map. A craft skill you can apply directly; a pipeline stage is user-invoked — tell the user which command to run and stop.

## Rules

**Do not run the work.** This skill routes and stops. If the answer is `/blueprint`, say so — do not start designing here.

**Skipping stages is normal.** The pipeline is not a gate sequence. A one-file fix goes straight to `/implement` and `/verify`. A single-epic feature skips `/roadmap`. Ceremony that earns nothing is the failure mode this repo exists to avoid — say so when a stage should be skipped.

**Going backwards is normal too.** When `/implement` uncovers a design that does not hold, the honest route is back to `/blueprint`, not forward through `/verify`. Say that plainly rather than pushing on.

**When genuinely ambiguous, ask one question.** One, not a questionnaire — pick the one whose answer splits the options.
