# TK-006P - Corrective: Wiki lane instructions, router accuracy, post-migration wording, stale ledger paths (whole-Wiki lint F-1, F-5, F-6, F-7, F-8, F-12)

**Task ID:** TK-006P
**Spec ID:** S-003W
**Slice:** Corrective: Wiki lane instructions, router accuracy, post-migration wording, stale ledger paths (whole-Wiki lint F-1, F-5, F-6, F-7, F-8, F-12)
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Every routed page has a summary line and the validator reports a missing one as attention
**Planned verification:** wiki.mjs validate; test-wiki; full suite; re-read of each touched page against its sources
**Proof:** Separate-context Codex review of PR #356: first candidate FAIL on an overclaimed features-collection coverage statement, fixed over four fresh delta reviews, PASS at 4b9b9690; full RUNBOOK suite 51/51 on candidate ee011424 (a clean merge of integration and wording-only commits followed; wiki.mjs validate and landmark-wiki validate green); PR #356 merged

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-close-wave3 | 1a0f364a56e2aef9bcbba612be86415b726c93c2 | ahead 0 behind 0 | 0 | Separate-context Codex review of PR #356: first candidate FAIL on an overclaimed features-collection coverage statement, fixed over four fresh delta reviews, PASS at 4b9b9690; full RUNBOOK suite 51/51 on candidate ee011424 (a clean merge of integration and wording-only commits followed; wiki.mjs validate and landmark-wiki validate green); PR #356 merged | workbench/wiki/AGENTS.md and templates/wiki/AGENTS.md accepted ingest rule; router heading, release link, skills-draft summary, summaries and provenance; features README This Room's Articles and History shape; landmark Wiki, Durable Knowledge and Artifact Types pages corrected for delivered state; DQC-002D revision 8 citations; one S-00O proposal path note | workbench/grill-board/items.json still holds two live links to the old ledger path (written only through the Grill Board tool); three append-only or Receipt rows naming the old path left as history | ba1c33ce65eed3acaa809946012ace417a4f44cd721712d156fe43c9f75c0738 |
