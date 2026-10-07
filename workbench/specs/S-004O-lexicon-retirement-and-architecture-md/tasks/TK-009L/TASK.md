# TK-009L - The Template's Wiki explains its vocabulary in grouped articles a generated room receives

**Task ID:** TK-009L
**Spec ID:** S-004O
**Slice:** The Template's Wiki explains its vocabulary in grouped articles a generated room receives
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-009D
**Destination:** spec-acceptance: Rich Wiki lexicon articles explain concepts and show usage, link to canonical glossary definitions, and remain routed from Wiki memory; general reference pages can remain Wiki-only.
**Planned verification:** Red: a Template check that every Template inventory `wiki` entry and glossary Distinction lands under `templates/wiki/` fails first. Green: that check, the template-placeholder check and the templates evaluator, then the full suite.
**Claimed by:** claude-s004o-worker-j

## Scope

Land the Template Lexicon's `wiki` entries and its glossary rows' Distinction text in generic Template Wiki articles a generated room receives: one explanatory article per glossary grouping (each term a section linking `GLOSSARY.md`) plus one general AI-coding reference article, routed from the Template Wiki memory, with no producer-only content. Update the Template inventory's `homePath`/`explanationHome` to those pages. Installation of the articles into rooms rides the existing Template Wiki route; if it needs layout changes, record the gap for TK-009G.
