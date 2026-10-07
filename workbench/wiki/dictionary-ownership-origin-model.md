---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Ownership origin model
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/specs/S-00G-ownership-map-root-control/SPEC.md
  - workbench/docs/adr/0050-visible-deliberate-control-divergence.md
last_verified: 2026-10-07
---

# Ownership origin model: upstream or project-local, and kept across updates

The Ownership origin model is the model of where an ownership assignment comes
from, upstream Workbench or project-local, and of how a room's deliberate
differences from upstream are classified and preserved across updates. The
canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** About upgrade compatibility between upstream and a room, not about a Portable Workbench. Owned by [S-00G](../specs/S-00G-ownership-map-root-control/SPEC.md); the open FND-Q24B question belongs to it. Formerly the "portability model"; that name is retired.

**Neighbouring words.** It is about the [Workbench
Template](dictionary-workbench-template.md) and a [Room](dictionary-room.md)
made from it, not about the [Portable
Workbench](dictionary-portable-workbench.md). The [Workbench self-drift
check](dictionary-workbench-self-drift-check.md) is a different check, of this
repository's own artifacts; [control fidelity](dictionary-control-fidelity.md), with its own glossary entry,
reports a room's differences.

**In use.** When an update reaches a room, a line the room changed on purpose is
a project-local difference to classify and keep, not drift to overwrite; the
control-fidelity report shows such differences rather than forcing the room back
to the Template ([the visible divergence
decision](../docs/adr/0050-visible-deliberate-control-divergence.md); [the
ownership split
decision](../docs/ddr/000R-llm-workbench-owns-what-a-workbench-is-the-project-owns-what-it-says-and-may-add-without-tearing-apart-what-works.md)).

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [Ownership Map Root Control (S-00G)](../specs/S-00G-ownership-map-root-control/SPEC.md): the owning Spec.
- [The visible divergence decision (ADR-0050)](../docs/adr/0050-visible-deliberate-control-divergence.md): deliberate differences stay visible.
- [The ownership split decision (DDR-000R)](../docs/ddr/000R-llm-workbench-owns-what-a-workbench-is-the-project-owns-what-it-says-and-may-add-without-tearing-apart-what-works.md): LLM Workbench owns what a workbench is; the project owns what it says.
