# S-039 - Installed Managed-Runtime Integrity

**Spec ID:** S-039
**Status:** complete
**Priority:** 1
**Owner:** claude-opus-5
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Give an installed room a command that verifies the runtime it is executing, and make a drift report say whether the runtime matches the source or only disagrees with a stale receipt.
**Blockers:** none
**Latest event:** TK-001 and TK-002 closed; the installed doctor emits the receipt hash check and the drift result classifies each drifted file.
**Next gate:** none; independent review of `claude/s039-v3-1-2` before integration.

## Outcome

A room can verify the integrity of the runtime tools it is executing using only
what the room contains, and when that check fails the operator is told which of
two very different conditions holds: the runtime matches its release source and
the receipt is stale, or the runtime differs from both and may have been
modified. The registered blocking effect of `tools-receipt-drift` and the
behavior an operator can actually reach agree.

## Why It Matters

`workbench/tools/diagnostics.mjs:25-26` registers `tools-receipt-missing` and
`tools-receipt-drift` at scope `tools` with effect `all` - the strongest
blocking class in the model. `doctor` fails on `all`. But no installed tool
emits `tools-receipt-drift`, so `doctor` cannot fail on it, and a room whose
runtime disagrees with its own receipt on every managed file still prints
`ok - no blocking finding`.

Audit Workbench reproduced exactly that on 2026-09-06: `verify` returned
`tools-receipt-drift` with `reason: hash` for all eleven managed tools against a
receipt naming v3.1.1 `fa04e27`, while the same room's `doctor` reported no
blocking finding. That room then could not act on the result, because the drift
report does not distinguish a stale receipt from a modified runtime, and it
recorded the condition as an unrepaired blocker carried forward. A managed
runtime whose integrity check is unreachable from the room is not a managed
runtime; every downstream claim that cites `verify` inherits the gap.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5`; the `file:line` citations were re-anchored to the post-S-036 tree
after PR #63 merged, so following one lands on what it names.

- `workbench/tools/diagnostics.mjs:25-26` registers both codes with
  `entry('error', 'tools', 'all', ...)`.
- `tools-receipt-drift` is emitted at exactly one site,
  `tools/workbench-tools.mjs:203`. `tools/workbench-tools.mjs` is not a member
  of `RUNTIME_TOOLS` (`tools/workbench-tools.mjs:24-36`, eleven `.mjs` files),
  so it is never installed into a room and is reachable only from a release
  checkout.
- `tools-receipt-missing` is emitted from an installed tool, but only by
  `validateGenesisRuntime` (`workbench/tools/workbench-layout.mjs:513-535`),
  which runs on the `validate --genesis` readiness path. That function checks
  the receipt's presence, readability, and `source.release`; it computes no
  hash. `doctor` calls neither.
- `tools/workbench-tools.mjs:202` computes `sourceDrift` - the receipt-versus-source
  comparison - immediately before line 203 returns `tools-receipt-drift` and
  discards it. Line 204 returns the same value as `updateAvailable`, but only
  on the `valid` path, which line 203 has already pre-empted.
- `sourceDrift` compares `receipt.files[tool]` with the source hash. It is a
  receipt-versus-source comparison, not an installed-versus-source one, so it
  cannot on its own answer "do the installed bytes match the release?".
- `RUNBOOK.md:265` tells an operator only that `verify` reports
  `tools-receipt-drift` "with the drifted file names". It names no remedy.
- `RUNBOOK.md:588` lists both codes in the effect table's `all` row, so the published
  contract asserts the blocking behavior that cannot occur.

Gap: no installed emitter for the hash check, and a drift result that withholds
the comparison that would tell the operator what happened.

This section records the state at capture, which TK-001 and TK-002 closed; the
Completion Result below names what is true now and where.

## Desired Behavior

1. An installed room can verify its managed runtime against the receipt using
   only tools the room contains, and a hash mismatch produces
   `tools-receipt-drift` from that installed path. `doctor` observes the
   registered `all` effect when it occurs.
2. A `tools-receipt-drift` result reports, per drifted file, whether the
   installed bytes match the release source. The three reachable states are
   named distinctly: receipt stale but runtime authentic; runtime modified;
   source unavailable so the comparison could not be made.
3. The drift message names the supported remedy for each state, including
   `update --explicit-update` (which writes a rollback backup and records its
   path in the receipt) for the stale-receipt case.
4. No verification path is weakened: a modified runtime still fails, and a
   missing receipt still fails.

## Decisions And Contracts

- **The registered effect is the contract, not the aspiration.** Either an
  installed emitter exists or the registration is wrong. This spec closes the
  gap by adding the emitter, because a room that cannot check its own runtime
  cannot support any managed-runtime claim.
- **Source comparison is optional evidence, not a precondition.** A room with
  no release checkout still gets its receipt check; it is told the source
  comparison was unavailable rather than being blocked or silently downgraded.
- **`verify` never repairs.** Distinguishing the states is a reporting change.
  Replacing bytes stays behind `update --explicit-update`.

## Non-Goals

- Adding `workbench-tools.mjs` itself to `RUNTIME_TOOLS`, if a smaller seam in
  an already-installed tool serves. The choice is a TK-001 decision, recorded
  with its reason.
- Automatic receipt refresh, or any path that silently accepts drifted bytes.
- Repairing this repository's or any reviewed room's live drift. That is an
  owner decision recorded under S-038.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Emit the receipt hash check from an installed path so a drifted room fails `doctor` at its registered `all` effect | done | none | `tools/test-workbench-layout.mjs` "a room whose managed runtime drifts from its receipt fails the doctor it carries" and `tools/test-diagnostics.mjs` "a drifted or unreadable managed runtime is a blocking tools finding in the room doctor", both red before `26eb7e6` |
| TK-002 | Report the installed-versus-source comparison inside the drift result and name the supported remedy per state | done | none | `tools/test-workbench-tools.mjs` "a drift result separates a stale receipt from a modified runtime and names each remedy" plus the `source-unavailable` assertion in the layout room test, both red before `b573009` |

### TK-001 - An installed integrity check

**Stance:** Builder

Red first: build a fixture room with an installed tools lane, modify one managed
file, and assert that the room's own `doctor` reports `tools-receipt-drift` and
exits non-zero. That assertion must fail at `b3633e5`. Then add the emitter at
the smallest seam and turn it green. Keep `doctor`'s cost bounded and say in the
spec what it now reads.

### TK-002 - A drift report that can be acted on

**Stance:** Builder

Red first: assert that a drift result for a room whose installed bytes are
byte-identical to the release source reports that fact and names
`update --explicit-update`, and that a room whose bytes match neither is
reported as modified. Cover the source-unavailable case explicitly. Then move
the comparison so both paths carry it.

## Acceptance Criteria

- [x] A room with a hash-drifted managed tool fails its own `doctor` with
      `tools-receipt-drift`, using only tools installed in the room.
- [x] A drift result distinguishes receipt-stale, runtime-modified, and
      source-unavailable, and each names its supported remedy. A fourth state,
      `runtime-authentic`, covers mode-only drift, whose bytes match both the
      receipt and the source; calling that one of the three would be false.
- [x] `RUNBOOK.md` describes the installed check and the states; the effect
      table, unchanged in content and now at `RUNBOOK.md:610-616` after the
      prose insertion above it, is true of observable behavior.
- [x] `node tools/test-workbench-tools.mjs` and `node tools/test-diagnostics.mjs`
      pass, with the new cases proved red before green.
- [x] The full `AGENTS.md` verification suite passes.

## Testing Seams

- `tools/workbench-tools.mjs` `verify()` return shape (`tools/test-workbench-tools.mjs`).
- The installed `doctor` findings list (`tools/test-diagnostics.mjs`, and the
  layout suite's fixture rooms in `tools/test-workbench-layout.mjs`).

## Verification Procedure

```bash
node tools/test-workbench-tools.mjs
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `RUNBOOK.md` managed runtime tools check: the installed entry point and the
  drift states. Done in `4856985`.
- `LEXICON.md` if the three states need named terms. Not needed: the states are
  values of a `verify`/`doctor` report field, documented where that report is
  documented, not shared project vocabulary other controls speak.
- `AGENTS.md` only if the verification suite gains a command. Not needed: the
  new cases run inside suites the file already lists.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-013 and UP-014 and re-verified at `b3633e5` | Read `diagnostics.mjs:25-26`, `workbench-tools.mjs:24-36,163-182`, `workbench-layout.mjs:499-521`, `RUNBOOK.md:265,588`; grepped every `tools-receipt` reference in the repository | Blueprint catalog regenerated by render | Both slices open; the emitter seam is a TK-001 decision |
| 2026-09-06 | spec | Separate-context review corrected one citation in the row above | The review found `RUNBOOK.md:588` is prose about `doctor --json`; the effect table row listing `tools-receipt-missing` and `tools-receipt-drift` under `all` is at `RUNBOOK.md:581`, table `579-584`. Re-read and confirmed. The row above is preserved unedited; Current Verified State and the acceptance criterion now cite the correct lines | No control text changed | The substantive claim in the row above is unaffected |
| 2026-09-06 | spec | Fresh separate-context review corrected the citations the prior round degraded or missed | `RUNTIME_TOOLS` spans `workbench-tools.mjs:24-36` at both `b3633e5` and the merged tip; the prior round changed a correct range to `24-64`, which covers unrelated helpers, and is reverted. The Current Verified State paragraph still read `:180/:181/:182` for `sourceDrift`, the `tools-receipt-drift` return, and the `updateAvailable` return; true values at the merged tip are `:202/:203/:204`, and `:181` is blank. The append-only row above, rewritten by the prior round, is restored to its original text | No control text changed | TK-001 and TK-002 open |
| 2026-09-06 | spec | Restored the fresh-review row that the previous commit rewrote | `f963b96` edited the row `7a386fd` had published, to expand it from one rewritten row to two. It is restored byte-for-byte and the expansion is recorded here instead: this spec had two rewritten rows, the capture row (`workbench-layout.mjs:499-521` had become `513-535`, which at `b3633e5` starts mid-loop and ends past the function close in the permission-file section) and the correction row (`RUNBOOK.md:581` had become `588`). Both now carry their first-published text | No control text changed | TK-001 and TK-002 open |

| 2026-09-06 | TK-001 | The receipt hash check now runs from the tool a room installs, and `doctor` reads it | Red at `09bfff7`: the new layout case failed `the room's own doctor must report tools-receipt-drift: []`, and the diagnostics case failed `+ []` against `[['tools-receipt-drift','error','tools','all']]`. Green at `26eb7e6`: `node tools/test-workbench-layout.mjs` 33/33, `node tools/test-diagnostics.mjs` 11/11, `node tools/test-workbench-tools.mjs` 16/16 | `RUNBOOK.md` updated in `4856985` | The seam is `workbench-layout.mjs`, not `RUNTIME_TOOLS` membership for `workbench-tools.mjs`; a lane with no receipt is still only the Genesis gate's finding |
| 2026-09-06 | TK-002 | Each drifted file is classified by comparing the installed bytes with the release source, and carries its remedy | Red at `26eb7e6`: `verify` returned `state: undefined` for a stale receipt, and the room doctor's drift entry carried `+ undefined - 'source-unavailable'`. Green at `b573009`: `node tools/test-workbench-tools.mjs` 16/16 and `node tools/test-workbench-layout.mjs` 33/33. One assertion regex was tightened, not weakened, from `/update --explicit-update/` to `/workbench-tools\.mjs update .*--explicit-update/` because the remedy names the full invocation | `RUNBOOK.md` state table added in `4856985` | A room still cannot reach a release source, so its own `doctor` reports `source-unavailable`; classifying it needs `verify` from a release checkout |
| 2026-09-06 | spec | Both slices closed and verified against the full suite | All 25 `tools/test-*.mjs` suites pass, `python3 evals/tasks/task_b_path_safety/test_grade.py` passes, `render` leaves no drift, `doctor` exits 0, `python3 tools/check-append-only.py` CLEAN. Guardrail score before and after is 106.6/113 (`node tools/evaluate-workbench.mjs --path templates --include-controls`); this change touches no template, so the static score is unchanged and no agent-outcome claim is made from it | `RUNBOOK.md` only; `LEXICON.md` and `AGENTS.md` checked, no update needed for the reasons recorded under Documentation Impact | The doctor call site needed two lines in `workbench/tools/spec-workbench.mjs`, which the assigned file lane did not list; no sibling spec was named as its owner and the edit is an import plus one push into `collectionFindings`. Reported to the coordinator rather than left undone. The RUNBOOK effect table is unchanged in content but moved from `:586-592` to `:610-616` by the prose inserted above it |

## Completion Result

An installed room verifies the runtime it executes with only the tools it
contains. `workbench/tools/workbench-layout.mjs:574` holds the receipt hash
comparison and `:596` the doctor entry point; `workbench/tools/spec-workbench.mjs:283`
reads it, so a drifted managed tool now fails that room's own `doctor` at the
`all` effect `workbench/tools/diagnostics.mjs:26` registers. The release-side
`tools/workbench-tools.mjs:198` calls the same function with its source lane,
so both entry points report identical drift.

A drift entry carries `state` and `remedy`. `receipt-stale` means the installed
bytes are the release source's and names `update --explicit-update`;
`runtime-modified` means they match neither and names `rollback`;
`runtime-authentic` means only the file mode drifted; `source-unavailable`
means no release checkout was reachable to compare against, which is the state
every installed room reports. `updateAvailable` still answers the separate
receipt-versus-source question and now rides the drift path as well as the
valid path.

No verification path was weakened: a modified runtime still fails `verify` and
`doctor`, a missing receipt still fails the Genesis gate, and a receipt that
exists but cannot be read is reported rather than silently disabling the check.

## Remaining Limitations Or Follow-Up Specs

- Rooms already carrying live drift are not repaired here; their disposition is
  an owner decision recorded in [S-038](../S-038-v3-1-2-upstream-fix-list/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
