# TK-002S - Record achieved Result independently of Expected result

**Task ID:** TK-002S
**Spec ID:** S-002B
**Slice:** Record achieved Result independently of Expected result
**Status:** in-progress
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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/dqc-result-tk002s | 912563f981ad89045635ef6c5b6cc9eb96f104f8 | ahead 8 behind 0 | 0 | Runtime/test source 912563f981ad89045635ef6c5b6cc9eb96f104f8, clean before and after full verification. Red 6f2165b93efa2a999ed6e4d3c8a8b90f7b058fcb: public CLI invalid-invocation rejects --result; API reports no change; 0/5. Green tools/test-dqc-result.mjs 5/5; tools/test-landmark-tracker.mjs 23/23; node tools/dqc-result-demo.mjs PASS under one minute; git diff --check PASS. Full current AGENTS suite 48/48 exit0 at runtime source 912563f: node tools/test-spec-workbench.mjs PASS; node tools/test-skill-catalog.mjs PASS; node tools/test-skill-inspection.mjs PASS; node tools/test-skills-lane.mjs PASS; node tools/test-core-composition.mjs PASS; node tools/test-project-evidence.mjs PASS; node tools/test-genesis-from-decisions.mjs PASS; node tools/test-blueprint-contract.mjs PASS; node tools/test-session-transport.mjs PASS; node tools/test-configured-host.mjs PASS; node tools/test-core-skill-installer.mjs PASS; node tools/test-workbench-layout.mjs PASS; node tools/test-workbench-adoption.mjs PASS; node tools/test-workbench-upgrade.mjs PASS; node tools/test-workbench-tools.mjs PASS; node tools/test-diagnostics.mjs PASS; node tools/test-adr.mjs PASS; node tools/test-governance-core.mjs PASS; node tools/test-branch-closeout.mjs PASS; node tools/test-wiki.mjs PASS; node tools/test-sessions.mjs PASS; node tools/test-notepads.mjs PASS; node tools/test-visible-ids.mjs PASS; node tools/test-workbench-identity.mjs PASS; node tools/test-visible-id-consumers.mjs PASS; node tools/test-direct-promotion.mjs PASS; node tools/test-workbench-round-trip.mjs PASS; node tools/test-cross-provider-fixture.mjs PASS; node tools/test-portability-matrix.mjs PASS; node tools/test-workbench-dogfood.mjs PASS; node tools/test-evaluate-workbench.mjs PASS; node tools/test-guardrail-audit.mjs PASS; node tools/test-context-tools.mjs PASS; node tools/test-outcome-trials.mjs PASS; node tools/test-eval-runner.mjs PASS; node tools/test-feedback-automation.mjs PASS; node tools/test-symlink-invocation.mjs PASS; node tools/test-control-fidelity.mjs PASS; node tools/test-spec-citation-anchors.mjs PASS; node tools/test-controls-vocabulary-sweep.mjs PASS; node tools/test-spec-report.mjs PASS; node tools/test-self-drift.mjs PASS; node tools/test-feedback-inventory.mjs PASS; node tools/test-grilling-ledger.mjs PASS; python3 tools/test-check-append-only.py PASS; python3 evals/tasks/task_b_path_safety/test_grade.py PASS; node tools/evaluate-workbench.mjs --path templates --include-controls PASS; node workbench/tools/spec-workbench.mjs doctor PASS. Pre self-drift phase pre source959b043 and post phase post source912563f: dirty=false and cleanUpdate=false, same stale S-00Q claim plus five stale-seed and historical-provenance limits. Guardrails78/100 pre/post unchanged; remaining recommendations: real repeated outcomes, matched controls/prior/candidate, recent exact-ref outcome evidence, uncertainty and ledger. Semantic readback: achieved Result preserves Expected result, origin, ID, confirmation and assessment; no stage/Verified/approval inference. This append-only receipt is a subsequent proof commit, not a separately full-suite-tested runtime candidate. | Updated workbench/landmark-tracker/README.md with --result/public API, history and independent restart-readable output, refusal and one-writer limits; added disposable public tools/dqc-result-demo.mjs. No root/template mirror: this Task extends an existing runtime seam without changing generic controls/schema, as assigned Spec permits. | Dispatcher owns Task closure and Spec reconciliation; S-002B composition and cross-Spec QA remain open. Separate-context Director integration review pending; no integration/main merge, version change, other-room update, cleanUpdate, Human QA or agent-outcome claim. Stale-read check is not a concurrency lock; record/projection crash window unchanged. Shared-module lease released at clean912; no subsequent runtime edits. | 29e65fc2355a4be86ed631d7ad81d2b9eb9c81a9f7e51737a14a39a49cc2a578 |
