---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Context Map
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - ARCHITECTURE.md
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
last_verified: 2026-10-07
---

# Context Map: how the Workbench's owners connect

The Context Map is the navigable relationships among Workbench concepts, root
files, specs, Wiki context, and referenced source/evidence. It is entered
through the routes in `ARCHITECTURE.md`, which took over the Lexicon's Task
Routing table when the Lexicon retired. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** Existing owners hold the information; any rendered map is a source-derived Projection, not another truth store or authority. No graph service or Obsidian dependency is required.

**Neighbouring words.** It is not a [Map](dictionary-map.md), the direction to
one destination; the Map entry says so from its side. Its entry routes are a
[Routing artifact](dictionary-routing-artifact.md)'s job, each reached through a
[Context pointer](dictionary-context-pointer.md), and following them rather than
searching is what [Traverse, don't search](dictionary-traverse-don-t-search.md)
means. It is not [Context](dictionary-context.md) either, which is what an agent
has loaded now.

**In use.** A question about what a word means here starts at the Language row
of the [Ownership table in ARCHITECTURE.md](../../ARCHITECTURE.md#ownership),
which routes to the [glossary](../../GLOSSARY.md) and from the term to its Wiki
article. The [Routes](../../ARCHITECTURE.md#routes) table there lists the
Context Map's entry routes and copies none of the owners' contents; a diagram
drawn from them would be a Projection, regenerated from the owners, never edited
as a truth of its own.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [ARCHITECTURE.md, Routes](../../ARCHITECTURE.md#routes): the Context Map's entry routes.
- [The Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md): why ownership routes moved to `ARCHITECTURE.md`.
- [The context map landmark](design-concepts/landmark-context-map.md): the design concept behind the map.
- [Blueprint, active ADRs and the Context Map](features/blueprint-active-adrs-and-the-context-map.md): the delivered capability.
