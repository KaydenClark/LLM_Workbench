---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Collection
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md
last_verified: 2026-10-07
---

# Collection: a declared, machine-used directory inside a lane

A collection is a directory inside a support lane that the manifest declares because tools use it, such as `docs/adr`, `wiki/design-concepts` or `sessions/notepads`. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

The full set: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`, `sessions/notepads`, `sessions/notepads/templates`, `sessions/recovery`, and the additive `wiki/features` and `docs/ddr`.

**What it means here.** Collection names are lowercase; local notepads may use nested type folders; a collection is never promoted to a lane because its contents differ in kind ([ADR-0018](../docs/adr/0018-the-wiki-is-the-knowledge-base.md)).

**Neighbouring words.** Collections sit inside a [Support lane](dictionary-support-lane.md). The `ddr` collection holds each [DDR](dictionary-ddr.md) and `adr` each [ADR](dictionary-adr.md); `design-concepts` holds each [Design Concept article](dictionary-design-concept-article.md); `checkpoints` holds each retained [Checkpoint](dictionary-checkpoint.md) and `recovery` is [Operational recovery](dictionary-operational-recovery.md).

**In use.** This room's manifest declares each collection by name and path, for example `"notepads": "workbench/sessions/notepads"` and `"notepad-templates": "workbench/sessions/notepads/templates"`. When destination decision records arrived they became the `ddr` collection in the `docs` lane, not a new lane.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The Wiki knowledge base decision (ADR-0018)](../docs/adr/0018-the-wiki-is-the-knowledge-base.md): collections inside lanes.
- [Portable Wiki Knowledge And Collections](features/portable-wiki-knowledge-and-collections.md): the Wiki's named collections.
