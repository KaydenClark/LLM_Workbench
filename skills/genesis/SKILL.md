---
name: genesis
description: Create a new greenfield project from a founding prompt using the Workbench bootstrap protocol and a private remote recovery boundary.
disable-model-invocation: true
---

Use Genesis only for a new greenfield project. If the target already contains
real code, history, or project controls, route to `/adoption` instead.

1. Locate the checked-out LLM Workbench repository and read
   `templates/GENESIS.md` completely. Treat it as the bootstrap procedure;
   this skill is only its conversational entrypoint.
2. Preserve the founding prompt verbatim, verify the target path is inside the
   authorized workspace, and ask only when a missing answer changes
   architecture, privacy, money, credentials, or destructive risk.
3. Run the Genesis phases in order. Create the seven filled root controls, run
   the release checkout's `node workbench/tools/workbench-layout.mjs init` for
   the schema 2 support root (it seeds the wiki contract and declares
   `git.defaultBranch` and `git.integrationBranch` from `--default-branch` and
   `--integration-branch`) and
   `node tools/workbench-tools.mjs install` for the receipt-backed runtime
   tools, copy and fill the wiki router, create one stable spec under the
   manifest-declared path, and record exact Runbook commands. From then on run
   the project's own `node workbench/tools/spec-workbench.mjs ...` copies. Do
   not leave a project-local skill tree or second proof store.
4. Establish Git recovery immediately. When the current authorization and
   authenticated repository namespace permit remote creation, create a private
   remote if none was supplied. Never infer public visibility, change
   credentials, or overwrite an existing remote.
5. Follow the workspace branch policy. By default, publish task checkpoints and
   completed work to a prefixed task branch and promote verified work only to
   the declared integration branch (`git.integrationBranch` in
   `workbench/manifest.json`; `init` declares `integration` unless told
   otherwise). When authorization permits, create that branch from the default branch
   and push it (`git branch NAME DEFAULT` then `git push -u origin NAME`);
   otherwise record the omission reason in the first spec. The merge from the
   declared branch into the default branch stays with the owner.
6. Always commit and push after every completed ticket and before yielding incomplete
   work. A local-only scaffold, or a working tree that was never committed, is
   not a completed Genesis handoff; the `templates/GENESIS.md` completion boxes
   require the commit on a prefixed branch and the resolving integration branch
   or its recorded omission reason.
7. Run the generated project's targeted and full verification, update the
   owning spec evidence, render its Taskboard, run doctor, and report the remote
   recovery ref plus the under-one-minute demo.
