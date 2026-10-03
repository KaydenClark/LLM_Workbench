# S-004D - Shared Interactive Workbench Board

**Spec ID:** S-004D
**Status:** planned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Post-v4 browser workspace for connected Taskboard and Tracker cards, discussion and update requests, preserving their distinct source and progress semantics.
**Release scope:** Post-v4 backlog; excluded from v4 requirements, acceptance and release gates. No later release is assigned.
**Blockers:** owner:shared-board-activation
**Latest event:** Owner requested backlog capture of the shared-board concept, explicitly outside v4.
**Next gate:** Owner chooses a post-v4 planning window; resolve the open design choices against live sources before activation and Task cutting.

> **Citation anchors.** pre=`f6af4c339b543988a3212b1940581157f573818d` post=`f6af4c339b543988a3212b1940581157f573818d`.

## Outcome

One browser workspace lets the owner inspect and participate in Workbench
understanding and execution: browse connected cards, comment on their contents,
request corrections or updates, and see what happened to those requests.
Taskboard and Tracker share familiar card interactions and can appear together,
with execution and understanding available as different views.

This record captures future capability intent only. It remains planned with no
claimed owner or Tasks. It adds no dependency to the v4 release and authorizes
no website implementation, deployment or changes to existing board semantics.

## Why It Matters

The owner needs a familiar visual place to see the concepts and work as agents
have recorded them, follow their connections, and correct misunderstandings
without reconstructing everything in chat or adopting a Markdown-reading habit.
Structured object retrieval already exists; this capability gives the human an
interface to the same maintained records and operations. Browser presentation
need not force all underlying artifacts into one storage format.

## Current Verified State

These are dated observations at `f6af4c339b543988a3212b1940581157f573818d`,
not promises about the eventual activation baseline:

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
   A visual move is interpreted according to the artifact's actual transition
   rules; dragging cannot bypass review, proof or owner gates.
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

- Owner accepted capturing the shared-board concept and explicitly excluded it
  from v4 on 2026-10-02. Backlog capture is the authorized endpoint.
- Existing Taskboard, Tracker, Spec, Task, DQC and Landmark owners retain their
  contracts. A shared visual shell does not require identical persisted schemas
  or a universal status. The UI may derive display metadata without adding
  forbidden fields to the existing generated Taskboard schema.
- Source and projection stay separate. Rebuilding a board must never erase
  user discussion or request state. Discussion has a durable owner, selected
  during design, rather than becoming hand-authored generated card content.
- General Markdown-to-JSON migration is unnecessary to this outcome. The
  browser consumes data and operations supplied by the appropriate owners.

## Open Design Choices And Activation Gate

The `owner:shared-board-activation` blocker remains until the owner chooses to
activate this post-v4 capability. Before activation, settle and record:

- The first deployable slice and hosting/access boundary: local-only versus a
  remotely accessible self-hosted service. No framework or database is selected.
- Mixed-view grouping and interaction rules, especially the meaning of a drag
  for cards with fractional understanding progress.
- The durable owner, identity/revision references, attribution and disposition
  vocabulary for comments and update requests; how a request reaches an agent
  or maintainer. Automated dispatch is not implied by submitting a comment.
- Source adapters, conflict handling and writer coordination shared with CLI
  agents, plus fresh-read and projection-recovery behavior.
- The current board identity/cutover and Landmark migration contracts. Recheck
  the dated gaps above rather than implementing around obsolete observations.

These are unresolved implementation choices, not new accepted architectural
policies. Resolve them within the existing owners before adding executable work.

## Non-Goals

- Any v4 work, v4 release gate, activation, Task creation or implementation now.
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
browser slice can be planned. Do not add this Spec to their dependencies or
to [Workbench v4.0.0 Release](../S-00O-workbench-v4-0-0-release/SPEC.md).

## Vertical Implementation Slices

No Tasks are cut. At owner-authorized activation, plan the smallest useful
vertical slice from live Actuality. A read-only mixed-card browser is a candidate
first slice; durable discussion and validated updates follow only through
explicitly scoped Tasks. This sequence is a proposal, not an assignment.

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

This planning change adds the Spec and a future-work link in the existing
Landmark Tracker Wiki article, then regenerates catalog/board projections.
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
