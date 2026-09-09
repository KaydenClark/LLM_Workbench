# S-00B - Workbench Template Reformation

**Spec ID:** S-00B
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Recast the named reference room as a copyable Workbench Template and prove the v3.2 ownership update there.
**Blockers:** S-00A
**Latest event:** Stable owner created from the locked Template decision; no external room bytes changed.
**Next gate:** Complete S-00A, inspect current Workbench Template controls, then claim TK-00C.

> **Citation anchors.** pre=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2` post=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2`.

## Outcome

The current `Example_Workbench` becomes the Workbench Template: a reusable,
copyable reference room that embodies current Workbench ownership and routing
without carrying a fictional Example application as its product identity.

## Why It Matters

The reference room was intended as a reusable starter, but its filled Blueprint
and CLI tour describe an Example-specific product. Updating it is the v3.2
proof that the new rules can be applied to a real installed room; it is not
proof that future personalization automation exists.

## Desired Behavior

1. The template uses the updated Blueprint, active ADR, Context Map, and
   lifecycle rules while preserving its valid room controls and history.
2. Its orientation describes a copyable starter rather than a specific sample
   application or a promise of automatic project formation.
3. The exact external candidate is reviewed and integrated to the named
   `v3.2.0` branch's integration endpoint under that repository's controls.
4. The result demonstrates an explicit upstream update/reconciliation only;
   it does not claim fresh-copy personalization, prepared grilling, Genesis,
   or end-to-end project proof.

## Decisions And Contracts

- `Example_Workbench` is the current repository name; **Workbench Template** is
  its durable product role. Any repository rename is a separately scoped
  publication/remote decision.
- v3.2 acceptance is a successful template update, not an automated portfolio
  rollout or later template-to-project workflow.
- Preserve the requested `v3.2.0` branch through owner acceptance and do not
  merge its integration branch into main.

## Non-Goals

- Inventing or claiming a blank-project personalization path.
- Copying an Example-specific CLI tour into generic template controls.
- Updating an unnamed downstream Workbench.

## Dependencies And Blockers

S-00A must establish the durable root/template model first. External repository
mutation begins only after its own controls and current dirty state are read.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00C | Update and validate the Workbench Template against the settled ownership model | blocked | S-00A | Room-local tests, control-fidelity disposition, separate review, integration containment |

### TK-00C - Update and validate the Workbench Template against the settled ownership model

**Stance:** Builder

Read the target room's controls, inspect existing uncommitted work without
overwriting it, and create a lossless control-difference plan. Apply the v3.2
ownership/routing changes, update its orientation, run room-local verification,
obtain separate-context review, and verify the reviewed result is contained by
the target integration branch.

## Acceptance Criteria

- [ ] The target room's current controls follow S-00A without losing deliberate
      local differences or historical evidence.
- [ ] Product orientation identifies a copyable Workbench Template and avoids
      an Example-specific fictional application.
- [ ] Control-fidelity disposition and room-local tests identify the exact
      upstream candidate used.
- [ ] The reviewed `v3.2.0` candidate is integrated to that room's integration
      branch and read back from its remote.
- [ ] Evidence states that later personalized Genesis/fresh-copy proof remains
      outside this v3.2 acceptance.

## Testing Seams

Target-room doctor, tour/control checks, control-fidelity report, exact source
identity receipts, and independent remote-containment read-back.

## Verification Procedure

Run the target repository's required checks from its own root, not from the
upstream checkout. Capture every legitimate divergence, independently review
the exact candidate, merge only after PASS, and read the live target branch
back before recording S-050 evidence.

## Documentation Impact

The target room's controls and orientation, its owning spec, S-050, and this
spec. Do not alter unrelated downstream rooms.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Created the stable Workbench Template owner from the locked decision | Target room not touched in this planning pass | Scope distinguishes Template update from future personalization | S-00A, target inspection, implementation, verification, review, and integration remain pending |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

S-00C through S-00E own the staged project-evidence, Genesis, and fresh-copy
path that follows a valid template.

## Supersession

- Supersedes: none.
- Superseded by: none.
