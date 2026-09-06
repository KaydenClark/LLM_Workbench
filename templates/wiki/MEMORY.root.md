---
type: memory
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - Genesis of this deployment
source_paths:
  - workbench/wiki
last_verified: [YYYY-MM-DD]
---

# [DEPLOYMENT_NAME] Memory

> Generated from LLM Workbench v[HARNESS_VERSION]. This is the deployment-root
> brain for a `deployment` wiki profile: the canonical, human-editable memory
> router for the owner, the machine, and the project rooms. One deployment
> has exactly one root brain, at its own `workbench/wiki/MEMORY.md`.

## Source Precedence

1. Verified runtime and the deployment's live controls: `AGENTS.md`,
   `BLUEPRINT.md`, stable specs, `TASKBOARD.md`, and `RUNBOOK.md`.
2. Maintained notes in `[OWNER]/`, `Projects/`, and `Machine/`.
3. `archive/` and generated material.
4. Platform-provided saved or auto-memory.

Derived memory or index services never outrank anything with a Git and
Markdown home. The wiki is a map, not a Governance Plane.

## Direct Routing

| Question | Read first |
|---|---|
| How [OWNER] communicates or wants agents to work | [[How to Work With [OWNER]]] |
| [OWNER]'s profile, values, or stable preferences | [[Profile and Values]] |
| Workspace layout and knowledge-system boundaries | [[MACHINE OR WORKSPACE NOTE NAME]] |
| Machine capabilities or access constraints | [[MACHINE NOTE NAME]] |
| Project paths and repository routing | [[SOURCE REGISTRY NOTE NAME]] |
| Installed tools and agent capabilities | [[TOOLS NOTE NAME]] |
| CRUD, freshness, sensitivity, or provenance rules | [SCHEMA.md](SCHEMA.md) |
| Durable design models | [design-concepts/](design-concepts/README.md) |
| Superseded facts or old conversations | Follow a specific link into `archive/` |

## Projects

Each project room keeps its own brain at its `workbench/wiki/MEMORY.md`. This
root wiki keeps one pointer note per room with stable context; the note links
into the room's brain and the room's brain links back.

- [[PROJECT NOTE NAME]]
- [[ANOTHER PROJECT NOTE NAME]]

## Agent Workflow

1. Read this file.
2. Open the single directly relevant note.
3. For current project work, follow its source path and load the nearest
   project instructions and live controls.
4. Read raw sources or `archive/` only when maintained context is incomplete,
   stale, contradictory, or the user explicitly asks for historical detail.
5. Save durable discoveries through [SCHEMA.md](SCHEMA.md); do not save
   transient chat or duplicate live task state.

Active context should be reachable within two links from this file. Directory
browsing is a fallback for maintenance, not the normal navigation flow.
