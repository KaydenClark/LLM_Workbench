# TK-005F - Move the continuity and promotion operations behind their pointers

**Task ID:** TK-005F
**Spec ID:** S-004C
**Slice:** Move the continuity and promotion operations behind their pointers
**Status:** done
**Stance:** Builder
**Blockers:** TK-005E
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (first family, which proves the method end to end), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: before the move, the landing check run over the family's sections with a candidate that drops the section bodies fails for every unplaced line, and a fixture agent-free read of the index finds no pointer from "resume a note" or "promote a claim" to a skill that carries the procedure. Green: every line of the family's `AGENTS.md` and `RUNBOOK.md` sections is classified in the inventory, the check passes at the candidate, the home skills carry the moved procedures and their binding requirements, the index rows point at those skills, the retained headings keep every inbound anchor, and the templates carry the same shape. The targeted tests the census names (notepads, sessions, direct promotion, session transport, skill catalog, skills lane, core composition) and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.
**Proof:** Continuity family moved behind lane-skill pointers: red ee3d0319 (test-runbook-index 5/17 failed), green 50da5613 (17/17); landing check ok vs pin d7ffffe9 (AGENTS 66/66, RUNBOOK 328/328) and merge-base 5c297db1 (65/65, 337/337); full AGENTS suite 50/50 at a473b6db dirty []; guardrails 106.6/113 and 78/100 held; wiki validate ok; AGENTS.md 39,072 -> 35,729 B, RUNBOOK.md 164,689 -> 142,400 B, AGENTS+index 49,780 -> 46,723 B.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005f-continuity-family | a473b6db5ee2cc563bc663debeec3337993ee063 | ahead 0 behind 0 | 0 | Red ee3d0319: test-runbook-index 5/17 failed (continuity rows not pointing at lane skills; AGENTS brief absent); landing check with the unclassified inventories at the green carriers: AGENTS 65/66 and RUNBOOK 322 groups unlanded (unclassified). Green 50da5613: test-runbook-index 17/17. Landing check ok vs pin d7ffffe9 (AGENTS 66/66, RUNBOOK 328/328 removed lines landed) and vs merge-base 5c297db1 with scratch inventories (65/65, 337/337 incl. 7 re-pointed index rows). Full AGENTS suite 50/50 at a473b6db dirty [] (incl. notepads, sessions, direct-promotion, session-transport, skill-catalog, skills-lane, core-composition, delivery-skills, governance-core, control-fidelity). Guardrails held: evaluate-workbench templates 106.6/113, audit-guardrails 78/100. wiki.mjs validate ok. Bytes: AGENTS.md 39,072 -> 35,729; RUNBOOK.md 164,689 -> 142,400; templates/AGENTS.md 33,573 -> 30,241; templates/RUNBOOK.md 93,947 -> 72,092; index 10,708 -> 10,994; AGENTS+index 49,780 -> 46,723 B (bound 38,178). | AGENTS.md and templates/AGENTS.md (Session Records And Checkpoints brief; Handoff assignments brief line; Long Session Control unchanged); RUNBOOK.md and templates/RUNBOOK.md (7 index rows re-pointed; JSON Notepads, Handoff Transfer, Optional Private Session Transport, Direct Owner Promotion, Frozen checkpoint/history sections reduced to sentence plus pointer; Portable Save and Evidence keep unhomed paragraphs plus pointer); skills notepad, handoff, save, promote, checkpoint (moved procedures under new headings; promote's ownership sentence re-pointed); Wiki skill-handoff, skill-checkpoint, skill-promote, skill-save; both S-004C inventories; tools/test-runbook-index.mjs. | Kept in place with no fitting continuity home: Runbook Portable Save core-catalog and room-local skill paragraphs (skills-lane operations, TK-005J/TK-005K), Evidence And Continuation task sizing (TK-005G), claim-age diagnostic (TK-005J), ADR amendment-first (TK-005J) and staged setup (TK-005M) paragraphs; AGENTS Handoff assignments role-authority paragraph left for TK-005L. Lexicon Handoff/Recovery/Scoped handoff rows still route to the Runbook (TK-005N). Combined loaded-cost bound not yet met. | 4254fa17ab1a43d85a430a6eeefad7287965167ccb9114ea79c64b066d60e655 |
| 2 | claude/s004c-tk005f-continuity-family | cfeed7773d955518a5cf050065c913db964e6fb7 | ahead 0 behind 0 | 0 | Continuity family moved behind lane-skill pointers: red ee3d0319 (test-runbook-index 5/17 failed), green 50da5613 (17/17); landing check ok vs pin d7ffffe9 (AGENTS 66/66, RUNBOOK 328/328) and merge-base 5c297db1 (65/65, 337/337); full AGENTS suite 50/50 at a473b6db dirty []; guardrails 106.6/113 and 78/100 held; wiki validate ok; AGENTS.md 39,072 -> 35,729 B, RUNBOOK.md 164,689 -> 142,400 B, AGENTS+index 49,780 -> 46,723 B. | AGENTS.md, templates/AGENTS.md (Session Records And Checkpoints brief, Handoff assignments brief line); RUNBOOK.md, templates/RUNBOOK.md (7 index rows re-pointed, continuity sections reduced to sentence plus pointer, headings kept); skills notepad, handoff, save, promote, checkpoint; Wiki skill-handoff, skill-checkpoint, skill-promote, skill-save; S-004C inventories; tools/test-runbook-index.mjs. | Unhomed paragraphs kept in place: Portable Save catalog and room-local skill rules (TK-005J/TK-005K), Evidence task sizing (TK-005G), claim-age diagnostic and ADR amendment-first (TK-005J), staged setup (TK-005M); Handoff assignments role-authority paragraph for TK-005L; Lexicon handoff/recovery routes (TK-005N); combined loaded-cost bound not yet met. | 1e748f9327456fe29273f0ebbcb5d820a39738a02a678437566cb67095fa7a7a |
