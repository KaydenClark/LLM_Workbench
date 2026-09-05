---
name: checkpoint
description: Save a checkpoint of an in-progress grilling session — promote the live notepad into the tracked checkpoints collection so it can be resumed later on another workstation or by another agent (Claude <-> Codex). The "stop but not done" exit, counterpart to /make-it-so. Invoke it explicitly.
---

The "not done yet, save for later" exit, and the counterpart to `/make-it-so`. It
does NOT promote anything to canon and does NOT close the chat unless I separately
ask. Its whole job is to make the current session resumable elsewhere.

## 1. Finalize the notepad

Read `workbench/manifest.json`; it declares every collection below. The session
notepad lives at its `grilling` collection,
`workbench/sessions/grilling/<topic-slug>-<YYYY-MM-DD>.md`, which is untracked
by default. Add a Resume Header at the top so a cold agent on another machine
can continue with no other context:

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

## 2. Promote it to the durable checkpoint collection (the key step)

A live notepad is not durable evidence. Promote a privacy-checked copy into the
tracked `workbench/sessions/checkpoints/` collection with the project's own
runtime tool, then commit it:

```bash
node workbench/tools/sessions.mjs checkpoint \
  --from workbench/sessions/grilling/<topic-slug>-<YYYY-MM-DD>.md \
  --topic <topic-slug>
```

The tool refuses to promote secret-like content, absolute home paths, or email
addresses and names the offending lines; it writes nothing on refusal. Repair
the notepad and rerun rather than bypassing the scan. Commit and push the
promoted copy following the project `RUNBOOK.md` version-control steps; the
live notepad stays where it is.

## 3. Report and stop

State the promoted checkpoint path, the commit/branch, the resume phrase, and
that it is safe to stop. On "resume <topic>", pull that repo, open the newest
`PAUSED` checkpoint in `workbench/sessions/checkpoints/`, copy it back into the
grilling collection as the live notepad, read the Resume Header, and continue
the `/grilling` session at the first `[open]` line — never re-asking a `[locked]`
question.
