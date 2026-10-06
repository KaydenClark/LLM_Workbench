# TK-008O - A fresh context runs the loop end to end in a fixture room

**Task ID:** TK-008O
**Spec ID:** S-004L
**Slice:** A fresh context runs the loop end to end in a fixture room
**Status:** in-progress
**Stance:** Auditor
**Blockers:** TK-008L, TK-008M, TK-008N
**Destination:** spec-acceptance: The one skill exists in the lane, its loop has six named steps each with a checkable artifact, and a scenario in a fixture room runs it end to end.
**Planned verification:** A fixture room laid out from the committed candidate (`workbench-layout.mjs init`, `workbench-tools.mjs install`, `workbench-skills.mjs install`) carries the skill through both discovery roots and its Runbook row; a fresh-context Worker, given only the room and the row, runs the six steps on one small observed job and hands back the result record naming each step's artifact; the Auditor checks the record against the skill's steps and the room's state and records what held and what did not. No agent-outcome improvement is claimed from one pass.

## Outcome

Proof that the skill is followable cold: a fresh context in a fixture room
reaches the skill through the Runbook operations index, records the job
contract, takes a baseline, finds the earliest gap, makes one small owning
intervention, verifies through the room's native checks, reruns on a fresh
trajectory and decides retain, revise or remove, leaving the result record in
the room's feedback lane. The hand-back and the Auditor's check are recorded
in this Task.

## Scope

- A disposable fixture room under the host temporary directory.
- This Task record and the Spec evidence row; no source change unless the
  scenario finds a defect, which becomes a continuation of the owning Task.

## Acceptance

- [ ] The fresh context found the skill through the index and produced a
      result record with all six steps and the job contract.
- [ ] The Auditor named each step's artifact in the room and every gap found.

## Boundaries

One pass proves the loop is followable, not that the intervention generalizes;
the record says so. The fixture room is never a durable owner.
