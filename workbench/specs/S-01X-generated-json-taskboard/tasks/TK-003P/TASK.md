# TK-003P - P2: TK-003O preview field guard disagrees with the whole-document normalized source parser: a body duplicate Status or whitespace-normalized Status key is accepted at 7a1746843200ca14243ff6337ce2345103f6eac3 and overwrites existing JSON while moving active Spec with done children into Complete. Align preview validation with actual key/value normalization and preserve output on refusal.

**Task ID:** TK-003P
**Spec ID:** S-01X
**Slice:** P2: TK-003O preview field guard disagrees with the whole-document normalized source parser: a body duplicate Status or whitespace-normalized Status key is accepted at 7a1746843200ca14243ff6337ce2345103f6eac3 and overwrites existing JSON while moving active Spec with done children into Complete. Align preview validation with actual key/value normalization and preserve output on refusal.
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-01X Acceptance Criteria
**Planned verification:** Answers evidence row 7 (fail verdict at 7a1746843200ca14243ff6337ce2345103f6eac3 on 2026-09-30): P2: TK-003O preview field guard disagrees with the whole-document normalized source parser: a body duplicate Status or whitespace-normalized Status key is accepted at 7a1746843200ca14243ff6337ce2345103f6eac3 and overwrites existing JSON while moving active Spec with done children into Complete. Align preview validation with actual key/value normalization and preserve output on refusal.

## Bounded Correction

Correct only the independent PR228 P2 on TK-003O. Preserve its closed record, receipt and earlier proof. Public regressions must reproduce both body and normalized-key variants against exact 7a17468, preserve existing preview bytes on refusal, and cover whole-document scope, key/value trim, case sensitivity, whitespace and CRLF semantics used by both actual readers. Change only preview field validation, leaving the default Markdown parser/render behavior intact. Full51, guarded draft checkpoint publication and fresh independent review are required before integration. All broader S01X criteria remain open.
