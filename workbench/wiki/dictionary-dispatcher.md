---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Dispatcher
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
  - workbench/skills/dispatcher/SKILL.md
last_verified: 2026-10-07
---

# Dispatcher: the Spec-scale role

The Dispatcher is the role scoped to one assigned Spec and its branch,
coordinating its Tasks and owning assembled-Spec verification. The canonical
definition is the [glossary entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** Its job lives in the dispatcher skill and the stances it uses ([ADR-000V](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)).

**Neighbouring words.** It coordinates the [Workers](dictionary-worker.md) of
one [Spec](dictionary-spec.md), under a [Director](dictionary-director.md), and
owns the whole-Spec QA of the [Assembled-Spec
review](dictionary-assembled-spec-review.md). Its planning and dispatching
stances, Spec Planner and Spec Manager, have their own glossary entries.

**In use.** S-004O's Dispatcher cut its Tasks, runs them two at a time with
Workers on their own branches, merges their pull requests into the Spec's
assembly branch, and is the single writer of the Spec, its `TASK.md` records and
the generated projections; its Workers leave those records to it.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): the Dispatcher's scope.
- [The `dispatcher` skill](../skills/dispatcher/SKILL.md): its job.
- [Roles and stances](design-concepts/roles-and-stances.md): the role model.
