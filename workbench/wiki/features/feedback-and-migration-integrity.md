---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-028-harness-feedback-integrity/SPEC.md
  - tools/audit-guardrails.mjs
  - tools/feedback-automation.mjs
  - tools/workbench-adoption.mjs
  - templates/feedback/REPORT_FORMAT.md
  - templates/ADOPTION.md
  - workbench/skills/update-harness/SKILL.md
  - tools/test-guardrail-audit.mjs
  - tools/test-feedback-automation.mjs
  - tools/test-workbench-adoption.mjs
last_verified: 2026-10-04
---

# Feedback And Migration Integrity

Integrity checks exercise the paths that consume a declaration rather than ban
every occurrence of a legacy-looking string. The
Harness Feedback Integrity Spec (S-028) delivered strict feedback ingestion,
manifest-aware guardrail evaluation and truthful adoption residue, and rejected
a blanket lane-literal linter because migration input, fixtures and
explanatory text can legitimately name older locations.

## What It Does

- **Manifest-aware guardrail evaluation.** Guardrail spec-state evaluation
  resolves the declared Specs lane and treats a malformed or unsupported
  manifest differently from a legacy room with no manifest.
- **Strict feedback ingestion.** Feedback discovery validates project ownership
  and canonical layout before opening a project's declared feedback lane. Its
  parser rejects malformed rows, unknown statuses and ungraded impact instead
  of silently dropping them; only eligible new rows enter candidate ranking.
- **Adoption keeps identity and reports residue.** Adoption keeps source
  identity consistent between the manifest and managed runtime receipt, repairs
  missing Wiki metadata without replacing the body, and reports residue it
  deliberately leaves. Links that escape a moved legacy lane are reported for
  owner reconciliation, not rewritten speculatively. Matching old root runtime
  files and unresolved branch setup likewise need a truthful residue record
  instead of disappearing from the migration result.
- **Report discipline.** Reports use report-scoped finding IDs and name an
  explicit review destination. A claim about a source must be distinguished from
  an installed copy's text. Lifecycle completion guidance records observed
  harness friction or an explicit none-observed result.

## Why It Matters

Checking the path that consumes a declaration finds real breakage without
flagging a legitimate mention of an older location. Rejecting rather than
dropping a malformed feedback row, and recording residue rather than hiding it,
keep a migration or a report truthful about what it did not handle.

## Limits

- A report does not authorize its own repairs, and attention diagnostics do not
  acquire blocking effect merely because they are visible.
- The original guardrail score movement and reviewed integration delivery are
  historical evidence. They do not establish agent reliability, current
  external review-application state, or successful repair of a downstream room.
- Current runtime tests exercise strict ingestion, manifest resolution and
  migration preservation without requiring an external project sweep.

## Evidence and Sources

- [Historical Harness Feedback Integrity Spec (S-028)](../../specs/S-028-harness-feedback-integrity/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-028-harness-feedback-integrity/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-028-harness-feedback-integrity/SPEC.md`.
- [tools/audit-guardrails.mjs](../../../tools/audit-guardrails.mjs) - guardrail spec-state evaluation.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) - feedback discovery and ranking.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) - Adoption.
- [templates/feedback/REPORT_FORMAT.md](../../../templates/feedback/REPORT_FORMAT.md) - the report format.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the adoption template.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update-harness skill.
- [tools/test-guardrail-audit.mjs](../../../tools/test-guardrail-audit.mjs), [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) and [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-028-harness-feedback-integrity.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. This move checked that the named source paths and the immutable commit exist, not the behavior of the capability itself.
