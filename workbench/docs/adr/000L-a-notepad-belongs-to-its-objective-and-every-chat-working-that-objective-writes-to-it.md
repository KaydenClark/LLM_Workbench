---
date: 2026-09-30
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
---

# A notepad belongs to its objective and every chat working that objective writes to it

## Decision

A JSON notepad is owned by its **objective**, never by the chat, model, host or
provider that created it. Any agent working that objective, and able to reach
the record, resumes that note rather than opening a redundant parallel one,
reads its current view, appends to it, and must expect to find entries it did
not write. Finding another context's entries in a note is the note doing its
job, not corruption.

This record decides **ownership only**. It does not decide concurrency, and it
selects no change to how writes are guarded.

Writes stay **one writer at a time**: writes to one note must not overlap,
exactly as [ADR-0040](0040-json-notepads-preserve-objective-continuity.md) and
the `notepad` skill already have them. That rule bounds overlapping *writes*;
it does not limit which chat may own or resume the note. The runtime's
`--revision` check is a check, not a lock: it refuses a missing or mismatched
supplied revision as `stale-revision`, naming the current revision. A refusal
establishes neither that the note changed nor who wrote it: an omitted revision
is refused even on an unchanged fresh note, and a context can reuse a revision
older than its own last write. Read the current note and supply that revision
before writing. This catches a sequential change while an agent was working,
but the check does **not** make overlapping writers safe, and this record must not be
read as saying it does. Two contexts that read the same revision at the same
moment both pass the check, and the loss is silent: `loadForWrite` validates
the revision before building the update, while `writeSafeFile` publishes with
an unconditional `renameSync`, so the last rename wins and every earlier writer
is told it succeeded. Reproduced on 2026-09-15 in separate-context review:
twelve barrier-synchronized appends at revision 1 returned nine `appended`
responses at revision 2, and the resulting note held one entry. Selecting
simultaneous shared writers therefore requires a real compare-and-swap or lock
that does not exist today; this record does not select it.

An objective may still own **several linked notes**, as `LEXICON.md` and
[S-046](../../specs/S-046-json-notepad-foundation/SPEC.md) accept, with
`relationships.related_notes` and typed folders carrying that structure. What
is rejected is forking a second note for the same purpose merely because
another context created the one that exists. A purpose-distinct note, such as a
grilling record beside a work note, stays correct: create a note when no
reachable note already serves that purpose for the objective.

Reuse binds only where a context can actually reach the record. Live notes are
local and untracked, so a context on another machine has no path to the file
unless the optional private transport
([ADR-0051](0051-optional-private-git-transport-for-session-continuity.md)) is
configured for it, and that transport keeps one active writer per note and
preserves competing revisions. Where the record is unreachable, the Markdown
handoff carries continuation. That context still owes ongoing capture, so it
may keep a host-local note under the same objective key, naming the unreachable
note as related, and its material is reconciled into the objective's note or a
durable owner once reachable. It must not present that local note as the
objective's note or fork one where the original is reachable.

## Considered and rejected

One note per chat. It fragments one objective's context across several files,
so a resuming agent must discover and merge them, and it makes the Markdown
handoff the only cross-chat channel, which
[ADR-0043](0043-workbench-continuity-through-maintained-owners.md) already
rules is not the owner of continuity.

A lock or lease held by the writing chat. Mandatory coordination machinery
breaks standalone operation
([ADR-0043](0043-workbench-continuity-through-maintained-owners.md)). This
rejects a *mandatory* lease as the ownership mechanism; it does not judge a
future compare-and-swap fix for the write-safety gap named above.

## Consequences

This narrows the "concurrent writers" alternative that
[ADR-0040](0040-json-notepads-preserve-objective-continuity.md) left
unselected, taking its objective-scoped *ownership* and leaving simultaneous
writing unselected; ADR-0040 stays accepted and unchanged. No tool change is
required, and none is claimed to make overlapping writes safe.

Acceptance applies these edits, root and `templates/` mirror alike:

- `AGENTS.md` Session Records states that a note belongs to its objective and
  is shared, one writer at a time, by every context that can reach it.
- The `LEXICON.md` Notepad row gains the same ownership clause beside its
  existing several-linked-notes sentence.
- The `notepad` skill, which `AGENTS.md` names as the owner of notepad
  judgment, keeps its "check, not a lock" paragraph, says its writer rule
  bounds overlapping writes rather than chat ownership, reads a
  `stale-revision` refusal writer-neutrally, qualifies its creation rule to
  purpose-distinct notes, and says a resuming context expects entries from
  other contexts.

The concurrent-write loss named above is an unresolved runtime defect with no
owning spec. S-046 is complete, so closing it needs a new linked spec; this
record neither authorizes nor schedules that work.

## Provenance

Owner direction in the FND-Q23 deep-dive chat on 2026-09-15, on observing that
a second chat's appends to a live grilling note confused agents on other
models that read the skill's "one writer per note" as one chat per note, while
agents that read the objective-scoped intent appended correctly. The grilling
destination ledger records the objective-ownership part of TT-Q9 as answered
with this direction; its remaining Spec and Task relationships beyond the Packet
rule remain open. Proposed on
PR #92, where separate-context review corrected the first draft's claim that
the revision check serializes writers; the later review findings are resolved
in the text above. The historical 2026-09-11 foundation question report still
lists TT-Q9 options; the ledger is the current owner of that answer.
