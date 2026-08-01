---
name: research
description: Investigate a question against primary sources and capture the findings as a cited Markdown note. Use when the user asks to research a topic, wants API or library facts established, says "find out how X works", or when a design decision is blocked on an external fact — outside this codebase, answerable from sources — that nobody has actually checked.
---

# Research

Answer a question from sources that own the truth, and leave behind a note somebody can check.

The failure this skill exists to prevent is confident recall. A model's memory of a library's API is a snapshot of whatever it read, averaged across versions, and it is wrong often enough to be dangerous. Research replaces recall with citation.

## When to use

- A design decision depends on how something actually behaves, and nobody has checked
- The answer is version-sensitive: an API, a config format, a limit, a pricing tier
- Someone said "I think it works like..." and the cost of being wrong is real
- `/vision` or `/blueprint` produced an open question that needs an answer before proceeding

Skip it when the question is about this codebase — read the code instead. Research is for what lives outside the repo.

## Process

### 1. Sharpen the question first

A vague question produces a vague note. Turn "look into caching options" into something falsifiable: "does this library's cache invalidate on write, and what happens on a cache miss under concurrency?"

If the question has several parts, split it — each gets its own answer and its own citation.

### 2. Delegate it

Dispatch a subagent to do the reading, in the background if the runtime supports it, so the main session keeps moving. Research is heavy on context and light on conclusions; that is exactly the shape that belongs in a fresh context.

Give the subagent the sharpened question, the version or environment that matters, and the instruction to cite every claim.

### 3. Go to sources that own the truth

Ranked, and worth being strict about:

1. **The source code** — of the actual version in use. Settles any dispute.
2. **Official documentation, specs, RFCs, changelogs** — first-party, version-matched.
3. **Issue trackers and commit history** — for behaviour that is undocumented or recently changed.
4. **Everything else** — blog posts, forum answers, tutorials. Useful for finding the primary source. Never the citation itself.

Follow every claim back to whoever owns it. A blog post saying the API returns `null` is not evidence; the function that returns `null` is.

Check the version. Most wrong answers about libraries are right answers about a different release.

### 4. Report what you could not establish

The genuinely useful part of a research note is often the gap. When sources conflict, say so and show both. When the documentation is silent, say it is silent rather than inferring. When something could only be settled by running it, say that — and if it is cheap, run it and cite the result.

A note that quietly fills gaps with plausible inference is worse than no note, because it will be trusted.

### 5. Write the note

Save it where the repo already keeps such notes; match the existing convention. If there is none, put it somewhere sensible and say where.

```markdown
# <the question>

**Asked:** <YYYY-MM-DD>  ·  **Versions checked:** <library@version, runtime, etc.>

## Answer
<the finding, stated plainly, up front>

## Evidence
- <claim> — [source](url), <file:line or section>
- <claim> — [source](url), <file:line or section>

## Unresolved
<what could not be established, where sources conflicted, what would settle it>

## Implications
<what this means for the decision that prompted the research>
```

## Feeding it back

A research note is an input, not an outcome. When it settles something:

- Record the decision and its rationale in the Decisions table of `.pipeline/REQUIREMENTS.md`, linking the note
- Close the matching entry in Open questions
- If it invalidates a design already written, say so plainly and return to `/blueprint` rather than building around it

## Exit criteria

- [ ] Every claim in the note cites a primary source, with version
- [ ] Secondary sources were used to find primaries, not quoted as evidence
- [ ] What could not be established is stated, not inferred
- [ ] The note is saved where the repo keeps notes
- [ ] Any decision it settles is recorded in `.pipeline/REQUIREMENTS.md`

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
