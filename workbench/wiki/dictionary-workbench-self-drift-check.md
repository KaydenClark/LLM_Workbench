---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workbench self-drift check
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/0055-workbench-update-requires-self-drift-check.md
  - workbench/specs/S-00K-workbench-self-drift-check/SPEC.md
last_verified: 2026-10-07
---

# Workbench self-drift check: checking the Workbench's own current-facing artifacts

The Workbench self-drift check is a read-only check of the canonical Workbench's
own current-facing artifacts before and after a Workbench update. The canonical
definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** It is separate from a target project's drift check; structural render, doctor, or tests alone do not establish semantic freshness.

**Neighbouring words.** It checks this producer's own artifacts, where the
[Ownership origin model](dictionary-ownership-origin-model.md) governs a room's
differences from upstream. Its structural half is an [Automated
check](dictionary-automated-check.md); the semantic half is a bounded manual
reading. It is part of what proves a [Workbench
Template](dictionary-workbench-template.md) release.

**In use.** `AGENTS.md` has an update run the read-only pre and post receipt
alongside the bounded manual semantic check, both in the
[`workbench-room-checks`
skill](../skills/workbench-room-checks/SKILL.md#workbench-self-drift-check), and
claim no clean update while known current-facing drift remains ([the self-drift
decision](../docs/adr/0055-workbench-update-requires-self-drift-check.md)).

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The self-drift decision (ADR-0055)](../docs/adr/0055-workbench-update-requires-self-drift-check.md): an update requires the check.
- [Workbench Self-Drift Check (S-00K)](../specs/S-00K-workbench-self-drift-check/SPEC.md): the owning Spec.
- [RUNBOOK.md, Workbench self-drift check](../../RUNBOOK.md#workbench-self-drift-check): where the procedure is pointed to.
