---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Task receipt
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/skills/implement/SKILL.md
last_verified: 2026-10-07
---

# Task receipt: one appended row per run of a Task

A Task receipt is the Task's append-only record of its own runs, one row per
run, carrying that run's branch, HEAD SHA, upstream distance, dirty file count,
tests run with result, docs touched and remaining gap. The canonical definition
is the [glossary entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** This is the existing `receipt` sense in [ARCHITECTURE.md](../../ARCHITECTURE.md#ownership) — an operation's source and result — applied to a Task run, not a second meaning. The row is appended as the run proceeds, not deferred to a successful close, so an interrupted run leaves a trace; an unanticipated kill can still preempt an unwritten row. `TASKBOARD.md` projects a derived signal from these rows, never the rows themselves.

**Neighbouring words.** It belongs to one [Task](dictionary-task.md) and is
written by its [Worker](dictionary-worker.md) through the
[Journey](dictionary-journey.md). The [Hot
projection](dictionary-hot-projection.md) shows a signal derived from it, never
the rows.

**In use.** TK-009D's `TASK.md` has a Receipt table whose row for its run
carries the assembly branch, the HEAD SHA, upstream and dirty counts, the tests
with their results, the docs touched, the remaining gap and a checksum.
`spec-workbench.mjs receipt` appends such a row while a run proceeds; it is
never edited afterwards.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The Task decision (ADR-000H)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md): ADR-000H owns Receipt.
- [ARCHITECTURE.md, Ownership](../../ARCHITECTURE.md#ownership): the general receipt sense.
- [The `implement` skill, work selection and lifecycle](../skills/implement/SKILL.md#work-selection-and-lifecycle): when receipts are written.
