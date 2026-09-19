# TK-003 - Require the disposition field in both `REPORT_FORMAT.md` copies

**Task ID:** TK-003
**Spec ID:** S-00N
**Slice:** Require the disposition field in both `REPORT_FORMAT.md` copies
**Status:** done
**Blockers:** TK-001
**Destination:** spec-acceptance: S-00N Acceptance Criteria
**Planned verification:** Red: the two report formats omit disposition; green: root and generic template copies require it, with guardrail and template evaluation passing

**Stance:** Builder
**Proof:** Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md.

Update both report-format owners together, preserving the generic template
boundary and `[BRACKETED]` placeholders. Do not disposition findings in this
Task.

Implementation is pipelined from the tested TK-001 vocabulary at `28506c6` by
coordinator direction. TK-001 and this Task remain open for the shared immutable
verification gate; the prerequisite is not falsely reported closed.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/parallel-repair-assembly | 6bf32fc2e414de8be439622f73a00f76d762bbf3 | none | 9 | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. | 8df0f24ea7ee3cf26263c5c39e270b6ec92c784d0067668cbd2310a9bce2794c |
