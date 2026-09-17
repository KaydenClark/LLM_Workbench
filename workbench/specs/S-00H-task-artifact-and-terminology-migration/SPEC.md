# S-00H - Task Artifact And Terminology Migration

**Spec ID:** S-00H
**Status:** active
**Priority:** 2
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-17
**Catalog description:** Make a Task a standalone `TASK.md` artifact that owns active work state, and replace Ticket with Task across prose, tools and newly allocated identifiers.
**Blockers:** TT-Q10 (identifier form) is open and blocks TK-003 and TK-004.
**Latest event:** TK-008 claimed by DISPATCHER.
**Next gate:** Close TK-008 with verification and documentation proof.

> **Citation anchors.** pre=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb` post=`e3c5c8f343ec36d411bb6b9ea656e0f53c7406cb`.

## Outcome

A Task is its own artifact: a `TASK.md` holding one bounded executable thin
vertical path that reaches or repairs a Spec's destination, carrying its own
state and blocking relationships. `TASK.md` is the canonical owner of active
work state; `TASKBOARD.md` projects that state and thereby shows which Spec
objectives currently have active Tasks. The Workbench speaks one word for the
concept: `Ticket` is gone from live prose, tool vocabulary, board columns and
newly allocated identifiers. Identifiers already issued are untouched.

## Why It Matters

Two things fail today. A slice lives as a row in a table inside its Spec, so it
cannot carry its own state, cannot be addressed as a record, and cannot occupy a
folder, which is what blocks the retirement lifecycle in S-00I from reaching
Tasks at all. Separately, the Workbench uses `Ticket` and `Task` for one
concept, which `LEXICON.md` forbids, and the standalone artifact makes that
collision immediate rather than theoretical. The owner's rollout decision
(directive-018) makes this Spec one of the two lanes open now, and the other
build Specs and the controls rewrite in S-00P wait on it.

## Current Verified State

At the pre anchor, slices are table rows. `workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md`
carries a `Ticket | Slice | Status | Blockers | Proof` table with `TK-###`
rows inside append-only evidence. `ticket` vocabulary appears in at least ten
tool files including `workbench/tools/spec-workbench.mjs`,
`workbench/tools/diagnostics.mjs`, `workbench/tools/spec-packet.mjs`,
`workbench/tools/wiki.mjs`, `workbench/tools/workbench-layout.mjs`,
`tools/cross-provider-resume.mjs`, `tools/audit-guardrails.mjs` and
`tools/team-coordination-contract.mjs`. `spec-workbench.mjs` allocates ticket
identifiers through `visible-ids` and exposes `claim`, `close` and `next`
against them. The `to-tickets` skill instructs the embedded-row model directly.
ADR-000H is accepted and its `LEXICON.md` rows landed with gap disclaimers
naming this Spec. `next --json` returns this Spec's TK-001.

## Desired Behavior

An agent selecting work receives a Task record, claims it, and completes it
without editing a table in another file. Blocking relationships and active work
state live on the Task. The board renders Tasks, and a Spec objective is
visibly active when it has active Tasks. Commands, skills and documentation say
Task.

A Task names the Spec destination and the acceptance it advances. After a Spec
is reconciled and retired (S-00I), a corrective Task may instead name the
reconciled Wiki capability claim it repairs; it never resurrects `SPEC.md`. The
number of Tasks does not decide whether a new Spec exists: gaps against one
destination remain Task work, and a distinct scoped objective with its own
destination requires a Spec.

A reader encountering a historical `TK-###` in a completed Spec still
understands it, because those identifiers remain readable exactly as written.

## Decisions And Contracts

- The Task artifact, the terminology replacement, the frozen-identifier rule,
  the Packet, the Receipt and the board's derived signal:
  [ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
  accepted 2026-09-15.
- The altitude a Task occupies and how Task work is separated from a new Spec:
  the locked WF-6 and WF-8G answers with correction-023, carried by
  [S-00P](../S-00P-workflow-canon-rework/SPEC.md). Tasks do the counting
  toward a Spec's destination; scope and destination, not Task count, decide
  when a new Spec exists.
  [ADR-000G](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
  is `proposed`, still gives the Blueprint the PRD function the locked WF-1
  answer places in each Spec, and is evidence until S-00P TK-004 reconciles
  it; it does not instruct this Spec.
- Corrective Tasks after Spec retirement prove against the reconciled Wiki
  record and never resurrect `SPEC.md`: the locked WF-8A answer, delivered by
  [S-00I](../S-00I-folder-lifecycle-for-records/SPEC.md). This Spec's TK-005
  proves the Packet can carry that case; the widening of ADR-000H's Packet
  member is recorded by S-00P TK-004.
- What the board does with Tasks:
  [ADR-000E](../../docs/adr/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md).
- The bootstrap route this Spec is built under:
  [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md). Each Task lands as its
  own branch and PR into `integration` after separate-context review of the
  immutable candidate (exemption 2). Never more than two build lanes at once;
  the tool does not enforce that limit, the dispatcher does.

ADR-000H's `LEXICON.md` rows landed with acceptance; everything else it names
is this Spec's to deliver. This Spec still uses the live `Ticket` table format
below because the tool seam it is read by has not been migrated yet: TK-002
and TK-003 do that, and rewriting the table ahead of them would break `next`,
`claim` and `close`.

## Non-Goals

- **Rewriting historical identifiers.** Existing `TK-###` rows sit in
  append-only evidence and are preserved as written.
- Moving, retiring, reconciling or discarding any Spec or Task; that is S-00I.
- The assembled-Spec review and Human QA closure; that is S-00J.
- Answering TT-Q10.

## Dependencies And Blockers

ADR-000H is accepted, so no slice is gated on it. TK-003 and TK-004 remain
blocked on TT-Q10, which settles whether a new identifier reads `T-###` or
`TASK-###`; that question stays open until the owner answers it, and no build
session invents the form. S-00I and S-00J are blocked on this Spec reaching
`complete`, because folder lifecycle cannot reach a table row and the Spec QA
gate reads Task records.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Introduce `TASK.md` as a record with its own state and blockers | done | none | Red: ERR_MODULE_NOT_FOUND for workbench/tools/task-record.mjs at the pre anchor; green: tools/test-spec-workbench.mjs passes with the standalone-record, blocking-relationship, coexistence-both-ways and nine fail-closed assertions; mutation checks on the Task-ID regex, required-field loop, duplicate-field guard, folder/id mismatch, duplicate-id and missing-TASK.md checks each turn the test red. Full suite 42/42 on the committed candidate 3dac999; doctor no blocking finding; render no-op; zero deletions; spec-workbench.mjs, spec-packet.mjs and diagnostics.mjs byte-identical; historical TK-### rows byte-identical. Separate-context review (Claude Opus 5): 5d18c3c FAIL on four correctable findings, corrected in 3dac999 and re-reviewed PASS with the suite independently reproduced. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #98; integration 39214bc contains 3dac999 |
| TK-002 | Migrate selection, claim, close and render onto Task records | blocked | TK-001 | Red tests at the `spec-workbench.mjs` seam; green commands; `doctor` clean |
| TK-003 | Replace Ticket with Task across tool vocabulary and board columns | blocked | TK-002, TT-Q10 | Red tests per touched tool; green rename using the owner's chosen identifier form; historical `TK-###` rows byte-identical |
| TK-004 | Update `to-tickets`, the skills/controls that instruct the old model, and every generic template mirror | blocked | TK-003 | Skill catalog and inspection tests pass; composition test green; red repository-wide sweep for live `ticket`/`Ticket` prose (verified at review: `templates/LEXICON.md`, `templates/GENESIS.md`, `templates/RUNBOOK.md`, `templates/README.md`, `templates/AGENTS.md`, `templates/SPEC.md`, at minimum) finds nothing after the change |
| TK-005 | Assemble the Packet a Task loads at entry | blocked | TK-001 | Red tests for a Packet missing a required member and for a corrective Task whose destination is a reconciled Wiki claim; green assembly of TASK.md, the Spec acceptance lines or reconciled Wiki claim, cited source/test paths and the Contract; Scoped handoff and local notepad included only when present and never treated as instruction or proof |
| TK-006 | Write the append-only per-run Receipt | blocked | TK-001 | Red test for a simulated abrupt interruption (not only a clean close) and for a resumed Task appending rather than overwriting; green one-row-per-run Receipt, appended proactively per ADR-000H, recording branch, HEAD SHA, upstream distance, dirty file count, tests run with result, docs touched and remaining gap |
| TK-007 | Project Task state and the derived Receipt signal | blocked | TK-006, TK-003 | Red tests prove the board derives a Spec objective's active state from its Task records and distinguishes a multi-run or dirty Task; green per-Task state, run count, latest branch, short SHA and dirty-file count; full run table proven absent from `TASKBOARD.md` |
| TK-008 | Record the declared context unit in the manifest | in-progress | none | Red test for sizing guidance reading an undeclared value; green `workbench/manifest.json` field with provenance recording the owner's 200k-token decision and the rejected 150k/250k alternatives |

### TK-001 - Introduce `TASK.md` as a record with its own state and blockers

**Stance:** Builder

Define the Task record at a stable seam and add a failing test that reads a
standalone Task and its blocking relationships. Implement the smallest record
that turns it green. The record owns its status, blockers and the Spec
destination or acceptance it advances. Existing embedded tables keep working
during this slice; converting them is TK-002.

### TK-002 - Migrate selection, claim, close and render onto Task records

**Stance:** Builder

`next`, `claim`, `close` and `render` move to Task records. The append-only
evidence rows of completed Specs are read, never rewritten. Prove that a
completed Spec's historical table survives the migration unchanged, and that
`render` derives a Spec objective's active state from its Task records rather
than from a second status written into the Spec.

### TK-003 - Replace Ticket with Task across tool vocabulary and board columns

**Stance:** Builder

Do not start until TT-Q10 settles the identifier form (`T-###` or
`TASK-###`); ADR-000H accepts the Task rename but leaves that choice open, so
this ticket has no defined target format without it. Roughly ten tool files
plus tests. Each gets a red test before the change. The acceptance test that
matters: newly allocated identifiers take the owner's chosen Task form while
every historical `TK-###` string in a completed Spec is byte-identical before
and after.

### TK-004 - Update `to-tickets`, the skills/controls that instruct the old model, and every generic template mirror

**Stance:** Builder

`to-tickets` currently redirects an agent into embedded rows and must instruct
the Task record instead. Rename the skill if the skill-catalog contract allows
it in the same slice; otherwise record the rename as a follow-up rather than
leaving two names live.

Per the dogfood boundary, a harness design change updates both the filled root
and the generic `templates/` mirror, and this rename is no exception. A newly
bootstrapped room must not be instructed into the retired model. Do not trust
the six template files found at review as complete; the red test is a
repository-wide sweep for live `ticket`/`Ticket` prose (excluding historical
`TK-###` mentions and this Spec's own append-only evidence), and the green
proof is that sweep finding nothing left. A fresh-room generation/adoption
regression proves a newly generated project speaks Task, not Ticket. The
broader control rewrite (work selection, review unit, retirement) is S-00P
phase two, not this slice; this slice changes only the vocabulary and the
instructing skills so that S-00P starts from controls that already say Task.

### TK-005 - Assemble the Packet a Task loads at entry

**Stance:** Builder

The required Packet members are the `TASK.md`, the Spec acceptance lines the
Task satisfies (or, for a corrective Task after retirement, the reconciled
Wiki capability claim it repairs), the cited source and test paths, and the
Workbench Contract; nothing else loads at entry. A Scoped handoff and the
objective's local JSON notepad are optional members, included only when one
exists, and neither may be read as instruction or as proof. Prove a Task
remains executable from its required members alone, since a fresh clone or
another machine will not have the optional, untracked ones, and prove the
corrective case assembles without a `SPEC.md` present.

### TK-006 - Write the append-only per-run Receipt

**Stance:** Builder

One row per run, appended, never overwritten: branch, HEAD SHA, upstream
distance, dirty file count, tests run with result, docs touched, and
remaining gap. Per ADR-000H, the row is appended proactively as the run
proceeds, on the same before-interruption discipline as notepads, not deferred
until a successful close; an anticipated Stop or approaching token exhaustion
still appends a row, with an open remaining gap if that is the true state. A
resumed Task is the same Task with another appended row, not a new identifier.
An unanticipated kill or crash can still lose a row; that is a named, accepted
limitation, not a guarantee this ticket makes.

### TK-007 - Project Task state and the derived Receipt signal

**Stance:** Builder

Per active Task, render its state, run count and the latest run's branch,
short SHA and dirty-file count. Derive whether a Spec objective is active from
whether it has active Task records; do not author a second Spec-status truth.
The full run table is never rendered on the board; it stays in the Task. Prove
the board shows the symptom (a multi-run or dirty Task is distinguishable at a
glance) while the story stays in the Task's own Receipt rows.

### TK-008 - Record the declared context unit in the manifest

**Stance:** Builder

ADR-000H sets the context unit at 200k tokens, considered against and rejected
150k and 250k, and requires it recorded as "a declared host fact recorded in
`workbench/manifest.json` with provenance, not a number written into portable
control prose". Add the field with that provenance. Sizing guidance reads the
declared value; it is a Plan goalpost, never a gate, diagnostic or blocker, so
this ticket has no dependency on the others and can land independently.

## Acceptance Criteria

- [ ] A Task exists as its own `TASK.md` record carrying status, blockers and
      the destination it advances.
- [ ] `next`, `claim`, `close` and `render` operate on Task records.
- [ ] No live tool, skill, control, board column, or generic `templates/`
      mirror uses `Ticket` for the execution slice, proven by a
      repository-wide sweep that failed before the change.
- [ ] Newly allocated execution-slice identifiers take the owner's chosen Task
      form.
- [ ] Every historical `TK-###` identifier inside a completed Spec is
      byte-identical before and after the migration, proven by test.
- [ ] A Task assembles its Packet from exactly its required members, includes
      a Scoped handoff or local notepad only when present, remains executable
      from the required members alone, and a corrective Task assembles
      against a reconciled Wiki claim without a `SPEC.md`.
- [ ] A Task's Receipt is append-only with one row per run, carrying branch,
      HEAD SHA, upstream distance, dirty file count, tests run with result,
      docs touched and remaining gap; a resumed Task appends rather than
      overwrites.
- [ ] `TASKBOARD.md` projects canonical Task state, derives a Spec objective's
      active state from its Task records, projects each active Task's run
      count and latest branch, short SHA and dirty-file count, and never
      renders the full run table.
- [ ] `workbench/manifest.json` declares the context unit (200k tokens) with
      provenance, and sizing guidance reads it rather than restating a number.
- [ ] The full verification suite passes and `doctor` is clean.

## Testing Seams

`workbench/tools/spec-workbench.mjs` selection and lifecycle commands, the
Packet-assembly seam, the Receipt append path, the render path into
`TASKBOARD.md`, the visible-identifier allocator, the skill catalog contract,
the `workbench/manifest.json` context-unit field, a repository-wide
`ticket`/`Ticket` prose sweep across root and `templates/`, and a fresh-room
generation/adoption regression.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`. Each Task lands as its own
reviewed PR into `integration` under S-00O exemption 2.

## Documentation Impact

`LEXICON.md`'s Task, Packet, Task receipt and Ticket rows landed at ADR
acceptance with gap disclaimers; completing TK-001 and TK-002 makes those
disclaimers false, and S-00P TK-004 removes them. `AGENTS.md`'s work-selection
steps and `RUNBOOK.md`'s named commands stay describing the embedded-table
model until S-00P phase two rewrites them, which is blocked on this Spec:
switching that operational prose earlier would send an agent through commands
that do not yet exist. TK-004 changes only the vocabulary in the controls and
skills and the generic template mirrors, so the controls S-00P rewrites
already say Task.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only vocabulary scan | `ticket` found in at least ten tool files; five frozen `TK-###` rows confirmed in S-050 |
| 2026-09-12 | 1aeccfa | Review found TK-001-TK-004 and Acceptance Criteria covered the standalone-record migration but named none of ADR-000H's Packet, Receipt or Taskboard-signal requirements, which would then land with no owner if this Spec were completed as written | Re-read ADR-000H's "What a Task carries in and out" and "What the board shows" sections against this Spec's slices and criteria | Added TK-005 (Packet assembly), TK-006 (append-only per-run Receipt) and TK-007 (Taskboard derived signal), and the matching Acceptance Criteria and Testing Seams; no implementation performed |
| 2026-09-12 | 2a9e79b | Review found the added TK-005-TK-007 still did not cover ADR-000H's manifest context-unit requirement (lines 101-109) | Re-read ADR-000H's "One Task, one context" section against this Spec's slices and criteria | Added TK-008 (manifest context-unit field) and the matching Acceptance Criteria and Testing Seams; no implementation performed |
| 2026-09-12 | b4edb20 | Review found TK-006 could not guarantee a Receipt row for an interrupted run: writing only at close loses it, and ADR-000H's own rejection of "written once at close" implied an unwritten alternative mechanism | Re-read ADR-000H's Receipt definition and AGENTS.md's notepad before-interruption discipline | Added the proactive-append mechanism (same discipline as notepads, same crash caveat) to ADR-000H itself and to TK-006's description and red-test requirement; no implementation performed |
| 2026-09-12 | b4edb20 | Review found Documentation Impact switched AGENTS.md/RUNBOOK.md operational prose to the Task model "at ADR acceptance", before TK-002 makes selection/claim/close/render able to operate on Task records | Re-read this Spec's own ticket sequencing against its Documentation Impact claim | Corrected Documentation Impact to keep operational prose describing the embedded-table model until TK-002 lands; `LEXICON.md`'s vocabulary definition remains landable at ADR acceptance; no implementation performed |
| 2026-09-12 | f2d2e87 | Review found TK-003 required "the Task form" for new identifiers with no defined form: TT-Q10 (T-### vs TASK-###) is open and this Spec was blocked only on ADR-000H | Cross-checked TK-003's requirement against the foundation-question-review report's TT-Q10 entry | Added TT-Q10 as an explicit blocker on TK-003 (and TK-004, which depends on it) in the header, the ticket table and TK-003's own description; TK-001/TK-002/TK-005-TK-008 remain gated on ADR-000H alone; no implementation performed |
| 2026-09-12 | f2d2e87 | Review found TK-004 covered `to-tickets` and live skills/controls but not the generic `templates/` mirror, so a newly bootstrapped room could still be instructed into the retired embedded-Ticket model after this Spec completed | Repo-wide grep for `ticket`/`Ticket` under `templates/` | Found six template files (LEXICON.md, GENESIS.md, RUNBOOK.md, README.md, AGENTS.md, SPEC.md); expanded TK-004 to a repository-wide sweep covering root and templates together, per the dogfood boundary, plus a fresh-room generation regression; no implementation performed |
| 2026-09-15 | 87c1d45 | Owner accepted ADR-000H; the Lexicon rows the record owed at acceptance landed, the manifest context unit did not | Flipped ADR-000H to `accepted`, added `Task`, `Packet`, `Task receipt` and a `Ticket` retirement pointer to `LEXICON.md` Core Terms, corrected the Stance Terms `TASK` row (which asserted "No additional task file or queue is introduced") and the three remaining live `ticket` usages in that file | Lexicon no longer contradicts accepted Canon. The manifest context unit stays with TK-008, which owns a red test at the consuming seam and which the manifest contradicts by nothing today; TK-001 and TK-008 moved to `ready`. `AGENTS.md`, `RUNBOOK.md`, the tools and the skills still say `Ticket` — the recorded gap TK-002-TK-004 close |
| 2026-09-15 | 8a32f41 | Separate-context review found the new `LEXICON.md` rows asserted in the present tense that a Task is "held in its own `TASK.md`" and "no longer a row in a table inside its Spec", neither true at the candidate — including in the two Specs that same commit authored | Reviewer read `LEXICON.md` rows 100, 131, 132 and 135 against the live slice tables, and against the gap disclaimer the `Ticket` row already carried | Extended the gap disclaimer to the `Task`, `Spec` and `SPEC and TASK` rows and broadened the `Ticket` row's named gap to include the standalone artifact, so the Language owner names TK-001/TK-002 as the reason slices are still table rows. Reviewer confirmed `AGENTS.md` carries no analogue of the retracted "No additional task file or queue is introduced" clause, so its `Ticket` prose lags rather than contradicts |
| 2026-09-16 | e3c5c8f | Rewritten against the WF grilling note at revision 57 under directive-018: `TASK.md` owns active work state and the board projects it (WF-8G, correction-023); corrective Tasks after retirement prove against the reconciled Wiki claim (WF-8A); proposed ADR-000G demoted from decision to evidence pending S-00P TK-004; bootstrap route recorded from S-00O; no implementation performed | Read the current view and decisions 067-082 with corrections 019 and 023 against every section of this Spec; kept all eight slices, their statuses and blockers, and the TT-Q10 blocker verbatim in effect | Outcome, Desired Behavior, Decisions, Non-Goals, Dependencies, TK-001/002/004/005/007 descriptions, Acceptance Criteria and Documentation Impact reconciled; ticket table statuses unchanged so `next` still returns TK-001 and TK-008 stays claimable; anchors moved to the integration tip the rewrite read at |
| 2026-09-17 | TK-001 | Ticket closed | Red: ERR_MODULE_NOT_FOUND for workbench/tools/task-record.mjs at the pre anchor; green: tools/test-spec-workbench.mjs passes with the standalone-record, blocking-relationship, coexistence-both-ways and nine fail-closed assertions; mutation checks on the Task-ID regex, required-field loop, duplicate-field guard, folder/id mismatch, duplicate-id and missing-TASK.md checks each turn the test red. Full suite 42/42 on the committed candidate 3dac999; doctor no blocking finding; render no-op; zero deletions; spec-workbench.mjs, spec-packet.mjs and diagnostics.mjs byte-identical; historical TK-### rows byte-identical. Separate-context review (Claude Opus 5): 5d18c3c FAIL on four correctable findings, corrected in 3dac999 and re-reviewed PASS with the suite independently reproduced. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #98; integration 39214bc contains 3dac999 | Docs checked; no update needed: the record lives at <specDir>/tasks/<TK-###>/TASK.md with no manifest collection because the path derives from the declared specs lane (decision recorded here); no owner enumerates runtime tools; LEXICON.md disclaimers stay true until TK-002 per Documentation Impact; AGENTS.md and RUNBOOK.md stay on the table model until S-00P phase two | Read half only: nothing writes a TASK.md and no live room holds one, so the first acceptance box stays unchecked until TK-002. For TK-002: add assertions for relativePath null without root, a missing Slice field and a positive two-record listing; sort listTaskRecords with compareVisibleIds instead of localeCompare; consolidate TASK_STATUSES with TICKET_STATUSES. For TK-006: the duplicate-field guard scans the whole body, so Receipt rows need a delimiter. For S-00O: RUNTIME_TOOLS grew from sixteen to seventeen, a release-surface fact for the v4.0.0 stamp |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

S-00I and S-00J depend on this Spec reaching `complete`; S-00P phase two
depends on all three. If the skill-catalog contract forbids renaming
`to-tickets` in place, a linked follow-up Spec owns that rename. TT-Q10 is the
owner's to answer.

## Supersession

None.
