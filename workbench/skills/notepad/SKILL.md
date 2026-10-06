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
A note belongs to its objective, not to the chat, model or host that created
it ([ADR-000L](../../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md)):
resume the objective's note even when another context created it, and expect
entries you did not write. Create only when no reachable note already serves
this purpose for the objective; a purpose-distinct note, such as a grilling
record beside a work note, is linked through `related_notes`. If the
objective's note is unreachable from this host, continue from its Markdown
handoff and keep a local note under the same objective key that names it as
related, for later reconciliation:

```bash
node workbench/tools/notepads.mjs create --note NAME --objective OBJECTIVE_KEY \
  --title "TITLE" --focus "WHAT THIS NOTE IS FOR"
```

Live notes stay local and untracked, in a live collection `workbench/manifest.json`
declares. Bare names use `notepads/work/` on the new layout, or the legacy
grilling collection when that room has not migrated. Explicit relative paths
select other local JSON-notepad type folders. Handoffs are not JSON records:
write them as Markdown in `sessions/handoffs/`. Schema and examples under
`notepads/templates/` are tracked and cannot be live
notes. Never
commit one, and never cite one as durable evidence.

For a new visible identity, use `notepads.mjs allocate --prefix N` with the
same objective/title fields. The returned ID is the visible label and filename;
no second identity is added. New labels follow the shared artifact policy:
uppercase `0-9A-Z`, minimum width four, with at least one letter (`N-000A`).
Read an allocated or legacy visible ID through `--id ID`, even when its
existing filename differs; any spelling of the same identity (legacy `N-00A`,
`N-000a`) resolves to that one note, and legacy notes are never renamed.
Use `--note` for the original filename/path lookup. Use one writer, preserve
existing paths, and reconcile unreadable or ambiguous inventory before
allocating. The Runbook owns the full alphabet, width and collision rules;
neither an ID nor allocation grants authority.

Before dependent work, name the active note and returned revision in local
execution state, verify relevant Actuality, and correct any stale current view.
The current view carries no entries and no corrections: before relying on a
saved claim, read its topic (section 3) so any correction travels with it.
An unavailable runtime blocks the dependent capture operation; report it and
continue only independent work whose context can safely be preserved.

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

Every write names the revision you read. A missing or mismatched supplied
revision is refused as `stale-revision`, naming the current one. The refusal
does not prove a change or identify a writer: an omitted revision is refused
on an unchanged fresh note, and your own older revision is refused too. Read
the current note, supply its revision, and re-apply. The check catches a
sequential change while you were working, and the runtime also refuses an
overlapping one: each write publishes only if the note still holds exactly what
you read, so of two writers that read the same revision one lands and the other
is refused `stale-revision`. No write is reported as landed unless it is in the
note. Writes still stay one writer at a time, because a refused writer has to
reread and re-apply. That rule bounds overlapping writes, not which chat may
own or resume the note. Every free-text field you supply is privacy-scanned before it can
reach the file; record a safe reference rather than a secret, credential, or
raw private data.

Correct in place by linking, never by rewriting history:

```bash
node workbench/tools/notepads.mjs append --note NOTE --revision N \
  --kind correction --topic TOPIC --corrects ENTRY_ID --content "WHAT WAS WRONG AND WHAT HOLDS NOW"
```

The superseded entry stays. A reader who retrieves it gets the correction with
it, which is the whole point of keeping both. On resume the correction holds
and the original is history, but both record only what was believed when they
were written: recheck live state before relying on either.

Keep pending meaning apart from confirmed meaning. When a design inquiry saves
an owner answer before its readback is confirmed (as `grilling` does), append it
as `--kind source_record` with the owner's words as the content and the
readback as `--interpretation`, adding `--question-id ID` when the inquiry keeps
stable question IDs, and list the pending readback in `current.unresolved`.
Saving is not acceptance. A revised readback is a `correction` of that entry.
Once confirmed, only a `decision` entry records the owner's answer; append it
and clear the item from `current.unresolved`. The composing skill owns the
question map and its statuses; this is the whole convention, with no other kind
or status for pending meaning.

Keep the resumption view current whenever the state or the next action moves:

```bash
node workbench/tools/notepads.mjs current --note NOTE --revision N \
  --state "WHERE THIS STANDS" --next-action "THE NEXT EXECUTABLE STEP" \
  --unresolved "WHAT IS STILL OPEN"
```

After each material directive, finding, decision, correction, verification or
blocker, confirm append/current returned success and the new revision before
continuing dependent work. A failed write has saved nothing. Before voluntary
pause, validate and read back the note: state, unresolved items and next action
must match actual results. These are workflow obligations using the runtime's
revision/privacy/dependency checks, not a claim of host-native interception.

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

Author a requested handoff separately as a Markdown file in
`workbench/sessions/handoffs/`, using the `handoff` skill and its bundled `assets/HANDOFF.md`. It must be plain
English another agent can follow or the owner can paste into a new chat: name
the job, verified facts, one resume point, boundaries, and exact source paths.
Confirm destination access and retain source context until the needed material
is durable or otherwise safely available. Existing JSON handoffs are legacy
sources; do not create another one.

Declare active Markdown transfer dependencies through `current --view-field
'active_handoffs=["workbench/sessions/handoffs/NAME.md"]'` with the current
revision. Trim and delete refuse while this list is nonempty, even if the file
is missing; a missing destination cannot prove safe release. After verifying
that the transfer no longer depends on this note, explicitly clear the list
with `--view-field 'active_handoffs=[]'`. Undeclared prose dependencies remain
agent judgment; the tool does not infer them from Markdown.

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

## Standing rules

Create or resume a local JSON notepad when meaningful objective work produces
context whose loss would impair continuation or a focused handoff. Trivial
conversation needs none. Preserve source fidelity, uncertainty, and corrections;
maintain a compact current view and an append-oriented work record. Templates
are examples, not a universal checklist. Notes neither authorize work nor prove
claims. On resume obey the current Contract and verify relevant live state.
Save important context promptly as work proceeds, before token exhaustion or
an owner pressing Stop can interrupt the conversation. Do not defer capture to
closeout or rely on a final write after Stop. This obligation covers saved local
context for conversation continuation, not computer crashes or device loss;
an interruption can still preempt an unsaved write.

Notepads, including grilling records, use JSON, including when older workflow
examples say Markdown. A note belongs to its objective, not to the chat that
created it: every context that can reach it resumes and appends to it, one
writer at a time (ADR-000L). Handoffs are separate human-readable Markdown (`.md`)
files: they give a receiving agent or a new chat plain-language instructions
for continuing one objective. Do not serialize a handoff as a JSON notepad.
The shared runtime is `workbench/tools/notepads.mjs`; its interchange schema
and reusable examples live in the manifest-declared `notepad-templates`
collection. The `notepad` skill owns judgment. New live records use typed
folders in the `notepads` collection; Markdown handoffs use `handoffs`.
Preserve legacy Markdown and JSON paths, but create no new JSON handoffs. Live
notes and handoffs stay untracked in project Git; explicitly configured private
synchronization may transport selected live collections under the accepted
continuity contract. Local operation remains independent of transport. Do not record secrets,
credentials, authentication/recovery material, raw private financial, medical,
or personal data, or unsafe tool output; retain only safe recovery references.

## Working context and the Landmark Tracker

When the Landmark Tracker capability is available, workflow activity maintains
current pre-delivery understanding in DQCs and landmark records, preserving
what changed, why, affected claims and evidence. The generated Tracker reflects
those sources. Grilling notepads remain useful historical and handoff-like
context; do not discard needed origins or corrections merely because a card
exists. Until that capability is delivered, preserve working context through
the existing notepad runtime. Confirmation of understanding never grants
implementation or promotion authority. The grilling primitive remains unaware
of Tracker machinery; workflow composition performs the record maintenance.
Wiki creation and updates are ordinary authorized delivery and reconciliation,
not a separate publishing ceremony. Apply claim-level ownership and the current
request throughout; no record or projection can manufacture authority.

### Landmark Tracker: accepted design and available operations

The Landmark Tracker distinguishes evolving concept understanding from delivery
state. DQCs and landmarks maintain the former; the generated Tracker displays
it; Specs and Tasks carry implementation and Taskboard projects their state.
The intended root is `workbench/landmark-tracker/`, containing generated
`TRACKER.json` and flat `destination-questions/` and `landmarks/` JSON records.
These paths are a delivery contract, not evidence of installed collections or
commands. Resolve availability from the actual manifest and verified runtime;
do not invent a Tracker invocation or use an existing command as its substitute.

Once implemented, workflow transitions and ongoing alignment maintain source
records with what changed, why and evidence. Keep original grilling questions
and corrections reachable. DQCs may precede a landmark, Spec, Task or known Wiki
destination; an answered question records Expected result, while Result records
achieved delivery. Assess the actual durable content before claiming Verified;
Task completion, article existence and structural validation alone are insufficient.
Keep live links current through supported move operations and retain immutable
citations for historical proof. Ignored notes require their own retention or
safe transfer until reconciliation; tracked Git history does not recover them.

A Landmark Wiki page is the landmark's evolving synthesis, updated whenever
one of its question cards changes. Identifiers on it, as on every Wiki page,
carry the artifact's name and context; the structured records keep
identity-bearing provenance and delivery evidence.
Ordinary feature explanations and cross-cutting design models retain their
respective Wiki purposes. Collection/schema support must be delivered and
verified before claiming those article types are available. Routine Wiki work
within an authorized assignment adds no independent publishing ceremony.

## Runtime reference

Visible note identifiers can be allocated without changing existing note paths:

```bash
node workbench/tools/notepads.mjs allocate --prefix N --objective OBJECTIVE_KEY --title "TITLE"
node workbench/tools/notepads.mjs read --id N-000A --view current
```

Choose the artifact type prefix explicitly (for example N for objective notes);
it is the prefix in the visible ID, not another identity field. Markdown
handoffs do not use the JSON-notepad ID allocator.
Allocation follows the shared artifact policy in the Runbook's
[Visible Identifiers](../../../RUNBOOK.md#visible-identifiers):
uppercase `0-9A-Z`, minimum width four, at least one letter (`N-000A`), growing
without truncation. It chooses the first unoccupied label; identifiers do not
encode chronology. Legacy numeric, width-three and mixed-case labels (`N-001`,
`N-00A`, `N-00a`) stay readable, reserve their identity and are never decoded
as an allocation high-water mark or renamed. Prefixes have independent scopes
within the room. Case-folded and leading-zero variants reserve the same value,
so N-00A, N-00a and N-000A are one identity and cannot be allocated twice; two
existing notes whose IDs alias one identity refuse allocation rather than
choosing a winner. Those restrictions deliberately avoid aliases on
case-insensitive filesystems.

`--id` resolves through the local inventory, including legacy records whose
filenames differ from their IDs. It refuses unmatched or ambiguous identifiers.
`--note` retains its original filename/path behavior; never combine the selectors.
Allocation skips occupied destination names even when their stored IDs differ.
Unreadable records or ambiguous IDs refuse identifier operations until their
inventory is reconciled; they are preserved. Ordinary `create --note NAME`
remains available for legacy named context. Allocation assumes one writer and
checks current records; it supplies neither a distributed lock nor an eternal
registry of deleted local notes. Active handoff retention still prevents source
cleanup. Durable spec/task/ADR behavior is described in the Runbook's
[Visible Identifiers](../../../RUNBOOK.md#visible-identifiers).

New notepads are JSON. `workbench/tools/notepads.mjs` owns structural checks
and updates. A new layout declares `sessions/notepads/`: bare names create
`notepads/work/NAME.json`; explicit project-relative paths select another local
type folder. Handoffs are authored as Markdown (`.md`) in the declared
`handoffs` collection; they are readable continuation instructions, not JSON
notepads and not `notepads.mjs` records. The tracked `notepad-templates`
subcollection carries `notepad.schema.json` plus work and grilling JSON examples;
the portable Markdown handoff shape is bundled as `assets/HANDOFF.md` in the installed `handoff` skill; producer source also exposes `templates/HANDOFF.md`.
The schema describes new `notepad-1` interchange, while the runtime additionally
checks unique entry IDs, links and revision safety. Legacy `scope-1` reading and
migration remain supported without moving or regenerating source history.

Existing schema 2 rooms remain valid. From the clean release checkout run
`workbench-layout.mjs migrate --project PATH --version VERSION` to add the two
collections and seed examples with recorded hashes. This moves no old note,
preserves earlier provenance and the room version, and reports the layout source
separately. Existing adjusted examples are retained and reported by the seeded
document mechanism. Repeated migration reports `current`; use `seed-documents`
to refresh untouched seeded examples. Seeding verifies the clean release and
ordinary source, destination and receipt paths before writing or recording. An
asserted version must match the source checkout. Validation checks effective Git
ignore rules and already tracked live files in Git worktrees; outside Git its
`ignoreVerification` says `not-a-git-worktree`, and no tracking guarantee follows.
On a room without the new declaration,
bare note names still use the legacy grilling collection. Never rewrite legacy
Markdown merely to change its extension.

```bash
node workbench/tools/notepads.mjs list [--objective KEY]
node workbench/tools/notepads.mjs create --note NAME --objective KEY --title "TITLE" --focus "FOCUS"
node workbench/tools/notepads.mjs read --note NOTE --view current
node workbench/tools/notepads.mjs read --note NOTE --topic TOPIC [--limit N] [--cursor N]
node workbench/tools/notepads.mjs append --note NOTE --revision N --kind KIND --topic TOPIC --content "TEXT" [--corrects ENTRY_ID] [--depends-on ENTRY_ID] [--source-file PATH]
node workbench/tools/notepads.mjs current --note NOTE --revision N --state "STATE" --next-action "NEXT" [--unresolved "OPEN"] [--view-field NAME=VALUE]
node workbench/tools/notepads.mjs trim --note NOTE --revision N --entry ENTRY_ID [--durable-owner PATH]
node workbench/tools/notepads.mjs validate --note NOTE
node workbench/tools/notepads.mjs migrate --note NOTE
node workbench/tools/notepads.mjs delete --note NOTE --revision N
```

Only `--note` and the revision a write checks are always required. `list`
takes `--objective` or no filter at all; `read` takes `--topic`, `--entry`,
`--kind`, `--limit` and `--cursor`; `append` takes `--corrects`,
`--depends-on`, `--interpretation` and `--source-file`; `current` takes
`--unresolved` once per open item and `--view-field` for a field this workflow
keeps in the current view; `trim` takes `--durable-owner` to record
where the removed material now lives.

Kinds are `directive`, `source_record`, `finding`, `proposal`, `decision`,
`correction`, `verification`, and `blocker`. A kind names what a record is for
a reader; it never grants authority or verifies a claim.

1. Resolve the explicit objective or note first; related records share objective
   context. If no stronger signal exists, inspect the newest-created local note
   or handoff and check relevance before using it.
2. Preserve a compact current view (objective, state, unresolved work, next action)
   and ordered entries containing meaningful source text, findings, uncertainty,
   and corrections. Save important context as it becomes available, before
   continuing work that would leave it only in the conversation. Token exhaustion
   or Stop may prevent another write; do not wait for closeout. JSON strings may
   contain full prose. A workflow may keep its own field in the current view;
   `current` preserves it across an update.
3. After interruption, load relevant context and verify current controls and
   actual project state. File availability alone proves neither freshness nor
   successful recovery. Preserve significant work while it is underway.
4. For a handoff requested by the owner or initiated within an assigned role,
   author a destination-specific Markdown
   compaction from the selected material in `sessions/handoffs/`. State the job,
   verified facts, exact resume action, boundaries, and source paths in plain
   language. Include needed corrections and dependencies. Carry the selected
   content when the destination cannot read the local note.
5. Before cleanup, verify that promoted material is present in its durable
   owner and that retained work can still be understood and resumed. Trim only
   reconciled material from a retained note; preserve unresolved context,
   corrections, and active handoff dependencies. Flush or delete the whole
   record only when all important material is reconciled and nothing still
   depends on it. No routine archive or extra approval is needed for this normal
   cleanup. Preserve legacy sources and existing checkpoints under their current
   retention rules.

`read --view current` returns the resumption view and the revision to write
against without putting entry history into the response. A topic read carries
the corrections and declared dependencies of what it selected, each entry
marked `match` or `context`, and reports `page.matched`, `page.returned`,
`page.has_more`, and `page.next_cursor`: a bounded read never truncates
silently, so never report a slice as the whole record.

Every write names the revision it read. A mismatch is refused as
`stale-revision` naming the current one, `create` refuses an existing name and
`append` an existing entry id as `duplicate-identity`, and a correction or
dependency naming material the note does not hold is refused too. New material
is privacy-scanned before it can reach the file; preserved history is not
rescanned, because an old record may legitimately quote a matching string.
A refused or failed write leaves the previous valid record unchanged.

An id is never reused. `append` remembers the highest number each id prefix has
reached in `extensions.entry_sequence`, and `trim` records the mark for what it
removes, so an id already cited in a durable owner cannot come back naming
different material after the entry that proved the number is gone.

`trim` removes named reconciled entries and refuses with `retained-dependency`
rather than breaking a link in either direction: removing material a retained
entry still depends on is refused, and so is removing a correction while
keeping the claim it corrects, which would leave the record asserting a fact
already known to be wrong with nothing marking it superseded. Trim both halves
together once the correction has landed in its durable owner.

A subcommand refuses any flag it does not recognise, naming the ones it does.
A dropped `--corects` would otherwise report a correction appended and write
an entry with no link at all. A workflow that keeps its own field in the
current view writes it with `--view-field name=value`, JSON when the value
parses as JSON and the raw string otherwise; `current` preserves it from then
on, and `state`, `unresolved` and `next_action` keep their own flags.

An interim `scope-1` record reads as it is and migrates once, preserving its
recorded text and timestamps, before it can be written to.

`sessions.mjs` keeps `scan`; legacy `checkpoint` invocation refuses new copies. Do not send a
JSON note through that copier and call its `.md` output a notepad operation.
Skill prose and human-readable projections may remain Markdown.

Overlapping writers cannot lose an entry silently. Every write that takes
`--revision` (`append`, `current`, `trim`, `delete`) publishes inside a
per-revision publish token, the exclusive directory `.<note>.rev<N+1>.publish/`
beside the note: the writer re-reads the note under that token and publishes
only if it still holds exactly the bytes the writer read (not merely the same
revision number, which a deleted and recreated note would repeat), so of two
writers that read the same record exactly one succeeds and the other is refused `stale-revision`
naming the revision on disk, with nothing of its write in the file. A success
response is therefore true at the revision it states. The token is held for one
publication only; it is not a lease, needs no service or configuration, and a
writer that stops mid-write leaves the previous valid record in place. A token
older than ten seconds is treated as abandoned and reclaimed by the next
writer, so a crash never blocks a note. The bytes a writer is about to publish
are staged inside its own token directory, so reclaiming the token removes
them and a writer stalled past the reclaim age fails its rename and is refused,
instead of publishing over a newer write; there is no gap between the
ownership check and the publication. `delete` moves the note into the same
place instead of unlinking the live path, so a stale cleanup fails rather than
removing a newer write. One writer at a time remains the working rule: the
guard makes an overlap honest, it does not merge concurrent changes.

## Continuing after a save or handoff

Saving context or authoring a requested handoff does not terminate a session.
Continue to the authorized endpoint. Preserve the complete original question
inventory and stable IDs/statuses/corrections; a compact view routes to retained
sources rather than replacing them. Multiple objective-linked notes are allowed,
with an unambiguous active resume route. Stale migrated discovery paths belong
in the existing ownership/migration assignment.
