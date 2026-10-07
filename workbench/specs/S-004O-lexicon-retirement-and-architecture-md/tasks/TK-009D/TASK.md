# TK-009D - Wiki lexicon articles explain each concept and link to its canonical glossary definition

**Task ID:** TK-009D
**Spec ID:** S-004O
**Slice:** Wiki lexicon articles explain each concept and link to its canonical glossary definition
**Status:** ready
**Stance:** Builder
**Blockers:** TK-009C
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: a Wiki validator case (`workbench/tools/wiki.mjs`, `tools/test-wiki.mjs`) that refuses a lexicon article without a link to a glossary definition that exists fails first. Green: that case, the validator over this room's Wiki, the census's `wiki` entries landing, then the full suite.

## Scope

Make the Wiki's lexicon (`dictionary-*`) articles substantial explanations with usage that link to the glossary's canonical definitions, add Wiki articles the census routes explanation to, keep general reference pages Wiki-only, and keep them routed from Wiki `MEMORY.md`. The Wiki validator checks each article's canonical-definition link. Re-point these articles' own Lexicon links.
