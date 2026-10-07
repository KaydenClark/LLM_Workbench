---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Confirm
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Confirm: the owner's agreement to a readback

Confirm is the owner's agreement to a readback that names the concept, its
direction, its cost, the reason for it and what will be created. It authorizes
the agents to carry the concept to its endpoint. The canonical definition is
the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** A claim moves from Intent to Enduring Context only by the owner's confirmation of its readback, in a grilling session or ordinary conversation, for one answer or a batch; an agent's recommendation is intent too, and the owner's yes confirms it as written. A review surface whose items carry their own Confirm button is the one place the confirmation is that button rather than a chat reply. Once the owner confirms a concept, the agents are authorized to carry it to its endpoint, unless the confirmation names a nearer one ([the confirmation decision](../docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md)). The Confirmed label the Landmark Tracker prints for a question card is evidence of understanding and, as `AGENTS.md` says, grants no authority by itself; the verb is the owner's agreement to a readback. Whether `AGENTS.md`'s sentence should say so would change a rule's meaning, which the Contract carrier rewrite, a relocation, did not do; it stays open for its own decision. Approve is the owner's later judgment of delivered work.

**Neighbouring words.** It closes [Align](dictionary-align.md) and comes before
[Map](dictionary-map.md) (or [Plan](dictionary-plan.md), when there is nothing
to map). A [Prototype](dictionary-prototype.md) may sit before it or just
after. Confirm writes Enduring Context: Destination Question Cards and Wiki
pages are written there ([Writer verb](dictionary-writer-verb.md)).
[Approve](dictionary-approve.md) is the owner's later judgment of what was
delivered, not a second Confirm.

**In use.** For example, at the end of a grilling the agent reads back "the glossary owns
concise definitions, the Wiki keeps fuller explanations, `ARCHITECTURE.md`
owns routes; this Spec will create both files and their Template mirrors", and
the owner's "yes" confirms it. From then on the agents carry it through Map,
Plan and the Journey without asking again at each step.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The confirmation decision (DDR-000C)](../docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md): what confirmation authorizes.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Confirm writes Enduring Context.
- [AGENTS.md](../../AGENTS.md): the Tracker's Confirmed label grants no authority by itself.
