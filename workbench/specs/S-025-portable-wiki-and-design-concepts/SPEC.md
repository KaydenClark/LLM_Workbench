# S-025 - Portable Wiki And Design Concepts

> Linked v3.1 capability promoted on 2026-09-04. Stable path
> `workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md`; never
> move it between status folders.

**Spec ID:** S-025
**Status:** active
**Priority:** 3
**Owner:** claude-fable-5-1
**Updated:** 2026-09-04
**Catalog description:** Ship the portable wiki contract with an explicit profile, knowledge-role and provenance metadata, handling-only sensitivity, relative source paths, optional Obsidian, and a mandatory owner-directed design-concepts collection.
**Blockers:** none
**Latest event:** Spec captured from the promoted v3.1 plan.
**Next gate:** Claim TK-001 after S-023/TK-001 lands.

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
| TK-001 | The wiki template set seeds a validated project wiki with the required collections and profile during Genesis | ready | S-023 | pending |
| TK-002 | `wiki.mjs validate` enforces metadata, portability, article shape, no copied task state, and secret patterns, with stale as attention | ready | TK-001 | pending |
| TK-003 | Lexicon routing and the product repository's own wiki adopt the contract with an empty design-concepts collection | ready | TK-002 | pending |

## Acceptance Criteria

- [ ] Genesis and Adoption produce `workbench/wiki/` with the router, schema, agent rules, and the three collections; `design-concepts/` absence fails layout validation.
- [ ] The validator rejects `authority`, absolute source paths, secret-like material, copied task state, and malformed articles, and reports stale notes as attention only.
- [ ] Obsidian configuration is optional: validation passes with and without a vault configuration.
- [ ] Root and template `LEXICON.md` route to the collection and preserve the owner's "Design concept" definition.
- [ ] Full union suite, render, doctor, and `git diff --check` pass.

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
| 2026-09-04 | plan | Captured the portable wiki and design-concepts capability from the promoted v3.1 plan | Baseline suite green at the landed S-015 SHA; wiki contract drafts staged | Spec added; templates and controls change with their tickets | Implement TK-001 through TK-003 after S-023/TK-001 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Deployment-profile collections are shipped as routing shape only; no
  deployment content is generated.

## Supersession

- Supersedes: none
- Superseded by: none
