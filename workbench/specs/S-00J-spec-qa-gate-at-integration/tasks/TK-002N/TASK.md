# TK-002N - Check integration containment against the remote-tracking integration ref

**Task ID:** TK-002N
**Spec ID:** S-00J
**Slice:** Check integration containment against the remote-tracking integration ref
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Integration containment for owner approval and for `S-###:delivered` is checked against the declared integration branch's remote-tracking ref when it exists, so a stale local branch in another checkout cannot hide reviewed delivery.
**Planned verification:** Red: in a fixture room whose local `integration` branch is behind `origin/integration`, and whose blocker Spec's PASS candidate is contained only in `origin/integration`, `next --json` keeps the `S-###:delivered` dependent blocked and `recordOwnerApproval` refuses the candidate as not contained; green: both resolve through `origin/integration`, a room with no remote-tracking ref still uses the local branch, and a candidate contained only in an unpushed local `integration` is not treated as delivered when the remote-tracking ref exists.
**Proof:** Implementation 9fd7dee (claim d3d4d33). Red at the claim base (a probe room with a bare origin, local integration lagging, PASS candidate only in origin/integration): next --json returned null with S-9P1/TK-9P1 blocked by S-9P0:delivered, claim exited 1 (blocked-slice), and recordOwnerApproval refused the candidate as not contained in 'integration'; the new TK-002N fixtures failed the same way (tools/test-spec-workbench.mjs: 'a stale local integration branch does not hide reviewed delivery that origin/integration carries'; tools/test-spec-report.mjs: report had no integrationContainment). Green at 9fd7dee: next --json selects the delivered dependent, claim takes it, recordOwnerApproval records and names origin/integration; an unpushed local integration with origin/integration present is not delivery (next/claim/render/doctor keep it blocked) and approval refuses naming 'checked origin/integration at <sha>'; a room with no remote still resolves against the local branch; nothing fetched (refs unchanged). assembleSpecReport.integrationContainment and the plain-text report state ref, source, SHA and the local branch SHA. Helper resolveIntegrationContainmentRef (spec-workbench.mjs) reuses TK-01S's origin/<branch> resolution. Audit: reviewedDelivery and recordOwnerApproval routed; retire-spec branch cleanup and the unmerged-branch sweep stay local because a stale local ref there only yields conservative skips/reports, never an unsafe deletion, hidden delivery or blocked gate; doctor's complete-on-integration already reads every local and remote ref and is not a containment check; workbench-layout checks existence only. S-00U fixture pins origin/<branch> at its newer candidate so its refusal still isolates content binding. Full suite 48 pass / 0 fail at 9fd7dee (logs/H-tk002n-9fd7dee.log, dirty: []).

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00j-integration-remote-ref | 9fd7dee3487aa4c346c91560506d2bdfbaa09b73 | ahead 0 behind 0 | 0 | Implementation 9fd7dee (claim d3d4d33). Red at the claim base (a probe room with a bare origin, local integration lagging, PASS candidate only in origin/integration): next --json returned null with S-9P1/TK-9P1 blocked by S-9P0:delivered, claim exited 1 (blocked-slice), and recordOwnerApproval refused the candidate as not contained in 'integration'; the new TK-002N fixtures failed the same way (tools/test-spec-workbench.mjs: 'a stale local integration branch does not hide reviewed delivery that origin/integration carries'; tools/test-spec-report.mjs: report had no integrationContainment). Green at 9fd7dee: next --json selects the delivered dependent, claim takes it, recordOwnerApproval records and names origin/integration; an unpushed local integration with origin/integration present is not delivery (next/claim/render/doctor keep it blocked) and approval refuses naming 'checked origin/integration at <sha>'; a room with no remote still resolves against the local branch; nothing fetched (refs unchanged). assembleSpecReport.integrationContainment and the plain-text report state ref, source, SHA and the local branch SHA. Helper resolveIntegrationContainmentRef (spec-workbench.mjs) reuses TK-01S's origin/<branch> resolution. Audit: reviewedDelivery and recordOwnerApproval routed; retire-spec branch cleanup and the unmerged-branch sweep stay local because a stale local ref there only yields conservative skips/reports, never an unsafe deletion, hidden delivery or blocked gate; doctor's complete-on-integration already reads every local and remote ref and is not a containment check; workbench-layout checks existence only. S-00U fixture pins origin/<branch> at its newer candidate so its refusal still isolates content binding. Full suite 48 pass / 0 fail at 9fd7dee (logs/H-tk002n-9fd7dee.log, dirty: []). | Code comments updated in spec-report.mjs and spec-workbench.mjs; RUNBOOK wording routed to S-00P (fetch integration before relying on S-###:delivered or recording approval). | RUNBOOK wording (fetch integration before relying on S-###:delivered or recording approval) routed to S-00P; retire-spec branch cleanup containment stays local by design; acceptance line awaits Dispatcher whole-Spec QA. | 9f9cd3f96e6c1d5e486a7a084f935840575ed515975a5e6a16791e9fee49eed0 |
