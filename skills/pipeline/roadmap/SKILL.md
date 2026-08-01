---
name: roadmap
description: Break work too large for one session into ordered epics with explicit dependency edges. Use when a blueprint spans weeks, multiple subsystems, or more than one person. Skip entirely for single-epic work. Produces .pipeline/ROADMAP.md.
disable-model-invocation: true
---

# Roadmap

Stage 3 of 6, and **optional**. Its only job is sequencing work that is too big to hold in one head or one session.

A roadmap here is a flat list of epics with dependency edges. It is deliberately not a directory structure, not a milestone system, and not a set of quarters. If it grows heavier than one file, it has stopped helping.

## When to skip

Skip if the work is one epic — a single coherent capability that one person can carry from start to shipped. Go straight to `/refine`. Most work is one epic. Running this stage on small work is pure ceremony.

Run it when: multiple subsystems change, the work spans more than roughly a week, several people work in parallel, or the ordering is genuinely unobvious and getting it wrong is expensive.

## Process

### 1. Find the epics

Read `.pipeline/BLUEPRINT.md` and `.pipeline/REQUIREMENTS.md`. An epic is a slice of capability that delivers something observable on its own. Not a layer.

The most common failure is slicing horizontally: "database", "API", "UI". Those are layers — none of them delivers anything, and integration risk stays hidden until the end. Slice vertically: each epic goes thin but all the way through the stack, so that finishing it proves something works.

Aim for a handful. If you produce fifteen, they are stories, not epics — merge them.

### 2. Draw the dependency edges

For each epic, state what genuinely blocks it. Genuinely: "cannot start until X exists", not "feels natural after X".

False dependencies are expensive — they serialise work that could run in parallel. Challenge each edge once: what would actually break if these ran at the same time?

### 3. Order by risk, not by comfort

Sequence the riskiest and most uncertain epic first, not the easiest. The purpose of ordering is to learn what kills the plan while there is still time to change it. An epic that validates an unproven assumption belongs early even when it is unglamorous.

Where an epic exists mainly to resolve an unknown, say so — its output is a decision, and its done-when is "the question is answered".

### 4. Define done for each

Every epic needs a done-when that someone else could check without asking you.

## Output

Write `.pipeline/ROADMAP.md`:

```markdown
# Roadmap: <name>

| # | Epic | Goal | Blocked by | Done when | Status |
|---|------|------|-----------|-----------|--------|
| 1 | <name> | <observable capability> | — | <checkable condition> | todo |
| 2 | <name> | <observable capability> | 1 | <checkable condition> | todo |

## Ordering rationale
<why this sequence — especially what risk the early epics retire>
```

Status is one of `todo`, `refining`, `building`, `done`. This file is the progress ledger: update the status as epics move, and record ordering changes in the Decisions table of `.pipeline/REQUIREMENTS.md` with the reason.

## Exit criteria

- [ ] Every epic delivers something observable — none is a pure layer
- [ ] Every dependency edge has been challenged once
- [ ] The riskiest unknown is retired early in the order
- [ ] Every epic has a done-when someone else can check

## Next

`/refine` — take epic 1 and break it into work items. Refine one epic at a time, just before building it. Refining the whole roadmap up front produces detail that goes stale before it is used.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
