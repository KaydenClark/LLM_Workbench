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

**Green-field only.** If the target already exists with real code, history, or
a prior set of `AGENTS`/`ROADMAP`/policy docs, use `ADOPTION.md` instead.
Genesis scaffolds a new project from a prompt; Adoption reconciles an existing
repo into the same control surfaces. An explicitly authorized copy of the
Workbench Template into a fresh target is a Genesis route, but it begins an
independent project identity and does not inherit the Template's room state,
specs, decisions, or evidence.

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
- **Target location:** `[ABSOLUTE_PROJECT_PATH]` (a new empty directory).
- **Starting point:** either a founding prompt or an explicitly authorized
  fresh copy of the Workbench Template. A Template copy is source material for
  a new project, not an existing project to adopt.
- **Evidence/preparation room:** `[EVIDENCE_ROOM_PATH]`, a named Template copy
  or initialized disposable room with a valid manifest and live collections.
  It holds the prepared evidence record; the fresh destination stays empty
  until Genesis initializes it.
- **Hard constraints named by the owner:** language, platform, budget, privacy,
  deadline, "must not use X." If none were given, record "none stated."

If the target contains existing project code, history, or controls, stop this
protocol and use `ADOPTION.md`. Do not relabel an existing project as a
Template copy to bypass its evidence and migration obligations.

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
before scaffolding. If the owner is unavailable, record a reversible working
assumption in the prepared record and leave the affected decision open. It is
not an owner answer or an active ADR. A bounded choice the owner already stated
plainly in the founding prompt remains usable as a cited instruction; do not
re-ask simply to relabel it as locked.

## Derivation Boundary

Genesis moves through a deliberate sequence:

1. Prepare owner questions from the founding prompt, stated constraints, and
   verified evidence. Preparation makes uncertainty visible; it does not answer
   a question.
2. Record the owner's explicitly locked decisions. Capture cross-cutting
   architectural choices in active ADRs, with rationale and alternatives where
   they matter. Keep unresolved questions open, and retain a bounded choice
   plainly stated in the founding prompt as a cited instruction rather than
   inventing a new locked answer.
3. Verify Actuality: the target state, the smallest working scaffold, and the
   commands whose results are used as evidence.
4. Derive scoped Specs from locked owner decisions, active ADRs, verified
   Actuality, and bounded choices explicitly supplied in the founding prompt.
   Preserve source links and uncertainty in the resulting Specs.

The Blueprint remains a destination narrative throughout. It may link an active
ADR where that decision materially explains the destination, but it is not a
decision ledger, status report, evidence archive, or generated Spec catalog.

## Phases

Run these in order. Each phase produces a durable artifact and should be
verifiable before the next begins.

### Phase 0 - Frame and prepare owner questions

1. Quote the founding prompt and target path.
2. List hard constraints and open questions.
3. Prepare the blocking architecture questions now (see above), grounded in the
   prompt and any verified starting evidence. Keep the questions and reversible
   assumptions distinct from owner answers.

When the founding prompt or other approved source is available as an input file,
use the release's evidence-preparation interface in the named evidence room to
retain source hashes and a prepared record. The fresh destination remains empty:

```bash
node workbench/tools/project-evidence.mjs prepare \
  --project-root [EVIDENCE_ROOM_PATH] --input [APPROVED_INPUT_PATH] --note [SAFE_NOTE_NAME]
```

Output: a short, source-linked preparation record. Nothing is scaffolded and no
decision is locked yet.

### Phase 1 - Lock destination and cross-cutting decisions

Get explicit owner answers for the prepared questions that affect architecture,
privacy, money, credentials, destructive risk, or the public contract. Record
only those answers as locked decisions. Where a cross-cutting architectural
choice needs rationale or alternatives, write an active ADR; do not fabricate
an owner answer from an assumption, a Template, or the founding prompt.

Fill `BLUEPRINT.md` from the template's applicable destination sections. It
anchors everything after it:

- **Product Destination**, **People And Problems Served**, and **Promised
  Outcomes**: one honest product narrative, concrete user-facing promises, and
  clear boundaries.
- **Desired Experience And Behavior**, **Integrated System Design**,
  **Cross-Cutting Qualities And Constraints**, **Desired Lifecycle**, and
  **Non-Goals**: describe the intended finished product; omit a genuinely
  inapplicable section rather than adding boilerplate.
- Preserve the founding prompt verbatim in the preparation record or a linked
  durable intent owner so later drift checks compare against the owner's real
  words. Link active ADRs inline only when they materially explain or constrain
  the destination.

Output: a `BLUEPRINT.md` a stranger could read to learn what the project is for.
It contains no decision inventory, current status, proof archive, or generated
catalog.

Seed `LEXICON.md` with terms whose meanings the founding prompt or owner has
already established. Do not invent definitions merely to fill the table. The
Blueprint helps participants recover the design concept; the Lexicon owns the
accepted meanings of the words they use to discuss it.

Output: a `LEXICON.md` with the Workbench terms intact and any genuinely shared
project terms defined.

### Phase 2 - Plan architecture without inventing decisions

Choose the smallest stack that satisfies the locked destination and constraints;
prefer boring, well-supported defaults over novelty. A choice that materially
affects architecture must already be locked by the owner and recorded in an
active ADR. A reversible implementation detail may remain an explicitly labeled
working assumption until Actuality verifies it.

Keep stack detail with its active ADR or the scoped Spec that owns it; use the
Blueprint only to explain how the integrated system is intended to work. Do not
create a decision ledger inside the Blueprint.

Output: active ADRs for locked cross-cutting choices and open assumptions that
are plainly marked as open.

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
Workbench authorship lanes -> `allow` (`Edit`), forbidden paths
(secrets, credentials, build output) -> `deny`, review-required actions
(schema/migrations, `git push`, destructive commands, `workbench/tools/`) ->
`ask`. Claude Code applies `Edit` rules to every built-in file-editing tool,
including creation. See
`.claude/README.md` for the mapping. If the project will not use Claude Code,
delete `.claude/` and rely on the prose scope alone.

Output: an `AGENTS.md` whose scope answers are concrete, not bracketed, and a
filled `.claude/settings.json` (or a deliberate decision to omit it).

### Phase 5 - RUNBOOK (make it operable)

Fill `RUNBOOK.md` with the commands you actually ran in Phase 3: prerequisites,
install, run, test/build, and the full verification suite. Every command listed
must be one you executed and saw succeed, not an aspiration.

Output: a `RUNBOOK.md` a new agent can follow to reproduce a green run.

### Phase 6 - Initialize the support root, derive the first scoped spec, hot projection, and room brain

Initialize the v3 support root before writing support records:

```bash
node /PATH/TO/LLM_WORKBENCH/workbench/tools/workbench-layout.mjs init \
  --project [ABSOLUTE_PROJECT_PATH] --provenance genesis --version v[HARNESS_VERSION] \
  --default-branch [DEFAULT_BRANCH] --integration-branch [INTEGRATION_BRANCH_OR_DEFAULT]
node /PATH/TO/LLM_WORKBENCH/tools/workbench-tools.mjs install \
  --project [ABSOLUTE_PROJECT_PATH]
```

Run `init` from the Workbench release checkout: it records that checkout's
`origin` URL and full `HEAD` commit as `provenance.source` in the manifest.
The checkout and its runtime-tool lane must be clean. Optional
`--source-commit SHA` and `--source-repository URL` values assert that resolved
identity and must match it; they cannot pin an unrelated source. A partial copy
outside a verified release checkout refuses with `invalid-source-identity`
before writing, even when source strings are supplied.

The `init` flags declare, by exact case, the default branch and the branch the
independent review gate merges into (`git.defaultBranch` and
`git.integrationBranch` in the manifest; the same names fill `AGENTS.md` Git
Rules). Declaring never creates the branch: when authorization permits, create
it from the default branch and push it (`git branch NAME DEFAULT` then
`git push -u origin NAME`); otherwise record the omission reason in the first
spec. The readiness gate fails `integration-branch-missing` until it resolves.

The second command installs the Workbench-managed runtime tools into the
project's `workbench/tools/` lane with a receipt recording the exact source
release, commit, and per-file hashes. From then on the project runs its own
copies (`node workbench/tools/spec-workbench.mjs ...`); an application's root
`tools/` directory, if any, is the application's own and is never touched.

After the Scaffold's running path is verified, create one stable
`workbench/specs/S-001-<slug>/SPEC.md` for the nearest coherent capability.
Derive it from locked owner decisions, active ADRs, verified Actuality from the
target, and bounded choices explicitly supplied in the founding prompt; link
those sources and keep unresolved questions open. Put 1-3 one-context
tracer-bullet tickets in its implementation table and record the Genesis result
in its evidence log. The
manifest declares the six lanes (`docs`, `specs`, `wiki`, `sessions`,
`feedback`, `tools`) and their collections; live grilling and handoff records
under `workbench/sessions/` stay untracked. Reusable schema/examples in
`sessions/notepads/templates/` are tracked; `sessions/checkpoints/`
retains frozen history. Operational `sessions/recovery/` stays ignored and is
excluded from notepad discovery. Do not create a project-local `skills/` discovery directory.

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

Then render the Taskboard projection and run doctor. `BLUEPRINT.md` remains a
destination narrative and has no generated catalog or projection region:

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
- [ ] `.claude/settings.json` is filled from that scope and grants `Edit` on
      the declared authorship lanes, or `.claude/` was omitted with a
      reason.
- [ ] Every command in `RUNBOOK.md` was run and passed; paste or reference the
      result.
- [ ] One end-to-end path runs from a single command (the demo artifact).
- [ ] `workbench/manifest.json` is schema 2 and declares the six support
      lanes, ten collections, wiki profile, exact 21-skill policy, version,
      the `git` block, and Genesis provenance with its source commit; the layout validator
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
- [ ] The Genesis run exists as a commit on a prefixed task branch (`codex/`,
      `claude/`, or `backup/`) pushed to the default remote; a working tree of
      untracked files is `in-progress`, not `done`.
- [ ] The declared integration branch (`git.integrationBranch` in
      `workbench/manifest.json`) exists on the default remote at the generation
      commit, or the first spec records the explicit reason it was omitted;
      `doctor` reports `integration-branch-missing` until it resolves.

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
