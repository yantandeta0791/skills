# skills

A curated, opinionated set of skills for AI coding agents — a six-stage delivery pipeline plus the craft skills that support it.

Distilled from three sources that each solved a different part of the problem: [mattpocock/skills](https://github.com/mattpocock/skills) (the SDLC pipeline and engineering craft), [obra/superpowers](https://github.com/obra/superpowers) (process discipline and evidence gates) and [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) (fresh-context subagents and persistent state). Vetted, merged, renamed, and trimmed so that exactly one skill owns each job.

Runtime-neutral: no skill here names a specific tool. Works with Claude Code, Codex, Gemini CLI, Copilot, Cursor, OpenCode, and anything else that reads `SKILL.md` folders or `AGENTS.md`.

## The pipeline

```
/vision → /blueprint → /roadmap → /refine → /implement → /verify
```

- **`/vision`** — interrogate the idea until intent, constraints and non-goals are explicit. Nothing gets designed here.
- **`/blueprint`** — turn intent into a technical design: boundaries, seams, data model, risks, one rejected alternative.
- **`/roadmap`** — *optional.* Order epics by risk with real dependency edges. Skip for single-epic work.
- **`/refine`** — cut one epic into vertical, independently shippable items with acceptance criteria that can fail.
- **`/implement`** — build each item in a fresh-context subagent, test-first at the seam agreed in `/blueprint`.
- **`/verify`** — review on two independent axes, standards and spec fidelity, then prove it by running things.

Stages are skippable and the flow runs backwards when it needs to. A one-file fix goes straight to `/implement` and `/verify`. `/compass` routes when you are not sure where you are.

## State

Everything the pipeline learns lands in one place in the project you are working on:

```
.pipeline/
  REQUIREMENTS.md   decisions (with rationale), vocabulary, open questions
  VISION.md         BLUEPRINT.md   ROADMAP.md
  work/             one file per work item
  adr/              hard-to-reverse architectural trade-offs
```

A fresh agent reads `REQUIREMENTS.md` and knows what was already settled. That is the whole trick.

## Craft skills

Model-invoked — they fire whenever they apply, inside any stage or on their own.

`diagnosing-bugs` · `tdd` · `domain-modeling` · `codebase-design` · `prototype` · `research` · `resolving-merge-conflicts`

## Install

```bash
git clone https://github.com/yantandeta0791/skills.git
cd skills
node install.mjs
```

Detects installed runtimes and symlinks every skill into each one, so `git pull` updates them all at once.

```bash
node install.mjs --list              # known runtimes and their paths
node install.mjs --target claude     # just one
node install.mjs --dir ~/some/path   # anywhere
node install.mjs --copy              # copy instead of symlink
node install.mjs --dry-run           # show what would happen
```

Runtime skill directories move as tools evolve — the `TARGETS` map at the top of `install.mjs` is meant to be edited.

For agents that read a repo-level instructions file instead of skill folders, point them at [AGENTS.md](./AGENTS.md).

## Design rules

Every skill here follows these, and [`writing-skills`](./skills/meta/writing-skills/SKILL.md) enforces them for new ones.

1. **Evidence before assertions.** Nothing is "working" until it has been run and the output read.
2. **Tool-neutral prose.** Never name a runtime's tool. "Dispatch a subagent", not a specific tool name.
3. **One owner per job.** No two skills compete for the same trigger — that is what makes a curated set better than three installed frameworks.
4. **No coercive framing.** Skills describe when they apply; they do not threaten. Escalating insistence causes defensive skill-spam.
5. **Skip what earns nothing.** Ceremony is the failure mode.

## Credits and licence

MIT. Adapted with thanks from [mattpocock/skills](https://github.com/mattpocock/skills), [obra/superpowers](https://github.com/obra/superpowers) and [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — all MIT.
