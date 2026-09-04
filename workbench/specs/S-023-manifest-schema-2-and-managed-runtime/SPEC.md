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
**Latest event:** TK-003 closed with proof.
**Next gate:** Complete TK-004.

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
| TK-001 | A schema 2 manifest with six lanes and seven collections validates, a schema 1 manifest reports `upgrade-required`, and `migrate` converts the product repository losslessly | done | none | Red: schema 2 layout, dogfood, adoption, and upgrade tests failed before the resolver and schema 2 tool existed. Green: 12 focused layout tests (init six lanes and seven collections, sessions ignore file, upgrade-required, lossless migrate, current on rerun, missing-collection, sessions-not-ignored, invalid-wiki-profile, invalid-collection), dogfood schema 2 with git check-ignore proof, adoption and upgrade recovery in checkpoints; full 23-command union suite green; evaluator 113/113 root and 106.6/113 templates; this repository migrated with its planning checkpoint now at workbench/sessions/checkpoints |
| TK-002 | Runtime tools live in `workbench/tools/` with a receipt, install/verify/update/rollback work against a fixture project, and every consumer resolves the tools lane | done | TK-001 | Red: tools installer, layout, lifecycle, dogfood, and symlink tests failed before the lane existed. Green: 6 installer tests (source lane holds exactly the runtime tools and verifies as source; install writes a receipt with source release/commit and SHA-256 per file, 0644 non-symlink copies, refuses double install, leaves an application root tools/ byte-identical, and the installed copy renders and passes doctor; verify reports named drift; update requires --explicit-update, backs up under the user home, records the backup, reports current on rerun; rollback restores the backup verbatim and the pre-update drift; unreceipted collision and symlinked lane refused before mutation; no root control or template names a root runtime-tool path; runtime tools import safely with no argv file), 12 layout tests, symlink invocation through the lane, and the full 24-command union suite; evaluator 113/113 root and 106.6/113 templates |
| TK-003 | Adoption and explicit upgrade produce schema 2 projects, relocate a root feedback file, write recovery to checkpoints, and leave root `tools/` untouched | done | TK-002 | Red: adoption and upgrade tests failed on root feedback relocation, tools receipt, and root tools survival. Green: five adoption fixtures (mixed v2 with root tools byte-identical and no receipt written there; two root feedback files blocked as feedback-collision; legacy HARNESS_FEEDBACK.md renamed into the lane; root WORKBENCH_FEEDBACK.md relocated with a moved entry and tools installed; root file beside a legacy lane file blocked before mutation), three upgrade fixtures with the tools receipt and recovery record, six installer tests, and the full 24-command union suite |
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
| 2026-09-04 | TK-001 | Ticket closed | Red: schema 2 layout, dogfood, adoption, and upgrade tests failed before the resolver and schema 2 tool existed. Green: 12 focused layout tests (init six lanes and seven collections, sessions ignore file, upgrade-required, lossless migrate, current on rerun, missing-collection, sessions-not-ignored, invalid-wiki-profile, invalid-collection), dogfood schema 2 with git check-ignore proof, adoption and upgrade recovery in checkpoints; full 23-command union suite green; evaluator 113/113 root and 106.6/113 templates; this repository migrated with its planning checkpoint now at workbench/sessions/checkpoints | Updated RUNBOOK.md support-root, migrate, adoption, and upgrade sections; templates/GENESIS.md lane sentence and acceptance box; templates/ADOPTION.md recovery paths; ADR-0017 and ADR-0032 moved to accepted; tools/workbench-paths.mjs added as the single resolver | Runtime tools still live in root tools/ until TK-002; Genesis wiki seeding reports wiki:false until S-025 ships templates/wiki |
| 2026-09-04 | TK-002 | Ticket closed | Red: tools installer, layout, lifecycle, dogfood, and symlink tests failed before the lane existed. Green: 6 installer tests (source lane holds exactly the runtime tools and verifies as source; install writes a receipt with source release/commit and SHA-256 per file, 0644 non-symlink copies, refuses double install, leaves an application root tools/ byte-identical, and the installed copy renders and passes doctor; verify reports named drift; update requires --explicit-update, backs up under the user home, records the backup, reports current on rerun; rollback restores the backup verbatim and the pre-update drift; unreceipted collision and symlinked lane refused before mutation; no root control or template names a root runtime-tool path; runtime tools import safely with no argv file), 12 layout tests, symlink invocation through the lane, and the full 24-command union suite; evaluator 113/113 root and 106.6/113 templates | Moved six runtime tools to workbench/tools with Git history; added tools/workbench-tools.mjs and its test; shared isMainModule guard in workbench-paths.mjs closes the carried S-015 P3-5; re-pointed AGENTS.md, RUNBOOK.md (new Managed runtime tools check), BLUEPRINT.md, TASKBOARD.md, README.md, templates/GENESIS.md, and templates/ADOPTION.md at the lane; ADR-0031 accepted | Skills still name root tools paths until S-026/TK-001; later runtime tools (diagnostics, adr, wiki, sessions) join RUNTIME_TOOLS with their tickets |
| 2026-09-04 | TK-003 | Ticket closed | Red: adoption and upgrade tests failed on root feedback relocation, tools receipt, and root tools survival. Green: five adoption fixtures (mixed v2 with root tools byte-identical and no receipt written there; two root feedback files blocked as feedback-collision; legacy HARNESS_FEEDBACK.md renamed into the lane; root WORKBENCH_FEEDBACK.md relocated with a moved entry and tools installed; root file beside a legacy lane file blocked before mutation), three upgrade fixtures with the tools receipt and recovery record, six installer tests, and the full 24-command union suite | Updated RUNBOOK.md adoption and upgrade paragraphs and templates/ADOPTION.md commands and migration description; skills change in S-026 | Genesis readiness does not yet require the tools receipt (TK-004); feedback discovery still prefers a root file until S-026/TK-002 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Case-sensitive filesystem behavior is proven by logic-level tests unless a
  case-sensitive volume is available; S-022 records which.

## Supersession

- Supersedes: none
- Superseded by: none
