# Team Templates — Captain + Role Tasks

Optional coordination guidance for a **small, bounded team**: one Captain-style
coordinator and one to three parallel role tasks, working a few hours toward
one assigned stable spec.

It is deliberately lightweight. There is no task queue, no locking, no
heartbeats. At this scale you avoid collisions by **partitioning the work
before you dispatch**, not by coordinating at runtime: disjoint edit lanes, one
role per task, one owning spec as the only proof store, and one single durable
writer per repository/spec/shared-file lane.

## Files

| File | Used by | Purpose |
|---|---|---|
| `MANAGER.md` | the coordinator (Captain) | How to partition one assigned spec into disjoint role tasks, dispatch, verify proof, consolidate evidence into the owning spec once, and checkpoint. |
| `SUBAGENT.md` | each role task | How to execute one assigned task under one role contract inside one lane, verify it, and return evidence to the coordinator. |
| `TASKBOARD.md` | the coordinator | A **disposable run-notes sheet** for lane assignments during one run. Never a durable queue, proof store, or second project Taskboard. |

These sit *alongside* a project's own controls (`AGENTS.md`, `BLUEPRINT.md`,
stable specs, generated `TASKBOARD.md`, `RUNBOOK.md`) and the workspace's role
contracts, not instead of them. The team files say **who does what and how they
coordinate**; the project files say **what is true, what is next, and how to
verify it**. When they conflict, the project's `AGENTS.md` authority order and
the loaded role contract win. Role contracts are linked, never copied.

## How a run works

1. **Frame.** The coordinator loads one assigned spec through the project's
   spec lifecycle, claims the eligible slice, and runs baseline verification.
2. **Partition.** The slice becomes the maximum safe set of independent role
   tasks whose `Touches` paths **do not overlap**. Disjoint lanes are the whole
   safety mechanism — work that shares a file is sequenced, never raced.
3. **Dispatch.** Each task gets exactly one role contract, one bounded
   objective, one lane, named verification, and a return format.
4. **Work.** Each role task executes per `SUBAGENT.md`: smallest correct
   change, stay in lane, verify, and return evidence in its report. Scout and
   Auditor tasks remain read-only.
5. **Verify and consolidate.** The coordinator checks each result against its
   proof (never the claim alone), then — as the reserved primary writer —
   updates the owning spec exactly once, renders the generated Taskboard
   projection, and runs the full verification suite.
6. **Decide.** When the slice's done criteria hold, the coordinator commits and
   pushes the integrated result, discards the run notes, and reports up.

## One durable record, one writer

The owning stable spec is the only ticket and proof store; the project
`TASKBOARD.md` stays a generated read-only projection. Role tasks return
evidence in chat or an explicitly disposable run artifact — they never append
to a shared ledger. The coordinator is the single durable writer for the owning
spec and projection, so the durable record never has competing concurrent
writers and no parallel Taskboard or proof log ever exists.

## Scale assumptions (read before scaling up)

This set is tuned for **one coordinator, one to three parallel role tasks, a
few hours, a human nearby**. If you move to many agents or unattended
multi-hour runs, you will need things deliberately left out here — a claimable
queue, heartbeats, attempt caps, and an independent audit cadence. Don't bolt
those on prematurely; they cost more than they're worth at this size.
