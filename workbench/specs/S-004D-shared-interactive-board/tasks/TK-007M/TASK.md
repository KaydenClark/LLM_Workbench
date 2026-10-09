# TK-007M - The Owner filters board questions by P, V or both into a fixed answering batch

**Task ID:** TK-007M
**Spec ID:** S-004D
**Slice:** The Owner filters board questions by P, V or both into a fixed answering batch
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007L
**Destination:** spec-acceptance: P1V2, P3V1, P2 alone and V alone return exactly their matching questions. Clearing filters restores the wider inventory; other board filters still combine.
**Planned verification:** Red first at the page's slice seam (`matchesSlice` and the batch model, loaded through the existing `sliceModel()` harness in `tools/test-grill-board.mjs`): a fixture of graded and unclassified items where P1V2, P3V1, P2 alone and V1 alone must return exactly their members fails before the filters exist. Green: those exact sets; P alone spans every Value and V alone every Priority; clearing restores the whole inventory; P/V combine with topic, intent, scope, workflow stage and search; unclassified items are reachable without an invented grade; a batch started from a P/V slice keeps its membership and revisions through saves, pause/resume and reload; selecting a slice changes no grade; topic navigation keeps matching members reachable and shows no per-topic P/V score. Then a disposable-copy browser check and the full Runbook suite on the committed candidate.

## Scope

Independent Priority and Value filters on the existing page, combined with the
board's existing filters and its Owner-selected fixed batch (Priority and Value
requirement 4). Layers: the page's slice model and controls in
`workbench/grill-board/index.html`, any view data it needs from
`tools/grill-board.mjs`, the tests and the README procedure.

- A P selector and a V selector, each with an all/none-selected state. P alone
  includes every Value in that Priority (so P1 stays visible at any Value); V
  alone includes every Priority in that Value; both together select their
  intersection, including slices without P1 such as P3V1.
- Unclassified items match no specific grade, stay reachable when no P/V
  filter is set, and can be found as unclassified so missing grades stay
  visible rather than hidden.
- P/V combine with topic, intent, scale, workflow stage and search. "All
  topics" (reset) also clears P/V.
- The existing fixed batch keeps its rules: starting a batch from a P/V slice
  freezes its membership; selecting another slice, saving answers or a later
  regrade never adds, drops or regrades a member; drafts, pause/resume, reload
  and history behave as today; nothing is double counted.
- Explicit selection of a slice changes no grade and injects no unrelated
  question. No automatic recommended batch is added: the Owner chooses.

### Reading recorded: decision-group navigation

Requirement 4 says decision-group navigation must keep matching member
questions reachable without inventing one aggregate P/V score for a group.
At planning base `9edbed8a` the page's only grouping navigation is the
**topic grouping** (the topic cards in the overview and the "Think about"
topic selector, `TOPICS` in `index.html`); `items.json` `groups` are record
homes that the page does not render as navigation. This Task ties the rule to
that topic grouping: with a P/V filter set, the topic cards and topic selector
count and open only matching members, every matching member stays reachable
through its topic, and no topic or group shows a combined, averaged or summed
P/V grade. The `decisions` record-home groups exist only on the unpublished
`codex/consequential-decision-board` lane (local commit `724a5d52`). If that
lane lands on integration before this Task is implemented, apply the same rule
to its decision-record groups and say so in this Task's proof; this Task does
not depend on it or build it.

### Acceptance traced

- AC3 (exact P/V matches, clearing, combination with other filters): delivered here.
- AC4 (fixed batch from a P/V slice with details, answers, pause/resume and
  reload preserved): delivered here at the page-model and disposable-browser
  level; TK-007O repeats it in the real-inventory Owner scenario.

### Out of scope

New grades or inventory grading (TK-007N), the answer-to-card-update cycle
(TK-007O), an automatic recommended batch, ordering by a combined score, and
DQC P/V.
