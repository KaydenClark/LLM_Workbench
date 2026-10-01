# TK-004M - P1: Git replacement objects let a named empty candidate impersonate committed Spec content and accept PASS or FAIL verdicts and gates. Disable replacement semantics and inherited repository selectors and object transport for bounded committed-content reads before writing.

**Task ID:** TK-004M
**Spec ID:** S-00J
**Slice:** P1: Git replacement objects let a named empty candidate impersonate committed Spec content and accept PASS or FAIL verdicts and gates. Disable replacement semantics and inherited repository selectors and object transport for bounded committed-content reads before writing.
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00J Acceptance Criteria
**Planned verification:** Answers evidence row 35 (fail verdict at 02a5212a143b6d3641a9b7652c8b100c12a54b7c on 2026-10-01): P1: Git replacement objects let a named empty candidate impersonate committed Spec content and accept PASS or FAIL verdicts and gates. Disable replacement semantics and inherited repository selectors and object transport for bounded committed-content reads before writing.
**Proof:** Verified source 9cf0d216acc73c9cacfd66cbd6b136fcf4ece5db passed all 51 required checks and focused Git replacement, ambient selector, and missing promisor object probes; source committed and pushed before this close. Independent successor review remains pending.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00j-verdict-committed-content | 9cf0d216acc73c9cacfd66cbd6b136fcf4ece5db | ahead 3 behind 0 | 1 | Full51 PASS at9cf0d216. Replacement refs and inherited Git selectors refuse PASS/FAIL/gate without writes. Missing promisor commit/tree/blob refuse without transport, every Git metadata byte preserved. Focused report and prior binding regressions PASS; red b039c397 and intermediate shebang failure preserved. | Owned spec-report candidate reader semantics, public regressions and Spec current corrective state; no root/template or managed bundle change needed. | Exact independent successor review and integration containment pending; separate partial-write recovery and owner QA/main gates remain open. | 7b1651f99f92aeae66b90fd63db9910ab18fc02a37ba92d9172258f07a7b6592 |
| 2 | codex/s00j-verdict-committed-content | f6290bb0185f4648fc4d17466d42be3bb578db8a | ahead 0 behind 0 | 0 | Verified source 9cf0d216acc73c9cacfd66cbd6b136fcf4ece5db passed all 51 required checks and focused Git replacement, ambient selector, and missing promisor object probes; source committed and pushed before this close. Independent successor review remains pending. | Updated owned verdict candidate-content implementation, bounded Git reads, regression fixtures and source verification record. | Independent exact successor review and integration containment pending. Separate corrective-batch partial-write recovery and owner QA/main approval remain open. | 1f537c0f470af1faa126d5aad257acab336675efb92a963075dc0cc2b8ab5100 |
