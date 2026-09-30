---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-042-installed-state-repair/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/adr.mjs
  - workbench/tools/wiki.mjs
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-adr.mjs
  - tools/test-wiki.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Installed State Reporting And Repair (S-042)

Seeded documents and managed runtime files have different ownership. Runtime receipts assert managed-byte identity; a room may legitimately adapt seeded guidance. A separate seed-generation record therefore reports stale seed provenance without turning every local edit into runtime tampering.

Normalization fills missing required metadata while preserving existing fields and bodies. Source backfill verifies the available release checkout rather than accepting a caller's unsupported provenance string. These are report-and-repair paths for existing rooms, not a reason to reinstall or replace project-owned content wholesale.

S-042 originally emitted stale-seed and unverified-provenance through the Wiki validator because another lane owned doctor. S-045 moved them to the installed-state collection checks in spec-workbench; the historical routing debt is not current guidance. Likewise, ADR normalization now follows folder lifecycle and does not reintroduce a lifecycle status key.

The limitations remain material: seed generation does not distinguish intentional local prose from an old copy; backfilled provenance is weaker than identity captured at installation; normalization is not an all-files transaction; temporary-file publication can change modes; and arbitrary forged seed keys are reported rather than automatically pruned. The original claimed approval lacked a corresponding evidence row and remains an evidence uncertainty, not a retroactively manufactured PASS.

Current command sources and tests below establish the maintenance mechanisms. They do not authorize automatic repair of another project or prove the historical state of a room before provenance was recorded.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-042-installed-state-repair/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [workbench/tools/workbench-layout.mjs](../../tools/workbench-layout.mjs)
- [workbench/tools/spec-workbench.mjs](../../tools/spec-workbench.mjs)
- [workbench/tools/adr.mjs](../../tools/adr.mjs)
- [workbench/tools/wiki.mjs](../../tools/wiki.mjs)
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs)
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs)
- [tools/test-adr.mjs](../../../tools/test-adr.mjs)
- [tools/test-wiki.mjs](../../../tools/test-wiki.mjs)

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
