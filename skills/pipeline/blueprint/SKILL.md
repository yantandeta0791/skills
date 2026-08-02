---
name: blueprint
description: Turn a confirmed vision into a technical design — boundaries, seams, data model, interfaces, risks. Use after /vision, or when you have clear requirements and need a spec before writing code. Produces .pipeline/BLUEPRINT.md.
disable-model-invocation: true
---

# Blueprint

Stage 2 of 6. Vision says *what and why*. Blueprint says *how*, at the level of structure — not code.

The test of a blueprint: a competent engineer who was not in the interview can read it and build the right thing without asking you questions.

## When to run

After `/vision`, or directly when requirements are already unambiguous. If the change is a single obvious edit in one file, skip this and go to `/implement`.

## Process

### 1. Ground in what exists

Read `.pipeline/VISION.md`, `.pipeline/REQUIREMENTS.md`, and `.pipeline/CODEBASE.md` if `/discover` produced one — it already names the modules, conventions and concerns this design must respect. Then survey the codebase for what already solves part of this — existing modules, helpers, patterns, conventions. Dispatch a subagent for the survey if the codebase is large; you want the conclusion, not the file dumps.

Design that ignores existing code produces a second way to do everything. State explicitly what you are reusing.

### 2. Design the seams first

Apply the `codebase-design` craft skill. The load-bearing decisions are:

- **Module boundaries.** What are the units, and what does each one hide? A module earns its existence by hiding something.
- **Interfaces.** Small surface area, deep implementation. Write the signatures before the internals.
- **Data model.** The shapes that flow through the system, and which states are representable. Prefer making bad states unrepresentable over validating against them.
- **Test seams.** Where does this get tested, and through what interface? Decide now — this is what `/implement` will drive TDD against.

If the domain vocabulary is fuzzy, run the `domain-modeling` craft skill before continuing and record the agreed terms in the `## Domain Vocabulary` section of `REQUIREMENTS.md`.

### 3. Name the risks

For each significant risk: what could go wrong, how likely, and what the design does about it. A design with no stated risks has not been examined.

Include the ones people skip: what happens under concurrency, what happens on partial failure, what happens when the data is ten times larger, what happens at the trust boundary.

### 4. Consider one alternative, seriously

Write down at least one design you rejected and why. If you cannot name a real alternative, you have not explored the space — you have described the first thing you thought of.

### 5. Read it back

Walk the user through the design before writing the file. Disagreement is much cheaper here than in `/verify`.

## Output

Write `.pipeline/BLUEPRINT.md`:

```markdown
# Blueprint: <name>

## Approach
<the design in a paragraph a non-author can follow>

## Structure
<modules, what each hides, how they connect>

## Interfaces
<the signatures that matter, with types>

## Data model
<shapes, states, invariants>

## Test seams
<where tests attach, and through which interface>

## Risks
| Risk | Likelihood | Mitigation |

## Rejected alternatives
<what and why>
```

Significant architectural choices become ADRs in `.pipeline/adr/NNNN-<slug>.md`. Everything else lands in the Decisions table of `.pipeline/REQUIREMENTS.md`.

## Exit criteria

- [ ] Every outcome and constraint in `VISION.md` is addressed or explicitly deferred
- [ ] Test seams are named — `/implement` knows where TDD attaches
- [ ] At least one rejected alternative is recorded
- [ ] Reuse of existing code is stated, not implied
- [ ] The user has confirmed the read-back

## Next

`/roadmap` if the work spans multiple epics. `/refine` if it is a single epic.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
