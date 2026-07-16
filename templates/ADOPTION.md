# [PROJECT_NAME] - Adoption (Migration Protocol)

> Part of LLM Workbench v[HARNESS_VERSION]. Stamp the copied control docs with this
> same version during handoff (Phase 7).

This file is the one-time protocol for adopting the harness into a project that
**already exists** and often already has an older or foreign set of control docs.
It is the sibling of `GENESIS.md`: Genesis builds filled docs from a founding
prompt; Adoption derives filled docs from a working repository and reconciles
whatever harness is already there.

Use Adoption (not Genesis) when the target has real code, history, or existing
`AGENTS`/`ROADMAP`/policy docs. Read this once, run it once, then delete or
archive it; afterward AGENTS plus the progressive spec flow govern.

## What Adoption Is For

The owner should be able to point an agent at an existing repo - with its own
code, tests, and a prior harness - and get back the v2 control surfaces
(`AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `TASKBOARD.md`, `RUNBOOK.md`, and
stable specs) that describe **what is actually true**, with none of the
project's real content lost in the move.

Adoption does **not** rewrite the product or "clean up" the code. It documents
observed reality, migrates existing intent and history into the v2 layout, and
hands off to the normal work loop.

## Inputs

Before starting, capture:

- **Target repo:** `[ABSOLUTE_PROJECT_PATH]`, at a known clean commit (branch
  from it; never migrate on a dirty tree).
- **Source provenance:** source remote, ref, and resolved commit used for the
  adoption. Record these exact values in the owning spec together with the
  self-tests actually executed and a vendored-helper checksum when adoption
  copies a helper into the project.
- **Existing harness inventory:** every doc that currently steers agents or
  humans - e.g. `AGENTS.md`, `CLAUDE.md`, `ROADMAP.md`, `README.md`, `RUNBOOK`,
  and any policy/checklist/design files. List them before changing any.
- **Founding intent, if recoverable:** the original goal, in the owner's words if
  a prompt or vision doc exists; otherwise reconstruct it from the docs and
  confirm with the owner.
- **Hard constraints:** language, platform, budget, privacy, "must not touch X."

Observed reality outranks the old docs. Where the code and a stale doc disagree,
trust the code, note the drift, and document what is true.

## Decide Alone vs. Ask

Decide alone (reversible, low-risk, faithful to what exists):

- how to split an old combined doc into the v2 files (e.g. `ROADMAP` -> direction
  vs. queue);
- edit-scope paths read directly off the real directory tree;
- test/lint commands that already exist in the repo;
- where to archive superseded docs.

Ask one focused question when the answer is expensive to reverse or not knowable
from the repo:

- the founding intent or core promise, when the docs are silent or contradictory;
- whether a superseded doc's rule is still policy or already abandoned;
- anything touching money, secrets, personal data, licensing, or published
  contracts;
- deleting vs. archiving history the owner may still want.

Phrase questions as product tradeoffs with a recommendation. Batch the blocking
ones and ask once, before you start rewriting docs.

## Phases

Run in order. Each phase produces a durable artifact and is verifiable before the
next begins.

### Phase 0 - Inventory and classify

1. Branch from a clean commit. Confirm the existing test/build commands run
   green *as found* - you need a known-good baseline before touching anything.
   If the host cannot write Git metadata, record the blocker; do not force the
   Git operation or fabricate its proof. Continue only permitted, reversible
   document work and verification, then hand branch operations to the owner.
   Record the source remote, ref, resolved commit, executed baseline checks, and
   any applicable vendored-helper checksum in the owning spec before changing
   the harness.
2. List every existing harness/steer doc and classify each:
   - **Port** - real content that maps into a v2 doc (direction, tasks, rules).
   - **Fold** - a policy/checklist doc whose rules belong inside `AGENTS.md`.
   - **Keep** - project-local material the harness does not own (e.g. a visual or
     design doc; the harness defers visual style to exactly these).
   - **Retire** - superseded or dead docs to archive after migration.
3. Identify the dialect (which harness version/layout it uses) so you know what is
   moving where.

Output: a migration map (each existing doc -> port / fold / keep / retire) and a
green baseline run recorded.

### Phase 1 - Recover intent -> BLUEPRINT

Fill `BLUEPRINT.md` from what the project *is*, read off the code and the ported
docs. Preserve any recoverable founding intent verbatim, as Genesis would. Where
the old docs claimed something the code contradicts, document the real state and
log the drift in Design Decisions.

Output: a `BLUEPRINT.md` that matches the running project, not the aspirational
old one.

Port accepted project-wide definitions from existing glossaries, design docs,
and source vocabulary into `LEXICON.md`. Keep scoped terms in their owning spec
until they become shared. Do not treat an old decision log as a glossary.

Output: a `LEXICON.md` that records established meanings without duplicating
requirements or architecture decisions.

### Phase 2 - Document the real architecture

Fill `BLUEPRINT.md` -> Architecture and Design Decisions from what is actually
built: languages, entry points, storage, tests, deployment - each a fact you
confirmed in the repo, not a choice you made. Record notable decisions the code
implies but no doc states.

Output: an Architecture table that a new agent can trust against the source.

### Phase 3 - Map the old harness -> new control docs

This is the heart of Adoption: move content into the v2 layout without losing it.
Typical mappings (adjust to the actual dialect):

- **Combined roadmap/plan doc** -> stable direction into `BLUEPRINT.md`; the live
  queue into planned specs, then project only active in-flight slices into
  `TASKBOARD.md`. Preserve old completed proof in a cold archive; do not
  manufacture a spec for every historical task.
- **Policy / checklist / "unattended work" docs** -> fold their still-live rules
  into `AGENTS.md` (authority, scope, verification, safety); retire the originals.
- **Existing `AGENTS`/`CLAUDE`** -> reconcile into the v2 `AGENTS.md` and the thin
  `CLAUDE.md` bridge; keep any rule still true, drop what the code disproved.
- **Glossary / ubiquitous-language / context docs** -> accepted shared
  definitions into `LEXICON.md`; scoped decisions into the owning spec; archive
  the superseded container after verifying nothing was lost.
- **Design / visual docs** -> keep as project-local references; link, do not fold.

Preserve history in a cold archive or the owning stable spec. Do not copy
completed proof into the hot `TASKBOARD.md` projection.

Output: v2 docs carrying the old harness's live content; a list of retired docs.

### Phase 4 - AGENTS scopes from the real tree

Fill `AGENTS.md` **Edit Scope** from the actual directories (`src/`, `tests/`,
`scripts/`, `docs/`, etc.), not from the old doc's claims. Set the read scope,
secrets boundary, authority order, and verification contract to this repo's
reality.

Then make it mechanical: if `.claude/settings.json` was copied in, fill it from
that scope - writable roots -> `allow`, secrets/credentials/build output ->
`deny`, review-required actions -> `ask` (see `.claude/README.md`). Omit `.claude/`
deliberately if the project will not use Claude Code.

Output: an `AGENTS.md` whose scope names real paths, plus a filled
`.claude/settings.json` or a recorded decision to omit it.

### Phase 5 - RUNBOOK from what already runs

Fill `RUNBOOK.md` with the commands you ran in Phase 0 and saw succeed:
prerequisites, install, run, test/build, and the full verification suite. Every
command must be one that works in this repo today, not an aspiration inherited
from an old doc.

Also record the exact fresh-clone verification commands in the project's
`RUNBOOK.md`: clone the recorded remote into a disposable path, check out the
recorded ref or resolved commit, rerun the documented self-tests, and verify any
vendored-helper checksum. Keep project-specific values in that Runbook and the
owning spec rather than filling them into this generic protocol.

Output: a `RUNBOOK.md` that reproduces the project's existing green run.

### Phase 6 - Seed specs and render the TASKBOARD

Port coherent live capabilities into stable specs. Put only one-context active
slices in their implementation tables, preserve completed history in the owning
spec or a cold archive, and render `TASKBOARD.md` from active spec metadata. Add
an evidence row recording that Adoption ran and what moved where.

Output: stable capability records plus a hot projection that reflects the
project's actual state and the migration.

### Phase 7 - Retire the old harness and handoff

Archive (do not silently delete) the retired docs - e.g. move them under an
`archive/` note or a single `LEGACY_HARNESS.md` - so history survives and no one
follows two rulesets. Set the `Generated from LLM Workbench v[HARNESS_VERSION]`
stamp on each v2 control doc. Delete unfilled placeholders. Re-run the full
verification suite and confirm it still matches the Phase 0 baseline. If
`ADOPTION.md` was copied in, delete or archive it.

Output: a repo where each v2 control surface owns one class of truth and the old
harness is preserved as history, not a competing rulebook.

## What A Finished Adoption Must Prove

- [ ] `BLUEPRINT.md`, `LEXICON.md`, `AGENTS.md`, `RUNBOOK.md`, and
      `TASKBOARD.md` exist with **no remaining `[BRACKETED]` placeholders** in
      required sections.
- [ ] Every existing harness doc was classified port / fold / keep / retire, and
      no ported doc's live content was lost.
- [ ] `BLUEPRINT.md` matches the running code where the old docs disagreed;
      drifts are logged.
- [ ] `AGENTS.md` edit scope names real paths that exist in the repo.
- [ ] `.claude/settings.json` is filled from that scope, or `.claude/` was omitted
      with a reason.
- [ ] The full verification suite runs green and matches the Phase 0 baseline;
      paste or reference the result.
- [ ] Stable specs contain the project's actual in-flight and ready work;
      `TASKBOARD.md` projects only the hot state and contains no completed proof
      archive.
- [ ] The owning spec records the source remote, ref, resolved commit, executed
      self-tests, and any applicable vendored-helper checksum; the project's
      `RUNBOOK.md` retains the exact fresh-clone verification commands.
- [ ] Retired docs are archived (not deleted), and a spec evidence row records that
      Adoption ran.

If any box is unchecked, adoption is `in-progress`, not `done`. State which box
failed and why.

## Guardrails

- Do not bulldoze. Reconcile and preserve; the existing project is real work, not
  a blank slate.
- Do not fabricate a green run. Baseline in Phase 0 and re-verify at handoff; a
  command you did not execute is not proof.
- Do not lose history. Archive retired docs and migrate proof records; never
  delete the old queue or ledger outright.
- Observed reality outranks old docs. When code and a stale doc conflict, document
  the code and flag the drift.
- Keep this file generic if it lives in a template set. Adoption fills the *other*
  docs with project specifics; it does not fill this one.
