---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-043-diagnostic-output-legibility/SPEC.md
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/diagnostics.mjs
  - tools/test-diagnostics.mjs
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Diagnostics Ordered By Consequence (S-043)

Doctor's human-readable output groups findings by what they do: blocking, selected-slice constraints, then informational findings. Each populated group has a count. The effect leads the row's severity, so an error with blocks none is visibly distinct from a condition that prevents work.

The registry remains the source of severity, scope and blocking effect. Presentation neither renames error into a softer severity nor drops information. Machine-readable JSON retains its schema. This keeps human and automated readers aligned about the same finding instead of introducing a second diagnostic vocabulary.

S-043 initially pinned a named subset of registry entries, leaving later additions outside the pin. A retrospective review demonstrated that gap; S-045 strengthened the test to set equality. The current proof should be read at that shared test rather than treating the original subset strategy as the desired permanent contract.

Grouping lowers the cost of reading a large finding list, not the number of underlying findings. It does not fix stale skill generations, make attention into a blocker or add configurable verbosity. Historical counts in the Spec were one repository snapshot and are not current inventory. The retrospective review timing is preserved in the immutable source; an eventual clean presentation test does not erase an earlier skipped integration gate.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-043-diagnostic-output-legibility/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [workbench/tools/spec-workbench.mjs](../../tools/spec-workbench.mjs)
- [workbench/tools/diagnostics.mjs](../../tools/diagnostics.mjs)
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs)
- Historical record: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
