---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Implement
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/implement/SKILL.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Implement: changing the source of truth or the working project

Implement is changing the source of truth, or changing what the project is
working on. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The first verb of the Journey. What it writes, Canon or Actuality, is in the Writer verb entry. Implementing a Blueprint change writes
Canon; implementing a Task's code or tool change writes Actuality.

**Neighbouring words.** It opens the [Journey](dictionary-journey.md) and is
followed by [Check](dictionary-check.md), [QA](dictionary-qa.md) and
[Submit](dictionary-submit.md). It comes after [Plan](dictionary-plan.md). Its
plane is given by the [Writer verb](dictionary-writer-verb.md) entry. It is not
a [Prototype](dictionary-prototype.md), which writes nothing durable.

**In use.** In this room a Worker implements one claimed Task on its own
branch, for example adding a validator rule to `workbench/tools/wiki.mjs`
after committing the failing test that proves the rule is missing; the
`implement` skill carries the procedure.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The implement skill](../skills/implement/SKILL.md): selecting, claiming and carrying one Task.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Implement writes Canon or Actuality.
