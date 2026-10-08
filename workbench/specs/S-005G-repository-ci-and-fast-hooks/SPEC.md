# S-005G - Repository CI And Fast Hooks

**Spec ID:** S-005G
**Status:** active
**Priority:** 2
**Owner:** codex-confirmed-followup
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** Integration PRs and integration updates run the canonical required suite; this repository alone has fast offline staged whitespace and JavaScript syntax checks at commit.
**Blockers:** none
**Latest event:** TK-007S claimed by codex-confirmed-followup.
**Next gate:** Close TK-007S with verification and documentation proof.

> **Citation anchors.** pre=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad` post=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad`.

## Outcome

Integration PRs and integration updates run the canonical required suite; this repository alone has fast offline staged whitespace and JavaScript syntax checks at commit.

## Why It Matters

The owner requested faster, clearer skill building and confirmed this concrete scope and reviewed delivery into integration.

## Current Verified State

Actions are enabled with read-only defaults, the repository is public and has no workflows or installed hooks. S-002R remains a pending-skill alignment Spec with installation outside its scope.

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

- [ ] One standard Linux workflow reads the existing canonical RUNBOOK suite and has bounded concurrency and runtime.
- [ ] Hooks check staged bytes, including partially staged files, and avoid network work or the full suite at commit.
- [ ] Install and recovery are repository-local, idempotent where safe, and refuse existing-hook collisions and other repositories.
- [ ] Actual hosted CI and installation in LLM_Workbench are verified after reviewed integration delivery.

## Testing Seams

Public git commit scenarios for valid/invalid/partially staged content, collision and repository scope; workflow checks and full RUNBOOK verification.

## Verification Procedure

Use the named focused seams while editing, then the one full suite listed in RUNBOOK.md on the final assembled candidate. A changed candidate needs fresh review.

## Documentation Impact

Owning files: .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md. Update existing owners, preserve evidence and avoid copied procedures.

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
