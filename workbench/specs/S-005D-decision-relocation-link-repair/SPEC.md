# S-005D - Decision Relocation Link Repair

**Spec ID:** S-005D
**Status:** active
**Priority:** 2
**Owner:** codex-confirmed-followup
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** Decision lifecycle moves preserve outgoing relative targets and repair incoming Grill Board references without rewriting historical evidence.
**Blockers:** none
**Latest event:** TK-007P claimed by codex-confirmed-followup.
**Next gate:** Close TK-007P with verification and documentation proof.

> **Citation anchors.** pre=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad` post=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad`.

## Outcome

Decision lifecycle moves preserve outgoing relative targets and repair incoming Grill Board references without rewriting historical evidence.

## Why It Matters

The owner requested faster, clearer skill building and confirmed this concrete scope and reviewed delivery into integration.

## Current Verified State

S-003X delivered record lifecycle tools and has owner Human QA; this is a later narrow defect, not a reopening of its accepted result.

## Desired Behavior

The acceptance below defines this bounded follow-up. Existing claims, source ownership and delivery gates remain in force.

## Decisions And Contracts

- Owner confirmation: Slack T0C7LRB65JS / C0C7HJCEJ13, thread 1791443132.516449; readback 1791445519.027649, owner answer 1791446326.652929: "Yes that matches. you are confirmed for 1-3". The parent relayed reviewed integration delivery authorization; the ADR fix was approved earlier.
- Main promotion remains an owner act. Confirmation adds no design commitments beyond the requested endpoint.
- One writer, `codex-confirmed-followup`, owns these follow-up records and shared projection updates.

## Non-Goals

- No disposable-fixture/shared-fixture-builder proposal or wider harness redesign.
- No glossary-retirement or domain-modeling lane changes.
- No finalized outer workflow ordering, new approval ceremony, paid billing, credentials, security settings, repository permissions, branch protection or other-project hooks.

## Dependencies And Blockers

- Existing glossary and domain-modeling assemblies remain independent; no dependency on merging them.
- Final integration delivery requires mandatory full verification and separate-context review of the assembled candidate.

## Vertical Implementation Slices

No Task is cut yet. The authorized next step is one complete-path Task for this capability.

## Acceptance Criteria

- [ ] ADR and DDR accept/archive moves preserve unmoved glossary, Spec and Wiki targets, queries, fragments and encoding.
- [ ] The Grill Board README and current glossary are incoming-reference surfaces.
- [ ] Evidence bytes and unrelated files remain unchanged; already-valid link spelling is preserved.

## Testing Seams

Existing tools/test-adr.mjs regressions, Wiki relocation checks and Grill Board tests; full RUNBOOK verification.

## Verification Procedure

Use the named focused seams while editing, then the one full suite listed in RUNBOOK.md on the final assembled candidate. A changed candidate needs fresh review.

## Documentation Impact

Owning files: workbench/tools/adr.mjs; tools/test-adr.mjs; workbench/skills/to-docs/SKILL.md. Update existing owners, preserve evidence and avoid copied procedures.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|

## Completion Result

Pending implementation and reviewed integration delivery. Owner Human QA and main remain later gates.

## Remaining Limitations Or Follow-Up Specs

- Existing Workbench drift remains separately owned; passing this patch's tests cannot establish a globally clean Workbench or agent reliability.

## Supersession

- Supersedes: none
- Superseded by: none
