# S-023 - Manifest Schema 2 And Managed Support Runtime

> Linked v3.1 capability promoted on 2026-09-04. Stable path
> `workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md`;
> never move it between status folders.

**Spec ID:** S-023
**Status:** active
**Priority:** 1
**Owner:** claude-fable-5-1
**Updated:** 2026-09-04
**Catalog description:** Ship manifest schema 2 with six lanes, declared collections, a lossless schema 1 migration, Workbench-managed runtime tools, and untracked-by-default session records.
**Blockers:** none
**Latest event:** TK-001 claimed by claude-fable-5-1.
**Next gate:** Close TK-001 with verification and documentation proof.

## Outcome

Every Workbench produced or migrated by v3.1 has a schema 2
`workbench/manifest.json` declaring six lowercase lanes and every machine-used
collection, a `workbench/tools/` lane of receipt-backed managed runtime tools,
an untracked-by-default `sessions/` lane with a tracked `checkpoints/`
collection, and a mandatory `wiki/design-concepts/` collection. A schema 1
manifest is reported as `upgrade-required` and migrates once without loss.

## Why It Matters

The v3.0 layout declared five lanes, kept runtime tools in the product
checkout, and left session records tracked or untracked by accident. Skills
and tools each answered "where does X live" differently, so a renamed
directory broke them silently. One declared shape with one resolver makes
every consumer fail visibly instead.

## Current Verified State

- `tools/workbench-layout.mjs` hardcodes five lanes and accepts only
  `schemaVersion: 1`; `init` writes `.gitkeep` into every lane.
- `tools/workbench-adoption.mjs` maps `specs`, `Wiki`, `feedback`,
  `grilling diary`, and `handoffs`, writes its recovery record into the
  handoff lane, and moves a legacy `skills/` directory there.
- `tools/workbench-upgrade.mjs` writes `workbench/handoffs/upgrade-recovery.json`.
- Root controls, templates, and all twelve skills name root `tools/` paths.
- The product repository keeps runtime and development tools together in
  root `tools/`.

## Desired Behavior

- Schema 2 manifest: `schemaVersion: 2`, `workbenchVersion`, `provenance`
  (lifecycle plus exact source repository, release, and commit), six `lanes`,
  the seven `collections`, `wiki.profile` (`project` or `deployment`), and the
  unchanged skill policy. All paths are lowercase, space-free, and under
  `workbench/`.
- `validate` reports schema 1 as `upgrade-required`; `migrate` converts a
  schema 1 layout losslessly: `grilling` becomes `sessions/grilling`, the
  tracked `handoffs` checkpoints become `sessions/checkpoints`, and the new
  collections, `sessions/.gitignore`, and tools lane are created.
- `workbench/sessions/.gitignore` ignores `grilling/` and `handoffs/`
  contents; `checkpoints/` is tracked.
- Runtime tools install from the release's `workbench/tools/` into a project's
  `workbench/tools/` with a receipt (`.workbench-tools.json`: schema, source
  repository, release, commit, per-file SHA-256). `verify` reports drift;
  `update --explicit-update` backs up changed files under the user home and
  records a rollback path; `rollback` restores a backup. Installed files are
  ordinary files with mode `0644`.
- Adoption and upgrade target schema 2, move a root feedback file into the
  feedback lane, write recovery records into `sessions/checkpoints`, and never
  touch an application's root `tools/`.
- Genesis creates schema 2 directly; `validate --genesis` requires the
  collections, the sessions ignore file, and a tools receipt matching the
  manifest version.
- The product repository dogfoods the split: portable runtime tools move to
  `workbench/tools/` with history; root `tools/` keeps product tooling.

## Decisions And Contracts

- [ADR-0017](../../docs/adr/0017-workbench-support-directory-has-six-lanes.md),
  [ADR-0031](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md),
  [ADR-0032](../../docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md),
  and [ADR-0028](../../docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md)
  carry the rationale; `BLUEPRINT.md` and `RUNBOOK.md` carry the rules.
- One resolver (`workbench/tools/workbench-paths.mjs`) reads the manifest for
  every consumer; no tool or skill hardcodes a lane or collection.
- The runtime tool set is exactly: `spec-workbench.mjs`, `spec-packet.mjs`,
  `markdown-table.mjs`, `workbench-layout.mjs`, `template-placeholders.mjs`,
  `workbench-paths.mjs`, `diagnostics.mjs`, `adr.mjs`, `wiki.mjs`, and
  `sessions.mjs`. Setup, migration, installer, evaluator, audit, automation,
  and test tools stay in the product's root `tools/`.
- Backups live under the user home as `.workbench-tools-backup-*`, matching
  the skill-upgrade convention, and the receipt records the backup path.

## Non-Goals

- Changing the twelve-skill policy or the skill installer.
- Absorbing, renaming, or validating an application's root `tools/`.
- A plugin or dependency system for tools.

## Dependencies And Blockers

- None. S-024, S-025, and S-026 build on this layout.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | A schema 2 manifest with six lanes and seven collections validates, a schema 1 manifest reports `upgrade-required`, and `migrate` converts the product repository losslessly | in-progress | none | pending |
| TK-002 | Runtime tools live in `workbench/tools/` with a receipt, install/verify/update/rollback work against a fixture project, and every consumer resolves the tools lane | ready | TK-001 | pending |
| TK-003 | Adoption and explicit upgrade produce schema 2 projects, relocate a root feedback file, write recovery to checkpoints, and leave root `tools/` untouched | ready | TK-002 | pending |
| TK-004 | Genesis and its templates produce a validated schema 2 project with a tools receipt, sessions ignore file, and design-concepts collection | ready | TK-003 | pending |

## Acceptance Criteria

- [ ] Schema 2 init, validate, and lossless schema 1 migration are proven by focused red/green tests and by migrating this repository.
- [ ] Managed runtime tools carry receipts with exact source release, commit, and hashes; explicit update, backup, and rollback are proven.
- [ ] No active consumer names a root tools path for a runtime tool; root `tools/` of a fixture application survives Adoption byte for byte.
- [ ] Live session collections are untracked by default and `checkpoints/` is tracked in Genesis, Adoption, upgrade, and this repository.
- [ ] `wiki/design-concepts/` exists in every produced layout and its absence fails validation.
- [ ] Full union suite, render, doctor, and `git diff --check` pass.

## Testing Seams

- CLI: `workbench-layout.mjs init|validate|migrate` JSON status and stable codes.
- CLI: `workbench-tools.mjs install|verify|update|rollback` JSON reports and receipt contents.
- Filesystem fixtures: schema 1 project, mixed v2 project with root `tools/`,
  Genesis fixture.
- Consumer scan: no `node tools/<runtime-tool>` in skills, templates, or root controls.

## Verification Procedure

```bash
node tools/test-workbench-layout.mjs
node tools/test-workbench-tools.mjs
node tools/test-workbench-adoption.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-workbench-dogfood.mjs
```

Then the complete `RUNBOOK.md` union suite, render, doctor, and `git diff --check`.

## Documentation Impact

- `RUNBOOK.md` owns the new layout, tools, migration, and recovery commands.
- `BLUEPRINT.md` owns the schema 2 invariants and the tool-ownership split.
- Templates (`GENESIS.md`, `ADOPTION.md`, `RUNBOOK.md`, `AGENTS.md`, `README.md`) change with the ticket that implements their behavior.
- Skills change in S-026.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-04 | plan | Captured the schema 2, tools, and sessions capability from the promoted v3.1 plan | Baseline suite green at the landed S-015 SHA; no capability behavior verified yet | Spec added; Blueprint and Lexicon carry the direction; Runbook and templates wait for tickets | Implement TK-001 through TK-004 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Case-sensitive filesystem behavior is proven by logic-level tests unless a
  case-sensitive volume is available; S-022 records which.

## Supersession

- Supersedes: none
- Superseded by: none
