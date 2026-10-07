---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Task
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/docs/ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md
  - workbench/wiki/design-concepts/task-artifact-and-lifecycle.md
last_verified: 2026-10-07
---

# Task: one bounded slice toward a destination

A Task is one bounded executable thin vertical slice that reaches or repairs a
destination, with its own state, proof, blockers and assigned stance in TASK.md.
Its Worker self-checks and hands back. One Task is intended for one useful
context and one Chat (TT-Q4). The canonical definition is the [glossary
entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** It is temporary execution structure. When a check finds a miss and the fix is more of the same work, the same Task continues with an adjusted handoff; a new Task opens only when the fix changes the Task enough that it has to be rewritten ([DDR-000Y](../docs/ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md)). A later gap against delivered work becomes a new Spec under its landmark or the Blueprint, never a revived Spec and never a correction anchored to a Wiki claim ([DDR-000M](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)). Small direct Blueprint Tasks remain accepted destination design with no delivered home; a Task's parent is its Spec or, directly, an assigned and active landmark ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)), and a `wiki-claim` destination serves only a Task whose own destination is producing that Wiki page. [ADR-000H](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md) owns Receipt; the Destination Packet has its own entry; [AGENTS](../../AGENTS.md#git-rules) carries the current Task-PR integration exception.

**Neighbouring words.** Its parent is a [Spec](dictionary-spec.md) or a
[Landmark](dictionary-landmark.md); a [Worker](dictionary-worker.md) runs it in
one [Chat](dictionary-chat.md), from its [Destination
Packet](dictionary-destination-packet.md), through the
[Journey](dictionary-journey.md), and records each run in its [Task
receipt](dictionary-task-receipt.md). The open, unblocked ones are the
[Frontier](dictionary-frontier.md). Ticket is the retired name for it, listed in
the glossary as the alias to avoid
([ADR-000H](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md)).

**In use.** TK-009I, the Task that wrote this article, is
`tasks/TK-009I/TASK.md` under S-004O. Its Scope, Planned verification, blockers
and stance live there; one Worker took it, wrote a failing check first,
implemented it on its own branch, self-checked and handed back through a pull
request into the Spec's branch.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The Task decision (ADR-000H)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md): a Task is a standalone artifact, replacing ticket.
- [The miss decision (DDR-000Y)](../docs/ddr/000Y-a-miss-found-by-a-check-continues-the-same-task-unless-the-fix-rewrites-it.md): a miss continues the same Task unless the fix rewrites it.
- [The scaffolding decision (DDR-000M)](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md): a later gap becomes a new Spec.
- [The Task artifact and its lifecycle](design-concepts/task-artifact-and-lifecycle.md): the full account.
