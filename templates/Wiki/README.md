# Room Brain Templates (Template Wiki)

> Part of LLM Workbench v[HARNESS_VERSION]. This folder is the template Wiki:
> the brain every instantiated room ships with. It is template-side material -
> copy the right variant out; do not fill this folder with project specifics.

Every room gets a brain. The mandatory artifact is a single `MEMORY.md` router
in Obsidian `[[wikilink]]` form. A brain starts as one file and grows into a
folder of flat notes only when the room has enough durable memory to route.

## What Ships Here

- `MEMORY.project.md` - the project-room router variant. Memory only: it routes
  to the room's own live controls and durable notes. No persona, no machine
  context. Copy it to the room root as `MEMORY.md`.
- `MEMORY.root.md` - the deployment-root router variant. Adds persona
  (`[OWNER]/`), `Machine/`, and `Projects/` routing on top of the project shape.
  Copy it to the deployment's `Wiki/MEMORY.md`. One per deployment.
- This `README.md` - variant choice, instantiation steps, and the link
  conventions below. Template-side only; do not copy it into rooms.

## Instantiation

1. Pick the variant: a project or module room takes `MEMORY.project.md`; the
   single deployment root takes `MEMORY.root.md`.
2. Copy it into the target as `MEMORY.md` (room root for projects;
   `Wiki/MEMORY.md` for the deployment root).
3. Fill every `[BRACKETED]` placeholder: room name, the routing table rows the
   room actually needs, and the up-link to the deployment wiki note.
4. Verify each `[[wikilink]]` resolves to a real file in the deployment vault,
   and that the deployment root's note for this room links back.

A room is born with a brain: `GENESIS.md` seeds `MEMORY.md` during bootstrap
(Phase 6) and `ADOPTION.md` seeds it during migration. A room without a
`MEMORY.md` is an incomplete instantiation.

## Link Conventions

- **Wikilinks, not paths.** Durable cross-references between memory, specs, and
  control docs use Obsidian `[[Note Name]]` form so links survive file moves
  when the vault manages renames. Machine-consumed references (code, configs,
  commands) keep real paths.
- **Traverse, don't search.** A reader starts at `MEMORY.md` and follows the
  smallest relevant link. Routers link to notes; notes link onward. Anything
  durable should be reachable within two links of a router.
- **Unique basenames.** Vaults resolve shortest-form links by basename, so note
  names must be unique across the vault. Prefix or qualify a name that could
  collide (e.g. `[PROJECT_NAME] Decisions`, not `Decisions`).
- **Qualify duplicated control docs.** Every room carries an `AGENTS.md`,
  `BLUEPRINT.md`, etc., so inside a shared deployment vault a bare `[[AGENTS]]`
  is ambiguous. A room brain inside a deployment qualifies those links with the
  room path (e.g. `[[Projects/[PROJECT_NAME]/AGENTS|AGENTS]]`); a standalone
  room vault may keep the bare form.
- **Router + flat notes.** `MEMORY.md` routes; flat notes beside it hold
  content. Do not nest note folders except a dedicated `Archive/`.
- **Link both ways at boundaries.** A room brain links up to the deployment
  wiki's note for that room, and that note links back down. Keep the pair
  resolvable in both directions.
- **Route, never duplicate.** The brain links to live controls (`TASKBOARD.md`,
  specs) and never copies their state. Live controls outrank the brain when
  they disagree; fix the stale note.
