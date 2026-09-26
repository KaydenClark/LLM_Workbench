# TK-002N - Check integration containment against the remote-tracking integration ref

**Task ID:** TK-002N
**Spec ID:** S-00J
**Slice:** Check integration containment against the remote-tracking integration ref
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Integration containment for owner approval and for `S-###:delivered` is checked against the declared integration branch's remote-tracking ref when it exists, so a stale local branch in another checkout cannot hide reviewed delivery.
**Planned verification:** Red: in a fixture room whose local `integration` branch is behind `origin/integration`, and whose blocker Spec's PASS candidate is contained only in `origin/integration`, `next --json` keeps the `S-###:delivered` dependent blocked and `recordOwnerApproval` refuses the candidate as not contained; green: both resolve through `origin/integration`, a room with no remote-tracking ref still uses the local branch, and a candidate contained only in an unpushed local `integration` is not treated as delivered when the remote-tracking ref exists.

## Outcome

Lane H's probe on integration `2bb0bf1` (2026-09-26) found that S-00J is at
reviewed integration delivery, yet `S-00J:delivered` resolved false, because
`reviewedDelivery` and `recordOwnerApproval` call
`isAncestorOfBranch(root, sha, integrationBranch)` against the local branch
name. In this shared repository the local `integration` ref is held by the
owner's checkout (at `89d4042`, far behind `origin/integration`), and Lane
worktrees must not move it. With `origin/integration`, the same probe
resolved true. TK-01S already verifies final delivery against
`origin/<defaultBranch>`; integration containment should read the same way.

## Required Behavior

- One helper resolves the ref used for integration containment: the declared
  integration branch's remote-tracking ref (`origin/<branch>`, via the
  existing remote-ref resolution TK-01S reuses) when it exists, otherwise the
  local branch. Reads local refs only; never fetches.
- `reviewedDelivery` (the `S-###:delivered` resolver) and `recordOwnerApproval`
  containment use it. Audit every other integration-containment check in
  `workbench/tools/` (for example doctor's git findings) and route each
  through the helper, or record in the close proof why it stays local.
- Error messages name the ref actually checked.
- Existing behavior for rooms without a remote is unchanged; S-00U F1/F2/F3/F6,
  TK-01R, TK-01S, TK-01T and TK-02J tests stay green.

## Released Write Lane

- `workbench/tools/spec-report.mjs`, `workbench/tools/spec-workbench.mjs`
  (containment call sites and the helper only)
- `tools/test-spec-report.mjs`, `tools/test-spec-workbench.mjs`

RUNBOOK wording ("fetch integration before relying on `S-###:delivered` or
recording approval") belongs to S-00P; record it as a remaining gap.

## Execution Proof And Exit

Show red then green at `next --json`, `claim` and `recordOwnerApproval`
through fixtures, run the full suite on the committed candidate, capture
guardrail and self-drift receipts, and return candidate SHA, changed paths,
actual checks, documentation status and remaining gaps to the Dispatcher.
