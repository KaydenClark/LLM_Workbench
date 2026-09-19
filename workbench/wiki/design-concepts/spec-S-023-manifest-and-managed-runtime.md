---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md
  - workbench/manifest.json
  - workbench/tools/workbench-paths.mjs
  - tools/workbench-tools.mjs
  - tools/test-workbench-tools.mjs
  - tools/test-workbench-layout.mjs
  - workbench/tools/sessions.mjs
  - workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md
  - workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Manifest And Managed Runtime (S-023)

Schema 2 declares six support lanes—docs, specs, wiki, sessions, feedback and tools—and the machine-used collections inside them. Consumers resolve these bindings through workbench-paths. An application's root tools directory does not become harness-owned merely because the Workbench has a managed tools lane.

Managed installation records the source release, commit and file hashes in a receipt. Installed bytes, receipt claims and the selected source can be compared separately. Explicit updates preserve backups and support rollback; inspection does not silently replace files. Required empty collections may use tracked placeholders without inventing records.

S-023 delivered the schema-1-to-schema-2 migration and managed runtime boundary. Its original ten-tool and seven-collection inventories describe that release. The current manifest and installer own today's sets. Migration rejects unsafe or contradictory layouts rather than maintaining two authoritative support roots.

The original session contract permitted privacy-checked checkpoint copies. Current sessions.mjs refuses new copies; old checkpoints preserve history while selected supported claims reconcile into existing durable owners. This supersession must travel with the architectural explanation.

Tests cover manifest validation, receipts, installation, application-tool preservation, migration and recovery. Historical case-sensitive-filesystem proof was logic-level unless a suitable volume was actually available; it does not imply universal host coverage. No plugin/dependency manager or authority over application-owned tools follows from this capability.

## Evidence and Sources

Historical source: `git show 8035b41831985581e41ca713e87c2511d3dbbcc4:workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md`.
The original acceptance and evidence retain their time and scope. Current source
inspection for this article used that same commit; links below route a fresh
verification, rather than asserting every historical behavior remains current.

- [workbench/manifest.json](../../manifest.json)
- [workbench/tools/workbench-paths.mjs](../../tools/workbench-paths.mjs)
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs)
- [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs)
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs)
- [workbench/tools/sessions.mjs](../../tools/sessions.mjs)
- [workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md)
- [workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md](../../docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md)

## History

- 2026-09-19: Created on explicit owner direction for one article per legacy Spec. Preserved useful knowledge and historical limits; no source record retired or discarded.
