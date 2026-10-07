---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Workbench Workflow landmark's question cards (landmark record revision 1), 2026-10-04
  - Implement-spec Skill Adoption Spec (S-002T) qualified the correction-Worker boundary, 2026-10-06
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/specs/S-002T-implement-spec-skill-adoption/SPEC.md
  - workbench/skills/spec-manager/SKILL.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages); the Implement-spec Skill Adoption Spec (S-002T) for the correction exception
last_verified: 2026-10-04
---

# Landmark: Workbench Workflow

This page is the evolving synthesis of the Workbench Workflow landmark
(landmark ["Workbench Workflow" (LMK-000K)](../../landmark-tracker/landmarks/LMK-000K.json)).
It sums up what the landmark's twenty question cards currently say, in prose,
and is updated whenever one of them changes. The cards and the landmark record
keep the structured account; the decisions and Specs govern. Three existing
articles explain parts of this landmark in more depth and are not repeated
here: [The Workflow From Idea To Delivery](idea-to-delivery-workflow.md) (the
owner's map in the workflow verbs), [The Workflow Verbs](workflow-verbs.md) and
[The Three Altitudes Of Delivery](delivery-altitudes.md).

## What the landmark is

A coherent journey from an idea and shared understanding through delivery,
review, correction and release. It matters because it fixes what a Task, a Spec
and the Blueprint each are, who may act at each point, and where failed work
goes, so that work can be handed between contexts without the owner
reconstructing the chain.

## Current accepted answers

The cards record these as owner-settled in their grilling sessions. Each
card's grouping and synthesis is agent work, not separately confirmed, and the
decisions named under "Open and unresolved" have since revised several answers.

**The chain and its altitudes.**
Card [DQC-002L: "How does the product destination decompose into Specs and Tasks?"](../../landmark-tracker/destination-questions/DQC-002L.json), revision 8:
the owner brings an idea and the work runs Idea, Align, Scope, Plan, Implement,
Verify, with prototype optional. The Blueprint is the Destination, a Spec the
Journey toward a smaller goalpost, and each Task a walked path; stacked Specs
realize the Blueprint, and the Taskboard is a projection, never truth. The
rollout is complete only when every Spec needed to establish the full
recursive loop is complete. Card
[DQC-002M: "When may Specs nest or block other Specs?"](../../landmark-tracker/destination-questions/DQC-002M.json), revision 6:
Specs may nest and block each other as Tasks do; a Workbench is a room holding
many Projects, a Blueprint has many Specs and Tasks, and a Task maps to one
Chat.

**The Task as the unit of execution.**
Card [DQC-002N: "What makes a Task a complete vertical execution slice?"](../../landmark-tracker/destination-questions/DQC-002N.json), revision 7:
a Task is a standalone `TASK.md`, a bounded thin vertical slice with its own
blockers; Ticket stays retired. Work that will not fit one context becomes a
Spec cut into Tasks. Card
[DQC-002O: "How should expected context size influence Task planning?"](../../landmark-tracker/destination-questions/DQC-002O.json), revision 7:
the planning goalpost is a declared 200k-token context unit, a goalpost and
not a gate, recorded with provenance in the [manifest](../../manifest.json).
Card [DQC-002P: "How many Tasks should one Chat execute?"](../../landmark-tracker/destination-questions/DQC-002P.json), revision 7:
one Task per Chat; a dispatcher or director watches the Spec and opens a new
Chat per unblocked Task.
The [Implement-spec Skill Adoption Spec (S-002T)](../../specs/S-002T-implement-spec-skill-adoption/SPEC.md) records a newer bounded exception for its owner-invoked correction pass. The [Spec Manager stance](../../skills/spec-manager/SKILL.md) may reuse one correction Worker across explicitly named Task scopes, with serial claims and separate per-Task proof; it grants no general multi-Spec authority. The cited question-card answer remains its older source lineage.

Card
[DQC-002Q: "What belongs in the Task’s entry Packet?"](../../landmark-tracker/destination-questions/DQC-002Q.json), revision 6:
the Packet is the Task, the Spec acceptance lines it satisfies, cited source
and test paths and the Contract, with an optional handoff or notepad. Card
[DQC-002R: "What must a Task receipt preserve after each run?"](../../landmark-tracker/destination-questions/DQC-002R.json), revision 9:
an append-only receipt row per run in `TASK.md`, a board signal that shows only
run count and the latest branch, short commit and dirty count, and a close that
refuses a dirty or unpushed tree unless the receipt says why. Card
[DQC-002S: "When can a small change be a standalone Task?"](../../landmark-tracker/destination-questions/DQC-002S.json), revision 8:
a small localized change may live as a Task with no Spec; the full chain of
Dispatcher, Worker, Dispatcher, Director still applies, and no role works from
main.

**Branches, claims and cleanup.**
Card [DQC-002U: "How should Task, Spec and integration branches relate?"](../../landmark-tracker/destination-questions/DQC-002U.json), revision 8:
branches nest by altitude (main contains integration, a Spec branch starts from
integration, a Task branch from its Spec branch), and a claim is pushed on the
Task branch and read from every remote tip. Card
[DQC-002V: "How should branches and worktrees be cleaned up after delivery?"](../../landmark-tracker/destination-questions/DQC-002V.json), revision 7:
a contained Task branch and worktree are deleted once results are preserved,
and a run is proved by ending clean. Card
[DQC-002W: "What authorizes work, and what does a claim merely record?"](../../landmark-tracker/destination-questions/DQC-002W.json), revision 8:
the owner's instruction authorizes work and the pushed claim only records it.

**Review, correction and return.**
Card [DQC-004C: "What should happen after assembled-Spec review fails?"](../../landmark-tracker/destination-questions/DQC-004C.json), revision 6:
a separate-context review of the assembled Spec is diagnostic, not blame, and a
fresh immutable candidate follows the fix. Card
[DQC-004F: "How should failed Human QA return work to alignment or correction?"](../../landmark-tracker/destination-questions/DQC-004F.json), revision 8:
delivery repeats recursively and a failed Human QA result returns to Align at
the scope the failure implicates. Card
[DQC-002T: "When does a corrective change need a new Spec?"](../../landmark-tracker/destination-questions/DQC-002T.json), revision 6:
route by scope and destination, not Task count. Card
[DQC-006O: "What happens to a Task whose one attempt missed?"](../../landmark-tracker/destination-questions/DQC-006O.json), revision 6:
a missed attempt leaves its hand-back as diagnostic proof and its worktree is
removed. Card
[DQC-005O: "Who controls integration delivery and promotion to main?"](../../landmark-tracker/destination-questions/DQC-005O.json), revision 8:
agents may merge below integration; only the owner merges integration into
main, and a readiness question authorizes a review and a verdict, never a merge.

**Where the workflow begins and what it requires.**
Card [DQC-006M: "Where does the workflow begin relative to idea exploration, Align and room setup?"](../../landmark-tracker/destination-questions/DQC-006M.json), revision 6:
idea exploration may precede Align, a grilling session starts with grill-me,
and Genesis and Adoption are setup or update, not the governing workflow. Card
[DQC-001E: "What place should carry have in the delivery workflow?"](../../landmark-tracker/destination-questions/DQC-001E.json), revision 8:
carry is the name, and it ships as a core skill. Card
[DQC-003H: "What makes a workflow step worth requiring?"](../../landmark-tracker/destination-questions/DQC-003H.json), revision 6:
a required step names its immediate delivery value and leaves a checkable
output; an uncertain step stays optional and visible. Card
[DQC-005L: "What complete cycle on another room establishes workflow mission success?"](../../landmark-tracker/destination-questions/DQC-005L.json), revision 7:
mission success is one full cycle on another workbench, from setup and a
grilling session to a verified Spec on integration for owner review.

## Open and unresolved

- **Newer wording.** The cards still record the six-phase ladder. The decision
  record ["The workflow is eight verbs and each verb writes the plane its claims live on"](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)
  and its amendment now govern the words: Idea, Align, Confirm, Map, Plan, the
  Journey loop, Approve, Delivered and Clean Up.
- **Corrective work.** The cards say a failed review creates corrective Tasks
  and a small fix after retirement is a Task plus a Wiki update. The decisions
  ["A miss found by a check continues the same Task unless the fix rewrites it"](../../docs/ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md)
  and ["Working artifacts are scaffolding, cleared away once their knowledge is kept"](../../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)
  revise this: the same Task continues unless the fix rewrites it, nothing is
  archived, and a later gap becomes a new Spec. The cards on retired Task
  history and a missed Task still carry the older text.
- **Claims.** The pushed Task-branch claim is superseded for v4 only at the
  reviewed cutover described on [GitHub Coordination](landmark-github-coordination.md).
- **Not delivered.** The nested Spec-branch topology is the destination; the
  controls say they do not claim Spec-branch tooling. The Spec-less standalone
  Task home is not built, and reconciling it with the pre-integration review
  gate is open on the card. The detailed mechanics of Spec nesting, and the
  tension between nested branches and claiming from integration, are
  recorded as unsettled.
- **Skill-workflow questions** on composing Align, planning and delivery skills
  were paused by the owner on 2026-09-30 ("foundations first").
- **Stale counts and names.** The carry card names a seventeen-skill bundle,
  which has since grown, and the cards say Director where the accepted role
  decision now places integration with a Captain ([Roles and stances](roles-and-stances.md)).

## Where the work lives

Decisions: [three altitudes](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md),
[two QA gates](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
[a Task is a standalone artifact](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
[folder lifecycle](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md),
[completion claims against repository state](../../docs/adr/000J-completion-claims-are-checked-against-repository-state.md),
[claims pushed on the Task branch](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md),
[required steps must enable delivery](../../docs/adr/0034-required-steps-must-enable-delivery.md) and
[the Workbench aligns and delivers recursively](../../docs/ddr/000A-the-workbench-aligns-to-the-owner-s-concept-and-delivers-on-it-recursively.md).
Specs, with the v4.0.0 release Spec among them: [Workflow Canon Rework (S-00P)](../../specs/S-00P-workflow-canon-rework/SPEC.md),
[Spec QA Gate And Corrective-Task Return Path (S-00J)](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md),
[Retirement Lifecycle By Folder For Records (S-00I)](../../specs/S-00I-folder-lifecycle-for-records/SPEC.md),
[Completion Claims Against Repository State (S-00M)](../../specs/S-00M-completion-claims-against-repository-state/SPEC.md),
[Corrective Work Rules (S-004F)](../../specs/S-004F-corrective-work-rules/SPEC.md),
[Portable Workbench (S-00V)](../../specs/S-00V-portable-workbench/SPEC.md),
[Workbench Release (S-00O)](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md),
[carry skill rebuild (S-01C)](../../specs/S-01C-carry-skill-rebuild/SPEC.md) and
[Generated JSON Taskboard (S-01X)](../../specs/S-01X-generated-json-taskboard/SPEC.md).
The retired [Task Artifact And Terminology Migration (S-00H)](../../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md)
delivered the Task artifact, explained in
[The Task Artifact And Its Lifecycle](task-artifact-and-lifecycle.md). Tools:
[spec-workbench](../../tools/spec-workbench.mjs) and [task-record](../../tools/task-record.mjs).

## Related pages

[GitHub Coordination](landmark-github-coordination.md), [Delivery altitudes](delivery-altitudes.md),
[Workflow verbs](workflow-verbs.md), [Idea to delivery](idea-to-delivery-workflow.md).

## Evidence and Sources

- [Landmark record "Workbench Workflow" (LMK-000K)](../../landmark-tracker/landmarks/LMK-000K.json): title, summary and importance.
- The twenty question cards named above, each at the revision cited.
- The decisions and Specs linked under "Where the work lives".

## History

- 2026-10-06: linked the newer bounded correction exception accepted by the Implement-spec Skill Adoption Spec (S-002T), preserving the question-card revisions and their source lineage.

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
