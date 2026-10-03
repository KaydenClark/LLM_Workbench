# TK-005F - Move the continuity and promotion operations behind their pointers

**Task ID:** TK-005F
**Spec ID:** S-004C
**Slice:** Move the continuity and promotion operations behind their pointers
**Status:** ready
**Stance:** Builder
**Blockers:** TK-005E
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (first family, which proves the method end to end), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: before the move, the landing check run over the family's sections with a candidate that drops the section bodies fails for every unplaced line, and a fixture agent-free read of the index finds no pointer from "resume a note" or "promote a claim" to a skill that carries the procedure. Green: every line of the family's `AGENTS.md` and `RUNBOOK.md` sections is classified in the inventory, the check passes at the candidate, the home skills carry the moved procedures and their binding requirements, the index rows point at those skills, the retained headings keep every inbound anchor, and the templates carry the same shape. The targeted tests the census names (notepads, sessions, direct promotion, session transport, skill catalog, skills lane, core composition) and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.

## Outcome

The first family moves end to end through every layer, so the method is proven
on one operation family before the larger families follow it. The family is the
continuity and promotion operations: working-context notes, private session
transport, portable save and promote, direct owner promotion, frozen checkpoint
history and operational recovery, and the evidence and continuation practices.

`AGENTS.md` keeps the lines that apply in every session (record no secrets or
private data, a note authorizes nothing, resume by verifying live state, promote
only supported claims into their owners, never cite an ignored live path as
durable evidence) as short declarative lines. The procedures, commands, flags,
failure handling and recovery steps live in the skills that carry them today
(`notepad`, `promote`, `save`, `handoff`, `checkpoint`, `grill-me`); a new skill
is added only for an operation the census shows has no fitting home, and a new
core skill is a bundle change with its catalog, receipt and Template effects, so
it is recorded as such. The Runbook sections keep their headings, each reduced to
a sentence and a pointer.

## Scope

- `AGENTS.md` Session Records And Checkpoints and Long Session Control, and
  the Runbook sections JSON Notepads, Optional Private Session Transport,
  Portable Save, Promote And Room-Local Skills, Direct Owner Promotion, Frozen
  Checkpoint History And Operational Recovery, and Evidence And Continuation
  Practices, as the baseline census confirms them.
- The home skills, the index rows, the inventory entries, the template mirrors
  and any Wiki page whose statement of these operations changes.
- Readers of these sections the census lists. Notepad Concurrent-Write Safety
  (S-003Y) also edits the notepad Runbook section: its edits and this Task's take
  turns, and the Dispatcher checks that no open candidate edits the same section
  before claiming.
- This Task follows the method in the Spec's Vertical Implementation Slices
  section and takes an `AGENTS.md` writer turn.

## Acceptance

- [ ] Every line of the family's sections is classified in the inventory and
      the landing check passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements.
- [ ] `AGENTS.md` keeps only lines that apply in every session for this family.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no rule's meaning changes, and a rule that would change belongs
to its own decision. No notepad or promotion runtime change. Other families'
sections are untouched.
