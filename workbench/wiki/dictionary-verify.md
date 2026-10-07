---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Verify
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Verify: confirming the work once it is integrated and reviewed

Verify is confirming the work once it has merged to integration and passed
Review. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** A failed Review goes back to Map, Plan and Journey before the work can be verified. `AGENTS.md`'s closure sequence also has a verification on main, after owner approval; this entry gives the verb's own meaning and changes neither.

**Neighbouring words.** It follows [Review](dictionary-review.md) and comes
before the owner's [Approve](dictionary-approve.md) and
[Delivered](dictionary-delivered.md). Like Review it writes Grounding, and
nothing more than saying so when everything is good
([Writer verb](dictionary-writer-verb.md)). It is not
[Check](dictionary-check.md), which runs on a Task inside the
[Journey](dictionary-journey.md).

**In use.** For example, after a reviewed Spec merges into `integration`, Verify runs the
targeted checks and the full suite on the integrated tip and confirms the
Spec's acceptance holds there, so the owner's Human QA starts from work that
is known to be in place.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Owner Closure And Reconciliation](../../AGENTS.md#owner-closure-and-reconciliation): the closure sequence and its verification on main.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Verify and Review write Grounding.
