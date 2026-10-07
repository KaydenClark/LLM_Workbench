---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: WBID
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/tools/visible-ids.mjs
  - workbench/tools/spec-workbench.mjs
last_verified: 2026-10-07
---

# WBID: an artifact's visible identifier

A WBID is the identifier a reader sees on a Workbench artifact: its type prefix, such as `S-`, `TK-`, `ADR-` or `DDR-`, followed by a value that replaced the old number. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-terms).

The fuller definition: new Spec, Task, ADR and notepad values use uppercase `0-9A-Z`, minimum width four, with at least one letter.

**What it means here.** Unique within the type and Workbench, not globally; no parallel secondary ID. Every spelling of one identity (short, widened or case variant, compared case-folded without leading zeros) is one WBID, reserved once and resolved to the one record. Existing numeric, short and mixed-case labels and their paths remain readable; an open Spec or Task widens only through the explicit `widen-id` touch, which keeps its former ID. Historical numeric slice identifiers remain spec-qualified, while new letter-bearing ones reserve the whole Workbench inventory. Workbench connection identities keep their separate base-62 format.

**Neighbouring words.** The [Workbench connection identity](dictionary-workbench-connection-identity.md) is a different, base-62 namespace for private session transport. A WBID names a Spec, a Task, an [ADR](dictionary-adr.md), a [DDR](dictionary-ddr.md) or a [Notepad](dictionary-notepad.md); the Wiki schema asks that a page never cite one without the artifact's name and a little context.

**In use.** This Spec is `S-004O` and this Task `TK-009J`; the Lexicon retirement decision is `DDR-001E`. Because spellings are compared case-folded and without leading zeros, `S-0030` would be the same WBID as the existing Permission Scope Matches Lanes Spec, `S-030`, so a width-four value in that range is never allocated. `node workbench/tools/spec-workbench.mjs widen-id S-###` widens an open Spec explicitly and keeps its former ID.

## Sources

- [GLOSSARY.md, Continuity terms](../../GLOSSARY.md#continuity-terms): the canonical definition.
- [Visible Workbench Identifiers](features/visible-workbench-identifiers.md): the feature article, with the width-four amendment.
- [Uppercase Width-Four Workbench Artifact IDs (S-01W)](../specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md): the Spec that delivered the current form.
- [RUNBOOK.md, Visible Identifiers](../../RUNBOOK.md#visible-identifiers): allocation and widening.
