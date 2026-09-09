---
name: genesis
description: Create a new greenfield project from a founding prompt using the Workbench bootstrap protocol and a private remote recovery boundary.
---

Use Genesis only for a new greenfield project. If the target already contains
real code, history, or project controls, route to `/adoption` instead. An
explicit copy of the Workbench Template into a fresh target is still greenfield:
it starts a new project with its own identity and evidence, rather than
inheriting the Template's room state.

1. Locate the checked-out LLM Workbench repository and read
   `templates/GENESIS.md` completely. Treat it as the bootstrap procedure;
   this skill is only its conversational entrypoint.
2. Preserve the founding prompt verbatim, verify the target path is inside the
   authorized workspace, prepare owner questions from the prompt and verified
   evidence, and ask only when a missing answer changes architecture, privacy,
   money, credentials, or destructive risk. Preparation does not answer a
   question or create a decision.
3. Run the Genesis phases in order: prepare questions; record explicitly locked
   owner decisions as needed in active ADRs under the manifest-declared
   `workbench/docs/adr/` collection; verify Actuality; then derive scoped Specs
   from those inputs and any bounded choice the owner stated plainly in the
   founding prompt. Do not turn an assumption, inherited Template content, or a
   prepared question into an owner decision.
4. For an explicitly selected fresh Template copy, use the validated
   `tools/genesis-from-decisions.mjs derive` path documented in the protocol.
   It forms the room from reviewed drafts and recorded decisions; implementation
   and remote recovery still follow. Otherwise create the seven filled root controls, run
   the release checkout's `node workbench/tools/workbench-layout.mjs init` for
   the schema 2 support root (it seeds the wiki contract and declares
   `git.defaultBranch` and `git.integrationBranch` from `--default-branch` and
   `--integration-branch`) and
   `node tools/workbench-tools.mjs install` for the receipt-backed runtime
   tools, copy and fill the wiki router, create one stable spec under the
   manifest-declared path, and record exact Runbook commands. From then on run
   the project's own `node workbench/tools/spec-workbench.mjs ...` copies. Do
   not copy global core into a project-local skill tree or create a second proof store.
   Authorized room-local extensions follow the Runbook ownership procedure.
5. Establish Git recovery immediately. When the current authorization and
   authenticated repository namespace permit remote creation, create a private
   remote if none was supplied. Never infer public visibility, change
   credentials, or overwrite an existing remote.
6. Follow the workspace branch policy. By default, publish task checkpoints and
   completed work to a prefixed task branch and promote verified work only to
   the declared integration branch (`git.integrationBranch` in
   `workbench/manifest.json`; `init` declares `integration` unless told
   otherwise). When authorization permits, create that branch from the default branch
   and push it (`git branch NAME DEFAULT` then `git push -u origin NAME`);
   otherwise record the omission reason in the first spec. The merge from the
   declared branch into the default branch stays with the owner.
7. Always commit and push after every completed ticket and before yielding incomplete
   work. A local-only scaffold, or a working tree that was never committed, is
   not a completed Genesis handoff; the `templates/GENESIS.md` completion boxes
   require the commit on a prefixed branch and the resolving integration branch
   or its recorded omission reason.
8. Run the generated project's targeted and full verification, update the
   owning spec evidence, render its Taskboard, run doctor, and report the remote
   recovery ref plus the under-one-minute demo.
