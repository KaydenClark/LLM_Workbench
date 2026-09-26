# TK-01S - Verify approved delivery before final Spec closure

**Task ID:** TK-01S
**Spec ID:** S-00J
**Slice:** Verify approved delivery before final Spec closure
**Status:** done
**Stance:** Builder
**Blockers:** TK-01R
**Destination:** spec-acceptance: Final closure requires verification of approved delivered content on the declared default branch, while reviewed integration delivery remains possible before owner QA; approvals cover only explicitly named Specs.
**Planned verification:** Red: an otherwise complete, reviewed and owner-approved fixture Spec closes before its approved content is verified on the declared default branch; green: complete refuses without that proof and writes nothing, then succeeds with verified approved delivery while preserving the digest. Exercise explicit two-Spec approval scope, stale content, missing proof and S-00U F1/F2/F3/F6 regressions through assembleSpecReport, recordOwnerApproval, gate and completeSpec.
**Proof:** Red at ca90287 (claim) with the new tests only: tools/test-spec-report.mjs ran 40 ok blocks, then the new TK-01S block failed 'Missing expected exception: an absent default-branch remote-tracking ref refuses closure' - an otherwise complete, reviewed and owner-approved fixture (S-7E0) closed with no default-branch proof. Green at 3ca5e57: completeSpec checks, after the decision, review and approval gaps and before any write, the manifest-declared git.defaultBranch, its origin/<branch> remote-tracking ref pinned to one SHA (local refs only, no fetch), git merge-base --is-ancestor of the approved owner-QA candidate, and computeSpecDigest (exported unchanged from spec-report.mjs, no second normalization) at that SHA against the approved digest; refusals name an undeclared branch, an absent ref, missing containment, unreadable content, or containment followed by a substantive change; success appends the existing 'Spec completed' row with 'approved delivery verified: origin/<branch> at <sha> contains approved candidate <sha> [<digest12>]'. tools/test-spec-report.mjs 42 ok: managed room S-7E0 with default branch 'trunk' covers absent ref, non-default origin/main and integration refs, uncontained candidate, reversal, removed Spec and undeclared branch, each refusing through completeSpec and CLI complete (exit 1) with Spec bytes unchanged; administrative header changes locally and on trunk keep the approval and the digest; gate stays open before owner QA and delivery; two-Spec scope S-7F1/S-7F2/S-7F3 at one inspected SHA (A never authorizes B or unlisted C, a later B finding and a substantive B change block only B, unchanged A closes, no approval synthesized). S-00U F1/F2/F3/F6 and TK-01R blocks green after moving to managed rooms with pinned delivery proof. tools/test-spec-workbench.mjs 40 ok (S-803 gate room managed with pinned proof and a stricter close-row assertion; the manifest-less S-001 lifecycle room asserts the undeclared-branch refusal writes nothing, then writes its completed state as labelled fixture setup). tools/test-branch-closeout.mjs pass. Full 48-command suite on committed 3ea6632, dirty [], pass=48 fail=0 (lane log H-tk01s-3ea6632.log); the first run on 3ca5e57 failed 4 commands only on TASKBOARD render drift left by claim, fixed by render in 3ea6632.

## Outcome

Reviewed integration delivery and final closure remain distinct. A Spec can
reach integration after Dispatcher whole-Spec QA and separate Director review
of its immutable assembled candidate. Final closure also requires actual owner
approval covering that Spec and verification that its approved delivered
content is on the declared default branch. The owner alone promotes integration
to main; the runtime checks evidence and never performs that promotion.

Human QA may occur at owner-selected milestones or over accumulated work.
Retain existing per-Spec bound approval rows for an explicitly named accumulated
scope: each approved Spec has its own row naming the inspected integration SHA
and matching content digest. Approving one Spec never approves another Spec at
the same SHA. Monitoring, milestone observations, findings and partial progress
do not become an approval. No batch framework or new approval schema is needed
for this minimum proposal.

## Authority And Pinned Evidence

The 2026-09-26 owner-directed Director -> Dispatcher -> Worker assignment and
the Dispatcher-maintained S-00J acceptance authorize this corrective packet.
Accepted semantics require approved delivered content verified on the declared
default branch before closure. Lane H disposed the proof representation below on
2026-09-26; this packet accepts no other schema or ADR.

Read these source citations at the immutable base, never a moving branch tip:

- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-workbench.mjs`, lines 475-507: complete checks Task/acceptance/evidence, review and owner approval, then writes; it has no default-branch delivery check.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-workbench.mjs`, lines 615-624: the repaired premerge gate requires review without owner QA.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-report.mjs`, lines 396-483: existing per-Spec owner approval validates candidate existence, declared integration ancestry and committed/local digest equality before appending its bound row.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-report.mjs`, lines 127-173, 183-189 and 851-859: committed/live/retired content binding, narrow administrative exclusions and disregard of mismatched historical approval.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/tools/spec-workbench.mjs`, lines 2059-2069: existing declared-default-branch remote-ref resolution available for reuse if the proposal is selected.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:tools/test-spec-report.mjs`, lines 234-288: preserved S-00U F1/F2/F3/F6 regression fixture.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:tools/test-spec-report.mjs`, lines 1469-1476: stale comment still says premerge needs owner QA, while the assertion correctly permits integration before owner QA. Correct the comment only in the released test lane; this is not a new F2 behavior repair.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md`, lines 228-238: existing closure, integration gate, branch resolution and verification acceptance advanced by this corrective Task.
- `git show 89d4042fb8931b9d720af75bffea1c28803d72aa:workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md`, lines 295-298: S-00J owns closure preceding S-00I reconciliation and retirement.

## Serialized Execution And Coordination

TK-01R blocks implementation to serialize changes to shared runtime/test seams.
Lane H released this Task's write lane on 2026-09-26 and disposed the proof
representation below (accepted as proposed); the Task resolves to ready once
TK-01R is done. This Task implements T2 and T3 of the S-00J closure-capture
transition contract.

Coordinate the closure proof consumed by S-00I before coding. S-00I owns feature
capture, retirement, discard and recovery; this Task supplies the verified
closure boundary. The composed fixture must verify main delivery before
feature capture. Independent implementation delivery does not require real
owner approval or a real main promotion; final real Spec closure still does.

S-00P/S-00O must explicitly distinguish reviewed integration delivery from
final closure wherever their existing prerequisites use complete. Do not
silently bypass, reset or rewrite those dependency edges in this Task.
Direct Blueprint Tasks remain outside this per-Spec mechanism until their
artifact home, identity, reader and lifecycle ownership are delivered. Do not
claim direct-Task QA coverage or disguise those Tasks as synthetic Specs.

## Disposed Minimum Proof Representation

Accepted by Lane H on 2026-09-26: reuse the declared default branch's existing
remote-tracking reference, pin its observed SHA, require the approved candidate
to be an ancestor, and compare its committed Spec/Task digest with the approved
current digest. This distinguishes delivered approved content from ancestry
followed by a substantive reversal. Reuse the existing digest implementation;
do not introduce a competing normalization rule.

The proposed check refuses final closure for an absent declaration/ref, missing
containment, unreadable committed content or substantive mismatch before any
write. Existing read/report, review, merge preparation and Human QA recording
remain usable. Record the observed ref/SHA and approved candidate/digest in the
existing completion evidence row instead of introducing another proof store.
The procedure must refresh the remote-tracking ref before claiming current
remote delivery; the pure check proves only the pinned local observation.

A human-readable label for an accumulated QA scope can accompany the existing
per-Spec rows. Scope is the explicitly approved set, not every Spec reachable
from the candidate. No automatic approval propagation or batch atomicity is
implied. Historical rows remain append-only.

## Acceptance And Stable Verification Seams

- At completeSpec and CLI complete, an otherwise complete, reviewed and
  approved fixture refuses closure before default-branch delivery proof.
  Assert that refusal leaves the fixture's files unchanged.
- Exercise absent or unreadable proof, a non-default branch name resolved
  through the manifest, and approved content missing or substantively changed
  on that branch. Pin its precise failure
  cases, including containment followed by changed content if ancestry is used.
- With valid bound review, explicit approval and verified approved delivery,
  completion succeeds, records checkable proof and preserves the substantive
  digest. Administrative status changes do not force another approval.
- A two-Spec fixture records explicitly approved A and B at one inspected
  integration SHA. A alone cannot authorize B or an unlisted C. A later B
  finding or substantive change prevents B closure while unchanged A retains
  its own approval. Partial observation is never synthesized into approve.
- Gate continues to permit a complete reviewed candidate before owner QA or
  default-branch delivery; findings still create corrective work and a changed
  destination still returns to Align. No per-Task approval ceremony is added.
- Preserve S-00U F1: candidate exists, declared integration ancestry and
  committed/local live/retired digest equality before approval writes;
  mismatched historical approvals remain history, never current permission.
- Preserve F2 premerge ordering, F3 administrative completion stability and
  F6 retired substantive-proof binding. Keep only the current narrow evidence,
  Receipt and administrative exclusions; a digest is not runtime-behavior proof.
- Supply S-00I the fixture sequence reviewed candidate -> integration ->
  explicit owner approval -> verified default-branch delivery -> complete.
  The S-00I lane composes feature capture/retirement/discard/recovery.

Start with the missing closure refusal at a public stable seam and demonstrate
its expected red result before implementing the smallest change. Preserve the
existing regression fixtures, adjusting successful closure setup to supply
the new proof rather than weakening its assertions.

## Intended Change Paths And Write Ownership

This Task's released write lane:

- `workbench/tools/spec-workbench.mjs` for closure enforcement and proof;
- `workbench/tools/spec-report.mjs` for the smallest reusable committed-digest seam, if needed;
- `tools/test-spec-report.mjs` for targeted red/green, explicit scope and preserved regression coverage;
- `tools/test-spec-workbench.mjs` only to supply main-delivery proof in existing successful-closure fixture setup, without weakening their assertions (Lane H owns S-00I too and released this path; the continuous lifecycle proof stays S-00I's).

The following path requires coordinated delivery and is not released to this
Worker:

- `RUNBOOK.md` and `templates/RUNBOOK.md` through S-00P for the narrow operational prerequisite, explicit approval scope and generic mirror.

Dispatcher alone maintains this Task and
`workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md`; Director owns shared
projections. No manifest, ADR, Wiki router, broad controls/skills, identity or
direct-Task artifact change belongs to this packet. Record coordinated docs
and fixture proof before calling delivery complete.

## Execution Proof And Exit

Capture guardrail and read-only self-drift baselines before runtime changes.
Run targeted test-spec-report, test-spec-workbench and test-branch-closeout,
then the full required verification suite. Capture post-change guardrail and
self-drift receipts and preserve any reported limitations without claiming
green structural checks establish product behavior.

Return the exact candidate SHA, changed paths, actual red/green output,
verification, documentation status, coordinated S-00I proof and remaining gaps
to the Dispatcher. Dispatcher performs whole-Spec QA; Director independently
reviews the immutable assembled candidate before integration. This packet
records no implementation, actual owner approval, closure, record move or main
promotion.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00j-tk01s-main-closure-gate | 3ea66323e6e70b481eff2649b8dd9e17dff66b88 | ahead 0 behind 0 | 0 | Red at ca90287 (claim) with the new tests only: tools/test-spec-report.mjs ran 40 ok blocks, then the new TK-01S block failed 'Missing expected exception: an absent default-branch remote-tracking ref refuses closure' - an otherwise complete, reviewed and owner-approved fixture (S-7E0) closed with no default-branch proof. Green at 3ca5e57: completeSpec checks, after the decision, review and approval gaps and before any write, the manifest-declared git.defaultBranch, its origin/<branch> remote-tracking ref pinned to one SHA (local refs only, no fetch), git merge-base --is-ancestor of the approved owner-QA candidate, and computeSpecDigest (exported unchanged from spec-report.mjs, no second normalization) at that SHA against the approved digest; refusals name an undeclared branch, an absent ref, missing containment, unreadable content, or containment followed by a substantive change; success appends the existing 'Spec completed' row with 'approved delivery verified: origin/<branch> at <sha> contains approved candidate <sha> [<digest12>]'. tools/test-spec-report.mjs 42 ok: managed room S-7E0 with default branch 'trunk' covers absent ref, non-default origin/main and integration refs, uncontained candidate, reversal, removed Spec and undeclared branch, each refusing through completeSpec and CLI complete (exit 1) with Spec bytes unchanged; administrative header changes locally and on trunk keep the approval and the digest; gate stays open before owner QA and delivery; two-Spec scope S-7F1/S-7F2/S-7F3 at one inspected SHA (A never authorizes B or unlisted C, a later B finding and a substantive B change block only B, unchanged A closes, no approval synthesized). S-00U F1/F2/F3/F6 and TK-01R blocks green after moving to managed rooms with pinned delivery proof. tools/test-spec-workbench.mjs 40 ok (S-803 gate room managed with pinned proof and a stricter close-row assertion; the manifest-less S-001 lifecycle room asserts the undeclared-branch refusal writes nothing, then writes its completed state as labelled fixture setup). tools/test-branch-closeout.mjs pass. Full 48-command suite on committed 3ea6632, dirty [], pass=48 fail=0 (lane log H-tk01s-3ea6632.log); the first run on 3ca5e57 failed 4 commands only on TASKBOARD render drift left by claim, fixed by render in 3ea6632. | RUNBOOK wording routed to S-00P (complete's default-branch delivery prerequisite, refreshing origin/<default branch> before closure, the refusal output and the completion-row proof); RUNBOOK, AGENTS, LEXICON and templates not in this lane; code comments updated in spec-workbench.mjs and spec-report.mjs. | RUNBOOK wording routed to S-00P; the check proves only the pinned local observation of origin/<default branch>, so the procedure must fetch first; the origin remote name is inherited from the existing resolveDefaultBranchRemoteRef; the manifest-less S-001 lifecycle fixture completes by fixture setup because a legacy specs/ room cannot declare a default branch; S-00I composes feature capture and retirement on this closure boundary; S-00P/S-00O must distinguish reviewed integration delivery from final closure; Dispatcher whole-Spec QA and separate Director review of the immutable candidate pending; TK-01T follows. | 6a4c40a3c2ac565edcf22274cd4301f35c053221339c6243f58fd4fb10a7883a |
