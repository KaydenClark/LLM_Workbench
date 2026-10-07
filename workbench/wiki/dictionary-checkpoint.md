---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Checkpoint
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/sessions/checkpoints
  - workbench/tools/sessions.mjs
last_verified: 2026-10-07
---

# Checkpoint: a retained historical copy

A checkpoint is a tracked historical copy kept in `sessions/checkpoints/`. Creating new ones is retired; the existing ones stay as history. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** Preserve existing bytes and citations. New claims reconcile into their durable owners; operational recovery is separate.

**Neighbouring words.** New claims go to their owners by [Direct promotion](dictionary-direct-promotion.md), and live working context stays in a [Notepad](dictionary-notepad.md). [Operational recovery](dictionary-operational-recovery.md) is a separate, local collection. The [checkpoint skill](skill-checkpoint.md) routes a legacy request to current continuity.

**In use.** This room keeps five checkpoints from 2026-09-04 in `workbench/sessions/checkpoints/`, among them the Workbench Boundaries grilling copy. Their bytes are preserved and still cited; the `sessions.mjs` checkpoint command now refuses to create a new copy.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [Checkpoint Retirement And Direct Promotion](features/checkpoint-retirement-and-direct-promotion.md): the retirement and what replaced it.
- [The session records decision (ADR-0028)](../docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md): live records stay untracked and checkpoints are durable.
- [RUNBOOK.md, Frozen Checkpoint History And Operational Recovery](../../RUNBOOK.md#frozen-checkpoint-history-and-operational-recovery): the procedure.
