# TK-009I - Wiki lexicon articles explain the Workbench, room, artifact, Spec, Task, chat and role terms

**Task ID:** TK-009I
**Spec ID:** S-004O
**Slice:** Wiki lexicon articles explain the Workbench, room, artifact, Spec, Task, chat and role terms
**Status:** done
**Stance:** Builder
**Blockers:** TK-009D
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: the Wiki validator or a test-wiki case listing this batch's glossary terms fails while their articles are missing. Green: the batch's articles validate, then the full suite.
**Claimed by:** claude-s004o-worker-ij
**Proof:** Red b11f6fa2 (test-wiki TK-009I case, 2 test-adr, 4 test-control-fidelity and 1 test-runbook-index checks fail before the articles), green f060863b and bd624687: 40 batch-two dictionary articles with full Definition and Distinction text, routed from MEMORY.md; test-wiki 29/29, test-adr 57/57, test-control-fidelity 49/49, test-runbook-index 62/62; full suite 53/53 on clean merged 747393dd (log-tk009i-merged.txt); merged by PR #423

## Scope

Batch two of the root Wiki lexicon articles: the glossary's Workbench, room and artifacts; Specs and Tasks; and Chats and roles groups (40 terms). Each root article is one flat entry per term in the existing `workbench/wiki/dictionary-*.md` shape (frontmatter, a title, what it means here with its fuller Distinction text, relationships, example usage, and Sources), links the term's canonical definition in `GLOSSARY.md`, and is routed from Wiki `MEMORY.md`. Where an existing Wiki article already explains the term, the entry may extend it instead of duplicating it, and the inventory's `explanationHome` is updated to that page. Every Lexicon row's Distinction text for the batch lands in its article (record `explanationHome` landed text in the inventory if useful). Not link stubs. Re-point any check that reads these rows' Distinction text from the Lexicon to the article.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 6678657554849fc8274027fb800d427188abc104 | ahead 0 behind 0 | 0 | Red b11f6fa2 (test-wiki TK-009I case, 2 test-adr, 4 test-control-fidelity and 1 test-runbook-index checks fail before the articles), green f060863b and bd624687: 40 batch-two dictionary articles with full Definition and Distinction text, routed from MEMORY.md; test-wiki 29/29, test-adr 57/57, test-control-fidelity 49/49, test-runbook-index 62/62; full suite 53/53 on clean merged 747393dd (log-tk009i-merged.txt); merged by PR #423 | 40 new workbench/wiki dictionary articles; MEMORY.md Workbench Term Dictionary sub-lists; root inventory explanationText for the 40 entries | Batch-two articles name batch-three terms as plain text until TK-009J lands; Root files and Workbench Contract checks are TK-009F | 4168ed2b504f574bd87c458f679a5aad2f962234ce29b6a639eb9f1e7d9805bc |
