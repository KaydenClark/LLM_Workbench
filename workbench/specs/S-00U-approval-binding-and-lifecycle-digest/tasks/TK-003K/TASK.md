# TK-003K - Preserve the original approval across verified Spec retirement

**Task ID:** TK-003K
**Spec ID:** S-00U
**Slice:** Preserve the original approval across verified Spec retirement
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Review and approval survive administrative completion; substantive acceptance, proof and retired Task changes invalidate the digest.
**Planned verification:** Preserve S-00I TK-01V's red T5/F3 assertion on 2f5b13b; verify the same candidate and unchanged digest remain approved after the staged retirement, committed retirement, and fresh clone. Altered Spec and Task substance, unrelated candidates, unproven moves, and removed/re-added path incarnations must not acquire the original approval. Run focused report and lifecycle suites; the Dispatcher coordinates the full suite and immutable review.
**Proof:** Exact remote a929fb7e8a79b0d0205c8e7bbc5ef47516e2b346, tree46b2b761413d7272e1b028e0b9413ae18775c4bb: independent saved-cloud all 51 commands PASS, no code/safety blockers, six additional resolver probes PASS; source/destination and merge-created incarnations, changed substance and unrelated candidates refused. Independent exact-SHA local review PASS; identical-tree b374 also full51 PASS.

## Dispatcher Disposition

On 2026-09-30 the v4 continuation Dispatcher assigned this bounded corrective
under S-00U, which owns approval binding and completion-to-retirement digest
repair. The failure was discovered by S-00I TK-01V's continuous lifecycle
fixture: after retirement the digest stays equal but the original candidate
is read at its new path, so the original approval disappears. TK-01V retains
its failing regression and its test-only write boundary; this Task separately
authorizes the minimal runtime correction and adversarial regression coverage.

The local next-id proposal was TK-003J, already reserved by the concurrently
assigned portability worker in its isolated worktree. The Dispatcher serialized
the next reservation as TK-003K; the local and remote-visible inventory had no
such identity before this record was written. S-00U's completed legacy slice
table is retained unchanged; there was no unfinished row to convert.

## Boundary And Delivery

Only approval source resolution in workbench/tools/spec-report.mjs and focused
tests are in scope. Resolve historical content through verified lifecycle move
provenance and the current incarnation. Keep the existing digest normalization,
approval candidate, validation gates and safety boundaries. Do not infer a move
from a matching ID or digest. Do not manufacture another approval or real Human
QA. No active-branch commit, push, Task closure, Spec closure or production
lifecycle operation is authorized by this assignment. The Dispatcher separately
authorized ephemeral local proof-clone commits with an explicit assistant
fixture identity, so source-identity validation stays intact. The Dispatcher
maintains the shared board.

## Evidence

Baseline: 2f5b13b0a20d6a278310cf1b709d1fcd31274a11. The Dispatcher retained
the TK-01V red output. Pre-change guardrail score is 78/100; the self-drift
machine result is blocked by the existing stale claim, seeded-file versions
and manifest provenance findings. These are not fixed or reclassified here.

## Local Candidate Result

The source/test candidate is frozen at ephemeral local commit
`66b2e37b84ed96e5e5858939be896dfe59e01249` for verification. At that pre-checkpoint stage, the active
v4 checkout was uncommitted. The original TK-01V red is preserved;
`test-spec-workbench` passes 55 blocks and `test-spec-report` passes.
The continuous T0-T6 demonstration reaches post-discard correction in 7.21
seconds, using exactly one simulated owner approval in its main sequence.

Separate-context review of initial proof `d59a6ba` found that simplified Git
history hid merge-created incarnations. Red `68542d4` preserves that finding.
The corrected resolver reads full per-parent history, distinguishes ordinary
merge imports from path creation, and rejects deletions along the candidate's
surviving ancestry. Tests cover unchanged staged/committed/fresh-clone
retirement, altered Spec and retired Task substance, unrelated candidates,
linear source/destination re-adds, both-parent merge re-adds, side-copy merge
restores, unproven unstaged moves, and legitimate pre-integration feature and
main-retirement merges. No normalization or identity was weakened.

No root or generic template contract changed; this restores the already
documented behavior. Guardrail stays 78/100. Self-drift still reports existing
stale-claim, stale-seed and provenance gaps, plus the untracked local Task
at that pre-checkpoint stage. At that source-proof checkpoint, full combined verification, fresh review and
delivery remained pending; focused proof alone did not permit closure.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/cloud-v4-portability | 2f5b13b0a20d6a278310cf1b709d1fcd31274a11 | ahead 0 behind 0 | 7 | Ephemeral 66b2e37: test-spec-workbench 55 blocks PASS; test-spec-report PASS; reviewer merge-incarnation probe PASS; original T5/F3 and merge-readd reds retained | S-00U Spec and TK-003K; documented contract unchanged | Combined full suite, fresh immutable review and delivery pending; local-only candidate, no owner Human QA or closure | fed2278816fb886d77606d9412fa2f96e6887b113bea6d693c11571bbcf2cd30 |
| 2 | codex/cloud-lifecycle-closeout | a929fb7e8a79b0d0205c8e7bbc5ef47516e2b346 | ahead 0 behind 0 | 0 | Exact remote a929fb7e8a79b0d0205c8e7bbc5ef47516e2b346, tree46b2b761413d7272e1b028e0b9413ae18775c4bb: independent saved-cloud all 51 commands PASS, no code/safety blockers, six additional resolver probes PASS; source/destination and merge-created incarnations, changed substance and unrelated candidates refused. Independent exact-SHA local review PASS; identical-tree b374 also full51 PASS. | S-00U TK-003K documents corrective provenance; unchanged approval identity/digest contract; no Spec owner approval | Final docs-only closeout, exact-head verification/review and integration delivery remain pending; no S-00U completion, real Human QA, main or release claim | c7a7121f3981fe1a474fbbbbdc79d5c5cebc7f4a0dc035b7f860faa721e6dc7c |

## Remote Verification And Task Closeout — 2026-09-30

Exact remote candidate `a929fb7e8a79b0d0205c8e7bbc5ef47516e2b346`
passed all 51 documented commands, independent safety review without blockers
and six additional resolver probes in a separate saved-cloud checkout.
Separate local exact-SHA review also passed; the identical-tree local
candidate passed the full suite. These supersede the earlier pending
verification state without rewriting historical receipts or failed reviews.

The repository close command marked TK-003K done from a clean remote-contained
checkout. This documentation-only closeout still needs immutable review and
integration delivery. S-00U remains active; no Spec owner approval, real
Human QA, main promotion, clean-update or release claim is made.
