---
name: promote-decision
description: "Promote one confirmed Workbench decision through Record, Map, Plan and integration publication. Use for an assigned decision or a confirmed-decision handoff within its authorized endpoint."
---

# Promote Decision

Run **one confirmed decision** from a saved source, without requiring the
originating conversation. The goal is its durable records, destination map and
step plan published to integration. A nearer owner endpoint limits the run.

**Confirm -> Record -> Publish -> Map -> Publish -> Plan -> Publish**

The coordinator **orchestrates**. Subagent Workers **author** each stage and
its corrections. A publisher handles integration through the existing gates.
Communicate through context pointers; keep one writer per shared owner.

## Steps

1. **Confirm the intent.** Read the assigned decision's source, ID, revision,
   confirmed readback, rationale, corrections and endpoint. Resolve its owners
   through the manifest. Done when this exact decision and its authorization
   can be recovered without chat history; pending answers remain pending.

2. **Recover progress.** Inspect live owners, existing branches/PRs and freshly
   fetched integration. Create or resume this decision's publication branch.
   Done when the last published stage and next action are known; reuse existing
   records and coordinate dependencies on other decisions before dispatch.

3. **Dispatch a Record Worker.** Give it the decision pointers and bounded
   assignment to use [`to-docs`](../to-docs/SKILL.md): update records, memories
   and durable claims. Done when it returns faithful owner changes, exact
   commits, checks and remaining gaps, with unresolved choices retained in
   their working source.

4. **Dispatch a publisher.** It follows [`save`](../save/SKILL.md), the current
   review route and [`implement`](../implement/SKILL.md#branch-completion)
   branch completion for this stage. Return corrections to the authoring
   Worker. Done when the required gates pass, integration containment is proven
   and every changed owner reads back there. Release the next stage only then;
   serialize publication when other decisions share the target.

5. **Dispatch a Map Worker.** Give it the published decision owners and current
   Actuality. It uses [`to-spec`](../to-spec/SKILL.md) to map the destination
   into new or existing capability Specs. Publish through step 4. Done when the
   required maps read back from integration, with implementation state explicit.
   If no map change is needed, return the existing destination and the reason.

6. **Dispatch a Plan Worker.** Give it the published destination. It uses
   [`to-tasks`](../to-tasks/SKILL.md), native activation and
   [`tracer-bullet`](../tracer-bullet/SKILL.md) to plan authorized steps from
   live Actuality. Publish through step 4. Done when the checked Task records,
   dependencies and stances read back from integration, unclaimed. If no plan
   change is needed, return the existing plan and the reason.

7. **Return the result.** Name the decision ID/revision, durable owners,
   published commits, verified integration ref, checks, gaps and next action.
   Keep progress in existing owners and [`notepad`](../notepad/SKILL.md).
   Done when another cold start can recover the achieved endpoint and resume
   any unfinished stage.

If blocked or interrupted, retain the last verified stage and exact next
action. Resume through step 2. Implementation and owner acceptance follow
their own workflows; publication does not establish either.
