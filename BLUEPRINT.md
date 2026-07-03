# LLM Workbench - Blueprint

**Last reviewed:** 2026-07-01
**Status:** active
**Harness version:** v2.1 (the version templates stamp into downstream projects; this repo is the source, so its own control docs carry no `Generated from` stamp)
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
smallest-running scaffold, then hands off to the normal work loop. For a project
that already exists (often on an older or foreign harness), the counterpart is
`ADOPTION.md` - a one-time migration protocol that derives the four control docs
from the running repo and reconciles the prior harness into the v2 layout without
losing content.

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
4. Lifecycle hardening - stale claims, log archival, template versioning (done
   2026-07-01, T-005).
5. Feedback loop - downstream projects feed harness lessons back here, and
   evals validate template changes before they ship (convention shipped
   2026-07-01, T-008; first real harvest deferred to T-011 when a downstream
   project reports feedback).

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
| ~~`codex/structured-metadata-guardrails` branch adds YAML frontmatter on the old ROADMAP layout~~ (resolved 2026-07-01, D-001) | divergent harness dialects; merge conflicts | closed: PR #4 targeted the retired ROADMAP layout; its one portable idea (machine-readable scope keys) was extracted into T-007, and the branch was closed rather than carried forward |
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
| Close `codex/structured-metadata-guardrails` (PR #4); extract only its machine-readable scope idea | the branch's YAML frontmatter + guardrails were written against the retired root-ROADMAP layout, so rebasing meant porting a dead layout for little gain; the durable idea (declarative `writable_roots`/`forbidden_paths`/`requires_review_for` scope keys) is folded into T-007's mechanical scope enforcement instead | 2026-07-01 / D-001, TASKBOARD T-006 |
| Add `ADOPTION.md`, a migration protocol sibling to `GENESIS.md`, for existing projects on an older/foreign harness | GENESIS is green-field (frame prompt -> scaffold smallest thing that runs); it does not fit a live repo that already has code and a prior harness. Adoption inverts the spine - observe reality, classify and map the old docs into the v2 layout without losing content, verify on the existing test suite - which the retrofit case genuinely needs. First real target: an existing project on the retired ROADMAP dialect | 2026-07-01 / TASKBOARD T-012 |
| Add a `HARNESS_FEEDBACK.md` return channel to templates + a standing evals-validated harvest task here | closes the founding-intent loop ("the ruleset that updates the ruleset"): downstream projects log where harness rules fail, lessons are harvested back and validated via `evals/` as a `c3_candidate` before shipping as "better", so harness changes rest on evidence not taste. Root is the harvest destination, so it carries no `HARNESS_FEEDBACK.md` of its own | 2026-07-01 / TASKBOARD T-008 |
| Add lifecycle hardening to templates: stale-claim reclaim rule, proof-log archival to `TASKBOARD_ARCHIVE.md` past ~30 rows, and `Generated from LLM Workbench vX` version stamps + an Upgrading The Harness note | long-running downstream projects hit all three - abandoned claims, unbounded proof logs, and silent harness drift; the stamp lets a project tell when it is behind. This repo is the version *source* (v2.1), so its own docs carry the version in BLUEPRINT rather than a per-doc `Generated from` stamp | 2026-07-01 / TASKBOARD T-005 |
| Ship `.claude/settings.json` scope enforcement as a template only; exempt this repo's own root from a live config | the template is the product; adding a live agent config to the governing repo is a self-modification the owner did not request, and the workbench has no secrets and legitimately edits nearly every path, so mechanical deny-rules would protect little while risking the running agent's own permission flow. The prose scope in root `AGENTS.md` plus `research papers/` being untracked already cover the real forbidden paths | 2026-07-01 / TASKBOARD T-007 |

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
