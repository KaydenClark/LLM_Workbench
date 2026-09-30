# TK-0Q6 - Migrate batch E continuity, identity and host capabilities

**Task ID:** TK-0Q6
**Spec ID:** S-00Q
**Slice:** Migrate S-046-S-049, S-051 and S-053
**Status:** blocked
**Blockers:** TK-0Q0
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-6
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix finds continuity, identity, checkpoint-transition, execution-ownership, core-ownership or configured-host knowledge owned only by one of the six Specs; green: capability articles and live source/tests own current meaning, S-052 remains the sole live transport proof owner, consumers are redirected, and the approved batch retires without overstating host or model evidence.

## Delivery

Create exactly one durable Wiki article per source Spec in this batch. Preserve
useful capability knowledge, decisions, limitations and proof references; links
connect related articles without merging them.

Keep local continuity distinct from optional transport and distinguish
configured-host observations from enforcement or reliability claims. Do not
close or migrate S-052.

Article authoring may proceed before S-00I/S-00J/S-00P completion and TK-0Q1.
Actual retirement remains gated on those prerequisites plus concrete batch review.

## Preservation And Rollback

Preserve privacy boundaries, identifiers, checkpoint history and exact host
limits. Stop and restore the pre-move batch if any private or host-specific
material would enter the Wiki.

## Prepared article result

The 6 individual articles for this batch are authored, linked from the Wiki
router and included in the [migration matrix](../../MIGRATION_MATRIX.md).
Separate-context review covered their principal capabilities, decisions and
limits; all article links and identities were checked. This completes article
preparation only. Current-consumer migration, retirement QA and tool-mediated
retirement remain open under the stated dependencies.
