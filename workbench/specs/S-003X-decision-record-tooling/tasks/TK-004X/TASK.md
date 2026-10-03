# TK-004X - Write, validate and register DDRs through the shared ADR runtime

**Task ID:** TK-004X
**Spec ID:** S-003X
**Slice:** Write, validate and register DDRs through the shared ADR runtime
**Status:** done
**Stance:** Builder
**Blockers:** TK-004W
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 2 (the DDR command writes the next record into `proposed/` with a `DDR` visible identifier and refuses to overwrite an existing record), box 5 (validation refuses a DDR whose `canonicalized_in` names the Wiki) and the source, template and documentation part of box 6
**Planned verification:** Red: new `tools/test-adr.mjs` cases fail because `adr.mjs new --kind ddr` is unknown, no DDR register exists and a DDR naming the Wiki in `canonicalized_in` validates. Green: those cases, the existing ADR cases unchanged, `test-diagnostics` with the new code registered, `test-spec-workbench` (doctor and render carry DDR findings and registers), `test-visible-id-consumers`, `test-workbench-layout` (template placeholder vocabulary), `test-skill-catalog` and `test-control-fidelity` pass; a fixture room's `new --kind ddr`, `validate` and `register` run end to end; the full AGENTS suite passes on the committed candidate.
**Proof:** Red ba8202bf (test-adr 40/5, test-diagnostics 34/2). Green: test-adr 45/45, test-diagnostics 36/36 and the visible-id-consumers, sessions, genesis-from-decisions, direct-promotion, governance-core, lifecycle-directory-links and self-drift tests pass; this room's empty DDR register and history written with the ADR register unchanged; full AGENTS suite 48/48 on clean 06ea023f after a 47/48 run on 7d0cf583 exposed a bracketed flag read as a template placeholder. TK-004W PR #280 (reviewed PASS at 96f44379) merged into integration as 674855fd before this close.

## Outcome

An agent at the documentation step writes the next Destination Decision
Record with one command, `node workbench/tools/adr.mjs new --kind ddr --title
"..."`, which places `<id>-<slug>.md` in `workbench/docs/ddr/proposed/` with a
`DDR` visible identifier and refuses to overwrite. `validate` checks ADRs and
DDRs alike and refuses a DDR whose `canonicalized_in` names the Wiki;
`register` derives each collection's `REGISTER.md` and `HISTORY.md` from its
folder listing; `doctor` and the Spec and Task moves carry both. Every existing ADR command,
export and finding keeps its behavior.

## Scope

- `workbench/tools/adr.mjs`: one runtime parameterized by record kind (`adr`
  or `ddr`: collection, identifier prefix, template, finding code), using the
  same lifecycle folders. The DDR template carries the frontmatter keys
  `date`, `supersedes` and `canonicalized_in` (default `BLUEPRINT.md`) and a
  free-prose body adapted to a destination choice. Label reservation reads the
  local collection and every remote-tracking tip through `collections.ddr`, as
  ADR reservation reads `collections.adr`.
- Validation: the existing ADR rules apply to a DDR under the finding code
  `invalid-ddr`; a DDR whose `canonicalized_in` names the Wiki lane or any path
  in it is refused at every lifecycle. The Blueprint obligation (a DDR that
  contradicts the Blueprint names `BLUEPRINT.md`) is author judgment the
  validator cannot detect; it is documented, and `BLUEPRINT.md` is an accepted
  owner.
- `workbench/tools/diagnostics.mjs` registers `invalid-ddr`;
  `workbench/tools/spec-workbench.mjs` doctor, the register regeneration in
  the Spec and Task moves and the generated projection list carry the DDR
  collection beside the ADR collection.
- Documentation: the Runbook Architecture Decision Records section (DDR
  command, rules and findings), the generic `templates/RUNBOOK.md`, the
  `to-docs` skill's route to the DDR command, the narrowed generic Blueprint
  instruction (the Blueprint links no record that carries an identifier) in
  `templates/BLUEPRINT.md` with its placeholder vocabulary in
  `workbench/tools/template-placeholders.mjs`, and the Wiki article
  "Decision Records and the Concept Map" where it says the DDR has no tooling.

## Acceptance

- [x] `new --kind ddr` writes a `DDR`-identified record into `ddr/proposed/`
      with the three frontmatter keys and refuses an existing path.
- [x] `validate` reports `invalid-ddr` for a DDR naming the Wiki in
      `canonicalized_in`, in any folder, and leaves ADR findings unchanged.
- [x] `register` writes the DDR register and history; `doctor` reports a
      stale DDR register and the Spec and Task moves regenerate it. (Corrected
      at implementation: `render` regenerates no decision register, for ADRs
      either; the moves and `adr.mjs register` do.)
- [x] Runbook, template mirrors, `to-docs` and the Wiki article agree with
      the shipped commands.

## Boundaries

No accept, supersede or deprecate move (TK-004Y) and no read word (TK-004Z). No
landmark field on the DDR template: how a DDR records its landmark is open
and waits on the LANDMARK.md capability. No DDR content from the Blueprint
teardown, no root `BLUEPRINT.md` change, and no `LEXICON.md` or
`templates/LEXICON.md` edit (the last Task).

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-tk004x-ddr-runtime | 06ea023fd62935c4baf6055303d9103f6a47d299 | ahead 0 behind 0 | 0 | Red ba8202bf: tools/test-adr.mjs 40 pass 5 fail (new --kind ddr unknown, no DDR register, DDR naming the Wiki validated, undeclared-collection refusal and DDR remote reservation absent); tools/test-diagnostics.mjs 34 pass 2 fail (invalid-ddr unregistered). Green: test-adr 45/45 and test-diagnostics 36/36; test-visible-id-consumers, test-sessions, test-genesis-from-decisions, test-direct-promotion, test-governance-core, test-lifecycle-directory-links and test-self-drift pass; adr.mjs register on this room writes the empty DDR register and history with the ADR register byte-unchanged and validate reports decision records validated. Full AGENTS suite: 47/48 on 7d0cf583 (test-workbench-layout: the template Runbook's bracketed [--kind adr\|ddr] read as an unknown placeholder), fixed in 06ea023f; 48/48 on clean 06ea023f. | RUNBOOK decision-record section (DDR commands, rules, invalid-ddr, kind-less behavior) and new-label reservation sentence; templates/RUNBOOK command block and decision paragraph; to-docs skill DDR route; templates/BLUEPRINT.md narrowed instruction with template-placeholders.mjs vocabulary; Wiki article Decision Records and the Concept Map; TK-004X record corrected where it said render regenerates registers. | Accept, supersede and deprecate moves (TK-004Y), read words (TK-004Z) and the blocked Lexicon mirrors (TK-005A) remain; separate-context review of the final head pending. | 7a536bee7a837ed673ff1b2928bf268262ba7d29f51162e38c7675648345116f |
| 2 | claude/s003x-tk004x-ddr-runtime | ef90752a1604ff3fb0434075d780351dedbf0146 | ahead 0 behind 0 | 0 | Red ba8202bf (test-adr 40/5, test-diagnostics 34/2). Green: test-adr 45/45, test-diagnostics 36/36 and the visible-id-consumers, sessions, genesis-from-decisions, direct-promotion, governance-core, lifecycle-directory-links and self-drift tests pass; this room's empty DDR register and history written with the ADR register unchanged; full AGENTS suite 48/48 on clean 06ea023f after a 47/48 run on 7d0cf583 exposed a bracketed flag read as a template placeholder. TK-004W PR #280 (reviewed PASS at 96f44379) merged into integration as 674855fd before this close. | RUNBOOK and templates/RUNBOOK decision-record commands and rules, to-docs DDR route, templates/BLUEPRINT.md narrowed instruction with its placeholder vocabulary, and the Wiki article Decision Records and the Concept Map updated. | TK-004Y (moves), TK-004Z (read words) and the blocked TK-005A remain; separate-context review of this Task's final head precedes its integration merge. | 1c5c4f9b87a1c3958c70bb1e3b649f2d5f6309157d28fc635702a8d0b45ebb93 |
