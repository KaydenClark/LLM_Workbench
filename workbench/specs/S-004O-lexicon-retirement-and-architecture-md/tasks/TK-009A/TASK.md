# TK-009A - Census every Lexicon line and extend the landing check to the Lexicon

**Task ID:** TK-009A
**Spec ID:** S-004O
**Slice:** Census every Lexicon line and extend the landing check to the Lexicon
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A census maps every Lexicon line to a home and the landing check passes at the candidate with `LEXICON.md` removed.
**Planned verification:** Red: a `tools/test-carrier-landing.mjs` case that checks a Lexicon carrier with `glossary` and `architecture` home kinds fails first. Green: that test, `check-carrier-landing.mjs scaffold` inventories for `LEXICON.md` and `templates/LEXICON.md` at the assembly base with every entry classified, a census of every Lexicon consumer, then the full suite on the committed candidate.
**Claimed by:** claude-s004o-worker-a

## Scope

Extend the carrier line-landing check (`tools/check-carrier-landing.mjs`) so it accepts `LEXICON.md` and `templates/LEXICON.md` as carriers and `glossary` and `architecture` as home kinds. Scaffold one inventory per Lexicon at the assembly base and classify every line: project vocabulary to `GLOSSARY.md`, deeper explanation and general reference concepts to a Wiki article, ownership, routes and invariants to `ARCHITECTURE.md`, duplicated claims to their existing owner (`restates-owner`), or `retired-with-reason`. Planned `landedText` is the text the later Tasks write; they may refine it. Also write a consumer census (every tool, test, skill, Template file, Wiki page and control that reads the Lexicon, grouped by the owner it should read instead) under this Spec's `proof/`. The census names, it does not move content.
