---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Delivered
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Delivered: approved work on main

Delivered is the verb for the end of delivery: the owner's approved work is on
main and the concept is delivered. The verb is Delivered, not Complete. The
canonical definition is the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The owner: "Let's change this to Delivered", and "It would be complete. we have to say delivered to define it." The `complete` command and status keep their names. Two nearby uses are earlier and different: the `S-###:delivered` blocker qualifier is satisfied by a reviewed PASS contained in integration, and `AGENTS.md` calls that stage reviewed delivery on integration; both come before owner approval and main. Renaming the qualifier changes a public contract and is the owner's call.

**Neighbouring words.** It follows [Approve](dictionary-approve.md) and comes
before [Clean Up](dictionary-clean-up.md). It is the last step of the
[Workflow](dictionary-workflow.md) that says the concept reached its
destination; Clean Up only clears the scaffolding afterwards. It has no plane
assigned ([Writer verb](dictionary-writer-verb.md)).

**In use.** "S-004O is delivered" means the owner approved its integrated
result and promoted it to main. A blocker written `S-004O:delivered` on another
Spec is the earlier, narrower meaning: it is satisfied once the reviewed PASS
is contained in integration, before any owner approval.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Owner Closure And Reconciliation](../../AGENTS.md#owner-closure-and-reconciliation): the closure sequence ending in `complete`.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the delivery workflow.
