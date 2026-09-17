# TK-002 - Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist

**Task ID:** TK-002
**Spec ID:** S-00P
**Slice:** Rewrite `AGENTS.md` to the Task-record workflow using only commands that exist
**Status:** blocked
**Blockers:** TK-001, S-00H, S-00I, S-00J
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red: a control-fidelity assertion that `AGENTS.md` Work Selection And Lifecycle names `TASK.md` as the record `claim` takes and describes the assembled-Spec review and the corrective-Task return path; `TASK.md`, `assembled Spec` and `corrective Task` occur zero times in `AGENTS.md` at the pre anchor and S-00H TK-004 changes vocabulary only, so the assertion stays false until this rewrite; green: the rewritten contract passes it, every backticked `spec-workbench.mjs` command it names exists in the CLI usage string, and the guardrail audit does not fall
