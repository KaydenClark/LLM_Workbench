# Run Notes — [GOAL_NAME]

> **Disposable coordination notes for one run. Not a Taskboard, not a queue,
> not a proof store.** The coordinator is the only writer of this sheet.
> Tickets and proof live only in the owning stable spec; the project
> `TASKBOARD.md` stays a generated read-only projection. Delete this file when
> the run ends — it must never survive as a parallel project tracker.

**Owning spec:** `specs/S-###-[slug]/SPEC.md` — claimed slice `TK-###`
**Run started:** [YYYY-MM-DD HH:MM]
**Coordinator (primary durable writer):** [agent id]

## Done when

The slice's done criteria in the owning spec hold, the full verification suite
(`RUNBOOK.md` → Test And Build) passes, every lane below is `verified`, the
spec evidence row is appended and the projection rendered, and the integrated
result is committed and pushed.

## Lanes

Fill one row per dispatched role task. **Rule: no two open tasks may share a
`Touches` path — lanes do not overlap, ever.** If two tasks need the same file,
sequence them: dispatch one, verify and consolidate it, then dispatch the next.
Scout and Auditor lanes leave `Touches` empty; they are read-only.

| Task | Role (one contract) | Objective | Touches (only editable paths) | Immutable inputs | Verification | Docs impact | Status |
|---|---|---|---|---|---|---|---|
| A | [Engineer] | [bounded outcome] | `[path/ or file]` | owning spec, project controls | `[named check]` | [in lane / reserved for consolidation] | dispatched |
| B | [Scout] | [bounded question] | — (read-only) | everything it reads | [report with evidence links] | none | dispatched |

**Status values:** `dispatched` → `returned` → `verified` · or `sent-back` / `blocked`.

## Sequenced work (would overlap an open lane)

Work that must wait for a lane to close before it can be dispatched.

| Task | Waits for | Shared path that forced sequencing |
|---|---|---|
| [C] | [A] | `[path]` |

## Where results go

There is deliberately no proof log here. Role tasks return evidence in their
reports; the coordinator verifies each result and — as the single reserved
writer — records the outcome once in the owning spec's append-only evidence,
renders the projection, and discards this sheet.
