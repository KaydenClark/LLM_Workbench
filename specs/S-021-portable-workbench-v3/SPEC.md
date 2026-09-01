# S-021 - Portable Workbench v3

> Captured from the owner-approved 2026-08-31 grilling session. This spec begins
> at the current v2 stable path and moves with the one-time v3 support-root
> migration it authorizes; after that migration, its manifest-declared path is
> stable.

**Spec ID:** S-021
**Status:** active
**Priority:** 0
**Owner:** codex
**Updated:** 2026-09-01
**Catalog description:** Make Genesis, Adoption, and upgrades produce a portable `workbench/` support root and safely install a self-contained 12-skill core on brand-new hosts.
**Blockers:** none
**Latest event:** TK-003 closed with proof.
**Next gate:** Complete TK-004.

## Outcome

LLM Workbench is ready to use in other projects while Foundry remains unfinished.
Genesis, Adoption, and routine upgrades produce one filled project with the seven
root controls plus a lowercase `workbench/` support root. The public LLM
Workbench repository contains the minimum closed 12-skill workflow and supplies
a core skill only during a brand-new installation when that skill is missing.
Existing installed skills remain untouched unless the owner explicitly requests
a skill update.

## Why It Matters

The current v2.3 product still mixes durable support records at the root, treats
its broad local skills catalog as project discovery, and contains stale
GPT_OS/Forge path assumptions. That makes a portable setup ambiguous and ties a
public product to Kayden's private machine topology. The minimum v3 correction
must make the public repository self-contained without turning it into Foundry
or redesigning every Workbench subsystem.

## Current Verified State

- Refreshed `origin/integration` is
  `9e6c71b81f38d0696ac01834076a20d428207bde`; `origin/main` is
  `08ab78e5a59a68d2b04028fe71a2be488d5ae10e`, 46 commits behind, and is an
  ancestor of integration.
- Integration has root `specs/`, no `workbench/manifest.json`, thirteen active
  skill directories, seventeen pending skill directories, and documentation
  that still describes project-local skill discovery.
- The locked core is exactly `genesis`, `adoption`, `update-harness`,
  `grilling`, `checkpoint`, `make-it-so`, `to-docs`, `to-spec`, `to-tickets`,
  `tracer-bullet`, `implement`, and `code-review`. Nine are present in the
  current active catalog; `checkpoint`, `make-it-so`, and `tracer-bullet` are
  absent, while four active router/reference skills are outside the core.
- `node tools/test-skill-catalog.mjs` is red because its canonical-source path
  assertion and `update-harness` disagree, and both name retired GPT_OS source
  locations. This is a prerequisite baseline failure, not v3 proof.
- S-011 remains blocked pending supersession of its broad project-local skills model. S-014 owns the
  eventual exact-head integration-to-main release gate and must remain blocked
  until this capability lands.
- The owner-approved decision record remains available only as provisional
  source material at `.agents/grilling diary/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md`;
  this spec is the canonical capability owner.

## Desired Behavior

- Every completed Genesis or Adoption has exactly seven root controls:
  `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md`, `TASKBOARD.md`,
  `CLAUDE.md`, and `README.md`.
- Every completed setup also has lowercase `workbench/manifest.json` plus
  declared `specs/`, `wiki/`, `grilling/`, `handoffs/`, and `feedback/` lanes.
- The manifest is the machine-readable path and setup authority. It records its
  schema version, LLM Workbench version, lifecycle provenance, canonical lane
  paths, the 12 required skill names, user-scoped installation, presence-only
  normal setup, and explicit-update policy. Human-readable version stamps agree
  with it.
- Markdown guidebooks own procedures in bounded chunks. Node tools perform only
  narrow deterministic parsing, rendering, validation, or safe skill-file
  operations; there is no umbrella lifecycle program.
- Normal setup checks required skill names in user-scoped Codex and Claude
  discovery. A missing core skill may be installed from this repository only
  into an absent or Workbench-managed destination. Existing same-named skills,
  foreign Git roots, credentials, and unrelated catalogs remain untouched.
- An explicitly requested skill update backs up differing installed content and
  synchronizes the required core to the exact versions bundled with the checked
  out LLM Workbench release.
- Genesis writes only v3 paths. Adoption and `update-harness` recognize legacy
  inputs long enough to perform one lossless migration; afterward the manifest
  is the only support-path authority and no project-local skill discovery tree
  remains.
- A blocked skill installation or path collision leaves a truthful recoverable
  partial result with exact remediation; it never claims setup completion.

## Decisions And Contracts

- LLM Workbench is a brand-new-install source of last resort for its 12 core
  skills, not the owner of an already-installed skill and not a dependency on
  `KaydenClark/skills`.
- Presence satisfies normal setup. Content identity is checked only when the
  owner explicitly requests an update.
- `workbench/specs/`, `workbench/wiki/`, and `workbench/feedback/` are tracked
  durable records. Explicit recovery checkpoints are tracked under
  `workbench/handoffs/`; live grilling and ordinary handoff Intent remain local
  until deliberately checkpointed or promoted.
- The manifest declares every required lane. A minimal tracked placeholder may
  preserve an empty required directory without pretending it contains a record.
- The breaking stable-path change is v3. Genesis creates only v3; Adoption and
  upgrades perform one migration with history/recovery preserved. Permanent
  dual sources are forbidden.
- Root `RUNBOOK.md` remains the authoritative procedure index. `AGENTS.md` may
  approve a subordinate guidebook only when the existing guide would otherwise
  overload one task; a broad guidebook taxonomy is deferred.
- `spec-workbench.mjs` remains focused on spec/ticket mechanics and becomes
  manifest-aware. Add only bounded layout/manifest and installed-skill
  validation/installation seams required by the flows below.
- This repository dogfoods the v3 support-root contract. Its one-time path move
  is authorized by this spec and preserves Git history where practical; every
  migrated spec becomes stable at its manifest-declared v3 path.
- Portable work is authored directly in LLM Workbench from current integration.
  No Forge publication step or private skills-repository change is part of this
  capability.

## Non-Goals

- Foundry FUIDs, Job Orders, flights, Claims, Journal/CAS, Halls, sockets,
  Captain/CIC orchestration, scheduling, or runtime visibility.
- A generalized plugin, marketplace, multi-catalog, or dependency-management
  system.
- Rewriting the full pending-skills catalog, preserving optional router skills,
  or reorganizing all guidebooks.
- Replacing or modifying existing user-scoped skills during normal setup.
- Changing credentials, repository visibility, protected-branch settings, or
  the private `KaydenClark/skills` repository.
- Merging `integration` into `main` or approving the owner release gate.
- Claiming better model outcomes from layout, static checks, or one cold-context
  exercise.

## Dependencies And Blockers

- S-011 remains blocked while this capability replaces its skill ownership,
  distribution, and completion gates; after S-021 completes, S-011 can be
  marked superseded without falsifying its unfinished historical ticket.
- S-014 resumes only after this capability reaches verified integration and a
  new immutable candidate head exists.
- The first slice must repair the existing red skill-catalog contract before a
  broader v3 green result can be claimed.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record. The
owner's request to prepare executable specs approves this dependency order.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | A brand-new host installs only missing members of the 12-skill core without altering existing skills or foreign roots | done | none | Red: node tools/test-core-skill-installer.mjs failed before helper; green: focused installer/catalog tests and complete Runbook suite passed |
| TK-002 | Genesis produces one fresh v3 project with seven root controls, manifest-backed support lanes, first spec, and green focused checks | done | TK-001 | Red: node tools/test-workbench-layout.mjs failed before layout helper; green: fresh Genesis, traversal, and symlink fixtures plus complete Runbook suite passed |
| TK-003 | Adoption migrates one mixed existing project to v3 without losing records, history, project truth, or existing user skills | done | TK-002 | Red: node tools/test-workbench-adoption.mjs failed before the migration helper; green: mixed adoption/collision test plus complete Runbook suite, evaluator 106.6/113, and doctor passed |
| TK-004 | An explicitly requested v2 upgrade backs up changed skills, synchronizes the core, migrates legacy paths once, and proves rollback | ready | TK-003 | pending |
| TK-005 | One v3 planning-to-delivery workflow resolves all project support paths through the manifest using the 12 bundled core skills | ready | TK-004 | pending |
| TK-006 | LLM Workbench dogfoods v3, completes the fresh/cold acceptance matrix, and hands the exact integration candidate back to S-014 | ready | TK-005 | pending |

### TK-001 — Missing-Only Core Installation

**Observable outcome:** Against disposable user homes, a normal setup discovers
all 12 required names, installs only absent bundled skills, and leaves an
existing same-named skill or foreign Git-owned root byte-for-byte unchanged.

**Touches:** `skills/`, the source-catalog contract, one bounded skill-management
helper if mechanical copying/checking cannot be expressed safely in the
guidebook, its tests/fixtures, and the existing setup/Runbook guidance.

**Done criteria:**

- The live source contains exactly the locked 12-skill core; unrelated active
  and pending catalog behavior is retired or archived without becoming a
  discovery source.
- The stale canonical-source assertion is first reproduced red and then removed
  in favor of product-local source plus user-scoped discovery behavior.
- Missing skills install from the checked-out LLM Workbench `skills/` source
  only into an absent or Workbench-managed destination.
- Existing names satisfy normal setup without content comparison. A foreign
  Git root or collision stops with exact remediation and no mutation.
- Codex and Claude discovery paths are both covered without reading, cloning,
  or validating `KaydenClark/skills`.

### TK-002 — Fresh Genesis

**Observable outcome:** Running the Genesis guide from a clean fixture yields a
usable project with filled root controls, a valid manifest and lanes, one first
spec under the declared path, user-scoped skill presence, and no project-local
skill shadow.

**Touches:** `templates/GENESIS.md`, copied control templates, manifest/layout
fixture and focused validator, `skills/genesis/`, public setup guidance, and
their tests.

**Done criteria:**

- The manifest and human-readable version stamps agree.
- Empty required lanes survive a fresh clone without fabricated records.
- A safely installable missing skill is supplied; an unsafe destination leaves
  a truthful incomplete scaffold and exact remediation.
- One command-sized layout proof and the existing focused spec checks pass.

### TK-003 — Lossless Adoption

**Observable outcome:** Running Adoption against a fixture containing v2 root
specs, mixed steering docs, feedback, provisional records, and path collisions
classifies every input, migrates only unambiguous durable truth, and stops rather
than overwriting a conflict.

**Touches:** `templates/ADOPTION.md`, `skills/adoption/`, migration fixtures,
layout/spec checks, and adoption documentation.

**Done criteria:**

- Durable specs, Wiki, feedback, and explicit checkpoints remain reachable;
  known moves preserve Git history where practical.
- Project-specific controls survive reconciliation without bracketed template
  regression or competing active queues.
- A legacy project-local skill folder is retired only after all required names
  are present user-scoped and the old content is recoverable.
- The final manifest is the sole support-path authority and doctor/selection
  resolves the real next ticket.

### TK-004 — Explicit Upgrade And Recovery

**Observable outcome:** An explicitly requested update converts one v2 fixture
to v3, backs up a differing installed core skill, installs the exact bundled
version, and can prove the pre-migration recovery point.

**Touches:** `skills/update-harness/`, the existing Runbook upgrade procedure,
skill update seam, migration/rollback fixtures, and focused tests.

**Done criteria:**

- No skill content changes without explicit update authorization.
- Every changed destination is backed up before replacement and the exact
  bundled result is verifiable.
- The pre-migration Git SHA, path inventory, and retained backup make rollback
  concrete; retired paths disappear only after new-path readback.
- The stale GPT_OS Forge path assumption is removed from public behavior and
  tests.

### TK-005 — Manifest-Aware Core Workflow

**Observable outcome:** In a v3 fixture, an agent can grill and checkpoint a
decision, promote it into the declared spec path, decompose a tracer-bullet
ticket, and hand an implementation/review slice forward without writing to root
`specs/`, project-local skills, or another truth store.

**Touches:** the 12 core `SKILL.md` files only where their path/runtime contracts
require change, their focused catalog tests, manifest resolver seam, and
procedure links.

**Done criteria:**

- `grilling`, `checkpoint`, `make-it-so`, `to-docs`, `to-spec`, `to-tickets`,
  `tracer-bullet`, `implement`, and `code-review` use manifest-declared record
  paths; setup skills use the same layout and skill rules.
- The workflow remains guidebook-first and chunked; no monolithic orchestrator
  or parallel tracker appears.
- Focused contracts prove the v3 path and reject root-spec/project-local-skill
  regressions.

### TK-006 — Dogfood And Release Handoff

**Observable outcome:** This repository uses its own v3 manifest/layout, the
full documented suite is green, one fresh Genesis and one mixed Adoption pass,
both engine discovery paths are proven, and a cold context resumes from the
manifest/spec without chat history.

**Touches:** the repository's affected support paths and links, root/template
docs, complete verification matrix, append-only evidence, and S-014 handoff.

**Done criteria:**

- The one-time repository path migration preserves history/recovery and leaves
  no dual active support roots or local discovery shadows.
- Fresh Genesis, mixed Adoption, v2 upgrade, explicit update/backup, and cold
  resume proofs are named and reproducible in under one minute where specified.
- The complete Runbook suite, static evaluator, guardrail baseline/after check,
  render, doctor, and `git diff --check` pass without weakening criteria.
- The exact pushed candidate is independently reviewed. S-014 is updated to
  resume its exact-head audit/status/promotion-PR gates; no agent merges main.

## Acceptance Criteria

- [ ] Genesis and Adoption each produce the seven root controls plus a valid
      lowercase `workbench/` support root and first manifest-declared spec path.
- [ ] `workbench/manifest.json` is the single machine-readable authority for
      schema/version, provenance, support lanes, and core-skill policy.
- [ ] The source and installed-skill contracts cover exactly the 12 locked core
      skills and never depend on `KaydenClark/skills`.
- [ ] Normal setup installs only missing skills on a brand-new installation and
      preserves every existing same-named skill without content comparison.
- [ ] Explicit update authorization creates a recoverable backup and converges
      the core to the checked-out release's exact bundled versions.
- [ ] Genesis, mixed Adoption, and v2 upgrade fixtures prove success, collision
      handling, partial recovery, and no data loss.
- [ ] The 12-skill planning/delivery flow resolves project support paths through
      the manifest and creates no project-local discovery tree or parallel truth
      store.
- [ ] LLM Workbench itself dogfoods v3 with no permanent dual paths, while Git
      history and prior spec evidence remain reachable.
- [ ] Focused tests, full verification, both engine discovery-path checks, one
      cold-context resume, and the under-one-minute demo pass without an
      unsupported model-outcome claim.
- [ ] S-014 receives a current exact integration candidate and remains the sole
      owner of the open `integration` to `main` promotion PR.

## Testing Seams

- Disposable user homes: absent destination, Workbench-managed destination,
  existing same-named skill, foreign Git root, explicit update, and backup
  readback.
- Filesystem fixtures: clean Genesis, mixed v2 Adoption, conflicting target,
  and v2 update/rollback.
- Manifest parser and path resolver: valid schema, missing/invalid fields,
  traversal/absolute path rejection, version-stamp drift, legacy fallback only
  during migration, and no permanent dual source.
- Skill contract scan: exact core names, required frontmatter, v3 path language,
  and forbidden private/retired/local-discovery assumptions.
- Public workflow: `spec-workbench` selection/render/doctor at the
  manifest-declared spec path and one cold-context resume from controls only.

## Verification Procedure

Each ticket adds its focused red/green command to `RUNBOOK.md`. Before closing
the capability, run the complete documented suite plus:

```bash
node tools/test-skill-catalog.mjs
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
git diff --check
```

Run fresh Genesis, mixed Adoption, and v2 update fixtures from clean recoverable
starting points. Record exact commands and results in this spec; do not invent
future tool names before their ticket establishes the stable seam.

## Documentation Impact

- `BLUEPRINT.md` owns the v3 product direction and portable/non-Foundry boundary.
- `LEXICON.md` owns the shared definitions for the support root, core skill
  bundle, normal setup, and explicit skill update.
- `README.md` owns public orientation and truthfully distinguishes current v2.3
  behavior from the active v3 work until implementation lands.
- `RUNBOOK.md`, `AGENTS.md`, templates, and skills change ticket-by-ticket only
  when their operational behavior exists; planning must not publish commands or
  paths that are not implemented.
- S-011 records supersession of its obsolete skill ownership. S-014 records the
  dependency on the resulting exact integration candidate. Generated Blueprint
  and Taskboard regions are rendered from these specs.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-08-31 | canon promotion | Promoted the owner-approved grilling decisions into one minimum complete v3 capability and dependency-ordered implementation runway | Refreshed remote refs and PR list; reproduced the pre-existing red skill-catalog canonical-path assertion; nine other required verification commands passed, including spec-workbench self-test and doctor, evaluator 106.6/113 for templates, guardrail self-test, held-out grader, and `git diff --check`; `next --json` selects S-021/TK-001 | Updated Blueprint, Lexicon, README, S-011, S-014, and generated projections. AGENTS, RUNBOOK, templates, and implementation files checked with no update needed because v2.3 remains the truthful runtime until tickets land | TK-001 owns the sole known red baseline; implement TK-001 through TK-006, then return the exact candidate to S-014 |
| 2026-09-01 | TK-001 | Ticket closed | Red: node tools/test-core-skill-installer.mjs failed before helper; green: focused installer/catalog tests and complete Runbook suite passed | Updated AGENTS.md, RUNBOOK.md, skills/README.md, update-harness source guidance, and catalog contract | TK-002 fresh Genesis remains |
| 2026-09-01 | TK-002 | Ticket closed | Red: node tools/test-workbench-layout.mjs failed before layout helper; green: fresh Genesis, traversal, and symlink fixtures plus complete Runbook suite passed | Updated AGENTS.md, RUNBOOK.md, Genesis template and skill, manifest/layout tool, and focused tests | TK-003 lossless Adoption remains |
| 2026-09-01 | TK-003 | Ticket closed | Red: node tools/test-workbench-adoption.mjs failed before the migration helper; green: mixed adoption/collision test plus complete Runbook suite, evaluator 106.6/113, and doctor passed | Updated AGENTS, RUNBOOK, Adoption template/skill, layout/spec tools, and focused tests; guardrail baseline/after remained 73/100 with pre-existing outcome-evidence gaps | TK-004 explicit update and rollback remains |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Generic `/handoff`, broad guidebook taxonomy, optional router/reference
  skills, and remaining pending-skill rewrites are deferred and do not block v3.
- Foundry may later consume or publish improvements through its own contracts;
  this capability does not wait for that work or import its runtime machinery.

## Supersession

- Supersedes: S-011 skill ownership/distribution/completion contract only.
- Superseded by: none.
