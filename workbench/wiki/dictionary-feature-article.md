---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Feature article
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/wiki/features/README.md
  - workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md
last_verified: 2026-10-07
---

# Feature article: the Wiki page for one delivered capability

A Feature article is the entity page for one delivered capability, in the
manifest-declared `features` collection, written at Spec completion and before
retirement/discard. The canonical definition is the [glossary
entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** It explains the delivered product and names its historical Spec route without copying active Task state; the Wiki schema and Runbook own its shape and capture procedure ([Wiki features](features/README.md)).

**Neighbouring words.** It keeps what a delivered [Spec](dictionary-spec.md)
taught after the Spec moves to [Retired](dictionary-retired.md); a complete Spec
without one is [Uncaptured complete](dictionary-uncaptured-complete.md). A
reached landmark has its [Landmark Wiki page](dictionary-landmark-wiki-page.md)
instead.

**In use.** [The JSON notepad foundation](features/json-notepad-foundation.md)
explains the delivered JSON notepads and names the Spec that delivered them as
its historical route, so a reader asking how notepads work starts there rather
than in the Spec's evidence log.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [Wiki features](features/README.md): the collection and its shape.
- [The record lifecycle decision (ADR-000I)](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md): capture precedes retirement.
- [The `director` skill, feature capture, retirement and recovery](../skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery): the capture procedure.
