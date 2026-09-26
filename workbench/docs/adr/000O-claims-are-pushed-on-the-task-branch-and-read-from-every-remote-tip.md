---
date: 2026-09-26
canonicalized_in:
  - workbench/specs/S-00V-portable-workbench/SPEC.md
---

# Claims are pushed on the task branch and read from every remote tip

## The owner's decision

The owner locked this on 2026-09-22 as PW-6 (decision-007 in the grilling
record `portable-workbench-cloud-deployable-2026-09-22`): "Owner approved
option 1 (push the claim, read the remotes)", with no direct claim commit on
integration.

`claim` creates the task branch from the integration branch, commits the claim
(the Task record set to in-progress, the Spec header's owner, date and event)
as that branch's first commit, and pushes the branch immediately. `next` and
`claim` fetch every ref from origin, read the integration branch as the base
state and overlay Task state from every remote branch tip; a Task in-progress
at any remote tip is taken. The pull request into integration carries the
claim's closure and Receipt rows with the work, so integration stays
review-only and "never commit directly to integration" is untouched. An
abandoned branch abandons its claim with it; the existing stale-claim rule
covers dead instances. A local session with no remote falls back to today's
local-only behavior and reports that it did.

Considered and rejected (owner, PW-6): direct claim commits to integration -
ten instances race on the push, it breaks the review gate, and a stale claim
needs a second direct commit to clear. Branch-name-as-claim - the branch
carries no record and no agent. Optimistic collision at the review gate - it
throws away whole sessions.

## The agent's implementation choices

These are S-00V TK-01L's implementation of the decision, not part of the
owner's lock; each stays open to his correction.

- **Existing task branch.** Every lane in this repository already cuts its own
  branch before claiming. Claim cuts a new branch only from a base state - the
  declared integration branch, the declared default branch, or a detached
  HEAD. On any other branch it commits the claim there and pushes it, creating
  no second branch.
- **Push target.** The claim is always pushed to the same-named remote branch
  and never to integration or the default branch, even when the local branch
  tracks `origin/integration` (as `git switch -c X origin/integration` sets
  up); claim refuses a push whose target would be either.
- **What "taken" means.** A tip holds a claim on a Task when it moved that Task
  to in-progress, or on to done awaiting review, away from its status on
  `origin/<integration>`. Comparing with the base keeps a status every branch
  merely inherited from integration from counting as a claim by all of them.
  The session's own branch (its upstream and its same-named remote branch) is
  never a competing claim, so an instance resumes its own work.
- **When a room coordinates.** Coordination needs a Git work tree, a remote
  named `origin`, an integration branch declared in the manifest
  ([ADR-0039](0039-the-integration-branch-is-a-manifest-declared-fact.md)) and
  `origin/<integration>` to read as the base. Missing any of them, claim and
  next keep the local behavior and say which one was missing. An explicit
  `--local` keeps the local behavior in a coordinated room and says so.
- **Failure is visible and whole.** A claim that cannot fetch is refused before
  anything is written; `next` answers from the last fetched refs and reports
  the failed fetch. A rejected push undoes the claim commit, returns to the
  starting checkout and removes the branch the claim cut, so nothing reports a
  claim that did not reach the remote. Claim refuses uncommitted tracked
  changes on a base checkout rather than carrying them onto the new branch,
  and refuses uncommitted changes under its own paths (the specs lane and the
  projections) rather than sweeping them into the claim commit.
- **The claim commit.** `Claim <Spec> <Task>` carries the Task record, the
  Spec header and the re-rendered projections, so the new branch is
  doctor-clean. The default branch name is the agent's leading word, then the
  Spec and Task (`claude-lane-F` claiming S-00V TK-01L is `claude/s00v-tk01l`);
  `--branch NAME` overrides it. Fetches prune, which is how a deleted branch
  releases its claim.

Consequences: `workbench/tools/claim-coordination.mjs` (a managed runtime
tool) carries the mechanism; `spec-workbench.mjs` `next` and `claim` return a
`coordination` object in a coordinated room, `claim` always returns one, and
the CLI reports local selection, a failed fetch and each skipped remote claim
on stderr. The AGENTS.md Git Rules and the RUNBOOK claim procedure are
reworded by S-00V TK-01P, the Taskboard's display of in-flight remote claims is
S-00V TK-01M, and the round-trip fixtures claim with `--local` until S-00V
TK-01N makes them claim by pushing. A lane procedure that commits the claim by
hand after running `claim` now finds nothing to commit.

Provenance: owner decision PW-6 (decision-007), locked 2026-09-22 in the
grilling record `portable-workbench-cloud-deployable-2026-09-22` and carried
into [S-00V](../../specs/S-00V-portable-workbench/SPEC.md) Desired Behavior 4
and Decisions And Contracts; implemented by S-00V TK-01L.
