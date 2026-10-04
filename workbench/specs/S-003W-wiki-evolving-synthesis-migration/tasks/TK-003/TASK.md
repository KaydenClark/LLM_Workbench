# TK-003 - Name-and-context identifier validator in place of the identifier ban; usage note, tests, registration and citing Specs reconciled

**Task ID:** TK-003
**Spec ID:** S-003W
**Slice:** Name-and-context identifier validator in place of the identifier ban; usage note, tests, registration and citing Specs reconciled
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-003-identifier-rule | 706484e9a650fd82ce6c2c39f6cf7326aeeccb44 | ahead 2 behind 0 | 0 | Red: tools/test-landmark-wiki.mjs 8 of 42 passing (34 failed on the old identifier ban) before the change; green 42/42 at 706484e9. Full RUNBOOK suite 51 commands at candidate 706484e9a650fd82ce6c2c39f6cf7326aeeccb44 dirty []: all pass (test-adr had one transient SIGTERM 143 and passed on rerun); test-landmark-tracker 23/23; wiki.mjs validate ok; doctor passes. Sweep: 600 bare identifiers across 93 of 113 existing Wiki pages, none gated by any validator. | workbench/landmark-tracker/LANDMARK-WIKI.md (rule, mechanical definition, history); evidence rows appended to the Landmark Records and Landmark Tracker Foundation Spec logs; RUNBOOK and templates need no change (neither mentions the old rule) | Existing Wiki pages carry bare identifiers that the whole-Wiki lint at Spec review should repair by adding names; landmark synthesis pages not yet written | 84b56bad356a3581312e2367afafa9791692e8a82f5a33764083046455caab1a |
