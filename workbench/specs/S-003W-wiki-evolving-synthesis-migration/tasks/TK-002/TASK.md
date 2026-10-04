# TK-002 - Move and retype the remaining per-Spec articles; router summaries for every page; validator attention for a routed page without one

**Task ID:** TK-002
**Spec ID:** S-003W
**Slice:** Move and retype the remaining per-Spec articles; router summaries for every page; validator attention for a routed page without one
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-002-assemble | 9aad38b86d984f13ec7b86b7241927fc6735c673 | ahead 0 behind 0 | 0 | Full RUNBOOK suite 51 commands + test-landmark-wiki + test-landmark-tracker = 53/53 exit 0 on candidate 9aad38b86d984f13ec7b86b7241927fc6735c673 (log tk-002-suite-r3.log); tools/test-wiki.mjs 22/22 (red-then-green unsummarized-route attention test); tools/test-landmark-wiki.mjs 45/45 (red-then-green digit-leading slug); tools/test-spec-workbench.mjs 59/59 incl. retirement through a moved feature article; wiki.mjs validate ok; separate-context Codex reviews at 6531bed2 (tools/router PASS after fix, articles first half PASS, second half fixed) and delta PASS at 9aad38b8 | 51 per-Spec articles moved and restructured into workbench/wiki/features via wiki.mjs move-note; router Feature Articles with summaries and summaries beside every routed link; Individual Spec Articles section retired; SCHEMA and templates/wiki SCHEMA/MEMORY.project summary-line rule; LANDMARK-WIKI slug rule; DQC-002D expected result revised through the runtime; RUNBOOK checked | 600+ bare identifiers elsewhere in the Wiki (explicit-call validator, no gate) left to the whole-Wiki lint; S-022 (blocked Spec) article moved as Historical v3.1 Release Proof Packet; MIGRATION_INVENTORY.json plain-path mentions of old article paths left as historical | c271113bb5c339b25655d1bbc4bfe7f942f96cde6c81572f3939d269d378b849 |
