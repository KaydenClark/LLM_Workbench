---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-034-control-fidelity-report/SPEC.md
  - tools/control-fidelity.mjs
  - tools/test-control-fidelity.mjs
  - workbench/tools/template-placeholders.mjs
  - templates/ADOPTION.md
  - workbench/skills/update-harness/SKILL.md
  - workbench/skills/workbench-room-checks/SKILL.md
  - LEXICON.md
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-10-04
---

# Control Fidelity Without Forced Uniformity

A room may deliberately diverge from its template. Fidelity reporting makes
that divergence inspectable instead of treating every local rule as a defect
or silently accepting lost qualifiers.

The report compares templated controls, the exact Claude bridge and applicable
permission/Wiki seed files against the checked-out templates. It classifies
occurrences as unchanged, filled, changed, dropped or added and labels the
checkout, room and provenance versions. It does not infer old template bytes
from a version string. Since the Contract Carrier Pointer-Brief Rewrite
(S-004C TK-005M) it can also take the room's earlier template generation, named
with `--previous-templates` or read at the room manifest's recorded source
commit when the checkout holds it, and then labels each difference the template
made rather than the room (`earlier-template`, `newer-template`,
`template-changed`). A room moving from the long control shape to the brief
and operations index is told which lines are the template's change and which
are its own; without that generation nothing is labeled.

Current filled-line matching requires fixed wording to survive placeholder
substitution. A line containing a placeholder is not automatically exempt
from lost-rule detection. This strengthens the original S-034 implementation,
whose presence-only limitation is preserved as history. Line matching remains
heuristic: a substantial rewrite may appear as changed or as dropped plus
added. The output supports review rather than deciding equivalence.

Divergence does not make the command fail and the report does not rewrite the
room. Adoption and update procedures require important agent-contract changes
to be restored or recorded as deliberate decisions. Invalid invocation can
fail; unsafe Wiki-lane input is named and compared under the safe default lane
without reading outside the room.

The source incident involved a dropped ADR qualifier, but the historical
fixture and missing template-row caveat do not define today's ADR authority.
Current controls own that rule. A clean fidelity report is not evidence of
semantic agreement, successful deployment or improved agent behavior; it is
a review aid whose source generation and matching limits stay visible.

## Evidence and Sources

- [Historical S-034 record](../../specs/S-034-control-fidelity-report/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-034-control-fidelity-report/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-034-control-fidelity-report/SPEC.md`.
- [tools/control-fidelity.mjs](../../../tools/control-fidelity.mjs) — current owning source or verification seam.
- [tools/test-control-fidelity.mjs](../../../tools/test-control-fidelity.mjs) — current owning source or verification seam.
- [workbench/tools/template-placeholders.mjs](../../../workbench/tools/template-placeholders.mjs) — current owning source or verification seam.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) — current owning source or verification seam.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) — current owning source or verification seam.
- [LEXICON.md](../../../LEXICON.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: The Contract Carrier Pointer-Brief Rewrite (S-004C TK-005M) added the earlier-generation labels; the report procedure now lives in the `workbench-room-checks` maintainer skill the Runbook index points to.
