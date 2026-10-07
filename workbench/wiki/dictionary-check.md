---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Check
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Check: deterministic verification in the environment

Check is the second verb of the Journey: the deterministic verifications the
building agent runs in the environment on its own Task, such as tests, builds,
lints and diagnostics. A check passes or fails the same way every time it runs
on the same input. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The owner: "Check's are deterministic verifications that runs in the environment." It is an Automated check, with no judgement in it; QA follows. Worker self-check names Check and QA together from the Worker's side.

**Neighbouring words.** It follows [Implement](dictionary-implement.md) and
comes before [QA](dictionary-qa.md) and [Submit](dictionary-submit.md) inside
the [Journey](dictionary-journey.md). It is an automated check, never an
[automated review](dictionary-automated-review.md): a review is a judgement and
can miss what a check would catch, and a check cannot judge what a review can.
It has no plane assigned ([Writer verb](dictionary-writer-verb.md)). One
passing run proves what it ran and no more
([non-determinism](dictionary-non-determinism.md)).

**In use.** For a Workbench Task, Check is the red test committed before the
fix, the targeted tests, `node workbench/tools/spec-workbench.mjs doctor` and
the Runbook's full verification suite on the committed candidate. Its results
go into the first merge answer the Task submits.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review): Check in the Task's Journey.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the 2026-10-05 Journey amendment.
