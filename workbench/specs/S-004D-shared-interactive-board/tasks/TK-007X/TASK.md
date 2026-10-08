# TK-007X - The Owner critiques, revises and confirms exact wording, then explicitly hands confirmed cards to promotion

**Task ID:** TK-007X
**Spec ID:** S-004D
**Slice:** The Owner critiques, revises and confirms exact wording, then explicitly hands confirmed cards to promotion
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The answer controls are Confirm, Rework wording, Change the why and Change; every answer except confirming the recommended one is refused until a note is typed; there is no Not now or Decline; Change the why answers appear in a filterable Whys list. A question with alternatives preselects the recommended one and Confirm confirms the selection; a Spec delivery approval is approved by Confirm and sent back with the note otherwise. Progressive answers, Change requests, agent revisions, exact approval snapshots, repeated rounds and explicit promotion requests survive restart; a knowledge-only promotion creates no Spec or Task.
**Planned verification:** Red first in `tools/test-dashboard-board.mjs` and `tools/test-dashboard-workflow.mjs`: a non-confirm answer without a note is accepted, the legacy values are relabeled, and a promotion can start from an unconfirmed or stale card. Green: the four controls and adapted alternatives on the server and page through one shared helper; legacy answers read with their original labels and statuses; approval snapshots bind the exact wording and hash; a stale browser action or stale approval cannot overwrite or promote newer content; a Change awaiting revision blocks promotion; ending a round starts nothing; ordered Record → Publish → Map → Publish → Plan → Publish receipts with a visible no-op reason for knowledge-only Map and Plan; restart reconstructs identical state. Then the disposable-copy browser flow and the Full Runbook suite on the committed candidate.

## Scope

- **Answer controls** (`tools/grill-board.mjs`, `index.html`): new verdicts
  `confirm`, `rework`, `change_why` and `change`; alternatives shown as the
  recommended answer and lettered options; Spec delivery approval Confirm
  records `approve`. Existing answers keep their stored values and meanings.
- **Whys list:** the filterable list of Change the why answers.
- **Owner working flow** (`tools/dashboard-workflow.mjs`): one file per comment
  or Change request in `workbench/grill-board/comments/`, owner answers and
  rounds in the git-ignored notepad, idempotent action identities, explicit
  single-card and selected-card promotion requests, ordered disposition
  receipts linking existing durable owners, and distinct requested, recorded,
  published, mapped, planned and implemented states.
- **Procedure** (`workbench/grill-board/README.md`): the controls, Whys,
  rounds, promotion handoff and how an agent records a disposition.

### Out of scope

Automatic agent activation after an answer or confirmation, a dispatch
service, performing actual promotions for real Owner answers, and revising the
question inventory.
