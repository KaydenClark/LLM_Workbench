# TK-009D - Wiki lexicon articles explain the destination and workflow-verb terms and the validator checks glossary links

**Task ID:** TK-009D
**Spec ID:** S-004O
**Slice:** Wiki lexicon articles explain the destination and workflow-verb terms and the validator checks glossary links
**Status:** ready
**Stance:** Builder
**Blockers:** TK-009C
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: a Wiki validator case (`workbench/tools/wiki.mjs`, `tools/test-wiki.mjs`) that refuses a lexicon article whose canonical-definition link names a term missing from `GLOSSARY.md` fails first. Green: that case, the validator over this room's Wiki, the batch's articles present, then the full suite.

## Scope

Batch one of the root Wiki lexicon articles: the glossary's Destination and direction and Workflow verbs groups (29 terms), plus the Wiki validator rule every later batch uses: a lexicon article declares the glossary term it explains and links `GLOSSARY.md`, and the validator refuses an article whose declared term is not a glossary entry. Re-point the existing nine `dictionary-*` articles' Lexicon links to the glossary or the Wiki. Each root article is one flat entry per term in the existing `workbench/wiki/dictionary-*.md` shape (frontmatter, a title, what it means here with its fuller Distinction text, relationships, example usage, and Sources), links the term's canonical definition in `GLOSSARY.md`, and is routed from Wiki `MEMORY.md`. Where an existing Wiki article already explains the term, the entry may extend it instead of duplicating it, and the inventory's `explanationHome` is updated to that page. Every Lexicon row's Distinction text for the batch lands in its article (record `explanationHome` landed text in the inventory if useful). Not link stubs. Re-point any check that reads these rows' Distinction text from the Lexicon to the article.
