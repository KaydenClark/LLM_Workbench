# TK-007N - Every live board question carries reasoned P/V grades

**Task ID:** TK-007N
**Spec ID:** S-004D
**Slice:** Every live board question carries reasoned P/V grades
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007L
**Destination:** spec-acceptance: Every in-scope live question has valid P1–P4 and V1–V4 grades with reasons traceable to its question and governed capability/change. Missing grades remain visible as unclassified rather than receiving invented defaults.
**Planned verification:** Red first: a live-board assertion in `tools/test-grill-board.mjs` that every in-scope item carries a valid Priority and Value with nonempty reasons fails on the ungraded inventory. Green: that assertion and `node tools/grill-board.mjs validate` after grading through the TK-007L grade operation only; a diff check that the grade write changed no question, proposal, draft, sources, brief, identity, applied record or existing history entry and did not touch `answers.json`; a recorded read of a sample across every kind and group checking each reason against the Lexicon meanings and its cited source; then the full Runbook suite on the committed candidate.

## Scope

Assign Priority and Value to the real Grill Board inventory through the
validated grade operation from TK-007L, never by editing `items.json` by hand
(Priority and Value requirement 5).

- Each grade has its own short reason. The Priority reason says when the
  question needs the Owner's attention and why (P1 Interrupt, P2 Committed,
  P3 Secondary, P4 Backlog). The Value reason classifies the **governed
  capability or change** by return versus investment (V1 Quick Win, V2
  Strategic Value, V3 Fill-In, V4 Defer / Eliminate), never the time it takes
  to discuss or approve the question (requirement 1, DDR-001L). Reasons cite
  the governing Spec, decision record, Lexicon entry or control the item
  already sources; no reason invents a source.
- Never combine the two into a score. A question whose basis is genuinely
  unknown stays unclassified with that recorded rather than receiving a
  guessed default.
- Re-read the live inventory at the start: grade the items present then,
  including any added by a lane that landed after planning.

### Reading recorded: "every in-scope live question"

The Owner's scope words were "the grilling board and its questions", with
"DQCs are deferred" (PV-02, DDR-001L). This Task reads AC1 as covering **every
open board item, whatever its kind**, including all 35 `confirm-dqc` items,
because those are board questions the Owner answers on this board. "Deferred"
applies to the DQC records themselves: no DQC file, Tracker field or DQC
maintenance gains P/V. At planning base `9edbed8a` the in-scope set is the 171
items with `status: open` (46 `approve-spec`, 36 `choice`, 35 `confirm-dqc`,
33 `confirm-ddr`, 19 `owner-decision`, 2 `confirm-text`). The nine `withdrawn`
items are retired, not live questions; they stay ungraded and visible as
unclassified. Answer state lives in the untracked `answers.json` and differs by
checkout, so an open item is in scope whether or not it has been answered.

### Acceptance traced

- AC1: delivered here for the live inventory (the validator and unclassified
  display are TK-007L).
- AC5: exercised at inventory scale through the validated operation.

### Out of scope

DQC records and their maintenance, CIC final-call authority, changing any
question's wording or proposal, and applying or writing Owner answers.
