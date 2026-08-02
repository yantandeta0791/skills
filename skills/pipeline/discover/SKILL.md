---
name: discover
description: Survey an existing codebase before any planning — build its knowledge graph with the understand skill and distill what matters into a codebase map. Use when starting work on a codebase nobody has surveyed, when onboarding to unfamiliar code, or when the pipeline is about to plan against code it has not read. Produces .pipeline/CODEBASE.md.
disable-model-invocation: true
---

# Discover

The prelude to the pipeline, and **optional** — greenfield work has nothing to discover. It exists because every planning stage downstream assumes knowledge of what already exists, and planning blind to the existing code asks questions the code has already answered, redesigns things that already work, and misses the conventions the new work must match.

Discovery runs once per codebase, then stays current incrementally. It is not analysis for its own sake: the output is the smallest map that lets `/wayfinder`, `/vision` and `/blueprint` make grounded decisions.

## When to skip

Skip on greenfield projects — there is no territory to map. Skip when `.pipeline/CODEBASE.md` already exists and is current. Re-run (incrementally) after large changes land, or when the map visibly disagrees with the code.

## Process

### 1. Confirm there is something to discover

If the working directory has no meaningful code — empty repo, scaffold only — say so and route to `/wayfinder` or `/vision`. Do not produce an empty map for the sake of ceremony.

### 2. Build the knowledge graph

Invoke the `understand` skill — vendored in this package — on the project root. It scans the codebase, batches the files, and produces `knowledge-graph.json` in the project's data directory (`.ua/`), powering an interactive dashboard for exploring architecture, components and relationships. On a repeat run it updates incrementally rather than rebuilding.

Let it run to completion; it reports its own phase-by-phase progress. For very large repos, pass its `--exclude` patterns for generated or vendored directories rather than letting them pollute the graph.

### 3. Distill the map

The graph is the reference; the pipeline needs a distillation. Write `.pipeline/CODEBASE.md` from the graph plus your own reading of the load-bearing files:

```markdown
# Codebase: <name>

**Surveyed:** <YYYY-MM-DD> · **Graph:** .ua/knowledge-graph.json

## Stack
<languages, frameworks, storage, deployment — versions where they matter>

## Modules
<the real units of the system, one line each: what it hides, what it exposes>

## Entry points & flows
<where execution starts, and the two or three flows that define the system>

## Conventions
<naming, layout, testing, error handling — the patterns new code must match>

## Concerns
<hotspots, debt, fragile areas — where changes are riskier than they look>
```

Distill means choose: the map holds what a planner needs, not everything the graph knows. Anyone needing more zooms into the graph or the code.

### 4. Feed the pipeline

- Point the user at the dashboard if they want to explore the graph interactively.
- Note anything discovered that contradicts assumptions already recorded in `.pipeline/REQUIREMENTS.md` — surface it, do not silently overwrite.

Downstream: `/wayfinder` consults the map so codebase-answerable questions never become decision tickets; `/blueprint` grounds its reuse survey in it; `/refine` mines it for prior art.

## Exit criteria

- [ ] The knowledge graph exists and reflects the current code
- [ ] `.pipeline/CODEBASE.md` exists and fits in one reading
- [ ] Conventions and concerns are stated — not just structure
- [ ] Contradictions with existing `REQUIREMENTS.md` entries are surfaced

## Next

`/wayfinder` if the way is fogged; `/vision` if intent needs the interview; `/blueprint` when the work is already well-defined.

---
*Codebase graphing by [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything), MIT — vendored as the `understand` skill.*
