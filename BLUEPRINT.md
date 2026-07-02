# LLM Workbench - Blueprint

**Last reviewed:** 2026-07-01
**Status:** active
**Source root:** `/Users/kayden/GPT_OS/workbench templates` (repo home; remote `github.com/KaydenClark/LLM_Workbench`)

This is the stable reference for what the project is. Keep it factual,
source-backed, and short.

## What This Project Is

LLM Workbench is a reusable control-doc harness for AI-agent projects. It gives
a new or existing repository the files an agent needs before it starts changing
code: behavior rules, read/edit boundaries, project identity, task queue,
operating commands, verification rules, and durable proof. This repository is
both the product (the blank templates in `templates/`) and the first customer
(the filled root docs that govern work here).

Core promise:

> Copy the templates into a repo, fill the placeholders, and any capable agent
> can pick up work, verify it, and leave proof - without relying on chat
> history or one-off instructions.

Primary users:

- The owner, working as an "executive coder": designs systems, sets direction,
  answers why-questions and tradeoffs - and should never need to read code or
  debug to know where a project stands.
- Coding agents (Claude, Codex, or any agent that reads repository
  instructions) doing the implementation, verification, and documentation.

## Founding Intent

The owner's own words, preserved as the constitution for this harness:

> I want to be an 'executive coder'. I don't want to look at code and dive into
> why the code is breaking. I want to design the systems, ask the why
> questions, set the plot on the map. These should be the ruleset for updating
> and building the ruleset. A model should be able to take a prompt just like
> this one and build out a new project with files just like these all filled
> out on its own.

Every harness change should be testable against that intent: does it keep the
owner at executive altitude, and does it move toward one-prompt bootstrap?

## Non-Goals

This project is not trying to:

- be a framework, library, or runtime dependency - the product is plain
  Markdown plus small zero-dependency helper scripts;
- be model- or vendor-specific - the templates must work for any agent that
  reads repository instructions;
- define a house visual style for downstream projects;
- replace project-native tooling (test runners, CI, linters) - it tells agents
  when to run them, not how to build them.

## Current Product Shape

When the harness is working, a downstream project has:

- `AGENTS.md` - agent behavior, authority order, read/edit scope,
  task-selection loop, documentation ownership, proof rules;
- `BLUEPRINT.md` - stable project identity, direction, architecture,
  invariants, safety boundaries, preserved decisions;
- `TASKBOARD.md` - live task queue with status lanes and an append-only proof
  log, fronted by an executive interface: a standing five-line executive brief
  and a pending-decision queue (options, recommendation, cost) that keep the
  owner at executive altitude;
- `RUNBOOK.md` - setup, run, test, build, recovery, and evaluation procedure.

Optionally, a project can start from `GENESIS.md` - a one-time bootstrap protocol
that turns a single founding prompt into the four filled control docs plus a
smallest-running scaffold, then hands off to the normal work loop.

Milestone tasks additionally require a <1-minute demo artifact (screenshot,
recording, preview URL, or one-command demo) recorded in the taskboard proof
log's Demo column, so the owner accepts work on product truth, not test output
alone.

The most important quality bar is: **verification honesty** - what the docs
claim must match what independently rerun checks show.

## Direction And Build Order

Current phase:

- Dogfooding and gap-closing: the repo now runs on its own harness; next work
  closes the gaps between the current templates and the founding intent.

Build order:

1. Dogfood the harness in this repo (done 2026-07-01) - credibility first.
2. Genesis protocol - a model can bootstrap a filled project from one prompt.
3. Executive interface - brief, decision queue, escalation contract.
4. Lifecycle hardening - stale claims, log archival, template versioning.
5. Feedback loop - downstream projects feed harness lessons back here, and
   evals validate template changes before they ship.

The executable task queue lives in `TASKBOARD.md`.

## Architecture

| Layer | Choice | Source / Notes |
|---|---|---|
| Runtime | none for templates; Node >= 18 for `tools/` | zero npm dependencies |
| Evals | Python 3 (`evals/`), Node (`outcomes/`, `tools/`) | stdlib only |
| Frontend | none | |
| Backend | none | |
| Database/storage | none - plain Markdown files | |
| Testing | `tools/test-*.mjs` self-tests; `evals/` trial framework | see `RUNBOOK.md` |
| Deployment | GitHub repo `KaydenClark/LLM_Workbench` | MIT licensed |

Architecture constraints:

- Templates must remain plain Markdown, readable by any agent, no
  preprocessing required.
- Helper tools must stay dependency-free (Node/Python stdlib only).
- Nothing in this repo may require paid services to develop or verify.

## Directory Map

```text
LLM_Workbench/
├── AGENTS.md            <- real agent rules for THIS repo (dogfood)
├── BLUEPRINT.md         <- this file (dogfood)
├── TASKBOARD.md         <- live task queue and proof log for THIS repo (dogfood)
├── RUNBOOK.md           <- real commands for THIS repo (dogfood)
├── README.md            <- public-facing overview and usage
├── CLAUDE.md            <- thin Claude Code entry point (@AGENTS.md)
├── templates/           <- THE PRODUCT: blank, copyable control docs
├── team templates/      <- manager/subagent coordination templates
├── research templates/  <- folder-per-investigation research workflow
├── tools/               <- evaluator, trial runner, context packer (zero-dep)
├── evals/               <- runnable comparison framework (Python)
├── outcomes/            <- controlled task-trial fixtures and self-tests
└── benchmarks/          <- static-rubric scoring docs and results
```

## Main Contracts

### Commands

| Command | Purpose | Required for done? |
|---|---|---|
| `node tools/test-evaluate-workbench.mjs` | evaluator self-test; scores repo root | yes |
| `node tools/test-context-tools.mjs` | context-pack and research-tool tests | yes |
| `node tools/test-outcome-trials.mjs` | outcome-trial runner tests | yes |
| `node tools/evaluate-workbench.mjs --path templates --include-controls` | score the blank templates | yes for template changes |

## Core Logic And Invariants

The harness encodes one core loop: **select task -> smallest change -> verify
-> leave proof -> update docs**. The templates exist to make that loop survive
agent handoffs, context summaries, and multi-agent runs.

Rules:

- `templates/` files stay generic; placeholders stay `[BRACKETED]`.
- Root control docs stay real and current; no placeholder leakage.
- Proof logs are append-only everywhere (root and templates).
- Template design changes land in both the template and, when applicable, this
  repo's own filled instantiation.
- Claims that a template version is "better" require eval evidence, not taste.

Do not duplicate this logic in:

- README.md (it summarizes; the contracts live in the four control docs).

## Trust, Privacy, And Safety Boundaries

Sensitive data:

- none by design - this is a public MIT-licensed repo.

Rules:

- Never commit secrets, tokens, `.env` files, or personal data.
- `research papers/` is local-only reference material; it stays untracked
  unless the owner explicitly decides to publish it.
- Agents open PRs; the owner merges. No agent self-merge.

## Known Risks

| Risk | Impact | Mitigation / owner |
|---|---|---|
| `codex/structured-metadata-guardrails` branch adds YAML frontmatter on the old ROADMAP layout | divergent harness dialects; merge conflicts | rebase or fold into v2 deliberately (TASKBOARD T-006) |
| Template quality claims outpace eval evidence | harness cargo-culting | RUNBOOK evaluation policy; evals/ before "better" claims |
| Root docs and templates/ drift apart | dogfood stops matching the product | Dogfood Boundary rule in `AGENTS.md`; evaluator self-test scores root |

## Design Decisions

| Decision | Rationale | Date / Source |
|---|---|---|
| Replace ROADMAP.md with TASKBOARD.md | roadmap mixed direction with queue; taskboard separates lanes, claims, and proof for multi-agent work | 2026-07-01 / Workbench_v2, PR #5 |
| Dogfood split: real docs at root, blank product in `templates/` | the harness must govern its own repo or it has no credibility; the product must stay copy-ready | 2026-07-01 / this migration |
| Preserve the founding prompt verbatim in BLUEPRINT | drift-checks against the owner's actual words, not paraphrases | 2026-07-01 |
| Zero-dependency tooling | templates must be adoptable without installs | 2026-06 / repo inception |
| Add `GENESIS.md` one-prompt bootstrap protocol to `templates/` | moves the harness toward the founding intent that a model can build a filled project from one prompt; keeps bootstrap as a one-time protocol distinct from the standing control docs | 2026-07-01 / TASKBOARD T-002 |
| Add an executive interface (five-line brief + pending-decision queue) to the taskboard, plus an escalation-language contract in the agents doc | keeps the owner at executive altitude: a glance shows project state, and technical blockers reach the owner as product tradeoffs, never code-level failures | 2026-07-01 / TASKBOARD T-003 |
| Require a <1-minute demo artifact (Demo column) for milestone tasks | the executive accepts work on product truth, not passing tests alone; a fast demo is the cheapest honest signal that the product does what was asked | 2026-07-01 / TASKBOARD T-004 |

## Health Criteria

The project is healthy when:

- all three `tools/test-*.mjs` self-tests pass;
- the evaluator scores the repo root >= 90 (dogfood docs rubric-complete);
- the blank templates in `templates/` also pass the rubric;
- `TASKBOARD.md` reflects reality (no stale claims, proof rows match reruns);
- no placeholder text exists in root control docs, and no repo-specific text
  exists in `templates/`.

Verification commands live in `RUNBOOK.md`. Current task status and proof
history live in `TASKBOARD.md`.
