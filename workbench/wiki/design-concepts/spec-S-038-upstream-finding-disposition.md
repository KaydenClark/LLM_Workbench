---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
  - tools/audit-guardrails.mjs
  - AGENTS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Source-Checked Finding Disposition (S-038)

An upstream finding is evidence to investigate, not an instruction to repair. S-038 reconciled the second v3.1.1 fix list into named capabilities, corrected unsupported report premises, and preserved the release account. Its eleven items were routed to S-039 through S-044; code ownership stayed with those capabilities.

The reusable distinction is between acceptance, correction and implementation. A useful report can still misidentify an emitter, overstate the number of affected records or describe the wrong symlink level. Routing records the verified condition and preserves what changed in the interpretation instead of silently rewriting the report into a stronger claim.

This Spec also preserves consequential verification history. Four of the six capability merges lacked the required preceding approving review; retrospective reviews found further material problems and routed them to S-045. Whether the additional S-042 approval actually occurred remained unresolved because a header assertion had no evidence row. These limitations must not disappear when an article summarizes the successful fixes.

The original guardrail score stayed 78/100 because the affected static criteria were already satisfied. Runtime repairs with an unchanged rubric score can still matter; neither score proves better agent outcomes. Historical version, branch and host descriptions apply only at their named commits. Current release readiness and downstream deployment require their own owners and fresh proof.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- Historical record: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md`.
- Historical record: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.
- [tools/audit-guardrails.mjs](../../../tools/audit-guardrails.mjs)
- [AGENTS.md](../../../AGENTS.md)

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
