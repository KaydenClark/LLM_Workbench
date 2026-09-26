---
name: update-harness
description: Update a project to the current canonical LLM Workbench harness without losing project-specific controls, work state, or proof.
---

# Update Harness

Migrate one existing project to the current canonical LLM Workbench contract.
Reconcile; do not overwrite. The target project's verified truth survives the
template change.

## Invocation

Use `/update-harness [project path]`. If the path is omitted, use the current
repository. Treat an explicitly requested version as the target only after the
canonical source confirms it exists.

Locate the checked-out LLM Workbench repository that supplies the target
version before reading its templates or lifecycle tooling. This public product
is self-contained and does not require a private machine path or external skill
catalog.

## Route selection

Choose the route from the target's starting point before running anything:

- **A v2-root room** (root `specs/`, no `workbench/` support root) takes the
  one-time `tools/workbench-upgrade.mjs upgrade` route. It has two exclusive
  mode flags, `--layout-only` and `--explicit-update`, and both do the same
  work: they lay the core skills lane and its discovery adapters down inside
  the room from the release checkout. `--layout-only` is the name to use for
  an already-adopted room; `--explicit-update` is the name every one-time
  upgrade historically required.
- **A room already on a v3 support root** takes the maintenance route: the
  additive layout migration, then explicit receipt-backed updates of the
  managed runtime tools and core skills. The one-time route refuses such a
  room with `support-root-exists`.

Neither route reads, compares, marks, backs up or replaces a skill in the
provider home; `--home` only names where a later backup is written. A
same-named skill in a user-scoped provider root is not a room concern, so do
not propose inventorying, backing up or replacing one to make either route run.
Publishing skills to a personal catalog is a separate operation with its own
authorization.

## 1. Establish authority and source truth

1. Read the applicable root and project-local `AGENTS.md` files completely.
2. Verify the target repository root, branch, remote, upstream, worktrees, and
   dirty state.
3. Verify the canonical Workbench path, branch, remote, dirty state, and current
   version from its `workbench/manifest.json` `workbenchVersion`; this is the
   verified target version used throughout, and a `README.md` restatement is
   only a cross-check.
4. Read the canonical `templates/ADOPTION.md`, the current control templates,
   and the upgrade section in the target `RUNBOOK.md` when it exists.

If the active checkout is dirty or belongs to another work lane, preserve it and
create a separate worktree from the target's verified staging/default branch.
Never stash, discard, or absorb unrelated work merely to make the migration
convenient.

Completion criterion: both source and target are verified live, the migration
base is explicit, and no unrelated dirty state is at risk.

## 2. Inventory and baseline

List every file that steers agents or humans, including root controls,
`CLAUDE.md`, `.claude/`, roadmaps/gameplans, policy/checklist files, taskboards,
specs, and harness feedback. Classify each:

- **Port**: project truth that belongs in a current control file or spec.
- **Fold**: live rules that should move into the current `AGENTS.md` contract.
- **Keep**: project-local design, research, or operations material the harness
  should reference rather than absorb.
- **Retire**: a competing old control or queue that must become a cold archive.

Run the target's documented full verification suite before editing. Read named
PASS/FAIL markers and test totals; do not trust a zero process code when the tool
can print load or parse errors and still exit zero.

If the baseline cannot be taken at all - the suite cannot run for a reason this
change did not cause and cannot repair - record it in the owning spec's
`**Baseline:**` field as `unavailable` with one reason from the closed set
`host-restricted`, `product-broken-as-found`, or `owner-declined-on-boundary`,
the evidence for that reason, and the statement that the requested change is
not implicated. A reason outside that set is refused. The change then proceeds
against that record, and every later completion criterion compares against the
recorded state instead of a green run and says so. A red baseline is not
unavailable: it still stops unless the owner explicitly expands the task, and
`unavailable` never relabels a failing suite.

Completion criterion: every steering file is classified and a reproducible,
green pre-migration baseline is recorded, or the baseline is recorded
`unavailable` with its reason and evidence. If the baseline is red, record the
existing failure and stop unless the user explicitly expands the task to fix it.

## 3. Reconcile the new ownership model

Compare the target's current harness with the canonical templates. Copy only
the changed contract; preserve filled project-specific scope, Git rules,
verification commands, product boundaries, and safety rules.

Settle the target's starting point first:

- **A v2-root room, whether it was adopted earlier or not**: it has a root
  `specs/` directory and no `workbench/` support root, so it cannot yet declare
  a lane. Run the layout route from the checked-out Workbench against the
  clean, committed target:

  ```bash
  node tools/workbench-upgrade.mjs upgrade \
    --project [ABSOLUTE_PROJECT_PATH] \
    --home [USER_HOME] \
    --version [TARGET_VERSION] \
    --layout-only
  ```

  It refuses a dirty or uncommitted target, migrates the legacy lanes once
  through the Adoption seam, installs the receipt-backed runtime tools and the
  receipt-backed core skills lane with its adapters, records
  `provenance.lifecycle: upgrade` with the exact source commit, and writes
  `workbench/sessions/recovery/upgrade-recovery.json` with
  `skills: "lane-install"`, the pre-migration Git SHA and tracked-path
  inventory, and both receipts. It never touches a provider-home discovery
  root. A layout failure reports partial completion with that pre-migration
  SHA as the recovery point. Only after it completes
  do you reconcile specs through the manifest the route just declared
  (`workbench/manifest.json`). Never rerun Adoption for an already-adopted
  room; a second `adoption` record contradicts its first.
- **A room already on a v3 support root**: never rerun Adoption or the
  one-time route. From the release checkout, in order:
  1. Record the before state: the target's Git SHA and a hash inventory of
     every tracked file, classified as project-owned (controls, product code,
     active specs, completed evidence, Wiki content, room-added skills) or
     Workbench-managed (the receipted files in the tools and skills lanes).
     Run `node tools/workbench-tools.mjs verify --project PATH` and
     `node tools/workbench-skills.mjs verify --project PATH` and keep their
     findings; drift found here is reported, not silently absorbed.
  2. Run `workbench-layout.mjs migrate --project PATH --version [TARGET_VERSION]`
     for additive declared collections. It preserves old note paths and
     reports its exact layout source. Seeded schema/examples retain adjusted
     room copies.
  3. Stamp the manifest `workbenchVersion` with the verified target version
     and set its `skillPolicy` to the one in the release checkout's manifest;
     no command writes either for a current-schema room, and a stamped
     manifest validates only with the target release's policy. Confirm with
     `node workbench/tools/workbench-layout.mjs validate --project PATH`. The manifest's
     `provenance.source` and lifecycle stay historical; a release mismatch
     reported as `unverified-provenance` alone is not authority to run
     `record-source`. Then run
     `node workbench/tools/workbench-layout.mjs seed-documents --project PATH`
     from the release checkout to refresh eligible seeded documents; a copy
     the room changed is retained and reported.
  4. Reconcile only the intended template sections through the existing
     manifest, preserving filled project-specific content.
  5. Run `node tools/workbench-tools.mjs update --project PATH --home HOME
     --explicit-update` for runtime tools and `node tools/workbench-skills.mjs
     update --project PATH --home HOME --explicit-update` for the core skills
     in `workbench/skills`. Retain each receipt and recorded backup. A room
     stamped before the skills lane existed gets the lane and its
     `.agents/skills` and `.claude/skills` adapters from `workbench-skills.mjs
     install` after the layout migration declares it. Room-added skills are
     never copied, hashed, replaced or removed.
  6. Verify managed bytes: rerun both `verify` commands; each must report no
     receipt drift, and every installed managed hash must equal the release
     checkout's bytes.
  7. Take the after inventory and account for every changed path: only
     managed files, the manifest stamp, seeded documents and the intended
     control sections may differ. Name the rollback: the recorded tool and
     skill backups restore through each tool's `rollback --project PATH
     --backup DIR`, and the before Git SHA is the whole-room recovery point;
     tool and skill backups alone are not whole-room recovery. Exercise a
     rollback once when the upgrade's recovery proof has not already been
     established, then reapply the update and verify again.

For the v3 spec-centered Workbench:

- keep `AGENTS.md` small and operational;
- keep cross-cutting product truth in `BLUEPRINT.md`;
- create `workbench/specs/S-###-slug/SPEC.md` capability packets in the lane
  the manifest declares; lifecycle is folder location, and a record moves only
  through `move-spec` or `move-task`;
- make `TASKBOARD.md` a generated hot projection;
- keep exact commands and recovery in `RUNBOOK.md`;
- keep `CLAUDE.md` as the thin `@AGENTS.md` bridge;
- preserve public setup in `README.md` and harness friction in
  `WORKBENCH_FEEDBACK.md` (legacy `HARNESS_FEEDBACK.md`);
- refresh the Workbench-managed runtime tools in `workbench/tools/` only
  through the release checkout's
  `node tools/workbench-tools.mjs update --project PATH --home HOME --explicit-update`,
  which backs up changed files and records a rollback path; never hand-copy a
  runtime tool;
- refresh the Workbench-managed core skills in `workbench/skills/` only
  through the release checkout's
  `node tools/workbench-skills.mjs update --project PATH --home HOME --explicit-update`,
  which replaces only changed core skills, backs the previous directories up,
  records a rollback path and leaves room-added skills alone; never hand-copy
  a core skill and never touch the provider home to update a room.

The one-time v2 route, `tools/workbench-upgrade.mjs upgrade --explicit-update`
(or its `--layout-only` mode; the two are exclusive), lays the skills lane and
its adapters down through Adoption's migration and records the pre-migration
Git SHA, inventory and both receipts in the same recovery record; it never
reads, compares or replaces skills in a provider home.

Map capabilities, not every historical task. Create completed specs only for
durable current capabilities whose acceptance and proof are already real. Move
the actual active dependency chain into active/planned specs. Preserve the old
queue and proof ledger in a dated cold archive; never rewrite historical proof
into cleaner claims.

Update `.claude/settings.json` or equivalent mechanical scope enforcement when
new `specs/` or harness-tool paths become writable.

Completion criterion: every live rule and active work item has one owner, old
history remains reachable, and the target has no competing active queue.

## 4. Stamp, render, and diagnose

Stamp the manifest `workbenchVersion` and every copied control with the
verified target version. Remove template
placeholders and stale version/path/routing language. Run the current lifecycle
commands from the target root, normally:

```bash
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/spec-workbench.mjs next --json
```

Inspect the rendered Blueprint catalog and Taskboard projection. Confirm `next`
returns the genuinely eligible active slice or `null` for a real dependency or
owner gate. Do not manipulate status merely to make `next` return work.

Completion criterion: render is deterministic, doctor reports no blocking
finding, links resolve, spec paths match their lifecycle folders, and selection
matches the project's real gate.

### Workbench self-drift boundary

The target project's drift check is not the canonical Workbench's self-drift
check. Whenever the source Workbench itself is being changed or updated, run a
read-only self-drift review before and after the source change. Inspect the
source controls, Specs and projections, manifest, ADR/Wiki routes, update and
review procedures, templates, managed tools/skills and receipts, seeded
artifacts, and readable continuity metadata. Reconcile current-facing statuses,
blockers, versions, paths, owners and latest events against their owners.

A passing target-project check, render, doctor or test suite does not establish
semantic freshness. If a current-facing artifact still presents completed work
as pending, carries a resolved blocker, points at a retired route, or has stale
version/provenance information that could misroute a cold-start agent, the
Workbench update is not complete. In the source checkout located in step 1,
run `node workbench/tools/self-drift.mjs --phase pre --json` before the change
and `--phase post --json` afterward. Record both receipts and the bounded
manual semantic check with its unresolved findings; no-machine-finding output
is not a clean-update verdict. Preserve
explicit historical and append-only evidence.

## 5. Re-verify and prove the migration

Run the same full project suite as the baseline, plus harness-specific checks:

- the canonical Workbench evaluator when available, recorded as a diagnostic
  rather than product-outcome proof;
- managed-byte verification: `node tools/workbench-tools.mjs verify --project
  PATH` and `node tools/workbench-skills.mjs verify --project PATH` from the
  release checkout report no receipt drift;
- for an already-v3 room, a before/after byte inventory proving that controls,
  product code, active work, completed evidence, Wiki content and room-added
  skills changed only where the owning upgrade spec intended, plus the
  managed tool and skill receipts and backups or an exercised rollback;
- placeholder and stale-version search;
- retired control-name and duplicate-queue search;
- control-file stamps and mechanical scope alignment;
- diff review for lost project-specific rules or accidental product changes,
  backed by the control fidelity report run from the release checkout:

  ```bash
  node tools/control-fidelity.mjs report --project /absolute/project
  ```

  Every `dropped` or `changed` line it lists for `AGENTS.md` is either restored
  or recorded as a decision in the upgrade spec or an ADR under
  `workbench/docs/adr/`; the report labels a checkout-versus-manifest version
  mismatch and never blocks.
- feedback harvest: append observed harness friction to the manifest-declared
  feedback lane, or record `none observed` with the reason in the upgrade spec.

Record evaluator score and missing-evidence diagnostics, but do not pad the
control plane merely to satisfy keyword heuristics. Native behavior proof,
doctor, and truthful selection state remain the completion gates.

Record the upgrade in a dedicated spec. Close it only when its acceptance
criteria, proof, documentation impact, and completion result are complete. Then
render and doctor again so the completed migration leaves the hot board.

Completion criterion: project results match or improve on baseline - or, where
the baseline was recorded `unavailable`, the result compares against that record
and says so instead of implying a green baseline was taken - harness checks are
green, and the migration spec contains the exact evidence.

## 6. Publish through the target's workflow

Review the final diff and status. Follow the target's branch and integration
rules. When authorized by those controls, commit and push the migration branch;
open the normal review PR into its staging/default branch. Never promote to an
owner-only final branch or merge a review-held PR without explicit approval.

Report:

1. What changed.
2. Why it changed.
3. Risks or side effects.
4. Pre/post verification and lifecycle results.
5. Branch, commit, push, and PR state.
6. The exact remaining owner gate, if any.

Completion criterion: the verified migration is recoverable remotely or the
specific publication blocker is stated without claiming completion. The
update is `done` only when both boxes hold:

- [ ] The upgrade exists as a commit on a prefixed task branch pushed to the
      default remote; migration output left untracked is `in-progress`, not
      `done`.
- [ ] The declared integration branch (`git.integrationBranch` in
      `workbench/manifest.json`, which the migration declares) exists on the
      default remote at the migration commit, or the upgrade spec
      records the explicit reason it was omitted.
