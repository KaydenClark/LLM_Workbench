# TK-005V - State the corrective rules in the Lexicon Task, Destination Packet and Assembled-Spec review rows

**Task ID:** TK-005V
**Spec ID:** S-004F
**Slice:** State the corrective rules in the Lexicon Task, Destination Packet and Assembled-Spec review rows
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The Lexicon's Task, Destination Packet and Assembled-Spec review rows and their template mirrors state both rules, and no row offers a Wiki claim as a destination for corrective work.
**Planned verification:** Red: a pin over `LEXICON.md` and `templates/LEXICON.md` fails while the Task row says a correction against the same reconciled capability updates its Wiki claim and that Wiki-claim corrective records are supported, the Destination Packet row lists the reconciled Wiki claim for corrective work and says a corrective packet does not resurrect a discarded Spec, and the Assembled-Spec review row says a failed review creates corrective Tasks under the still-open Spec. Green: the three rows state the continue-or-new rule and the new-Spec rule, the Wiki-claim destination remains defined only for a Task that produces a Wiki page, and the Lexicon test and the full AGENTS suite pass on the committed candidate.

## Outcome

The shared vocabulary agrees with the controls and the tools. The Lexicon takes one
writer at a time, so this Task waits for its turn after the Lexicon writer lane;
its rows are given in the Spec's Documentation Impact and the rows are cut to the
accepted decision records, not to agent rationale.

## Scope

The three rows in `LEXICON.md` and `templates/LEXICON.md`, and the Lexicon
pins in `tools/test-adr.mjs` that still read the Destination Packet row's
`or the reconciled Wiki claim` wording (its workflow-meaning check and its
`Packet loses corrective claim` mutation case).
`owner:lexicon-writer-turn` names a turn in the Lexicon writer lane, which the
blocker grammar cannot express as a Task identifier.

## Acceptance

- [ ] No Lexicon row offers a Wiki claim as a destination for corrective work.
- [ ] The three rows state both rules, root and template.

## Boundaries

No other Lexicon row changes here.

## Gate cleared

`owner:lexicon-writer-turn` was a sequencing gate this Spec's own planning created, not an owner decision. The Lexicon turn is released: the Lexicon writer lane finished both of its Lexicon Specs, its last merge is PR #317 (e34c5eaa), contained in origin/integration. Cleared on the Director's direction of 2026-10-03; TK-005T is done (PR #311).
