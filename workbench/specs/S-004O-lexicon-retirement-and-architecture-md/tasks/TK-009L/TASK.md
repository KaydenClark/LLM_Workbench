# TK-009L - The Template's Wiki explains its vocabulary in grouped articles a generated room receives

**Task ID:** TK-009L
**Spec ID:** S-004O
**Slice:** The Template's Wiki explains its vocabulary in grouped articles a generated room receives
**Status:** done
**Stance:** Builder
**Blockers:** TK-009D
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: a Template check that every Template inventory `wiki` entry and glossary Distinction lands under `templates/wiki/` fails first. Green: that check, the template-placeholder check and the templates evaluator, then the full suite.
**Claimed by:** claude-s004o-worker-j
**Proof:** Red 02b7ee15 (two test-workbench-layout cases fail: article homes missing), green: 11 grouped templates/wiki/vocabulary-*.md articles plus templates/wiki/ai-coding-reference.md, routed from both Template MEMORY routers; every Template wiki entry and glossary explanationText lands; simulated removal of templates/LEXICON.md lands 269/269; articles fill placeholders and resolve links in a Template-laid room; test-workbench-layout 78/78, evaluator unchanged 106.6/113; full suite 53/53 on clean 908afbf2 (log-tk009l.txt); merged by PR #420

## Scope

Land the Template Lexicon's `wiki` entries and its glossary rows' Distinction text in generic Template Wiki articles a generated room receives: one explanatory article per glossary grouping (each term a section linking `GLOSSARY.md`) plus one general AI-coding reference article, routed from the Template Wiki memory, with no producer-only content. Update the Template inventory's `homePath`/`explanationHome` to those pages. Installation of the articles into rooms rides the existing Template Wiki route; if it needs layout changes, record the gap for TK-009G.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 5646cdd00c5401e31518fb4e6a247afcc7d9a09e | ahead 0 behind 0 | 0 | Red 02b7ee15 (two test-workbench-layout cases fail: article homes missing), green: 11 grouped templates/wiki/vocabulary-*.md articles plus templates/wiki/ai-coding-reference.md, routed from both Template MEMORY routers; every Template wiki entry and glossary explanationText lands; simulated removal of templates/LEXICON.md lands 269/269; articles fill placeholders and resolve links in a Template-laid room; test-workbench-layout 78/78, evaluator unchanged 106.6/113; full suite 53/53 on clean 908afbf2 (log-tk009l.txt); merged by PR #420 | 12 new Template Wiki articles; templates/wiki/SCHEMA.md Lexicon Articles section replaces Lexicon row wording; templates/wiki/README.md; MEMORY.project.md and MEMORY.root.md Vocabulary sections; Template inventory homes and explanationText | Installing the 12 articles into rooms together with GLOSSARY.md is TK-009G; the consumer census still names planned templates/wiki/dictionary pages and is refreshed by TK-009H; MEMORY.project.md Leaving The Wiki Lexicon row and design-concepts/README.md pointer are TK-009F | 24216739fcc2b22ff05ced8f5be96ac16ca0cd5d6a92a68c8db8d19ef3dad40f |
