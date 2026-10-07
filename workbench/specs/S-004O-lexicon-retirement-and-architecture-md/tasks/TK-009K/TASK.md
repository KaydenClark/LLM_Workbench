# TK-009K - General AI and programming reference concepts stay Wiki-only with their Lexicon text landed

**Task ID:** TK-009K
**Spec ID:** S-004O
**Slice:** General AI and programming reference concepts stay Wiki-only with their Lexicon text landed
**Status:** done
**Stance:** Builder
**Blockers:** TK-009D
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: the landing check scoped to the root inventory's `wiki` entries reports the missing reference pages. Green: every `wiki` entry lands, the validator passes, then the full suite.
**Claimed by:** claude-s004o-worker-i
**Proof:** Red 787f3ce9 (test-wiki case fails on 25 missing pages; simulated landing with LEXICON.md deleted reports 29 unlanded wiki lines), green f06ef70e: 22 new Wiki-only reference pages plus MEMORY lines, every root wiki entry lands; simulated landing 308/308; test-wiki 28/28, test-control-fidelity 49/49; full suite 53/53 on clean f06ef70e (log-tk009k.txt); merged by PR #419

## Scope

Write or extend the root Wiki reference pages the census routes Lexicon `wiki` entries to (general AI and programming concepts such as model, token, agent, system prompt, seam, progressive disclosure, feedback disposition and version labels), in the existing AI Coding Dictionary article shape with attribution and no copied upstream prose. These need no glossary entry. Re-point the checks that read the Lexicon's AI Coding Terms rows and dictionary links to these pages. Keep them routed from `MEMORY.md`.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 4af5b91f9a0400bffc70901c4bf902a14e3b064a | ahead 0 behind 0 | 0 | Red 787f3ce9 (test-wiki case fails on 25 missing pages; simulated landing with LEXICON.md deleted reports 29 unlanded wiki lines), green f06ef70e: 22 new Wiki-only reference pages plus MEMORY lines, every root wiki entry lands; simulated landing 308/308; test-wiki 28/28, test-control-fidelity 49/49; full suite 53/53 on clean f06ef70e (log-tk009k.txt); merged by PR #419 | 22 new workbench/wiki reference pages (19 AI Coding Dictionary terms, progressive disclosure, seam, version labels); MEMORY.md AI Coding Dictionary Entries and General Reference Pages sections; dictionary-feedback-disposition declares its glossary term; root inventory wiki landedText rewritten as sentences | dictionary-grilling.md and its AI_CODING_WIKI_ENTRIES row are TK-009J; MEMORY's other Lexicon links are TK-009F; Template halves are TK-009L and TK-009H | b793f4e56e01d5b30601861811510790df018811240df735c3797e6a6ab02634 |
