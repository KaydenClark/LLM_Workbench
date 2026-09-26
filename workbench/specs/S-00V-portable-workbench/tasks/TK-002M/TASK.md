# TK-002M - Medium: workbench/tools/claim-coordination.mjs excludes origin/<integration> but not origin/<defaultBranch> from the remote-claim overlay, so default-branch state can be read as a competing claim

**Task ID:** TK-002M
**Spec ID:** S-00V
**Slice:** Medium: workbench/tools/claim-coordination.mjs excludes origin/<integration> but not origin/<defaultBranch> from the remote-claim overlay, so default-branch state can be read as a competing claim
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00V Acceptance Criteria
**Planned verification:** Answers evidence row 36 (fail verdict at 90680eb683ec48dbbcbea06b282bafa094e9c9d5 on 2026-09-26): Medium: workbench/tools/claim-coordination.mjs excludes origin/<integration> but not origin/<defaultBranch> from the remote-claim overlay, so default-branch state can be read as a competing claim
**Proof:** Answers the fail verdict at 90680eb683ec48dbbcbea06b282bafa094e9c9d5: workbench/tools/claim-coordination.mjs excluded origin/<integration> but not origin/<defaultBranch> from the remote-claim overlay. Red: new case (5b) in the TK-01L block of tools/test-spec-workbench.mjs (origin/main carries TK-002 in-progress while integration has it ready) failed on the committed test-only tree: next returned null because origin/main was read as a claim. Green: the overlay now excludes both shared branches (the integration base and the manifest default branch); tools/test-spec-workbench.mjs passes. Provenance: TK-002M was set to in-progress by editing its record, not by claim, because the corrective Task was created on this branch after TK-01L closed and claim would now cut and push a new branch; close then took TK-002M as the only in-progress Task.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00v-tk01l-push-on-claim | 74c385788b6a574149c7f67b6f5747b64abb2402 | ahead 0 behind 0 | 0 | Answers the fail verdict at 90680eb683ec48dbbcbea06b282bafa094e9c9d5: workbench/tools/claim-coordination.mjs excluded origin/<integration> but not origin/<defaultBranch> from the remote-claim overlay. Red: new case (5b) in the TK-01L block of tools/test-spec-workbench.mjs (origin/main carries TK-002 in-progress while integration has it ready) failed on the committed test-only tree: next returned null because origin/main was read as a claim. Green: the overlay now excludes both shared branches (the integration base and the manifest default branch); tools/test-spec-workbench.mjs passes. Provenance: TK-002M was set to in-progress by editing its record, not by claim, because the corrective Task was created on this branch after TK-01L closed and claim would now cut and push a new branch; close then took TK-002M as the only in-progress Task. | Code comment in workbench/tools/claim-coordination.mjs; no control, template or Wiki change | none for this finding; TK-01L's remaining gap is unchanged | 24c3b092c05271a9f206dd6ba8530ae83722dcb14fb18e7aa4b70b4ba6fc5c5e |
