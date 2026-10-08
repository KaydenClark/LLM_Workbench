# S-004D - Workbench Dashboard

**Spec ID:** S-004D
**Status:** active
**Priority:** 2
**Owner:** claude-dashboard-director
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** The owner's local Dashboard: Destination Tracker, Taskboard, Grilling Board, Drafts to approve and Wiki, with progressive grilling, exact wording approvals and explicit promotion handoffs.
**Release scope:** In scope since the owner's 2026-10-04 answer; no release is assigned.
**Blockers:** none
**Latest event:** TK-007M closed with proof.
**Next gate:** Complete TK-007N.

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
The destination and its why are in
[the Workbench Dashboard decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md).
"Shared Interactive Workbench Board" was this Spec's earlier name. The ID and
directory slug stay, and the code and tool keep their `grill-board` names.

The [Grill Board](../../grill-board/README.md) is this board's first working
form, now its Grilling Board section, already in use: the owner answers
pending items in a local browser page and agents carry the answers into their
owners. This Spec is the destination it grows into. The four P/V Tasks cut on
2026-10-07 keep their slices; TK-007T, TK-007X and TK-007Y, added on
2026-10-08 from live integration `47215ff10de711bf110c31f5a3f6ea2cf733b5e7`,
cover the rest of the authorized Dashboard outcome.

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

Re-read when this record was carried onto
`d9a353590644f957ae24636d13ce9a41ef1987e9` (clean integration): `ITEM_KEYS`
and the 180 items in `items.json` still carry no P/V or grading-rationale
fields, and `index.html` still has no P/V selectors, badges or explanation cards.

Re-read at activation on integration
`9edbed8a585a99a52368c3c09aa7eb91def6b7ef` (Plan stage): `ITEM_KEYS` still
lists no P/V or rationale field and `validateItem` refuses any unknown field;
`items.json` holds 180 items (171 `open`, 9 `withdrawn`; all 35 `confirm-dqc`
items open) with no P/V; `index.html` slices by topic, intent, scale,
workflow stage and search, groups navigation only by topic (`TOPICS`), and
freezes fixed batches in local storage, with no P/V badge, selector or
explanation card. Its page logic is tested by loading the inline script into
a VM (`sliceModel()` in `tools/test-grill-board.mjs`).

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
   wording) and Wiki (the root files, decision records, Wiki pages, glossary and
   skills). Architecture, Destination and Consequential Decision Records live
   in the Wiki section, and every question that uses one links to it.
2. **Answer controls.** The buttons are Confirm, Rework wording, Change the
   why and Change, with the owner's meanings recorded under
   Decisions And Contracts below.
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

### Confirmed Dashboard behavior — 2026-10-08

Kayden's 2026-10-08 assignment of this first pass to a Claude director run
restates the confirmed behavior below; it adds no new choice.

- The five sections read existing native sources with source-qualified Task
  identities, separate execution lanes and understanding distributions, current
  source hashes, evidence, history and readable linked documents. The reader
  reads `GLOSSARY.md` and `ARCHITECTURE.md` when they reach this baseline,
  without taking over the Lexicon retirement that delivers them.
- Show actual proposed artifact drafts beside current text, following
  [Draft → Critique → Revise → Confirm](../../../RUNBOOK.md#draft--critique--revise--confirm),
  with critique and revision repeatable as needed. That workflow does not
  settle the taxonomy of workflows within Explore. A comment, Change or request
  for revised wording or rationale never approves content. Typed context is
  required for requests; unanswered questions remain open.
- Preserve exactly what the owner confirmed: item identity and revision,
  question, current context, proposed wording, full draft when available,
  source lineage, note, time and SHA-256. Stale browser actions and stale
  approvals cannot overwrite or promote newer content.
- The owner answers progressively over as many grilling rounds as needed,
  requests question revisions through Change and confirms one concept at a
  time. Ending a round starts no agent. The owner separately starts promotion
  for selected confirmed cards or one confirmed card; unconfirmed cards stay in
  grilling.
- Promotion creates a recoverable director handoff with visible ordered
  Record → Publish → Map → Publish → Plan → Publish receipts, evidence and
  resulting native source links. Existing promotion and review procedures do
  the work; no dispatch service is implied. A knowledge-only Map or Plan
  records its existing owner and reason rather than inventing Specs or Tasks.
  A handoff request, publication, mapped work, a task plan and implementation
  are distinct displayed states.
- The producer-room Dashboard stays local and available independently of a
  chat, with startup, restart and explicit service instructions. Disposable
  browser data is isolated from owner answers; no actual owner decision is
  executed for verification.

### Priority and Value for answering questions

This is a bounded addition to the existing Grill Board, governed by
[DDR-001L — Priority and Value help the Owner choose Grill Board questions](../../docs/ddr/001L-priority-and-value-help-the-owner-choose-grill-board-questions.md).
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
  The answer words carry the owner's meanings, carried verbatim from the
  2026-10-07 promotion on `claude/workbench-dashboard` (35a27351), whose
  Lexicon home this run does not add: Confirm is the Confirm verb, it is
  confirmed and nothing needs changing; on a question with alternatives it
  confirms the selected one. The other three:

  | Answer | Meaning |
  |---|---|
  | **Rework wording** | Mostly correct; it needs to be restated better. |
  | **Change the why** | Something about it is correct, but the underlying reason or cause is wrong. |
  | **Change** | It needs changing, including dropping it. The owner chose Change over Correct: "to me correct means I am telling you its good to go". |

- **The package, Drafts to approve and always open** are agent plan items the
  owner confirmed on 2026-10-07. It is consistent with local and small
  hosting. Observed 2026-10-08 (read only): a login service labelled
  `com.kayden.workbench-dashboard`, installed on 2026-10-07 outside this
  repository's tooling, already serves the owner's primary checkout on
  127.0.0.1:4646; replacing it with the generated configuration is the
  owner's choice.
- **P/V is part of the Workbench Dashboard build** (the owner, 2026-10-07:
  "6. confirmed"). DQC P/V stays out.
- **Producer room first.** The Dashboard is an LLM Workbench producer-room
  capability; rolling it out to every workbench and running the Workbench
  from it are future goals recorded in the decision, not this Spec's scope.
- **Glossary routing (2026-10-08).** Kayden directed: "no more lexicon.md we
  replaced it with glossary.md, see the domain modeling skill rework." This
  run therefore adds no Lexicon entries. The Dashboard terms and answer words
  are recorded in this Spec, and the Draft, Critique and Revise verbs in the
  [Runbook](../../../RUNBOOK.md#draft--critique--revise--confirm), until the
  established Glossary from the Lexicon retirement (PR #431) reaches this
  baseline; the Dashboard reads either route.

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

- Automatic agent activation after answering or confirming, a dispatch
  service, remote hosting, new credentials and unrelated implementation.
- DQC P/V, automatic recommended batches, a summed grading score or a new
  periodic maintenance system in the first Grill Board P/V proof.
- A second board beside the Grill Board.
- Replacing Taskboard or Tracker sources with a new authoritative mega-board.
- Flattening execution and understanding into one lifecycle or one percentage.
- Rolling the Dashboard out to every workbench, or running the Workbench from
  it: future goals, not this Spec's scope. Generic templates carry no
  Dashboard behavior; they gain only the Runbook's Draft → Critique → Revise →
  Confirm workflow.
- A second Wiki, dictionary or glossary store: the Wiki section reads the
  existing owners. Also out: the Lexicon retirement itself, a new scheduler,
  GitHub Projects cutover, or a mandatory third-party service.
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

Coordination, not a Task blocker: the unpublished
`codex/consequential-decision-board` lane (local Codex worktree, commit
`724a5d52`, no upstream at planning) changes the same `tools/grill-board.mjs`,
`items.json`, `index.html`, Grill Board README and this Spec, adding
decision-record `decisions` groups and further items. Whichever of that lane
and a P/V Task lands second reconciles onto the other on fresh integration;
TK-007N grades the inventory present when it runs, and TK-007M applies its
group rule to decision-record groups if they have landed.

Coordination recorded 2026-10-08 by the director run, none of them a Task
blocker:

- **Lexicon retirement, PR #431** (`claude/s004o-lexicon-retirement`, head
  `03abc895`, draft) delivers `GLOSSARY.md` and `ARCHITECTURE.md`. The
  Dashboard reads them when present and the existing Lexicon route until then;
  this run neither takes over nor waits on that migration.
- **Domain-modeling corrections, PR #425** (`claude/s004j-corrections`) is a
  separate lane and not a Dashboard dependency.
- **Consequential-decision grouping** (`codex/consequential-decision-board`,
  local commit `724a5d52`, still unpublished) holds the nine grouped rationale
  prompts, including the administrative-reconciliation question whose
  pointer-only recommendation the 2026-10-07 self-contained-package handoff
  reported. That content is not on integration, so this run cannot repair it;
  whichever of that lane and this one lands second reconciles onto the other.

## Vertical Implementation Slices

Task records live under `tasks/`. The Grill Board is the delivered first
slice, built outside a claimed Task.

The bounded P/V proof was cut on 2026-10-07 from integration `9edbed8a`. The
layers each Task crosses are the item schema and validator and the grade
operation in `tools/grill-board.mjs`, `items.json`, the page
`workbench/grill-board/index.html`, the Grill Board README procedure and
`tools/test-grill-board.mjs`. Order:

1. TK-007L, the tracer bullet: an agent grades one question through a
   validated grade operation; the Owner sees red P / amber V badges, opens
   each reason, and sees P, V and both reasons in the central view
   (acceptance: badges and central detail; the operation half of validated
   grade updates; unclassified stays visible).
2. Then in parallel: TK-007M, independent P and V filters combined with the
   existing filters, topic navigation and fixed batches (acceptance: exact
   P/V slices; fixed batch from a P/V slice); and TK-007N, reasoned grades on
   every open board question through the grade operation (acceptance: every
   in-scope live question graded).
3. TK-007O, after both: the answer-to-card-update reassessment procedure and
   the real-inventory P3V1 Owner scenario on a disposable copy (acceptance:
   the demonstrated cycle; the browser scenario receipt).

The wider Workbench Dashboard was cut on 2026-10-08 from integration
`47215ff1` into three further Tasks, beside the P/V Tasks above:

4. TK-007T: the five sections reading native sources, Drafts to approve,
   decision-record links into the Wiki section, glossary, backlinks and search.
5. TK-007X: the answer controls and Whys list, Change and agent revision,
   exact approval snapshots, repeated rounds and explicit promotion handoffs
   with visible dispositions.
6. TK-007Y, after TK-007T and TK-007X: the always-open local service and the
   disposable-copy demonstration of the complete owner flow.

Director run writer map (2026-10-08). The director is the single writer of
this Spec, its Task records, the catalog, `TASKBOARD.md` and the decision
records. Lanes branch from the assembly commit `eb7719c7` on
`claude/workbench-dashboard-first-pass` and each owns distinct files: owner
interface and board core (`tools/grill-board.mjs`, `index.html`, the Grill
Board README and board tests: TK-007L, TK-007M, the TK-007T page half and
TK-007X controls); native sources (`tools/dashboard-sources.mjs`, the
Taskboard reader and its tests: the TK-007T source half); owner workflow and
service (`tools/dashboard-workflow.mjs`, `tools/dashboard-service.mjs` and
their tests: the TK-007X workflow half and TK-007Y service); and question
content (`items.json` through the `grade` operation only: TK-007N). Landing
order: lanes merge into the assembly branch, then TK-007O and TK-007Y are
demonstrated on the assembled candidate, which takes separate-context review
before its draft PR into integration.

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
- [ ] Draft → Critique → Revise → Confirm works on a card: a Change request
  with its note, an agent revision, and a fresh confirmation bound to the
  revised wording; a comment or Change never counts as approval.
- [ ] The owner explicitly starts promotion for one confirmed card or for
  selected confirmed cards; answering, confirming or ending a round starts no
  agent; unconfirmed, stale or Change-pending cards are refused.
- [ ] Each promotion shows ordered Record → Publish → Map → Publish → Plan →
  Publish receipts with evidence and native source links; a knowledge-only
  decision shows its no-op reason and gains no Spec or Task.

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
Those planning changes left generic templates and runtime unchanged because no
harness behavior or portable contract was delivered. At implementation, maintain the existing
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

The 2026-10-07 Plan pass adds the four Task records and updates this Spec's
header, current-state re-read, dependencies and slice order. It changes no
runtime, page, inventory, README, Lexicon, template or answer file; each Task
names the README and test changes its delivery owns.

The 2026-10-08 director run carries the accepted
[Workbench Dashboard decision](../../docs/ddr/001O-the-workbench-dashboard-is-the-owner-s-always-open-place-to-see-and-manage-the-workbench.md)
from `claude/workbench-dashboard` (35a27351) with one routing correction: its
Consequences named the Lexicon as the home of the Dashboard terms, which
Kayden's Glossary direction withdrew, so the record now names this Spec until
the Glossary lands. It also carries this Spec's rename and Dashboard
requirements, the catalog row and the Runbook's Draft → Critique → Revise →
Confirm workflow with its focused check. The Grill Board README owns the
browser procedure; generic templates gain only the Runbook workflow, because
the Dashboard is a producer-room capability until the rollout goal is taken up.
The Blueprint is unchanged, for the reason the decision gives.

## Append-Only Evidence And Execution Log

| Date | Event | Evidence and limits |
|---|---|---|
| 2026-10-02 | Owner requested post-v4 backlog capture | Accepted shared-board direction from this conversation; explicitly outside v4. Planned only, no Tasks, implementation or release assignment. |
| 2026-10-02 | Pinned preflight | Base f6af4c339b543988a3212b1940581157f573818d; doctor has no blocking findings. Self-drift pre receipt reports cleanUpdate=false; existing drift remains outside this planning scope. Dated source investigation and focused results are recorded above, not website verification. |
| 2026-10-02 | Planning validation | Render succeeded; doctor had no blocking findings; whole-Wiki validation returned no findings; diff whitespace check passed. Pre/post self-drift retained the same seven findings (one stale claim, five historical seed limitations, one provenance limitation), cleanUpdate=false. Manual read-back confirmed planned state, explicit v4 exclusion, no Tasks and unchanged runtime/templates/release owner. Existing unrelated drift is not repaired or claimed clean. |
| 2026-10-04 | Owner answer; remapped from the Grill Board | Owner, 2026-10-04: "No the shared board is the grilling board. that is good to know that there was a spec for that." and "Hold on, so that shared board spec is what the grilling board is supposed to turn into". `owner:shared-board-activation` cleared; v4 exclusion and future-intent-only wording removed; release unassigned. Grill Board read at 46ad9789 (tool, README, items.json: 180 items) and `node tools/test-grill-board.mjs` 16/16; Desired Behavior mapped to partly delivered or not yet. Status stays planned: no Task is cut and the Grill Board was built outside a claimed Task. Grill Board item GB-0017 withdrawn as answered here. Map only; no code. |
| 2026-10-06 | Owner answers on hosting, comments, drag and storage | Asked in chat while choosing a Spec to unblock with grilling; each answer read back as pending and confirmed by the owner the same day. Recorded under Decisions And Contracts in his words: local and small hosting, one comment or update-request file each in a folder under the Grill Board, no dragging, and the board reads DQCs, the Taskboard and decision records, shows the Tracker, saves answers to a notepad and stores only its comments. Map only; no Task is cut and no code changed. |
| 2026-10-07 | P/V concept confirmed; documentation/specification | Owner confirmed the final Question / Answer / Why / Impact readback and invoked `to-docs` and `to-spec`. [DDR-001L](../../docs/ddr/001L-priority-and-value-help-the-owner-choose-grill-board-questions.md) records the confirmed board-only scope and source map at CIC commit af9296e31bb15f11aaf84fa04e01b7e6a7524eea. Current source inspected in the dirty shared tree based on 42431879fab3057db9e26ae661b4e92512c281f0 has no P/V fields or filters. Requirements, unchecked acceptance and future board proof added to this existing planned Spec; no Task, implementation, answer application or Owner Human QA claimed. Pre-edit fast evaluator already fails at 69.8 against the required 90 on the existing AGENTS draft; unrelated state is preserved. |
| 2026-10-07 | P/V planning verification and limits | [Planning verification receipt](priority-value-planning-verification-2026-10-07.json) preserves results for all 53 Runbook commands: first run 21 pass / 32 fail. Existing AGENTS draft/control assertions and uncommitted-source identity checks prevent a full-suite pass; the board's initial localhost EPERM is separately resolved by a socket-enabled rerun, 19/19 pass, leaving 31 failed commands recorded. Exact CIC table fidelity in both Lexicons, ten added local links/anchors, DDR validation, render and diff whitespace checks pass; prior S-004D evidence is preserved byte-for-byte. Pre/post self-drift retains the same 16 code/artifact pairs and cleanUpdate=false; the final doctor exposes those 16 findings, including untracked planning receipts. Confirmed DDR content remains proposed lifecycle in this dirty tree. No executable P/V behavior or real-board usefulness proof is claimed. |
| 2026-10-07 | P/V records carried onto a clean integration branch | Record stage of a `promote-decision` run on `claude/promote-ddr-001l-priority-value`, cut from integration d9a353590644f957ae24636d13ce9a41ef1987e9. Carried only the P/V content of the shared checkout and of commit 30bdf29f032075deffee03cc41ebc3248a2bbd76: DDR-001L with its decision text unchanged, accepted on this clean tree through `adr.mjs accept` (two relative link depths repaired after the move), both Lexicon sections, the Blueprint outcome, the Grill Board README pointer and these requirements; the consequential-decision reconciliation lane stays with its own branch. The planning receipt above is preserved lineage of the dirty shared checkout; none of its results are checks of this branch. Added a dated re-read of the board source at that base under Current Verified State. Adaptations: the DDR-001L link in the concept-confirmed row above points at the accepted record rather than its former `proposed/` path, and Documentation Impact now dates the "templates unchanged" sentence to the earlier planning changes, since this pass adds the generic Lexicon definitions. No Task, implementation, answer application or Owner Human QA. |
| 2026-10-07 | P/V record carry verified | Committed candidate f5ce6c46fe21ea6d27d8f9bb57e554bf7aaafa65, clean tree: all 54 Runbook Full suite commands exit 0, including `node tools/test-evaluate-workbench.mjs`, `node tools/test-adr.mjs`, `node tools/test-grill-board.mjs`, `python3 tools/test-check-append-only.py` and `node workbench/tools/spec-workbench.mjs doctor` (no blocking finding; its attention findings equal those of integration d9a353590644f957ae24636d13ce9a41ef1987e9 apart from that worktree's detached HEAD). `node workbench/tools/adr.mjs validate` and `node workbench/tools/wiki.mjs validate` pass. The same 54 commands also pass on unmodified integration. These are documentation and record checks only; P/V behavior, the real-board proof and Owner Human QA remain undelivered. |
| 2026-10-07 | Activated; bounded P/V proof planned | Plan stage of the DDR-001L `promote-decision` run on `claude/plan-ddr-001l-priority-value`, cut from integration 9edbed8a585a99a52368c3c09aa7eb91def6b7ef, under decision-005's authorization of implementation following the current request and its lifecycle. Live board re-read at that base (recorded under Current Verified State). Four Task records written with `next-id` labels confirmed free across every `origin/*` tip and local worktree: TK-007L tracer bullet (no blockers), TK-007M filters and batches and TK-007N inventory grades (each blocked by TK-007L), TK-007O answer-to-card-update cycle and real-board scenario (blocked by TK-007M and TK-007N); all `ready`, Builder, unclaimed. Header gained Priority 2 (this repository's default for an in-scope capability with no release assignment; the Owner's purpose is a board aid, not an interrupt or release gate) and Owner `unassigned` (no Dispatcher is assigned; whoever takes the Spec records themselves), then `convert-tasks S-004D --activate` set Status active. Readings recorded in the Tasks: AC1 covers every open board item including the 35 `confirm-dqc` items, with "deferred" applying to DQC records (TK-007N); requirement 4's decision-group navigation is the page's topic grouping, with no aggregate group P/V (TK-007M). Plan only: no claim, implementation, answer application or Owner Human QA. |
| 2026-10-07 | P/V plan verified | Committed candidate e88cbec0585adecaa57d5b5782a89b3abe75492e, clean tree: all 54 Runbook Full suite commands exit 0, including `node tools/test-evaluate-workbench.mjs`, `node tools/test-spec-workbench.mjs`, `node tools/test-grill-board.mjs` (run with localhost socket permission), `python3 tools/test-check-append-only.py` and `node workbench/tools/spec-workbench.mjs doctor` (no blocking finding; its new findings are the expected `blocked-slice` dependency entries for TK-007M, TK-007N and TK-007O). `show S-004D --json` reads back Status active, Priority 2, Owner unassigned and all four Tasks `ready` with no claim. These are planning and record checks only: no P/V behavior, real-board proof or Owner Human QA is claimed. |
| 2026-10-08 | Dashboard reconciliation and writer ownership | Authorized implementation from integration 47215ff10de711bf110c31f5a3f6ea2cf733b5e7. Selectively reuse confirmed DDR-001O and five-section design from claude/workbench-dashboard 35a27351; retain current P/V Tasks and completed PR438/439 work. Branch codex/dashboard-owner-flow published claim b3b87b43126c73f2b0192b08b1b78ca680676b04 for TK-007L. Parent is sole shared state writer; sources and workflow workers own distinct new modules. PR425 domain corrections and PR431 glossary migration remain separate. No owner answer or actual promotion executed. |
| 2026-10-08 | TK-007L claim transferred to the Claude director run | Kayden assigned the Dashboard first pass to a Claude director run through the local (ignored) handoff `dashboard-claude-director-first-pass-2026-10-08.md`, after Codex stopped every implementation writer. The published claim (`b3b87b43`, `codex-dashboard-owner-flow`) is carried, not released or closed: Owner and Claimed by now name `claude-dashboard-director`. Codex's uncommitted partial work was carried byte-for-byte from its preserved snapshot (26 paths, every SHA-256 matched) as recovery commit `eb7719c7`, without its withdrawn Lexicon entries, and with its three known failing tests recorded there. The documentation candidate `cf352446` was carried as `c5cab404` and `47d09d9d`. Task IDs TK-007T, TK-007X and TK-007Y were checked free across every `origin/*` tip and local worktree before adoption. No owner answer, promotion or Human QA. |
| 2026-10-08 | Lanes delivered onto the assembly branch | Four Workers on separate branches from `eb7719c7`, one writer per file, merged into `claude/workbench-dashboard-first-pass`. Owner interface and core (`claude/dashboard-lane-ui`): the four answer controls through one shared `answerControls` rule with legacy answers keeping their labels and meanings, note-required non-confirm answers, preselected recommended alternatives where the item names exactly one, Spec delivery approval Confirm/send-back, the Whys list, P/V badges, reasons, independent P and V filters and fixed P/V batches (TK-007L, TK-007M), the five sections with Taskboard and Tracker loaded on demand, Drafts to approve with snapshot match or stale state, Wiki groups, search, backlinks and hover definitions, the promotion timeline from workflow card states, room-relative approval snapshots so the 36 items citing absolute in-room notepad paths can be confirmed without weakening the notepad privacy guard, and the `reassess` operation that tells a retained grade from an unassessed one (TK-007O code half). Native sources (`claude/dashboard-lane-sources`): the preview duplicate guard keeps every parsed field unique document-wide and other labels unique per slice subsection (the carried allowlist relaxation is replaced; all 65 Taskboard tests pass with the three formerly failing refusals unchanged); the source-qualified reader refuses an overwritten identity (613 real cards, eight shared legacy labels kept apart); glossary, backlink and bounded search routes (warm search about 100 ms). Owner workflow and service (`claude/dashboard-lane-workflow`): per-card states from handoff requested to implemented, ordered receipts with knowledge-only no-op reasons, recovery of an interrupted comment write, a read-only service `status` and a disposable restart check. Real inventory (`claude/dashboard-lane-content`): all 171 open questions graded P and V with source-backed reasons through the `grade` operation only, no item revision changed (TK-007N); distribution and the read-only [question content audit](proof/question-content-audit-2026-10-08.json) (99 pointer-only recommendations, 16 wording approvals without a draft, 61 missing or moved source paths, 34 overtaken premises) are recorded for a later content pass. No item was revised and no answer file written. |
| 2026-10-08 | Owner flow demonstrated on a disposable copy | Fresh demonstration Worker, candidate `a857b658`, real inventory, port 4720, Chromium desktop: [receipt](proof/owner-flow-demo-a857b658.json). Nine of eleven steps passed: Change request, agent revision, confirmation of revised wording, stale approval refused and re-confirmed, two rounds starting no agent, double-click and stale-tab refusals without lost data, single and selected-set promotion including a confirmed alternative, knowledge-only and implementation disposition timelines, restart with byte-identical state, and the TK-007O P3V1 → reason → answer → apply → reassess scenario. Defects found: unsent comment text lost on Back (D1), service `status` attributing the Owner's installed service to another path and port (D4), key-order-dependent action identity (D3), and a versioned Node path in `print` (D5). All four and the UI polish items were fixed test-first in `claude/dashboard-lane-ui` (`60aee463`, `b2222b05`, `2f5c4fe5`, `b8bcec40`, `88954145`) and D1 and D4 re-checked (browser on port 4721; fixture status). Disposable fixture answers only; not Owner Human QA. The Owner's live board on port 4646 and its installed login service were read, never changed. |
| 2026-10-08 | Early Full suite and vocabulary correction | Full suite on clean candidate `a857b658`: 59 of 60 commands passed; `node tools/test-spec-workbench.mjs` failed its retired-vocabulary sweep on a sources-lane comment and fixture. Corrected without an allow-list entry in `ae47bff3`; `test-spec-workbench` then passed. The final candidate's Full suite and review are recorded separately. |
| 2026-10-08 | Separate-context review #1: fail; corrected | Candidate `1dfadbecbde191a28f04ae2968e0ed5260fc9d97`: the Full suite passed all 60 commands on a clean detached worktree (2026-10-08T17:53Z to 18:08Z). A fresh, uninvolved reviewer following the code-review skill returned **fail**. Blocking: the new owner write routes accepted cross-site `text/plain` POSTs from any Origin (reproduced with curl on a disposable copy: a comment file and notepad entry were written). Should-fix: the answer-word meanings had no owner after the Lexicon routing correction, and only 3 of the 36 real alternative questions can preselect their recommendation. Notes: the direct workflow CLI disagreed on confirmed alternatives, a `null` body returned 500, answer entries embedded legacy history that the notepad privacy guard could refuse, the README pointed at a missing Lexicon anchor and the old name, and pre-snapshot confirmations need re-confirming. Corrections: every request must carry the board's own Host and every write JSON with no foreign Origin or cross-site fetch (403/415, nothing written on refusal; `13540cc8`), non-object bodies return 400, the CLI shares the board's confirmation rule (`5f00ae4d`), answer entries store only the new answer and chain history (`3b942d66`), the page and README name re-confirmation and comment ownership (`1742fdd7`, `4b3fb108`), and this Spec carries the meanings verbatim (`fc3ffb49`). Recorded as an open content gap, not fixed here: marking the recommended alternative on the other 33 questions needs `revise`, which bumps their revisions and stales existing answers; until then the page says nothing is preselected and every alternative needs a note. The corrected assembly is a new candidate and takes a fresh review. |
| 2026-10-08 | Separate-context review #2: fail; corrected | Candidate `872e27085d532cb158dfc144482e572b6f543fec`: the Full suite passed all 60 commands on a clean detached worktree (to 2026-10-08T18:23Z). A second fresh reviewer verified the first review's corrections (Host, Origin, Content-Type and cross-site guards held against `null` Origin, trailing-dot and `[::1]` Hosts, form bodies and oversized chunked bodies, with nothing written on refusal) and returned **fail**. Blocking: re-confirming a confirmation saved before snapshots existed was treated as an identical repeat, so it never gained a snapshot and could not be promoted. Should-fix: the answer chain wrote `supersedes` but never checked it, so a newer `answers.json` answer from the old-code service could be silently reordered behind an older notepad answer; and DDR-001O linked its Spec one directory too high. Corrections: a confirmation without a current matching snapshot records a fresh one while true repeats stay idempotent (`a02e6830`); one shared history chain checks `supersedes`, keeps the newest answer current and shows an answer conflict asking the owner to answer again, never dropping an answer (`f06726f2`); the served page refuses framing (`4349a0cb`); the decision link is repaired (`18213a03`). Accepted as noted, not changed: the optional `expectedAnswerAt` for non-page API clients and knowledge-only Map or Plan receipts that also carry Spec or Task links. The corrected assembly takes a fresh review. |
| 2026-10-08 | Separate-context review #3: fail; corrected | Candidate `cf212a88c8a9ce31ef29d4d44598452c5442dc97`: the Full suite passed all 60 commands on a clean detached worktree (to 2026-10-08T18:38Z). A third fresh reviewer confirmed the earlier corrections held (cross-site, rebinding and framing guards; re-confirmation snapshots; `supersedes` checks with no answer dropped across legacy, notepad and old-server interleavings; legacy answer values; promotion order; duplicate guard and test assertions; private paths; records and 171 grades unchanged in revision) and returned **fail**. Blocking: an answer conflict was shown only on the page, while agent `pending` output, `apply`, rounds and promotion treated the contested answer as settled. Should-fix: re-saving the current answer did not clear a conflict. Notes: earlier-format notepad entries replaced the current answer without a conflict check, and a trimmed answer notepad would chain silently. Corrections (`7b8215d6`, `f274a2a1`): agent output carries the conflict, `apply` refuses `answer-conflict`, a conflicted answer is not a confirmation for rounds, card state or promotion, re-saving records a superseding entry that settles it, earlier-format entries and missing predecessors surface as conflicts, and the README forbids trimming the answer and workflow notepads. The corrected assembly takes a fresh review. |
| 2026-10-08 | Separate-context review #4: pass | Candidate `07429c50a81d4d4020a6ea1dc7bcb3ed9594e0d1`: the Full suite passed all 60 commands on a clean detached worktree (to 2026-10-08T18:54Z). A fourth fresh reviewer independently re-tested every earlier correction (legacy snapshot re-confirmation, old-server interleaving surfacing an `unchained` conflict in page, `pending`, `status` and `show` while `apply`, rounds and promotion refuse it, re-saving settling it, nothing dropped; Host, Origin, Content-Type, cross-site and framing guards with nothing written on refusal; all 171 open items confirmable and promotable on a copy; browser check of all five sections) and returned **pass** with no blocking finding. Should-fix, corrected in `6e452ba3`, `771c1439`, `7eed51be` and `bca7c7c6`: owner notes containing a home path, email address or token-like text are refused by the notepad privacy guard, so the page now explains the refusal, keeps the words and stops retrying (the guard and the owner's words are unchanged); README lines on write checks, the answer store and the per-kind routing of the new answer words were stale; a malformed answer-notepad entry returned 500; auto-save could settle a conflict without an explicit choice; the generic Runbook named this room's owner and the Non-Goals contradicted the template change. Accepted as noted: a card already promoted keeps its promotion state after a later conflict (the conflict stays visible on the question and to agents), and the approval snapshot binds the question, current text, proposal, draft, sources and evidence rather than the whole brief. After merging, the owner's running service must be restarted to load the new server code. |
| 2026-10-08 | TK-007L | Task closed | Grade schema and validated grade operation (gradeItems, grade CLI; P1-P4/V1-V4 with reasons, stale gradeRevision refused, revision and answers untouched); red P and amber V badges opening only their own reason; central view with both reasons. tools/test-dashboard-board.mjs 38/38, tools/test-grill-board.mjs 18/18; graded real item checked in the browser on a disposable copy (proof/owner-flow-demo-a857b658.json). Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence) | workbench/grill-board/README.md: grade fields, grade command and why a grade change keeps revision | none |
| 2026-10-08 | TK-007M | Task closed | Independent P and V filters combined with topic, intent, scale, workflow and search filters; P3+V1 returned exactly the 51 matching real questions; fixed batch started from a P/V slice kept its members across pause, resume and reload (page-model tests in tools/test-dashboard-board.mjs; browser receipt proof/owner-flow-demo-a857b658.json). Full suite 60/60 on clean candidate 07429c50; separate-context review #4 pass at 07429c50 (Spec evidence) | workbench/grill-board/README.md: P/V filters and fixed batches | none |
