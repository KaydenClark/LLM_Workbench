# TK-0R3 - Apply only owner-approved optional-source dispositions atomically and recoverably

**Task ID:** TK-0R3
**Spec ID:** S-00R
**Slice:** Apply only owner-approved optional-source dispositions atomically and recoverably
**Status:** deferred
**Stance:** Builder
**Blockers:** TK-0R2
**Destination:** spec-acceptance: Approved optional-source change preserves notices/recovery, updates catalog/test atomically, and passes consumer/reference scans
**Planned verification:** Red: fixture proves stale consumer/reference, catalog row, or required notice blocks action. Green: approved source/catalog/test changes land together; complete repository scan is clean; removed item has immutable Git commit/path recovery command; full RUNBOOK suite passes.
**Preservation and rollback:** Requires written per-item owner choice. Preserve notices, ADR/Spec history, and recoverability; record pre-removal commit/path. Roll back with `git restore --source <commit> -- <path>` on a new authorized branch plus catalog/test restoration. Never remove a test merely to make deletion pass.
**Bounded source evidence:** TK-0R2 dispositions; approved owner decision; affected optional paths; README/catalog test; notices; repository scan output.

## Done Criteria

Only approved items change, with traceable recovery and truthful catalog/test
state. Without an owner choice this Task stays blocked and deletes nothing.
