---
name: implement
description: Implement one eligible Workbench task through verified remote recovery.
---

Implement one eligible task from the assigned stable `SPEC.md`. Stability names its identity, not a fixed folder;
resolve its current route through the manifest and native lifecycle tools. One invocation
owns one task and one durable writer lane.

For v3 work, `workbench/manifest.json` is the support-path authority; the
manifest-aware spec tool resolves the assigned `SPEC.md`. Do not write a root
`specs/` fallback or copy the global core into a project-local skills tree.
Authorized room-local extensions follow the Runbook ownership procedure.

## 1. Situate the slice

Verify the repository root, branch, remote, upstream, and dirty state. Read the
nearest `AGENTS.md` and its `RUNBOOK.md`, then run:

```bash
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-###
```

Continue when the explicitly assigned task is ready or resumable and the
working tree can be safely attributed. `next` supports owner-directed pickup;
it does not override an explicit assignment. Use the stance assigned in SPEC
and TASK, and investigate within that task without inventing another queue item.
Resolve the Task's `TASK.md` through the Spec and manifest; read its destination,
blockers and receipt rows, plus the objective's notepad. If already in progress,
verify its owner, branch and achieved proof and resume without a second claim.
For a planned or table-backed packet, follow the Runbook's native activation
and conversion route only under existing authorization; retain the existing
Task ID. Never manufacture a replacement Task to avoid a blocker.

Name the authorized endpoint before editing: scoped Worker handback, a draft
candidate, or reviewed integration, as the request and controls actually allow.
A ready slice must belong to this writer; claim it:

```bash
node workbench/tools/spec-workbench.mjs claim S-### --agent NAME
```

The slice is situated when one eligible task, its acceptance boundary, its
public testing seam, and its single writer are explicit.

## 2. Drive the behavior

Use red/green/refactor at the agreed seam:

1. Add or change the smallest durable test that expresses the task behavior.
2. Run it and observe the expected red failure.
3. Implement the smallest change that turns it green.
4. Refactor while the focused test stays green.

Run focused checks during the loop. Finish with every project-owned verification
command required by `RUNBOOK.md`. The behavior is driven when the expected red
and green results are named and the full required gate is green.

## 3. Document and checkpoint

Update the owning documentation named by `AGENTS.md`; keep capability state and
proof in the assigned Spec and Task; keep the Taskboard a generated projection.
Record meaningful checks while the Task is still in progress, including the
expected red failure, green result, changed documentation and remaining gaps:

```bash
node workbench/tools/spec-workbench.mjs receipt S-### --task TK-### \
  --tests "ACTUAL COMMANDS AND RESULTS" --docs "OWNERS UPDATED OR reason" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Compose `/to-docs` for changed truth and `/save` for authorized persistence.
Create a truthful in-progress checkpoint: stage only this writer's named files,
commit and push to the assigned branch, fetch that branch, then prove
`git merge-base --is-ancestor <commit> <remote>/<branch>` against the fresh ref.
Also compare the advertised remote tip with the intended candidate when handing
off an exact head. A failed push or fetch is pending recovery, never success;
retain the local commit and prepared publication details and name the blocker.
Do not copy credentials or expand access to bypass an unavailable route.

Record the comparison base as `BASE_SHA` and the remotely verified checkpoint as
`HEAD_SHA`. This step is complete only when the remote is the recovery point for
the exact code, tests, documentation, and in-progress spec state under review.

## 4. Review at the relevant boundary

Use review and verification practices to challenge the work before calling it
done. Earlier review is support, not a mandatory independent ceremony per
task. Self-review can find issues while Builder work continues. Worker self-check
compares the scoped diff, acceptance, test results, documentation and receipt
claims, fixes authorized defects and hands that proof to the Dispatcher (or
the assigned owner). Normal Task handback does not require separate Task
approval. It does not authorize a Worker to approve the assembled Spec, record
owner Human QA, or merge a candidate still awaiting review. A draft-only endpoint
stops with the immutable candidate and pending gates named.

While the room's Task-PR exemption holds (exemption 2 of its release Spec, which lands each Task as its own PR), a Task PR still requires separate-context review of its fixed diff as an immutable candidate before it lands: run `/code-review` against exact `BASE_SHA` and `HEAD_SHA`, including controls, the assigned spec, tests and consequential report claims, reported by `gate --task TK-### --spec S-###`.
Repair only authorized findings, create a new truthful checkpoint, and re-review the changed candidate. The exact-head review must pass before the Task PR lands.
At the declared integration branch (`git.integrationBranch` in `workbench/manifest.json`), a separate-context review of the assembled Spec is required, obtained with `report S-### --candidate <sha>` and bound to its content digest, recorded with `verdict`. Do not call an intermediate checkpoint or green self-review an integration PASS.

## 5. Close and recover remotely

Close the task only after its scoped acceptance and required proof are met.
If the task includes integration, the separate-context gate above also applies:

```bash
node workbench/tools/spec-workbench.mjs close S-### \
  --proof "NAMED VERIFICATION" \
  --docs "DOCS UPDATED OR Docs checked; no update needed + reason" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Commit the close evidence and generated projection, make the final push, and
fetch and verify containment of the local commit in the remote branch, naming
both exact SHAs. If the task remains
incomplete, its in-progress checkpoint is the handoff; closing is not truthful.

When integration is authorized, automated delivery stops at the declared
integration branch after the
repository's review gates pass. The owner controls promotion from that branch
to the release branch.

Report the authorized endpoint actually reached, accounted-for worktree state,
exact candidate and recovery ref, checks, documentation, and next gate. A local
checkpoint with blocked publication remains partial; never call it remote
recovery, integration approval, installed behavior, or owner acceptance.
