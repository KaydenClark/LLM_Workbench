# TK-0S1 - Reconcile canonical ledger and derived views, including frozen snapshot lineage

**Task ID:** TK-0S1
**Spec ID:** S-00S
**Slice:** Reconcile canonical ledger and derived views, including frozen snapshot lineage
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00S Acceptance Criteria
**Planned verification:** Red: a consumer lookup cannot explain the frozen snapshot/report relationship; green: each pass has a canonical ledger, derived views are labeled, and source IDs, corrections, limitations and consumers remain reachable

**Stance:** Builder

Use TK-0S0's inventory to designate canonical and derived representations.
Trace reports, evidence and review inputs. Keep the frozen snapshot's
preservation role and record any consumer or lineage that cannot be proven.

The assigned documentation slice may consume the implemented TK-0S0 inventory at
`e7b0906025909b9edd626e967b15e526e5d02509` before common full-suite closure.
TK-0S0 remains in progress until that shared verification gate is satisfied.

Reconciliation implemented in ../../RECONCILIATION.md with pinned preservation
identities in ../../representation-inventory.json. Full-suite and separate-context
review proof remain pending; this task is not closed.
