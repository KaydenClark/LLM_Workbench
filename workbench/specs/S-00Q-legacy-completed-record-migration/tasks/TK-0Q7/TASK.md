# TK-0Q7 - Migrate batch F product-journey capabilities

**Task ID:** TK-0Q7
**Spec ID:** S-00Q
**Slice:** Migrate S-00A-S-00F and S-00L
**Status:** blocked
**Blockers:** TK-0Q0
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-6
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix finds Blueprint/ADR routing, Template, evidence intake, Genesis, fresh-project, release-gate or Lexicon-freshness meaning readable only from one of the seven Specs; green: the product journey is per-Spec and current, release readiness still belongs to S-00O, consumers are redirected, and the approved batch retires without copying project state into the Wiki.

## Delivery

Create exactly one durable Wiki article per source Spec in this batch. Preserve
useful capability knowledge, decisions, limitations and proof references; links
connect related articles without merging them.

Document the evidence-to-project journey and Template/release gate as current
capabilities. Preserve each historical proof boundary and avoid turning the
Wiki into a status or release chronology.

Article authoring may proceed before S-00I/S-00J/S-00P completion and TK-0Q1.
Actual retirement remains gated on those prerequisites plus concrete batch review.

## Preservation And Rollback

Pin Template/source identities and proof limitations. If an article would
duplicate Blueprint direction or S-00O work state, route to those owners rather
than write it; restore the pre-move commit on a failed batch.

## Prepared article result

The 7 individual articles for this batch are authored, linked from the Wiki
router and included in the [migration matrix](../../MIGRATION_MATRIX.md).
Separate-context review covered their principal capabilities, decisions and
limits; all article links and identities were checked. This completes article
preparation only. Current-consumer migration, retirement QA and tool-mediated
retirement remain open under the stated dependencies.
