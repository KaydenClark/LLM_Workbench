# S-00M - Completion Claims Against Repository State

**Spec ID:** S-00M
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-15
**Catalog description:** Make a completion claim unable to hide uncommitted or unpushed work, by surfacing Git state in `doctor` and refusing `close` unless the Receipt records the state and a reason.
**Blockers:** none
**Latest event:** Spec authored at owner acceptance of ADR-000J, which had no delivery owner.
**Next gate:** Claim TK-001.

> **Citation anchors.** pre=`87c1d45cd6c32ceea12e05590eae966c0d6d4ecf` post=`87c1d45cd6c32ceea12e05590eae966c0d6d4ecf`.

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

`workbench/tools/spec-workbench.mjs` `closeTicket` requires `--proof`,
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
  [S-00H](../S-00H-task-artifact-and-terminology-migration/SPEC.md).
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

None blocking. TK-003 writes `upstream distance` into whatever record carries
the Receipt: S-00H TK-006 if that has landed, the existing evidence row
otherwise. Either target satisfies it, so this Spec does not wait on S-00H.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Read repository state at a stable seam | ready | none | Red test for a function returning detached/dirty/untracked/upstream state from a fixture repository; green minimal reader; behaves as unknown, never throwing, where Git is absent |
| TK-002 | Register and surface the git-state findings | blocked | TK-001 | Red test asserting `detached-head` and `untracked-controls` are registered `attention`/`none` and appear in `doctor` output for a fixture; green findings; proof that neither changes `doctor`'s exit code or `next`'s selection |
| TK-003 | Refuse `close` on a dirty or unpushed branch unless the Receipt records it | blocked | TK-001 | Red test for a close on a dirty tree, and a second for an unpushed branch; green refusal naming the finding; a third test proving the close succeeds when the state and reason are recorded, and that the reason text is present in the written record afterward |
| TK-004 | Document both mechanisms in their control owners | blocked | TK-003 | `AGENTS.md` and `RUNBOOK.md` updated; `tools/test-control-fidelity.mjs` and the full suite pass |

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

`closeTicket` gains a dependency on repository state it has never had, moving
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

- [ ] `doctor` reports a detached HEAD and untracked files under the controls,
      ADR and spec lanes.
- [ ] Both findings are registered `attention` with blocking effect `none`, and
      neither changes `doctor`'s exit code or `next`'s selection, proven by a
      test that failed before the change.
- [ ] `close` refuses on a dirty tree, proven by a test that failed before the
      change.
- [ ] `close` refuses on an unpushed branch, proven by a test that failed
      before the change.
- [ ] `close` succeeds when the Receipt records the state and a reason, and the
      reason text is readable in the record afterward.
- [ ] The state reader reports unknown rather than throwing where Git is
      unavailable.
- [ ] `AGENTS.md` and `RUNBOOK.md` describe both mechanisms.
- [ ] The full verification suite passes and `doctor` carries no blocking
      finding.

## Testing Seams

The repository-state reader from TK-001; the `diagnostics.mjs` registry;
`spec-workbench.mjs` `closeTicket`; the existing coverage in
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

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

The recorded-reason escape hatch is deliberate and remains available to any
agent willing to write the reason. ADR-000J accepts that cost. Whether a
reviewer actually reads those recorded reasons is a review-practice question
this Spec does not answer.

## Supersession

None.
