---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Role
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
  - workbench/wiki/design-concepts/roles-and-stances.md
last_verified: 2026-10-07
---

# Role: an agent's scope of responsibility

A Role is the assigned scope of responsibility for an agent, one per scale: as
the accepted destination, Captain, Director, Dispatcher and Worker. The
canonical definition is the [glossary entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** Each role's job lives in its role skill, which the Destination Packet links. Branches and lanes express scope; the request and `AGENTS.md` still establish permission ([ADR-000V](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)). Delegation through handoffs within a role follows [AGENTS](../../AGENTS.md#handoff-assignments-and-shared-context).

**Neighbouring words.** The four roles are [Captain](dictionary-captain.md),
[Director](dictionary-director.md), [Dispatcher](dictionary-dispatcher.md) and
[Worker](dictionary-worker.md); the [Owner](dictionary-owner.md) is above them.
A role scopes an [Agent](dictionary-agent.md); a [stance](dictionary-stance.md), with its own glossary entry, supplies the method. The [Destination
Packet](dictionary-destination-packet.md) links the role skill.

**In use.** On S-004O one agent holds the Dispatcher role for the Spec and its
assembly branch, and each Task's agent holds the Worker role with the [Builder](dictionary-builder.md) stance. The role sets what each coordinates, the stance how each works, and
neither grants a permission the request and `AGENTS.md` have not given.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): role skills own each job.
- [The roles and stances decision (ADR-000P)](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md): roles scope work, stances define the job.
- [Roles and stances](design-concepts/roles-and-stances.md): the role model.
