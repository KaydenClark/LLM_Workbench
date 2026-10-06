# TK-005D - Make the Runbook the operations index read at every session entry

**Task ID:** TK-005D
**Spec ID:** S-004C
**Slice:** Make the Runbook the operations index read at every session entry
**Status:** done
**Stance:** Builder
**Blockers:** TK-005B, TK-005C
**Destination:** spec-acceptance: `RUNBOOK.md` is an operations index in which each pointer has a stable path and a when-to-follow description, and each operation's procedure is reachable in a skill (the index and its entry-read half; procedures move in the family Tasks), and the Runbook-importance acceptance line.
**Planned verification:** Red: a new check fails because the Runbook has no index whose rows each carry an operation, a when-to-follow description and a pointer that resolves, because `AGENTS.md` does not tell a session to read the index at entry, and because an inbound `RUNBOOK.md#` or `AGENTS.md#` anchor would not resolve after the edit. Green: the index exists in `RUNBOOK.md` and `templates/RUNBOOK.md` with one row per operation, every pointer resolves to an existing file or heading, every inbound anchor from the baseline census still resolves, and the measured loaded cost of `AGENTS.md` plus the index is recorded against the baseline. `tools/test-control-fidelity.mjs`, `tools/test-governance-core.mjs`, `tools/test-controls-vocabulary-sweep.mjs`, the landing check and the full AGENTS suite pass on the committed candidate.
**Proof:** Runbook operations index in root and template RUNBOOK.md (62/42 rows, every pointer resolves to its existing section, every section reached), AGENTS.md entry route reads it at entry (root and template), tools/test-runbook-index.mjs red at 1bdf1ff2 (8/11 failed) and green at 1dbe78d9 (11/11) with anchor mutations failing; all census inbound anchors and every tracked AGENTS.md#/RUNBOOK.md# link resolve; landing check ok against d7ffffe9 and merge-base 92279f04; full AGENTS suite 50/50 at 1dbe78d9; guardrails 106.6/113 and 78/100 held. Measured: AGENTS.md 38,491 B + index 10,458 B = 48,949 B (~12,237 tokens) against the 38,178 B (~9,545 token) baseline; the bound is not met at this Task.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005d-runbook-index | 1dbe78d90645376523490757fae48970e28e02cc | ahead 0 behind 0 | 0 | Red 1bdf1ff2: tools/test-runbook-index.mjs 8 of 11 failed (no Operations Index in root or template RUNBOOK.md; AGENTS entry route did not name it). Green 1dbe78d9: test-runbook-index 11/11; anchor mutations (renamed AGENTS Git Rules heading, renamed Runbook Wiki Validation heading) each fail the check; test-control-fidelity 37/37, test-governance-core 12/12, test-controls-vocabulary-sweep ok, test-skills-lane 4/4, test-adr 56/56, test-workbench-layout 73/73; landing check base d7ffffe9 AGENTS 1 removed/1 landed, RUNBOOK 0 removed, and base merge-base 92279f04 (scratch inventories, the tool binds an inventory to its baseSha) AGENTS 1/1, RUNBOOK 0; full AGENTS suite 50/50 at 1dbe78d9 dirty []; evaluate-workbench templates 106.6/113, audit-guardrails 78/100 (both unchanged). Loaded cost: root AGENTS.md 38,491 B + index 10,458 B = 48,949 B (~12,237 tokens) vs baseline AGENTS.md alone 38,178 B (~9,545 tokens): bound NOT met at this Task (over by 10,771 B); family Tasks must bring AGENTS.md below ~27,720 B with this index. Template: 32,992 + 7,117 = 40,109 B (~10,027 tokens) vs 32,749 B. | RUNBOOK.md and templates/RUNBOOK.md: Operations Index at the top (62 and 42 rows, each pointing at its existing section; no section body removed) and test-runbook-index added to the Runbook Full verification list; AGENTS.md and templates/AGENTS.md: entry route names the index and requires reading it at entry, one Traverse, Don't Search sentence, test added to the AGENTS Full suite block; inventory-agents.json (line 4 pointer, preamble and Traverse lines stays) and inventory-runbook.json (preamble, Ordinary Entry, Finding The Owner lines stays). CLAUDE.md and LEXICON.md unchanged. Wiki checked; no update needed: no page's statement changes (the route still runs through RUNBOOK.md). | Combined-cost bound not met until family Tasks shrink AGENTS.md. README.md entry-route orientation line and templates/README.md still name Ordinary Entry rather than the index (TK-005N orientation text). Task packet carries only AGENTS.md as Contract member (census finding 5), left for TK-005E. | 4d6a437ede30d8aefbffb56ac0b15b76de90fea07dd95e5f6b94a0254e6a6d19 |
| 2 | claude/s004c-tk005d-runbook-index | 7d2b6826749c0c05e2c0013f9a34669bae963de5 | ahead 0 behind 0 | 0 | Runbook operations index in root and template RUNBOOK.md (62/42 rows, every pointer resolves to its existing section, every section reached), AGENTS.md entry route reads it at entry (root and template), tools/test-runbook-index.mjs red at 1bdf1ff2 (8/11 failed) and green at 1dbe78d9 (11/11) with anchor mutations failing; all census inbound anchors and every tracked AGENTS.md#/RUNBOOK.md# link resolve; landing check ok against d7ffffe9 and merge-base 92279f04; full AGENTS suite 50/50 at 1dbe78d9; guardrails 106.6/113 and 78/100 held. Measured: AGENTS.md 38,491 B + index 10,458 B = 48,949 B (~12,237 tokens) against the 38,178 B (~9,545 token) baseline; the bound is not met at this Task. | RUNBOOK.md, templates/RUNBOOK.md (index; suite list), AGENTS.md, templates/AGENTS.md (entry route, Traverse sentence, suite block), tools/test-runbook-index.mjs, both S-004C inventories (owned sections classified). CLAUDE.md and LEXICON.md unchanged. Wiki checked; no update needed: the route still runs through RUNBOOK.md. | Combined-cost bound held only once the family Tasks shrink AGENTS.md below about 27,720 B; README entry-route orientation text is TK-005N's; Task packet Contract member (census finding 5) left for TK-005E. | 6fa1c32d488725f3207f983ba1ab1179d62ed4bbf6cab7021e5523f5c92d452e |
