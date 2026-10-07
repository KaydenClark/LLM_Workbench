---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workbench Template
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000P-llm-workbench-is-the-producer-and-the-workbench-template-is-its-product.md
  - workbench/docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md
  - templates/GLOSSARY.md
last_verified: 2026-10-07
---

# Workbench Template: LLM Workbench's product

The Workbench Template is LLM Workbench's product: the starting installation
every new project is made from, and the room every release is proven on. The
canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** Not the Template artifact boundary in [ARCHITECTURE.md](../../ARCHITECTURE.md#ownership), which is any reusable starting shape, and not the `templates/` folder, which holds the blank files this repository ships. LLM Workbench is the producer and the Workbench Template is its product ([the producer and product decision](../docs/ddr/000P-llm-workbench-is-the-producer-and-the-workbench-template-is-its-product.md)); a release is proven by the Template building a real product ([the release proof decision](../docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md)).

**Neighbouring words.** It installs a [Workbench](dictionary-workbench.md), and
every new [Room](dictionary-room.md) starts from it. [Host
portability](dictionary-host-portability.md) and the [Workbench self-drift
check](dictionary-workbench-self-drift-check.md) are among what a release proves
about it, and the [Ownership origin model](dictionary-ownership-origin-model.md)
classifies how a room deliberately differs from it across updates.

**In use.** The `templates/` folder holds the blank files this repository ships,
such as `templates/GLOSSARY.md` with its placeholders; the maintainer
[`workbench-release` skill](../skills/workbench-release/SKILL.md) upgrades the
reference Template and proves the composed round trip before a release is
published. The entry exists only in this producer room: the Template's own
glossary has no Workbench Template entry.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The producer and product decision (DDR-000P)](../docs/ddr/000P-llm-workbench-is-the-producer-and-the-workbench-template-is-its-product.md): LLM Workbench makes the Template.
- [The release proof decision (DDR-000Q)](../docs/ddr/000Q-a-release-is-proven-by-the-template-building-a-real-product-in-one-pass.md): a release is proven by the Template building a real product.
- [The Workbench Template landmark](design-concepts/landmark-workbench-template.md): the design concept.
- [The `workbench-release` skill](../skills/workbench-release/SKILL.md): how a release is proven and published.
