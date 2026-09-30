---
date: 2026-09-27
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - BLUEPRINT.md
  - RUNBOOK.md
---

# Roles scope work and stances define the job

## Decision

A role is the assigned scope of responsibility and action; a stance is the job
performed within it. Director covers the project and integration, Dispatcher
one Spec and its branch, Worker one Task. Branches express work scope; their
existence grants no authority. The request and project controls still govern.

Spec Planner and Spec Manager are distinct Dispatcher-usable stances with
separate capability Specs. Planner cuts small Tasks and parallel vertical slices
at flight launch and may dispatch Workers to help author Tasks. Manager sends
and monitors execution Workers. Reviewer and Auditor remain stances; they are
not extra roles. Changing stance does not erase prior involvement or establish
independent-review eligibility.

The minimum buildout keeps Dispatchers Spec-bound and the Director responsible
for cross-Spec coordination. Normal merge requests flow from Task branch to
Spec branch to integration. The release owner's explicit bootstrap exception
remains operative until its delivery gate is satisfied. Main remains owner-only.

## Rationale And Alternatives

One bundled Dispatcher capability would obscure the independently deliverable
planning and management jobs. Separate Planner and Manager roles would duplicate
the Dispatcher scope. A generalized lane spanning Specs would overbuild the
current need. The chosen composition supports parallel slices inside a Spec
while keeping cross-Spec coordination with the Director.

This refines ADR-0036 without removing its method/authority boundary. It replaces
the SCR-4A interpretation that branch placement is unrelated to role scope;
the prior answer is retained as superseded in the destination ledger. It does
not replace ADR-000F's review/QA gates.

## Consequences

Each missing role and stance gets its own planned Spec and future operating
entry/Wiki proof. Reviewer and Auditor reuse their existing owners. New Tasks
are cut at flight launch from current Actuality. Accepted decisions and progress
are reconciled into their tracked owners on integration through reviewed
changes; transient notes and unmerged branches are not the only discovery route.
No scheduler, required model allocation or runtime agent entry is delivered by
this decision record.

## Provenance

Owner confirmed ROLE-1 through ROLE-4 during the 2026-09-26/27 inquiry and then
explicitly confirmed the documentation, specification and integration endpoint.
The [destination ledger](../../wiki/grilling-destination-audit-ledger.json)
records those answers and the SCR-4A supersession; the
[role model](../../wiki/design-concepts/roles-and-stances.md) routes the separate
capability owners. GPT_OS Captain, Planner and Engineer were examples, not
instruction sources; no unread Steward behavior was imported.
