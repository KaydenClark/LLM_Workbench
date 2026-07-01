# LLM Workbench

LLM Workbench is a reusable harness template for AI-agent projects. It gives a
new or existing repository the control files an agent needs before it starts
changing code: authority order, read/edit boundaries, project intent, operating
commands, verification rules, and durable handoff logs.

Use this repo when you want an AI agent to work inside a project with clear
guardrails instead of relying on chat history or one-off instructions.

## What This Contains

- `AGENTS.md` - agent behavior, authority order, read/edit scope, TDD rules,
  documentation ownership, and proof-of-done requirements.
- `CLAUDE.md` - a thin Claude Code bridge that imports `AGENTS.md`.
- `BLUEPRINT.md` - stable project identity, architecture, invariants, and
  safety boundaries.
- `ROADMAP.md` - current state, next work, blockers, backlog, and verification
  log.
- `RUNBOOK.md` - setup, run, test, build, troubleshooting, and recovery
  commands.
- `team templates/` - optional manager, subagent, and taskboard templates for
  multi-agent workflows.
- `benchmarks/` - evaluation protocol and results log for proving template
  improvements over time.
- `outcomes/` - controlled task-trial fixtures, conditions, and self-tests for
  measuring real agent outcomes.
- `research templates/` - lightweight folder-per-investigation workflow for
  durable research reports.
- `tools/evaluate-workbench.mjs` - static rubric scorer for local folders and
  GitHub branches.
- `tools/run-outcome-trials.mjs` - runs the same task under multiple instruction
  conditions and records scored result rows.
- `tools/score-outcome-trials.mjs` - summarizes outcome-trial rows with lifts
  against a chosen baseline.
- `tools/context-pack.mjs` - dependency-free prompt packer inspired by
  `simonw/files-to-prompt`.
- `tools/new-research-project.mjs` - creates a Simon-style research folder with
  `notes.md` and `README.md`.
- `LICENSE` - MIT license for reuse and adaptation.

## How To Use It

1. Copy the relevant templates into the target project.
2. Replace bracketed placeholders with project-specific paths, commands, and
   rules.
3. Keep `ROADMAP.md` current as work changes state.
4. Treat documentation as part of the task owner's work; no task is done while
   the docs still describe the old state.
5. Require every completed agent task to leave proof in the final response and
   in the verification log.

The templates are intentionally plain Markdown with small YAML front matter
blocks. Humans can read them normally, while a harness or evaluator can parse
the metadata for writable roots, forbidden paths, review triggers, quality
gates, ownership, and proof expectations.

Visual-design starters are intentionally separate from this workbench. Use a
project-local design brief, a reusable design template, or the original product
prompt as input for UI work; do not force every project into one default visual
style.

Note for Claude Code: it reads `CLAUDE.md`, not `AGENTS.md`, by default. Copy
the included `CLAUDE.md` bridge, or run `/init` in the target repo and import
`@AGENTS.md`, so these rules load automatically.

## How To Test Improvements

Run the static evaluator before merging template changes:

```bash
node tools/evaluate-workbench.mjs --path . --include-controls
```

Compare GitHub branches:

```bash
node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench --branches main,branch-name --include-controls
```

The scorer proves coverage of the expected control surfaces. For stronger
evidence, use `outcomes/README.md` to run controlled task trials and record
outcomes. The included mock-agent self-test verifies the harness itself; it is
not evidence that real agents improve.

The evaluator also checks research-backed template claims: parseable YAML front
matter, Claude bridge coverage, prompt-injection boundaries, guardrail guidance,
CI/CD security defaults, and traceable proof expectations.

```bash
node tools/test-outcome-trials.mjs
```

To prove real-world improvement, run `tools/run-outcome-trials.mjs` with the
same real agent command across controls, external templates, and LLM Workbench,
then score the JSONL result file with `tools/score-outcome-trials.mjs`.

## Context And Research Workflow

Use this when you want to package project files for a model or run a durable
research investigation instead of leaving the work trapped in chat history.

Package selected files into Markdown:

```bash
node tools/context-pack.mjs AGENTS.md BLUEPRINT.md ROADMAP.md RUNBOOK.md \
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

Verify these local tools:

```bash
node tools/test-context-tools.mjs
```

## License

MIT. See `LICENSE`.
