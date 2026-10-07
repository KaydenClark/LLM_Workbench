---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: QA
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# QA: the building agent judging its own work

QA, as a workflow verb, is the building agent's self-judgement of its own
Task: does the work actually do what the Task asked, beyond what Check can
prove? The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The owner: "the QA is a self judgement check on the work." It comes after Check and before Submit. It is not Human QA, the owner's evaluation of delivered work, and not a Review, which is another agent's judgement.

**Neighbouring words.** It is the third verb of the
[Journey](dictionary-journey.md), after [Check](dictionary-check.md) and
before [Submit](dictionary-submit.md). Because the builder makes it, it is
never an [automated review](dictionary-automated-review.md); the
[Review](dictionary-review.md) of the assembled Spec comes later from another
agent. Human QA is the owner's evaluation of delivered work, which ends in
[Approve](dictionary-approve.md) or a send-back.

**In use.** Before submitting, a Worker reads its Task's destination and
acceptance against its own diff and asks whether every acceptance line is met,
not merely whether the tests pass; what it finds goes into the second merge
answer: did this complete the Task, or is more needed?

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review): QA in the Task's Journey.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the 2026-10-05 Journey amendment.
