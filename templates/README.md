# [PROJECT_NAME]

> Generated from LLM Workbench v[HARNESS_VERSION]. See `RUNBOOK.md` ->
> Upgrading The Harness.

[ONE-SENTENCE DESCRIPTION OF WHAT THIS PROJECT DOES AND FOR WHOM.]

[OPTIONAL: a short paragraph of context - the problem it solves, who uses it,
and the current state (prototype, in production, internal tool, etc.).]

## How This Project Is Run

This repository is governed by a small set of control documents. Read them
before changing anything:

- [`AGENTS.md`](AGENTS.md) - how agents behave here: authority order, read/edit
  scope, the task-selection loop, documentation ownership, and proof rules.
- [`BLUEPRINT.md`](BLUEPRINT.md) - what this project is: identity, direction,
  architecture, invariants, and preserved decisions. Stable and source-backed.
- [`TASKBOARD.md`](TASKBOARD.md) - the live work queue and append-only proof
  log. Its **Executive Brief** (top of the file) is the one-glance status for
  anyone who does not want to read code.
- [`RUNBOOK.md`](RUNBOOK.md) - how to set up, run, test, build, and recover this
  project, plus the verification commands that gate "done".

If this project was bootstrapped from a single founding prompt, the one-time
protocol that produced these docs is preserved in [`GENESIS.md`](GENESIS.md).
It runs once at project start; after handoff, the four control docs above
govern.

## Getting Started

```bash
[INSTALL COMMAND]      # e.g. npm install / pip install -e . / make setup
[RUN COMMAND]          # e.g. npm run dev / python -m app
[TEST COMMAND]         # e.g. npm test / pytest
```

Full setup, environment, and troubleshooting steps live in
[`RUNBOOK.md`](RUNBOOK.md).

## Working With Agents

The control docs are intentionally plain Markdown so they work with Codex,
Claude, or any other agent that reads repository instructions - no framework or
preprocessing required.

For **Claude Code**, add a one-line `CLAUDE.md` containing `@AGENTS.md`, or run
`/init` in this repo, so the rules load automatically. Other agents should be
pointed at `AGENTS.md` as their entry point.

Every completed agent task must leave proof in its final response and in the
`TASKBOARD.md` proof log. Milestone tasks additionally require a short demo
artifact (screenshot, recording, preview URL, or one-command demo) so work is
accepted on product truth, not passing tests alone.

## Project Status

See the **Executive Brief** at the top of [`TASKBOARD.md`](TASKBOARD.md) for the
current shipping state, health, any decision the owner needs to make, blockers,
and the next milestone.

## License

[LICENSE - e.g. MIT. See `LICENSE`.]
