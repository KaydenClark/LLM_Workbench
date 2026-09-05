---
name: implement
description: Implement one eligible Workbench ticket through verified remote recovery.
disable-model-invocation: true
---

Implement one eligible ticket from the assigned stable `SPEC.md`. One invocation
owns one ticket and one durable writer lane.

For v3 work, `workbench/manifest.json` is the support-path authority; the
manifest-aware spec tool resolves the assigned `SPEC.md`. Do not write a root
`specs/` fallback or a project-local skills tree.

## 1. Situate the slice

Verify the repository root, branch, remote, upstream, and dirty state. Read the
nearest `AGENTS.md` and its `RUNBOOK.md`, then run:

```bash
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-###
```

Continue when the explicitly assigned ticket is ready or resumable and the
working tree can be safely attributed. `next` supports owner-directed pickup;
it does not override an explicit assignment. Use the stance assigned in SPEC
and TASK, and investigate within that task without inventing another queue item. For a ready slice, claim it:

```bash
node workbench/tools/spec-workbench.mjs claim S-### --agent NAME
```

The slice is situated when one eligible ticket, its acceptance boundary, its
public testing seam, and its single writer are explicit.

## 2. Drive the behavior

Use red/green/refactor at the agreed seam:

1. Add or change the smallest durable test that expresses the ticket behavior.
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
the ticket remains in progress; commit and push it, then compare the local SHA
with the remote branch SHA.

Record the comparison base as `BASE_SHA` and the remotely verified checkpoint as
`HEAD_SHA`. This step is complete only when the remote is the recovery point for
the exact code, tests, documentation, and in-progress spec state under review.

## 4. Review at the relevant boundary

Use review and verification practices to challenge the work before calling it
done. Earlier review is support, not a mandatory independent ceremony per
ticket. Self-review can find issues while Builder work continues.

A proposed merge requires separate-context review before branches combine at
the declared integration branch (`git.integrationBranch` in
`workbench/manifest.json`). Run `/code-review` against immutable `BASE_SHA` and `HEAD_SHA`,
including controls, the assigned spec, tests and consequential report claims.
Repair only authorized findings, create a new truthful checkpoint, and re-review
the changed candidate. The exact-head review must pass before integration.
Do not call an intermediate checkpoint or green self-review an integration PASS.

## 5. Close and recover remotely

Close the ticket only after its scoped acceptance and required proof are met.
If the ticket includes integration, the separate-context gate above also applies:

```bash
node workbench/tools/spec-workbench.mjs close S-### \
  --proof "NAMED VERIFICATION" \
  --docs "DOCS UPDATED OR Docs checked; no update needed + reason" \
  --remaining-gap "GAP OR none"
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Commit the close evidence and generated projection, make the final push, and
verify the remote branch resolves to that local commit. If the ticket remains
incomplete, its in-progress checkpoint is the handoff; closing is not truthful.

Automated delivery stops at the declared integration branch after the
repository's review gates pass. The owner controls promotion from that branch
to the release branch.

The invocation is complete only when the worktree state is accounted for and
the pushed remote commit is the recovery point.
