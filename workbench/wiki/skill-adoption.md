---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-011 agent skills adoption entrypoint, 2026-07-16
  - S-01D TK-00U source audit, inventory-order repair and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/adoption/SKILL.md
  - templates/ADOPTION.md
  - tools/workbench-adoption.mjs
  - tools/workbench-classify.mjs
  - tools/test-workbench-adoption.mjs
  - tools/test-skill-catalog.mjs
  - workbench/specs/S-01D-adoption-skill-rebuild/SPEC.md
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Adoption: bring an existing project into the Workbench once

Use `adoption` when a project that already has code, history and its own steering documents joins the Workbench for the first time. Adoption keeps what the project already knows. It reconciles the project's own rules into the seven root controls, moves known legacy folders into the `workbench/` support root, and leaves a pushed branch the owner can resume from. It happens once per room. A room that is already adopted goes to `update-harness`. A new project with no code or history goes to `genesis`.

**Inputs:** an existing Git project with a remote, the owner's authorization for branch and push operations, and a checked-out Workbench release. **Output:** seven filled root controls, a `workbench/` support root with its manifest, runtime tools and core skills, the local recovery record `workbench/sessions/recovery/adoption-recovery.json`, an owning Spec holding provenance and evidence, and a pushed task branch. **Done when:** every box in the protocol's "What A Finished Adoption Must Prove" checklist in `templates/ADOPTION.md` is checked or named as unchecked with a reason, the project's own tests match the baseline, and the report names the pushed recovery ref and the remaining owner gates.

## How it works

The [skill](../skills/adoption/SKILL.md) is a short entry point into the full protocol in `templates/ADOPTION.md`. Its order is the part that matters:

1. **Check the checkout.** Look at branch, dirty/ahead/diverged state, remote and nearest controls. If the tree is dirty, commit the owned work on a prefixed task branch or move the migration into a clean worktree. A dirty tree is not a reason to give up.
2. **Inventory before anything is installed.** Run `node tools/workbench-classify.mjs classify --project …` from the release. It reads and writes nothing. Continue only if the verdict is `adoption`. An `upgrade` verdict goes to `/update-harness` and a `genesis` verdict goes to `/genesis`. If the verdict is `unclassifiable`, find the answer from the room's history, its remote or the owner. Then take the code baseline, or record it `unavailable` in the Spec's `**Baseline:**` field. List the existing steering documents. Record the release's source remote, ref and resolved commit in the owning Spec. Confirm that the clean commit you branch from is on the project's remote.
3. **Reconcile, then migrate.** Fill the seven root controls from the project's own truth, never by copying a template over an existing control. Then run `node tools/workbench-adoption.mjs migrate --project … --home … --version v3.2.1` from the release. The helper moves only known durable v2 paths (`specs/`, `Wiki/`, root `MEMORY.md`, `feedback/`, `grilling diary/`, `handoffs/`, a root feedback file). It keeps a project-local `skills/` folder under recovery. It installs the receipt-backed runtime tools into `workbench/tools/` and the core skills into the room's own `workbench/skills` lane with discovery adapters. It declares the integration branch, writes the recovery record, renders projections and runs doctor. It never reads or writes a skill in the provider home; `--home` is still a required argument.
4. **Preserve, commit, record.** Port live truth into its owners and archive retired documents instead of deleting them. Commit and push each coherent step on a prefixed task branch. Put the executed self-tests and fresh-clone commands next to the provenance, and report the pushed recovery ref.

The helper refuses before changing anything when a `workbench/` root already exists (`support-root-exists`), when a legacy path collides, or when any root control is missing or still has a `[BRACKETED]` placeholder (`unreconciled-controls`, naming every failing control at once). The `support-root-exists` refusal is what stops a second adoption. The skill routes an already-adopted room to `/update-harness`, which records lifecycle `upgrade` instead of a second `adoption` ([V3 Adoption migration check](../../RUNBOOK.md#v3-adoption-migration-check)).

### Example, from the verification run

The S-01D scenario used a throwaway project called `inkwell`: a word counter with two tests and three commits, pushed to a local bare remote. It had its own `AGENTS.md` (offline-only, never commit `drafts/`), `CLAUDE.md`, `README.md` with a founding quote, `ROADMAP.md`, a root `MEMORY.md` and a legacy `specs/` folder. The owner said "Please adopt inkwell into the Workbench."

The agent, given only this skill and a release checkout, ran `classify` and got `adoption`. It ran the tests (2 of 2 passed), created and pushed `integration` from `main`, and branched to `claude/adopt-inkwell`. Its first commit recorded provenance, the baseline and the document inventory in an owning Spec, before any control changed. It then reconciled the seven controls, keeping the four original `AGENTS.md` rules word for word. It ran `migrate` with an empty home directory. The run completed, moved `specs/` and `MEMORY.md` into the lanes, and left the home directory empty. It archived `ROADMAP.md` unchanged and pushed each step.

Asked to "run adoption again for a fresh adoption record", it ran `classify` again (verdict `upgrade`), did not run `migrate`, and told the owner that a second adoption record would contradict the first and that `/update-harness` is the route. The recovery record's hash did not change.

Asked to resume on "another machine", it cloned the remote and checked out the task branch. There the tests passed 2 of 2, `doctor` and layout validation passed, and `src/`, `test/`, `package.json` and `.gitignore` were byte-identical to the pre-adoption commit.

## Composition

`adoption` is one of three entry routes into a room. [`genesis`](../skills/genesis/SKILL.md) builds a new project from a founding prompt and sends existing projects to adoption. [`update-harness`](../skills/update-harness/SKILL.md) owns every later update, including moving an already-adopted v2 room onto the v3 root with `workbench-upgrade.mjs upgrade --layout-only`. `tools/control-fidelity.mjs report` checks the reconciled controls against their templates ([Control fidelity report](../../RUNBOOK.md#control-fidelity-report)). After migration, the room uses its own installed `workbench/tools/spec-workbench.mjs` and its own core skills.

## Upstream relationship

None is claimed. `adoption` is Workbench-native. `THIRD_PARTY_NOTICES.md` carries only the `mattpocock/skills` MIT notice and names no adoption derivation. At the compared pin `mattpocock/skills@c55ee46073ed923f86ce59a5eb3b6d895095d1b7` no skill adopts or migrates an existing project into a harness. The nearest names there, `setup-matt-pocock-skills` (configures that catalog's issue tracker and labels in a repository) and `migrate-to-shoehorn` (migrates TypeScript test code), do a different job. The skill first appeared in this repository in `6943c10` (PR #27, 2026-07-16). S-01D changed it in two commits (the pre-migration inventory order and the `**Baseline:**` wording); the result is git blob `fae833c0f8cca132a1845ae1a7574eb7b858a982`.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-workbench-adoption.mjs` checks the mixed-v2 migration, every refusal named above, and (added by S-01D) that a second run on a room the helper already adopted is refused as `support-root-exists`, moves nothing, and leaves the manifest's `adoption` provenance and the recovery record byte-identical. The same test shows the first adoption completing with an empty provider home and writing nothing there. `tools/test-skill-catalog.mjs` checks that the skill names the classifier, the baseline, the source provenance and the recovery point before the `migrate` command, and that it no longer sends the agent to a provider home or to the retired checkpoint copy. One fresh-context agent followed the skill through the scenario above. The run is recorded in the [Spec evidence](../specs/S-01D-adoption-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run, one model and a scripted owner, in a tiny project with a local bare remote. It is not owner Human QA and not a repeated trial. The scenario did not cover a dirty tree, an `unclassifiable` verdict, a legacy `Wiki/` or `skills/` folder, an `unavailable` baseline, or a remote that had to be created. The agent could not get a separate-context review offline, so nothing was merged into `integration`. The run also surfaced gaps that sit in the shared protocol or helper rather than in this skill. S-01D recorded them without changing them:

- The recovery record is git-ignored, so it never reaches the remote. A resume on another machine relies on the pushed branch and on whatever the owning Spec copied from the record.
- Without `origin/HEAD`, the helper declares the checked-out branch (the task branch) as `git.defaultBranch`. The trial agent avoided this by running `git remote set-head origin main` first.
- The protocol asks for provenance in the owning Spec before the harness changes, but it does not say where that Spec lives before `workbench/specs/` exists.
- The control version stamp and the letter-bearing Spec IDs the helper expects are stated only in tool code.

Installed personal copies of the skill are not changed by this Spec.

## Remaining intended behavior

Owner Human QA of the conversational fidelity of an adoption on `integration` remains, together with the four protocol and helper gaps above, which need their own owner.

## Sources

- [Adoption source](../skills/adoption/SKILL.md), the protocol in `templates/ADOPTION.md`, and the helper `tools/workbench-adoption.mjs`
- [Individual delivery Spec](../specs/S-01D-adoption-skill-rebuild/SPEC.md)
- [Runbook: V3 Adoption migration check](../../RUNBOOK.md#v3-adoption-migration-check) and [Control fidelity report](../../RUNBOOK.md#control-fidelity-report)
- [Lexicon: Core Terms](../../LEXICON.md#core-terms) (normal setup, explicit skill update) and [Governance Core](../../LEXICON.md#governance-core) (declared integration branch)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01D TK-00U after a source audit that reordered the pre-migration inventory, with one fresh-context scenario.
