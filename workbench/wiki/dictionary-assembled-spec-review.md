---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Assembled-Spec review
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/skills/dispatcher/SKILL.md
last_verified: 2026-10-07
---

# Assembled-Spec review: verifying the whole Spec before integration

Assembled-Spec review is destination-level verification of the complete Task
results: the Dispatcher owns whole-Spec QA and a separate Director reviews the
immutable assembled candidate before integration. The canonical definition is
the [glossary entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** Worker self-check is not independent approval. A failed review is corrected under the still-open Spec: each finding continues its Task with an adjusted handoff, or opens a new Task only when the fix rewrites it, keeping earlier Task proof as written; the fresh assembled candidate needs review. [AGENTS](../../AGENTS.md#assembled-review-and-corrective-return) owns the obligation.

**Neighbouring words.** It is the [Review](dictionary-review.md) verb applied to
a [Spec](dictionary-spec.md), an [Automated
review](dictionary-automated-review.md) by an agent that built none of it. The
[Dispatcher](dictionary-dispatcher.md) and [Director](dictionary-director.md)
share it; the [Worker](dictionary-worker.md)'s [QA](dictionary-qa.md) comes
before it, and the owner's [Human QA](dictionary-human-qa.md) after it.

**In use.** When the Tasks of S-004O have merged into its assembly branch, the
Dispatcher runs whole-Spec QA on the assembled candidate, and a separate context
that built none of it reviews that immutable candidate and records its verdict
with `spec-workbench.mjs verdict` before the Spec's pull request into
`integration`.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [AGENTS.md, Assembled Review And Corrective Return](../../AGENTS.md#assembled-review-and-corrective-return): the obligation.
- [The two QA gates decision (ADR-000F)](../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md): Dispatcher QA and separate Director review.
- [The review ladder decision (DDR-001B)](../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md): a Spec is reviewed by an agent that did not build it.
- [The `dispatcher` skill, assembled review](../skills/dispatcher/SKILL.md#dispatcher-and-separate-director-assembled-review): the procedure.
