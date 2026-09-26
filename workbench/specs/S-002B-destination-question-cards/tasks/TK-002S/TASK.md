# TK-002S - Record achieved Result independently of Expected result

**Task ID:** TK-002S
**Spec ID:** S-002B
**Slice:** Record achieved Result independently of Expected result
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Public revision-safe Result write preserves Expected result, origin, identity and history and reloads through JSON and readable show.
**Planned verification:** Red: public revision-safe Result operation is unavailable or absent from JSON/readable reload. Green: Result summary and recording revision survive restart/rebuild, Expected result and origin remain unchanged, history records change/reason, stale and invalid writes preserve bytes. Use tools/test-dqc-result.mjs, existing Tracker tests/demo, then full AGENTS suite on immutable candidate.

## Outcome

A caller records achieved Result on one existing DQC using the public CLI/API,
then a fresh process reads both Expected result and Result through JSON and
readable show. Original identity, origin and earlier history stay interpretable;
Result cannot silently stand in for confirmation, assessment or Verified.

## Packet And File Lane

Assigned acceptance is the second and third S-002B acceptance lines. Read the
current Contract, S-002B, this Task, and cited source/test paths only as needed.
Use the existing landmark-tracker schema/API, not a new generic record system.

- `workbench/tools/landmark-tracker.mjs`: DQC first exclusive mutation lease;
  extend existing revise input/logic and readable show minimally.
- `tools/test-dqc-result.mjs`: narrow new independent test file at public seams.
- `workbench/landmark-tracker/README.md`: actual Result procedure and limits.
- Optional tiny `tools/dqc-result-demo.mjs` only if necessary for a repeatable
  public demo under one minute; reuse disposable-room patterns.
- This TASK only for worker receipts/proof. Dispatcher writes S-002B state.

Do not edit peer Specs/Tasks, existing `tools/test-landmark-tracker.mjs`, root
controls, projection/catalog, manifest/path/identity modules, Wiki or skills.
Existing safe storage/discovery is delivered. If a demonstrated dependency
requires widening, report exact need to dispatcher before mutation.

## Behavior And Closing Proof

1. Define a public revision option for a non-empty achieved summary; use a
   conventional CLI/API spelling and document it. Do not add needless fields.
2. Persist existing schema `result: {summary, revision}` at recording revision,
   with before/after history entry and reason. Expected result, origin, id,
   assessment and confirmation remain independently unchanged.
3. JSON show/rebuild retains Result and readable show displays it distinctly
   from Expected result. Fresh-process reload proves storage, not memory only.
4. Result can be revised without replacing older history. Invalid/empty/private
   data, stale revision and Result attempted on a landmark refuse by name and
   leave every record and projection byte unchanged. No stage or owner gate
   is inferred from a Result statement.
5. Preserve legacy schema reads/upgrades and current no-write safety semantics.

Worker first adds meaningful failing tests and records observed expected red,
then minimal implementation and targeted green. Run Result tests, inherited
Tracker suite and demo, and the full current AGENTS suite on a committed clean
candidate. Capture pre/post self-drift and guardrails with known limits. Report
exact red/green SHAs, branch, upstream, dirty count, test commands/tallies,
docs, public demo and remaining gap; do not claim cleanUpdate or Human QA.

## Baseline And Existing Evidence

Current implementation source b00a2e338436ef7b281b0cc53e74f891af32f18c;
S-01T TK-01X/TK-01Y delivered history remains unchanged. Dispatcher reproduced
inherited Tracker tests 23/23. Result gap is source-observed: validator supports
it but revise logic and accepted flags/readable format omit it. Red is worker
obligation, not claimed here. Baseline guardrails 78/100; pre self-drift
cleanUpdate false due stale S-00Q and historical seed/provenance limitations.

## Coordination And Exit

Owner explicitly authorizes one-Task worker delivery and callbacks. Dispatcher
local `01a0e003-bdca-7a23-962d-9505d2b6d17f`; Director local
`01a0dffd-886f-71c3-bb70-73dea18ce354`; Tracker local
`01a0e003-a89e-79d1-8c05-378b154b2357`; Records local
`01a0e003-b2d3-7e93-adc9-ce481774fee0`. Carry these IDs/authorization into
any authorized reviewer prompt. Send fresh-context readback and exact
immutable clean Result seam candidate to dispatcher; dispatcher releases the
shared module lease and performs whole-Spec QA. No scheduler, integration
merge before separate-context Director review, main promotion or other rooms.
This worker executes exactly TK-002S and ends; no next Task creation.

## Append-Only Task Receipts

| Date | Branch | HEAD | Upstream distance | Dirty count | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|---|---|

## Remaining Gaps

Whole-Spec workflow-maintenance and cross-Spec proof are dispatcher obligations,
not additional work for this one Task. Original owner Human QA is not satisfied
by worker tests/review.
