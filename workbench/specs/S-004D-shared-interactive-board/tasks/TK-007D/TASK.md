# TK-007D - A comment on a card is saved as its own file under the Grill Board and shown in the card window

**Task ID:** TK-007D
**Spec ID:** S-004D
**Slice:** A comment on a card is saved as its own file under the Grill Board and shown in the card window
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007C
**Destination:** spec-acceptance: A comment and an update request survive reload, regeneration and recovery; the owner can see the request's disposition and any resulting source change.
**Planned verification:** Red then green in tools/test-grill-board.mjs (posting a comment writes exactly one new file under workbench/grill-board/comments/ naming the card identity, its revision, the time and the text; a second comment writes a second file and never rewrites the first; the card window lists both after a server restart and after items are revised; an agent reads them with a bounded CLI command; a path or identity that escapes the folder is refused); then the full suite, render and doctor on the committed candidate.

## Scope

Give each comment its own file in a `comments/` folder under `workbench/grill-board/`, as the owner answered on 2026-10-06 (one artifact each, Markdown or JSON, in a folder under the Grill Board; this Task picks the format and records why). The served page adds a comment box in the card window from TK-007C, the server writes the file, and `tools/grill-board.mjs` gains a read command for agents. Comments only: update requests and how a request reaches an agent stay open in the Spec and are not cut here. Record in the Grill Board README whether the folder is tracked and who commits it.
