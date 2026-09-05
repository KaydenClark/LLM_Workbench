---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - LLM Workbench template wiki
source_paths:
  - workbench/wiki
last_verified: 2026-09-04
---

# LLM Workbench Wiki Agent Instructions

> Generated from LLM Workbench v3.1.1.

This lane is the durable, human-editable knowledge base for this project. The
root `AGENTS.md` governs how agents work; this file only bounds wiki
maintenance.

## Cold Start And Navigation

1. Read `MEMORY.md`.
2. Follow one directly relevant link.
3. For current project state, leave the wiki and read the root controls.
4. Search only when the router is incomplete or during explicit maintenance.

## Authority And Scope

- The wiki owns durable documentary knowledge and navigation, not a
  Governance Plane and not authorization.
- Verified runtime and the root controls outrank wiki notes; maintained active
  notes outrank `archive/` and platform auto-memory.
- Raw sources stay read-only during wiki maintenance unless the user also
  requests project or source work.
- Do not read or reproduce `restricted` context unless the task requires it.

## CRUD

- Follow `SCHEMA.md` for properties, provenance, sensitivity, and freshness.
- Update an existing owning note before creating another.
- Keep collections flat; never copy live task state.
- Design Concept articles: suggest, repair from direct proof, or mark stale.
  Never create one without the owner's direction.
- Run `node workbench/tools/wiki.mjs validate` after maintained-note changes.

## Documentation

When a durable change alters project, person, machine, or navigation truth,
update the owning note in the same task. Otherwise say
`Docs checked; no update needed` and name why.
