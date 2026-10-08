# TK-007P - Decision Relocation Link Repair

**Task ID:** TK-007P
**Spec ID:** S-005D
**Slice:** Decision Relocation Link Repair
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-005D Acceptance Criteria
**Planned verification:** Existing tools/test-adr.mjs regressions, Wiki relocation checks and Grill Board tests; full RUNBOOK verification.
**Claimed by:** codex-confirmed-followup
**Proof:** code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score

Deliver the scoped behavior, maintained owners and checkable proof. Preserve the exclusions and owner endpoint recorded in the Spec.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/workbench-confirmed-followup | ffa941905c0667c92065d58894f78f35302b31be | ahead 4 behind 0 | 3 | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | workbench/tools/adr.mjs; tools/test-adr.mjs; workbench/skills/to-docs/SKILL.md | none in implementation; independent review and delivery still pending | 15a747516fa3d5ac8d43e63607d7df625afec2878c333ca5e3a93d8aef5a5830 |
| 2 | codex/workbench-confirmed-followup | ffa941905c0667c92065d58894f78f35302b31be | ahead 4 behind 0 | 4 | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | workbench/tools/adr.mjs; tools/test-adr.mjs; workbench/skills/to-docs/SKILL.md | none in implementation Git state at close: dirty-tree (9 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/full-suite.txt, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/verification.json) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA | f955f0e0abc588921bbee520820e334422aad3449dda1ad6e82d9a858b33ccee |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-08 | evidence row 2 (fail verdict at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 on 2026-10-08) | Separate Markdown destination wrappers and titles before rebasing, preserving the path target and exact wrapper/title bytes, with narrow regressions. |
