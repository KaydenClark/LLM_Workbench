---
name: publish
description: "Publish one authored stage of Workbench records from its branch to the manifest-declared integration branch and prove it arrived: the gate its PR form names, the merge, containment of the exact candidate and a byte read-back of every changed owner. Use as the publisher a promote-decision run dispatches after Record, Map and Plan, or whenever a branch of authored records must reach integration before other work depends on it."
---

# Publish

Publish is the workflow verb between stages: an authored stage on a branch
becomes shared Workbench state only when integration contains it and its
changed owners read back there. A local write or a pushed branch is an earlier
boundary. This skill moves one candidate through the existing gates and proves
the result. It authors nothing: every finding goes back to the author, and
`main` stays with the owner.

Four words carry the job:

- **Candidate**: the full commit SHA the author finished at. The publication
  is of that SHA; a different SHA is a different candidate.
- **Form**: what the PR is to the gate. The gate knows a Task PR (a Task with
  its Spec still open, which every PR is while the bootstrap exemption holds)
  and a Spec candidate (an assembled Spec presented at Verify). The form
  decides which checks the Runbook's closeout block runs.
- **Containment**: `git merge-base --is-ancestor CANDIDATE origin/integration`
  against a ref fetched after the merge. A tracking ref, tip equality or the
  merge response alone proves nothing.
- **Read-back**: every owner the stage changed holds the candidate's bytes at
  the fetched integration tip.

## Steps

1. **Pin the candidate.** Take the branch, the full candidate SHA, the form,
   its Spec and Task IDs, the list of owners the stage changed, and the
   cleanup instruction (`CLEANUP=yes` unless the owner deferred it). Check
   the SHA out in a clean tree and confirm the branch tip equals it. Done
   when every input is named and the tree is clean at the candidate. An
   input the author cannot supply goes back to the author.

2. **Sit on fresh integration.** Fetch. When integration moved since the
   candidate branched and the two touch a shared owner, rebase onto the
   fetched tip and rerun the stage's checks; the rebased tip replaces the
   candidate in every later step. A rebase that changes content goes back to
   the author as a new hand-over. Done when the candidate's base is the
   fetched integration tip.

3. **Open or reuse the PR.** One PR per stage, targeting integration, head at
   the candidate. Write its body with [`pr`](../pr/SKILL.md) and carry the two
   merge answers from the
   [Task merge rule](../../../AGENTS.md#task-merge-answers-and-verify-review):
   can this merge into the branch it targets, and did it complete the stage.
   Done when the PR exists, its head equals the candidate and its body
   carries both answers.

4. **Run the closeout block.** Export the variables the Runbook's
   [closeout](../../../RUNBOOK.md#version-control-procedures) names and run
   the block as written: `TASK_ID` set for a Task PR, unset for a Spec
   candidate. The gate is what refuses, the block stops on its first
   failure, and `--match-head-commit` pins the merge to the candidate. Done
   when the block prints `integration contains the reviewed work`. A stop
   anywhere earlier is a finding for the author, returned with the failing
   line and the tree untouched. A stage with no Spec behind it has no form
   the gate knows; stop here and return that as a blocker to whoever
   dispatched you.

5. **Read every changed owner back.** Fetch again and compare the candidate
   to the fetched tip over the stage's owner list:
   `git diff --stat CANDIDATE origin/integration -- OWNERS` prints nothing.
   Done when every listed owner is identical. A difference means integration
   carries a later change to that owner; it goes to the author as a finding.

6. **Report.** Name the stage, the candidate SHA, the PR, the fetched
   integration SHA that contains it, the checks the block ran, the owners
   read back, the cleanup state, and whether the next stage is released.
   Done when another agent can resume from the report alone.

Release the next stage only after step 6. When several publications share
the target, publish them one at a time: the second candidate waits for the
first's read-back, then takes step 2 against the tip that read-back proved.
