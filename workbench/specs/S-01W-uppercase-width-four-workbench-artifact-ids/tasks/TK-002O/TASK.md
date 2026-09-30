# TK-002O - Widen an active record's ID with the explicit widen-id verb

**Task ID:** TK-002O
**Spec ID:** S-01W
**Slice:** Widen an active record's ID with the explicit widen-id verb
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W Desired Behavior 5 and acceptance line 3 (eligible touch migration preserves former IDs, live links and immutable history without renaming completed records).
**Planned verification:** Red: in a disposable Git room with an active Spec `S-00Q` (one live link to it from another Spec and one historical evidence row naming it) and an active Task `TK-00A`, `widen-id S-00Q` and `widen-id TK-00A` are unknown commands; green: each widens once to `S-000Q` / `TK-000A` (folder, `**Spec ID:**`/`**Task ID:**` field, live links rewritten through the move machinery's reference rewrite), records the former ID in explicit record metadata that parses and round-trips, keeps evidence rows byte-identical and countable, resolves the former ID through dual-form lookup, and a repeat run is a no-op; it refuses without partial mutation for complete Specs, done Tasks, retired records, a dirty tree, an occupied destination or alias, and an unsafe path.
**Proof:** Red at 4c6c51d runtime with the new tests: test-visible-id-consumers.mjs 7 of 30 failed and the test-spec-workbench.mjs widen-id block failed at its first refusal, each because widen-id was an unknown command (the CLI answered with its usage error), and the Former ID round-trip assertion failed because formatTaskRecord wrote no Former ID line. Green at 9c0bf62: test-visible-id-consumers.mjs 30/30; test-spec-workbench.mjs including the widen-id journey (a short active Spec, then its open Task, widen once to width four with a Former ID field; live links in another Spec and AGENTS.md are rewritten; both evidence sections stay byte-identical with their old-path links counted as historical; former, widened and case-variant selectors resolve, also from a cold clone; repeat runs are no-ops; the result is staged, not committed; git reset --hard restores the pre-widen tree; complete, done, retired and dirty-tree cases refuse without mutation); the consumer file adds occupied Spec and Task alias, occupied destination, symlinked record, slice-table row, numeric label needing --spec, case-only rename and Former ID parse/format round-trip and mismatch cases. test-visible-ids, test-spec-report, test-workbench-identity, test-adr, test-notepads, test-spec-citation-anchors, test-diagnostics, test-sessions and test-check-append-only pass; full AGENTS suite 48 pass 0 fail on 9c0bf62 (read-only runner, dirty []). Guardrail 106.6/113 before (4c6c51d) and after (9c0bf62); S-00K self-drift pre and post both report the same 7 attention findings and no new one.

## Outcome

An agent starting substantive work on an active record can run
`widen-id S-###|TK-###` to bring its identity to the width-four form. The
command is explicit and identity-only: it never changes status, never touches
completed or retired records, and preserves the former ID and immutable
history. A read-only inventory at QA/verify time (the assembled QA slice) finds
active records still short.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. Sources: ledger row E-8 (owner answer
2026-09-22: existing IDs widen only when their record is next touched, former
ID kept; completed records are not renamed; sweep only at QA/verify) and the
Director's E-8-derived decision recorded in S-01W Decisions (explicit
`widen-id` verb; automatic widening in `claim` and no widening rejected;
owner-vetoable).

## Released Lane

Write lane: `workbench/tools/spec-workbench.mjs` (new `widen-id` verb reusing
the `move-spec`/`move-task` reference-rewrite and scan machinery; do not change
lifecycle move behavior), `workbench/tools/task-record.mjs` (former-ID field
parse/format round trip), `tools/test-spec-workbench.mjs`,
`tools/test-visible-id-consumers.mjs`, and the ADR-0041 delivered/remaining
paragraph. The exact former-ID field name and shape are settled here and
recorded in the Task's Decisions section as a durable choice routed to ADR-0041.

## Decisions

| Choice | Scope | Disposition | Durable owner |
|---|---|---|---|
| Former-ID field shape: a widened Spec or Task record keeps its previous spelling in one `**Former ID:**` header field placed directly under its own `**Spec ID:**`/`**Task ID:**` line; the value must be another spelling of the same identity (same prefix and collision key, never the current spelling), appears at most once, and is absent on a record that never widened. `parseFormerId` and `formatTaskRecord` in `task-record.mjs` read and write it for both record kinds; `show` reports it as `formerId`. | durable | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| Verdict digest treatment: `computeSpecDigest` includes the Former ID field with no new normalization. Widening already changes the digested ID field, title and Task directory names, so excluding the field alone would buy nothing; a widened record is a new review candidate, which is why the verb runs when substantive work starts. | durable | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| Staging: `widen-id` follows `move-spec`/`move-task` and stages its change with `git add -A` without committing; the clean-tree precondition keeps HEAD the recovery point and the agent commits one reviewable candidate. It also re-renders the Taskboard and catalog. | durable | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| Eligibility and scope: a planned, active or blocked Spec, or an open (not done) record-backed Task under such a Spec; complete, needs-review, superseded, done, retired and slice-table rows refuse. Widening a Spec points its open child Tasks' `**Spec ID:**` at the widened parent; done and retired records keep their bytes. A numeric Task label that recurs across Specs needs `--spec`. | durable | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s01w-widen-id | 9c0bf62ff43215a01f8957a74126e15ed3f66933 | ahead 0 behind 0 | 0 | Red at 4c6c51d runtime with the new tests: test-visible-id-consumers.mjs 7 of 30 failed and the test-spec-workbench.mjs widen-id block failed at its first refusal, each because widen-id was an unknown command (the CLI answered with its usage error), and the Former ID round-trip assertion failed because formatTaskRecord wrote no Former ID line. Green at 9c0bf62: test-visible-id-consumers.mjs 30/30; test-spec-workbench.mjs including the widen-id journey (a short active Spec, then its open Task, widen once to width four with a Former ID field; live links in another Spec and AGENTS.md are rewritten; both evidence sections stay byte-identical with their old-path links counted as historical; former, widened and case-variant selectors resolve, also from a cold clone; repeat runs are no-ops; the result is staged, not committed; git reset --hard restores the pre-widen tree; complete, done, retired and dirty-tree cases refuse without mutation); the consumer file adds occupied Spec and Task alias, occupied destination, symlinked record, slice-table row, numeric label needing --spec, case-only rename and Former ID parse/format round-trip and mismatch cases. test-visible-ids, test-spec-report, test-workbench-identity, test-adr, test-notepads, test-spec-citation-anchors, test-diagnostics, test-sessions and test-check-append-only pass; full AGENTS suite 48 pass 0 fail on 9c0bf62 (read-only runner, dirty []). Guardrail 106.6/113 before (4c6c51d) and after (9c0bf62); S-00K self-drift pre and post both report the same 7 attention findings and no new one. | ADR-0041 amended: the widen-id touch moves to delivered with its Former ID field, eligibility, refusals, staging and digest treatment; remaining work is ADR and notepad allocation and the QA-time inventory. The S-01W former-ID Decisions bullet now points to the TK-002O Decisions table (four durable choices reconciled to ADR-0041) and the stale Remaining Limitations bullet is replaced. RUNBOOK Visible Identifiers does not yet document widen-id, the Former ID field or when to run it: routed to S-00P with the earlier TK-02B and TK-002K RUNBOOK and LEXICON wording. | Moving ADR and notepad allocation onto the artifact policy and the read-only QA-time inventory of records not yet widened remain later S-01W slices (unallocated); direct spec-report.mjs library callers still echo the caller's selector spelling; historical evidence links to a widened record's old path stay as written and doctor reports them as attention-only broken-link findings, as move-spec leaves them. RUNBOOK and LEXICON wording routed to S-00P. Acceptance line 3 and the Completion Result are left to the dispatcher; separate-context integration review not yet run. | e7ea3c6de99a2425def66e36d4f45a03f583b52e822853707e02c155d6af97e2 |
