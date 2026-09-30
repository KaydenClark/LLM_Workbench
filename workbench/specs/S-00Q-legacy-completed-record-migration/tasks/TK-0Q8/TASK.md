# TK-0Q8 - Redirect cross-batch consumers and prove the S-00H pilot

**Task ID:** TK-0Q8
**Spec ID:** S-00Q
**Slice:** Redirect cross-batch consumers and prove the S-00H pilot
**Status:** blocked
**Blockers:** TK-0Q2, TK-0Q3, TK-0Q4, TK-0Q5, TK-0Q6, TK-0Q7
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 5-6
**Stance:** Reconciler
**Planned verification:** Red: referencesToPath finds any current consumer of a retired batch or S-00H, or a cold route lands on a transient record for current capability knowledge; green: every current consumer resolves to Wiki/ADR/source/test/control/procedure owners, frozen history retains immutable attribution, S-00H has zero current references under the corrected gate, and cold traversal reaches each capability without a Spec.

## Delivery

Resolve cross-batch references that cannot be changed safely inside one batch.
Use S-00H as the first retired-record consumer-migration pilot. Produce precise
handoff receipts: S-00K owns S-014/S-022 current-facing disposition, S-00O owns
v4 readiness, S-052 owns live transport proof, and active S-050 remains outside
the completed inventory.

## Preservation And Rollback

Do not rewrite append-only rows or ADR history. Preserve historical identity as
retiring SHA plus path/attribution. If the corrected discard gate cannot
distinguish current consumers from frozen history, stop before discard and
restore only the consumer-migration commit.
