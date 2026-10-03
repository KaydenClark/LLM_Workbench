# TK-004W - Install the ddr collection in fresh and updated rooms

**Task ID:** TK-004W
**Spec ID:** S-003X
**Slice:** Install the ddr collection in fresh and updated rooms
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 1 (the manifest declares a `ddr` collection and a fresh project has `workbench/docs/ddr/` with its `proposed/` and `archive/` folders) and the update-route part of box 6 (updating a room that already holds ADRs adds the collection without altering its records)
**Planned verification:** Red: a new `tools/test-workbench-layout.mjs` case fails because `init` declares no `ddr` collection and creates no `workbench/docs/ddr/proposed/` or `archive/`, and `migrate` on a room holding ADRs does not add it. Green: that case and the existing features-collection case pass with byte-identical ADR records after migrate; `test-workbench-layout`, `test-workbench-adoption`, `test-workbench-upgrade`, `test-workbench-round-trip`, `test-workbench-dogfood` and `test-control-fidelity` pass; this room's manifest validates and `doctor` has no blocking finding; the full AGENTS suite passes on the committed candidate.

## Outcome

A room created by Genesis (`workbench-layout.mjs init`) declares the `ddr`
collection at `workbench/docs/ddr` and holds that folder with its `proposed/`
and `archive/` lifecycle folders. A room that already exists gains the same
collection through the ordinary update route (`workbench-layout.mjs migrate`)
without any change to its ADRs or any other declared path. This repository's
own manifest declares the collection and carries the folders.

## Scope

- `workbench/tools/workbench-paths.mjs`: append `ddr: 'workbench/docs/ddr'`
  to `COLLECTIONS` after `features`, so every earlier key keeps its place, and
  export the preserved pre-DDR shape the way `PRE_FEATURE_COLLECTIONS` is
  exported, so appending `ddr` cannot redefine what an older room declared.
- `workbench/tools/workbench-layout.mjs`: accept every preserved collection
  shape as stamped, with `features` appended, and with `features` and `ddr`
  appended; `init` creates `workbench/docs/ddr/` with `proposed/` and
  `archive/`, each kept by a `.gitkeep`; `migrate` appends `ddr` to a room
  declaring the current pre-DDR set and appends both `features` and `ddr` to
  a pre-feature room, creating only ordinary directories and refusing a link
  or file at the path before writing anything. The legacy migration path
  creates the folders too.
- This room: declare the collection through `migrate` and commit
  `workbench/docs/ddr/proposed/.gitkeep` and `workbench/docs/ddr/archive/.gitkeep`.
- Documentation: the Runbook support-root paragraph lists the declared
  collections (it currently omits `wiki/features`) and states how an existing
  room gains `ddr`; the generic `templates/RUNBOOK.md` and
  `templates/GENESIS.md` readiness line follow; the `update-harness` skill's
  note on additive declared collections names it if it enumerates them.

## Acceptance

- [ ] `init` declares `collections.ddr` and creates the folder with `proposed/`
      and `archive/`; `validate` reports the room valid.
- [ ] Every earlier collection shape still validates; a relocated `ddr`
      declaration is refused as `invalid-collection`.
- [ ] `migrate` adds exactly the missing additive collections, leaves every
      ADR byte and every other manifest key unchanged, and a second run
      reports `current`.
- [ ] This room declares the collection and `doctor` reports no blocking
      finding.

## Boundaries

No DDR command, register or validation (the next Task). No `LEXICON.md` or
`templates/LEXICON.md` edit: those rows are the last Task, sequenced after the
unmerged Codex Lexicon reconciliation branch. The ADR collection's own layout
and every existing ADR stay untouched. No version bump or release bundle; the
release owner keeps those gates.
