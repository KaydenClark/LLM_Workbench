---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-038-v3-1-2-upstream-fix-list/SPEC.md
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
  - tools/audit-guardrails.mjs
  - AGENTS.md
last_verified: 2026-10-04
---

# Source-Checked Finding Disposition

An upstream finding is evidence to investigate, not an instruction to repair.
The Workbench v3.1.2 Upstream Fix List Spec (S-038) reconciled the second
v3.1.1 fix list into named capabilities, corrected unsupported report premises,
and preserved the release account.

## What It Does

- **Routing.** The Spec's eleven items were routed to the Installed
  Managed-Runtime Integrity Spec (S-039) through the Legacy Room Classification
  And Control Reconcile Order Spec (S-044); code ownership stayed with those
  capabilities.
- **Acceptance, correction and implementation kept apart.** A useful report can
  still misidentify an emitter, overstate the number of affected records or
  describe the wrong symlink level. Routing records the verified condition and
  preserves what changed in the interpretation instead of silently rewriting
  the report into a stronger claim.
- **Verification history preserved.** Four of the six capability merges lacked
  the required preceding approving review; retrospective reviews found further
  material problems and routed them to the
  v3.1.2 Follow-Ups Left Without An Owner Spec (S-045).
- **Guardrail score.** The original guardrail score stayed 78/100 because the
  affected static criteria were already satisfied.

## Why It Matters

The distinction between acceptance, correction and implementation keeps a
useful but imperfect report from being rewritten into a stronger claim. The
limitations of the verification history must not disappear when an article
summarizes the successful fixes. Runtime repairs with an unchanged rubric score
can still matter.

## Limits

- Whether the additional approval of the
  Repairing Installed State The Harness Wrote Spec (S-042) actually occurred
  remained unresolved because a header assertion had no evidence row.
- Neither score proves better agent outcomes.
- Historical version, branch and host descriptions apply only at their named
  commits.
- Current release readiness and downstream deployment require their own owners
  and fresh proof.

## Evidence and Sources

- [Historical Workbench v3.1.2 Upstream Fix List Spec (S-038)](../../specs/S-038-v3-1-2-upstream-fix-list/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md`. The 2026-09-19 article's inspection of source used that same commit; the links below provide the route for renewed verification, and historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [Historical v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md). Its record at the same commit is the [immutable source at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md).
- [tools/audit-guardrails.mjs](../../../tools/audit-guardrails.mjs) - the guardrail audit.
- [AGENTS.md](../../../AGENTS.md) - the agent contract.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-038-upstream-finding-disposition.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). The title lost its Spec identifier suffix; the identifier now sits beside the Spec's name in the introduction. Every live link to it was rewritten by the move; no claim was changed. Checked the Spec names, that every listed current source path exists (the first entry names the Spec's eventual retired route, which does not exist yet) and that the immutable commit holds both Specs; the other claims were not re-verified.
