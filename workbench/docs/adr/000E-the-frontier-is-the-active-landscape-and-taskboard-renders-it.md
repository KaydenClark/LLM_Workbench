---
status: proposed
date: 2026-09-12
canonicalized_in:
  - LEXICON.md
  - BLUEPRINT.md
---

# The Frontier is the active landscape and TASKBOARD renders it

The **Frontier** is a concept, not a file: the active landscape where many
Journeys and Paths proceed at once toward the Blueprint Destination. Four terms
are distinct and interconnected. The **Destination** is the finished product the
Blueprint describes. A **Journey** is one step toward it, owned by a `SPEC.md`.
A **Path** is one walked slice of a Journey, owned by a Task. The **Frontier**
is the whole set of Journeys and Paths currently in motion.

`TASKBOARD.md` is the artifact that renders the Frontier, and it is the sole
live project-management and Kanban view of it. It renders and organizes. It
holds as little irreplaceable context as possible, leaving recoverable issues,
substantive progress and evidence in the owning Spec or Task. Completed verified
work leaves the board so the board clears. The test of a correct board is that a
situation report can read it alone and describe a complete active picture.

The board is the view, not the author. Priority, progress, dependencies and
blockers are authored in the owning Spec and its Tasks; `TASKBOARD.md` displays
their generated current view and is regenerable from them without loss.

Considered and rejected: calling `TASKBOARD.md` the navigation view. It does
move an agent from the board to their Task, but only because everything on it is
navlinked. Navigation — connecting a question to its smallest relevant owner —
stays with the Lexicon's Context Map, and naming two artifacts the navigation
surface would put one term on two concepts.

Considered and rejected: letting the board author any state of its own so it can
survive regeneration independently. Anything the board alone holds is lost on
the next render, which is the failure mode that makes a board untrustworthy
rather than merely stale.

Consequences: `LEXICON.md` gains Destination, Journey, Path and Frontier as
ordinary term additions at acceptance, and keeps the Context Map and navlink hub
role. The board's render must continue to derive from Spec and Task state.
Naming the unit the board displays depends on
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).

Provenance: owner-approved foundation answers FND-Q02, FND-Q02A and FND-Q17b,
2026-09-11, recorded as approved answers in the live grilling note
`workbench-foundation-rework-2026-09-11`, untracked working material named as
origin rather than durable evidence.

## Promotion status

This record is `proposed`. `LEXICON.md` and `BLUEPRINT.md` remain live Canon as
written until the owner accepts it.
