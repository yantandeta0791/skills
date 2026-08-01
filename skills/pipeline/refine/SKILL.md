---
name: refine
description: Break one epic into independently shippable work items with acceptance criteria, blocking edges, and named test seams. Use after /blueprint or /roadmap, before building. Produces .pipeline/work/<nn>-<slug>.md files ready for /implement.
disable-model-invocation: true
---

# Refine

Stage 4 of 6. One epic in, a set of buildable work items out.

The unit this produces is a **tracer bullet**: thin, vertical, end-to-end, and shippable on its own. Not a layer, not a task list of "write the model / write the controller / write the view". Each item, once merged, leaves the system working and slightly more capable than before.

## When to run

Immediately before building an epic — not earlier. Refine one epic at a time. Detail produced weeks ahead of use goes stale and gets trusted anyway, which is worse than having none.

## Process

### 1. Load the context

Read `.pipeline/BLUEPRINT.md`, `.pipeline/REQUIREMENTS.md`, and the epic's row in `.pipeline/ROADMAP.md` if one exists. Re-read the relevant code — the blueprint may have been written before facts on the ground changed.

### 2. Cut vertical slices

Split the epic so each item passes through every layer it touches and produces observable behaviour.

The discipline check: for each item, finish the sentence *"when this merges, someone can now ..."*. If you cannot finish it, the item is a layer and needs re-cutting. "Add the users table" fails. "A user can register and appear in the admin list" passes.

Size them so one item is one focused build session. If an item feels like it needs a plan of its own, split it again.

**Prefactor first.** While cutting, look for preparatory refactorings that would make the real change easy — make the change easy, then make the easy change. A prefactoring is its own item, sequenced before the items it eases, and it must leave behaviour unchanged.

**The wide-refactor exception.** Vertical slicing fails for one case: a mechanical change whose blast radius fans across the whole codebase — renaming a column, retyping a shared symbol — where a single edit breaks thousands of call sites and no vertical slice can land green. Do not force it into a tracer bullet; sequence it as **expand–contract**:

1. *Expand*: add the new form beside the old, so nothing breaks — one item.
2. *Migrate*: move call sites over in batches sized by blast radius (per package, per directory) — one item per batch, each blocked by the expand, each landing green because the old form still exists.
3. *Contract*: delete the old form once no caller remains — one item, blocked by every migrate batch.

If even the batches cannot stay green alone, keep the sequence but let them share an integration branch, all blocking a final integrate-and-verify item — green is promised only there.

### 3. Write acceptance criteria that can fail

Each item needs criteria stated as observable behaviour with concrete values, not intentions. "Handles invalid input" is not a criterion. "Submitting an empty email returns 422 with `{error: 'email required'}`" is — it can be executed and it can fail.

These criteria become the tests in `/implement` and the spec axis of `/verify`. Vague criteria there start as vague criteria here.

### 4. Name the test seam per item

Pull the seam from the blueprint: which interface does this item get tested through? Naming it now is what stops `/implement` from writing tests against internals that will be refactored next week.

### 5. Declare blocking edges

State which items block which. Be strict — an item is blocked only if it genuinely cannot start. Everything unblocked can build in parallel, and `/implement` uses exactly this to decide what runs concurrently.

### 6. Read the breakdown back

Before writing anything, present the breakdown as a numbered list — for each item its title, what it delivers, and what blocks it — and ask:

- Does the granularity feel right — too coarse, too fine?
- Does each blocking edge genuinely gate, or just feel natural?
- Should any items be merged or split?

Iterate until the user approves. An unapproved breakdown that gets built is scope decided by nobody.

## Output

One file per work item at `.pipeline/work/<nn>-<slug>.md`:

```markdown
# <nn> — <title>

**Epic:** <epic name, or "standalone">
**Blocked by:** <item numbers, or "—">
**Status:** todo

## When this merges, someone can
<the observable capability, in one sentence>

## Acceptance criteria
- [ ] <observable behaviour with concrete values>
- [ ] <observable behaviour with concrete values>

## Test seam
<the interface tests attach to>

## Notes
<constraints, gotchas, prior art to reuse>
```

Status is `todo`, `building`, `review`, or `done`.

Avoid specific file paths and code snippets in items — they go stale fast. One exception: when a `prototype` produced a snippet that encodes a decision more precisely than prose can (a state machine, a reducer, a schema), inline the decision-rich part and note where it came from.

If the project uses a real issue tracker, publish these there instead and record the issue links here — but keep the acceptance criteria and test seam intact, since those are what the later stages consume.

## Exit criteria

- [ ] Every item completes "when this merges, someone can ..."
- [ ] Every acceptance criterion is executable and can fail
- [ ] Every item names its test seam
- [ ] Blocking edges are declared and each has been challenged once
- [ ] No item is large enough to need its own plan
- [ ] Wide refactors are sequenced expand–contract, not forced into slices
- [ ] The user approved the breakdown before it was written

## Next

`/implement` — build the unblocked items.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
