# TK-008Q - Require project staging during setup

**Task ID:** TK-008Q
**Spec ID:** S-005I
**Slice:** Require project staging during setup
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Adoption creates a missing integration branch from the default branch without switching HEAD or changing an existing branch.
**Planned verification:** Adoption and layout regression tests red then green, Runbook Full suite, touched Wiki lint, pre/post guardrail and self-drift.
**Claimed by:** codex

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/required-integration-branch | 5b9f5f3c9fd90257ed40fa14cc362da182f22735 | ahead 1 behind 0 | 2 | Full required 57-command run: 56 pass, fidelity reference fails; doc-only fix then fidelity 39/39 pass. All required commands have passing results. Branch regression red then green; Wiki validation; final diff check. | Root/template AGENTS and Runbook, Genesis/Adoption protocols and skills, upgrade/runtime/room-check procedures, ADR amendment, branch feature Wiki; verification.md | Task submission and assembled Spec Review; owner Human QA/main; unchanged pre-existing self-drift findings; no consumer upgrade | 29f5f9e15c71a44154115e3b6880429081b37b3b0747ded983c6ca35444d3b44 |
