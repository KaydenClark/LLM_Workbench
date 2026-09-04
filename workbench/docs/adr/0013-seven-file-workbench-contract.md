---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0013 (accepted 2026-09-03)
canonicalized_in:
  - BLUEPRINT.md
  - LEXICON.md
---

# The portable Workbench has seven root files

The portable root surface comprises `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md`, `TASKBOARD.md`, `CLAUDE.md`, and `README.md`. Including the Lexicon in the root discovery surface gives a fresh agent the shared vocabulary without relying on host-specific context.

Consequences: no eighth coequal root control is added; support records live behind the declared `workbench/` directory. [ADR-0033](0033-workbench-contract-is-a-claim-set.md) defines the Workbench Contract these files carry.

Provenance: faithful sanitized port of a private-workspace decision.
