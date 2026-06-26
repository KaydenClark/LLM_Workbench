# Outcome Trials

Outcome trials test whether a template changes agent behavior on task work.
They are separate from `tools/evaluate-workbench.mjs`, which only checks static
coverage of the template files.

Use this layer to test the hypothesis:

- LLM Workbench beats no template.
- LLM Workbench beats a generic single-file agent instruction.
- LLM Workbench beats external templates only after those external templates are
  included as conditions and run through the same tasks.

## What Counts As Evidence

A real evidence run uses:

- the same task fixture for every condition;
- the same prompt for every condition;
- the same agent command, model, permissions, and time budget;
- deterministic grading from files and tests after the run;
- enough repeated trials to separate signal from model noise.

The included mock agent is only a self-test for the harness. It proves the
runner, grader, and scorer can detect outcome differences. It does not prove
that a real LLM behaves better with the workbench.

## Run The Self-Test

```bash
node tools/test-outcome-trials.mjs
```

## Run A Real Trial

Replace the command below with the headless agent you want to test. The command
runs inside each fresh task repo. It receives:

- `OUTCOME_PROMPT` - full task prompt text;
- `OUTCOME_PROMPT_FILE` - path to the prompt file inside the temp repo;
- `OUTCOME_TASK_REPO` - path to the temp repo.

```bash
node tools/run-outcome-trials.mjs \
  --task outcomes/tasks/discount-bounds \
  --conditions control:none,control:single-file,workbench:local \
  --trials 10 \
  --agent-command 'YOUR_AGENT_COMMAND_HERE' \
  --out outcomes/results/run_$(date +%F).jsonl

node tools/score-outcome-trials.mjs \
  outcomes/results/run_$(date +%F).jsonl \
  --baseline control:single-file \
  --report outcomes/results/report_$(date +%F).md
```

## Add External Templates

Add a condition to `outcomes/conditions/conditions.json` with `"type": "path"`
and a file list. That lets an external `AGENTS.md`, `CLAUDE.md`, or Cursor-rule
style template compete against LLM Workbench on the same task suite.

