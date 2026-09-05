---
name: adoption
description: Migrate an existing project into the Workbench once while preserving its code, history, project truth, and remote recovery point.
disable-model-invocation: true
---

Use Adoption only when an existing project is joining the Workbench for the
first time. A routine harness update uses `/update-harness`; do not rerun
Adoption to update an already-adopted project.

1. Verify the canonical checkout, branch, dirty/ahead/diverged state, remote,
   and nearest controls. Dirty state routes recovery: checkpoint owned work or
   isolate the migration; never abandon the run merely because the tree is not
   clean.
2. Locate the canonical Workbench source named by the workspace controls and
   read `templates/ADOPTION.md` completely. Follow its one-time inventory,
   provenance, migration, verification, and handoff phases. After reconciling
   the seven filled root controls, install or verify the core bundle in the
   intended disposable or user-scoped home and run:

   ```bash
   node tools/workbench-adoption.mjs migrate \
     --project [ABSOLUTE_PROJECT_PATH] \
     --home [USER_HOME] \
     --version v3.1.1
   ```

   The helper moves only unambiguous durable v2 lanes, including a legacy root
   `MEMORY.md` and a root feedback file, into the manifest-declared schema 2
   lanes and collections, preserves a project-local `skills/` folder under
   `workbench/sessions/checkpoints/`, installs the receipt-backed runtime
   tools into `workbench/tools/`, renders the projections, and runs doctor. An
   existing support root, path collision, missing core skill, or bracketed
   root control is a blocker to reconcile before retrying; never overwrite it,
   and never touch an application's root `tools/`. Afterwards use the
   project's own `node workbench/tools/spec-workbench.mjs ...` copies.
3. Preserve project behavior and history. Port live truth into the existing
   Workbench owners, archive retired control documents, and do not perform an
   unrelated product cleanup or create another tracker.
4. Verify remote recovery before broad edits. When current authorization and an
   authenticated namespace permit it, create a private remote if the canonical
   project has none. Never infer public visibility, rewrite remote history,
   change credentials, or replace an existing remote.
5. Always commit and push each coherent migration ticket and every incomplete
   checkpoint. Promote verified work only to `integration`; the owner controls
   `integration` to `main`.
6. Record the source remote, ref, resolved commit, executed self-tests, and any
   vendored-helper checksum in the owning spec. Put fresh-clone reproduction
   commands in `RUNBOOK.md`, validate `workbench/manifest.json`, resolve the
   next ticket from its declared `workbench/specs/` lane, and report the pushed
   recovery ref and remaining owner gates. Append observed harness friction to
   the manifest-declared feedback lane; if none was observed, record
   `none observed` with the reason in the owning spec.
