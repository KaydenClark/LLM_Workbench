---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Router
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - RUNBOOK.md
last_verified: 2026-10-07
---

# Router: a skill that recommends the next skill

A Router is a skill that recommends the smallest appropriate skill or flow for
the current situation. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** It selects work behavior but does not perform the selected behavior automatically.

**Neighbouring words.** It recommends a [Skill](dictionary-skill.md) or a
[Flow](dictionary-flow.md). The Wiki's `MEMORY.md` is called a router in the
ordinary sense of a page that routes reading; the glossary's Router is a skill.
Routes to owners are the [Context Map](dictionary-context-map.md)'s.

**In use.** The Runbook's [Behavior
Selection](../../RUNBOOK.md#behavior-selection) says optional routers are not
prerequisites: after resolving the requested scope, an agent composes the
smallest authorized behavior itself. A router skill that recommends `grill-me`
for an undecided idea leaves the choice and the run to the agent.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [RUNBOOK.md, Behavior Selection](../../RUNBOOK.md#behavior-selection): routers are optional.
- [The skill composition decision (ADR-0045)](../docs/adr/0045-skill-composition-within-inherited-scope.md): composition within inherited scope.
