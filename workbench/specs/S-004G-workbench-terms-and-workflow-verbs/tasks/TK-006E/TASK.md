# TK-006E - Repair the Blueprint and Foundry rows

**Task ID:** TK-006E
**Spec ID:** S-004G
**Slice:** Repair the Blueprint and Foundry rows
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006D
**Destination:** spec-acceptance: The Blueprint and Foundry rows no longer contradict the owner answers recorded in the Spec: the Blueprint row describes the four-part short page and says what the Blueprint is for, and the Foundry row says what the owner said the Foundry is and keeps the sole-source boundary.
**Planned verification:** Red: a check on the two rows fails first. Green: that check, the evaluator and the full AGENTS suite on the committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004g-blueprint-3b | ce96ae40f0146c5d783a9c4c9abad8531bf82b8b | none | 0 | Red c0092e9c: tools/test-control-fidelity.mjs and tools/test-adr.mjs Blueprint and Foundry pins fail. Green: test-control-fidelity 35/35, test-adr 56/56 (the Blueprint pin in the workflow-meaning check changed to the four-part short page), wiki validate ok; full AGENTS suite 48/48 on clean ce96ae40 (an earlier run on a stale-pattern candidate failed test-adr and was fixed) | LEXICON.md and templates/LEXICON.md (Blueprint row; root Foundry row); workbench/wiki/MEMORY.md (two delivery pages routed, BLUEPRINT.md route line) and templates/wiki/MEMORY.project.md route line, handed over by the Blueprint Short Page lane | Decision record for the Journey correction, controls inventory and Workflow Verbs article remain; templates carry no Foundry row (producer term) | bfc814f55ca9fb4469c042af16858ec1cb940b44690dc5505b1422911031fa77 |
