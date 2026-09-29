---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-002F TK-002Y article, 2026-09-29
  - Owner-confirmed minimum role/stance buildout ROLE-1..ROLE-4, 2026-09-27
source_paths:
  - workbench/skills/spec-planner/SKILL.md
  - workbench/specs/S-002F-spec-planner-stance/SPEC.md
  - tools/test-skill-catalog.mjs
  - LEXICON.md
  - workbench/docs/adr/000P-roles-scope-work-and-stances-define-the-job.md
  - workbench/docs/adr/0036-stances-change-method-not-authority.md
  - workbench/wiki/design-concepts/roles-and-stances.md
last_verified: 2026-09-29
---

# Spec Planner: cut one Spec into small parallel Tasks at flight launch

Use the `spec-planner` stance when you hold the Dispatcher role for one assigned Spec and that Spec's flight is launching: the Spec is being activated, or it is active and its work has not yet been cut into Tasks. The job is to turn the Spec's accepted requirements into small, complete-path Tasks that Workers can pick up in parallel without colliding, and to hand that plan to the Dispatcher's Spec Manager stance. It is a planning job inside one Spec. It does not execute a Task, and it does not plan neighbouring Specs.

**Inputs:** the assigned Spec, resolved through `workbench/manifest.json`; the live source and tests the Spec cites; the Spec's accepted requirements, remaining gaps and dependencies; and any Task drafts that Workers were asked to write. **Output:** small complete-path Tasks, each as a `tasks/<TK-####>/TASK.md` record with its own acceptance, proof, dependencies and one named writer per shared file; the concurrency groups that say which Tasks may run at once and which wait; the open gates; and the cross-Spec dependencies to surface to the Director. **Done when:** the plan and its gates are handed to Spec Manager, every published Task is executable from its record alone, and a proposed Task that still lacks something is marked as such rather than published as ready.

## How it works

The [skill](../skills/spec-planner/SKILL.md) is a stance, composed with a role that is already assigned. The Dispatcher role supplies the scope (one Spec and its branch) and the dispatch responsibility; the stance supplies the planning method and its obligations. Loading it changes the method only. It grants, removes or transfers no authority and spawns no agent, as [ADR-0036](../docs/adr/0036-stances-change-method-not-authority.md) records, and [ADR-000P](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md) adds that Spec Planner and Spec Manager are distinct Dispatcher-usable stances rather than extra roles. A Dispatcher or Worker never approves its own candidate; planning a Spec does not change that.

- **Inspect before cutting.** The planner reads the live source, the accepted requirements, the remaining gaps and the dependencies before it writes a record, so the Tasks describe the work as it stands at launch rather than as it looked when the Spec was drafted. It never enumerates execution Tasks when merely authoring a planned Spec: that is the shape `to-spec` leaves, and it is why a planned Spec has an empty `tasks/` directory until its flight launches.
- **Complete-path slices.** Each Task pierces every layer it needs (source, test, documentation, discovery) and lands with its own proof. This is the tracer-bullet discipline: a slice that changes one layer and leaves the rest for a later Task is not executable on its own and is not published as one.
- **One writer per shared file.** Where two Tasks would touch the same file, the record names which one writes it, and the planner serializes or merges the overlap instead of letting two Workers race. The Dispatcher stays the single writer of `SPEC.md`, every `TASK.md` and the generated projections; Workers hand results back rather than editing those records.
- **Concurrency groups.** The plan says which Tasks may run at once and which wait for others. Ordering is expressed in each record's `Blockers` field as `S-###`/`TK-####` ids only, so the runtime's `next` and `claim` can read it.
- **Proposed versus executable.** Workers may draft Tasks when that helps. A draft is evidence until the Dispatcher reconciles it into a record with an ID from `next-id`; only then is it an executable assignment. A slice that waits on an open owner decision stays uncut, with the decision recorded in the Spec's blockers, because a record cannot carry a prose blocker and `next` would otherwise hand the slice out.
- **Hand-off and escalation.** The plan and its open gates go to the Dispatcher's Spec Manager stance ([S-002G](../specs/S-002G-spec-manager-stance/SPEC.md)), which dispatches and monitors the execution Workers. A dependency on work that belongs to another Spec goes to the Director ([S-002C](../specs/S-002C-director-role/SPEC.md)) rather than being absorbed by enlarging this Spec or duplicating another lane's Task.

The mechanics follow `to-tasks`. Every new ID comes from `spec-workbench.mjs next-id S-### --prefix TK --json`, requested one at a time and committed when the record is written. A planned Spec is activated with `convert-tasks S-### --activate`, run once, after the records exist; the command changes no other header field, so the planner writes the Spec's `Latest event` and `Next gate` by hand, then runs `render` and `doctor`.

### Example, from the verification run

Reconciled by the Dispatcher from the TK-002Z scenario.

## Not the historical Planner role

The GPT_OS Planner informed this model as an example of Task preparation, in the same way its Captain informed project coordination and its Engineer informed bounded execution. [ADR-000P](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md) and the [role model](design-concepts/roles-and-stances.md) record that those were examples, not instruction sources. The stance described here imports none of that system's model allocation, scheduling, permanent departments or external-repository prerequisite; it is one Dispatcher's planning method inside one Spec, governed by this repository's request and controls.

## Composition

- Composes [`to-tasks`](../skills/to-tasks/SKILL.md) for the Task record shape and the `next-id`, `convert-tasks --activate`, `render` and `doctor` mechanics, and [`tracer-bullet`](../skills/tracer-bullet/SKILL.md) for the slice discipline.
- Operates inside the Dispatcher role ([S-002D](../specs/S-002D-dispatcher-role/SPEC.md)), which supplies the Spec scope and the dispatch responsibility the stance plans for.
- Hands its plan to the Spec Manager stance ([S-002G](../specs/S-002G-spec-manager-stance/SPEC.md)); the same Dispatcher changes stance, and no authority moves with it.
- Differs from the Reviewer and [Auditor](skill-auditor.md) stances, which verify a candidate or a claim rather than plan work. A Dispatcher may use those for a named verification job, and changing stance never makes it independent of work it planned or dispatched.

## Verified behavior and limits

Reconciled by the Dispatcher after TK-002X and TK-002Z.

## Sources

- [Spec Planner source](../skills/spec-planner/SKILL.md)
- [Individual delivery Spec](../specs/S-002F-spec-planner-stance/SPEC.md)
- [Stance terms in LEXICON](../../LEXICON.md#stance-terms)
- [ADR-000P: roles scope work and stances define the job](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md)
- [ADR-0036: stances change method, not authority](../docs/adr/0036-stances-change-method-not-authority.md)
- [Role model](design-concepts/roles-and-stances.md)
- [Runbook role and stance coordination](../../RUNBOOK.md#role-and-stance-coordination)
- [Wiki router](MEMORY.md)

## History

- 2026-09-29: Created by S-002F TK-002Y; scenario evidence reconciled by TK-002Z.
