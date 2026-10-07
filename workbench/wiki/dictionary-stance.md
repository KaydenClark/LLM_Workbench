---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Stance
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/wiki/design-concepts/roles-and-stances.md
last_verified: 2026-10-07
---

# Stance: the job done inside a role

A stance is the job, method and obligations an agent applies within the scope its role gives it. The role says where; the stance says what work is done there. The canonical definition is the [glossary entry](../../GLOSSARY.md#stance-terms).

**What it means here.** Role answers where responsibility applies; stance answers what job is performed there. A stance neither grants authority nor creates independence or an agent by being loaded.

**Neighbouring words.** The stances are [Spec Planner](dictionary-spec-planner.md) and [Spec Manager](dictionary-spec-manager.md), which a Dispatcher uses, and the four portable stances [Builder](dictionary-builder.md), [Auditor](dictionary-auditor.md), [Reviewer](dictionary-reviewer.md) and [Reconciler](dictionary-reconciler.md). A stance is applied by an [agent](dictionary-agent.md); loading one creates no new agent. [Instruction authority](dictionary-instruction-authority.md) is unchanged by it.

**In use.** This Task's record carries `**Stance:** Builder`: the Worker role scopes the agent to one Task and one attempt, and the Builder stance says the job is to deliver a verified result and keep its documentation. The same agent loading the Reviewer stance would gain no authority to approve its own work.

## Sources

- [GLOSSARY.md, Stance terms](../../GLOSSARY.md#stance-terms): the canonical definition.
- [Roles and stances](design-concepts/roles-and-stances.md): scope versus job, and the route to each capability.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): role skills own each role's job.
- [AGENTS.md, Assigned Work And Stances](../../AGENTS.md#assigned-work-and-stances): the operative rule.
- [Landmark: Agent Stances](design-concepts/landmark-agent-stances.md): the four portable stance skills change method, not authority.
