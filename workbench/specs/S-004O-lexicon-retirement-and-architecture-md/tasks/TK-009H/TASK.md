# TK-009H - Remove the Lexicon with every line landed

**Task ID:** TK-009H
**Spec ID:** S-004O
**Slice:** Remove the Lexicon with every line landed
**Status:** ready
**Stance:** Builder
**Blockers:** TK-009E, TK-009G
**Destination:** spec-acceptance: No link in the repository points at a Lexicon heading, the Instruction Authority list does not name the Lexicon, and the full suite passes on the committed candidate.
**Planned verification:** Red: the landing check run against a candidate with `LEXICON.md` and `templates/LEXICON.md` removed reports any unlanded line. Green: both inventories pass at the candidate, no live link names the Lexicon, `render` and `doctor` are clean, then the full suite on the committed candidate.

## Scope

Delete `LEXICON.md` and `templates/LEXICON.md` after re-scaffolding the inventories against the current base so Lexicon edits that landed after the census are classified, and run the landing check for both. Remove the remaining tests' Lexicon reads. Record the inventories and the landing-check output under this Spec's `proof/`.

Also refresh `proof/lexicon-consumer-census.md` to the delivered homes (the Template Wiki homes are the grouped `templates/wiki/vocabulary-*.md` articles and `ai-coding-reference.md`, not per-term pages).
