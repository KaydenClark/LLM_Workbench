# TK-002K - Resolve short and widened IDs to one stored record

**Task ID:** TK-002K
**Spec ID:** S-01W
**Slice:** Resolve short and widened IDs to one stored record
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W Desired Behavior 3 and 4 for public Spec and Task selectors.
**Planned verification:** Red: in a disposable room holding stored `S-00Q` with Task `TK-00A`, `show S-000Q`, `claim S-000Q` and a widened Task selector (`TK-000A`) fail as unknown while the short forms work; green: widened and short selectors (and case variants that share the collision key) resolve to the one stored record, output reports the stored ID and path unchanged, two records sharing one key refuse selection by name, numeric historical Task labels keep Spec-qualified scope, and no record bytes or paths change.
**Proof:** Red at 7d1282f runtime with the new tests: test-visible-id-consumers.mjs 5 of 23 failed (show of a widened selector for a short stored Spec ID answered Unknown spec ID; widened Spec and Task blocker spellings stayed unsatisfied; an active record plus a retired record sharing one collision key returned one of them instead of refusing; claim through a widened numeric Spec selector was unknown; a widened orphan corrective Task selector answered Unknown corrective Task ID); the test-spec-workbench.mjs dual-form block failed at its first widened receipt selector (Unknown spec ID). Green at 5bb6406: test-visible-id-consumers.mjs 23/23; test-spec-workbench.mjs including the dual-form receipt, gate, move-task and retired-show block; test-visible-ids, test-spec-report, test-workbench-identity, test-adr, test-notepads, test-spec-citation-anchors and test-diagnostics pass; full AGENTS suite 48 pass 0 fail on 5bb6406 (read-only runner, dirty []). Guardrail 106.6/113 before (7d1282f) and after (5bb6406); S-00K self-drift pre and post both report the same 7 attention findings and no new one.

## Outcome

Public Spec and Task operations accept every supported spelling of an identity
(`S-00Q`, `S-000Q`; `TK-00A`, `TK-000A`) and act on the one stored record,
reporting its stored identity and path. Ambiguous duplicates refuse rather than
choosing a winner. Nothing is renamed: widening is the later `widen-id` slice.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. Source: ledger row E-8 (owner answer
2026-09-22): the allocator treats `S-00Q` and `S-000Q` as the same, with
dual-form lookup, and existing IDs are not mass-renamed.

## Released Lane

Write lane: `workbench/tools/spec-workbench.mjs` (selector resolution: trace
`findSpec`, parent checks in `next-id`, Task selectors in `claim`/`close`/
`show`/`move-task`, blocker matching and retired explicit lookup),
`workbench/tools/task-record.mjs` only if Task lookup lives there,
`tools/test-visible-id-consumers.mjs`, `tools/test-spec-workbench.mjs`, and the
ADR-0041 "delivered" paragraph. If the trace shows QA/report consumers
(`spec-report.mjs`) also need it and the change exceeds one bounded Task, stop
at the Spec/Task command surface and record the remainder as a gap.

Also carry TK-02B's review note: an active record and a retired record whose
IDs share one collision key are diagnosed by `doctor` but folded as occupied
inventory by `next-id`; decide at the selector seam whether selection by that
key refuses (Desired Behavior 3: ambiguous duplicates refuse rather than
choosing a winner), and prove the chosen behavior in a fixture.

## Decisions

None.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s01w-dual-form-selection | 5bb640642b9d1f1f3ad86a5f3320542b2a75646c | ahead 0 behind 0 | 0 | Red at 7d1282f runtime with the new tests: test-visible-id-consumers.mjs 5 of 23 failed (show of a widened selector for a short stored Spec ID answered Unknown spec ID; widened Spec and Task blocker spellings stayed unsatisfied; an active record plus a retired record sharing one collision key returned one of them instead of refusing; claim through a widened numeric Spec selector was unknown; a widened orphan corrective Task selector answered Unknown corrective Task ID); the test-spec-workbench.mjs dual-form block failed at its first widened receipt selector (Unknown spec ID). Green at 5bb6406: test-visible-id-consumers.mjs 23/23; test-spec-workbench.mjs including the dual-form receipt, gate, move-task and retired-show block; test-visible-ids, test-spec-report, test-workbench-identity, test-adr, test-notepads, test-spec-citation-anchors and test-diagnostics pass; full AGENTS suite 48 pass 0 fail on 5bb6406 (read-only runner, dirty []). Guardrail 106.6/113 before (7d1282f) and after (5bb6406); S-00K self-drift pre and post both report the same 7 attention findings and no new one. | ADR-0041 amended: dual-form lookup moves to delivered for the public Spec and Task selectors, the active-plus-retired alias refusal is stated, and the spec-report library pass-through is kept as remaining. RUNBOOK Visible Identifiers does not yet say that selectors accept any spelling sharing the stored record's collision key and that aliased records refuse by name: routed to S-00P with the TK-02B RUNBOOK and LEXICON wording. | Direct library callers of the spec-report.mjs functions (assembleSpecReport, recordReviewVerdict, recordOwnerApproval, createCorrectiveTasks) still echo or record the caller's selector spelling; the CLI entry points resolve it first. The widen-id touch verb, moving ADR and notepad allocation onto the artifact policy, and assembled capability QA remain later S-01W slices (unallocated). RUNBOOK and LEXICON wording routed to S-00P. Separate-context integration review not yet run. | 952d8f1ba8157c3dfc7e36cfd2a1bb750886f5ad37c434c13dc461d1a908dae5 |
