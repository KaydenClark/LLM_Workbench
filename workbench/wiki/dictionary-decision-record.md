---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Decision Record
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md
  - workbench/tools/adr.mjs
last_verified: 2026-10-07
---

# Decision Record: one consequential decision and why

A decision record keeps one consequential decision and the reason it was made. There are two kinds: an ADR for an architectural choice and a DDR for a destination choice. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Both are atomic, superseded whole and managed alike by one tool, `adr.mjs`, which creates, validates, registers, accepts, supersedes, deprecates and reads both; the DDR's template may adapt where a destination record needs it. The test that chooses between them: would the choice still hold if the architecture were rebuilt differently? Yes is a DDR ([ADR-000S](../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md)). `to-docs` composes both ([ADR-000Y](../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md)).

**Neighbouring words.** Its two kinds are the [ADR](dictionary-adr.md) and the [DDR](dictionary-ddr.md); both answer the [Read words](dictionary-read-words.md). A decision usually starts as a [Grilling](dictionary-grilling.md) answer and is written through [Direct promotion](dictionary-direct-promotion.md) or the to-docs skill. The [Decision records and the concept map](design-concepts/decision-records-and-the-concept-map.md) article explains how they fit with the Blueprint.

**In use.** "Core skills ship in the room's skills lane" would change if the architecture were rebuilt, so it is ADR-000M. "The Lexicon retires; terms live in the Wiki and ownership routes in ARCHITECTURE.md" says what the finished product must be whatever the architecture, so it is DDR-001E. `adr.mjs` manages both.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The decision records decision (ADR-000S)](../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md): DDRs are decision records beside ADRs.
- [The promotion decision (ADR-000Y)](../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md): `to-docs` composes both.
- [Decision records and the concept map](design-concepts/decision-records-and-the-concept-map.md): the full account.
