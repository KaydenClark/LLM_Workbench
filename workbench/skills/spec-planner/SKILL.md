---
name: spec-planner
description: Adopt the assigned Spec Planner stance for one Workbench Spec at flight launch within existing authority.
---

# Spec Planner

## Purpose

Plan small Tasks and parallel vertical slices for the one assigned Spec from
current Actuality when its flight launches, and hand the executable plan to
Spec Manager.

Adopt only the stance already set in the assigned SPEC and TASK. It is
composed with an already assigned Dispatcher role
(`workbench/specs/S-002D-dispatcher-role/SPEC.md`): the role supplies the scope
(one Spec and its branch) and the dispatch responsibility; this stance supplies
the planning method and obligations. A stance
never grants, removes, or transfers authority: the owner request, Workbench
controls, repository permissions and governing context establish it first.
Loading this skill never spawns an agent. Changing stance alone creates no
handoff; continuation uses the existing Workbench owners when execution crosses
a meaningful boundary. Do not choose or record a new normal stance or invent a
next task. Troubleshooting stance selection is outside this skill. The
accepted role model is
`workbench/docs/adr/000P-roles-scope-work-and-stances-define-the-job.md` and
`workbench/wiki/design-concepts/roles-and-stances.md`.

## Method / Posture

Resolve the assigned Spec and support lanes through `workbench/manifest.json`.
Plan only at flight launch or Spec activation, and only for the assigned Spec.
Never enumerate execution Tasks when merely authoring a planned Spec: a planned
Spec gets no Tasks until the same request activates it.

Before cutting anything, inspect live Actuality: the Spec's accepted
requirements, decisions and acceptance lines, the source and tests they cite
at the current integration tip, the remaining gaps its evidence log records,
and its dependencies on other Specs. Plan from what is verified now, not from
the Spec's original assumptions; record what was inspected and at which commit.

Cut small complete-path vertical slices with `tracer-bullet` discipline: each
Task pierces every layer its acceptance line needs and finishes in one Chat.
Give every Task explicit acceptance (the Spec lines it satisfies), the proof it
must produce, its dependencies (`Blockers` holds only `S-###`/`TK-###` ids)
and one named writer per shared file. State which groups may run concurrently
within the Spec and which wait on others; serialize conflicting writes under
the named writer rather than splitting one file between Tasks.

Compose `to-tasks` for the record shape: each slice is a `tasks/TK-###/TASK.md`
with the title line, `**Stance:**`, `**Blockers:**`, `**Destination:**` and
`**Planned verification:**` the parser requires. Allocate every identifier with
`node workbench/tools/spec-workbench.mjs next-id S-### --prefix TK`, run
against the current integration tip immediately before committing, never by
hand: an identifier reserved only on an unpushed branch does not hold. Activate
once with `node workbench/tools/spec-workbench.mjs convert-tasks S-### --activate`;
after that the Spec's Latest event and Next gate are written by hand at each
transition.

Workers may help author Tasks. Assign each a bounded slice to draft, then
reconcile their drafts as the single Spec writer: the Dispatcher alone writes
`SPEC.md`, the Task records and the projections. Keep
a proposed Task distinct from an executable assignment; a draft becomes
executable only when the reconciled record names its acceptance, proof,
dependencies, writer and stance.

## Obligations

Stay inside the assigned Spec boundary. Surface cross-Spec dependencies and
shared-file collisions with another lane to the Director instead of enlarging
the Spec or duplicating another lane's work, and record the dependency in the
Spec's `Dependencies And Blockers`. Leave a slice that waits on an unanswered
owner decision uncut and record the open decision in the Spec. A Dispatcher or
Worker never approves its own candidate; independent-review eligibility follows
the actual agent and context, and changing stance does not clear prior
involvement. Import no scheduler, model allocation or external repository
prerequisite; report a host that cannot dispatch rather than inventing one.

## Completion / Exit Condition

The plan is complete when the Spec's `Vertical Implementation Slices` names
each Task record, its group, which groups run concurrently, the writer of every
shared file and the open gates; the evidence log carries the launch row naming
the Actuality inspected and the identifiers allocated; and
`node workbench/tools/spec-workbench.mjs render` and
`node workbench/tools/spec-workbench.mjs doctor` accept the result. Hand the
plan and its open gates to the Dispatcher's Spec Manager stance
(`workbench/specs/S-002G-spec-manager-stance/SPEC.md`) for dispatch and
monitoring. Planning delivers no Task, closes no gap and claims no owner
approval.
