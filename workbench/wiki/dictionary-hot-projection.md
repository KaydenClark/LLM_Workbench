---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Hot projection
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - TASKBOARD.md
  - ARCHITECTURE.md
last_verified: 2026-10-07
---

# Hot projection: the generated view of current work

The Hot projection is the minimal current view of active, blocked, ready, or
in-progress work generated from canonical specs. The canonical definition is the
[glossary entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** `TASKBOARD.md` is a projection, not a second tracker or proof archive.

**Neighbouring words.** It is generated from each [Spec](dictionary-spec.md) and
its [Tasks](dictionary-task.md), and shows only a signal derived from each [Task
receipt](dictionary-task-receipt.md). The [Landmark
Tracker](dictionary-landmark-tracker.md) is its counterpart for documentation
progress, and the [Frontier](dictionary-frontier.md) is the open work it
surfaces.

**In use.** `node workbench/tools/spec-workbench.mjs render` regenerates the
Active Specs table in [`TASKBOARD.md`](../../TASKBOARD.md) from the Spec and
Task records. An edit made by hand inside that generated table is overwritten on
the next render; requirements and proof are read in the Spec.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [TASKBOARD.md](../../TASKBOARD.md): the projection itself.
- [ARCHITECTURE.md, Ownership](../../ARCHITECTURE.md#ownership): the Projection and index boundary.
