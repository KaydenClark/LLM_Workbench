# S-003W - Wiki Evolving-Synthesis Migration

**Spec ID:** S-003W
**Status:** active
**Priority:** 1
**Owner:** claude-director-s003w
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Bring the Wiki's files, tooling and records in line with the accepted definition of the Wiki as the evolving synthesis every agent reads and updates: link-safe note moves, per-Spec articles into the features collection, router summaries, the name-and-context identifier rule in place of the identifier ban, landmark synthesis pages, the ledger out of the Wiki, and the lint cadence as a procedure.
**Blockers:** none
**Latest event:** TK-006Q closed with proof.
**Next gate:** Complete TK-006R.

> **Citation anchors.** pre=`e72ff5bc78d8815d5911c604b76c2953c78ecb79` post=`e72ff5bc78d8815d5911c604b76c2953c78ecb79`.
> Both name the Canon promotion commit on `claude/wiki-definition-canon`; post
> moves forward when the first slice lands.

## Outcome

The Wiki looks and behaves like the definition in
[The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md):
the router is an overview with a summary line per page; every delivered
capability has its entity page in the features collection, named for what it
delivers; each landmark has one evolving synthesis page summarizing its
question cards; identifiers on any page carry the artifact's name and context
and a validator checks that rule instead of banning identifiers; the grilling
ledger lives outside the Wiki; and the two lint cadences exist as a Runbook
procedure an agent can follow at the end of a Wiki update and at Spec review.

## Why It Matters

The definition is Canon as of the promotion commit, but the Wiki on disk still
reflects the earlier confirmed-only model: fifty-one per-Spec summaries are
filed as design concepts under the Spec's identifier, zero feature articles
exist for fifty complete Specs, the router lists pages without summaries, the
landmark validator refuses any identifier, the ledger JSON sits beside the
Markdown pages, and no procedure says what a lint is. Until these move, every
agent reading the schema meets a Wiki that contradicts it, and the
documentation progress the Tracker measures cannot reach Verified.

## Current Verified State

Read at the pre anchor. This is the state the Spec was written against; the
evidence log and Completion Result record what it delivered.

- `workbench/wiki/design-concepts/` holds 55 files: the README, three model
  articles (Landmark Tracker, Roles and Stances, Task Artifact and Lifecycle)
  and 51 articles whose file names begin `spec-S-` and whose `type` is
  `design-concept`; all 51 were created on 2026-09-18.
- `workbench/wiki/features/` holds only `README.md`. The retirement gate in
  `workbench/tools/spec-workbench.mjs` (`retire-spec --wiki`) accepts a
  `type: feature` note only inside this collection.
- `workbench/wiki/MEMORY.md` lists the 51 articles under "Individual Spec
  Articles" as bare title links; no summary line accompanies them.
- `workbench/tools/wiki.mjs` offers `validate` and `normalize` only. No
  link-safe move operation exists for a Wiki note; `move-spec` and
  `move-task` cover Spec and Task records only.
- `workbench/tools/landmark-wiki.mjs validate` refuses any identifier in an
  article (`landmark-wbid`) and any ambiguous hyphenated token
  (`landmark-ambiguous`); `tools/test-landmark-wiki.mjs` holds it to that
  rule; `workbench/landmark-tracker/LANDMARK-WIKI.md` documents it; the
  Landmark Records Spec (S-002A) and the Landmark Tracker Foundation Spec
  (S-01T, requirement 16) carry the no-identifier requirement.
- `workbench/wiki/grilling-destination-audit-ledger.json` (298 questions)
  lives in the Wiki lane; `tools/test-grilling-ledger.mjs` reads it at that
  path; the router and several Specs link to it. Its rows LD-4 and LD-22B
  record the confirmed-only Wiki model the owner has now superseded; the ten
  questions of the 2026-10-01 Wiki grilling are not yet rows.
- `workbench/landmark-tracker/landmarks/` holds 24 landmark records; none
  has a synthesis page in the Wiki.
- `RUNBOOK.md` has no procedure for the small lint at the end of a Wiki
  update or the whole-Wiki lint at Spec review; `AGENTS.md` and
  `workbench/wiki/SCHEMA.md` state the obligation and cadence.
- The validator message for a Design Concept article still reads "must
  record authorized_by (the owner directs creation)".

## Desired Behavior

1. A link-safe `wiki.mjs move-note` operation moves one Wiki note to another
   collection and optionally renames it, rewrites every live Markdown link
   to it across the controls, Wiki, Specs, Tasks, question cards and
   landmark records, counts historical references it leaves alone, refuses
   when the destination collection does not accept the note's type, and
   writes nothing on refusal.
2. Each of the 51 per-Spec articles becomes a feature article: moved into
   the features collection, retyped `feature`, renamed for the capability it
   delivers, given the four feature sections, with `source_paths` naming the
   Spec's eventual retired route, and routed from the router with a summary
   line. A Spec whose article moved stays retirable through it.
3. The router carries a one-line summary beside every link, and the Wiki
   validator reports a routed page without one as attention.
4. The identifier rule on every page is name-and-context: the landmark
   validator is reworked or retired so that an identifier accompanied by the
   artifact's name passes and a bare identifier is reported; its usage note,
   tests, Runtime registration and the two Specs that cite the old rule are
   reconciled.
5. Each landmark has one synthesis page in the design-concepts collection,
   seeded from its question cards' current answers and routed from the
   router; the Landmark Records Spec's expected-claim assessment reads these
   pages.
6. The grilling destination audit ledger gains the ten 2026-10-01 Wiki
   questions as rows, marks LD-4 and LD-22B superseded naming their
   replacements, and moves to the sessions lane with every link and the test
   path rewritten. The owner has said the ledger is becoming question cards;
   if that lands first, this slice records the move as unnecessary instead.
7. The Runbook carries the two lint procedures: the small lint of touched
   pages at the end of a Wiki update, and the whole-Wiki lint at Spec review
   when the Spec's work is verified, each with the questions to ask and where
   findings go (corrective Tasks).
8. The Design Concept validator message names the authorizing operation
   rather than the owner.

## Decisions And Contracts

- The definition itself is settled Canon in the decision record named above
  and the Wiki schema; this Spec changes files, tools and records to match
  it and reopens none of the ten answers.
- Moves use the link-safe operation only; no manual folder move of a note.
- Identifiers are never stripped from a page; a page that references one
  without the artifact's name and context is repaired by adding them.
- The 51 moved articles keep their `History` and `provenance`; the move is
  recorded as a History line, not a rewrite.
- Ledger rows are never deleted; supersession names the replacement row.

## Non-Goals

- Changing the definition, the schema's purpose section or the decision
  record.
- Writing the whole-Wiki lint as a tool; it is an agent reading procedure.
- Converting the ledger into question cards; another owner holds that.
- Authoring new design-concept model articles beyond landmark synthesis
  pages.
- Changing Spec or Task lifecycle commands.

## Dependencies And Blockers

- The Canon promotion commit (`claude/wiki-definition-canon`, short
  `e72ff5bc`) must be on integration before slices land; its schema and
  Lexicon text are what the validator and procedures implement.
- Slice 6 depends on whether the ledger-to-cards conversion lands first; it
  carries that check as its first step.

## Vertical Implementation Slices

Tasks are temporary tracer bullets reaching or repairing this scoped destination.
This table is a compatibility seed: before record-backed execution, convert
unfinished rows with `convert-tasks` as the Runbook describes. Once `tasks/`
exists, TASK.md owns active Task state; retain only done table rows as history.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

### TK-001 - Link-safe note move proven on one article

**Stance:** Builder

Add `move-note` to `workbench/tools/wiki.mjs` with a failing test first in
`tools/test-wiki.mjs`: moving a note rewrites every live link, counts
historical ones, refuses a type the destination collection does not accept,
and writes nothing on refusal. Then move one per-Spec article (the one for
Wiki Routing, Version Stamps And Safe Source Reads is a good first choice,
since it is about the Wiki itself) into the features collection, retype it
`feature`, rename it for its capability, add the four feature sections from
its existing prose, and give its router entry a summary line. Prove with
`wiki.mjs validate`, `doctor`, `retire-spec --wiki` dry acceptance of the
moved note, and the test.

## Acceptance Criteria

- [ ] `wiki.mjs move-note` exists, is tested, rewrites live links, counts
      historical references and refuses safely.
- [ ] Every former per-Spec article is a feature article in the features
      collection, named for its capability, routed with a summary line, and
      the Spec it documents is retirable through it.
- [ ] Every routed page has a summary line and the validator reports a
      missing one as attention.
- [ ] A page with an identifier beside the artifact's name passes the
      identifier validator; a bare identifier is reported.
- [ ] Every landmark has a routed synthesis page.
- [ ] The ledger holds the ten Wiki-grilling rows, LD-4 and LD-22B read
      superseded, and the file lives in the sessions lane with links and the
      test path rewritten, or the slice records that the cards conversion
      made the move unnecessary.
- [ ] The Runbook carries both lint procedures.
- [ ] `node tools/test-wiki.mjs`, `node tools/test-landmark-wiki.mjs`,
      `node tools/test-grilling-ledger.mjs` and the full suite pass on the
      assembled candidate.

## Testing Seams

- `tools/test-wiki.mjs`: `move-note` behavior, summary-line attention,
  feature-article shape in the features collection.
- `tools/test-landmark-wiki.mjs`: name-and-context rule replacing the ban.
- `tools/test-grilling-ledger.mjs`: new rows, supersession, new path.
- `tools/test-spec-workbench.mjs`: retirement through a moved feature article.

## Verification Procedure

```bash
node tools/test-wiki.mjs
node tools/test-landmark-wiki.mjs
node tools/test-grilling-ledger.mjs
node workbench/tools/wiki.mjs validate
node workbench/tools/spec-workbench.mjs doctor
```

Then the full suite in `AGENTS.md`.

## Documentation Impact

- `workbench/wiki/MEMORY.md`: summary lines; moved article routes; ledger
  route removed.
- `workbench/wiki/features/README.md`: the moved articles as the first
  entries; summary-line convention.
- `RUNBOOK.md`: `move-note`, the two lint procedures, the ledger path, the
  identifier validator's new rule; `templates/RUNBOOK.md` mirrors.
- `workbench/landmark-tracker/LANDMARK-WIKI.md`: new rule.
- The Landmark Records and Landmark Tracker Foundation Specs: evidence rows
  noting the identifier rule change; their requirement text is history.
- `templates/wiki/MEMORY.project.md`: summary-line convention.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-01 | - | Spec captured | none run; planning only | this record | all slices |
| 2026-10-04 | TK-001 | Task closed | Task PR review PASS (Codex gpt-5.5, separate context) on d8a3fb24 vs 58ca0d20; full RUNBOOK suite 51/51 green on candidate 43a8797; tools/test-wiki.mjs 18/18 incl. 4 move-note tests (red: missing moveNote export); wiki.mjs validate ok; PR merged to integration | RUNBOOK.md, templates/RUNBOOK.md, workbench-runtime skill (move-note procedure), features README root+template, MEMORY.md router, moved feature article | summary-line validator attention and the other 50 per-Spec articles: TK-002 |
| 2026-10-04 | TK-003 | Task closed | Task PR review PASS (Codex gpt-5.5, separate context) on bf9dff4f vs 58ca0d20; full RUNBOOK suite 51/51 green on candidate 706484e9 plus test-landmark-wiki 42/42 (red: 34 of 42 failed before change) and test-landmark-tracker 23/23; PR #342 merged to integration | workbench/landmark-tracker/LANDMARK-WIKI.md (name-and-context rule); evidence rows appended to S-002A and S-01T; RUNBOOK and templates checked, no ban or validator text to update | 600 bare identifiers across 93 existing Wiki pages are reported by the explicit-call validator (wired into no gate): repair belongs to whole-Wiki lint corrective Tasks and TK-002/TK-004 page work |
| 2026-10-04 | TK-005 | Task closed | Task PR review PASS (Codex gpt-5.5, separate context) on f66da319 vs 58ca0d20; full RUNBOOK suite 53/53 green on candidate 6ad8225d (incl. test-landmark-tracker and test-landmark-wiki); tools/test-grilling-ledger.mjs 9/9 (red: 8 failed before the move); test-portability-matrix 6/6; PR #340 merged to integration | workbench/sessions/grilling-destination-audit-ledger.json (moved from the Wiki lane; ten WIKI rows; LD-4 and LD-22B superseded); live links in ADRs, Specs and Wiki notes rewritten; router ledger route replaced by a pointer; RUNBOOK and templates checked, no ledger reference | Receipt row says ledger test '11 pass'; true count 9/9 (checksummed Receipt left unedited, correction here). LD-5 locked answer (do not move the ledger, about the Tracker not replacing it) kept with result path updated, not superseded: owner call if wanted |
| 2026-10-04 | TK-002 | Task closed | Separate-context Codex reviews of PR #351: tools/router, two article-fidelity halves and three deltas, findings fixed and re-reviewed PASS at 6505319e; full RUNBOOK suite plus landmark tests 53/53 on candidate 9aad38b8 and equivalent runs on 6b20c098 (one transient round-trip clone failure under concurrent load, passes alone rc 0); tools/test-wiki.mjs red-then-green unsummarized-route; tools/test-landmark-wiki.mjs red-then-green digit-leading slug; test-spec-workbench retirement through a moved feature article; PR #351 merged | 51 per-Spec articles moved and restructured into workbench/wiki/features via wiki.mjs move-note; router Feature Articles with summaries beside every routed link; Individual Spec Articles section retired; SCHEMA and template summary-line rule; LANDMARK-WIKI slug rule; DQC-002D revised through the runtime; the S-022 article carries integration's supersession | bare identifiers on pages outside this slice remain (explicit-call validator, no gate); the S-022 article describes a superseded Spec as a feature article; MIGRATION_INVENTORY.json plain-path mentions of old article paths kept as historical |
| 2026-10-04 | TK-004 | Task closed | Separate-context Codex reviews of PR #348: tools/router/coverage PASS, page fidelity two halves plus the Landmark Tracker page, two fidelity findings fixed and the delta re-reviewed PASS at d957d81b; full RUNBOOK suite plus landmark tests 53/53 on candidate 00fc3c34 (the final head adds two reviewed bullets); tools/test-landmark-wiki.mjs red-then-green for one routed synthesis page per landmark; PR #348 merged | 24 landmark synthesis pages in workbench/wiki/design-concepts routed from MEMORY.md; design-concepts README root and template convention; LANDMARK-WIKI.md pointer and assessment boundary | the expected-claim assessment does not read Wiki pages: landmark-tracker.mjs records evidence references as free text and claimView derives status from record revisions only; reading page contents would be a new public contract for the Landmark Records Spec (S-002A), recorded here not built |
| 2026-10-04 | TK-006 | Task closed | Separate-context Codex review of PR #339: first candidate FAIL on small-lint routing, fixed, fresh review PASS at 3793e0e8; full RUNBOOK suite plus landmark tests 53/53 on candidate 736544ba (merge of integration and a projection re-render followed); tools/test-wiki.mjs red-then-green validator message; PR #339 merged | RUNBOOK.md and templates/RUNBOOK.md Wiki Lint section and operations index row; workbench/wiki/SCHEMA.md and templates/wiki/SCHEMA.md pointer; validator message in workbench/tools/wiki.mjs | design-concepts README authorized_by example line still reads 'the authorizing operation or the owner' (shape documentation, not the validator message) |
| 2026-10-04 | TK-006P | Task closed | Separate-context Codex review of PR #356: first candidate FAIL on an overclaimed features-collection coverage statement, fixed over four fresh delta reviews, PASS at 4b9b9690; full RUNBOOK suite 51/51 on candidate ee011424 (a clean merge of integration and wording-only commits followed; wiki.mjs validate and landmark-wiki validate green); PR #356 merged | workbench/wiki/AGENTS.md and templates/wiki/AGENTS.md accepted ingest rule; router heading, release link, skills-draft summary, summaries and provenance; features README This Room's Articles and History shape; landmark Wiki, Durable Knowledge and Artifact Types pages corrected for delivered state; DQC-002D revision 8 citations; one S-00O proposal path note | workbench/grill-board/items.json still holds two live links to the old ledger path (written only through the Grill Board tool); three append-only or Receipt rows naming the old path left as history |
| 2026-10-04 | TK-006Q | Task closed | Separate-context Codex review of PR #357 PASS with no findings at 30f9de03; full RUNBOOK suite plus tools/test-landmark-wiki.mjs 52/52 on candidate dac78a66 (clean merge of integration and a projection re-render followed); tools/test-landmark-wiki.mjs 76/76 with 22 failing cases written first; before/after tally over 140 Wiki pages 473 to 418 findings with 0 newly reported; PR #357 merged | workbench/tools/landmark-wiki.mjs non-identifier escape and link-text rules; workbench/landmark-tracker/LANDMARK-WIKI.md Tokens that are not identifiers section | grilling-ledger interview labels (ROLE-1, E-4B, TT-Q8 and similar) deliberately stay reported (21 findings on 9 pages); one allow-list entry per family if the owner prefers exemption |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The ledger-to-cards conversion is owned elsewhere; slice 6 adapts to it. The
  ledger moved to the sessions lane (TK-005) and remains a live record there.
- Desired Behavior 5's second half is not delivered: the Landmark Records Spec's
  expected-claim assessment does not read the landmark synthesis pages. The
  assessment records evidence references as free text and derives claim status
  from record revisions only, so reading page contents is a new public contract
  owned by the Landmark Records Spec (S-002A), not a Task of this Spec. Owner
  decision at Human QA: add that contract under S-002A, or amend Desired
  Behavior 5 to the delivered half. Do not clear it with a green test.
- Pre-existing bare identifiers on untouched Wiki pages were found by the
  whole-Wiki lint at Spec review (470 findings on 55 pages before repair); the
  corrective Tasks under this Spec repair them and the validator remains
  explicit-call only, wired into no gate.
- Decision-record, Spec and Task identifiers in append-only Spec history and
  commit-pinned references are historical and left as written.
- Feature capture for Specs completed after this migration follows the
  schema's ingest rule and needs no slice here.

## Supersession

- Supersedes: none
- Superseded by: none
