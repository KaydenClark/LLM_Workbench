# TK-006Q - Corrective: settle the identifier validator's placeholder and link-text rules so only real identifiers are reported (whole-Wiki lint F-3)

**Task ID:** TK-006Q
**Spec ID:** S-003W
**Slice:** Corrective: settle the identifier validator's placeholder and link-text rules so only real identifiers are reported (whole-Wiki lint F-3)
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A page with an identifier beside the artifact's name passes the identifier validator; a bare identifier is reported
**Planned verification:** red-then-green tests in tools/test-landmark-wiki.mjs; full suite
**Proof:** Separate-context Codex review of PR #357 PASS with no findings at 30f9de03; full RUNBOOK suite plus tools/test-landmark-wiki.mjs 52/52 on candidate dac78a66 (clean merge of integration and a projection re-render followed); tools/test-landmark-wiki.mjs 76/76 with 22 failing cases written first; before/after tally over 140 Wiki pages 473 to 418 findings with 0 newly reported; PR #357 merged

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-006q-validator-rules | dac78a66a26d324e04f8d0d8c7811d5e8bc2ae58 | none | 0 | Red: tools/test-landmark-wiki.mjs gained 23 failing tests (non-identifier escape, link-text classes) before the change; green: node tools/test-landmark-wiki.mjs 76/76; full Full-suite list 51/51 plus test-landmark-wiki on candidate dac78a66 (clean tree, merged origin/integration); whole-Wiki validator run over 140 pages: 473 findings (435 bare, 38 ambiguous) before, 418 (397 bare, 21 ambiguous) after, 0 newly reported | workbench/landmark-tracker/LANDMARK-WIKI.md (rule for link text in link text, target-slug names, Tokens that are not identifiers); RUNBOOK and templates checked: they do not quote the old rule | none | d87b1f1e09d0cb6fe8f1e244537acc92a6380d8163f2807f3f0cb68bf92effca |
| 2 | claude/s003w-close-wave3 | a7f529856a4a9b3fe8c58bcf1b13dd39f028aadf | ahead 0 behind 0 | 0 | Separate-context Codex review of PR #357 PASS with no findings at 30f9de03; full RUNBOOK suite plus tools/test-landmark-wiki.mjs 52/52 on candidate dac78a66 (clean merge of integration and a projection re-render followed); tools/test-landmark-wiki.mjs 76/76 with 22 failing cases written first; before/after tally over 140 Wiki pages 473 to 418 findings with 0 newly reported; PR #357 merged | workbench/tools/landmark-wiki.mjs non-identifier escape and link-text rules; workbench/landmark-tracker/LANDMARK-WIKI.md Tokens that are not identifiers section | grilling-ledger interview labels (ROLE-1, E-4B, TT-Q8 and similar) deliberately stay reported (21 findings on 9 pages); one allow-list entry per family if the owner prefers exemption | 0244a0a5c11fd92b43858c063819e18effa1adbd58dd0b515ad209d47d3b8e06 |
