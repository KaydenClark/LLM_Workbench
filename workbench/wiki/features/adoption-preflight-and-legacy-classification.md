---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-044-legacy-room-classification/SPEC.md
  - tools/workbench-classify.mjs
  - tools/workbench-adoption.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-workbench-adoption.mjs
  - templates/ADOPTION.md
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
last_verified: 2026-10-04
---

# Adoption Preflight And Legacy Classification

The Workbench classifies a room as genesis, adoption, upgrade or unclassifiable from evidence, and its adoption preflight reports every unreconciled root control at once. The Legacy Room Classification And Control Reconcile Order Spec (S-044) delivered both so an operator can prepare a complete correction instead of discovering one missing file on each attempt.

## What It Does

- **One complete refusal.** Adoption preflight reports every unreconciled root control in one refusal, with each reason, a reconcile order and a template-overwrite warning. Scaffolding is not permission to replace a project's actual controls with generic templates.
- **Read-only classifier.** The classifier reports genesis, adoption, upgrade or unclassifiable with evidence. Empty rooms can take Genesis; real content without an installed Workbench takes Adoption; verified installation evidence indicates upgrade. Ambiguous harness-shaped content without sufficient provenance remains unclassifiable rather than guessing a history the files do not establish.
- **Ownership at every path component.** A symlinked support root, borrowed tools lane, unreadable file or non-integer manifest shape must not let another room's content impersonate this room's installation. Ordinary application files sharing a managed filename are insufficient by themselves to classify an installed harness. Expected filesystem access failures are reported as room conditions with evidence rather than hidden as absence.
- **Later repairs.** The original change used repeated fixture and mutation checks, but some read-only snapshots and record claims were incomplete. The v3.1.2 Follow-Ups Left Without An Owner Spec (S-045) strengthened the snapshots and corrected the historical claims. Those later repairs should not be omitted when reading the completion of the Legacy Room Classification And Control Reconcile Order Spec (S-044).

## Why It Matters

An operator who can see every reason in one refusal can correct a room once, and a classifier that stays unclassifiable when evidence is insufficient never invents a history for the room.

## Limits

- Classification is evidence, never authority to run an upgrade.
- Genuinely ambiguous content cannot be made historically determinate by a better heuristic.
- Current procedures and owner scope select the actual operation.

## Evidence and Sources

- [Historical Legacy Room Classification And Control Reconcile Order Spec (S-044)](../../specs/S-044-legacy-room-classification/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-044-legacy-room-classification/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-044-legacy-room-classification/SPEC.md`. Current source inspection for the original article used that same commit; historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [tools/workbench-classify.mjs](../../../tools/workbench-classify.mjs) - the read-only classifier.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - the adoption preflight.
- [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) and [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) - the verification seams.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the adoption template.
- [Live v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md) and its [immutable source at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md) - the later repairs.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-044-adoption-and-legacy-classification.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
