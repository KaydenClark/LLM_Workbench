---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-039-installed-runtime-integrity/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-tools.mjs
  - workbench/tools/spec-workbench.mjs
  - tools/test-workbench-tools.mjs
  - tools/test-diagnostics.mjs
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Installed Runtime Integrity (S-039)

An installed room can compare its runtime files with the hashes in its managed-tools receipt. The authoritative expected file set also matters: an empty map, omitted file or unsafe receipt key cannot be allowed to shrink verification silently. The installed workbench-layout runtime owns this check so the room does not need the product's root tools directory to inspect itself.

When a trusted release source is available, drift can be classified as receipt-stale, runtime-modified, runtime-authentic with a mode difference, or source-unavailable. Verify reports; repair stays behind explicit update or recovery. Registered all-blocking runtime drift is consumed by doctor, selection and claim, rather than existing only as a diagnostic aspiration.

The check has limits. A missing receipt historically means no managed installation to inspect, so deleting the receipt can remove that path's evidence; Genesis validation is separate. A missing imported module may fail the loader before a friendly finding is emitted. Matching a locally rewritten receipt to altered bytes is not a trusted authenticity proof. Receipt hashes are consistency evidence, not a signed trust root.

S-039's shipped bare citations became stale after integration. S-045 introduced anchored citations and repaired that documentation; the original limitation is not a fresh unresolved task here. Read current symbols and tests through the sources below. No already-drifted downstream room was automatically repaired by this capability.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-039-installed-runtime-integrity/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [workbench/tools/workbench-layout.mjs](../../tools/workbench-layout.mjs)
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs)
- [workbench/tools/spec-workbench.mjs](../../tools/spec-workbench.mjs)
- [tools/test-workbench-tools.mjs](../../../tools/test-workbench-tools.mjs)
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs)
- Historical record: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
