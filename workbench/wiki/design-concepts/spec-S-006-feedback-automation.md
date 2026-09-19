---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-006-feedback-automation/SPEC.md
  - tools/feedback-automation.mjs
  - tools/test-feedback-automation.mjs
  - tools/test-eval-runner.mjs
  - evals/run.py
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Evidence-Gated Harness Feedback

The feedback loop separates candidate construction from an independent
integration decision. Discovery reads the declared feedback lane first, then
supported legacy feedback filenames. It excludes noncanonical project copies,
normalizes origins, ranks candidates by impact and recurrence, and selects no
new candidate while a pending fingerprint already exists.

The decision seam distinguishes an infrastructure block from an evidence
failure. A candidate must reproduce the original problem, fix the regression,
pass the full suite, remain current and mergeable, and contain public-safe
material. Static or guardrail regression denies the candidate. A behavioral
claim additionally needs positive confidence evidence; a direct correctness
repair does not acquire a broad behavioral claim merely by passing tests.

S-006's July 2026 operational proof recorded a Terra builder and Sol gatekeeper,
daily Denver schedules, a bounded trial budget, same-account comment-based
verdicts and temporary-worktree isolation after the host rejected native
scheduler worktree execution. Those are dated deployment facts. This article
does not verify that either schedule remains installed, active or configured
that way, and does not authorize messages, model spend or scheduler changes.

The repository retains the portable discovery, decision and provider-adapter
seams. Current scheduler definitions and external operation need their own
live evidence. S-013 separately explains run-level accounting; it does not
replace the pass/deny/blocked evidence decision. Protected-branch promotion
and downstream mutation remain governed by current owner authority.

## Evidence and Sources

- [Historical S-006 record](../../specs/S-006-feedback-automation/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-006-feedback-automation/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-006-feedback-automation/SPEC.md`.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) — current owning source or verification seam.
- [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) — current owning source or verification seam.
- [tools/test-eval-runner.mjs](../../../tools/test-eval-runner.mjs) — current owning source or verification seam.
- [evals/run.py](../../../evals/run.py) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
