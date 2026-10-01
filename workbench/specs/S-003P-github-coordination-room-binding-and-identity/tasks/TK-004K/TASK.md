# TK-004K - P1: Repair later S-003P/TK-004F native identity collision with earlier published S-00I/TK-004F through a guarded move-task transaction preserving immutable history and Receipt bytes.

**Task ID:** TK-004K
**Spec ID:** S-003P
**Slice:** P1: Repair later S-003P/TK-004F native identity collision with earlier published S-00I/TK-004F through a guarded move-task transaction preserving immutable history and Receipt bytes.
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 13 (fail verdict at 5e8803f673898dd0eb716446fba5f61881d6a106 on 2026-10-01): P1: Repair later S-003P/TK-004F native identity collision with earlier published S-00I/TK-004F through a guarded move-task transaction preserving immutable history and Receipt bytes.

## Assigned Scope

Add narrow collision recovery to existing move-task, outside closeTask/verdict/gate writers. Require immutable earlier collision evidence, exact expected HEAD and source Task hash, clean tree, ordinary safe paths, unoccupied replacement record/alias, dry-run and process-I/O rollback of touched bytes and index. Preserve done status, all Receipt bytes and first-published Spec evidence, with qualified immutable provenance and no Former ID alias. Independent mechanism review precedes actual F-to-I operation and separate repaired-assembly review. Root/template Runbook hunks await released writer acknowledgement. One writer codex-github-binding.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | b683a4242bcc267c8f08ef65859c22a588120f68 | ahead 0 behind 0 | 0 | Native collision public CLI21/21 PASS at067b1305, including dry-run/no-write, immutable input refusals, remote records/discards, aliases, linked paths, pending-close and two I/O rollback stages. Original redf5357fb0 refuses unknown replacement mode. Final assembled full55 and independent mechanism review pending. | Root/template Runbook collision procedure; current existing move-task retirement body unchanged. S00P acknowledgement releases procedure writer scope. | Real F-to-I move remains unapplied until independent mechanism review, then full repaired-candidate suite and independent integration review. No fullSpec/ownerQA/clean-update claim. | 24be701549b46e1a6f251abdf11e05cd71f70c132c8de42516574a6c20bc6e02 |
| 2 | codex/github-binding-corrections | 44c37a1ce7a23312ab5077259cd7bb209afb40e4 | ahead 1 behind 0 | 3 | Corrected3ad01d38 public27/27 PASS including current and legacy remote table identities, normalized aliases, retired and orphan holders, real Runbook example execution and prior no-write/rollback cases. Remote-slice red on1fb accepts occupied I. Composed roundtrip44c37a1c PASS after using relative collision demo invocation, preserving host-path prohibition. Producer1fb54/55 and independent mechanism FAIL retained. | Root/template recovery procedure and faithful roundtrip example execution; no criterion weakened. | Final full55 corrected candidate and independent mechanism review before actualF-to-I operation; independently review repaired assembly before integration. FullSpec and owner gates remain open. | 5d865d4436a53efe62c9bdfbbaa0ff55200438cd246c2561740cd1bac2a1e5c4 |
