---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md
---

# Core, personal/shared and room-local skill ownership

Three ownership scopes have two distribution tiers: upstream Workbench core;
optional personal/shared source; and room-local development. LLM_Workbench
exclusively owns the core required by its promised workflows, including reconciled
save/promote and the shared notepad behavior. A fresh room must work without the
personal catalog. One selected global core release has an explicit tested room
compatibility range; differences within that range are not incompatibility.

The global .agents/skills root may be the personal Git checkout. Installed core
is ignored/excluded managed state with source/release/content identity, not
personal source. Claude uses a generated discovery adapter to the same source;
no third .codex/skills catalog. Room-local source remains local until explicitly
accepted into the personal catalog. One authoritative source per skill and one
discovery entry per application are the invariants.

Considered alternatives: Per-room core copies reintroduce duplicate implementations. Making the personal
catalog mandatory contradicts standalone setup. Preserving tracked duplicate
core sources forever would design around migration residue, not the target.

Consequences: Normal setup preserves existing names. Explicit updates back up differences and
support rollback. Detect missing/incompatible/conflicting/broken discovery;
prepare tracked-core migration safely without touching unrelated personal skills.
Actual external-repository mutation is a separately scoped operation.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-F in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
