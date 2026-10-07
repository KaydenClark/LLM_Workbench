---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Coordination hand-back
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/carry/SKILL.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Coordination hand-back: a defect that made the owner do an agent's work

A Coordination hand-back is a point during an assigned run where the owner had
to supply something that was not a preference, tradeoff, authorization, or
unavailable resource under `AGENTS.md`'s governing gate: a settled decision
repeated, evidence already in the project located for the agent, a routine
technical finding reconciled, or an already-authorized step prompted. The
canonical definition is the [glossary entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** It is a defect in a record, route, skill, or tool, recorded per occurrence with its cause and smallest correction in the assigned spec's evidence log by [`carry`](../skills/carry/SKILL.md). Answering a genuine owner decision is not one, and neither is a new framework built in response to one. `AGENTS.md` Safety And Change Control owns when an owner is asked; these four reasons restate that gate and never widen it ([S-049](../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md)).

**Neighbouring words.** It is a cost paid by the [Owner](dictionary-owner.md)
during a [Role](dictionary-role.md)'s assigned run, usually a
[Worker](dictionary-worker.md)'s or a [Dispatcher](dictionary-dispatcher.md)'s.
A genuine owner decision, such as [Confirm](dictionary-confirm.md) or
[Approve](dictionary-approve.md), is not one.

**In use.** If a Worker asked the owner which branch to target when its Task
record already named it, that question would be a coordination hand-back:
`carry` records it in the Spec's evidence log with its cause, a record the agent
did not read, and the smallest correction, rather than treating the answer as
new direction.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [The `carry` skill, recording each hand-back](../skills/carry/SKILL.md#5-record-each-hand-back): how one is recorded.
- [Assignment Ownership And Coordination Record (S-049)](../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md): the owning Spec.
- [AGENTS.md, Safety And Change Control](../../AGENTS.md#safety-and-change-control): when the owner is asked.
