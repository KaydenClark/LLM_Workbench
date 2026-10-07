---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Routing artifact
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - RUNBOOK.md
  - ARCHITECTURE.md
  - workbench/docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
last_verified: 2026-10-07
---

# Routing artifact: what an agent reaches by pointer

A Routing artifact is a durable artifact an agent reaches by pointer when its
work needs it, and that routes to the detail: the Blueprint, `ARCHITECTURE.md`,
the Runbook and the README. The owner-confirmed card named the Lexicon where
`ARCHITECTURE.md` now stands. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** What the contract routes to; a context pointer is how it is reached. It is not loaded every turn, which separates it from a Contract artifact. The examples are the owner-confirmed card's; the Runbook is one and binds nothing ([the Runbook decision](../docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md)), and the Lexicon is one until it retires ([the Lexicon retirement](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).

**Neighbouring words.** The [Contract artifact](dictionary-contract-artifact.md)
routes to it, through a [Context pointer](dictionary-context-pointer.md). The
[Blueprint](dictionary-blueprint.md) is one; the [Context
Map](dictionary-context-map.md)'s entry routes live in another. Unlike an
[Architecture artifact](dictionary-architecture-artifact.md), it is durable and
is not cleared away.

**In use.** `AGENTS.md` points to the [Runbook operations
index](../../RUNBOOK.md#operations-index), whose row for delivering a Spec
routes on to the `implement`, `dispatcher` and `director` skill sections that
carry the procedure. The Runbook is read when the work needs it, not loaded
every turn, and it binds nothing by itself.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The Runbook decision (DDR-001D)](../docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md): a routing file that binds nothing.
- [The Lexicon retirement (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md): ownership routes move to `ARCHITECTURE.md`.
- [The pointer authority decision (ADR-000W)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md): carriers are briefs that point to skills.
