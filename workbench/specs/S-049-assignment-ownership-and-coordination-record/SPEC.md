# S-049 - Assignment Ownership And The Coordination Record

**Spec ID:** S-049
**Status:** active
**Priority:** 2
**Owner:** claude
**Stance:** Builder
**Updated:** 2026-09-07
**Catalog description:** Give an assigned spec or ticket an invocation that carries it to its already-authorized endpoint and records, per occurrence, every point where the owner still had to supply routine coordination.
**Blockers:** none
**Latest event:** Owner unblocked TK-001: the seventeen-skill bundle is v3.1.3 and v3.1.2 is frozen at sixteen.
**Next gate:** Close TK-001 with the full suite green at v3.1.3; TK-002 waits on a real assignment.

This spec carries no bare `path:line` citations. Every reference below names a
file, not a position, so no anchor declaration is required and none goes stale
at the next merge.

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
| TK-001 | `/carry` exists as a discoverable core skill and the seventeen-skill bundle validates end to end without redefining any frozen legacy policy | in-progress | none | pending |
| TK-002 | One real assignment is carried under `/carry`, and its hand-backs - or the recorded absence of any - are the first measurement | ready | none | pending |

## Acceptance Criteria

- [ ] `skills/carry/SKILL.md` exists with frontmatter, names the assigned spec
      and its two `spec-workbench.mjs` entry points, the declared integration
      branch as the endpoint, the four reasons the owner is asked, the four
      cause classifications, the evidence log as the record's home, and the
      feedback report format as the escalation route.
- [ ] `tools/test-skill-catalog.mjs` pins all seventeen skills and the `carry`
      contract above, and passes.
- [ ] `skills/README.md`, `LEXICON.md`, `RUNBOOK.md`, `templates/GENESIS.md`
      and `workbench/manifest.json` all state seventeen consistently.
- [ ] The layout suite proves a v3.1.1 manifest and a v3.1.2 manifest are both
      valid at the frozen sixteen and invalid at the current seventeen, and
      that the current version is valid only at seventeen.
- [ ] `origin/main`'s own manifest, extracted to a fixture, validates against
      this candidate - the regression that blocked TK-001 is gone.
- [ ] `README.md`, `BLUEPRINT.md` and `workbench/manifest.json` agree that the
      current harness version is v3.1.3.
- [ ] The full verification suite named in `AGENTS.md` is green, and `doctor`
      reports no blocking finding.
- [ ] TK-002 closes with a named assignment, the hand-backs it produced with
      their causes and corrections, or an explicit "none, and here is what was
      run" - not a summary of the delivery.

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
- `LEXICON.md` - core skill bundle count, and the new `Coordination hand-back`
  core term.
- `RUNBOOK.md` - core-skill setup check count.
- `templates/GENESIS.md` - the exact skill-policy count a Genesis room asserts.
- `BLUEPRINT.md` - spec catalog row.
- `workbench/manifest.json` - this room's required skill policy.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-07 | spec | Created under owner direction to own a `carry` invocation and the coordination record it produces | The owner's instruction was traced to its source before any design: it is verbatim from the 2026-09-06 advisory conversation preserved in `workbench/feedback/llm-workbench-decision-recovery.zip`, whose framing is that the principles are already written and what is missing is evidence of how much coordination remains the owner's. Three existing skills were read and rejected as owners - `implement` (one ticket's red/green loop), `make-it-so` (input is unsettled decisions needing promotion), the stances (method, not endpoint ownership). Two owner decisions were taken rather than assumed: the name `carry` from four candidates, and core-bundle placement over a repo-local skill | Spec created; Documentation Impact lists the six owners the change touches | TK-002 has no measurement yet; the skill is unproven in real use |
| 2026-09-07 | TK-001 | Skill, bundle growth and full suite green at `a617359`; then a self-check found this spec's own version claim false and blocked the ticket | Full suite 30/30 green at `a617359`, including `doctor`. Demo artifact: `core-skill-installer.mjs install` into a disposable home wrote 34 skills - seventeen into each of `.agents/skills` and `.claude/skills` - with `carry` carrying a schema 2 marker at release `v3.1.2`, commit `a617359`. The green suite did not catch the real defect: `git ls-tree origin/main` shows `main` carries `workbench/manifest.json` at `v3.1.2` with sixteen skills, so S-038's "main carries no workbench root" is stale and this spec repeated it without checking. Reproduced by extracting `origin/main` to a fixture and running `workbench-layout.mjs validate` from this candidate: `invalid-skill-policy`. No test covers it because every fixture builds its manifest from the live `coreSkills`, so no test ever validates a manifest the current bundle did not write | Current Verified State corrected with the verified facts; the v3.1.2 placement decision marked WITHDRAWN rather than edited away; Dependencies And Blockers now carries the three costed resolutions | The version decision is the owner's and TK-001 cannot close without it. Also uncorrected: `README.md` still calls v3.1.2 "a local candidate", which the same evidence contradicts - out of this spec's scope to fix, and named here so it has an owner |
| 2026-09-07 | TK-001 | Owner chose v3.1.3 with v3.1.2 frozen; implemented, and one of this branch's own new assertions was wrong | Red first: `outcome('v3.1.2', sixteen)` returned `invalid-skill-policy` before the frozen row and `valid` after. `origin/main` extracted to a fixture now validates against this candidate, so the regression that blocked TK-001 is gone. A second assertion added in the same edit - `outcome('v3.1.2', current) === 'invalid-skill-policy'` - was false and was removed rather than accommodated: `accepted` has always been `[current policy, frozen row]`, so every listed legacy version also validates at the current policy. Proved pre-existing rather than assumed, by initializing a v3.1.3 room, relabelling its manifest `v3.1.1` while keeping the seventeen-skill policy, and getting `valid` - and by reading the same `const accepted` line at `9ec4314`. The version bump also broke three wiki stamps and the Taskboard projection | `README.md` and `BLUEPRINT.md` moved to v3.1.3 and stopped calling v3.1.2 an unpublished candidate; the three `workbench/wiki` contract stamps re-stamped; `render` re-run | `unverified-provenance` still reports `provenance.source.release "v3.1.0"` against `workbenchVersion v3.1.3`. Pre-existing and attention-only - the condition is `source.release !== workbenchVersion`, which already held at v3.1.2 - and left alone because v3.1.0 is the release this room was actually adopted from |

## Completion Result

Pending.

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
