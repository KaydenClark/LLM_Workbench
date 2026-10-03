---
date: 2026-09-12
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
  - LEXICON.md
---

# Blueprint, Spec and Task are three altitudes of one delivery chain

The Blueprint owns the grand product destination and user journey. A Spec is a PRD-shaped scoped objective with its own destination: a smaller goalpost derived from Blueprint needs, active ADRs, verified Actuality and required evidence. Tasks do the counting toward that destination, as bounded tracer-round vertical slices through every layer they touch, sized for one useful context. A Task reaches or repairs a destination; a different destination needs a new Spec rather than resurrecting a reconciled Spec.

The phase sequence is Idea -> Align -> Scope -> Plan -> Implement -> Verify. This is a prose interpretation of the settled FND-Q01 phase names, not a replacement for the owner's workflow map, which moved from the Blueprint's Desired Lifecycle to [the workflow page](../../wiki/design-concepts/idea-to-delivery-workflow.md) when the Blueprint became the four-part short page, rewritten in the workflow verbs and no longer kept verbatim. An owner idea starts Align through grilling, ending when owner and agent explicitly confirm a shared design concept. Research, brainstorming and wayfinding may resolve a named Align uncertainty. A prototype is optional, after the Blueprint and before a Spec, as a plausibility check; its code may carry forward once it meets ordinary implementation and verification requirements (WF-2 to WF-4). These settled conditions do not answer the remaining skill-specific interviews.

Scope turns product intent and verified context into smaller Spec destinations; Plan decomposes the scoped work into executable Tasks. Implementation repeats those Tasks, preserving evidence, until the assembled destination can be verified. The Worker self-checks and hands back; the Dispatcher owns whole-Spec QA and the separate Director checks the immutable assembled candidate before integration. [ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md) owns the QA boundaries, flexible owner Human QA and closure order. [AGENTS](../../../AGENTS.md#git-rules) owns the current Task-PR bootstrap exception and pre-integration gate; the nested Task/Spec branch topology remains destination design under S-00O exemption 2.

Small localized Tasks directly under the Blueprint remain accepted destination design, with no delivered direct-Blueprint Task home claimed here. A later gap against delivered work becomes a new Spec under its landmark or the Blueprint, never a revived Spec and never a correction anchored to a Wiki claim. [ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md) owns the Task artifact and Packet distinction. [ADR-000E](proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md) remains a proposal; this acceptance does not deliver its board or unsettled planning behavior.

Considered and rejected: deriving Specs from the Blueprint alone. A Spec written only from the desired end state re-proposes work that already landed and contradicts accepted decisions. Active ADRs and verified Actuality are inputs of equal standing.

Considered and rejected: sizing a Task by layer or component. Layer-sized work produces horizontal slices that cannot be verified end to end; the smallest unit that proves anything is a slice through every layer it touches.

## Acceptance and correction

S-00P TK-004 reconciles this existing decision with locked WF-1/WF-2/WF-3/WF-4/WF-6/WF-8A/WF-8G and the owner-confirmed SCR-1 to SCR-8 readback of 2026-09-24. FND-Q01 and FND-Q19 retain the six phases and original altitude rationale. The Blueprint-as-PRD premise and the briefly restored per-Task approval reading are superseded; the Spec owns the smaller PRD destination and SCR supplies Worker self-check and assembled review. The [grilling destination ledger](../../wiki/grilling-destination-audit-ledger.json) and assigned [S-00P](../../specs/S-00P-workflow-canon-rework/SPEC.md) retain those answers and corrections. No unanswered interview, new scheduler, board capability or Human QA approval is promoted by this reconciliation.

Amendment, 2026-10-03 (Blueprint Short Page): the Blueprint became the four-part short page, so the owner's workflow map no longer sits on it. The route in the second paragraph now points to the Wiki page that holds the map rewritten in the workflow verbs. No decision in this record changed.

## Historical proposal

The following is the complete earlier proposal, retained as historical evidence rather than active decision. Its text reads at `git show 5d743b4fda292ad772d2505aa3732c83d719fa81:workbench/docs/adr/proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md`; only the move's literal Markdown routes below have been rewritten. Its dated correction notes already identify superseded premises; its proposed-status and runtime-gap statements describe that earlier tree.


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
[ADR-000E](proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md),
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

Owner correction, 2026-09-24: the opening claim that the Blueprint owns the
future-facing PRD function is superseded. The Blueprint owns the grand product
destination; each Spec is the PRD-shaped smaller destination. The owner also
restored Task review before merge into the Spec branch. The current destination
and full workflow map live in `BLUEPRINT.md`; this proposal remains historical
evidence until its separate disposition.

Owner correction, 2026-09-24, later the same day: the restored Task review
before merge into the Spec branch is itself superseded. No Task has a review or
approval gate; the Worker self-checks and the Dispatcher merges for
containment. The assembled Spec is checked by its Dispatcher and approved by
the Director in a separate context before it combines into `integration`. A
Spec is a local destination such as 1 through 5 of the Blueprint's 100, and a
Task is one step of about 0.1. Accepted
[ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)
now carries the QA gates, the roles, the owner's Human QA cadence and timing,
and the closure order; this proposal keeps its separate disposition in S-00P
TK-004.

## Later-gap correction

The corrective-work Spec ([S-004F](../../specs/S-004F-corrective-work-rules/SPEC.md)) replaces the sentence that sent a corrective Task against a reconciled capability to its Wiki claim (WF-8A/WF-8G), under ADR-000A's amendment-first rule. The earlier text reads at `git show f91bfd72f41c4b471f1756781649375abb68d158:workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md`. The owner's answer is recorded in [the scaffolding decision](../ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md): a later gap against delivered work becomes a new Spec under its landmark or the Blueprint, and the Wiki holds knowledge and evidence for the direction and the plan, not the destination. The altitude chain and the rest of this decision are unchanged.
