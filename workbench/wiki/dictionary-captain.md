---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Captain
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
  - workbench/skills/director/SKILL.md
last_verified: 2026-10-07
---

# Captain: the project-scale role

As the accepted destination, the Captain is the role scoped to the project and
its integration branch: it assigns Directors to landmarks, coordinates across
landmarks and oversees Specs under the Blueprint. The canonical definition is
the [glossary entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** Until the Contract rewrite and its role skill land, `AGENTS.md` calls this role the Director. The owner remains above it; Human QA and main promotion remain owner acts ([ADR-000V](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)).

**Neighbouring words.** Below it are the [Director](dictionary-director.md) of
each landmark, the [Dispatcher](dictionary-dispatcher.md) of each Spec and the
[Worker](dictionary-worker.md) of each Task; above it is the
[Owner](dictionary-owner.md). Its scope is the
[Blueprint](dictionary-blueprint.md) and the [Landmarks](dictionary-landmark.md)
under it.

**In use.** Today the agent that coordinates this room's integration branch
across Specs runs the [`director` skill](../skills/director/SKILL.md), because
`AGENTS.md` still names that role Director. In the accepted destination the same
job is the Captain's, and Director names the landmark-lane role below it.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): Captain, Director, Dispatcher and Worker.
- [Roles and stances](design-concepts/roles-and-stances.md): the accepted next shape.
- [The `director` skill](../skills/director/SKILL.md): today's integration-role job.
