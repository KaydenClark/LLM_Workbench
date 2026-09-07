# S-049 - Assignment Ownership And The Coordination Record

**Spec ID:** S-049
**Status:** complete
**Priority:** 2
**Owner:** claude
**Stance:** Builder
**Updated:** 2026-09-07
**Catalog description:** Give an assigned spec or ticket an invocation that carries it to its already-authorized endpoint and records, per occurrence, every point where the owner still had to supply routine coordination.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

No anchor declaration. Every live section below names a file, not a position.
The only bare `path:line` citations in this spec are in the append-only
evidence log, which `AGENTS.md` and `tools/test-spec-citation-anchors.mjs` both
read at the commit each row names rather than at a declared anchor. Two rows
carry a bare citation that does not resolve at the commit the row names, so
the resolving tree for each is named here: row 6's two citations read at
`git show 7020ed3:RUNBOOK.md` and
`git show 7020ed3:workbench/tools/workbench-layout.mjs`, the tree the second
review examined; row 8's README citation reads at `git show 9ec4314:README.md`,
where that line called v3.1.2 a local candidate. Rows 4 and 5 carry bare
citations and do name their commits, and both resolve there.

This paragraph is itself a correction, twice over. It first claimed the spec
carried no bare `path:line` citations at all, which stopped being true at
`7020ed3`. The repair of that claim then said row 8 was the only unanchored
row, which was also false - row 6 has the same gap. The repair of *that* called
row 6 a row "without naming a commit", when it names a range whose head is
simply not where its citations resolve. Recorded plainly because this
release's pattern is corrections that carry the defect they correct.

## Outcome

An agent handed an assignment - a spec, or a named ticket inside one - has one
invocation, `/carry`, that owns it from wherever it sits to the endpoint its
existing authorization already reaches, and that records each point where the
owner had to supply coordination the harness should have supplied. `carry`
ships in the closed core bundle, which grows from sixteen skills to seventeen.

The recording half is not decoration. The measurement it produces - how much of
the owner's attention a run still costs - is the thing this spec exists to make
visible. A `carry` that delivers the result and records nothing has done the
delivery and skipped the point.

## Why It Matters

The harness already requires reproductions, verified corrections, independent
review, and authorized integration. What it does not do is notice when the
owner had to move the work along: repeat a decision already recorded, locate
evidence already in the project, reconcile a routine technical finding, or
prompt an agent to finish a step it was already authorized to take. Each of
those is absorbed silently today, so the same defect recurs and nothing in the
records shows that it did.

Three existing skills sit next to this gap without covering it. `implement`
owns one ticket's red/green loop and stops at its close. `make-it-so` starts
from unsettled decisions that need promoting to Canon, which is a different
input. The stances set method, not ownership of an endpoint. None of them
answers "you already have the assignment and the authorization - carry it,"
and none records what it cost the owner to get there.

The owner's own instruction for this, supplied with the assignment, is the
contract the skill encodes: own the assignment through its already-authorized
endpoint; check the project and supplied conversation before asking; ask only
for a genuine preference, tradeoff, authorization, or unavailable resource;
record every other hand-back with its specific cause and smallest supported
correction, using existing mechanisms rather than a new framework.

## Current Verified State

Verified on `origin/integration` at `9ec4314` on 2026-09-07.

- `skills/README.md` declares a closed sixteen-skill bundle - twelve workflow
  skills and four stances - and `tools/test-skill-catalog.mjs` pins that exact
  list against both the catalog table and the `skills/` directory.
- `workbench/tools/workbench-layout.mjs` exports `coreSkills` as the live
  policy and freezes each earlier release's list in `supportedLegacy`: the
  twelve-skill bundle for v3.0.0 and v3.1.0, the sixteen-skill bundle for
  v3.1.1. Any other version must carry the current policy, so growing the
  bundle is a release-boundary change by construction.
- **`origin/main` at `9378ead` carries `workbench/manifest.json` declaring
  `v3.1.2` with the sixteen-skill policy.** S-038's Decisions And Contracts
  says "v3.1.2 exists only as an unpublished candidate on `integration`;
  `main` carries no `workbench/` root", and `README.md` still calls v3.1.2 "a
  local candidate". Both are stale: `dce85a2` stamped the v3.1.2 candidate and
  reached `main` through PR #73, and `main` is thirteen commits behind
  `integration` today. Verified by `git ls-tree origin/main` and
  `git show origin/main:workbench/manifest.json`, not by reading the record.
- **Consequence, reproduced:** extracting `origin/main` into a fixture and
  running `workbench-layout.mjs validate` from this candidate returns
  `invalid-skill-policy`. Growing the bundle inside v3.1.2 retroactively
  redefines a version that has already reached `main`, which is what the
  frozen `supportedLegacy` rows exist to prevent. The established precedent
  is the opposite of what this spec first assumed: the twelve-to-sixteen
  bundle growth bumped v3.1.0 to v3.1.1 and froze v3.1.0's twelve.
- `workbench/feedback/REPORT_FORMAT.md` already owns cross-assignment harness
  findings, with per-finding cause and smallest bounded next action. Each
  spec's `Append-Only Evidence And Execution Log` already owns per-run,
  per-occurrence history. Neither is currently written to when the owner
  supplies coordination.

## Desired Behavior

1. `/carry S-###` or `/carry S-### TK-###` recovers the assignment's state from
   the project, names the authorized endpoint before starting, executes through
   the existing contracts, and reports against that endpoint.
2. Before returning a question, the skill applies one gate: what specifically
   prevents resolving this from the available sources within existing
   authorization. Only preference, tradeoff, authorization, or an unavailable
   resource passes it.
3. Every hand-back that was not one of those four is recorded as its own row in
   the assigned spec's evidence log, naming the occurrence, the specific cause
   classified as missing / inaccessible / incorrect / not followed, and the
   smallest supported correction.
4. The correction is made in the existing owner - a record, route, skill, or
   tool. A new framework, store, coordination layer, or always-loaded document
   is explicitly not an acceptable response to a hand-back.
5. Escalation to a report in the manifest `feedback` lane happens only when the
   same cause recurs across assignments and no single spec owns it.
6. `carry` grants no authority. It does not widen scope, relax a safety limit,
   or move work past the declared `git.integrationBranch`.

## Decisions And Contracts

- **`carry` is a core-bundle skill, not a repo-local one.** The behavior is
  harness-level, and the coordination measurement is only meaningful if it runs
  on every assignment in every room, not just this one. Owner decision,
  2026-09-07.
- **WITHDRAWN: "It lands in v3.1.2, not a new version."** This decision was
  recorded on S-038's stale claim that v3.1.2 was unpublished and was not
  verified against `origin/main` before it was written. It is false, and the
  candidate as first pushed (`a617359`) makes `main`'s own manifest
  `invalid-skill-policy`.
- **REPLACES IT: the seventeen-skill bundle is v3.1.3, and v3.1.2 is frozen at
  sixteen.** Owner decision, 2026-09-07, with the owner confirming that rooms
  outside this repository are running v3.1.2 - so the freeze prevents a live
  break, not a theoretical one. This is the handling the twelve-to-sixteen
  growth already received: it bumped v3.1.0 to v3.1.1 and froze v3.1.0 rather
  than redefining it. A bundle change is a release-surface change.
- **`carry` sits ahead of the stances in `coreSkills`.** It is a workflow
  skill, and the position keeps every `slice(-4)` stance read and the frozen
  v3.1.1 row exact.
- **The frozen v3.1.1 row is constructed, not read off the live list.** The
  layout tests previously took `manifest.skillPolicy.required` as "the
  sixteen"; that conflation was correct only while the current bundle happened
  to be sixteen. They now build v3.1.1's row from the twelve workflow skills
  plus the four stances, so the next bundle change cannot silently redefine an
  older release's policy.
- **The hand-back record's owner is the assigned spec's evidence log.** It is
  already append-only, already per-occurrence, and already the first thing a
  continuing agent reads. No new store is introduced.
- **The name is `carry`.** Owner decision, 2026-09-07, from four candidates.

## Non-Goals

- Publishing v3.1.3, or deciding what else v3.1.3 takes. This spec opens
  the version because a bundle change requires one; it does not claim the
  six tickets S-045 holds for v3.1.3.
- Any automated aggregation, dashboard, or scoring of hand-backs. Counting them
  across runs is a later question that needs runs first.
- Changing what any agent is authorized to do. `carry` redistributes the burden
  of proof for stopping; it grants nothing.
- Retrofitting hand-back records onto completed specs.

## Dependencies And Blockers

Resolved. The owner decided on 2026-09-07 that the seventeen-skill bundle is
v3.1.3 and that v3.1.2 freezes at sixteen, and confirmed that rooms outside
this repository are running v3.1.2. Two rejected alternatives are kept because
the reasons matter: making v3.1.2 accept either size would have cost the
one-policy-per-version property the frozen rows exist to hold, and leaving
v3.1.2 at seventeen only would have broken `main` and every downstream room.

TK-002 depends on an assignment being carried in real use.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | `/carry` exists as a discoverable core skill and the seventeen-skill bundle validates end to end without redefining any frozen legacy policy | done | none | Full AGENTS.md suite 30/30 green at e8f891a and again after these fixes; three separate-context reviews (9ec4314..a617359, ..7020ed3, ..e8f891a), all findings applied; installer demo writes 34 skills with carry marked release v3.1.3; origin/main rebuilt as a fixture returns valid, doctor ok, next null; both new guards mutation-checked |
| TK-002 | One real assignment is carried under `/carry`, and its hand-backs - or the recorded absence of any - are the first measurement | done | none | THE ASSIGNMENT: S-045, all six tickets the owner unblocked, plus installing `carry` and three record repairs. Carried end to end under this contract - by hand through step 3, since `/carry` was not in any discovery root until the install this run performed, and as an invocable skill from that point. Endpoint named before starting and reached: every ticket closed with named proof, the spec completed, the work on the declared integration branch. **ZERO COORDINATION HAND-BACKS.** The owner supplied nothing to this run. The only input was the resume phrase; every decision the run needed was already recorded in the assigned spec, the handoff, or the grilling notepad, and everything else was resolved from the project. No question was returned to the owner, so none needs testing against section 4. Ticket ordering, slicing and the install route were treated as the implementing agent`s, which is what the owner said in as many words when a prior session put ordering to them - that hand-back is already recorded in the notepad and is not double-counted here. WHAT WAS RUN, so the zero is checkable rather than asserted: full AGENTS.md suite twice, 30/30 both times, at 55cacb3 and ef44e8e; six red-first tests across three files; six mutations, each confirmed to turn a specific test red and then reverted; the install executed against the real host with HEAD and the Git index asserted byte-identical afterwards. |

## Acceptance Criteria

- [x] `skills/carry/SKILL.md` exists with frontmatter, names the assigned spec
      and its two `spec-workbench.mjs` entry points, the declared integration
      branch as the endpoint, the four reasons the owner is asked, the four
      cause classifications, the evidence log as the record's home, and the
      feedback report format as the escalation route.
- [x] `tools/test-skill-catalog.mjs` pins all seventeen skills and the `carry`
      contract above, and passes.
- [x] All six documents that state the bundle size - `skills/README.md`,
      `README.md`, `RUNBOOK.md`, `BLUEPRINT.md`, `LEXICON.md` and
      `templates/GENESIS.md` - state seventeen, and a test derives the expected
      number and wording from `skills/` so none can drift silently again.
- [x] Every documented `--version` literal equals the checkout release, and a
      test holds it there. `RUNBOOK.md`'s Genesis command runs.
- [x] The layout suite proves a v3.1.1 manifest and a v3.1.2 manifest both stay
      valid at the frozen sixteen after the bundle grows, that neither accepts
      the twelve-skill bundle, and that the current version is valid only at
      the current bundle. It deliberately does *not* claim a legacy version
      rejects the current policy - `accepted` is `[current, frozen row]`, so it
      does not, and asserting otherwise would put a false claim behind a
      checked box.
- [x] `origin/main`'s own manifest, extracted to a fixture, validates against
      this candidate - the regression that blocked TK-001 is gone.
- [x] `README.md`, `BLUEPRINT.md` and `workbench/manifest.json` agree that the
      current harness version is v3.1.3.
- [x] The full verification suite named in `AGENTS.md` is green, and `doctor`
      reports no blocking finding.
- [x] TK-002 closes with a named assignment, the hand-backs it produced with
      their causes and corrections, or an explicit "none, and here is what was
      run" - not a summary of the delivery. The assignment was S-045; the answer
      is none, with the suite runs, red-first tests, mutations and the real
      install named so the zero is checkable.

## Testing Seams

- `tools/test-skill-catalog.mjs` - the catalog table, the `skills/` directory,
  and the `carry` body's required contract terms.
- `workbench/tools/workbench-layout.mjs` `validate` - manifest skill policy
  acceptance per declared version.
- `tools/test-core-skill-installer.mjs` and `tools/test-workbench-adoption.mjs`
  - the required-skill list a new or adopted room must satisfy.
- The assigned spec's evidence log is the seam for TK-002: the record either
  exists with its three named parts or it does not.

## Verification Procedure

Run the full suite named in `AGENTS.md`. The suite requires a committed
candidate: `workbench-layout.mjs init` refuses a release checkout with
uncommitted changes to the manifest, runtime tools, or templates
(`invalid-source-identity`), so the layout, adoption and upgrade suites are run
against a commit, not a dirty tree.

## Documentation Impact

- `skills/README.md` - catalog row and bundle size.
- `README.md` - the `skills/` supporting-file line's bundle size, and the
  current harness version.
- `BLUEPRINT.md` - the workflow-skill count in the v3.1 invariants, the harness
  version header and prose, and the spec catalog row.
- `LEXICON.md` - core skill bundle count, and the new `Coordination hand-back`
  core term, which defers to `AGENTS.md`'s governing ask gate rather than
  standing beside it.
- `RUNBOOK.md` - core-skill setup check count, and four documented
  `--version` literals that must be the checkout release.
- `templates/GENESIS.md` - the exact skill-policy count a Genesis room asserts.
- `templates/ADOPTION.md`, `skills/adoption/SKILL.md`,
  `skills/update-harness/SKILL.md`, `tools/workbench-upgrade.mjs` and
  `workbench/tools/workbench-layout.mjs` - documented `--version` literals.
- `benchmarks/RESULTS.md` - the guardrail before/after row this harness change
  owes.
- `BLUEPRINT.md` - spec catalog row.
- `workbench/manifest.json` - this room's required skill policy.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-07 | spec | Created under owner direction to own a `carry` invocation and the coordination record it produces | The owner's instruction was traced to its source before any design: it is verbatim from the 2026-09-06 advisory conversation preserved in `workbench/feedback/llm-workbench-decision-recovery.zip`, whose framing is that the principles are already written and what is missing is evidence of how much coordination remains the owner's. Three existing skills were read and rejected as owners - `implement` (one ticket's red/green loop), `make-it-so` (input is unsettled decisions needing promotion), the stances (method, not endpoint ownership). Two owner decisions were taken rather than assumed: the name `carry` from four candidates, and core-bundle placement over a repo-local skill | Spec created; Documentation Impact lists the six owners the change touches | TK-002 has no measurement yet; the skill is unproven in real use |
| 2026-09-07 | TK-001 | Skill, bundle growth and full suite green at `a617359`; then a self-check found this spec's own version claim false and blocked the ticket | Full suite 30/30 green at `a617359`, including `doctor`. Demo artifact: `core-skill-installer.mjs install` into a disposable home wrote 34 skills - seventeen into each of `.agents/skills` and `.claude/skills` - with `carry` carrying a schema 2 marker at release `v3.1.2`, commit `a617359`. The green suite did not catch the real defect: `git ls-tree origin/main` shows `main` carries `workbench/manifest.json` at `v3.1.2` with sixteen skills, so S-038's "main carries no workbench root" is stale and this spec repeated it without checking. Reproduced by extracting `origin/main` to a fixture and running `workbench-layout.mjs validate` from this candidate: `invalid-skill-policy`. No test covers it because every fixture builds its manifest from the live `coreSkills`, so no test ever validates a manifest the current bundle did not write | Current Verified State corrected with the verified facts; the v3.1.2 placement decision marked WITHDRAWN rather than edited away; Dependencies And Blockers now carries the three costed resolutions | The version decision is the owner's and TK-001 cannot close without it. Also uncorrected: `README.md` still calls v3.1.2 "a local candidate", which the same evidence contradicts - out of this spec's scope to fix, and named here so it has an owner |
| 2026-09-07 | TK-001 | Owner chose v3.1.3 with v3.1.2 frozen; implemented, and one of this branch's own new assertions was wrong | Red first: `outcome('v3.1.2', sixteen)` returned `invalid-skill-policy` before the frozen row and `valid` after. `origin/main` extracted to a fixture now validates against this candidate, so the regression that blocked TK-001 is gone. A second assertion added in the same edit - `outcome('v3.1.2', current) === 'invalid-skill-policy'` - was false and was removed rather than accommodated: `accepted` has always been `[current policy, frozen row]`, so every listed legacy version also validates at the current policy. Proved pre-existing rather than assumed, by initializing a v3.1.3 room, relabelling its manifest `v3.1.1` while keeping the seventeen-skill policy, and getting `valid` - and by reading the same `const accepted` line at `9ec4314`. The version bump also broke three wiki stamps and the Taskboard projection | `README.md` and `BLUEPRINT.md` moved to v3.1.3 and stopped calling v3.1.2 an unpublished candidate; the three `workbench/wiki` contract stamps re-stamped; `render` re-run | `unverified-provenance` still reports `provenance.source.release "v3.1.0"` against `workbenchVersion v3.1.3`. Pre-existing and attention-only - the condition is `source.release !== workbenchVersion`, which already held at v3.1.2 - and left alone because v3.1.0 is the release this room was actually adopted from |
| 2026-09-07 | TK-001 | Separate-context review of `9ec4314..a617359` returned CHANGES REQUESTED with six findings; five applied, one noted | The reviewer reproduced F1 independently and went further than this spec had: copying the candidate tools into a room built from `origin/main` makes `doctor` report `invalid-manifest [blocks all]` and `next --json` error, so selection dies there, and `workbench-upgrade.mjs upgrade --layout-only` refuses with `support-root-exists` - there is no automated repair. F1 was already fixed at `b1c7160`/`f6339a8`, which the reviewer did not see. F2: acceptance criterion 4 claimed a legacy version rejects the current policy; it does not, so the criterion was reworded to what holds rather than the code changed to match. F3: `README.md:69` and `BLUEPRINT.md:90` still stated sixteen and twelve and no test covered them - both corrected, and `test-skill-catalog.mjs` now derives the expected size and wording from `skills/` for all five documents that state it, mutation-checked by reverting `README.md` to sixteen and watching it fail. F4: the Lexicon term and `carry` section 4 now defer to `AGENTS.md` Safety And Change Control as the governing ask gate, and Preference excludes low-risk reversible in-scope calls. F5: the next-slice path is bounded to the named assignment. The reviewer also verified by mutation that the layout tests are stronger, not weaker: reinstating the old live-list conflation, or moving `carry` after the stances, each fails three tests | `README.md`, `BLUEPRINT.md`, `LEXICON.md`, `skills/carry/SKILL.md` and this spec's acceptance criteria and Documentation Impact | F6 not fixed: `templates/GENESIS.md` hardcodes an exact skill-policy count, so a room genesis'd from an older release reads a wrong number. Pre-existing pattern, not introduced here, and outside this spec. The reviewer also observed that packaging the ask gate as a seventeenth core skill is what created the whole v3.1.2 compatibility problem, and that adding sections 4 and 5 to `implement` would have delivered the same measurement without touching the bundle - a real tradeoff the owner decided in favour of the bundle before that cost was known |
| 2026-09-07 | TK-001 | Fresh separate-context review of `9ec4314..7020ed3` returned CHANGES REQUESTED; all five findings applied, and it withdrew a false claim in the row above | The reviewer verified all six prior findings individually rather than taking this spec's word, and confirmed F1 fixed by rebuilding a room from `origin/main`: `validate` returns valid, `doctor` returns `ok - no blocking finding`, `next --json` returns `null` at exit 0, and re-running the same fixture against `a617359`'s tools reproduced the original break, proving it was real rather than environmental. New findings: **A** - the v3.1.3 bump left nine documented `--version v3.1.2` literals behind, and `RUNBOOK.md:169`'s Genesis command hard-fails with `invalid-source-identity` (reproduced here verbatim; the same command at v3.1.3 returns `initialized`). All nine moved, and `test-skill-catalog.mjs` now asserts every documented `--version` literal in six files equals the checkout release, mutation-checked. **B** - `LEXICON.md`'s v3.0.0 row still called v3.1.2 the current candidate; reworded to match `README.md` and `BLUEPRINT.md`. **C** - `carry` named integration as its endpoint without ever forbidding self-review at that gate, which is the one omission its own thesis makes dangerous; section 2 now says a missing separate context is an Unavailable resource, never a reason to merge. **D** - the row above claims the guard covers "all five documents that state" the bundle size; **six** state it and the sixth, `templates/GENESIS.md`, was unguarded. That claim is **withdrawn**: the guard now covers all six, mutation-checked, and the code comment saying "four" is corrected. **E** - no guardrail before/after was recorded for a harness change | `RUNBOOK.md`, `templates/ADOPTION.md`, `skills/adoption`, `skills/update-harness`, `tools/workbench-upgrade.mjs`, `workbench/tools/workbench-layout.mjs` usage string, `LEXICON.md`, `skills/carry/SKILL.md`; `benchmarks/RESULTS.md` gains the 78/100 -> 78/100 row | The reviewer's four residual risks are carried, not closed: the section 3 boundedness fix is prose with no assertion pinning it; the guard's number-word table runs out above a 23-skill bundle, failing loudly; evidence row 1 cites an untracked archive a cold reader cannot resolve, and committing it may be worse if it holds private conversation; and the stale "`main` carries no `workbench/` tree" claim this branch corrected here is repeated in the closed evidence of S-037, S-038, S-040, S-041, S-042 and S-044, which are append-only records outside this spec's scope |
| 2026-09-07 | TK-001 | Third separate-context review of `9ec4314..e8f891a` returned CHANGES REQUESTED on one finding; that finding was a hole in this branch's own drift guard | The reviewer re-verified all five of the second review's findings independently and found them applied, then found a seventh file the new guard's hand-written list omitted: `tools/workbench-adoption.mjs` documents `--version v3.1.0`, three releases stale, and copying it hard-fails with `invalid-source-identity` exactly as `RUNBOOK.md:169` did. The literal predates this branch, but the acceptance criterion and the commit subject claiming the drift class was closed are new here, so the claim was false when written. Fixed and the file added to the guard, mutation-checked. The reviewer also showed the second review's finding C fix was unpinned prose - deleting both self-review clauses from `carry` section 2 left the suite green - so those two clauses are now asserted, also mutation-checked. `templates/LEXICON.md` gained the `Coordination hand-back` row it was owed under the dogfood boundary, worded generically with no spec link. Independently confirmed by the reviewer: the evidence log is append-only across all seven commits by per-row MD5, with row 4 byte-identical either side of its withdrawal; the guardrail row's 78/100 -> 78/100 reproduces; the frozen v3.1.2 row is load-bearing (removing it flips `origin/main`'s manifest to `invalid-skill-policy`); and a room rebuilt from `origin/main` under these tools returns `valid`, `ok - no blocking finding`, and `next --json` null at exit 0 | `tools/workbench-adoption.mjs`, `tools/test-skill-catalog.mjs`, `templates/LEXICON.md`, and this spec | **Correcting an earlier row in this log:** row 6 says the bump left "nine documented `--version v3.1.2` literals". Nine is the line count; `workbench/tools/workbench-layout.mjs:1062` carries four occurrences on one line, so the total was twelve literals across nine lines. Recorded because this release's history is one of count corrections, and this row is the seventh. Also uncorrected and outside scope: the stale "`main` carries no `workbench/` tree" claim is repeated in the append-only evidence of six completed specs |
| 2026-09-07 | TK-001 | Ticket closed | Full AGENTS.md suite 30/30 green at e8f891a and again after these fixes; three separate-context reviews (9ec4314..a617359, ..7020ed3, ..e8f891a), all findings applied; installer demo writes 34 skills with carry marked release v3.1.3; origin/main rebuilt as a fixture returns valid, doctor ok, next null; both new guards mutation-checked | skills/README.md, README.md, BLUEPRINT.md, LEXICON.md, templates/LEXICON.md, RUNBOOK.md, templates/GENESIS.md, templates/ADOPTION.md, skills/adoption, skills/update-harness, two tool usage strings, three wiki stamps, workbench/manifest.json, benchmarks/RESULTS.md | TK-002 unstarted: carry is unmeasured in real use, which is the point of the spec. carry section 3 boundedness is unpinned prose. The stale main-carries-no-workbench claim survives in six completed specs' append-only evidence |
| 2026-09-07 | spec | Coordination hand-backs for the run that built this spec, recorded under the owner's instruction | **Zero coordination hand-backs.** The owner supplied three decisions and none was routine coordination: the skill's name (Preference - the owner raised it as open); core-bundle versus repo-local placement (Tradeoff - it changes a public contract); and which version carries the seventeen-skill bundle plus whether downstream rooms are on v3.1.2 (Tradeoff, and Unavailable resource - room inventory outside this repository). The owner never repeated a settled decision, located evidence already in the project, reconciled a routine technical finding, or prompted an already-authorized step. **One defect recorded anyway, because it degraded a question rather than causing one:** the placement question was put to the owner with its cost understated, because it was asked before `origin/main` had been checked. Cause: **incorrect** - `S-038` Decisions And Contracts and `README.md:167` both asserted v3.1.2 was an unpublished candidate, and that was read as verified state instead of as a record. Smallest correction, already made: `README.md` and `BLUEPRINT.md` now carry the verified facts, and `carry` section 1 requires reconciling Canon against verified Actuality before the section 4 ask gate applies, which is the step that was skipped | This row is the record; no other owner needed updating for it | **This is not TK-002's measurement.** This run built `carry`; it was not carried under `carry`, so it measures the run that wrote the instrument. TK-002 needs a different assignment executed under the skill. One run is also an anecdote: the advisory this spec came from asked for three comparable assignments before drawing any conclusion |
| 2026-09-07 | TK-001 | Fourth and fifth separate-context reviews APPROVED the candidate; the two Low findings each raised were taken | Review 4 approved `9ec4314..46e3286` with one Low finding - the preamble's "no bare `path:line` citations" claim was false, six sit in this log. Review 5 approved the repair `46e3286..27c82fa` and found the repair itself wrong twice: row 6 also carries an unanchored citation, and the paragraph quoted README as saying "unpublished" when `git show 9ec4314:README.md` says "a local candidate". Both were already taken at `e70926f`, found independently. Review 6 approved `27c82fa..e70926f` with one further Low: row 6 *does* name a commit range, it just does not resolve at that range's head, so "without naming a commit" was the wrong category. Taken here. Review 6 also proved the frozen row load-bearing by deleting it and watching a room rebuilt from `origin/main` flip to `invalid`, confirmed `TASKBOARD.md` byte-identical across two renders, and confirmed the citation guard is not vacuous - a declared anchor pointing past end-of-file fails with a range error | This spec's preamble only; no evidence row touched across `46e3286..HEAD` | **The preamble was wrong three times in three consecutive repairs**, and each was caught by a reviewer or a guard rather than by the writing. The paragraph now records all three. This candidate is not re-reviewed a seventh time for a six-word phrasing swap in a disclosure whose substance review 6 verified correct and pre-dispositioned as optional; the suite is re-run and that reasoning is stated here rather than left implicit |
| 2026-09-07 | TK-002 | Ticket closed | THE ASSIGNMENT: S-045, all six tickets the owner unblocked, plus installing `carry` and three record repairs. Carried end to end under this contract - by hand through step 3, since `/carry` was not in any discovery root until the install this run performed, and as an invocable skill from that point. Endpoint named before starting and reached: every ticket closed with named proof, the spec completed, the work on the declared integration branch. **ZERO COORDINATION HAND-BACKS.** The owner supplied nothing to this run. The only input was the resume phrase; every decision the run needed was already recorded in the assigned spec, the handoff, or the grilling notepad, and everything else was resolved from the project. No question was returned to the owner, so none needs testing against section 4. Ticket ordering, slicing and the install route were treated as the implementing agent`s, which is what the owner said in as many words when a prior session put ordering to them - that hand-back is already recorded in the notepad and is not double-counted here. WHAT WAS RUN, so the zero is checkable rather than asserted: full AGENTS.md suite twice, 30/30 both times, at 55cacb3 and ef44e8e; six red-first tests across three files; six mutations, each confirmed to turn a specific test red and then reverted; the install executed against the real host with HEAD and the Git index asserted byte-identical afterwards. | This row is the measurement, and the run`s findings live in the records they belong to rather than here: S-045 carries TK-005`s restated host record and the correcting row on the seven completed specs, and S-044 carries TK-007`s withdrawal and TK-003`s coverage row. Three defects in the run`s own inputs were found by measuring rather than by reading, and each was repaired in the record that carried it: the two refusal codes never appear together, this host`s gate/installer disagreement runs opposite to the one TK-001 was written for, and the stale `main` claim is in seven specs rather than six and was false when written rather than having gone stale. None of the three cost the owner anything, so none is a hand-back; they are recorded because a run that only reported its successes would make the zero above worth less. | ONE RUN IS AN ANECDOTE. The advisory this spec came from asked for three comparable assignments before drawing any conclusion, and this is the first. It is also a favourable case: the assignment arrived as a written handoff whose Verified section had already paid for the expensive measurements, so this run inherited work whose absence is exactly what would have produced hand-backs. A run that starts from a cold spec with no handoff is the harder test and has not been done. The zero is also self-scored - `tools/test-skill-catalog.mjs` pins that `carry` names the four reasons and the four causes, but no test can check that an agent classified a hand-back correctly or noticed one it should have recorded. |
| 2026-09-07 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

**What changed.** `carry` exists as the seventeenth core-bundle skill, the
bundle validates end to end without redefining any frozen legacy policy, and the
skill has now been carried once in real use with its coordination record taken.

**The measurement, which is the point of the spec.** One assignment - S-045,
six tickets plus an install and three record repairs - was carried to its
authorized endpoint and produced **zero coordination hand-backs**. The evidence
row for TK-002 names what was run so the zero can be checked rather than
believed.

**What the zero is worth, stated plainly.** One run is an anecdote, and this
one was the easy case: the assignment arrived as a written handoff whose
Verified section had already paid for the measurements whose absence is what
would have produced hand-backs. The instrument now exists and has been used
once. Whether it shows anything is a question for the next two runs, and the
harder test is a cold spec with no handoff in front of it.

**Verification.** TK-001's proof stands as recorded: the full `AGENTS.md` suite
30/30 at `e8f891a`, six separate-context reviews, both new guards
mutation-checked, and `origin/main` rebuilt as a fixture returning valid. TK-002
adds two more green 30/30 runs of the same suite, at `55cacb3` and `ef44e8e`.

## Remaining Limitations Or Follow-Up Specs

- **The skill is unmeasured.** Everything here proves the bundle grew correctly
  and the contract text is pinned. Nothing yet proves a `carry` run reduces
  what an assignment costs the owner. TK-002 is the first measurement, and one
  run is an anecdote; the advisory this came from asked for three comparable
  assignments before drawing any conclusion.
- **A static test cannot check judgment.** `tools/test-skill-catalog.mjs` pins
  that `carry` names the four ask-reasons and the four causes. It cannot check
  that an agent classified a given hand-back correctly, or that it did not
  quietly answer one with a new framework. That check is the reader's.
- **Hand-back rows are per-spec by design, so there is no cross-run view.**
  Aggregating them is deliberately out of scope until enough runs exist to know
  what a useful aggregate would be.
- **A frozen legacy row constrains only downward.** `accepted` is
  `[current policy, frozen row]`, so a v3.1.2 manifest validates at sixteen
  *or* at the current seventeen; only the twelve-skill bundle is refused. That
  is long-standing behaviour this spec did not introduce and did not tighten -
  tightening it would change how every listed legacy version validates, which
  is outside a spec about growing the bundle. Named here so the freeze is not
  read as stronger than it is.
- **`unverified-provenance` is still reported.** This room's
  `provenance.source.release` is `v3.1.0`, the release it was adopted from,
  and the finding fires whenever that differs from `workbenchVersion`. It was
  already firing at v3.1.2. Repairing it would mean recording a source
  identity this room does not have.

## Supersession

None.
