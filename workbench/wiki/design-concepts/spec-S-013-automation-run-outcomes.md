---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-013-automation-run-outcomes/SPEC.md
  - tools/feedback-automation.mjs
  - tools/test-feedback-automation.mjs
  - RUNBOOK.md
  - README.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Verified Automation Run Outcomes

Run accounting distinguishes useful work, genuine absence of work and an
interrupted attempt. The helper accepts exactly six categories: `actionable`,
`worked`, `idle`, `owner_gate`, `collision` and `infrastructure_error`. It
requires a nonempty reason and a nonnegative integer previous idle count.
Unknown categories fail visibly.

Only `idle` with explicit `verifiedIdle: true` increments the count. Actionable
or worked results reset it to zero. Owner gates, collisions and infrastructure
errors preserve the previous count; they never supply additional evidence that
canonical discovery found nothing. A pause is recommended only on a verified
idle result whose resulting count is at least two. Preserving a count of two
during an infrastructure error therefore does not recommend pausing that run.

The public seam is `transitionRunOutcome` and the `run-outcome --input FILE`
JSON command. It computes a transition and recommendation; it neither persists
a scheduler streak nor changes an automation's active state. The scheduler
adapter owns applying the result and retaining its own evidence. S-006's
candidate pass/deny/blocked decision remains a separate contract.

S-013 originally routed scheduler integration to GPT_OS ownership. This note
preserves that boundary without asserting the current state of external
scheduler definitions. Lock contention, overlap, authentication failure and
provider failure must not become verified idle simply because no work landed.
The fixture tests cover the accounting rules without making an agent-outcome
claim.

## Evidence and Sources

- [Historical S-013 record](../../specs/S-013-automation-run-outcomes/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-013-automation-run-outcomes/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-013-automation-run-outcomes/SPEC.md`.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) — current owning source or verification seam.
- [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [README.md](../../../README.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
