---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-013-automation-run-outcomes/SPEC.md
  - tools/feedback-automation.mjs
  - tools/test-feedback-automation.mjs
  - RUNBOOK.md
  - README.md
last_verified: 2026-10-04
---

# Verified Automation Run Outcomes

Run accounting distinguishes useful work, genuine absence of work and an
interrupted attempt. The Standardized Automation Run Outcomes Spec (S-013)
delivered a helper that computes the transition for each run outcome and a
pause recommendation.

## What It Does

The helper accepts exactly six categories: `actionable`, `worked`, `idle`,
`owner_gate`, `collision` and `infrastructure_error`. It requires a nonempty
reason and a nonnegative integer previous idle count. Unknown categories fail
visibly.

Only `idle` with explicit `verifiedIdle: true` increments the count. Actionable
or worked results reset it to zero. Owner gates, collisions and infrastructure
errors preserve the previous count; they never supply additional evidence that
canonical discovery found nothing. A pause is recommended only on a verified
idle result whose resulting count is at least two. Preserving a count of two
during an infrastructure error therefore does not recommend pausing that run.

The public seam is `transitionRunOutcome` and the `run-outcome --input FILE`
JSON command. It computes a transition and recommendation; it neither persists a
scheduler streak nor changes an automation's active state. The scheduler adapter
owns applying the result and retaining its own evidence. The pass, deny and
blocked decision of the Evidence-Gated Harness Feedback Spec (S-006) remains a
separate contract.

## Why It Matters

Lock contention, overlap, authentication failure and provider failure must not
become verified idle simply because no work landed.

## Limits

- The Spec originally routed scheduler integration to GPT_OS ownership. This
  article preserves that boundary without asserting the current state of
  external scheduler definitions.
- The fixture tests cover the accounting rules without making an agent-outcome
  claim.

## Evidence and Sources

- [Historical Standardized Automation Run Outcomes Spec (S-013)](../../specs/S-013-automation-run-outcomes/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-013-automation-run-outcomes/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-013-automation-run-outcomes/SPEC.md`.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) - the helper holding `transitionRunOutcome` and the `run-outcome` command.
- [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) - the fixture tests for the accounting rules.
- [RUNBOOK.md](../../../RUNBOOK.md) and [README.md](../../../README.md) - the routes that document the helper.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-013-automation-run-outcomes.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
