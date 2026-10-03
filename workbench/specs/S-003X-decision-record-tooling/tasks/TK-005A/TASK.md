# TK-005A - Mirror the installed DDR collection, terms and read words into the Lexicons

**Task ID:** TK-005A
**Spec ID:** S-003X
**Slice:** Mirror the installed DDR collection, terms and read words into the Lexicons
**Status:** done
**Stance:** Builder
**Blockers:** TK-004W, TK-004X, TK-004Y, TK-004Z
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 6 (source behavior, templates, the manifest declaration, Genesis and the update route agree) for the Lexicon rows, and the Spec's Documentation Impact
**Planned verification:** Red: `tools/test-control-fidelity.mjs` or `tools/test-controls-vocabulary-sweep.mjs` gains a check that fails while `templates/LEXICON.md` lacks the Decision Record, DDR and Read words rows or the root Lexicon still calls the installed collection not installed. Green: those tests, `test-blueprint-contract`, `test-workbench-layout` (template placeholder vocabulary, if any template wording changes) and the Wiki lint of touched pages pass; `node tools/evaluate-workbench.mjs --path templates --include-controls` holds its score; the full AGENTS suite passes on the committed candidate; a post-change self-drift receipt shows no new current-facing drift.
**Proof:** Red 62c1cf50 (control-fidelity Lexicon vocabulary case fails). Green: control-fidelity, controls-vocabulary-sweep, blueprint-contract, evaluate-workbench and workbench-layout pass; templates evaluator 106.6/113 unchanged; full AGENTS suite 48/48 on clean b0730364. Owner blocker cleared with PR #281 evidence (e46d587b contained in integration). TK-004Z PR #287 (reviewed PASS at ec5e6d16) merged into integration as 23f42ab2 before this close.

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

- [x] No current-facing Lexicon row presents the installed DDR tooling as
      pending.
- [x] The generic Lexicon defines Decision Record, DDR and Read words once,
      with no room-specific identifier.
- [x] Root and template rows agree with the shipped commands.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-tk005a-lexicon-mirrors | b073036404cec8bb8b30182646c2b02cab3c1749 | ahead 0 behind 0 | 0 | Red 62c1cf50: tools/test-control-fidelity.mjs new case fails (LEXICON.md lists no ddr collection). Green: test-control-fidelity, test-controls-vocabulary-sweep, test-blueprint-contract, test-evaluate-workbench and test-workbench-layout pass; templates evaluator holds 106.6/113 (same as before); wiki validated; full AGENTS suite 48/48 on clean b0730364. | LEXICON.md (Decisions and rationale routes, DDR, Decision Record, Read words, Projection, Archive, Collection rows), templates/LEXICON.md (Decision Record, DDR and Read words rows, DDR register routes, Blueprint, Projection, Archive, Collection rows, Governance Core intro), Wiki article Decision Records and the Concept Map. | Whole-Spec QA, self-drift post receipt and separate-context review of the assembled candidate remain; AGENTS.md documentation-ownership table and the ownership map carry no DDR row (owned by the Contract-carrier rewrite and Ownership Map Specs). | 5ad9b6377efbf182049d6f1d944b76fa4de6c7ec34e209bfadeb373a43513340 |
| 2 | claude/s003x-tk005a-lexicon-mirrors | 70aa1625be4f6cded4be24ce8b995bc17ec05e33 | ahead 0 behind 0 | 0 | Red 62c1cf50 (control-fidelity Lexicon vocabulary case fails). Green: control-fidelity, controls-vocabulary-sweep, blueprint-contract, evaluate-workbench and workbench-layout pass; templates evaluator 106.6/113 unchanged; full AGENTS suite 48/48 on clean b0730364. Owner blocker cleared with PR #281 evidence (e46d587b contained in integration). TK-004Z PR #287 (reviewed PASS at ec5e6d16) merged into integration as 23f42ab2 before this close. | LEXICON.md, templates/LEXICON.md and the Wiki article Decision Records and the Concept Map updated. | Whole-Spec QA and separate-context review of the assembled candidate remain; owner Human QA and main promotion are the owner's. | e84b8c2278bccae7b97820000c344beb09d57053bbd3733486d467b7747be31a |
