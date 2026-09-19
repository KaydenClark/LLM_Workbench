# TK-0Q4 - Migrate batch C operating and release-lineage capabilities

**Task ID:** TK-0Q4
**Spec ID:** S-00Q
**Slice:** Migrate S-027-S-035
**Status:** blocked
**Blockers:** TK-0Q0, TK-0Q1
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-6
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix finds a v3.1.1-v3.1.2 operating rule, installer/diagnostic contract or release-lineage claim still readable only from one of the nine Specs; green: current capabilities and historical release dispositions are separated, consumers point to current owners, no old release is presented as current readiness, and the approved batch retires cleanly.

## Delivery

Create exactly one durable Wiki article per source Spec in this batch. Preserve
useful capability knowledge, decisions, limitations and proof references; links
connect related articles without merging them.

Separate reusable operating contracts from historical candidate receipts.
Current release procedure points to S-00O/Runbook; immutable old release proof
keeps its version and scope. Do not fold S-014, S-022 or S-050 into this batch.

## Preservation And Rollback

Preserve version labels, candidate SHAs, review verdicts and attribution
unchanged. Roll back the whole batch to its recorded pre-move commit if any
lineage becomes ambiguous.
