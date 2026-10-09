# Disposable project Board browser verification

2026-10-09, Servitor Chrome, source 864c90f6ffe389ea33486892ad379b9d07d479cb.
Fresh disposable Git project; no live owner Board, service or answers touched.
Manual 127.0.0.1:4767 server, unique ringworld-browser-qa-only instance key.

Observed through the page:

- Configured RingWorld disposable title and Guns topic, with group-based filtering.
- Full GUNS.md and DRAFT.md text in separate source dialogs; explicitly proposed
  draft text remained separate from current context.
- Literal script markup displayed as text, with no executable embedded HTML.
- Correct verdict and exact typed correction saved through the page.
- Agent revision retained that correction and displayed Re-answer; stale apply
  refused with answered revision 1 versus current revision 2.
- Fresh Confirm and exact new note saved through the page. Prior correction
  remained in answer history. After carrying the disposable words to GUNS.md,
  agent apply recorded them; page reload showed one applied, zero with agents.
- answers.json ignored and absent from git ls-files. No real decision recorded.

Fixture commit refs test link formatting, not remote existence. Real deployment
must supply commits actually containing its named text. The inherited renderer
keeps an old stale-warning paragraph until reload after a fresh confirmation;
persisted answer and counters update correctly. This is documented, not a claim
that the wider Dashboard has been corrected.

CLI readback exposed producer repository links in show output. Worker corrected
that separately at 22d3f06d61a1dab7aa6b219f50b0c308b7fce160, with a failing
public regression followed by 28 passing checks. Page/rendering/protocol bytes
were unchanged by that CLI correction.

Screenshot retained in task deliverables as optional-board-browser-applied.jpg;
it shows disposable QA, not owner acceptance or in-game testing.
