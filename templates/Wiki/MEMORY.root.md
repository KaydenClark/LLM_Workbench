# [DEPLOYMENT_NAME] Memory

> Generated from LLM Workbench v[HARNESS_VERSION]. This is the deployment-root
> brain: the canonical, human-editable memory for the owner and the machine.
> Start here and follow the smallest relevant link instead of browsing folders
> or searching. One deployment has exactly one root brain.

## Authority Order

1. Verified runtime and the deployment's live controls: `AGENTS.md`,
   `BLUEPRINT.md`, stable specs, `TASKBOARD.md`, and `RUNBOOK.md`.
2. Maintained notes in `[OWNER]/`, `Projects/`, and `Machine/`.
3. Historical or generated material under `Archive/`.
4. Platform-provided saved or auto-memory.

When sources disagree, verify the higher-authority source and update the stale
maintained note. Derived memory or index services never outrank anything with a
Git/Markdown home.

## Direct Routing

| Question | Read first |
|---|---|
| How [OWNER] communicates or wants agents to work | [[How to Work With [OWNER]]] |
| [OWNER]'s profile, values, or stable preferences | [[Profile and Values]] |
| Workspace layout and knowledge-system boundaries | [[MACHINE OR WORKSPACE NOTE NAME]] |
| Machine capabilities or access constraints | [[MACHINE NOTE NAME]] |
| Project paths and repository routing | [[SOURCE REGISTRY NOTE NAME]] |
| Installed tools and agent capabilities | [[TOOLS NOTE NAME]] |
| CRUD, freshness, sensitivity, or provenance rules | [[SCHEMA]] |
| Superseded facts or old conversations | Follow a specific link into `Archive/` |

## Projects

Each project room keeps its own brain (`MEMORY.md` in the room). This root Wiki
keeps one pointer note per room with stable context; the note links into the
room's brain and the room's brain links back.

- [[PROJECT NOTE NAME]]
- [[ANOTHER PROJECT NOTE NAME]]

## Agent Workflow

1. Read this file.
2. Open the single directly relevant note.
3. For current project work, follow its source path and load the nearest
   project instructions and live controls.
4. Read raw sources or `Archive/` only when maintained context is incomplete,
   stale, contradictory, or the user explicitly asks for historical detail.
5. Save durable discoveries through [[SCHEMA]]; do not save transient chat or
   duplicate live task state.

Active context should be reachable within two links from this file. Directory
browsing is a fallback for maintenance, not the normal navigation flow.
