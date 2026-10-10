# TK-008Q - Require project staging during setup

**Task ID:** TK-008Q
**Spec ID:** S-005I
**Slice:** Require project staging during setup
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Adoption creates a missing integration branch from the default branch without switching HEAD or changing an existing branch.
**Planned verification:** Adoption and layout regression tests red then green, Runbook Full suite, touched Wiki lint, pre/post guardrail and self-drift.
**Claimed by:** codex
**Proof:** Setup runtime regression red then green; required suite all commands have passing results through 56/57 full run plus corrected fidelity 39/39; verification.md records exact candidates and limits; Wiki validation, small lint and diff check passed

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/required-integration-branch | 5b9f5f3c9fd90257ed40fa14cc362da182f22735 | ahead 1 behind 0 | 2 | Full required 57-command run: 56 pass, fidelity reference fails; doc-only fix then fidelity 39/39 pass. All required commands have passing results. Branch regression red then green; Wiki validation; final diff check. | Root/template AGENTS and Runbook, Genesis/Adoption protocols and skills, upgrade/runtime/room-check procedures, ADR amendment, branch feature Wiki; verification.md | Task submission and assembled Spec Review; owner Human QA/main; unchanged pre-existing self-drift findings; no consumer upgrade | 29f5f9e15c71a44154115e3b6880429081b37b3b0747ded983c6ca35444d3b44 |
| 2 | codex/required-integration-branch | e07bebf16c873e537377fd02e6cec56088d5c908 | ahead 0 behind 0 | 0 | Setup runtime regression red then green; required suite all commands have passing results through 56/57 full run plus corrected fidelity 39/39; verification.md records exact candidates and limits; Wiki validation, small lint and diff check passed | Root and generic controls, setup and diagnostic procedure skills, ADR amendment, branch capability Wiki and verification.md | Assembled Spec Review, owner Human QA and main promotion; no consumer repository upgrade; pre-existing room-wide drift | 723d3439272f27daf50c1a7db6a35d9e9327746163655ebd161aaf1ef1503c60 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-10 | Required Integration Branch Spec evidence: Self-QA found branch failure status mismatch | Self-QA found that adoption tests for blocked, while the layout helper returns invalid on failure. Accept only created or existing branch setup; refuse not-in-Git and missing-default errors before writing layout. Run the CLI regression red then green and repeat required verification. |
