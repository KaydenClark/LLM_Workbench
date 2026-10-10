---
name: workbench-runtime
description: Operate the Workbench runtime tools a room has installed - read a finding and what it blocks, validate the Wiki, repair installed state, allocate a visible identifier, keep the connection identity, check a configured host and add a room-local skill - through the procedure the room's Runbook operations index points to.
---

# Workbench Runtime

## Purpose

Operate the Workbench runtime tools the room has installed in its
manifest-declared tools lane (`workbench/tools/`): read what a finding means and
what it blocks, repair the installed state the harness wrote, allocate visible
identifiers, keep the room's connection identity, check what a configured host
can do, and add a room-local skill to the `workbench/skills` lane. The room's
Runbook operations index points to the section below that carries each
operation's procedure.

## Method

Resolve every lane and collection through `workbench/manifest.json`, run the
command the operation's section names from the room root (or from the pinned
release checkout where the section says so), and read its actual output before
acting on it.

## Obligations

A tool reports without manufacturing authority. Act on a finding's registered
blocking effect, never on a guess about it, and do not invent a command, a
finding code or an effect the installed runtime does not have. Repair only with
the command a section names, within the current assignment; read-only
validation never repairs. Decision records (the ADR collection in
`workbench/docs/adr/` and its destination sibling) follow the `to-docs` skill.

## Completion

The operation is complete when its command ran, its output was read, and any
change it made is committed through the assigned work's normal route; a finding
left unrepaired stays visible with its reason.

## Diagnostics And Blocking Effects

Every finding a runtime tool emits is registered in
`workbench/tools/diagnostics.mjs` with a severity (`error` or `attention`), a
scope, and a blocking effect. The consuming command enforces the effect; no
spec, manifest, or projection can choose whether its own finding blocks.

| Effect | Consumer behavior | Codes |
|---|---|---|
| `all` | `doctor` exits 1; `next` and `claim` refuse to read the layout | `invalid-manifest`, `upgrade-required`, `invalid-lane`, `unsafe-lane`, `invalid-collection`, `missing-collection`, `invalid-skill-policy`, `invalid-wiki-profile`, `sessions-not-ignored`, `tools-receipt-missing`, `tools-receipt-drift`, and the Genesis readiness codes |
| `selection` | `doctor` exits 1 until repaired; selection is unsafe | `malformed-spec`, `duplicate-id`, `invalid-state`, `contradictory-state`, `unstable-path`, `missing-evidence`, `render-drift`, `broken-render-target`, `row-record-collision`, `receipt-corrupt` |
| `selected-slice` | `doctor` reports it and exits 0; `next` excludes the slice; `claim` refuses it by name | `blocked-slice` |
| `none` (attention) | reported, exit 0, never hides work | `stale-claim`, `broken-link`, `complete-on-integration`, `stale-register`, `stale-note`, `stale-skill`, `skill-generation-unknown`, `room-brain-unrouted`, `stale-stamp`, `stale-seed`, `unverified-provenance`, `legibility-undeclared` and `legibility-unconfirmed` (scope `manifest`), `detached-head` and `untracked-controls` (scope `git`), and the ADR and wiki findings until their tools ship |

`legibility-undeclared` names missing, empty or bracketed-placeholder entries
in the manifest's runtime surface. `legibility-unconfirmed` reports its
`confirmation: "pending"` marker. Both are advisory. After confirming how to
run, operate, inspect, see errors, exercise the journey and measure the product,
use `workbench-layout.mjs declare-legibility` with all six entries and without
`--pending`. A declared command is a pointer, not authority to execute it.
| `none` (error) | reported, exit 0, never hides work; setup refuses unresolved branch creation or identical branch names | `integration-branch-undeclared`, `integration-branch-missing`, `integration-branch-not-distinct`, `default-branch-missing` (scope `git`), and the error-severity ADR and wiki findings |

The two attention codes in scope `git` surface the repository state a
completion claim can hide. `detached-head` reports a detached HEAD, a
legitimate inspection state that blocks nothing; switch to a branch before
committing work you intend to deliver. `untracked-controls` names untracked
files under the root controls, the ADR collection or the spec lane (ten by
name, then a count); commit or remove them before claiming the work done. A
room that has never been committed carries it until its first commit.
Neither is reported when Git state is unknown, and neither changes `doctor`'s
exit code or `next`'s selection: the false claim itself is refused at `close`
(see [Spec Lifecycle And Retrieval](../../../RUNBOOK.md#spec-lifecycle-and-retrieval)).

`doctor --json` prints the findings with their `severity`, `scope`, and
`blocks` fields. The plain output groups them by that effect and is read from
the top: `blocking (N)` first (effects `all` and `selection`), then
`selected slice (N)`, then `informational (N)` for everything registered
`none`. Each header carries its count and its consequence, each row reads
`code [blocks EFFECT, SEVERITY]: message`, and the output ends with an
`ok - no blocking finding` line when only attention or slice findings remain.
Grouping is presentation: an `error` under `informational` is still an `error`
in the registry and in `--json`; it simply stops nothing.

The `skills` scope reads the room's `workbench/skills` lane and its
`.agents/skills` and `.claude/skills` adapters; the retired `--home` option
is ignored, and doctor never reads or writes a provider home.
`skill-lane-missing` and `skill-lane-unreadable` are errors with effect
`none` (repair them with the release checkout's `workbench-skills.mjs install`
or `update --explicit-update`; the Genesis readiness gate fails closed on
them), `skill-adapter-missing` and `skill-adapter-broken` are attention
findings (a host that checked an adapter out as a plain file instead of a
link reports `skill-adapter-broken`), and a root `skills/` directory is
`project-local-skills`, which blocks everything because it shadows the lane.
An operations index row that points to a skill the lane lacks is the
attention finding `skill-pointer-dangling`; doctor reads only the index and
the lane copy to decide which skill binds. Filesystem discovery is distinct
from configured-host invocation.

`doctor` also reports `integration-branch-undeclared` and
`integration-branch-missing` (scope `git`, effect `none`) until
`workbench/manifest.json` `git.integrationBranch` names a branch that
resolves locally or on a remote; the Genesis readiness gate fails closed on
the same two conditions. Setup also refuses `integration-branch-not-distinct`
when the default and integration names match, and `default-branch-missing`
when creating integration has no resolved default ref to start from. Those
registered Git errors retain effect `none`; the setup command itself refuses
completion. When that branch resolves and the spec `next` would
select is already complete there, `doctor` reports `complete-on-integration`
(attention) without hiding the work. `doctor`
reports `detached-head` and `untracked-controls` (scope `git`, attention,
effect `none`) for a detached HEAD and for untracked files under the root
controls, the ADR collection or the spec lane; neither blocks, because `close`
refuses the false completion claim itself.

`permission-scope-drift` (severity `error`, scope `controls`, effect `none`)
is reported when `.claude/settings.json` exists and withholds a
manifest-declared authorship lane (`docs`, `specs`, `wiki`, `sessions`, or
`feedback` lacks a covering `Edit` `allow` rule, or a `deny` or
`ask` rule covers it, since both override `allow` and an asked lane prompts on
every write), or when the `tools` lane is granted in `allow` without a covering
`ask` rule holding the whole lane. A `deny` that covers or intersects an allowed
tools lane remains visible. The finding names each withheld lane with its
reason; it never edits the file, and a room may deny a lane deliberately and
record why in `AGENTS.md`. The matcher is conservative: it recognises
bare `Edit`, the documented `path`, `./path`, and `/path` project-relative
forms, `//path` absolute paths, and `~/path` home-relative paths. A restrictive
pattern it cannot safely interpret and an unreadable file
are reported rather than treated as clear. `validate --genesis`
fails closed on the same condition; a room without the file is unaffected.
Resolve it by adding the `Edit(./workbench/<lane>/**)` rules from the release
checkout's `templates/.claude/settings.json` and moving `workbench/tools/**` to `ask`,
or by simplifying an uncertain restriction. Claude Code applies `Edit` rules
to every built-in file-editing tool.

The claim-age diagnostic compares UTC calendar date stamps and reports a claim
older than one calendar day (strictly greater than 86,400,000 milliseconds).
The old prose saying working day was inaccurate. Historical GPT_OS local-day
Preflight and ref-deduplication rules remain scoped historical requirements,
not an automatically imported Workbench algorithm.

## Wiki Validation

The wiki lane is validated by its own runtime tool; doctor carries the same
findings for schema 2 projects, none of which blocks selection. That tool
reports wiki facts only. The two installed-state findings described under
Installed State The Harness Wrote below - `stale-seed` and
`unverified-provenance` - are not wiki facts and are emitted by `doctor`
itself, not by this validator; both are repaired with `workbench-layout.mjs`,
not with anything in the wiki lane:

```bash
node workbench/tools/wiki.mjs validate
node workbench/tools/wiki.mjs normalize [--date YYYY-MM-DD]
node workbench/tools/wiki.mjs move-note NOTE --to COLLECTION [--name BASENAME] [--retype TYPE] [--dry-run] [--json]
```

`invalid-note` covers a missing router, a missing required collection, absent
frontmatter, a retired `authority` property, an enum outside `type`,
`status`, `sensitivity`, or `knowledge_role`, a non-ISO `last_verified`, an
absolute or traversing `source_paths` entry, a duplicated note basename, and a
`design-concepts/` article that lacks `type: design-concept`,
`authorized_by`, `parent`, or its `Evidence and Sources` and `History`
sections. `copied-task-state` flags generated-region markers or task rows
copied into a note; `secret-like-content` flags key blocks, tokens,
credential assignments, absolute home paths, host temp handoff lanes, and
email addresses in a `normal` note (the shared `workbench/tools/privacy.mjs`
patterns). `stale-note` is attention only. `room-brain-unrouted` (attention)
reports a root control that does not route back to the room brain: `AGENTS.md`
must reference the wiki lane path and `README.md` must reference `MEMORY.md`;
the message names the control lacking the route, and a room whose manifest
declares a different wiki lane path sees it until its controls name that lane.
`stale-stamp` (attention)
reports a wiki contract file (`SCHEMA.md`, `AGENTS.md`,
`design-concepts/README.md`) or the room brain whose `Generated from LLM
Workbench` stamp names a version other than the manifest's; the check is
version equality, not content freshness (that stays with `stale-note`), and a
file without a stamp names no version. `validate --genesis` fails the same
files with `version-mismatch`. Wiki contract files and the room brain carry the
stamp, so refresh the stamp when the harness is upgraded. An Obsidian vault
configuration is ignored when
present and never required.

`normalize` is the explicit repair for a note whose required properties are
missing. It inserts only what is absent, never edits a body, never overwrites a
declared value, keeps the file's own line terminator, skips `archive/`, and
lists every note it changed. Inserted values are the least-claiming the schema
allows: `status: partial` (completed mechanically, not verified),
`knowledge_role: derived`, a `provenance` line naming the normalization, the
note's own path as its `source_paths`, and `last_verified` set to the day
normalize ran. `type` is inferred from where the note lives (`MEMORY.md` ->
`memory`, `guidebooks/` -> `guidebook`, `design-concepts/` -> `design-concept`,
otherwise `meta`). Correct the inferred values by hand afterwards; a
design-concept article still needs its `authorized_by`, `parent`, and sections,
which normalize never invents.

`move-note` is the only way a note changes collection; never move one by
hand, because a hand move leaves every link to it dangling. `NOTE` is the
note's project-relative path inside the wiki lane and `--to` names a declared
collection (`design-concepts`, `features`, `guidebooks` or `archive`).
`--name` renames the note (a plain basename, no `.md`), and `--retype` changes
its `type` in the same move, which is how a per-Spec design-concept article
becomes a `feature` article. Run it first with `--dry-run`: it prints the plan
and writes nothing. The move rewrites every live Markdown link to the note,
recomputes the moved note's own outgoing links only where their text would no
longer resolve, and covers the root controls, the Wiki, the skills lane,
decision records, every Spec and Task record and the landmark records and
question cards. A reference inside a Spec's Append-Only Evidence And Execution
Log is history and is left as written, counted under `historicalReferencesLeft`
beside `referencesRewritten`. It refuses, and writes nothing, when the
destination collection does not accept the (re)typed note (`design-concepts`
holds `design-concept`, `features` holds `feature`, `guidebooks` holds
`guidebook`, `archive` holds any type), when the destination or its basename
is taken anywhere in the wiki, when the note is the router, a collection
`README.md` or contract file, has no frontmatter, or when a rename would
orphan an Obsidian `[[wikilink]]`. In a Git room a tracked note moves with
`git mv` and exactly the changed files are staged, so the candidate reads as
one rename with its link repairs. The move does not edit the note's body or
History; add the move to its History and, after a retype, the sections the new
type requires, then run `validate`. Plain-text path mentions that are not
Markdown links (a JSON inventory, a generated tracker) are not rewritten.

## Installed State The Harness Wrote

Two classes of installed state are repaired by a command the room runs itself;
neither blocks. Both findings are emitted by `doctor` itself, not by the Wiki
validator (see Wiki Validation above); the checks
themselves live in `workbench-layout.mjs`, which owns seeding and provenance.

```bash
node workbench/tools/workbench-layout.mjs seed-documents --project /absolute/project
node workbench/tools/workbench-layout.mjs record-source --project /absolute/project
```

`seed-documents` copies the seeded lane documents this release carries
(currently `workbench/feedback/REPORT_FORMAT.md`) and records the generation of
each one in `workbench/.workbench-seed.json` beside the manifest - a release per
document, never a byte hash in the tools receipt, whose drift finding blocks
everything and would turn a deliberate local adjustment into a failure. It
writes a document only when it is absent, or when the installed bytes still
match the hash the command recorded when it last wrote that document; a copy
byte-identical to the release is recorded as current, and a copy the room
changed is retained untouched and reported by name. `stale-seed` (attention,
scope `feedback`) then reports a document whose recorded release is not the
manifest `workbenchVersion`. A document with no recorded generation names no
generation and is silent, exactly as an unstamped wiki file is.

`record-source` records verified source identity in `provenance.source` for a
room that already exists, under the same clean-release-checkout verification
`init` carries: a relocated partial copy refuses with `invalid-source-identity`
and writes nothing, and nothing else in the manifest changes.
`unverified-provenance` (attention, scope `manifest`) reports a manifest with no
`provenance.source`, a commit that is not a full 40-character SHA, an empty
repository, or a `release` that disagrees with `workbenchVersion`.

## Visible Identifiers

```bash
node workbench/tools/spec-workbench.mjs next-id --prefix S --json
node workbench/tools/spec-workbench.mjs next-id S-### --prefix TK --json
node workbench/tools/adr.mjs new --title "Decision title"
node workbench/tools/notepads.mjs allocate --prefix N --objective OBJECTIVE_KEY --title "TITLE"
node workbench/tools/spec-workbench.mjs widen-id S-###
node workbench/tools/spec-workbench.mjs widen-id TK-### --spec S-###
```

`next-id` is a read-only proposal, not a reservation or permission to create work.
Task proposals require the assigned spec and reserve labels from all specs in
the Workbench. Both proposals also reserve retired and discarded labels and
every Spec and Task ID held at a remote-tracking tip, so fetch first. Write the
returned label only during authorized planning, then render and run doctor
before requesting another. ADR `new` (and `new --kind ddr` for a DDR) writes a
proposed record through the existing exclusive-publication path and also
reserves that kind's labels held at every remote-tracking tip. Notepad `allocate` creates the note its returned ID names.

Specs, Tasks, ADRs and notepads share one artifact policy: a new label's suffix
uses uppercase `0-9A-Z`, has minimum width four and contains at least one
letter (`S-000A`, `TK-000A`, `ADR-000C`, `N-000A`), so it cannot reuse a
historical decimal ID that is no longer present. Width grows without truncation
or recycling. Every spelling of one identity is reserved: suffixes compare
case-folded with leading zeros removed (the collision key), so a legacy short
`S-00Q`, its widened `S-000Q` and a lowercase `S-00q` are one identity and are
never allocated twice. Sorting removes leading zeros, then orders by suffix
length and then by `0-9`, `A-Z` and legacy `a-z`, independent of locale; it is
label ordering, not creation chronology. Letter-bearing task labels are unique
across the room; legacy numeric task references retain their existing
spec-qualified scope and are not claimed globally unique.

Existing records keep their stored IDs, paths and bytes; allocation never
renames them. Public Spec and Task commands (`show`, `claim`, `close`,
`move-spec`, `move-task`, blockers, the `next-id` parent and the other
selectors) accept any spelling that shares the stored record's collision key
and act on that one record, reporting its stored ID and path. Task selectors
stay Spec-qualified. Two stored records behind one key, including an active
record and a retired one, refuse by name rather than choosing a winner.
Notepad `--id` resolves the same way, and ADRs or notes whose records alias
one identity refuse allocation.

`widen-id` is the explicit identity-only touch. An agent starting substantive
work on a planned, active or blocked Spec, or on an open Task record under one,
runs it once from a clean tree to widen that record to the width-four spelling
of its own collision key (`S-00Q` to `S-000Q`, numeric `TK-001` to `TK-0001`;
`--spec` names the parent when a numeric Task label is ambiguous). It renames
the record directory, rewrites the ID field and title, keeps the previous
spelling in one `**Former ID:**` field directly under the ID field, and repairs
live links with the lifecycle moves' reference rewrite. Evidence rows stay
byte-identical; their links to the old path are counted as historical and
doctor reports them as attention-only broken links. The former spelling keeps
resolving. It never changes status, a repeat run is a no-op, and it refuses
complete, reviewed, done and retired records, a dirty tree, an occupied
destination or alias and an unsafe record path before writing anything. Like
`move-spec` it stages the change and commits nothing; commit it as its own
candidate. Never bulk-widen: a read-only inventory at QA/verify time finds open
records still short.

Spec parsing, selection, blockers, claim/close, rendering, Genesis readiness,
ADR registers, Wiki copied-task-state checks, guardrail contradiction checks and
citation-anchor coverage accept the new syntax. Existing numeric, short and
mixed-case syntax remains readable. Socket/team registry IDs and internal entry
sequence IDs keep their existing formats; these commands do not allocate those
artifact types. Workbench connection identities (`WB-` plus 22 characters)
keep their separate base-62 alphabet; the artifact policy does not apply to
them.

## Workbench Connection Identity

`workbench/manifest.json` stores `workbenchId`, a `WB-` identifier containing
128 random bits encoded in the shared base-62 alphabet. New Genesis/adoption
initialization assigns a new identity. Clone, worktree, rename, relocation and
maintenance preserve the manifest's identity; visible artifact IDs retain their
existing room scope. No path, credential or remote configuration enters this
field. Global uniqueness is probabilistic; transport must check its selected
namespace inventory before association.

For an existing room without the field, explicitly assign it once:

```bash
node workbench/tools/workbench-layout.mjs identify --project .
```

Commit that manifest before cloning the legacy room. Repeated assignment reads
back the existing value without rewriting it. Read-only validation never assigns
identity; ordinary legacy local work remains available without transport.
Migration assigns missing identity and preserves existing valid identity.
Malformed identity is refused, never silently regenerated. Independent projects
use fresh initialization rather than copying another project's manifest.

Local assignment uses an exclusive `workbench/.identity.lock`. A busy result
preserves the existing writer's lock; after interruption, verify that writer is
inactive before deliberately removing its stale lock. This is local writer
serialization, not a cross-clone transaction or a crash-recovery claim.

## Configured-Host Capability Checks

The minimum is writable declared lanes (relative, home-relative and absolute),
native skill discovery and invocation, Node execution of managed tools, the
selected directory adapter, and checkout record syntax. Evidence is scoped to
the actual host/application/configuration. Missing capabilities affect dependent
operations only; unavailable checks stay unverified. Capability does not prove
enforcement or agent reliability. Remote transport is optional.

From the pinned producer checkout, run `node tools/configured-host.mjs --probe
CONFIG.json`. The explicitly supplied JSON names `root` (producer checkout),
`sourceCommit` (the expected full 40-character producer commit),
`sourceRepository` (the expected producer `origin` URL),
`cwd` (authorized temporary adapter location), `home`, nonempty `lanes` (existing
writable directories), `skill` (a declared SKILL.md path), and optional `node`
(runtime executable). The command creates and removes private temporary probes
only in those locations. Before executing managed doctor, it verifies that
`root` is the named Git checkout root at the expected commit and origin, with
clean manifest, managed-tool, and ADR inputs. It executes managed doctor and parses actual ADRs;
line-ending variants are structural evidence. Its exit code fails on a failed
operation; zero may include unverified checks and is not blanket compatibility.
Native discovery/invocation always needs a separate provider trace. Record the
provider, model if reported, configuration, OS, exact source and operations;
explicit skill-path invocation alone does not prove automatic discovery.

## Room-Local Skills

The core skills live in this room's `workbench/skills` lane, laid down from
the LLM Workbench release with a receipt (`.workbench-skills.json`) naming the
source release, commit and a hash per skill. The tracked `.agents/skills`
(Codex) and `.claude/skills` (Claude Code) links resolve into the lane, so a
fresh clone discovers every core skill with no provider home. Check the lane
from the release checkout with `node tools/workbench-skills.mjs verify
--project PATH`; `doctor` reports `skill-lane-missing`, `skill-lane-unreadable`,
`skill-adapter-missing`, `skill-adapter-broken` and `project-local-skills`
without repairing them, and `skill-pointer-dangling` for an index row that
points to a skill the lane lacks.

For an authorized room-specific extension, keep its sole source in the lane at
`workbench/skills/NAME/SKILL.md`. Choose a name absent from required core;
preserve any collision for explicit reconciliation. The tracked
`.agents/skills` and `.claude/skills` adapters already resolve into the lane,
so both hosts discover the extension without a second copy or a per-skill
link; `workbench-skills.mjs verify` lists it under `roomLocal` and never
replaces or removes it. On Windows, confirm the host checked the adapter links
out as links; inability to do so leaves that discovery gate open. Do not
duplicate implementation bytes, add a root `skills/`, or add `.codex/skills`.
Invoke the extension in the actual configured application: file presence and
a resolving adapter alone do not prove native discovery or callability.

Laying the lane down does not publish room-local source into a personal catalog.
That acceptance is a separately authorized operation, and a personal catalog
is never on the room's critical path. Doctor inspects the lane
and its adapters from the room tree and never reads a provider home. A new
room needs no local extension and no
personal catalog for core save/promote/notepad operation. Genesis's prohibition
on a root `skills/` core shadow does not prohibit this room-owned source route.
