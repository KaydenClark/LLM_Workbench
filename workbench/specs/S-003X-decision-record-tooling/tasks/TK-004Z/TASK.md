# TK-004Z - Read ADRs and DDRs with list, show, search, history and inspect

**Task ID:** TK-004Z
**Spec ID:** S-003X
**Slice:** Read ADRs and DDRs with list, show, search, history and inspect
**Status:** ready
**Stance:** Builder
**Blockers:** TK-004X, TK-004Y
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 4 (an agent can `list`, `show`, `search`, `history` and `inspect` an ADR and a DDR, and every existing command name still works)
**Planned verification:** Red: new `tools/test-adr.mjs` cases fail because `list`, `show`, `get`, `search`, `history` and `inspect` are unknown commands. Green: in a fixture room holding accepted, proposed, superseded and deprecated ADRs and DDRs, each read word returns the expected records in text and `--json`; `get` equals `show`; `search` reports status and, for a superseded hit, its successor; `history` reports the lifecycle chain and the Git commits that touched the file across a lifecycle move, and says Git is unavailable outside a Git room; `inspect` returns a frontmatter field and a line range and refuses an unknown field or an out-of-range span; an unknown identifier fails visibly; `validate`, `normalize`, `register`, `new` and `migrate-folders` behave exactly as before. `test-adr` and the full AGENTS suite pass on the committed candidate.

## Outcome

An agent asks an ADR or a DDR the same five reads it asks any record, defined
once in the Lexicon's Read words row:

- `adr.mjs list [--kind adr|ddr] [--status STATUS]`: the records that exist,
  both kinds by default.
- `adr.mjs show ID` (with `get ID` accepted as a synonym): one whole record.
- `adr.mjs search QUERY [--kind adr|ddr]`: records found by a case-insensitive
  literal query over title, frontmatter and body, each with its matching
  lines, status and, for a superseded record, its successor.
- `adr.mjs history ID`: how a record changed: its lifecycle chain and the Git
  commits that touched its file, following lifecycle moves.
- `adr.mjs inspect ID (--field NAME | --lines START:END)`: part of a record.

Every read takes `--json`. `ID` is a visible identifier whose `ADR-` or `DDR-`
prefix selects the kind. Reads never write.

## Scope

- `workbench/tools/adr.mjs`: the six read commands as exported functions and
  CLI words over the shared record listing; existing commands unchanged.
- Documentation: the Runbook decision-record section lists the read words;
  `templates/RUNBOOK.md` follows; the Wiki article "Decision Records and the
  Concept Map" when it says the tools have no read command.

## Acceptance

- [ ] Each read word answers for an ADR and a DDR in text and `--json`.
- [ ] `search` results carry status and a superseded hit's successor; the
      general corrections question stays open for other record tools.
- [ ] `history` follows a record across a lifecycle move and reports Git as
      unavailable outside a Git room.
- [ ] Every existing command name and its output is unchanged.

## Boundaries

No write behavior. No rename of an existing command. No read words for any
other record tool. Blocked on TK-004Y as well as TK-004X because all three
edit `adr.mjs`, `tools/test-adr.mjs` and the Runbook section, so they run one
at a time. No `LEXICON.md` or
`templates/LEXICON.md` edit.
