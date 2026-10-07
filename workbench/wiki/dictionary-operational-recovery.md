---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Operational recovery
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/sessions/.gitignore
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/session-transport.mjs
last_verified: 2026-10-07
---

# Operational recovery: local rollback material

Operational recovery is the local rollback material, receipts and backups, kept in the ignored `sessions/recovery/` collection. It is never project history. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Excluded from notepad discovery and durable provenance; existing historical recovery references remain valid.

**Neighbouring words.** It is a [Collection](dictionary-collection.md) of the `sessions` lane, separate from a [Checkpoint](dictionary-checkpoint.md) and never read as a [Notepad](dictionary-notepad.md). [Private session transport](dictionary-private-session-transport.md) keeps its local configuration and state there.

**In use.** `workbench/sessions/.gitignore` ignores `recovery/*`, and `workbench-layout.mjs` fails with `sessions-not-ignored` if recovery material or live notepads become tracked. Private session transport keeps its config, state and operation lock under `recovery/transport/`.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [RUNBOOK.md, Frozen Checkpoint History And Operational Recovery](../../RUNBOOK.md#frozen-checkpoint-history-and-operational-recovery): the procedure.
- [workbench/tools/workbench-layout.mjs](../tools/workbench-layout.mjs): the sessions ignore rules and their check.
