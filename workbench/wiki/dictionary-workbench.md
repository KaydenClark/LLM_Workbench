---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workbench
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md
  - workbench/docs/ddr/000U-a-project-is-a-room-and-the-workbench-is-the-table-in-it.md
  - workbench/docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md
last_verified: 2026-10-07
---

# Workbench: the agentic management system a harness loads

A Workbench is an agentic management system for a project: the safe rules,
progressively disclosed project truth, executable work and proof requirements
that agents running in a harness such as Claude Code or Codex load, so they can
align the owner's ideas and implement the owner's design concepts. It is made of
one set of Contract and routing artifacts with exactly one Blueprint. A
Workbench can hold many other Workbenches and many Projects, and each Project it
holds has its own Workbench, so projects nest (TT-Q3, answered by the owner
2026-09-23); a parent Workbench owns what its children share, and a child owns
only what is its own ([the nesting
decision](../docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md)).
The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** Not a harness: Claude Code and Codex are the harnesses that load it. ([the decision that the workbench is an agentic management system, not a harness](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md)) It governs the workflow; it is not the product being built. It is the table set in a project's room. ([the room and table decision](../docs/ddr/000U-a-project-is-a-room-and-the-workbench-is-the-table-in-it.md)) Nesting is the destination; tooling for a Workbench that holds other Workbenches is not built yet. A Workbench relates to Workbenches one-to-many and to Projects one-to-many; a Project relates to its own Workbench one-to-one.

**Neighbouring words.** The [Harness](dictionary-harness.md) loads it; the
[Project](dictionary-project.md) is the work it manages; the
[Room](dictionary-room.md) is that project seen as a place, with the Workbench
as the table in it. Its files are a [Contract
artifact](dictionary-contract-artifact.md) and [Routing
artifacts](dictionary-routing-artifact.md) with one
[Blueprint](dictionary-blueprint.md), and agents work it through
[Controls](dictionary-control.md). Packaged so any agent can clone it and work,
it is a [Portable Workbench](dictionary-portable-workbench.md); LLM Workbench's
product is the [Workbench Template](dictionary-workbench-template.md).

**In use.** This repository is a Workbench: Claude Code reaches `AGENTS.md`
through `CLAUDE.md`, Codex reads `AGENTS.md` directly, and both resolve assigned
work through `workbench/manifest.json`. "The Workbench" names those rules,
records and tools, never the harness running the session and never the product a
project ships.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The agentic management system decision (DDR-000T)](../docs/ddr/000T-the-workbench-is-an-agentic-management-system-not-a-harness.md): not a harness.
- [The room and table decision (DDR-000U)](../docs/ddr/000U-a-project-is-a-room-and-the-workbench-is-the-table-in-it.md): the table set in a project's room.
- [The nesting decision (DDR-000W)](../docs/ddr/000W-rooms-nest-and-a-parent-workbench-owns-what-its-children-share.md): Workbenches and Projects nest.
- [Workbench and project relationships](design-concepts/landmark-workbench-and-project-relationships.md): the design concept.
