# TK-003 - Rewrite `RUNBOOK.md` procedures for Task lifecycle, assembled-Spec review, corrective Tasks, Human QA closure, reconciliation and retirement, and reconcile `README.md` orientation

**Task ID:** TK-003
**Spec ID:** S-00P
**Slice:** Rewrite `RUNBOOK.md` procedures for Task lifecycle, assembled-Spec review, corrective Tasks, Human QA closure, reconciliation and retirement, and reconcile `README.md` orientation
**Status:** blocked
**Blockers:** TK-002
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red: a disposable-room lifecycle run driven by the documented procedure fails an observable transition or refusal required below; green: the same run reaches its verified project destination, preserves corrective and recovery evidence, and every documented command has an executed result. Command-existence and phrase checks are supporting checks only.
**Stance:** Builder

## Outcome

A fresh Worker can follow `RUNBOOK.md` to execute one Task and report proof;
a Dispatcher can assemble and QA its Spec; a separate Director can review the
immutable assembled candidate. The procedures also explain owner-selected
Human QA, post-main closure then feature capture, corrective work, reconciliation,
retirement and safe recovery. `README.md` routes newcomers to those procedures
without duplicating lifecycle state or promising unavailable runtime behavior.

This is the executable packet for the existing TK-003 slice, not completion
evidence or authorization to bypass its blockers.

## Entry And Dependencies

1. Follow `AGENTS.md` -> `RUNBOOK.md` Ordinary Entry -> `LEXICON.md` Task
   Routing -> manifest-resolved S-00P -> this Task. Verify the checkout,
   immutable starting SHA, remote, upstream and dirty state; preserve unrelated
   work. Run the existing read-only `doctor` and `show S-00P` operations.
2. Keep **Status: blocked** and **Blockers: TK-002** until the Dispatcher
   resolves the inherited gate. S-00P currently requires S-00I/S-00J completion
   before phase two, and TK-003 follows TK-002. The proposed distinction between
   reviewed integration delivery and final closure is not a landed dependency
   repair. Do not change those dependencies or claim this Task here.
3. Dispatcher must supply the reconciled TK-002 control contract and identify
   the delivered S-00I/S-00J lifecycle/QA behavior. Features capture and the
   main-before-closure rule need a verified delivery route; direct Blueprint
   Tasks need a delivered home before instructions can claim they work.
   A missing route is a named implementation gap, not permission to invent one.
4. Director must release the shared root-control and test lane before execution.
   TK-002 owns `AGENTS.md`; TK-004 owns `LEXICON.md` and ADR reconciliation;
   TK-005 owns the generic template mirror. Coordinate their settled contracts
   before editing shared procedures. Dispatcher is the sole writer of the
   assigned `SPEC.md`; Director owns shared projections unless explicitly
   released; the Worker returns proof and proposed state changes to Dispatcher.

## Exact File Lane

| Intended path | Work owned by this slice |
|---|---|
| `RUNBOOK.md` | Spec Lifecycle And Retrieval; relevant ordinary-entry and behavior routing; integration/branch closeout procedure; Template Upgrade Release Gate; Workbench self-drift procedure |
| `README.md` | Core Files, How To Use It, version/update orientation and Ordinary Agent Entry where they describe the workflow or a retired route |
| `tools/test-control-fidelity.mjs` | Focused supporting command/document contract regression, after Director releases this shared test path |
| `tools/test-workbench-round-trip.mjs` | Extend the existing disposable-room CLI/demo seam to exercise the documented project/lifecycle behavior, after Director releases this shared test path |

Packet authoring changes only this `TASK.md`. No root control, template, test,
ADR, runtime, Spec, manifest, Taskboard or catalog mutation is authorized by
this authoring run. Future execution changes only the released paths above;
runtime repairs return to their existing capability owner rather than widening
TK-003. Existing `tools/test-spec-workbench.mjs` and
`tools/test-spec-report.mjs` supply supporting lifecycle/QA regressions; this
slice does not own their mechanisms. TK-005 mirrors the completed control
changes; record that dependency as the dogfood exemption for this slice.

## Required Procedure Content

- Describe Task-record entry, selection, claim, red/green implementation,
  receipt, self-check, proof, documentation status and report. Worker reports
  to Dispatcher; do not introduce a separate Task approval ceremony. Preserve
  missed-attempt proof and unmerged results; do not delete or relabel a failed
  attempt as a successful one.
- Describe Dispatcher whole-Spec QA followed by separate Director review of
  an immutable assembled candidate. Implementers and Dispatcher cannot supply
  that Director approval. A fresh substantive candidate needs fresh review;
  a failed result creates objective-named corrective work under its existing
  owner and repeats QA/review. Roles describe responsibility, not branches.
- State the actually enforced Git route and S-00O's current topology exemption;
  distinguish intended nested Task/Spec branches from implemented tooling.
  Preserve owner-only integration-to-main promotion, containment proof and
  protection of unmerged branch results.
- Human QA occurs at useful points chosen by the owner: a milestone, enough
  accumulated work, exhausted Specs, a valued Spec, or important Director
  escalation. An observation or finding is not an approval receipt. Existing
  failed Human QA remains a corrective cycle, not a request to restart QA.
- Distinguish reviewed integration delivery from final closure, per S-00J's
  [closure-capture transition contract](../../../S-00J-spec-qa-gate-at-integration/SPEC.md):
  `complete` follows exact content verification on main; features Wiki capture
  follows `complete` and precedes transient-record cleanup. Explain the runtime's actual
  per-Spec approval restrictions until its owner delivers the reconciled
  mechanism; never describe flexible QA timing as an implemented batch-approval
  command or silently bypass a gate.
- Document reconciliation, link-safe moves, retirement, discard refusal,
  exact directory recovery and a later corrective Task against durable
  knowledge. Preserve historical anchors and receipt/evidence history.
- Keep the real-room Template upgrade, pinned commits, managed-byte checks,
  independent review, remote containment and fresh-clone proof. Keep Workbench
  pre/post self-drift receipts plus bounded semantic inspection; an existing
  finding must remain visible instead of being hidden by a passing render.

## Red / Green Behavioral Verification

At the released test seam, construct an isolated local product room and bare
remote using the existing round-trip fixture helpers. Use no real owner
approval, production branch deletion or external room as test data.

1. **Red:** establish a named scenario whose project output and lifecycle
   states are required by the revised procedure. Execute the current documented
   recipe and assert its observable failing transition/refusal before changing
   the procedure. Record command, exit status, candidate and failed assertion.
   If current runtime cannot express a required transition, report the precise
   missing capability to Dispatcher and stop that dependent change; do not
   weaken acceptance into word matching or implement the missing command here.
2. **Green:** execute the corrected recipe through record-backed Task claim,
   product red/green change, receipt/close and report; Dispatcher assembled QA;
   failed Director review and corrective Task; fresh immutable candidate and
   passing review; fixture integration delivery; owner-selected fixture QA
   with finding versus explicit approval distinguished; fixture main content
   verification; `complete`, then delivered feature capture; retirement/discard;
   exact directory recovery and fresh-clone discovery. Assert actual project
   output, state, content binding, current links and recoverable bytes at the
   relevant steps. Negative cases must refuse before mutation for stale proof,
   unapproved closure, unverified main content and unmerged cleanup.
3. Derive syntax and flags from the delivered source and existing usage, not
   from an assumed API. Execute every changed command example with concrete
   fixture values; substitute placeholders and split optional alternatives
   into real invocations. Include read-only commands and relevant expected
   refusals. Usage membership alone does not verify flags or lifecycle order.
4. Run `node tools/test-control-fidelity.mjs`,
   `node tools/test-workbench-round-trip.mjs`,
   `node tools/test-spec-workbench.mjs` and `node tools/test-spec-report.mjs`
   on the executable candidate. Preserve the exact commands, exit statuses,
   fixture transition/output assertions and source SHA in the returned proof.
   These existing commands are verification entry points, not claims that a
   new composed scenario already exists or passes.
5. Supply a one-command fixture demo or a transcript checkable in under one
   minute showing the product result and lifecycle checkpoints. A provider-free
   fixture demonstrates mechanics; it does not prove a real Director verdict,
   owner approval, native-host behavior or every Blueprint promise.

## Acceptance And Hand-Back

- [ ] Runbook and README describe the delivered Task-record route, latest role
  boundaries, corrective cycle, flexible owner QA and main-before-capture
  closure without an invented command or a separate Task approval gate.
- [ ] Every changed command example has executable proof; the full composed
  lifecycle fixture has red then green evidence and tests observable behavior.
- [ ] The demo shows a working project and recoverable lifecycle evidence;
  negative checks preserve state and unmerged work on refusal.
- [ ] Template upgrade and self-drift obligations remain intact; generic mirror
  work is explicitly returned to TK-005 with the changed sections identified.
- [ ] Worker returns immutable SHA, paths, tests/results, docs, remaining gaps
  and known limitations to Dispatcher. Dispatcher updates shared Spec state,
  evaluates whole-Spec acceptance, runs the required assembled full suite and
  obtains separate Director review before integration delivery.

Task self-check is not whole-Spec approval. Do not mark S-00P complete, record
owner approval, merge main, or run a full suite to certify this draft packet.

## Source Lineage And Limits

Read S-00P at `89d4042fb8931b9d720af75bffea1c28803d72aa`: its TK-003
slice, phase rule, Acceptance Criteria, Testing Seams and Documentation Plan
establish the existing scope. Its per-Task review and fixed QA timing wording
requires Dispatcher reconciliation against the newer direction above; do not
copy those older claims into the new procedures unchanged.

The supplied September 26 Director recovery report, attachment
`aa580b5a-dd7d-418f-b69d-b567e399e92c/Pasted text.txt`, supplied SCR role,
Human QA timing, closure and command-proof context. It is recovery evidence,
not a landed review verdict or runtime. The current Dispatcher instruction
authorizes this packet authoring and conveys the newer direction. Required
packet members must remain sufficient without the local attachment.

Pending SCR candidate `e318f144247d4288d2364f8103c78069d64aa919` is
unlanded recovery context: no recovered fresh full-suite pass or completed
separate-context verdict. Do not cite it as implemented behavior, cherry-pick
its version-only QA wording unchanged, or count it as integration proof.
Preserve exact owner arrow/brace notation when used, with provenance and a
separate labeled prose interpretation; do not reconstruct missing source
notation and call it exact. No command runs, approval, product demo or lifecycle
completion is asserted by this packet.
