---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Frontier
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - TASKBOARD.md
  - workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md
last_verified: 2026-10-07
---

# Frontier: the Tasks ready to take now

The frontier is the set of Tasks at the edge of the current Map that are open,
not blocked and not yet claimed: the work any agent could pick up next. The
canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Taskboard projects implementation work across Specs; Landmark Tracker separately shows evolving documentation and understanding. Neither view authors the source state. The frontier moves as Tasks close and
unblock their dependants, and it stops at the destination: out-of-scope work
never joins it.

**Neighbouring words.** It is the moving edge of a [Map](dictionary-map.md),
whose Tasks are written at [Plan](dictionary-plan.md). Work beyond it that
cannot yet be stated is [Fog](dictionary-fog.md). The
[Landmark Tracker](dictionary-landmark-tracker.md) shows documentation progress
instead and has no frontier of its own.

**In use.** `node workbench/tools/spec-workbench.mjs next` offers work from the
frontier, and `TASKBOARD.md` projects it across Specs. In the Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), once the
glossary Task closed, the first Wiki lexicon batch and the promotion scenario
were both on the frontier at once, so two Workers took them in parallel.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [Taskboard](../../TASKBOARD.md): the generated projection of implementation work.
- [The Landmark Tracker decision (ADR-000N)](../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md): the Tracker beside the Taskboard.
