---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-034-control-fidelity-report/SPEC.md
  - tools/control-fidelity.mjs
  - tools/test-control-fidelity.mjs
  - workbench/tools/template-placeholders.mjs
  - templates/ADOPTION.md
  - workbench/skills/update-harness/SKILL.md
  - LEXICON.md
  - RUNBOOK.md
last_verified: 2026-10-04
---

# Control Fidelity Without Forced Uniformity

A room may deliberately diverge from its template, and the Workbench makes that
divergence inspectable instead of treating every local rule as a defect or
silently accepting lost qualifiers. The Control Fidelity Report Spec (S-034)
delivered the fidelity report that compares a room's controls with the
checked-out templates.

## What It Does

- **Comparison.** The report compares templated controls, the exact Claude
  bridge and applicable permission/Wiki seed files against the checked-out
  templates. It classifies occurrences as unchanged, filled, changed, dropped
  or added and labels the checkout, room and provenance versions.
- **Filled-line matching.** Current filled-line matching requires fixed wording
  to survive placeholder substitution. A line containing a placeholder is not
  automatically exempt from lost-rule detection.
- **Exit and effects.** Divergence does not make the command fail and the report
  does not rewrite the room. Invalid invocation can fail; unsafe Wiki-lane
  input is named and compared under the safe default lane without reading
  outside the room.
- **Procedures that use it.** Adoption and update procedures require important
  agent-contract changes to be restored or recorded as deliberate decisions.

## Why It Matters

Divergence is not treated as a defect, and a lost qualifier is not silently
accepted: the report makes both inspectable. The source incident involved a
dropped ADR qualifier.

## Limits

- Comparing against another historical generation requires that generation's
  checkout; the report does not infer old template bytes from a version string.
- Line matching remains heuristic: a substantial rewrite may appear as changed
  or as dropped plus added. The output supports review rather than deciding
  equivalence.
- The presence-only limitation of the original implementation by the Control
  Fidelity Report Spec (S-034) is historical; current matching strengthens it.
- The historical fixture and missing template-row caveat from the source
  incident do not define today's ADR authority. Current controls own that rule.
- A clean fidelity report is not evidence of semantic agreement, successful
  deployment or improved agent behavior; it is a review aid whose source
  generation and matching limits stay visible.

## Evidence and Sources

- [Historical Control Fidelity Report Spec (S-034)](../../specs/S-034-control-fidelity-report/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-034-control-fidelity-report/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-034-control-fidelity-report/SPEC.md`.
- [tools/control-fidelity.mjs](../../../tools/control-fidelity.mjs) - the fidelity report.
- [tools/test-control-fidelity.mjs](../../../tools/test-control-fidelity.mjs) - its verification seam.
- [workbench/tools/template-placeholders.mjs](../../../workbench/tools/template-placeholders.mjs) - the template placeholder vocabulary.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the adoption procedure that requires contract changes to be restored or recorded.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update procedure with the same requirement.
- [LEXICON.md](../../../LEXICON.md) - shared terms, including the current ADR rule.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-034-control-fidelity-report.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, that every listed source path exists, and that the report source declares the unchanged, filled, dropped, changed and added kinds; the other claims were not re-verified.
