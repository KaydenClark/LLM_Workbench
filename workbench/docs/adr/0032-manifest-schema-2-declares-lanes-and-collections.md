---
status: accepted
date: 2026-09-04
canonicalized_in:
  - BLUEPRINT.md
  - RUNBOOK.md
---

# Manifest schema 2 declares six lanes and every machine-used collection

`workbench/manifest.json` schema 2 declares the six lanes and every collection a tool or skill resolves: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, and `sessions/checkpoints`, all as lowercase, space-free, repository-relative paths under `workbench/`. It also records the wiki profile and the exact source release and commit the project was generated or migrated from. A schema 1 manifest is reported as `upgrade-required` with a tested lossless migration; it is neither accepted as current nor rejected as corrupt.

Considered and rejected: deriving collection paths by convention from lane names. It kept the manifest small but hid the routing every consumer depended on, so a renamed collection broke skills silently instead of failing the manifest.

Consequences: all consumers resolve paths through one reader; the five-lane v3.0 layout migrates once, mapping `grilling` to `sessions/grilling` and the tracked `handoffs` checkpoints to `sessions/checkpoints`.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.
