---
type: design-concept
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - owner direction via S-00I TK-005's dispatcher handoff, 2026-09-18 (workbench/sessions/handoffs/v4-lane-S-00I-TK-005-reconcile-and-retire-2026-09-18.md)
source_paths:
  - workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/tools/task-record.mjs
  - workbench/tools/task-receipt.mjs
  - workbench/tools/task-packet.mjs
  - workbench/tools/spec-workbench.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-18
---

# The Task Artifact And Its Lifecycle

A **Task** is a standalone artifact, `TASK.md`, living at
`<spec-directory>/tasks/<TK-id>/TASK.md`. It is a bounded, executable thin
vertical slice of a `SPEC.md`, carrying its own blocking relationships so
independent Tasks can complete in parallel. It replaced an embedded row in
the Spec's own slice table, because a table row cannot occupy a folder and
cannot carry an append-only run history of its own. This durable capability
was delivered by
[S-00H](../../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md)
and decided by
[ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md);
this article explains the capability the way an owner reads it, not the
Spec's own evidence trail.

## Why It Is Trusted

Every claim below is either read straight from the room's own live tool
(`task-record.mjs`, `task-receipt.mjs`, `task-packet.mjs`,
`spec-workbench.mjs`) or from ADR-000H's accepted decision text - never
copied from S-00H's Spec body or its Tasks' own evidence rows, which stay
`SPEC.md`'s and `TASK.md`'s own append-only history at their retired route.
When this article, accepted Canon and a live tool disagree, follow
`AGENTS.md` State Resolution: newer Canon identifies an implementation gap,
newer verified Actuality identifies documentation drift, and unclear ordering
requires investigation. Record the condition in its owner using direct proof.

## What A Task Carries

A Task loads a **Packet** at entry (`task-packet.mjs`'s `assembleTaskPacket`):
the `TASK.md` itself, the Spec acceptance lines that Task satisfies, the cited
source and test paths, and the Workbench Contract - nothing else. The Spec
body is reached by traversal when a Task needs it, never copied into the
Packet, so no acceptance rationale can drift from its owner. A Scoped handoff
and the objective's local JSON notepad enter only when one exists, as working
context that may never be read as instruction or as proof; a Task must stay
executable from its required Packet members alone, since neither file is
tracked and a fresh clone or another machine will not have them.

A Task closes with a **Receipt** (`task-receipt.mjs`): an append-only table
inside `TASK.md`, one row per run, each row chained to the one before it by a
checksum so an altered earlier row fails closed rather than being silently
accepted. Each row records that run's branch, HEAD SHA, upstream distance,
dirty file count, tests run with result, docs touched, and remaining gap. The
row is appended proactively as a run proceeds - `receiptTask` in
`spec-workbench.mjs` (the `receipt` verb) can append to an in-progress Task
independent of `close` - on the same before-interruption discipline `AGENTS.md`
already requires of notepads, not deferred until a successful close. `close`
on a record-backed Task (`closeTask`) still appends the run's own final
Receipt row before flipping the record's Status to `done`, and it does so
before writing anything else, so a failing append leaves the record and its
Spec byte-identical rather than a record marked done with no run evidence
behind it.

## What The Board Shows

`TASKBOARD.md` never renders the full Receipt table. It renders a **derived
signal** for the Spec's currently selected Task: the run count and the latest
run's branch, short SHA (seven characters), and dirty-file count -
`runs N, <branch> @ <sha7>, dirty D` - so a multi-run or a dirty Task is
distinguishable from the board alone without opening it
(`renderHotBoard`/`receiptSignal` in `spec-workbench.mjs`). A Spec with more
than one Task in-progress at once lists every one of them, each with its own
signal, rather than collapsing to a single cell. The rows themselves stay in
the Task; the board shows the symptom, and the Task holds the story of why a
run took more than one pass.

## The Task Vocabulary Decision

`Task` is the execution-slice term across the Workbench - explanatory prose,
the live tool vocabulary, the board's columns, and every identifier newly
allocated to an execution slice. `Ticket` is retired as a live term, because
one concept carrying two names is exactly what `LEXICON.md` forbids. Existing
`TK-###` identifiers already issued before the rename are **not** rewritten:
they sit in append-only evidence rows inside Specs that are themselves frozen
by their own retention rule, and rewriting them would edit a record precisely
because it is being read as history. They remain readable as `TK-###` history
even though the identifier form was never changed - only newly allocated
Tasks and the vocabulary describing them changed at ADR-000H's acceptance.

## One Task, One Context

One Task is intended to be one fresh agent context, one branch, and one
Receipt - an aspiration the harness cannot itself enforce, since a run can
still end on token exhaustion or an owner's Stop regardless of intent. A Task
that does not finish in one context resumes as the *same* Task and appends
another Receipt row; it is never split as a penalty for a limit it could not
predict. The split happens at planning time instead: work expected to need
more than one context unit is written as a Spec with multiple Tasks, not
folded into a single oversized one.

## Evidence and Sources

- [ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md) - the accepted decision this article explains.
- [S-00H (retired)](../../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) - the Spec that delivered the Task artifact, the Packet/Receipt vocabulary, and the Ticket-to-Task rename, retired here after this article's reconciliation.
- `workbench/tools/task-record.mjs` - the standalone Task record's reader/writer and its closed status vocabulary.
- `workbench/tools/task-receipt.mjs` - the append-only, checksum-chained Receipt table.
- `workbench/tools/task-packet.mjs` - `assembleTaskPacket`, the bounded entry bundle.
- `workbench/tools/spec-workbench.mjs` - `closeTask`, `receiptTask`, `renderHotBoard`/`receiptSignal`, and the lifecycle-folder move commands a Task's directory now supports.

## History

- 2026-09-18: created on owner direction, via S-00I TK-005's dispatcher
  handoff, to serve as the durable Wiki owner of S-00H's surviving current
  claims ahead of its retirement into `workbench/specs/retired/`.
