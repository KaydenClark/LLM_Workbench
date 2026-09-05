---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - LLM Workbench template wiki
source_paths:
  - workbench/wiki
last_verified: 2026-09-04
---

# Wiki Schema and CRUD Contract

> Generated from LLM Workbench v3.1.1.

## Purpose And Ownership

The wiki is this project's durable, navlinked knowledge base. It compiles
source-backed context so agents follow a concise map instead of rediscovering
raw conversations and files. It routes to the live controls; it never copies
them.

The wiki is not a Governance Plane and owns none. A note may document
Grounding or Enduring Context, but those are roles of claims in an operation,
not folders or properties that give the wiki authority. Wiki content cannot
authorize a change to Actuality; only the current user request, `AGENTS.md`,
and the explicitly assigned spec instruct.

## Profile And Collections

`workbench/manifest.json` declares the wiki profile:

- `project`: this room's `MEMORY.md` router, flat notes beside it, and the
  declared collections.
- `deployment`: the same, plus flat `[OWNER]/`, `Projects/`, and `Machine/`
  pointer collections for a multi-room deployment. One deployment has exactly
  one deployment-profile wiki.

Declared collections are `design-concepts/` (required to exist, may be empty),
`guidebooks/` (ordered procedures), and `archive/` (historical, generated,
superseded, and migration evidence). Every collection is flat; only `archive/`
may nest. `MEMORY.md` is the only router.

## Required Properties

Every active note uses YAML frontmatter with:

```yaml
type: memory | project | person | machine | guidebook | design-concept | meta
status: active | partial | stale | archived
sensitivity: normal | private | restricted
knowledge_role: canonical | curated | derived | historical
provenance:
  - who or what produced the note and when
source_paths:
  - repository/relative/path
last_verified: YYYY-MM-DD
```

- `knowledge_role` says how this note relates to other knowledge: `canonical`
  owns its knowledge class, `curated` is a maintained synthesis, `derived`
  is generated output that never outranks its inputs, `historical` is cold
  evidence retained for provenance. It is not a Governance Plane and grants
  no authority.
- `provenance` is attribution: the people, sessions, decisions, or imports the
  note came from. Keep it separate from `knowledge_role`.
- `sensitivity` is handling metadata only. It is not encryption and not an
  access control: `normal` notes may travel with the repository, `private`
  and `restricted` notes stay out of any generated bundle or external upload
  unless the owner opts in to a specific one. Credentials, tokens, keys,
  health, financial, and account material never enter the wiki at any
  sensitivity.
- `source_paths` are repository-relative and portable. Absolute paths belong
  only in explicitly local, ignored state.

## Create

- Create a note only when no existing active note owns the fact.
- Keep every collection flat; do not add category indexes.
- Do not create notes for one-off chat answers, temporary status, or tasks.
- Design Concept articles are created only on the owner's direction; see
  `design-concepts/README.md`.

## Read

- Start at `MEMORY.md` and follow the smallest relevant link. Traverse first;
  search only when a route is missing, stale, or under explicit maintenance.
- Current work requires the live controls or verified runtime, never a note.
- Read `archive/` only for a targeted historical or provenance need.
- Restricted notes are opt-in and must be relevant to the user's request.

## Update

- Update the owning note rather than appending a second version elsewhere.
- Refresh `last_verified` only for facts actually checked in the current task.
- Label inferred claims with `Inference:` and dated claims with their date.
- Preserve unresolved contradictions explicitly until a higher-authority
  source is verified.
- Never copy live task rows, spec evidence, or generated Taskboard state into
  a note; link to the owner instead.

## Stale Handling

Mark a note `status: stale` when its sources moved, were superseded, or now
contradict it and no direct proof supports a repair. Staleness is visible and
nonblocking: an unrelated stale note never stops current work. Repair from
direct proof, record the change in the note's history, and clear the mark.

## Delete And Archive

- Delete only material proven duplicated, reproducible, or superseded.
- Move provenance-worthy source summaries into `archive/`.
- Git records ordinary revisions; `archive/` is for useful content, not every
  old file version.

## Links

- Markdown links are the portable syntax for control and source routes; they
  survive outside any editor.
- Obsidian `[[wikilinks]]` are optional between wiki-native notes. Obsidian is
  supported, never required; nothing in the wiki depends on a vault
  configuration existing.
- Note basenames must be unique across the wiki so shortest-form links resolve.

## Verification

```bash
node workbench/tools/wiki.mjs validate
```

The validator checks the router, the declared collections, required
properties and enums, relative source paths, the Design Concept article shape,
the absence of copied live task state and secret-like material, and reports
stale notes as attention.
