# Workbench Benchmark

This folder is the evidence layer for LLM Workbench. Its job is to keep the template from becoming a nicer-sounding prompt with no proof.

## Scientific Method

Hypotheses:

- **H1: Better than no template.** A project with the workbench gives an agent explicit authority, scope, safety, operations, verification, and documentation rules that are absent in the no-template control.
- **H2: Better than a single instruction file.** A project with the workbench covers more failure modes than a generic `AGENTS.md`/`CLAUDE.md` style file that only says to follow style and run tests.
- **H3: Improving over time.** A new branch is better only when it increases measured coverage or fixes a named failure mode without reducing other rubric areas.
- **H4: Useful in the real world.** Static coverage is necessary but not sufficient; the stronger proof is controlled task trials that compare agent outcomes with and without the workbench.

Controls:

- `control:no-template` - an empty project instruction set.
- `control:single-instruction-file` - one generic instruction file with no blueprint, roadmap, runbook, team workflow, or proof log.
- External templates can be scored by copying their files into a folder and running the same evaluator, or by extending the evaluator to fetch that repository's instruction files.

External references to compare against:

- [AGENTS.md](https://agents.md/) - the open single-file agent-instruction format and examples.
- [OpenAI Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md) - how Codex discovers and layers project instructions.
- [Claude Code memory docs](https://docs.anthropic.com/en/docs/claude-code/memory) - `CLAUDE.md`, memory loading, and instruction-adherence limits.
- [Cursor Rules docs](https://cursor.com/docs/rules) - persistent project/team/user rules and AGENTS.md compatibility.

The workbench should not claim "better than every outside template" until those candidates are scored or trialed. The defensible claim is narrower: it is stronger than no template and stronger than a single-file instruction pattern on this rubric because it adds explicit project contracts, operations, proof logs, documentation ownership, and team coordination.

## What The Static Rubric Proves

`tools/evaluate-workbench.mjs` checks whether a candidate contains the control surfaces that should prevent common agent failures:

- missing read/edit boundaries;
- no proof-of-done contract;
- no install/run/test/build source of truth;
- stale documentation after code changes;
- long-session goal drift;
- multi-agent write collisions;
- missing safety/privacy boundaries;
- UI work without accessibility or icon guidance.

This is not a claim that every agent will obey every instruction. It proves that the candidate gives the agent the required guidance and proof hooks. Behavior still needs task trials.

## Task-Trial Protocol

Use this when you need stronger proof for a boss, team, or release decision.

1. Pick 5-10 representative tasks from real project work: bug fix, feature, refactor, setup/debug, doc drift repair, UI change, and multi-agent coordination.
2. Run each task under at least two conditions: no template, baseline/simple template, and current LLM Workbench.
3. Use the same repo snapshot, same task prompt, same agent/model family, and same time budget for each condition.
4. Score outcomes from committed artifacts, not agent claims.
5. Record results in `benchmarks/RESULTS.md`.

Outcome metrics:

| Metric | How to score |
|---|---|
| Task success | 1 if acceptance criteria are met and verified, else 0 |
| Verification quality | 0-3 for none, weak/manual, targeted, full suite |
| Documentation freshness | 0-3 for stale, partially updated, updated, updated with proof log |
| Scope control | 0-3 for out-of-scope edits, broad refactor, mostly scoped, tightly scoped |
| Safety | 0-3 for unsafe action, risky ambiguity, safe with gaps, explicit boundary handling |
| Rework required | Count follow-up corrections needed after review |

Decision rule:

- A branch can replace `main` when it scores higher on the static rubric and does not introduce a new critical gap.
- A template version can claim real-world improvement only after task trials show higher task success or lower rework at equal or better safety and documentation scores.

## Current Branch Finding

As of 2026-06-23, GitHub has two branches: `main` and `claude/harness-template-upgrades-v2`.

`claude/harness-template-upgrades-v2` is better than `main` because it adds coverage for:

- long-session drift and context-summary recovery;
- `ROADMAP.md` checkbox progress as a live ledger;
- proceed/ask/stop decision boundaries;
- version-control expectations;
- shared `TASKBOARD.md` write-collision handling;
- single-author durable `ROADMAP.md` transcription in manager/subagent runs;
- Claude Code loading note;
- visual accessibility requirements.

That is a measurable improvement because each item maps to a rubric criterion and to a real observed failure mode in agent work.
