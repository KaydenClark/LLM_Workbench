# TK-004Z - Read ADRs and DDRs with list, show, search, history and inspect

**Task ID:** TK-004Z
**Spec ID:** S-003X
**Slice:** Read ADRs and DDRs with list, show, search, history and inspect
**Status:** done
**Stance:** Builder
**Blockers:** TK-004X, TK-004Y
**Destination:** spec-acceptance: S-003X Acceptance Criteria box 4 (an agent can `list`, `show`, `search`, `history` and `inspect` an ADR and a DDR, and every existing command name still works)
**Planned verification:** Red: new `tools/test-adr.mjs` cases fail because `list`, `show`, `get`, `search`, `history` and `inspect` are unknown commands. Green: in a fixture room holding accepted, proposed, superseded and deprecated ADRs and DDRs, each read word returns the expected records in text and `--json`; `get` equals `show`; `search` reports status and, for a superseded hit, its successor; `history` reports the lifecycle chain and the Git commits that touched the file across a lifecycle move, and says Git is unavailable outside a Git room; `inspect` returns a frontmatter field and a line range and refuses an unknown field or an out-of-range span; an unknown identifier fails visibly; `validate`, `normalize`, `register`, `new` and `migrate-folders` behave exactly as before. `test-adr` and the full AGENTS suite pass on the committed candidate.
**Proof:** Red 0b0512cf (test-adr fails at import: no read-word exports). Green: test-adr 56/56 covering list, show and get, search, history and inspect for both kinds in text and JSON, their refusals, and unchanged existing commands; full AGENTS suite 48/48 on clean 4cd48973. TK-004Y PR #284 (review FAIL at 97c44ba2 corrected; fresh PASS at 6fb1de52) merged into integration as 5cfa987b before this close.

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

- [x] Each read word answers for an ADR and a DDR in text and `--json`.
- [x] `search` results carry status and a superseded hit's successor; the
      general corrections question stays open for other record tools.
- [x] `history` follows a record across a lifecycle move and reports Git as
      unavailable outside a Git room.
- [x] Every existing command name and its output is unchanged.

## Boundaries

No write behavior. No rename of an existing command. No read words for any
other record tool. Blocked on TK-004Y as well as TK-004X because all three
edit `adr.mjs`, `tools/test-adr.mjs` and the Runbook section, so they run one
at a time. No `LEXICON.md` or
`templates/LEXICON.md` edit.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-tk004z-read-words | 4cd4897331a80d7273f00ebcad4900d813cfbdcb | ahead 0 behind 0 | 0 | Red 0b0512cf: tools/test-adr.mjs exits 1 at import because adr.mjs exports no inspectRecord, listRecords, recordHistory, searchRecords or showRecord. Green: test-adr 56/56 (six new cases: list across kinds with kind and status filters and a superseded record's successor; show and its get synonym in text and JSON with a visible unknown-identifier failure; search with matching lines, status and a superseded hit's successor; history with the lifecycle chain and Git commits followed across the archive move, and Git reported unavailable outside a room; inspect by field and line range with its refusals; existing commands unchanged and refusing a stray positional). Real-corpus demo: list --status superseded, search, history ADR-0013 and inspect ADR-000S run in 0.5s. Full AGENTS suite 48/48 on clean 4cd48973 (TK-004Z merged with the corrected TK-004Y branch). | RUNBOOK decision-record section (read-word commands and output), templates/RUNBOOK command block and paragraph, Wiki article Decision Records and the Concept Map (read words installed). | Lexicon mirrors (TK-005A) remain; separate-context review of the final head pending. | 8827365b023b4608b200aaf9c46df3485a88c28d921f68ae45d263aa7a530519 |
| 2 | claude/s003x-tk004z-read-words | 8908e2ff5bd9caf0f8ad7347cc2b1b71fccb83bb | ahead 0 behind 0 | 0 | Red 0b0512cf (test-adr fails at import: no read-word exports). Green: test-adr 56/56 covering list, show and get, search, history and inspect for both kinds in text and JSON, their refusals, and unchanged existing commands; full AGENTS suite 48/48 on clean 4cd48973. TK-004Y PR #284 (review FAIL at 97c44ba2 corrected; fresh PASS at 6fb1de52) merged into integration as 5cfa987b before this close. | RUNBOOK and templates/RUNBOOK read-word commands, and the Wiki article Decision Records and the Concept Map updated. | TK-005A (Lexicon mirrors; its owner blocker is met since the Codex Lexicon branch landed in PR #281) remains; separate-context review of this Task's final head precedes its integration merge. | 5ece2d8c55df5c39f0d54be8159afe913cb4e0e5431a2caadca6f0827a9b173f |
