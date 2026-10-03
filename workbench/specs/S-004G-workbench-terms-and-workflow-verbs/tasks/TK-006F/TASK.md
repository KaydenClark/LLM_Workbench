# TK-006F - Record the Journey correction and the current workflow verb decision in a decision record

**Task ID:** TK-006F
**Spec ID:** S-004G
**Slice:** Record the Journey correction and the current workflow verb decision in a decision record
**Status:** done
**Stance:** Builder
**Blockers:** TK-006E
**Destination:** spec-acceptance: A decision record carries the Journey correction and the current verb decision, ADR-000X is narrowed or superseded for the changed points through the record lifecycle, and no active accepted decision claim still says Journey is Map, Plan, Implement, Review and Verify.
**Planned verification:** `node workbench/tools/adr.mjs validate`, `register`, the decision-record tests, a search for the superseded Journey claim across active decision records and the Lexicon, and the full AGENTS suite on the committed candidate.
**Proof:** Red bb222f94 then green: control-fidelity 36/36, test-adr 56/56, full AGENTS suite 48/48 on clean ff89e6a0

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004g-record-4 | ff89e6a093934ef355dc5d1d1efa078f60e726c7 | ahead 0 behind 0 | 0 | Red bb222f94: tools/test-control-fidelity.mjs new case fails (ADR-000X still says Journey is Map, Plan, Implement, Review and Verify). Green: test-control-fidelity 36/36, test-adr 56/56 after the census pins moved for the amendment links, adr validate ok; full AGENTS suite 48/48 on clean ff89e6a0 | workbench/docs/adr/000X (points 1 and 2 amended, Amendment section with the git show anchor of the earlier text); tools/test-adr.mjs census pins | Release proof decision (DDR) still quotes the earlier verb list and needs a visible correction by its owner; controls inventory, Workflow Verbs article and cold-reader probe remain in the last Task | 688db8389f666ec70b4eddc939f5be6aa5bdcae0ce6d7ad969199ec4b8683bc6 |
| 2 | claude/s004g-record-4 | ceea73733f07fd7651bd8b5f14910217a754c426 | ahead 0 behind 0 | 0 | Red bb222f94 then green: control-fidelity 36/36, test-adr 56/56, full AGENTS suite 48/48 on clean ff89e6a0 | ADR-000X amended in place under ADR-000A's amendment-first rule: open verb set and the Journey correction; nothing superseded | Controls inventory, Workflow Verbs article and cold-reader probe remain; the release proof DDR needs a visible correction | 48effbb484915298bb3e343ecab36cd7f1755dcb8c1fccf798ae24e18944b14c |
