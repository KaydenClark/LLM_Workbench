# S-005F - Maintained Workflow Reference

**Spec ID:** S-005F
**Status:** active
**Priority:** 2
**Owner:** codex-confirmed-followup
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** RUNBOOK.md is the easy-to-reference home for existing workflows expressed as ordered verbs, with scenario and skill pointers.
**Blockers:** none
**Latest event:** TK-007R closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

> **Citation anchors.** pre=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad` post=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad`.

## Outcome

RUNBOOK.md is the easy-to-reference home for existing workflows expressed as ordered verbs, with scenario and skill pointers.

## Why It Matters

The owner requested faster, clearer skill building and confirmed this concrete scope and reviewed delivery into integration.

## Current Verified State

Baseline at the `pre` citation anchor:

DDR-001D selects the Runbook as the workflow home. ADR-000X amended Journey to Implement, Check, QA, Submit. The outer sequence is still being reconstructed.

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

One complete-path Task, [TK-007R - RUNBOOK.md](tasks/TK-007R/TASK.md), owns this capability's implementation and proof. The native Task record owns its state.

## Acceptance Criteria

- [x] One reference points to existing authoritative definitions and procedures rather than duplicating them.
- [x] Confirmed stages and unresolved outer ordering remain distinguishable.
- [x] QA inside Journey and owner approval, delivery, main verification and cleanup remain visible.
- [x] Root and generic Runbook references agree while the separate S-004C carrier rewrite remains unchanged.

## Testing Seams

Source-by-source semantic comparison and existing Runbook pointer tests; full RUNBOOK verification.

## Verification Procedure

Use the named focused seams while editing, then the one full suite listed in RUNBOOK.md on the final assembled candidate. A changed candidate needs fresh review.

## Documentation Impact

Owning files: RUNBOOK.md; templates/RUNBOOK.md. Update existing owners, preserve evidence and avoid copied procedures.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-08 | TK-007R | Task closed | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | RUNBOOK.md; templates/RUNBOOK.md | none in implementation Git state at close: dirty-tree (13 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005E-readback-skill/tasks/TK-007Q/TASK.md, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005F-workflow-reference/tasks/TK-007R/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-post.json.gz, and 3 more) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA |

## Completion Result

Implementation verified locally at `ffa941905c0667c92065d58894f78f35302b31be`. The canonical RUNBOOK suite passed all 55 commands in 849.3 seconds, with focused red/green and source checks. Native Codex discovered readback and produced the three bounded outputs recorded in the Reusable Readback Skill proof. Mandatory self-drift findings remained unchanged at 23; score remained 73, so no globally clean Workbench or agent-outcome claim is made. Independent review and integration delivery are the next gates. Hosted CI and canonical hook installation will be observed after delivery; owner Human QA and main remain separate later gates.

## Remaining Limitations Or Follow-Up Specs

- Existing Workbench drift remains separately owned; passing this patch's tests cannot establish a globally clean Workbench or agent reliability.

## Supersession

- Supersedes: none
- Superseded by: none
