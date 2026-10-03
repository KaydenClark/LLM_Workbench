# TK-005Q - Add the AI Coding Terms section with its fifteen self-contained rows

**Task ID:** TK-005Q
**Spec ID:** S-004E
**Slice:** Add the AI Coding Terms section with its fifteen self-contained rows
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Each of the nineteen batch-one terms has exactly one Lexicon row in the AI Coding Terms section, under a preamble naming the source, supply date and no-live-import rule (the fifteen terms that collide with nothing).
**Planned verification:** Red: a check in `tools/test-control-fidelity.mjs` or `tools/test-controls-vocabulary-sweep.mjs` that each named term has exactly one row with one dictionary link in `LEXICON.md` and `templates/LEXICON.md` fails first. Green: that check, the control-fidelity and evaluator checks, then the full AGENTS suite on the committed candidate; a copied-passage comparison against the pinned entries outside the repository.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004e-tk1-ai-terms | f652f2c2880d8b536cae3dcb267161ad628ebf1e | ahead 0 behind 0 | 0 | Red 55bc44cd: tools/test-control-fidelity.mjs new case fails (no AI Coding Terms section). Green: test-control-fidelity 28/28; templates evaluator passes; full AGENTS suite 48/48 on clean f652f2c2; copied-passage comparison against the pinned entries at ed1ebed3 finds only two seven-word common phrases | LEXICON.md and templates/LEXICON.md (AI Coding Terms section, fifteen rows); Spec S-004E plan decisions | Harness, Session, Context rows and the harness reconciliation (next Task); batch two; Wiki entries; whole-Spec QA | f5af1cac35edfa98f6882bd05930325ba5b4c2131ede01226b7c18f66bd41f67 |
