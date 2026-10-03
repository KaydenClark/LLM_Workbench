# TK-005L - Let role detail leave the controls for the role skills

**Task ID:** TK-005L
**Spec ID:** S-004C
**Slice:** Let role detail leave the controls for the role skills
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005K, S-002E:delivered, S-004B:delivered
**Destination:** spec-acceptance: Role detail leaves the controls: the role skills own what each role does, `AGENTS.md` keeps role-free rules such as scope by branch, the independence of review and owner-only approval and promotion to main (Desired Behavior item 6), through the inventory and landing check.
**Planned verification:** Red: before the move, the landing check over the role sections fails for each unplaced line when the bodies are dropped, and the index has no pointer from "act as Worker", "act as Dispatcher", "act as Director" or "act as Captain" to the skill that carries the role. Green: every line of `AGENTS.md` Assigned Work And Stances and the Runbook's Role And Stance Coordination text is classified, each role's detail is in its skill (`director`, `dispatcher`, `spec-planner`, `spec-manager`, the Worker role skill from the Worker Role Spec, and the Captain skill from the Captain Spec) with the check passing at the candidate, `AGENTS.md` keeps only the role-free rules, the retained headings keep every inbound anchor (`AGENTS.md#assigned-work-and-stances` and `RUNBOOK.md#role-and-stance-coordination` are linked from many Specs), the update-route fixture of the update-route Task still passes against the changed shape, and the full AGENTS suite passes on the committed candidate; touched Wiki pages lint clean.

## Outcome

Role detail leaves `AGENTS.md` and the Runbook once every role the detail
describes has a skill to land in. `AGENTS.md` keeps the rules that do not name a
role: scope is set by the branch and the assignment, review must be independent
of the work it reviews, only the owner approves and promotes to `main`, and a
stance never grants authority. Each role's job, handback and monitoring detail
lives in its skill, and the Lexicon keeps one sentence per role (that sentence
is the Lexicon Task's).

The blockers are the two role Specs the Spec's Dependencies name: Worker Role
and Captain Role And Landmark Director. The Director, Dispatcher, Spec Planner
and Spec Manager skills already exist in the lane; the Worker and Captain skills
do not yet. `S-###:delivered` is the grammar's honest form for "that Spec's
skill exists on integration, reviewed".

## Scope

- `AGENTS.md` Assigned Work And Stances, the role-and-stance text in the
  Runbook's Role And Stance Coordination, their index rows, the inventory
  entries, the template mirrors, readers and Wiki pages (including the Roles
  and stances design-concept article) as the Spec's family method states.
- Takes an `AGENTS.md` writer turn.

## Acceptance

- [ ] Every line of the role sections is classified and the landing check
      passes at the candidate.
- [ ] Each role's detail is reachable from an index row through that role's
      skill.
- [ ] `AGENTS.md` keeps scope by branch, review independence and owner-only
      approval and promotion, and no role-specific procedure.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no role's authority or handback rule changes meaning. No Worker
or Captain skill is authored here: those Specs own them, and this Task does not
start until they are delivered.
