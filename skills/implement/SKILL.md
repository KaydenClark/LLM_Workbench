---
name: implement
description: Implement one eligible Workbench task through verified remote recovery.
---

Implement one eligible task from the assigned stable `SPEC.md`. One invocation
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
and TASK, and investigate within that task without inventing another queue item. For a ready slice, claim it:

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
proof in the assigned spec and keep `TASKBOARD.md` a generated projection. Run
the required verification and create a truthful in-progress checkpoint while
the task remains in progress; commit and push it, then compare the local SHA
with the remote branch SHA.

Record the comparison base as `BASE_SHA` and the remotely verified checkpoint as
`HEAD_SHA`. This step is complete only when the remote is the recovery point for
the exact code, tests, documentation, and in-progress spec state under review.

## 4. Review at the relevant boundary

Use review and verification practices to challenge the work before calling it
done. Earlier review is support, not a mandatory independent ceremony per
task. Self-review can find issues while Builder work continues.

While S-00O exemption 2 holds, a Task PR still requires separate-context review of its fixed diff as an immutable candidate before it lands: run `/code-review` against exact `BASE_SHA` and `HEAD_SHA`, including controls, the assigned spec, tests and consequential report claims, reported by `gate --task`.
Repair only authorized findings, create a new truthful checkpoint, and re-review the changed candidate. The exact-head review must pass before the Task PR lands.
At the declared integration branch (`git.integrationBranch` in `workbench/manifest.json`), the reviewed unit is the assembled Spec, obtained with `report S-### --candidate <sha>` and bound to its content digest, recorded with `verdict`. Do not call an intermediate checkpoint or green self-review an integration PASS.

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
verify the remote branch resolves to that local commit. If the task remains
incomplete, its in-progress checkpoint is the handoff; closing is not truthful.

Automated delivery stops at the declared integration branch after the
repository's review gates pass. The owner controls promotion from that branch
to the release branch.

The invocation is complete only when the worktree state is accounted for and
the pushed remote commit is the recovery point.
