---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-028-harness-feedback-integrity/SPEC.md
  - tools/audit-guardrails.mjs
  - tools/feedback-automation.mjs
  - tools/workbench-adoption.mjs
  - templates/feedback/REPORT_FORMAT.md
  - templates/ADOPTION.md
  - skills/update-harness/SKILL.md
  - tools/test-guardrail-audit.mjs
  - tools/test-feedback-automation.mjs
  - tools/test-workbench-adoption.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Feedback And Migration Integrity

Integrity checks must exercise the paths that consume a declaration rather
than ban every occurrence of a legacy-looking string. S-028 rejected a blanket
lane-literal linter because migration input, fixtures and explanatory text can
legitimately name older locations.

Guardrail spec-state evaluation resolves the declared Specs lane and treats a
malformed or unsupported manifest differently from a legacy room with no
manifest. Feedback discovery validates project ownership and canonical layout
before opening a project's declared feedback lane. Its parser rejects malformed
rows, unknown statuses and ungraded impact instead of silently dropping them;
only eligible new rows enter candidate ranking.

Adoption keeps source identity consistent between the manifest and managed
runtime receipt, repairs missing Wiki metadata without replacing the body,
and reports residue it deliberately leaves. Links that escape a moved legacy
lane are reported for owner reconciliation, not rewritten speculatively.
Matching old root runtime files and unresolved branch setup likewise need a
truthful residue record instead of disappearing from the migration result.

Reports use report-scoped finding IDs and name an explicit review destination.
A claim about a source must be distinguished from an installed copy's text.
Lifecycle completion guidance records observed harness friction or an explicit
none-observed result. A report does not authorize its own repairs, and
attention diagnostics do not acquire blocking effect merely because they are
visible.

The original guardrail score movement and reviewed integration delivery are
historical evidence. They do not establish agent reliability, current external
review-application state, or successful repair of a downstream room. Current
runtime tests exercise strict ingestion, manifest resolution and migration
preservation without requiring an external project sweep.

## Evidence and Sources

- [Historical S-028 record](../../specs/S-028-harness-feedback-integrity/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-028-harness-feedback-integrity/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-028-harness-feedback-integrity/SPEC.md`.
- [tools/audit-guardrails.mjs](../../../tools/audit-guardrails.mjs) — current owning source or verification seam.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) — current owning source or verification seam.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) — current owning source or verification seam.
- [templates/feedback/REPORT_FORMAT.md](../../../templates/feedback/REPORT_FORMAT.md) — current owning source or verification seam.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) — current owning source or verification seam.
- [skills/update-harness/SKILL.md](../../../skills/update-harness/SKILL.md) — current owning source or verification seam.
- [tools/test-guardrail-audit.mjs](../../../tools/test-guardrail-audit.mjs) — current owning source or verification seam.
- [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) — current owning source or verification seam.
- [tools/test-workbench-adoption.mjs](../../../tools/test-workbench-adoption.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
