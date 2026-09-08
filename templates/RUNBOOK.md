# [PROJECT_NAME] - Runbook

> Generated from LLM Workbench v[HARNESS_VERSION]. See Upgrading The Harness
> below.

**Last reviewed:** [YYYY-MM-DD]
**Runtime owner:** [user / agent / service owner]
**Environment:** [local / LAN / staging / production]

This file explains how to operate, verify, recover, and evaluate the project. It
should be boring, exact, and executable.

## Ordinary Entry

Follow `AGENTS.md` -> this section -> `LEXICON.md` -> Task Routing. Inspect the
root, branch, upstream and dirty state; run the project-local spec doctor and
load the explicitly assigned spec. For owner-directed pickup, use `next --json`
and `show` to resolve that assignment. The spec and ticket set the normal
stance. Investigate within the task; do not invent a next task when blocked.
Load remaining Runbook sections only for the operation being performed.

For a setup-only Round One assignment, a fresh agent follows that route, checks
the manifest, relevant Wiki and ADRs, and runs read-only configuration checks.
Return the result in chat only: no feedback report, handoff, checkpoint,
self-created task, or other delivered prose artifact. Internal JSON capture
follows the meaningful-work rule and is reconciled at closeout; it does not
turn a chat-only setup check into a reporting assignment. Round One precedes
feedback testing.

## Prerequisites

Required tools:

- [tool and version]
- [tool and version]

Required accounts/services:

- [service]
- [service]

Required local files:

- `[path]` - [purpose / how to create safely]

## Environment Configuration

Create local config from the example:

```bash
[COPY_ENV_COMMAND]
```

Required variables:

| Variable | Purpose | Secret? | Example / Notes |
|---|---|---|---|
| `[ENV_VAR]` | [purpose] | [yes/no] | [placeholder only] |

Rules:

- Do not commit real `.env` files, tokens, local databases, logs, or private
  data.
- Keep secrets server-side or local-only.
- Prefer degraded states over fake data when an external source is unavailable.

## Install

```bash
[INSTALL_COMMAND]
```

Expected result:

- [what success looks like]

## Run Locally

```bash
[RUN_COMMAND]
```

Open:

- [local URL, CLI command, or service endpoint]

Expected result:

- [health response / visible UI / log line]

## Test And Build

Fast check:

```bash
[FAST_TEST_COMMAND]
```

Full verification:

```bash
[FULL_TEST_COMMAND]
[BUILD_COMMAND]
[LINT_OR_AUDIT_COMMAND]
[SPEC_DOCTOR_COMMAND]
```

Expected result:

- [pass condition without hardcoding stale counts unless recently verified in
  `TASKBOARD.md`]

### Test Coverage Policy

Treat tests as the project specification, not as a comfort signal. The suite
should be strong enough that if someone accidentally deletes a meaningful line,
branch, route, data contract, workflow step, validation rule, or bug fix, at
least one test or documented manual check fails.

Coverage rules:

- Prefer red/green TDD: write or update the failing test first, confirm the
  expected failure, then implement the smallest fix.
- Run every relevant existing test before judging the suite.
- Keep tests that prove behavior a user, API consumer, operator, or future
  maintainer depends on.
- Improve tests that assert the wrong level, hide real failures, rely on stale
  fixtures, overuse snapshots, or pass without checking meaningful behavior.
- Remove tests that are stale, duplicated without adding a boundary, or pure
  bloat.
- If behavior cannot be tested in the current harness, record the exact reason
  and use the strongest concrete manual check available.

## Workbench Lifecycle, Diagnostics, And Decision Records

The project runs its own installed runtime tools from the manifest-declared
tools lane:

```bash
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-###
node workbench/tools/spec-workbench.mjs claim S-### --agent NAME
node workbench/tools/spec-workbench.mjs close S-### --proof "..." --docs "..." --remaining-gap "..."
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/adr.mjs new --title "Decision title"
node workbench/tools/adr.mjs validate
node workbench/tools/adr.mjs register
```

`doctor` prints every registered finding with its severity and blocking
effect and exits non-zero only for `all` or `selection` findings; a
`selected-slice` finding is excluded by `next` and refused by `claim`, and an
`attention` finding stays visible without blocking. `doctor --home USER_HOME`
(default: the user home, only ever read) also checks each installed core skill's
managed marker `.workbench-skill.json` (schema 2: `source`, `release`,
`commit`, `contentHash`) against the manifest: `stale-skill` names a release
other than the manifest's, `skill-generation-unknown` names a skill with no
schema 2 marker; both are attention, and the explicit upgrade is the repair. `doctor` also reports
`integration-branch-undeclared` and `integration-branch-missing` (scope
`git`, effect `none`) until `workbench/manifest.json` `git.integrationBranch`
names a branch that resolves locally or on a remote; the Genesis readiness
gate fails closed on the same two conditions. When that branch resolves and
the spec `next` would select is already complete there, `doctor` reports
`complete-on-integration` (attention) without hiding the work. Decision records live in
`workbench/docs/adr/`; an accepted record names the control that carries its
rule in `canonicalized_in`, and `register` derives `REGISTER.md`.

`permission-scope-drift` is reported when `.claude/settings.json` exists and
withholds a manifest-declared authorship lane (no covering `Edit` `allow` rule,
a `deny` or `ask` rule covers it, or a restrictive pattern is uncertain), or
grants `workbench/tools/` in `allow` without a covering `ask` holding the whole
lane; an intersecting tools deny also remains visible. It names each lane,
never blocks, and never edits the file. Claude Code applies `Edit` rules to every built-in
file-editing tool. Resolve the finding by adding the
`Edit(./workbench/<lane>/**)` rules, holding `workbench/tools/**` in `ask`,
simplifying an uncertain restriction, or recording the deliberate restriction
in `AGENTS.md`. The Genesis readiness check fails closed on the same finding;
a room without the file is unaffected.

The wiki lane raises `room-brain-unrouted` (attention) when a root control does
not route back to the room brain: `AGENTS.md` must reference `workbench/wiki/`
and `README.md` must reference `MEMORY.md`; the finding names the control that
lacks the route, and a room whose manifest declares a different wiki lane path
sees it until its controls name that lane. It raises `stale-stamp` (attention)
when a wiki contract file or the room brain carries a `Generated from LLM
Workbench` stamp naming a version other than `workbench/manifest.json`; refresh
the stamp when the harness is upgraded (`validate --genesis` fails the same
files with `version-mismatch`).

### Visible Identifiers

```bash
node workbench/tools/spec-workbench.mjs next-id --prefix S --json
node workbench/tools/spec-workbench.mjs next-id S-### --prefix TK --json
node workbench/tools/adr.mjs new --title "Decision title"
```

`next-id` is a read-only proposal, not a reservation or permission to create work.
Ticket proposals require the assigned spec and reserve labels from all specs in
the Workbench. Write the returned label only during authorized planning, then
render and run doctor before requesting another. ADR `new` writes a proposed
record through the existing exclusive-publication path. Existing paths stay fixed.

New durable labels contain at least one letter, so they cannot reuse historical
decimal IDs that are no longer present. Spec/ticket minimum width is three;
ADR allocation keeps width four. Width grows without truncation using alphabet
`0-9 A-Z a-z`. Sorting uses suffix length then that alphabet, independent of
locale; it is label ordering, not creation chronology. Case-folded and leading-zero
collisions are refused. Letter-bearing ticket labels are unique across the room;
legacy numeric ticket references retain their existing spec-qualified scope and
are not claimed globally unique. Their bytes and lookup routes are preserved.

Spec parsing, selection, blockers, claim/close, rendering, Genesis readiness,
ADR registers, Wiki copied-task-state checks, guardrail contradiction checks and
citation-anchor coverage accept the new syntax. Existing numeric syntax remains
readable. Socket/team registry IDs and internal entry sequence IDs keep their
existing formats; these commands do not allocate those artifact types.

### JSON Notepads

Visible note identifiers can be allocated without changing existing note paths:

```bash
node workbench/tools/notepads.mjs allocate --prefix N --objective OBJECTIVE_KEY --title "TITLE"
node workbench/tools/notepads.mjs read --id N-001 --view current
```

Choose the artifact type prefix explicitly (for example N for objective notes,
H for handoffs); it is the prefix in the visible ID, not another identity field.
Allocation uses alphabet `0-9 A-Z a-z`, starts at one with minimum width three,
and grows without truncation. It chooses the first unoccupied label; identifiers
do not encode chronology. Legacy numeric labels reserve their existing text and
are never decoded as a base-62 allocation high-water mark or renamed. Prefixes
have independent scopes within the room. Case-folded and leading-zero variants
reserve the same value, so N-00A, N-00a and N-000A cannot be allocated twice.
Those restrictions deliberately avoid aliases on case-insensitive filesystems.

`--id` resolves through the local inventory, including legacy records whose
filenames differ from their IDs. It refuses unmatched or ambiguous identifiers.
`--note` retains its original filename/path behavior; never combine the selectors.
Allocation skips occupied destination names even when their stored IDs differ.
Unreadable records or ambiguous IDs refuse identifier operations until their
inventory is reconciled; they are preserved. Ordinary `create --note NAME`
remains available for legacy named context. Allocation assumes one writer and
checks current records; it supplies neither a distributed lock nor an eternal
registry of deleted local notes. Active handoff retention still prevents source
cleanup. Durable spec/ticket/ADR behavior is described above.

New notepads are JSON. `workbench/tools/notepads.mjs` owns structural checks
and updates. A new layout declares `sessions/notepads/`: bare names create
`notepads/work/NAME.json`; explicit project-relative paths select another local
type folder. Handoffs use the declared `handoffs` collection. The tracked
`notepad-templates` subcollection carries `notepad.schema.json` and work,
grilling and handoff examples; live-note commands refuse that subcollection.
The schema describes new `notepad-1` interchange, while the runtime additionally
checks unique entry IDs, links and revision safety. Legacy `scope-1` reading and
migration remain supported without moving or regenerating source history.

Existing schema 2 rooms remain valid. From the clean release checkout run
`workbench-layout.mjs migrate --project PATH --version VERSION` to add the two
collections and seed examples with recorded hashes. This moves no old note,
preserves earlier provenance and the room version, and reports the layout source
separately. Existing adjusted examples are retained and reported by the seeded
document mechanism. Repeated migration reports `current`; use `seed-documents`
to refresh untouched seeded examples. Seeding verifies the clean release and
ordinary source, destination and receipt paths before writing or recording. An
asserted version must match the source checkout. Validation checks effective Git
ignore rules and already tracked live files in Git worktrees; outside Git its
`ignoreVerification` says `not-a-git-worktree`, and no tracking guarantee follows.
On a room without the new declaration,
bare note names still use the legacy grilling collection. Never rewrite legacy
Markdown merely to change its extension.

```bash
node workbench/tools/notepads.mjs list --objective KEY
node workbench/tools/notepads.mjs create --note NAME --objective KEY --title "TITLE" --focus "FOCUS"
node workbench/tools/notepads.mjs read --note NOTE --view current
node workbench/tools/notepads.mjs read --note NOTE --topic TOPIC --limit N --cursor N
node workbench/tools/notepads.mjs append --note NOTE --revision N --kind KIND --topic TOPIC --content "TEXT"
node workbench/tools/notepads.mjs current --note NOTE --revision N --state "STATE" --next-action "NEXT" --view-field NAME=VALUE
node workbench/tools/notepads.mjs trim --note NOTE --revision N --entry ENTRY_ID
node workbench/tools/notepads.mjs validate --note NOTE
node workbench/tools/notepads.mjs migrate --note NOTE
node workbench/tools/notepads.mjs delete --note NOTE --revision N
```

Only `--note` and the revision a write checks are always required. `list`
takes `--objective` or no filter at all; `read` takes `--topic`, `--entry`,
`--kind`, `--limit` and `--cursor`; `append` takes `--corrects`,
`--depends-on`, `--interpretation` and `--source-file`; `current` takes
`--unresolved` once per open item and `--view-field` for a field this workflow
keeps in the current view; `trim` takes `--durable-owner` to record
where the removed material now lives.

Kinds are `directive`, `source_record`, `finding`, `proposal`, `decision`,
`correction`, `verification`, and `blocker`. A kind names what a record is for
a reader; it never grants authority or verifies a claim.

1. Resolve the explicit objective or note first; related records share objective
   context. If no stronger signal exists, inspect the newest-created local note
   or handoff and check relevance before using it.
2. Preserve a compact current view (objective, state, unresolved work, next action)
   and ordered entries containing meaningful source text, findings, uncertainty,
   and corrections. Save important context as it becomes available, before
   continuing work that would leave it only in the conversation. Token exhaustion
   or Stop may prevent another write; do not wait for closeout. JSON strings may
   contain full prose. A workflow may keep its own field in the current view;
   `current` preserves it across an update.
3. After interruption, load relevant context and verify current controls and
   actual project state. File availability alone proves neither freshness nor
   successful recovery. Preserve significant work while it is underway.
4. For an owner-requested handoff, author a destination-specific compaction from
   the selected material. Include needed corrections and dependencies. Carry
   the selected content when the destination cannot read the local note.
5. Before cleanup, verify that promoted material is present in its durable
   owner and that retained work can still be understood and resumed. Trim only
   reconciled material from a retained note; preserve unresolved context,
   corrections, and active handoff dependencies. Flush or delete the whole
   record only when all important material is reconciled and nothing still
   depends on it. No routine archive or extra approval is needed for this normal
   cleanup. Preserve legacy sources and existing checkpoints under their current
   retention rules.

`read --view current` returns the resumption view and the revision to write
against without putting entry history into the response. A topic read carries
the corrections and declared dependencies of what it selected, each entry
marked `match` or `context`, and reports `page.matched`, `page.returned`,
`page.has_more`, and `page.next_cursor`: a bounded read never truncates
silently, so never report a slice as the whole record.

Every write names the revision it read. A mismatch is refused as
`stale-revision` naming the current one, `create` refuses an existing name and
`append` an existing entry id as `duplicate-identity`, and a correction or
dependency naming material the note does not hold is refused too. New material
is privacy-scanned before it can reach the file; preserved history is not
rescanned, because an old record may legitimately quote a matching string.
A refused or failed write leaves the previous valid record unchanged.

An id is never reused. `append` remembers the highest number each id prefix has
reached in `extensions.entry_sequence`, and `trim` records the mark for what it
removes, so an id already cited in a durable owner cannot come back naming
different material after the entry that proved the number is gone.

`trim` removes named reconciled entries and refuses with `retained-dependency`
rather than breaking a link in either direction: removing material a retained
entry still depends on is refused, and so is removing a correction while
keeping the claim it corrects, which would leave the record asserting a fact
already known to be wrong with nothing marking it superseded. Trim both halves
together once the correction has landed in its durable owner.

A subcommand refuses any flag it does not recognise, naming the ones it does.
A dropped `--corects` would otherwise report a correction appended and write
an entry with no link at all. A workflow that keeps its own field in the
current view writes it with `--view-field name=value`, JSON when the value
parses as JSON and the raw string otherwise; `current` preserves it from then
on, and `state`, `unresolved` and `next_action` keep their own flags.

An interim `scope-1` record reads as it is and migrates once, preserving its
recorded text and timestamps, before it can be written to.

`sessions.mjs` keeps `scan` and the legacy `checkpoint` copier. Do not send a
JSON note through that copier and call its `.md` output a notepad operation.
Skill prose and human-readable projections may remain Markdown.

## Evaluation And Benchmarking

Use this section to prove whether the workbench or project process is improving.
The goal is evidence, not taste.

An owner-requested handoff is separately authored for its destination. Create it
with `--collection handoffs --type handoff` and add the concise context it needs.
When it points to retained source instead of carrying all selected content,
repeat `--retains NOTE` or `--retains NOTE#ENTRY_ID` during creation. These
canonical pointers live in `relationships.retained_sources`. An active pointer
blocks whole deletion; a whole-note pointer blocks any trim, while an entry
pointer blocks removal of that entry. Related-note navigation alone does not
claim retention. The agent must still inspect prose pointers and destination
access; the tool checks declared dependencies, not semantic sufficiency.

Reconcile the destination before releasing retention: set its status to
`RECONCILED`, clear unresolved items with `--unresolved ""`, and clear its next
action with `--next-action ""`. Source cleanup remains a separate decision.
Whole `delete` requires the source to be reconciled with no entries, unresolved
items, next action, or active declared retainer. Unreadable live records block
cleanup with named paths because retention cannot be established; repair or
reconcile them without discarding their source bytes. This does not block other
work or grant the tool authority to choose what is important. Writes and cleanup
assume one writer per note; revision checks are not simultaneous-writer locks.

### Benchmark-Driven Improvement

Before changing agent rules, control docs, evaluation criteria, or the working
process, capture the available guardrail or benchmark baseline. Put the intended
score movement or outcome hypothesis in the owning spec, then record the
before/after score and remaining recommendations after the change.

Use 100/100 as a deliberately hard north star, not the release gate. Regression
checks are the minimum ship gate. Never weaken a criterion to manufacture
progress, and do not treat a static coverage score as outcome evidence. If this
project has no executable benchmark yet, add one or state that the change cannot
yet be called better.

### Claims To Test

The harness or process is only worth calling better when it can support at least
one of these claims:

1. Better than no project instructions.
2. Better than a representative generic instruction file.
3. Better than the prior version on the same task suite.

### Evaluation Design

Use controlled conditions:

| Condition | What the agent gets | Purpose |
|---|---|---|
| `c0_none` | no project instructions | baseline |
| `c1_generic` | a generic `AGENTS.md` / `CLAUDE.md` style file | common alternative |
| `c2_current` | current project or template docs | current candidate |
| `c3_candidate` | proposed branch or changed docs | improvement test |

Score task outcomes, not how good the docs feel. Useful dimensions:

| Dimension | What it measures |
|---|---|
| Correctness | hidden or independent acceptance check passes |
| Scope adherence | changed files stay inside the task allowlist |
| Verification honesty | final claims match independently rerun checks |
| Docs upkeep | stale docs were updated or explicitly marked unchanged |

Run multiple trials per condition when using stochastic agents. Report effect
size and confidence interval when possible. Do not claim broad proof from one
run.

### Workbench Evaluation Commands

For this template repo, the static evaluator checks control-surface coverage:

```bash
node tools/test-evaluate-workbench.mjs
node tools/evaluate-workbench.mjs --path . --include-controls
```

The runnable trial framework lives in `evals/`:

```bash
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
```

Real comparison runs may spend API budget. Size the run first and record the
model, conditions, task suite, trial count, and result path before making claims.

### Harness Feedback Loop

This project's `WORKBENCH_FEEDBACK.md` is the return channel to the upstream
harness. Lessons logged there feed harness changes, which must clear the same
bar as any other "better" claim: a proposed template change is `c3_candidate`
above, tested against the current docs on the same task suite before it ships.
Feedback flows out; validated improvements flow back in as a harness upgrade
(Upgrading The Harness, above). Taste alone never closes the loop; evidence does.

## Data Operations

Use this section only if the project has seed data, migrations, imports, local
databases, or generated feeds.

Seed/import:

```bash
[SEED_OR_IMPORT_COMMAND]
```

Migration:

```bash
[MIGRATION_COMMAND]
```

Backup/restore:

```bash
[BACKUP_OR_RESTORE_COMMAND]
```

Safety rules:

- [what data this command may modify]
- [what it must never modify]
- [how to verify counts/schema/output]

## Deployment Or Startup

Use this section only if the project has deployment, LaunchAgent, cron,
scheduler, or service startup behavior.

Start/restart:

```bash
[START_OR_RESTART_COMMAND]
```

Stop:

```bash
[STOP_COMMAND]
```

Logs:

```bash
[LOG_COMMAND]
```

Expected healthy state:

- [process, endpoint, scheduler, or deployment check]

## Version-Control Procedures

Git authority and policy live in `AGENTS.md` -> Git Rules. Keep executable
commands and expected results here:

```bash
[STATUS_COMMAND]
[CREATE_TASK_BRANCH_COMMAND]
[DIFF_CHECK_COMMAND]
[CREATE_PR_COMMAND]
```

Expected result: [clean scope, verified base/target, reviewable PR].

Closeout, once the integration review has passed. A pushed branch is
recoverable, not delivered; finish the merge and clean up after yourself:

Run merge and containment verification as a fail-fast sequence. Pin the reviewed
commit and reject a changed candidate. Merge must not delete branches before
containment is verified. A linked worktree holding the target must not block
verification. Only run cleanup when the owner has not deferred it; verify each
local and remote tip is contained, tolerate absent branches, and use an atomic
expected-tip guard on remote deletion so concurrent pushes are preserved.

```bash
(
set -eu
[MERGE_PR_COMMAND]
[VERIFY_INTEGRATION_CONTAINS_WORK_COMMAND]
)
```

After successful verification, if cleanup is authorized:

```bash
[DELETE_MERGED_BRANCH_COMMAND]
git worktree prune
```

Expected result: [integration contains the work; merged branch deleted locally and remotely; unmerged work never force-deleted].

When cleanup is owner-deferred, the declared integration branch contains the
reviewed work and the branches remain available for later cleanup. Disposable
review clones and linked worktrees live outside the canonical checkout, under
the host temporary directory; `git worktree prune` drops the registrations of
removed ones, and a finished review checkout is removed once its review is
recorded. None is a durable owner.

## Upgrading The Harness

These control docs were generated from a specific LLM Workbench version, recorded
in the `Generated from LLM Workbench v[HARNESS_VERSION]` stamp at the top of each
doc. That stamp lets you tell when the project is running an older harness than
the current one.

To upgrade:

1. Check the clean LLM Workbench release checkout's releases/changelog for what changed since
   `v[HARNESS_VERSION]`.
2. Re-copy only the changed template sections; keep this project's filled-in
   specifics. Never let `[BRACKETED]` placeholders leak back into filled docs.
3. Update managed runtime tools only with that checkout's
   `node tools/workbench-tools.mjs update --project PATH --home HOME --explicit-update`;
   keep its receipt and backup as the component recovery point.
4. Update each doc's version stamp to the new version. Do not rewrite the room
   manifest's historical adoption source to impersonate the newly installed
   component generation.
5. Re-run the full verification suite and record the upgrade in its owning spec.

The runtime tools in `workbench/tools/` are Workbench-managed: their receipt
(`.workbench-tools.json`) records the exact source release, commit, and file
hashes. Verify them with `node /PATH/TO/LLM_WORKBENCH/tools/workbench-tools.mjs verify --project .`
and replace them only through `update --explicit-update`, which backs up the
previous files and records a rollback path. Never hand-edit a managed tool.

This project's own `node workbench/tools/spec-workbench.mjs doctor` runs the
same receipt hash check from the tools this project carries, so a hand-edited
managed tool fails the check here with no release checkout present. It fails at
the `all` effect, which also makes `next` and `claim` refuse until the runtime
is repaired. The check runs only when `workbench/tools/` carries a receipt; a
receipt that cannot be read, records no file hashes, names a file outside that
lane, or does not account for every managed tool is reported as
`tools-receipt-missing` rather than switching the check off. That last one
matters because the drift report names the file it found: deleting that key
would otherwise switch the check off for exactly the hand-edited tool. The
authoritative list of what is managed ships inside the installed tools
themselves, so a receipt is checked against that list and not against whatever
the lane happens to hold - a managed tool deleted along with its key is still
named. Dotted entries are skipped.

The two coverage conditions have different repairs. A managed tool the receipt
does not account for is refreshed with `update --explicit-update` from the
release checkout, which rewrites the lost key and restores a deleted managed
file. A file the managed runtime does not include has to be moved out of the
lane instead: `update` cannot adopt it and reports `current`, and `install`
refuses a lane that already carries a receipt.

Without a release checkout `doctor` cannot say whether the receipt went stale
or the bytes were changed - it reports every drifted file as
`source-unavailable` - so run `verify` from the release checkout to classify
it. A deleted receipt is the readiness gate's finding, not this check's. A
deleted managed tool that another managed tool imports stops `doctor` from
loading at all, so what appears is a loader stack trace rather than a finding.

The source checkout must have a concrete `origin` and 40-character `HEAD`, and
its managed source lane must be clean; otherwise install/update refuses before
creating a receipt or backup.

Managed-tool updates and rollbacks reject symlinked lane ancestors, linked or
nonregular managed files, and unsafe backup entries before copying or creating
backups. Resolve the path collision while preserving its target, then retry the
explicit operation. Ordinary drift in a regular managed file still receives a
backup and can be restored.

Layout initialization and schema migration preserve existing session ignore
rules and reject linked destination paths before writes. ADR creation, register
rendering and checkpoint promotion also reject unsafe destination chains and
use private temporary files; checkpoint promotion refuses a `--from` source
outside the repository root, or one reached through a symbolic link, with
`invalid-note` and writes nothing. Legacy Wiki adoption moves existing
knowledge before seeding only the missing contract files.

Treat a harness upgrade like any other change: smallest correct diff, verified,
with proof. If a downstream lesson should flow *back* to the harness, capture it
per the project's `WORKBENCH_FEEDBACK` convention.

## Manual Harness Feedback Reports

Run this workflow after a setup-only Round One check succeeds. It assesses the
assigned target; it never authorizes a repair or invokes automated repair.

1. Resolve `lanes.feedback`, `lanes.specs` and the relevant collections through
   `workbench/manifest.json`. Pin the target revision and the assigned question.
2. Inspect only relevant controls, source and named proof. Test consequential
   claims, distinguish observation from inference, and disclose evidence limits.
3. Write `REPORT-topic-date.md` in the declared feedback lane using its
   `REPORT_FORMAT.md`. Include Target And Scope, Evidence And Limitations,
   Findings, Challenged Or Rejected Findings, Next Action And Open Questions,
   and Review Boundary. No findings is valid. Reports never live loose or in
   the Wiki. If the format is absent in an older installation, these sections
   are sufficient; explicit upgrades may copy it from the source templates.
4. Put accepted follow-up work in its existing linked spec; proposed repairs
   remain pending owner authorization. A report is not a work assignment.
5. At a meaningful continuation boundary, a fresh session should find the report,
   its linked spec, and the next executable action or owner gate using repository
   state only. No universal handoff or new self-created task is required.
6. Before integration, the candidate's separate-context review challenges the
   report's consequential claims and recommendations along with the change.

## Troubleshooting

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| [Symptom] | [cause] | `[command/check]` | [fix] |

## Recovery And Rollback

If a change fails:

1. Identify the touched files and failing command.
2. Revert only the smallest change needed, preserving user work.
3. Rerun the failing verification command.
4. Update the owning spec with the result and remaining gap, then render.

Do not delete data, reset databases, rewrite history, or rotate secrets unless
the user explicitly approves that action.

## Operational Proof

If a command changed durable project state, append evidence to the owning spec.
For routine read-only runs, a final response note is enough.

## Evidence And Continuation Practices

Size a ticket so a fresh context can recover its inputs, exercise one useful
behavior at its public seam and finish named verification. There is no accepted
universal byte or token threshold. Unknown consequential product choices belong
in a decision slice of the already assigned spec before dependent implementation;
this does not authorize creating a task from an unassigned finding.

Saving context or authoring a requested handoff does not terminate a session.
Continue to the authorized endpoint. Preserve the complete original question
inventory and stable IDs/statuses/corrections; a compact view routes to retained
sources rather than replacing them. Multiple objective-linked notes are allowed,
with an unambiguous active resume route. Stale migrated discovery paths belong
in the existing ownership/migration assignment.

When partitioning evidence, preserve previously published rows byte-for-byte and
link successor work from its owner; do not rewrite an old result to match newer
truth. Name which immutable tree each claim reads. A generated projection names
its sources and freshness limits; no cached observer service is implied.

The claim-age diagnostic compares UTC calendar date stamps and reports a claim
older than one calendar day (strictly greater than 86,400,000 milliseconds).
The old prose saying working day was inaccurate. Historical GPT_OS local-day
Preflight and ref-deduplication rules remain scoped historical requirements,
not an automatically imported Workbench algorithm.

Author small ADRs for independently changing consequential decisions with real
alternatives or reversal cost. Binding rules stay in current owners. A semantic
review checks agreement; text presence alone cannot establish fidelity.
Portable record parsing treats LF, CRLF and CR as syntax variations; read-only
validation never normalizes files as a side effect.

Keep setup human-readable and staged through the documented Genesis, adoption
and explicit-upgrade routes. Verify every consumed source lane before mutation,
then installed behavior in the actual room. Project-owned schemas/templates and
promoted Wiki knowledge travel in project Git; optional private session transport
handles live working context separately. A clean upstream test is not downstream
acceptance. Recheck actual destination refs and preserve unknown remote state.

When an assigned evidence record needs partitioning, first pin the source commit
and preserve the original published file. Keep each distinct introduction and
its provenance with the material it introduces; never merge those boundaries
into a new narrative. In the existing owning spec, record each successor part's
stable path, source range or entry IDs, count and content hash, plus total source
and resulting counts. Verify that the parts account for all selected material
exactly once, with exclusions explicitly named, and read back their bytes against
the pinned source. Append a route from the existing owner to the parts; leave
published rows and prior citations intact. No automatic size cap or routine
partition is required. Never weaken validators or discard evidence to fit a cap.
