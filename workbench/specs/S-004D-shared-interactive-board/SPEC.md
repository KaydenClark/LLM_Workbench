# S-004D - Workbench Dashboard

**Spec ID:** S-004D
**Status:** planned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** The owner's always-open local site to see and manage the workbench, grown from the Grill Board: Destination Tracker, Taskboard, Grilling Board, Drafts to approve and Wiki, with distinct source and progress semantics.
**Release scope:** In scope since the owner's 2026-10-04 answer; no release is assigned.
**Blockers:** none
**Latest event:** 2026-10-07: Owner confirmed the Workbench Dashboard destination (five sections, answer controls, self-contained package, Drafts to approve, always-open local service, P/V in the build); the Spec is renamed from Shared Interactive Workbench Board. Planned; nothing is delivered.
**Next gate:** Activate and cut Tasks from live Actuality with `/to-tasks`, following the proposed build order under Vertical Implementation Slices; settle the remaining open design choices as each slice needs them.

> **Citation anchors.** pre=`f6af4c339b543988a3212b1940581157f573818d` post=`f6af4c339b543988a3212b1940581157f573818d`.

## Outcome

One browser workspace lets the owner inspect and participate in Workbench
understanding and execution: browse connected cards, comment on their contents,
request corrections or updates, and see what happened to those requests.
Taskboard and Tracker share familiar card interactions and can appear together,
with execution and understanding available as different views.

Its name is the **Workbench Dashboard** (the owner, 2026-10-07): the owner's
always-open local place to see and manage LLM Workbench, in five sections:
Destination Tracker, Taskboard, Grilling Board, Drafts to approve and Wiki.
The [Lexicon](../../../LEXICON.md#workbench-dashboard) defines them; the
destination and its why are in
[the Workbench Dashboard decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md).
"Shared Interactive Workbench Board" was this Spec's earlier name. The ID and
directory slug stay, and the code and tool keep their `grill-board` names.

The [Grill Board](../../grill-board/README.md) is this board's first working
form, now its Grilling Board section, already in use: the owner answers
pending items in a local browser page and agents carry the answers into their
owners. This Spec is the destination it
grows into. It remains planned with no claimed owner or Tasks; the remaining
work is the path from the Grill Board to the outcome above.

The next confirmed board capability lets the Owner evaluate questions by
Priority and Value and filter them into an answering queue of the Owner's
choosing, with grading reasons available on demand. The first P/V proof stays
on this board and its questions.

## Why It Matters

The owner needs a familiar visual place to see the concepts and work as agents
have recorded them, follow their connections, and correct misunderstandings
without reconstructing everything in chat or adopting a Markdown-reading habit.
Structured object retrieval already exists; this capability gives the human an
interface to the same maintained records and operations. Browser presentation
need not force all underlying artifacts into one storage format.

Every part of the Dashboard is held to the owner's orchestration-tax test
and Wiki test, recorded in [the decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md): each question
or concept shown must progress the project and lower the owner's orchestration
tax, and what the owner needs summarized belongs in the Wiki.

For the P/V proof, the immediate problem is choosing what to answer among
more than 150 questions by effort and impact. Visible classifications and
filters make that judgment practical; the explanations must not distract
from the questions themselves.

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

### Priority and Value: current implementation boundary

Read on 2026-10-07 in the shared working tree based on
`42431879fab3057db9e26ae661b4e92512c281f0`, which also contains unrelated
uncommitted decision-reconciliation work. This observation is a source read,
not a clean candidate or browser delivery proof:

- `tools/grill-board.mjs` validates item fields through `ITEM_KEYS`; the
  inspected list contains no dedicated Priority, Value or grading-rationale
  fields. The current `items.json` has no such fields on its questions.
- `workbench/grill-board/index.html` filters topic, intent, scope, status and
  search, and supports a fixed Owner-selected batch. It has no P/V selectors,
  numbered grade badges or grade explanation cards.
- The existing central full-question display is the detail surface to extend.
  The answer/revision and fixed-batch behavior already exists and must be preserved.

The requirements below are Owner-confirmed; the P/V capability and its
real-board usefulness proof are **not delivered** by this documentation pass.

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

### Workbench Dashboard

Governed by [the Workbench Dashboard decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md). These are
confirmed requirements, not delivered behavior.

1. **Five sections.** Destination Tracker (Landmarks and Destination Question
   Cards), Taskboard (Specs and Tasks), Grilling Board (the questions to
   answer, with P/V), Drafts to approve (current text against proposed
   wording) and Wiki (controls, decision records, Wiki pages, glossary and
   skills). Architecture, Destination and Consequential Decision Records live
   in the Wiki section, and every question that uses one links to it.
2. **Answer controls.** The buttons are Confirm, Rework wording, Change the
   why and Change, with the meanings the
   [Lexicon](../../../LEXICON.md#workbench-dashboard) records.
   - Every option except confirming the recommended answer requires a typed
     note before it can be selected.
   - There is no Not now and no Decline. An unanswered question stays
     unanswered; to drop something, the owner uses Change.
   - Change the why answers collect in a filterable **Whys** list, and the
     agent fixes the rationale in the owning decision record.
   - Where the set does not fit, buttons adapt: a question with alternatives,
     especially a first-round question with no decision yet to confirm, may
     offer Recommended answer, A, B, C and D; artifacts and other deliverables
     get fitting buttons too. The recommended alternative is preselected and
     Confirm confirms the selected one.
   - On a Spec delivery approval, Confirm approves, and the other answers send
     it back with the note.
   - The owner answers when ready and skips the rest; in chat the owner then
     tells an agent to pick up the answered ones and update the site.
3. **One connected package.** Context is not duplicated into every question;
   what a question needs is linked and readable inside the site.
   Recommendations state the actual choice in plain words, titles first and
   IDs second. Every term, ID and link resolves to a page, or to a labeled
   carried excerpt with provenance when the source is a private note. Material
   is labeled accepted, proposed, current, dated snapshot or carried excerpt,
   and a conflict that affects an answer is explained. Hover definitions,
   global search and backlinks ("questions/pages that link here") connect it.
4. **Drafts to approve.** Show the exact current and proposed wording per
   file, each change tagged with the question that owns it. Approval binds to
   that exact wording, and the applying agent lands those exact words.
5. **Always open.** A macOS login service keeps the Dashboard served at
   `http://127.0.0.1:4646/` from `/Users/kayden/LLM_Workbench`, starting at
   login and restarting after a crash. It stays local-only.

### Priority and Value for answering questions

This is a bounded addition to the existing Grill Board, governed by
[DDR-001L — Priority and Value help the Owner choose Grill Board questions](../../docs/ddr/proposed/001L-priority-and-value-help-the-owner-choose-grill-board-questions.md).
The [Lexicon](../../../LEXICON.md#priority-and-value) owns the unchanged
CIC labels and meanings. Apply them as follows:

1. Each board question carries its own Priority and Value, with a reason for
   each. Priority guides when to attend to the question. Value measures the
   governed capability or change's return versus investment, not the time
   spent discussing or approving the question. Never combine P and V into a score.
2. Display numbered red P and amber V badges on the right of each question
   card. Clicking either opens a small card explaining why its particular
   grade was assigned. Keep these details closed until requested so the
   question remains prominent.
3. Clicking a question opens all of its information in the central window,
   including P/V and both explanations. Preserve original question text,
   proposal, sources, corrections, answer history and the existing answer controls.
4. Add independent P and V filters. P alone includes all Values in that
   Priority; V alone includes all Priorities in that Value; both together
   select their intersection, including P1V2 and P3V1. Combine them with the
   board's existing question filters and Owner-selected fixed-batch behavior.
   Explicit selection of a slice does not change its grades or inject
   unrelated questions. Decision-group navigation must keep matching member
   questions reachable without inventing one aggregate P/V score for a group.
5. Agents assign grades with source-backed reasons. After the Owner answers,
   reconsider P/V when updating question cards from those answers; change a
   grade only when its basis warrants it. The Owner can direct corrections.
   Use validated board operations and preserve question identity, source
   lineage, revision history and saved answers; agents never write `answers.json`.
6. Prove this on the real Grill Board inventory first. DQC P/V, a separate
   automatic recommended-batch feature and a generalized ongoing maintenance
   system are outside this slice. P/V supplies guidance; the Owner chooses the queue.

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
- **P/V is a confirmed board destination, not delivered behavior.** DDR-001L
  records the Owner's 2026-10-07 readbacks and CIC source lineage. Its first
  proof uses existing board questions; it does not change any DQC owner or
  establish CIC authority to override a project's classifications.
- **The Workbench Dashboard.** The owner, 2026-10-07: "this larger product
  site should be called "Workbench Dashboard" [...] right now we need to
  create the projection surface for me to see everything and make smart
  choices from on the LLM_Workbench. [...] the site shouldnt close, and I
  shouldnt need to start a chat to get it open." On sections: "The sections
  would probably be Destination Tracker, Taskboard, Grilling board, Drafts to
  approve, Wiki. that would be at least enough for me to know what was
  missing." The rename keeps the ID `S-004D` and the slug
  `shared-interactive-board`, a reversible agent choice to avoid link churn.
- **Answer controls.** The owner, 2026-10-07: "change what the buttons say to
  "confirm" "rework wording" "change the why" and "change". Confirm means its
  confirmed. [...] The rest need me to have typed something in the box before
  I can select them, this is because my notes are required for context." And:
  "we dont need a not now because that is the point of making this. a website.
  if I dont want to answer it right now. I dont and move on." And: ""recommended
  answer" "A" "B" "C" "D" are also acceptable, especially for a first round
  question where we have not established a decision to confirm. Same goes for
  Artifacts and other things we deliver. We can be smart about what we put in
  the buttons." Agent-proposed and owner-confirmed: the preselected
  recommended alternative, and Confirm or send-back on a Spec delivery approval.
- **The package, Drafts to approve and always open** are agent plan items the
  owner confirmed on 2026-10-07. The always-open service is a requirement
  only; it is not installed. It is consistent with local and small hosting.
- **P/V is part of the Workbench Dashboard build** (the owner, 2026-10-07:
  "6. confirmed"). DQC P/V stays out, and DDR-001L stays proposed.
- **Producer room first.** The Dashboard is an LLM Workbench producer-room
  capability; rolling it out to every workbench and running the Workbench
  from it are future goals recorded in the decision, not this Spec's scope.

## Decision-centered reconciliation — 2026-10-06

The owner requested a board organized by consequential decisions: every question
has an ADR, DDR or residual CDR home, so one underlying rationale guides related
questions and later issues without repeated owner orchestration. The existing
local board remains the surface; this does not activate the unfinished discussion,
Taskboard/Tracker or dispatch capabilities.

This local slice preserves 181 original question records and adds nine grouped
rationale prompts. Its complete navigation map has 64 primary record homes:
32 ADRs, 28 DDRs and four CDRs. Prior decisions remain accepted or proposed as
recorded. One CDR preserves the owner's new decision-reuse direction; three
other CDRs are agent-proposed policies. Specific delivery approvals retain their
identities and content-bound gates. The original question view and fixed batches
remain available, and agent operations never write the owner's answer file.

Verification and the exact branch candidate are recorded in the appended evidence;
this slice does not close the planned Spec or establish owner Human QA.

## Open Design Choices

Settle and record each within the slice that needs it:

- Mixed-view grouping rules (the drag question is settled: no drag).
- Identity/revision references, attribution and disposition vocabulary for
  comments and update requests, and whether each file is Markdown or JSON;
  how a request reaches an agent or maintainer. Automated dispatch is not
  implied by submitting a comment. (Settled: one file each, in a folder under
  the Grill Board.)
- Any remote access beyond the local always-open service. Hosting stays local
  for now; nothing remote is selected.
- Source adapters, conflict handling and writer coordination shared with CLI
  agents, plus fresh-read and projection-recovery behavior.
- The current board identity/cutover and Landmark migration contracts. Recheck
  the dated gaps above rather than implementing around obsolete observations.

These are unresolved implementation choices, not new accepted architectural
policies. Resolve them within the existing owners before adding executable work.

## Non-Goals

- Task creation or implementation in this Map pass.
- DQC P/V, automatic recommended batches, a summed grading score or a new
  periodic maintenance system in the first Grill Board P/V proof.
- A second board beside the Grill Board.
- Replacing Taskboard or Tracker sources with a new authoritative mega-board.
- Flattening execution and understanding into one lifecycle or one percentage.
- Rolling the Dashboard out to every workbench, or running the Workbench from
  it: future goals, not this Spec's scope. Generic templates do not change.
- A second Wiki, dictionary or glossary store: the Wiki section reads the
  existing owners. Also out: Lexicon migration, a new scheduler, automatic
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

The bounded P/V proof consumes the existing local board, question inventory,
validated item operations, answer ownership and fixed-batch interaction. It
does not wait on DQC P/V, live Taskboard/Tracker integration, a hosting change
or the unfinished discussion/dispatch capabilities. No P/V concept blocker
remains after the Owner's final confirmation; record new implementation
findings against this slice instead of silently extending its scope.

## Vertical Implementation Slices

No Tasks are cut. The Grill Board is the delivered first slice, built outside
a claimed Task. At activation, cut the next slices from live Actuality along
the "Not yet" and "Partly" rows above, growing the Grill Board rather than
starting a new page; for example, live Taskboard and Tracker cards with their
distinct dimensions, then discussion attached to artifact identities. This
sequence is a proposal, not an assignment.

For the next bounded proof, start with question-level P/V validation and
reasoned classifications, then the existing page's filters, grade badges and
central detail, and finally the answer-to-card-update cycle against real
questions. Cut actual Tasks from the then-current source at activation;
this planning pass creates none.

Proposed Workbench Dashboard build order (agent proposal, owner-confirmed
2026-10-07; not Tasks): setup, catalog reach, glossary, decision page, wording
model, content pass, then owner-path verification, together delivering the
Workbench Dashboard requirements above. The content work takes the nine
grouped rationale prompts and their member questions first, then the rest
one decision group at a time. The P/V proof keeps the sequence in the
paragraph above.

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

### P/V proof on the Grill Board

- [ ] Every in-scope live question has valid P1–P4 and V1–V4 grades with reasons
  traceable to its question and governed capability/change. Missing grades
  remain visible as unclassified rather than receiving invented defaults.
- [ ] Numbered red P and amber V badges appear on the right of question cards;
  clicking each reveals its own rationale without replacing or answering the
  question. Opening the question centrally shows all information, P/V and reasons.
- [ ] P1V2, P3V1, P2 alone and V alone return exactly their matching questions.
  Clearing filters restores the wider inventory; other board filters still combine.
- [ ] The Owner can select a fixed answering batch from a P/V-filtered slice,
  inspect details, answer, pause/resume and reload without lost drafts,
  changed batch membership, missing history or double-counted questions.
- [ ] Grade updates through validated operations retain stable identity and
  revision/history behavior. Invalid classifications and stale updates are
  refused without losing prior data; agent operations never write Owner answers.
- [ ] A demonstrated answer-to-card-update cycle shows the agent assessing
  whether each affected grade's basis changed, retaining grades when it did
  not and recording justified revisions when it did. No periodic DQC work is needed.
- [ ] Browser checks on a disposable copy of the real inventory show the
  Owner's P3V1 -> grade explanation -> central question -> answer -> card-update
  scenario. Record exact source/candidate, matched question identities and
  results; technical tests alone do not establish Owner usefulness or Human QA.

### Workbench Dashboard proof

- [ ] The five sections open from one site, each reading its existing owners;
  every question that uses a decision record links to it in the Wiki section.
- [ ] The answer controls are Confirm, Rework wording, Change the why and
  Change; every answer except confirming the recommended one is refused until
  a note is typed; there is no Not now or Decline; Change the why answers
  appear in a filterable Whys list.
- [ ] A question with alternatives preselects the recommended one and Confirm
  confirms the selection; a Spec delivery approval is approved by Confirm and
  sent back with the note otherwise.
- [ ] Every term, ID and link on a sampled question path resolves to a page or
  a labeled carried excerpt with provenance; labels and answer-affecting
  conflicts are shown; hover definitions, search and backlinks work.
- [ ] Drafts to approve shows exact current and proposed wording per file,
  tagged with its owning question, and an applied approval lands exactly the
  approved words.
- [ ] After login, and after the server process is killed, the Dashboard is
  served at `http://127.0.0.1:4646/` without a chat starting it, and only on
  the local address.
- [ ] Owner-path verification on the real inventory shows the owner can
  understand and answer the nine grouped rationale prompts without asking in
  chat where things are; technical tests alone do not establish Human QA.

## Verification Plan

Use red/green tests at source-adapter and command boundaries, then browser
interaction checks. Fixtures cover a Task and related DQC, mixed assessments,
legacy scoped IDs, stale revisions, simultaneous browser/agent writes, rejected
transitions, record movement and a crash before projection refresh. Test request
persistence and disposition separately from applying source changes. Re-run
against a representative real inventory; fixture success alone is insufficient.
The applicable full suite and owner evaluation remain future delivery gates.

For P/V, confirm failing tests before implementation at the item-validation
and filter-intersection seams, then prove the listed exact matches, independent
filters, legacy unclassified records and revision-safe grade updates. Exercise
both original-question and decision-group navigation. Browser checks cover
badge popovers, central detail, draft preservation and the fixed queue using
a disposable copy of the real board; never submit fixture answers to the
Owner's live `answers.json`. Read grading reasons for semantic fidelity to the
Lexicon and sources: valid labels alone do not prove a correct assessment.

For the Workbench Dashboard, confirm failing tests first at the answer-
validation seam (note required, no Decline, preselected alternative), the link
and term resolution seam and the Drafts to approve wording seam. Browser
checks use a disposable copy of the real inventory; never write the owner's
live `answers.json`. Check the login service by its own status and a restart,
not by a chat-started `serve`.

## Documentation Impact

The 2026-10-02 planning change added the Spec and a link in the Landmark
Tracker Wiki article. The 2026-10-04 remap links this Spec and the
[Grill Board procedure](../../grill-board/README.md) both ways and updates that
Wiki article.
Those planning changes left generic templates and runtime unchanged. The
2026-10-07 local reconciliation adds optional CDR lifecycle support, the
generic Lexicon definitions, the decision-reuse procedure and this Wiki
synthesis. Further implementation must maintain the existing
operation owners, add browser usage/recovery instructions and update the Wiki
with verified capability and limits. No general documentation migration is in scope.

The 2026-10-07 P/V planning pass adds the shared definitions to root and generic
Lexicons, the Owner-confirmed DDR-001L with CIC source lineage, one promised
outcome to this project's Blueprint, and a planned-capability pointer in the
Grill Board README. This Spec owns the detailed requirements and proof above.
Generic templates receive the definitions; the project-specific board promise
and interface do not belong in the generic Blueprint template. No runtime,
question inventory, Owner answer file, DQC, Task or release assignment changes
are part of this documentation/specification endpoint.

On this branch, the P/V carry brought the decision record, the root Lexicon
section, the README pointer and the requirements above. The shared checkout's
Blueprint promised-outcome line and generic Lexicon template section were not
carried. Until they land, DDR-001L's "The Blueprint carries the promised
outcome" is not yet true on this branch.

The 2026-10-07 Workbench Dashboard promotion adds
[the Workbench Dashboard decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md),
the Dashboard terms and answer words in the root Lexicon, a destination pointer
in the Grill Board README, this Spec's rename and requirements, and the
catalog row. Generic templates are unchanged: the Dashboard is a producer-room
capability until the rollout goal is taken up. The Blueprint is unchanged, for the
reason the decision gives. Wiki pages still link this Spec under its earlier name.

## Append-Only Evidence And Execution Log

| Date | Event | Evidence and limits |
|---|---|---|
| 2026-10-02 | Owner requested post-v4 backlog capture | Accepted shared-board direction from this conversation; explicitly outside v4. Planned only, no Tasks, implementation or release assignment. |
| 2026-10-02 | Pinned preflight | Base f6af4c339b543988a3212b1940581157f573818d; doctor has no blocking findings. Self-drift pre receipt reports cleanUpdate=false; existing drift remains outside this planning scope. Dated source investigation and focused results are recorded above, not website verification. |
| 2026-10-02 | Planning validation | Render succeeded; doctor had no blocking findings; whole-Wiki validation returned no findings; diff whitespace check passed. Pre/post self-drift retained the same seven findings (one stale claim, five historical seed limitations, one provenance limitation), cleanUpdate=false. Manual read-back confirmed planned state, explicit v4 exclusion, no Tasks and unchanged runtime/templates/release owner. Existing unrelated drift is not repaired or claimed clean. |
| 2026-10-04 | Owner answer; remapped from the Grill Board | Owner, 2026-10-04: "No the shared board is the grilling board. that is good to know that there was a spec for that." and "Hold on, so that shared board spec is what the grilling board is supposed to turn into". `owner:shared-board-activation` cleared; v4 exclusion and future-intent-only wording removed; release unassigned. Grill Board read at 46ad9789 (tool, README, items.json: 180 items) and `node tools/test-grill-board.mjs` 16/16; Desired Behavior mapped to partly delivered or not yet. Status stays planned: no Task is cut and the Grill Board was built outside a claimed Task. Grill Board item GB-0017 withdrawn as answered here. Map only; no code. |
| 2026-10-06 | Owner answers on hosting, comments, drag and storage | Asked in chat while choosing a Spec to unblock with grilling; each answer read back as pending and confirmed by the owner the same day. Recorded under Decisions And Contracts in his words: local and small hosting, one comment or update-request file each in a folder under the Grill Board, no dragging, and the board reads DQCs, the Taskboard and decision records, shows the Tracker, saves answers to a notepad and stores only its comments. Map only; no Task is cut and no code changed. |
| 2026-10-07 | Local consequential-decision reconciliation and verification | Owner direction of 2026-10-06; implementation candidate 2e30115e1de3e8351fb01ba8a68c48dd79ea9f27 on codex/consequential-decision-board, pinned base 9b524db33ac00aad96d2faae51348c0b98719c92. Preserved all 181 original item objects and the unchanged owner answer-file hash; mapped 190 total items to 64 ADR/DDR/CDR homes with nine rationale prompts. CDR-000A accepted from direct owner direction; CDR-000B/C/D remain proposed. [Verification receipt](decision-reconciliation-verification-2026-10-07.json) records all 53 Runbook commands eventually passing, the first failures and repairs, final affected checks (ADR 58, board 19, layout 76, upgrade 8), disposable browser answer/navigation checks and complete pre/post room findings. Shared-checkout fast rubric fails on the pre-existing AGENTS draft; fixture initialization refuses its uncommitted source. Isolated candidate passes. Fifteen room findings are unchanged and cleanUpdate=false. Local installation only: no push, merge, Spec closure, owner Human QA or blanket member approval. |
| 2026-10-07 | Final live-copy verification limit | The live board suite passes 19/19 with localhost socket permission (restricted attempt: listen EPERM). After copying the new durable verification receipt into the still-uncommitted shared checkout, self-drift reports its original 15 findings unchanged plus one untracked-controls finding for that receipt; cleanUpdate remains false. The complete receipt is committed in the isolated source candidate. This is a local working-tree installation, not a clean update or publication. |
| 2026-10-07 | P/V concept confirmed; documentation/specification | Owner confirmed the final Question / Answer / Why / Impact readback and invoked `to-docs` and `to-spec`. [DDR-001L](../../docs/ddr/proposed/001L-priority-and-value-help-the-owner-choose-grill-board-questions.md) records the confirmed board-only scope and source map at CIC commit af9296e31bb15f11aaf84fa04e01b7e6a7524eea. Current source inspected in the dirty shared tree based on 42431879fab3057db9e26ae661b4e92512c281f0 has no P/V fields or filters. Requirements, unchecked acceptance and future board proof added to this existing planned Spec; no Task, implementation, answer application or Owner Human QA claimed. Pre-edit fast evaluator already fails at 69.8 against the required 90 on the existing AGENTS draft; unrelated state is preserved. |
| 2026-10-07 | P/V planning verification and limits | [Planning verification receipt](priority-value-planning-verification-2026-10-07.json) preserves results for all 53 Runbook commands: first run 21 pass / 32 fail. Existing AGENTS draft/control assertions and uncommitted-source identity checks prevent a full-suite pass; the board's initial localhost EPERM is separately resolved by a socket-enabled rerun, 19/19 pass, leaving 31 failed commands recorded. Exact CIC table fidelity in both Lexicons, ten added local links/anchors, DDR validation, render and diff whitespace checks pass; prior S-004D evidence is preserved byte-for-byte. Pre/post self-drift retains the same 16 code/artifact pairs and cleanUpdate=false; the final doctor exposes those 16 findings, including untracked planning receipts. Confirmed DDR content remains proposed lifecycle in this dirty tree. No executable P/V behavior or real-board usefulness proof is claimed. |
| 2026-10-07 | Workbench Dashboard decisions promoted; Spec renamed | Owner confirmed the consolidated readback ("All confirmed") after confirming the button and name answers and items 1-3, 6, 8 and 9. Branch claude/workbench-dashboard from f582526d768cca558b7c99e88f25daefb876eb2a (on integration d0fb161c1ff36caf936758b7492f7ef7fce8176e). Carried the P/V documentation from the shared checkout, merging the Spec hunks so the 2026-10-06 answers and no-drag text survive; DDR-001L stays proposed with unchanged content. Added and accepted [the Workbench Dashboard decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md); Lexicon terms, README pointer, requirements, unchecked acceptance and a proposed build order recorded here. Map only: no Task, code, board item, `answers.json` write or login-service install; Status stays planned. Verification is recorded in the next row. |
