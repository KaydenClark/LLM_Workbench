# TK-0S1 - Reconcile canonical ledger and derived views, including frozen snapshot lineage

**Task ID:** TK-0S1
**Spec ID:** S-00S
**Slice:** Reconcile canonical ledger and derived views, including frozen snapshot lineage
**Status:** blocked
**Blockers:** TK-0S0
**Destination:** spec-acceptance: S-00S Acceptance Criteria
**Planned verification:** Red: a consumer lookup cannot explain the frozen snapshot/report relationship; green: each pass has a canonical ledger, derived views are labeled, and source IDs, corrections, limitations and consumers remain reachable

**Stance:** Builder

Use TK-0S0's inventory to designate canonical and derived representations.
Trace reports, evidence and review inputs. Keep the frozen snapshot's
preservation role and record any consumer or lineage that cannot be proven.
