# TK-006J - Reconcile the writer rule in the skill, the Contract and the ownership decision

**Task ID:** TK-006J
**Spec ID:** S-003Y
**Slice:** Reconcile the writer rule in the skill, the Contract and the ownership decision
**Status:** in-progress
**Stance:** Reconciler
**Blockers:** TK-006H
**Destination:** spec-acceptance: S-003Y Acceptance Criteria box 6 (source, the `notepad` skill, the accepted ownership decision's description of the defect and the writer rule in the Contract agree after delivery) and box 7 (named verification and remaining limitations recorded without claiming owner approval)
**Planned verification:** Self-drift pre and post receipts and the bounded manual semantic check named in RUNBOOK, because the writer rule appears in the Contract and the skill. `grep` across `AGENTS.md`, `LEXICON.md`, `RUNBOOK.md`, their `templates/` mirrors, `workbench/skills/notepad/SKILL.md` and the Wiki finds no statement that the revision check is only a check or that overlapping writers both pass; the decision-record lifecycle leaves ADR-000L's defect paragraph as history with a successor or an explicitly dated narrowing, never an edit of accepted text; `test-control-fidelity`, `test-controls-vocabulary-sweep`, `test-skills-lane`, `test-wiki`, `test-adr` and the full AGENTS suite pass on the committed candidate.

## Outcome

After delivery the room says one thing about overlapping notepad writes
everywhere it speaks: writes to one note still happen one writer at a time as
practice, the runtime now refuses an overlapping write as `stale-revision`
instead of losing it silently, and the accepted ownership decision's statement
that the loss is an unresolved runtime defect is closed through the
decision-record lifecycle rather than by editing accepted history.

## Scope

- `workbench/skills/notepad/SKILL.md`: the "check, not a lock" paragraph is
  rewritten to describe the guard; coordinated with the owner of the skill
  wording, [S-00Y](../../../S-00Y-notepad-skill-rebuild/SPEC.md), which is at
  its owner gate.
- `AGENTS.md` Session Records and the `LEXICON.md` Notepad row, with their
  `templates/` mirrors, keep "one writer at a time" and gain nothing that
  claims the runtime serializes writers beyond refusing overlap.
- The accepted decision ADR-000L: its defect paragraph is history. Close it
  through the decision-record lifecycle the room has at the time (a successor
  record through `adr.mjs` once S-003X delivers `supersede`, otherwise a new
  proposed record that narrows it), never an edit of the accepted text.
- This Spec: Completion Result, acceptance boxes checked against evidence,
  Remaining Limitations.

## Acceptance

- [x] No control, skill or Wiki page states that overlapping writers both
      pass the revision check.
- [x] ADR-000L's defect statement is closed by lifecycle, with its text
      preserved as history.
- [x] Self-drift pre and post receipts and the bounded semantic check are
      recorded in this Spec's evidence.

## Boundaries

No runtime change. No edit to accepted ADR text. No claim of owner approval
or Human QA.
