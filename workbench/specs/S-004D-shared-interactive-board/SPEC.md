# S-004D - Shared Interactive Workbench Board

**Spec ID:** S-004D
**Status:** planned
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** The browser workspace the Grill Board grows into: connected Taskboard and Tracker cards, discussion and update requests, preserving their distinct source and progress semantics.
**Release scope:** In scope since the owner's 2026-10-04 answer; no release is assigned.
**Blockers:** none
**Latest event:** 2026-10-06: the owner settled the hosting boundary (local, small), comments as one file each in a folder under the Grill Board, no dragging, and the board's storage model (it reads existing owners and stores only comments).
**Next gate:** Activate and cut Tasks from live Actuality with `/to-tasks`, starting from the Grill Board; settle the remaining open design choices as each slice needs them.

> **Citation anchors.** pre=`f6af4c339b543988a3212b1940581157f573818d` post=`f6af4c339b543988a3212b1940581157f573818d`.

## Outcome

One browser workspace lets the owner inspect and participate in Workbench
understanding and execution: browse connected cards, comment on their contents,
request corrections or updates, and see what happened to those requests.
Taskboard and Tracker share familiar card interactions and can appear together,
with execution and understanding available as different views.

The [Grill Board](../../grill-board/README.md) is this board's first working
form, already in use: the owner answers pending items in a local browser page
and agents carry the answers into their owners. This Spec is the destination it
grows into. It remains planned with no claimed owner or Tasks; the remaining
work is the path from the Grill Board to the outcome above.

## Why It Matters

The owner needs a familiar visual place to see the concepts and work as agents
have recorded them, follow their connections, and correct misunderstandings
without reconstructing everything in chat or adopting a Markdown-reading habit.
Structured object retrieval already exists; this capability gives the human an
interface to the same maintained records and operations. Browser presentation
need not force all underlying artifacts into one storage format.

## Current Verified State

### The Grill Board, the first working form

Checked at `46ad978956a74a3ee1bda22c36eb16207dcd98fd`. The Grill Board landed
through PRs #333 to #336 without a claimed Task under this Spec.

- [`tools/grill-board.mjs`](../../../tools/grill-board.mjs) serves one local
  page from `workbench/grill-board/` on `127.0.0.1` (default port 4646) and
  offers `status`, `pending`, `show`, `add`, `revise`, `apply`, `withdraw` and
  `validate`. [The procedure](../../grill-board/README.md) owns its rules.
- `items.json` holds 180 items in six kinds (`approve-spec` 46, `choice` 36,
  `confirm-dqc` 35, `confirm-ddr` 33, `owner-decision` 28, `confirm-text` 2):
  Spec owner gates and owner decisions drawn from the Specs and `TASKBOARD.md`,
  unconfirmed Destination Question Cards from the Landmark Tracker records, DDR
  texts written from locked answers, open choices and prepared decision-record
  questions citing the ADRs, DDRs, Lexicon and controls, and Blueprint page
  texts. Each item cites its sources at a commit.
- Two files, two writers: agents write `items.json` only through the tool; the
  owner writes the untracked `answers.json` only through the served page. The
  owner answers items as a package, in fixed batches filtered by topic, kind,
  scale and workflow stage. An item is never deleted or renumbered; `revise`
  bumps its revision so an older answer shows as Re-answer; `apply` copies the
  owner's verdict, note and time into Git with where it landed; `withdraw`
  keeps a retired item visible.
- A Read menu opens full current AGENTS, RUNBOOK, BLUEPRINT, LEXICON, Landmark,
  ADR and DDR pages, each identified by a content SHA-256 and checkout commit,
  with a revision notice on a 15-second poll.
- `node tools/test-grill-board.mjs` passed 16/16 at this tree.

What each Desired Behavior item has today:

| # | Desired behavior | Grill Board today |
|---|---|---|
| 1 | Mixed connected cards in one workspace, execution and understanding views | Partly: one page of items from Spec gates, question cards and decision records, with filters; items carry snapshots and source links, not live Taskboard or Tracker cards; no execution or understanding view |
| 2 | Consistent card inspector | Partly: brief, sources at a commit, history and related card histories; full reader pages for root controls, Landmarks, ADRs and DDRs; no Spec or Task reader and no discussion thread |
| 3 | Execution lanes and understanding distributions kept distinct | Not yet: neither is shown; the page's counts are review progress only |
| 4 | Comments and update requests on stable identities, with disposition | Partly: one verdict and note per stable `GB-####` item and revision, with answer history and Applied disposition; attached to board items rather than the artifacts; owner words reach Git only when applied |
| 5 | Updates through owning operations; no gate bypass | Partly: agents carry answers through the owning commands and the page edits no artifact; projections are not refreshed by the board |
| 6 | Identity across views; no collisions or mixed progress numbers | Partly: stable item identity and one count per item; Task and Spec identities are not shown as cards |
| 7 | Honest stale and conflicting state; coordinated writers; recovery | Partly: stale answers are refused and shown as Re-answer, and reader text shows revision changes; nothing checks who sends the page's save request, and `items.json` writes are atomic replacements with no cross-writer check |
| 8 | Bounded agent retrieval through the same operations | Partly: `status`, `pending --json` and `show` serve agents the same records; size and latency are not measured |

### Board sources

These are dated observations at `f6af4c339b543988a3212b1940581157f573818d`,
not promises about the baseline when Tasks are cut:

- [Generated JSON Taskboard](../S-01X-generated-json-taskboard/SPEC.md) owns the
  six-lane execution board. Its current contract explicitly supersedes the
  earlier persistent-marker proposal: generated cards never own source state.
  The [generator](../../tools/taskboard.mjs) derives Spec and Task cards from
  their records, with titles, dependencies, source links, next action and QA
  requirements. `render --format json` writes `TASKBOARD.preview.json`; the
  root remains `TASKBOARD.md` at this pin.
- [Landmark Tracker](../S-001Z-landmark-tracker-view/SPEC.md) and its
  [runtime](../../tools/landmark-tracker.mjs) expose DQC JSON records, legacy
  Landmark JSON groupings, typed relationships, revision history and generated
  `TRACKER.json`. Progress can span several documentation stages. An aggregate
  marked `complete` means every item is assessed, not delivery completion.
- Tracker `show ID --json` returns one record and its view, although internally
  it builds the projection. Bounded output and computation cost are distinct.
- Neither inspected card schema provides a durable discussion thread or an
  update-request lifecycle. Revision checks in Tracker reject stale reads but
  do not isolate simultaneous writers; its [procedure](../../landmark-tracker/README.md)
  documents that limitation.
- In a disposable archive of this pin, Taskboard tests passed 59/59 and Tracker
  tests passed 23/23; Tracker `rebuild --check --json` reported current. Rendering
  the real Taskboard JSON refused duplicate legacy `TK-001` identities under
  different Specs. Passing fixtures do not establish full-inventory readiness.
- [Landmark architecture decision](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
  accepts a `LANDMARK.md` destination; the inspected Tracker still consumes
  legacy Landmark JSON. The website must use the owners available when activated.

## Desired Behavior

1. Browse a mixed collection of connected cards in one workspace; filter or
   group it into execution and understanding views without duplicating artifacts.
2. Open a consistent card inspector for readable contents, source revision,
   relationships, evidence, history, discussion and the actions that apply.
3. Keep Taskboard execution lanes and Tracker understanding distributions
   visible as distinct dimensions. A done Task never establishes Verified
   understanding, and a discussion comment never establishes approval.
4. Attach comments and explicit update requests to stable, correctly scoped
   artifact identities, with the revision or claim discussed. Preserve them
   across board regeneration and expose the disposition of each request.
5. Route accepted updates through the owning validated operations, then refresh
   projections. Requests, applied changes and approval evidence remain distinct.
   The board has no drag (the owner, 2026-10-06), so no visual move can
   bypass review, proof or owner gates.
6. Preserve identity across views and navigation. Shared Tasks remain one
   artifact; legacy Spec-scoped identities do not collide. Do not add progress
   numbers with different meanings or double-count related artifacts.
7. Show stale, unassessed, incomplete and conflicting information honestly.
   Coordinate browser and agent writers so simultaneous changes are not lost;
   recover a stale projection from its sources without losing discussion.
8. Offer bounded card and request retrieval for agents through the same source
   operations. Agents need not browse rendered pages. Measure retrieval size
   and latency before claiming token or performance improvement.

## Decisions And Contracts

- **The Grill Board is this board's first form.** The owner, 2026-10-04: "No
  the shared board is the grilling board. that is good to know that there was a
  spec for that." And: "Hold on, so that shared board spec is what the grilling
  board is supposed to turn into". The Grill Board and this Spec are one product
  line: this Spec is the destination and the Grill Board grows into it, not a
  second board. These answers clear `owner:shared-board-activation` and replace
  the 2026-10-02 backlog capture that excluded the board from v4.
- Existing Taskboard, Tracker, Spec, Task, DQC and Landmark owners retain their
  contracts. A shared visual shell does not require identical persisted schemas
  or a universal status. The UI may derive display metadata without adding
  forbidden fields to the existing generated Taskboard schema.
- Source and projection stay separate. Rebuilding a board must never erase
  user discussion or request state. Discussion has a durable owner, selected
  during design, rather than becoming hand-authored generated card content.
- General Markdown-to-JSON migration is unnecessary to this outcome. The
  browser consumes data and operations supplied by the appropriate owners.
- **Hosting stays local and small.** The owner, 2026-10-06: "its local for
  now. We dont need anything big, just something for me to answer
  questions." No server, framework or database is added.
- **Each comment or update request is its own file.** The owner, 2026-10-06:
  "They would probably create their own artifact each to handle. either a
  markdown or json. then they would live in a folder under the grilling
  board." This folder is the durable owner of discussion.
- **No dragging.** The owner, 2026-10-06: "No dragging. I agree." Cards are
  answered, not moved between columns.
- **The board stores only its comments.** The owner, 2026-10-06, confirming
  the recommendation as written ("your recommendation is exactly what I was
  thinking"): the board keeps only one store of its own, the comment folder.
  It reads questions from DQCs, reads approvals and decisions from the
  Taskboard and the decision records, shows the Tracker, and saves the
  owner's answers to a notepad. The Tracker is generated and stores nothing;
  Spec approvals stay on their Specs and decision confirmations on their
  decision records, so a DQC is not redefined to carry approvals.

## Open Design Choices

Settle and record each within the slice that needs it:

- Mixed-view grouping rules (the drag question is settled: no drag).
- Identity/revision references, attribution and disposition vocabulary for
  comments and update requests, and whether each file is Markdown or JSON;
  how a request reaches an agent or maintainer. Automated dispatch is not
  implied by submitting a comment. (Settled: one file each, in a folder under
  the Grill Board.)
- Source adapters, conflict handling and writer coordination shared with CLI
  agents, plus fresh-read and projection-recovery behavior.
- The current board identity/cutover and Landmark migration contracts. Recheck
  the dated gaps above rather than implementing around obsolete observations.

These are unresolved implementation choices, not new accepted architectural
policies. Resolve them within the existing owners before adding executable work.

## Non-Goals

- Task creation or implementation in this Map pass.
- A second board beside the Grill Board.
- Replacing Taskboard or Tracker sources with a new authoritative mega-board.
- Flattening execution and understanding into one lifecycle or one percentage.
- A general Wiki/dictionary website, Lexicon migration, new scheduler, automatic
  agent dispatch, GitHub Projects cutover, or mandatory third-party service.
- Changing permission, review, Human QA, main promotion or retention rules.

## Dependencies And Blockers

At activation, consume the verified seams of Generated JSON Taskboard
(S-01X), Landmark Tracker (S-001Z),
[Destination Question Cards](../S-002B-destination-question-cards/SPEC.md),
[Landmark Records](../S-002A-landmark-records/SPEC.md), and the then-current
identity and lifecycle tools. These are architectural relationships, not an
assertion that every owning Spec must reach owner closure before a bounded
browser slice can be planned. Do not add this Spec to their dependencies. No
release is assigned; this record does not add it to
[Workbench v4.0.0 Release](../S-00O-workbench-v4-0-0-release/SPEC.md).

## Vertical Implementation Slices

No Tasks are cut. The Grill Board is the delivered first slice, built outside
a claimed Task. At activation, cut the next slices from live Actuality along
the "Not yet" and "Partly" rows above, growing the Grill Board rather than
starting a new page; for example, live Taskboard and Tracker cards with their
distinct dimensions, then discussion attached to artifact identities. This
sequence is a proposal, not an assignment.

## Acceptance Criteria

- [ ] Owner can find and open connected execution and understanding cards in
  one browser workspace and switch views without losing artifact identity.
- [ ] Card contents, relationships, progress and evidence trace to their owners;
  unknowns and the distinct meanings of progress remain visible.
- [ ] A comment and an update request survive reload, regeneration and recovery;
  the owner can see the request's disposition and any resulting source change.
- [ ] Updates use source validation and existing gates; rejected, stale and
  concurrent operations leave recoverable, explicit outcomes without lost edits.
- [ ] Mixed identity, legacy Task scope, shared relationships and changing
  Landmark storage are covered without hiding or duplicating records.
- [ ] Agent retrieval is bounded and measured; no token-saving claim is made
  without a named comparison and its limits.
- [ ] A less-than-one-minute demo shows browse -> comment -> request update ->
  disposition -> refreshed card with traceable source and preserved history.

## Verification Plan

Use red/green tests at source-adapter and command boundaries, then browser
interaction checks. Fixtures cover a Task and related DQC, mixed assessments,
legacy scoped IDs, stale revisions, simultaneous browser/agent writes, rejected
transitions, record movement and a crash before projection refresh. Test request
persistence and disposition separately from applying source changes. Re-run
against a representative real inventory; fixture success alone is insufficient.
The applicable full suite and owner evaluation remain future delivery gates.

## Documentation Impact

The 2026-10-02 planning change added the Spec and a link in the Landmark
Tracker Wiki article. The 2026-10-04 remap links this Spec and the
[Grill Board procedure](../../grill-board/README.md) both ways and updates that
Wiki article.
Generic templates and runtime are unchanged because no harness behavior or
portable contract is being delivered. At implementation, maintain the existing
operation owners, add browser usage/recovery instructions and update the Wiki
with verified capability and limits. No general documentation migration is in scope.

## Append-Only Evidence And Execution Log

| Date | Event | Evidence and limits |
|---|---|---|
| 2026-10-02 | Owner requested post-v4 backlog capture | Accepted shared-board direction from this conversation; explicitly outside v4. Planned only, no Tasks, implementation or release assignment. |
| 2026-10-02 | Pinned preflight | Base f6af4c339b543988a3212b1940581157f573818d; doctor has no blocking findings. Self-drift pre receipt reports cleanUpdate=false; existing drift remains outside this planning scope. Dated source investigation and focused results are recorded above, not website verification. |
| 2026-10-02 | Planning validation | Render succeeded; doctor had no blocking findings; whole-Wiki validation returned no findings; diff whitespace check passed. Pre/post self-drift retained the same seven findings (one stale claim, five historical seed limitations, one provenance limitation), cleanUpdate=false. Manual read-back confirmed planned state, explicit v4 exclusion, no Tasks and unchanged runtime/templates/release owner. Existing unrelated drift is not repaired or claimed clean. |
| 2026-10-04 | Owner answer; remapped from the Grill Board | Owner, 2026-10-04: "No the shared board is the grilling board. that is good to know that there was a spec for that." and "Hold on, so that shared board spec is what the grilling board is supposed to turn into". `owner:shared-board-activation` cleared; v4 exclusion and future-intent-only wording removed; release unassigned. Grill Board read at 46ad9789 (tool, README, items.json: 180 items) and `node tools/test-grill-board.mjs` 16/16; Desired Behavior mapped to partly delivered or not yet. Status stays planned: no Task is cut and the Grill Board was built outside a claimed Task. Grill Board item GB-0017 withdrawn as answered here. Map only; no code. |
| 2026-10-06 | Owner answers on hosting, comments, drag and storage | Asked in chat while choosing a Spec to unblock with grilling; each answer read back as pending and confirmed by the owner the same day. Recorded under Decisions And Contracts in his words: local and small hosting, one comment or update-request file each in a folder under the Grill Board, no dragging, and the board reads DQCs, the Taskboard and decision records, shows the Tracker, saves answers to a notepad and stores only its comments. Map only; no Task is cut and no code changed. |
