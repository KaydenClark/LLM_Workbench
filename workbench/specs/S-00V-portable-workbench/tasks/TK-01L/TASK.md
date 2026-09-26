# TK-01L - `claim` pushes the claim on its task branch and `next` skips a Task claimed on any remote tip

**Task ID:** TK-01L
**Spec ID:** S-00V
**Slice:** `claim` pushes the claim on its task branch and `next` skips a Task claimed on any remote tip
**Status:** ready
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 4 (`claim` pushes the claim on the task branch; a second instance running `next` after a fetch does not receive that Task)
**Stance:** Builder
**Planned verification:** Red: a bare-remote fixture in `tools/test-spec-workbench.mjs` where instance A claims (task branch cut from integration, claim as its first commit, pushed) and instance B runs `next` after a fetch and does not receive that Task; a second test for the no-remote fallback that says so; green after `claim`/`next` change; the claim-on-branch ADR; `adr validate`; full AGENTS suite; separate-context review.

## Delivery

Desired Behavior 4 and grilling decision-007. `claim` creates the task branch
from the integration branch, commits the claim as the first commit and pushes.
`next` and `claim` fetch every ref from origin, read integration as the base and
overlay Task state from every remote tip; a Task in-progress on any tip is
taken. The PR carries the claim's closure with the work, so integration stays
review-only. A session without a remote keeps today's local behavior and says
so. Record claim-on-branch with fetch-all (hard to reverse, a real trade-off
against direct integration commits) in a new ADR. `occupiedIdentities` in
`workbench/tools/spec-workbench.mjs` already scans every `refs/remotes` tip:
follow that pattern.

**Collision hold.** `S-00M` in Blockers stands for the narrower real condition:
S-00M TK-001 (the repository-state reader) is contained in `origin/integration`.
Reuse that reader for branch, upstream and dirty state instead of writing a
second one. S-00M TK-002/TK-003 also edit `close` and git-state reading in
`spec-workbench.mjs` and `diagnostics.mjs`: rebase often. When S-00M TK-001 is
contained, the S-00V dispatcher removes `S-00M` from Blockers in its own commit
with an evidence row citing the containing commit.

The Taskboard display of remote claims is a separate Task because S-01V
replaces the Markdown board. Control wording (AGENTS Git Rules claim push,
RUNBOOK claim procedure) is written by the controls sweep, not here.

## Done Criteria

- Box 4 holds in the fixture: the second instance never receives the claimed
  Task.
- A push failure fails the claim visibly; nothing reports a claim that did not
  reach the remote.
