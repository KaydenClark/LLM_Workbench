# LLM Workbench - Runbook

**Last reviewed:** 2026-09-04
**Runtime owner:** Kayden
**Environment:** local (macOS); public repo `github.com/KaydenClark/LLM_Workbench`

This file explains how to operate, verify, and evaluate the workbench repo
itself. It should be boring, exact, and executable.

## Ordinary Entry

Follow `AGENTS.md` -> this section -> `LEXICON.md` -> Task Routing. Inspect the
root, branch, upstream and dirty state; run the project-local spec doctor and
load the explicitly assigned spec. For owner-directed pickup, use `next --json`
and `show` to resolve that assignment. The spec and ticket set the normal
stance. Investigate within the task; do not invent a next task when blocked.
Load remaining Runbook sections only for the operation being performed.

For a setup-only Round One assignment, a fresh agent follows that route, checks
the manifest, relevant Wiki and ADRs, and runs read-only configuration checks.
Return the result in chat only: no feedback report, handoff, checkpoint,
self-created task, or other prose artifact. Round One precedes feedback testing.

## Prerequisites

Required tools:

- Node.js >= 18 (zero npm dependencies; nothing to install)
- Python 3.9+ (stdlib only, for `evals/`)
- git, and the `gh` CLI for PR workflows

Required accounts/services:

- GitHub (repo `KaydenClark/LLM_Workbench`)

There is no environment configuration and no `.env`.

## Install

Nothing to install. Clone and go:

```bash
git clone https://github.com/KaydenClark/LLM_Workbench.git
```

Expected result: all `tools/` scripts run directly on Node >= 18 with zero
npm dependencies.

## Run Locally

There is no server. "Running" this project means running the evaluator and
self-tests directly:

```bash
node tools/evaluate-workbench.mjs --path templates --include-controls
```

Expected result: a Markdown score table where the templates beat both control
candidates.

## Test And Build

Fast check (run for any change to `tools/`, `templates/`, or root docs):

```bash
node tools/test-evaluate-workbench.mjs
```

Full verification:

```bash
node tools/test-spec-workbench.mjs
node tools/test-team-coordination.mjs
node tools/test-team-coordination-demo.mjs
node tools/test-skill-catalog.mjs
node tools/test-core-skill-installer.mjs
node tools/test-workbench-layout.mjs
node tools/test-workbench-adoption.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-workbench-tools.mjs
node tools/test-diagnostics.mjs
node tools/test-adr.mjs
node tools/test-governance-core.mjs
node tools/test-branch-closeout.mjs
node tools/test-wiki.mjs
node tools/test-sessions.mjs
node tools/test-workbench-round-trip.mjs
node tools/test-cross-provider-fixture.mjs
node tools/test-portability-matrix.mjs
node tools/test-workbench-dogfood.mjs
node tools/test-evaluate-workbench.mjs
node tools/test-guardrail-audit.mjs
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
node tools/test-eval-runner.mjs
node tools/test-feedback-automation.mjs
node tools/test-socket-contract.mjs
node tools/test-symlink-invocation.mjs
python3 evals/tasks/task_b_path_safety/test_grade.py
node tools/evaluate-workbench.mjs --path templates --include-controls
node workbench/tools/spec-workbench.mjs doctor
```

Expected result:

- each test script prints an `ok -` line and exits 0;
- the evaluator self-test reports the repo-root score (dogfood docs) >= 90;
- the `--path templates` run shows the blank templates beating both control
  candidates.
- spec doctor reports no duplicate IDs, invalid/contradictory states, stale
  claims, missing evidence, broken links, or generated-region drift.

### Core-skill setup check

The public source bundle is intentionally limited to the 16 skills in
`skills/README.md`. Test the missing-only installer against a disposable user
home without touching a real account:

```bash
node tools/core-skill-installer.mjs install --home /tmp/workbench-user-home
node tools/test-core-skill-installer.mjs
```

The installer writes only missing core skill directories into
`.agents/skills` and `.claude/skills`. It preserves existing names without a
content comparison and blocks before mutation when either discovery root is
Git-owned or a required skill path collides with a file or symlink.

### V3 support-root check

Genesis uses the bounded layout helper to create and validate its declared
support root. Schema 2 declares six lowercase lanes (`docs`, `specs`, `wiki`,
`sessions`, `feedback`, `tools`) and seven collections (`docs/adr`,
`wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`,
`sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`), the wiki
profile, and the exact source release and commit. `workbench/sessions/.gitignore`
keeps `grilling/` and `handoffs/` untracked; only `checkpoints/` is durable.
Exercise it from a disposable project directory:

```bash
node workbench/tools/workbench-layout.mjs init --project /tmp/workbench-project --provenance genesis --version v3.1.1 --integration-branch integration
node workbench/tools/workbench-layout.mjs validate --project /tmp/workbench-project
node tools/test-workbench-layout.mjs
```

A schema 1 (v3.0 five-lane) manifest validates as `upgrade-required`. Migrate
it once, losslessly: `workbench/grilling` becomes `workbench/sessions/grilling`
and the tracked `workbench/handoffs` checkpoints become
`workbench/sessions/checkpoints`; the new lanes and collections are created
empty. A second run reports `current`.

```bash
node workbench/tools/workbench-layout.mjs migrate --project /absolute/project
```

Every consumer resolves lanes and collections through
`workbench/tools/workbench-paths.mjs`; nothing hardcodes a support path.

The manifest may also carry a `git` block (`defaultBranch`,
`integrationBranch`) naming, by exact case, the branch the independent review
gate merges into ([ADR-0039](workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)).
`init` and `migrate` write it from `--default-branch` and
`--integration-branch`, defaulting to an existing integration-named branch by
its exact case, then `origin/HEAD` (or the checked-out branch) and
`integration`; `workbench-adoption.mjs migrate` does the same and lists an
unresolved branch as `residue.missingIntegrationBranch`. A manifest without
the block stays valid, and `workbench-paths.mjs` exposes the block as
`declaredGit`. `doctor` reports `integration-branch-undeclared` when the block
is absent and `integration-branch-missing` when the declared name resolves
neither as a local head nor on a remote; both are `error` findings in the
`git` scope with effect `none`, so they stay visible without blocking
selection. Declaring never creates a branch. This repository declares
`integration`; create a missing one from the default branch:

```bash
git branch integration main
git push -u origin integration
```

`init` also seeds the wiki contract (`SCHEMA.md`, `AGENTS.md`, and
`design-concepts/README.md`) into `workbench/wiki/` from `templates/wiki/`
when it runs from a release checkout, filling the version, date, and project
name (`--name`, `--date`, `--wiki-profile project|deployment`); a downstream
copy of the tool reports `seeded.wiki: false` truthfully. The Genesis
readiness gate requires the filled `workbench/wiki/MEMORY.md` router and those
three files with no template placeholder.

`validate --genesis` additionally requires seven ordinary, filled root controls,
exact Workbench version stamps on the six stamped controls (the thin
`CLAUDE.md` remains exactly `@AGENTS.md`), the generated-region markers in
`BLUEPRINT.md` and `TASKBOARD.md` that `render` fills, one actionable
version-matched first spec at a stable `workbench/specs/S-###-slug/SPEC.md`
path, an installed `workbench/tools/` lane whose receipt names the manifest's
release (`tools-receipt-missing` or `version-mismatch` otherwise), a declared
integration branch that resolves (`integration-branch-undeclared` or
`integration-branch-missing` otherwise), and no
project-local `skills/` directory. It fails closed on symlinks,
template placeholders, stubs, version drift, unstable spec paths, or
structurally incomplete first specs. A rejected first spec carries a `reason`
field naming the failing predicate (status, priority, ready ticket, sections,
acceptance box, stamp, identity, or path), and a stray entry in the specs lane
is listed in `entries`; dotfiles such as `.gitkeep` and `.DS_Store` are
ignored. Readiness proves selection and claim, not doctor: run `render` and
`doctor` on the project afterwards, as `templates/GENESIS.md` Phase 6 says.
The `--genesis` readiness check carries the versioned placeholder vocabulary
with the CLI, and its focused self-test proves that vocabulary exactly matches
the shipped Genesis templates. Relocating the CLI and its declared helper
modules therefore cannot weaken lowercase-placeholder detection.

### Managed runtime tools check

The product's `workbench/tools/` lane is the canonical source of the
Workbench-managed runtime tools; this repository runs them from there. A
downstream project receives receipt-backed copies:

```bash
node tools/workbench-tools.mjs install --project /absolute/project
node tools/workbench-tools.mjs verify --project /absolute/project
node tools/workbench-tools.mjs update --project /absolute/project --home /disposable-or-user-home --explicit-update
node tools/workbench-tools.mjs rollback --project /absolute/project --backup /path/recorded/in/receipt
node tools/test-workbench-tools.mjs
```

`install` writes `workbench/tools/.workbench-tools.json` with the source
repository, release, commit, and a SHA-256 per file, copies each tool as an
ordinary `0644` file, and refuses a lane that already carries a receipt, a
foreign unreceipted file, or a symlink. `verify` reports `tools-receipt-drift`
with the drifted file names (`source` on this repository). `update` requires
`--explicit-update`, backs changed files up under the user home's
`.workbench-tools-backup-*`, records the backup path in the receipt, and
`rollback` restores that backup. An application's root `tools/` directory is
never read or written.

Managed-tool updates and rollbacks reject symlinked lane ancestors, linked or
nonregular managed files, and unsafe backup entries before copying or creating
backups. Resolve the path collision while preserving its target, then retry the
explicit operation. Ordinary drift in a regular managed file still receives a
backup and can be restored.

Layout initialization and schema migration preserve existing session ignore
rules and reject linked destination paths before writes. ADR creation, register
rendering and checkpoint promotion also reject unsafe destination chains and
use private temporary files. Legacy Wiki adoption moves existing knowledge
before seeding only the missing contract files.

### V3 Adoption migration check

Adoption requires seven filled root controls and all core skills in a
user-scoped discovery root before it retires legacy project-local support paths.
Exercise the deterministic mixed-v2 fixture without touching a real project:

```bash
node tools/test-workbench-adoption.mjs
```

For a real one-time migration, use the Adoption protocol after its inventory and
control-reconciliation phases:

```bash
node tools/workbench-adoption.mjs migrate \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.1.1
node workbench/tools/workbench-layout.mjs validate --project /absolute/project
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs doctor
```

The command refuses an existing support root or any legacy collision before
mutation. It moves only documented durable lanes into their schema 2
destinations (legacy `grilling diary/` into the untracked grilling collection,
legacy `handoffs/` into the tracked checkpoints collection), preserves
project-local skills under `workbench/sessions/checkpoints/adoption-legacy-skills/`
after user-scoped core readiness, writes
`workbench/sessions/checkpoints/adoption-recovery.json`, moves a root
`WORKBENCH_FEEDBACK.md` (or legacy `HARNESS_FEEDBACK.md`) into
`workbench/feedback/WORKBENCH_FEEDBACK.md`, installs the receipt-backed runtime
tools into `workbench/tools/`, then renders and validates the manifest-declared
spec lane. Two root feedback files, or a root file beside a legacy
`feedback/WORKBENCH_FEEDBACK.md`, block as `feedback-collision` before any
mutation. An application's root `tools/` directory is never a migration
source and is left untouched. Its `residue` result lists root filenames that
match the managed runtime-tool set and pre-migration links that escaped a moved
legacy lane; it never deletes those files or rewrites project prose. A moved
legacy room brain receives the required Wiki metadata, and the manifest source
repository/commit must match the managed-tools receipt. The migration fails
only on a finding that blocks `all` or `selection`; nonblocking findings (for
example a moved link that needs explicit reconciliation) are returned as `findings` with
`doctor: passed-with-findings` so the adopting agent repairs them next.

### V3 explicit upgrade and recovery check

An ordinary setup is presence-only. Replacing an installed core skill is a
separate, explicitly authorized operation and is limited to skills that the
installer marked as Workbench-managed:

```bash
node tools/workbench-upgrade.mjs upgrade \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.1.1 \
  --explicit-update
node tools/test-workbench-upgrade.mjs
```

The command blocks an unmanaged same-named skill, a discovery root inside a Git
worktree, a missing committed Git recovery point, or a pre-existing v3 support
root before mutation. For each changed managed skill it creates a copy under
the user home's `.workbench-upgrade-backup-*` directory, migrates the legacy
support lanes once, installs the receipt-backed runtime tools, and records the
pre-migration SHA, tracked path inventory, skill backups, and tools receipt in
`workbench/sessions/checkpoints/upgrade-recovery.json`. The target project must
be clean and committed first; uncommitted state has no concrete rollback point.

### Spec Lifecycle And Retrieval

```bash
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-001
node workbench/tools/spec-workbench.mjs claim S-001 --agent codex
node workbench/tools/spec-workbench.mjs close S-001 \
  --proof "[NAMED VERIFICATION]" \
  --docs "[DOCS UPDATED OR Docs checked; no update needed + reason]" \
  --remaining-gap "[GAP OR none]"
node workbench/tools/spec-workbench.mjs complete S-001
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

`next` returns one eligible ready ticket. `show` loads one stable work packet.
Writes use a temporary file plus rename and fail closed on ambiguous state.
`render` updates only the marked Blueprint catalog and hot Taskboard regions.
`complete` requires every slice done, acceptance boxes checked, completion result
recorded, and evidence present; render then removes the spec from the hot board.

### Architecture Decision Records

Decision records live in the manifest-declared `docs/adr` collection
(`workbench/docs/adr/`). An ADR owns rationale; its rule binds only where the
`canonicalized_in` frontmatter points, and every named owner must exist.

```bash
node workbench/tools/adr.mjs new --title "Decision title"
node workbench/tools/adr.mjs validate
node workbench/tools/adr.mjs register
node tools/test-adr.mjs
```

`new` allocates the next number by scanning the collection and writes a
`proposed` record with the standard sections. `validate` reports
`invalid-adr` for a missing frontmatter, an unknown status, a missing date or
title, an accepted record with no or a nonexistent `canonicalized_in`
target, a superseded record without `superseded_by`, or a duplicated number;
`untracked-provenance` for a link into the untracked `sessions/grilling` or
`sessions/handoffs` collections; and `stale-register` when the derived
`REGISTER.md` differs from the collection. `register` rewrites that derived
table. Doctor carries these findings for schema 2 projects; none blocks
selection, and the `adr validate` command itself exits 1 only on error
findings.

### Composed round trip

The composed workflow is proven mechanically, without a model, on every full
verification run:

```bash
node tools/test-workbench-round-trip.mjs
```

It creates a bare remote, runs Genesis with this candidate's tools (init,
tools install, seven controls, wiki router, feedback lane, first spec),
passes `validate --genesis` and doctor, writes a live notepad, promotes it as
a checkpoint, claims the first slice, pushes the planning checkpoint (the
notepad never enters the commit), deletes the working clone, resumes from a
fresh clone with a scrubbed environment using only repository state, drives a
red/green slice, closes, renders, passes doctor, pushes, reads the remote SHA
back, and scans the clone and the transcript for any Foundry name, mechanism,
or private home path. The real cross-provider resume with agents is S-022's
release gate.

### Portability and privacy matrix

Every row of the v3.1 release matrix has a named deterministic check that runs
on every full verification pass:

| Row | Check |
|---|---|
| schema migration | `test-workbench-layout.mjs`: schema 1 reports `upgrade-required`; `migrate` is lossless and idempotent |
| mixed Adoption | `test-workbench-adoption.mjs`: five fixtures including root feedback, collisions, and an untouched root `tools/` |
| case-sensitive paths | `test-portability-matrix.mjs`: no tracked paths differ only by case; capitalised or spaced lanes rejected |
| Windows/POSIX behavior | `test-portability-matrix.mjs` and `test-spec-workbench.mjs`: backslash lanes rejected; CRLF manifests, packets, and projections accepted |
| symlink invocation | `test-symlink-invocation.mjs`: every runtime lane tool runs its main through a symlinked path |
| collisions | `test-workbench-tools.mjs`, `test-workbench-adoption.mjs`, `test-workbench-layout.mjs`: receipts, lanes, feedback, and first-spec collisions block before mutation |
| stale links | `test-diagnostics.mjs`, `test-wiki.mjs`: broken spec links and stale notes are attention, never blocking |
| public privacy stripping | `test-portability-matrix.mjs`: the shared `privacy.mjs` patterns find nothing on the active surfaces |
| retired private and Foundry paths | `test-portability-matrix.mjs`: no active surface names a retired lane, the hidden notepad directory, a private home path, the private skill catalog, a host temp lane, or a Foundry-dependent path |

```bash
node tools/test-portability-matrix.mjs
```

### Cross-provider resume proof

The release-gate proof that a different provider can resume from a clean
clone using repository state only, with isolated candidate skills and
receipt-backed candidate tools and nothing outside the repository:

```bash
node tools/cross-provider-resume.mjs plan --workspace /disposable/workspace
node tools/cross-provider-resume.mjs resume-prompt --workspace /disposable/workspace
node tools/cross-provider-resume.mjs verify --workspace /disposable/workspace --transcript /disposable/workspace/transcript.txt
```

`plan` builds a bare remote, runs Genesis with this candidate, promotes a
checkpoint, claims the first slice, pushes the planning checkpoint, destroys
the planning clone, and installs the candidate skills into an isolated
provider home (`provider-home/.codex/skills` for Codex). Between `plan` and
`verify`, run the other provider from a fresh clone of `origin.git` with its
home pointed at that isolated directory and the printed prompt, capturing its
output to a transcript; provider authentication stays the owner's action and
is never copied. The isolated home runs the provider unsandboxed (the
workspace-write sandbox refuses the `.git` writes a commit needs), so run the
proof only in a disposable workspace. `verify` clones fresh and proves the remote advanced, the
ticket closed with proof, the test and CLI pass, doctor is clean, the tools
receipt names the exact candidate, the live notepad never travelled, and the
transcript names nothing outside the repository. This proof spends provider
budget and is run for the release umbrella, not on every verification pass;
`node tools/test-cross-provider-fixture.mjs` proves the provider-free half
(a recoverable planning checkpoint and a fail-closed verify) on every run.

### Session Checkpoints

Live grilling notepads and handoffs stay untracked in
`workbench/sessions/grilling/` and `workbench/sessions/handoffs/`. Promote a
record only deliberately:

```bash
node workbench/tools/sessions.mjs checkpoint --from workbench/sessions/grilling/topic-YYYY-MM-DD.md --topic topic
node workbench/tools/sessions.mjs scan --file PATH
node tools/test-sessions.mjs
```

`checkpoint` copies an ordinary file byte for byte (after one stamp comment
naming the source and date) into `workbench/sessions/checkpoints/<topic>-<date>.md`
with mode `0644`, and refuses with `secret-like-content` and the offending
line numbers when the shared `privacy.mjs` patterns match; `invalid-note`
covers a symlink, a non-file, or an existing destination. A refusal writes
nothing. Cite the promoted copy, never the live path.

### Wiki Validation

The wiki lane is validated by its own runtime tool; doctor carries the same
findings for schema 2 projects, none of which blocks selection:

```bash
node workbench/tools/wiki.mjs validate
node tools/test-wiki.mjs
```

`invalid-note` covers a missing router, a missing required collection, absent
frontmatter, a retired `authority` property, an enum outside `type`,
`status`, `sensitivity`, or `knowledge_role`, a non-ISO `last_verified`, an
absolute or traversing `source_paths` entry, a duplicated note basename, and a
`design-concepts/` article that lacks `type: design-concept`,
`authorized_by`, `parent`, or its `Evidence and Sources` and `History`
sections. `copied-task-state` flags generated-region markers or ticket rows
copied into a note; `secret-like-content` flags key blocks, tokens,
credential assignments, absolute home paths, host temp handoff lanes, and
email addresses in a `normal` note (the shared `workbench/tools/privacy.mjs`
patterns). `stale-note` is attention only. An Obsidian vault configuration is
ignored when present and never required.

### Diagnostics And Blocking Effects

Every finding a runtime tool emits is registered in
`workbench/tools/diagnostics.mjs` with a severity (`error` or `attention`), a
scope, and a blocking effect. The consuming command enforces the effect; no
spec, manifest, or projection can choose whether its own finding blocks.

| Effect | Consumer behavior | Codes |
|---|---|---|
| `all` | `doctor` exits 1; `next` and `claim` refuse to read the layout | `invalid-manifest`, `upgrade-required`, `invalid-lane`, `unsafe-lane`, `invalid-collection`, `missing-collection`, `invalid-skill-policy`, `invalid-wiki-profile`, `sessions-not-ignored`, `tools-receipt-missing`, `tools-receipt-drift`, and the Genesis readiness codes |
| `selection` | `doctor` exits 1 until repaired; selection is unsafe | `malformed-spec`, `duplicate-id`, `invalid-state`, `contradictory-state`, `unstable-path`, `missing-evidence`, `render-drift`, `broken-render-target` |
| `selected-slice` | `doctor` reports it and exits 0; `next` excludes the slice; `claim` refuses it by name | `blocked-slice` |
| `none` (attention) | reported, exit 0, never hides work | `stale-claim`, `broken-link`, `stale-register`, `stale-note`, and the ADR and wiki findings until their tools ship |
| `none` (error) | reported, exit 0, never hides work; the Genesis gate fails closed on the same condition | `integration-branch-undeclared`, `integration-branch-missing` (scope `git`), and the error-severity ADR and wiki findings |

`doctor --json` prints the findings with their `severity`, `scope`, and
`blocks` fields; the plain output ends with an `ok - no blocking finding` line
when only attention or slice findings remain.

### Socket Contract Registry

The Foundry socket contract registry (GPT_OS root spec S-014, C-003 extraction)
travels with the Sockets family. `tools/socket-registry/registry.json` is the
machine-readable contract artifact (one record per `K-###`),
`tools/socket-registry/schema.mjs` is its schema, and `tools/socket-contract.mjs`
is the validator — the successor to the instance-side `id-registry.mjs` (which
validates the binding *table*; this validates the *contract*).

```bash
node tools/socket-contract.mjs validate            # schema-check the whole artifact
node tools/socket-contract.mjs resolve K-001       # resolve a socket to its contract
node tools/socket-contract.mjs check-binding  '{"socketId":"K-001","boundEntity":"P-010","access":"contract","entrypoint":"recall.query"}'
node tools/socket-contract.mjs check-connection '{"socketId":"K-001","access":"contract","entrypoint":"recall.query"}'
node tools/test-socket-contract.mjs                # red/green suite
```

An instance binding row (which module fills a socket here) is validated *against*
this traveling contract with `check-binding`; a connection that reaches around
the contract (filesystem/database access into the module) is rejected by
`check-connection` — the no-reach-around hard gate that module legs (OpenBrain,
CIC) import.

### Test Coverage Policy

Treat the self-tests as the specification of the evaluator and trial tooling.
The suite should be strong enough that if someone accidentally deletes a
meaningful line of `tools/` or `evals/` code, or a rubric-relevant section of
the control docs, at least one self-test fails. If a meaningful behavior
changes, a self-test must change with it. Remove tests that are stale or pure
bloat. If behavior cannot be tested in the current harness, record the exact
reason and use the strongest concrete manual check available.

## Evaluation And Benchmarking

Use this section to prove whether a harness change is an improvement. The goal
is evidence, not taste.

### Guardrail North-Star Audit

The static evaluator answers whether required control surfaces exist. The
guardrail audit asks the harder question: how far has the whole harness drifted
from an evidence-backed ideal?

```bash
node tools/audit-guardrails.mjs --path .
node tools/test-guardrail-audit.mjs
```

The audit holds a stable 100-point scale across four layers: static contract,
drift resistance, benchmark discipline, and real outcome evidence. Capture the
guardrail audit baseline before editing any harness rule, then record the
before/after score and remaining recommendations in the owning spec and
`benchmarks/RESULTS.md`.

100/100 is the deliberately hard north star, not the release gate. Regression
tests remain the minimum ship gate. Never weaken or reweight criteria to create
score movement, and never translate static score movement into an agent-outcome
claim without repeated task trials.

### Claims To Test

A template version is only worth calling better when it supports at least one:

1. Better than no project instructions.
2. Better than a representative generic instruction file.
3. Better than the prior version on the same task suite.

### Evaluation Design

| Condition | What the agent gets | Purpose |
|---|---|---|
| `c0_none` | no project instructions | baseline |
| `c1_generic` | a generic single instruction file | common alternative |
| `c2_current` | current templates | current candidate |
| `c3_candidate` | proposed branch or changed docs | improvement test |

Score task outcomes (correctness, scope adherence, verification honesty, docs
upkeep), not how good the docs feel.

### Commands

Static rubric (free, fast):

```bash
node tools/evaluate-workbench.mjs --path . --include-controls
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench \
  --branches main,BRANCH_NAME --include-controls
```

Runnable trial framework (pipeline self-test is free):

```bash
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
```

Run a candidate comparison with Codex by overriding the two Git-backed refs.
The feedback gate is capped at 10 trials per condition (20 total):

```bash
python3 evals/run.py \
  --task evals/tasks/task_b_path_safety \
  --conditions c2_ours_integration,c3_candidate \
  --condition-ref c2_ours_integration=origin/integration \
  --condition-ref c3_candidate=origin/codex/feedback-branch \
  --provider codex --model gpt-5.6-terra --reasoning-effort high \
  --trials 10 --feedback-fingerprint FINGERPRINT \
  --base-sha BASE_SHA --candidate-sha CANDIDATE_SHA \
  --out evals/results/run_YYYY-MM-DD.jsonl
```

`--provider claude` remains supported. Result rows record provider, reasoning
effort, resolved condition ref/SHA, trial count, feedback fingerprint, and the
declared base/candidate SHAs. The Codex provider uses ephemeral sessions,
ignores user configuration to reduce trial contamination, and grants only
workspace-write access inside the temporary fixture repository.

Real comparison runs spend API budget. Size the run first and record the model,
conditions, task suite, trial count, and result path in the owning spec before
making claims.

### Harness Feedback Loop

Downstream projects built from `templates/` carry a `WORKBENCH_FEEDBACK.md` return
channel (legacy copies named `HARNESS_FEEDBACK.md` are still discovered): an
append-only log of where the harness rules themselves were unclear,
wrong, or slow. This repo is the harvest destination. Manual reports and their format live
in its manifest-declared feedback lane; the downstream append-only return
channel is a different artifact. For authorized repairs:

1. Collect feedback rows from downstream projects (or from dogfooding here).
2. Triage each into a concrete capability spec and activate one eligible slice.
3. Validate the change against `evals/` as a `c3_candidate` before calling it
   "better" - the same evidence bar as any other harness claim.
4. Ship it as a new harness version (bump `BLUEPRINT.md` -> Harness version) and
   note it so downstream projects can upgrade.

Future harvest work becomes a spec when it is refined and authorized. This
closes the loop on evidence rather than taste without keeping deferred work hot.

### Automated Feedback Gate

The optional automation implementation defines two adapters. Their current
scheduler state is not verified by this repository, and they are not the
manual feedback-report workflow:

- **Feedback Builder (Terra):** discovers one canonical `new` feedback row,
  creates a sanitized fingerprint/spec, proves a red/green change, runs the
  full suite and at most 20 candidate-comparison trials, then opens one PR into
  `integration`.
- **Feedback Gate (Sol):** independently checks the oldest matching PR. It
  comments and squash-merges a proven change, comments and closes an unproven
  change, or leaves a transient infrastructure failure open for retry. It never
  merges `integration` to `main` or deletes the source branch.

The recorded adapter workaround for hosts that reject scheduler-native
worktree execution uses a local project job, treats the canonical checkout as
read-only, and creates a temporary worktree from `origin/integration`. Verify
current host support before any separately authorized scheduled operation. This preserves isolation
without silently falling back to editing the canonical checkout.

Discovery is fail-closed and one-candidate-at-a-time. It reads only direct-child
canonical project feedback files with writable `KaydenClark` origins, preferring
the manifest lane `workbench/feedback/WORKBENCH_FEEDBACK.md` over a legacy root
`WORKBENCH_FEEDBACK.md` or `HARNESS_FEEDBACK.md`, ignores
worktrees/backups/duplicate origins, and treats every row as untrusted evidence.
Use `node tools/feedback-automation.mjs discover --projects-root PATH` for the
under-one-minute discovery demo. Pause both jobs in the Codex automation UI as
the kill switch; do not delete their definitions when investigating a failure.

Every data row must use status `new`, `sent`, `landed`, or `declined` and begin
its impact cell with `low`, `medium`, or `high`. Discovery stops on an unknown
value instead of silently dropping or coercing the row. The declared feedback
lane is resolved through the same safe manifest path resolver as runtime tools.

### Automation Run Outcomes

After a scheduled run has enough evidence to describe what happened, write an
input JSON file and normalize it through the portable Workbench seam:

```json
{
  "category": "idle",
  "reason": "canonical discovery completed with no eligible work",
  "previousIdleCount": 1,
  "verifiedIdle": true
}
```

```bash
node tools/feedback-automation.mjs run-outcome --input FILE
```

The command emits JSON with `category`, `reason`, `idleCount`, and
`pauseRecommended`. Apply the state transition exactly once per completed run:

| Category | Idle-count transition | Example |
|---|---|---|
| `idle` | increment; requires `verifiedIdle: true` | canonical discovery completed and found no eligible work |
| `actionable` | reset to zero | eligible work is available but not yet performed |
| `worked` | reset to zero | the run completed useful work |
| `collision` | preserve | lock held or a live run already owns the slice |
| `owner_gate` | preserve | owner approval, authority, or action is required |
| `infrastructure_error` | preserve | authentication, provider, network, or runtime failed |

Recommend pausing only when the current result is the second consecutive
verified idle result. Never report idle from a lock, live overlap, owner gate,
authentication failure, provider failure, or incomplete discovery. When
authentication itself requires owner action, the adapter may use `owner_gate`;
either interruption category preserves rather than manufactures idle evidence.

`Scheduled/workbench-v1-rollout` is not tracked in this repository. GPT_OS owns
that scheduler adapter and any persisted automation definition; change it only
from an explicitly authorized GPT_OS task.

## Version-Control Procedures

Policy and authority live in `AGENTS.md` -> Git Rules. Operational commands:

```bash
git status --short --branch
git fetch origin
git switch -c codex/short-description origin/integration
git diff --check
gh pr create --base integration --fill
```

Before creating a branch or PR, verify the live base and preserve dirty work.
PR descriptions state what changed, why, risks, and verification.

Closeout, once the integration review has passed. Export `TASK_BRANCH`,
`PR_NUMBER`, and the reviewed full commit SHA as `EXPECTED_HEAD` before running
this block. Export `CLEANUP=no` when the owner defers cleanup; otherwise use
`CLEANUP=yes`. Review must cover the live integration comparison before merging.

```bash
(
set -eu
: "${TASK_BRANCH:?Set the reviewed task branch}"
: "${PR_NUMBER:?Set the reviewed PR number}"
: "${EXPECTED_HEAD:?Set the reviewed full commit SHA}"
: "${CLEANUP:?Set yes or no according to the owner instruction}"
case "$CLEANUP" in yes|no) ;; *) exit 1 ;; esac
git check-ref-format --branch "$TASK_BRANCH" >/dev/null
case "$TASK_BRANCH" in main|integration) exit 1 ;; esac
test -z "$(git status --porcelain)"
test "$(git rev-parse HEAD)" = "$EXPECTED_HEAD"
# Explicit refspecs also work in a single-branch clone.
git fetch origin '+refs/heads/integration:refs/remotes/origin/integration'
gh pr merge "$PR_NUMBER" --merge --match-head-commit "$EXPECTED_HEAD"
git fetch origin '+refs/heads/integration:refs/remotes/origin/integration'
git merge-base --is-ancestor "$EXPECTED_HEAD" origin/integration
echo "integration contains the reviewed work"
if [ "$CLEANUP" = yes ]; then
  # Never require a local integration checkout, which another worktree may hold.
  git switch --detach origin/integration
  git branch --merged origin/integration
  if git show-ref --verify --quiet "refs/heads/$TASK_BRANCH"; then
    git merge-base --is-ancestor "$TASK_BRANCH" origin/integration
    git branch -d "$TASK_BRANCH"
  fi
  remote_head=$(git ls-remote origin "refs/heads/$TASK_BRANCH")
  if [ -n "$remote_head" ]; then
    remote_head=${remote_head%%[[:space:]]*}
    git fetch origin "refs/heads/$TASK_BRANCH"
    test "$(git rev-parse FETCH_HEAD)" = "$remote_head"
    git merge-base --is-ancestor "$remote_head" origin/integration
    # Compare-and-delete protects commits pushed after the containment check.
    git push origin --delete "$TASK_BRANCH" --force-with-lease="refs/heads/$TASK_BRANCH:$remote_head"
  fi
  # Drop registrations of review worktrees whose directories are already gone.
  git worktree prune
fi
)
```

The subshell stops on any failure without closing the caller's shell. Merge
never requests branch deletion. Containment uses the immutable reviewed SHA,
so it remains checkable if GitHub already removed the source branch. Cleanup
checks local and remote tips separately; a missing branch is already clean.
The deletion lease is a compare-and-delete guard, not permission to rewrite
history. Never use `-D` or an unconditional force push to bypass failed checks.
If a worktree still holds the task branch, local deletion fails and cleanup
stops. When cleanup is deferred, both branches and the checkout stay intact.

Disposable review clones and linked worktrees live under the host temporary
directory (`/private/tmp/llm-workbench-<purpose>-<sha>` or the session
scratchpad), never inside the canonical checkout, and none is a durable owner.
`git worktree prune` at closeout drops the registrations of removed ones; a
finished review checkout is removed with `git worktree remove PATH` once its
review is recorded, and `git worktree list` shows what still lingers. The
declared integration branch (`git.integrationBranch` in
`workbench/manifest.json`) needs no local checkout for closeout.

Use `node tools/test-branch-closeout.mjs` for a disposable Git demonstration of
failure preservation, linked worktrees, already-deleted branches, and deferred
cleanup. GitHub merge responses are simulated there; actual integration delivery
still requires the reviewed PR and remote containment read-back.

## Manual Harness Feedback Reports

Run this workflow after a setup-only Round One check succeeds. It assesses the
assigned target; it never authorizes a repair or invokes automated repair.

1. Resolve `lanes.feedback`, `lanes.specs` and the relevant collections through
   `workbench/manifest.json`. Pin the target revision and the assigned question.
2. Inspect only relevant controls, source and named proof. Test consequential
   claims, distinguish observation from inference, and disclose evidence limits.
3. Write `REPORT-topic-date.md` in the declared feedback lane using its
   `REPORT_FORMAT.md`. Include Target And Scope, Evidence And Limitations,
   Findings, Challenged Or Rejected Findings, Next Action And Open Questions,
   and Review Boundary. No findings is valid. Reports never live loose or in
   the Wiki. If the format is absent in an older installation, these sections
   are sufficient; explicit upgrades may copy it from the source templates.
4. Put accepted follow-up work in its existing linked spec; proposed repairs
   remain pending owner authorization. A report is not a work assignment.
5. At a meaningful continuation boundary, a fresh session should find the report,
   its linked spec, and the next executable action or owner gate using repository
   state only. No universal handoff or new self-created task is required.
6. Before integration, the candidate's separate-context review challenges the
   report's consequential claims and recommendations along with the change.

## Troubleshooting

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| evaluator self-test fails with score < 90 | root dogfood docs lost a rubric section | `node tools/evaluate-workbench.mjs --path .` and read the `missing` column | restore the missing section in the root doc |
| self-test passes locally but templates score low | change landed at root but not in `templates/` (or vice versa) | `node tools/evaluate-workbench.mjs --path templates` | apply the Dogfood Boundary rule: land in both |
| `evals/score.py` errors on results file | stale or hand-edited JSONL | regenerate with `_make_selftest.py` | never hand-edit results |
| feedback discovery returns no candidate unexpectedly | checkout is a worktree/duplicate, origin is not writable-owner, or fingerprint is already pending/processed | `node tools/feedback-automation.mjs discover --projects-root /absolute/projects-root` | repair the canonical checkout or record the pending/processed decision; do not broaden discovery |
| an automation pauses after a lock, owner gate, or provider failure | the scheduler counted an interruption as idle | inspect the latest `run-outcome` JSON and prior verified-idle count | emit `collision`, `owner_gate`, or `infrastructure_error`; preserve the idle count and retry or wait for the proper wake event |
| Sol cannot prove a candidate because GitHub or model access is down | transient infrastructure failure | read the PR verdict comment and repeat count | leave the PR open, retry next run, and alert after the second identical failure |

## Recovery And Rollback

If a change fails:

1. Identify the touched files and failing command.
2. Revert only the smallest change needed (`git checkout -- <file>` or revert
   commit), preserving unrelated work.
3. Rerun the failing verification command.
4. Update the owning spec with the result and remaining gap, then render.

Do not delete data (result ledgers, benchmark records), remove unmerged branches,
or rewrite history unless the owner explicitly approves that action. Merged
branch cleanup follows Git Rules and any owner instruction to defer it.

The pre-migration local state (before this folder became the repo home) is
preserved on branch `backup/local-pre-v2-migration`; the YAML-frontmatter
harness dialect is preserved on `codex/structured-metadata-guardrails`.

## Operational Proof

If a command changed durable project state, append evidence to the owning spec.
For routine read-only runs, a final response note is enough.
