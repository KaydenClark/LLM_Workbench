# TK-004Y - Accept, supersede and deprecate ADRs and DDRs by folder location

**Task ID:** TK-004Y
**Spec ID:** S-003X
**Slice:** Accept, supersede and deprecate ADRs and DDRs by folder location
**Status:** done
**Stance:** Builder
**Blockers:** TK-004X
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 3 (accept, supersede and deprecate moves work for ADRs and DDRs by folder location, refuse a supersession without exactly one named successor and a deprecation without a stated reason, and leave the register and history derived from the folder listing)
**Planned verification:** Red: new `tools/test-adr.mjs` cases fail because `accept`, `supersede` and `deprecate` are unknown commands. Green: for an ADR and a DDR in a fixture room, `accept` moves a `proposed/` record to the top level, `supersede` moves the replaced record to `archive/` with `superseded_by` naming its one successor and the successor's `supersedes` naming it, `deprecate` moves a record to `archive/` with its `deprecation_reason`; each refusal (no successor, two successors, an unaccepted or cross-kind successor, an empty reason, a record in the wrong folder, an accept that would leave an invalid accepted record, a dirty Git tree) writes nothing; live Markdown links to a moved record are rewritten while append-only evidence rows are left and counted; `validate` is clean and both registers are regenerated after each move. `test-adr`, `test-spec-workbench`, `test-lifecycle-directory-links` and the full AGENTS suite pass on the committed candidate.
**Proof:** Red 55cbbe26 (test-adr fails at import: no move exports). Green: test-adr 50/50 covering accept, supersede and deprecate for both kinds, every refusal leaving the tree byte-identical, live-link repair with evidence rows left and counted, and a non-Git rename; full AGENTS suite 48/48 on clean cbb7a44a. TK-004X PR #282 (reviewed PASS at b6b20489) merged into integration as 226212f1 before this close; its review P3 (DDR register regeneration in moves only indirectly tested) is answered by this Task's DDR move tests, which assert the DDR register and history after each move.

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

- [x] Each move works for an ADR and a DDR, and the register and history
      remain derived from the folder listing.
- [x] Supersession refuses zero or several successors and an unaccepted or
      cross-kind successor; deprecation refuses an empty reason.
- [x] Every refusal leaves the tree byte-identical.
- [x] Runbook and template mirror describe the shipped moves.

## Boundaries

No read word (TK-004Z). No `rejected` lifecycle folder or move. No change to
an existing record's body. Serialized after TK-004X and before TK-004Z because
all three edit `adr.mjs`, `tools/test-adr.mjs` and the Runbook section. No
`LEXICON.md` or `templates/LEXICON.md` edit.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-tk004y-lifecycle-moves | cbb7a44a9965742e1ed38ceabb635623da5eba70 | ahead 0 behind 0 | 0 | Red 55cbbe26: tools/test-adr.mjs exits 1 at import because adr.mjs exports no acceptRecord, supersedeRecord or deprecateRecord. Green: test-adr 50/50 (five new cases: accept for a DDR and an ADR with staged git rename, leftover status dropped, live links repaired and registers regenerated; supersede for a DDR and via CLI for an ADR with superseded_by, successor supersedes list, repaired live Spec link and an evidence-row reference left and counted; deprecate with its reason; fourteen refusals plus an invalid-accept, a dirty-tree and a repeated --by CLI refusal each leaving the tree byte-identical; a non-Git rename). Full AGENTS suite 48/48 on clean cbb7a44a, including test-spec-workbench and test-lifecycle-directory-links after planReferenceRewrite moved into adr.mjs. | RUNBOOK decision-record section (move commands and their refusals), templates/RUNBOOK command block and paragraph, Wiki article Decision Records and the Concept Map (moves installed). | Read words (TK-004Z) and Lexicon mirrors (TK-005A) remain; separate-context review of the final head pending. | 1629df81c303c4b3041ebbb50e8166c1325dfa4463b2087cd1458d96f740ea0e |
| 2 | claude/s003x-tk004y-lifecycle-moves | 995d6b804b58afd27f1f4967cee7011b1ec391e3 | ahead 0 behind 0 | 0 | Red 55cbbe26 (test-adr fails at import: no move exports). Green: test-adr 50/50 covering accept, supersede and deprecate for both kinds, every refusal leaving the tree byte-identical, live-link repair with evidence rows left and counted, and a non-Git rename; full AGENTS suite 48/48 on clean cbb7a44a. TK-004X PR #282 (reviewed PASS at b6b20489) merged into integration as 226212f1 before this close; its review P3 (DDR register regeneration in moves only indirectly tested) is answered by this Task's DDR move tests, which assert the DDR register and history after each move. | RUNBOOK and templates/RUNBOOK decision-record move commands and refusals, and the Wiki article Decision Records and the Concept Map updated. | TK-004Z (read words) and TK-005A (Lexicon mirrors) remain; separate-context review of this Task's final head precedes its integration merge. | 7873e7f7d191ffbfa035d24e8c49e5fc56c68039f1ab1a787babcfdee00bd39d |
