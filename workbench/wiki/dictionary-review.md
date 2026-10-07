---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Review
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - RUNBOOK.md
  - workbench/skills/code-review/SKILL.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Review: judging a completed destination against its map

Review is the workflow verb for the judgement made after the Journey is over:
an agent that did not build the work judges a completed destination against
its Map, and decides whether another Journey is needed. The canonical
definition is the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** An Automated review; more in the [Wiki dictionary](dictionary-automated-review.md). Not Human review. Independent review of an assembled Spec at its Verify step is required by `AGENTS.md` [Git Rules](../../AGENTS.md#git-rules); the [Runbook operations index](../../RUNBOOK.md#operations-index) row for reviewing a candidate independently points to the [`code-review` skill](../skills/code-review/SKILL.md#independent-review-boundaries) that prepares, records and checks it; this entry says what counts as one. That Automated review
entry explains who reviews, how often, on whose account and why Tasks are no
longer reviewed one by one.

**Neighbouring words.** It follows the [Journey](dictionary-journey.md) and
precedes [Verify](dictionary-verify.md). A failed Review goes back to
[Map](dictionary-map.md), [Plan](dictionary-plan.md) and the Journey under the
still-open Spec. It is not [QA](dictionary-qa.md), the builder's own
judgement, nor [Check](dictionary-check.md), which has no judgement in it, nor
the owner's Human QA at [Approve](dictionary-approve.md). Review writes
Grounding, and nothing beyond saying so when the work passes
([Writer verb](dictionary-writer-verb.md)).

**In use.** When the last Task of the Lexicon Retirement And ARCHITECTURE.md Spec (S-004O) lands, a fresh context that built none
of it reads the assembled diff against the Spec's acceptance criteria and
records a verdict with `spec-workbench.mjs verdict`; a fail produces the next
Map, Plan and Journey.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review): where Review sits and what it covers.
- [The code-review skill, independent review boundaries](../skills/code-review/SKILL.md#independent-review-boundaries): how a review is prepared, recorded and checked.
- [The review ladder decision (DDR-001B)](../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md): what each scale is reviewed by.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Review after the Journey.
