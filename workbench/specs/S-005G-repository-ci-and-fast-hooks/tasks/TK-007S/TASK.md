# TK-007S - Repository CI And Fast Hooks

**Task ID:** TK-007S
**Spec ID:** S-005G
**Slice:** Repository CI And Fast Hooks
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-005G Acceptance Criteria
**Planned verification:** Public git commit scenarios for valid/invalid/partially staged content, collision and repository scope; workflow checks and full RUNBOOK verification.
**Claimed by:** codex-confirmed-followup
**Proof:** code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score

Deliver the scoped behavior, maintained owners and checkable proof. Preserve the exclusions and owner endpoint recorded in the Spec.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/workbench-confirmed-followup | ffa941905c0667c92065d58894f78f35302b31be | ahead 4 behind 0 | 9 | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md | none in implementation; independent review and delivery still pending | bed1fd49a25339a37fa037d738b4d8e3e46673177bdaf28e642bc3a1d60391ef |
| 2 | codex/workbench-confirmed-followup | ffa941905c0667c92065d58894f78f35302b31be | ahead 4 behind 0 | 10 | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md | none in implementation Git state at close: dirty-tree (15 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005E-readback-skill/tasks/TK-007Q/TASK.md, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005F-workflow-reference/tasks/TK-007R/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/SPEC.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, and 5 more) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA | 3fd5009f7778560034b0a12f2c0835ee1b295e0fcb6bf09d806f1d7591a62573 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-08 | evidence row 2 (fail verdict at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 on 2026-10-08) | Inspect index modes and syntax-check ordinary staged file blobs only, with a real Git symlink regression |
| 2 | 2026-10-08 | evidence row 2 (fail verdict at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 on 2026-10-08) | Refuse multiply linked hook snapshot files before writes and add a refusal regression. |
