# TK-006R - Corrective: add name and context to bare identifiers on the seven heaviest skill pages (whole-Wiki lint F-2, group A)

**Task ID:** TK-006R
**Spec ID:** S-003W
**Slice:** Corrective: add name and context to bare identifiers on the seven heaviest skill pages (whole-Wiki lint F-2, group A)
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A page with an identifier beside the artifact's name passes the identifier validator; a bare identifier is reported
**Planned verification:** landmark-wiki.mjs validate clean on the seven pages; wiki.mjs validate; no claim changed; full suite

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-006r-identifiers-heavy-skills | eb962482bb732f1dcefa25d3dfece7aed1b329ec | ahead 0 behind 0 | 0 | landmark-wiki validate on the 7 pages 0 findings (176 before); wiki.mjs validate ok; test-wiki 25/25; test-landmark-wiki 76/76; full RUNBOOK suite 48/48 on committed clean eb962482 | workbench/wiki/skill-{to-tasks,spec-manager,director,spec-planner,to-spec,notepad,domain-modeling}.md identifier name-and-context only | none | 0414b8564d5622993eaca401713a43b5262177ef8f3e800955671aa94ee3f6a6 |
