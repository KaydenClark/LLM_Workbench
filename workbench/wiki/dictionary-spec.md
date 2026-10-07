---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Spec
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
last_verified: 2026-10-07
---

# Spec: a scoped objective with its own destination

A Spec is a PRD-shaped scoped objective with its own destination, derived from
Blueprint needs, active ADRs, verified Actuality and required evidence. It owns
requirements, decisions, acceptance, verification, evidence and completion while
needed for delivery. The canonical definition is the [glossary
entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** A Spec has at most one parent landmark and otherwise sits under the Blueprint; it is a smaller destination inside its landmark's and never works toward two ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). A Spec has many Tasks and Chats. Tasks reach its destination; useful knowledge moves to maintained durable owners after verified delivery. TASK.md owns each active Task state and proof; the Spec holds capability state and gates. Record-backed Tasks live under `tasks/`; table-backed compatibility and completed tables remain readable history. See [ADR-000G](../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md).

**Neighbouring words.** It sits under a [Landmark](dictionary-landmark.md) or
the [Blueprint](dictionary-blueprint.md) and is the smaller scale of
[Map](dictionary-map.md); its [Tasks](dictionary-task.md) are the steps. The
[Dispatcher](dictionary-dispatcher.md) coordinates it, an [Assembled-Spec
review](dictionary-assembled-spec-review.md) checks it, and once delivered its
[Feature article](dictionary-feature-article.md) keeps the knowledge and it
moves to [Retired](dictionary-retired.md).

**In use.** This article was written under the Lexicon Retirement And
ARCHITECTURE.md Spec (S-004O): its `SPEC.md` holds the outcome, the decisions it
links, the acceptance criteria and an append-only evidence log, and its `tasks/`
folder holds one `TASK.md` per Task. Once delivered, its knowledge lives in
`GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki, and the Spec retires.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The three altitudes decision (ADR-000G)](../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md): Blueprint, Spec and Task.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): at most one parent landmark.
- [Delivery altitudes](design-concepts/delivery-altitudes.md): the design concept.
- [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md): the Spec used as the example.
