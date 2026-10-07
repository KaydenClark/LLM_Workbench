# TK-009D - Wiki lexicon articles explain the destination and workflow-verb terms and the validator checks glossary links

**Task ID:** TK-009D
**Spec ID:** S-004O
**Slice:** Wiki lexicon articles explain the destination and workflow-verb terms and the validator checks glossary links
**Status:** done
**Stance:** Builder
**Blockers:** TK-009C
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: a Wiki validator case (`workbench/tools/wiki.mjs`, `tools/test-wiki.mjs`) that refuses a lexicon article whose canonical-definition link names a term missing from `GLOSSARY.md` fails first. Green: that case, the validator over this room's Wiki, the batch's articles present, then the full suite.
**Claimed by:** claude-s004o-worker-e
**Proof:** Red 982a2ce8 (two test-wiki cases fail: no glossary finding, no DQC article), green 80fc9128 and 7ebd43cf: wiki.mjs refuses a glossary_term page naming no GLOSSARY.md entry or lacking the link; 29 batch-one dictionary articles with full Distinction text, routed from MEMORY.md; test-wiki 27/27, test-adr 57/57, test-control-fidelity 49/49, test-runbook-index 62/62, root landing check 308 classified; full suite 53/53 on clean aec98c7e (log-tk009d.txt); merged by PR #417

## Scope

Batch one of the root Wiki lexicon articles: the glossary's Destination and direction and Workflow verbs groups (29 terms), plus the Wiki validator rule every later batch uses: a lexicon article declares the glossary term it explains and links `GLOSSARY.md`, and the validator refuses an article whose declared term is not a glossary entry. Re-point the existing nine `dictionary-*` articles' Lexicon links to the glossary or the Wiki. Each root article is one flat entry per term in the existing `workbench/wiki/dictionary-*.md` shape (frontmatter, a title, what it means here with its fuller Distinction text, relationships, example usage, and Sources), links the term's canonical definition in `GLOSSARY.md`, and is routed from Wiki `MEMORY.md`. Where an existing Wiki article already explains the term, the entry may extend it instead of duplicating it, and the inventory's `explanationHome` is updated to that page. Every Lexicon row's Distinction text for the batch lands in its article (record `explanationHome` landed text in the inventory if useful). Not link stubs. Re-point any check that reads these rows' Distinction text from the Lexicon to the article.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 0b9bcb2c13126b5ce4b85e9b8b0bea220fe322c6 | ahead 0 behind 0 | 0 | Red 982a2ce8 (two test-wiki cases fail: no glossary finding, no DQC article), green 80fc9128 and 7ebd43cf: wiki.mjs refuses a glossary_term page naming no GLOSSARY.md entry or lacking the link; 29 batch-one dictionary articles with full Distinction text, routed from MEMORY.md; test-wiki 27/27, test-adr 57/57, test-control-fidelity 49/49, test-runbook-index 62/62, root landing check 308 classified; full suite 53/53 on clean aec98c7e (log-tk009d.txt); merged by PR #417 | workbench/wiki/SCHEMA.md Lexicon Articles section, workbench-runtime skill invalid-note list, 29 new dictionary articles, nine existing dictionary articles re-pointed, MEMORY.md Workbench Term Dictionary section, inventory explanationText field documented in the census | templates/wiki/SCHEMA.md wording is TK-009L; MEMORY AI Coding Terms link and other Wiki Lexicon links are TK-009K and TK-009F; Automated review scope and Destination Packet checks are TK-009J and TK-009I | 3461dab287cd9d7046f11dee7e80a1126d7b33490be79e43900e2f7f17cdb814 |
