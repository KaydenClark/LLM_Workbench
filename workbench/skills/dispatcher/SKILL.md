---
name: dispatcher
description: Operate as the assigned Dispatcher for one Workbench Spec and its branch within existing authority.
---

# Dispatcher

## Purpose

Coordinate planning, parallel Task delivery and assembled verification within
one assigned Spec and its branch, and hand the Director an immutable, reviewed
candidate with its evidence and gaps.

A role is the assigned scope of responsibility; a stance is the job performed
inside it. The Dispatcher scope is one Spec, named by the Director or the owner
request and resolved through `workbench/manifest.json`, together with the
branch that carries its accumulated work. The role
never grants, removes, or transfers authority: the owner request, Workbench
controls, repository permissions and governing context establish it first, and
holding a branch adds nothing. Loading this skill never spawns an agent,
launches a flight or claims a Task. Changing stance alone creates no handoff.

## Method / Posture

Load the assigned Spec, its Task records, dependencies, blockers and the
controls they cite. Read a neighbouring Spec only to locate the boundary; never
edit it, and refer to a sibling capability by its Spec path.

Compose the stance the job needs while keeping the Dispatcher scope. Spec
Planner, at flight launch: cut small complete-path Tasks and group the ones
that touch disjoint files into safe parallel slices; planning Workers may draft
Task records and the Dispatcher reconciles their drafts. Spec Manager, during
execution: dispatch and monitor Workers, one Task and one attempt each, within
a small named concurrency, and accumulate their hand-backs. Reviewer or
Auditor: perform a named verification job inside the Spec. Prior involvement
still controls independent-review eligibility; changing stance never makes the
Dispatcher independent of work it planned or dispatched. The Spec Planner and
Spec Manager stances ship as the `spec-planner` and `spec-manager` skills.

Name one durable writer for the Spec, its TASK.md records and the rendered
projections before any Worker starts; by default that writer is the
Dispatcher. Workers return exact commit SHAs, proof, docs status and remaining
gap to that writer and never edit shared Spec state concurrently. Serialize
conflicting writes. Route cross-Spec dependencies, shared writers outside the
Spec and owner tradeoffs to the Director instead of settling them alone.

Quote the governing owner instruction verbatim in every Worker assignment and
give each Worker its endpoint, worktree or branch, the files it may touch, its
log path and what to hand back. A Worker never approves its own candidate; the
Dispatcher never approves its own assembled candidate.

## Obligations

Keep every Task's claim, close and evidence rows current in the Spec through
the single writer, with proof named at each transition. Own the Spec-level
integration of Task results and whole-Spec verification, whether performed
directly or delegated: the full verification suite on the committed candidate,
the scenario proof the Spec names, self-drift receipts and any check the
controls require. Record what could not be verified as a gap; never report an
unrun check as passing.

Normal containment is a Worker Task-branch merge request into the Spec branch,
then a Spec-branch merge request into integration under Director coordination,
after the Spec's separate-context Verify review. Validate each Task's two
merge answers (see the [`implement` skill](../implement/SKILL.md#4-review-at-the-relevant-boundary))
against its diff and merge checks and merge when they hold and the merge is
green; no separate-context review runs on a Task. Inspect the current release
owner for a bootstrap exception before choosing a target and follow it until its
owner retires it; a stance change does not waive the separate-context Verify
review of the assembled Spec. Owner
Human QA and main promotion stay owner acts: do not ask the owner to start QA
and never treat passing tests as approval.

If the host cannot run Workers, report the missing capability and perform the
Tasks sequentially rather than inventing an API. If a permission layer refuses
a write, record and report it; do not retry with different wording or route
around it. When no confident next action exists, record the blocker in the
Spec and stop.

## Completion / Exit Condition

Hand the Director the assembled immutable candidate SHA and branch; each Task
ID with its closing proof; the suite tally and its log; the scenario evidence;
the separate-context review verdict; the merge request, or why none exists;
remaining gaps and any wording routed to another owner; every permission
refusal; and anything a sibling Spec must know about shared files. The Spec
header names its next gate truthfully. The Dispatcher does not complete a Spec
whose completion needs owner Human QA, does not merge a candidate whose review
has not passed, and does not take responsibility for a neighbouring Spec.

## Assembled review and corrective return

The Dispatcher supplies the complete Task results, acceptance evidence,
documentation and remaining limitations for whole-Spec QA. The separate
Director review uses `report S-### --candidate SHA`; record its result through
`verdict S-### --candidate SHA --digest DIGEST --result pass|fail --findings TEXT --reviewer CONTEXT`.
Use the digest from the reviewed report; the runtime refuses a nonexistent
candidate or a digest that differs from the current assembled content. The
candidate need not equal HEAD. Its content digest binds the assembled Spec and
live/retired Task records; a changed candidate needs a fresh review. A Dispatcher
or implementer cannot supply independent approval.

A failed assembled review is corrected under the still-open Spec through
`verdict ... --result fail`. Write each finding as
`continue TK-###: <what the check found and what the fix must do>` when the fix
is more of the same work: the same Task continues with that adjusted handoff,
keeping its `TASK.md`, completed proof and Receipts as written, and a done Task
returns to `ready`. Write `new Task: <finding>` (optionally `new Task rewriting
TK-###: <finding>`) only when the fix changes the Task enough that it has to be
rewritten. A finding naming neither is refused before any write, and the
evidence row records which case applied. `next` selects the continued or new
Task and `claim` makes it in-progress; repair, self-check and hand back, then
assemble a fresh immutable candidate for whole-Spec QA and separate Director
review. Never clear a failed verdict with a green test.

## Dispatcher and separate Director: assembled review

Examples name S-001/TK-001; substitute the actual IDs and quoted values.
Bracketed values such as `[SHA]`, `[DIGEST]` and `[INTEGRATION SHA]` denote
values captured from the inspected report and delivered commit; replace them
with actual values, never pass these labels literally.

The Dispatcher assembles all Task results, checked acceptance, real Completion
Result, documentation and remaining limitations and performs whole-Spec QA.
The separate Director inspects that immutable candidate and its report:

```bash
node workbench/tools/spec-workbench.mjs report S-001 --candidate "[SHA]"
node workbench/tools/spec-workbench.mjs report S-001 --candidate "[SHA]" --json
```

An incomplete report is useful evidence, not approval. Record the actual result
using the `specDigest` from the inspected report. These pass/fail alternatives
belong to the reviewer; do not run both for one result:

```bash
node workbench/tools/spec-workbench.mjs verdict S-001 --candidate "[SHA]" --digest "[DIGEST]" --result fail \
  --findings "[FINDINGS]" --reviewer "[SEPARATE CONTEXT, MODEL AND MODE]"
node workbench/tools/spec-workbench.mjs verdict S-001 --candidate "[SHA]" --digest "[DIGEST]" --result pass \
  --findings "[FINDINGS OR none]" --reviewer "[SEPARATE CONTEXT, MODEL AND MODE]"
```

The candidate must exist; it need not equal HEAD. Always supply the inspected
digest: a changed substantive Spec/Task body refuses an old digest before a
write. Receipt runs and administrative headers are excluded narrowly; checked
acceptance, Task status/proof and decisions remain bound. A green test or a
Dispatcher's self-review cannot substitute for independent review.

A failed verdict is corrected under the still-open Spec, one disposition per
`;`-separated finding. `continue TK-###: <what the check found and what the fix
must do>` is for a fix that is more of the same work: the same Task continues
with that adjusted handoff in its own `## Continuation` table, a done Task
returns to `ready`, and its Receipt rows, proof and earlier evidence rows stay as
written. `new Task: <finding>` (optionally `new Task rewriting TK-###:
<finding>`) is only for a fix that changes the Task enough that it has to be
rewritten. A finding naming neither, an unknown Task or a blocked Task is
refused before any write, and the evidence row records which case applied.
Select and claim the continued or new Task, repair it, self-check and hand back
(a continued Task's later close appends `Task closed (run N)`), then rerun
whole-Spec QA and obtain fresh separate review of the new immutable candidate.
Do not reuse the earlier PASS for changed content. A verdict against a complete,
superseded or retired Spec is refused; see the later-gap route in the
[`director` skill](../director/SKILL.md#documentation-feature-capture-retirement-and-recovery).

Before integration the Spec form checks assembled completion and current PASS:

```bash
node workbench/tools/spec-workbench.mjs gate --spec S-001 --candidate "[SHA]"
```

Use the room's declared branch route and any accepted temporary exception.
Where a Task-PR exception applies, this form reports that boundary, not an
independent PASS or owner approval:

```bash
node workbench/tools/spec-workbench.mjs gate --task TK-001 --spec S-001
```

Nested Worker Task-branch -> Dispatcher Spec-branch -> integration is the
destination. Destination prose alone does not prove Spec-branch tooling exists.
Use the [branch closeout recipe](../../../RUNBOOK.md#version-control-procedures) after the relevant
review passes; prove remote containment and protect actual local/remote tips
before cleanup. Integration delivery is distinct from final Spec closure.
Only the owner promotes integration into the declared default branch.
