# TK-006J - Reconcile the writer rule in the skill, the Contract and the ownership decision

**Task ID:** TK-006J
**Spec ID:** S-003Y
**Slice:** Reconcile the writer rule in the skill, the Contract and the ownership decision
**Status:** done
**Stance:** Reconciler
**Blockers:** TK-006H
**Destination:** spec-acceptance: S-003Y Acceptance Criteria box 6 (source, the `notepad` skill, the accepted ownership decision's description of the defect and the writer rule in the Contract agree after delivery) and box 7 (named verification and remaining limitations recorded without claiming owner approval)
**Planned verification:** Self-drift pre and post receipts and the bounded manual semantic check named in RUNBOOK, because the writer rule appears in the Contract and the skill. `grep` across `AGENTS.md`, `LEXICON.md`, `RUNBOOK.md`, their `templates/` mirrors, `workbench/skills/notepad/SKILL.md` and the Wiki finds no statement that the revision check is only a check or that overlapping writers both pass; the decision-record lifecycle leaves ADR-000L's defect paragraph as history with a successor or an explicitly dated narrowing, never an edit of accepted text; `test-control-fidelity`, `test-controls-vocabulary-sweep`, `test-skills-lane`, `test-wiki`, `test-adr` and the full AGENTS suite pass on the committed candidate.
**Proof:** Skill writer paragraph describes the guard; ADR-000Z accepted, narrowing ADR-000L's defect statement by lifecycle; self-drift pre/post unchanged at 7 pre-existing findings; guardrail 78/100 before and after; test-adr 56/56 after census bump, test-skills-lane, test-core-composition, test-wiki, test-control-fidelity, test-controls-vocabulary-sweep, test-notepads green.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003y-tk006j-writer-rule | 564a483ab548996149a3130195cf3a2076494270 | ahead 1 behind 0 | 0 | Self-drift pre at 50116be7 and post at the candidate: both blocked, cleanUpdate false, the same 7 pre-existing attention findings (stale-claim S-00Q, five stale-seed, unverified-provenance); no new finding. Guardrail audit 78/100 before and after. Bounded semantic check: AGENTS Session Records, LEXICON Notepad row, RUNBOOK JSON Notepads and their templates mirrors keep one writer at a time and claim no more than refusal; grep of controls, templates, skills and Wiki finds no statement that overlapping writers both pass (the grill-me Wiki line is now dated). ADR-000Z accepted through adr.mjs new/accept, narrowing ADR-000L with its text unchanged; adr validate and wiki validate ok. test-adr red 54/2 on the link census (29->30 files, 119->120 edges), green 56/56 after the count bump; test-skills-lane 4/4, test-core-composition 2/2, test-wiki 14/14, test-control-fidelity 37/37, test-controls-vocabulary-sweep pass, test-notepads 57/57. | workbench/skills/notepad/SKILL.md writer paragraph; workbench/docs/adr/000Z (new, accepted) with REGISTER/HISTORY; workbench/wiki/skill-grill-me.md dated line; tools/test-adr.mjs census; S-003Y acceptance, Completion Result and limitations. AGENTS.md and LEXICON.md checked: no update needed, they already say one writer at a time and nothing more. | S-00Y's owner-gate review should read the changed skill paragraph; installed host skill copies not updated; the three follow-up seams named by TK-006I have no Spec yet; owner Human QA. | 39f39329c8da338cc1b4f7143d5b655410c9186a2a00b3c64fc0f1de468b185b |
| 2 | claude/s003y-tk006j-writer-rule | 4468864bb5606467d116fd94b1a7fa0a80fe5802 | ahead 0 behind 0 | 0 | Skill writer paragraph describes the guard; ADR-000Z accepted, narrowing ADR-000L's defect statement by lifecycle; self-drift pre/post unchanged at 7 pre-existing findings; guardrail 78/100 before and after; test-adr 56/56 after census bump, test-skills-lane, test-core-composition, test-wiki, test-control-fidelity, test-controls-vocabulary-sweep, test-notepads green. | notepad SKILL.md, ADR-000Z with registers, skill-grill-me Wiki line, test-adr census, S-003Y Completion Result; AGENTS and LEXICON checked, no update needed. | S-00Y owner review of the changed paragraph; host skill copies; three named follow-up seams without Specs; owner Human QA. | 79ef31c6f5f0f4e8631ff311593a115b27c3b0fe387d068c779037be2f3e4435 |
