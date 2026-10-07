---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Architecture artifact
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Architecture artifact: one piece of the scaffolding

An Architecture artifact is an artifact built to reach a destination and cleared
away once its knowledge is kept: landmarks, Specs, Tasks, handoffs and notepads.
Also called scaffolding, or transient. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** One of the artifacts that Scaffolding names together. It is neither a Contract artifact nor a Routing artifact: nothing in it is durable once reconciled, and the Retired entry holds Spec and Task scaffolding that has been reconciled.

**Neighbouring words.** [Scaffolding](dictionary-scaffolding.md) names them
together. A [Landmark](dictionary-landmark.md), a [Spec](dictionary-spec.md) and
a [Task](dictionary-task.md) are architecture artifacts; [Clean
Up](dictionary-clean-up.md) clears them, and [Retired](dictionary-retired.md) is
the staging place for reconciled Specs and Tasks. Because they are transient,
they need confirmed enduring context behind them rather than the whole workflow
([Writer verb](dictionary-writer-verb.md)).

**In use.** The folder
`workbench/specs/S-004O-lexicon-retirement-and-architecture-md/`, with its
`tasks/` and `proof/`, is a set of architecture artifacts: the landing inventory
in its `proof/` maps every Lexicon line to a home for this Spec's delivery and
is cleared away with the Spec once its knowledge is kept.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The scaffolding decision (DDR-000M)](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md): working artifacts are scaffolding.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): architecture artifacts need only confirmed enduring context.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): landmarks, Specs and Tasks.
