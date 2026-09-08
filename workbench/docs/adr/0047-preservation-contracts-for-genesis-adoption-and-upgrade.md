---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
---

# Preservation contracts for genesis, adoption and upgrade

Genesis creates a new independent room; adoption preserves an existing project's
product and history; upgrade changes explicitly managed installation state and
reconciles filled controls. Each operation verifies every consumed source lane
before mutation, preserves legitimate destination differences and provides
recovery. Presence-only setup cannot acquire replacement effects.

Considered alternatives: One opaque replacement operation obscures different allowed effects. Resetting
a room to templates loses product decisions. Checking only tools while consuming
dirty templates falsely identifies the source used.

Consequences: Source templates remain generic; installed controls are filled and deliberately
reconciled. Managed-runtime ownership stays with ADR-0031; recovery migration
must remain usable when checkpoint history freezes.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-G in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
