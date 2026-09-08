---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md
---

# Skill composition within inherited scope

Skills are reusable primitives and thin compositions. A primitive is usable
independently of its first caller. Invocation, routing, mention and authorization
are distinct: a skill mention does not execute it; composition inherits the
assigned scope and does not require redundant approval already supplied by the
owner. Read-only restrictions apply to the named target; permitted local working
capture does not authorize target changes.

Considered alternatives: Duplicating helper instructions causes divergent implementations. Treating any
mention as invocation causes accidental execution. A new metadata schema or a
universal Flight chain is not selected by accepting composition.

Consequences: One owner per behavior and actual host callability tests are required for
promised workflows. Source composition and installed ownership can change
independently, so ADR-0046 owns the latter.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-E in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
