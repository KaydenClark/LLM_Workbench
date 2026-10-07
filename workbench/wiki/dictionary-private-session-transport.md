---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Private session transport
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/tools/session-transport.mjs
last_verified: 2026-10-07
---

# Private session transport: optional sync of live working records

Private session transport is explicitly configured synchronization of selected live working records, such as notepads, through a private Git remote. It is off unless configured. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-and-evidence-boundaries).

**What it means here.** Private Git retention changes recoverability, not the record's authority or durable project ownership.

**Neighbouring words.** It is namespaced by the [Workbench connection identity](dictionary-workbench-connection-identity.md) and keeps its local state in [Operational recovery](dictionary-operational-recovery.md). A [Notepad](dictionary-notepad.md) it carries is still working context; [Direct promotion](dictionary-direct-promotion.md) is still how a claim becomes durable.

**In use.** `workbench/tools/session-transport.mjs` builds selected snapshots with Git index plumbing, never staging over the user's checkout, and project Git never receives the live records. A notepad synced this way can be resumed on another machine, but it still is not Canon.

## Sources

- [GLOSSARY.md, Continuity and evidence boundaries](../../GLOSSARY.md#continuity-and-evidence-boundaries): the canonical definition.
- [RUNBOOK.md, Optional Private Session Transport](../../RUNBOOK.md#optional-private-session-transport): the procedure.
- [Landmark: Session Transport](design-concepts/landmark-session-transport.md): promote before end, with optional private transport.
