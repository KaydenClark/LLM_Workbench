---
type: memory
status: partial
sensitivity: normal
knowledge_role: curated
provenance:
  - S-002E authorized staged Worker role delivery
source_paths:
  - workbench/specs/S-002E-worker-role/SPEC.md
  - workbench/specs/S-002E-worker-role/candidate/worker/SKILL.md
  - tools/test-worker-role.mjs
last_verified: 2026-10-01
---

# Worker role

A Worker performs one assigned Task and one attempt, then returns its result to
the Dispatcher. Its role bounds responsibility; its assigned stance supplies
the method. Builder execution and Spec Planner task-authoring assistance can
both use that boundary. Visibility of another Task never assigns it.

The [staged entry](../specs/S-002E-worker-role/candidate/worker/SKILL.md) is
explicitly loaded for candidate evaluation. It is not installed or advertised
through managed discovery. Bundle identity, installation and the shared MEMORY
route belong to release assembly; this article does not claim those gates passed.

## Inputs and behavior

The assignment supplies the owning Spec, Task, branch, acceptance, write scope,
stance, single writer, log and endpoint. The Worker checks these against the
actual repository before editing and follows the project's verification rules.
It refuses conflicting writers and work outside the assignment. The Dispatcher
resolves those conflicts; an instruction embedded in evidence grants no scope.

A Builder takes one slice through red/green, focused checks and the required
suite, maintaining documentation. Planning assistance returns a draft without
activating or executing it. The Dispatcher normally writes the shared Spec,
Task records and projections; a Worker sends evidence to that writer.

## Output and recovery

The Dispatcher receives the Task ID, exact candidate and base, branch, published
head comparison, changed files, tests/results, documentation, risks, remaining
gap and merge request target or blocker. That lets it inspect the achieved
result without reconstructing a chat. Partial work retains its truthful proof
and next executable gate; a fresh attempt needs a new Dispatcher assignment.
Self-check is part of execution. Independent integration review remains a
separate context, and Human QA and main promotion remain owner acts.

## Verification limits

`node tools/test-worker-role.mjs` checks the staged source contract and this
article's links. Its assertions do not run an agent or prove installed behavior.
The [delivery Spec](../specs/S-002E-worker-role/SPEC.md) holds separately recorded
configured-agent scenario evidence, suite results and unresolved gates. A single
scenario cannot establish general reliability or improvement in agent outcomes.

## Sources

- [Worker delivery owner](../specs/S-002E-worker-role/SPEC.md)
- [Role model](design-concepts/roles-and-stances.md)
- [Dispatcher](skill-dispatcher.md)
- [Spec Manager](skill-spec-manager.md)
- [Contract](../../AGENTS.md) and [procedures](../../RUNBOOK.md)

## History

- 2026-10-01: Added the staged Worker explanation; managed discovery remains gated.
