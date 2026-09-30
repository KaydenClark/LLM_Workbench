# TK-003M - Prove merge-aware discard identity

**Task ID:** TK-003M
**Spec ID:** S-00I
**Slice:** Prove merge-aware discard identity
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-00I safe lifecycle references and verified-main discard
**Planned verification:** Tests-first red at bd218db, focused test-spec-workbench and strongest negative probes, followed by parent-coordinated immutable aggregate verification and fresh assembled review

**Proof:** Exact 89c938d82de0d83d16d3c79b26ef4c43ae10927e and digest856d743469b28d149915be28aa2216b156c73eab460811b3ef48c80a6a9771e4 passed all51 from clean immutable source. Independent separate-context implementation/safety review reported PASS with no findings; final assembled metadata review remains separate. Durable continuous T0-T6 and Task/Spec discard tests refuse merge-restored/new incarnations absent from main, both-parent-missing/retained-side-parent variants and merge-only sibling proof, preserving files,index,HEAD,refs. Positive ordinary non-FF import and complete-directory recovery pass with the original single simulated approval.

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

TK-003L implementation was verified at 2254cb0 before this runtime edit.
The corrected exact 89c938d implementation now passes full51 and independent
implementation/safety review; final assembled closeout review remains pending.

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00i-tk003l-directory-links | 89c938d82de0d83d16d3c79b26ef4c43ae10927e | none | 3 | Exact 89c938d82de0d83d16d3c79b26ef4c43ae10927e and digest856d743469b28d149915be28aa2216b156c73eab460811b3ef48c80a6a9771e4 passed all51 from clean immutable source. Independent separate-context implementation/safety review reported PASS with no findings; final assembled metadata review remains separate. Durable continuous T0-T6 and Task/Spec discard tests refuse merge-restored/new incarnations absent from main, both-parent-missing/retained-side-parent variants and merge-only sibling proof, preserving files,index,HEAD,refs. Positive ordinary non-FF import and complete-directory recovery pass with the original single simulated approval. | Owning Spec, TK-003M evidence and coordinated independent-review summary reconciled in administrative closeout; all prior FAIL/proof rows preserved. | Final frozen metadata-only full51, independent assembled review and integration delivery pending; owner approval and main promotion absent. Git state at close: dirty-tree (3 files: workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md, workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-003L/TASK.md, workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-01V/TASK.md); recorded reason: Earlier Task closeout metadata in this same bounded administrative batch is uncommitted; runtime and tests remain exact reviewed89c. Commit, frozen full51 and guarded draft publication follow this batch. | 9ee082e61abd31f78603ecc3f0a56befef394e3476fd22fa172b6c23cc4c36ab |

## Administrative Closeout — 2026-09-30

Closed through the repository tool using exact
`89c938d82de0d83d16d3c79b26ef4c43ae10927e` full51 and the supplied independent
implementation/safety PASS at S-00I digest
`856d743469b28d149915be28aa2216b156c73eab460811b3ef48c80a6a9771e4`.
The tool's Receipt records actual Git state; later closes explicitly name
uncommitted earlier administrative metadata. Prior failed proof, review
receipts and checksums remain preserved. This resolves the Task's earlier
pending implementation proof, not the Spec's final assembled review or
integration/owner gates. No runtime or test byte changed in this closeout.

## Retained Proof Header At Reviewed Implementation — 2026-09-30

The repository close tool replaced the current Proof field. Its previous
implementation-checkpoint proof remains preserved here:

Red at 2254cb0: F4 Task merge-restored incarnation is wrongly discarded after continuous T0-T5 with one approval. Green on code-identical 1b6854c/e53f1e3: full test-spec-workbench exits 0, continuous T0-T6 8.94 seconds, both Task/Spec merge-parent variants and novel directory proof refuse without writes; ordinary non-FF imports and complete-directory recovery pass. Original independent merge/continuous probes now pass their intended refusal/recovery checks; test-spec-report passes unchanged. Final aggregate, fresh assembled review and delivery pending.
