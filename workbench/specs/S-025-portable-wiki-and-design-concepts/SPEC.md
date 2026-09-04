# S-025 - Portable Wiki And Design Concepts

> Linked v3.1 capability promoted on 2026-09-04. Stable path
> `workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md`; never
> move it between status folders.

**Spec ID:** S-025
**Status:** complete
**Priority:** 3
**Owner:** claude-fable-5-1
**Updated:** 2026-09-04
**Catalog description:** Ship the portable wiki contract with an explicit profile, knowledge-role and provenance metadata, handling-only sensitivity, relative source paths, optional Obsidian, and a mandatory owner-directed design-concepts collection.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

Every Workbench has a `workbench/wiki/` lane with `MEMORY.md` as the only
router, a `SCHEMA.md` and wiki `AGENTS.md` carrying the complete safety
contract, and the declared `design-concepts/`, `guidebooks/`, and `archive/`
collections. Design Concept articles follow the owner-directed shape, agents
suggest or repair but never create them, and a validator reports shape,
metadata, portability, and secret-like material while treating unrelated
staleness as nonblocking attention.

## Why It Matters

The v3.0 wiki was a single router template with conventions written for one
private deployment: absolute source paths, an `authority` field easily
confused with Canon, and no place for the design models the owner keeps
re-explaining. A portable wiki must carry its rules with it and must never
become a second copy of live task state or a place secrets leak.

## Current Verified State

- `templates/Wiki/` holds `MEMORY.project.md`, `MEMORY.root.md`, and a
  README; Genesis copies one router into `workbench/wiki/MEMORY.md`.
- The template README and project README still tell agents to use a root
  `MEMORY.md`.
- The private deployment's schema uses `authority`, absolute `source_paths`,
  an Archive-only-subfolder rule, and a Job-Order-only write rule; none is
  portable as written.
- The root `LEXICON.md` defines "Design concept" as the shared understanding
  between participants; no article home exists.

## Desired Behavior

- `templates/wiki/` (lowercase) ships `MEMORY.project.md`, `MEMORY.root.md`,
  `SCHEMA.md`, `AGENTS.md`, `design-concepts/README.md`, and placeholders for
  `guidebooks/` and `archive/`; Genesis and Adoption seed them into
  `workbench/wiki/` according to the manifest profile.
- Frontmatter: `type`, `status`, `sensitivity`, `knowledge_role`,
  `provenance`, `source_paths` (repository-relative), `last_verified`.
- Design Concept article: `type: design-concept`, `authorized_by`, `parent`,
  `Evidence and Sources`, and `History` sections; stale articles are
  attention.
- `workbench/tools/wiki.mjs validate` checks the router, required
  collections, property enums, relative source paths, article shape, absence
  of copied live task state (`hot-specs` markers, ticket rows), and
  secret-like patterns; Obsidian configuration is optional and never required.
- Root and template `LEXICON.md` route design questions to the collection;
  the product repository's own wiki gains the schema, agent rules, and an
  empty collection.

## Decisions And Contracts

- Rationale: [ADR-0018](../../docs/adr/0018-the-wiki-is-the-knowledge-base.md),
  [ADR-0030](../../docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md).
- `knowledge_role` replaces `authority`; `provenance` is attribution only;
  `sensitivity` is handling metadata, never encryption or access control.
- The wiki never copies Taskboard or spec state; it links to owners.
- No generated registry, automated discovery, or second router is added;
  Lexicon-first discovery is the contract until proven insufficient.

## Non-Goals

- Cloud bundles, cross-Workbench indexing, OpenBrain, or any deployment
  synchronization.
- Migrating the private deployment's wiki content.

## Dependencies And Blockers

- S-023/TK-001 supplies the collections and the path resolver.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | The wiki template set seeds a validated project wiki with the required collections and profile during Genesis | done | none | Red: the wiki test failed on the missing lowercase template set, seeding, and router gate. Green: 3 wiki tests (lowercase templates/wiki with SCHEMA.md, AGENTS.md, design-concepts/README.md, both routers with frontmatter using knowledge_role and no absolute paths; init seeds the three contract files with version, date, and project name filled and reports seeded.written, records the wiki profile for project and deployment, and never blindly seeds the router; Genesis readiness rejects a missing or unfilled workbench/wiki/MEMORY.md and accepts a filled one), 13 layout tests with the router in the happy fixture, and the full 28-command union suite; templates evaluator 106.6/113 unchanged |
| TK-002 | `wiki.mjs validate` enforces metadata, portability, article shape, no copied task state, and secret patterns, with stale as attention | done | TK-001 | Red: the wiki test failed before workbench/tools/wiki.mjs existed. Green: 6 wiki tests (a seeded wiki validates with or without an Obsidian configuration and doctor carries wiki findings; retired authority, absolute sources, bad enums, missing properties, copied ticket rows, token-like content, and duplicate basenames are invalid-note, copied-task-state, or secret-like-content findings that never block selection while the wiki command exits 1; design-concept articles need type, authorized_by, parent, Evidence and Sources, and History; a stale note is attention only and the command exits 0), diagnostics fixtures with a router, adoption reporting nonblocking findings, and the full 28-command union suite |
| TK-003 | Lexicon routing and the product repository's own wiki adopt the contract with an empty design-concepts collection | done | TK-002 | Red: the product wiki test failed on the v3.0 router without frontmatter and missing contract files. Green: 7 wiki tests including the product wiki validating without error findings, an empty design-concepts collection, and both Lexicons routing design questions to workbench/wiki/design-concepts/; wiki.mjs validate ok on the product; doctor shows only the umbrella slice finding; full 28-command union suite |

## Acceptance Criteria

- [x] Genesis and Adoption produce `workbench/wiki/` with the router, schema, agent rules, and the three collections; `design-concepts/` absence fails layout validation.
- [x] The validator rejects `authority`, absolute source paths, secret-like material, copied task state, and malformed articles, and reports stale notes as attention only.
- [x] Obsidian configuration is optional: validation passes with and without a vault configuration.
- [x] Root and template `LEXICON.md` route to the collection and preserve the owner's "Design concept" definition.
- [x] Full union suite, render, doctor, and `git diff --check` pass.

## Testing Seams

- Wiki CLI: JSON findings with registered codes.
- Fixtures: valid project wiki, deployment wiki, each rejected variant.
- Genesis fixture: seeded wiki validates.

## Verification Procedure

```bash
node tools/test-wiki.mjs
node tools/test-workbench-layout.mjs
```

Then the complete `RUNBOOK.md` union suite, render, doctor, and `git diff --check`.

## Documentation Impact

- `templates/wiki/` owns the portable contract; `RUNBOOK.md` owns the command.
- `AGENTS.md` (root and template) owns wiki behavior rules; `LEXICON.md` owns routing and terms.
- `README.md` (root and template) stops naming a root `MEMORY.md`.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-04 | plan | Released the first ticket's S-023 blocker: S-023/TK-001 through TK-004 landed the schema 2 layout, collections, sessions ignore file, and tools lane this slice depends on, while S-023 itself completes only after S-026/TK-001 re-points the skills; keeping a whole-spec blocker here would deadlock selection | `next --json` returned null with every first ticket blocked on an uncompletable S-023; doctor green | Ticket blocker only; requirements unchanged | Implement TK-001 |
| 2026-09-04 | plan | Captured the portable wiki and design-concepts capability from the promoted v3.1 plan | Baseline suite green at the landed S-015 SHA; wiki contract drafts staged | Spec added; templates and controls change with their tickets | Implement TK-001 through TK-003 after S-023/TK-001 |
| 2026-09-04 | TK-001 | Ticket closed | Red: the wiki test failed on the missing lowercase template set, seeding, and router gate. Green: 3 wiki tests (lowercase templates/wiki with SCHEMA.md, AGENTS.md, design-concepts/README.md, both routers with frontmatter using knowledge_role and no absolute paths; init seeds the three contract files with version, date, and project name filled and reports seeded.written, records the wiki profile for project and deployment, and never blindly seeds the router; Genesis readiness rejects a missing or unfilled workbench/wiki/MEMORY.md and accepts a filled one), 13 layout tests with the router in the happy fixture, and the full 28-command union suite; templates evaluator 106.6/113 unchanged | Renamed templates/Wiki to templates/wiki with history; rewrote both routers and the template README for v3.1; updated templates/GENESIS.md, templates/ADOPTION.md, templates/README.md, templates/AGENTS.md, README.md, RUNBOOK.md; placeholder vocabulary gained the project router tokens | wiki.mjs validate and doctor integration are TK-002; Lexicon routing and the product wiki are TK-003 |
| 2026-09-04 | TK-002 | Ticket closed | Red: the wiki test failed before workbench/tools/wiki.mjs existed. Green: 6 wiki tests (a seeded wiki validates with or without an Obsidian configuration and doctor carries wiki findings; retired authority, absolute sources, bad enums, missing properties, copied ticket rows, token-like content, and duplicate basenames are invalid-note, copied-task-state, or secret-like-content findings that never block selection while the wiki command exits 1; design-concept articles need type, authorized_by, parent, Evidence and Sources, and History; a stale note is attention only and the command exits 0), diagnostics fixtures with a router, adoption reporting nonblocking findings, and the full 28-command union suite | Added workbench/tools/privacy.mjs and wiki.mjs to the runtime set; RUNBOOK.md gained the Wiki Validation section and the adoption findings note; doctor carries wiki findings for schema 2 projects | The product wiki's own router still lacks frontmatter and is repaired in TK-003 with Lexicon routing |
| 2026-09-04 | TK-003 | Ticket closed | Red: the product wiki test failed on the v3.0 router without frontmatter and missing contract files. Green: 7 wiki tests including the product wiki validating without error findings, an empty design-concepts collection, and both Lexicons routing design questions to workbench/wiki/design-concepts/; wiki.mjs validate ok on the product; doctor shows only the umbrella slice finding; full 28-command union suite | Seeded workbench/wiki/SCHEMA.md, AGENTS.md, and design-concepts/README.md into the product wiki and rewrote its MEMORY.md router with frontmatter; added design-concept routing to LEXICON.md and templates/LEXICON.md; added the ADR and wiki ownership rows to AGENTS.md; ADR-0030 accepted and the register regenerated | none |
| 2026-09-04 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Completed on `claude/v3.1-release`. `templates/wiki/` ships the portable
contract (router variants, `SCHEMA.md`, `AGENTS.md`, `design-concepts/README.md`)
with `knowledge_role` separate from `provenance`, handling-only
`sensitivity`, repository-relative sources, optional Obsidian, no copied task
state, and nonblocking stale handling; `init` seeds it and Genesis readiness
requires the filled router. `workbench/tools/wiki.mjs` validates every rule
and doctor carries its findings without blocking selection. The mandatory
`design-concepts/` collection exists in every layout, and both Lexicons route
design questions to it; the product wiki adopts the same contract with an
empty collection because agents do not author articles.

## Remaining Limitations Or Follow-Up Specs

- Deployment-profile collections are shipped as routing shape only; no
  deployment content is generated.

## Supersession

- Supersedes: none
- Superseded by: none
