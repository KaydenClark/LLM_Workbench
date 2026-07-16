# S-011 - Agent Skills Adoption

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-011-agent-skills-adoption/SPEC.md`; never move between status folders.

**Spec ID:** S-011
**Status:** active
**Priority:** 2
**Owner:** codex
**Updated:** 2026-07-16
**Catalog description:** Curated, Workbench-vocabulary agent skills (grill, to-spec, to-tickets, implement, review) shipped as part of the harness.
**Blockers:** none
**Latest event:** The 30-skill owner catalog is preserved, while 19 unfinished imports are fail-closed outside live discovery pending Workbench rewrites.
**Next gate:** Rewrite and promote the first pending delivery pair under TK-009; Kayden authentication remains the separate Claude runtime gate.

## Outcome

Agents and the owner invoke the harness workflow through named skills —
interview a plan (`grill-me`), capture a spec (`to-spec`), break it into
tracer-bullet tickets (`to-tickets`), implement one ticket with verification and
evidence (`implement`) — instead of re-explaining the process each session. The
skills speak Workbench vocabulary and ship with the harness.

## Why It Matters

The harness has strong control docs but no conversational entry points; the
owner has been retyping process prompts. The Pocock skill set proved the
pattern; owning rewritten copies keeps the tools debuggable ("if the tools
aren't yours you won't know how to fix them") and keeps one truth contract.

## Current Verified State

- The catalog contains 30 owner-approved entries after retiring
  `grill-with-docs` and adding native `sitrep`, `to-docs`, `genesis`, and
  `adoption` entrypoints. Eleven reviewed entries are live in `skills/`.
- Nineteen imported baselines still reference upstream conventions that
  conflict with the Workbench truth-routing contract. Their source is
  preserved in `skills-pending/`, outside live discovery, until rewritten.
- GPT_OS exposes the same tracked folder through `.claude/skills` and
  `.agents/skills`; the untouched upstream snapshot and installer lock are
  preserved at `.agents/upstream-matt-skills-2026-07-14/`.
- Root and template `LEXICON.md` files now own accepted shared definitions,
  seeded with the owner's definition of design concept.
- Filesystem discovery and a fresh ephemeral Codex session are verified against
  the canonical Factory skills. Claude is logged out, so its non-persistent
  discovery probe stops at authentication before skill loading; reauthentication
  remains an owner-controlled credential gate.

## Desired Behavior

- Core-flow skills operate on `BLUEPRINT.md`, `specs/S-###-slug/SPEC.md`,
  `TASKBOARD.md`, and `RUNBOOK.md` with no parallel truth files.
- `LEXICON.md` owns accepted cross-capability terms without becoming an
  always-loaded requirements or decision file.
- `ask-workbench` maps situations to the smallest suitable skill or flow.
- Sitrep stays conversational and read-only; documentation persistence is a
  separate `to-docs` action.
- Skills are distributed to projects through the harness upgrade path.
- Genesis is the callable greenfield bootstrap; Adoption is the callable
  one-time existing-project migration; routine changes use `update-harness`.

## Decisions And Contracts

- Canonical live skill source lives in this repo at `skills/`; GPT_OS points
  both `.claude/skills` and `.agents/skills` at it. Preserved unfinished source
  lives in `skills-pending/` and is never a discovery target. Downstream
  projects consume a symlink or copied rewritten subset through the harness
  upgrade path.
- `skills/README.md` owns the selected names, definitions, rewrite lanes, and
  discovery availability; `tools/test-skill-catalog.mjs` fails when active or
  pending folders diverge from it.
- The untouched upstream snapshot stays outside live discovery at
  `.agents/upstream-matt-skills-2026-07-14/`.
- Upstream license is MIT; provenance links from `skills/README.md` to the
  verbatim tracked notice in `THIRD_PARTY_NOTICES.md`.
- Until rewritten, imported skills' upstream conventions are isolated under
  `skills-pending/` and cannot be invoked in Workbench projects.
- `LEXICON.md` owns shared definitions. `BLUEPRINT.md` helps participants
  reconstruct the design concept but is not the design concept or glossary.
- BLUEPRINT keeps its name and design-concept role; the Pocock per-feature
  "spec/PRD" maps to `S-###` specs and tickets, not to BLUEPRINT.
- Grilling ends only on Kayden's exact `make it so` passphrase. `to-docs` owns
  persistence after settled conversation; the combined `grill-with-docs`
  wrapper is retired.
- Genesis and Adoption remain thin entrypoints over the existing template
  protocols. Both establish remote recovery; Adoption never doubles as the
  routine harness updater.

## Non-Goals

- Importing author-personal, course, or superseded upstream skills.
- Renaming Workbench control docs to upstream names (PRD, kanban).
- Building a plugin/marketplace distribution channel.

## Dependencies And Blockers

- none; the owner supplied the selected roster and initial definitions.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Import curated upstream skills with provenance and wire GPT_OS discovery | done | none | see evidence 2026-07-14 |
| TK-002 | Rewrite `to-tickets` to persist slices only in the assigned Workbench spec | done | none | Red/green node tools/test-skill-catalog.mjs; RUNBOOK full suite, template evaluator 106.6/113, render, doctor, and git diff --check passed |
| TK-003 | Verify rewritten skills in fresh Claude and Codex sessions and prepare downstream distribution | blocked | Owner Claude authentication | Fresh Codex discovery and dry-run passed; Claude OAuth expired before skill loading |
| TK-004 | Reconcile the owner-selected catalog, canonical cross-agent discovery, and shared Lexicon | done | none | see evidence 2026-07-14 |
| TK-005 | Rewrite the grilling discipline and its Desktop-facing entry points | done | none | Red/green skill-catalog contract; RUNBOOK full suite; template evaluator 106.6/113; render, doctor, and git diff --check passed |
| TK-006 | Add Sitrep and split settled documentation/spec capture from grilling | done | none | Red/green skill-catalog contract; complete RUNBOOK suite; template evaluator 106.6/113; render, doctor, and git diff --check passed |
| TK-007 | Add callable Genesis and Adoption entrypoints with remote-first recovery and distinct update routing | done | none | targeted catalog contract red at 28 vs 30, then green; complete Runbook suite, template evaluator 106.6/113, render, doctor, and diff check passed |
| TK-008 | Preserve upstream notice and fail-close unfinished imported skills outside live discovery | done | none | Targeted catalog red/green; full Runbook suite; fresh Codex active/pending discovery; template evaluator 106.6/113; live guardrail 78/100; render, doctor, and diff check passed |
| TK-009 | Rewrite and promote pending `implement` and `code-review` as the next delivery-flow pair | ready | none | pending |

### Scoped Ticket: TK-002

**Timebox:** 15-45 minutes.

**Vertical slice:** Rewrite only `skills/to-tickets/SKILL.md` as the first
core-flow exemplar. Given an already-assigned `S-###` spec, the skill proposes
one-context tracer-bullet slices and, after approval, updates that spec's
`Vertical Implementation Slices` table. It must not create `.scratch/` issue
files, publish to an external tracker, or introduce another requirements,
decision, or proof store.

**Done criteria:**

- `skills/to-tickets/SKILL.md` names the assigned `SPEC.md` as the only ticket
  store, keeps `TASKBOARD.md` a generated projection, and uses the lifecycle
  commands from `RUNBOOK.md` rather than upstream tracker setup.
- A red/green contract in `tools/test-skill-catalog.mjs` first fails on the
  imported `.scratch/` and tracker workflow, then passes after the rewrite; it
  also requires the stable Workbench nouns and `render`/`doctor` handoff.
- The rewrite changes no other skill and creates no ticket file outside this
  stable spec.
- The targeted catalog test and the full RUNBOOK verification suite pass; the
  spec evidence names both results and the remaining core-skill rewrite gap.

**Verification:**

- Targeted red/green: `node tools/test-skill-catalog.mjs`.
- Full suite: the eleven commands under RUNBOOK `Full verification`, followed
  by `node tools/spec-workbench.mjs render`,
  `node tools/spec-workbench.mjs doctor`, and `git diff --check`.

**Documentation:** Update this spec's append-only evidence and render the
generated Taskboard. Check `skills/README.md`, `RUNBOOK.md`, and `BLUEPRINT.md`;
if the existing catalog definition and contracts remain accurate, record
`Docs checked; no update needed` with that reason rather than duplicating them.

**Dependencies and blockers:** none. Do not claim TK-003 or TK-005 in this
slice. Rewriting the remaining core skills is an explicit later gap, not part of
TK-002.

### Scoped Ticket: TK-005

**Vertical slice:** Rewrite `grilling`, `grill-me`, and `grill-with-docs` as one
usable question-first flow. The flow reaches shared understanding, researches
discoverable facts, and routes only settled truth to existing Workbench owners.

**Done criteria:**

- The core discipline walks every relevant decision-tree branch in dependency
  order, provides a recommended answer for each question, and asks one question
  at a time while waiting for the owner's answer.
- The interview researches discoverable facts, leaves decisions to the owner,
  and takes no action until the owner confirms shared understanding.
- `grill-me` remains a thin, runtime-agnostic wrapper and creates no durable
  artifact.
- `grill-with-docs` uses the same interview behavior and, after confirmation,
  routes project-wide definitions to `LEXICON.md`, cross-cutting direction to
  `BLUEPRINT.md`, and scoped decisions to the assigned `SPEC.md`. It creates no
  parallel context, ADR, tracker, or glossary layer.
- `tools/test-skill-catalog.mjs` fails on the imported behavior before the
  rewrite and passes afterward. The full RUNBOOK suite, render, doctor, and
  `git diff --check` pass.

**Documentation:** Update this spec's evidence and render `TASKBOARD.md`.
Check the catalog, Blueprint, Lexicon, and Runbook for drift; update only the
owning surface.

### Scoped Ticket: TK-006

**Vertical slice:** Add native `sitrep` and `to-docs`, rewrite `to-spec` into the
Workbench lifecycle, add the exact grilling authorization passphrase, and retire
the overlapping `grill-with-docs` wrapper.

**Done criteria:**

- Sitrep is conversation-only, read-only, smallest-scope, and delegates Scout
  only when evidence is insufficient.
- `to-docs` routes settled truth to existing owners and never creates another
  tracker or document layer.
- `to-spec` creates or updates one stable Workbench spec, renders, and runs
  doctor without publishing to an external tracker.
- Grilling stops only for the exact `make it so` passphrase; the catalog and
  router contain `sitrep` and `to-docs` but no `grill-with-docs`.
- The red/green catalog test, full Runbook suite, render, doctor, and diff check
  pass. Static scores remain diagnostics rather than outcome claims.

### Scoped Ticket: TK-007

**Vertical slice:** Add two thin native entrypoints over the existing Genesis
and Adoption protocols. Genesis handles a new greenfield project; Adoption
handles the first migration of an existing project; `update-harness` remains
the only routine harness-update route.

**Done criteria:**

- The catalog, folders, and router expose `genesis` and `adoption` distinctly.
- Both skills require remote-first checkpoint recovery, default to private when
  authorized to create a missing remote, stop at `integration`, and never infer
  public visibility, credential changes, or remote-history rewrites.
- The skills delegate detailed migration behavior to `templates/GENESIS.md` and
  `templates/ADOPTION.md` instead of copying those protocols.
- A red/green catalog contract and the full Runbook suite pass; render, doctor,
  and `git diff --check` remain green.

### Scoped Ticket: TK-009

**Vertical slice:** Rewrite the preserved `implement` and `code-review`
baselines against the Workbench spec lifecycle, one durable writer lane, and
the repository's Git/verification rules; promote them into `skills/` only after
their contract tests pass.

**Done criteria:**

- Neither skill invents an external issue, PRD, tracker, context, ADR, or proof
  store; the assigned Workbench spec remains the work and evidence owner.
- `implement` claims and closes one eligible spec slice, runs project-owned
  verification, updates owning docs, and makes a truthful pushed checkpoint.
- `code-review` compares the fixed diff against repository controls and the
  assigned Workbench spec, reports findings before summary, and remains
  review-only unless a fix is separately authorized.
- Targeted red/green contracts and the complete Runbook suite pass before both
  folders move from `skills-pending/` to `skills/` and the router restores the
  delivery links.

## Acceptance Criteria

- [x] The selected 30-skill catalog matches the combined active and pending
      physical folders exactly; only reviewed entries are live-discovered.
- [x] GPT_OS `.claude/skills` and `.agents/skills` resolve to the tracked
      Workbench skill folder; the upstream snapshot remains preserved.
- [x] Root and template Lexicons preserve the owner's design-concept definition
      and the Workbench truth-routing boundary.
- [ ] Core-flow skills reference only Workbench control-doc nouns (no
      `docs/agents/`, `.scratch/`, `CONTEXT.md` writes).
- [ ] A fresh Claude Code session in GPT_OS lists the skills as invocable.
- [x] A fresh Codex session in GPT_OS lists the same canonical skills after the
      Genesis and Adoption additions.
- [ ] Router skill routes Sitrep plus the full flow (grill → to-docs or to-spec
      → to-tickets → implement → review) using only active Workbench skills.
- [x] `skills/README.md` selected catalog matches the folder contents after
      Sitrep/documentation routing lands.
- [x] Genesis, first-time Adoption, and routine `update-harness` are separate
      callable routes with no overlapping lifecycle authority.

## Testing Seams

- Static: selected active/pending catalog and folder parity, Lexicon contract,
  upstream notice, and forbidden-live-routing scan.
- Runtime: both discovery symlinks resolve to the canonical folder; fresh-session
  skill listings remain manual, owner-checkable gates.

## Verification Procedure

```bash
node tools/test-skill-catalog.mjs
readlink /Users/kayden/GPT_OS/.claude/skills
readlink /Users/kayden/GPT_OS/.agents/skills
grep -rl "docs/agents\|\.scratch/" skills/<rewritten-skill>/  # empty after TK-002
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `skills/README.md` owns provenance, selected definitions, and rewrite lanes.
- Root/template `LEXICON.md` own shared-definition structure.
- Root/template controls point to the Lexicon and catalog self-test.
- Machine wiki GPT_OS page notes the new skills surface after rollout (TK-003).
- RUNBOOK/BLUEPRINT references updated when skills become part of the shipped
  harness contract (TK-002+).

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-14 | TK-001 | Imported 28 skills from mattpocock/skills (MIT) into `skills/` with provenance README; linked `GPT_OS/.claude/skills` -> `workbench templates/skills` | `ls skills | wc -l` = 29 (28 + README); full suite + doctor green (see PR) | skills/README.md added | Fresh-session discovery unverified (TK-003); rewrites pending (TK-002) |
| 2026-07-14 | TK-004 | Corrected the earlier count: the import contained 27 upstream folders plus native `update-harness`; reconciled that intake to the owner's 25 selected upstream baselines plus `ask-workbench` and `update-harness`; made the tracked folder canonical for both discovery paths; added root/template Lexicons | `node tools/test-skill-catalog.mjs` passed; both `readlink` calls resolve to `workbench templates/skills`; upstream snapshot and lock preserved | README, AGENTS, BLUEPRINT, RUNBOOK, GENESIS, ADOPTION, HARNESS_FEEDBACK, LEXICON, S-011 updated in root/templates as applicable | Core and supporting skill rewrites plus fresh-session listings remain |
| 2026-07-15 | TK-002 | Ticket closed | Red/green node tools/test-skill-catalog.mjs; RUNBOOK full suite, template evaluator 106.6/113, render, doctor, and git diff --check passed | Docs checked; no update needed: skills/README.md, RUNBOOK.md, and BLUEPRINT.md already state the catalog, lifecycle, and active S-011 contract accurately | Rewrite remaining core and supporting skills (TK-005); fresh Claude and Codex discovery remains owner-checkable (TK-003) |
| 2026-07-15 | TK-005 | Ticket closed | Red/green skill-catalog contract; RUNBOOK full suite; template evaluator 106.6/113; render, doctor, and git diff --check passed | Updated the three grilling skills and S-011; skills README, BLUEPRINT, LEXICON, and RUNBOOK checked with no update needed because their ownership and catalog definitions remain accurate | TK-006 remaining rewrites; TK-003 fresh-session discovery and behavior proof |
| 2026-07-15 | TK-005 review | Independent standards/spec review findings addressed | Linked the design-concept definition to LEXICON, removed wrapper duplication, strengthened parallel-layer guards; final RUNBOOK suite, both discovery symlinks, render, doctor, and git diff --check passed | S-011 evidence updated; other owning docs remain accurate | TK-006 remaining rewrites; TK-003 fresh-session discovery and behavior proof |
| 2026-07-15 | S-011 owner simplification review | Restored Matt's compact `grilling` and `grill-me` behavior, reduced `grill-with-docs` to its Workbench-specific delta, pruned duplicated router and `to-tickets` rules, and changed catalog tests to enforce behavior rather than the removed framework terms | Targeted catalog test failed red on the old behavior and passed green after the correction; full RUNBOOK suite passed; template evaluator remained 106.6/113; render, doctor, and git diff --check passed | Updated S-011's current TK-005 criteria and evidence; skills README, BLUEPRINT, LEXICON, and RUNBOOK checked with no update needed because their ownership and catalog definitions remain accurate | Prompt contracts are verified, but fresh-session behavior remains TK-003 |
| 2026-07-16 | TK-006 | Ticket closed | Red/green skill-catalog contract; complete RUNBOOK suite; template evaluator 106.6/113; render, doctor, and git diff --check passed | Updated skills README, ask-workbench, grilling, to-spec, new sitrep/to-docs skills, S-011, and generated TASKBOARD | Remaining imported skill rewrites and fresh Claude/Codex discovery; Genesis and Adoption callable entries remain a later authorized slice |
| 2026-07-16 | TK-003 discovery audit | Fresh ephemeral Codex discovered and dry-ran `sitrep` and `to-docs`; the retired `grill-with-docs` was absent. Claude stopped before skill loading because the owner's OAuth session is expired. | Canonical alias and both discovery symlinks resolve to `Workbench Factory/skills`; catalog count 28; `codex exec --ephemeral --sandbox read-only` exited 0; `claude --print --no-session-persistence --permission-mode plan --tools ''` exited 1 with expired OAuth; `claude auth status` reports `loggedIn: false` | Updated S-011 and generated Taskboard only; no credential or runtime configuration changed | Kayden authenticates Claude, then rerun `/sitrep` and `/to-docs`; remaining imported skill rewrites and downstream distribution still follow |
| 2026-07-16 | TK-007 | Added thin `genesis` and `adoption` entrypoints over the existing protocols; Genesis owns greenfield setup, Adoption owns first migration only, and `update-harness` owns routine upgrades. Both entrypoints require remote-first checkpoints and stop automation at `integration`. | Catalog contract failed red at 28 vs 30, then passed green; complete Runbook suite, template evaluator 106.6/113, render, doctor, and `git diff --check` passed | Updated skill catalog/router, two new skills, S-011, and generated Taskboard; protocol detail remains in existing Genesis/Adoption templates | Fresh discovery must be rerun for the expanded 30-skill catalog; Claude remains blocked on owner authentication; other imported rewrite lanes remain |
| 2026-07-16 | TK-003 discovery audit after TK-007 | A fresh ephemeral Codex session exposed `genesis`, `adoption`, `update-harness`, `sitrep`, and `to-docs`, excluded retired `grill-with-docs`, and correctly distinguished the three project-lifecycle routes. | `codex exec --ephemeral --sandbox read-only --cd /Users/kayden/GPT_OS` exited 0 against pushed commit `5b60ab5`; both discovery links resolve through the compatibility alias to canonical `Workbench Factory/skills` | Updated S-011 and generated Taskboard only; no credential or runtime configuration changed | Claude discovery remains blocked until Kayden authenticates; remaining imported rewrite lanes and downstream distribution still follow |
| 2026-07-16 | TK-008 | Retained Matt Pocock's MIT copyright and permission notice verbatim; split the selected catalog into 11 reviewed live skills and 19 preserved pending rewrites; removed pending routes; changed `update-harness` and the project Blueprint to the canonical Factory path; fixed EOF hygiene | Catalog test failed red on missing availability, then passed with exact notice, active/pending parity, forbidden live-routing, canonical-path, and EOF assertions; complete Runbook suite passed; template evaluator 106.6/113; live guardrail 78/100; fresh ephemeral Codex reported all 11 active entries discoverable and `implement`, `code-review`, and `domain-modeling` absent (`ACTIVE_OK`); render, doctor, and diff check passed | Updated README, skills catalog, router, Blueprint, S-011, generated Taskboard, and tracked third-party notice | TK-009 restores `implement` and `code-review` after rewrite; later tickets promote the other pending skills; Claude remains owner-auth blocked |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Nineteen selected upstream baselines remain safely preserved but unavailable
  under `skills-pending/`; promotion is test-gated and begins with TK-009.
- Claude discovery remains blocked until the owner authenticates; no credential
  configuration is changed by this spec.
- Distribution to existing projects follows via `update-harness` after the
  required selected rewrites are active.

## Supersession

- Supersedes: none
- Superseded by: none
