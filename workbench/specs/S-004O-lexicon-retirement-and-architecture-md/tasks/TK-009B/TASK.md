# TK-009B - ARCHITECTURE.md holds the ownership table, routes and invariants in the room and the Template

**Task ID:** TK-009B
**Spec ID:** S-004O
**Slice:** ARCHITECTURE.md holds the ownership table, routes and invariants in the room and the Template
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-009A
**Destination:** spec-acceptance: `ARCHITECTURE.md` exists in the room and the Template, stays short, and holds the ownership table, routes and invariants; Genesis and adoption draft the codemap for a new room.
**Planned verification:** Red: a check that `ARCHITECTURE.md` and `templates/ARCHITECTURE.md` exist with a bird's-eye view, a codemap, the ownership table, routes and invariants, no code links and a short length budget fails first. Green: that check, the landing inventories' `architecture` entries landing, the templates evaluator and template-placeholder check, then the full suite.
**Claimed by:** claude-s004o-worker-b

## Scope

Write root `ARCHITECTURE.md` and its generic `templates/ARCHITECTURE.md` from the census's `architecture` lines: the Task Routing and Context Map routes, the Ownership Rules, the Artifact Ownership Schema and the invariants and boundaries, in the matklad shape (bird's-eye view, then codemap naming modules and types with no code links, explicit invariants and boundaries). `ARCHITECTURE.md` is a routing artifact, never a Contract file. The Template keeps a codemap placeholder that Genesis and adoption fill (TK-009G wires that route). Do not remove Lexicon lines here.
