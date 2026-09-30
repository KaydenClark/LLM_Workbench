---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md
  - tools/control-fidelity.mjs
  - tools/workbench-tools.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/test-control-fidelity.mjs
  - tools/test-workbench-upgrade.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Evidence-Bounded Upgrade Claims (S-036)

Upgrade reports must distinguish what a check observes from what an operator might infer. S-036 corrected an unpublished v3.1.2 candidate where permission visibility, control fidelity and source identity had been overstated. A bounded matcher that cannot interpret a restriction reports uncertainty; it does not establish that a lane is writable.

Control fidelity compares filled controls with their source templates. Fixed wording must survive placeholder substitution for a line to count as filled. Similarity or token overlap is not proof of that relationship. A source identity likewise requires a verifiable checkout and bytes; caller-supplied release or commit strings cannot authenticate a relocated partial copy.

Historical adoption provenance and current managed-component generation answer different questions. The former describes how the room originated; runtime receipts and skill markers describe what is installed. Replacing one with the other would erase useful history or misrepresent current state.

The Spec records four candidate-review rounds before its correction landed. That is bounded historical evidence of defects caught, not a universal review requirement or today's release status. Its disposable already-v3 maintenance test preserved project-owned bytes. Native permission behavior and downstream deployment were separately bounded; static fixtures did not establish them. Later corrections belong to linked successors rather than rewriting completed evidence.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [tools/control-fidelity.mjs](../../../tools/control-fidelity.mjs)
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs)
- [workbench/tools/workbench-layout.mjs](../../tools/workbench-layout.mjs)
- [tools/test-control-fidelity.mjs](../../../tools/test-control-fidelity.mjs)
- [tools/test-workbench-upgrade.mjs](../../../tools/test-workbench-upgrade.mjs)

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
