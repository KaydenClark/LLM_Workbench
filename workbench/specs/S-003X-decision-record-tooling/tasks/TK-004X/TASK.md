# TK-004X - Write, validate and register DDRs through the shared ADR runtime

**Task ID:** TK-004X
**Spec ID:** S-003X
**Slice:** Write, validate and register DDRs through the shared ADR runtime
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-004W
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 2 (the DDR command writes the next record into `proposed/` with a `DDR` visible identifier and refuses to overwrite an existing record), box 5 (validation refuses a DDR whose `canonicalized_in` names the Wiki) and the source, template and documentation part of box 6
**Planned verification:** Red: new `tools/test-adr.mjs` cases fail because `adr.mjs new --kind ddr` is unknown, no DDR register exists and a DDR naming the Wiki in `canonicalized_in` validates. Green: those cases, the existing ADR cases unchanged, `test-diagnostics` with the new code registered, `test-spec-workbench` (doctor and render carry DDR findings and registers), `test-visible-id-consumers`, `test-workbench-layout` (template placeholder vocabulary), `test-skill-catalog` and `test-control-fidelity` pass; a fixture room's `new --kind ddr`, `validate` and `register` run end to end; the full AGENTS suite passes on the committed candidate.

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

- [ ] `new --kind ddr` writes a `DDR`-identified record into `ddr/proposed/`
      with the three frontmatter keys and refuses an existing path.
- [ ] `validate` reports `invalid-ddr` for a DDR naming the Wiki in
      `canonicalized_in`, in any folder, and leaves ADR findings unchanged.
- [ ] `register` writes the DDR register and history; `doctor` reports a
      stale DDR register and the Spec and Task moves regenerate it. (Corrected
      at implementation: `render` regenerates no decision register, for ADRs
      either; the moves and `adr.mjs register` do.)
- [ ] Runbook, template mirrors, `to-docs` and the Wiki article agree with
      the shipped commands.

## Boundaries

No accept, supersede or deprecate move (TK-004Y) and no read word (TK-004Z). No
landmark field on the DDR template: how a DDR records its landmark is open
and waits on the LANDMARK.md capability. No DDR content from the Blueprint
teardown, no root `BLUEPRINT.md` change, and no `LEXICON.md` or
`templates/LEXICON.md` edit (the last Task).
