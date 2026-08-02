# Agent skills

A curated set of skills for AI coding agents: a staged delivery pipeline — six core stages plus two optional preludes, codebase discovery and fog-clearing wayfinding — and the craft skills that support it. Runtime-neutral — Claude Code, Codex, Gemini CLI, Copilot, Cursor, OpenCode and anything else that reads `SKILL.md` folders or this file.

## The pipeline

```
(/discover) → (/wayfinder) → /vision → /blueprint → /roadmap → /refine → /implement → /verify
```

| Stage | Does | Produces |
|---|---|---|
| **`/discover`** | *Optional prelude.* Surveys an existing codebase — builds its knowledge graph via the `understand` skill, distills a codebase map. | `.pipeline/CODEBASE.md`, `.ua/knowledge-graph.json` |
| **`/wayfinder`** | *Optional stage 0.* Maps fogged work as decision tickets — grilling, research, prototype, task — resolved one per session until the way is clear. | `.pipeline/MAP.md`, `.pipeline/map/*.md` |
| **`/vision`** | Interrogates the idea until intent, constraints and non-goals are explicit. No design. | `.pipeline/VISION.md` |
| **`/blueprint`** | Turns intent into a technical design: boundaries, seams, data model, risks. | `.pipeline/BLUEPRINT.md` |
| **`/roadmap`** | *Optional.* Orders epics with dependency edges. Skip for single-epic work. | `.pipeline/ROADMAP.md` |
| **`/refine`** | Cuts one epic into independently shippable items with executable acceptance criteria. | `.pipeline/work/*.md` |
| **`/implement`** | Builds each item in a fresh-context subagent, test-first at the agreed seam. | code, atomic commits |
| **`/verify`** | Reviews on two axes — standards and spec fidelity — then proves it by running things. | a verdict, with evidence |

**Stages are skippable.** A one-file fix goes straight to `/implement` and `/verify`. Ceremony that earns nothing is the failure mode this repo exists to avoid.

**Going backwards is normal.** When `/implement` finds the design does not hold, return to `/blueprint`.

Unsure where you are? `/compass` routes.

## State

One continuous file, `.pipeline/REQUIREMENTS.md`, written and read by every stage:

- **Decisions** — what was decided, and *why*. The rationale is the part that survives.
- **Domain vocabulary** — agreed domain terms, and what they explicitly do not mean.
- **Open questions** — unresolved, with owners.

Hard-to-reverse architectural trade-offs get numbered ADRs in `.pipeline/adr/`.

This is what makes the next session cheap: a fresh agent reads `REQUIREMENTS.md` and knows what was already settled.

## Craft skills

Model-invoked — reach for them whenever they apply, inside any stage or on their own.

| Skill | For |
|---|---|
| `diagnosing-bugs` | Anything broken, failing or slow. Reproduce → minimise → hypothesise → instrument → fix → regression-test. |
| `tdd` | Red-green-refactor, one vertical slice at a time. |
| `domain-modeling` | Sharpening terminology until words mean one thing. |
| `codebase-design` | Deep modules: small interfaces, clean seams, testable through the interface. |
| `grilling` | Stress-testing a plan or decision — one question at a time, recommendation attached. |
| `prototype` | Answering a design question with throwaway runnable code. |
| `research` | Settling an external question against primary sources, with citations. |
| `resolving-merge-conflicts` | In-progress merges and rebases, resolved by intent. |
| `understand` | Building an interactive knowledge graph of a codebase — the engine behind `/discover`. |

## Meta

| Skill | For |
|---|---|
| `compass` | Routing to the right stage or craft skill. |
| `writing-skills` | Authoring and fixing skills in this repo. |

## Operating rules

These apply to every skill here.

1. **Evidence before assertions.** Never claim something works, passes or is fixed without having run it and read the output this session. "Should work" is not a verdict.
2. **Understand before changing.** Read the actual flow end to end before editing. The smallest change in the wrong place is a second bug.
3. **Record the why.** Decisions without rationale are useless in three months. They go in `REQUIREMENTS.md`.
4. **Fresh context for heavy work.** Dispatch subagents for building and reviewing; keep the main session as coordinator.
5. **Match the surrounding code.** Its conventions beat your preferences.
6. **Skip what earns nothing.** Stages, tests for one-liners, abstractions with one implementation.

## Layout

```
skills/
  pipeline/   discover, wayfinder, vision, blueprint, roadmap, refine,
              implement, verify
  craft/      diagnosing-bugs, tdd, domain-modeling, codebase-design,
              grilling, prototype, research, resolving-merge-conflicts,
              understand
  meta/       compass, writing-skills
```

Install with `node install.mjs` — see [README.md](./README.md).

## Credits

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), [obra/superpowers](https://github.com/obra/superpowers), [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) and [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) (vendored as `understand`). All MIT.
