---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0001 and ADR-0008 lineage; ADR-0008's categorical classification was not ported
supersedes: the categorical rule that accepted ADRs and specs "serve as Grounding"
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
---

# Governance Planes classify claims and their use, not whole artifacts

A Governance Plane is assigned to an individual claim as it is used in one operation, never to an entire file, directory, or artifact type. One assigned spec can carry bounded capability Canon in its accepted requirements, Projection in its ticket status and next gate, Grounding in its evidence log, and Enduring Context in its history, while the file itself is Actuality when it is being edited. An ADR's rationale is Grounding; the rule it records becomes Canon only where a current control carries it.

Considered and rejected: the categorical statement that ADRs and specs are Grounding. It was simple, but it forced every accepted requirement in an assigned spec to be read as evidence rather than as the bounded instruction the lifecycle relies on, and it invited the opposite error of reading a whole ADR as binding.

Consequences: `LEXICON.md` defines the six planes at claim level; `AGENTS.md` names which claims of the assigned spec act as bounded Canon and forbids a spec from enlarging the user's request, platform safety, or `AGENTS.md` scope. Unassigned specs remain evidence.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.
