---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
---

# Node/JavaScript remains the portable runtime

Node/JavaScript remains the portable runtime. Python keeps the existing evals
and append-only-check lane. No rewrite is selected.

Considered alternatives: A Python runtime rewrite was considered and not selected. The historical owner
answer preferred JavaScript's JSON object-model affinity and existing tooling.
Its claim that Node avoids conversion while Python intrinsically adds a worse
structural step is not established: both deserialize JSON text to language
values and serialize back. Preserve that correction without inventing a new
owner-approved performance rationale.

Consequences: Continue zero-dependency Node tooling and existing Python checks. JSON usage
alone proves no performance advantage for either language. The decision and
its corrected factual rationale are separately stated.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-O in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
