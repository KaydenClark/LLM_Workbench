# TK-006Q - Corrective: settle the identifier validator's placeholder and link-text rules so only real identifiers are reported (whole-Wiki lint F-3)

**Task ID:** TK-006Q
**Spec ID:** S-003W
**Slice:** Corrective: settle the identifier validator's placeholder and link-text rules so only real identifiers are reported (whole-Wiki lint F-3)
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A page with an identifier beside the artifact's name passes the identifier validator; a bare identifier is reported
**Planned verification:** red-then-green tests in tools/test-landmark-wiki.mjs; full suite

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-006q-validator-rules | dac78a66a26d324e04f8d0d8c7811d5e8bc2ae58 | none | 0 | Red: tools/test-landmark-wiki.mjs gained 23 failing tests (non-identifier escape, link-text classes) before the change; green: node tools/test-landmark-wiki.mjs 76/76; full Full-suite list 51/51 plus test-landmark-wiki on candidate dac78a66 (clean tree, merged origin/integration); whole-Wiki validator run over 140 pages: 473 findings (435 bare, 38 ambiguous) before, 418 (397 bare, 21 ambiguous) after, 0 newly reported | workbench/landmark-tracker/LANDMARK-WIKI.md (rule for link text in link text, target-slug names, Tokens that are not identifiers); RUNBOOK and templates checked: they do not quote the old rule | none | d87b1f1e09d0cb6fe8f1e244537acc92a6380d8163f2807f3f0cb68bf92effca |
