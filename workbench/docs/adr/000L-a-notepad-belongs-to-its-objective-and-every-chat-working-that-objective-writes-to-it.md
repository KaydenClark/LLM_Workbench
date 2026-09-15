---
status: proposed
date: 2026-09-15
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
---

# A notepad belongs to its objective and every chat working that objective writes to it

A JSON notepad is owned by its **objective**, never by the chat, model, host or
provider that created it. Any agent working that objective, and able to reach
the record, resumes that note rather than opening a redundant parallel one,
reads its current view, appends to it, and must expect to find entries it did
not write. Finding another context's entries in a note is the note doing its
job, not corruption.

This record decides **ownership only**. It does not decide concurrency, and it
selects no change to how writes are guarded.

Writes stay **sequential and non-overlapping**, exactly as
[ADR-0040](0040-json-notepads-preserve-objective-continuity.md) and the current
`notepad` skill already have them. The runtime's `--revision` check is a check,
not a lock: it catches the sequential case, where the note moved while an agent
was working, and refuses that write as `stale-revision`. It does **not** make
overlapping writers safe, and this record must not be read as saying it does.
Two contexts that read the same revision at the same moment both pass the
check, and the loss is silent: `loadForWrite` validates the revision before
building the update, while `writeSafeFile` publishes with an unconditional
`renameSync`, so the last rename wins and every earlier writer is told it
succeeded. Reproduced on 2026-09-15 against this branch: twelve
barrier-synchronized appends at revision 1 returned nine `appended` responses
at revision 2, and the resulting note held one entry. Eight accepted writes
were lost with a success reported to each caller. Selecting simultaneous shared
writers therefore requires a real compare-and-swap or lock that does not exist
today; this record does not select it, and the defect above is an open gap
recorded here for the owner, not work this record authorizes.

An objective may still own **several linked notes**, as `LEXICON.md` and
[S-046](../../specs/S-046-json-notepad-foundation/SPEC.md) accept, with
`relationships.related_notes` and typed folders carrying that structure. What
is rejected is forking a second note for the same purpose merely because
another context created the one that exists. A purpose-distinct note, such as a
grilling record beside a work note, stays correct.

Reuse binds only where a context can actually reach the record. Live notes are
local and untracked, so a context on another machine has no path to the file
unless the optional private transport
([ADR-0051](0051-optional-private-git-transport-for-session-continuity.md)) is
configured for it, and that transport keeps one active writer per note and
preserves competing revisions. Where the record is unreachable, the Markdown
handoff carries continuation and the objective's note stays local; a chat must
not invent a duplicate note to stand in for one it cannot read.

Considered and rejected: one note per chat. It fragments one objective's
context across several files, so a resuming agent must discover and merge them,
and it makes the Markdown handoff the only cross-chat channel, which
[ADR-0043](0043-workbench-continuity-through-maintained-owners.md) already
rules is not the owner of continuity.

Considered and rejected: a lock or lease held by the writing chat. Mandatory
coordination machinery breaks standalone operation
([ADR-0043](0043-workbench-continuity-through-maintained-owners.md)). This
rejects a *mandatory* lease as the ownership mechanism; it does not judge a
future compare-and-swap fix for the write-safety gap named above, which remains
open for its own spec.

Consequences: this narrows the "concurrent writers" alternative that
[ADR-0040](0040-json-notepads-preserve-objective-continuity.md) left
unselected, taking its objective-scoped *ownership* and explicitly leaving
simultaneous writing unselected; ADR-0040 stays accepted and unchanged. No tool
change is required by this record, and none is claimed to make overlapping
writes safe. At acceptance, a Task applies three edits; the skill edit is
carried under `AGENTS.md`, which names the `notepad` skill as the owner of
notepad judgment, because a skill file is not itself a `canonicalized_in`
owner. The `notepad` skill **keeps** its accurate "check, not a lock" paragraph
and its one-writer rule; only the ambiguity is repaired, by saying that the
rule bounds overlapping *writes*, not which chat may own the note, and its
resume step says to read the current view and the relevant topic before
writing, to expect entries from other contexts, and to treat a stale-revision
refusal as "someone else wrote" rather than damage. `AGENTS.md` Session Records
gains the sentence that a note belongs to its objective and is shared, one
writer at a time, by every context that can reach it. The `LEXICON.md` Notepad
row gains the same ownership clause beside its existing several-linked-notes
sentence. Until then, the current skill wording remains live and its reading as
one chat per note is the drift this record exists to correct.

Provenance: owner direction in the FND-Q23 deep-dive chat, 2026-09-15, on
observing that a second chat's appends to the live grilling note
`workbench-foundation-rework-2026-09-11` (entries `proposal-025`,
`finding-029`, `decision-064`) confused agents on other models that read the
current skill as one chat per note, while agents that read the objective-scoped
intent appended correctly. That note is untracked working material named as
origin, not as durable evidence. The write-loss reproduction above was run in
separate-context review of this record on 2026-09-15. It partially informs the
open question TT-Q9 on the relationship between a chat and its notepad without
closing it.

## Promotion status

This record is `proposed`. The `notepad` skill, `AGENTS.md` and `LEXICON.md`
remain live as written until the owner accepts this decision. The
concurrent-write loss named in the decision is an unresolved runtime defect
with no owning spec; S-046 is complete, so closing it needs a new linked spec
the owner opens. This record neither authorizes nor schedules that work.
