---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Foundry
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000X-every-workbench-is-built-to-run-as-one-room-among-many-in-an-autonomous-factory-the-foundry.md
  - workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md
last_verified: 2026-10-07
---

# Foundry: the owner's factory the workbench is built to run in

The Foundry is the owner's autonomous factory of many rooms, each with a workbench producing work. Every workbench is built to run as one room among many in it, and the Foundry needs the workbench proven first. The canonical definition is the [glossary entry](../../GLOSSARY.md#project-specific-terms).

The decision behind it is [the Foundry decision](../docs/ddr/000X-every-workbench-is-built-to-run-as-one-room-among-many-in-an-autonomous-factory-the-foundry.md).

**What it means here.** The workbench is a management system; the Foundry is the autonomous factory it is built to run in. The owner: "The workbench is not the foundry yes, but say what that means." Software factory is the closest dictionary term. The Workbench stays sole source: the Foundry is read-only evidence for it, never its source, copy target, tool runtime, or prerequisite ([ADR-0026](../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)).

**Neighbouring words.** [Software factory](dictionary-software-factory.md) is the general term, a system where triggers rather than people start agent sessions. The [No-governance-tax rule](dictionary-no-governance-tax-rule.md) keeps Foundry coordination out of a room's ordinary work. A workbench is not a [harness](dictionary-harness.md) either.

**In use.** This repository and the Workbench Template are where the workbench is proven: the Foundry may read their releases and evidence, but a room never imports a Foundry tool, and nothing in a room waits on the Foundry to run.

## Sources

- [GLOSSARY.md, Project-specific terms](../../GLOSSARY.md#project-specific-terms): the canonical definition.
- [The Foundry decision (DDR-000X)](../docs/ddr/000X-every-workbench-is-built-to-run-as-one-room-among-many-in-an-autonomous-factory-the-foundry.md): every workbench is built to run as one room among many.
- [The sole-source decision (ADR-0026)](../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md): the Workbench is the sole source and the Foundry extends it.
