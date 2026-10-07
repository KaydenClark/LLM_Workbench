---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LLM Workbench template wiki: the glossary's Continuity terms grouping explained
source_paths:
  - GLOSSARY.md
last_verified: [YYYY-MM-DD]
---

# Continuity terms: the vocabulary explained

These words name the records that carry working context from one Chat or agent to the next, and the identifiers that name artifacts.

The [glossary](../../GLOSSARY.md#continuity-terms) owns each definition; this article explains how each word differs from its neighbours. It authorizes nothing.

## Notepad

It is not Canon or permanent history; preserve important material until reconciled. A note belongs to its objective, not to the Chat, model or host that created it, and every context that can reach it resumes it, one writer at a time. One objective may use several linked notes for distinct purposes.

Definition: [GLOSSARY.md, Continuity terms](../../GLOSSARY.md#continuity-terms).

## Scoped handoff

The owner or an agent working within its role may initiate the transfer. It is Markdown because agents pick it up, read and edit it; JSON is for state and tooling. A recipient may read the file or receive its content in a new chat; a pointer requires accessible, retained data. [RUNBOOK](../../RUNBOOK.md#handoff-transfer) owns preparation and transfer.

Definition: [GLOSSARY.md, Continuity terms](../../GLOSSARY.md#continuity-terms).

## WBID

Unique within the type and Workbench, not globally; no parallel secondary ID. Every spelling of one identity (short, widened or case variant, compared case-folded without leading zeros) is one WBID, reserved once and resolved to the one record. Existing numeric, short and mixed-case labels and their paths remain readable; an open Spec or Task widens only through the explicit `widen-id` touch, which keeps its former ID. Historical numeric slice identifiers remain spec-qualified, while new letter-bearing ones reserve the whole Workbench inventory. Workbench connection identities keep their separate base-62 format.

Definition: [GLOSSARY.md, Continuity terms](../../GLOSSARY.md#continuity-terms).
