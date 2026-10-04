---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Verification landmark's question cards (landmark record revision 1), 2026-10-04
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/docs/adr/000J-completion-claims-are-checked-against-repository-state.md
  - workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages)
last_verified: 2026-10-04
---

# Landmark: Verification

This page is the evolving synthesis of the Verification landmark
(landmark [Verification landmark record (LMK-000H)](../../landmark-tracker/landmarks/LMK-000H.json)).
It sums up, in prose, what the landmark's twenty-one question cards currently
say and is updated whenever one of them changes. The cards and the landmark
record keep the structured account and the lineage; the decision records and
Specs named below govern. The delivery chain around it is explained in
[The Three Altitudes Of Delivery](delivery-altitudes.md) and
[The Workflow From Idea To Delivery](idea-to-delivery-workflow.md).

## What the landmark is

Verification is the question of how evidence shows the intended result at the
right scope, and how checks, independent review and owner Human QA stay
distinct. It matters because a mistake here lets a green test, a merge or a
confident report stand in for an actual destination, or buries every small
step under ceremony meant for a whole Spec.

## Current accepted answers

For every card below, the source answers were settled by the owner in their
grilling sessions. The cards' grouping, titles and synthesis are agent work and
were not separately confirmed, so this page treats the settled answers as the
claims and its own grouping as structure only.

**What a Worker proves.** A Task uses red/green TDD, makes the relevant tests
green, exercises what it built and preserves proof before handoff; the Worker
self-checks, hands back and ends, and no Task carries its own independent
review or approval gate (card [DQC-004A: "What must a worker prove before handing off a Task result?"](../../landmark-tracker/destination-questions/DQC-004A.json), revision 7).
What the run leaves behind is a Receipt: the commit on the Task branch, tests
run with result, docs touched, dirty files and the remaining gap, appended one
row per run in the Task record, with only a derived signal shown on the board;
a Task expected to need more than one context unit should be a Spec instead
(card [DQC-002R: "What must a Task receipt preserve after each run?"](../../landmark-tracker/destination-questions/DQC-002R.json), revision 9).
Closeout is gated on repository state: close refuses a dirty tree or an
unpushed branch unless the Receipt records that state and a reason, while the
extra git diagnostics only draw attention and never block
(card [DQC-004G: "How should dirty or unpushed work affect closeout?"](../../landmark-tracker/destination-questions/DQC-004G.json), revision 5).

**Review at the assembled Spec and at integration.** Separate-context review
is required when work is ready to merge into integration; its unit is the
assembled Spec and the combined result of its Tasks, with the Dispatcher's
whole-Spec check first and the Director's separate-context approval second.
Neither the Dispatcher nor any agent that implemented a Task in the candidate
may give that approval (card [DQC-004B: "When is separate-context review required, and what unit does it inspect?"](../../landmark-tracker/destination-questions/DQC-004B.json), revision 11;
card [DQC-006N: "Who may give the separate-context approval of an assembled Spec?"](../../landmark-tracker/destination-questions/DQC-006N.json), revision 5).
A failed review is diagnostic, not blame: say what is wrong, correct it under
the still-open Spec and present a fresh immutable candidate
(card [DQC-004C: "What should happen after assembled-Spec review fails?"](../../landmark-tracker/destination-questions/DQC-004C.json), revision 6).
A Task whose one attempt missed is not discarded; its record and hand-back
stay as diagnostic proof and its card returns to In progress
(card [DQC-006O: "What happens to a Task whose one attempt missed?"](../../landmark-tracker/destination-questions/DQC-006O.json), revision 6).

**Owner Human QA and closing a Spec.** Two named gates exist: the Spec QA gate
into integration and the owner's Human QA on integration before main. Human QA
is not a release ceremony and not batched by release, and the owner chooses
when to do it (card [DQC-004D: "What does owner Human QA evaluate, and where does it happen?"](../../landmark-tracker/destination-questions/DQC-004D.json), revision 8).
A failed Human QA returns work to Align, routed by scope and destination: a gap
against an existing Spec destination is corrected under it, and a new Spec is
only for a distinct objective
(card [DQC-004F: "How should failed Human QA return work to alignment or correction?"](../../landmark-tracker/destination-questions/DQC-004F.json), revision 8).
A Spec closes only after separate-context review passes and owner Human QA
confirms the destination, then it is reconciled into the Wiki and retired; no
merge closes it (card [DQC-004E: "What conditions allow a Spec to close?"](../../landmark-tracker/destination-questions/DQC-004E.json), revision 6).
A readiness question about main authorizes only an independent release review
and a verdict, never a merge, and that review checks the Blueprint boundary
semantically as well as mechanically
(card [DQC-004H: "What does a release-readiness review establish and authorize?"](../../landmark-tracker/destination-questions/DQC-004H.json), revision 9).

**Proof for the portable layout.** The source repository moves its own support
records under the same layout it distributes, and the ownership repair covers
the full source and templates, reaching downstream rooms only through their own
update (card [DQC-000U: "How does the source Workbench prove it uses the same layout it distributes?"](../../landmark-tracker/destination-questions/DQC-000U.json), revision 7).
A broken baseline is repaired first, so broader changes start green
(card [DQC-005F: "How should a broken verification baseline be handled before broader changes?"](../../landmark-tracker/destination-questions/DQC-005F.json), revision 6).
Focused red/green fixtures cover the layout, adoption and preservation seams
(card [DQC-005I: "Which focused fixtures demonstrate the portable layout and preservation seams?"](../../landmark-tracker/destination-questions/DQC-005I.json), revision 7),
complemented by one fresh Genesis, one mixed Adoption and one v2 update exercise
(card [DQC-005J: "Which fresh-room and existing-room exercises complement those fixtures?"](../../landmark-tracker/destination-questions/DQC-005J.json), revision 7).
Normal setup makes no content comparison of skills; an explicit skill update is
the synchronization boundary (card [DQC-001A: "What should skill verification report, and which copies should it inspect?"](../../landmark-tracker/destination-questions/DQC-001A.json), revision 7).
A short demo shows the manifest, lanes, bounded checks and a preserved skill,
and makes no model-outcome claim
(card [DQC-005K: "What can a short demo prove, and which outcome claims remain unsupported?"](../../landmark-tracker/destination-questions/DQC-005K.json), revision 6).

**Mission success.** One full cycle on another workbench, from creating or
updating it through grilling, Specs, Tasks and a verified Spec on integration
for owner review, counts as workflow mission success; every Spec needed to
establish the workflow is completed first
(card [DQC-005L: "What complete cycle on another room establishes workflow mission success?"](../../landmark-tracker/destination-questions/DQC-005L.json), revision 7).
For cloud and parallel runs, the cold-clone, claim-by-pushing, end-clean round
trip is the proof design (card [DQC-005M: "What proves a cloud or parallel-instance run is portable end to end?"](../../landmark-tracker/destination-questions/DQC-005M.json), revision 8).
Inference: the owner's short answer "End clean up" is recorded on that card as
the agent's interpretation, so the exact shape of the clean-end proof is not
owner-confirmed wording.

**Context cost and card fields.** Measuring context cost and agent outcomes
belongs to the audit workbench, not here, with "budget grading" rather than a
budget limit (card [DQC-005T: "How should context cost and agent outcomes be evaluated?"](../../landmark-tracker/destination-questions/DQC-005T.json), revision 8).
A card's Expected result records the intended durable change and the Result
records the achieved delivery (card [DQC-006J: "What do a card's Expected result and Result record?"](../../landmark-tracker/destination-questions/DQC-006J.json), revision 6).

## Open and unresolved

- Revised by a newer decision: the cards on failed review and on a missed Task
  still record "new corrective Tasks" and a fresh Task named for its objective.
  The decision record
  [A miss found by a check continues the same Task unless the fix rewrites it](../../docs/ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md)
  revises that: the same Task continues with an adjusted handoff, and a new Task
  opens only when the fix rewrites it. The cards have not yet been updated.
- The cards describe the destination, with no Task gate and review only at the
  assembled Spec. The current controls record a bootstrap route in which each
  Task pull request into integration gets a separate-context review
  ([AGENTS](../../../AGENTS.md#git-rules)); the cards do not describe that
  exception.
- The cards name "the Director" as the approver. The decision record
  [Captain, Director, Dispatcher and Worker scope work and role skills own each job](../../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)
  narrows the Director to one landmark lane under a Captain.
- How the clean-end proof for cloud and parallel runs is built and demonstrated
  is not recorded here as delivered; read the owning Spec rather than this page.

## Where the work lives

The gates are recorded in the decision records
[Work passes two QA gates: spec branch to integration and integration to main](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
[Completion claims are checked against repository state](../../docs/adr/000J-completion-claims-are-checked-against-repository-state.md)
and [Require independent review when branches combine at integration](../../docs/adr/0037-independent-review-at-integration.md).
Delivering Specs: [Spec QA Gate And Corrective-Task Return Path (S-00J)](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md),
[Completion Claims Against Repository State (S-00M)](../../specs/S-00M-completion-claims-against-repository-state/SPEC.md),
[Workflow Canon Rework (S-00P)](../../specs/S-00P-workflow-canon-rework/SPEC.md),
[S-00O - Workbench Release v4.0.0](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md),
[S-021 - Portable Workbench v3](../../specs/S-021-portable-workbench-v3/SPEC.md),
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md),
[Blueprint, Active ADR, And Context Map Rebuild (S-00A)](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md),
[Destination Question Cards definition Spec (S-002B)](../../specs/S-002B-destination-question-cards/SPEC.md) and
[Corrective Work Rules (S-004F)](../../specs/S-004F-corrective-work-rules/SPEC.md).
The procedures are in [RUNBOOK](../../../RUNBOOK.md#independent-review-boundaries)
and [Test And Build](../../../RUNBOOK.md#test-and-build); the controls are in
[AGENTS](../../../AGENTS.md#assembled-review-and-corrective-return).

## Related pages

- [Task artifact and lifecycle](task-artifact-and-lifecycle.md): the Task, Packet and Receipt.
- [Roles and stances](roles-and-stances.md): who reviews and approves.
- [The Three Altitudes Of Delivery](delivery-altitudes.md): Task, Spec and integration scopes.

## Evidence and Sources

- [Verification landmark record (LMK-000H)](../../landmark-tracker/landmarks/LMK-000H.json): title, summary, importance and history.
- The twenty-one question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): why this page exists.

## History

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
