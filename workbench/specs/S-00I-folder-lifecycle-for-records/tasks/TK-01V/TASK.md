# TK-01V - Demonstrate the continuous closure-capture lifecycle in one disposable Git room

**Task ID:** TK-01V
**Spec ID:** S-00I
**Slice:** Demonstrate the continuous closure-capture lifecycle in one disposable Git room
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-01U
**Destination:** spec-acceptance: S-00I closed-Spec durable reconciliation, retirement and verified-main discard, proven across steps T0 to T6 of the S-00J closure-capture transition contract without rewriting prior completed proof
**Planned verification:** Red: a new continuous fixture in `tools/test-spec-workbench.mjs` fails at the first transition its committed dependencies do not yet support (or, if every producer is present, an adversarial omission fails its assertion). Green: one disposable room passes T0 reviewed delivery, T1 fixture owner approval, T2 fixture main verification, T3 `complete`, T4 features capture, T5 retirement and T6 discard with whole-directory recovery, each consuming the previous step's persisted output through honest fixture Git commits, merges, pushes and fetches, with named no-write refusals at each gate and preserved S-00T regressions.

## Outcome

One disposable room demonstrates the supported sequence of the S-00J
[closure-capture transition contract](../../../S-00J-spec-qa-gate-at-integration/SPEC.md)
(section "Closure-capture transition contract - 2026-09-26"), in its order:

`T0 reviewed delivery -> T1 owner approval -> T2 main verification -> T3 complete -> T4 features capture -> T5 retirement -> T6 discard -> whole-directory Git recovery`

Every transition consumes the preceding transition's actual persisted output.
Do not inject a completed, approved, retired or discarded starting state to
conceal a missing transition, retarget refs to bypass a gate, or create a
second approval to repair lifecycle digest invalidation. Normal fixture Git
commits, merges, a local bare remote, push and fetch establish containment.
The existing `integratedFixtureCandidate` helper retargets refs directly; it
suits older isolated regressions but is not evidence for this sequence.

The feature article explains what the fixture capability does, why it
matters, its limits and its named evidence; it transforms surviving claims
rather than copying Task state or Spec prose. Schema validity alone is
insufficient.

Only disposable fixtures receive review or approval rows, branch changes,
retirement or deletion. The fixture owner is simulated, and its receipt is
fixture machinery proof. It is not Kayden's Human QA, S-00I approval, actual
main promotion, release evidence, or permission to dispose of real records.

## Prerequisites And Serialization

- Blocked on [TK-01U](../TK-01U/TASK.md), which supplies the `features`
  collection, article type and schema, Wiki route, template and retirement
  and Task-discard eligibility. Never relabel a feature article as an
  existing type to pass.
- Consumes S-00J TK-01S (T2 main verification and the T3 `complete` gate).
  TK-01U is released only after TK-01S is done on integration, so this Task's
  red is recorded on a tree that already holds it; merge the committed
  predecessor work before recording red. T0 uses the existing `gate` and
  bound review verdict; S-00J TK-01T's `S-###:delivered` token consumes T0
  and is not a prerequisite of this fixture.
- S-01T supplies or confirms its feature-reference needs; use the accepted
  link format and check it across moves. This Task decides no provenance
  identity policy and implements no Tracker consumer.
- Lane H serializes edits to `tools/test-spec-workbench.mjs`. If a required
  runtime transition is absent, stop at its named failing seam and return the
  bounded gap to the Dispatcher; do not broaden into runtime, manifest,
  schema or control changes or invent another Task.

## Composed Fixture Sequence

1. **Baseline.** Pin the clean committed dependency candidate; capture source
   identity, room refs and baseline output. Add the fixture first and run
   `node tools/test-spec-workbench.mjs`; preserve the actual failure. If it
   already passes, report that honestly and show an adversarial omission or
   mutation failing its assertion.
2. **Room.** Create a real disposable Git room with a local bare remote and
   the declared integration and default branches. Add one fixture Spec with
   record-backed Task proof, a small demonstrated capability and a
   features-article destination.
3. **T0 reviewed delivery.** Assemble the Spec report, record a bound PASS
   review on the immutable candidate, merge that candidate into fixture
   integration and push. The Spec stays `active`. A mismatched or uncommitted
   candidate, or a failed verdict, does not reach T0.
4. **T1 owner approval.** Record the simulated owner's content-bound approval
   against the persisted integration identity and digests at an explicit
   selected scope. A QA finding does not authorize anything.
5. **T2 main verification.** Merge integration into the fixture default
   branch, push, fetch, and prove the approved candidate is an ancestor of the
   refreshed default-branch ref with an equal committed digest; a local branch
   name alone is not proof.
6. **T3 `complete`.** Run the `complete` gate. It refuses without T0, T1 or
   T2, writing nothing; on success its evidence row records the observed main
   ref and SHA and the approved candidate and digest. The approved substantive
   digest stays valid through administrative completion and retirement (F3);
   a substantive Task or Spec proof mutation still invalidates the binding.
7. **T4 features capture.** Author the feature article through the delivered
   route. Collection, type, router, template, implemented claim and evidence
   agree. Before capture, retirement and `discard --task` refuse with no
   mutation and doctor reports the Spec as complete and uncaptured; a missing,
   unrouted or invalid article leaves the Spec `complete`.
8. **T5 retirement.** Retire through `retireSpec` with the feature owner.
   Task records, including a missed attempt, remain until this step. Scan all
   supported reference consumers after the move and after a fresh clone;
   ordinary selection no longer presents the Spec while its historical route
   stays reachable.
9. **T6 final Task discard.** Discard the final retired Task through the
   gate, commit, push, clone afresh and verify tracked `tasks/.gitkeep` keeps
   record-backed interpretation; render, doctor and selection neither fall
   back to retained legacy slices nor throw (F7). The printed recovery command
   restores the whole Task directory, sibling proof and assets included, in a
   separate recovery clone.
10. **T6 Spec discard.** Discard the retired Spec only with recorded T2 proof,
    latest-incarnation and full-directory main containment, an active feature
    owner and a clean current reference scan. Include the F4 remove/re-add
    and newer sibling-proof refusal probes with no-write assertions, and the
    F5 owner operational-link refusal; only historical evidence citations
    convert to immutable Git identity. `archive` bytes stay unchanged.
11. **Fresh-clone recovery.** Commit the disposal and clone afresh: no live
    broken Wiki or other current pointer, no selection blocker manufactured by
    disposal, correct roster and catalog, retained feature explanation. Run
    the returned recovery command verbatim in a separate clone and compare the
    whole restored Spec directory recursively, Tasks, proof and assets
    included; checking only `SPEC.md` is insufficient.
12. **S-00T interactions.** Unfinished retired-owner corrective work prevents
    discard even with a stale board; a correction is visible, selectable,
    claimable and closable without resurrecting the historical Spec; repeated
    orphan findings create no duplicate Task; post-discard correction targets
    the durable claim; IDs stay reserved across active, retired, corrective,
    discarded and remote-visible records. Reuse the existing regressions and
    add only the continuous interaction assertions needed here.

## Existing Seams To Reuse

- `tools/test-spec-workbench.mjs`: `initGitRoot`, `headSha`, the existing
  retirement-ready fixtures and article setup, the `S-580` Spec-discard,
  `S-592` final-Task discard and fresh-clone, and `S-591` retired-corrective
  cases, and the orphan corrective and identity-reservation cases.
- `workbench/tools/spec-report.mjs`: `assembleSpecReport`,
  `recordReviewVerdict`, `recordOwnerApproval`, `createCorrectiveTasks`.
- `workbench/tools/spec-workbench.mjs`: `gate`, `completeSpec`, `retireSpec`,
  `moveTaskRecord`, `discardRetiredSpec`, `discardRetiredTask`,
  `scanReferences`, `referencesToPath`, `loadSpecs`, `loadRetiredSpecs`,
  `findSpec`, `nextWork`, `showSpec`, `claimWork`, `closeTask`, `render`,
  `doctor`.
- `tools/test-wiki.mjs`, `tools/test-workbench-layout.mjs`,
  `tools/test-spec-report.mjs` and `tools/test-check-append-only.py` keep
  their existing responsibilities; copied-task-state validation and
  append-only criteria are not weakened.

## Released Write Lane

- `tools/test-spec-workbench.mjs` only: one continuous disposable fixture
  plus focused refusal assertions at the existing entry point, with no new
  public runtime API or test framework.

Feature articles, manifest declarations, routers, runtime copies, records,
discard registers, remotes and recovery output exist only inside disposable
rooms. The Dispatcher maintains this Task and the S-00I SPEC.

## Verification And Limits

Run the targeted test after the fixture change, then every current
`AGENTS.md` verification command on the committed candidate, with read-only
S-00K pre/post self-drift receipts and the bounded semantic check; keep
pre-existing attention findings explicit. The single-command test plus its
transition receipt is the demo artifact; report its measured runtime if it
exceeds one minute. A separate-context review of the assembled candidate
follows and is not replaced by fixture review rows.

Known limitation carried from S-00T: unexpected I/O after a successful removal
is reported, but lifecycle mutation is not transactional. On any injected
failure show the staged state and recovery identity and keep the separate
clone for recovery; do not claim crash safety or atomic disposal.
