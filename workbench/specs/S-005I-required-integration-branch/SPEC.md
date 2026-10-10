# S-005I - Required Integration Branch

**Spec ID:** S-005I
**Status:** active
**Priority:** 0
**Owner:** Kayden
**Stance:** Builder
**Updated:** 2026-10-09
**Catalog description:** Every Workbench stages work on a distinct integration branch created during genesis or adoption.
**Blockers:** none
**Latest event:** Owner reported the missing project staging branch during Ringworld deployment.
**Next gate:** Activate one setup correction Task.

## Outcome

Every Workbench project has a distinct integration branch before its default release branch. Genesis and adoption create it when absent, and setup cannot finish with an omission note.

## Why It Matters

All project workflows stage through integration before owner promotion to main.

## Current Verified State

At this branch's parent integration tree, adoption reports a missing branch as residue, setup skills allow an omission reason, and the AGENTS template allows the same default and integration branch. Genesis derivation already creates local main and integration branches.

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

- [ ] Adoption creates a missing integration branch from the default branch without switching HEAD or changing an existing branch.
- [ ] Default and integration branch declarations are distinct; setup refuses unresolved branch creation.
- [ ] Genesis, adoption and upgrade completion require the published integration branch; an omission note cannot satisfy completion.
- [ ] Shared workflow instructions stage through integration and preserve owner-only default-branch promotion.
- [ ] Targeted checks and the full required suite pass; guardrail and self-drift limits are recorded.

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

## Completion Result

Pending. Owner Human QA and main promotion remain open.
