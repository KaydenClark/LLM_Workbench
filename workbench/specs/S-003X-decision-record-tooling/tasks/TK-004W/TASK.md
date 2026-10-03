# TK-004W - Install the ddr collection in fresh and updated rooms

**Task ID:** TK-004W
**Spec ID:** S-003X
**Slice:** Install the ddr collection in fresh and updated rooms
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 1 (the manifest declares a `ddr` collection and a fresh project has `workbench/docs/ddr/` with its `proposed/` and `archive/` folders) and the update-route part of box 6 (updating a room that already holds ADRs adds the collection without altering its records)
**Planned verification:** Red: a new `tools/test-workbench-layout.mjs` case fails because `init` declares no `ddr` collection and creates no `workbench/docs/ddr/proposed/` or `archive/`, and `migrate` on a room holding ADRs does not add it. Green: that case and the existing features-collection case pass with byte-identical ADR records after migrate; `test-workbench-layout`, `test-workbench-adoption`, `test-workbench-upgrade`, `test-workbench-round-trip`, `test-workbench-dogfood` and `test-control-fidelity` pass; this room's manifest validates and `doctor` has no blocking finding; the full AGENTS suite passes on the committed candidate.
**Proof:** Red aa51ade6 (test-workbench-layout 71/2: init declared no ddr; migrate added only features). Green at 333a6da7: test-workbench-layout 73/73 and the adoption, upgrade, landmark-tracker, round-trip, dogfood and control-fidelity tests pass; this room migrated to declare collections.ddr and validates; full AGENTS suite 48/48 on the clean candidate. Plan PR #279 (reviewed PASS at a560f6cf, suite 48/48) merged into integration as 1b5da601 before this close.

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

- [x] `init` declares `collections.ddr` and creates the folder with `proposed/`
      and `archive/`; `validate` reports the room valid.
- [x] Every earlier collection shape still validates; a relocated `ddr`
      declaration is refused as `invalid-collection`.
- [x] `migrate` adds exactly the missing additive collections, leaves every
      ADR byte and every other manifest key unchanged, and a second run
      reports `current`.
- [x] This room declares the collection and `doctor` reports no blocking
      finding.

## Boundaries

No DDR command, register or validation (the next Task). No `LEXICON.md` or
`templates/LEXICON.md` edit: those rows are the last Task, sequenced after the
unmerged Codex Lexicon reconciliation branch. The ADR collection's own layout
and every existing ADR stay untouched. No version bump or release bundle; the
release owner keeps those gates.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-tk004w-ddr-collection | 333a6da7abb8471090c1cf1ec9c17b6ab89a77cc | ahead 0 behind 0 | 0 | Red aa51ade6: tools/test-workbench-layout.mjs 71 pass 2 fail (the new ddr-collection case: init declares no ddr; the features case: migrate adds only features). Green 333a6da7: test-workbench-layout 73/73, test-workbench-adoption, test-workbench-upgrade 5/5, test-landmark-tracker 23/23, test-workbench-round-trip, test-workbench-dogfood, test-control-fidelity 26/26 pass; workbench-layout.mjs migrate on this room reported migrated with collections.ddr added and validate reports valid; full AGENTS suite on clean 333a6da7: 48/48 commands pass. | RUNBOOK V3 support-root check (twelve collections incl. wiki/features and docs/ddr, init lifecycle folders, additive migrate and its refusal), templates/RUNBOOK decision-record paragraph, templates/GENESIS readiness line (seven lanes, twelve collections), Wiki article Decision Records and the Concept Map (collection installed, still empty); update-harness skill checked, no change needed because it does not enumerate collections. | No DDR command, register or validation yet (TK-004X). Lexicon rows unchanged (TK-005A, blocked on the Codex Lexicon branch). Separate-context review of the final head pending. | 85880e74559ea52e95e5683f3d4c11cde12fbcbd756c3cdbe11c1ff53fc0f836 |
| 2 | claude/s003x-tk004w-ddr-collection | 317fa889e46f3c226f79bb874844620d1fffbea9 | ahead 0 behind 0 | 0 | Red aa51ade6 (test-workbench-layout 71/2: init declared no ddr; migrate added only features). Green at 333a6da7: test-workbench-layout 73/73 and the adoption, upgrade, landmark-tracker, round-trip, dogfood and control-fidelity tests pass; this room migrated to declare collections.ddr and validates; full AGENTS suite 48/48 on the clean candidate. Plan PR #279 (reviewed PASS at a560f6cf, suite 48/48) merged into integration as 1b5da601 before this close. | RUNBOOK support-root check, templates/RUNBOOK, templates/GENESIS readiness line and the Wiki article Decision Records and the Concept Map updated; update-harness skill checked, no change needed (it names additive collections generically). | TK-004X (DDR command, validation, register), TK-004Y, TK-004Z and the blocked TK-005A remain; separate-context review of this Task's final head precedes its integration merge. | 9d3be576486cad0a5a147e856a741cc2293f06423c5ae1602d395fca526b5b4b |
