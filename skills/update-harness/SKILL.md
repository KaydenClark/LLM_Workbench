---
name: update-harness
description: Update a project to the current canonical LLM Workbench harness without losing project-specific controls, work state, or proof.
disable-model-invocation: true
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

## 1. Establish authority and source truth

1. Read the applicable root and project-local `AGENTS.md` files completely.
2. Verify the target repository root, branch, remote, upstream, worktrees, and
   dirty state.
3. Verify the canonical Workbench path, branch, remote, dirty state, and current
   version from its live `README.md` or `BLUEPRINT.md`.
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

- **Port**: project truth that belongs in a current control file or stable spec.
- **Fold**: live rules that should move into the current `AGENTS.md` contract.
- **Keep**: project-local design, research, or operations material the harness
  should reference rather than absorb.
- **Retire**: a competing old control or queue that must become a cold archive.

Run the target's documented full verification suite before editing. Read named
PASS/FAIL markers and test totals; do not trust a zero process code when the tool
can print load or parse errors and still exit zero.

Completion criterion: every steering file is classified and a reproducible,
green pre-migration baseline is recorded. If the baseline is red, record the
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
    --version v3.1.1 \
    --layout-only
  ```

  It requires every core skill to be present in a user-scoped discovery root
  and reads that presence only; it migrates the legacy lanes once through the
  Adoption seam, installs the receipt-backed runtime tools, records
  `provenance.lifecycle: upgrade` with the exact source commit, and writes
  `workbench/sessions/checkpoints/upgrade-recovery.json` with
  `skills: "presence-only"`. It works on a host whose discovery root is a
  foreign Git repository because it never touches one. Only after it completes
  do you reconcile specs through the manifest the route just declared
  (`workbench/manifest.json`). Never rerun Adoption for an already-adopted
  room; a second `adoption` record contradicts its first.
- **A room already on a v3 support root**: no layout route runs; reconcile
  controls and specs through its existing manifest.

For the v3 spec-centered Workbench:

- keep `AGENTS.md` small and operational;
- keep cross-cutting product truth in `BLUEPRINT.md`;
- create stable `workbench/specs/S-###-slug/SPEC.md` capability packets in the
  lane the manifest declares;
- make `TASKBOARD.md` a generated hot projection;
- keep exact commands and recovery in `RUNBOOK.md`;
- keep `CLAUDE.md` as the thin `@AGENTS.md` bridge;
- preserve public setup in `README.md` and harness friction in
  `WORKBENCH_FEEDBACK.md` (legacy `HARNESS_FEEDBACK.md`);
- refresh the Workbench-managed runtime tools in `workbench/tools/` only
  through the release checkout's
  `node tools/workbench-tools.mjs update --project PATH --home HOME --explicit-update`,
  which backs up changed files and records a rollback path; never hand-copy a
  runtime tool.

Skill replacement stays a separate, explicitly authorized operation. The same
command's other mode, `tools/workbench-upgrade.mjs upgrade --explicit-update`,
run against a disposable or verified user home, combines the layout phase with
skill replacement: it updates only skills bearing the Workbench-managed marker,
backs up changed skill directories first, and records the pre-migration Git
SHA, inventory, and backups in the same recovery record. It fails closed when a
discovery root is inside a foreign Git repository or a same-named skill is
unmanaged. Normal setup remains presence-only; never use `--explicit-update`
merely because a same-named skill exists.

Map capabilities, not every historical ticket. Create completed specs only for
durable current capabilities whose acceptance and proof are already real. Move
the actual active dependency chain into active/planned specs. Preserve the old
queue and proof ledger in a dated cold archive; never rewrite historical proof
into cleaner claims.

Update `.claude/settings.json` or equivalent mechanical scope enforcement when
new `specs/` or harness-tool paths become writable.

Completion criterion: every live rule and active work item has one owner, old
history remains reachable, and the target has no competing active queue.

## 4. Stamp, render, and diagnose

Stamp every copied control with the verified target version. Remove template
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

Completion criterion: render is deterministic, doctor is green, links resolve,
spec paths are stable, and selection matches the project's real gate.

## 5. Re-verify and prove the migration

Run the same full project suite as the baseline, plus harness-specific checks:

- the canonical Workbench evaluator when available, recorded as a diagnostic
  rather than product-outcome proof;
- canonical tool byte comparison when copied;
- placeholder and stale-version search;
- retired control-name and duplicate-queue search;
- control-file stamps and mechanical scope alignment;
- diff review for lost project-specific rules or accidental product changes.
- feedback harvest: append observed harness friction to the manifest-declared
  feedback lane, or record `none observed` with the reason in the upgrade spec.

Record evaluator score and missing-evidence diagnostics, but do not pad the
control plane merely to satisfy keyword heuristics. Native behavior proof,
doctor, and truthful selection state remain the completion gates.

Record the upgrade in a dedicated stable spec. Close it only when its acceptance
criteria, proof, documentation impact, and completion result are complete. Then
render and doctor again so the completed migration leaves the hot board.

Completion criterion: project results match or improve on baseline, harness
checks are green, and the migration spec contains the exact evidence.

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
specific publication blocker is stated without claiming completion.
