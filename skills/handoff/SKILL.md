---
name: handoff
description: Author a handoff — a compaction of this session written so another context can continue from it. Use on any of three triggers - transfer (work is done and must cross to another agent, role, or session), boundary (context is degrading — a compaction happened, established facts are being re-derived, or the owner says you're forgetting), or spin-off (one topic would siderail this session and should move to a fresh chat while this session continues). Re-invocable at any point; never ends the session.
argument-hint: What will the next session be used for? For a spin-off, name the one topic to hand off.
---

# Handoff

A handoff is an **authored compaction**: the deliberately chosen parts of this
session, written so the next context starts sharp instead of rediscovering them.
It is an Intent-plane document — it may propose, it never authorizes, and it
promotes nothing to Canon, Grounding, or the Wiki. It is a handshake between
agents, not a promotion vehicle.

Author it **early, while still sharp** — never as a terminal step. Re-invoke it
at any point, any number of times; a stale handoff is cured by authoring it
again. After a machine compaction, read the handoff back instead of trusting the
automatic summary — the authored compaction outranks the automatic one.
Authoring a handoff never ends the session: write it, report it, keep working.

## Trigger classes

| Class | Fires when | Source session |
|---|---|---|
| **Transfer** | work is done and must cross to another agent, role, or session | ends or yields |
| **Boundary** | context is degrading | ending anyway |
| **Spin-off** | one topic would siderail this session | continues unharmed |

A spin-off carries exactly one topic, not the whole open tree; most of its
sections will come up empty and be deleted.

## 1. Select the cargo

Decide what the receiver needs — only the chosen parts, not a full summary. The
argument, when given, scopes the selection: for a spin-off it names the one
topic; otherwise it says what the next session is for, and the document is
tailored to that. Search the whole session for the chosen parts — recency is not
relevance. If a running index already exists (a grilling notepad, a spec
evidence log), use it as a retrieval shortcut rather than re-mining the
transcript.

## 2. Author against the schema

Walk every section as a retrieval cue — free recall fails first under
degradation. Then delete every section that came up empty: **empty sections are
deleted, never stubbed** — a thin heading looks complete and is worse than an
absent one.

1. **Header** — `STATUS: LIVE · <date> · by <author>`, the resume phrase, and
   how to use the file.
2. **The job** — one line.
3. **Working lexicon** — terms coined or sharpened this session and not yet in
   `LEXICON.md`.
4. **Owner's words** — verbatim quotes that must not be paraphrased.
5. **Verified — do not re-derive** — the anti-rediscovery set of facts already
   checked.
6. **Resume point** — the single next action or question.
7. **Open tree** — remaining work, with stable IDs; never renumber.
8. **State of the world** — branch, dirty state, and what is closed and must
   NOT be reopened.
9. **Exclusions** — what the receiver must NOT load.
10. **Suggested skills** — what the receiver should invoke.

Sections 8 and 9 are load-bearing negative space: naming what is closed and
what not to load saves the receiver a full window of rediscovery.

Two rules govern the whole document:

- **No duplication.** Anything already captured in a spec, plan, decision
  record, issue, commit, or diff is referenced by path or URL, never restated.
  The handoff carries only what has no other home.
- **Redact** secrets, credentials, and PII — handoffs get pasted into fresh
  chats.

Ceiling: **~2–3k tokens** (roughly 8 KB). Above that the handoff eats the
window it exists to protect; get under it by referencing, not by thinning every
section.

## 3. Write it to the Intent lane

Write the document to `$TMPDIR/.foundry/<topic>-<YYYY-MM-DD>.md`, creating the
folder if it is missing. This lane is host-level, absolute, gitignored, and
outside every repo — the single copy. Everything present in the lane is live; a
handoff dies by deletion, not by a status stamp.

Done when the file exists at that absolute path and every section still present
carries real content.

## 4. Report and continue

State the absolute file path and the resume phrase. The receiver loads it by
path or gets it pasted as a first message; both work because of the ceiling.
Then continue the session — a handoff is never an exit.
