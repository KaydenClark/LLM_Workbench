---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-043-diagnostic-output-legibility/SPEC.md
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/diagnostics.mjs
  - tools/test-diagnostics.mjs
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
last_verified: 2026-10-04
---

# Diagnostics Ordered By Consequence

Doctor's human-readable output groups findings by what they do rather than in one flat list. The Diagnostic Output Legibility Spec (S-043) delivered this so a reader can tell a finding that blocks work from one that only informs.

## What It Does

- **Grouping.** Findings appear as blocking, then selected-slice constraints, then informational findings. Each populated group has a count.
- **Effect leads severity.** The effect leads the row's severity, so an error with blocks none is visibly distinct from a condition that prevents work.
- **Registry stays the source.** The registry remains the source of severity, scope and blocking effect. Presentation neither renames error into a softer severity nor drops information.
- **Same vocabulary for machines.** Machine-readable JSON retains its schema. This keeps human and automated readers aligned about the same finding instead of introducing a second diagnostic vocabulary.
- **Pin strength.** The Diagnostic Output Legibility Spec (S-043) initially pinned a named subset of registry entries, leaving later additions outside the pin. A retrospective review demonstrated that gap, and the v3.1.2 Follow-Ups Left Without An Owner Spec (S-045) strengthened the test to set equality. The current proof should be read at that shared test rather than treating the original subset strategy as the desired permanent contract.

## Why It Matters

Grouping lowers the cost of reading a large finding list, not the number of underlying findings.

## Limits

- It does not fix stale skill generations, make attention into a blocker or add configurable verbosity.
- Historical counts in the Spec were one repository snapshot and are not current inventory.
- The retrospective review timing is preserved in the immutable source; an eventual clean presentation test does not erase an earlier skipped integration gate.

## Evidence and Sources

- [Historical Diagnostic Output Legibility Spec (S-043)](../../specs/S-043-diagnostic-output-legibility/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-043-diagnostic-output-legibility/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-043-diagnostic-output-legibility/SPEC.md`. Current source inspection for the original article used that same commit; historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the doctor command that renders the grouping.
- [workbench/tools/diagnostics.mjs](../../../workbench/tools/diagnostics.mjs) - the registry of severity, scope and effect.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs) - the shared registry pin test.
- [Live v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md) and its [immutable source at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md) - the Spec that strengthened the registry pin test to set equality.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-043-diagnostic-output-legibility.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
