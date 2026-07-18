---
name: checkpoint
description: Save a checkpoint of an in-progress grilling session — commit the notepad so it can be resumed later on another workstation or by another agent (Claude <-> Codex). The "stop but not done" exit, counterpart to /make-it-so. Invoke it explicitly.
---

The "not done yet, save for later" exit, and the counterpart to `/make-it-so`. It
does NOT promote anything to canon and does NOT close the chat unless I separately
ask. Its whole job is to make the current session resumable elsewhere.

## 1. Finalize the notepad

The session notepad already lives at `.agents/grilling diary/<...>.md`. Add a
Resume Header at the top so a cold agent on another machine can continue with no
other context:

```markdown
STATUS: PAUSED — CHECKPOINT <YYYY-MM-DD HH:MM> · by <Claude|Codex>
RESUME WITH: "resume <topic>"

## Resume header
- What this is: <one line>
- Done so far: <the [locked] lines>
- Next step: <the first [open] question by its stable ID>
- Blockers / open decisions: <or "none">
```

Keep the stable-ID question list intact — the `[open]`/`[tentative]`/`[locked]`
tags already carry the state.

## 2. Make it durable and cross-boundary (the key step)

The `.agents/grilling diary/` folder is gitignored, so commit a copy into a repo
both workstations and both agents can pull:

- **Project-scoped grill** → commit the notepad into that project's own repo.
- **Workspace/root-scoped grill** → commit it into a tracked `handoffs/` path in
  the workspace mirror (follow the `RUNBOOK.md` version-control steps).

Never commit secrets or restricted data. If the notepad contains anything
sensitive, stop and tell me instead of pushing.

## 3. Report and stop

State the committed notepad path, the commit/branch, the resume phrase, and that
it is safe to stop. On "resume <topic>", pull that repo, open the newest `PAUSED`
notepad, read the Resume Header, and continue the `/grilling` session at the first
`[open]` line — never re-asking a `[locked]` question.
