# TK-009B - ARCHITECTURE.md holds the ownership table, routes and invariants in the room and the Template

**Task ID:** TK-009B
**Spec ID:** S-004O
**Slice:** ARCHITECTURE.md holds the ownership table, routes and invariants in the room and the Template
**Status:** done
**Stance:** Builder
**Blockers:** TK-009A
**Destination:** spec-acceptance: `ARCHITECTURE.md` exists in the room and the Template, stays short, and holds the ownership table, routes and invariants; Genesis and adoption draft the codemap for a new room.
**Planned verification:** Red: a check that `ARCHITECTURE.md` and `templates/ARCHITECTURE.md` exist with a bird's-eye view, a codemap, the ownership table, routes and invariants, no code links and a short length budget fails first. Green: that check, the landing inventories' `architecture` entries landing, the templates evaluator and template-placeholder check, then the full suite.
**Claimed by:** claude-s004o-worker-b
**Proof:** Red 709d9b2a (two new governance-core tests fail: ARCHITECTURE.md missing), green: test-governance-core 14/14, every architecture inventory entry lands in root and Template ARCHITECTURE.md, workbench-layout 76/76, control-fidelity 39/39, carrier-landing 19/19, templates evaluator unchanged 106.6/113; full suite 53/53 on clean 60a21707 (log-tk009b.txt); merged into assembly by PR #413

## Scope

Write root `ARCHITECTURE.md` and its generic `templates/ARCHITECTURE.md` from the census's `architecture` lines: the Task Routing and Context Map routes, the Ownership Rules, the Artifact Ownership Schema and the invariants and boundaries, in the matklad shape (bird's-eye view, then codemap naming modules and types with no code links, explicit invariants and boundaries). `ARCHITECTURE.md` is a routing artifact, never a Contract file. The Template keeps a codemap placeholder that Genesis and adoption fill (TK-009G wires that route). Do not remove Lexicon lines here.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | f710e548378825298c739738f33c8b5d398ee34b | ahead 0 behind 0 | 0 | Red 709d9b2a (two new governance-core tests fail: ARCHITECTURE.md missing), green: test-governance-core 14/14, every architecture inventory entry lands in root and Template ARCHITECTURE.md, workbench-layout 76/76, control-fidelity 39/39, carrier-landing 19/19, templates evaluator unchanged 106.6/113; full suite 53/53 on clean 60a21707 (log-tk009b.txt); merged into assembly by PR #413 | New ARCHITECTURE.md (171 lines) and templates/ARCHITECTURE.md (156 lines): bird's-eye view, codemap, ownership table and boundaries, routes, invariants; Template codemap placeholder for Genesis and adoption | Installation into rooms and the Genesis/adoption codemap draft are TK-009G; consumers and Instruction Authority are TK-009F; GLOSSARY.md link resolves when TK-009C merges | e1d5a19fa6163f09b7629859d56173b235861ca046c11dbcb619e1f7865bff22 |
