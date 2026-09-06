---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0001 (accepted 2026-09-03)
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
---

# Governance Planes classify roles in an operation

A Governance Plane classifies the role a claim or artifact plays in one operation: the target is Actuality, the authorizing rule is Canon, the evidence is Grounding, the durable reference is Enduring Context, the request is Intent, and the report is Projection. The same file can play different roles in different operations, so a broken rule file can be the target of an authorized repair without its contents authorizing themselves.

Consequences: no directory, file type, or frontmatter stamp assigns a permanent plane. [ADR-0025](0025-planes-classify-claims-not-whole-artifacts.md) narrows the unit of classification from the artifact to the claim.

Provenance: faithful sanitized port of a private-workspace decision; the originating notepad is not part of this repository.
