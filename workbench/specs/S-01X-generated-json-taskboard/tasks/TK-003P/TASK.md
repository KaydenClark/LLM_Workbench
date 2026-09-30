# TK-003P - Refuse normalized duplicate source fields before JSON preview writes

**Task ID:** TK-003P
**Spec ID:** S-01X
**Slice:** Refuse normalized duplicate source fields before JSON preview writes
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-01X Acceptance Criteria
**Planned verification:** Answers evidence row 7 (fail verdict at 7a1746843200ca14243ff6337ce2345103f6eac3 on 2026-09-30): P2: TK-003O preview field guard disagrees with the whole-document normalized source parser: a body duplicate Status or whitespace-normalized Status key is accepted at 7a1746843200ca14243ff6337ce2345103f6eac3 and overwrites existing JSON while moving active Spec with done children into Complete. Align preview validation with actual key/value normalization and preserve output on refusal.
**Proof:** Exact correction 82bd5b3847a816ee6a6ed731aee64b9af3d70439: all 51 required local commands PASS (48 AGENTS plus three RUNBOOK), 13 public JSON regression groups PASS and under-minute demo. Both original exact7a reproducers now refuse with prior JSON bytes preserved and no incorrect Complete. Red d249f5797d4b801bfee3dd065b9a267f88c24186 had four new failures with runtime unchanged from reviewed7a. Default source parsers and render seam unchanged. Actual append-only history CLEAN, FAIL1 and TK003O receipt preserved. Self-drift retains seven prior findings, guardrails unchanged 78/100 with four recommendations, no clean-update or owner QA claim.

## Bounded Correction

Correct only the independent PR228 P2 on TK-003O. Preserve its closed record, receipt and earlier proof. Public regressions must reproduce both body and normalized-key variants against exact 7a17468, preserve existing preview bytes on refusal, and cover whole-document scope, key/value trim, case sensitivity, whitespace and CRLF semantics used by both actual readers. Change only preview field validation, leaving the default Markdown parser/render behavior intact. Full51, guarded draft checkpoint publication and fresh independent review are required before integration. All broader S01X criteria remain open.

## Correction Verification

Both reported variants were reproduced against clean exact `7a1746843200ca14243ff6337ce2345103f6eac3`, tree `8a6ffffa184249a35a9ceff839eb14a4d5245810`: exit 0, existing preview bytes replaced and active Spec incorrectly moved into Complete. Durable test-only `d249f5797d4b801bfee3dd065b9a267f88c24186` has four new failing groups and nine prior passing groups while runtime bytes match reviewed 7a. The correction scans the entire document using the same regex and case-sensitive trimmed key/value extraction as both actual source readers, refusing every normalized duplicate before publication. Default parsers stay unchanged. Focused regression suite now passes 13 groups, including output-byte preservation, body/header variants, leading/trailing key whitespace, Unicode/tab/multiline trim, CRLF, different-case fields and single valid metadata fields after a section. Immutable full51 and fresh independent review remain required.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s01x-tk003o-json-preview | 82bd5b3847a816ee6a6ed731aee64b9af3d70439 | ahead 0 behind 0 | 0 | Exact correction 82bd5b3847a816ee6a6ed731aee64b9af3d70439: all 51 required local commands PASS (48 AGENTS plus three RUNBOOK), 13 public JSON regression groups PASS and under-minute demo. Both original exact7a reproducers now refuse with prior JSON bytes preserved and no incorrect Complete. Red d249f5797d4b801bfee3dd065b9a267f88c24186 had four new failures with runtime unchanged from reviewed7a. Default source parsers and render seam unchanged. Actual append-only history CLEAN, FAIL1 and TK003O receipt preserved. Self-drift retains seven prior findings, guardrails unchanged 78/100 with four recommendations, no clean-update or owner QA claim. | RUNBOOK preview normalized-field refusal procedure, S01X correction state and TK003P boundary/proof; TK003O failure link, prior proof/receipt unchanged. | Fresh independent exact-head Task PR review required before integration. All nine S01X acceptance criteria and owner QA remain open. Canonical legacy flat-ID reconciliation, shared selection/review vocabulary, direct/orphan Tasks, sitrep and root/template rollout remain later slices. S01W QA remains separate. | a7afa94d356dafc5142892adc5341a89330647df0b1650d695e360b01bd30729 |
