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
