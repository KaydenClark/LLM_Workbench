# TK-006C - Add the Owner, Room, Workbench Template, Scaffolding, artifact-kind and Control rows and retire "root controls"

**Task ID:** TK-006C
**Spec ID:** S-004G
**Slice:** Add the Owner, Room, Workbench Template, Scaffolding, artifact-kind and Control rows and retire "root controls"
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The Lexicon has exactly one row each for Owner, Room, Workbench Template, Scaffolding, Contract artifact, Routing artifact, Architecture artifact and Control, each stating the owner confirmed meaning and its distinction from its neighbors; the Root controls row is rewritten in the artifact-kind terms.
**Planned verification:** Red: a check that each named term has exactly one row in both Lexicons, and that the Lexicons no longer use "controls" for files outside public names and retired-name rows, fails first. Green: that check, the evaluator and the full AGENTS suite on the committed candidate.
**Proof:** Red 9381d06f then green: test-control-fidelity 32/32, templates evaluator, full AGENTS suite 48/48 on clean 0120bfcc

## Blocker Note

This Task waited on the last Task of the AI Coding Dictionary Terms Spec so the Lexicon keeps one writer at a time. That Task (TK-006B, the dictionary Wiki entries) is done and merged into integration (PR #307), and a plain Task blocker resolves only inside its own Spec, so the cross-Spec blocker could never clear by itself; it is removed here by the lane's single writer with that evidence.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004g-terms-1 | 3e13b2ae04608ae67c638eb2953b24e4ece8607e | ahead 0 behind 0 | 0 | Red 9381d06f: tools/test-control-fidelity.mjs new case fails (no Owner, Room, artifact-kind or Control rows; controls still used for files). Green: test-control-fidelity 32/32; templates evaluator passes; full AGENTS suite 48/48 on clean 0120bfcc (and on 3bce9281 before a template-only quotation trim) | LEXICON.md and templates/LEXICON.md (Owner, Room, Workbench Template (root only), Scaffolding, Contract artifact, Routing artifact, Architecture artifact, Control rows; Root controls retired and Root files row; the Lexicon's own uses of controls for files repaired; the Contract Carrier rewrite is now named as planned); Spec S-004G settled questions | Workflow verb rows, Blueprint and Foundry repairs, decision record and controls inventory remain in the next four Tasks | fd6482384e3c3bc59cb06b4d54377f7ab5d6dd839fe64aaaecdec03507792ff1 |
| 2 | claude/s004g-terms-1 | 0777959b3fcc2e5ee5faa2c62d845a1bf3a9ead1 | ahead 0 behind 0 | 0 | Red 9381d06f then green: test-control-fidelity 32/32, templates evaluator, full AGENTS suite 48/48 on clean 0120bfcc | LEXICON.md and templates/LEXICON.md carry the Workbench term rows and the retired controls wording is repaired in both; Spec settled questions recorded | Verb rows, Blueprint and Foundry repairs, decision record and controls inventory remain in four Tasks | b8c283fcb47f135e89c3efb9cbfa2a4472417086d04d85f0d83a373c83b931c9 |
