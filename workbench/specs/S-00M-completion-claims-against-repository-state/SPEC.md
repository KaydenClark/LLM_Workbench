# S-00M - Completion Claims Against Repository State

**Spec ID:** S-00M
**Status:** active
**Priority:** 2
**Owner:** claude-lane-D
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Make a completion claim unable to hide uncommitted or unpushed work, by surfacing Git state in `doctor` and refusing `close` unless the Receipt records the state and a reason.
**Blockers:** TK-004 waits on S-00P TK-002 landing to avoid a concurrent AGENTS rewrite collision.
**Latest event:** TK-003 closed with proof.
**Next gate:** Claim TK-004 once S-00P TK-002 (the `AGENTS.md` rewrite) is contained in `origin/integration`, and write TK-004 against the new text.

> **Citation anchors.** pre=`87c1d45cd6c32ceea12e05590eae966c0d6d4ecf` post=`6154167f48a4ed2474713d043a9cac18833d6a2a`.

## Outcome

A run cannot report a slice as done while its work sits uncommitted or
unpushed. Two mechanisms do two different jobs: `doctor` surfaces Git state
that no diagnostic currently observes, and `close` refuses a claim the
repository contradicts unless the Receipt records that state and says why.

## Why It Matters

`close` writes "closed with proof" after reading two strings. It reads no
repository state at all, so a slice can be closed as done, with proof, on a
dirty unpushed tree, and nothing observes it. The diagnostic registry cannot
catch it either: nothing it registers observes HEAD, the working tree,
untracked files or upstream distance.

The failure is not hypothetical. The session that settled this decision was
itself detached with 39 porcelain entries, thirteen of them untracked ADRs and
Specs under the controls and spec lanes, and no control named it. A completion
report written from that state would have been accepted by every check the
Workbench has.

## Current Verified State

At the pre anchor, `workbench/tools/diagnostics.mjs` declares `git` in `SCOPES`
and registers two findings against it, `integration-branch-undeclared` and
`integration-branch-missing`. Both check the declared integration branch. No
finding observes HEAD, the working tree, untracked files or upstream distance,
so the state this Spec surfaces is unobserved even though the scope is not
empty.

`workbench/tools/spec-workbench.mjs` `closeTicket` (renamed `closeTask` by S-00H TK-003 after this anchor) requires `--proof`,
`--docs` and `--remaining-gap`, sets the latest event to "closed with proof",
and appends an evidence row. It parses files; it never shells out to Git and
never reads repository state.

## Desired Behavior

An agent runs `doctor` and sees, without being blocked, that HEAD is detached
or that untracked files sit under the controls, ADR or spec lanes. An agent
runs `close` on a dirty or unpushed branch and is refused, with the refusal
naming what it found. The same agent, having recorded that state and its
reason in the Receipt, closes successfully, and the reason survives in the
Receipt where a reviewer reads it rather than being consumed by the check.

A detached HEAD never blocks `doctor` at effect `all`. Detached is a
legitimate inspection state — the session that decided this was in one — and
blocking there would disable the tool in the situation that most needs it.

## Decisions And Contracts

- The two mechanisms, their severities and the recorded-reason escape hatch:
  [ADR-000J](../../docs/adr/000J-completion-claims-are-checked-against-repository-state.md).
- The Receipt this writes into, its per-run rows and its `upstream distance`
  field:
  [ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
  delivered by
  [S-00H](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md).
- Registered blocking semantics, which the new findings must declare rather
  than invent:
  [ADR-0029](../../docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md).
- A check may block only the change it evaluates:
  [ADR-0020](../../docs/adr/0020-a-check-blocks-only-the-change-it-evaluates.md).

## Non-Goals

- **Blocking `doctor` on Git state.** Every finding here is `attention` with
  blocking effect `none`, by ADR-000J's explicit rejection of the alternative.
- **Closing the escape hatch.** A recorded state and reason permits the close.
  ADR-000J accepts that this is also the hole a future agent can route around,
  and answers it by preserving the reason for a reader, not by removing it.
- Any change to what `proof`, `docs` or `remaining-gap` mean.
- Rewriting historical evidence rows to add Git state they never carried.

## Dependencies And Blockers

None blocking. ADR-000J routes `upstream distance` into the Receipt, but the
criterion that checks it belongs to
[S-00H](../retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) TK-006, which
owns the Receipt's fields — this Spec's TK-001 makes the value readable and
claims nothing further about it. Neither Spec waits on the other.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Read repository state at a stable seam | done | none | Red at d6545ca+tests: node --test --test-name-pattern=readRepositoryState tools/test-diagnostics.mjs failed with SyntaxError: workbench-layout.mjs does not provide an export named readRepositoryState. Green at 97bb945: same command, 3/3 pass (branch/dirty/untracked-lane/upstream ahead 1 behind 1 against a manifest-declared spec lane; detached HEAD, no upstream as null, gone upstream; unknown for non-repo, missing dir, undefined root, absent Git via options.git and via empty PATH, unreadable manifest). node tools/test-diagnostics.mjs 27/27. Full AGENTS.md suite at 97bb945: pass=48 fail=0. |
| TK-002 | Register and surface the git-state findings | done | none | Red at c261c96+tests: node --test with a --test-name-pattern selecting the three new S-00M tests and the two pin tests in tools/test-diagnostics.mjs failed 4 of 5: Error: Unregistered diagnostic code: detached-head; the long list is still reported; detached-head must stay registered; PINNED_EFFECTS must equal the registry exactly (the unknown-state guard passed, as it asserts absence). Green at f6e1f58: same command 5/5; node tools/test-diagnostics.mjs 30/30; node tools/test-workbench-layout.mjs 70/70. Exit-code and next proof: on one committed fixture, detaching HEAD and adding untracked RUNBOOK.md, workbench/docs/adr/draft-notes.txt and workbench/specs/S-001-first/notes.md makes doctor report exactly detached-head and untracked-controls (attention, git, none) while the CLI doctor exit code equals the clean run (0) and next --json stdout is byte-identical. Unknown state (not a repository; Git absent from PATH) yields neither finding, no throw and the same exit code; chosen behavior is no output, since integration-branch-missing already names the not-a-repository case. Adapted expectations: tools/test-diagnostics.mjs now sets aside only untracked-controls for tests of other findings (fixtures never commit controls/specs) and reads the whole report in the byte-compare test; tools/test-workbench-layout.mjs expects exactly untracked-controls in four uncommitted-room assertions. Full AGENTS.md suite at f6e1f58: pass=48 fail=0. |
| TK-003 | Refuse `close` on a dirty or unpushed branch unless the Receipt records it | done | none | Git-state refusal (2baae9a): red at efb7227+tests: node --test --test-name-pattern=readRepositoryState tools/test-diagnostics.mjs failed 3/4 (untrackedOther undefined); node tools/test-spec-workbench.mjs failed (1) dirty tree: Missing expected exception, close proceeded; (2) clean unpushed branch: Missing expected exception, close proceeded; (3) --git-state-reason on dirty+unpushed: refused anyway (close refused: dirty-tree (1 file: scratch.txt) and unpushed (ahead 1 behind 0 of origin/main)); (4) clean+reason guard proven by mutation (removing the throw fails the test with Missing expected exception). Green: reader 4/4; close refuses naming dirty-tree/unpushed with files and upstream distance (or no upstream, detached HEAD, no remote) and writes nothing; with a reason the state and reason are read back from the Receipt row (readReceiptFromFile, checksum chain valid) and the Spec evidence row; clean+pushed closes unchanged; clean+reason refused; unknown state (not a repository) closes unchanged. Ready-task refusal (cd9ebdc): red: close on a Spec whose only open Task was ready closed the unclaimed TK-001 as done (reproduced via CLI: TK-001 done, Latest event TK-001 closed with proof); green: refuses with S-### has no in-progress task to close; claim one first, Spec and record byte-identical. node tools/test-spec-workbench.mjs, test-diagnostics, test-workbench-round-trip, test-visible-id-consumers, test-spec-report pass; 2baae9a spec-workbench and diagnostics tests pass in isolation. Full AGENTS.md suite at cd9ebdc: pass=48 fail=0. Dogfood: this close ran clean and pushed at cd9ebdc with no --git-state-reason and was not refused. |
| TK-004 | Document both mechanisms in their control owners | deferred | S-00P TK-002 landing (the `AGENTS.md` rewrite) | `AGENTS.md` and `RUNBOOK.md` updated; `tools/test-control-fidelity.mjs` and the full suite pass |

### TK-001 - Read repository state at a stable seam

**Stance:** Builder

One function, one seam, no callers yet. It reports whether HEAD is detached,
which files are dirty, which untracked files sit under the controls, ADR and
spec lanes, and the branch's distance from its upstream. Write the failing
test against a fixture repository first.

A host without Git, or a directory that is not a repository, is a state this
reader reports as unknown. It must not throw: every later caller runs inside
`doctor` or `close`, and a reader that throws converts a missing tool into a
broken command.

### TK-002 - Register and surface the git-state findings

**Stance:** Builder

`detached-head` and `untracked-controls` join the registry in the `git` scope
at severity `attention` with blocking effect `none`. ADR-0029 requires the
registered semantics to be declared, and ADR-000J requires these two to stay
non-blocking, so the test asserts the registration itself and not only the
message. Prove that `doctor`'s exit code and `next`'s selection are unchanged
by their presence.

### TK-003 - Refuse `close` on a dirty or unpushed branch unless the Receipt records it

**Stance:** Builder

This is the slice that does the work ADR-000J exists for: an `attention`
finding stays visible without blocking by its own registered definition, so
visibility alone cannot stop a false completion report. The false claim is
made at `close`.

`closeTask` gains a dependency on repository state it has never had, moving
from pure file parsing to reading Git. Keep the reading inside TK-001's seam
so the parsing path stays testable without a repository.

The recorded reason must be present in the written record after a permitted
close. A check that consumes the reason to decide and then discards it leaves
a reviewer with a green close and no way to see what was waived.

### TK-004 - Document both mechanisms in their control owners

**Stance:** Builder

`AGENTS.md` gains the rule at its completion obligations; `RUNBOOK.md` gains
the new diagnostic codes, the refusal and its remediation. Do not document a
command or a code before the slice that implements it has landed.

## Acceptance Criteria

- [x] `doctor` reports a detached HEAD and untracked files under the controls,
      ADR and spec lanes.
- [x] Both findings are registered `attention` with blocking effect `none`, and
      neither changes `doctor`'s exit code or `next`'s selection, proven by a
      test that failed before the change.
- [x] `close` refuses on a dirty tree, proven by a test that failed before the
      change.
- [x] `close` refuses on an unpushed branch, proven by a test that failed
      before the change.
- [x] `close` succeeds when the Receipt records the state and a reason, and the
      reason text is readable in the record afterward.
- [x] The state reader reports unknown rather than throwing where Git is
      unavailable.
- [ ] `AGENTS.md` and `RUNBOOK.md` describe both mechanisms.
- [ ] The full verification suite passes and `doctor` carries no blocking
      finding.

## Testing Seams

The repository-state reader from TK-001; the `diagnostics.mjs` registry;
`spec-workbench.mjs` `closeTask`; the existing coverage in
`tools/test-diagnostics.mjs` and `tools/test-spec-workbench.mjs`.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

`AGENTS.md` and `RUNBOOK.md` at TK-004. ADR-000J's `canonicalized_in` already
names this Spec as of its acceptance.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-15 | 87c1d45 | Spec authored at owner acceptance of ADR-000J, which recorded that no Spec owned its implementation | Read ADR-000J against `workbench/tools/diagnostics.mjs` and `workbench/tools/spec-workbench.mjs` at the pre anchor | Confirmed no registered finding observes HEAD, the working tree, untracked files or upstream distance, and that `closeTicket` reads no repository state; no implementation performed |
| 2026-09-15 | 87c1d45 | ADR-000J's own verification sentence claimed the `git` scope had "no finding currently using it" | Ran `grep -n "'git'" workbench/tools/diagnostics.mjs` at the pre anchor and against `git show c0ac60a:workbench/tools/diagnostics.mjs`, the ADR's own anchor | The claim was false at the anchor it cited: `integration-branch-undeclared` and `integration-branch-missing` both used the scope then and now. The ADR's substantive claim — no finding observes Git working state — holds. Corrected the sentence in ADR-000J at acceptance rather than accepting a false evidence line into Canon |
| 2026-09-15 | 8a32f41 | Separate-context review of the acceptance candidate | Reviewer ran `adr validate`, `doctor`, `next --json`, the append-only check, projection regeneration and seven suite tests against commit `8a32f41`, and challenged the Spec's verified-state claims, slice statuses and next gate | PASS with four should-fix findings. Two applied here: `Next gate` named a `claim` the tooling refuses for a `planned` Spec, and Dependencies stated an `upstream distance` obligation this Spec has no criterion for. Reviewer confirmed the Current Verified State claims about the `git` scope, the 66 registered codes and `closeTicket` are accurate |
| 2026-09-15 | e7beea3 | Fresh review of the corrected candidate returned PASS with no blocking or should-fix finding; it also caught two characterization slips in the row above | Reviewer re-read that row against its own prior report | The `upstream distance` item was recorded there as one of "four should-fix findings"; it was note 7. "Seven suite tests" undercounts: the reviewer ran ten node suites plus the template evaluator and the append-only checker. Both slips err toward over-severity and under-credit, so neither overclaims. The row above is append-only and stands as written; this row is the correction |
| 2026-09-26 | TK-001 | Task closed | Red at d6545ca+tests: node --test --test-name-pattern=readRepositoryState tools/test-diagnostics.mjs failed with SyntaxError: workbench-layout.mjs does not provide an export named readRepositoryState. Green at 97bb945: same command, 3/3 pass (branch/dirty/untracked-lane/upstream ahead 1 behind 1 against a manifest-declared spec lane; detached HEAD, no upstream as null, gone upstream; unknown for non-repo, missing dir, undefined root, absent Git via options.git and via empty PATH, unreadable manifest). node tools/test-diagnostics.mjs 27/27. Full AGENTS.md suite at 97bb945: pass=48 fail=0. | Docs checked; no update needed because the reader has no caller yet and TK-004 owns the AGENTS.md/RUNBOOK.md text; the contract is documented in the comment above readRepositoryState in workbench/tools/workbench-layout.mjs. | No caller until TK-002 (doctor findings) and TK-003 (close refusal); the Receipt's upstream distance field is S-00H TK-006's criterion and is not wired here. |
| 2026-09-26 | 97bb945 | TK-001 closed (restates the `close` row above in this table's five-column schema; that row put the Task ID under Commit and a sixth cell GitHub does not render) | Red at d6545ca+tests: node --test --test-name-pattern=readRepositoryState tools/test-diagnostics.mjs failed with SyntaxError: workbench-layout.mjs does not provide an export named readRepositoryState. Green at 97bb945: same command, 3/3 pass (branch/dirty/untracked-lane/upstream ahead 1 behind 1 against a manifest-declared spec lane; detached HEAD, no upstream as null, gone upstream; unknown for non-repo, missing dir, undefined root, absent Git via options.git and via empty PATH, unreadable manifest). node tools/test-diagnostics.mjs 27/27. Full AGENTS.md suite at 97bb945: pass=48 fail=0. | Docs checked; no update needed because the reader has no caller yet and TK-004 owns the AGENTS.md/RUNBOOK.md text; the contract is documented in the comment above readRepositoryState in workbench/tools/workbench-layout.mjs. Remaining gap: No caller until TK-002 (doctor findings) and TK-003 (close refusal); the Receipt's upstream distance field is S-00H TK-006's criterion and is not wired here. |
| 2026-09-26 | review | Review verdict: pass at cf5f7e11b0a6266c01b59396a907fbb40e466f0e [d652dbeef899] #1 | No blocking or should-fix findings. Note: subdirectory-root handling via --show-prefix is covered only by a manual check; TK-002/TK-003 callers pass the resolved Workbench root. Reviewer could not run fixture tests (sandbox EPERM on mkdtemp); builder suite 48/0 at 5d0ed89 and dispatcher trial merge onto ebb01dc (4fee566) 48/0. | Codex gpt-5.5, codex exec -s read-only, separate context from the builder and dispatcher | 3 |
| 2026-09-26 | TK-002 | Task closed | Red at c261c96+tests: node --test with a --test-name-pattern selecting the three new S-00M tests and the two pin tests in tools/test-diagnostics.mjs failed 4 of 5: Error: Unregistered diagnostic code: detached-head; the long list is still reported; detached-head must stay registered; PINNED_EFFECTS must equal the registry exactly (the unknown-state guard passed, as it asserts absence). Green at f6e1f58: same command 5/5; node tools/test-diagnostics.mjs 30/30; node tools/test-workbench-layout.mjs 70/70. Exit-code and next proof: on one committed fixture, detaching HEAD and adding untracked RUNBOOK.md, workbench/docs/adr/draft-notes.txt and workbench/specs/S-001-first/notes.md makes doctor report exactly detached-head and untracked-controls (attention, git, none) while the CLI doctor exit code equals the clean run (0) and next --json stdout is byte-identical. Unknown state (not a repository; Git absent from PATH) yields neither finding, no throw and the same exit code; chosen behavior is no output, since integration-branch-missing already names the not-a-repository case. Adapted expectations: tools/test-diagnostics.mjs now sets aside only untracked-controls for tests of other findings (fixtures never commit controls/specs) and reads the whole report in the byte-compare test; tools/test-workbench-layout.mjs expects exactly untracked-controls in four uncommitted-room assertions. Full AGENTS.md suite at f6e1f58: pass=48 fail=0. | Docs checked; no update needed: TK-004 documents the codes in AGENTS.md/RUNBOOK.md after this lands; the registry summaries and the comment above repositoryStateFindings in workbench/tools/spec-workbench.mjs carry the contract meanwhile. No check required documenting the codes (test-control-fidelity passed). | RUNBOOK.md needs both codes in its blocking-effect table (none/attention row) - TK-004. The close refusal on a dirty or unpushed branch is TK-003. untracked-controls also reports the spec-lane CATALOG.md and .gitkeep files when uncommitted, which is correct but means a fresh uncommitted Genesis room carries it until its first commit. |
| 2026-09-26 | f6e1f58 | TK-002 closed (restates the close row above in this table's five-column schema) | Red at c261c96+tests: node --test with a --test-name-pattern selecting the three new S-00M tests and the two pin tests in tools/test-diagnostics.mjs failed 4 of 5: Error: Unregistered diagnostic code: detached-head; the long list is still reported; detached-head must stay registered; PINNED_EFFECTS must equal the registry exactly (the unknown-state guard passed, as it asserts absence). Green at f6e1f58: same command 5/5; node tools/test-diagnostics.mjs 30/30; node tools/test-workbench-layout.mjs 70/70. Exit-code and next proof: on one committed fixture, detaching HEAD and adding untracked RUNBOOK.md, workbench/docs/adr/draft-notes.txt and workbench/specs/S-001-first/notes.md makes doctor report exactly detached-head and untracked-controls (attention, git, none) while the CLI doctor exit code equals the clean run (0) and next --json stdout is byte-identical. Unknown state (not a repository; Git absent from PATH) yields neither finding, no throw and the same exit code; chosen behavior is no output, since integration-branch-missing already names the not-a-repository case. Adapted expectations: tools/test-diagnostics.mjs now sets aside only untracked-controls for tests of other findings (fixtures never commit controls/specs) and reads the whole report in the byte-compare test; tools/test-workbench-layout.mjs expects exactly untracked-controls in four uncommitted-room assertions. Full AGENTS.md suite at f6e1f58: pass=48 fail=0. | Docs checked; no update needed: TK-004 documents the codes in AGENTS.md/RUNBOOK.md after this lands; the registry summaries and the comment above repositoryStateFindings in workbench/tools/spec-workbench.mjs carry the contract meanwhile. No check required documenting the codes (test-control-fidelity passed). Remaining gap: RUNBOOK.md needs both codes in its blocking-effect table (none/attention row) - TK-004. The close refusal on a dirty or unpushed branch is TK-003. untracked-controls also reports the spec-lane CATALOG.md and .gitkeep files when uncommitted, which is correct but means a fresh uncommitted Genesis room carries it until its first commit. |
| 2026-09-26 | review | Review verdict: pass at a83bbd3dfe3095c5f518fe6c2ad7e124476a4bae [a4041120a85d] #1 | No blocking or should-fix findings. Notes: adapted legacy tests filter only untracked-controls while the TK-002 tests assert unfiltered doctor codes, registry semantics, CLI exit code and unchanged next --json; reviewer could not run fixture tests (sandbox EPERM on mkdtemp); builder suite 48/0 at a83bbd3. | Codex gpt-5.5, codex exec -s read-only, separate context from the builder and dispatcher | 3 |
| 2026-09-26 | TK-003 | Task closed | Git-state refusal (2baae9a): red at efb7227+tests: node --test --test-name-pattern=readRepositoryState tools/test-diagnostics.mjs failed 3/4 (untrackedOther undefined); node tools/test-spec-workbench.mjs failed (1) dirty tree: Missing expected exception, close proceeded; (2) clean unpushed branch: Missing expected exception, close proceeded; (3) --git-state-reason on dirty+unpushed: refused anyway (close refused: dirty-tree (1 file: scratch.txt) and unpushed (ahead 1 behind 0 of origin/main)); (4) clean+reason guard proven by mutation (removing the throw fails the test with Missing expected exception). Green: reader 4/4; close refuses naming dirty-tree/unpushed with files and upstream distance (or no upstream, detached HEAD, no remote) and writes nothing; with a reason the state and reason are read back from the Receipt row (readReceiptFromFile, checksum chain valid) and the Spec evidence row; clean+pushed closes unchanged; clean+reason refused; unknown state (not a repository) closes unchanged. Ready-task refusal (cd9ebdc): red: close on a Spec whose only open Task was ready closed the unclaimed TK-001 as done (reproduced via CLI: TK-001 done, Latest event TK-001 closed with proof); green: refuses with S-### has no in-progress task to close; claim one first, Spec and record byte-identical. node tools/test-spec-workbench.mjs, test-diagnostics, test-workbench-round-trip, test-visible-id-consumers, test-spec-report pass; 2baae9a spec-workbench and diagnostics tests pass in isolation. Full AGENTS.md suite at cd9ebdc: pass=48 fail=0. Dogfood: this close ran clean and pushed at cd9ebdc with no --git-state-reason and was not refused. | Docs checked; no update needed: TK-004 owns the AGENTS.md/RUNBOOK.md text for the refusal, --git-state-reason and the in-progress requirement; the contracts are documented in the comments above readRepositoryState (workbench/tools/workbench-layout.mjs) and gitStateAtClose/closeTask (workbench/tools/spec-workbench.mjs). | Orphan corrective close path (closeOrphanCorrectiveTask, close TK-###) does not run the git-state check. close contract change: close now refuses when no Task is in progress (refusal only; no new option). Dirty file count in the refusal lists every untracked file while the Receipt Dirty column collapses untracked directories, so counts can differ though both are non-zero together. A reason given in an unknown state is recorded beside unknown (<reason>). AGENTS.md/RUNBOOK.md wording is TK-004. |
| 2026-09-26 | cd9ebdc | TK-003 closed (restates the `close` row above in this table's five-column schema; that row put the Task ID under Commit and a sixth cell GitHub does not render) | Git-state refusal (2baae9a): red at efb7227+tests: node --test --test-name-pattern=readRepositoryState tools/test-diagnostics.mjs failed 3/4 (untrackedOther undefined); node tools/test-spec-workbench.mjs failed (1) dirty tree: Missing expected exception, close proceeded; (2) clean unpushed branch: Missing expected exception, close proceeded; (3) --git-state-reason on dirty+unpushed: refused anyway (close refused: dirty-tree (1 file: scratch.txt) and unpushed (ahead 1 behind 0 of origin/main)); (4) clean+reason guard proven by mutation (removing the throw fails the test with Missing expected exception). Green: reader 4/4; close refuses naming dirty-tree/unpushed with files and upstream distance (or no upstream, detached HEAD, no remote) and writes nothing; with a reason the state and reason are read back from the Receipt row (readReceiptFromFile, checksum chain valid) and the Spec evidence row; clean+pushed closes unchanged; clean+reason refused; unknown state (not a repository) closes unchanged. Ready-task refusal (cd9ebdc): red: close on a Spec whose only open Task was ready closed the unclaimed TK-001 as done (reproduced via CLI: TK-001 done, Latest event TK-001 closed with proof); green: refuses with S-### has no in-progress task to close; claim one first, Spec and record byte-identical. node tools/test-spec-workbench.mjs, test-diagnostics, test-workbench-round-trip, test-visible-id-consumers, test-spec-report pass; 2baae9a spec-workbench and diagnostics tests pass in isolation. Full AGENTS.md suite at cd9ebdc: pass=48 fail=0. Dogfood: this close ran clean and pushed at cd9ebdc with no --git-state-reason and was not refused. | Docs checked; no update needed: TK-004 owns the AGENTS.md/RUNBOOK.md text for the refusal, --git-state-reason and the in-progress requirement; the contracts are documented in the comments above readRepositoryState (workbench/tools/workbench-layout.mjs) and gitStateAtClose/closeTask (workbench/tools/spec-workbench.mjs). Remaining gap: Orphan corrective close path (closeOrphanCorrectiveTask, close TK-###) does not run the git-state check. close contract change: close now refuses when no Task is in progress (refusal only; no new option). Dirty file count in the refusal lists every untracked file while the Receipt Dirty column collapses untracked directories, so counts can differ though both are non-zero together. A reason given in an unknown state is recorded beside unknown (<reason>). AGENTS.md/RUNBOOK.md wording is TK-004. |
| 2026-09-26 | review | Review verdict: pass at eed0be931c3702b7fd88ddde80dc68b7dcc92398 [41918182b126] #3 | No blocking or should-fix findings over c9dccb9..eed0be9. Notes: the refusal runs before every write; the reason is readable in the Receipt and Spec evidence rows; a source comment calls the close dirty count exactly the Receipt Dirty count although the reader uses --untracked-files=all (the count difference is disclosed in the close evidence); orphan close TK-### bypasses the check (recorded gap); TK-004 deferred with free-text hold is tooling-consistent. Reviewer could not run fixture tests (sandbox EPERM); dispatcher suite 48/0 at eed0be9. | Codex gpt-5.5, codex exec -s read-only, separate context from the builder and dispatcher | 6 |
| 2026-09-26 | b4ab9b0 | Drift reconciliation after TK-001 to TK-003 (Lane E, writer for this Spec after Lane D ended): six acceptance lines checked, the TK-004 Blockers cell set to S-00P TK-002 (it said none while the header and Next gate name that hold), and the Completion Result replaced (it still said Not started) | Each checked line cites its proving close row above: detached HEAD and untracked controls/ADR/spec-lane files reported by `doctor`, and both findings `attention`/`none` with unchanged exit code and `next --json`, from the TK-002 row (red at c261c96, green at f6e1f58); dirty-tree refusal, unpushed refusal, and the recorded reason read back from the Receipt and Spec evidence, from the TK-003 row (red at efb7227, green at 2baae9a); unknown rather than throwing where Git is absent, from the TK-001 row (green at 97bb945). Found by the Lane E post-merge drift review of PRs #159, #166 and #170 (Codex gpt-5.5 read-only) | TK-004's documentation line and the final suite-and-doctor line stay unchecked; Docs checked; no update needed: record-only change |

## Completion Result

In progress, not complete. TK-001 (repository-state reader), TK-002 (`detached-head` and `untracked-controls` findings) and TK-003 (`close` refuses a dirty or unpushed tree unless a reason is recorded, and refuses a Spec with no in-progress Task) are done with proof and merged (PRs #159, #166, #170). TK-004, documenting both mechanisms in `AGENTS.md` and `RUNBOOK.md`, is deferred until S-00P TK-002 lands its `AGENTS.md` rewrite. The two acceptance lines for that documentation and for the final suite and `doctor` run stay open.

## Remaining Limitations Or Follow-Up Specs

The recorded-reason escape hatch is deliberate and remains available to any
agent willing to write the reason. ADR-000J accepts that cost. Whether a
reviewer actually reads those recorded reasons is a review-practice question
this Spec does not answer.

TK-004 is held, not abandoned. S-00P TK-002 is rewriting `AGENTS.md` (with
TK-003..TK-005 rewriting `RUNBOOK.md`, `LEXICON.md` and the templates) and is
not yet contained in `integration`; editing the same controls now would
collide with that rewrite. The wording TK-004 must land once it is contained,
against the new text:

- `AGENTS.md`, at the completion obligations of Work Selection And Lifecycle:
  `close` refuses on a dirty tree (anything `git status --porcelain` shows)
  or an unpushed HEAD (no remote-tracking ref contains it) and on a Spec with
  no in-progress Task; commit and push before closing, or record the state
  with `--git-state-reason "<why>"`, which writes the observed state and the
  reason into the Receipt row and the Spec evidence row for a reviewer to
  read. `doctor` reports a detached HEAD and untracked control, ADR and spec
  files without blocking.
- `RUNBOOK.md`: `detached-head` and `untracked-controls` (scope `git`,
  `attention`, blocking effect `none`) in the blocking-effect table's
  `none (attention)` row and the diagnostics reference; the `close` options
  list gains `--git-state-reason`, with the `dirty-tree` / `unpushed`
  refusal, its remediation, and the no-in-progress-Task refusal.

## Supersession

None.
