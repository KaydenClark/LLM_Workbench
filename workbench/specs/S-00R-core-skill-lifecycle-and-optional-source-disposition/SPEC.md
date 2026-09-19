# S-00R - Core Skill Lifecycle And Optional Source Disposition

**Spec ID:** S-00R
**Status:** planned
**Priority:** 2
**Owner:** DISPATCHER
**Stance:** Builder
**Updated:** 2026-09-19
**Catalog description:** Reconcile core-skill lifecycle/inherited-scope instructions and establish evidence-based dispositions for optional archived and pending skill source without pre-judging removal.
**Blockers:** S-00P phase two must publish current Canon before lifecycle wording changes; removal or relocation requires a per-item owner decision.
**Latest event:** Planning packet authored from the pinned investigation baseline; no implementation performed.
**Next gate:** After S-00P phase two clears, claim TK-0R0 to inventory optional source before any disposition action.

> **Citation anchors.** pre=`8dc257eb9b9615c9e6a26beda95209dbcdb4f05f` post=`8dc257eb9b9615c9e6a26beda95209dbcdb4f05f`.

## Outcome

The portable core retains distinct behavior: `promote` selects supported claims,
`to-docs` routes them to one durable owner, and `save` persists the authorized
result. `make-it-so` composes those jobs without enlarging scope; `carry` and
`implement` separately execute an assigned Task. Core instructions accurately
route completed transient records through `reconcile -> retire -> verified
discard`; append-only proof, accepted ADR history, provenance and attribution
remain in their own owners.

Each `skills-archive/` and `skills-pending/` item has an evidence-backed
disposition in its existing catalog owner: a named operational or recovery
consumer and provenance/attribution basis if retained, or an owner-approved,
recoverable removal candidate if not. No source changes merely because a local
test, byte comparison, date, or no-consumer search looks favorable.

## Why It Matters

The composition boundaries prevent a settled claim from becoming a new store or
an authorized planning request from becoming implementation. `to-docs` still
says to preserve completed Spec history and `to-spec` says stable paths never
change, both of which can misstate S-00I's lifecycle. The archive test proves a
directory boundary, not a retained purpose for each asset; pending source has
no demonstrated live consumer beyond the catalog's broad statement.

## Current Verified State

At the pre anchor:

- `skills/promote`, `to-docs`, `save`, and `make-it-so` state distinct
  selection, routing, persistence, and composition roles; the core-composition
  test exercises selected promotion, owner-byte replacement, and retained-note
  dependency refusal.
- `to-docs` says "completed spec history" and `to-spec` says existing stable
  paths never change. S-00I delivered lifecycle moves and discard gating but
  remains active pending its completion result; S-00J is likewise active.
- S-00P owns root-control, Runbook, Lexicon, template, and ADR Canon
  reconciliation. This Spec neither edits nor reassigns that work.
- `skills/README.md` labels five archived skills optional/router/reference
  preservation and pending source historical rewrite input. The catalog test
  hard-requires five archive directories; no current instruction/test consumer
  was found for pending source. `THIRD_PARTY_NOTICES.md` supplies upstream
  notice, but no per-item retention rationale is stated.

## Desired Behavior

1. Core skills preserve `promote -> to-docs -> save`, `make-it-so`'s inherited
   authorization, and separate `carry -> implement` execution; no consolidation
   or new truth store is introduced.
2. `to-docs`, `to-spec`, and only other sources found by bounded audit match
   landed lifecycle Canon: proof/history is not a mandate to retain transient
   completed records; only lifecycle tools move/discard records.
3. S-00P maintains the executable full verification list in `RUNBOOK.md` and
   an `AGENTS.md` policy/route. S-00R consumes that interface but changes no
   root control/template and removes no verification command.
4. Every optional item records source path, consumer/recovery route,
   provenance/attribution owner, review date, and either retention purpose or
   explicit owner-gated removal disposition.

## Decisions And Contracts

- **Composition retained.** The three-step flow is distinct jobs, not
  duplication. `make-it-so` composes it inside the request endpoint; `carry ->
  implement` is the assigned execution route. No core entrypoint is merged,
  renamed, or removed.
- **Lifecycle authority.** S-00I owns lifecycle tools, S-00J owns
  closure/assembled-Spec QA, and S-00P phase two owns current root Canon and
  generic mirrors. S-00R edits no root control, template, ADR, lifecycle tool,
  or completed evidence.
- **S-00P verification interface.** S-00P TK-003 solely writes the maintained
  RUNBOOK list; TK-002 owns AGENTS policy/route. Before TK-0R1 lands, verify on
  one immutable candidate that every list entry remains runnable, including
  `test-socket-contract`, `test-team-coordination`, and
  `test-team-coordination-demo`; no core skill republishes a complete list. A
  missing, renamed, or narrowed list blocks TK-0R1 and returns to S-00P.
- **Optional-source threshold.** Similar names, bytes, dates, passing tests,
  local no-consumer searches, and directory-boundary tests do not prove removal.
  Retention requires purpose, consumer/recovery route, and provenance basis.
  Removal requires owner decision, complete consumer/reference scan, preserved
  notices/history, and a recoverable Git reference. No external repo or Dungeon
  Friends inspection is allowed.

## Non-Goals

- Root controls, templates, README, Lexicon, ADR, or S-00P work.
- Lifecycle runtime, moving/retiring/discarding real records, or S-00I/S-00J completion.
- Home-skill installation/updates, release work, downstream work, or making an
  optional item core.
- Removing/moving optional source or weakening tests before owner-approved
  per-item disposition.

## Dependencies And Blockers

TK-0R0 inventories without source disposition. TK-0R1 waits on S-00P TK-002,
TK-003, and their S-00H/S-00I/S-00J phase condition. TK-0R2 waits on TK-0R0.
TK-0R3 waits on TK-0R2 plus a written per-item owner decision.

## Vertical Implementation Slices

The four deferred standalone Task records under `tasks/` are the sole active
slice store. This record-backed Spec intentionally has no duplicate slice-table
rows; each Task carries its own dependencies, destination, red/green plan,
preservation boundary, rollback, and bounded evidence.

## Acceptance Criteria

- [ ] Core composition distinguishes promotion, durable-owner routing,
      persistence, and assigned-task execution without widening scope.
- [ ] No core skill says completed transient records are permanent history or
      lifecycle paths never move; it routes moves/discard to the owning tools.
- [ ] Lifecycle wording lands only after S-00P's single RUNBOOK-list interface
      and root Canon are verified on one immutable candidate.
- [ ] Every optional item has a documented retained purpose/provenance or an
      explicit owner-gated removal disposition; local absence never authorizes removal.
- [ ] Approved optional-source change preserves notices/recovery, updates the
      catalog/test owner atomically, and passes complete consumer/reference scan.
- [ ] Targeted tests, then the current RUNBOOK full suite, render, doctor, and
      separate-context review pass; pre-existing attention findings are separate.

## Testing Seams

`tools/test-core-composition.mjs`, `tools/test-skill-catalog.mjs`, and
`tools/test-skill-inspection.mjs`; S-00P's RUNBOOK/AGENTS interface; and a
complete repository consumer/reference scan for optional-source changes.

## Verification Procedure

Each Task first adds and observes the named focused red assertion, makes the
smallest change, and runs it green. Before closure run the current RUNBOOK full
list, `node workbench/tools/spec-workbench.mjs render`, and `node
workbench/tools/spec-workbench.mjs doctor`; separately record attention-only
findings. A separate context reviews the immutable assembled S-00R candidate.

## Documentation Impact

S-00R may edit core `skills/` source, `skills/README.md`, and targeted skill
tests. S-00P remains root/template writer; S-00I/S-00J retain lifecycle/QA.
Optional dispositions update README/test atomically and preserve
`THIRD_PARTY_NOTICES.md` where applicable. No Wiki article is created merely to
avoid a clear catalog row.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-19 | pending | Spec authored; no implementation performed | Read pinned core sources, `skills/README.md`, core/catalog tests, and active S-00I/S-00J/S-00P owners at the pre anchor | Composition is intentional; lifecycle wording and optional-source purpose need bounded reconciliation/disposition planning. No source, test, control, template, optional asset, or completed evidence changed. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

S-00R does not decide optional-source removal. Unsupported retention purpose
remains an explicit owner gate between recovery retention and recoverable
removal. Any runtime/lifecycle defect returns to S-00I/S-00J/S-00P or a newly
authorized Spec, not this plan by default.

## Supersession

- Supersedes: none.
- Superseded by: none.
