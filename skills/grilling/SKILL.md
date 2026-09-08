---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea, one question at a time, keeping a running notepad of every decision. A reusable primitive; end with /make-it-so to promote or /notepad to preserve local context. Use when the user wants to stress-test thinking or uses any 'grill' trigger phrase.
---

This is the core interview primitive. It runs the questioning and keeps a running
notepad of the result. It never writes canonical files itself — the `/make-it-so`
skill promotes the notepad, so `grilling` can also run on its own.

Read `workbench/manifest.json` first. The live notepad lives in the
manifest-declared `grilling` collection (`workbench/sessions/grilling/`), which
stays untracked. Use JSON for new notes under the current Contract and preserve
legacy sources. Promote supported claims into their durable owners under
existing authorization; recording them locally does not make them Canon.

Grill the user relentlessly about every aspect of this until we reach a shared
understanding. Walk down each branch of the decision tree, resolving dependencies
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before
continuing. Asking multiple questions at once is bewildering.

If a fact can be found by exploring the environment (filesystem, tools, etc.),
look it up rather than asking me. The decisions, though, are mine — put each one
to me and wait for my answer.

## The notepad (start here, before asking anything)

Keep important working context in the notepad as it becomes available,
before token exhaustion or Stop can interrupt the conversation. Do not rely on a final write after interruption;
a Stop can preempt an unsaved write. The note supports local continuation and
is not a computer-crash or device-loss guarantee. It is not Canon.

1. Explore enough to build the real decision tree.
2. Create or resume a JSON notepad in the manifest-declared live collection,
   using the current date for a new note. Keep its status `PROVISIONAL` until
   settled claims are reconciled; the record remains local and untracked.
3. Write the FULL planned question list up front, so I see the terrain before
   answering. It is a best-effort map; it will flex.

Create it through the shared runtime, which writes the schema for you:

```bash
node workbench/tools/notepads.mjs create --note TOPIC-YYYY-MM-DD --type grilling \
  --objective OBJECTIVE_KEY --title "The agreed topic" --focus "What we are deciding" \
  --state "Question list written; nothing answered yet" \
  --next-action "Ask question 1 with a recommendation" \
  --view-field 'questions=[{"id":"1","status":"open","question":"First decision"}]'
```

`--objective` takes a lowercase slug. `questions` is this workflow's own field
rather than a schema one, so it goes in through `--view-field`, and `current`
preserves it across every later update.
Rewrite the whole list with `--view-field` again when a status changes. The
record that command writes:

```json
{
  "schema_version": "notepad-1",
  "revision": 1,
  "id": "topic-2026-01-31",
  "type": "grilling",
  "status": "PROVISIONAL",
  "title": "The agreed topic",
  "objective": { "key": "objective-key", "focus": "What we are deciding" },
  "created_at": "2026-01-31T00:00:00.000Z",
  "updated_at": "2026-01-31T00:00:00.000Z",
  "relationships": { "index": null, "related_notes": [] },
  "current": {
    "state": "Question list written; nothing answered yet",
    "unresolved": [],
    "questions": [{ "id": "1", "status": "open", "question": "First decision" }],
    "next_action": "Ask question 1 with a recommendation"
  },
  "entries": [],
  "extensions": { "durable_owners": [] }
}
```

Keep stable question IDs; never renumber them. Dependencies may use `2A`,
`2B`; new branches append new IDs. Statuses are `open` (undecided),
`tentative` (revisit), and `locked` (decided). Preserve source wording,
uncertainty, and corrections in ordered entries, with a compact current view.
Record each answer as an entry as it is given, and rewrite the question list
with `notepads.mjs current --view-field questions=...` when a status changes.

## During the interview

- Ask the next `[open]` question with your recommendation.
- After I confirm an answer, immediately update its status to `locked` (or
  `tentative`) and save the answer and meaningful correction context in the
  notepad before asking the next question. Capture other important findings
  during investigation as well; do not wait for the interview to end.
- Do not act on it until I confirm we have reached a shared understanding, and do
  not touch canonical files during the interview.

## Resuming after a compaction or model switch

After compaction, token exhaustion, Stop, or a model switch, read the saved
notepad, verify the current Contract and relevant live state, and continue at
the first `open` question. Never re-ask a `locked` question. File availability
alone does not prove successful recovery.

## Exits

Keep grilling until I explicitly run one of these skills — do not stop on a
lookalike phrase said in passing:

- `/make-it-so` — I am done; confirm the approvals, promote the notepad's
  locked decisions to canon, implement them, and push the results to the
  remote.
- `/notepad` — preserve current state and unresolved context locally under the
  current Contract. Legacy `/checkpoint` copying is retired.

Only those invoked skills end the interview. Continue only within the standing
project authority and safety boundaries.
