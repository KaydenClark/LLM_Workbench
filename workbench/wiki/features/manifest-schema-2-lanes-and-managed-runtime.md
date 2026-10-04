---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-023-manifest-schema-2-and-managed-runtime/SPEC.md
  - workbench/manifest.json
  - workbench/tools/workbench-paths.mjs
  - tools/workbench-tools.mjs
  - tools/test-workbench-tools.mjs
  - tools/test-workbench-layout.mjs
  - workbench/tools/sessions.mjs
  - workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md
  - workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md
last_verified: 2026-10-04
---

# Manifest Schema 2 Lanes And Managed Runtime

The manifest declares which support lanes a Workbench has and which
machine-used collections sit inside them, and the Workbench manages its own
runtime tools against a recorded receipt. The Manifest Schema 2 And Managed
Support Runtime Spec (S-023) delivered the schema-1-to-schema-2 migration and
this managed runtime boundary.

## What It Does

- **Declared lanes and collections.** Schema 2 declares six support lanes -
  docs, specs, wiki, sessions, feedback and tools - and the machine-used
  collections inside them. Consumers resolve these bindings through
  `workbench-paths`.
- **Managed installation with a receipt.** Installation records the source
  release, commit and file hashes in a receipt. Installed bytes, receipt claims
  and the selected source can be compared separately. Explicit updates preserve
  backups and support rollback; inspection does not silently replace files.
- **Placeholders for empty collections.** Required empty collections may use
  tracked placeholders without inventing records.
- **Safe migration.** Migration rejects unsafe or contradictory layouts rather
  than maintaining two authoritative support roots.
- **Verification.** Tests cover manifest validation, receipts, installation,
  application-tool preservation, migration and recovery.

## Why It Matters

An application's root tools directory does not become harness-owned merely
because the Workbench has a managed tools lane, so the Workbench can manage its
runtime without taking over application-owned tools. Comparing installed bytes,
receipt claims and the selected source separately, and refusing contradictory
layouts, keeps one authoritative support root.

## Limits

- The original ten-tool and seven-collection inventories describe that
  release. The current manifest and installer own today's sets.
- The original session contract permitted privacy-checked checkpoint copies.
  Current `sessions.mjs` refuses new copies; old checkpoints preserve history
  while selected supported claims reconcile into existing durable owners. This
  supersession must travel with the architectural explanation.
- Historical case-sensitive-filesystem proof was logic-level unless a suitable
  volume was actually available; it does not imply universal host coverage.
- No plugin or dependency manager, and no authority over application-owned
  tools, follows from this capability.

## Evidence and Sources

- [Historical Manifest Schema 2 And Managed Support Runtime Spec (S-023)](../../specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md). The original acceptance and evidence retain their time and scope; its eventual retired route is named in this article's `source_paths`.
- Immutable source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md`. Source inspection for this article used that same commit; the links below route a fresh verification, rather than asserting every historical behavior remains current.
- [workbench/manifest.json](../../manifest.json) - the manifest that declares lanes and collections.
- [workbench/tools/workbench-paths.mjs](../../tools/workbench-paths.mjs) - the binding resolver consumers use.
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs) - managed runtime installation.
- [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs) and [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) - the verification seams.
- [workbench/tools/sessions.mjs](../../tools/sessions.mjs) - the session tool that now refuses new checkpoint copies.
- [Portable runtime tools are Workbench-managed in the tools lane; root tools stay application-owned (ADR-0031)](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md)
- [Manifest schema 2 declares six lanes and every machine-used collection (ADR-0032)](../../docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-023-manifest-and-managed-runtime.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named current source paths (the first entry names the Spec's eventual retired route, which does not exist yet) and the immutable commit exist, not the behavior of the capability itself.
