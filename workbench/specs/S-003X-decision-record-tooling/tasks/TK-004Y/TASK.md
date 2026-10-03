# TK-004Y - Accept, supersede and deprecate ADRs and DDRs by folder location

**Task ID:** TK-004Y
**Spec ID:** S-003X
**Slice:** Accept, supersede and deprecate ADRs and DDRs by folder location
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-004X
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 3 (accept, supersede and deprecate moves work for ADRs and DDRs by folder location, refuse a supersession without exactly one named successor and a deprecation without a stated reason, and leave the register and history derived from the folder listing)
**Planned verification:** Red: new `tools/test-adr.mjs` cases fail because `accept`, `supersede` and `deprecate` are unknown commands. Green: for an ADR and a DDR in a fixture room, `accept` moves a `proposed/` record to the top level, `supersede` moves the replaced record to `archive/` with `superseded_by` naming its one successor and the successor's `supersedes` naming it, `deprecate` moves a record to `archive/` with its `deprecation_reason`; each refusal (no successor, two successors, an unaccepted or cross-kind successor, an empty reason, a record in the wrong folder, an accept that would leave an invalid accepted record, a dirty Git tree) writes nothing; live Markdown links to a moved record are rewritten while append-only evidence rows are left and counted; `validate` is clean and both registers are regenerated after each move. `test-adr`, `test-spec-workbench`, `test-lifecycle-directory-links` and the full AGENTS suite pass on the committed candidate.

## Outcome

The ADR lifecycle the controls describe becomes a command for both kinds of
decision record, so no record is moved or relabelled by hand:

- `adr.mjs accept ID` moves a record out of `proposed/` once its corrections
  are reconciled; it refuses a record that would be invalid as accepted.
- `adr.mjs supersede ID --by SUCCESSOR` replaces an accepted record with
  exactly one accepted successor of the same kind, records both directions
  and moves the replaced record to the permanent `archive/`.
- `adr.mjs deprecate ID --reason TEXT` ends an accepted record without a
  successor, records why, and moves it to `archive/`.

`ID` and `SUCCESSOR` are visible identifiers (`ADR-...` or `DDR-...`); the
prefix selects the kind. No separate approval ceremony is added.

## Scope

- `workbench/tools/adr.mjs`: the three moves for both kinds, writing only the
  frontmatter lines each move owns (terminator-preserving, as `normalize` and
  `migrate-folders` already are), moving the file with `git mv` in a Git room
  and refusing a dirty tree as `migrate-folders` and `move-spec` do, rewriting
  live Markdown links to the moved record outside append-only evidence
  sections, regenerating both registers, and staging the result.
- `workbench/tools/spec-workbench.mjs`: the reference surface Spec and Task
  moves repair includes the DDR collection beside the ADR collection.
- Documentation: the Runbook decision-record section documents the moves and
  their refusals; `templates/RUNBOOK.md` follows; the Wiki article "Decision
  Records and the Concept Map" when it describes the lifecycle as manual.

## Acceptance

- [ ] Each move works for an ADR and a DDR, and the register and history
      remain derived from the folder listing.
- [ ] Supersession refuses zero or several successors and an unaccepted or
      cross-kind successor; deprecation refuses an empty reason.
- [ ] Every refusal leaves the tree byte-identical.
- [ ] Runbook and template mirror describe the shipped moves.

## Boundaries

No read word (TK-004Z). No `rejected` lifecycle folder or move. No change to
an existing record's body. Serialized after TK-004X and before TK-004Z because
all three edit `adr.mjs`, `tools/test-adr.mjs` and the Runbook section. No
`LEXICON.md` or `templates/LEXICON.md` edit.
