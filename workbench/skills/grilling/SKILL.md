---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea, one question at a time, reading back each answer for confirmation before moving on, until a confirmed shared concept. Composes notepad when the session needs saved context. A reusable primitive with separate preserve, promote, specification, handoff and execution exits. Use when the user wants to stress-test thinking or uses any 'grill' trigger phrase.
---

This is the core interview primitive. It asks, investigates, challenges and
synthesizes until we share one understanding, then stops. It never writes
canonical files during the interview. Core `promote` owns reconciliation after
the user selects that endpoint; execution is separate.

Grill the user relentlessly about every aspect of this until we reach a shared
understanding. Walk down each branch of the decision tree, resolving dependencies
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before
continuing. Asking multiple questions at once is bewildering.

If a fact can be found by exploring the environment (filesystem, tools, etc.),
look it up rather than asking me. The decisions, though, are mine — put each one
to me and wait for my answer.

## Each decision, in order

1. **Ask.** Put the most consequential question on the ready frontier to me as
   Question / Recommended answer / Why / Impact: what is being decided, what
   you recommend, your reasoning, and what choosing it would change. Look up
   available facts first.
2. **Wait for my answer.** Silence never confirms a recommendation, and a
   recommendation I did not choose is never recorded as my answer. My meaning
   wins where it differs from yours.
3. **Read it back, pending.** Restate my actual answer as
   Question / Answer / Why / Impact and say it is pending until I confirm it.
   Keep my stated reason separate from anything you inferred. A pending
   readback asks no new design question; clarifying this decision is fine.
4. **Confirm or correct.** When I correct the readback, give a revised readback
   and wait again. Only my explicit confirmation, in ordinary words, locks the
   decision; there is no special command to learn.
5. **Lock, update the map, continue.** After confirmation, lock the decision,
   update the decision map, and only then ask the next question.

## The decision map

Keep a working map of the major branches, their prerequisites, open
assumptions and the ready frontier: the decisions whose prerequisites are
already locked. It is a provisional map that grows and prunes, not a
questionnaire written up front. After each lock, recompute the frontier, drop
branches the answer made irrelevant, and show me the compact change when it
matters.

Reopen a locked decision only for a named changed premise, new contradictory
evidence or my correction. Name what changed, reopen only the dependent
decisions it affects, and keep every unaffected locked answer as it is.

At a branch boundary or a material change, explain how the locked decisions fit
together as one account, not a transcript.

## Finishing honestly

An empty frontier is not proof of a shared concept. Before any transition to
specification or execution, give a final concept readback in the same
Question / Answer / Why / Impact form covering: the problem, the intended user
and experience, scope and exclusions, the important concepts and boundaries,
the consequential tradeoffs, and one concrete scenario. Name any unresolved
choice or missing evidence that could still change the concept. Do not act on it until I confirm we have reached a shared understanding, and do
not touch canonical files during the interview.

Lexicon supplies accepted meanings, and the `domain-modeling` and `wayfinder`
skills may challenge a concept or narrow an oversized inquiry, all within the
caller's authorization. A settled term does not authorize a Canon write.

## Saved context (composed, not built in)

The interview itself works without a notepad. Saving is the `notepad` skill's
job; compose it whenever losing the session's context would impair continuation,
as `AGENTS.md` Session Records requires, which is the ordinary case for a
consequential design session. Then read `workbench/manifest.json` first: the
live note lives in the manifest-declared `notepads` collection, in its
`grilling` type folder; legacy `workbench/sessions/grilling/` paths stay
readable and untracked. Recording claims locally does not make them Canon.

When you compose it, keep important working context in the notepad as it
becomes available, before token exhaustion or Stop can interrupt the conversation.
Do not rely on a final write after interruption; a Stop can preempt an unsaved
write. The note supports local continuation and is not a computer-crash or
device-loss guarantee.

Create the note through the shared runtime before the first question, seeding
the map you have so far, and confirm the returned revision:

```bash
node workbench/tools/notepads.mjs create --note workbench/sessions/notepads/grilling/TOPIC-YYYY-MM-DD.json --type grilling \
  --objective OBJECTIVE_KEY --title "The agreed topic" --focus "What we are deciding" \
  --state "Decision map drafted; nothing answered yet" \
  --next-action "Ask the most consequential ready question with a recommendation" \
  --view-field 'questions=[{"id":"1","status":"open","question":"First decision"}]'
```

`--objective` takes a lowercase slug. `questions` is this workflow's own field
rather than a schema one, so it goes in through `--view-field`, and `current`
preserves it across every later update. The record that command writes:

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
    "state": "Decision map drafted; nothing answered yet",
    "unresolved": [],
    "questions": [{ "id": "1", "status": "open", "question": "First decision" }],
    "next_action": "Ask the most consequential ready question with a recommendation"
  },
  "entries": [],
  "extensions": { "durable_owners": [] }
}
```

Keep stable question IDs; never renumber them. Dependencies may use `2A`,
`2B`; new branches append new IDs. Statuses are `open` (undecided),
`tentative` (revisit), and `locked` (confirmed); genesis intake accepts only
these three. Rewrite the whole list with
`notepads.mjs current --view-field questions=...` when a status changes.

- My answer may be saved while pending so it survives an interruption: append
  it as `--kind source_record --question-id ID` with my words as the content
  and your readback as `--interpretation`, keep the question `open`, and list
  the pending readback in `current.unresolved`. Saving is not acceptance, and
  only a `decision` entry counts as my answer.
- After I confirm, immediately update its status to `locked` (or `tentative`)
  and save the confirmed answer with its stable `question_id`, using
  `--kind decision --question-id ID`, before asking the next question. A locked
  question must have one current decision entry that names it; status alone
  never proves an owner answer.
- Preserve a later change as a `correction` linked to the prior entry; never
  rewrite the prior answer. Capture other important findings during
  investigation as well; do not wait for the interview to end.

For a project-informed Blueprint grilling, prepare the note through the
project's installed evidence seam instead of copying source text into chat or
hand-authoring provenance:

```bash
node workbench/tools/project-evidence.mjs prepare \
  --project-root PROJECT --input REQUEST.json --note TOPIC-YYYY-MM-DD
```

The disposable `project-evidence-request-1` JSON request names the project and
objective, then carries explicit `evidence` items with stable IDs, project-relative
source paths, optional line ranges, `fact` or `uncertainty` classifications and
the caller's statement. Its `questions` carry stable IDs, question text, a
recommendation and the evidence IDs that prompted them. Do not supply answers
or statuses: the tool refuses them and creates every question `open`. It checks
ordinary in-project source files, hashes the observed bytes, privacy-scans all
new material and atomically creates one `PROVISIONAL` grilling note. The stored
fact/uncertainty labels remain caller assertions; the source path and hash prove
which bytes were observed, not that a statement's meaning is true. Read the
returned note and revision before questioning. The prepared note replaces the
create step and seeds the initial map; continue through the same runtime.

## Resuming after a compaction or model switch

After compaction, token exhaustion, Stop, or a model switch, read the saved
notepad, verify the current Contract and relevant live state, and continue from
the ready frontier. An answer still pending in `current.unresolved` resumes
with its readback, not with the next question. Never re-ask a `locked` question. File availability alone does
not prove successful recovery.

## Exits

An explicit user direction to pause, preserve, promote, specify, hand off or
execute ends or changes the interview; no magic slash command is required.
A passing mention does not. Never continue questioning after Stop.

- Preserve or pause: compose `notepad`; keep open questions and next action.
- Promote settled decisions only: compose `promote`; do not implement.
- Create specifications only: compose `to-spec` within that endpoint, after the
  confirmed final concept readback.
- Prepare another agent's continuation: compose `handoff` as Markdown, with
  the exact requested job and retained correction context.
- Build the agreed scope: compose `make-it-so` or `carry` only within the
  execution actually authorized by the user.

Before a voluntary exit from a saved session, validate and read back the
current note, checking that locked answers, pending readbacks, corrections,
unresolved work and next action are faithful. Never depend on another write
after an immediate interruption. Successful capture is a confirmed runtime
result; a planned write is not saved context.
