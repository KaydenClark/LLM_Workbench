---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Blueprint
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - BLUEPRINT.md
  - workbench/docs/ddr/000N-every-room-s-blueprint-is-the-four-part-short-page.md
  - workbench/docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md
last_verified: 2026-10-07
---

# Blueprint: the direction we want to head, and the choices so far

The Blueprint is a high-level summary of the direction we want to head and the
choices that got us this far, written as the four-part short page (what it is,
who it serves, promised outcomes, non-goals) for every room ([the short page
decision](../docs/ddr/000N-every-room-s-blueprint-is-the-four-part-short-page.md)).
Each sentence can serve as a map toward an implementation plan, sometimes
through maps at several scales; a sentence big enough to need its own map
becomes a landmark. A Workbench has exactly one Blueprint, and a Blueprint has
many Specs and many Tasks. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** The Blueprint makes us ask questions; it does not give definite answers. Definite answers and their details live on other artifacts, and a decision record answers why for one specific decision. A decision is placed by asking whether it maps to a destination at the Blueprint's scale or to a more bounded one ([the Blueprint purpose decision](../docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md)). It supports the design concept; it is not current status, an ADR or DDR inventory, a work queue, a glossary, or a proof archive. The accepted destination keeps it standalone and written before the decisions that follow it, so it is never built from DDRs or ADRs: it is not a router to them and links no record that carries an identifier (a DDR, ADR, Spec, Task or Landmark); it may link other artifacts. This room's Blueprint is that page; the [Blueprint Short Page](../specs/S-004H-blueprint-short-page/SPEC.md) Spec swapped it in ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md), [ADR-000S](../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md)).

**Neighbouring words.** A sentence of it can become a [Map](dictionary-map.md);
one big enough becomes a [Landmark](dictionary-landmark.md), and smaller
destinations become [Specs](dictionary-spec.md). It helps reconstruct the
[Design concept](dictionary-design-concept.md). It is a [Routing
artifact](dictionary-routing-artifact.md), and goes through the workflow verbs
rather than through a Spec and Tasks ([Writer verb](dictionary-writer-verb.md)).

**In use.** This room's [`BLUEPRINT.md`](../../BLUEPRINT.md) has the four parts.
Its promised outcome that every kind of truth has one maintained home is a
sentence big enough to need maps of its own; asked for current status or the
next Task, the Blueprint has no answer, because those live in the Spec catalog
and the Taskboard.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The short page decision (DDR-000N)](../docs/ddr/000N-every-room-s-blueprint-is-the-four-part-short-page.md): the four-part page.
- [The Blueprint purpose decision (DDR-000O)](../docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md): it makes us ask questions.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md) and [the DDR decision (ADR-000S)](../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md): what sits under it.
- [Blueprint Short Page (S-004H)](../specs/S-004H-blueprint-short-page/SPEC.md): the Spec that swapped in this room's page.
