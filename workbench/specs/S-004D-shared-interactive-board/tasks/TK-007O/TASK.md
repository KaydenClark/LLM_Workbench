# TK-007O - Agents reassess P/V when updating cards from Owner answers, shown on the real board

**Task ID:** TK-007O
**Spec ID:** S-004D
**Slice:** Agents reassess P/V when updating cards from Owner answers, shown on the real board
**Status:** done
**Stance:** Builder
**Blockers:** TK-007M, TK-007N
**Destination:** spec-acceptance: A demonstrated answer-to-card-update cycle shows the agent assessing whether each affected grade's basis changed, retaining grades when it did not and recording justified revisions when it did. No periodic DQC work is needed.
**Planned verification:** Red first in `tools/test-grill-board.mjs`: a fixture cycle (Owner answer saved through the page path, agent `apply`/`revise`, then the P/V assessment) fails while the reassessment is not recorded or a retained grade cannot be told from an unassessed one. Green: that cycle for one retained and one revised grade, with identity, history and the Owner's answer preserved and `answers.json` untouched by agent operations; then the browser scenario on a disposable copy of the real inventory recorded in a proof receipt; then the full Runbook suite on the committed candidate.
**Claimed by:** claude-dashboard-director
**Proof:** reassess operation records a retained or revised P/V assessment with its basis and the answer it followed, using the stale gradeRevision check and never touching revision or answers; fixture cycle with one retained and one revised grade in tools/test-grill-board.mjs; real-inventory P3V1 -> reason -> central question -> answer -> apply -> reassess scenario on a disposable copy (proof/owner-flow-demo-a857b658.json step 10, repeated by the fourth reviewer). Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence)

## Scope

Close the loop the Owner asked for: the only maintenance in this proof is
between answering questions and updating question cards from those answers
(PV-02, Priority and Value requirement 5).

- **Procedure** (`workbench/grill-board/README.md`, the answer-processing
  steps): when an agent applies or revises an item from an Owner answer, it
  reassesses that item's P and V and any other card the answer changes. It
  retains a grade whose basis did not change and records that it assessed it;
  it changes a grade only when its basis changed, through the grade operation
  with a reason; and it follows an Owner-directed correction. No periodic
  sweep, no DQC work.
- **Tool**: the smallest addition that makes the reassessment visible and
  checkable (for example a P/V assessment note on `apply`/`revise` history, or
  the grade operation recording a retained grade). Identity, source lineage,
  revision history and saved answers are preserved; agents never write
  `answers.json`.
- **Real-board Owner scenario** on a disposable copy of the real inventory,
  never the Owner's live `answers.json`: filter P3V1, open a grade explanation,
  open the question centrally, answer it, apply it as an agent, reassess its
  P/V and show the updated card. Also start a fixed batch from a P/V slice,
  pause, resume and reload. Record the exact candidate and source commit,
  the matched question identities, results and limits in a proof receipt
  under this Spec.

### Acceptance traced

- AC6: delivered here.
- AC7: the browser scenario and receipt are delivered here. Technical tests
  and this scenario do not establish Owner usefulness or Human QA; those
  remain the Owner's.
- AC4 and AC5: repeated on the real inventory as part of the scenario.

### Out of scope

DQC P/V and DQC maintenance, a periodic regrading system, an automatic
recommended batch, and Owner Human QA.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/workbench-dashboard-first-pass | bd4ad2481c0577ec7d29fe105b874c9e7764d045 | ahead 0 behind 0 | 0 | reassess operation records a retained or revised P/V assessment with its basis and the answer it followed, using the stale gradeRevision check and never touching revision or answers; fixture cycle with one retained and one revised grade in tools/test-grill-board.mjs; real-inventory P3V1 -> reason -> central question -> answer -> apply -> reassess scenario on a disposable copy (proof/owner-flow-demo-a857b658.json step 10, repeated by the fourth reviewer). Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence) | workbench/grill-board/README.md: answer-processing step to reassess P/V on every card an answer updates | none | 686081702d11d95f69a9e7da6a8fc597047f745d340d9fdb42e0d2e79271b245 |
