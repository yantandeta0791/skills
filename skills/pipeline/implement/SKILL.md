---
name: implement
description: Build the refined work items — each in a fresh-context subagent, test-first at the agreed seams, committed atomically. Use when work items exist and are ready to build, or when the user says "build it" / "implement this". Updates .pipeline/work/ and .pipeline/REQUIREMENTS.md.
disable-model-invocation: true
---

# Implement

Stage 5 of 6. Work items in, merged code out.

Two disciplines make this stage work, and both are non-negotiable:

**Fresh context per item.** Each work item is built by a subagent that starts clean, holding only that item, the blueprint extract it needs, and the relevant code. Long-running sessions degrade — context fills with dead ends, abandoned attempts and stale file contents, and quality quietly drops. Keep this session as the coordinator: it holds the plan, not the work.

**Test-first at the agreed seams.** `/refine` named a test seam per item. That is where the `tdd` craft skill applies. Not everything needs TDD — a config change does not — but anything with a branch, a loop, a parser, or a money or security path does.

## Process

### 1. Pick the buildable set

Read `.pipeline/work/`. Select items whose blocking edges are all satisfied. These can build concurrently.

Confirm the set with the user before dispatching if more than two items will run at once — concurrent builds touching the same files need worktree isolation, and that is a decision worth stating out loud.

### 2. Dispatch one subagent per item

Give each subagent everything it needs and nothing more:

- the work item file, verbatim
- the relevant extract of `.pipeline/BLUEPRINT.md` — interfaces, data model, its test seam
- the Vocabulary and Decisions it must respect from `.pipeline/REQUIREMENTS.md`
- the repo's coding standards, and the instruction to match surrounding code
- the explicit instruction: **write the failing test first at the named seam, then make it pass**
- the instruction to report back deviations, not to silently absorb them

If items touch the same files, isolate each build in its own worktree or branch and integrate afterwards. If the runtime has no subagents, build items sequentially and clear context between them — the discipline matters more than the mechanism.

### 3. Handle deviations, do not bury them

A subagent will hit things the blueprint got wrong. That is normal and it is information.

When a deviation is small and local, let it proceed and record it. When it invalidates a design decision, stop the build and take it back to `/blueprint` — do not let a subagent quietly redesign the system from inside a work item.

Every deviation lands in the Decisions table of `.pipeline/REQUIREMENTS.md` with the reason. This table is what makes the next session cheap.

### 4. Commit atomically

One work item, one commit (or one tight series). The commit message says what changed and why, referencing the work item. A commit that spans three items cannot be reverted when one of them turns out wrong.

Do not commit until the item's own tests pass. Do not push or open a pull request unless the user asks.

### 5. Close each item out

Mark the item `review` in its file. Update the epic's status in `.pipeline/ROADMAP.md` if one exists. Report to the user what was built, what deviated, and what remains.

## The failure mode to avoid

The characteristic failure of this stage is a subagent that reports success without evidence — "implemented and working" with nothing run. Require the test output. `/verify` will catch it, but catching it here is cheaper.

## Exit criteria

- [ ] Every dispatched item has passing tests at its named seam
- [ ] Every deviation is recorded in `REQUIREMENTS.md` with its reason
- [ ] Commits are atomic and reference their work item
- [ ] No item was silently redesigned inside a build

## Next

`/verify` — review the diff against standards and against the spec.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), [obra/superpowers](https://github.com/obra/superpowers) and [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core), MIT.*
