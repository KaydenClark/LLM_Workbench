# S-004B - Captain Role And Landmark Director

**Spec ID:** S-004B
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Give the integration role its own Captain skill and rescope the Director skill to one landmark lane, so each role's job lives in its role skill and arrives with the Destination Packet.
**Blockers:** none for specification. The landmark lane the Director owns exists only once the LANDMARK.md runtime does; who reviews a Blueprint-level Spec is open. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner-confirmed role decision record of 2026-10-02; no Task is cut.
**Next gate:** At Plan, inspect live Actuality and cut small Tasks within this Spec.

> **Citation anchors.** pre=`cbb3d5b81c0081c45d92e0d284078ca13fd54c03` post=`cbb3d5b81c0081c45d92e0d284078ca13fd54c03`.

## Outcome

The role ladder is Captain, Director, Dispatcher, Worker. Each role has a role skill that owns what the role does: whom it assigns, what it reviews and its hand-back. An agent given work receives its job description because the Destination Packet links its role skill. The Captain skill takes the integration scope; the Director skill is rescoped to one landmark lane.

## Why It Matters

The owner confirmed that the integration role is the Captain and a landmark's role is the Director, and that role detail belongs in role skills rather than in the always-loaded Contract. The decision was promoted with the statement that it performs no delivery, and the Lexicon already states the accepted ladder while the controls and the existing `director` skill still use Director for the integration role. Until the role skills exist, the Contract rewrite has nowhere to move the role detail it removes, and a landmark has no lane owner.

## Current Verified State

At the pre anchor:

- The skills lane `workbench/skills/` holds 27 skills, including `director`, `dispatcher`, `spec-planner` and `spec-manager`. There is no `captain` skill and no `worker` skill.
- `workbench/skills/director/SKILL.md` states the Director's scope as the whole project and its integration branch, coordinating Spec-bound Dispatchers and cross-Spec work. That is the scope the accepted decision gives the Captain.
- The root `LEXICON.md` already carries one sentence per role in the accepted ladder and says that today's controls and the director skill still use Director for the integration role, which becomes the Captain, and that no worker role skill exists yet.
- `AGENTS.md` still carries role detail; moving it out belongs to the Contract rewrite.
- The Worker role is owned by [Worker Role](../S-002E-worker-role/SPEC.md), which has no Tasks cut. Its Director, Dispatcher, Spec Planner and Spec Manager counterparts, [Director Role](../S-002C-director-role/SPEC.md), [Dispatcher Role](../S-002D-dispatcher-role/SPEC.md), [Spec Planner Stance](../S-002F-spec-planner-stance/SPEC.md) and [Spec Manager Stance](../S-002G-spec-manager-stance/SPEC.md), are at their owner gates.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. A `captain` role skill covers the integration scope: it assigns Directors to landmarks, coordinates across landmarks, and oversees the Specs that sit under the Blueprint. It follows the skill contract (Purpose, Method / Posture, Obligations, Completion / Exit Condition), grants no authority of its own, and never spawns an agent by being loaded.
2. The `director` skill is rescoped to one landmark lane: the Director assigns the lane's Dispatchers and owns the landmark's review, including the whole-landmark check against the destination and the separate review of the work below it, from a context with no part in that landmark. A Director never executes a Task and gains no authority by occupying a lane.
3. The Captain and Director keep the owner above them: Human QA and main promotion remain owner acts, and a role never grants, removes or transfers authority.
4. The role skills state what each role assigns, reviews and hands back, so the role detail that the Contract rewrite removes from `AGENTS.md` and `RUNBOOK.md` has a home that exists first.
5. The Destination Packet links the role skill, so a Task or card always carries its job description with its work.
6. Existing rooms keep working through the change of meaning: a room that has the `director` skill installed gets the rescoped skill and the new `captain` skill through the normal update route, with the old integration-role content preserved as the Captain's, not lost.
7. Each role skill has an individual routed Wiki article, and the roles-and-stances explanation is reconciled to the new ladder.

## Decisions And Contracts

- The ladder is Captain (integration; assigns Directors to landmarks; coordinates across landmarks; oversees Specs under the Blueprint), Director (one landmark lane), Dispatcher (one Spec), Worker (one Task). The Director stays with the job it mostly keeps, assigning Dispatchers and giving the separate review one level down; the new integration job takes the new name. See [Captain, Director, Dispatcher and Worker scope work and role skills own each job](../../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md).
- Role detail leaves the Contract: `AGENTS.md` keeps role-free rules such as scope by branch, the independence of review and owner-only approval and promotion to main; the Lexicon keeps one sentence per role pointing at its skill; the role skills own what each role does.
- A landmark is a lane and not a branch, so the Director owns the landmark's scope and review with no landmark branch ([LANDMARK.md decision](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)).
- The Captain is reworked from its earlier external sense. This Spec uses it only as the Workbench's integration role and imports no model allocation, scheduling, permanent departments or external repository prerequisite.
- Stances, the Dispatcher's Spec scope, the Worker's Task scope and the review and QA gates stand. Reviewer and Auditor stance adoption alone never makes a prior participant independent.
- Skills in the tracked lane that a Contract carrier points to carry Contract force for their operation, so a change to a role skill is reviewed with Contract-level care ([Contract carriers are briefs that point to skills](../../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)).

Open, not decided here:

- Who gives the separate review of a Specs-under-the-Blueprint merge, now that the Director's job is one level down and the Captain oversees those Specs.
- How the installed `director` skill name carries its changed meaning through the core-skill ownership and compatibility rules.

## Non-Goals

The Worker skill, which [Worker Role](../S-002E-worker-role/SPEC.md) owns. The `LANDMARK.md` runtime, the Contract rewrite and any removal of role detail from `AGENTS.md`, a scheduler or portfolio manager, model or provider policy, a generalized multi-Spec Dispatcher, changing owner Human QA or main promotion, implementing another capability.

## Dependencies And Blockers

- The landmark lane exists only with [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md); the role skills can be authored against the accepted decision, but their landmark scenario is proved in a fixture landmark and live use waits on that runtime.
- The [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) removes the role detail from the Contract and requires these skills to exist first; no line leaves `AGENTS.md` before its home exists.
- [Core Skill Ownership And Compatibility](../S-051-core-skill-ownership-and-compatibility/SPEC.md) and [Core Skill Lifecycle And Optional Source Disposition](../S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) own how a changed core skill is installed and how a renamed meaning is handled.
- Coordinate shared controls and discovery with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md); the [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains the Task-PR rollout exception and the release gates. Adding a required core entry or changing managed bytes needs the normal bundle, version and install proof at implementation time, not an unstamped change.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices and safe parallel groups; the Captain skill and the Director rescope are separable. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] A fresh agent given a Task whose Destination Packet links the `captain` skill can state its scope, whom it assigns, what it reviews, its hand-back and its escalation to the owner without private notes.
- [ ] A fresh agent given a landmark and the `director` skill assigns a Dispatcher to a child Spec, owns the whole-landmark review, and refuses to give the separate review of a landmark it took part in.
- [ ] Neither role skill grants authority beyond the request and the controls, and neither executes a Task.
- [ ] The old integration-role content survives as the Captain's, and a room that updates keeps working with both skills.
- [ ] Each role skill has an individual routed Wiki article and the roles-and-stances explanation matches the ladder.
- [ ] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

Exercise the actual configured agent entry in a fixture room with a landmark, a Blueprint-level Spec and a landmark Spec, and inspect each role's hand-back and repository state. Routing and string checks support discovery but do not prove role behavior. Include an out-of-scope request, a conflicting writer and a prior-participant review attempt. Use receipt-backed installed commands for the managed route.

## Verification Procedure

Run the targeted skill, discovery and Wiki checks and the full AGENTS suite for the delivered change, then `render` and `doctor`. Capture the guardrail baseline and Workbench self-drift pre and post receipts with the bounded semantic check. Demonstrate the scenario in under one minute from its named artifacts, obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

Maintain each role's sentence in `LEXICON.md`, the operating contract in the skills lane, one individual Wiki article per role routed through the Wiki router, and the roles-and-stances article. Mirror changed portable rules in `templates/`. The accepted decision is history; the removal of role detail from the controls is documented by the Contract rewrite.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step from the owner-confirmed role decision record of 2026-10-02 at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; the skills lane and Lexicon role rows were read, no runtime proof claimed. | This Spec. | Plan, implementation and behavioral proof remain; the Blueprint-level review owner and the skill-name compatibility are open. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The Worker skill follows [Worker Role](../S-002E-worker-role/SPEC.md). Removing role detail from the controls follows the Contract rewrite.

## Supersession

- Supersedes: none
- Superseded by: none
