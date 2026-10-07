---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workflow verb
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/wiki/design-concepts/workflow-verbs.md
last_verified: 2026-10-07
---

# Workflow verb: one defined action workflows are built from

A workflow verb is a defined action or process that workflows are composed
from, and that people use in ordinary speech: "align on it", "map it", "submit
it". Each verb gets its own glossary entry and its own Wiki entry. The
canonical definition is the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The owner's words: "A workflow verb is an defined action/process that we can use to create workflows and actually use in regular language. And yes, one row per verb". A verb's entry defines a meaning; it changes no command, status, folder or gate.

**Neighbouring words.** Verbs compose into a [Workflow](dictionary-workflow.md).
Idea, Align, Confirm, Map, Plan, Implement, Review and Verify were the first
standardization; Prototype, Check, QA, Submit, Journey, Approve, Delivered and
Clean Up have been defined since. [Journey](dictionary-journey.md) is a verb
too, but only the loop-level name. The [Writer verb](dictionary-writer-verb.md)
of a claim is the verb at which it is written.

**In use.** Adding a verb means defining its meaning in the glossary and
explaining it in a Wiki entry like this one; it does not rename a command,
status, folder or gate. The `complete` command kept its name when Delivered
replaced Complete as the verb.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the first standardization and the open set.
- [The Workflow Verbs](design-concepts/workflow-verbs.md): the verbs and the loop.
- [Workbench Term Dictionary Pages (S-004K)](../specs/S-004K-workbench-term-dictionary-pages/SPEC.md): one long Wiki entry per Workbench term, starting with the verbs.
