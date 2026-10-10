# S-005I - Required Integration Branch

**Spec ID:** S-005I
**Status:** active
**Priority:** 0
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-10-10
**Catalog description:** Every Workbench stages work on a distinct integration branch created during genesis or adoption.
**Blockers:** none
**Latest event:** TK-008Q claimed by codex.
**Next gate:** Close TK-008Q with verification and documentation proof.

> **Citation anchors.** pre=`bcb8cfa0a685b67d151e5102d3f2cc855a13613b` post=`aae2f71a11db88c71703d4bcf81a9b807f49b112`.

## Outcome

Every Workbench project has a distinct integration branch before its default release branch. Genesis and adoption create it when absent, and setup cannot finish with an omission note.

## Why It Matters

All project workflows stage through integration before owner promotion to main.

## Current Verified State

At baseline `bcb8cfa0a685b67d151e5102d3f2cc855a13613b`, adoption reported a missing branch as residue, setup skills allowed an omission reason, and the AGENTS template allowed the same default and integration branch. Genesis derivation already created local main and integration branches. The corrected runtime is delivered on integration through PR 453; linked setup Wiki guidance is being reconciled under the recorded review findings.

## Desired Behavior

Declare distinct default and integration branches. Preserve an existing integration branch's exact name. Create a missing local integration branch from the resolved default branch during adoption; push and verify it during protocol completion. Missing creation or publication keeps setup incomplete. Use integration as the project staging destination in the shared controls and workflows.

## Decisions And Contracts

- Owner direction, 2026-10-09: every integrated project works through integration; genesis and adoption create it if absent.
- This extends the historical Declared Integration Branch capability (S-029); its original delivery proof stays unchanged.
- Existing branches and history are preserved. Integration to main promotion stays owner-only.

## Non-Goals

- Editing Ringworld or other consumer repositories in this run.
- Changing diagnostic blocking effects or release versions.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

One Task corrects the setup runtime, protocols, shared controls and documentation.

## Acceptance Criteria

- [x] Adoption creates a missing integration branch from the default branch without switching HEAD or changing an existing branch.
- [x] Default and integration branch declarations are distinct; setup refuses unresolved branch creation.
- [x] Genesis, adoption and upgrade completion require the published integration branch; an omission note cannot satisfy completion.
- [x] Shared workflow instructions stage through integration and preserve owner-only default-branch promotion.
- [x] Targeted checks and the full required suite pass; guardrail and self-drift limits are recorded.

## Testing Seams

- Adoption CLI and exported branch setup helper against disposable Git repositories.
- Layout init and readiness checks; template and skill contract tests.

## Verification Procedure

Observe the branch-creation regression red, correct it, rerun focused tests and the Runbook Full suite. Check final diff, touched Wiki lint, pre/post guardrail and self-drift reports.

## Documentation Impact

AGENTS root/template, Genesis and Adoption protocols and skills, upgrade completion, branch capability Wiki and active branch decision owner.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-09 | planning | Owner direction captured; isolated from unrelated dirty work | Read setup source, protocols and branch capability Wiki at parent integration tree | Spec created | Implementation and checks pending |
| 2026-10-09 | TK-008Q | Required integration staging implemented | [Verification record](verification.md): Full suite 56/57 plus corrected fidelity 39/39; focused branch regression green; Wiki validation and small lint; diff check; guardrail 73 to 73; unchanged 24 self-drift findings | Root and generic controls, setup skills/protocols, active branch decision amendment and branch feature Wiki | Task submission; assembled Spec Review; owner Human QA and main promotion; existing room-wide drift remains |
| 2026-10-10 | TK-008Q | Task closed | Setup runtime regression red then green; required suite all commands have passing results through 56/57 full run plus corrected fidelity 39/39; verification.md records exact candidates and limits; Wiki validation, small lint and diff check passed | Root and generic controls, setup and diagnostic procedure skills, ADR amendment, branch capability Wiki and verification.md | Assembled Spec Review, owner Human QA and main promotion; no consumer repository upgrade; pre-existing room-wide drift |
| 2026-10-10 | TK-008Q | Self-QA found branch failure status mismatch | New adoption CLI refusal regression is red: missing integration returns migration-failed after layout writes because caller accepts the layout helper invalid status | Same Task continuation records the adjusted handoff; earlier proof retained | Correct caller success-state check and reverify before submission |
| 2026-10-10 | TK-008Q | Corrected refusal path verified in Task run 2 | Runtime candidate aae2f71a11db88c71703d4bcf81a9b807f49b112: canonical local Full suite 57/57 in 930.2 seconds; CI run 38015157081 SUCCESS; CLI refusal red then green before layout writes | [Corrected verification](verification.md#corrected-task-run-2); earlier close and self-QA correction retained | Final Task submission, assembled-Spec Review, owner Human QA and main promotion; no consumer upgrade |
| 2026-10-10 | TK-008Q | Task closed (run 2) | Run 2: canonical Full suite 57/57 locally at aae2f71a in 930.2 seconds and canonical CI run 38015157081 SUCCESS; actual CLI refusal red then green with no layout writes; verification.md#corrected-task-run-2 records scope and limits; Wiki validation, small lint and diff checks pass | Setup controls and protocols, skills, branch decision and Wiki; corrected run-2 verification and source anchors | Assembled Spec Review, owner Human QA and main promotion; no consumer repository upgrade; existing room-wide drift |

| 2026-10-10 | TK-008Q | Corrected Task delivered to integration | PR 453 MERGED at acc318fecddc8b4d3a0cccb3e5e2884d06ee377a; fresh origin/integration contains exact submitted 5f6dd2a1d297a993704ff15395111f8932bc86eb; CI 38017004701 attempt 2 SUCCESS | Real assembled result prepared; [delivery and CI record](verification.md#integration-delivery) | Fresh assembled-Spec Review, owner approval and main verification; existing notepad CI race observed on attempt 1 remains outside this capability |
| 2026-10-10 | review | Review verdict: fail at f8ccf5c26cad18751462f280d9d1e2a38850a1bd [a867734916f9] #1 | continue TK-008Q: setup Wiki permits incomplete branch setup and retains a partly resolved default-detection gap, so update current guidance and preserve dated history; continue TK-008Q: anchor the Spec old state explicitly to baseline bcb8cfa and distinguish current delivery | Codex fresh context /root/integration_spec_review, inherited session model, review-only | 2 |

## Completion Result

Implemented the required integration staging rule in producer setup tools,
shared controls, protocols and skills. Adoption creates a missing branch from
the resolved default branch, preserves existing refs and HEAD, and refuses
failed branch setup before layout writes. All 57 canonical commands passed
locally, and the submitted Task passed CI on retry without changing runtime
code or test criteria. Integration at `acc318fecddc8b4d3a0cccb3e5e2884d06ee377a`
contains submitted head `5f6dd2a1d297a993704ff15395111f8932bc86eb`.

No consumer room was upgraded. Owner approval and verification on main remain
open; this records the implemented result without claiming Spec completion.
