# TK-007L - An agent grades one board question and the Owner opens its P/V badges and reasons

**Task ID:** TK-007L
**Spec ID:** S-004D
**Slice:** An agent grades one board question and the Owner opens its P/V badges and reasons
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Numbered red P and amber V badges appear on the right of question cards; clicking each reveals its own rationale without replacing or answering the question. Opening the question centrally shows all information, P/V and reasons.
**Planned verification:** Red first in `tools/test-grill-board.mjs`: the validator refuses an item carrying Priority/Value fields today (unknown field), and a `grade` operation does not exist. Green: valid P1–P4 / V1–V4 grades with nonempty reasons pass; P5, V0, a grade without a reason, a combined score field and an unknown grade field are refused with the prior `items.json` bytes unchanged; a stale grade write is refused; the grade write never creates or changes `answers.json`; an ungraded item still validates and the page model reports it unclassified; the page model renders both badges on the row, opens each reason separately without opening the question, and the central view shows P, V and both reasons beside the unchanged question, proposal, sources, history and answer controls. Then a disposable-copy browser check of one graded real item, `node tools/grill-board.mjs validate` on the live board and the full Runbook suite on the committed candidate.
**Claimed by:** claude-dashboard-director
**Proof:** Grade schema and validated grade operation (gradeItems, grade CLI; P1-P4/V1-V4 with reasons, stale gradeRevision refused, revision and answers untouched); red P and amber V badges opening only their own reason; central view with both reasons. tools/test-dashboard-board.mjs 38/38, tools/test-grill-board.mjs 18/18; graded real item checked in the browser on a disposable copy (proof/owner-flow-demo-a857b658.json). Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence)

## Scope

The tracer bullet. One narrow behavior through every board layer: item schema
and validator, a validated grade operation, the merged view, the page and the
tests. It proves the path end to end on one question; the real inventory is
graded in TK-007N and filtering is TK-007M.

- **Schema and validator** (`tools/grill-board.mjs`, `ITEM_KEYS` and
  `validateItem`): add optional, separate Priority and Value classifications,
  each a grade (`P1`–`P4`, `V1`–`V4`, the unchanged
  [Lexicon](../../../../../LEXICON.md#priority-and-value) labels) and its own
  nonempty, source-backed reason. Never a combined or summed field. An item
  without them stays valid and is shown as unclassified, never defaulted
  (Priority and Value requirement 1; acceptance "Missing grades remain visible
  as unclassified").
- **Grade operation**: a CLI command (and exported function) that sets or
  changes one item's grades with `--by` and `--reason`, validates before the
  atomic write, appends an item history entry naming the grade change, refuses
  a write made against a stale read of the item, and never writes
  `answers.json`. Accepting a batch file in the `add --file` style is in scope
  so TK-007N can grade the inventory through this same operation.
- **View and page** (`mergeBoard`, `workbench/grill-board/index.html`): numbered
  red `P#` and amber `V#` badges on the right of each question row; clicking a
  badge opens a small card with that grade's own reason, closed until
  requested, without opening, replacing or answering the question. The central
  question view shows P, V and both reasons and preserves original question
  text, proposal, sources, corrections, answer history and the existing answer
  controls (requirements 2 and 3). An unclassified item shows that state.
- **Procedure**: document the grade fields and command in
  `workbench/grill-board/README.md` and keep the planned-design notice
  accurate for what this slice delivers.

### Acceptance traced

- AC2 (badges, rationale, central detail): delivered here.
- AC5 (validated grade updates, refusals, never writes Owner answers): its
  operation and refusals are delivered here; TK-007O exercises it in the
  answer-to-card-update cycle.
- AC1 (unclassified stays visible, no invented default): the validator and
  page half is delivered here; the inventory half is TK-007N.

### Choice to settle and record in this slice

Whether a grade change bumps the item's `revision`. Today `revise` bumps it,
which shows an existing Owner answer as Re-answer. A grade is guidance about
the question, not the proposal the Owner answered. Recommended: record grade
changes in item history with their own stale-write check and leave `revision`
for changes to what the Owner answers, so a regrade never silently stales an
Owner answer. Either way, record the choice and its reason in the README and
this Spec's evidence.

### Out of scope

P/V filters and batches (TK-007M), the real inventory grades (TK-007N), the
answer-to-card-update cycle (TK-007O), DQC P/V, an automatic recommended batch
and any summed score.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/workbench-dashboard-first-pass | 0c8a9d18acd4d37181648dce69e4d6a630afee33 | ahead 0 behind 0 | 0 | Grade schema and validated grade operation (gradeItems, grade CLI; P1-P4/V1-V4 with reasons, stale gradeRevision refused, revision and answers untouched); red P and amber V badges opening only their own reason; central view with both reasons. tools/test-dashboard-board.mjs 38/38, tools/test-grill-board.mjs 18/18; graded real item checked in the browser on a disposable copy (proof/owner-flow-demo-a857b658.json). Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence) | workbench/grill-board/README.md: grade fields, grade command and why a grade change keeps revision | none | 65b63743ac2a9c43aa442f87b040ac9338adedfdb72aa96ad62ba96a5c4fb594 |
