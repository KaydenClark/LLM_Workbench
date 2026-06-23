# Workbench Evaluation Results

Append-only evidence log for LLM Workbench benchmark runs. Use actual command output or a named manual check; do not record vibes.

| Date | Candidate(s) | Proof | Result | Remaining gap |
|---|---|---|---|---|
| 2026-06-23 | `main`, `claude/harness-template-upgrades-v2`, local folder, `control:no-template`, `control:single-instruction-file` | `node tools/test-evaluate-workbench.mjs`; `node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench --branches main,claude/harness-template-upgrades-v2 --include-controls`; `node tools/evaluate-workbench.mjs --path . --include-controls` | pass; `main` 84.5/100, Claude branch 100/100, local 100/100, no-template 0/100, single-instruction control 2/100 | Static rubric proves coverage, not causal agent behavior. Next proof step is controlled task trials against external templates. |
