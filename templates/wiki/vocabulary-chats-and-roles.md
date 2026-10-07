---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LLM Workbench template wiki: the glossary's Chats and roles grouping explained
source_paths:
  - GLOSSARY.md
last_verified: [YYYY-MM-DD]
---

# Chats and roles: the vocabulary explained

These words name the working contexts agents run in and the scopes of responsibility they are assigned.

The [glossary](../../GLOSSARY.md#chats-and-roles) owns each definition; this article explains how each word differs from its neighbours. It authorizes nothing.

## Chat

A Chat is not a Task, assignment, durable record, or authority boundary, and it never works several Tasks. It is not a session either: a session is one run of the context window inside it (Session). Directing, review and grilling Chats work no Task. Several related Chats may belong to one Thread.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Conversation

It is ordinary descriptive language, not another artifact or workflow level; durable state must still reach its owning project record.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Thread

It groups conversational continuity only. It does not replace a Spec, Task dependency, notepad, handoff, or project work owner.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Role

Director covers the project/integration, Dispatcher its Spec/branch, and Worker its Task. Branches express work scope; the request and `AGENTS.md` still establish permission. Delegation through handoffs within a role follows [AGENTS](../../AGENTS.md#handoff-assignments-and-shared-context).

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Director

It oversees independent review before integration and escalates owner choices. The owner remains the human above the Director; Human QA and main promotion remain owner acts. It never executes a Task or acquires authority merely by occupying a branch.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Dispatcher

It uses an assigned Spec Planner, Spec Manager, Reviewer or Auditor stance for the job within that scope. It does not take responsibility for neighboring Specs or independently approve its own assembled candidate. The broader direct-Blueprint-Task design remains separately owned; this minimum role buildout is Spec-bound.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Worker

The assigned job can be implementation or Task-authoring assistance. A working Chat performs at most one Task; no new per-Task approval ceremony is implied. Shared Spec state retains one durable writer; a Worker cannot independently approve a candidate it implemented.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).

## Coordination hand-back

It is a defect in a record, route, skill, or tool, recorded per occurrence with its cause and smallest correction in the assigned spec's evidence log by the `carry` skill. Answering a genuine owner decision is not one, and neither is a new framework built in response to one. `AGENTS.md` Safety And Change Control owns when an owner is asked; these four reasons restate that gate and never widen it.

Definition: [GLOSSARY.md, Chats and roles](../../GLOSSARY.md#chats-and-roles).
