---
name: refine
description: Break one epic into independently shippable work items with acceptance criteria, blocking edges, and named test seams. Use after /blueprint or /roadmap, before building. Produces .pipeline/work/<slug>.md files ready for /implement.
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

### 3. Write acceptance criteria that can fail

Each item needs criteria stated as observable behaviour with concrete values, not intentions. "Handles invalid input" is not a criterion. "Submitting an empty email returns 422 with `{error: 'email required'}`" is — it can be executed and it can fail.

These criteria become the tests in `/implement` and the spec axis of `/verify`. Vague criteria there start as vague criteria here.

### 4. Name the test seam per item

Pull the seam from the blueprint: which interface does this item get tested through? Naming it now is what stops `/implement` from writing tests against internals that will be refactored next week.

### 5. Declare blocking edges

State which items block which. Be strict — an item is blocked only if it genuinely cannot start. Everything unblocked can build in parallel, and `/implement` uses exactly this to decide what runs concurrently.

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
<constraints, gotchas, files likely touched, prior art to reuse>
```

Status is `todo`, `building`, `review`, or `done`.

If the project uses a real issue tracker, publish these there instead and record the issue links here — but keep the acceptance criteria and test seam intact, since those are what the later stages consume.

## Exit criteria

- [ ] Every item completes "when this merges, someone can ..."
- [ ] Every acceptance criterion is executable and can fail
- [ ] Every item names its test seam
- [ ] Blocking edges are declared and each has been challenged once
- [ ] No item is large enough to need its own plan

## Next

`/implement` — build the unblocked items.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
