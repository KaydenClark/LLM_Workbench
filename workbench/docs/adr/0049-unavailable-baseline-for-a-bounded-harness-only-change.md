---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
---

# Unavailable baseline for a bounded harness-only change

For a bounded harness-only change, record an unavailable baseline with evidence
when no baseline can be obtained for a reason the change did not cause and
cannot repair. Preserve S-041's closed reasons: host-restricted,
product-broken-as-found, owner-declined-on-boundary. Continue the scoped change
with concrete verification and separate-context review. A measured red baseline
is red and requires owner-expanded scope to repair; never relabel it unavailable.

Considered alternatives: A universal green precondition blocks work for unrelated limitations. Silently
skipping the baseline hides uncertainty. Reclassifying actual failures as
unavailable launders a defect into permission.

Consequences: This is a bounded baseline rule, not a waiver of release acceptance or evidence.
Record the missing proof and test the change at the strongest available seam.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-J in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
