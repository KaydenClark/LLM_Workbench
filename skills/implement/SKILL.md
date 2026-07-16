---
name: implement
description: Implement one eligible Workbench ticket through verified remote recovery.
disable-model-invocation: true
---

Implement one eligible ticket from the assigned stable `SPEC.md`. One invocation
owns one ticket and one durable writer lane.

## 1. Situate the slice

Verify the repository root, branch, remote, upstream, and dirty state. Read the
nearest `AGENTS.md` and its `RUNBOOK.md`, then run:

```bash
node tools/spec-workbench.mjs doctor
node tools/spec-workbench.mjs next --json
node tools/spec-workbench.mjs show S-###
```

Continue only when `next` returns the assigned ticket as ready or resumable and
the working tree can be safely attributed. For a ready slice, claim it:

```bash
node tools/spec-workbench.mjs claim S-### --agent NAME
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

## 4. Review the immutable checkpoint

Run `/code-review` as a separate review task against `BASE_SHA` and `HEAD_SHA`.
That fixed immutable-SHA review must inspect the pushed commit, not later
working-tree state.

Resolve each in-scope finding through the same red/green loop. Update its owning
documentation, create and push a new truthful checkpoint, verify the new remote
SHA, and re-review the newly fixed `BASE_SHA` to `HEAD_SHA` range. Repeat until
the exact-head review is green with no unresolved in-scope finding.

If review cannot finish, leave the ticket in progress and yield only after its
latest truthful checkpoint is remotely recoverable.

## 5. Close and recover remotely

Only after the exact-head review is green, close the ticket with its acceptance
and proof:

```bash
node tools/spec-workbench.mjs close S-### \
  --proof "NAMED VERIFICATION" \
  --docs "DOCS UPDATED OR Docs checked; no update needed + reason" \
  --remaining-gap "GAP OR none"
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
```

Commit the close evidence and generated projection, make the final push, and
verify the remote branch resolves to that local commit. If the ticket remains
incomplete, its in-progress checkpoint is the handoff; closing is not truthful.

Automated delivery stops at `integration` after the repository's review
gates pass. The owner controls promotion from integration to the release branch.

The invocation is complete only when the worktree state is accounted for and
the pushed remote commit is the recovery point.
