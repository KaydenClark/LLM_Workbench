# [PROJECT_NAME] - Genesis (Bootstrap Protocol)

> Part of LLM Workbench v[HARNESS_VERSION]. Stamp the copied control docs with this
> same version during handoff (Phase 7).

This file is the one-prompt bootstrap protocol. It tells an agent how to turn a
single founding prompt into a project that already has seven filled root controls:
`AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md`, `TASKBOARD.md`,
`CLAUDE.md`, and `README.md`; plus a manifest-backed first stable `SPEC.md`.

Read this once, run it once. Genesis is a starting gun, not a standing rule. When
bootstrap is finished, AGENTS plus the progressive spec flow govern; this file can be deleted or
kept as a record of how the project began.

**Green-field only.** If the target already exists - real code, history, or a
prior set of `AGENTS`/`ROADMAP`/policy docs - use `ADOPTION.md` instead. Genesis
scaffolds from a prompt; Adoption migrates an existing repo into the same
control surfaces.

## What Genesis Is For

The owner should be able to hand an agent a prompt like "build me a [KIND OF
THING] that [DOES WHAT] for [WHO]" and get back a repository whose docs a second
agent could pick up cold, without chat history. Genesis is the ordered procedure
that produces those docs, plus the smallest real scaffold that proves the project
runs.

Genesis does **not** try to finish the product. It produces a credible skeleton
and a seeded capability spec/hot projection so normal work can take over.

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

Seed `LEXICON.md` with terms whose meanings the founding prompt or owner has
already established. Do not invent definitions merely to fill the table. The
Blueprint helps participants recover the design concept; the Lexicon owns the
accepted meanings of the words they use to discuss it.

Output: a `LEXICON.md` with the Workbench terms intact and any genuinely shared
project terms defined.

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

- `[READABLE_ROOTS]` and `[WRITABLE_ROOTS]` -> the real paths just scaffolded;
- `[SECRETS_OR_PRIVATE_PATHS]` and `[FORBIDDEN_PATHS]` -> secrets, generated
  output, unrelated dirs;
- `[REQUIRES_REVIEW_FOR]` -> schema/migrations, pushes, destructive commands.

Confirm the read-scope, secrets boundary, authority order, and verification
contract match this project's reality. Keep the generic safety rules intact.

Then make the boundary mechanical, not just prose. If `.claude/settings.json`
was copied in, fill it from the scope you just drew: writable roots and the
Workbench authorship lanes -> `allow` (Edit and Write), forbidden paths
(secrets, credentials, build output) -> `deny`, review-required actions
(schema/migrations, `git push`, destructive commands, `workbench/tools/`) ->
`ask`. Edit revises an existing file and Write creates one, so a lane that
must hold new specs, ADRs, wiki pages, or checkpoints needs both. See
`.claude/README.md` for the mapping. If the project will not use Claude Code,
delete `.claude/` and rely on the prose scope alone.

Output: an `AGENTS.md` whose scope answers are concrete, not bracketed, and a
filled `.claude/settings.json` (or a deliberate decision to omit it).

### Phase 5 - RUNBOOK (make it operable)

Fill `RUNBOOK.md` with the commands you actually ran in Phase 3: prerequisites,
install, run, test/build, and the full verification suite. Every command listed
must be one you executed and saw succeed, not an aspiration.

Output: a `RUNBOOK.md` a new agent can follow to reproduce a green run.

### Phase 6 - Initialize the support root, first spec, hot projection, and room brain

Initialize the v3 support root before writing support records:

```bash
node /PATH/TO/LLM_WORKBENCH/workbench/tools/workbench-layout.mjs init \
  --project [ABSOLUTE_PROJECT_PATH] --provenance genesis --version v[HARNESS_VERSION]
node /PATH/TO/LLM_WORKBENCH/tools/workbench-tools.mjs install \
  --project [ABSOLUTE_PROJECT_PATH]
```

Run `init` from the Workbench release checkout: it records that checkout's
`origin` URL and `HEAD` commit as `provenance.source` in the manifest. Pass
`--source-commit SHA` and `--source-repository URL` only to pin a different
source; a copy of the tool outside a release checkout refuses with
`invalid-invocation` naming the missing flag rather than guessing.

The second command installs the Workbench-managed runtime tools into the
project's `workbench/tools/` lane with a receipt recording the exact source
release, commit, and per-file hashes. From then on the project runs its own
copies (`node workbench/tools/spec-workbench.mjs ...`); an application's root
`tools/` directory, if any, is the application's own and is never touched.

Create one stable `workbench/specs/S-001-<slug>/SPEC.md` for the nearest
coherent capability. Put 1-3 one-context tracer-bullet tickets in its
implementation table and record the Genesis result in its evidence log. The
manifest declares the six lanes (`docs`, `specs`, `wiki`, `sessions`,
`feedback`, `tools`) and their collections; live grilling and handoff records
under `workbench/sessions/` stay untracked, and only `sessions/checkpoints/`
is durable. Do not create a project-local `skills/` discovery directory.

The readiness gate (`validate --genesis`) accepts only an actionable first
packet, so shape it exactly like this before running the gate:

- `**Status:** active` (the copied `templates/SPEC.md` default is `planned`;
  Genesis activates the first spec because it is the work the loop picks up);
- `**Priority:**` a single digit `0`-`9`;
- at least one ticket row whose status is `ready` and whose blockers are
  `none`; do not claim it before the gate runs;
- at least one unchecked `- [ ]` acceptance box;
- the `## Outcome`, `## Vertical Implementation Slices`,
  `## Acceptance Criteria`, and `## Completion Result` sections;
- the exact `Generated from LLM Workbench v[HARNESS_VERSION]` stamp matching
  the manifest, and no remaining template placeholder.

Then render the projections and run doctor so the generated regions in
`BLUEPRINT.md` and `TASKBOARD.md` (kept from the templates) reflect the packet:

```bash
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Copy `templates/WORKBENCH_FEEDBACK.md` to
`workbench/feedback/WORKBENCH_FEEDBACK.md` and fill its header; also copy
`templates/feedback/REPORT_FORMAT.md` into the declared feedback lane as
`REPORT_FORMAT.md` for later assigned reports; the return
channel lives in the feedback lane, never at the root, so the root keeps
exactly seven controls.

Then seed the room brain: `init` already seeded `workbench/wiki/SCHEMA.md`,
`workbench/wiki/AGENTS.md`, and `workbench/wiki/design-concepts/README.md`;
copy `templates/wiki/MEMORY.project.md` to `workbench/wiki/MEMORY.md`, fill
its placeholders, and link it to the live controls just created. If this room
lives inside a larger deployment, set the up-link to the deployment wiki's
note for this room. See `templates/wiki/README.md` for the link conventions.
The readiness gate requires the filled router and contract files; a room is
not bootstrapped without a brain.

Output: one durable capability record, declared support lanes, a hot projection
the normal work loop can pick up immediately, and a manifest-routed room brain.

### Phase 7 - Handoff

Set the `Generated from LLM Workbench v[HARNESS_VERSION]` stamp at the top of each
control doc to the workbench version you copied from, so the project can later
tell when it is behind. Delete unfilled placeholders. Run the full verification
suite once more. If
`GENESIS.md` was copied into the project, either delete it or move it to an
archive note, so no one mistakes the one-time protocol for a standing rule.

Output: a clean repo where each class of truth has one owner: AGENTS for work
rules, Blueprint for product direction, Lexicon for shared definitions,
Taskboard for hot state, specs for capability detail/evidence, Runbook for
procedures, and source/tests for behavior.

## What A Finished Bootstrap Must Prove

Do not call bootstrap done on vibes. All of the following must hold:

- [ ] `BLUEPRINT.md`, `LEXICON.md`, `AGENTS.md`, `RUNBOOK.md`, and
      `TASKBOARD.md`, `CLAUDE.md`, and `README.md` exist with **no remaining
      `[BRACKETED]` placeholders** in required sections.
- [ ] The founding prompt is preserved verbatim somewhere durable.
- [ ] `AGENTS.md` edit scope names real paths that exist in the repo.
- [ ] `.claude/settings.json` is filled from that scope and grants Edit and
      Write on the declared authorship lanes, or `.claude/` was omitted with a
      reason.
- [ ] Every command in `RUNBOOK.md` was run and passed; paste or reference the
      result.
- [ ] One end-to-end path runs from a single command (the demo artifact).
- [ ] `workbench/manifest.json` is schema 2 and declares the six support
      lanes, seven collections, wiki profile, exact 16-skill policy, version,
      and Genesis provenance with its source commit; the layout validator
      passes with `--genesis`. When it fails, its JSON `message` names the
      failing control or predicate, and first-spec and generated-region
      failures add a `reason` field; fix that predicate rather than the gate.
- [ ] `CLAUDE.md` is exactly `@AGENTS.md`; the gate rejects any other bridge.
- [ ] `workbench/tools/` holds the installed runtime tools and their receipt
      (`.workbench-tools.json`) whose source release matches the manifest;
      `workbench/sessions/.gitignore` keeps live records untracked; and
      `workbench/wiki/design-concepts/` exists even if empty.
- [ ] A stable first spec under `workbench/specs/` is `active`, carries at
      least one unclaimed `ready` ticket with no blockers and proof
      requirements, keeps at least one unchecked acceptance box, and `render`
      plus `doctor` pass on the result.
- [ ] A `workbench/wiki/MEMORY.md` room brain exists (from `templates/wiki/`),
      routes to the live controls, and has no unfilled placeholders; the seeded
      `SCHEMA.md`, `AGENTS.md`, and `design-concepts/README.md` sit beside it.
- [ ] The first spec evidence row records that Genesis ran, with the actual result.
- [ ] Harness friction observed during Genesis was appended to the declared
      feedback lane; if none was observed, the first spec records `none observed`
      with the reason.

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
