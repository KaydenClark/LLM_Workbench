---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Retired
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md
  - workbench/skills/director/SKILL.md
last_verified: 2026-10-07
---

# Retired: the staging place for reconciled Specs and Tasks

Retired is a transient staging location for reconciled Spec and Task
scaffolding, removed from ordinary pickup while needed history remains
reachable. The canonical definition is the [glossary
entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** Its useful content reaches durable owners; discard requires closure/capture, verified main containment, clean current-reference checks and recovery identity. Task progress remains distinct from folder lifecycle ([ADR-000I](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md)).

**Neighbouring words.** It holds [Scaffolding](dictionary-scaffolding.md) on its
way out at [Clean Up](dictionary-clean-up.md). A Spec reaches it after its
[Feature article](dictionary-feature-article.md) is written; an [Uncaptured
complete](dictionary-uncaptured-complete.md) Spec cannot. It is not the
permanent [Archive](dictionary-archive.md) for decision records.

**In use.** `workbench/specs/retired/` holds Specs whose knowledge has reached
its owners, such as `S-00H-task-artifact-and-terminology-migration`;
`spec-workbench.mjs next` no longer offers them, and `discard` removes one only
after the checks above pass.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The record lifecycle decision (ADR-000I)](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md): transient retired, permanent archive.
- [The `director` skill, feature capture, retirement and recovery](../skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery): the procedure.
