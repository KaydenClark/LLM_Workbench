# TK-006G - Inventory the retired controls wording outside the Lexicon and update the Workflow Verbs article

**Task ID:** TK-006G
**Spec ID:** S-004G
**Slice:** Inventory the retired controls wording outside the Lexicon and update the Workflow Verbs article
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006F
**Destination:** spec-acceptance: Current-facing uses of the retired controls wording outside the Lexicon are inventoried and either corrected or recorded as drift for the Contract carrier rewrite; the template mirror carries the generic rows or the exemption is recorded; the open questions are answered with their evidence.
**Planned verification:** The Wiki lint of the touched article, `node workbench/tools/wiki.mjs validate`, the retired-term sweep test, a cold-reader probe by a fresh read-only agent naming the delivery workflow and what Journey contains, and the full AGENTS suite on the committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004g-inventory-5 | 71681b31204101106e040a2ceffcfce8920d3a58 | ahead 0 behind 0 | 0 | Red: tools/test-control-fidelity.mjs workflow Wiki case fails. Green: test-control-fidelity 37/37, wiki.mjs validate ok; full AGENTS suite 48/48 on clean 71681b31; cold-reader probe by a fresh read-only Codex agent given only LEXICON.md and the Workflow Verbs article: named the delivery workflow, what Journey contains, what Delivered means against the S-###:delivered qualifier, and what control and root controls mean now, with no contradiction; controls inventory run from a whole-word search at integration be0450fe | workbench/wiki/design-concepts/workflow-verbs.md rewritten; idea-to-delivery-workflow.md loop corrected; Spec S-004G retired-controls inventory and acceptance evidence | Assembled-Spec review and owner Human QA; the controls wording in AGENTS.md, RUNBOOK.md, README.md and templates and the release proof DDR's verb list are handed to their owners | 46dce0b695a2584e5839ca21500dcc11d2af39025d5f0c0637772ffcc42058c1 |
