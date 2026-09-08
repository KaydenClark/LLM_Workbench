---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
  - RUNBOOK.md
  - workbench/specs/S-048-checkpoint-retirement/SPEC.md
---

# Direct promotion into durable owners

Selected material from a temporary note or handoff is deliberately reconciled
directly into its named durable owner: ADR, spec, Wiki, control or another
explicit owner. The crossing performs privacy and validity checks, preserves
provenance and corrections, verifies the written destination, and only then
permits reconciled source material to be trimmed. Agent judgment owns semantic
fidelity and authorization; copying bytes does not prove either.

Freeze existing checkpoints and citations as historical records. After active
consumer migration, create no new checkpoint promotions. Preserve operational
adoption/upgrade rollback in a separately declared recovery destination and keep
legacy recovery references usable. Temporary handoffs do not become a replacement
permanent checkpoint collection.

Considered alternatives: Deleting checkpoint history breaks citations and recovery. Making tracked
handoffs the new destination merely renames the old mechanism. A privacy scan
alone cannot establish correct owner selection, faithful meaning or safe cleanup.

Consequences: Partially supersedes ADR-0028's checkpoint-only destination, preserving its
privacy crossing and rule that untracked context is not durable evidence.
S-048 owns inventory, direct promotion, rollback migration and retirement.
Unresolved context, corrections and active transfer dependencies survive cleanup.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-Q in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.

## Operational recovery disposition

The separate recovery destination is the ignored `sessions/recovery/`
collection. It carries new operational receipts and legacy-skill backups,
not notepad history or durable citations. Existing checkpoint files and old
recovery paths stay intact. Legacy v2 handoffs retain their existing migration
mapping to historical checkpoints; the new copier is retired independently.
