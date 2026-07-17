# Team Templates — Manager + Subagents

> **Legacy pre-v2.3 evidence. Do not adopt this folder into a current project.**
> It still uses a duplicate Taskboard/proof-log model that conflicts with the
> stable-spec lifecycle. S-020 owns its replacement.

A coordination layer for a **small, short-lived team**: 1 manager agent and 1–3 subagents, working for a few hours toward one goal.

It is deliberately lightweight. There is no task queue, no locking, no heartbeats. At this scale you avoid collisions by **partitioning the work before you launch**, not by coordinating at runtime. The manager owns the partition; each subagent stays in its lane; one shared file holds the assignments and the proof.

## Files

| File | Owner | Purpose |
|---|---|---|
| `MANAGER.md` | the manager agent | How to decompose the goal, assign non-overlapping lanes, review proof, integrate, and decide when it's done. |
| `SUBAGENT.md` | each subagent | How to execute one assigned task inside its lane, verify it, and report back. The quality bar. |
| `TASKBOARD.md` | shared (manager writes assignments, subagents append proof) | The single live coordination artifact: goal, assignments, and proof log. |

These sit *alongside* a project's own harness (`AGENTS.md`, `BLUEPRINT.md`,
`TASKBOARD.md`, `RUNBOOK.md`), not instead of it. The team files say **who does
what and how they coordinate**; the project files say **what the project is,
what is next, and how to verify it**. When they conflict, the project's
`AGENTS.md` authority order wins.

## How a run works

1. **Frame.** The manager reads the goal and the project docs, restates the goal in one sentence into `TASKBOARD.md`, and writes the global *Done when*.
2. **Partition.** The manager breaks the goal into 1–3 tasks whose edit paths (`Touches`) **do not overlap**. Non-overlapping lanes are the whole safety mechanism — get this right and the rest is easy.
3. **Assign.** One task per subagent, written into the assignment table with an `Owner` and a `Why`.
4. **Work.** Each subagent executes its task per `SUBAGENT.md`: smallest correct change, stay in lane, verify, append its own proof row.
5. **Review & integrate.** The manager checks each subagent's proof (does not trust claims), integrates, and resolves any conflict.
6. **Decide.** When *Done when* holds and no task is open, the manager reports up and stops.

## The one shared-write surface

Partitioning makes the *code* lanes disjoint, but `TASKBOARD.md` is written by everyone — so it is the one place the lanes overlap, and the one place writes can collide. Keep it safe without adding machinery:

- Every writer **re-reads `TASKBOARD.md` immediately before appending** and appends **only its own row**. If the file changed since it was read, rebase the new row onto the latest version rather than overwriting.
- No one edits another agent's row. The manager resolves any append conflict.
- Subagents log proof to the team `TASKBOARD.md` **only**. At run end the
  manager transcribes the final integrated result into the project root
  `TASKBOARD.md` proof log, so there is exactly one durable project record and
  one author for it.

## Scale assumptions (read before scaling up)

This set is tuned for **≤3 subagents, a few hours, a human nearby**. If you move to many agents or unattended multi-hour runs, you will need the things deliberately left out here — a claimable one-file-per-task queue, heartbeats, attempt caps, and a separate auditor contract. Don't bolt those on prematurely; they cost more than they're worth at this size.
