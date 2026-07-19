---
name: wayfinder
description: Plan a chunk of work too big for one session as a shared map of decision tickets on GitHub Issues, then resolve them one at a time until the way to the destination is clear. Adapted from Matt Pocock's wayfinder onto the Workbench's GitHub-Issue substrate, grilling, notepad, research, and prototype.
disable-model-invocation: true
---

# Wayfinder

A loose idea has arrived, too big for one session and wrapped in fog: the way
from here to the **destination** isn't visible yet. Wayfinding charts that way as
a shared **map** on GitHub Issues, then works its **decision tickets** — questions
whose resolution is a decision, not slices of a build — one at a time until the
route is clear. This is rung 4 of the thinking ladder (one decision → notepad →
save → **map**); a map is a `notepad` at multi-session scale.

## Plan, don't do

Each ticket resolves a decision; the map is done when nothing is left to decide.
The pull to just build is usually the signal you've reached the edge of the map
and it's time to hand off to `/make-it-so`. Produce decisions, not deliverables.

## Refer by name

Every map and ticket is an Issue with a title. In everything the human reads,
refer to it by that name, never a bare number — a wall of `#42, #43` is illegible.
The id and link ride inside the name.

## The substrate — GitHub Issues, scope-routed

The map is one Issue labelled `wayfinder:map`; its tickets are **child issues**
(native sub-issues). Blocking uses GitHub's native **dependency** relationship, so
the frontier renders in GitHub's own UI. Route by scope: a project effort → that
project's repo; a workspace effort → the GPT_OS mirror. When Issues are
unavailable, fall back to a local markdown map and say so.

- The map is an **index, not a store**: it gists each closed ticket and links it;
  a decision lives in exactly one place, its ticket.
- A session **claims** a ticket by assigning it before any work.
- The **frontier** is the open, unblocked, unclaimed children — the edge of the known.

## Ticket types

- **research** (AFK): dispatch `/research` to surface a fact a decision waits on
  (escalate to `/deep-research` only if it needs the heavy tier).
- **prototype** (HITL): `/prototype` a rough artifact to react to; link it as an asset.
- **grilling** (HITL): resolve via `/grilling` and `/domain-modeling`, one question
  at a time. The default.
- **task** (HITL or AFK): manual work that must happen before a decision can be
  made (provision access, move data). The one type that *does* rather than decides.

## Fog of war

Don't chart what you can't yet see. Beyond the live tickets is the fog — decisions
you can tell are coming but can't yet phrase sharply. Write it loosely in the map's
**Not yet specified** section; resolving a ticket graduates whatever is now
specifiable into fresh tickets. Ticket when the question is already sharp (even if
blocked); leave it in the fog when you can't yet phrase it precisely.

## Out of scope

The destination fixes the scope; work beyond it goes in the map's **Out of scope**
section and never graduates. When a ticket turns out to sit past the destination,
close it and leave one line there — a scope boundary is not a step on the route.

## Two modes

Never resolve more than one ticket per session (except research).

**Chart the map** (user invokes with a loose idea):
1. Name the destination with `/grilling` + `/domain-modeling` — it fixes the scope.
2. Grill again breadth-first to surface the open decisions. If there's no fog — the
   way is already clear — you don't need a map; stop and say so.
3. Create the map Issue (`wayfinder:map`) with Destination, Not-yet-specified fog,
   empty Decisions-so-far.
4. Create the tickets you can specify now as child issues; wire blocking edges in a
   second pass.
5. Fire `/research` subagents for any research tickets. Stop — charting resolves nothing.

**Work through the map** (user invokes with a map, optionally a ticket):
1. Load the map (the low-res index).
2. Choose the ticket (the user's, else the first frontier ticket) and claim it.
3. Resolve it with the skill its type names.
4. Post the answer as a resolution comment, close the ticket, append a one-line
   gist to Decisions-so-far.
5. Graduate any newly specifiable fog into fresh tickets; rule out-of-scope items out.

When the frontier is empty, the way is clear: run `/make-it-so` on the map to
promote its decisions into specs, then **close the map** — it is planning state,
never a permanent tracker beside specs and `TASKBOARD.md`.
