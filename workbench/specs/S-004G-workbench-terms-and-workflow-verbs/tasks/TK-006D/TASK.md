# TK-006D - Add the Workflow verb row, one row per workflow verb, and repair the Workflow and Align rows

**Task ID:** TK-006D
**Spec ID:** S-004G
**Slice:** Add the Workflow verb row, one row per workflow verb, and repair the Workflow and Align rows
**Status:** done
**Stance:** Builder
**Blockers:** TK-006C
**Destination:** spec-acceptance: Each of the fourteen workflow verbs has exactly one row stating its confirmed meaning, the Workflow verb row states the owner definition, and the Workflow row states the open verb set and the delivery workflow Idea, Align, Confirm, Map, Plan, Journey, Approve, Delivered, Clean Up.
**Planned verification:** Red: a check that each named verb has exactly one row and that the Workflow row names the delivery workflow fails first. Green: that check, the evaluator and the full AGENTS suite on the committed candidate.
**Proof:** Red 73e4610e then green: control-fidelity 33/33, test-adr 56/56, full suite on clean 75af5dbf all pass except one temp-directory race in test-spec-workbench that passes alone 59/59

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004g-verbs-2 | 75af5dbfe60e5c23eb00413d2f1fbe07a2190461 | ahead 0 behind 0 | 0 | Red 73e4610e: tools/test-control-fidelity.mjs verb case fails. Green: test-control-fidelity 33/33, test-adr 56/56 after the one-line Align meaning update (first full run failed test-adr on the old Align text); full AGENTS suite on clean 75af5dbf: 47/48 with test-spec-workbench exiting nonzero on a temp-directory race in a git clone (59/59 tests passed, concurrent lanes share the temp area); rerun alone rc=0, 59/59 | LEXICON.md and templates/LEXICON.md (Workflow verb row, fourteen verb rows, repaired Workflow, Align, Map, Writer verb and Landmark Tracker rows); tools/test-adr.mjs Align expectation; Spec S-004G settled questions | Blueprint and Foundry repairs, decision record for the Journey correction, controls inventory and Workflow Verbs article remain; DDR on release proof still lists Complete (needs a visible correction by its owner) | 8c201248b8d32b3b14de93a40a1519af199bbdfa28c17ba7c3405f0d1ee9df3b |
| 2 | claude/s004g-verbs-2 | a360268d2d2ff06c0d1d642037f09e6f4e112a52 | ahead 0 behind 0 | 0 | Red 73e4610e then green: control-fidelity 33/33, test-adr 56/56, full suite on clean 75af5dbf all pass except one temp-directory race in test-spec-workbench that passes alone 59/59 | Lexicons carry the workflow verb rows; Align meaning check updated | Blueprint and Foundry repairs, decision record, controls inventory and Workflow Verbs article remain | 19486bfe6d558c308210044e10a67c1b92116ae5ff28059120e91bb58732f6a6 |
