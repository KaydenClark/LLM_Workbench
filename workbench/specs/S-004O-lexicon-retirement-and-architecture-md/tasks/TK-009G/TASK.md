# TK-009G - Rooms receive GLOSSARY.md and ARCHITECTURE.md and the update route retires a landed Lexicon

**Task ID:** TK-009G
**Spec ID:** S-004O
**Slice:** Rooms receive GLOSSARY.md and ARCHITECTURE.md and the update route retires a landed Lexicon
**Status:** done
**Stance:** Builder
**Blockers:** TK-009B, TK-009C, TK-009F
**Destination:** spec-acceptance: Updating a room retires its Lexicon only after its lines land, and a room without one is unchanged; named verification and remaining limitations are recorded without claiming owner approval.
**Planned verification:** Red: an upgrade test that updates a fixture room holding a Lexicon with a project-specific row not yet in its glossary and expects the Lexicon kept fails first, with a companion case that removes a fully landed Lexicon and one that leaves a room without a Lexicon unchanged. Green: those cases, the layout, adoption, Genesis, round-trip, control-fidelity, template-placeholder and self-drift tests, then the full suite.
**Claimed by:** claude-s004o-worker-g
**Proof:** Red c5ca4abf (test-workbench-upgrade 7 failing, test-workbench-layout 12+, adoption refused a LEXICON.md room, promotion allow-list) and b1e12827 (Template Lexicon from release history), green to 287b211c: controls now AGENTS, BLUEPRINT, GLOSSARY, ARCHITECTURE, RUNBOOK, TASKBOARD, CLAUDE, README across layout, control fidelity, placeholders and Template settings; Template Wiki articles installed by init, adoption and the Lexicon step; retireLexicon keeps a room Lexicon byte for byte with a lexicon-unlanded finding unless every line lands, else backs it up to sessions/recovery/lexicon-retirement and removes it; a room without one is unchanged; test-workbench-upgrade 12/12, test-workbench-layout 87/87, test-spec-workbench 60/60; full suite 54/54 on clean 287b211c (log-tk009g.txt); merged by PR #428

## Scope

Replace `LEXICON.md` with `GLOSSARY.md` and `ARCHITECTURE.md` in the installed control set (`workbench-layout.mjs`, control fidelity, template placeholders, Genesis and adoption Templates), have Genesis and adoption draft the room's `ARCHITECTURE.md` codemap for grilling to confirm, and make the update route retire a room's Lexicon only after its lines have landed in that room. A room without a Lexicon is unchanged.

From TK-009L's hand-back: install the twelve Template Wiki vocabulary articles (`templates/wiki/vocabulary-*.md` and `ai-coding-reference.md`) beside the router in the same change that installs `GLOSSARY.md`, across Genesis, adoption and the update route; the tested shape was a `wikiVocabularyFiles` export, an `articles` parameter to `seedWiki` and reporting the articles apart from `written`, because `test-wiki` pins the contract-file list. From TK-009E's hand-back: keep the glossary branch in `sessions.mjs` `validatePromotionOwner` ahead of the controls branch when `GLOSSARY.md` joins `controls`, and add any new runtime tool that names `GLOSSARY.md` to the static allow-list in `tools/test-direct-promotion.mjs`.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 45e984d39253f5dc7a38def495ddfe67aefaaca3 | ahead 0 behind 0 | 0 | Red c5ca4abf (test-workbench-upgrade 7 failing, test-workbench-layout 12+, adoption refused a LEXICON.md room, promotion allow-list) and b1e12827 (Template Lexicon from release history), green to 287b211c: controls now AGENTS, BLUEPRINT, GLOSSARY, ARCHITECTURE, RUNBOOK, TASKBOARD, CLAUDE, README across layout, control fidelity, placeholders and Template settings; Template Wiki articles installed by init, adoption and the Lexicon step; retireLexicon keeps a room Lexicon byte for byte with a lexicon-unlanded finding unless every line lands, else backs it up to sessions/recovery/lexicon-retirement and removes it; a room without one is unchanged; test-workbench-upgrade 12/12, test-workbench-layout 87/87, test-spec-workbench 60/60; full suite 54/54 on clean 287b211c (log-tk009g.txt); merged by PR #428 | templates/GENESIS.md and templates/ADOPTION.md draft the ARCHITECTURE.md codemap from project evidence for grilling to confirm and follow the Lexicon rule; README core-file lists; templates/wiki/README.md; workbench-room-checks, update-harness, genesis and adoption skills | Tests that read templates/LEXICON.md content are TK-009H; a real non-fixture room through migrate is unverified; ARCHITECTURE.md is now a promotion destination as a control, which the Dispatcher keeps as consistent with DDR-001E; Grill Board lexicon group unchanged pending the owner's board work | df184af9e4c8fab08156e69f234e5f5afd84c037db6b49a0aadbfe683e8e3204 |
