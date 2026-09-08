---
name: notepad
description: Keep the local JSON notepad for an objective - create or resume it, save consequential context as it appears rather than at closeout, retrieve one topic with its corrections when returning to the work, and trim only what has already been reconciled into a durable owner.
---

A notepad is the working context of one objective: what the owner directed,
what you found and where, what you corrected, what is still unresolved, and
what you would do next. It exists so that a fresh reader - you after a
compaction, another agent, another provider - can continue without the owner
reconstructing the conversation.

It is not evidence and not authority. A note never proves a claim, never
authorizes an action, and never overrides the Contract. On resume, obey the
current controls and verify live state; the note tells you what to look at, not
what is true.

`workbench/tools/notepads.mjs` owns the structure - schema, safe revision-checked
writes, discovery, bounded retrieval, dependency-preserving cleanup. This skill
owns the judgment: what is worth saving, and when it is safe to remove.

## 1. Create or resume before the context is only in the conversation

Meaningful objective work needs a note; trivial conversation does not. The test
is survival value: would losing this impair continuation or a focused handoff?

Resume by the strongest available signal - an explicit note the owner named,
then the objective key, then the most recently updated local note - and check
relevance before using it:

```bash
node workbench/tools/notepads.mjs list --objective OBJECTIVE_KEY
node workbench/tools/notepads.mjs read --note NOTE --view current
```

`--view current` returns the compact resumption view and the revision to write
against, without putting the entry history into your response. Start there.
Create only when no existing note owns the objective:

```bash
node workbench/tools/notepads.mjs create --note NAME --objective OBJECTIVE_KEY \
  --title "TITLE" --focus "WHAT THIS NOTE IS FOR"
```

Live notes stay local and untracked, in a manifest-declared live collection.
Never commit one, and never cite one as durable evidence.

## 2. Save it when you learn it, not at closeout

Write during the work. Token exhaustion or the owner pressing Stop can end the
conversation before another write, and a note that exists only in your plan
preserves nothing. This obligation covers conversation continuity, not machine
failure: an immediate interruption can still preempt an unsaved write.

Append the material whose loss would cost the next reader real work - an owner
directive, a source-backed finding, a decision and what it rules out, a
verification result, a blocker, and above all a correction:

```bash
node workbench/tools/notepads.mjs append --note NOTE --revision N \
  --kind finding --topic TOPIC --content "WHAT YOU FOUND" \
  --source-file PATH --interpretation "WHAT IT MEANS HERE"
```

Every write names the revision you read. A mismatch is refused as
`stale-revision` with the current revision, so two writers cannot silently
overwrite each other - read again and re-apply. New material is privacy-scanned
before it can reach the file; record a safe reference rather than a secret,
credential, or raw private data.

Correct in place by linking, never by rewriting history:

```bash
node workbench/tools/notepads.mjs append --note NOTE --revision N \
  --kind correction --topic TOPIC --corrects ENTRY_ID --content "WHAT WAS WRONG AND WHAT HOLDS NOW"
```

The superseded entry stays. A reader who retrieves it gets the correction with
it, which is the whole point of keeping both.

Keep the resumption view current whenever the state or the next action moves:

```bash
node workbench/tools/notepads.mjs current --note NOTE --revision N \
  --state "WHERE THIS STANDS" --next-action "THE NEXT EXECUTABLE STEP" \
  --unresolved "WHAT IS STILL OPEN"
```

## 3. Retrieve the slice you need, not the whole history

Read one topic. The response carries the matched entries plus the corrections
and declared dependencies they cannot be read safely without, each marked
`match` or `context`:

```bash
node workbench/tools/notepads.mjs read --note NOTE --topic TOPIC --limit 20
```

`page` reports what matched, what was returned, and `next_cursor`. When
`has_more` is true, material was left behind deliberately - continue from the
cursor or say plainly that you read a slice. A bounded read never truncates
silently, so never report a partial read as the whole record.

## 4. Reconcile before cleanup, and preserve what is still needed

Promote supported claims into their durable owners under existing
authorization - the assigned spec, an ADR, the Wiki, a root control - and cite
those owners, never the note. Then remove only what has actually landed:

```bash
node workbench/tools/notepads.mjs trim --note NOTE --revision N \
  --entry ENTRY_ID --durable-owner workbench/specs/S-###-slug/SPEC.md
```

A trim that would strand material a retained entry still corrects or depends on
is refused as `retained-dependency`. That refusal is the mechanism doing its
job; keep both entries rather than working around it.

Delete the whole record only when everything important is reconciled and no
unfinished work or active handoff still depends on it. This is normal cleanup -
no archive and no extra approval. Legacy Markdown sources and existing
checkpoints keep their own retention rules; do not rewrite one merely to change
its extension.

An interim `scope-1` record reads as it is and migrates once, preserving its
recorded text and timestamps, before it can be written to:

```bash
node workbench/tools/notepads.mjs migrate --note NOTE
```

## 5. Handoffs are authored, not exported

A handoff is a destination-specific compaction the owner requests. Author it
from the selected material, include the corrections and dependencies the
destination needs, and carry the content itself when the destination cannot
read the local note. Creating a handoff does not create work, a task, or a
follow-up assignment.

## Completion

The notepad is doing its job when a fresh reader can state the objective, the
current state, the unresolved work, and the next executable action from it -
and when everything it no longer holds is findable in a durable owner it names.
