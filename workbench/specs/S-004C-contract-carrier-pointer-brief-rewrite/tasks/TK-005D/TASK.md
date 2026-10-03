# TK-005D - Make the Runbook the operations index read at every session entry

**Task ID:** TK-005D
**Spec ID:** S-004C
**Slice:** Make the Runbook the operations index read at every session entry
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005B, TK-005C
**Destination:** spec-acceptance: `RUNBOOK.md` is an operations index in which each pointer has a stable path and a when-to-follow description, and each operation's procedure is reachable in a skill (the index and its entry-read half; procedures move in the family Tasks), and the Runbook-importance acceptance line.
**Planned verification:** Red: a new check fails because the Runbook has no index whose rows each carry an operation, a when-to-follow description and a pointer that resolves, because `AGENTS.md` does not tell a session to read the index at entry, and because an inbound `RUNBOOK.md#` or `AGENTS.md#` anchor would not resolve after the edit. Green: the index exists in `RUNBOOK.md` and `templates/RUNBOOK.md` with one row per operation, every pointer resolves to an existing file or heading, every inbound anchor from the baseline census still resolves, and the measured loaded cost of `AGENTS.md` plus the index is recorded against the baseline. `tools/test-control-fidelity.mjs`, `tools/test-governance-core.mjs`, `tools/test-controls-vocabulary-sweep.mjs`, the landing check and the full AGENTS suite pass on the committed candidate.

## Outcome

The Runbook is the first thing a session reads after `AGENTS.md`, and it is
small. It becomes a table of operations in the shape the accepted decision
names: a sentence per topic and a context pointer, meaning a stable path plus
a description of when following it is worth it, written to match how tasks
present. At this Task every row still points at the existing section (or
skill); the family Tasks later re-point rows as procedures move. Because a
pointer declared in this index is what makes a skill bind (the pointed-skill
Task), the index is where an operation's authority is declared once.

The Plan decision behind it (agent, derived from the owner's locked words and
the accepted decision, recorded in the Spec for owner review; it does not gate
work): the Runbook is a contract artifact in the owner's sense because every
session reads its index at entry, `AGENTS.md` carries the line that requires
that read (`AGENTS.md` is the entry file every host shares, and the generated
room's `CLAUDE.md` stays the single import `@AGENTS.md`), and the combined cost of
`AGENTS.md` plus the index is measured and held below today's `AGENTS.md`
alone.

## Scope

- `RUNBOOK.md` and `templates/RUNBOOK.md`: the index at the top (operation,
  follow when, pointer), the operations the baseline census lists, and the
  retained headings below it. No section body is removed here.
- `AGENTS.md` and `templates/AGENTS.md`: the entry route line (read this file,
  then the Runbook index, then the Lexicon routing) in "Traverse, Don't Search"
  and the opening paragraph, kept to the lines that apply in every session.
  This Task takes an `AGENTS.md` writer turn.
- A check that every index pointer resolves and every inbound anchor in the
  baseline census still resolves (`tools/test-*.mjs`; reuse an existing link or
  anchor audit if the census finds one), listed in the Full suite block.
- Content-asserting readers the census names for the entry route, updated with
  the text.

## Acceptance

- [ ] Every operation has one index row with a stable pointer and a
      when-to-follow description; every pointer resolves.
- [ ] A session's entry route reads `AGENTS.md`, then the index, and the
      measured combined cost is recorded.
- [ ] No inbound `AGENTS.md#` or `RUNBOOK.md#` anchor stopped resolving.
- [ ] Root and template carry the same shape; `CLAUDE.md` is unchanged.

## Boundaries

No procedure moves and no line leaves `AGENTS.md` beyond the entry wording. No
Instruction Authority change (the next Task). No adapter import of the Runbook
into `CLAUDE.md`: that option is recorded in the Spec and decided after the
cost is measured. No Lexicon edit.
