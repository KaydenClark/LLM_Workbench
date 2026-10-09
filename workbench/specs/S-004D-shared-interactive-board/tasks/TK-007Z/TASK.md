# TK-007Z - The Grilling Board takes the owner's three layout corrections: P/V chips, a left navigation pane and a progressively disclosed card

**Task ID:** TK-007Z
**Spec ID:** S-004D
**Slice:** The Grilling Board takes the owner's three layout corrections: P/V chips, a left navigation pane and a progressively disclosed card
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The P1–P4 and V1–V4 chips filter the list on click (OR within a row, AND across rows, no chip means all) and replace the P/V dropdowns; the five section links are a persistent left navigation pane with the Grilling Board filters under them, hash routes intact and no horizontal scroll at a narrow width; an opened card shows only its title, question, closed P/V badges, link row, recommendation and answer controls, with every other part one closed line.
**Planned verification:** Red first in `tools/test-dashboard-board.mjs`: no chip toggle, section links still in the top bar, card blocks starting open. Green: the three page tests above plus the adjusted P/V and badge tests in `tools/test-dashboard-board.mjs` and `tools/test-grill-board.mjs`; `node tools/grill-board.mjs validate`; a browser check of the served page at desktop and 375px width (no horizontal scroll, no `details[open]` on the opened card); the Full Runbook suite on the committed candidate.
**Claimed by:** claude-board-ui-corrections-2026-10-09

## Scope

Owner corrective work on the Workbench Dashboard (S-004D), confirmed by Kayden
in chat on 2026-10-09 after the first answering round on draft PR #440:

1. **P/V chips.** "The filters are all tax, none of them are helping me make
   choices faster. I should be able to select the P or V values here and it
   dynamically filter." P1–P4 and V1–V4 become clickable chips in the badge
   colors, multi-select within a row, rows combined as AND, no chip means all;
   the list and every count update on click. They replace the Priority and
   Value dropdowns. The kind, topic and scale dropdowns fold under a closed
   **More filters** line, a reversible default the owner has not yet ruled on.
2. **Left navigation.** "Switch where the destination tracker, taskboard,
   grilling board, drafts, wiki, etc are at the top to on the left side, that
   should be my navigation pane." The five section links move into a
   persistent left pane; the Grilling Board filters sit under them.
3. **Progressive disclosure.** "The Priority and Value need to be collapsed even
   when I click into the card for more details… we should keep them available
   on the page like the links to the spec, ADR, and draft." An opened card
   shows title, question, closed P/V badges, a compact link row, the
   recommendation and the answer controls; why, impact, changes, history,
   current text, evidence, related cards, proposed wording and the
   comments-and-promotion block each start as one closed line.

### Out of scope

The owner's tentative note 3 (a visible control for leaving a topic) and
unconfirmed note 5 (editable owner notes); any change to `items.json` (a
parallel reconcile lane owns it); the owner's answer files; merging PR #440.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/grilling-board-ui-corrections-2026-10-09 | 2586e26017a2c5ca9f6d41a0438a434a5a77b2ca | ahead 0 behind 0 | 1 | Red first in tools/test-dashboard-board.mjs (no chip toggle; section links in the top bar; card blocks starting open), then green: tools/test-dashboard-board.mjs 48/48, tools/test-grill-board.mjs 18/18, node tools/grill-board.mjs validate ok (212 items on the reconciled board); browser check of the served page from this worktree at desktop and 375px (scrollWidth equals clientWidth, zero details[open] on the opened card, chip counts follow the stage filter: To answer gives P1 1, P2 2, P3 17, P4 15); Full Runbook suite 60/60 on committed candidate 2586e260 (2026-10-09T03:29Z to 03:44Z), rebased onto the reconciled PR #440 tip f62bdd49 | workbench/grill-board/README.md (P/V chips, left pane, opened-card disclosure, section links); SPEC.md (confirmed corrections subsection, P/V items 3-4, acceptance line); no Wiki page describes the board layout, so the Wiki needs no update | Owner call pending on the folded More filters dropdowns (fold or remove); the All stages default still lists 177 withdrawn questions; owner notes 3 (leaving a topic) and 5 (editable notes) are not built | 8d9ec8da29cb5541a65749a1971b9c125b0a38b0c18486a260297d745c771b15 |
