---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Chat
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/wiki/dictionary-session.md
  - workbench/wiki/design-concepts/task-artifact-and-lifecycle.md
last_verified: 2026-10-07
---

# Chat: one owner-visible working context

A Chat is one owner-visible working context in a host, in which participants
have a Conversation. A Chat works at most one Task: a Chat that works a Task
completes it, cleans up and ends (TT-Q1 answered by the owner 2026-09-10, TT-Q4
on 2026-09-23). The canonical definition is the [glossary
entry](../../GLOSSARY.md#chats-and-roles).

**What it means here.** A Chat is not a Task, assignment, durable record, or authority boundary, and it never works several Tasks. It is not a session either: a session is one run of the context window inside it ([Session](dictionary-session.md)). Directing, review and grilling Chats work no Task. Several related Chats may belong to one Thread.

**Neighbouring words.** Its exchange is a
[Conversation](dictionary-conversation.md); related Chats form a
[Thread](dictionary-thread.md). A [Session](dictionary-session.md) runs inside
it. A [Task](dictionary-task.md) is intended for one Chat, and a
[Worker](dictionary-worker.md) runs in one.

**In use.** The Chat that wrote this article worked one Task, TK-009I, and ends
once it hands back. The Dispatcher's Chat that assigned it works no Task, and
neither does a grilling Chat with the owner.

## Sources

- [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles): the canonical definition.
- [Session: one run of the context window](dictionary-session.md): why a Chat is not a session.
- [The Task artifact and its lifecycle](design-concepts/task-artifact-and-lifecycle.md): one Task, one context.
- [The Task decision (ADR-000H)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md): the Task as the unit of execution.
