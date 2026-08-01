---
name: resolving-merge-conflicts
description: Use when a git merge, rebase, or cherry-pick has stopped with conflicts and the working tree needs resolving. Triggers on "fix the merge conflicts", "this rebase is stuck", "resolve the conflicts in X", or on seeing conflict markers in tracked files.
---

# Resolving Merge Conflicts

Conflicts are a question about *intent*, not about text. Two people changed the same lines because they each wanted something. Resolve by recovering both intents, not by picking the side that looks tidier.

## Process

1. **See the current state.** Determine what operation is in progress (merge, rebase, cherry-pick), which commits are involved, and which files conflict. Read the conflicting hunks in full — not just the marker regions.

2. **Find the primary sources for each conflict.** Understand deeply why each change was made and what the original intent was. Read the commit messages on both sides, then the pull requests, then the issues or tickets they reference. A hunk you cannot explain is a hunk you cannot resolve.

3. **Resolve each hunk.** Preserve both intents where possible. Where they are genuinely incompatible, pick the one matching the merge's stated goal and note the trade-off in the commit message. Do **not** invent new behaviour to bridge the two — a conflict resolution is not the place to design. Always resolve; never abort.

4. **Run the project's automated checks.** Discover them first (build config, CI workflow, task runner) rather than guessing. Typically typecheck, then tests, then format. Fix anything the merge broke — conflicts frequently resolve cleanly at the text level and still break a caller two files away.

5. **Finish the operation.** Stage everything and commit. If rebasing, continue until every commit is replayed; expect the same conflict to reappear on later commits and resolve it consistently each time.

## Common mistakes

- **Taking one side wholesale** because the diff is smaller. Small diffs hide dropped intent.
- **Resolving without reading history.** The marker text alone rarely explains why either change exists.
- **Stopping at "it compiles".** A syntactically valid resolution can still silently drop a behaviour both sides relied on.
- **Aborting when it gets hard.** Abandoning loses the analysis already done and the next attempt starts from zero.

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
