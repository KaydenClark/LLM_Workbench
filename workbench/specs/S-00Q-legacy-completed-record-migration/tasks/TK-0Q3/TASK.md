# TK-0Q3 - Migrate batch B portable-room architecture

**Task ID:** TK-0Q3
**Spec ID:** S-00Q
**Slice:** Migrate S-020, S-021 and S-023-S-026
**Status:** blocked
**Blockers:** TK-0Q0, TK-0Q1
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-5
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix finds portable-room architecture, schema, governance, Wiki or composition knowledge routed only to one of the six Specs; green: current Wiki/ADR/source/test owners explain the complete capability set, consumers resolve there, the migration digest passes, and retire-spec removes the batch from ordinary discovery without broken links.

## Delivery

Build capability-shaped documentation around the portable room rather than six
Spec summaries. Preserve manifest/schema and migration evidence at the exact
source/test owners that prove it.

## Preservation And Rollback

Pin all source paths and tests before editing. Retire through the tool only
after approval; restore the batch from the recorded pre-move commit on failure.
