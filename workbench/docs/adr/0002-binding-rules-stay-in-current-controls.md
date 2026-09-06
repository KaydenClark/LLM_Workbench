---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0002 (accepted 2026-09-03)
canonicalized_in:
  - AGENTS.md
  - BLUEPRINT.md
---

# Current controls carry every binding rule

Every binding current-state requirement belongs in the owning control document, with the Lexicon carrying complete definitions and the Blueprint summarizing architecture. ADRs retain rationale, alternatives, and supersession history, so execution never depends on reconstructing a decision from history.

Consequences: an accepted ADR names the control that carries its rule in `canonicalized_in`; a rule that exists only in an ADR is not yet binding.

Provenance: faithful sanitized port of a private-workspace decision.
