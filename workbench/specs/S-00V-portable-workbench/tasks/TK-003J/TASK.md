# TK-003J - Distinguish empty Git sentinels during optional skill setup

**Task ID:** TK-003J
**Spec ID:** S-00V
**Slice:** Distinguish empty Git sentinels during optional skill setup
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: One real cloud session lands a Task from GitHub alone, with its setup behavior verified rather than assumed.
**Planned verification:** Red/green CLI regressions for an empty ancestor .git directory, genuine repository ownership beyond an empty marker, and malformed Git metadata; full installer suite and affected composition/layout/adoption/diagnostics checks; pre/post self-drift and guardrail audit.
**Proof:** Exact remote candidate 5d2b6469eb308a90bb07b8ebd46563c3c290fc83 verified in saved cloud: all 51 RUNBOOK commands exit 0; independent code/safety review PASS without findings; exact tree 7d3b6ed0a086f70901f989c8a4b53285e29bdbc3; 29 installer tests pass plus 2 existing platform skips and 3 extra probes. Local identical-tree 2900351 also passes full51 and exact remote reviewer 10 focused cases.

## Scope And Local Assignment

Vespar's Director coordination assigned this bounded S-00V maintenance
regression on 2026-09-30 during the owner-authorized cloud portability setup.
This does not reopen completed S-051 or change the room-owned skills design.
The optional personal-catalog installer must identify real Git ownership,
leave protective empty directories unchanged, and preserve fail-closed
behavior for malformed Git metadata and unsafe exclusions.

The local writer is the cloud-skill-git-detection worker on
`codex/cloud-skill-git-detection`, based on
`2f5b13b0a20d6a278310cf1b709d1fcd31274a11`. `next-id` proposed TK-003J;
the fetched remote inventory had no active file claim for this change.
Two old S-045 branches contain historical installer changes; S-045 is complete.
This record began as a local reservation only. The original implementation-worker
assignment prohibited commits, pushes and PRs; the claim command could not
select this exact new Task without
selecting an older pending S-00V Task, and its ordinary route would push.
At that initial stage, no remote claim or completed delivery was asserted.

## Boundaries And Recovery

Edit only `tools/core-skill-installer.mjs`, its regression tests, this Task,
the S-00V evidence/routing owner and generated projection in this isolated
worktree. Preserve real host metadata, source/room receipts and version labels.
No credential, external publication, release or Template upgrade is authorized.
Recovery is the unchanged base commit and a bounded local diff.

## Current Result

Baseline reproduced: an empty read-only ancestor `.git` directory is treated
as a repository by `gitOwner`; exclusion planning fails before writes when
Git cannot resolve that purported owner. A valid Git-owned fixture home
supports missing-only setup without touching the empty ancestor marker.
Independent review, full verification and delivery remain pending.

## Local Verification

The defect-targeted test-only change failed as expected: empty ancestor
sentinel setup was blocked, and a nested empty marker misidentified the
actual outer owner. The malformed-metadata case already passed.
After the bounded source fix, all four focused cases pass: empty sentinel
install/update/rollback preserves its bytes and mode; a nested sentinel
preserves real ownership; malformed gitfiles, nonempty directories and linked
directories fail closed with and without an outer repository; a valid linked
worktree remains Git-owned and refuses backup-producing home maintenance.

On the final local source candidate, all five affected commands exit 0 using
process-only `init.defaultBranch=main`:

- `tools/test-core-composition.mjs`: 2 passed, 0 failed
- `tools/test-core-skill-installer.mjs`: 31 total, 29 passed, 2 existing
  case-insensitive-filesystem skips, 0 failed
- `tools/test-workbench-layout.mjs`: 72 passed, 0 failed
- `tools/test-workbench-adoption.mjs`: all 4 reported scenario groups pass
- `tools/test-diagnostics.mjs`: 36 passed, 0 failed

Syntax and whitespace checks pass. Guardrail remains 78/100; its missing
repeated real outcome/control/recency/uncertainty evidence is unchanged.
Pre/post self-drift retains the pre-existing S-00Q stale claim and historical
seed/provenance findings. During pre-commit verification, the uncommitted
Task added an explicit untracked-control finding; that observation is historical
and did not establish a clean-update or full-suite pass.

Docs checked; no public procedure/template update needed: the existing
missing-only/explicit-update contracts and root safety boundaries are unchanged.
Code comments own the corrected Git recognition detail. The only production
implementation is `tools/core-skill-installer.mjs`; no mirror is omitted.
At the implementation checkpoint this Task was not closed; no owner approval
was recorded.

## Dispatcher Checkpoint — 2026-09-30

The Dispatcher created local immutable checkpoint
`886ab1bb87e570338943e164f879990aa033e495` with an explicit assistant author
identity for verification and separate-context review. This was a local Git
commit only; no remote claim, push or PR was made.

All 51 RUNBOOK verification commands passed on that checkpoint with
process-scoped `init.defaultBranch=main`. The independent reviewer passed
the bounded implementation and safety review, independently reproducing
10 focused tests. Review found only the two current-documentation statements
corrected above; the resulting documentation-only candidate requires its
own review. The five affected-suite results above remain supporting evidence.

Guardrail outcome-evidence limits, case-insensitive-platform skips and the
pre-existing S-00Q clean-update blocker remain. Local verification is not
remote integration delivery, native-provider proof, release readiness or
owner approval. At that checkpoint, required delivery remained open.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/cloud-skill-closeout | 5d2b6469eb308a90bb07b8ebd46563c3c290fc83 | ahead 0 behind 0 | 0 | Exact remote candidate 5d2b6469eb308a90bb07b8ebd46563c3c290fc83 verified in saved cloud: all 51 RUNBOOK commands exit 0; independent code/safety review PASS without findings; exact tree 7d3b6ed0a086f70901f989c8a4b53285e29bdbc3; 29 installer tests pass plus 2 existing platform skips and 3 extra probes. Local identical-tree 2900351 also passes full51 and exact remote reviewer 10 focused cases. | TK-003J owns portability fix and truthful local/remote verification; no product/template contract changed | Final docs-only closeout verification, exact-head review and integration delivery still pending; no native-provider, main, clean-update or owner Human QA claim | a73116de98fa54feeb819ef5e7036dc18d5a0d31a9959791270a30f4c9ed5c06 |

## Reviewed Remote Closeout — 2026-09-30

PR #225 published the identical reviewed tree at remote candidate
`5d2b6469eb308a90bb07b8ebd46563c3c290fc83`. An independent saved-cloud
checkout verified that exact commit and tree, passed all 51 RUNBOOK commands
with process-only `init.defaultBranch=main`, and found no code/safety issue.
The installer ran 29 passing tests with two existing platform skips, plus
three additional independent safety probes. Separate local review of the
exact remote candidate also passed, with 10 focused cases.

The repository close command records the scoped Task as done with this proof.
At that checkpoint, the final documentation-only closeout still required
immutable review and integration containment; it does not complete S-00V, approve owner Human QA,
change main, publish a release or clear the S-00Q self-drift blocker.

## Verified Integration Delivery — 2026-09-30

PR #225 merged as `54146bf6bf90310b750ee69c3075bc30c67ff09d`.
A fresh fetch proved reviewed final head
`fb62f9d216cc611ccf7b40254dfa4bd1f908bf2a` is contained in
`origin/integration`; its exact final SHA passed all 51 commands in the
independent saved-cloud verifier and fresh exact-head review. Main was not
modified. This delivers TK-003J while S-00V and its remaining gates stay open.
