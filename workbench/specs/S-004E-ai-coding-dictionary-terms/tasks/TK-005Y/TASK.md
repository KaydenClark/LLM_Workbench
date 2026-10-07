# TK-005Y - Add the AI Coding Terms section with its fifteen self-contained rows

**Task ID:** TK-005Y
**Spec ID:** S-004E
**Slice:** Add the AI Coding Terms section with its fifteen self-contained rows
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Each of the nineteen batch-one terms has exactly one Lexicon row in the AI Coding Terms section, under a preamble naming the source, supply date and no-live-import rule (the fifteen terms that collide with nothing).
**Planned verification:** Red: a check in `tools/test-control-fidelity.mjs` that each named term has exactly one row with one dictionary link in `LEXICON.md` and `templates/LEXICON.md` fails first. Green: that check, the evaluator, then the full AGENTS suite on the committed candidate; a copied-passage comparison against the pinned entries outside the repository.
**Proof:** Red f7b0d3ae then green: test-control-fidelity 28/28, templates evaluator, full AGENTS suite 48/48 on clean c1ec6fd4
**Claimed by:** claude-s004e-corrections

## Scope Note

The delivered section carries sixteen rows, not fifteen: the Model provider row was written in this Task because it collides with no existing Lexicon row (its note on the Workbench's bare "provider" is a distinction only). The control-fidelity case covers all sixteen.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004e-ai-terms-1 | c1ec6fd44cea2df01646593fdee3509494af41c2 | ahead 0 behind 0 | 0 | Red f7b0d3ae: tools/test-control-fidelity.mjs new case fails (no AI Coding Terms section). Green: test-control-fidelity 28/28, templates evaluator passes; full AGENTS suite 48/48 on clean c1ec6fd4; copied-passage comparison against the pinned entries at ed1ebed3 leaves only common phrases of seven words or fewer | LEXICON.md and templates/LEXICON.md (AI Coding Terms section, fifteen rows); Spec S-004E and S-004G plans and decisions | Harness, Session, Context rows and the harness reconciliation (next Task); batch two; Wiki entries; whole-Spec QA | ec343e9b37c4516a67b2eeff85eda2ec5b18a220c0f01b59a3892485b880d252 |
| 2 | claude/s004e-ai-terms-1 | 1ba82a74dd4c3f1ba3ef6d029a40d8a55fb91405 | ahead 0 behind 0 | 0 | Red f7b0d3ae then green: test-control-fidelity 28/28, templates evaluator, full AGENTS suite 48/48 on clean c1ec6fd4 | LEXICON.md and templates/LEXICON.md carry the AI Coding Terms section and fifteen rows; plan decisions recorded in the Spec | Harness reconciliation, batch two, Wiki entries and whole-Spec QA remain in the next three Tasks | 7201b1f5f3b0e72f4ea98f8c2d33f9edbe3566af61ac4165671be121bb1ade64 |
| 3 | claude/s004e-s004g-corrections | e1a5e23a6af5bda31abb43b5ca8071db6929eaa9 | ahead 0 behind 0 | 0 | Continuation after the fail verdict at a7e735b4. Red eea91551 parent: AI Coding Terms case fails on the Output tokens row's number agreement. Green at eea91551: control-fidelity 39/39. Full Runbook suite 53/53 on clean 54634baa7d4092d64c60621cad30b54331499002. | LEXICON.md and templates/LEXICON.md Output tokens row; tools/test-control-fidelity.mjs AI Coding Terms case | none | 3ee23de77fd354769861d236a6d9802dd784b7535464885bbe4e4e65cb5b2454 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 10 (fail verdict at a7e735b44e73800a3518579cbff8b68b4e70add2 on 2026-10-07) | Low, the Output tokens row in LEXICON.md and templates/LEXICON.md has a subject-verb slip (each costs more ... and are produced one at a time), so make it agree |
