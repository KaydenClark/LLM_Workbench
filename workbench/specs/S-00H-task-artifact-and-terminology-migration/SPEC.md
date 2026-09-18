# S-00H - Task Artifact And Terminology Migration

**Spec ID:** S-00H
**Status:** active
**Priority:** 2
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-18
**Catalog description:** Make a Task a standalone `TASK.md` artifact that owns active work state, and replace Ticket with Task across prose, tools and newly allocated identifiers.
**Blockers:** None on TK-003: the owner answered TT-Q10 on 2026-09-17 (newly allocated identifiers keep the `TK-###` form, `TK` read as the Task prefix; see the evidence row). TK-004 waits on TK-003; TK-007 waits on TK-003.
**Latest event:** TK-003 claimed by DISPATCHER.
**Next gate:** Close TK-003 with verification and documentation proof.

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
- Answering TT-Q10; the owner did, on 2026-09-17.

## Dependencies And Blockers

ADR-000H is accepted, so no slice is gated on it. TT-Q10 was answered by the
owner on 2026-09-17: newly allocated identifiers keep the `TK-###` form and
`TK` is read as the Task prefix, so no allocator or folder form changes and
TK-003 and TK-004 are gated only on their Task blockers. S-00I and S-00J are
blocked on this Spec reaching `complete`, because folder lifecycle cannot reach a table row and the Spec QA
gate reads Task records.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Introduce `TASK.md` as a record with its own state and blockers | done | none | Red: ERR_MODULE_NOT_FOUND for workbench/tools/task-record.mjs at the pre anchor; green: tools/test-spec-workbench.mjs passes with the standalone-record, blocking-relationship, coexistence-both-ways and nine fail-closed assertions; mutation checks on the Task-ID regex, required-field loop, duplicate-field guard, folder/id mismatch, duplicate-id and missing-TASK.md checks each turn the test red. Full suite 42/42 on the committed candidate 3dac999; doctor no blocking finding; render no-op; zero deletions; spec-workbench.mjs, spec-packet.mjs and diagnostics.mjs byte-identical; historical TK-### rows byte-identical. Separate-context review (Claude Opus 5): 5d18c3c FAIL on four correctable findings, corrected in 3dac999 and re-reviewed PASS with the suite independently reproduced. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #98; integration 39214bc contains 3dac999 |
| TK-002 | Migrate selection, claim, close and render onto Task records | done | TK-001 | Red per command captured before implementing at the spec-workbench.mjs seam (nextWork selecting nothing on a record-backed Spec; claim and close refusing; render printing the acceptance gate instead of the record; converter export missing); green tools/test-spec-workbench.mjs with record-backed fixtures for next, claim, close, render, completeSpec, coexistence both ways, byte-identical completed Specs and the converter. Full suite 42/42 on the committed candidate 3ba817f; doctor --json and next --json byte-identical to the base on this table-backed room; render no-op; historical TK-### rows byte-identical. Separate-context review (Claude Fable 5.1): f78e7b2 PASS with one Medium (converter carried the planned-verification cell as Proof) and Low findings, corrected in 3ba817f and re-reviewed PASS with eight mutation checks caught and a live conversion of S-00P verified in a throwaway copy. Built by Claude Opus 5 from the lane handoff. Landed by PR #102; integration 64043c3 contains 3ba817f |
| TK-005 | Assemble the Packet a Task loads at entry | done | TK-001 | Red: missing-module error for workbench/tools/task-packet.mjs at the pre state; green tools/test-spec-workbench.mjs packet block: each required member refused by name when missing (record, destination for spec-acceptance with no SPEC.md and for wiki-claim with no note or no claim heading, cited paths when the Testing Seams section names no existing path, Contract), executable from required members alone, traversal-not-copy (named section only, shorter than the Spec body, no other heading, no sentinel from another section), line-anchored heading resolution refusing a strict prefix or a ### subsection, optional handoff and notepad included only when present and labeled working context never instruction or proof, corrective wiki-claim case with no SPEC.md on disk. Reviewer mutations: eight run, seven caught (the ../ containment guard is probed but unasserted). Full suite 42/42 on the committed candidate aeb84bf and on a committed throwaway merge onto integration; doctor no blocking finding; render no-op; task-record.mjs byte-identical. First live Packet: S-00P TK-002 assembles with seven acceptance lines, eight existing cited paths and AGENTS.md as Contract. Separate-context review (Claude Opus 5): 08a0776 PASS with a Medium section-shadowing finding and four surviving mutants, corrected in aeb84bf and re-reviewed PASS. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #104; integration 3bb058f contains aeb84bf |
| TK-006 | Write the append-only per-run Receipt | done | TK-001 | Red: missing-module error for workbench/tools/task-receipt.mjs at the pre state; green tools/test-spec-workbench.mjs receipt block: every named field present, a second run appends rather than overwrites, a row appended mid-run with an open remaining gap and nothing further called is readable, an edited earlier row is refused, whitespace and trailing-CR values round-trip, detached HEAD records 'detached at <sha>', a following heading keeps its blank line, and the table round-trips through readTaskRecord with pipes and field-shaped text inside cells. Reviewer mutations (overwrite the last row, skip checksum verification, constant branch, raw checksum input, literal HEAD, dropped blank line) all red. Full suite 42/42 on the corrected tip 2abbdbd and on the keep-both merge commit 649f970; doctor no blocking finding; render no-op; live probe on S-00P TK-002 leaves show, next, doctor and the board byte-identical; task-record.mjs byte-identical. Separate-context review (Claude Opus 5): afc2a18 FAIL on a whitespace-wedge defect (raw value checksummed, trimmed on read, written before read-back) plus three Low findings, corrected in 2abbdbd and re-reviewed PASS; the reviewer independently reproduced the merge resolution onto TK-005 and ran it green. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #105; integration 860fd18 contains 649f970 |
| TK-008 | Record the declared context unit in the manifest | done | none | Red: missing-export error at the pre state for readContextUnit; green tools/test-workbench-layout.mjs 69/69 including a malformed-shape assertion per provenance field and an assertion reading the shipped root declaration (deleting the block turns the test red); full suite 42/42 on the committed candidate b3258e2; doctor no blocking finding; render no-op. Separate-context review (Claude Opus 5): ad27521 FAIL on two correctable findings (provenance not enforced by the reader; shipped declaration untested), corrected in b3258e2 and re-reviewed PASS with the suite independently reproduced. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #100; integration a8b58fc contains b3258e2 |

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

TT-Q10 is settled (owner, 2026-09-17): newly allocated identifiers keep the
`TK-###` form and `TK` is the Task identifier prefix, so the allocator, the
`--prefix` check and record folder names do not change and the rename is
vocabulary only: `Ticket` becomes `Task` in tool prose, function and field
names, CLI messages, findings, the evidence `Event` text and the slice-table
column header for newly written Specs, while the parser keeps accepting the
historical `Ticket` column header. Roughly ten tool files plus tests. Each
gets a red test before the change. The acceptance test that matters: newly
allocated identifiers keep the `TK-###` form while every historical `TK-###` string in a completed Spec is byte-identical before
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
- [x] `next`, `claim`, `close` and `render` operate on Task records.
- [ ] No live tool, skill, control, board column, or generic `templates/`
      mirror uses `Ticket` for the execution slice, proven by a
      repository-wide sweep that failed before the change.
- [ ] Newly allocated execution-slice identifiers take the owner's chosen Task
      form, `TK-###` with `TK` as the Task prefix (TT-Q10, 2026-09-17), proven
      by the allocator test.
- [ ] Every historical `TK-###` identifier inside a completed Spec is
      byte-identical before and after the migration, proven by test.
- [x] A Task assembles its Packet from exactly its required members, includes
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
- [x] `workbench/manifest.json` declares the context unit (200k tokens) with
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
| 2026-09-17 | TK-008 | Ticket closed | Red: missing-export error at the pre state for readContextUnit; green tools/test-workbench-layout.mjs 69/69 including a malformed-shape assertion per provenance field and an assertion reading the shipped root declaration (deleting the block turns the test red); full suite 42/42 on the committed candidate b3258e2; doctor no blocking finding; render no-op. Separate-context review (Claude Opus 5): ad27521 FAIL on two correctable findings (provenance not enforced by the reader; shipped declaration untested), corrected in b3258e2 and re-reviewed PASS with the suite independently reproduced. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #100; integration a8b58fc contains b3258e2 | Docs checked; no update needed for this slice: no control documents the manifest field yet (a RUNBOOK line beside the git block is owed by S-00P phase two), templates/ carries no manifest, and skills/tracer-bullet/SKILL.md is the source deliverable | Fresh rooms generated by initialize() in workbench-layout.mjs and the genesis route declare no contextUnit, so the required core skill tracer-bullet points at an undeclared field there and readContextUnit throws; the fix site is the generator, not templates/, and it gates the v4.0.0 release in S-00O. No control documents the field (S-00P phase two). The new root-manifest test probe rewrites and restores the tracked manifest, the suite's only in-checkout writer; delete or move to a temp copy in the next lane that touches tools/test-workbench-layout.mjs. The reader's named-field messages are uncovered by assertion; decisionDate is format-checked only |
| 2026-09-17 | TK-002 | Ticket closed | Red per command captured before implementing at the spec-workbench.mjs seam (nextWork selecting nothing on a record-backed Spec; claim and close refusing; render printing the acceptance gate instead of the record; converter export missing); green tools/test-spec-workbench.mjs with record-backed fixtures for next, claim, close, render, completeSpec, coexistence both ways, byte-identical completed Specs and the converter. Full suite 42/42 on the committed candidate 3ba817f; doctor --json and next --json byte-identical to the base on this table-backed room; render no-op; historical TK-### rows byte-identical. Separate-context review (Claude Fable 5.1): f78e7b2 PASS with one Medium (converter carried the planned-verification cell as Proof) and Low findings, corrected in 3ba817f and re-reviewed PASS with eight mutation checks caught and a live conversion of S-00P verified in a throwaway copy. Built by Claude Opus 5 from the lane handoff. Landed by PR #102; integration 64043c3 contains 3ba817f | RUNBOOK.md Spec Lifecycle And Retrieval gains one line for convert-tasks in the same state PR (templates/RUNBOOK.md mirror deferred to S-00P TK-005 with the rest of the control rework); operational prose for next, claim, close and render stays on the table model until S-00P phase two per Documentation Impact; the Planned verification record field is documented in task-record.mjs and named here for TK-005 | The room converts S-00P to Task records in this state PR as live dogfood; S-00H stays table-backed because TK-003's blocker cell names TT-Q10, which is not a Task or Spec id, and deferred rows are converted too, so S-00H converts only after the owner answers TT-Q10 or the gate moves out of the blocker cell. A row/record collision surfaces as malformed-spec, a parse-failure code, and aborts doctor's other scopes: TK-003 or TK-007 should register a distinct selection-effect finding. updateFields for Spec header fields still uses a string replacement that expands dollar patterns (TK-003). sessions.mjs promote and the Genesis first-Spec check still read packet.tickets directly (TK-003). plannedVerification has no reader beyond the record; TK-005's Packet is its consumer. Closing a converted record that carries a plan but no Proof is probed, not asserted |
| 2026-09-17 | spec | Owner gate surfaced: TT-Q10, the form of newly allocated execution-slice identifiers, is now the only blocker between S-00H and `complete` once TK-005 and TK-006 land. Option A `T-###`: symmetric with `S-###` and `N-###`, short board columns and `tasks/T-001/` folders, the visible-id allocator already scopes counters per prefix so `T-001` starts fresh beside frozen `TK-001`; cost: a reader may need a beat to tell `T-001` from `TK-001` in a completed Spec. Option B `TASK-###`: self-describing, no `TK`/`T` confusion; cost: wider columns and folder names, and the CLI `--prefix` check (S or TK) and its usage string must accept a multi-letter prefix (the allocator itself already accepts up to sixteen letters). Dispatcher recommendation: A, the smaller change to the CLI, matching existing prefix conventions, with the confusion risk bounded to frozen history. Either answer unblocks TK-003 and TK-004; not answering keeps S-00I, S-00J and S-00P phase two blocked | Read-only: `workbench/tools/visible-ids.mjs` prefix rule, `spec-workbench.mjs` `--prefix` validation, S-00H TK-003 text; no code changed | This row is the escalation record; the answer lands in TK-003 and the Lexicon | Owner answer to TT-Q10 |
| 2026-09-17 | TK-005 | Ticket closed | Red: missing-module error for workbench/tools/task-packet.mjs at the pre state; green tools/test-spec-workbench.mjs packet block: each required member refused by name when missing (record, destination for spec-acceptance with no SPEC.md and for wiki-claim with no note or no claim heading, cited paths when the Testing Seams section names no existing path, Contract), executable from required members alone, traversal-not-copy (named section only, shorter than the Spec body, no other heading, no sentinel from another section), line-anchored heading resolution refusing a strict prefix or a ### subsection, optional handoff and notepad included only when present and labeled working context never instruction or proof, corrective wiki-claim case with no SPEC.md on disk. Reviewer mutations: eight run, seven caught (the ../ containment guard is probed but unasserted). Full suite 42/42 on the committed candidate aeb84bf and on a committed throwaway merge onto integration; doctor no blocking finding; render no-op; task-record.mjs byte-identical. First live Packet: S-00P TK-002 assembles with seven acceptance lines, eight existing cited paths and AGENTS.md as Contract. Separate-context review (Claude Opus 5): 08a0776 PASS with a Medium section-shadowing finding and four surviving mutants, corrected in aeb84bf and re-reviewed PASS. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #104; integration 3bb058f contains aeb84bf | Docs checked; no update needed: the LEXICON.md Packet row already states the four required members, the optional working-context members and traversal-not-copy; no CLI verb is added; operational prose is S-00P phase two | Cited paths are derived, not declared: Testing Seams backtick spans for spec-acceptance, the Wiki note's source_paths for wiki-claim, filtered to paths existing under root. That filter drops bare-basename and not-yet-created seam citations (S-007, S-00G, S-022, S-033 would refuse; S-00M, S-00N, S-029, S-030 lose citations), so a follow-up should accept a recognized source extension as a second signal; 39 of 62 Specs have prose-only Testing Seams and cannot back a Packet until a record field carries declared paths. The Packet carries the whole named acceptance section because convert-tasks writes a section reference, not the lines the Task satisfies (ADR-000H wording gap). The module header still describes the old span heuristic; escapeRegExp and the containment guard are unasserted; RUNTIME_TOOLS grew to eighteen (S-00O release surface) |
| 2026-09-17 | TK-006 | Ticket closed | Red: missing-module error for workbench/tools/task-receipt.mjs at the pre state; green tools/test-spec-workbench.mjs receipt block: every named field present, a second run appends rather than overwrites, a row appended mid-run with an open remaining gap and nothing further called is readable, an edited earlier row is refused, whitespace and trailing-CR values round-trip, detached HEAD records 'detached at <sha>', a following heading keeps its blank line, and the table round-trips through readTaskRecord with pipes and field-shaped text inside cells. Reviewer mutations (overwrite the last row, skip checksum verification, constant branch, raw checksum input, literal HEAD, dropped blank line) all red. Full suite 42/42 on the corrected tip 2abbdbd and on the keep-both merge commit 649f970; doctor no blocking finding; render no-op; live probe on S-00P TK-002 leaves show, next, doctor and the board byte-identical; task-record.mjs byte-identical. Separate-context review (Claude Opus 5): afc2a18 FAIL on a whitespace-wedge defect (raw value checksummed, trimmed on read, written before read-back) plus three Low findings, corrected in 2abbdbd and re-reviewed PASS; the reviewer independently reproduced the merge resolution onto TK-005 and ran it green. Built by Claude Sonnet 5 from the lane handoff. Landed by PR #105; integration 860fd18 contains 649f970 | Docs checked; no update needed: ADR-000H and the LEXICON.md Task receipt row already carry the row fields, the proactive-append discipline and the crash limitation; no control names the append seam; operational prose is S-00P phase two | Write half only: nothing calls appendReceiptRow yet, so no live Task carries a Receipt and the Receipt acceptance box stays unchecked until close (or a later slice) appends the row; TK-007 derives the board signal from these rows. The read-back line and the append-after-altered-row refusal are correct but unasserted; a lone interior CR is stripped rather than refused; readReceipt shares its name with an export of tools/workbench-tools.mjs; the checksum chain does not detect trailing-row or whole-section deletion, as its header now states. RUNTIME_TOOLS grew to nineteen with task-receipt.mjs, after task-packet.mjs made it eighteen (S-00O release surface) |
| 2026-09-17 | spec | TT-Q10 answered by the owner: asked in chat with option A `T-###` (recommended) and option B `TASK-###`, the owner replied "We dont need to change them, I thought TK stood for task, but if T fits better, lets go with it". The dispatcher resolved the conditional as no change: newly allocated identifiers keep the `TK-###` form and `TK` is read as the Task prefix, because S-00P already holds live records under `tasks/TK-002/` to `tasks/TK-005/` and a `T-###` form would put two live prefixes in one room for no gain; the `T-001` versus `TK-001` confusion cost named in the escalation row disappears, and the allocator, the CLI `--prefix` check and record folder names stay as they are. Historical `TK-###` rows stay frozen as before | Owner answer received in chat 2026-09-17; read-only check of `workbench/tools/visible-ids.mjs`, the `--prefix` check in `spec-workbench.mjs` and the S-00P `tasks/` folders; no code changed | LEXICON.md Ticket row updated in this state PR to say `TK` is the Task prefix; TK-003 section and this Spec's header and Dependencies updated; TK-003 flipped to `ready` and this Spec converted to Task records with convert-tasks in the same PR | TK-003 becomes claimable; TK-004 and TK-007 still wait on TK-003 |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

S-00I and S-00J depend on this Spec reaching `complete`; S-00P phase two
depends on all three. If the skill-catalog contract forbids renaming
`to-tickets` in place, a linked follow-up Spec owns that rename. TT-Q10 was
the owner's to answer and was answered on 2026-09-17 (`TK-###` stays).

## Supersession

None.
