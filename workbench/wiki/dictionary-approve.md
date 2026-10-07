---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Approve
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
last_verified: 2026-10-07
---

# Approve: the owner's judgment that delivered work is viable

Approve is the owner's Human QA judgment that the delivered result is viable;
the alternative is sending it back. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The `approve` command records that judgment against integration content; Human QA is the owner-led evaluation that leads to it. Sending it back returns to Align and delivery at the implicated scope, as the Human QA entry says. Only the owner approves, and an
approval is recorded only for the owner's actual approval; an agent never
records one on the owner's behalf.

**Neighbouring words.** It follows [Verify](dictionary-verify.md) and comes
before [Delivered](dictionary-delivered.md). It is not
[Confirm](dictionary-confirm.md), the owner's earlier agreement to a concept's
readback, and not [QA](dictionary-qa.md), the building agent's own judgement.
A send-back returns to [Align](dictionary-align.md). It has no plane assigned
([Writer verb](dictionary-writer-verb.md)).

**In use.** The owner tries the integrated work, then either runs
`spec-workbench.mjs approve S-###` for it or records a finding with
`--finding TEXT`, which follows the corrective rule: the same Task continues,
or a new one is opened when the fix rewrites it.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Owner Closure And Reconciliation](../../AGENTS.md#owner-closure-and-reconciliation): only the owner approves.
- [The two QA gates decision (ADR-000F)](../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md): integration to main passes the owner's gate.
