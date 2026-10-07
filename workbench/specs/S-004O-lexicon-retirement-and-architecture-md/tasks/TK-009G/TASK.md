# TK-009G - Rooms receive GLOSSARY.md and ARCHITECTURE.md and the update route retires a landed Lexicon

**Task ID:** TK-009G
**Spec ID:** S-004O
**Slice:** Rooms receive GLOSSARY.md and ARCHITECTURE.md and the update route retires a landed Lexicon
**Status:** ready
**Stance:** Builder
**Blockers:** TK-009B, TK-009C, TK-009F
**Destination:** spec-acceptance: Updating a room retires its Lexicon only after its lines land, and a room without one is unchanged; named verification and remaining limitations are recorded without claiming owner approval.
**Planned verification:** Red: an upgrade test that updates a fixture room holding a Lexicon with a project-specific row not yet in its glossary and expects the Lexicon kept fails first, with a companion case that removes a fully landed Lexicon and one that leaves a room without a Lexicon unchanged. Green: those cases, the layout, adoption, Genesis, round-trip, control-fidelity, template-placeholder and self-drift tests, then the full suite.

## Scope

Replace `LEXICON.md` with `GLOSSARY.md` and `ARCHITECTURE.md` in the installed control set (`workbench-layout.mjs`, control fidelity, template placeholders, Genesis and adoption Templates), have Genesis and adoption draft the room's `ARCHITECTURE.md` codemap for grilling to confirm, and make the update route retire a room's Lexicon only after its lines have landed in that room. A room without a Lexicon is unchanged.
