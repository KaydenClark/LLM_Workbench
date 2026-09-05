# Wiki Templates

> Part of LLM Workbench v[HARNESS_VERSION]. This folder is the template wiki:
> the knowledge base every instantiated Workbench ships with in its
> `workbench/wiki/` lane. It is template-side material; copy the right files
> out and fill them. Do not fill this folder with project specifics.

## What Ships Here

- `SCHEMA.md`, `AGENTS.md`, and `design-concepts/README.md` are the wiki
  contract: metadata, CRUD, sensitivity handling, portability, stale handling,
  and the owner-directed Design Concept article shape. `workbench-layout.mjs
  init` seeds them from a release checkout with the version, date, and project
  name filled in.
- `MEMORY.project.md` is the `project` profile router. Copy it to
  `workbench/wiki/MEMORY.md` and fill it; it is the only router.
- `MEMORY.root.md` is the `deployment` profile router for a multi-room
  deployment. One deployment has exactly one, at its own
  `workbench/wiki/MEMORY.md`, with flat `[OWNER]/`, `Projects/`, and `Machine/`
  pointer collections beside it.
- `guidebooks/` and `archive/` are declared collections that ship empty;
  `design-concepts/` must exist in every Workbench even when empty.

## Instantiation

1. `workbench-layout.mjs init` (or Adoption) creates the lane, the collections,
   and the seeded contract files, and records the profile in the manifest.
2. Copy the router variant matching the profile to `workbench/wiki/MEMORY.md`
   and fill every `[BRACKETED]` placeholder; delete routing rows that have no
   note to route to.
3. Run `node workbench/tools/wiki.mjs validate`; the Genesis readiness gate
   also requires the filled router and contract files.

## Link Conventions

- **Markdown links** are the portable syntax for control and source routes.
  **Wikilinks** (`[[Note]]`) are optional between wiki-native notes; Obsidian
  is supported, never required.
- **Traverse, don't search.** A reader starts at `MEMORY.md` and follows the
  smallest relevant link; anything durable is within two links of the router.
- **Unique basenames.** Note names must be unique across the wiki so
  shortest-form links resolve; qualify duplicated control names with a path.
- **Router plus flat collections.** `MEMORY.md` routes; flat notes and the
  declared collections hold content; only `archive/` nests.
- **Route, never duplicate.** The wiki links to live controls and never copies
  their state; live controls outrank the wiki when they disagree.
- **Link both ways at boundaries.** A room brain links up to the deployment
  wiki's pointer note and that note links back.
