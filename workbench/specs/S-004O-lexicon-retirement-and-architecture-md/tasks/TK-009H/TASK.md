# TK-009H - Remove the Lexicon with every line landed

**Task ID:** TK-009H
**Spec ID:** S-004O
**Slice:** Remove the Lexicon with every line landed
**Status:** done
**Stance:** Builder
**Blockers:** TK-009E, TK-009G
**Destination:** spec-acceptance: No link in the repository points at a Lexicon heading, the Instruction Authority list does not name the Lexicon, and the full suite passes on the committed candidate.
**Planned verification:** Red: the landing check run against a candidate with `LEXICON.md` and `templates/LEXICON.md` removed reports any unlanded line. Green: both inventories pass at the candidate, no live link names the Lexicon, `render` and `doctor` are clean, then the full suite on the committed candidate.
**Claimed by:** claude-s004o-worker-h
**Proof:** Merged integration d0fb161c first (0059669f = PRE); re-scaffolded final inventories at PRE carrying classifications by hash (root 308: glossary 139, architecture 107, wiki 37, restates-owner 5, retired 20; Template 269: 117/100/38/0/14). Red 75b868e2 deletes both Lexicons: landing checks already 308/308 and 269/269, failures were tests still reading the Lexicons and adr validate on canonicalized_in history (proof/lexicon-removal-red.txt); red a60e40f2, fix 456a6466 keeps a retired LEXICON.md canonicalized_in owner as history. Green at 4718ebe9: both landing checks pass (proof/lexicon-landing-check.json, proof/template-lexicon-landing-check.json), live-link check, wiki validate, templates evaluator 106.6/113, render no diff, test-grill-board 16/16; full suite 54/54 on clean 4718ebe9 (log-tk009h.txt); merged by PR #429

## Scope

Delete `LEXICON.md` and `templates/LEXICON.md` after re-scaffolding the inventories against the current base so Lexicon edits that landed after the census are classified, and run the landing check for both. Remove the remaining tests' Lexicon reads. Record the inventories and the landing-check output under this Spec's `proof/`.

Also refresh `proof/lexicon-consumer-census.md` to the delivered homes (the Template Wiki homes are the grouped `templates/wiki/vocabulary-*.md` articles and `ai-coding-reference.md`, not per-term pages).

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 3e520e7687fb4c9e2102b10d467d7c56ad38721c | ahead 0 behind 0 | 0 | Merged integration d0fb161c first (0059669f = PRE); re-scaffolded final inventories at PRE carrying classifications by hash (root 308: glossary 139, architecture 107, wiki 37, restates-owner 5, retired 20; Template 269: 117/100/38/0/14). Red 75b868e2 deletes both Lexicons: landing checks already 308/308 and 269/269, failures were tests still reading the Lexicons and adr validate on canonicalized_in history (proof/lexicon-removal-red.txt); red a60e40f2, fix 456a6466 keeps a retired LEXICON.md canonicalized_in owner as history. Green at 4718ebe9: both landing checks pass (proof/lexicon-landing-check.json, proof/template-lexicon-landing-check.json), live-link check, wiki validate, templates evaluator 106.6/113, render no diff, test-grill-board 16/16; full suite 54/54 on clean 4718ebe9 (log-tk009h.txt); merged by PR #429 | LEXICON.md and templates/LEXICON.md deleted; Template Wiki vocabulary articles carry the remaining definition sentences; ARCHITECTURE.md says root files; RUNBOOK, workbench-room-checks and skills README describe the Lexicons as retired landing-check carriers; consumer census refreshed with remaining live mentions and reasons | Four other Specs (S-002H, S-01A, S-01T, S-01U) still link ../../../LEXICON.md (S-01A a heading) and doctor reports them as attention broken-link; Grill Board lexicon group unchanged pending the owner's board work; domain-modeling keeps its S-004J-pinned Lexicon fallback; no real room taken through migrate | 9e02f4f0f85822743ccfe4484f069f73439811c5093bad1ecb2d2be5a0a11ac0 |
