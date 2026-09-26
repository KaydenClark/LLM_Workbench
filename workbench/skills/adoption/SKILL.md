---
name: adoption
description: Migrate an existing project into the Workbench once while preserving its code, history, project truth, and remote recovery point.
---

Use Adoption only when an existing project is joining the Workbench for the
first time. An already-adopted room that still sits on a v2 root moves onto the
v3 support root through `/update-harness`, which runs
`node tools/workbench-upgrade.mjs upgrade --layout-only` and records
`provenance.lifecycle: upgrade`; do not rerun Adoption for it, because a second
`adoption` record contradicts its first. A routine harness update also uses
`/update-harness`.

1. Verify the canonical checkout, branch, dirty/ahead/diverged state, remote,
   and nearest controls. Dirty state routes recovery: commit owned work on a
   prefixed task branch or isolate the migration in a clean worktree; never
   abandon the run merely because the tree is not clean.
2. Inventory the room before anything installs the managed layout:
   - Ask the room which route its contents support, from the Workbench release
     checkout; this reads and writes nothing:
     `node tools/workbench-classify.mjs classify --project [ABSOLUTE_PROJECT_PATH]`.
     Continue only on `adoption`. Route `upgrade` to `/update-harness` and
     `genesis` to `/genesis`; for `unclassifiable`, establish the answer from
     the room's history, remote or owner instead of guessing. The verdict is
     evidence, not authorization.
   - Take the code baseline: run the existing test/build commands green as
     found, or record the baseline `unavailable` with its reason under
     `templates/ADOPTION.md`. List every existing steering document and root
     control before changing any.
   - Record the source remote, ref, and resolved commit of the Workbench
     release you will run in the owning spec before changing the harness.
   - Verify the recovery point: the clean commit you branch from exists on
     the project's remote. When current authorization and an authenticated
     namespace permit it, create a private remote if the canonical project has
     none. Never infer public visibility, rewrite remote history, change
     credentials, or replace an existing remote.
3. Read `templates/ADOPTION.md` in the canonical Workbench source named by the
   workspace controls completely, and follow its one-time inventory,
   provenance, migration, verification, and handoff phases. After reconciling
   the seven filled root controls, run from the release checkout:

   ```bash
   node tools/workbench-adoption.mjs migrate \
     --project [ABSOLUTE_PROJECT_PATH] \
     --home [USER_HOME] \
     --version v3.2.1
   ```

   The helper moves only unambiguous durable v2 lanes, including a legacy root
   `MEMORY.md` and a root feedback file, into the manifest-declared schema 2
   lanes and collections, preserves a project-local `skills/` folder under
   `workbench/sessions/recovery/`, installs the receipt-backed runtime
   tools into `workbench/tools/`, lays the core skills into the room's own
   `workbench/skills` lane with a receipt and discovery adapters (it never
   reads or writes a skill in `[USER_HOME]`, although `--home` is still a
   required argument), declares `git.integrationBranch` by the
   exact case of an existing integration-named branch (listing an unresolved
   one as `residue.missingIntegrationBranch`), writes the recovery record
   `workbench/sessions/recovery/adoption-recovery.json`, renders the
   projections, and runs doctor. An existing support root (including a room
   already adopted), path collision, or missing or bracketed root control is a
   blocker to reconcile before retrying; never overwrite it,
   and never touch an application's root `tools/`. Afterwards use the
   project's own `node workbench/tools/spec-workbench.mjs ...` copies.
4. Preserve project behavior and history. Port live truth into the existing
   Workbench owners, archive retired control documents, and do not perform an
   unrelated product cleanup or create another tracker.
5. Always commit and push each coherent migration task and every incomplete
   checkpoint on a prefixed task branch; untracked migration output is not a
   finished Adoption. Promote verified work only to the declared integration
   branch (`git.integrationBranch` in `workbench/manifest.json`; the migration
   declares an existing integration-named branch or `integration`). When
   authorization permits, create it from the default branch and push it;
   otherwise record the omission reason in the owning spec. The merge from the
   declared branch into the default branch stays with the owner.
6. Record the executed self-tests and any vendored-helper checksum beside the
   provenance recorded in step 2 in the owning spec. Put fresh-clone reproduction
   commands in `RUNBOOK.md`, validate `workbench/manifest.json`, resolve the
   next task from its declared `workbench/specs/` lane, and report the pushed
   recovery ref and remaining owner gates. Append observed harness friction to
   the manifest-declared feedback lane; if none was observed, record
   `none observed` with the reason in the owning spec.
