# TK-005 - Ledger rows for the Wiki grilling, supersession of LD-4 and LD-22B, move to the sessions lane

**Task ID:** TK-005
**Spec ID:** S-003W
**Slice:** Ledger rows for the Wiki grilling, supersession of LD-4 and LD-22B, move to the sessions lane
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria
**Proof:** Task PR review PASS (Codex gpt-5.5, separate context) on f66da319 vs 58ca0d20; full RUNBOOK suite 53/53 green on candidate 6ad8225d (incl. test-landmark-tracker and test-landmark-wiki); tools/test-grilling-ledger.mjs 9/9 (red: 8 failed before the move); test-portability-matrix 6/6; PR #340 merged to integration

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-005-ledger | 6ad8225d102be802f3f71a9f0ef16b05f74d3491 | none | 0 | Red: node --test tools/test-grilling-ledger.mjs failed 8 of 8 before the move (ledger absent from sessions lane, WIKI rows and supersession absent, links unresolved). Green after: tools/test-grilling-ledger.mjs 11 pass; tools/test-portability-matrix.mjs 6 pass (ledger still scanned via ACTIVE_SURFACES); node workbench/tools/wiki.mjs validate ok; spec-workbench doctor no blocking finding; check-append-only CLEAN. Full RUNBOOK Full suite (53 commands, incl. landmark-tracker and landmark-wiki) all rc=0 on candidate 6ad8225d102be802f3f71a9f0ef16b05f74d3491, log scratchpad tk-005-suite.log | workbench/wiki/MEMORY.md (ledger route replaced by a session-record pointer); workbench/sessions/.gitignore comment; live links in 6 ADRs, 18 Specs/Tasks and 10 Wiki notes rewritten to the sessions path, SHA-anchored and append-only rows left; RUNBOOK.md/templates checked, no ledger reference, no update needed (ledger is this room's own record) | none for this slice; LD-5 locked answer says do not move the ledger (about the Tracker not replacing it): kept, result path updated, flagged to Director | cdea6e9b9b335398673e7b9befcc3372999017b44de686bfac320b8d4b1e33c0 |
| 2 | claude/s003w-close-wave1 | 06a4e35c1d4342e10ce1c850cdf3f69647f92de9 | ahead 0 behind 0 | 0 | Task PR review PASS (Codex gpt-5.5, separate context) on f66da319 vs 58ca0d20; full RUNBOOK suite 53/53 green on candidate 6ad8225d (incl. test-landmark-tracker and test-landmark-wiki); tools/test-grilling-ledger.mjs 9/9 (red: 8 failed before the move); test-portability-matrix 6/6; PR #340 merged to integration | workbench/sessions/grilling-destination-audit-ledger.json (moved from the Wiki lane; ten WIKI rows; LD-4 and LD-22B superseded); live links in ADRs, Specs and Wiki notes rewritten; router ledger route replaced by a pointer; RUNBOOK and templates checked, no ledger reference | Receipt row says ledger test '11 pass'; true count 9/9 (checksummed Receipt left unedited, correction here). LD-5 locked answer (do not move the ledger, about the Tracker not replacing it) kept with result path updated, not superseded: owner call if wanted | 4ebd195ce6f83ce01fb7167d5f7db47f08e8f686d409f9ca085f1313b5bd28b5 |
