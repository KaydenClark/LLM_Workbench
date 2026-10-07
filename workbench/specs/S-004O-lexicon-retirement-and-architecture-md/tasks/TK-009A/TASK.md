# TK-009A - Census every Lexicon line and extend the landing check to the Lexicon

**Task ID:** TK-009A
**Spec ID:** S-004O
**Slice:** Census every Lexicon line and extend the landing check to the Lexicon
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A census maps every Lexicon line to a home and the landing check passes at the candidate with `LEXICON.md` removed.
**Planned verification:** Red: a `tools/test-carrier-landing.mjs` case that checks a Lexicon carrier with `glossary` and `architecture` home kinds fails first. Green: that test, `check-carrier-landing.mjs scaffold` inventories for `LEXICON.md` and `templates/LEXICON.md` at the assembly base with every entry classified, a census of every Lexicon consumer, then the full suite on the committed candidate.
**Claimed by:** claude-s004o-worker-a
**Proof:** Red 6e53091f (glossary/architecture kinds refused) and fac06695 (deleted carrier refused), green 4c4bb495: test-carrier-landing 19/19, test-runbook-index 62/62, both inventories check ok with every entry classified (root 308: glossary 139, architecture 107, wiki 37, restates-owner 5, retired 20; Template 269: 117/100/38/0/14); full suite 53/53 on clean 4860e1d5 (log-tk009a.txt); merged into assembly by PR #409

## Scope

Extend the carrier line-landing check (`tools/check-carrier-landing.mjs`) so it accepts `LEXICON.md` and `templates/LEXICON.md` as carriers and `glossary` and `architecture` as home kinds. Scaffold one inventory per Lexicon at the assembly base and classify every line: project vocabulary to `GLOSSARY.md`, deeper explanation and general reference concepts to a Wiki article, ownership, routes and invariants to `ARCHITECTURE.md`, duplicated claims to their existing owner (`restates-owner`), or `retired-with-reason`. Planned `landedText` is the text the later Tasks write; they may refine it. Also write a consumer census (every tool, test, skill, Template file, Wiki page and control that reads the Lexicon, grouped by the owner it should read instead) under this Spec's `proof/`. The census names, it does not move content.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | a7c4be6dbd1b47492bcf2342ab2c1858b4498e25 | ahead 0 behind 0 | 0 | Red 6e53091f (glossary/architecture kinds refused) and fac06695 (deleted carrier refused), green 4c4bb495: test-carrier-landing 19/19, test-runbook-index 62/62, both inventories check ok with every entry classified (root 308: glossary 139, architecture 107, wiki 37, restates-owner 5, retired 20; Template 269: 117/100/38/0/14); full suite 53/53 on clean 4860e1d5 (log-tk009a.txt); merged into assembly by PR #409 | tools/check-carrier-landing.mjs header, workbench-room-checks skill Carrier line-landing check, RUNBOOK carrier line-landing pointer; proof inventories and consumer census under the Spec proof directory | Planned landedText for GLOSSARY, ARCHITECTURE and new Wiki homes is verified when TK-009B, C and D write them; Lexicon rows added after base 1f4e2d67 are re-scaffolded by TK-009H | 26e139eea9020c4a12b7c9b4faed326adc48bac6e7cbcada4184711a65306451 |
