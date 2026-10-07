---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Design Concept article
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/wiki/design-concepts/README.md
  - workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md
last_verified: 2026-10-07
---

# Design Concept article: an encyclopedic account of one design model

A Design Concept article is an encyclopedic Wiki article in `wiki/design-concepts/` that explains one durable cross-cutting design model, or one landmark's evolving synthesis. It ends with `Evidence and Sources` and carries a `History`. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state. Any agent creates or updates it in an authorized operation whose work touched it; the collection itself remains required ([ADR-0030](../docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md), authorization clause superseded by [ADR-000R](../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)).

**Neighbouring words.** It explains a [Design concept](dictionary-design-concept.md), the shared understanding of what the project is. Its collection is one [Collection](dictionary-collection.md) the [Wiki profile](dictionary-wiki-profile.md) routes. A lexicon article such as this one explains one term; a Design Concept article explains a whole model.

**In use.** [Roles and stances](design-concepts/roles-and-stances.md) is one: it explains scope versus job across every role and stance and routes to each owning skill. The landmark synthesis pages, such as [Landmark: Skills](design-concepts/landmark-skills.md), are the other kind.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The design-concepts collection decision (ADR-0030)](../docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md): every Workbench declares the collection.
- [The evolving synthesis decision (ADR-000R)](../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): any agent updates the pages its work touched.
- [The design-concepts README](design-concepts/README.md): the collection's shape.
