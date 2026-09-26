# TK-002 - Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist

**Task ID:** TK-002
**Spec ID:** S-00P
**Slice:** Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist
**Status:** blocked
**Blockers:** TK-001, S-00H, S-00I, S-00J
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red/green contract regressions in `tools/test-control-fidelity.mjs`, exact command/argument checks against `workbench/tools/spec-workbench.mjs`, and a disposable-room cold-start walkthrough; preserve guardrail and self-drift before/after receipts. These are execution plans, not achieved proof.
**Stance:** Builder

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
