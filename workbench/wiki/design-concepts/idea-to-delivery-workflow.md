---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner's workflow map of 2026-09-24, moved here from the Blueprint by the owner's Blueprint teardown answer of 2026-10-03, rewritten in the workflow verbs
source_paths:
  - RUNBOOK.md
  - workbench/skills/promote-decision/SKILL.md
  - workbench/docs/adr/proposed/001A-promote-publishes-confirmed-documentation-specs-and-task-plans-before-implementation.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md
  - workbench/docs/ddr/000A-the-workbench-aligns-to-the-owner-s-concept-and-delivers-on-it-recursively.md
  - workbench/docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md
  - workbench/landmark-tracker/landmarks/LMK-000K.json
  - AGENTS.md
parent: none
authorized_by: the owner-confirmed workflow reference update of 2026-10-08; earlier source: the owner's Blueprint teardown answer that the workflow map moves to the Workflow landmark and the Wiki, 2026-10-03
last_verified: 2026-10-08
---

# The Workflow From Idea To Delivery

The Blueprint used to carry the owner's workflow map of 2026-09-24 word for
word, as a diagram of arrows and braces. The owner's teardown answer moved it:
it goes to the Workflow landmark and the Wiki, "rewritten in the workflow
verbs", and is no longer kept verbatim. This page is that rewrite for the Wiki.
It explains how the work moves. It authorizes nothing: the
[decision records](#evidence-and-sources) and the controls govern, and the
Workflow landmark (the Tracker's "Workbench Workflow" landmark record) holds its
structured account.

## The loop in the verbs

The maintained [Runbook reference and diagram](../../../RUNBOOK.md#workflows)
show the owner-confirmed parent workflows, their ordered verbs, stage
publications and skill routes. Confirm ends Explore; Promote consumes the
confirmed concept. Journey remains the per-Task build run. Judge retains
independent Review, integration verification and owner approval, followed by
owner-approved main delivery and cleanup in Complete. A failed Review returns
to Map, Plan and Journey; an owner send-back at Approve returns to Align at the
scope the failure implicates. This page explains the route; it keeps no second
diagram or authoritative sequence.

The owner brings an idea. Before it is clear enough to Align, the owner may
explore it in conversation. Align is the inquiry in which the owner and the
agents reach a shared design concept; grilling supports it, and brainstorming,
wayfinding and research can open it or settle a named uncertainty in it. It
ends only when the owner and the agent explicitly confirm the concept, which is
Confirm. Only a confirmed concept is mapped, planned or implemented
([DDR on mapping only what is confirmed](../../docs/ddr/000B-only-a-confirmed-concept-is-mapped-planned-or-implemented.md)),
and confirming it authorizes the agents to carry it to its endpoint
([DDR on what confirmation authorizes](../../docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md)).
A prototype, where one is used, is optional and lands nothing in enduring
context ([DDR on prototypes](../../docs/ddr/000D-prototype-needs-no-map-and-lands-nothing-in-enduring-context.md)).

## Promoting a confirmed decision

The [Promote Decision skill](../../skills/promote-decision/SKILL.md) carries one
confirmed decision through Record, Map and Plan, with each stage published
before the next depends on it. Record is the `to-docs` operation. A nearer
endpoint limits the run; pending questions remain in their working source.
The [proposed Promote Decision record](../../docs/adr/proposed/001A-promote-publishes-confirmed-documentation-specs-and-task-plans-before-implementation.md)
records this design and its rationale. This Workbench maintainer operation
prepares shared decisions and plans; implementation follows its own workflow.

## What each line of the old map became

| The 2026-09-24 map said | In the workflow verbs |
|---|---|
| Idea; optional conversation to explore the idea | Idea, with exploration in conversation before Align |
| Align through grill-me, wayfinding, brainstorming and needed research | Align |
| Confirm shared design concept | Confirm |
| Blueprint the idea | The Blueprint is written like any Canon artifact: its change is mapped, planned and implemented, and it goes through the verbs, not through a Spec and Tasks ([the workflow verbs decision](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)) |
| Main branch, Integration branch, Spec branch | The branch topology for coordinated delivery: a Spec branch is cut from integration, and no role works from main |
| Create Spec | Map writes the Spec, the landmark and any decision record |
| Create Tasks, Update Taskboard | Plan writes the Tasks; the Taskboard is a generated projection of them |
| Pick up a hot non-conflicting Task, create its branch and worktree, Implement | Implement, one Worker per Task, in parallel where Tasks do not conflict |
| QA / Verify, Commit and push, Review Task | Check, QA and Submit: the Worker's deterministic checks, its self-judgement, and the merge request carrying its merge answers; a Task has no review or approval gate |
| Merge Task into Spec branch, Delete Task branch after containment | Containment, not QA; the branch goes once the Spec branch contains it |
| Repeat until the Spec is assembled | Implement continues until the assembled Spec can be checked |
| Whole-Spec QA / Verify; If findings, create corrective Tasks | Review on the assembled Spec, then Verify; a failed Review goes back to Map, Plan and Journey under the open Spec |
| If approved, merge Spec into Integration | The Spec merges into integration after the separate-context approval |
| Owner Human QA on Integration; Pass, owner-only merge into Main | Human QA, the owner's evaluation of delivered work; only the owner merges integration into main |
| Fail, return to Align and revisit the concept or Blueprint as needed | The workflow loops to Align at the scope the failure implicates |

Two lines of the old map read differently from how they look, and the owner
confirmed the reading on 2026-09-24: the per-Task "QA / Verify" and "Review
Task" are the Worker's self-check and hand-back, not a separate review gate.

## Delivery inside the Journey

Delivery is recursive: a need creates a Spec, the Spec's Tasks do the work, and
a Spec that is assembled and approved merges into integration. The Workbench's
delivery altitudes are explained on [the three altitudes of delivery](delivery-altitudes.md).

Within a Spec, a Dispatcher sends a Worker to each hot Task. The Worker
implements it with red/green TDD, verifies the behavior that actually
resulted, self-checks its claims against its proof and hands back. The
Dispatcher reads that report and chooses the next step, so many Workers can run
at once on Tasks that do not conflict.

When the Spec is assembled, its Dispatcher verifies the whole Spec against its
own destination. The Director then approves the immutable assembled candidate in
a separate context before it combines into integration; neither the Dispatcher
nor any agent that implemented a Task in it can give that approval. A Review
that fails sends the Spec back to Map, Plan and Journey, and the next assembled
candidate is reviewed once more; there is no set number of rounds. The two QA
gates, their roles and their timing belong to
[the QA gates decision](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
and [the controls](../../../AGENTS.md#git-rules) own the operative Git gate.
How the corrective work is shaped, and when a gap becomes a new Spec, is being
reworked in the Corrective Work Rules Spec; the controls own the rule until that
lands.

## Human QA, closure and the return to Align

The owner performs Human QA on integration. Its timing is the owner's choice,
and approval is recorded per Spec and bound to the content the owner inspected;
monitoring and a passing review are not approval. No Git merge closes a Spec:
after the reviewed delivery on integration and the owner's approval, the
approved change is verified on the default branch, and only then is the Spec
completed. Its capability knowledge is then captured into the features Wiki, the
Spec and its Tasks are retired, and the transient records are discarded, with
Git keeping the history. This is the scaffolding rule of
[the decision that working artifacts are cleared away once their knowledge is kept](../../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md).

Failed Human QA returns to Align at the scope the failure implicates, and the
loop runs again from there. A defect is not by itself evidence that the shared
design concept was wrong, so the return is chosen at the scope the diagnosis
supports ([DDR on aligning and delivering recursively](../../docs/ddr/000A-the-workbench-aligns-to-the-owner-s-concept-and-delivers-on-it-recursively.md)).

## What is not settled here

The Landmark Tracker's records and its tests still use the earlier step names
until the landmark migration lands. The Contract's role text still says the
Director covers integration; the accepted role decision gives integration to a
Captain, and the [roles and stances](roles-and-stances.md) page explains the
change. Inference: this page names the Director where the current controls do,
and those words move with the controls.

## Evidence and Sources

- [The workflow is eight verbs and each verb writes the plane its claims live on](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md):
  the verbs and what each writes.
- [Work passes two QA gates](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md):
  the gates, Human QA, closure order and direct Blueprint Tasks.
- [Blueprint, Spec and Task are three altitudes of one delivery chain](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md).
- [The Workbench aligns to the owner's concept and delivers on it recursively](../../docs/ddr/000A-the-workbench-aligns-to-the-owner-s-concept-and-delivers-on-it-recursively.md).
- [AGENTS](../../../AGENTS.md): the operative gates, branch route and closure commands.
- The Tracker's [Workbench Workflow landmark record](../../landmark-tracker/landmarks/LMK-000K.json):
  the structured account of this landmark.
- The original map, as the owner confirmed it, is recoverable from Git at
  commit 482dc6b (delivered by PR #151, the pull request that carried it).

## History

- 2026-10-03: created in the Blueprint short-page work (the Blueprint Short Page
  Spec) from the owner's teardown answer that the workflow map moves to the
  Workflow landmark and the Wiki, rewritten in the workflow verbs.
- 2026-10-05: the owner added QA and Submit to the Journey and moved Review
  after it, with a failed Review going back to Map, Plan and Journey.

- 2026-10-07: linked the one-decision Record, Map, Plan and publication operation, retaining the earlier workflow history.

- 2026-10-08: the owner-confirmed workflow reference update routes the current map and diagram to the Runbook, preserving the later gates and historical accounts.
