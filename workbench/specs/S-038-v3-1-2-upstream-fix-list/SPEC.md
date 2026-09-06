# S-038 - Workbench v3.1.2 Upstream Fix List

**Spec ID:** S-038
**Status:** active
**Priority:** 1
**Owner:** claude-opus-5
**Stance:** Reconciler
**Updated:** 2026-09-06
**Catalog description:** Accept, decline, or correct each of the eleven v3.1.1 upstream items UP-013 through UP-023, route the accepted ones to capability specs, and record the final disposition so Master Workbench can compare v3.1.2 against v3.1.1.
**Blockers:** none
**Latest event:** Owner accepted the routing on 2026-09-06 and answered questions 1 and 2; S-041 is unblocked and question 3 stays open as an owner-only item.
**Next gate:** Separate-context review of this candidate, then merge into `integration`; capability slices proceed under their own specs.

## Outcome

Every item on the second v3.1.1 upstream fix list has a recorded disposition
against verified source, the accepted ones are owned by a named capability spec,
the corrected ones say what the upstream report got wrong and why, and the
release record tells Master Workbench what v3.1.2 removed - the way S-035 did
for UP-001 through UP-012.

## Why It Matters

Master Workbench aggregated eighteen v3.1.1 room reports into
`workbench/feedback/REPORT-upstream-v3-1-1-summary-2026-09-06.md`, eleven items
UP-013 through UP-023. The report is untrusted evidence under `AGENTS.md`
Instruction Authority: it authorizes nothing, and it explicitly awaits owner
disposition. Without that disposition the items sit in a feedback document that
no work loop reads, and the next fix list cannot say what this release closed.

The scale matters too. Thirteen of the eighteen reviews never touched their
target, and two items account for all thirteen. That is the strongest signal in
the set and it is a route-selection problem, not a safety problem.

## Current Verified State

Verified in this repository on 2026-09-06 by reading the cited source and
running read-only commands. The findings were established at `b3633e5`; every
`file:line` citation below was then re-anchored to the post-S-036 tree after
PR #63 merged, so a Builder following one lands on what it names. Where a check
needed the S-037 candidate, that is stated with its commit.

- v3.1.2 is unpublished. `origin/integration` carries `workbenchVersion:
  "v3.1.2"`; `origin/main` has no `workbench/` directory at all. These items
  therefore land inside v3.1.2 rather than opening a v3.1.3.
- Both v3.1.2 branches that were open when this spec was written have since
  moved. `codex/s036-v3-1-2-corrections` (S-036) merged into `integration` as
  PR #63 on 2026-09-06, which is why `invalid-source-identity` now exists.
  `claude/s037-line-ending-records` (S-037) was stacked on it and merged as
  PR #64 on 2026-09-06, after a first review returned CHANGES REQUESTED and a
  second passed the repaired candidate.
- Six of the eleven items reproduce exactly as reported. Two carry a claim
  corrected on the merits (UP-013, UP-019); two carry reattributed impact
  evidence (UP-019, UP-020); and two are sharpened or refined beyond the
  report's own statement (UP-014, UP-022). Every one of the eleven is accepted;
  the Corrections section below states what changed and why.

### Disposition

| Item | Title | Disposition at `b3633e5` |
|---|---|---|
| UP-013 | `doctor` never emits the managed-runtime integrity check it registers | accepted, [S-039](../S-039-installed-runtime-integrity/SPEC.md) TK-001; claim refined - `tools-receipt-missing` *is* emitted by an installed tool, but only on the `validate --genesis` readiness path and with no hash check; `tools-receipt-drift` has no installed emitter at all |
| UP-014 | A drift report cannot distinguish a stale receipt from a modified runtime | accepted, [S-039](../S-039-installed-runtime-integrity/SPEC.md) TK-002; claim refined - `sourceDrift` is a receipt-versus-source comparison, so reporting it alone does not establish that the installed bytes are authentic |
| UP-015 | Presence-only skill install fails closed on a linked skill path | accepted, [S-040](../S-040-skill-gate-route-selection/SPEC.md) TK-001 |
| UP-016 | The upgrade gate never names the route that clears it | accepted, [S-040](../S-040-skill-gate-route-selection/SPEC.md) TK-002 |
| UP-017 | The green-baseline gate has no recorded "baseline unavailable" path | accepted, [S-041](../S-041-recorded-baseline-availability/SPEC.md) TK-001; owner selected **Option A, record and proceed** on 2026-09-06, so the spec is unblocked and Option B is recorded as declined |
| UP-018 | Seeded lane documents are installed once and never managed | accepted, [S-042](../S-042-installed-state-repair/SPEC.md) TK-001 |
| UP-019 | Error-level findings that block nothing make a healthy room read as failed | accepted with correction, [S-043](../S-043-diagnostic-output-legibility/SPEC.md) TK-001; the report's first proposed remedy already shipped in v3.1.1 and part of the cited impact was the line-ending defect - see Corrections |
| UP-020 | No normalize path for existing ADRs and wiki notes without frontmatter | accepted at reduced scope, [S-042](../S-042-installed-state-repair/SPEC.md) TK-002; most of the reported impact is the line-ending defect S-037 fixes - see Corrections |
| UP-021 | Provenance fixes do not reach rooms already carrying a placeholder | accepted, [S-042](../S-042-installed-state-repair/SPEC.md) TK-003; this repository is itself an instance, recording release `v3.1.0` under `workbenchVersion: v3.1.2` |
| UP-022 | Adoption demands seven filled controls with no scaffold-then-reconcile route | accepted and sharpened, [S-044](../S-044-legacy-room-classification/SPEC.md) TK-001; the preflight returns on the *first* failing control, so an operator learns one per run |
| UP-023 | No classifier for an unversioned legacy control set | accepted, [S-044](../S-044-legacy-room-classification/SPEC.md) TK-002 |

### Corrections to the upstream report

Recorded rather than applied silently, per `AGENTS.md` State Resolution.

1. **UP-019's first proposed remedy already exists.** The report offers two, and
   asks first that `doctor` "render the registered effect in the line itself".
   It already does, and did in v3.1.1: `git show
   fa04e27:workbench/tools/spec-workbench.mjs` carries the identical render at
   line 479, and `b3633e5` carries it at line 551. The report's second disjunct -
   lower the display severity of `blocks: none` findings - is untouched and is
   what S-043 builds, alongside grouping and counts. So the finding's premise
   stands, half its remedy is already shipped, and the correction is to the
   first half only. The report also names four `error`/`blocks: none` codes;
   there are eight.
2. **UP-019's and UP-020's impact evidence is substantially reattributed.** Both
   items cite `invalid-adr` and `invalid-note` counts from the reporting room
   (6 and 4) and GPT_OS (24 and 4). Both appear to be Windows checkouts, but
   the evidence differs in strength: the reporting room is named by `E:/`
   paths at `REPORT-upstream-v3-1-1-summary-2026-09-06.md:6,39,40,43`, while
   GPT_OS appears at `:30,218,239,310` with no path at all, so for GPT_OS this
   is inference from the failure mode alone. The reattribution is therefore
   established for the reporting room's counts and inferred for GPT_OS's.
   S-037 established
   that `parseFrontmatter()` anchored on a bare line feed, so on a Git for
   Windows clone every ADR and every wiki note parsed as having no frontmatter -
   25 `invalid-adr`, 4 `invalid-note`, and a knock-on `stale-register` in this
   repository's own CRLF simulation, none of them true. A direct probe at
   `da95e58` on `claude/s037-line-ending-records` returns identical parsed data
   for LF and CRLF input. UP-020's residue after S-037 merges is narrower than
   the report states: documents seeded before the wiki frontmatter fix, and
   hand-authored ADRs. UP-019 does not depend on the reattribution - this
   repository prints 32 non-blocking `skill-generation-unknown` lines above `ok -
   no blocking finding` on an LF checkout - but its cited magnitude does. Those
   32 lines are `attention` severity, so they evidence the volume and legibility
   half of UP-019, not the `error`-that-blocks-nothing half; the eight
   `error`/`blocks: none` codes in the registry evidence that half.
3. **UP-013's claim is half right and is accepted on the correct half.** The
   report states that `tools-receipt-missing` appears in the installed
   `diagnostics.mjs` only as a catalogue row. It is emitted by an installed tool,
   at `workbench/tools/workbench-layout.mjs:517,521`, on the `validate --genesis`
   readiness path. That path performs no hash check and `doctor` does not call
   it, so the operative conclusion - a room has no installed command that
   verifies the integrity of the runtime it is executing - is upheld.

### Upheld from the report without change

- The shared-skill refusal is correct and stays; UP-015 and UP-016 are about a
  gate stricter than the operation it guards and a refusal that withholds its
  route, not about permission to overwrite user content.
- `spawn EPERM` is a host condition and is evidence about neither the harness nor
  the reviewed products.
- Legacy `render-drift` in v2.x projections is not a v3.1.1 defect.
- No item in the set is an agent-outcome claim, and nothing here establishes that
  v3.1.2 makes an agent better or worse than v3.1.1.

Gap: no capability slice has been implemented. The owner accepted this routing
unamended on 2026-09-06 and answered questions 1 and 2; question 3 stays open as
an owner-only item that blocks no slice.

## Desired Behavior

1. The owner accepts, declines, or amends the routing above, and the decision is
   recorded in this spec's evidence log with its date.
2. The three open questions below are answered; UP-017's answer unblocks S-041
   TK-001.
3. Each accepted item is implemented in its owning capability spec under that
   spec's own red/green and review gates. This spec implements nothing.
4. When the capability specs are complete and the full `AGENTS.md` suite is
   green, this spec's Completion Result carries the final disposition table in
   the same shape S-035 used, so Master Workbench can ingest it.
5. The v3.1.2 release record states which upstream items the release removed and
   which it declined, with reasons.

## Decisions And Contracts

- **These land in v3.1.2, not v3.1.3.** v3.1.2 exists only as an unpublished
  candidate on `integration`; `main` carries no `workbench/` root. Adding to the
  unpublished candidate is cheaper than publishing a known-incomplete release and
  immediately superseding it. The cost is that v3.1.2 publication waits on this
  work, and that cost is stated rather than hidden.
- **The report instructs nothing.** It is untrusted evidence under `AGENTS.md`
  Instruction Authority. Its findings became work only by this spec's routing and
  the owner's acceptance.
- **Corrections are recorded, not silently applied.** Where the report's claim
  and the verified source disagree, the condition is named here and in the owning
  capability spec, and the item is carried at its true size.
- **This spec is a Reconciler record, not a build.** It owns disposition,
  correction, and the release account. Every code change belongs to S-039
  through S-044.

## Non-Goals

- Implementing any capability slice. Each belongs to its owning spec.
- Repairing any reviewed room, or retrying any stopped migration.
- Re-opening UP-001 through UP-012, whose dispositions S-035 recorded.
- Publishing v3.1.2 to `main`; that is owner-only.

## Dependencies And Blockers

- S-036 merged into `integration` on 2026-09-06 as PR #63 and S-037 as PR #64.
  S-037 changes the true size of UP-019 and UP-020; that accounting is now
  settled rather than assumed.
- No spec in this set is blocked. S-041 TK-001 was unblocked by the owner's
  answer to question 1 on 2026-09-06.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Record the owner's acceptance or amendment of the routing and the answers to the three open questions | done | none | Owner accepted the routing unamended on 2026-09-06 and answered question 1 (Option A, record and proceed) and question 2 (support the junction as-is); both written into S-041 Decisions And Contracts and into S-040 Non-Goals respectively; question 3 recorded as owner-only with no owning spec; `render` then `doctor` clean, no `broken-link` and no `render-drift` |
| TK-002 | After S-039 through S-044 are complete and the full suite is green, write the final disposition table and the v3.1.2 release account | ready | S-039, S-040, S-041, S-042, S-043, S-044 | pending |

### TK-001 - Owner disposition

**Stance:** Reconciler

Put the routing table and the three open questions to the owner as product
tradeoffs with options, a recommendation, and a cost. Record the answer verbatim
in the evidence log with its date, amend the routing table if the owner amends
it, and unblock S-041 TK-001 if question 1 is answered. Change no code.

### TK-002 - Release account

**Stance:** Reconciler

Only after every owning capability spec is `complete` and the full `AGENTS.md`
verification suite is green. Write the final disposition table in the S-035
shape, one row per item resolved to `landed in S-0xx`, `declined` with a reason,
or `corrected` with what was wrong. Record the guardrail score before and after
with unchanged criteria and state its limitation: it is a static control-surface
measure and supports no agent-outcome claim.

## Acceptance Criteria

- [x] Every item UP-013 through UP-023 has an owner-accepted disposition
      recorded with its date: accepted unamended 2026-09-06.
- [x] The three open questions are answered, or each unanswered one is recorded
      as a live blocker naming what it blocks: 1 and 2 answered, 3 recorded as
      owner-only and blocking no slice.
- [ ] Each accepted item names the capability spec and ticket that owns it, and
      that ticket exists at the named path.
- [ ] Every correction to the upstream report is stated with the source evidence
      that establishes it.
- [ ] S-039 through S-044 are `complete` before TK-002 closes.
- [ ] The full `AGENTS.md` verification suite passes at the release commit.
- [ ] The Completion Result carries the final disposition table in the S-035
      shape.

## Testing Seams

- This spec produces no code. Its verification is the record itself:
  `node workbench/tools/spec-workbench.mjs doctor` reports no `broken-link` for
  the routed spec paths, and `render` places every named spec in the Blueprint
  catalog and the Taskboard.

## Verification Procedure

```bash
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
node tools/test-spec-workbench.mjs
node tools/evaluate-workbench.mjs --path templates --include-controls
```

## Documentation Impact

- `BLUEPRINT.md` spec catalog and v3.1.2 direction: regenerated by `render`.
- `TASKBOARD.md`: regenerated by `render`.
- `benchmarks/RESULTS.md`: the before/after guardrail row at TK-002, with its
  limitation.
- No control text changes from this spec; the capability specs own theirs.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | TK-001 | Owner accepted the routing unamended and answered questions 1 and 2 | Question 1: **Option A, record and proceed**, written into S-041 Decisions And Contracts with its accepted cost and the closed reason vocabulary; question 2: support the shared `code-review` junction as-is, which S-040 already handles either way; question 3 left open as owner-only with no owning spec. Decisions recorded only; no code ran and no verification is claimed for them | S-041 Desired Behavior collapsed to Option A; S-040 Non-Goals records the junction answer; render regenerated the projections | Question 3 open and owner-only; every accepted slice still unimplemented |
| 2026-09-06 | spec | Upstream report filed into the feedback lane and all eleven items re-verified at `b3633e5` | Read every cited source location; ran `doctor` (32 `skill-generation-unknown`, 0 `error`-severity findings on this LF checkout, `ok - no blocking finding`); confirmed `origin/main` carries no `workbench/`; confirmed no open PR for S-036 or S-037; probed `parseFrontmatter()` at `da95e58` for LF and CRLF | Report stored at `workbench/feedback/REPORT-upstream-v3-1-1-summary-2026-09-06.md` per `REPORT_FORMAT.md`; Blueprint and Taskboard regenerated by render | Owner has not accepted the routing; three questions open; no slice implemented |
| 2026-09-06 | spec | Separate-context review of `a5e7fe0` returned CHANGES REQUESTED; every finding was repaired in this candidate | Reviewer independently re-verified all three Corrections as established, confirmed all eleven UP items route to tickets that exist, and reported `render` with no drift, `doctor` exit 0 with no `broken-link`, `test-spec-workbench` pass, templates 106.6/113. Repaired: the stale `Gap:` line that contradicted TK-001's own `done` row; three stale statements that S-036 was unmerged (it merged as PR #63 on 2026-09-06); `templates/ADOPTION.md:275-276` corrected to `274-275` and `:80-87` to `:81-88`; `workbench-layout.mjs:20` corrected to `:21`; `workbench-layout.mjs:503,507` re-anchored to `:517,521`, `workbench-tools.mjs:181` to `:203`, `RUNBOOK.md:579-584` to `:586-592`, `SKILL.md:186` to `:198`; the `grep -rn classify` claim corrected to four matching files; the "Both are Windows checkouts" and "GPT_OS is a Windows room" statements softened to the inference they are, since the report never says so; and the 32 `skill-generation-unknown` lines qualified as `attention` severity, evidencing UP-019's legibility half rather than its `error`-that-blocks-nothing half. A citation sweep over all seven specs now reports no citation pointing at a blank or out-of-range line | Every `Current Verified State` section now states that findings were established at `b3633e5` and citations re-anchored to the post-S-036 tree, so a Builder following one lands on what it names | Fresh separate-context review of the repaired candidate; every accepted slice still unimplemented |
| 2026-09-06 | spec | Fresh separate-context review of `d1de47f` returned CHANGES REQUESTED with thirteen findings; all repaired here | The prior repair round was the defect: it applied blind string replacement without checking each target, so it degraded two correct citations (`workbench-tools.mjs:24-36` to `24-64`, `test-workbench-layout.mjs:823` to `848`), missed `workbench-upgrade.mjs` entirely (six citations each one line short), missed `diagnostics.mjs` (eight codes anchored one line short after S-036 inserted `invalid-source-identity` at `:27`), and rewrote two append-only evidence rows, which `AGENTS.md` Documentation Ownership forbids. Both rewritten rows are restored to their original text and this round is recorded as new rows instead. The sweeper that reported "no citation pointing at a blank or out-of-range line" was too weak a check: it never asked whether a cited line contains what the prose claims. It is replaced by a semantic verifier that matches identifiers named near a citation against the cited span | Corrections in seven specs; `E:/`-path evidence restated - the report names the reporting room by path at `REPORT-upstream-v3-1-1-summary-2026-09-06.md:6,39,40,43` but gives GPT_OS none at `:30,218,239,310`, so the reattribution is established for one room and inferred for the other | Every accepted slice still unimplemented |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- **Open question 1 - ANSWERED 2026-09-06.** Should a harness-only migration be
  permitted against a recorded unavailable baseline? Owner selected **Option A,
  record and proceed**, with a closed reason vocabulary. S-041 TK-001 is
  unblocked; the accepted cost is recorded there.
- **Open question 2 - ANSWERED 2026-09-06.** Should the shared `code-review`
  junction on the reporting workstation be supported as-is or replaced after
  backup? Owner selected **support it as-is**. S-040 already makes the junction
  workable either way, so this closes a workstation question rather than
  changing the build; two rooms raised it without acting and need not raise it
  again.
- **Open question 3 (owner-only, no spec).** What replaced the reporting room's
  runtime without updating its receipt? UP-014 explains why the report cannot
  tell; the receipt carries no backup and no update event that would answer it.
  S-039 makes the question answerable in future, not retroactively.
- **Carried-forward blocker.** The reporting room's own `tools-receipt-drift` is
  live and unrepaired. It needs an owner decision before that room's managed-tool
  verification can be cited as evidence. Nothing in this repository repairs it.
- No agent-outcome claim follows from any item in this set.

## Supersession

- Supersedes: none
- Superseded by: none
