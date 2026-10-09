# TK-007Z - The Grilling Board takes the owner's three layout corrections: P/V chips, a left navigation pane and a progressively disclosed card

**Task ID:** TK-007Z
**Spec ID:** S-004D
**Slice:** The Grilling Board takes the owner's three layout corrections: P/V chips, a left navigation pane and a progressively disclosed card
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The P1–P4 and V1–V4 chips filter the list on click (OR within a row, AND across rows, no chip means all) and replace the P/V dropdowns; the five section links are a persistent left navigation pane with the Grilling Board filters under them, hash routes intact and no horizontal scroll at a narrow width; an opened card shows only its title, question, closed P/V badges, link row, recommendation and answer controls, with every other part one closed line.
**Planned verification:** Red first in `tools/test-dashboard-board.mjs`: no chip toggle, section links still in the top bar, card blocks starting open. Green: the three page tests above plus the adjusted P/V and badge tests in `tools/test-dashboard-board.mjs` and `tools/test-grill-board.mjs`; `node tools/grill-board.mjs validate`; a browser check of the served page at desktop and 375px width (no horizontal scroll, no `details[open]` on the opened card); the Full Runbook suite on the committed candidate.

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
