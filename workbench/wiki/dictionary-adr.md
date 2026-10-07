---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: ADR
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/REGISTER.md
  - workbench/tools/adr.mjs
last_verified: 2026-10-07
---

# ADR: an architecture decision record

An ADR is an architecture decision record in `workbench/docs/adr/`: a title, the decision, the alternatives considered, the consequences, its provenance, and frontmatter naming the operational owners the decision is carried into. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Active accepted ADR decision claims are architectural Canon; rationale and history remain distinct; `canonicalized_in` names operational owners ([ADR-000A](../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)).

**Neighbouring words.** An ADR is one kind of [Decision Record](dictionary-decision-record.md); the other is the [DDR](dictionary-ddr.md). Both are read with the same [Read words](dictionary-read-words.md). Accepted ADR decisions are Canon on the [Governance Plane](dictionary-governance-plane.md) model.

**In use.** ADR-000Y, "A locked and confirmed answer is promoted without further ceremony", sits in `workbench/docs/adr/` with `canonicalized_in` naming the files that carry it, and `workbench/docs/adr/REGISTER.md` lists it. `node workbench/tools/adr.mjs validate` checks the collection; the [to-docs skill](../skills/to-docs/SKILL.md#decision-records) owns the procedure for writing one.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The active ADR decisions decision (ADR-000A)](../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md): accepted decisions are Canon; `canonicalized_in` names operational owners.
- [The ADR register](../docs/adr/REGISTER.md): the derived list.
- [RUNBOOK.md, Architecture Decision Records](../../RUNBOOK.md#architecture-decision-records): the commands.
