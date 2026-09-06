# S-039 - Installed Managed-Runtime Integrity

**Spec ID:** S-039
**Status:** active
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Give an installed room a command that verifies the runtime it is executing, and make a drift report say whether the runtime matches the source or only disagrees with a stale receipt.
**Blockers:** none
**Latest event:** Spec captured from upstream items UP-013 and UP-014; both re-verified against `b3633e5`.
**Next gate:** Claim TK-001 and reproduce the missing emitter red.

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
  of `RUNTIME_TOOLS` (`tools/workbench-tools.mjs:24-64`, eleven `.mjs` files),
  so it is never installed into a room and is reachable only from a release
  checkout.
- `tools-receipt-missing` is emitted from an installed tool, but only by
  `validateGenesisRuntime` (`workbench/tools/workbench-layout.mjs:513-535`),
  which runs on the `validate --genesis` readiness path. That function checks
  the receipt's presence, readability, and `source.release`; it computes no
  hash. `doctor` calls neither.
- `tools/workbench-tools.mjs:180` computes `sourceDrift` - the receipt-versus-source
  comparison - immediately before line 181 returns `tools-receipt-drift` and
  discards it. Line 182 returns the same value as `updateAvailable`, but only
  on the `valid` path, which line 181 has already pre-empted.
- `sourceDrift` compares `receipt.files[tool]` with the source hash. It is a
  receipt-versus-source comparison, not an installed-versus-source one, so it
  cannot on its own answer "do the installed bytes match the release?".
- `RUNBOOK.md:265` tells an operator only that `verify` reports
  `tools-receipt-drift` "with the drifted file names". It names no remedy.
- `RUNBOOK.md:588` lists both codes in the effect table's `all` row, so the published
  contract asserts the blocking behavior that cannot occur.

Gap: no installed emitter for the hash check, and a drift result that withholds
the comparison that would tell the operator what happened.

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
| TK-001 | Emit the receipt hash check from an installed path so a drifted room fails `doctor` at its registered `all` effect | ready | none | pending |
| TK-002 | Report the installed-versus-source comparison inside the drift result and name the supported remedy per state | ready | none | pending |

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

- [ ] A room with a hash-drifted managed tool fails its own `doctor` with
      `tools-receipt-drift`, using only tools installed in the room.
- [ ] A drift result distinguishes receipt-stale, runtime-modified, and
      source-unavailable, and each names its supported remedy.
- [ ] `RUNBOOK.md` describes the installed check and the three states; the
      effect table at `RUNBOOK.md:586-592` is true of observable behavior.
- [ ] `node tools/test-workbench-tools.mjs` and `node tools/test-diagnostics.mjs`
      pass, with the new cases proved red before green.
- [ ] The full `AGENTS.md` verification suite passes.

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
  three drift states.
- `LEXICON.md` if the three states need named terms.
- `AGENTS.md` only if the verification suite gains a command.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-013 and UP-014 and re-verified at `b3633e5` | Read `diagnostics.mjs:25-26`, `workbench-tools.mjs:24-64,163-182`, `workbench-layout.mjs:513-535`, `RUNBOOK.md:265,588`; grepped every `tools-receipt` reference in the repository | Blueprint catalog regenerated by render | Both slices open; the emitter seam is a TK-001 decision |
| 2026-09-06 | spec | Separate-context review corrected one citation in the row above | The review found `RUNBOOK.md:588` is prose about `doctor --json`; the effect table row listing `tools-receipt-missing` and `tools-receipt-drift` under `all` is at `RUNBOOK.md:588`, table `579-584`. Re-read and confirmed. The row above is preserved unedited; Current Verified State and the acceptance criterion now cite the correct lines | No control text changed | The substantive claim in the row above is unaffected |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Rooms already carrying live drift are not repaired here; their disposition is
  an owner decision recorded in [S-038](../S-038-v3-1-2-upstream-fix-list/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
