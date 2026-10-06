---
name: director
description: Adopt the assigned Director role for one project and its integration branch within existing authority.
---

# Director

## Purpose

Coordinate the whole project across Spec-bound Dispatchers and integrate
independently reviewed results.

The Director is a role: its scope is the whole project and its integration
branch, coordinating Spec-bound Dispatchers and cross-Spec work. The owner
remains the human above the Director. Role scope composes with the assigned
stance. Each Dispatcher works under the `dispatcher` role entry and adopts the
`spec-planner` stance at flight launch; Spec Planner, Spec Manager, Reviewer
and Auditor are jobs a Dispatcher performs inside its own Spec, not extra
roles, and each Worker carries one assigned Task for one attempt and hands
back to its Dispatcher. A role never grants, removes, or transfers authority:
the owner request, Workbench controls, repository permissions and governing
context establish it first, and occupying the integration branch adds
nothing. Loading this skill never spawns an agent. Changing stance alone
creates no handoff and never makes a prior participant independent.

## Method / Posture

Load the project controls and the current integration state first. Recover
accepted decisions, open gates and the assigned Specs from tracked owners:
each assigned `SPEC.md` resolved through `workbench/manifest.json`, the
rendered Taskboard, the ADR collection under `workbench/docs/adr` and the
Wiki router. Never depend on a local chat, private memory or an unmerged
branch for state another agent must continue from. Record each coordination
decision compactly in its existing owner as it is made, not at closeout.
A Spec's records keep their single writer:
route what belongs in a Spec to that Spec's writer, or record it in the
coordination owner the project names, and
never edit another writer's Spec state concurrently. Distinguish a documented
decision, an unmerged candidate and a delivered capability; only a reviewed
merge into the integration branch delivers.

## Obligations

1. Identify the assigned Specs and their open gates from the tracked owners
   above, without relying on a local chat or private memory.
2. Assign one Spec and its branch to each Dispatcher. Name the
   single durable writer for every shared artifact (Spec records,
   projections, controls, routers) and record each cross-Spec dependency and
   the landing order in a tracked owner on the integration branch, so
   independent lanes proceed in parallel without colliding.
3. Monitor Dispatcher reports and resolve coordination issues inside the
   project assignment. Record a permission refusal or an unsupported host
   capability in the owning Spec rather than routing around it or acting on a
   Worker's behalf. Escalate only a genuine owner choice, phrased as
   options, a recommendation and its cost, and recorded in the owning Spec;
   never re-ask a question the owner settled.
4. Arrange separate-context review of each immutable assembled candidate and
   coordinate its merge request into the integration branch. A rebased or
   re-merged tip is a new candidate and needs a fresh review before it merges.
   Neither a Dispatcher nor an implementing Worker supplies independent approval of its own candidate,
   and the Director never approves a candidate it built. While a room's
   Task-PR exemption holds, a Task may land as its own PR, judged by its
   merge answers rather than a separate-context review; read the release owner
   for that route rather than assuming it.
5. Keep accepted decisions, progress, branch and candidate references and
   remaining gates in the tracked owners on the integration branch through
   reviewed changes. Allocate IDs only when the record that uses them is
   committed. Owner Human QA and integration-to-main promotion
   remain owner acts.

Boundaries: the Director never executes a Task, never takes a Dispatcher's
Spec, never merges a PR whose review has not passed, and
never merges integration into main. An out-of-scope request (another
project, a Spec outside the assignment, a main merge) is
reported, not performed.

## Completion / Exit Condition

Every assigned Spec is at its named endpoint: a reviewed delivery on the
integration branch or a recorded blocker, with its PR, merged SHA, review
verdict and remaining gates written in the owning Spec. Report to the owner
what landed, what remains and each open owner choice. Nothing in this exit
claims owner approval.

## Owner closure and reconciliation

The closure sequence is reviewed delivery on integration -> owner approval -> verification on main -> `complete`.
Owner Human QA timing and findings follow `AGENTS.md` [Git Rules](../../../AGENTS.md#git-rules); the approval is
content-bound, recorded with `approve S-### --candidate SHA --owner NAME`
only for the owner's actual approval of delivered integration content.
`approve` with `--finding TEXT` follows the same rule (each finding names
`continue TK-###:` or `new Task:`); with
`--destination-change TEXT` it records the return to Align without inventing
Tasks. A failed Human QA finding returns to the appropriate scope of Align,
design-concept and delivery work; it does not imply every defect changes design.

Only the owner promotes integration to main. After that promotion, refresh the
default-branch ref (`git fetch origin main` in the declared room) before `complete S-###`:
the command requires all Tasks done, checked acceptance, a Completion Result,
current passed review and owner approval, and verifies the approved content
is contained unchanged on the observed `origin/main`. A merge alone closes
neither Task nor Spec. Run `render` and `doctor` after completion to remove
the Spec from the hot board and keep outstanding diagnostics visible.

After `complete`, capture current capability knowledge in the manifest-declared
features collection before retirement or discard. Author a validated, routed
Wiki feature article naming the Spec's historical route; this is ordinary
documentation work, not a capture CLI command. `uncaptured-complete` reports
missing capture while the Spec remains complete. Reconcile surviving claims
into their durable owners before `retire-spec S-### --wiki PATH`; use the
link-safe folder operations, never manual moves. Discard only retired records
after main containment, capture and the current-reference checks permit it;
retain needed origins, corrections and recovery evidence. A later gap against
delivered work becomes a new Spec under its landmark or the Blueprint, never a
revived Spec and never a correction anchored to a Wiki claim; the Wiki is
evidence for that Spec's direction and plan, not its destination, and the
corrective commands refuse a complete, superseded or retired Spec. The exact
retirement, discard and recovery procedures are in
[Documentation: feature capture, retirement and recovery](#documentation-feature-capture-retirement-and-recovery) below.

## Owner: Human QA and main-before-complete

Examples name S-001/TK-001; substitute the actual IDs and quoted values.
Bracketed values such as `[SHA]`, `[DIGEST]` and `[INTEGRATION SHA]` denote
values captured from the inspected report and delivered commit; replace them
with actual values, never pass these labels literally.

The owner chooses useful milestones, accumulated work, valued Specs, exhausted
Specs or Director escalations for Human QA; version cadence is a default, not a
mandatory sole trigger. An ongoing or failed review remains its corrective
cycle, not a request to start QA again. Monitoring, findings, a merge and a green
suite do not approve anything. The runtime records approval per Spec and binds
it to the delivered integration content; it has no batch/version approval verb.

Only record the owner's actual decision. Finding and destination-change examples
are alternatives to explicit approval, not approval with optional decorations:

```bash
node workbench/tools/spec-workbench.mjs approve S-001 --candidate "[INTEGRATION SHA]" --owner "[WHO]" \
  --finding "[FINDINGS]"
node workbench/tools/spec-workbench.mjs approve S-001 --candidate "[INTEGRATION SHA]" --owner "[WHO]" \
  --destination-change "[TEXT]"
node workbench/tools/spec-workbench.mjs approve S-001 --candidate "[INTEGRATION SHA]" --owner "[WHO]"
```

A finding follows the same disposition rule (`continue TK-###: ...` or
`new Task: ...`); a destination change records return to Align
without inventing Tasks. Return at the implicated scope: a defect need not
change the design concept. Keep failed required-capability findings visible
as real downstream dependencies until resolved. After correction, repeat
assembly/review/delivery and obtain the owner's actual approval of that content.

After the owner promotes the approved content to main, fetch the declared
default branch (`main` in these examples; use the declared default branch), then close the Spec:

```bash
git fetch origin main
node workbench/tools/spec-workbench.mjs complete S-001
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

`complete` requires all Tasks done, checked acceptance, a real Completion Result,
evidence, current passed review and owner approval. It verifies the approved
candidate and unchanged assembled content on observed `origin/main`; a local
main branch or integration merge is insufficient. Refusals leave state untouched.
Completion records the observed ref/SHA and preserves administrative approval;
substantive changes invalidate it. Render removes complete Specs from the hot
board; outstanding diagnostics remain visible.

## Documentation: feature capture, retirement and recovery

After complete, author capability knowledge in the manifest-declared `features`
collection, route it from Wiki MEMORY.md and validate it with the Wiki schema.
There is no capture CLI. A feature article uses `type: feature`, active status,
provenance and source_paths naming the Spec's eventual retired route; it explains
What It Does, Why It Matters, Limits, and Evidence and Sources without copying
active Task state. Follow [features](../../wiki/features/README.md) and
[Wiki schema](../../wiki/SCHEMA.md). `uncaptured-complete` is attention while
the Spec stays complete; missing, invalid or unrouted capture blocks retirement
and Task/Spec discard. Reconcile surviving claims into their existing owners.

Move records only with the link-safe operations. Task retirement is optional
for a done record with proof/Receipt; it rewrites live links, preserves and counts
historical references, and retains the complete Task directory. `move-spec` is
a folder-only alternative for an already complete Spec, not reconciliation or
a bypass of capture. The normal closure route is complete -> feature capture -> `retire-spec`, which
moves the whole Spec and its Tasks together. An individual Task move is a
separate optional operation; its path participates in the review digest and
invalidates earlier content-bound approval. Do not describe it as transparent
normal cleanup or move normal cleanup before closure to avoid that limit.
Use `retire-spec` after validated feature capture;
it checks closure/approval/capture, appends evidence, moves the complete directory,
regenerates ADR/board projections, cleans contained lane branches and lists
unmerged results without deleting them. Do not run both Spec moves sequentially:

```bash
node workbench/tools/spec-workbench.mjs move-task S-001 --task TK-001 --to retired
node workbench/tools/spec-workbench.mjs move-spec S-001 --to retired
node workbench/tools/spec-workbench.mjs retire-spec S-001 --wiki workbench/wiki/features/greeting.md
```

Collision identity recovery is an exceptional `move-task` mode for an already
published done Task in an open Spec. First fetch all remote tips and obtain the
Director disposition naming the earlier identity and centrally reserved replacement.
Freeze the clean candidate and unchanged original Task bytes. Supply the exact
reviewed commit revisions and SHA256 of the source Task:

Use `move-task` with the assigned Spec selector, `--task`, `--replacement`,
`--expected-head`, `--task-hash`, `--source-revision`, `--collision-spec`,
`--collision-revision`, `--collision-path`, and `--reason` from that disposition.
Add `--dry-run --json` for the reviewed plan.

`--dry-run` validates collision recovery and reports without writes. An empty
replacement is refused. Ordinary retirement and other verbs refuse `--dry-run`
before any mutation. After independent review of the
mechanism and plan, repeat the identical command without `--dry-run`; it stages
one guarded move and its live Markdown references/projections, without a commit.
The original Receipt bytes, done status and append-only Spec rows stay intact;
qualified immutable provenance replaces a colliding Former ID alias. Reference
reservations are allowed, but current/retired records, aliases and discard entries
at observed remote tips refuse an occupied replacement. Pending close evidence,
linked paths, dirty state, mismatched inputs and unsupported JSON path references
refuse before writes. Git environment overrides must be removed; GIT_PAGER is
allowed. Missing Git objects are not fetched by this operation.

A process or I/O failure restores touched files and the original Git index. A
rollback failure reports its pinned recovery commit and leaves the tree for
inspection. This does not guarantee recovery after power loss or coordinate
concurrent writers. Commit and independently review the actual repaired assembly;
identity repair transfers no review, acceptance or owner approval. Ordinary
retirement keeps using `--to retired` with no replacement options.

Commit and preserve the retirement result. Its latest incarnation and entire
current directory must reach the declared default branch, observed by a fresh
fetch, before discard. Discard alternatives are separate operations:

```bash
node workbench/tools/spec-workbench.mjs discard S-001 --task TK-001
node workbench/tools/spec-workbench.mjs discard S-001
```

Discard refuses active records, dirty state, unfinished work, missing/invalid
capture, unverified current directory on main and current references. It never
clears the permanent ADR archive. After a Task discard the parent directory has
changed; publish/verify that latest directory on main before Spec discard.
Operational references still block even in the feature owner. Historical links
in its Evidence and Sources become immutable git-show citations. Successful
removal writes DISCARDS.md with the historical route, retiring/discard-parent
commits and exact `git checkout SHA -- DIRECTORY` recovery command; exercise it
in a disposable clone and compare all recovered bytes, including sibling proof,
assets and Receipt runs. The final Task leaves `tasks/.gitkeep` so fresh clones
retain record-backed interpretation. Recovery is for inspection, not new work.

A later gap against delivered work becomes a new Spec under its landmark or the
Blueprint. It never revives a discarded Spec and is never a correction anchored
to a Wiki claim. The new Spec names the delivered work it builds on and may cite
Wiki pages as evidence for its direction and plan, but no Task takes a Wiki
claim as its destination for corrective work. `verdict --result fail`,
`approve --finding` and `createCorrectiveTasks` refuse a Spec that is complete,
superseded or retired, and refuse any `wikiClaim`, each naming this route.
`next` never selects a standalone corrective record an earlier release wrote,
and `claim` and `close` refuse it, though it still occupies its identifier. The
receipt CLI remains Spec-bound and refuses a standalone Task ID. A different
destination needs a new assigned Spec.

An optional JSON preview reports existing records without changing canonical
selection or board format:

```bash
node workbench/tools/spec-workbench.mjs render --format json
```

Its output is `TASKBOARD.preview.json`; default render still generates Markdown
and the catalog. Editing a preview never changes a source record.
