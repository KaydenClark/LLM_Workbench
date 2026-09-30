# TK-003M - Prove merge-aware discard identity

**Task ID:** TK-003M
**Spec ID:** S-00I
**Slice:** Prove merge-aware discard identity
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-00I safe lifecycle references and verified-main discard
**Planned verification:** Tests-first red at bd218db, focused test-spec-workbench and strongest negative probes, followed by parent-coordinated immutable aggregate verification and fresh assembled review

**Proof:** Red at 2254cb0: F4 Task merge-restored incarnation is wrongly discarded after continuous T0-T5 with one approval. Green on code-identical 1b6854c/e53f1e3: full test-spec-workbench exits 0, continuous T0-T6 8.94 seconds, both Task/Spec merge-parent variants and novel directory proof refuse without writes; ordinary non-FF imports and complete-directory recovery pass. Original independent merge/continuous probes now pass their intended refusal/recovery checks; test-spec-report passes unchanged. Final aggregate, fresh assembled review and delivery pending.

## Bounded Correction

Resolve latest Task/Spec incarnation and complete directory recovery through unsimplified Git merge history. Refuse unpublished merge-created or merge-restored incarnations for both-parent-missing and retained-side-parent cases with files, index, HEAD and refs unchanged. Preserve normal non-fast-forward delivery, one simulated approval in the continuous room, whole-directory recovery, and unchanged S-00U approval binding.

## Dispatcher Disposition

Refines this existing record created by fail verdict #4 at bd218db. The
semicolon split in the original findings was accidental; TK-003L and TK-003M
are the complete two-record correction set, not extra findings or IDs.
The Director assigns S-00I as assembled capability owner and one writer for
workbench/tools/spec-workbench.mjs, tools/test-spec-workbench.mjs, S-00I
Spec/Tasks and generated projections. TK-003L implementation is verified
before TK-003M starts. S-00T latest-incarnation/directory-recovery acceptance
remains the governing existing contract; S-00U approval code is unchanged.

## Current Proof

TK-003L implementation was verified at 2254cb0 before this runtime edit;
final aggregate verification and review remain shared pending gates.

Red on 2254cb0: after the same T0-T5 chain and original single simulated
approval, the strengthened test fails with Missing expected exception:
F4 Task merge-restored incarnation. Both-parent-missing and retained-side
merges plus directory-only merge proof and ordinary non-FF imports are now
durable regressions. No S-00U approval code or rows were changed.

## Limits

No real record retirement/discard, owner approval, main promotion, remote
push/merge, unrelated route edits, extra corrective IDs or approval-row copying.
Local immutable commits are allowed for source-identity proof. Full aggregate
verification and separate-context review remain coordinated by the parent.
