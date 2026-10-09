# TK-007R - Maintained Workflow Reference

**Task ID:** TK-007R
**Spec ID:** S-005F
**Slice:** Maintained Workflow Reference
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-005F Acceptance Criteria
**Planned verification:** Source-by-source semantic comparison and existing Runbook pointer tests; full RUNBOOK verification.
**Claimed by:** codex-confirmed-followup
**Proof:** corrected code 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc; canonical 55/55 commands pass in 948.2s; focused ADR lifecycle 5/5 and real-Git hook cases 4/4 pass; Blueprint semantic assertion and Wiki validation pass; score remains 73 and baseline drift remains 23

Deliver the scoped behavior, maintained owners and checkable proof. Preserve the exclusions and owner endpoint recorded in the Spec.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/workbench-confirmed-followup | ffa941905c0667c92065d58894f78f35302b31be | ahead 4 behind 0 | 7 | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | RUNBOOK.md; templates/RUNBOOK.md | none in implementation; independent review and delivery still pending | 074bfe01a9fac7c1431cfa0b9b35cdbfb04dcdd1d9802bb1fb1d38f240c25b18 |
| 2 | codex/workbench-confirmed-followup | ffa941905c0667c92065d58894f78f35302b31be | ahead 4 behind 0 | 8 | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | RUNBOOK.md; templates/RUNBOOK.md | none in implementation Git state at close: dirty-tree (13 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005E-readback-skill/tasks/TK-007Q/TASK.md, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005F-workflow-reference/tasks/TK-007R/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-post.json.gz, and 3 more) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA | d28c9ad02852f271146af9ed839b1ab80b63122d3aac3ce2fe161b0c4b21c8e6 |
| 3 | codex/workbench-confirmed-followup | 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc | ahead 12 behind 0 | 12 | corrected code 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc; canonical 55/55 commands pass in 948.2s; focused ADR lifecycle 5/5 and real-Git hook cases 4/4 pass; Blueprint semantic assertion and Wiki validation pass; score remains 73 and baseline drift remains 23 | RUNBOOK.md; templates/RUNBOOK.md; tools/test-blueprint-contract.mjs; tools/test-control-fidelity.mjs; workbench/wiki/design-concepts/workflow-verbs.md; workbench/wiki/design-concepts/idea-to-delivery-workflow.md | none in implementation, fresh assembled review and delivery pending | 86761097593ac8227f824c1797ab0c1ec8d3683c4e3cee29db4c7a6145cf70cc |
| 4 | codex/workbench-confirmed-followup | 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc | ahead 12 behind 0 | 13 | corrected code 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc; canonical 55/55 commands pass in 948.2s; focused ADR lifecycle 5/5 and real-Git hook cases 4/4 pass; Blueprint semantic assertion and Wiki validation pass; score remains 73 and baseline drift remains 23 | RUNBOOK.md; templates/RUNBOOK.md; tools/test-blueprint-contract.mjs; tools/test-control-fidelity.mjs; workbench/wiki/design-concepts/workflow-verbs.md; workbench/wiki/design-concepts/idea-to-delivery-workflow.md | none in implementation Git state at close: dirty-tree (13 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/readback-identity.json, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005F-workflow-reference/proof/control-fidelity-home-red.txt, workbench/specs/S-005F-workflow-reference/tasks/TK-007R/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/corrected-full-suite.txt, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/corrected-guardrail.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/corrected-self-drift.json.gz, and 3 more) and unpushed (ahead 12 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication, local verified completion is not remote delivery or owner Human QA | 28646890cc2d3303003aeb52040ead4936f90fbbeeda8064e510f3f9b5362c32 |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-08 | evidence row 2 (fail verdict at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 on 2026-10-08) | Route the Blueprint semantic assertion to the canonical Runbook and retain a Wiki-link check, then pass mandatory verification |
| 2 | 2026-10-08 | evidence row 2 (fail verdict at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 on 2026-10-08) | Reconcile the current Wiki paragraph that says Review Verify Approve placement is undecided, retaining dated history and separate carrier ownership. |
