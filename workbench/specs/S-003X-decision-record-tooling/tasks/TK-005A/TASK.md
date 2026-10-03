# TK-005A - Mirror the installed DDR collection, terms and read words into the Lexicons

**Task ID:** TK-005A
**Spec ID:** S-003X
**Slice:** Mirror the installed DDR collection, terms and read words into the Lexicons
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-004W, TK-004X, TK-004Y, TK-004Z
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 6 (source behavior, templates, the manifest declaration, Genesis and the update route agree) for the Lexicon rows, and the Spec's Documentation Impact
**Planned verification:** Red: `tools/test-control-fidelity.mjs` or `tools/test-controls-vocabulary-sweep.mjs` gains a check that fails while `templates/LEXICON.md` lacks the Decision Record, DDR and Read words rows or the root Lexicon still calls the installed collection not installed. Green: those tests, `test-blueprint-contract`, `test-workbench-layout` (template placeholder vocabulary, if any template wording changes) and the Wiki lint of touched pages pass; `node tools/evaluate-workbench.mjs --path templates --include-controls` holds its score; the full AGENTS suite passes on the committed candidate; a post-change self-drift receipt shows no new current-facing drift.

## Outcome

Once the collection, command, moves and read words are installed, the
Lexicons stop describing them as future and a generic room's Lexicon carries
the same vocabulary its tools now answer:

- Root `LEXICON.md`: the Decisions route, DDR, Decision Record and Read words
  rows say the `ddr` collection and its commands are installed (they say "not
  installed yet" today), and the Collection row lists `docs/ddr` with the
  other declared collections.
- `templates/LEXICON.md`: the Decision Record, DDR and Read words rows, the
  narrowed Blueprint row (not an ADR or DDR inventory; links no record that
  carries an identifier), the Decisions route naming the DDR register, and the
  Collection row naming `docs/ddr`, all generic and placeholder-free where the
  root rows name this room's records.

## Scope

`LEXICON.md`, `templates/LEXICON.md`, and the Wiki article "Decision Records
and the Concept Map" if its remaining claims depend on these rows. The
template Blueprint instruction itself ships with TK-004X; this Task carries
only the Lexicon's Blueprint row.

## Acceptance

- [ ] No current-facing Lexicon row presents the installed DDR tooling as
      pending.
- [ ] The generic Lexicon defines Decision Record, DDR and Read words once,
      with no room-specific identifier.
- [ ] Root and template rows agree with the shipped commands.

## Boundaries

Blocked until the owner's Codex Lexicon reconciliation branch
(`codex/s01u-tk01q-lexicon-reconciliation`, Lexicon Design-Concept
Reconciliation Task TK-01Q, unmerged at Plan on 2026-10-03) lands or the owner
releases these files: it edits both Lexicons, and this Task must not touch,
rebase, merge or close it. Remove the `owner:` blocker only when that branch is
contained in `integration` or the owner says to proceed.

Blocker cleared on 2026-10-03 by the Spec's single writer: the owner directed
the merge of PR #281 (`codex/lexicon-snag-recovery`, merged
2026-10-03T13:09:58Z), which carries the October 1 reconciliation tip
`e46d587b`; `git merge-base --is-ancestor e46d587b origin/integration`
succeeds (integration `bbfcd37b` and later), and its branches are deleted.
That PR also corrected the root Lexicon DDR row's "not installed yet" claim
(`861657d6`); read both Lexicons at the current integration tip before
editing. No ownership map row
(the Ownership Map Spec takes the DDR row) and no `AGENTS.md` ownership-table
change (the Contract-carrier rewrite owns it).
