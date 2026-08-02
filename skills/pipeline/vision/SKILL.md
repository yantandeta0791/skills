---
name: vision
description: Interrogate an idea until intent, constraints and success criteria are unambiguous. Use at the very start of any piece of work, when the user says "I want to build X", or when a request is too vague to spec. Produces .pipeline/VISION.md and seeds .pipeline/REQUIREMENTS.md.
disable-model-invocation: true
---

# Vision

Stage 1 of 6. **Nothing gets designed here.** The single job is to replace assumptions with stated intent.

Most bad software is built correctly from a misunderstood premise. This stage exists to make the premise explicit and to make disagreement surface *now*, while it costs a conversation instead of a rewrite.

## When to run

At the start of any non-trivial work. If you can already write the spec without guessing at anything, skip straight to `/blueprint`. If the opposite is true — the destination itself is fogged, and the open decisions are too many for one conversation — run `/wayfinder` first and come back here once the way is clear. On an unsurveyed existing codebase, `/discover` comes before either.

The interview below is the `grilling` craft skill applied to a whole piece of work; its rules — one question at a time, recommend an answer, look up facts but ask for decisions — apply throughout.

## Process

### 1. Read what already exists

Before asking anything, read `.pipeline/REQUIREMENTS.md` if it exists, plus any README or architecture docs. Never ask the user something the repo already answers — it destroys trust in the interview.

### 2. Interrogate, one question at a time

Ask a single question, wait for the answer, let the answer determine the next question. Batched questionnaires get shallow answers.

Walk these branches. Not all apply to every piece of work; follow the ones that do:

- **The actual problem.** Who hurts today, and how? What do they do instead right now?
- **Success.** What is observably true when this is done that is not true today? What number moves?
- **Non-goals.** What is explicitly out of scope? This is the highest-value question in the interview and the one people skip.
- **Constraints.** Deadline, budget, runtime, team skills, existing systems that cannot move.
- **The users.** Who touches this, with what skill level, on what device, how often?
- **Failure.** What happens when it breaks? Who notices? What is the acceptable failure mode?
- **Prior art.** Has this been tried here before? What happened? What exists in the codebase already that overlaps?

### 3. Push back

An interview that accepts every answer is a form. When an answer is vague, restate it as something falsifiable and ask if that is right. When two answers conflict, name the conflict out loud and make the user choose. When a stated requirement looks like a solution in disguise ("we need a Redis cache"), ask what it is meant to achieve and record *that* instead.

If the user proposes something that will not work, say so plainly and say why. Deference here is a disservice.

### 4. Stop at shared understanding

Stop when you can restate the work in a way the user reads and says "yes, that's it" — not when you run out of questions. Read your understanding back before writing anything.

## Output

Write `.pipeline/VISION.md`:

```markdown
# Vision: <name>

## Problem
<who hurts, how, what they do today>

## Outcome
<observably true when done>

## Non-goals
<explicitly excluded, with the reason>

## Constraints
<hard limits: deadline, runtime, team, systems>

## Users
<who touches this, skill level, device, frequency>

## Failure modes
<what happens when it breaks, who notices, what failure is acceptable>

## Prior art
<what was tried before and what exists in the codebase that overlaps>

## Open questions
<what remains unresolved, and who can resolve it>
```

Then create `.pipeline/REQUIREMENTS.md` — the continuous state file every later stage reads and writes — if it does not already exist; a `/wayfinder` run may have created it first. Append to an existing file, never overwrite it:

```markdown
# Requirements

## Decisions
| # | Decision | Rationale | Stage | Date |

## Domain Vocabulary
<one entry per agreed term — format owned by the domain-modeling skill>

## Open questions
| # | Question | Blocks | Owner |
```

Record every decision made during the interview in the Decisions table with its rationale. Rationale is the part that survives; the decision alone is useless in three months. Dates are ISO format (`2026-08-01`).

## Exit criteria

- [ ] The user has confirmed a read-back of the problem and outcome
- [ ] Non-goals are written down and are not empty
- [ ] Every open question has an owner, or is explicitly accepted as a risk
- [ ] `VISION.md` and `REQUIREMENTS.md` exist

## Next

`/blueprint` — turn this into a technical design.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) and [obra/superpowers](https://github.com/obra/superpowers), MIT.*
