# TK-005Y - Add the AI Coding Terms section with its fifteen self-contained rows

**Task ID:** TK-005Y
**Spec ID:** S-004E
**Slice:** Add the AI Coding Terms section with its fifteen self-contained rows
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Each of the nineteen batch-one terms has exactly one Lexicon row in the AI Coding Terms section, under a preamble naming the source, supply date and no-live-import rule (the fifteen terms that collide with nothing).
**Planned verification:** Red: a check in `tools/test-control-fidelity.mjs` that each named term has exactly one row with one dictionary link in `LEXICON.md` and `templates/LEXICON.md` fails first. Green: that check, the evaluator, then the full AGENTS suite on the committed candidate; a copied-passage comparison against the pinned entries outside the repository.
