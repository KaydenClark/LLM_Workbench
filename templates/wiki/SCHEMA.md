---
type: meta
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - LLM Workbench template wiki
source_paths:
  - workbench/wiki
last_verified: [YYYY-MM-DD]
---

# Wiki Schema and CRUD Contract

> Generated from LLM Workbench v[HARNESS_VERSION].

## Purpose And Ownership

The wiki is this project's evolving synthesis: a directory of agent-written
Markdown that every agent reads and updates. It holds summaries, entity pages,
concept pages, comparisons, an overview and the evolving synthesis of what the
project is and how it works, in prose, so that handoffs stay instructions and
notepads stay one-writer session records. Every use of the Workbench reads the
wiki and, when the work changed what a page says, updates that page. It routes
to the live controls; it never copies them.

In Governance Plane terms a wiki page is Enduring Context, this schema is
Canon, and the wiki's raw sources are the claims that played the Actuality
role in the operation just performed, not whole artifacts. Destination
Question Cards and landmark records keep the structured account with its
lineage and identifiers; the wiki is what they are summarized into, updated
whenever a card changes.

The wiki is not a Governance Plane and owns none. A note may document
Grounding or Enduring Context, but those are roles of claims in an operation,
not folders or properties that give the wiki authority. Wiki content cannot
authorize a change to Actuality; only the current user request, `AGENTS.md`,
and the explicitly assigned spec instruct.

A recall/search index is derived from named sources and remains rebuildable;
it neither owns Wiki knowledge nor supplies authority. No recall database or
additional index service is required by this boundary.

## Profile And Collections

`workbench/manifest.json` declares the wiki profile:

- `project`: this room's `MEMORY.md` router, flat notes beside it, and the
  declared collections.
- `deployment`: the same, plus flat `[OWNER]/`, `Projects/`, and `Machine/`
  pointer collections for a multi-room deployment. One deployment has exactly
  one deployment-profile wiki.

Declared collections are `design-concepts/` (required to exist, may be empty),
`features/` (one readable article per completed Spec, captured at its closure
point; additive, may be empty), `guidebooks/` (ordered procedures), and
`archive/` (historical, generated, superseded, and migration evidence). Every
collection is flat; only `archive/` may nest. `MEMORY.md` is the only router.

## Page Kinds

Five kinds of page, mapped onto the collections below. This is a first cut
and may be revised when something does not fit.

- **Overview**: `MEMORY.md`, the router, carrying a one-line summary beside
  every link so a reader can choose a page without opening it.
- **Synthesis**: one evolving page per landmark, in `design-concepts/`,
  summarizing that landmark's question cards and what they add up to.
- **Entity pages**: one page per capability (`features/`), and per skill,
  role, stance and tool (flat notes beside the router).
- **Concept pages**: durable cross-cutting models, in `design-concepts/`,
  and a page for any term that needs more than its Lexicon row.
- **Comparisons**: filed back as a flat note when answering a question
  produced one worth keeping.

## Required Properties

Every active note uses YAML frontmatter with:

```yaml
type: memory | project | person | machine | guidebook | design-concept | feature | meta
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
- Do not create notes for temporary status or tasks. A chat answer that
  produced a durable summary, comparison or synthesis is filed as a page;
  a passing answer is not.
- Any agent, in any authorized operation, creates or updates the pages that
  operation touched. The operation's own authority covers its wiki update;
  no per-page approval exists. Only this schema needs the owner's explicit
  say. Record the authorizing operation in a Design Concept article's
  `authorized_by` and `History`; see `design-concepts/README.md`.
- A features article is written for a completed Spec at its closure point,
  before its records are retired or discarded; see `features/README.md`.

## Read

- Start at `MEMORY.md` and follow the smallest relevant link. Traverse first;
  search only when a route is missing, stale, or under explicit maintenance.
- Current work requires the live controls or verified runtime, never a note.
- Read `archive/` only for a targeted historical or provenance need.
- Restricted notes are opt-in and must be relevant to the user's request.

## Update

- Ingest at the exit of every operation. When a grilling session ends, a
  Task closes, a Spec completes, a decision is accepted or material is
  promoted, update every page that operation touched: the entity or concept
  page, the landmark synthesis, the overview line. One ingest usually
  touches several pages; expect that, not one.
- Identifiers are welcome: they are how agents link and find artifacts. No
  page references an identifier without the artifact's name or title and a
  little context about what it is for.
- Update the owning note rather than appending a second version elsewhere.
- Refresh `last_verified` only for facts actually checked in the current task.
- Label inferred claims with `Inference:` and dated claims with their date.
- Preserve unresolved contradictions explicitly until a higher-authority
  source is verified.
- Never copy live task rows, spec evidence, or generated Taskboard state into
  a note; link to the owner instead.

## Lint

Two cadences. At the end of every wiki update, lint the pages it touched:
do they contradict a neighbor, is every claim still backed by its source,
did the router get its summary line, was a concept mentioned that has no
page. At Spec review, when the Spec's work is verified, lint the whole wiki
the same way against the current controls and question cards. Findings
become corrective Tasks. This is a reading job for an agent; the structural
validator below keeps running on every change and does not replace it.

## Concurrency

The wiki is tracked in Git and updated on the agent's own branch like every
other owned document; Git reconciles. There is no writer lane, revision
stamp or lock. A same-paragraph collision between two lanes surfaces as a
merge conflict that the lane landing second resolves by reading both.

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
node workbench/tools/wiki.mjs normalize
```

The validator checks the router, the declared collections, required
properties and enums, relative source paths, the Design Concept and features
article shapes, the absence of copied live task state and secret-like material,
and reports stale notes as attention. `validate` never writes.

`validate` reports wiki facts only. Two findings it used to carry are not wiki
facts and no longer come from here: `stale-seed`, for a seeded lane document
whose recorded generation is behind the manifest, and `unverified-provenance`,
for a manifest whose recorded source identity is a placeholder or disagrees with
`workbenchVersion`. `doctor` emits both, from the installed-state hook beside
its managed-runtime check; the checks themselves live in
`workbench/tools/workbench-layout.mjs` and are repaired by its `seed-documents`
and `record-source` commands. `RUNBOOK.md` -> Installed State The Harness Wrote
documents them. Neither blocks.

`normalize` is the explicit repair for a note missing required properties. It
inserts only what is absent, never edits a body or overwrites a declared value,
and lists every note it changed. It fills the least-claiming values the schema
allows - `status: partial`, `knowledge_role: derived`, a `provenance` line
naming the normalization, the note's own path as `source_paths`, and
`last_verified` set to the day it ran - and infers `type` from the note's
location. Correct those values by hand afterwards; a Design Concept article
still needs its owner-directed `authorized_by`, `parent`, and sections, and a
features article still needs its sections.
