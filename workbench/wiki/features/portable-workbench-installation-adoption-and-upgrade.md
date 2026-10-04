---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-021-portable-workbench-v3/SPEC.md
  - workbench/manifest.json
  - workbench/tools/workbench-paths.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-adoption.mjs
  - tools/workbench-upgrade.mjs
  - tools/core-skill-installer.mjs
  - tools/test-workbench-adoption.mjs
  - tools/test-workbench-upgrade.mjs
last_verified: 2026-10-04
---

# Portable Workbench Installation, Adoption And Upgrade

A Workbench is a filled project with root controls and a manifest-routed
support area, and it can be created, joined by an existing project, and carried
forward without depending on a private machine. The Portable Workbench Spec (S-021), titled
Portable Workbench v3, delivered that architecture: Genesis creates a project,
Adoption reconciles an existing project, and explicit upgrades carry managed
components forward. LLM Workbench is the source product, and ordinary operation does not
depend on Foundry or a private machine's topology.

## What It Does

- **Three ways in.** Genesis creates a project, Adoption reconciles an existing
  project, and explicit upgrades carry managed components forward.
- **Presence is separate from replacement.** Ordinary setup supplies a missing
  core skill; an existing same-named installation is not permission to
  overwrite it. Explicit updates verify identity and management evidence and
  preserve recovery information. Project-owned content remains distinct from
  managed runtime and skills.
- **Manifest-bound layout.** Current bindings come from the manifest, current
  bundle membership from the core catalog, and lifecycle rules from `AGENTS.md`.
- **Original proof.** The first delivery covered disposable installations,
  mixed-layout refusal, backup and rollback, and cold continuation.

## Why It Matters

Keeping presence apart from replacement means a routine setup cannot silently
overwrite a skill a person already installed, and recovery information survives
an explicit update. Keeping project-owned content apart from managed runtime and
skills means an upgrade does not take over what the project owns. The portable
system deliberately excludes Foundry coordination machinery.

## Limits

- The Spec established the v3 support-root transition and a then-closed
  twelve-skill bundle. That count, its earlier lane and path arrangement, its
  checkpoint-copy workflow and its stable-path language are historical stages,
  not current state. New checkpoint copies are retired; retained evidence
  remains history.
- The v3.0 result was an internal implementation milestone, not today's release
  readiness or proof of later main promotion.
- Structural checks and one continuation exercise do not establish improved
  agent outcomes.
- The capability does not authorize changing existing user skills.

## Evidence and Sources

- [Historical Portable Workbench Spec (S-021)](../../specs/S-021-portable-workbench-v3/SPEC.md). The original acceptance and evidence retain their time and scope; its eventual retired route is named in this article's `source_paths`.
- Immutable source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-021-portable-workbench-v3/SPEC.md`. Source inspection for this article used that same commit; the links below route a fresh verification, rather than asserting every historical behavior remains current.
- [workbench/manifest.json](../../manifest.json) - the manifest that declares the current bindings.
- [workbench/tools/workbench-paths.mjs](../../tools/workbench-paths.mjs) - the shared path resolution that consumers use.
- [workbench/tools/workbench-layout.mjs](../../tools/workbench-layout.mjs) - the installed-layout owner.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - Adoption.
- [tools/workbench-upgrade.mjs](../../../tools/workbench-upgrade.mjs) - explicit upgrades.
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs) - the core-skill installer.
- [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) and [tools/test-workbench-upgrade.mjs](../../../tools/test-workbench-upgrade.mjs) - the verification seams.

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-021-portable-workbench-v3.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named source paths and the immutable commit exist, not the behavior of the capability itself.
