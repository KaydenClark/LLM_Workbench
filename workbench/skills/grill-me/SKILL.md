---
name: grill-me
description: Start a saved design inquiry - resume or create the objective's JSON notepad, then run the grilling interview with every answer, readback, correction and next step saved as it happens, so a pause resumes at the pending readback rather than the next question. Owner-invoked; the endpoint stays whatever the owner authorized.
disable-model-invocation: true
---

`grill-me` is an entry point, not a third contract. It composes two core
skills and adds nothing to either:

- `workbench/skills/grilling/SKILL.md` owns the interview: one question at a
  time with a recommendation, the owner's answer read back as pending, explicit
  confirmation or correction, lock, map update, next question, and the exits.
- `workbench/skills/notepad/SKILL.md` owns continuity: the local JSON note for
  one objective, revision-checked writes, corrections that link rather than
  rewrite, privacy scanning and bounded retrieval.

Read both whole before the first question. Where this file and either source
differ, the source wins; report the difference rather than improvising.

## 1. Bind the objective to its note before the first question

Read `workbench/manifest.json` first. The live note lives in the
manifest-declared `notepads` collection under its `grilling` type folder,
local and untracked; legacy `workbench/sessions/grilling/` paths stay readable.

Derive one lowercase objective slug from the topic the owner named. Resume
before creating:

```bash
node workbench/tools/notepads.mjs list --objective OBJECTIVE_KEY
node workbench/tools/notepads.mjs read --note NOTE --view current
```

An existing note for this objective is resumed at its revision. Only when none
exists, create it with the decision map you have so far and confirm the
returned revision before asking anything:

```bash
node workbench/tools/notepads.mjs create --note workbench/sessions/notepads/grilling/TOPIC-YYYY-MM-DD.json --type grilling \
  --objective OBJECTIVE_KEY --title "The agreed topic" --focus "What we are deciding" \
  --state "Decision map drafted; nothing answered yet" \
  --next-action "Ask the most consequential ready question with a recommendation" \
  --view-field 'questions=[{"id":"1","status":"open","question":"First decision"}]'
```

Name the active note and revision in your working state; every later write
names the revision you read.

A different topic is a separate objective with its own key and its own note.
Never fold a second inquiry into the first note, and never let a note for an
unrelated objective (a code investigation, a migration) absorb design answers.
When the owner asks for a note on other work mid-inquiry, create or resume that
objective's own note and return to this one's pending item.

## 2. Run the grilling contract, saving as you go

Follow grilling's "Each decision, in order" exactly. What this entry point adds
is only *when* the notepad is written:

- Before the owner answers: the question is `open` in the note's `questions`
  view field with its stable ID.
- When the owner answers: append it at once as `--kind source_record
  --question-id ID` with the owner's words as the content and your readback as
  `--interpretation`, keep the question `open`, and list the pending readback
  in `current.unresolved`. Saving is not acceptance; a saved pending answer is
  still pending.
- When the owner corrects the readback: append a `correction` that names the
  pending entry, give the revised readback, and wait again. The pending item
  stays in `current.unresolved`.
- When the owner confirms in ordinary words: append `--kind decision
  --question-id ID`, set the question `locked` (or `tentative`), clear the item
  from `current.unresolved`, update the map, and only then ask the next
  question. Status alone proves nothing, and only a `decision` entry records
  the owner's answer; a `source_record` never becomes one by waiting.
- Keep `current.state` and `current.next_action` true after each lock, and
  before any pause.

Confirm each append or current write returned success and the new revision
before continuing. A failed write has saved nothing.

## 3. Resume at the pending readback, not the next question

On a fresh start, after compaction, Stop or a model switch, read the current
view and then the topic of any item in `current.unresolved`, so the pending
`source_record` returns together with its corrections. Resume by restating the
latest readback as pending and waiting. Do not lock it, do not ask the next
question, and do not treat the earlier answer as settled. A `locked` question
is never re-asked; its `decision` entry is the proof, not the status alone.

Verify the current Contract and relevant live state before relying on any
saved claim; the note says what to look at, not what is true.

## 4. Endpoint

The inquiry ends at the exit the owner names, per grilling's Exits: pause or
preserve, promote, specify, hand off, or execute. A confirmed concept readback
does not itself create a Spec, promote a claim, or authorize execution; those
are separate authorized compositions (`promote`, `to-spec`, `handoff`,
`make-it-so`, `carry`). Before a voluntary exit, validate and read back the
note: locked answers, pending readbacks, corrections, unresolved items and
next action must match what actually happened.

## Not covered here

No new note kind, status, schema or collection. The concurrent-write race in
the revision check is the runtime's known limit, not something this entry
works around. Installed personal copies are not updated by this source.
