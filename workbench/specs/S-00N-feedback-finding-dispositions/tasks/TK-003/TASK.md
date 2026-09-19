# TK-003 - Require the disposition field in both `REPORT_FORMAT.md` copies

**Task ID:** TK-003
**Spec ID:** S-00N
**Slice:** Require the disposition field in both `REPORT_FORMAT.md` copies
**Status:** in-progress
**Blockers:** TK-001
**Destination:** spec-acceptance: S-00N Acceptance Criteria
**Planned verification:** Red: the two report formats omit disposition; green: root and generic template copies require it, with guardrail and template evaluation passing

**Stance:** Builder

Update both report-format owners together, preserving the generic template
boundary and `[BRACKETED]` placeholders. Do not disposition findings in this
Task.

Implementation is pipelined from the tested TK-001 vocabulary at `28506c6` by
coordinator direction. TK-001 and this Task remain open for the shared immutable
verification gate; the prerequisite is not falsely reported closed.
