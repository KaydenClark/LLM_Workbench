# S-038 - Workbench v3.1.2 Upstream Fix List

**Spec ID:** S-038
**Status:** complete
**Priority:** 1
**Owner:** claude-opus-5
**Stance:** Reconciler
**Updated:** 2026-09-06
**Catalog description:** Accept, decline, or correct each of the eleven v3.1.1 upstream items UP-013 through UP-023, route the accepted ones to capability specs, and record the final disposition so Master Workbench can compare v3.1.2 against v3.1.1.
**Blockers:** none
**Latest event:** All eleven accepted items landed and their six owning specs are complete and contained in `integration`; the final disposition table and release account are recorded.
**Next gate:** None. Publishing `integration` to `main` is owner-only and outside this spec.

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
| TK-002 | After S-039 through S-044 are complete and the full suite is green, write the final disposition table and the v3.1.2 release account | done | none | All six owning specs are `complete` and contained in `integration` (PRs #65, #66, #67, #68, #69, #70). Full `AGENTS.md` suite green on the merged tip: 25 node suites plus the path-safety grader, `render` no drift, `doctor` exit 0, `check-append-only.py` CLEAN, `git diff --check` clean, no CRLF. Guardrail 78/100 and templates 106.6/113, both unchanged from the pre-implementation baseline. Disposition table and release account below. |

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
- [x] Each accepted item names the capability spec and ticket that owns it, and
      that ticket exists at the named path.
- [x] Every correction to the upstream report is stated with the source evidence
      that establishes it.
- [x] S-039 through S-044 are `complete` before TK-002 closes.
- [x] The full `AGENTS.md` verification suite passes at the release commit.
- [x] The Completion Result carries the final disposition table in the S-035
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
| 2026-09-06 | spec | Fourth separate-context review found the previous commit repeated the append-only defect it was repairing | `f963b96` restored the five earlier rewrites correctly, then rewrote three rows that `7a386fd` had already published - this spec's, S-039's, and S-042's fresh-review rows - to fold in the corrections. The same commit demonstrated the right pattern twice, in S-041 and S-044, so the defect was inconsistency rather than ignorance. All three are restored byte-for-byte to their `7a386fd` text and the corrections are recorded here. Two claims those rewrites made need correcting: the count of rewritten rows before `f963b96` was five across four specs, and the row at `:255` claiming "every correction is recorded in an appended row instead" was false of two of them at the time it was written. S-041's and S-044's new rows attribute the second rewrite of their capture rows to `d1de47f`; the true commit is `22f5728` - `git diff d1de47f^ d1de47f` touches no evidence row in either spec | Added `check-append-only.py`, which reconstructs every evidence row from every commit on the branch and asserts each row still carries its first-published text. It reports this branch CLEAN across all seven specs and would have caught all three rounds of this defect | Every accepted slice still unimplemented |
| 2026-09-06 | TK-002 | Ticket closed and spec completed; the release account is recorded | All six owning specs are `complete` and contained in `integration`: S-041 PR #65, S-043 PR #66, S-040 PR #67, S-042 PR #68, S-039 PR #69, S-044 PR #70, each proved by `git merge-base --is-ancestor`. `origin/main` carries no `workbench/` tree. Full `AGENTS.md` suite on the merged tip `18ffc0d`: 25 node suites plus `evals/tasks/task_b_path_safety/test_grade.py` all pass; `render` leaves no drift; `doctor` exits 0; `check-append-only.py` CLEAN; `git diff --check` clean; no CRLF. Guardrail `78/100` and templates `106.6/113`, measured before the work began and again here with unchanged criteria - neither moved, and the Completion Result says why that is the expected result rather than a disappointing one | Disposition table in the S-035 shape, the release account for Master Workbench, the guardrail before/after with its limitation, and an honest record of what the review gate cost | Publishing `integration` to `main` is owner-only. Every limitation the six specs recorded stays open and routed; none is closed by this ticket |
| 2026-09-06 | TK-002 | Separate-context review of the closeout found two false claims in it; corrected here | Reviewer verified every completion and containment claim, all eleven disposition rows against the merged tree, all four corrections to the upstream report, the reattribution's `E:/`-path evidence, the guardrail argument by measuring three commits itself, and the faithfulness of the recovered S-036/S-037 cherry-pick - and found two claims false. (1) "Every one of the six capability slices was rejected by its first separate-context review" is wrong: S-041's one slice review APPROVED, recording three caveats. The true count is five of six. It was wrong in the paragraph that exists to let Master Workbench price the review gate, and wrong in the same direction as flattery toward the gate. Corrected in the Completion Result and in `benchmarks/RESULTS.md`, whose row had not yet reached `integration`. (2) The row above claims every limitation "stays open and routed". Completing S-038 and S-043 in this very ticket removed the named owner from two: S-040 routed its presence-only link gap to "a follow-up spec, or an upstream item under S-038", and S-042 named S-043 as its `doctor` hook's owner "if S-043 merges without the hook, this becomes a new linked spec" - which is what happened. Both are now carried in this spec's Remaining Limitations as owed with no current owner. Neither spec is created, per `AGENTS.md`: record the blocker in the existing owner rather than manufacture a queue item. Also surfaced S-044's six missing `classify` snapshots into its Remaining Limitations, where they had lived only in an evidence cell, and corrected the UP-020 row, which juxtaposed the reporting room's 6 + 4 against this repository's zero and invited the inference that S-037 moved this repository from one to the other; the real evidence is S-037's CRLF simulation | The row above is restored byte-for-byte and corrected here rather than edited, because `check-append-only.py` counts it published at `4b4c67c` and amending a pushed commit would be a force-push `AGENTS.md` forbids without approval | The two orphaned follow-ups are owed and unowned; opening specs for them is an owner decision |
| 2026-09-06 | TK-002 | Second closeout review found the corrected count still wrong and one cause misattributed; corrected here | Reviewer recounted from the evidence logs: "three of those needed four rounds" is wrong - **two** did. Enumerated in the Completion Result so the claim no longer depends on a counting convention: S-039 and S-044 four slice reviews, S-042 three, S-040 and S-043 two, S-041 one. The first correction fixed six-to-five and left the adjacent number unchecked. It also found "Completing S-038 and S-043 in this very ticket" false: S-043 was already `complete` at `18ffc0d` and this branch never touched it, so S-042's fallback fired at PR #66 before this branch existed. Only S-040's item was orphaned here. And it found the `AGENTS.md` citation did not license declining to open the specs - the "no confident next action" and "for yourself" antecedents both fail, while `AGENTS.md` positively requires a new linked spec for a later change to a completed result - and that "visible" was false against the harness's own routes, since `next` returns null and neither item reaches `doctor` or the Taskboard | [S-045](../S-045-v3-1-2-follow-ups/SPEC.md) created to own all three follow-ups, every ticket `blocked` on owner direction so `next` still excludes them; `tools/check-append-only.py` extended to cover `benchmarks/RESULTS.md`, which immediately caught this branch's own in-place edit of that ledger | Whether v3.1.3 takes any of the three is an owner decision |
| 2026-09-06 | TK-002 | Third closeout review found the corrected count credited four approving reviews that never happened, and three further gate deviations; all four owed reviews were then run | The reviewer recounted from the six evidence logs: `grep -niE "approv"` across all six slice specs returns two hits, S-041's approving row and S-040's gate-deviation row. Only S-041 has an evidenced approving review; S-042's exists only in a header line its own merge commit `6b83f40` wrote. So "add the approving review to each and the totals are 5, 5, 4, 3, 2, 1" was false for four of six. The same recount surfaced that S-039, S-043 and S-044 each merged the repair for a CHANGES REQUESTED verdict with no fresh review, exactly as S-040 had - and that two of them still carried a `Next gate` line naming the review that was skipped. All four owed reviews were run retrospectively on 2026-09-06 against their exact unreviewed ranges. S-043 **approved**. S-039, S-040 and S-044 returned **CHANGES REQUESTED**, two findings rated HIGH: S-040's repair re-published a host description that measurement contradicts, and S-044's repair introduced two new false claims. S-039's repair was sound at its own tree and its merge provably faithful, but nine of its live citations point at unrelated content on `integration` because bare line numbers were pinned to a tree the next commit invalidated | The gate account is rewritten to state the real counts and the four deviations; S-039, S-043 and S-044 each gained a gate-deviation row in the shape S-040's already had; S-039's and S-044's headers and S-042's and S-044's Completion Results are repaired; every finding is routed to S-045; `tools/check-append-only.py` now derives its spec list from the filesystem rather than a hardcoded seven, which had silently excluded S-036, S-037 and S-045 - all three carry rows this branch wrote | The nine stale S-039 citations and roughly 68 further bare citations across the sibling specs stand until S-045 acts. Whether S-042's approving review happened is unresolved; if it did not, the count is four deviations of six rather than four with one unevidenced |

## Completion Result

Every item on the second v3.1.1 upstream fix list has a final disposition, and
each accepted one landed in the capability spec that owned it.

| Item | Title | Final disposition |
|---|---|---|
| UP-013 | `doctor` never emits the managed-runtime integrity check it registers | landed in S-039: the receipt hash check moved into `workbench/tools/workbench-layout.mjs`, which every room installs, so a room's own `doctor` reports `tools-receipt-drift` and exits 1. Claim refined at routing: `tools-receipt-missing` *was* emitted by an installed tool, but only on the `validate --genesis` path with no hash check |
| UP-014 | A drift report cannot distinguish a stale receipt from a modified runtime | landed in S-039: drift is classified `receipt-stale`, `runtime-modified`, `source-unavailable`, or `runtime-authentic`, each naming its remedy. Closed for the release-side `verify`; a room's own `doctor` still reports only `source-unavailable`, which is recorded as a limitation |
| UP-015 | Presence-only skill install fails closed on a linked skill path | landed in S-040: a destination whose realpath already holds the skill installs and reports the resolution; a link to a file, a dangling link, and a link to a directory without the skill still refuse. The report's own claim that the presence paths accept a skill in *either* root was corrected - they accept one only where a root holds an ordinary directory |
| UP-016 | The upgrade gate never names the route that clears it | landed in S-040: `skill-path-collision` and `unmanaged-skill` both name `--layout-only`, and `skills/update-harness/SKILL.md` states the route-selection rule before the migration seam |
| UP-017 | The green-baseline gate has no recorded "baseline unavailable" path | landed in S-041 under the owner's **Option A**: the owning spec records the baseline unavailable with a reason from a closed vocabulary and its evidence, and the harness-only change proceeds. Option B declined. The rule is byte-identical in `templates/ADOPTION.md` and `skills/update-harness/SKILL.md` |
| UP-018 | Seeded lane documents are installed once and never managed | landed in S-042: a seed record beside the manifest tracks each seeded document's generation, and `stale-seed` reports one behind the manifest. Chosen over receipt membership so a room's legal local adjustment does not become a blocking finding |
| UP-019 | Error-level findings that block nothing make a healthy room read as failed | landed in S-043 **with correction**: the report's first proposed remedy already shipped in v3.1.1, so only its second disjunct was live. `doctor` now groups and counts findings by consequence; `--json` is byte-unchanged and no blocking semantics moved. The report named four `error`/`blocks: none` codes; there are eight |
| UP-020 | No normalize path for existing ADRs and wiki notes without frontmatter | landed in S-042 **at reduced scope**: `adr` and `wiki` gained `normalize`. Most of the reported impact was the line-ending defect S-037 fixed. The report's 6 `invalid-adr` + 4 `invalid-note` are the reporting room's; the evidence that they were line endings is S-037's CRLF *simulation* of this repository, which reported 25 `invalid-adr` and 4 `invalid-note`, none of them true, and zero after the fix. This repository on an LF checkout measured zero both before and after, so the two numbers describe different rooms. The capability is for hand-authored and pre-fix rooms |
| UP-021 | Provenance fixes do not reach rooms already carrying a placeholder | landed in S-042: `unverified-provenance` reports a placeholder commit or a release disagreeing with `workbenchVersion`, and `record-source` repairs it. This repository is itself an instance and is deliberately left unrepaired - running the command here would stamp the branch's own tip as the room's source |
| UP-022 | Adoption demands seven filled controls with no scaffold-then-reconcile route | landed in S-044 **and sharpened**: the preflight returned on the *first* failing control, so an operator learned one per run. It now refuses once naming every control with its own reason, plus the reconcile order and the overwrite warning |
| UP-023 | No classifier for an unversioned legacy control set | landed in S-044: `tools/workbench-classify.mjs` reports `genesis | adoption | upgrade | unclassifiable` with its evidence, writes nothing, and its rule is recorded before the code |

### What v3.1.2 removed, for Master Workbench

Eleven of eleven items accepted; eleven landed. None declined. Four carried a
correction to the report itself, recorded at routing rather than applied
silently: UP-013's half-right emitter claim, UP-019's already-shipped remedy and
its four-versus-eight code count, UP-020's inflated impact, and UP-015's false
premise about what the presence paths accept.

Two items' cited magnitude was reattributed to the line-ending defect S-037
fixed. That reattribution is established for the reporting room, which the report
names by an `E:/` path, and inferred from the failure mode for GPT_OS, which the
report gives no path at all.

### Guardrail, before and after

`node tools/audit-guardrails.mjs --path .` reports **78/100** before this work
and **78/100** after, with unchanged criteria: static 20/20, drift resistance
25/25, benchmark discipline 25/25, outcome evidence 8/30. The template evaluator
reports **106.6/113** before and after.

Neither moved, and neither was expected to. Every criterion these eleven items
touch is already satisfied in the static rubric; the work closed real defects in
runtime behavior and in the record, which that rubric does not measure. Both
numbers are static control-surface measures. **Nothing here establishes that
v3.1.2 makes an agent better or worse than v3.1.1**, and no such claim is made.

### What the gate cost, honestly

Five of the six capability slices were rejected by their first separate-context
review of the slice.

The convention, stated once and applied once: **count reviews that returned
CHANGES REQUESTED.** On that count S-039 and S-044 took four each, S-042 three,
S-040 two, S-043 one, and S-041 none - its single review approved. Three earlier
drafts of this paragraph were wrong: the first said all six were rejected; the
second said three needed four rounds and then enumerated by mixing both
conventions inside one list; the third added "add the approving review to each
and the totals are 5, 5, 4, 3, 2, 1", which credited four approving reviews that
never happened. Only S-041 has an approving review recorded in an evidence row.
S-042's is asserted in a header line that its own merge commit `6b83f40` wrote,
with no row behind it. **The other four - S-039, S-040, S-043 and S-044 - merged
into `integration` with no approving review at all**, which the next section
records as gate deviations. For the routing candidate S-038 the evidence log
carries three review rows before any slice existed, the third of which calls
itself "Fourth"; whether the unrecorded one makes the total four is not
resolvable from the log, so no number is asserted here. S-041 is the exception
among the slices: its one review approved, recording three caveats rather than
blocking on them. Naming it matters, because six-of-six reads as a gate that
catches something every time, while five-of-six with one clean pass is a
different signal about whether four-round churn is the norm or the tail.

**The gate was skipped four times out of six, and skipping it was not free.**
`AGENTS.md` requires a fresh separate-context review after a CHANGES REQUESTED
verdict before a candidate combines into `integration`. S-039, S-040, S-043 and
S-044 each merged the repair for such a verdict without one. All four owed
reviews were discharged retrospectively on 2026-09-06, against the exact
unreviewed ranges. **One approved. Three did not.** S-043's delta was clean.
S-040's repair re-published, under a "Verified in this repository" stamp, a
description of the reporting host that measurement contradicts - the symlink is
one level up from where the spec puts it, and the refusal code the spec names is
unreachable for that layout. S-039's repair was correct at its own tree and its
merge provably faithful, but it pinned bare line numbers to a tree the very next
commit invalidated, so nine live citations in that spec - including a checked
acceptance box with no immutable fallback - point at unrelated content on
`integration` today. S-044's merge was approved as a faithful union, and its
repair introduced two new false claims in the paragraph written to correct a
false claim. Every finding is routed to S-045; none rewrites a completed result.

That is the honest price. The gate is not ceremony: run four times, it caught
defects three times, including two rated HIGH, in candidates that a green suite
and a clean `doctor` had already passed.

The findings from the original slice reviews were real too, and none was
cosmetic: a receipt whose `files` map was `{}` silently disabled the integrity
check; `next` and `claim` ignored a registered `all` effect, so an agent could
claim a slice while executing tampered bytes; a vanilla Node app with one file
named `tools/privacy.mjs` classified as `unclassifiable`; a symlinked support
root reported another room's manifest as the room's own; a registry pin passed
while an unpinned code was promoted into a blocking effect; and a claim asserted
in shipped `templates/RUNBOOK.md` that deleting a managed tool is always loud was
false, because `sessions.mjs` is in `RUNTIME_TOOLS` but not in `doctor`'s import
graph.

None of that was visible from a green suite. Every branch was green when it was
submitted.

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
- **Two follow-ups without their named owner, now owned by
  [S-045](../S-045-v3-1-2-follow-ups/SPEC.md).** Only one of the two was orphaned
  by this ticket. The other fired earlier and this spec's first attempt to record
  it misattributed the cause:
  - **The presence-only link gap** ([S-040](../S-040-skill-gate-route-selection/SPEC.md)).
    `missingUserSkills` and `hasRequiredUserSkills` judge with
    `lstatOrNull(...)?.isDirectory()`, so a host whose every populated discovery
    root holds the skill as a link is reported `missing-user-skills` while the
    installer reports `complete`. S-040 routed it to "a follow-up spec, or an
    upstream item under S-038"; this ticket completed S-038 without opening one,
    so this ticket is the cause. Now owned by S-045 TK-001.
  - **A dedicated `doctor` hook for installed-state checks**
    ([S-042](../S-042-installed-state-repair/SPEC.md)). `stale-seed` and
    `unverified-provenance` ride inside `validateWiki` as an interim
    lane-collision measure. S-042 named the owner as "the next spec to take the
    `spec-workbench.mjs` lane, S-043 while its branch is open; if S-043 merges
    without the hook, this becomes a new linked spec". S-043 merged as PR #66
    without it, which is when the fallback fired - **before this closeout branch
    existed**, and this branch never touched S-043. Now owned by S-045 TK-002.
  Both are created as [S-045](../S-045-v3-1-2-follow-ups/SPEC.md), because
  `AGENTS.md` says a later change creates a new linked spec rather than rewriting
  a completed result, and because S-042's own accepted disposition already
  decided this exact fallback. Every S-045 ticket is `blocked` on owner
  direction, so `next` still excludes them and nothing is dispatched unasked.
- **Carried-forward blocker.** The reporting room's own `tools-receipt-drift` is
  live and unrepaired. It needs an owner decision before that room's managed-tool
  verification can be cited as evidence. Nothing in this repository repairs it.
- No agent-outcome claim follows from any item in this set.

## Supersession

- Supersedes: none
- Superseded by: none
