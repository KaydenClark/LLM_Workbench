# TK-0Q7 - Migrate batch F product-journey capabilities

**Task ID:** TK-0Q7
**Spec ID:** S-00Q
**Slice:** Migrate S-00A-S-00F and S-00L
**Status:** blocked
**Blockers:** TK-0Q0, TK-0Q1
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

## Preservation And Rollback

Pin Template/source identities and proof limitations. If an article would
duplicate Blueprint direction or S-00O work state, route to those owners rather
than write it; restore the pre-move commit on a failed batch.
