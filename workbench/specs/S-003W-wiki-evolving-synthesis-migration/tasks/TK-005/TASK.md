# TK-005 - Ledger rows for the Wiki grilling, supersession of LD-4 and LD-22B, move to the sessions lane

**Task ID:** TK-005
**Spec ID:** S-003W
**Slice:** Ledger rows for the Wiki grilling, supersession of LD-4 and LD-22B, move to the sessions lane
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-005-ledger | 6ad8225d102be802f3f71a9f0ef16b05f74d3491 | none | 0 | Red: node --test tools/test-grilling-ledger.mjs failed 8 of 8 before the move (ledger absent from sessions lane, WIKI rows and supersession absent, links unresolved). Green after: tools/test-grilling-ledger.mjs 11 pass; tools/test-portability-matrix.mjs 6 pass (ledger still scanned via ACTIVE_SURFACES); node workbench/tools/wiki.mjs validate ok; spec-workbench doctor no blocking finding; check-append-only CLEAN. Full RUNBOOK Full suite (53 commands, incl. landmark-tracker and landmark-wiki) all rc=0 on candidate 6ad8225d102be802f3f71a9f0ef16b05f74d3491, log scratchpad tk-005-suite.log | workbench/wiki/MEMORY.md (ledger route replaced by a session-record pointer); workbench/sessions/.gitignore comment; live links in 6 ADRs, 18 Specs/Tasks and 10 Wiki notes rewritten to the sessions path, SHA-anchored and append-only rows left; RUNBOOK.md/templates checked, no ledger reference, no update needed (ledger is this room's own record) | none for this slice; LD-5 locked answer says do not move the ledger (about the Tracker not replacing it): kept, result path updated, flagged to Director | cdea6e9b9b335398673e7b9befcc3372999017b44de686bfac320b8d4b1e33c0 |
