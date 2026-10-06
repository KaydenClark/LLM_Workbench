---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Agent Autonomy landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md
  - workbench/docs/adr/0034-required-steps-must-enable-delivery.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Agent Autonomy

This page is the evolving synthesis of the Agent Autonomy landmark
(landmark ["Agent Autonomy" (LMK-000D)](../../landmark-tracker/landmarks/LMK-000D.json)).
It sums up what the landmark's seven question cards currently say, in prose, and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the delivering decisions and controls
govern. Each card's source answers were settled by the owner in grilling
sessions (one in chat, recovered from the owner's own messages); the grouping
and synthesis inside each card is agent work, not separately owner-confirmed.

## What the landmark is

Agents finish authorized work and resolve available facts without requiring
repeated owner coordination. The landmark covers what authorizes work, how far
an agent investigates before asking or stopping, what an agent must never do
when blocked, which steps are worth requiring, how much of a procedure is prose
versus code, and which coordination machinery is deliberately left for later.
It matters because the owner wants to step in to align and to unblock, not to
re-approve work already authorized.

## Current accepted answers

- **Authorization and the claim**
  (card [DQC-002W: "What authorizes work, and what does a claim merely record?"](../../landmark-tracker/destination-questions/DQC-002W.json), revision 8).
  The owner's instruction is the authorization; the claim merely records it by
  being pushed on the Task branch. `claim` creates that branch from the
  integration branch, commits the claim as its first commit and pushes at once;
  `next` and `claim` fetch every remote and overlay Task state from every
  remote tip; no claim is committed directly to integration; a session with no
  remote falls back to local and says so. The accepted record is
  ["Claims are pushed on the task branch and read from every remote tip"](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md).
  The card also records that the session owned all six tickets of the follow-up
  Spec, the
  [v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md);
  that is a scoped assignment, not a general rule. The later decision record
  ["Confirming a concept authorizes the agents to carry it to its endpoint"](../../docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md)
  states the same principle at the concept level.
- **Investigate, then decide, then stop only when stuck**
  (card [DQC-003F: "How far should an agent investigate before asking the owner or stopping?"](../../landmark-tracker/destination-questions/DQC-003F.json), revision 6).
  The Workbench is autonomous within its standing authority. An arriving agent
  investigates the Contract, relevant decision records, Specs, Task state, Wiki
  and project evidence, makes the best supported choice, and may construct the
  next decision from that evidence. Only when it cannot find a confident good
  next decision does it record the blocker and stop; the owner can open a
  grilling session on return. Platform safety and owner-only boundaries still
  apply.
- **Never manufacture the next assignment**
  (card [DQC-003G: "May an agent manufacture its next assignment when current work is blocked?"](../../landmark-tracker/destination-questions/DQC-003G.json), revision 5).
  No. An agent works its assigned Task, resolving missing information from
  project evidence within it. Only when it cannot is a separate new task needed
  for a new agent, and the current agent does not create that queue item or
  treat its absence as routine blockage. Both autonomy cards are held by the
  decision record
  ["Reduced entry and autonomy within assigned work"](../../docs/adr/0035-reduced-entry-and-assigned-autonomy.md).
- **What makes a step worth requiring**
  (card [DQC-003H: "What makes a workflow step worth requiring?"](../../landmark-tracker/destination-questions/DQC-003H.json), revision 6).
  A required step must name its immediate delivery value and leave a checkable
  artifact, decision or risk reduction. When that value is uncertain the step
  stays optional and visible for review until the owner can grill it; it is
  neither silently made mandatory nor silently discarded. The record is
  ["Required steps must enable direct delivery"](../../docs/adr/0034-required-steps-must-enable-delivery.md).
- **Prose procedures, narrow tools**
  (card [DQC-003I: "Which parts of a procedure belong in prose and which in deterministic tools?"](../../landmark-tracker/destination-questions/DQC-003I.json), revision 8).
  Guidebook-first: agents work through small Markdown procedures that explain
  purpose, inputs, decisions, actions, stopping conditions and proof, and code
  exists only for narrow deterministic checks that are clearer and safer as
  code. The Spec and Task tool stays bounded to Spec and Task mechanics and is
  manifest-aware, the additions are a layout and manifest check and a bounded
  installed-skill check, install and update helper, each procedure invokes only
  its own mechanical check, and there is no umbrella lifecycle program. The
  tools lane is described by
  ["Runtime tools are workbench-managed in the tools lane"](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md).
- **Foundry machinery stays outside the base**
  (card [DQC-000K: "Which coordination machinery belongs outside the base Workbench?"](../../landmark-tracker/destination-questions/DQC-000K.json), revision 10).
  Identifiers for orders and flights, claims journals, halls, sockets, the
  captain and command roles, scheduling and runtime visibility remain Foundry
  augmentation. The goal is to make LLM Workbench good, current and safely
  reusable while Foundry finishes, without redesigning it into Foundry or
  widening optional architecture; broad guidebook taxonomy, orchestration, a
  generalized plugin or catalog architecture, unrelated pending skills and
  aesthetic refactors are out. The records are
  ["Workbench supplies the base and Foundry adds coordination"](../../docs/adr/0015-workbench-base-and-foundry-capabilities.md)
  and
  ["LLM Workbench is the sole Workbench source; Foundry is a downstream extension"](../../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md).
- **Coordinator later; prove one Task first**
  (card [DQC-003A: "What evidence should precede building an unattended coordinator?"](../../landmark-tracker/destination-questions/DQC-003A.json), revision 6).
  There should be a coordinator, but it is built later; first prove that a Task
  can be executed every single time consistently. It is backlog after v4,
  planned as future direction on the Blueprint, and not every Spec is built now.

## Open and unresolved

- Whether a portable unattended runner is required is deferred until
  single-Task execution is proven consistent; that proof has no recorded
  threshold, and the coordinator has no Spec in the current rollout. This is
  an open deferral on both the Foundry card and the evidence card, not a
  settled design.
- Inference: the card expected the coordinator direction to be stated in the
  Blueprint's future-direction text; the current Blueprint short page names the
  Foundry but no coordinator or runner, so that route needs a check. Nothing
  here claims the coordinator is built.
- Pushed Task-branch claims are the accepted mechanism, but the proposed
  decision record
  ["GitHub Issues are the required live coordination authority"](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md)
  would supersede them at a separately reviewed cutover; see
  [Landmark: GitHub Coordination](landmark-github-coordination.md).
- Stale wording to correct, not a conflict in the decisions: the autonomy
  decision record's opening line says "Keep the seven-control Contract", while
  ["The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec"](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md)
  now defines three carriers. The autonomy rule itself is unaffected.
- Whether the current tools still fit the no-umbrella-program rule is a design
  constraint the card records; this page did not audit the tools lane against
  it.

## Where the work lives

The rules are in [AGENTS](../../../AGENTS.md) (assigned work, work selection and
safety), the operations in [RUNBOOK](../../../RUNBOOK.md), and the destination
in [BLUEPRINT](../../../BLUEPRINT.md). Foundry boundaries were first fixed by
[S-021 "Portable Workbench v3"](../../specs/S-021-portable-workbench-v3/SPEC.md);
the push-on-claim slice is carried by
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md).
The claim and selection mechanics are in the
[Spec and Task tool](../../tools/spec-workbench.mjs).

## Related pages

- [Landmark: Portable Workbench](landmark-portable-workbench.md)
- [Landmark: GitHub Coordination](landmark-github-coordination.md)
- [Roles and stances](roles-and-stances.md)
- [Idea to delivery workflow](idea-to-delivery-workflow.md)
- [Finish authorized work](../finish-authorized-work.md) and [Derive before asking the owner](../derive-before-asking-the-owner.md)

## Evidence and Sources

- [Landmark record "Agent Autonomy" (LMK-000D)](../../landmark-tracker/landmarks/LMK-000D.json): title, summary, importance and history.
- The seven question cards named above, each at the revision cited: they hold the answers, the confirmation basis, the open uncertainties and the expected homes this page summarizes.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
