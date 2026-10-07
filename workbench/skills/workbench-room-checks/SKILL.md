---
name: workbench-room-checks
description: Check how this producer repository lays out, installs, adopts, upgrades and reports on a room: the skills lane, support root, managed runtime tools, lifecycle classification, adoption, control fidelity, explicit upgrade and self-drift checks, plus the carrier line-landing, GitHub binding and socket contract checks. A maintainer skill of this repository only; it never ships to a room.
---

# Workbench room checks

The checks this repository's maintainers run on the routes that create, adopt, upgrade and update a room, and on the producer's own contracts, moved here from the Runbook by the Contract Carrier Pointer-Brief Rewrite (S-004C TK-005K). Each section below is the procedure an operations index row in `RUNBOOK.md` points to, and it binds for that operation in this repository.

This is a maintainer skill: `workbench/manifest.json` declares it under `maintainerSkills`, so the release checks accept it beside the core bundle and no route installs it or lays it into a room ([Maintainer skills](../README.md#maintainer-skills)). Commands run from the root of a clean checkout of this repository, and a path in backticks is relative to that root; a Markdown link resolves from this skill's folder.

## GitHub Coordination Binding Inspection

Follow the [GitHub coordination adapter procedure](../../docs/github-coordination.md)
for read-only inspection of an explicit committed repository binding at an exact
source SHA. It reports live access as unverified. This optional metadata command
adds no Issue assignment or claim authority; ADR-000O remains operative until
the separately reviewed cutover.

## Skills lane check

The core skills ship inside every room at the manifest-declared `skills` lane,
`workbench/skills`, and the two declared discovery roots (`.agents/skills`
for Codex, `.claude/skills` for Claude Code) are tracked relative links into
that lane, so a fresh clone discovers the skills with no provider home and no
personal catalog. This repository's lane is the authoring source for
the 28 core skills listed in `workbench/skills/README.md`; every other room
receives receipt-backed copies from the release checkout:

```bash
node tools/workbench-skills.mjs install --project /absolute/project
node tools/workbench-skills.mjs verify --project /absolute/project
node tools/workbench-skills.mjs update --project /absolute/project --home /disposable-or-user-home --explicit-update
node tools/workbench-skills.mjs rollback --project /absolute/project --backup /path/recorded/in/receipt
node tools/test-skills-lane.mjs
```

`install` copies each required core skill into the lane as ordinary files,
writes `workbench/skills/.workbench-skills.json` with the source repository,
release, commit and a content hash per skill, and lays the two adapters down;
it refuses a lane that already carries a receipt, a core name already present
without one, or a discovery root that exists and resolves elsewhere
(`adapter-collision`). `verify` reports `skills-receipt-drift` naming each
core skill that is missing, modified or unaccounted for and each adapter that
does not resolve into the lane (`source` on this repository), plus
`updateAvailable` when the release holds newer bytes. `update` requires
`--explicit-update`, replaces only changed core skills, backs the previous
directories up under the user home's `.workbench-skills-backup-*`, records the
path in the receipt and re-lays a missing adapter; `rollback` restores a
recorded backup. Skills a room adds to the lane under other names are
room-owned: never copied, hashed, replaced or removed. Genesis and Adoption
run `install`; `update-harness` runs `update`. Doctor reads the lane and the
adapters, never the provider home: a required skill missing from the lane is
`skill-lane-missing` and an unsafe lane entry is `skill-lane-unreadable`
(both severity `error` with effect `none`, like a missing integration branch:
visible in every run, repaired by one release command, never a reason to
stall selection; the Genesis readiness gate fails closed on them), an absent
or misresolving discovery root is `skill-adapter-missing` or
`skill-adapter-broken` (attention, effect `none`), and a root `skills/`
directory is `project-local-skills` (blocks everything) because it shadows
the lane. A room stamped before the lane declares it with
`workbench-layout.mjs migrate --project PATH` from the release checkout,
then runs `install`.
An operations index row that points to a skill the lane lacks is
`skill-pointer-dangling` (attention, effect `none`); doctor reads only the
index and the lane copy to decide which skill binds.

This repository's lane is also the release source, so it may hold maintainer
skills, only when `workbench/manifest.json` declares them under
`maintainerSkills`: the provider-home installer, the one-time upgrade and the
skill-catalog check accept exactly the core plus those names, refuse any other
extra lane entry (`invalid-bundled-core`) or a malformed declaration
(`invalid-maintainer-skills`), and never install or lay one down
([Maintainer skills](../../skills/README.md#maintainer-skills)).

## V3 support-root check

Genesis uses the bounded layout helper to create and validate its declared
support root. Schema 2 declares seven lowercase lanes (`docs`, `specs`, `wiki`,
`sessions`, `feedback`, `tools`, `skills`; a room stamped before the skills
lane still validates with six until it updates) and thirteen collections
(`docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`,
`sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`,
`sessions/notepads`, `sessions/notepads/templates`, `sessions/recovery`, and
the additive `wiki/features`, `docs/ddr` and `landmarks`), the wiki profile, and the exact
source release and commit. `init` creates `docs/ddr` with the decision-record
lifecycle folders `proposed/` and `archive/`, as the ADR collection uses them.
A room stamped before an additive collection still validates; from the release
checkout, `workbench-layout.mjs migrate --project PATH` appends each missing
additive collection in order (`features`, then `ddr`, then `landmarks`), creates its folders as
ordinary directories, adopts an existing ordinary folder with its contents, and
changes no ADR record or other manifest key; a link or file in the way refuses
as `lane-collision` before anything is written. `workbench/sessions/.gitignore`
keeps `grilling/` and `handoffs/` untracked, and also denies the legacy spaced
`grilling diary/` name that a stale installed skill may still write (an
existing ignore file keeps its project rules and validates without that line);
checkpoint history and reusable templates remain tracked; operational recovery stays local.
Exercise it from a disposable project directory:

```bash
node workbench/tools/workbench-layout.mjs init --project /tmp/workbench-project --provenance genesis --version v3.2.1 --integration-branch integration
node workbench/tools/workbench-layout.mjs validate --project /tmp/workbench-project
node tools/test-workbench-layout.mjs
```

`init` and `migrate` record the exact Workbench source in
`provenance.source`. Run them from a clean release checkout: they verify its
`origin`, full 40-character `HEAD`, declared release, and runtime-tool bytes.
Optional `--source-commit SHA` and `--source-repository URL` values are
assertions and must match that checkout; they cannot override it. A relocated
partial copy cannot prove which Workbench bytes it carries and refuses with
`invalid-source-identity` before writing anything, even when source strings are
supplied. The placeholders `unrecorded` and `unknown` are never written.

A room that already exists records source identity after the fact with
`record-source` and brings its seeded lane documents current with
`seed-documents`; both are described under Installed State The Harness Wrote.

A schema 1 (v3.0 five-lane) manifest validates as `upgrade-required`. Migrate
it once, losslessly: `workbench/grilling` becomes `workbench/sessions/grilling`
and the tracked `workbench/handoffs` checkpoints become
`workbench/sessions/checkpoints`; the new lanes and collections are created
empty. A second run reports `current`.

```bash
node workbench/tools/workbench-layout.mjs migrate --project /absolute/project
```

Every consumer resolves lanes and collections through
`workbench/tools/workbench-paths.mjs`; nothing hardcodes a support path.

The manifest may also carry a `git` block (`defaultBranch`,
`integrationBranch`) naming, by exact case, the branch the independent review
gate merges into ([ADR-0039](../../docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)).
`init` and `migrate` write it from `--default-branch` and
`--integration-branch`, defaulting to an existing integration-named branch by
its exact case, then `origin/HEAD` (or the checked-out branch) and
`integration`; `workbench-adoption.mjs migrate` does the same and lists an
unresolved branch as `residue.missingIntegrationBranch`. A manifest without
the block stays valid, and `workbench-paths.mjs` exposes the block as
`declaredGit`. `doctor` reports `integration-branch-undeclared` when the block
is absent and `integration-branch-missing` when the declared name resolves
neither as a local head nor on a remote; both are `error` findings in the
`git` scope with effect `none`, so they stay visible without blocking
selection. When the declared branch resolves and the spec `next` would select
is already `complete` or `superseded` at that ref, `doctor` reports
`complete-on-integration` (attention, naming the spec and ref) so a checkout
behind its integration branch is told so instead of dispatching finished
work; it reads the ref the repository already has and never fetches, and
`next` still returns the slice because a checkout may be pinned
deliberately. Declaring never creates a branch. This repository declares
`integration`; create a missing one from the default branch:

```bash
git branch integration main
git push -u origin integration
```

`init` also seeds the wiki contract (`SCHEMA.md`, `AGENTS.md`, and
`design-concepts/README.md`) into `workbench/wiki/` from `templates/wiki/`
when it runs from a release checkout, filling the version, date, and project
name (`--name`, `--date`, `--wiki-profile project|deployment`); a downstream
copy of the tool reports `seeded.wiki: false` truthfully. The Genesis
readiness gate requires the filled `workbench/wiki/MEMORY.md` router and those
three files with no template placeholder.

`validate --genesis` additionally requires seven ordinary, filled root controls,
exact Workbench version stamps on the six stamped controls (the thin
`CLAUDE.md` remains exactly `@AGENTS.md`), the generated-region markers in
`BLUEPRINT.md` and `TASKBOARD.md` that `render` fills, one actionable
version-matched first spec at a stable `workbench/specs/S-###-slug/SPEC.md`
path, an installed `workbench/tools/` lane whose receipt names the manifest's
release (`tools-receipt-missing` or `version-mismatch` otherwise), a declared
integration branch that resolves (`integration-branch-undeclared` or
`integration-branch-missing` otherwise), an installed `workbench/skills` lane
whose receipt names the manifest's release with both discovery adapters
resolving into it (`skill-lane-missing` or `skill-adapter-broken` otherwise),
and no root `skills/` directory (`project-local-skills`). It fails closed on symlinks,
template placeholders, stubs, version drift, unstable spec paths, or
structurally incomplete first specs. A rejected first spec carries a `reason`
field naming the failing predicate (status, priority, ready task, sections,
acceptance box, stamp, identity, or path), and a stray entry in the specs lane
is listed in `entries`; dotfiles such as `.gitkeep` and `.DS_Store` are
ignored. Readiness proves selection and claim, not doctor: run `render` and
`doctor` on the project afterwards, as `templates/GENESIS.md` Phase 6 says.
The `--genesis` readiness check carries the versioned placeholder vocabulary
with the CLI, and its focused self-test proves that vocabulary exactly matches
the shipped Genesis templates. Relocating the CLI and its declared helper
modules therefore cannot weaken lowercase-placeholder detection.

## Managed runtime tools check

The product's `workbench/tools/` lane is the canonical source of the
Workbench-managed runtime tools; this repository runs them from there. A
downstream project receives receipt-backed copies:

```bash
node tools/workbench-tools.mjs install --project /absolute/project
node tools/workbench-tools.mjs verify --project /absolute/project
node tools/workbench-tools.mjs update --project /absolute/project --home /disposable-or-user-home --explicit-update
node tools/workbench-tools.mjs rollback --project /absolute/project --backup /path/recorded/in/receipt
node tools/test-workbench-tools.mjs
```

`install` writes `workbench/tools/.workbench-tools.json` with the source
repository, release, commit, and a SHA-256 per file, copies each tool as an
ordinary `0644` file, and refuses a lane that already carries a receipt, a
foreign unreceipted file, or a symlink. `verify` reports `tools-receipt-drift`
with the drifted file names and, for each, which of the drift states below it
is in (`source` on this repository). `update` requires `--explicit-update`,
backs changed files up under the user home's `.workbench-tools-backup-*`,
records the backup path in the receipt, and `rollback` restores that backup. An
application's root `tools/` directory is never read or written.

`workbench-tools.mjs` itself is never installed into a room, so the same
receipt hash check also runs from `workbench/tools/workbench-layout.mjs`, which
every room does install, and `doctor` reads it. A room therefore verifies the
runtime it is executing with only the tools it contains, and a drifted managed
tool fails that room's own `doctor` at the registered `all` effect - which
`next` and `claim` also enforce, refusing to dispatch or claim a slice until
the runtime is repaired. The check runs only when the lane carries a receipt -
an uninstalled or release lane is not a managed runtime, and its absent receipt
stays the Genesis readiness gate's finding - and a receipt that exists but
cannot be read, records no file hashes, or names a file outside the tools lane
is reported as `tools-receipt-missing` rather than silently switching the check
off. Its cost is bounded: at most the managed files the receipt names plus one
directory listing of the lane, each file read and hashed once.

The receipt does not decide how much of the runtime gets checked. A drift
report names the file it found, so deleting that key would otherwise switch the
check off for exactly the tampered file while every other key went on
verifying. Both entry points therefore compare the receipt's key set with the
authoritative managed set - `RUNTIME_TOOLS`, defined in
`workbench/tools/workbench-layout.mjs` so that a room carries it too - and
report `tools-receipt-missing` naming what the receipt does not account for,
whether or not the file is still on disk. Both also list the lane, so a foreign
file dropped in beside the managed tools is reported. Dotted entries - the
receipt itself, the installer's transient `.receipt-*` staging directory - are
not managed runtime and are skipped.

The two conditions carry different remedies, because only one of them has a
command that repairs it. A managed tool the receipt does not account for is
repaired by `update --explicit-update`, which rewrites a key the receipt lost
even when the installed bytes already match the release, and restores a managed
file the lane lost. A file the managed runtime does not include is repaired
only by moving it out of the lane: `update` derives its changed set from the
managed tool list, so it reports `current` and changes nothing, and `install`
refuses a lane that already carries a receipt.

The list lives in an installed tool rather than in the release-side installer
because a room never carries `workbench-tools.mjs`. Deriving the expected set
from the lane's own contents instead left one silent hole: a managed file
deleted together with its receipt key leaves nothing on disk to be missed. Ten
of the eleven managed tools are in `doctor`'s own import graph, so deleting one
of those fails loudly with `ERR_MODULE_NOT_FOUND` before any check runs;
`sessions.mjs` is imported by none of them, and its deletion read as a clean
runtime. The list is no less trustworthy than the check that reads it:
`workbench-layout.mjs` is itself a managed file, so rewriting the list means
rewriting a managed file, which the hash comparison reports.

One condition the receipt check still cannot reach: a receipt deleted outright
leaves no managed runtime to check, so `doctor` reports nothing and only the
Genesis readiness gate (`validate --genesis`) fails on it. A managed file
deleted outright is now named - by the coverage comparison if its key went with
it, as `missing-or-not-a-file` drift if the key remains - though for the ten
tools in the import graph the loader fails first, so what a room sees there is
a stack trace rather than a finding.

Drift alone does not say what happened, so each drifted file is classified by
comparing the installed bytes with the release source. `updateAvailable`
compares the receipt with the source and answers a different question, so it
never substitutes for this.

| Drift state | What it means | Remedy |
|---|---|---|
| `receipt-stale` | the installed bytes are the release source's; the receipt hash is the stale fact | `update --explicit-update`, which backs the replaced files up under the user home and records the backup path in the receipt |
| `runtime-modified` | the installed bytes match neither the receipt nor the release source | `rollback --backup PATH` from a backup the receipt records, or `update --explicit-update` once the difference is reviewed |
| `runtime-authentic` | the bytes match both the receipt and the release source; only the file mode drifted | restore mode `0644` on the managed file |
| `source-unavailable` | no release source was reachable, which is every installed room | run `verify` from a release checkout to classify the drift |

Installation and explicit updates also require a clean Git source lane, an
`origin`, and a concrete 40-character `HEAD`; source identity is resolved
before a destination, receipt, or backup is created. The skills lane receipt
and the personal-catalog markers apply the same rule to the `workbench/skills`
bytes. Managed-component updates record the new component generation in their
receipt or marker without rewriting the room manifest's historical adoption
source.

Managed-tool updates and rollbacks reject symlinked lane ancestors, linked or
nonregular managed files, and unsafe backup entries before copying or creating
backups. Resolve the path collision while preserving its target, then retry the
explicit operation. Ordinary drift in a regular managed file still receives a
backup and can be restored.

Layout initialization and schema migration preserve existing session ignore
rules and reject linked destination paths before writes. ADR creation, register
rendering and direct owner promotion also reject unsafe destination chains and
use private temporary files. Legacy Wiki adoption moves existing knowledge
before seeding only the missing contract files.

## Room lifecycle classification check

Before choosing a lifecycle route for a room, ask the room which route its own
contents support. The command is read-only: it never writes, claims work,
selects a route, or authorizes a migration. Run it from this release checkout.

```bash
node tools/workbench-classify.mjs classify --project /absolute/project
node tools/test-workbench-layout.mjs
```

It reports one of four verdicts with the reasons behind it and the evidence it
gathered (`manifest`, `versionStamp`, `supportRoot`, `lifecycleTools`,
`legacyControlShapes`, `roomContents`), and exits 0 for all four. A lane the
room will not let it read - `workbench/` or root `tools/` at mode 000, a
`tools -> tools` symlink loop, a lane name under a regular file, a link whose
target is too long to resolve - is one of the room's own facts: it is reported
as undetermined rather than counted as absent, and the room still gets a
verdict. Only the supplied project path itself failing - unreachable, or not an
ordinary directory - exits 1.

| Verdict | The evidence that produces it |
|---|---|
| `genesis` | The room is empty apart from `.git`: nothing to derive filled controls from |
| `adoption` | A working repository with content, no manifest, no version stamp, and no Workbench-shaped control set |
| `upgrade` | A `workbench/manifest.json` that reads as a manifest object carrying an integer `schemaVersion`, or a Workbench version stamp in a root control with no manifest (the `upgrade --layout-only` v2-root room) |
| `unclassifiable` | `workbench/` is present but is not an ordinary directory or carries no readable manifest; a root control or the room's own top-level listing cannot be read and nothing else is stamped; or the room is harness-shaped with no manifest and no stamp |

Harness-shaped means all seven root controls, or root `tools/` files from the
managed runtime set in a room that also carries more of the seven controls than
it is missing. Those filenames (`privacy.mjs`, `sessions.mjs`) are ordinary, so
one of them alone never makes a room harness-shaped. A `workbench/manifest.json`
that parses as an unrelated JSON object, an array, or a `schemaVersion` that is
absent, `null`, or not an integer is not this room's authority and reads as
`unclassifiable`. Nothing under a `workbench/` that is not an ordinary directory
is read - not the manifest, and not the managed `workbench/tools/` lane, whose
receipt would otherwise credit this room with another room's runtime lane - and
a `workbench/manifest.json` that is itself a symlink is never opened either.
Every component a lifecycle lane is read through must be the room's own, one
level down as well: an ordinary `workbench/` whose `tools` is a link reports
`read: false` for the same reason, and inside an ordinary lane a managed name
that is itself a link, or a directory wearing the name, is not an installed tool
this room carries. A root `tools/` that is a link out of the room is listed as
`rootBorrowedNames` rather than `rootManagedNames`, so another room's files
never corroborate the harness-shaped reading.

`unclassifiable` is a first-class answer, not an error. A harness-shaped room
with no manifest and no stamp is produced equally by an unstamped Workbench
installation (upgrade) and by an independent dialect reusing the same names
(adoption); the room does not say which, so the command lists both readings and
escalates with evidence rather than guessing. A readable manifest reports its
`schemaVersion`, `workbenchVersion`, and recorded `provenance.lifecycle` as
evidence; the recorded lifecycle is never the verdict, and whether an installed
room actually needs migrating is `workbench-layout.mjs validate`'s answer. An
unfilled bracketed control and a version banner that never resolved are
reported as evidence and listed among the reasons, under both the harness-shaped
verdict and the `adoption` one a straight `cp -R templates/.` produces, so a
copy of the templates is offered as a reading rather than mistaken for a room.
The rule is recorded in
[S-044](../../specs/S-044-legacy-room-classification/SPEC.md).

## V3 Adoption migration check

Adoption requires seven filled root controls before it retires legacy
project-local support paths; it lays the core skills into the room's own
`workbench/skills` lane from the release, so no provider home is read.
Exercise the deterministic mixed-v2 fixture without touching a real project:

```bash
node tools/test-workbench-adoption.mjs
```

For a real one-time migration, use the Adoption protocol after its inventory and
control-reconciliation phases:

```bash
node tools/workbench-adoption.mjs migrate \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.2.1
node workbench/tools/workbench-layout.mjs validate --project /absolute/project
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs doctor
```

The command refuses an existing support root or any legacy collision before
mutation. Unreconciled root controls refuse once as `unreconciled-controls`,
naming every failing control in `error.controls` with its own reason
(`missing-control` for an absent, linked, or non-file control;
`bracketed-control` for one still carrying a bracketed placeholder), and
carrying the four-step reconcile-before-migrate order and the warning that a
template copied over an existing control overwrites the project-specific
privacy, boundary, and verification rules it already holds
(`error.reconcileOrder` and `error.templateOverwriteWarning` repeat both for a
machine reader). It moves only documented durable lanes into their schema 2
destinations (legacy `grilling diary/` into the untracked grilling collection,
legacy `handoffs/` into the tracked checkpoints collection), preserves
project-local skills under `workbench/sessions/recovery/adoption-legacy-skills/`
(a root `skills/` would shadow the lane), writes
`workbench/sessions/recovery/adoption-recovery.json`, moves a root
`WORKBENCH_FEEDBACK.md` (or legacy `HARNESS_FEEDBACK.md`) into
`workbench/feedback/WORKBENCH_FEEDBACK.md`, installs the receipt-backed runtime
tools into `workbench/tools/` and the receipt-backed core skills into
`workbench/skills/` with their discovery adapters, then renders and validates
the manifest-declared spec lane. Two root feedback files, or a root file beside a legacy
`feedback/WORKBENCH_FEEDBACK.md`, block as `feedback-collision` before any
mutation. An application's root `tools/` directory is never a migration
source and is left untouched. Its `residue` result lists root filenames that
match the managed runtime-tool set and pre-migration links that escaped a moved
legacy lane; it never deletes those files or rewrites project prose. A moved
legacy room brain receives the required Wiki metadata, and the manifest source
repository/commit must match the managed-tools receipt. The migration fails
only on a finding that blocks `all` or `selection`; nonblocking findings (for
example a moved link that needs explicit reconciliation) are returned as `findings` with
`doctor: passed-with-findings` so the adopting agent repairs them next.

## Control fidelity report

After Adoption Phase 4 or an update-harness run, compare a room's
hand-reconciled controls with the templates they derive from. Run it from this
release checkout; it reads the room and never writes to it:

```bash
node tools/control-fidelity.mjs report --project /absolute/project
node tools/control-fidelity.mjs report --project /absolute/project --control AGENTS.md --format markdown
node tools/test-control-fidelity.mjs
```

The JSON report (Markdown with `--format markdown`, also carried in the JSON
`markdown` field) covers the six templated root controls, `CLAUDE.md` checked
for exact equality with `@AGENTS.md`, `.claude/settings.json` when present, and
the seeded wiki contract files plus `MEMORY.md` under the manifest-declared
wiki lane. Every template line is `filled` (a placeholder line whose fixed
wording remains intact after the room fills its value), `unchanged`, `dropped`, or `changed`
(nearest word-overlap match at or above 0.5); every room line with no template
origin is `added`. It states the checkout version and the room's manifest
release and labels a newer or older template generation instead of pretending
fidelity is exact. Divergence never changes the exit code; only an invocation
error (missing `--project`, an unknown `--control`, a nonexistent project)
exits 1. Each `dropped` or `changed` `AGENTS.md` line is restored or recorded
as a decision in the owning spec or an ADR. Comparing against an older
release means checking that release out first; `--templates PATH` points the
report at another templates directory.

Given the room's earlier template generation, the report also labels the
differences the template made rather than the room (S-004C TK-005M): a room
line kept as only the earlier template carried it is `earlier-template` (a line
the room rewrote stays its own), a current
template line the earlier template did not carry is `newer-template`, and a
line the room kept from the earlier template where the template itself
rewrote it is `template-changed`. Each such entry carries a `generation`
field, each control a `generationCounts` object, and the Markdown names them
as generation differences. The earlier generation is `--previous-templates
PATH`, or the templates at the room manifest's `provenance.source.commit` when
this checkout holds that commit; the report names which in
`previousTemplates`, and labels nothing when neither is available. A labeled
line is reconciled to the current shape; an unlabeled `added`, `dropped` or
`changed` line is the room's own divergence, restored or recorded as above.

```bash
node tools/control-fidelity.mjs report --project /absolute/project --previous-templates /path/to/earlier/templates --format markdown
```

## V3 explicit upgrade and recovery check

One command moves a v2-root room (root `specs/`, no `workbench/`) onto the v3
support root and records `provenance.lifecycle: upgrade`; it has two exclusive
modes. Both require a clean, committed target with no support root, and both
record the pre-migration SHA, tracked path inventory, and tools receipt in
`workbench/sessions/recovery/upgrade-recovery.json`.

Both modes migrate the legacy lanes once through the Adoption seam, install
the receipt-backed runtime tools and the receipt-backed core skills lane with
its discovery adapters, and write the recovery record with
`skills: "lane-install"`, an empty `skillBackups`, `coreRecovery: null` and
the `skillsLane` receipt reference. Neither reads, compares, marks, backs up
or replaces a skill in the provider home; `--home` only names where a later
`workbench-skills.mjs update` would put its backup. `--layout-only` is the
route for an already-adopted room:

```bash
node tools/workbench-upgrade.mjs upgrade \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.2.1 \
  --layout-only
```

`--explicit-update` is the same route under the name every one-time upgrade
historically required; it no longer replaces anything in the provider home,
because the core now lives in the room's lane and a later
`workbench-skills.mjs update --explicit-update` is the only path that replaces
a core skill there. A layout failure reports partial completion with the
pre-migration Git SHA as the recovery point:

```bash
node tools/workbench-upgrade.mjs upgrade \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.2.1 \
  --explicit-update
node tools/test-workbench-upgrade.mjs
```

Passing neither mode blocks with `explicit-update-required`; passing both is an
`invalid-invocation`. Uncommitted state has no concrete rollback point.

## Workbench self-drift check

Project drift and Workbench self-drift are separate checks. A project update
checks the target room's filled controls, product truth, active work and local
proof. When the canonical LLM Workbench itself is updated, check the source
WorkBench's own cold-start surface before and after the change as well.

Run `node workbench/tools/self-drift.mjs --phase pre --json` before the change
and `--phase post --json` afterward. Preserve the receipts in the owning Spec
evidence. The read-only machine report detects bounded contradictions and
identity gaps; it does not certify arbitrary prose. Perform this semantic
check as well, and do not call an update clean while known current-facing
drift remains:

1. Pin the Workbench source revision, manifest version and declared integration
   branch. Preserve unrelated dirty state and inspect from a clean task
   worktree when mutation is involved.
2. Inventory root controls and projections, the manifest, current and planned
   Specs plus `CATALOG.md`, active ADRs and their register, the Wiki router,
   update/review procedures, templates, managed tools and skill receipts,
   seeded contract documents, and readable continuity metadata.
3. Reconcile each current-facing status, blocker, latest event, next gate,
   version, path and owner against its durable source. Classify bounded history
   and append-only evidence explicitly instead of treating every old claim as
   a defect.
4. Record stale completed work, resolved blockers, contradictory versions or
   routes, generated projection drift, stale provenance/seeds and unreadable
   required artifacts with the smallest owning correction. Preserve the source
   bytes and corrections; this check is read-only.
5. Repeat the inventory after the Workbench update and run a clean cold-start
   read-back using repository state only. A project drift result, `render`,
   `doctor` or passing tests may be attached as evidence, but none replaces the
   self-drift result.

The implementation, public machine-readable receipt and remaining proof are
owned by [S-00K](../../specs/S-00K-workbench-self-drift-check/SPEC.md).
`cleanUpdate: false` deliberately leaves the semantic judgment to the named
review; `no-machine-finding` means only the implemented checks found no issue.

## Carrier line-landing check

A maintainer verification tool for a rewrite of the Contract carriers, run at
rewrite review; it is not installed into rooms. It lists every line a candidate
removed from `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md` or `templates/LEXICON.md`
since a base commit and refuses unless each one has an inventory entry whose
home file holds its landed text at the candidate. It reads Git objects only and
never decides which home is right:

```bash
node tools/check-carrier-landing.mjs scaffold --base BASE_SHA --carrier AGENTS.md --out INVENTORY.json
node tools/check-carrier-landing.mjs check --base BASE_SHA --candidate HEAD --inventory INVENTORY.json --json
node tools/test-carrier-landing.mjs
```

An inventory is one JSON file per carrier (`schemaVersion`, `carrier`,
`baseSha`, `entries`). Each entry records `line` (its number at the base),
`text`, `hash` (sha256 of the normalized text), `homeKind`, `homePath`,
`landedText` and `reason`. `homeKind` is `null` until classified, then one of
`stays`, `skill`, `pointer`, `lexicon`, `wiki`, `glossary` (`GLOSSARY.md` or
its Template mirror), `architecture` (`ARCHITECTURE.md` or its Template
mirror), `restates-owner` (the named owner already holds the claim) or
`retired-with-reason` (no home; `reason` required). Normalization trims and
collapses whitespace runs, so a reordered, re-indented or rewrapped line is not
removed; blank lines and headings never need to land. A carrier deleted at the
candidate, as the Lexicon retirement deletes `LEXICON.md`, has removed every
line and reports `carrierRemoved`. `scaffold` writes every other line
unclassified and refuses to overwrite an existing inventory. `check` exits 0
when every removed line landed, 1 on an unlanded line (`no-entry`,
`unclassified`, `stays-but-removed`, `home-missing`, `home-empty`,
`home-lacks-text`, `owner-lacks-claim`, `retired-without-reason`,
`unknown-home-kind`) or an inventory that no longer matches its base, and 2 on
a usage or Git error. The Contract Carrier Pointer-Brief Rewrite
([S-004C](../../specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md))
keeps its inventories in its Spec folder, and the Lexicon retirement
([S-004O](../../specs/S-004O-lexicon-retirement-and-architecture-md/SPEC.md))
keeps the Lexicon inventories in its `proof/` folder.

## Socket Contract Registry

The Foundry socket contract registry (GPT_OS root spec S-014, C-003 extraction)
travels with the Sockets family. `tools/socket-registry/registry.json` is the
machine-readable contract artifact (one record per `K-###`),
`tools/socket-registry/schema.mjs` is its schema, and `tools/socket-contract.mjs`
is the validator — the successor to the instance-side `id-registry.mjs` (which
validates the binding *table*; this validates the *contract*).

```bash
node tools/socket-contract.mjs validate            # schema-check the whole artifact
node tools/socket-contract.mjs resolve K-001       # resolve a socket to its contract
node tools/socket-contract.mjs check-binding  '{"socketId":"K-001","boundEntity":"P-010","access":"contract","entrypoint":"recall.query"}'
node tools/socket-contract.mjs check-connection '{"socketId":"K-001","access":"contract","entrypoint":"recall.query"}'
node tools/test-socket-contract.mjs                # red/green suite
```

An instance binding row (which module fills a socket here) is validated *against*
this traveling contract with `check-binding`; a connection that reaches around
the contract (filesystem/database access into the module) is rejected by
`check-connection` — the no-reach-around hard gate that module legs (OpenBrain,
CIC) import.
