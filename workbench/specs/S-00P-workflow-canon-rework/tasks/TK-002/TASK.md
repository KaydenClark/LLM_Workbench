# TK-002 - Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist

**Task ID:** TK-002
**Spec ID:** S-00P
**Slice:** Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist
**Status:** done
**Blockers:** TK-001, S-00H, S-00I:delivered, S-00J:delivered
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red/green contract regressions in `tools/test-control-fidelity.mjs`, exact command/argument checks against `workbench/tools/spec-workbench.mjs`, and a disposable-room cold-start walkthrough; preserve guardrail and self-drift before/after receipts. These are execution plans, not achieved proof.
**Stance:** Builder
**Proof:** Reviewed integration delivery PR #238: exact candidate 8c2c880bb3939bb231a2a39e3474133034d8f9cd passed required51/51 and third fresh independent entire-diff review; integration76932f5ba7643a55fa140320cb86550ab7fc99bb contains it. Control red18/20 then green20/20; portability durable P2 red then green6/6 with26 new assertions; append-only CLEAN and original closure/Receipt bytes preserved. Both failed review candidates/history retained in Spec evidence. Guardrail78/100, seven known self-drift findings/cleanUpdatefalse; no ownerQA/main or whole-Spec completion claim.

## Execution Reconciliation (2026-10-01 UTC)

The current owner request and Director release authorize this Task's named
AGENTS/control-test lane. Native claim selected this record at `699ca112` after
fetching integration; S-00I:delivered and S-00J:delivered are satisfied at base
`07edccc57b8f75613ad1d09203a3e414d867b90c`. The September 26 packet below is
planning history where it says execution is blocked, a lane is unreleased or
main/capture behavior is unavailable. Current source implements content-bound
review/owner approval, main-before-complete verification and feature capture
before cleanup. The latest SCR role chain governs; S-00O exemption 2 still
requires immutable independent review of this Task's integration candidate.
The Dispatcher also owns the Director-released test-portability-matrix lane,
limited to structured historical proposal classification with active-route and
privacy negative checks; no ledger bytes change. Worker source/proof hand-back
is recorded in the owning Spec; full candidate verification and native close
follow before review. Templates remain TK-005's staged mirror obligation.

## Objective And Destination

Rewrite `AGENTS.md` so a cold-start Worker can select and execute a real
Task record, self-check its result and report proof to the Dispatcher. The
Dispatcher verifies the assembled Spec against its destination; a separate
Director reviews the immutable assembled candidate before integration. Failed
assembled review returns attributable findings to corrective Tasks under the
owning destination and a fresh candidate. This advances S-00P's phase-two
AGENTS acceptance without claiming the entire Spec, runtime or template ready.

## Authority And Dependencies

This packet expands the existing TK-002; it creates no new ID, claim or runtime
assignment. Its blocked Status and Blockers above remain unchanged. TK-001 and
S-00H have completed according to the current Spec; retained dependency IDs do
not authorize execution. The Dispatcher alone reconciles S-00P's current-facing
gates and any delivery-versus-closure dependency changes. Until that is done,
S-00I/S-00J completion requirements remain in force; do not bypass `claim` or
substitute a green targeted test for those dependencies.

S-00J TK-01T (2026-09-26) converted the S-00I and S-00J edges above to
`S-00I:delivered` and `S-00J:delivered`, and that conversion supersedes the
previous paragraph's "Blockers above remain unchanged" for those two edges
only. The owner promotes integration to main only after version-level Human
QA that covers the controls this Task writes, so requiring final `complete`
of S-00I and S-00J here would deadlock (2026-09-26 wave review, finding 4).
This Task needs their reviewed behavior on integration, which is T0 of the
S-00J closure-capture transition contract: every Task done, acceptance
checked, a current PASS verdict whose candidate the declared integration
branch contains with a matching committed digest. The edges stay visible and
checkable, and `next`/`claim` resolve them. Fetch integration before relying
on them, because the resolver reads only the local ref. TK-001 and S-00H
stay plain.

The current owner-directed planning assignment supersedes the older S-00P
per-Task separate-review wording: Worker self-check and report -> Dispatcher
whole-Spec Verify/QA -> separate Director review. Roles describe responsibility,
not branch identities. The Dispatcher must reconcile the contradictory Spec
clauses before this packet becomes executable. Do not repeat a separate
approval ceremony for every Task.

The existing SCR candidate `e318f144247d4288d2364f8103c78069d64aa919`
is a separate reconciliation input, not approved inherited proof. The Director
must release its shared control lanes before this Task changes AGENTS or its
shared test seam. Preserve its useful evidence, but do not copy version-only
Human QA wording or assume its original review produced a verdict. Coordinate
S-00I/S-00J closure and S-00O's actual branch exemption through the Dispatcher.

Human QA may occur at owner-chosen milestones, accumulated work, exhausted
Specs, a valued Spec or an escalation. Observations and findings are distinct
from the owner's eventual approval. Retain active failed QA findings and their
corrective next action; do not reset them to waiting for QA to begin. Closure
follows S-00J's [closure-capture transition contract](../../../S-00J-spec-qa-gate-at-integration/SPEC.md):
`complete` follows main verification, and features capture follows `complete`
and precedes transient cleanup. Features capture and
that composed closure sequence remain runtime gaps until their owners deliver
and verify them; invent no command or working feature collection.

## Exact Intended Paths And Lane Boundaries

The eventual implementation lane is bounded to:

- `AGENTS.md`: Work Selection And Lifecycle, Assigned Work And Stances,
  Engineering And Verification, Git Rules/Branch Completion, and their affected
  completion/QA statements. Preserve authority, edit limits, owner-only main,
  folder moves and reference safety.
- `tools/test-control-fidelity.mjs`: add focused contract regressions at the
  existing seam; retain its fidelity reporting cases and criteria.
- This `TASK.md`: eventual Worker plan/proof state only, using supported runtime
  operations once eligible. The Dispatcher owns the parent Spec and projection.

Read `workbench/tools/spec-workbench.mjs` and the relevant existing lifecycle,
report and branch-closeout tests as evidence; do not edit their runtime in this
Task. `RUNBOOK.md`/`README.md` belong to TK-003; `LEXICON.md` and ADRs to TK-004;
`templates/AGENTS.md` and other generic mirrors to TK-005. Do not alter those
lanes, the manifest, IDs, Blueprint or projections. The root/template exemption
is temporary staged delivery: this Task changes root instructions, and TK-005
must mirror the assembled result before S-00P acceptance can pass. If a needed
regression or runtime repair exceeds these paths, report it to the Dispatcher
rather than taking the lane.

## Implementation And Red/Green Plan

1. Once the Dispatcher releases the dependency and shared-lane gates, verify
   root/branch/upstream/dirty state, resolve S-00P through the manifest, and
   read the current Spec, Task, command implementation and accepted controls.
   Claim only through the existing eligible-task operation. Capture immutable
   baseline SHA, guardrail score/recommendations and pre self-drift receipt.
2. Add contract tests which fail for the actual remaining contradiction at that
   baseline. Cover Task-record selection and proof reporting, Worker/Dispatcher/
   Director boundaries, corrective return after failed assembled review, and
   flexible owner QA timing. Mutation cases must reject restoring a per-Task
   separate approval, version-only Human QA or instructions for an unavailable
   closure/capture command. Do not assert that phrases are absent today merely
   because they were absent at S-00P's historical pre anchor.
3. Record the red command, exit status and expected assertion failure. If the
   current candidate already satisfies a claim, record that baseline result;
   test a real remaining gap rather than manufacturing a red failure or
   weakening existing controls.
4. Make the smallest AGENTS rewrite. `TASK.md` is the state/proof record, while
   the current `claim` CLI takes a Spec ID and selects its eligible Task; do not
   invent a `claim TASK.md` signature. State actual enforced branch routing and
   distinguish nested branch destination from delivered tooling. Preserve
   supported move/reference safeguards and the owner-only main boundary.
5. Run `node tools/test-control-fidelity.mjs`; verify each documented runtime
   command and its options against the actual CLI/parser, then exercise the
   affected safe behavior in disposable fixtures. A usage-token match alone
   does not prove correct arguments, eligibility or behavior.
6. Run relevant lifecycle/report/branch-closeout regressions and the AGENTS full
   suite for the implementation candidate. Capture post self-drift and guardrail
   receipts plus bounded semantic readback. Record remaining recommendations,
   known drift and outcome limits without changing audit criteria. Report exact
   SHA, diff, tests, docs and gaps to the Dispatcher for assembled-Spec QA.

## Behavioral Proof Plan

Use a disposable Git room and its manifest-resolved controls; never mutate real
Specs as tests. A one-command demo or transcript checkable in under one minute
must show a cold-start agent resolving an eligible Task record, running the
supported claim route, recording meaningful proof and reporting to its
Dispatcher. Explain which observation proves each step and retain the fixture
commands and actual output. Exercise the implemented assembled-review failure
and corrective return seam using fixture findings; preserve exact candidate
identity for the subsequent Director review.

For Human QA, read back milestone, accumulation and escalation examples and
identify observations versus an approval bound to delivered content. For final
closure, demonstrate only delivered runtime prerequisites; explicitly show
main-verification/features-capture gaps and the resulting inability to claim
closure if those seams remain unavailable. S-00I/S-00J own their behavioral
implementation; their tests are supporting evidence, not a substitute for the
S-00P cold-start proof. TK-005 supplies the generic generated-room mirror and
S-00O supplies the full other-room cycle; this Task cannot claim either result.

## Done Criteria And Evidence Limits

- AGENTS routes Task state/proof through real records and supported operations,
  states the role chain, assembled review and corrective path consistently,
  and preserves flexible Human QA plus main-before-capture closure direction.
- Each command and option is verified; unavailable behavior is identified as a
  gap rather than an executable instruction. No dependency or owner gate is
  silently removed.
- Actual red/green logs, disposable behavioral demo, exact candidate SHA,
  changed-path inventory, guardrail and self-drift receipts are reported with
  their limits. A green text assertion is contract proof, not proof an agent
  realizes the Blueprint or that Human QA approved the destination.
- Worker self-check/report is complete; Dispatcher whole-Spec QA and separate
  Director review remain assembled delivery gates. Tests, receipts, this
  packet and branch accumulation do not themselves approve integration/main,
  mark S-00P complete, close failed QA or prove release readiness.

## Packet Preparation Evidence

2026-09-26: Expanded the existing blocked packet under the current planning
assignment; runtime/control implementation was not performed. Read the
manifest-resolved S-00P, current AGENTS entry controls, test seam and command
parser, plus the supplied recovery report as evidence. Historical Spec anchors
remain historical; planning observations read at base
`89d4042` and the packet-preparation candidate. Preserve the Dispatcher-owned
reconciliation of conflicting S-00P review/closure wording. Packet-only checks
are whitespace validation, unchanged Status/Blockers and a one-file diff;
assembled planning verification belongs to the Dispatcher.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00p-tk002-workflow-controls | 699ca112d33e7a2042f49efbfa766f6c12d60099 | ahead 0 behind 0 | 4 | Portability baseline red 3/4 at 07edccc5; narrow structured historical proposal handling green 5/5 with active-path/private-path negative cases. Worker AGENTS contract and disposable behavior proof in progress. | S-00P current prerequisite/role/closure text reconciled to delivered I/J behavior; historical evidence preserved. AGENTS rewrite in progress. | TK-002 Worker proof, full frozen-candidate suite and independent review; TK-003..005 and owner QA/main remain open. | 9290c61995dfe011ef89157463a7204a3e991613a35fa27e91b6c86b4b2a6864 |
| 2 | codex/s00p-tk002-workflow-controls | bf06376df5ccf298e94849a1363c4b2fdc74f07f | ahead 1 behind 0 | 0 | Control-fidelity red18/20 then green20/20 with9 contract mutations; spec-workbench39/39, spec-report, branch-closeout8/8, argument12/12; disposable cold-start and corrective-return demo6.39s with stale-digest/Task-path/unclaimed-close/owner-main/retirement refusals and original Task proof preserved. Full51/51 at immutable bf06376df5ccf298e94849a1363c4b2fdc74f07f; baseline portability3/4 corrected narrowly to5/5 with active-route/privacy negative cases. Guardrail78/100 before/after; self-drift7 known findings and cleanUpdatefalse retained. | AGENTS current Task-record, review/correction, blocker grammar and closure instructions rewritten; S-00P current dependency/role/claim text reconciled. Templates deliberately deferred to TK-005; historical rows preserved; no Wiki/skills/ledger/manifest change. | Independent final-candidate review, PUBLIC origin publication approval and integration containment pending; TK-003..005 and owner QA/main remain open. No clean-update or agent-outcome claim. Git state at close: unpushed (ahead 1 behind 0 of origin/codex/s00p-tk002-workflow-controls); recorded reason: Local unpushed review-ready checkpoint because automatic approval review refused public-origin egress before execution; no transport retry. Local-only bf06376d has full51/51 proof. Exact final public-destination approval remains required before push and integration delivery. | 9baa06a84f4cdf9a0f00f1fc94e9ad43dcbf0374d39e0e956b0075d238a7d8f7 |
| 3 | codex/s00p-tk002-workflow-controls | 2c9c7727fcd3986b642ccfa41573cdd44fed3e63 | ahead 2 behind 0 | 4 | Fresh same-Task acceptance correction: exact independent P2 durable red exit1, then focused1/1 and portability6/6 green; 26 new table assertions across both legacy lanes (4 historical positives and22 active negatives), existing9 negatives preserved. Control-fidelity20/20, ledger5/5, syntax and diff check pass. Final frozen-candidate full51 and fresh independent review pending. | Portability checker recognizes only whole nominal legacy-path proposed parentheses and nominal superseded/unselected history sentences. Exact failed head2c9c7727 and independent review retained; no ledger or AGENTS source change. | Final full51, fresh immutable separate-context review, explicit public-origin export authorization and integration containment pending. | 1237cc7033467a0f41f4f771af41f999bdc01a4e25705ca4f38f507db5d46830 |
| 4 | codex/s00p-tk002-workflow-controls | 2c9c7727fcd3986b642ccfa41573cdd44fed3e63 | ahead 2 behind 0 | 4 | Independent P2 at2c9c7727 preserved: active retired instruction inside proposed parentheses escaped classifier. Durable exact red exit1 before repair; bounded nominal-span helper green focused1/1 and matrix6/6. 26 new assertions:4 historical positives and22 active negatives across grilling/handoffs; existing9 negatives retained. Control-fidelity20/20, ledger5/5, syntax and diff-check pass. Earlier full51/51 at2c9c7727 remains historical; required full51 on this new final immutable candidate is pending before publication/delivery. | Existing TK-002 narrow portability test corrected within acceptance; prior Task Receipt/history and independent FAIL preserved. AGENTS bytes unchanged from prior candidate; ledger and all excluded lanes unchanged; shared Spec/Task/projection current. | Final repaired-candidate full51 and fresh independent review remain required; explicit PUBLIC KaydenClark/LLM_Workbench publication authorization and reviewed integration containment pending; TK-003..005 and owner QA/main remain open. Git state at close: dirty-tree (4 files: TASKBOARD.md, tools/test-portability-matrix.mjs, workbench/specs/S-00P-workflow-canon-rework/SPEC.md, workbench/specs/S-00P-workflow-canon-rework/tasks/TK-002/TASK.md) and unpushed (ahead 2 behind 0 of origin/codex/s00p-tk002-workflow-controls); recorded reason: Local unpushed review-ready correction because automatic approval review refused public-origin export before execution. No public transport retry or bypass; scoped targeted proof is named, new final full suite/review still pending and no delivery claimed. | f259afb014178c20eefce39519440a67e04e1eb4a957736d4181c9e62501f0d1 |

## Unlanded Review Correction (2026-10-01 UTC)

**Historical attempt.** The text below describes failed2c9 and its unlanded correction at that time; current Status/Proof above records subsequent exact8c2 review and PR238 integration delivery. Earlier publication rejection is preserved history; the owner later explicitly authorized the public destination and actual push/merge succeeded. No current retry or in-progress assignment is implied.

Independent exact-head review failed candidate `2c9c7727fcd3986b642ccfa41573cdd44fed3e63` for one proven P2: the portability classifier masked an active retired route inside a parenthesis that also said proposed. This is an unmet TK-002 acceptance requirement before integration, so the Director released a fresh attempt of this same Task. The record returns explicitly to in-progress; prior Proof and checksum-linked Receipt rows remain unchanged as that earlier attempt. No whole-Spec verdict, owner QA, delivery or publication is inferred. The correction lane remains test-portability-matrix only; source controls and all excluded lanes remain unchanged.
