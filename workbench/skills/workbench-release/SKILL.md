---
name: workbench-release
description: Cut, prove and publish an LLM Workbench release from this producer repository: freeze version labels, upgrade the reference Template, prove the composed round trip, portability and cross-provider resume, derive a room from recorded decisions and publish to the personal catalog. A maintainer skill of this repository only; it never ships to a room.
---

# Workbench release

The release operations only this repository's maintainers run, moved here from the Runbook by the Contract Carrier Pointer-Brief Rewrite (S-004C TK-005K). Each section below is the procedure an operations index row in `RUNBOOK.md` points to, and it binds for that operation in this repository.

This is a maintainer skill: `workbench/manifest.json` declares it under `maintainerSkills`, so the release checks accept it beside the core bundle and no route installs it or lays it into a room ([Maintainer skills](../README.md#maintainer-skills)). Commands run from the root of a clean checkout of this repository, and a path in backticks is relative to that root; a Markdown link resolves from this skill's folder.

## Release Identity

A version label freezes when stamped, even before publication. A changed core
bundle requires a new version label; preserve the prior manifest policy as an
exact readable legacy row. Never redefine a stamped label silently. Only the
owner publishes integration to main after applicable review.

The core machine catalog is `coreSkills` in the layout runtime; documentation
and tests derive its size from that catalog. The current candidate includes
save/promote while preserving checkpoint as a no-write compatibility notice.
The v3.1.4 eighteen-skill manifest policy remains readable as a frozen legacy
row. The owner explicitly waived the stamped-label rule for the current v3.2.0
repair only (S-050/S-051): its original twenty-skill policy remains readable,
while the repaired twenty-one-skill core is identified by source commit and
content hashes. This exception does not authorize publication.

## Template Upgrade Release Gate

Before claiming a new version release-ready, apply the AGENTS Template Upgrade
Release Gate to [Workbench_Template](https://github.com/KaydenClark/Workbench_Template),
the example reference installation. Resolve the live repository identity even
when a local checkout or old remote is named Example_Workbench.
This is the required real-room test of `update-harness`.

1. Pin the clean source version/commit and the Template's current integration
   commit. Preserve unrelated work in separate checkouts. Read the target
   controls, create the dedicated upgrade spec, inventory all tracked files,
   and run its full baseline suite.
2. Follow the [`update-harness` skill](../update-harness/SKILL.md) for that installed layout. For an
   already-v3 room, run the source's additive layout migration, reconcile the
   manifest version and changed control sections, and run the source's
   `tools/workbench-tools.mjs update --project TEMPLATE_ROOT --home BACKUP_HOME
   --explicit-update` and `tools/workbench-skills.mjs update --project
   TEMPLATE_ROOT --home BACKUP_HOME --explicit-update`. Refresh eligible seeded
   documents. Keep original adoption/genesis provenance and room identity.
   Record backup/rollback limits; runtime and skills backups alone must not be
   described as whole-room recovery. Publishing skills to the personal catalog
   is a separate operation with its own authorization.
3. Verify the target manifest, applicable control stamps and runtime receipt
   name the new version. From the pinned source run
   `node tools/workbench-tools.mjs verify --project TEMPLATE_ROOT` and compare
   every installed managed hash. Run the Template's full documented suite,
   layout validation and doctor plus a smoke check of changed installed behavior.
   Compare the complete before/after inventory and account for every change.
4. Obtain separate-context review of the immutable Template candidate, merge
   into its declared integration branch, and prove the reviewed commit is
   contained remotely. Clone that remote result afresh and repeat the full
   Template suite and installed-runtime checks.
5. Record source version/SHA, prior and reviewed Template SHAs, commands/results,
   preservation and recovery evidence, review verdict, merged integration SHA
   and fresh-clone result in the current release owner. If any is missing or
   the Template remains on an older version, the gate stays open. Recheck affected
   proof when the release's consumed source changes. This does not approve main.

The initial v3.2.1 correction is owned by
[S-00F](../../specs/S-00F-template-upgrade-release-gate/SPEC.md).
This is a procedural release gate checked by the reviewer, not an automated
remote check or a claim about agent reliability.

## Prepare project evidence and Blueprint questions

From a named evidence room with a schema 2 manifest, run its installed tool:

```bash
node workbench/tools/project-evidence.mjs prepare --project-root . --input workbench/docs/intake-request.json --note blueprint-questions
```

The input is a bounded `project-evidence-request-1` JSON request with `project.name`,
`objective.key/title/focus`, `evidence` and `questions`. Each evidence item names
an `id`, project-relative `source`, caller-classified `kind` (`fact` or
`uncertainty`) and `statement`; paired `line_start`/`line_end` are optional.
Each question names an `id`, `question`, `recommendation`, and referenced
`evidence` IDs. The input file must also be inside that room.

The command validates source paths, observed bytes and privacy, then atomically
creates one provisional JSON grilling note in the manifest's live notepad
collection. Every question is open. Read the returned note/revision through
`notepads.mjs` before continuing the interview. Caller classifications do not
certify meaning, and preparation grants no authority to write a Blueprint, ADR
or spec. Record actual decisions and corrections through the grilling workflow.

A sub-minute isolated demonstration is `node tools/test-project-evidence.mjs`
from this release checkout; it exercises the same public CLI including refusal
cases. It proves deterministic preparation, not an owner interview or model
reliability.

## Derive a fresh room from recorded decisions

From a clean release checkout, with a clean named Template checkout and an
explicitly prepared source room, run:

```bash
node tools/genesis-from-decisions.mjs derive --template TEMPLATE_ROOT --source-project EVIDENCE_ROOM --intake workbench/sessions/notepads/grilling/blueprint-questions.json --plan workbench/docs/genesis-plan.json --destination NEW_PROJECT
```

The destination must not exist. Intake and plan paths, and every draft file
named by the plan, are relative to the evidence room. A `genesis-plan-1` request
names `project.name/founding_prompt`, the seven `controls` and `memory` drafts
(each with `file` and `sha256`), `selected_questions`, `active_adr_ids`, and
`capabilities`. A capability names its `id`, `title`, `derived_from` question IDs,
`outcome`, `acceptance` strings, and one `task` with `id` and `slice`.

Selected questions must be locked and have matching current decision entries.
Corrected or missing answers and changed evidence refuse derivation. The command
preserves decision wording and attribution, selected evidence bytes and hashes,
and active ADR lineage in the new room's durable owners. It does not decide
whether a caller-authored plan faithfully interprets owner intent; review must
judge that relationship. A note or plan does not grant implementation authority.

The staged room receives a new identity and current release runtime through
layout initialization and managed installation. Existing Template task state,
private live notes and old runtime receipts do not become new-project state.
Room-local rendering, doctor and Genesis validation run before publication of
the local destination. Remote recovery and project implementation remain separate
steps under the caller's scope. Existing projects use Adoption.

`node tools/test-genesis-from-decisions.mjs` exercises the public seam with
self-contained synthetic fixtures. The owning S-00E evidence separately records
the actual fresh project and native continuation; fixture success alone is not
that proof.

## Personal catalog publication

The owner's personal catalog (a separate Git checkout mounted as the provider
home's discovery root) is a backup of every skill and the place a room may
publish skills it creates. It is never on a room's critical path. Publishing this release's core into a provider home is
a separately authorized operation; test it against a disposable home first:

```bash
node tools/core-skill-installer.mjs install --home /tmp/workbench-user-home
node tools/test-core-skill-installer.mjs
```

The installer writes missing canonical core directories into `.agents/skills`
and missing Claude directory adapters into `.claude/skills`. Existing names
and valid links remain untouched. Linked and Git-owned discovery roots are
supported. New managed paths are ignored through the owning Git repository's
local exclusions (or a discovery-root ignore file). No personal source is
staged or committed. Unsafe collisions block before installation.

For an explicitly authorized replacement of the published core, use the same
release checkout:

```bash
node tools/core-skill-installer.mjs update --home /tmp/workbench-user-home --explicit-update
node tools/core-skill-installer.mjs rollback --home /tmp/workbench-user-home --backup /tmp/workbench-user-home/.workbench-core-backup-RECORDED
```

Update verifies the source identity and managed ownership, records original
bytes and adapter topology under the named home, then installs the canonical
release and reads it back. Rollback verifies the complete recovery record,
backup hashes and unchanged installed output before restoring originals.
Newer local edits block rollback. Backup exclusions remain after restoration.
Keep the backup until its recovery value is deliberately retired; neither
command transfers live sessions or claims crash-safe transactions. Tracked
core source needs the [explicit migration plan](../../specs/S-051-core-skill-ownership-and-compatibility/tracked-core-migration.md).
A Git-owned provider home is refused because its backup would be versioned;
a Git-owned `.agents` catalog with ignored managed core is supported.

Every skill the personal-catalog installer writes carries the managed skill
marker `.workbench-skill.json` (schema 2): `source`, the `release` and
`commit` of the checkout that wrote it (the same source identity as the lane
receipts), a `contentHash` of the skill's files and an inclusive
`compatibleRooms` range from the v3.1.4 baseline to the producing release. A
schema 1 marker (`source` only) still counts as managed but names no
generation. Doctor no longer reads the provider home; the retired
`doctor --home` inspection is replaced by the lane findings above, and a
published catalog is compared only by the installer's own `update` and
`rollback` checks.

| Finding | Meaning |
|---|---|
| `skill-lane-missing` | The lane, or a required core skill in it, is absent. Error, effect `none`; Genesis readiness fails closed on it. |
| `skill-lane-unreadable` | The lane or a required skill is a link, a file, or holds a shared or linked `SKILL.md`. Error, effect `none`. |
| `skill-adapter-missing` | A declared discovery root is absent, so that host cannot discover the lane. |
| `skill-adapter-broken` | A declared discovery root does not resolve into the lane. |
| `skill-duplicate-discovery` | A deprecated `.codex/skills` entry adds another Codex catalog. |
| `skill-pointer-dangling` | An operations index row points to a skill the lane lacks; the row binds nothing until the lane holds it or the row is re-pointed. Attention, effect `none`. |
| `project-local-skills` | A root `skills/` directory shadows the lane. Blocks everything. |

Doctor never repairs a finding; `workbench-skills.mjs update --explicit-update`
from the release checkout does. These checks establish filesystem discovery,
not native invocation or agent reliability.

## Composed round trip

The composed workflow is proven mechanically, without a model, on every full
verification run:

```bash
node tools/test-workbench-round-trip.mjs
```

It creates a bare remote, runs Genesis with this candidate's tools (init,
tools install, seven controls, wiki router, feedback lane, first spec),
passes `validate --genesis` and doctor, writes a live JSON notepad, reconciles selected claims
into the spec owner, claims the first slice, pushes the planning checkpoint (the
notepad never enters the commit), deletes the working clone, resumes from a
fresh clone with a scrubbed environment using only repository state, drives a
red/green slice, closes, renders, passes doctor, pushes, reads the remote SHA
back, and scans the clone and the transcript for any Foundry name, mechanism,
or private home path. The real cross-provider resume with agents is S-022's
release gate.

## Portability and privacy matrix

Every row of the v3.1 release matrix has a named deterministic check that runs
on every full verification pass:

| Row | Check |
|---|---|
| schema migration | `test-workbench-layout.mjs`: schema 1 reports `upgrade-required`; `migrate` is lossless and idempotent |
| mixed Adoption | `test-workbench-adoption.mjs`: five fixtures including root feedback, collisions, and an untouched root `tools/` |
| case-sensitive paths | `test-portability-matrix.mjs`: no tracked paths differ only by case; capitalised or spaced lanes rejected |
| Windows/POSIX behavior | `test-portability-matrix.mjs` and `test-spec-workbench.mjs`: backslash lanes rejected; CRLF manifests, packets, and projections accepted |
| symlink invocation | `test-symlink-invocation.mjs`: every runtime lane tool runs its main through a symlinked path |
| collisions | `test-workbench-tools.mjs`, `test-workbench-adoption.mjs`, `test-workbench-layout.mjs`: receipts, lanes, feedback, and first-spec collisions block before mutation |
| stale links | `test-diagnostics.mjs`, `test-wiki.mjs`: broken spec links and stale notes are attention, never blocking |
| public privacy stripping | `test-portability-matrix.mjs`: the shared `privacy.mjs` patterns find nothing on the active surfaces |
| retired private and Foundry paths | `test-portability-matrix.mjs`: no active surface names a retired lane, the hidden notepad directory, a private home path, the private skill catalog, a host temp lane, or a Foundry-dependent path |

```bash
node tools/test-portability-matrix.mjs
```

## Cross-provider resume proof

The release-gate proof that a different provider can resume from a clean
clone using repository state only, with isolated candidate skills and
receipt-backed candidate tools and nothing outside the repository:

```bash
node tools/cross-provider-resume.mjs plan --workspace /disposable/workspace
node tools/cross-provider-resume.mjs resume-prompt --workspace /disposable/workspace
node tools/cross-provider-resume.mjs verify --workspace /disposable/workspace --transcript /disposable/workspace/transcript.txt
```

`plan` builds a bare remote, runs Genesis with this candidate, reconciles selected claims
into the spec owner, claims the first slice, pushes the planning checkpoint, destroys
the planning clone, and prepares an isolated, skill-free provider home; the
candidate skills travel inside the room's `workbench/skills` lane, so the
resuming provider discovers them from its fresh clone. Between `plan` and `verify`,
run the other provider from a fresh clone of `origin.git` with its home pointed
at that isolated directory and the printed prompt, capturing its output to a
transcript. Provider authentication and security settings stay with the
configured host and are never copied or weakened by the fixture. Use a
disposable workspace. If the host refuses a required operation, preserve that
result as unavailable or incomplete; it is not a reason to bypass its controls.
`verify` clones fresh and proves the remote advanced, the
task closed with proof, the test and CLI pass, doctor is clean, the tools
receipt names the exact candidate, the live notepad never travelled, and the
transcript names nothing outside the repository. This proof spends provider
budget and is run for the release umbrella, not on every verification pass;
`node tools/test-cross-provider-fixture.mjs` proves the provider-free half
(a recoverable planning checkpoint and a fail-closed verify) on every run.
