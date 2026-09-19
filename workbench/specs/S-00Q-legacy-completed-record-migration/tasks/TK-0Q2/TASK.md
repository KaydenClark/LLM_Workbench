# TK-0Q2 - Migrate batch A foundations and evaluation capabilities

**Task ID:** TK-0Q2
**Spec ID:** S-00Q
**Slice:** Migrate S-001, S-002, S-004-S-010, S-012, S-013 and S-015
**Status:** blocked
**Blockers:** TK-0Q0, TK-0Q1
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-5
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix identifies at least one useful current claim or consumer still owned only by a batch-A Spec; green: per-Spec Wiki/current-owner destinations cover all twelve records, every current consumer resolves there, copied Task state is rejected, the owner-approved batch digest passes, and retire-spec leaves ordinary discovery clean.

## Delivery

Write one article for each of the twelve Specs, transforming work selection,
evaluation, feedback, portability, baseline and release-proof meaning and linking
to the existing implementation owners. Keep historical
evaluation outcomes as bounded proof, not universal capability claims.

## Preservation And Rollback

Retire only as one reviewed batch after the pre-move matrix and branch/commit
rollback point are recorded. On failure, restore the pre-retirement commit; do
not hand-move individual directories.
