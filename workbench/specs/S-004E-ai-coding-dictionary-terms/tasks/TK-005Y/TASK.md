# TK-005Y - Add the AI Coding Terms section with its fifteen self-contained rows

**Task ID:** TK-005Y
**Spec ID:** S-004E
**Slice:** Add the AI Coding Terms section with its fifteen self-contained rows
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Each of the nineteen batch-one terms has exactly one Lexicon row in the AI Coding Terms section, under a preamble naming the source, supply date and no-live-import rule (the fifteen terms that collide with nothing).
**Planned verification:** Red: a check in `tools/test-control-fidelity.mjs` that each named term has exactly one row with one dictionary link in `LEXICON.md` and `templates/LEXICON.md` fails first. Green: that check, the evaluator, then the full AGENTS suite on the committed candidate; a copied-passage comparison against the pinned entries outside the repository.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004e-ai-terms-1 | c1ec6fd44cea2df01646593fdee3509494af41c2 | ahead 0 behind 0 | 0 | Red f7b0d3ae: tools/test-control-fidelity.mjs new case fails (no AI Coding Terms section). Green: test-control-fidelity 28/28, templates evaluator passes; full AGENTS suite 48/48 on clean c1ec6fd4; copied-passage comparison against the pinned entries at ed1ebed3 leaves only common phrases of seven words or fewer | LEXICON.md and templates/LEXICON.md (AI Coding Terms section, fifteen rows); Spec S-004E and S-004G plans and decisions | Harness, Session, Context rows and the harness reconciliation (next Task); batch two; Wiki entries; whole-Spec QA | ec343e9b37c4516a67b2eeff85eda2ec5b18a220c0f01b59a3892485b880d252 |
