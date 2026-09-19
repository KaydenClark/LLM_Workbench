---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-037-line-ending-agnostic-records/SPEC.md
  - workbench/tools/adr.mjs
  - workbench/tools/wiki.mjs
  - tools/workbench-adoption.mjs
  - tools/test-adr.mjs
  - tools/test-wiki.mjs
  - tools/test-workbench-adoption.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Line-Ending-Aware Records (S-037)

Portable record readers must accept ordinary LF and CRLF checkouts without requiring each adopted repository to change Git settings. ADR and Wiki parsing share parseFrontmatter, so a correction at that seam applies consistently to both. Parsing normalizes a copy; writers preserve the destination's terminator to avoid an unrelated whole-file diff.

The original defect made a simulated CRLF corpus appear to contain invalid records and a stale register. S-037 corrected parser boundaries and the Adoption memory-field writer. A review also caught a mixed-ending writer regression that had omitted required metadata; preserving read semantics alone was insufficient.

The useful contract is structural parsing plus terminator-aware writing, not an assumption that all Windows editor output is equivalent. Historical probes still rejected a UTF-8 BOM before the opening fence and whitespace after a delimiter. Those adjacent cases were outside the ordinary autocrlf scenario and should not be silently reported as covered.

Its proof was a byte-faithful CRLF simulation on the development host, not a native Windows run. Reporting-only split sites were not comprehensively audited, and unrelated Windows failures were outside the Spec. Current parser and writer tests are the route for verifying present behavior; old finding counts and release results remain historical measurements.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-037-line-ending-agnostic-records/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [workbench/tools/adr.mjs](../../tools/adr.mjs)
- [workbench/tools/wiki.mjs](../../tools/wiki.mjs)
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs)
- [tools/test-adr.mjs](../../../tools/test-adr.mjs)
- [tools/test-wiki.mjs](../../../tools/test-wiki.mjs)
- [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs)

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
