---
name: promote
description: "Promote a confirmed Workbench decision through durable docs, capability Specs, authorized Task plans and publication to integration. Compose within confirmed scope; honor selected-claim or nearer endpoints."
---

# Promote

Start with a confirmed decision or bounded shared concept. Resolve its owners
through the project manifest and follow the Contract's publication gates.

The full workflow is **Confirm -> to-docs -> Publish -> Map (to-spec) ->
Publish -> Plan (to-tasks) -> Publish**. Each published stage is available from
the declared **integration branch** before the next stage depends on it.
Promotion ends before implementing the planned capability.

A nearer endpoint limits the run: selected claims, docs only, or Specs only.
An existing caller such as `save` keeps its inherited scope. For selected
notepad claims, use [selected-claim reconciliation](references/selected-claims.md)
within that scope; it creates no extra planning or publication authority.

Use bounded authoring contexts and handoffs for the stages. An orchestrator
coordinates; Workers author assigned changes. Keep one writer per shared owner.

## Steps

1. **Confirm the scope.** Recover the owner's confirmed answer, rationale,
   corrections, conditions and endpoint from the conversation or working record.
   Chat confirmation follows its readback; a board entry supplies its exact
   confirmed answer and item revision. Keep unfinished exploration and pending
   answers unresolved. Use `notepad` when continuity is needed. This step ends
   with a named confirmed selection and its authorized endpoint; neither a label
   nor an agent recommendation confirms it.

2. **Author durable documentation.** Use `to-docs` to route each supported
   claim to its owning definition, decision record, control or Wiki page.
   Reconcile superseded meaning and link dependent owners instead of copying
   claims. For a JSON note, use the selected-claim reference's checked write.
   This step ends when owner read-back is faithful, normal checks pass and
   unresolved context is retained.

3. **Publish the documentation.** Follow [publication](references/publication.md)
   for this stage alone. Preserve unfinished code on its branch. This step ends
   with reviewed documentation contained in freshly fetched integration and its
   actual owner bytes read there. A local application or pushed branch is an
   earlier boundary. Stop here for a docs-only endpoint.

4. **Map the capabilities.** Use `to-spec` against the published documentation
   and live Actuality, reusing the capability's owner when one exists. Keep
   accepted destination, implemented behavior and remaining gaps distinct.
   This step ends with a checked planned Spec per new capability, linked to its
   durable decision owners, with no newly cut Tasks or implementation claim.
   If nothing needs mapping, record that reason and retain the existing owners.

5. **Publish the Specs.** Publish only the authored Spec records and required
   generated projections through the same publication action. This step ends
   when each exact Spec can be read independently from integration. Stop here
   for a Specs-only endpoint.

6. **Plan the Tasks.** Full promotion carries planning and activation authority
   for the confirmed capabilities; use `to-tasks` and its `tracer-bullet`
   discipline from current Actuality. Follow its native activation route, keep
   real blockers and assigned stances, and preserve existing Tasks. This step
   ends with checked Task records and projections under their published Specs,
   without claiming or implementing them. A blocked owner choice stays open in
   its Spec instead of becoming an executable Task.

7. **Publish the Tasks.** Publish the Task plan, activation state and projections.
   This step ends when integration contains their exact records and truthful
   readiness while any associated implementation remains on its own branch.
   Planning does not establish implementation, review or owner acceptance.

8. **Hand back shared state.** Report durable owners, published commit(s), the
   freshly verified integration ref, checks, remaining gaps and next eligible
   action. Append achieved stage evidence to the owning Spec when one exists
   and update local continuity. Pass the already-promoted result to `save` if
   persistence is needed, so it does not recurse. On an interruption, resume
   from live owners, PR state and containment: reuse published records, recover
   an unmerged stage, and advance only from the last verified point. Keep a
   blocked stage and its next action available through `notepad` or `handoff`.

Main promotion and owner Human QA remain at their existing gates. Integration
availability gives other sessions a shared source; automatic refresh or
consumption by every agent is a separate capability.

## Command reference

For `sessions.mjs promote`, load the [selected-claim command reference](references/selected-claims.md#command-reference).
It owns the source revision, destination hash, privacy and recovery checks.
For stage publication, load the [publication action](references/publication.md).
