---
name: grilling
description: Interrogate the user about a plan, decision, or idea — one question at a time, with a recommended answer per question — until shared understanding is reached. Use when the user says "grill me", wants their thinking stress-tested, or when a single decision needs resolving through live conversation rather than research.
---

# Grilling

Interview the user relentlessly about every aspect of the thing until you reach shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one by one.

This is the technique behind every interview in this repo. `/vision` applies it to a whole piece of work at the start; a `/chart` grilling ticket applies it to a single fogged decision. Invoked bare, it stress-tests whatever the user puts in front of it — a plan, an architecture, a career move.

## The rules

**One question at a time.** Ask, wait for the answer, let the answer determine the next question. Asking multiple questions at once is bewildering, and it lets the user skip the uncomfortable one.

**Recommend an answer with every question.** A bare question outsources all the thinking; a question with a recommendation and its reasoning gives the user something to push against. Being told *why* you'd choose B often surfaces the constraint that makes A right.

**Look up facts; ask for decisions.** If a fact can be found by exploring the environment — the codebase, the filesystem, configuration, documentation — look it up rather than asking. Asking the user something the repo already answers destroys trust in the interview. The *decisions*, though, are theirs: put each one to them and wait.

**Follow the branch, not the script.** When an answer opens a new branch of the decision tree, walk it before returning. When an answer contradicts an earlier one, name the conflict out loud and make the user choose. When an answer is vague, restate it as something falsifiable and ask if that is right.

**Push back on what will not work.** An interview that accepts every answer is a form. If the user proposes something that fails on the facts, say so plainly and say why. Deference here is a disservice.

## The human is the human

Never answer your own questions. The entire value of a grilling is the information that exists only in the user's head; a session that fills in the user's side of the exchange has produced fiction, not understanding. If the user is absent, the grilling waits — it does not proceed with assumed answers.

This is what distinguishes grilling from `research`: research resolves questions the *world* can answer, grilling resolves questions only *this person* can answer. If mid-grilling you hit a question the world can answer, resolve it with `research` and bring the finding back into the conversation.

## Stopping

Stop when you can restate the whole thing in a way the user reads and says "yes, that's it" — not when you run out of questions. Read your understanding back before acting on it, and do not act until the user confirms.

## Recording

Grilling produces decisions, and decisions decay unless written down. Record each resolved decision — with its rationale — in the Decisions table of `.pipeline/REQUIREMENTS.md` if the project has one, or wherever the invoking context directs (a `/chart` ticket records its resolution on the ticket).

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
