---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed minimum role and stance buildout, 2026-09-27
source_paths:
  - LEXICON.md
  - AGENTS.md
  - BLUEPRINT.md
  - RUNBOOK.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
parent: none
authorized_by: owner
last_verified: 2026-10-02
---

# Roles and stances

A role sets the scope of an agent's responsibility; a stance sets the job it
performs within that scope. The Director covers the whole project and
integration. A Dispatcher covers one Spec and its branch. A Worker covers one
Task. These scopes compose with the request and controls; possessing a branch
or loading a stance does not grant permission.

A Dispatcher using Spec Planner plans small Tasks and groups them into parallel
vertical slices when the flight launches. It may use Workers to help author
those Tasks. Using Spec Manager it dispatches and monitors execution Workers,
coordinates their results and owns assembled-Spec verification. Reviewer and
Auditor are jobs the Dispatcher can perform within that scope. Independent
review still needs an eligible uninvolved context; a new stance cannot erase
prior involvement.

For example, two Specs may advance in parallel under the Director. Inside each,
a Dispatcher plans two independent vertical slices and assigns their Workers.
Conflicting writes are serialized under a named writer; cross-Spec dependencies
return to the Director. Worker merge requests normally target their Spec branch;
the assembled Spec's reviewed merge request targets integration. The
[release exception](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md#bootstrap-exemptions)
explains the current bootstrap route. The
[operating procedure](../../../RUNBOOK.md#role-and-stance-coordination) owns the
steps and the [controls](../../../AGENTS.md#git-rules) own the gates.

## The accepted next shape

On 2026-10-02 the owner accepted a change ([the decision record "Captain, Director, Dispatcher and Worker scope work and role skills own each job"](../../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)). Landmarks become a level
of the map above Specs, so the ladder gains a level. The **Captain** works from
integration: it assigns a Director to each landmark, coordinates across
landmarks and oversees Specs that sit directly under the Blueprint. A
**Director** runs one landmark lane: it assigns that landmark's Dispatchers and
owns its review. A landmark is a lane, not a branch, so its Specs still merge
into integration as soon as their own review passes. Dispatchers and Workers
keep their scopes.

The same decision moves each role's job out of the always-loaded controls and
into its role skill, which the work's Destination Packet links, so an agent
gets its job description with its work. Until that lands, the description
above, in which the Director covers integration, is how the controls read.

## Separately owned capabilities

- [Director Role — S-002C](../../specs/S-002C-director-role/SPEC.md)
- [Dispatcher Role — S-002D](../../specs/S-002D-dispatcher-role/SPEC.md)
- [Worker Role — S-002E](../../specs/S-002E-worker-role/SPEC.md)
- [Spec Planner Stance — S-002F](../../specs/S-002F-spec-planner-stance/SPEC.md)
- [Spec Manager Stance — S-002G](../../specs/S-002G-spec-manager-stance/SPEC.md)
- [Reviewer Skill Rebuild — S-01R](../../specs/S-01R-reviewer-skill-rebuild/SPEC.md)
- [Auditor Skill Rebuild — S-01Q](../../specs/S-01Q-auditor-skill-rebuild/SPEC.md)

Each capability owns its operating entry, individual Wiki explanation and
behavioral proof. This article explains their composition; the linked Specs
own delivery state. Planning these capabilities does not install agent entries,
launch a flight or cut new Tasks.

## Reference and boundary

GPT_OS Captain informed project coordination (the accepted next shape reuses the name for the integration role), Planner informed Task preparation,
and Engineer informed bounded execution and recoverable hand-back. The owner
also named Steward as a Dispatcher example; no Steward contract was found in
the inspected backup role, Foundry reference or historical role locations, so
no behavior is attributed to an unread source. Those examples are not a 1:1
mapping and supply no Workbench instructions. Historical GPT_OS model selection,
scheduling and authority rules are not imported.

The minimum buildout stays focused on rolling out Specs and Tasks. A generalized
multi-Spec Dispatcher and an exhaustive role taxonomy are beyond it. The broader
direct Blueprint Task design keeps its existing owner; it is not needed to
establish these Spec-bound roles.

## Evidence and Sources

- [Lexicon](../../../LEXICON.md): accepted role and stance definitions.
- [Decision record: "Captain, Director, Dispatcher and Worker scope work and role skills own each job"](../../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md): the Captain and landmark Director, and role jobs moving into role skills.
- [AGENTS](../../../AGENTS.md): assignment, authority and integration review.
- [Blueprint](../../../BLUEPRINT.md): coordinated delivery destination.
- [Runbook](../../../RUNBOOK.md#role-and-stance-coordination): operating route.
- [Destination ledger](../../sessions/grilling-destination-audit-ledger.json): ROLE-1 through ROLE-4 and the explicit SCR-4A supersession.
- [Release reconciliation](../../specs/S-00O-workbench-v4-0-0-release/INTEGRATION-RECONCILIATION.md): source inventory and delivery limits.

## History

- 2026-09-27: Created on owner direction after confirmation of the combined concept. Reviewer changed from the initial role proposal to a stance; Dispatcher remains bounded by one Spec with parallel slices inside it.
- 2026-10-02: Added the accepted Captain and landmark Director ladder and the move of role jobs into role skills, from the owner-confirmed grilling of 2026-10-02.
