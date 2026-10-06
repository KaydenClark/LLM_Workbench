---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-006-feedback-automation/SPEC.md
  - tools/feedback-automation.mjs
  - tools/test-feedback-automation.mjs
  - tools/test-eval-runner.mjs
  - evals/run.py
  - RUNBOOK.md
last_verified: 2026-10-04
---

# Evidence-Gated Harness Feedback

The Automated Harness Feedback Gate Spec (S-006) separated candidate
construction from an independent integration decision in the harness feedback
loop. The repository retains the portable discovery, decision and
provider-adapter seams.

## What It Does

- **Discovery.** It reads the declared feedback lane first, then supported
  legacy feedback filenames. It excludes noncanonical project copies,
  normalizes origins, ranks candidates by impact and recurrence, and selects no
  new candidate while a pending fingerprint already exists.
- **Decision.** The decision seam distinguishes an infrastructure block from an
  evidence failure. A candidate must reproduce the original problem, fix the
  regression, pass the full suite, remain current and mergeable, and contain
  public-safe material. Static or guardrail regression denies the candidate. A
  behavioral claim additionally needs positive confidence evidence; a direct
  correctness repair does not acquire a broad behavioral claim merely by
  passing tests.

## Why It Matters

Separating construction from the integration decision, and distinguishing a
pass, a denial and a block, keeps an infrastructure failure from reading as
evidence about a candidate, and a passing test from reading as a behavioral
claim.

## Limits

- The Spec's July 2026 operational proof recorded a Terra builder and Sol
  gatekeeper, daily Denver schedules, a bounded trial budget, same-account
  comment-based verdicts and temporary-worktree isolation after the host
  rejected native scheduler worktree execution. Those are dated deployment
  facts. This article does not verify that either schedule remains installed,
  active or configured that way, and does not authorize messages, model spend
  or scheduler changes.
- Current scheduler definitions and external operation need their own live
  evidence.
- The Standardized Automation Run Outcomes Spec (S-013) separately explains
  run-level accounting; it does not replace the pass/deny/blocked evidence
  decision.
- Protected-branch promotion and downstream mutation remain governed by
  current owner authority.

## Evidence and Sources

- [Historical Automated Harness Feedback Gate Spec (S-006)](../../specs/S-006-feedback-automation/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-006-feedback-automation/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-006-feedback-automation/SPEC.md`.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) - the discovery, decision and provider-adapter seams.
- [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) - the verification seam for those seams.
- [tools/test-eval-runner.mjs](../../../tools/test-eval-runner.mjs) - the evaluation runner self-test.
- [evals/run.py](../../../evals/run.py) - the evaluation runner.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index and procedures.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-006-feedback-automation.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
