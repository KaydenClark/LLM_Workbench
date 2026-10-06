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

## Scenario Result (2026-10-06)

Fixture room "Tally" laid out from integration eef29648 (`workbench-layout.mjs
init`, `workbench-tools.mjs install`, `workbench-skills.mjs install`; the
skill present in `workbench/skills` and through both `.agents/skills` and
`.claude/skills`), with the template controls, a small word-count CLI and its
tests, and one seeded harness feedback row plus an owner-written baseline run
record: a worker asked to add a `--lines` flag found only the template
placeholders in the Runbook's Test And Build, ran no tests, shipped a
regression and needed the owner to relay the test command. The room was a
disposable directory in the Dispatcher's scratch area with a local bare
remote; it is not a durable owner, and this section is the record.

What the fresh context did, given only the room path and the operation
"Evaluate a harness change": it entered through `AGENTS.md` and the Runbook
operations index, followed the row to `workbench/skills/improve-harness/SKILL.md`,
and ran all six steps. Artifacts it left in the room, checked by the Auditor
(the Dispatcher in the Auditor stance) against the skill and the room's state:

| Step | Artifact in the room | Held |
|---|---|---|
| Job contract | filled contract in the result record | yes |
| 1. Baseline | baseline evidence from the run record plus executed checks (placeholder scan, a red check of the Test And Build commands, `node --test`, doctor) | yes |
| 2. Earliest gap | finding F-001: context gap at Test And Build, owner the Runbook; F-002 doctor misses placeholders, declined as upstream | yes |
| 3. Intervention | written hypothesis with supporting and weakening evidence and carrying cost | yes |
| 4. Native verification | commit a72bc3a (Test And Build filled), merged b569c40; check green, regression probe shows the documented command catches the baseline's bug | yes; room `main` untouched |
| 5. Fresh rerun | brief, isolated tag clone, fresh worker; trajectory recorded; dimension-by-dimension comparison | yes; outcome met first pass, zero relays |
| 6. Decision | test-without run requested by the skill's own rule, decision rule written before it; same worker also met the outcome without the change; decision retain as a documentation repair with no agent-outcome gain claimed; reconsideration conditions named | yes |
| Result record and feedback | one record in the feedback lane; two appended feedback rows (outcome, upstream lesson), prior row untouched | yes |

Gaps found (the scenario's own list, triaged):

- Skill wording, corrected by TK-008P: Taking In Feedback says a row "moves"
  status against an append-only record and the disposition set; step 5 guards
  only against conversational hidden help (the rerun worker opened the
  baseline run record, which named the command, and a plain clone exposed later
  tags); step 6 had no reading for a test-without run that also succeeds or for
  a change that is correct but shows no gain; step 4 assumed Spec and Task
  records.
- Fixture design, not a product defect: the baseline record sat in the starting
  state and named the answer (the Dispatcher's fixture choice); the room had
  no Spec, so dispositions had no owning Spec.
- Routed to other owners: `doctor` passes with unfilled Runbook placeholders
  (diagnostics owner); the template Runbook's evaluation commands name
  producer-only `tools/` and `evals/`; the template's "Write a manual harness
  feedback report" format (Round One) only partly fits a loop record; the
  feedback status legend does not say whether a change merged to integration
  is `landed`; `REPORT-topic-date.md` naming was refused by the worker's host
  tooling; neither rerun worker read the entry route (both grepped straight to
  Test And Build); one rerun worker wrote a file outside its checkout.

One pass proves the loop is followable cold; it does not show the intervention
generalizes or that the skill improves agent outcomes.
