---
name: wayfinder
description: Find the way through work too big and too foggy for one session — a shared map of decision tickets, resolved one at a time until the route is clear. Use when the destination itself is uncertain, when planning would be guessing, or to resume working through an existing map. Produces .pipeline/MAP.md and .pipeline/map/ tickets.
disable-model-invocation: true
---

# Wayfinder

Stage 0 of the pipeline, and **optional**. It exists for exactly one situation: a loose idea has arrived that is too big for one session and wrapped in fog — the way from here to the destination is not visible yet.

Every other stage assumes you know what you are building. `/vision` interviews toward a known kind of outcome; `/roadmap` orders epics you can already name. When you cannot yet name them — when the open questions outnumber the answers — wayfinding comes first. Its tickets are **decision tickets**: questions whose resolution is a decision, not slices of a build to execute.

**Plan, don't do.** The map is done when nothing is left to decide before someone goes and builds the thing. The pull to just start building is usually the signal that the fog has cleared and it is time to leave this stage — not a reason to smuggle execution into it.

## When to skip

Skip if you can already state what done looks like and roughly how to get there — go to `/vision` or `/blueprint`. Most work never needs wayfinding. Run it when naming the epics would be guessing, when the destination itself is contested, or when the decisions span more sessions than one person can hold in their head.

If the work sits on an existing codebase that nobody has surveyed, run `/discover` first — decision tickets written blind to what already exists ask questions the code has already answered.

## The map

One file, `.pipeline/MAP.md`, loaded once per session. It is an **index, not a store** — each decision lives in exactly one place, its ticket; the map only gists and links.

```markdown
# Map: <name>

## Destination
<what reaching the end looks like — the spec, decision, or change this effort
is finding its way to. One or two lines; every session orients to it first.>

## Notes
<domain context, skills every session should consult, standing preferences>

## Decisions so far
- [<closed ticket title>](map/<nn>-<slug>.md) — <one-line gist of the answer>

## Not yet specified
<fog: questions you can sense coming but cannot yet phrase sharply>

## Out of scope
- <gist> — <why it is beyond the destination> ([ticket](map/<nn>-<slug>.md) if one existed)
```

If the project uses a real issue tracker, the map is an issue labelled for wayfinding and the tickets are child issues with native blocking links — same structure, tracker-shaped. The file form here is the fallback that always works.

## Tickets

One file per ticket at `.pipeline/map/<nn>-<slug>.md`:

```markdown
# <nn> — <title>

**Type:** grilling | research | prototype | task
**Mode:** HITL | AFK
**Blocked by:** <ticket numbers, or "—">
**Status:** open | claimed | closed
**Claimed by:** <who, when claimed>

## Question
<the decision or investigation this ticket resolves — sized to one session>

## Resolution
<empty until closed: the answer, its rationale, and links to any assets>
```

### Ticket types

Every ticket is **HITL** — human in the loop, worked *with* the user — or **AFK**, driven by the agent alone. A HITL ticket only resolves through live exchange; the agent never stands in for the human's side of it. A grilling session that answers its own questions has produced fiction, not a decision.

| Type | Mode | Resolves by | Use when |
|---|---|---|---|
| `grilling` | HITL | The `grilling` craft skill, one question at a time | The default — the answer exists only in the user's head |
| `research` | AFK | A `research` subagent against primary sources | A fact outside the repo gates the decision |
| `prototype` | HITL | The `prototype` craft skill — a cheap artifact to react to | "How should it look/behave" is the real question |
| `task` | either | Doing the work, then recording resulting facts | Manual work gates a decision — provisioning access, moving data so its shape can be seen |

`task` is the one type that *does* rather than decides — it earns its place by unblocking a decision, not by delivering the destination.

## Fog of war

The map is deliberately incomplete: do not chart what you cannot yet see. Beyond the live tickets lies fog — decisions you can tell are coming but cannot yet pin down, because they hang on questions still open. That dim view goes in **Not yet specified**, as loosely or fully as the view allows.

**Fog or ticket?** The test is whether you can state the question precisely *now* — not whether you can answer it now. Sharp question → ticket, even if blocked. Fuzzy → fog. Do not pre-slice fog into ticket-sized pieces; one patch may graduate into several tickets, or none, once the frontier reaches it.

Resolving a ticket clears fog ahead of it: graduate whatever is now specifiable into fresh tickets, and clear each graduated patch from Not yet specified so it lives only as its ticket.

**Out of scope is not fog.** Fog gathers *toward* the destination; work beyond it is out of scope and never graduates. When an existing ticket turns out to sit past the destination, close it and leave one line in Out of scope saying why — it stays out of Decisions so far, which records only the route actually walked.

## Working the map

**The frontier** is the set of open, unblocked, unclaimed tickets — the edge of the known. Claim a ticket *before* any work by setting `Status: claimed` and `Claimed by:`, so concurrent sessions skip it.

**One ticket per session**, resolved fully — except `research` tickets, which can run as parallel background subagents. This is the fresh-context discipline of `/implement` applied to decisions: a session that resolves three tickets resolves the third one badly.

### Mode 1 — draw the map

Invoked with a loose idea:

1. **Name the destination first.** Run the `grilling` craft skill (with `domain-modeling` if terms are fuzzy) to pin down what this map is finding its way to. The destination fixes the scope, so it is settled before anything else.
2. **Map the frontier, breadth-first.** Grill again, fanning out across the whole space rather than deep on any thread, surfacing the open decisions and the first takeable steps. Consult `.pipeline/CODEBASE.md` if `/discover` produced one — questions the codebase already answers do not become tickets. **If no fog surfaces** — the way is already clear — stop; you do not need a map. Say so and route to `/vision`.
3. **Write the map**: destination and notes filled, decisions empty, fog sketched into Not yet specified.
4. **Create the tickets you can specify now**, then wire blocking edges in a second pass, and challenge each edge once — false dependencies serialise decisions that could resolve in parallel.
5. **Fire the research tickets** as parallel background subagents.
6. Stop. Drawing the map is one session's work; it hand-resolves nothing else.

### Mode 2 — work through the map

Invoked with an existing map, ticket optional:

1. Load `MAP.md` — the low-res view, not every ticket body.
2. Choose the ticket: the one the user named, else the first frontier ticket. **Claim it.**
3. Resolve it by its type, zooming into related or closed tickets on demand.
4. Record the resolution on the ticket, set `Status: closed`, and append a one-line gist to Decisions so far.
5. Graduate any fog the answer has sharpened; rule out of scope anything the answer has pushed past the destination; update or delete tickets the decision invalidates.

## Leaving the stage

The map is done when no open tickets remain and the fog is empty — nothing left to decide. Then:

- Fold the durable decisions into the Decisions table of `.pipeline/REQUIREMENTS.md` with their rationale — creating the file from `/vision`'s seed template if this map is the project's first act.
- Route forward: `/vision` if intent still needs the full interview, `/blueprint` if the map's decisions already pin down intent, `/roadmap` if the cleared fog revealed multi-epic scope.

## Exit criteria

- [ ] The destination is stated on the map and every ticket traces to it
- [ ] Every HITL ticket was resolved with the user, never on their behalf
- [ ] Every closed ticket has its resolution recorded on the ticket, gisted on the map
- [ ] Not yet specified is empty — graduated or ruled out of scope
- [ ] Durable decisions are folded into `.pipeline/REQUIREMENTS.md`

---
*Adapted from [mattpocock/skills](https://github.com/mattpocock/skills), MIT.*
