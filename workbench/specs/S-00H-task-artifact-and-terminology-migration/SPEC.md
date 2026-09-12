# S-00H - Task Artifact And Terminology Migration

**Spec ID:** S-00H
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-12
**Catalog description:** Make a Task a standalone `TASK.md` artifact and replace Ticket with Task across prose, tools and newly allocated identifiers.
**Blockers:** ADR-000H is `proposed`.
**Latest event:** Spec authored from approved answers TT-Q2 and WF-5; no implementation started and no ADR accepted.
**Next gate:** Owner accepts ADR-000H before any slice is claimed.

> **Citation anchors.** pre=`c0ac60a179235ef22fa6ea81aec74735087e06e5` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

A Task is its own artifact — a `TASK.md` holding one bounded executable thin
vertical slice of a Spec with its own blocking relationships — and the Workbench
speaks one word for that concept. `Ticket` is gone from live prose, tool
vocabulary, board columns and newly allocated identifiers. Identifiers already
issued are untouched.

## Why It Matters

Two things fail today. A slice lives as a row in a table inside its Spec, so it
cannot carry its own state, cannot be addressed as a record, and cannot occupy a
folder — which is what blocks folder lifecycle from reaching Tasks at all.
Separately, the Workbench uses `Ticket` and `Task` for one concept, which
`LEXICON.md` forbids, and the standalone artifact makes that collision immediate
rather than theoretical.

## Current Verified State

At the pre anchor, slices are table rows. `workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md`
carries a `Ticket | Slice | Status | Blockers | Proof` table with five `TK-###`
rows inside append-only evidence. `ticket` vocabulary appears in at least ten
tool files including `workbench/tools/spec-workbench.mjs`,
`workbench/tools/diagnostics.mjs`, `workbench/tools/spec-packet.mjs`,
`workbench/tools/wiki.mjs`, `workbench/tools/workbench-layout.mjs`,
`tools/cross-provider-resume.mjs`, `tools/audit-guardrails.mjs` and
`tools/team-coordination-contract.mjs`. `spec-workbench.mjs` allocates ticket
identifiers through `visible-ids` and exposes `claim`, `close` and `next`
against them. The `to-tickets` skill instructs the embedded-row model directly.

## Desired Behavior

An agent selecting work receives a Task record, claims it, and completes it
without editing a table in another file. Blocking relationships live on the Task.
The board renders Tasks. Commands, skills and documentation say Task.

A reader encountering a historical `TK-###` in a completed Spec still
understands it, because those identifiers remain readable exactly as written.

## Decisions And Contracts

- The Task artifact, the terminology replacement, and the frozen-identifier
  rule: [ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).
- The altitude a Task occupies: [ADR-000G](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md).
- What the board does with Tasks: [ADR-000E](../../docs/adr/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md).

ADR-000H is `proposed` at authoring time. No slice may be claimed while it
remains proposed. Note that this Spec itself uses the live `Ticket` table format
below, because the rename is not Canon until the owner accepts the decision.

## Non-Goals

- **Rewriting historical identifiers.** Existing `TK-###` rows sit in
  append-only evidence and are preserved as written.
- Moving any Spec or Task between folders; that is S-00I.
- Retiring or deleting any completed Spec.

## Dependencies And Blockers

Blocked on owner acceptance of ADR-000H. S-00I depends on this Spec's TK-001,
because folder lifecycle cannot reach a table row.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Introduce `TASK.md` as a record with its own state and blockers | blocked | ADR-000H proposed | Red test for reading/claiming a standalone Task; green minimal record; full suite |
| TK-002 | Migrate selection, claim, close and render onto Task records | blocked | TK-001 | Red tests at the `spec-workbench.mjs` seam; green commands; `doctor` clean |
| TK-003 | Replace Ticket with Task across tool vocabulary and board columns | blocked | TK-002 | Red tests per touched tool; green rename; historical `TK-###` rows byte-identical |
| TK-004 | Update `to-tickets` and the skills and controls that instruct the old model | blocked | TK-003 | Skill catalog and inspection tests pass; composition test green |
| TK-005 | Assemble the Packet a Task loads at entry | blocked | TK-001 | Red test for a Packet missing a required member; green assembly of TASK.md, satisfied Spec acceptance lines, cited source/test paths and the Contract; Scoped handoff and local notepad included only when present and never treated as instruction or proof |
| TK-006 | Write the append-only per-run Receipt | blocked | TK-001 | Red test asserting a resumed Task appends rather than overwrites; green one-row-per-run Receipt recording branch, HEAD SHA, upstream distance, dirty file count, tests run with result, docs touched and remaining gap |
| TK-007 | Project the Taskboard's derived Receipt signal | blocked | TK-006, TK-003 | Red test for a multi-run and a dirty Task; green per-Task run count plus latest run's branch, short SHA and dirty-file count; full run table proven absent from `TASKBOARD.md` |

### TK-001 - Introduce `TASK.md` as a record with its own state and blockers

**Stance:** Builder

Define the Task record at a stable seam and add a failing test that reads a
standalone Task and its blocking relationships. Implement the smallest record
that turns it green. Existing embedded tables keep working during this slice;
converting them is TK-002.

### TK-002 - Migrate selection, claim, close and render onto Task records

**Stance:** Builder

`next`, `claim`, `close` and `render` move to Task records. The append-only
evidence rows of completed Specs are read, never rewritten. Prove that a
completed Spec's historical table survives the migration unchanged.

### TK-003 - Replace Ticket with Task across tool vocabulary and board columns

**Stance:** Builder

Roughly ten tool files plus tests. Each gets a red test before the change. The
acceptance test that matters: newly allocated identifiers take the Task form
while every historical `TK-###` string in a completed Spec is byte-identical
before and after.

### TK-004 - Update `to-tickets` and the skills and controls that instruct the old model

**Stance:** Builder

`to-tickets` currently redirects an agent into embedded rows and must instruct
the Task record instead. Rename the skill if the skill-catalog contract allows
it in the same slice; otherwise record the rename as a follow-up rather than
leaving two names live.

### TK-005 - Assemble the Packet a Task loads at entry

**Stance:** Builder

ADR-000H's required Packet members are the `TASK.md`, the Spec acceptance
lines that Task satisfies, the cited source and test paths, and the Workbench
Contract; nothing else loads at entry. A Scoped handoff and the objective's
local JSON notepad are optional members, included only when one exists, and
neither may be read as instruction or as proof. Prove a Task remains
executable from its required members alone, since a fresh clone or another
machine will not have the optional, untracked ones.

### TK-006 - Write the append-only per-run Receipt

**Stance:** Builder

One row per run, appended, never overwritten: branch, HEAD SHA, upstream
distance, dirty file count, tests run with result, docs touched, and
remaining gap. An interrupted run still leaves its row. A resumed Task is the
same Task with another appended row, not a new identifier.

### TK-007 - Project the Taskboard's derived Receipt signal

**Stance:** Builder

Per active Task, render the run count and the latest run's branch, short SHA
and dirty-file count. The full run table is never rendered on the board; it
stays in the Task. Prove the board shows the symptom (a multi-run or dirty
Task is distinguishable at a glance) while the story stays in the Task's own
Receipt rows.

## Acceptance Criteria

- [ ] A Task exists as its own `TASK.md` record carrying status and blockers.
- [ ] `next`, `claim`, `close` and `render` operate on Task records.
- [ ] No live tool, skill, control or board column uses `Ticket` for the
      execution slice.
- [ ] Newly allocated execution-slice identifiers take the Task form.
- [ ] Every historical `TK-###` identifier inside a completed Spec is
      byte-identical before and after the migration, proven by test.
- [ ] A Task assembles its Packet from exactly its required members, includes
      a Scoped handoff or local notepad only when present, and remains
      executable from the required members alone.
- [ ] A Task's Receipt is append-only with one row per run, carrying branch,
      HEAD SHA, upstream distance, dirty file count, tests run with result,
      docs touched and remaining gap; a resumed Task appends rather than
      overwrites.
- [ ] `TASKBOARD.md` projects each active Task's run count and latest run's
      branch, short SHA and dirty-file count, and never renders the full run
      table.
- [ ] The full verification suite passes and `doctor` is clean.

## Testing Seams

`workbench/tools/spec-workbench.mjs` selection and lifecycle commands, the
Packet-assembly seam, the Receipt append path, the render path into
`TASKBOARD.md`, the visible-identifier allocator, and the skill catalog
contract.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

`LEXICON.md` replaces the Ticket term with Task, `AGENTS.md` updates its work
selection and lifecycle steps, and `RUNBOOK.md` updates every named command.
These land at ADR acceptance, which is separate from this Spec.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only vocabulary scan | `ticket` found in at least ten tool files; five frozen `TK-###` rows confirmed in S-050 |
| 2026-09-12 | 1aeccfa | Review found TK-001-TK-004 and Acceptance Criteria covered the standalone-record migration but named none of ADR-000H's Packet, Receipt or Taskboard-signal requirements, which would then land with no owner if this Spec were completed as written | Re-read ADR-000H's "What a Task carries in and out" and "What the board shows" sections against this Spec's slices and criteria | Added TK-005 (Packet assembly), TK-006 (append-only per-run Receipt) and TK-007 (Taskboard derived signal), and the matching Acceptance Criteria and Testing Seams; no implementation performed |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

S-00I depends on TK-001. If the skill-catalog contract forbids renaming
`to-tickets` in place, a linked follow-up Spec owns that rename.

## Supersession

None.
