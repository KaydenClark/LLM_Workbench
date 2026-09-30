---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-044-legacy-room-classification/SPEC.md
  - tools/workbench-classify.mjs
  - tools/workbench-adoption.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-workbench-adoption.mjs
  - templates/ADOPTION.md
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Adoption Preflight And Legacy Classification (S-044)

Adoption preflight reports every unreconciled root control in one refusal, with each reason, a reconcile order and a template-overwrite warning. An operator can prepare a complete correction instead of discovering one missing file on each attempt. Scaffolding is not permission to replace a project's actual controls with generic templates.

The read-only classifier reports genesis, adoption, upgrade or unclassifiable with evidence. Empty rooms can take Genesis; real content without an installed Workbench takes Adoption; verified installation evidence indicates upgrade. Ambiguous harness-shaped content without sufficient provenance remains unclassifiable rather than guessing a history the files do not establish.

Ownership applies at every path component. A symlinked support root, borrowed tools lane, unreadable file or non-integer manifest shape must not let another room's content impersonate this room's installation. Ordinary application files sharing a managed filename are insufficient by themselves to classify an installed harness. Expected filesystem access failures are reported as room conditions with evidence rather than hidden as absence.

The original change used repeated fixture and mutation checks, but some read-only snapshots and record claims were incomplete. S-045 strengthened the snapshots and corrected the historical claims. Those later repairs should not be omitted when reading S-044's completion. Classification is still evidence, never authority to run an upgrade, and genuinely ambiguous content cannot be made historically determinate by a better heuristic. Current procedures and owner scope select the actual operation.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-044-legacy-room-classification/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [tools/workbench-classify.mjs](../../../tools/workbench-classify.mjs)
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs)
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs)
- [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs)
- [templates/ADOPTION.md](../../../templates/ADOPTION.md)
- Historical record: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
