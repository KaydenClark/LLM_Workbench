---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Clean Up
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md
  - workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md
last_verified: 2026-10-07
---

# Clean Up: clearing the scaffolding once its knowledge is kept

Clean Up is the last verb of the delivery workflow: clearing away the
scaffolding once its knowledge is kept. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** Scaffolding names what is cleared ([the scaffolding decision](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md)); the Retired entry is the staging place, and `retire-spec` and `discard` carry it out for Specs and Tasks. The order matters: knowledge first,
removal second. Nothing is cleared until the implementation, the maintained
documentation and the Wiki hold what the scaffolding knew.

**Neighbouring words.** It follows [Delivered](dictionary-delivered.md). What
it clears is scaffolding: Specs, Tasks, [landmarks](dictionary-landmark.md),
handoffs and notepads. A reached landmark is cleared into its
[Landmark Wiki page](dictionary-landmark-wiki-page.md), and a
[Destination Question Card](dictionary-destination-question-card.md) only after
its understanding is reconciled into durable owners. It has no plane assigned
([Writer verb](dictionary-writer-verb.md)).

**In use.** After a Spec is complete and its feature article is captured in the
Wiki, `spec-workbench.mjs retire-spec` moves it to `retired/`, and `discard`
later removes the retired Spec and its Tasks; Git keeps the history.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The scaffolding decision (DDR-000M)](../docs/ddr/000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md): what is cleared and when.
- [The record lifecycle decision (ADR-000I)](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md): retired as transient staging.
