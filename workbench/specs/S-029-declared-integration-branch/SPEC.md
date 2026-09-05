# S-029 - Declared Integration Branch And Recoverable Completion

**Spec ID:** S-029
**Status:** active
**Priority:** 0
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Make the integration branch a manifest-declared fact that Genesis, Adoption, and doctor can check, and require generation and adoption to end as a committed branch with a reachable review gate.
**Blockers:** none
**Latest event:** TK-002 closed with proof.
**Next gate:** Complete TK-003.

## Outcome

Every Workbench room declares the branch its independent-review gate merges
into, the harness creates or checks that branch when it generates or adopts a
room, doctor says so when the declared branch does not resolve, and "finished"
for Genesis, Adoption, and upgrade means a commit on a prefixed branch, not a
set of files in a working tree.

## Why It Matters

`AGENTS.md` requires a separate-context reviewer to check every candidate
"before branches combine into `integration`". Where that branch does not exist
there is no combine point, the gate has no trigger, and the only route left is
feature branch into `main`, which the same file forbids. The upstream fix list
compiled by Master Workbench (`~/Master_Workbench/data/upstream/v3.1.1.json`,
item UP-011, rank `first`) read this live in two of four rooms on the owner's
machine: Master Workbench (Genesis v3.1.1) and Cashflow Calculator (Adoption
v3.1.1) have no integration branch at all, while Command Information Center has
`Integration` and OpenBrain has `integration`, so the same containment check
passes in one room and fails in the other. The harness repository itself keeps
`integration` locally and remotely and merges through it, so it practices the
rule while shipping no means to establish it.

The same fix list (UP-006, and the Cashflow finding `adoption-complete-but-
uncommitted`) records an adoption spec that read `Completed` while every
artifact it produced was untracked; one `git clean -fd` would have erased it.
`templates/AGENTS.md` tells ordinary tickets that a pushed branch is
recoverable, not delivered, and exempts the one-time migrations from that
standard.

## Current Verified State

Verified in this repository at `b7b23dd3f0929e37276880335cd4d4cc60238d8e`
(`origin/integration`, S-028 merged) on 2026-09-05:

- `templates/AGENTS.md:157` makes the PR target a fillable
  `[INTEGRATION_BRANCH_OR_DEFAULT]` placeholder; lines 162, 172, 173, 175
  and 178 then hardcode the branch literal `integration` regardless of what
  the placeholder was filled with (lines 167 and 182 use the word for the
  gate and for containment, not as a branch name). `templates/RUNBOOK.md:304-330` closeout text
  does the same in prose.
- `skills/genesis/SKILL.md:29-30` and `skills/adoption/SKILL.md:45-46` instruct
  promoting verified work to `integration`; neither creates the branch nor
  checks that it exists. No completion box in `templates/GENESIS.md` or
  `templates/ADOPTION.md` asks about the branch, and none asks that the run
  exists as a commit.
- `workbench/tools/template-placeholders.mjs:51` carries the placeholder in the
  vocabulary, so `validate --genesis` verifies only that it was filled, never
  that the branch it names resolves.
- `workbench/tools/spec-workbench.mjs` `doctor` (line 145 onward) has no Git
  awareness; the registry in `workbench/tools/diagnostics.mjs:15-53` has no
  code for a missing merge target, a stale checkout, or a room whose selected
  spec is already complete on its integration branch.
- `workbench/manifest.json` schema 2 declares lanes, collections, wiki profile,
  and skill policy; it has no field naming a branch.
- The v3.1.1 acceptance report
  ([REPORT-v3-1-1-acceptance-2026-09-05.md](../../feedback/REPORT-v3-1-1-acceptance-2026-09-05.md))
  reproduced F-006 live: at a branch tip fully contained in `integration`,
  `doctor` passed and `next --json` dispatched an agent to review and merge a
  spec that was already complete on `integration`. Its F-007 counted nine
  linked worktrees, eight under the host temporary directory, including the
  only checkout of `integration`; `git worktree list` on 2026-09-05 showed ten
  linked worktrees, all under that directory. No control names their
  lifetime.
- The Master Workbench feedback lane (`~/Master_Workbench/workbench/feedback/
  WORKBENCH_FEEDBACK.md`, row dated 2026-09-04) independently logged the
  missing commit box.

Gap: everything under Desired Behavior.

## Desired Behavior

1. `workbench/manifest.json` may carry a `git` block declaring
   `defaultBranch` and `integrationBranch` by exact name (case preserved).
   `workbench-layout.mjs init` writes it from `--default-branch` and
   `--integration-branch`, defaulting to the project's `origin/HEAD` name and
   `integration`; `workbench-adoption.mjs migrate` declares an existing
   `integration`-named branch by its exact case when one resolves, else the
   default, and lists a missing branch in its `residue`. A manifest without the
   block stays valid so existing rooms keep working.
2. `doctor` reports `integration-branch-undeclared` when the block is absent
   and `integration-branch-missing` when the declared branch resolves neither
   as a local head nor on any remote. Both are registered with severity
   `error`, a new `git` scope, and effect `none`: visible in every doctor run,
   never blocking spec selection, exactly like `invalid-note`.
   `validate --genesis` fails closed on either. The Adoption and upgrade
   tools never block on the branch: `migrate` lists a missing branch in its
   `residue`, and it is the protocol completion checklist (Desired Behavior 4)
   that refuses to call the run done without the branch or a recorded reason.
3. `templates/AGENTS.md`, `templates/RUNBOOK.md`, `skills/genesis/SKILL.md`,
   and `skills/adoption/SKILL.md` refer to the declared integration branch
   through the placeholder or the manifest, never to a bare literal that can
   disagree with the placeholder above it. The root `AGENTS.md` names
   `integration` as this repository's declared branch and points at the
   manifest.
4. `templates/GENESIS.md`, `templates/ADOPTION.md`, and the update-harness
   completion criteria each gain two boxes: the run exists as a commit on a
   prefixed task branch, and the declared integration branch exists on the
   default remote at the generation or migration commit or the owning spec
   records the explicit reason it was omitted. The Genesis and Adoption skills
   create the branch from the default branch when authorization permits.
5. `doctor` reports `complete-on-integration` (attention, scope `specs`, effect
   `none`) when the declared integration branch resolves and the spec that
   `next` would select is `complete` or `superseded` at that ref, so a checkout
   behind its integration branch is told so instead of dispatching finished
   work.
6. The root and template Runbook closeout prune linked worktrees
   (`git worktree prune`) and name where disposable review clones live.

## Decisions And Contracts

- **The integration branch is a declared fact, not a prose convention.**
  Controls resolve it from the manifest; nothing hardcodes a literal that can
  drift from the declaration. A room may declare any exact name, which is how
  `Integration` and `integration` stop being two different rooms.
- **Absence is visible, not fatal.** An undeclared or missing branch is an
  `error`-severity, `none`-effect finding in steady state and a fail-closed
  gate only at generation, adoption, and upgrade completion. Blocking every
  spec selection in an existing room over a branch it can create in one
  command would violate ADR-0020 (a check blocks only the change it
  evaluates).
- **Finished means committed.** Genesis, Adoption, and upgrade follow the same
  recoverability standard `AGENTS.md` applies to ordinary tickets. An omitted
  integration branch is recorded as a reason in the owning spec, following the
  `none observed` pattern S-028 established for feedback harvest.
- **No new Canon rule for worktrees.** F-007 is served by a Runbook closeout
  step and a named scratch convention, not by an additional `AGENTS.md`
  obligation (ADR-0034: required steps must enable delivery).
- The `git` manifest block is an additive schema 2 field, not a schema bump;
  `workbench-paths.mjs` exposes it through one accessor so no consumer reads
  the manifest directly.

## Non-Goals

- Creating branches in downstream rooms from this repository, or repairing the
  four rooms named above; each room declares and creates its own branch under
  its own controls.
- Making doctor block on a missing branch, or normalizing branch names for a
  room (the declaration carries the exact name).
- A general "checkout is behind" diagnostic for every feature branch; only the
  finished-work case in F-006 is covered.
- Changing who may merge `integration` into `main`.

## Dependencies And Blockers

- none. S-028 is complete and its residue contract is reused for the missing
  branch entry.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Manifest `git` block, layout and adoption flags, `integration-branch-undeclared` and `integration-branch-missing` in doctor and the Genesis gate | done | none | node tools/test-diagnostics.mjs (5 pass: registry describes integration-branch-undeclared and integration-branch-missing as error/git/none; doctor reports both without failing, next and claim proceed), node tools/test-workbench-layout.mjs (21 pass: init and migrate write git.defaultBranch and git.integrationBranch, validate --genesis fails closed on both codes and passes once the exact-case branch resolves, manifest without the block stays valid), node tools/test-workbench-adoption.mjs (migrate declares an existing Integration branch by exact case and lists a missing branch as residue.missingIntegrationBranch), node tools/test-wiki.mjs, node tools/test-workbench-round-trip.mjs, node tools/test-cross-provider-fixture.mjs, node tools/test-adr.mjs, node tools/test-governance-core.mjs all green; doctor clean on this checkout |
| TK-002 | Reconcile template and root controls, Genesis and Adoption skills, completion boxes for commit and branch, Runbook closeout prune | done | TK-001 | node tools/test-governance-core.mjs (12 pass: templates/AGENTS.md Git Rules and Branch Completion carry no bare integration literal and route through [INTEGRATION_BRANCH_OR_DEFAULT] and git.integrationBranch; root AGENTS.md names the manifest declaration; genesis and adoption skills create the declared branch from the default branch; GENESIS, ADOPTION, and update-harness carry the commit-on-prefixed-branch and declared-branch-or-recorded-reason boxes; root and template Runbook closeout prune worktrees and name the scratch location), node tools/test-skill-catalog.mjs (core skills reference git.integrationBranch), node tools/test-branch-closeout.mjs (6 pass with git worktree prune in the cleanup block), node tools/test-workbench-layout.mjs (placeholder vocabulary unchanged), node tools/test-adr.mjs and adr validate (ADR-0039 accepted, canonicalized in AGENTS.md, RUNBOOK.md, LEXICON.md); guardrail audit 78/100 before and after |
| TK-003 | `complete-on-integration` attention finding when the selected spec is complete at the declared integration ref | ready | TK-001 | pending |

### TK-001 - Declare and check the branch

**Stance:** Builder

Red first: a disposable project initialized with `--integration-branch
integration` and no such branch must produce `integration-branch-missing` from
`doctor` and fail `validate --genesis`; creating the branch turns both green.
A manifest without the block yields `integration-branch-undeclared` and still
validates. Adoption of a fixture room that already has `Integration` declares
that exact name. Register the codes and the `git` scope in
`diagnostics.mjs`; `tools/test-diagnostics.mjs` must describe them.

### TK-002 - Controls and completion

**Stance:** Builder

Replace the five hardcoded `integration` branch literals in
`templates/AGENTS.md` Git Rules and Branch Completion (lines 162, 172, 173,
175, 178) with the placeholder or "the declared integration branch", keep `tools/test-governance-core.mjs` branch-completion
assertions green, and add the two completion boxes to both protocols and the
update-harness skill. Root `AGENTS.md` gains one sentence naming the manifest
declaration. Runbook closeout adds `git worktree prune` and the scratch
location for review clones.

### TK-003 - Finished work is not dispatched

**Stance:** Builder

Red first: a fixture whose `integration` ref carries S-001 as `complete` while
the checkout carries it `active` must produce `complete-on-integration` naming
the spec and ref; `next` still returns the slice, so the finding informs and
does not block (F-006's counter-consideration: a checkout may be pinned
deliberately).

## Acceptance Criteria

- [ ] A manifest may declare `git.defaultBranch` and `git.integrationBranch`; `init` and `migrate` write it; a manifest without it stays valid.
- [ ] `doctor` reports `integration-branch-undeclared` and `integration-branch-missing`; `validate --genesis` fails closed on both; neither blocks `next` or `claim`.
- [ ] No template control or core skill hardcodes a literal integration branch that can disagree with the placeholder or manifest.
- [ ] Genesis, Adoption, and update-harness completion require a commit on a prefixed branch and a resolving declared integration branch or a recorded omission reason.
- [ ] `doctor` reports `complete-on-integration` when the selected spec is complete at the declared ref.
- [ ] Root and template Runbook closeout prune worktrees; the full required suite, render, and doctor pass.

## Testing Seams

- `workbench-layout.mjs init|migrate|validate --genesis` against disposable Git
  repositories with and without the declared branch.
- `doctor(root, { home, today })` returning registered findings; `describe(code)`
  in `diagnostics.mjs`.
- `workbench-adoption.mjs migrate` against the mixed-v2 fixture with an
  `Integration` branch.
- `tools/test-governance-core.mjs` control-text assertions for root and
  template `AGENTS.md`.

## Verification Procedure

```bash
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node tools/test-workbench-adoption.mjs
node tools/test-spec-workbench.mjs
node tools/test-governance-core.mjs
node tools/test-branch-closeout.mjs
```

Then the full `AGENTS.md` verification suite, `render`, `doctor`, and
`git diff --check`.

## Documentation Impact

- `AGENTS.md` (root and template): declared integration branch, completion
  boxes routed from the protocols.
- `RUNBOOK.md` (root and template): closeout prune step, scratch convention,
  the two new doctor findings.
- `LEXICON.md`: `Declared integration branch` term once TK-001 lands.
- `templates/GENESIS.md`, `templates/ADOPTION.md`, `skills/genesis`,
  `skills/adoption`, `skills/update-harness`: completion criteria.
- An ADR recording that the integration branch is a manifest-declared fact,
  `proposed` until TK-002 canonicalizes it.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Spec captured from the Master Workbench v3.1.1 upstream fix list (UP-011 rank first, UP-006) and the acceptance report (F-006, F-007) | Mechanisms re-read at `b7b23dd`: placeholder at `templates/AGENTS.md:157` with five literal `integration` branch names below it; no branch code in `diagnostics.mjs`; `git worktree list` shows eleven worktrees with `integration` under the temp directory | Blueprint v3.1.2 direction links this spec | All three slices |
| 2026-09-05 | TK-001 | Ticket closed | node tools/test-diagnostics.mjs (5 pass: registry describes integration-branch-undeclared and integration-branch-missing as error/git/none; doctor reports both without failing, next and claim proceed), node tools/test-workbench-layout.mjs (21 pass: init and migrate write git.defaultBranch and git.integrationBranch, validate --genesis fails closed on both codes and passes once the exact-case branch resolves, manifest without the block stays valid), node tools/test-workbench-adoption.mjs (migrate declares an existing Integration branch by exact case and lists a missing branch as residue.missingIntegrationBranch), node tools/test-wiki.mjs, node tools/test-workbench-round-trip.mjs, node tools/test-cross-provider-fixture.mjs, node tools/test-adr.mjs, node tools/test-governance-core.mjs all green; doctor clean on this checkout | RUNBOOK.md (git block, init/migrate flags, both doctor codes in the effects table, branch creation commands); LEXICON.md and templates/LEXICON.md (Declared integration branch term); ADR-0039 proposed; workbench/manifest.json declares main and integration | TK-002 controls, skills, protocol completion boxes, closeout prune, ADR acceptance; TK-003 complete-on-integration |
| 2026-09-05 | TK-002 | Ticket closed | node tools/test-governance-core.mjs (12 pass: templates/AGENTS.md Git Rules and Branch Completion carry no bare integration literal and route through [INTEGRATION_BRANCH_OR_DEFAULT] and git.integrationBranch; root AGENTS.md names the manifest declaration; genesis and adoption skills create the declared branch from the default branch; GENESIS, ADOPTION, and update-harness carry the commit-on-prefixed-branch and declared-branch-or-recorded-reason boxes; root and template Runbook closeout prune worktrees and name the scratch location), node tools/test-skill-catalog.mjs (core skills reference git.integrationBranch), node tools/test-branch-closeout.mjs (6 pass with git worktree prune in the cleanup block), node tools/test-workbench-layout.mjs (placeholder vocabulary unchanged), node tools/test-adr.mjs and adr validate (ADR-0039 accepted, canonicalized in AGENTS.md, RUNBOOK.md, LEXICON.md); guardrail audit 78/100 before and after | AGENTS.md and templates/AGENTS.md (declared integration branch, Branch Completion without literals); RUNBOOK.md and templates/RUNBOOK.md (closeout git worktree prune, scratch convention, doctor findings); templates/GENESIS.md, templates/ADOPTION.md, skills/genesis, skills/adoption, skills/implement, skills/update-harness (declared branch and completion boxes); ADR-0039 accepted and registered | TK-003 complete-on-integration |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Existing rooms must add the `git` block by hand or through the next
  update-harness run; this spec does not edit them.
- `complete-on-integration` reads the integration ref that the local repository
  already has; it does not fetch.
- The version stamp for these changes belongs to
  [S-035](../S-035-workbench-v3-1-2-candidate/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
