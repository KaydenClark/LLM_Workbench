# TK-0Q5 - Migrate batch D upgrade and repair capabilities

**Task ID:** TK-0Q5
**Spec ID:** S-00Q
**Slice:** Migrate S-036-S-045
**Status:** blocked
**Blockers:** TK-0Q0
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-5
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix finds an upgrade, runtime-integrity, repair or legacy-classification claim with no current owner outside the ten Specs; green: guidebook/design-concept and source/test owners cover every surviving claim, stale version-specific directions are historical, consumers are redirected, and the approved batch retires with clean links.

## Delivery

Create exactly one durable Wiki article per source Spec in this batch. Preserve
useful capability knowledge, decisions, limitations and proof references; links
connect related articles without merging them.

Document the reusable diagnosis and repair models; keep one-off upstream fix
dispositions and candidate corrections as versioned history. Never infer an
actual consumer from similar names or identical bytes.

Article authoring may proceed before S-00I/S-00J/S-00P completion and TK-0Q1.
Actual retirement remains gated on those prerequisites plus concrete batch review.

## Preservation And Rollback

Keep exact test/candidate anchors and correction chains. If current and
historical claims cannot be separated safely, leave the affected record active
and block the batch rather than partially retiring it.

## Prepared article result

The 10 individual articles for this batch are authored, linked from the Wiki
router and included in the [migration matrix](../../MIGRATION_MATRIX.md).
Separate-context review covered their principal capabilities, decisions and
limits; all article links and identities were checked. This completes article
preparation only. Current-consumer migration, retirement QA and tool-mediated
retirement remain open under the stated dependencies.
