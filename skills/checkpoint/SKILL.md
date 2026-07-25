---
name: checkpoint
description: Save a checkpoint of an in-progress grilling session — finalize the notepad in the Intent lane so it can be resumed later by another agent or session (Claude <-> Codex) on this host. The "stop but not done" exit, counterpart to /make-it-so. Invoke it explicitly.
---

The "not done yet, save for later" exit, and the counterpart to `/make-it-so`. It
does NOT promote anything to canon and does NOT close the chat unless I separately
ask. Its whole job is to make the current session resumable.

## 1. Finalize the notepad

The session notepad already lives in the Intent lane at
`$TMPDIR/.foundry/<topic-slug>-<YYYY-MM-DD>.md`. Add a Resume Header at the top
so a cold agent can continue with no other context:

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

## 2. Make it durable (the key step)

`/save` (plane: Intent). The notepad's durable home is the Intent lane itself —
one host-level, gitignored, absolute path outside every repo — so durability
means the finalized file exists at that absolute path, nothing more. Never
commit the notepad into a tracked repo: an Intent artifact in git resurrects on
pull and leaks into the mirror. Cross-host transfer is explicit-only — a
self-contained handoff pasted into the other session — not git.

Never persist secrets or restricted data. If the notepad contains anything
sensitive, stop and tell me instead.

## 3. Report and stop

State the notepad's absolute path, the resume phrase, and that it is safe to
stop. On "resume <topic>", open the newest `PAUSED` notepad in
`$TMPDIR/.foundry/`, read the Resume Header, and continue the `/grilling`
session at the first `[open]` line — never re-asking a `[locked]` question.
