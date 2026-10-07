# TK-009J - Wiki lexicon articles explain the skills-lane, feedback, continuity, stance, governance and boundary terms

**Task ID:** TK-009J
**Spec ID:** S-004O
**Slice:** Wiki lexicon articles explain the skills-lane, feedback, continuity, stance, governance and boundary terms
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-009D
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: the Wiki validator or a test-wiki case listing this batch's glossary terms fails while their articles are missing. Green: the batch's articles validate, then the full suite.
**Claimed by:** claude-s004o-worker-j

## Scope

Batch three of the root Wiki lexicon articles: the glossary's Support root and skills lane, Feedback disposition, Workbench meanings of AI coding terms, Continuity terms, Stance terms, Governance core, Project-specific terms and Continuity and evidence boundaries groups (49 terms). Each root article is one flat entry per term in the existing `workbench/wiki/dictionary-*.md` shape (frontmatter, a title, what it means here with its fuller Distinction text, relationships, example usage, and Sources), links the term's canonical definition in `GLOSSARY.md`, and is routed from Wiki `MEMORY.md`. Where an existing Wiki article already explains the term, the entry may extend it instead of duplicating it, and the inventory's `explanationHome` is updated to that page. Every Lexicon row's Distinction text for the batch lands in its article (record `explanationHome` landed text in the inventory if useful). Not link stubs. Re-point any check that reads these rows' Distinction text from the Lexicon to the article.
