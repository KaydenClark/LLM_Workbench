# TK-01Y - Inspect documentation distributions across source types and scopes

**Task ID:** TK-01Y
**Spec ID:** S-01T
**Slice:** Inspect documentation distributions across source types and scopes
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-01X
**Destination:** spec-acceptance: Exact eight-step vocabulary, the 30/20/50 example, shared identity deduplication, mixed-question contribution and Workbench-wide aggregation pass deterministic examples without filtering or flattening away meaning; empty, unknown, missing-assessment, invalid-fraction and cyclic dependency cases terminate with explicit outcomes and invalid writes preserve prior data; changed understanding exposes evidence-backed affected claims and preserves earlier proof
**Planned verification:** Red: at the TK-01X public persistence and projection seam, persisted source-type by scope tables (grilling question, Spec, ADR, Task, DQC at DQC, landmark and Workbench scope) fail for shared-identity deduplication, mixed-DQC contribution, incomplete and invalid outcomes, arithmetic versus navigation cycles and claim revisions. Green: each passes through persist, restart and rebuild; invalid updates leave bytes unchanged. Targeted tests, then the full AGENTS suite; the TK-01X demo extended in under a minute.

## Outcome

Extend the Foundation runtime and test serially (same files, one writer).
Related grilling questions, Specs, ADRs, Tasks and DQCs contribute with the
same evidence-bearing documentation meaning and typed room-scoped identity,
preserving legacy Spec-qualified numeric Task labels.

## Required Behavior

- Keep the exact order Idea, Aligning, Confirmed, Mapped, Planned, Journey,
  Review, Verified. Each distinct declared constituent contributes one unit;
  a mixed item's fractions sum to one and state their basis.
- Deduplicate shared identity in each aggregate while keeping every
  relationship visible for navigation. A mixed DQC stays one item; expanding
  its lineage never flattens children into the aggregate. No
  supporting-reference exclusion and no effort weighting.
- Empty input shows no items. Unknown identities and missing assessments
  report incomplete; nonfinite, negative, unknown-step and wrong-sum fractions
  report invalid. Never drop a bad record to make totals pass.
- Preserve navigation cycles; refuse arithmetic dependency cycles naming the
  identity chain.
- Inspect numerator, denominator, evidence revision and fraction rationale at
  DQC, landmark and Workbench scope, including the 30/20/50 example.
- On changed understanding, record what changed, why and the revision; assess
  specific affected claims; keep original proof and unaffected claims. A
  relation alone does not make a target stale. A done Task or accepted ADR
  never yields Verified by itself.

## Paths

`workbench/tools/landmark-tracker.mjs`, `tools/test-landmark-tracker.mjs`,
`workbench/landmark-tracker/README.md`. No second assessment store. Runbook
wording goes to Remaining Gaps for S-00P (root controls stay out of lane).

## Done Criteria And Closing Proof

Red and green SHAs, targeted tallies, full suite on the committed candidate,
doctor, extended demo command, README update and Remaining Gaps.
