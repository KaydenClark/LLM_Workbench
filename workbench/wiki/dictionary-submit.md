---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Submit
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Submit: handing a Task back with its merge answers

Submit is handing a Task back through its merge request into its parent
branch, carrying two merge answers: can this merge into the branch it targets,
and did it complete the Task, or is a new one needed? The canonical definition
is the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The last verb of the Journey for that Task. The Spec's Dispatcher, Director or next agent validates the answers and merges when the merge is green; a Task gets no Review ([the rule](../../AGENTS.md#task-merge-answers-and-verify-review)).

**Neighbouring words.** It closes the [Journey](dictionary-journey.md), after
[Implement](dictionary-implement.md), [Check](dictionary-check.md) and
[QA](dictionary-qa.md). Check results answer the first question and QA the
second. The [Review](dictionary-review.md) that follows judges the whole
destination, never the single Task.

**In use.** A Worker on the Lexicon Retirement And ARCHITECTURE.md Spec (S-004O) submits by opening a pull request from its
Task branch into the Spec's assembly branch; the body gives the base and head
commits, the checks run and their results, the conflict state and what was not
verified, then says whether the Task is complete. The Dispatcher checks those
answers against the diff and merges when they hold.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review): the rule and the two answers.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the 2026-10-05 Journey amendment.
