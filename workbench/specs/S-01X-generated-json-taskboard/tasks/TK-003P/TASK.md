# TK-003P - Refuse normalized duplicate source fields before JSON preview writes

**Task ID:** TK-003P
**Spec ID:** S-01X
**Slice:** Refuse normalized duplicate source fields before JSON preview writes
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-01X Acceptance Criteria
**Planned verification:** Answers evidence row 7 (fail verdict at 7a1746843200ca14243ff6337ce2345103f6eac3 on 2026-09-30): P2: TK-003O preview field guard disagrees with the whole-document normalized source parser: a body duplicate Status or whitespace-normalized Status key is accepted at 7a1746843200ca14243ff6337ce2345103f6eac3 and overwrites existing JSON while moving active Spec with done children into Complete. Align preview validation with actual key/value normalization and preserve output on refusal.

## Bounded Correction

Correct only the independent PR228 P2 on TK-003O. Preserve its closed record, receipt and earlier proof. Public regressions must reproduce both body and normalized-key variants against exact 7a17468, preserve existing preview bytes on refusal, and cover whole-document scope, key/value trim, case sensitivity, whitespace and CRLF semantics used by both actual readers. Change only preview field validation, leaving the default Markdown parser/render behavior intact. Full51, guarded draft checkpoint publication and fresh independent review are required before integration. All broader S01X criteria remain open.

## Correction Verification

Both reported variants were reproduced against clean exact `7a1746843200ca14243ff6337ce2345103f6eac3`, tree `8a6ffffa184249a35a9ceff839eb14a4d5245810`: exit 0, existing preview bytes replaced and active Spec incorrectly moved into Complete. Durable test-only `d249f5797d4b801bfee3dd065b9a267f88c24186` has four new failing groups and nine prior passing groups while runtime bytes match reviewed 7a. The correction scans the entire document using the same regex and case-sensitive trimmed key/value extraction as both actual source readers, refusing every normalized duplicate before publication. Default parsers stay unchanged. Focused regression suite now passes 13 groups, including output-byte preservation, body/header variants, leading/trailing key whitespace, Unicode/tab/multiline trim, CRLF, different-case fields and single valid metadata fields after a section. Immutable full51 and fresh independent review remain required.
