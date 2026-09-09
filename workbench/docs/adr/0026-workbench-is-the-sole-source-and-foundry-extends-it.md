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

## v3.2.0 reconciliation (2026-09-08)

Public source excludes private instance state. Source development, downstream deployment and independent audit have distinct roles; deployment names are local examples, not mandatory base machinery. See [ADR-0047](0047-preservation-contracts-for-genesis-adoption-and-upgrade.md).

## Preserved illustrative responsibility boundaries

The former Blueprint used these named examples to explain separated ownership.
They are retained here as design context; these names are not required machinery
and this record assigns no portfolio work or permission to another repository.

| Participant example | Responsibility | Boundary |
|---|---|---|
| LLM_Workbench | Canonical templates, portable tools and skills, upgrade procedure, verified version candidates | No portfolio target selection or downstream deployment |
| GPT_OS | Authorized target selection, deployment, rollout tracking and recovery | No canonical harness source or project product decisions |
| Audit_Workbench | HFR audit, cross-project evidence and upstream summary reports | No harness implementation or deployment |
| Each project | Its product, filled controls, local work/evidence and truthful HFR | No upstream template policy or portfolio orchestration |

Source: the source-pinned [Blueprint claim disposition](../../specs/S-00A-blueprint-active-adr-and-context-map/blueprint-claim-disposition.json),
root-029. The v3.2 assignment excludes portfolio automation and unnamed room updates.
