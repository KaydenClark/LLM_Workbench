---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0015 (accepted 2026-09-03)
canonicalized_in:
  - BLUEPRINT.md
---

# Workbench supplies the base and Foundry adds coordination

Workbench supplies generic project structure, vocabulary, procedures, active-work projection, durable specs, Wiki routing, provisional decisions, handoffs, feedback, and conformance. Foundry augments it with identifiers, Job Orders, lifecycle flights, claims, journals, halls, sockets, captains, scheduling, release controllers, and runtime visibility, keeping the portable base independent of those capabilities.

Consequences: no Workbench behavior may require a Foundry mechanism; ordinary owner-directed work needs none of the augmentation ([ADR-0026](0026-workbench-is-the-sole-source-and-foundry-extends-it.md)).

Provenance: faithful sanitized port of a private-workspace decision.
