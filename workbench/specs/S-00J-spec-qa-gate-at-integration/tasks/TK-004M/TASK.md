# TK-004M - P1: Git replacement objects let a named empty candidate impersonate committed Spec content and accept PASS or FAIL verdicts and gates. Disable replacement semantics and inherited repository selectors and object transport for bounded committed-content reads before writing.

**Task ID:** TK-004M
**Spec ID:** S-00J
**Slice:** P1: Git replacement objects let a named empty candidate impersonate committed Spec content and accept PASS or FAIL verdicts and gates. Disable replacement semantics and inherited repository selectors and object transport for bounded committed-content reads before writing.
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00J Acceptance Criteria
**Planned verification:** Answers evidence row 35 (fail verdict at 02a5212a143b6d3641a9b7652c8b100c12a54b7c on 2026-10-01): P1: Git replacement objects let a named empty candidate impersonate committed Spec content and accept PASS or FAIL verdicts and gates. Disable replacement semantics and inherited repository selectors and object transport for bounded committed-content reads before writing.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00j-verdict-committed-content | 9cf0d216acc73c9cacfd66cbd6b136fcf4ece5db | ahead 3 behind 0 | 1 | Full51 PASS at9cf0d216. Replacement refs and inherited Git selectors refuse PASS/FAIL/gate without writes. Missing promisor commit/tree/blob refuse without transport, every Git metadata byte preserved. Focused report and prior binding regressions PASS; red b039c397 and intermediate shebang failure preserved. | Owned spec-report candidate reader semantics, public regressions and Spec current corrective state; no root/template or managed bundle change needed. | Exact independent successor review and integration containment pending; separate partial-write recovery and owner QA/main gates remain open. | 7b1651f99f92aeae66b90fd63db9910ab18fc02a37ba92d9172258f07a7b6592 |
