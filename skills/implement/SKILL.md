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

## 3. Review and document

Run `/code-review` as a separate review task against the fixed delivery diff.
Resolve in-scope findings through the same red/green loop and repeat the review.
Update the owning documentation named by `AGENTS.md`; append capability proof to
the assigned spec and keep `TASKBOARD.md` a generated projection.

This step is complete when the fixed diff has no unresolved in-scope finding,
every durable change has one documentation owner, and the spec evidence names
the actual verification.

## 4. Close and recover remotely

Close the ticket only after its acceptance and proof are true:

```bash
node tools/spec-workbench.mjs close S-### \
  --proof "NAMED VERIFICATION" \
  --docs "DOCS UPDATED OR Docs checked; no update needed + reason" \
  --remaining-gap "GAP OR none"
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
```

Create a truthful checkpoint, commit and push the task branch, then verify the
remote branch resolves to the local commit. If the ticket remains incomplete,
leave its status truthful, record the blocker or remaining gap, and push that
checkpoint before yielding.

Automated delivery stops at `integration` after the repository's review
gates pass. The owner controls promotion from integration to the release branch.

The invocation is complete only when the worktree state is accounted for and
the pushed remote commit is the recovery point.
