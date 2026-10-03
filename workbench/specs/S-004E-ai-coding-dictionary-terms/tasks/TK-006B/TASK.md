# TK-006B - Write the dictionary Wiki entries, route them and prove the acceptance

**Task ID:** TK-006B
**Spec ID:** S-004E
**Slice:** Write the dictionary Wiki entries, route them and prove the acceptance
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006A
**Destination:** spec-acceptance: Every term selected at Plan has a Wiki entry that passes wiki validate, is routed from MEMORY.md with a summary line, links its Lexicon row, dictionary entry and owning controls, and was linted; a mechanical comparison finds no copied passage; a fresh agent given only the Lexicon and Wiki answers the two probes.
**Planned verification:** `node workbench/tools/wiki.mjs validate`, a lint of each touched page, the copied-passage comparison of every Lexicon row and Wiki entry against the pinned entries fetched outside the repository, the two cold-reader probes by a fresh read-only agent, and the full AGENTS suite on the committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004e-wiki-4 | cf3cfd09269bad48e01255678a0da78f991f3ba7 | ahead 0 behind 0 | 0 | Red e92b18ad: tools/test-control-fidelity.mjs routing case fails (entries unrouted). Green: test-control-fidelity 31/31; wiki.mjs validate ok; full AGENTS suite 48/48 on clean cf3cfd09; copied-passage comparison of both Lexicons and the eight entries against the pinned entries: longest shared run seven words; cold-reader probes by a fresh read-only Codex agent given only LEXICON.md and the dictionary Wiki entries: both answered with the Workbench meanings, no missing or contradicted term | workbench/wiki/dictionary-*.md (eight entries), workbench/wiki/MEMORY.md router section, Spec S-004E acceptance evidence | Assembled-Spec review and owner Human QA; the AGENTS.md, RUNBOOK.md and README.md harness lines wait for the Contract carrier rewrite | 822b0ad8fa7ca64b5f46efe7b2b473da6b3f0a6011ba93cf1a6c3cb65ea94bee |
