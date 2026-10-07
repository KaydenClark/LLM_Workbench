---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Plan
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/to-tasks/SKILL.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Plan: slicing the map into Tasks

Plan is slicing a Map into bounded, executable units of work, each with an
outcome and a result that can be proved. The units are Tasks. The canonical
definition is the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** Tasks are written at Plan, through the `to-tasks` skill. When there is nothing to map, Confirm goes to Plan. Plan writes Grounding: claims about
what the work should look like, not the work.

**Neighbouring words.** It follows [Map](dictionary-map.md) (or
[Confirm](dictionary-confirm.md) directly) and comes before the
[Journey](dictionary-journey.md), whose first verb is
[Implement](dictionary-implement.md). The Tasks it writes become the
[Frontier](dictionary-frontier.md) as they unblock. A failed
[Review](dictionary-review.md) can send work back to Plan.

**In use.** When the Lexicon Retirement And ARCHITECTURE.md Spec (S-004O) was
activated, Plan verified its context layout and cut eight Tasks; after the
census showed the Wiki work was too large for one Task, Plan ran again and
re-cut the Wiki slice into five batches.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The to-tasks skill](../skills/to-tasks/SKILL.md): how Tasks are cut.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Plan writes Grounding.
- [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md): the example.
