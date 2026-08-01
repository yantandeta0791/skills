---
name: writing-skills
description: Use when authoring, editing, or reviewing a skill in this repo. Triggers on "write a skill for X", "why isn't this skill firing", "port this skill", or any change to a file under `skills/`.
---

# Writing Skills

A skill is a **reference guide for a technique that a model can find and apply later**. It is not a narrative about how something got solved once, and not a place to restate what the model already does well.

The hard part is not writing the body. It is making the skill *fire at the right moment* and *not fire otherwise*. Optimise for that first.

## This repo's conventions

Every skill in this repo follows these. New skills that break them get rejected.

**Layout.** One folder per skill, containing `SKILL.md`. Supporting files live beside it in the same folder.

```
skills/
  pipeline/<name>/SKILL.md    # the staged workflow: /vision, /blueprint,
                              # /roadmap, /refine, /implement, /verify
  craft/<name>/SKILL.md       # techniques applied inside any stage
  meta/<name>/SKILL.md        # skills about the skills
```

**Frontmatter.** YAML with exactly two required fields:

```yaml
---
name: resolving-merge-conflicts   # must match the folder name
description: Use when ...          # one to three sentences, see below
---
```

**Tool-neutral prose.** This repo targets Claude Code, Codex, Gemini CLI, Copilot, and Cursor. Never name a specific runtime's tools. Write the capability, not the API:

| Don't write | Write |
|---|---|
| "use the Task tool" | "dispatch a subagent" |
| "Grep for the handler" | "search the codebase for the handler" |
| "run it with the Bash tool" | "run the command" |
| "add it to `~/.claude/skills/`" | "install it wherever the runtime reads skills from" |

Project tooling (`pnpm`, `pytest`, `cargo`) is not runtime-specific — naming it is fine. The rule is about the *agent's* tools.

**Pipeline state.** The pipeline stages share one continuous state file, `.pipeline/REQUIREMENTS.md`. Anything a later stage needs to read goes there. A stage may also emit its own named artifact, but that artifact is output, not state — don't introduce a second running file that stages have to keep in sync.

**Attribution.** A skill adapted from an external source ends with a horizontal rule and one italic line naming the source and its licence:

```markdown
---
*Adapted from [owner/repo](https://github.com/owner/repo), MIT.*
```

Original skills need no attribution line.

## Writing the description

The description is the only part a model reads before deciding whether to open the skill. Everything else is downstream of it.

**Describe when to use it, never what it does.**

This is the single most-violated rule and the failure is specific: when a description summarises the workflow, models follow *the summary* instead of reading the body. A description saying "reviews code between tasks" produced one review from a skill whose body specified two. Changing the description to pure triggering conditions produced both.

A description that summarises the process creates a shortcut, and the body becomes documentation nobody reads.

```yaml
# Bad — summarises the workflow, so the body gets skipped
description: Use when executing plans - dispatches a subagent per task with review between tasks

# Bad — first person, vague, no trigger
description: I can help you when your async tests are flaky

# Bad — names a technology the skill isn't actually specific to
description: Use when tests use setTimeout and are flaky

# Good — triggering conditions only
description: Use when executing an implementation plan whose tasks are independent of each other.

# Good — condition plus the phrases a user would actually say
description: Use when a git merge or rebase has stopped with conflicts. Triggers on "fix the merge conflicts" or on seeing conflict markers in tracked files.
```

**Include the phrasing that should trigger it.** Real user wording ("spike it", "this rebase is stuck") does more work than an abstract category. One to three sentences.

**Describe the problem, not one language's symptom.** "Race conditions and timing-dependent tests" beats "tests using `sleep`" — unless the skill genuinely is technology-specific, in which case say so explicitly in the trigger.

**Third person, present tense.** Descriptions are injected into a system prompt alongside dozens of others.

## User-invoked vs model-invoked

Decide this before writing, because it changes the body.

**User-invoked** — the person types the name (`/blueprint`). The pipeline skills are all user-invoked, and are marked so in frontmatter with `disable-model-invocation: true`. The body can assume the user has just asked for exactly this and is present to answer questions. It should say what the stage produces and where it writes.

**Model-invoked** — the model notices the situation and reaches for the skill unprompted. Most `craft/` skills are this. The body must be self-contained, because the model arrives mid-task with its own context, and the description must carry heavy trigger detail, because nothing else will surface it.

A skill can be both, but then the description is written for the model-invoked path — that's the one that needs help firing.

## Keep skills narrow and composable

One skill, one question it answers. A skill that covers "testing" fires on everything and helps with nothing.

- **Split when the branches diverge.** If the body has a large "if A do this whole thing, if B do this other whole thing", the two halves are separate concerns. Either split into two skills, or keep one entry point that routes to supporting files — as `prototype` does with its logic and UI branches.
- **Cross-reference by name, don't inline.** Write `See the **prototype** skill` rather than pasting its content or using a syntax that force-loads the file. Force-loading burns context on something that may never be needed.
- **Don't restate general good practice.** If the model would do it anyway, cutting it makes the real advice easier to find.
- **Skip anything a linter could enforce.** Mechanical constraints belong in tooling. Skills are for judgment calls.

## Body structure

Nothing here is mandatory — use the sections that earn their place.

- **Opening** — what this is and the core principle, in one or two sentences.
- **When to use / when not to** — symptoms, not categories. The "not" half prevents over-firing.
- **The process or pattern** — numbered steps for a procedure, before/after for a pattern.
- **Quick reference** — a table, when there are operations worth scanning for.
- **Common mistakes** — what goes wrong, and the fix.

Prefer prose and tables. Reach for a flowchart only when a decision point is genuinely non-obvious and the model might stop too early — never for reference material, code, or linear steps.

## Length and supporting files

Skills load into a context window that has other work to do. Aim under 500 words for a typical skill; frequently-loaded ones should be tighter still.

Keep inline: principles, decision criteria, code patterns under ~50 lines.

Split into a sibling file when: the material is heavy reference (100+ lines of API surface), a reusable script or template, or a branch that only one kind of run needs. Link it by relative path so it loads on demand.

**One excellent example beats five mediocre ones.** Pick the language that fits the domain, make it complete and runnable, and comment *why* rather than *what*. Don't reimplement it in every language, and don't write fill-in-the-blank templates — a model adapting one real example is more reliable than one filling in blanks.

## Test that it actually fires

A skill that never triggers is worth nothing regardless of how good the body is. Testing is cheap; do it before committing.

1. **Establish the baseline.** Dispatch a subagent on a realistic task *without* the skill available. Note what it does and what it gets wrong. If it already does the right thing, you don't need the skill — stop here.

2. **Test the trigger separately from the content.** Give a fresh subagent the descriptions only — yours plus the neighbouring skills' — and a task that should hit yours. Does it pick the right one? If it picks a neighbour, your description overlaps; if it picks nothing, your triggers are too abstract. Fix the description, not the body.

3. **Test the content.** Give a fresh subagent the full skill and the same task. Did the output change in the way you intended? Note where it deviated — that's a gap in the body, not a discipline problem.

4. **Test that it *doesn't* fire.** Run an adjacent task the skill should stay out of. Over-firing is as expensive as not firing.

5. **Repeat, and read the outputs yourself.** One sample is noise; run each variant a handful of times. If five runs produce five different interpretations, the wording isn't binding yet — tighten the structure before adding more words.

Fresh context every run. A subagent that has watched you write the skill can't tell you whether the skill works.

## Common mistakes

- **Description summarises the workflow.** The body gets skipped. Triggering conditions only.
- **Naming a specific runtime's tools.** Breaks the skill on four of the five targets.
- **Narrative instead of technique.** "In the October session we found that..." is a log entry, not a skill.
- **Writing to enforce rather than to inform.** Escalating insistence — "you MUST", "even at 1% chance" — makes models reach for the skill defensively and drowns out skills that genuinely apply. State the guidance once, clearly, and let the description do the triggering.
- **Batching several skills before testing any.** Each one ships untested. Finish and verify one at a time.
- **Generic naming.** `debugging-techniques` tells a model nothing. Name by what you do: `resolving-merge-conflicts`, `prototype`. Gerunds read well for processes; hyphenated lowercase always.

---
*Adapted from [obra/superpowers](https://github.com/obra/superpowers), MIT.*
