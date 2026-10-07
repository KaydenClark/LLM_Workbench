---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Journey
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/wiki/design-concepts/workflow-verbs.md
last_verified: 2026-10-07
---

# Journey: the build loop of one Task

Journey is Implement, Check, QA and Submit, run for each Task. Map and Plan
come before it; Review comes after it and decides whether another Journey is
needed. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The owner, 2026-10-05: "We are adding a self evaluation and submit step between Check and Review... the review is after the Journey is over. It is the deciding factor in if we need to start another Journey." It replaces the 2026-10-03 loop, which kept Review and Verify inside the Journey and had itself taken Map and Plan out of it; [the workflow verbs decision](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md) carries both amendments. It is the loop-level name, not a stage a card can sit at.

**Neighbouring words.** Its four verbs are [Implement](dictionary-implement.md),
[Check](dictionary-check.md), [QA](dictionary-qa.md) and
[Submit](dictionary-submit.md). [Map](dictionary-map.md) and
[Plan](dictionary-plan.md) precede it, [Review](dictionary-review.md) follows
it, and a failed Review starts another Journey. The
[Landmark Tracker](dictionary-landmark-tracker.md) still prints Journey as one
of its documentation step labels, which is why a card's assessment can name
it.

**In use.** Each Task in the Lexicon Retirement And ARCHITECTURE.md Spec (S-004O) runs its own Journey: the Worker implements
on its branch, runs the checks, judges the result against the Task and submits
a pull request with its merge answers. A Task rebased onto a moved branch runs
its Journey again and gets no Review of its own.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review): the Task's Journey.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): both amendments.
- [The Workflow Verbs](design-concepts/workflow-verbs.md): the loop and its history.
