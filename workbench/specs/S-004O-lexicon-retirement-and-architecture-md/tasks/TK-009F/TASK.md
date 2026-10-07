# TK-009F - Every Lexicon consumer, link, the Blueprint line and Instruction Authority route to the new owners

**Task ID:** TK-009F
**Spec ID:** S-004O
**Slice:** Every Lexicon consumer, link, the Blueprint line and Instruction Authority route to the new owners
**Status:** done
**Stance:** Builder
**Blockers:** TK-009B, TK-009C, TK-009D, TK-009I, TK-009J, TK-009K, TK-009L
**Destination:** spec-acceptance: Vocabulary, explanation and ownership consumers resolve to their proper owners; neighboring skill acceptance is proven in those Specs.
**Planned verification:** Red: a repository check that no tracked live file (outside history records: Spec evidence, decision records, feedback reports, landmark cards, session records) links `LEXICON.md` or one of its headings fails first. Green: that check, the runbook-index, control-fidelity, governance-core, skill-catalog, vocabulary-sweep and ADR tests re-pointed, then the full suite.
**Claimed by:** claude-s004o-worker-f
**Proof:** Merged integration 817661a4 first (a74f5795; test-workbench-layout conflict kept both sides; bundle count carried as twenty-four into GLOSSARY.md and its article). Red cf0005ba (new control-fidelity check: 47 live files link the Lexicon and Instruction Authority names it), green 9fe02118, 478dfcb0, 7c7dd382: 72 live files re-pointed to GLOSSARY.md, ARCHITECTURE.md or Wiki articles; Instruction Authority item 4 drops the Lexicon in room and Template; Template Blueprint first line matches; tests moved to the new owners without weakening; control-fidelity 50/50, runbook-index 62/62, adr 58/58, wiki 30/30, self-drift and genesis-from-decisions pass; full suite 53/54 on clean 7c7dd382 with test-workbench-round-trip failing on a transient fixture clone (failed to copy object) and passing alone (roundtrip-rerun.txt); merged by PR #426

## Scope

Re-point every live consumer the census names: Lexicon heading links in `AGENTS.md`, `RUNBOOK.md`, `README.md`, the Wiki (outside the lexicon articles TK-009D owns), the workbench skills and the Template controls; the Blueprint's first line in the room and the Template says where terms are defined; the `AGENTS.md` Instruction Authority list no longer names the Lexicon. Keep `AGENTS.md` and `RUNBOOK.md` edits minimal: the carrier rewrite owns their wider rewrite. Skill text owned by S-004J, S-003O and S-003L gets only routing changes; their acceptance stays in those Specs. Runtime tools that list controls (`adr.mjs`, `spec-workbench.mjs`, `self-drift.mjs`) read `GLOSSARY.md` and `ARCHITECTURE.md`. Decision records that name `LEXICON.md` in `canonicalized_in` keep that history.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 55a74fbc69f962b38af5c7e2bdc2cbcaa8469f2f | ahead 0 behind 0 | 0 | Merged integration 817661a4 first (a74f5795; test-workbench-layout conflict kept both sides; bundle count carried as twenty-four into GLOSSARY.md and its article). Red cf0005ba (new control-fidelity check: 47 live files link the Lexicon and Instruction Authority names it), green 9fe02118, 478dfcb0, 7c7dd382: 72 live files re-pointed to GLOSSARY.md, ARCHITECTURE.md or Wiki articles; Instruction Authority item 4 drops the Lexicon in room and Template; Template Blueprint first line matches; tests moved to the new owners without weakening; control-fidelity 50/50, runbook-index 62/62, adr 58/58, wiki 30/30, self-drift and genesis-from-decisions pass; full suite 53/54 on clean 7c7dd382 with test-workbench-round-trip failing on a transient fixture clone (failed to copy object) and passing alone (roundtrip-rerun.txt); merged by PR #426 | AGENTS.md, RUNBOOK.md, README.md, 8 Template files, feedback REPORT_FORMAT, 8 skill files, 48 Wiki pages with History lines, runtime tools adr, spec-workbench, self-drift and task-record | Grill Board lexicon group unchanged pending coordination with the owner's shared board work; domain-modeling keeps its GLOSSARY-else-LEXICON fallback pinned by S-004J's test; templates/.claude/settings.json, GENESIS, ADOPTION and README shipped lists are TK-009G; Lexicon-content tests are TK-009H; GLOSSARY.md left out of reference repair because only promotion writes it | ab8f438e4d8d43185a3d1c479f907e0d42af16357e1ee209af837f304f7c1aa6 |
