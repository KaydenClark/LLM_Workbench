# TK-001 - Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader

**Task ID:** TK-001
**Spec ID:** S-00G
**Slice:** Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00G Acceptance Criteria
**Planned verification:** Red test for a missing/malformed map; green minimal reader; full suite
**Proof:** Reader/schema and concrete routes 4/4; full required union 52/52 at 311001ae4d8debdebbb1be74c689f53c6e1f9583; installed matching runtime verified; independent TK-001 review no findings. See reader-proof-2026-10-01.json.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00g-ownership-map | 311001ae4d8debdebbb1be74c689f53c6e1f9583 | none | 0 | Reader missing-module red; embedded-claims mutation red; reader/schema/concrete-route tests 4/4 green. Separate reviewer found no remaining TK-001 findings at 311001ae4d8debdebbb1be74c689f53c6e1f9583. Exact full AGENTS/RUNBOOK union running in isolated clone. | Dated activation migration preserves original header and four plans; schema and reader are implemented. | Full suite completion; consumer sweep, generic template, query/comparator and S01U coverage reconciliation remain open. | ac59abf6d0caa396f887fb7dd07176f12285501ec3ed90f802c72d5f8350421b |
| 2 | codex/s00g-ownership-map | 311001ae4d8debdebbb1be74c689f53c6e1f9583 | none | 4 | 52/52 exact AGENTS/RUNBOOK union at 311001ae4d8debdebbb1be74c689f53c6e1f9583; reader tests 4/4; installed byte/verify proof; independent reader review no remaining findings. | SPEC.md and reader-proof-2026-10-01.json; original metadata retained in activation-migration-2026-10-01.json. | Later consumer/template/query Tasks and S01U coverage coordination; no whole-Spec delivery claimed. | 99bacf50cbf8bed37850925ad55cf5a0e0edab5cff770bcf335c0606f8a6663a |
| 3 | codex/s00g-ownership-map | e8b566e0812ddc38a6577c6273f13fc6ef16a7a7 | none | 0 | Reader/schema and concrete routes 4/4; full required union 52/52 at 311001ae4d8debdebbb1be74c689f53c6e1f9583; installed matching runtime verified; independent TK-001 review no findings. See reader-proof-2026-10-01.json. | SPEC.md, declared schema, reader proof and preserved migration evidence updated. | TK-002 consumer sweep, TK-003 generic template, TK-004 query/comparator and S01U coverage coordination. | 6832bd12a9b5ef015e4de64d48a2b424f2c5d267b00702a131efb273017c2fee |
