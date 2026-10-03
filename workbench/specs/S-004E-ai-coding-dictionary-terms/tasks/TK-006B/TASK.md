# TK-006B - Write the dictionary Wiki entries, route them and prove the acceptance

**Task ID:** TK-006B
**Spec ID:** S-004E
**Slice:** Write the dictionary Wiki entries, route them and prove the acceptance
**Status:** ready
**Stance:** Builder
**Blockers:** TK-006A
**Destination:** spec-acceptance: Every term selected at Plan has a Wiki entry that passes wiki validate, is routed from MEMORY.md with a summary line, links its Lexicon row, dictionary entry and owning controls, and was linted; a mechanical comparison finds no copied passage; a fresh agent given only the Lexicon and Wiki answers the two probes.
**Planned verification:** `node workbench/tools/wiki.mjs validate`, a lint of each touched page, the copied-passage comparison of every Lexicon row and Wiki entry against the pinned entries fetched outside the repository, the two cold-reader probes by a fresh read-only agent, and the full AGENTS suite on the committed candidate.
