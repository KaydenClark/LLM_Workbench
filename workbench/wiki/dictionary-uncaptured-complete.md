---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Uncaptured complete
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - RUNBOOK.md
  - workbench/tools/diagnostics.mjs
last_verified: 2026-10-07
---

# Uncaptured complete: a complete Spec whose knowledge is not yet captured

Uncaptured complete names a complete Spec with missing features capture,
reported as `uncaptured-complete` while completion remains unchanged. The
canonical definition is the [glossary entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** It cannot yet retire or discard; the next step is authored validated feature knowledge, not a capture command or a new owner approval ([Runbook](../../RUNBOOK.md#spec-lifecycle-and-retrieval)).

**Neighbouring words.** It is a complete [Spec](dictionary-spec.md) still
missing its [Feature article](dictionary-feature-article.md), so it cannot move
to [Retired](dictionary-retired.md) or reach [Clean Up](dictionary-clean-up.md).
The work is [Delivered](dictionary-delivered.md); only the knowledge capture is
outstanding.

**In use.** `spec-workbench.mjs doctor` reports `uncaptured-complete` as an
attention finding for a Spec completed with main-verified closure that has no
features article naming its route. Writing that article in
`workbench/wiki/features/` clears it, and the Spec stays complete throughout.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [RUNBOOK.md, Spec Lifecycle And Retrieval](../../RUNBOOK.md#spec-lifecycle-and-retrieval): where capture sits.
- [The `director` skill, feature capture, retirement and recovery](../skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery): the capture procedure.
- [The record lifecycle decision (ADR-000I)](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md): capture precedes cleanup.
