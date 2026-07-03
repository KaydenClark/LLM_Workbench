# [PROJECT_NAME] - Genesis (Bootstrap Protocol)

> Part of LLM Workbench v[HARNESS_VERSION]. Stamp the four control docs with this
> same version during handoff (Phase 7).

This file is the one-prompt bootstrap protocol. It tells an agent how to turn a
single founding prompt into a project that already has filled-out control docs:
`AGENTS.md`, `BLUEPRINT.md`, `TASKBOARD.md`, and `RUNBOOK.md`.

Read this once, run it once. Genesis is a starting gun, not a standing rule. When
bootstrap is finished, the four control docs govern; this file can be deleted or
kept as a record of how the project began.

**Green-field only.** If the target already exists - real code, history, or a
prior set of `AGENTS`/`ROADMAP`/policy docs - use `ADOPTION.md` instead. Genesis
scaffolds from a prompt; Adoption migrates an existing repo into the same four
control docs.

## What Genesis Is For

The owner should be able to hand an agent a prompt like "build me a [KIND OF
THING] that [DOES WHAT] for [WHO]" and get back a repository whose docs a second
agent could pick up cold, without chat history. Genesis is the ordered procedure
that produces those docs, plus the smallest real scaffold that proves the project
runs.

Genesis does **not** try to finish the product. It produces a credible skeleton
and a seeded task queue so normal work (the loop in `AGENTS.md`) can take over.

## Inputs

Before starting, capture what the owner actually gave you:

- **Founding prompt:** the owner's request, quoted verbatim. Preserve it; do not
  paraphrase it away.
- **Target location:** `[ABSOLUTE_PROJECT_PATH]` (new empty dir, or an existing
  repo to retrofit).
- **Hard constraints named by the owner:** language, platform, budget, privacy,
  deadline, "must not use X." If none were given, record "none stated."

If the target is an existing codebase, read it first and let observed reality
outrank assumptions. Genesis then documents what exists rather than inventing a
greenfield.

## Decide Alone vs. Ask

Bootstrap stalls if the agent asks about everything, and drifts if it asks about
nothing. Use this split.

Decide alone (reversible, low-risk, inside the prompt's obvious intent):

- default language/framework when the prompt implies one or the owner has no
  stated preference;
- project and directory names, file layout, placeholder task IDs;
- test runner and lint choices consistent with the ecosystem;
- which scaffold is "smallest thing that runs."

Ask one focused question when a missing answer changes something expensive to
reverse:

- product scope that materially changes architecture (single-user vs.
  multi-tenant, offline vs. cloud, real payments vs. mock);
- a data-model or persistence decision the whole project leans on;
- anything touching money, secrets, personal data, or a public/legal contract;
- an explicit owner constraint that appears to conflict with the prompt.

Phrase questions as product tradeoffs with a recommendation, not code-level
uncertainty. Batch them: ask the few that block architecture together, once,
before scaffolding. If the owner is unavailable, record the assumption in
`BLUEPRINT.md` -> Design Decisions and proceed on the reversible default.

## Phases

Run these in order. Each phase produces a durable artifact and should be
verifiable before the next begins.

### Phase 0 - Frame

1. Quote the founding prompt and target path.
2. List hard constraints and open questions.
3. Ask the blocking architecture questions now (see above), or record assumptions.

Output: a short frame you will fold into `BLUEPRINT.md`. Nothing is scaffolded
yet.

### Phase 1 - BLUEPRINT (identity before code)

Fill `BLUEPRINT.md` from the template. It anchors everything after it.

- **What This Project Is** and **Core promise**: one honest paragraph, one
  concrete user-facing promise.
- **Primary users** and **Non-Goals**: say what this is *not*, to stop scope creep.
- Preserve the founding prompt verbatim in a decision or intent note so later
  drift-checks compare against the owner's real words.

Output: a `BLUEPRINT.md` a stranger could read to learn what the project is for.
Architecture is still `[TBD]` at this point.

### Phase 2 - Architecture

Decide the stack and record it in `BLUEPRINT.md` -> Architecture and Design
Decisions. Choose the smallest stack that satisfies the promise and constraints;
prefer boring, well-supported defaults over novelty.

For each row (runtime, language, storage, frontend, backend, testing,
deployment) record the choice and a one-line reason. Log any decision made on an
assumption rather than an owner answer.

Output: a filled Architecture table and Design Decisions with rationale.

### Phase 3 - Scaffold (smallest thing that runs)

Create the minimum real project that executes: package/manifest, entry point, one
working path end to end (even a hello-world route or CLI command), and one
passing test. No stubbed logic pretending to work; if something is a placeholder,
label it.

Output: a repository that installs and runs one command successfully. This is the
demo artifact bootstrap must produce.

### Phase 4 - AGENTS scopes (draw the fences)

Fill `AGENTS.md`, especially the **Edit Scope** placeholders that say nothing
until set:

- `[PRIMARY_SOURCE_DIRS]`, `[TEST_DIRS]`, `[DOCS_TO_KEEP_CURRENT]` -> the real
  paths just scaffolded;
- `[OUT_OF_SCOPE_DIRS_OR_REPOS]` -> secrets, generated output, unrelated dirs.

Confirm the read-scope, secrets boundary, authority order, and verification
contract match this project's reality. Keep the generic safety rules intact.

Then make the boundary mechanical, not just prose. If `.claude/settings.json`
was copied in, fill it from the scope you just drew: writable roots -> `allow`,
forbidden paths (secrets, credentials, build output) -> `deny`, review-required
actions (schema/migrations, `git push`, destructive commands) -> `ask`. See
`.claude/README.md` for the mapping. If the project will not use Claude Code,
delete `.claude/` and rely on the prose scope alone.

Output: an `AGENTS.md` whose scope answers are concrete, not bracketed, and a
filled `.claude/settings.json` (or a deliberate decision to omit it).

### Phase 5 - RUNBOOK (make it operable)

Fill `RUNBOOK.md` with the commands you actually ran in Phase 3: prerequisites,
install, run, test/build, and the full verification suite. Every command listed
must be one you executed and saw succeed, not an aspiration.

Output: a `RUNBOOK.md` a new agent can follow to reproduce a green run.

### Phase 6 - Seed the TASKBOARD

Fill `TASKBOARD.md` with the honest next few tasks toward the promise, not the
whole roadmap. Set **Current focus** to the nearest useful outcome. Seed 3-7
`ready` tasks with priorities, required proof, and docs impact. Add the first
proof-log row recording that Genesis ran and what it produced.

Output: a board the normal work loop can pick up immediately.

### Phase 7 - Handoff

Set the `Generated from LLM Workbench v[HARNESS_VERSION]` stamp at the top of each
control doc to the workbench version you copied from, so the project can later
tell when it is behind. Delete unfilled placeholders. Run the full verification
suite once more. If
`GENESIS.md` was copied into the project, either delete it or move it to an
archive note, so no one mistakes the one-time protocol for a standing rule.

Output: a clean repo where the four control docs are the source of truth.

## What A Finished Bootstrap Must Prove

Do not call bootstrap done on vibes. All of the following must hold:

- [ ] `BLUEPRINT.md`, `AGENTS.md`, `RUNBOOK.md`, `TASKBOARD.md` exist with **no
      remaining `[BRACKETED]` placeholders** in required sections.
- [ ] The founding prompt is preserved verbatim somewhere durable.
- [ ] `AGENTS.md` edit scope names real paths that exist in the repo.
- [ ] `.claude/settings.json` is filled from that scope (deny secrets, allow
      writable roots), or `.claude/` was deliberately omitted with a reason.
- [ ] Every command in `RUNBOOK.md` was run and passed; paste or reference the
      result.
- [ ] One end-to-end path runs from a single command (the demo artifact).
- [ ] `TASKBOARD.md` has a `Current focus` and at least three actionable `ready`
      tasks with proof requirements.
- [ ] A first proof-log row records that Genesis ran, with the actual run result.

If any box is unchecked, bootstrap is `in-progress`, not `done`. State which box
failed and why.

## Guardrails

- Do not fabricate a green run. A command that was not executed is not proof.
- Do not scaffold a large system. The smallest running thing beats an elaborate
  skeleton that does not execute.
- Do not overwrite an existing project's real docs or code without confirming
  they should be replaced; retrofit, do not bulldoze.
- Keep this file generic if it lives in a template set. Bootstrap fills the *other*
  docs with project specifics; it does not fill this one.
