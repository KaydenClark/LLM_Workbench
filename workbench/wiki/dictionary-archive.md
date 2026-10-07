---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Archive
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md
  - workbench/docs/adr/REGISTER.md
  - workbench/docs/ddr/REGISTER.md
last_verified: 2026-10-07
---

# Archive: permanent storage for superseded decision records

The Archive is permanent storage for superseded and deprecated decision records
(ADRs and DDRs), preserving their original bodies and reachable decision
history. The canonical definition is the [glossary
entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** It is never cleared by transient Spec/Task cleanup; each decision-record register routes active decisions and its history routes retained alternatives ([ADR-000I](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md)).

**Neighbouring words.** It is not [Retired](dictionary-retired.md), which is
transient and holds Specs and Tasks, and [Clean Up](dictionary-clean-up.md)
never clears it. The [ADR](dictionary-adr.md), [DDR](dictionary-ddr.md) and [Decision Record](dictionary-decision-record.md) terms it serves have their own
glossary entries.

**In use.** `workbench/docs/adr/archive/` keeps superseded ADRs such as
`0013-seven-file-workbench-contract.md` with their original bodies, and
`workbench/docs/ddr/archive/` does the same for DDRs. The ADR
[register](../docs/adr/REGISTER.md) routes the active decisions and the ADR
[history](../docs/adr/HISTORY.md) the retained alternatives.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The record lifecycle decision (ADR-000I)](../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md): the permanent archive.
- [The ADR register](../docs/adr/REGISTER.md) and [the DDR register](../docs/ddr/REGISTER.md): the active decisions.
