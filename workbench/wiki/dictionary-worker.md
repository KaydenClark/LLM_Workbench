---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Worker
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
  - AGENTS.md
  - workbench/skills/implement/SKILL.md
last_verified: 2026-10-07
---

# Worker: the Task-scale role

The Worker is the role scoped to one assigned Task and one attempt, producing a
self-checked result and hand-back. The canonical definition is the [glossary
entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** No worker role skill exists yet; AGENTS carries its job until the Contract rewrite ([ADR-000V](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)).

**Neighbouring words.** It runs one [Task](dictionary-task.md) in one
[Chat](dictionary-chat.md) for a [Dispatcher](dictionary-dispatcher.md), through
the [Journey](dictionary-journey.md): it checks its own work at
[QA](dictionary-qa.md) and hands back at [Submit](dictionary-submit.md),
recording each run in the [Task receipt](dictionary-task-receipt.md). The [Builder](dictionary-builder.md) stance it usually takes has its own glossary entry.

**In use.** The Worker for TK-009I wrote a failing check first, then these
articles, ran the targeted tests and the full suite on its committed candidate,
and handed back a pull request into the S-004O assembly branch whose body
answers whether it can merge and whether the Task is complete.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): the Worker's scope.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review): the hand-back answers.
- [The `implement` skill](../skills/implement/SKILL.md): selection, implementation and hand-back.
