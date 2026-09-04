---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0017 (accepted 2026-09-03, superseding its ADR-0014)
canonicalized_in:
  - BLUEPRINT.md
  - RUNBOOK.md
---

# The Workbench support directory has six lowercase lanes

The declared support directory is lowercase `workbench/` with six lanes: `docs/`, `specs/`, `wiki/`, `sessions/`, `feedback/`, and `tools/`. A lane is a prebuilt structural slot that ships with every Workbench whether or not it currently holds anything, so an empty lane is a slot rather than an unkept promise.

Consequences: the manifest declares all six lanes; lowercase is the settled spelling because a case-insensitive host hides a capitalised divergence that any case-sensitive clone splits into two directories. The five-lane v3.0 layout is a schema 1 manifest that migrates once ([ADR-0032](0032-manifest-schema-2-declares-lanes-and-collections.md)).

Provenance: faithful sanitized port of a private-workspace decision.
