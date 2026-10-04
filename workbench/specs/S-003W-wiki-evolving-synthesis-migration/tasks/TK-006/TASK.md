# TK-006 - Lint procedures in the Runbook and the validator message fix

**Task ID:** TK-006
**Spec ID:** S-003W
**Slice:** Lint procedures in the Runbook and the validator message fix
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-006-lint-procedures | 2b9376b4e1e621d361ca47b48549c524916cd6c4 | ahead 2 behind 0 | 0 | RED: tools/test-wiki.mjs authorized_by assertion failed on the old message ('the authorizing operation or the owner'); GREEN after reword: node tools/test-wiki.mjs 14/14. node tools/test-runbook-index.mjs 41/41; wiki.mjs validate ok. Full suite 51/51 commands rc=0 at candidate 2b9376b4 (log tk-006-suite.log) | RUNBOOK.md and templates/RUNBOOK.md: Wiki Lint section plus operations index row; workbench/wiki/SCHEMA.md and templates/wiki/SCHEMA.md: Lint route to it; workbench/tools/wiki.mjs message; tools/test-wiki.mjs | none | dcf103e200df5d29a41b6ba10d2dad64027f1f0a5f6aa2e3d54a4af4283e7d16 |
