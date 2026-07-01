# LLM Workbench

LLM Workbench is a reusable control-doc template for AI-agent projects. It gives
a new or existing repository the files an agent needs before it starts changing
code: behavior rules, read/edit boundaries, project identity, task queue,
operating commands, verification rules, and durable proof.

Use it when you want agents to work from the same local source of truth instead
of relying on chat history or one-off instructions.

## Core Files

- `AGENTS.md` - agent behavior, authority order, read/edit scope, task-selection
  loop, documentation ownership, and proof rules.
- `BLUEPRINT.md` - stable project identity, product direction, architecture,
  invariants, safety boundaries, and preserved decisions.
- `TASKBOARD.md` - live task queue, blocked/deferred lanes, current handoff, and
  proof log.
- `RUNBOOK.md` - setup, run, test, build, troubleshooting, recovery, and
  evaluation procedure.
- `README.md` - human-facing overview and usage.

`ROADMAP.md` is no longer part of the default harness. Put stable product
direction in `BLUEPRINT.md` and executable next work in `TASKBOARD.md`.

## Supporting Files

- `team templates/` - optional manager/subagent coordination templates for
  small multi-agent runs.
- `benchmarks/` - static-rubric scoring docs and result summaries.
- `outcomes/` - controlled task-trial fixtures and self-tests.
- `evals/` - runnable comparison framework for measuring whether template
  versions change agent outcomes.
- `research templates/` - lightweight folder-per-investigation workflow for
  durable research reports.
- `tools/evaluate-workbench.mjs` - static rubric scorer for local folders and
  GitHub branches.
- `tools/run-outcome-trials.mjs` and `tools/score-outcome-trials.mjs` -
  lightweight outcome-trial runner and scorer.
- `tools/context-pack.mjs` - dependency-free prompt packer inspired by
  `simonw/files-to-prompt`.
- `tools/new-research-project.mjs` - creates a Simon-style research folder with
  `notes.md` and `README.md`.
- `LICENSE` - MIT license for reuse and adaptation.

## How To Use It

1. Copy `AGENTS.md`, `BLUEPRINT.md`, `TASKBOARD.md`, `RUNBOOK.md`, and
   `README.md` into the target project.
2. Replace bracketed placeholders with project-specific paths, commands, rules,
   and task items.
3. Keep `BLUEPRINT.md` stable and source-backed.
4. Keep `TASKBOARD.md` current as work changes state.
5. Treat documentation as part of the task owner's work.
6. Require every completed agent task to leave proof in the final response and
   in the `TASKBOARD.md` proof log.

The templates are intentionally plain Markdown so they work with Codex, Claude,
or any other agent that reads repository instructions.

For Claude Code, add a one-line `CLAUDE.md` containing `@AGENTS.md`, or run
`/init` in the target repo, so these rules load automatically.

## Visual And Asset Guidance

This workbench does not define a house visual style. Use project-local design
docs, screenshots, brand requirements, or the original product prompt.

When visual work needs assets, search for license-safe free assets before adding
new files, record attribution requirements, and avoid emoji as interface icons
when a real icon, symbol, or text label can do the job.

## How To Test Template Changes

Run the static evaluator before merging template changes:

```bash
node tools/test-evaluate-workbench.mjs
node tools/evaluate-workbench.mjs --path . --include-controls
```

Compare GitHub branches:

```bash
node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench \
  --branches main,branch-name --include-controls
```

The static scorer proves coverage of expected control surfaces. For stronger
evidence, use `RUNBOOK.md` -> Evaluation And Benchmarking plus `evals/` or
`outcomes/` to run controlled task trials and record outcomes.

Verify the local helper tools:

```bash
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
```

## Context And Research Workflow

Package selected files into Markdown:

```bash
node tools/context-pack.mjs AGENTS.md BLUEPRINT.md TASKBOARD.md RUNBOOK.md \
  --markdown --line-numbers \
  --output context.md
```

Package a larger folder into Claude XML-style documents:

```bash
node tools/context-pack.mjs . --cxml --extension md --ignore "context.md"
```

Start a new research folder:

```bash
node tools/new-research-project.mjs \
  --root research \
  --slug agent-context-packing \
  --title "Agent Context Packing" \
  --question "How should agents package project context?"
```

This pattern is adapted from Simon Willison's
[`files-to-prompt`](https://github.com/simonw/files-to-prompt) and
[`research`](https://github.com/simonw/research): gather the right files, keep
running notes, and turn the final investigation into a source-backed README.

## License

MIT. See `LICENSE`.
