# TK-0Q6 - Migrate batch E continuity, identity and host capabilities

**Task ID:** TK-0Q6
**Spec ID:** S-00Q
**Slice:** Migrate S-046-S-049, S-051 and S-053
**Status:** blocked
**Blockers:** TK-0Q0, TK-0Q1
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 4-6
**Stance:** Reconciler
**Planned verification:** Red: the batch matrix finds continuity, identity, checkpoint-transition, execution-ownership, core-ownership or configured-host knowledge owned only by one of the six Specs; green: capability articles and live source/tests own current meaning, S-052 remains the sole live transport proof owner, consumers are redirected, and the approved batch retires without overstating host or model evidence.

## Delivery

Keep local continuity distinct from optional transport and distinguish
configured-host observations from enforcement or reliability claims. Do not
close or migrate S-052.

## Preservation And Rollback

Preserve privacy boundaries, identifiers, checkpoint history and exact host
limits. Stop and restore the pre-move batch if any private or host-specific
material would enter the Wiki.
