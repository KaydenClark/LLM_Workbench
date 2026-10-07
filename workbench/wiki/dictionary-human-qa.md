---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Human QA
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/skills/director/SKILL.md
last_verified: 2026-10-07
---

# Human QA: the owner's evaluation of delivered work

Human QA is the owner-led evaluation of delivered work, whose timing the owner
chooses at useful milestones, accumulated work, valued Specs or escalations;
failed findings remain visible until resolved. The canonical definition is the
[glossary entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** Version cadence is a default, not the sole trigger. Actual per-Spec content-bound approval is distinct from monitoring or a green suite; only the owner promotes integration to main. Failure returns to Align and delivery at the implicated scope, without assuming every defect changes design ([ADR-000F](../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)).

**Neighbouring words.** It leads to [Approve](dictionary-approve.md), the
[Owner](dictionary-owner.md)'s judgment. It is not the builder's
[QA](dictionary-qa.md), an agent's [Review](dictionary-review.md) or
[Assembled-Spec review](dictionary-assembled-spec-review.md), nor [Human
review](dictionary-human-review.md) of a change's text. A failure goes back to
[Align](dictionary-align.md).

**In use.** In this room the owner evaluates integrated work at milestones the
owner picks; a green suite or an agent's verdict is not that approval. The
owner's decision is recorded with `spec-workbench.mjs approve`, and a failed
finding stays recorded in its Spec until it is resolved.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The two QA gates decision (ADR-000F)](../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md): Human QA and main promotion.
- [The `director` skill, Human QA and main-before-complete](../skills/director/SKILL.md#owner-human-qa-and-main-before-complete): recording the decision.
- [The review ladder decision (DDR-001B)](../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md): the owner judges the concept.
