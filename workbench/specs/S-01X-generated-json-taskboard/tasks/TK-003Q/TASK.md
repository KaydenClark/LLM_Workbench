# TK-003Q - Share source-qualified To-do eligibility across preview and dispatch

**Task ID:** TK-003Q
**Spec ID:** S-01X
**Slice:** Share source-qualified To-do eligibility across preview and dispatch
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01X shared lane calculation and dependency filtering, bounded stage 2A only.
**Planned verification:** Red public next chooses in-progress ahead of eligible To-do; selection and preview ordering disagree; doctor misses non-head To-do unmet dependencies. Green source-qualified shared lane calculation across preview/next/claim/doctor, priority/title/WBID order, visible unoffered dependencies, capability and remote-claim gates, scoped selectors, collision/no-write controls. Focused public fixtures/demo, full48 AGENTS plus3 RUNBOOK immutable checks, append-only and drift pre/post; independent exact-head review before integration.
**Proof:** Exact implementation b06f3e47cbfa42ad690832097555e58f1cd1ef39: all51 local required commands PASS (48 AGENTS plus3 RUNBOOK), 23 public preview/next/claim/doctor regression groups PASS and under-minute demo. Red43e15bd698f22f359919106746db23031d1d46c4 had six expected behavior failures with runtime unchanged. Source-qualified To-do-only eligibility, Task priority/title/WBID order, visible dependency waits, cleared continuation action, capability and competing-claim gates, scoped numeric IDs and canonical no-write collision refusal verified. Installed cold source/show recovery, actual append-only history CLEAN; earlier fc50 46/48 receipts retained. Prior Tasks/FAIL1/S00I bound proof preserved; guardrails78/100 four recommendations and seven prior drift findings remain, no clean-update or owner-QA claim.

## Assigned Boundary

Stage 2A follows reviewed PR228 integration 2780fe66754abf69b2ab6dea23337a7be0f6d801. The assigned writer owns workbench/tools/taskboard.mjs, selection/claim/dependency-diagnostic sections of workbench/tools/spec-workbench.mjs, tools/test-taskboard-json.mjs and corresponding tools/test-spec-workbench.mjs fixtures. Extract pure source-qualified lane/eligibility entries, offer only eligible To-do Tasks from ordinary next, preserve dependency visibility and priority/title/WBID order, and reuse eligibility in claim and doctor. Preserve capability routing, remote-claim exclusions, numeric Task scope and existing explicit selectors. Flat JSON collision refusal remains fail-closed with no output write. No second canonical source.

Source needs-review vocabulary, review mode, minimal Backlog validation, root/template Markdown switch, identity migration and whole-Spec delivery remain subsequent slices. No S01W QA takeover; RUNBOOK and its partially owned Visible Identifiers section are excluded. Reconcile broader shared-reader scope before expansion. No owner approval or completed Spec claim.

## Consequential Regression Ownership

The installed diagnostics and cold round-trip fixtures also assert the superseded resumable ordinary-next behavior. Their matching assertions in tools/test-diagnostics.mjs and tools/test-workbench-round-trip.mjs now verify eligible To-do offering and explicit source/show recovery of the existing in-progress claim. This is required regression parity for the assigned selection change, with no additional runtime or S01W ownership expansion.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s01x-tk003q-shared-eligibility | b06f3e47cbfa42ad690832097555e58f1cd1ef39 | ahead 0 behind 0 | 0 | Exact implementation b06f3e47cbfa42ad690832097555e58f1cd1ef39: all51 local required commands PASS (48 AGENTS plus3 RUNBOOK), 23 public preview/next/claim/doctor regression groups PASS and under-minute demo. Red43e15bd698f22f359919106746db23031d1d46c4 had six expected behavior failures with runtime unchanged. Source-qualified To-do-only eligibility, Task priority/title/WBID order, visible dependency waits, cleared continuation action, capability and competing-claim gates, scoped numeric IDs and canonical no-write collision refusal verified. Installed cold source/show recovery, actual append-only history CLEAN; earlier fc50 46/48 receipts retained. Prior Tasks/FAIL1/S00I bound proof preserved; guardrails78/100 four recommendations and seven prior drift findings remain, no clean-update or owner-QA claim. | S01X stage2A verified state and owning Task boundary updated; matching installed diagnostics/round-trip expectations reconciled. RUNBOOK, templates and root Markdown contract untouched. | Fresh independent exact-head Task review required before integration. Source needs-review/review mode, minimal Backlog validation, complete stage2 child/review gates, direct/orphan home, sitrep and canonical root/template rollout remain later work. All nine Spec criteria and owner Human QA remain open; S01W QA ownership separate. | e0804f5a761927fc5bade868ea7e9923be92272ddbea8d5a4b56117d12a202b9 |
