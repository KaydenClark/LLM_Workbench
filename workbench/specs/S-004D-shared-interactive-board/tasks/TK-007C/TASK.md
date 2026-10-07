# TK-007C - A clicked card opens as a window centered over the board

**Task ID:** TK-007C
**Spec ID:** S-004D
**Slice:** A clicked card opens as a window centered over the board
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Owner can find and open connected execution and understanding cards in one browser workspace and switch views without losing artifact identity.
**Planned verification:** Red then green in tools/test-grill-board.mjs (the served page carries the card window, opened from a card and closed back to the same list position and batch, with Escape and the close control); a browser check on a served fixture board that a click opens the centered window and closing it keeps the active batch, saved notes and scroll; then the full suite, render and doctor on the committed candidate.

## Scope

Grow the existing card view in `workbench/grill-board/index.html`: clicking a card opens its full contents (question, brief, sources, history and the answer controls) in a window centered over the board, instead of expanding in place (the owner, 2026-10-06). The board behind stays put, and closing the window returns to the same place. No new storage and no server change.
