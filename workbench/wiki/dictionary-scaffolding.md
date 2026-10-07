---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Scaffolding
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md
  - workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md
last_verified: 2026-10-07
---

# Scaffolding: what is built to reach a destination and then cleared

Scaffolding is the architecture artifacts used to reach a destination (Specs,
Tasks, landmarks, handoffs and notepads), cleared away once their knowledge is
kept. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** The architecture artifacts taken together; an Architecture artifact is one of them, so the two words are one concept seen as a whole and as a single artifact, not two meanings. The owner: "transient has been the other word I have been using", so transient is an accepted alternative word. It is cleared away at Clean Up once its knowledge, unfinished obligations and needed evidence have reached their durable owners ([the scaffolding decision](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)); the Retired entry is the staging place for reconciled Spec and Task scaffolding.

**Neighbouring words.** Each piece is an [Architecture
artifact](dictionary-architecture-artifact.md); the
[Landmark](dictionary-landmark.md), [Spec](dictionary-spec.md) and
[Task](dictionary-task.md) are the most common. [Clean
Up](dictionary-clean-up.md) is the verb that clears it, and
[Retired](dictionary-retired.md) is where reconciled Spec and Task scaffolding
waits. It is the opposite of a durable [Routing
artifact](dictionary-routing-artifact.md) or [Contract
artifact](dictionary-contract-artifact.md).

**In use.** The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O) is
scaffolding: once its Tasks have put the Lexicon's meanings in `GLOSSARY.md`,
`ARCHITECTURE.md` and these Wiki articles and the Spec is complete, its
knowledge lives in those owners, and the Spec folder is retired with
`spec-workbench.mjs retire-spec` and later discarded.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The scaffolding decision (DDR-000M)](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md): cleared once its knowledge is kept.
- [The record lifecycle decision (ADR-000I)](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md): the transient retired staging area.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): scaffolding needs only confirmed enduring context.
