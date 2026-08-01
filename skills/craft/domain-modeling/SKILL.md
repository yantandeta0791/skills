---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when the user wants to pin down domain terminology or a ubiquitous language, asks "what should we call this?", says a term is ambiguous or overloaded, wants to record an architectural decision as an ADR, or when a pipeline stage needs to maintain the domain model.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline — challenging terms, inventing edge-case scenarios, and writing the vocabulary and decisions down the moment they crystallise.

Merely *reading* `.pipeline/REQUIREMENTS.md` for vocabulary is not this skill — that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.

## Where things live

```
/
├── .pipeline/
│   ├── REQUIREMENTS.md              ← requirements, decisions, domain vocabulary
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

`.pipeline/REQUIREMENTS.md` is the single continuous state file. Every pipeline stage reads and writes it. The domain model lives there in a `## Domain Vocabulary` section alongside the decisions and open questions.

ADRs are a separate concept and live in their own files under `.pipeline/adr/`. A decision recorded in `REQUIREMENTS.md` is a running note; an ADR is a durable, numbered record of a hard-to-reverse choice.

Create files lazily — only when you have something to write. If `.pipeline/REQUIREMENTS.md` has no `## Domain Vocabulary` section, add one when the first term is resolved. If `.pipeline/adr/` does not exist, create it when the first ADR is needed.

## During the session

### Challenge against the vocabulary

When the user uses a term that conflicts with the existing language in `.pipeline/REQUIREMENTS.md`, call it out immediately. "Your vocabulary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account' — do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, search the codebase and check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible — which is right?"

### Update the vocabulary inline

When a term is resolved, update the `## Domain Vocabulary` section of `.pipeline/REQUIREMENTS.md` right there. Don't batch these up — capture them as they happen. Use the format in [VOCABULARY-FORMAT.md](./VOCABULARY-FORMAT.md).

The `## Domain Vocabulary` section must be totally devoid of implementation details. Requirements and decisions belong in their own sections of `REQUIREMENTS.md`; the vocabulary section is a glossary and nothing else.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).

## Relationship to the pipeline

Any stage can invoke this skill when the model shifts — most often /vision (naming the problem space), /blueprint (naming the parts), and /refine (correcting terms that drifted during design). When designing the modules those terms name, pair this with the codebase-design skill so architecture language and domain language stay consistent.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
