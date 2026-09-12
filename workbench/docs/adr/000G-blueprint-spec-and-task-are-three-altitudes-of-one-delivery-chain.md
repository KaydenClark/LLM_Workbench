---
status: proposed
date: 2026-09-12
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
  - LEXICON.md
---

# Blueprint, Spec and Task are three altitudes of one delivery chain

`BLUEPRINT.md` owns the grand design: the Destination, and the future-facing PRD
function for the product. A `SPEC.md` is one journey step derived from the
Blueprint, the active ADRs, verified evidence and live Actuality, producing a
smaller goalpost destination of its own. A **Task** is a tracer-round vertical
slice of a Spec — the smallest bounded work an agent can complete without
overflowing useful context, piercing every layer it touches rather than
completing one layer across the capability. Agents execute Tasks until the Spec
is done, then request the merge that triggers the Spec QA gate.

The surrounding workflow runs from an undeveloped idea to verified completion.
The owner brings an idea; exploration proceeds through grilling, research and
supporting documents, with optional rapid prototypes; the Blueprint carries the
resulting future-facing product intent; frontier planning derives Specs from the
Blueprint, active ADRs and verified Actuality; Specs decompose into bounded thin
vertical Tasks carrying blocking relationships and priority; implementation
loops until the active board clears. Destination lives in the Blueprint, the
Journey in a Spec, and each walked Path is a Task.

Considered and rejected: deriving Specs from the Blueprint alone. A Spec written
only from the desired end state re-proposes work that already landed and
contradicts decisions already accepted, so active ADRs and verified Actuality are
inputs of equal standing.

Considered and rejected: sizing a Task by layer or by component. Layer-sized
work produces horizontal slices that cannot be verified end to end, and the
smallest unit that proves anything is a slice through every layer it touches.

Consequences: the terminal verification of this workflow is the two gates in
[ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
not a single stop at the end. The Frontier vocabulary this uses is owned by
[ADR-000E](000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md),
and the Task's artifact form by
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).
The per-phase entry and exit conditions of Explore, Prototype and Implement
remain open WF questions and are not decided here; this record fixes altitude
and sequence only.

Provenance: owner-approved foundation answers FND-Q01 and FND-Q19, 2026-09-11,
recorded as approved answers in the live grilling note
`workbench-foundation-rework-2026-09-11`, untracked working material named as
origin rather than durable evidence.

## Promotion status

This record is `proposed`. `BLUEPRINT.md`, `AGENTS.md` and `LEXICON.md` remain
live Canon as written until the owner accepts it.
