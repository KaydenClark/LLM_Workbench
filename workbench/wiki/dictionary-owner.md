---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Owner
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
last_verified: 2026-10-07
---

# Owner: the person whose ideas the project realizes

The owner is the person whose ideas the project realizes: the one who aligns,
confirms, approves and unblocks, approves delivered work, and alone promotes it
to main. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** Not an agent and not a Role: the owner is above the roles, and the current owner request is the first instruction authority. Human QA and promotion to main are owner acts.

**Neighbouring words.** The owner's own verbs are
[Confirm](dictionary-confirm.md) and [Approve](dictionary-approve.md), with the
[Human QA](dictionary-human-qa.md) that leads to Approve. Every
[Role](dictionary-role.md), from the [Captain](dictionary-captain.md) down to
the [Worker](dictionary-worker.md), sits below the owner. A [Coordination
hand-back](dictionary-coordination-hand-back.md) is a point where the owner had
to supply something an agent should have found for itself.

**In use.** In this room an agent asks the owner only for what `AGENTS.md`
[Safety And Change Control](../../AGENTS.md#safety-and-change-control) reserves
to the owner; the owner's Human QA decision is recorded with `spec-workbench.mjs
approve`, and only the owner promotes `integration` to `main`. A Dispatcher that
finishes a Spec reports it ready for that judgment rather than making it.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [AGENTS.md, Instruction Authority](../../AGENTS.md#instruction-authority): the current owner request first.
- [The two QA gates decision (ADR-000F)](../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md): Human QA and main promotion are owner acts.
- [The roles decision (ADR-000V)](../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): the owner above the roles.
