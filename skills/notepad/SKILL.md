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
then the objective key, then the most recently created local note - and check
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

Live notes stay local and untracked, in a live collection `workbench/manifest.json`
declares. Bare names use `notepads/work/` on the new layout, or the legacy
grilling collection when that room has not migrated. Explicit relative paths
select other local type folders; `--collection handoffs` selects handoffs.
Schema and examples under `notepads/templates/` are tracked and cannot be live
notes. Never
commit one, and never cite one as durable evidence.

For a new visible identity, use `notepads.mjs allocate --prefix N` with the
same objective/title fields (H can name a handoff type). The returned ID is the
visible label and filename; no second identity is added. Read an allocated or
legacy visible ID through `--id ID`, even when its existing filename differs.
Use `--note` for the original filename/path lookup. Use one writer, preserve existing paths, and reconcile unreadable or ambiguous
inventory before allocating. The Runbook owns alphabet, width and collision
rules; neither an ID nor allocation grants authority.

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

Every write names the revision you read. A write against a revision that has
moved is refused as `stale-revision` naming the current one - read again and
re-apply. This is a check, not a lock: it catches the sequential case, where
your note moved while you were working. Two writers that both read the same
revision at the same moment would both pass it, so one writer per note remains
the rule. Every free-text field you supply is privacy-scanned before it can
reach the file; record a safe reference rather than a secret, credential, or
raw private data.

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

Compose core `promote` for selected supported claims and core `save` for their
actual persistence boundary. Promote into durable owners under existing
authorization - the assigned spec, a decision record in `workbench/docs/adr`,
the Wiki, a root control - and cite those owners, never the note. Then remove
only what has actually landed:

```bash
node workbench/tools/notepads.mjs trim --note NOTE --revision N \
  --entry ENTRY_ID --durable-owner workbench/specs/S-###-slug/SPEC.md
```

The link binds in both directions, and a trim that would break it either way is
refused as `retained-dependency`. Removing something a retained entry still
depends on is refused. So is removing a correction while keeping the claim it
corrects: that would leave the note as the only local record of a fact you
already knew was wrong, with nothing marking it superseded. Trim both halves
together once the correction has landed in its durable owner, or keep both.
That refusal is the mechanism doing its job; do not work around it.

Author a requested handoff separately with `--collection handoffs --type handoff`.
For a pointer-based handoff, repeat `--retains NOTE` or `--retains NOTE#ENTRY_ID`
when creating it. Confirm destination access and preserve the declared source
until that destination is reconciled. The tool checks these explicit pointers;
prose references and semantic sufficiency still need your judgment.

Delete the whole record only when everything important is reconciled and no
unfinished work or active handoff still depends on it. After verified partial
trim, set `--status RECONCILED --unresolved "" --next-action ""` through `current`,
then run `notepads.mjs delete --note NOTE --revision N`. It refuses remaining
entries or active declared retainers. Named unreadable live records also refuse
cleanup until their dependencies can be established; preserve them while
reconciling the issue. This is normal cleanup -
no archive and no extra approval. Legacy Markdown sources and existing
checkpoints keep their own retention rules; do not rewrite one merely to change
its extension.

An interim `scope-1` record reads as it is and migrates once, carrying its
recorded text, timestamps, and every field its current view holds, before it can
be written to:

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
