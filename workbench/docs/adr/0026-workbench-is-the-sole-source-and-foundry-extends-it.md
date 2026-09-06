---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0022 boot boundaries, with its producer conflict resolved rather than repeated
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
---

# LLM Workbench is the sole Workbench source; Foundry is a downstream extension

`KaydenClark/LLM_Workbench` is the only source and release repository for the Workbench. Downstream deployments and the Foundry adopt released Workbench versions; Foundry adds sockets, modules, cross-Workbench coordination, scheduling, monitoring, and lifecycle machinery on top of a released Workbench and never becomes its source, copy target, tool runtime, or prerequisite. Three boots must work from the nearest root `AGENTS.md`: a fresh root, a Workbench nested inside a larger room, and a standalone Workbench with no ambient deployment.

Considered and rejected: converging the newer Workbench source into an embedded producer inside the private deployment. That would have made an unfinished coordination layer the source of the kernel it depends on, reproducing the bootstrap cycle v3.1 exists to break.

Consequences: a nested Workbench inherits only the outer room's declared safety boundaries and then applies the nearest local contract; connected coordination systems are peers, not parents. Any downstream Canon that still names an embedded producer must be amended by that downstream as a visible change of its own.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.
