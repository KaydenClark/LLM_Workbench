---
status: proposed
date: 2026-09-15
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
---

# A notepad belongs to its objective and every chat working that objective writes to it

A JSON notepad is owned by its **objective**, never by the chat, model, host or
provider that created it. Any agent working that objective resumes the same
note, reads its current view, appends to it, and must expect to find entries it
did not write. Finding another context's entries in a note is the note doing
its job, not corruption. Writers are **serialized, not exclusive**: the
runtime's revision check refuses a write against a revision that has moved, so
"one writer per note" means one writer *at a time*. A `stale-revision` refusal
is the signal that another context wrote; the response is to read again and
continue, never to abandon the note or open a second one for the same
objective. The single unsupported case is two contexts writing in the same
instant, which the check cannot see; the skill keeps naming it as the limit.

Considered and rejected: one note per chat. It fragments one objective's
context across several files, so a resuming agent must discover and merge them,
and it makes the Markdown handoff the only cross-chat channel, which
[ADR-0043](0043-workbench-continuity-through-maintained-owners.md) already
rules is not the owner of continuity.

Considered and rejected: a lock or lease held by the writing chat. Mandatory
coordination machinery breaks standalone operation
([ADR-0043](0043-workbench-continuity-through-maintained-owners.md)), and the
sequential guard already catches the case that actually occurs.

Consequences: this selects, in its sequential form only, the "concurrent
writers" alternative that [ADR-0040](0040-json-notepads-preserve-objective-
continuity.md) left unselected; ADR-0040 stays accepted and unchanged. No tool
change: `workbench/tools/notepads.mjs` already requires `--revision` on every
write and refuses a stale one. At acceptance, a Task applies three edits; the
skill edit is carried under `AGENTS.md`, which names the `notepad` skill as the
owner of notepad judgment, because a skill file is not itself a
`canonicalized_in` owner. The `notepad` skill rewrites "one writer per note
remains the rule" to "one writer at a time", and its resume step says to read
the current view and the relevant topic before writing, to expect entries from
other contexts, and to treat a stale-revision refusal as "someone else wrote"
rather than damage. `AGENTS.md` Session Records gains the sentence that a note
belongs to its objective and is shared by every context working it. The
`LEXICON.md` Notepad row gains the same ownership clause. Until then, the
current skill wording remains live and its reading as one chat per note is the
drift this record exists to correct.

Provenance: owner direction in the FND-Q23 deep-dive chat, 2026-09-15, on
observing that a second chat's appends to the live grilling note
`workbench-foundation-rework-2026-09-11` (entries `proposal-025`,
`finding-029`, `decision-064`) confused agents on other models that read the
current skill as one chat per note, while agents that read the objective-scoped
intent appended correctly. That note is untracked working material named as
origin, not as durable evidence. It partially informs the open question TT-Q9
on the relationship between a chat and its notepad without closing it.

## Promotion status

This record is `proposed`. The `notepad` skill, `AGENTS.md` and `LEXICON.md`
remain live as written until the owner accepts this decision.
