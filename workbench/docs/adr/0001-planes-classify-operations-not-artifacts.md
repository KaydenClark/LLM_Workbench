---
date: 2026-09-04
ported_from: GPT_OS ADR-0001 (accepted 2026-09-03)
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
---

# Governance Planes classify roles in an operation

A Governance Plane classifies the role a claim or artifact plays in one operation: the target is Actuality, the authorizing rule is Canon, the evidence is Grounding, the durable reference is Enduring Context, the request is Intent, and the report is Projection. The same file can play different roles in different operations, so a broken rule file can be the target of an authorized repair without its contents authorizing themselves.

The Objective's target sets the perspective. When LLM_Workbench's objective targets the template Workbench, the template is Actuality; LLM_Workbench's destination claims about it are Canon, and its other confirmed knowledge that is not an instruction is Grounding or Enduring Context. A change that targets the template updates that Canon, Grounding and Enduring Context first, then the template artifacts. The owner refined the decision this way on 2026-10-07 because what is Actuality and what is not is what matters: LLM_Workbench's documents describe what the template is, what it does and how, so they lead.

Consequences: no directory, file type, or frontmatter stamp assigns a permanent plane. [ADR-0025](archive/0025-planes-classify-claims-not-whole-artifacts.md) narrows the unit of classification from the artifact to the claim.

Provenance: faithful sanitized port of a private-workspace decision; the originating notepad is not part of this repository.
