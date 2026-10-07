---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Flow
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - RUNBOOK.md
  - workbench/docs/adr/0045-skill-composition-within-inherited-scope.md
last_verified: 2026-10-07
---

# Flow: a short sequence of skills

A Flow is a short sequence of skills that moves work from one recognizable state
to another. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** A flow composes skills; it does not duplicate their instructions.

**Neighbouring words.** Its steps are [Skills](dictionary-skill.md); a
[Router](dictionary-router.md) may recommend one. A
[Workflow](dictionary-workflow.md) is the larger idea, composed from [Workflow
verbs](dictionary-workflow-verb.md) rather than from skills.

**In use.** The Runbook's [Behavior
Selection](../../RUNBOOK.md#behavior-selection) table names flows: deciding an
idea is `grill-me`, the entry composing `grilling` with `notepad`, and
reconciling agreed claims is `promote` with `to-docs` and `save`. Each skill
keeps its own instructions; the flow only names the sequence and the endpoint.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [RUNBOOK.md, Behavior Selection](../../RUNBOOK.md#behavior-selection): the flows this room composes.
- [The skill composition decision (ADR-0045)](../docs/adr/0045-skill-composition-within-inherited-scope.md): helpers inherit the caller's scope.
