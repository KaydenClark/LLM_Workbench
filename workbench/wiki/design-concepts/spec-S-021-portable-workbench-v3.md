---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-021-portable-workbench-v3/SPEC.md
  - workbench/manifest.json
  - workbench/tools/workbench-paths.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-adoption.mjs
  - tools/workbench-upgrade.mjs
  - tools/core-skill-installer.mjs
  - tools/test-workbench-adoption.mjs
  - tools/test-workbench-upgrade.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Portable Workbench Architecture (S-021)

A Workbench is a filled project with root controls and a manifest-routed support area. Genesis creates a project, Adoption reconciles an existing project, and explicit upgrades carry managed components forward. LLM Workbench is the source product; ordinary operation does not depend on Foundry or a private machine's topology.

The installation boundary separates presence from replacement. Ordinary setup supplies a missing core skill; an existing same-named installation is not permission to overwrite it. Explicit updates verify identity and management evidence and preserve recovery information. Project-owned content remains distinct from managed runtime and skills.

S-021 established the v3 support-root transition and a then-closed twelve-skill bundle. That count, its earlier lane/path arrangement, checkpoint-copy workflow and stable-path language are historical stages. Current bindings come from the manifest, current bundle membership from the core catalog, and lifecycle rules from AGENTS. New checkpoint copies are retired; retained evidence remains history.

The original proof covered disposable installations, mixed-layout refusal, backup/rollback and cold continuation. The v3.0 result was an internal implementation milestone, not today's release readiness or proof of later main promotion. Structural checks and one continuation exercise do not establish improved agent outcomes. The portable system deliberately excludes Foundry coordination machinery and does not authorize changing existing user skills.

## Evidence and Sources

Historical source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-021-portable-workbench-v3/SPEC.md`.
The original acceptance and evidence retain their time and scope. Current source
inspection for this article used that same commit; links below route a fresh
verification, rather than asserting every historical behavior remains current.

- [workbench/manifest.json](../../manifest.json)
- [workbench/tools/workbench-paths.mjs](../../tools/workbench-paths.mjs)
- [workbench/tools/workbench-layout.mjs](../../tools/workbench-layout.mjs)
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs)
- [tools/workbench-upgrade.mjs](../../../tools/workbench-upgrade.mjs)
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs)
- [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs)
- [tools/test-workbench-upgrade.mjs](../../../tools/test-workbench-upgrade.mjs)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
