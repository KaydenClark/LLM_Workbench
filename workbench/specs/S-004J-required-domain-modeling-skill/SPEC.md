# S-004J - Required Domain Modeling Skill

**Spec ID:** S-004J
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Ship domain modeling in every room's skills lane as the Align companion that shows the downstream consequences of an upstream name, boundary or relationship before it settles, and hands settled meaning to promotion instead of writing Canon inline.
**Blockers:** none
**Latest event:** Assigned Director authorized one isolated source checkpoint from integration ef704e366da478f5d5ecfdab0947ab16d2520f0e; native activation and claim follow the executable plan below.
**Next gate:** Claim TK-006U natively, stage and verify the source contract; wait for the Director's shared writer slot before managed distribution.

> **Citation anchors.** pre=`46ad978956a74a3ee1bda22c36eb16207dcd98fd` post=`46ad978956a74a3ee1bda22c36eb16207dcd98fd`.

## Outcome

Every room's skills lane carries a `domain-modeling` skill that a fresh clone
discovers. The owner invokes it beside grilling when he is reworking something:
before a name, boundary or relationship settles, the agent shows which owners,
Specs, source identifiers and tests would read it or break on it, so the choice
is made with its consequences visible while changing course is still cheap. It
also challenges conflicting and overloaded words, probes boundaries with
concrete edge cases and checks claims against source. It writes no Canon while
the concept is being aligned. Settled meaning reaches its owner through the
ordinary promotion route, and a consequential choice is offered as an ADR or a
DDR by the decision-record scope test.

## Why It Matters

The owner, 2026-09-29: "domain modeling is required workbench skill. I use it
in grilling sessions all of the time. its my skill for when I want to rework
something, and I want to understand the downstream impacts of my choices while
I am still upstream. I want to know the consequences for picking the names I
do. stuff like that. That is how I thought it worked."

Today that behavior exists only as the owner's personal installed copy. The
destination says a behavior agents need ships inside every room and the
personal catalog is a backup, never a dependency
([DDR-000J](../../docs/ddr/000J-the-behaviors-agents-need-ship-inside-every-room.md),
[ADR-000M](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md)).
A cloud session started from the repository cannot invoke a skill the room does
not ship. The owner also asked that it work closer to Matt Pocock's skill (the
owner, 2026-09-29): "We need ours to be working closer to his, just with the
parts of the workbench that is mine."

## Current Verified State

Checked at the pre anchor unless a line says otherwise.

- **Lane and bundle.** `workbench/manifest.json` `skillPolicy.required` lists 27
  skills and `workbench/skills/` holds 27 skill directories; neither contains
  `domain-modeling`. The bundle is built from `coreSkills` in
  `workbench/tools/workbench-layout.mjs`.
- **Catalog and grilling.** The referenced-skills table in
  [the skills catalog](../../skills/README.md) lists `domain-modeling` as an
  optional mention from grilling. [Grilling](../../skills/grilling/SKILL.md)
  says the `domain-modeling` and `wayfinder` skills "may challenge a concept or
  narrow an oversized inquiry, all within the caller's authorization", and that
  a settled term does not authorize a Canon write.
- **Pending source.** `skills-pending/domain-modeling/` keeps Matt's older
  `CONTEXT.md` and local `docs/adr/` shape outside discovery. Its retention or
  removal is owner-gated under
  [Core Skill Lifecycle And Optional Source Disposition (S-00R)](../S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md);
  the Grill Board item GB-0019 for that decision is open.
- **Personal copy** (read-only, the owner's catalog outside this repository):
  `domain-modeling/SKILL.md` with `ADR-FORMAT.md`. It names `LEXICON.md` and a
  `docs/adr/` route, tells the agent to update the Lexicon inline when a term
  resolves, and offers ADRs only.
- **Unmerged candidate.** The superseded S-002H lane staged a rewritten source
  at `workbench/specs/S-002H-domain-modeling-skill/candidate/domain-modeling/SKILL.md`
  with a scoped test `tools/test-domain-modeling-candidate.mjs`, recoverable at
  PR #251's head `e3e0b5f068bff80861d68c254441b2c94d7015fb` (branch
  `codex/s002h-current-base`). It adds the downstream-consequence trace the owner
  described. It also routes decisions to ADRs only and lets an authorized
  documentation pass edit the Lexicon inline, which the Decisions below replace.
  Its Spec rows on that branch record one fresh-context run per scenario with
  one model; that is input, not proof.
- **Neighbor skills.** The personal `lexicon` skill routes "to settle a term as
  a decision forms" to `/domain-modeling`. Their alignment Specs,
  [lexicon skill alignment (S-003O)](../S-003O-lexicon-skill-alignment/SPEC.md)
  and [ubiquitous-language skill alignment (S-003L)](../S-003L-ubiquitous-language-skill-alignment/SPEC.md),
  read this skill's boundary for their keep, fold or retire verdicts.
- **Wiki.** [Domain Modeling article](../../wiki/skill-domain-modeling.md)
  explains the method and Matt's comparison; this pass points it at this Spec.

## Desired Behavior

1. **Ships in every room.** The skill lives at `workbench/skills/domain-modeling/`,
   joins the required bundle and is discovered from a fresh clone through the
   tracked `.agents/skills` and `.claude/skills` adapters. The personal catalog
   stays a backup.
2. **Reached from the Contract.** A row of the RUNBOOK operations index points to
   it for the operation it performs, so its write boundary carries Contract
   force while it runs; a lane skill no carrier points to teaches but does not
   instruct ([ADR-000W](../../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)).
3. **Trace consequences upstream.** Before an upstream name, boundary or
   relationship settles, follow it to the owners that would read it (Lexicon
   rows, Specs and acceptance lines, decision records, Wiki pages, source
   identifiers, tests) and put the few consequences that could change the
   choice in front of the owner, with the file or line behind each. This is a
   bounded trace, not a whole-room audit.
4. **Keep Matt's active moves.** Challenge a word used against its accepted
   meaning; split an overloaded word into candidate names; probe a relationship
   with a concrete edge case; check a stated behavior against source and tests
   and classify it as agreement, documentation drift, implementation gap or
   unresolved contradiction, as `AGENTS.md` State Resolution names them. Ask one
   question at a time inside grilling's rhythm.
5. **Write nothing during Align.** Pending interpretations and open questions
   stay in the objective's notepad or its question card; the Lexicon holds
   settled meaning only. A settled shared term reaches `LEXICON.md`, a
   capability-local meaning its Spec and an explanation the Wiki, through
   promotion or scoped Task work once the answer is locked and confirmed, never
   as an inline edit from the modeling conversation.
6. **Offer decision records sparingly.** Offer one only when the choice is hard
   to reverse, surprising without context and a real tradeoff, naming the test
   that fails otherwise. Choose ADR or DDR by the scope test (would it still
   hold if the architecture were rebuilt differently?) and write it through
   `to-docs` with `adr.mjs` at Map.
7. **A companion, not a dependency.** The owner or a caller invokes it; grilling
   and the destination-question-card flow complete without it.
8. **No parallel stores.** No `GLOSSARY.md`, `CONTEXT.md`,
   `UBIQUITOUS_LANGUAGE.md`, context map or local `docs/adr/`.

## Decisions And Contracts

Each decision below has an owner answer; none is open.

- **Required room skill.** The owner, 2026-09-29 (quoted above); needed
  behaviors ship in every room (DDR-000J); and the owner's locked portable-workbench
  answer PW-4 in the [grilling destination ledger](../../sessions/grilling-destination-audit-ledger.json):
  "If we need it, it should be included in workbench/skills."
- **Its job is upstream consequence-tracing.** The owner's 2026-09-29 words above.
- **Closer to Matt, adapted to this room.** The owner's 2026-09-29 words above;
  adapt from `mattpocock/skills` at a pinned revision and keep attribution in
  `THIRD_PARTY_NOTICES.md`.
- **Not required in the question-card flow.** Locked answer GX-2 (2026-09-29):
  "Domain-modeling stays available but is not required in this flow." The owner
  the same day: "Domain modeling isnt prohibited."
- **No inline Canon writes.** Locked answer FND-Q13: "A grilling answer does not
  enter Canon inline"; and
  [ADR-000Y](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md):
  promote ends a grilling, and a locked and confirmed answer is promoted with
  no further ceremony.
- **Lexicon holds settled meaning only.** Locked answer FND-Q09.
- **ADR or DDR.** [ADR-000S](../../docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md)
  sets the scope test; [ADR-000X](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)
  writes decision records at Map; ADR-000Y point 2 routes them through `to-docs`.
- **Release.** Joining the core bundle changes the bundle identity, which needs
  a version label under RUNBOOK
  [Release Identity](../../../RUNBOOK.md#release-identity). This Spec assigns no
  release; the release owner does.
- **Ownership.** This Spec owns the `domain-modeling` skill only. S-003L and
  S-003O own `ubiquitous-language` and `lexicon`; S-00W owns grilling
  composition; S-00R owns the pending source; S-01U owns the Lexicon's own
  reconciliation. The pending source stays where it is.

## Non-Goals

- Editing `LEXICON.md`, `lexicon`, `ubiquitous-language`, `grilling` or the
  personal catalog, or deciding the neighbors' verdicts.
- Removing or relocating `skills-pending/domain-modeling/`.
- Making the skill a required step of grilling or the question-card flow.
- Assigning a release, bumping a version or promoting to main.

## Dependencies And Blockers

No unanswered owner decision. Coordinate one writer with any concurrent lane on the bundle,
catalog and count-bearing files (`workbench/manifest.json`,
`workbench/tools/workbench-layout.mjs`, `workbench/skills/README.md`, RUNBOOK's
operations index), and with S-00R on the pending source. S-003L and S-003O
read this skill's delivered boundary.

### 2026-10-06 isolated source writer disposition

The current assignment explicitly authorizes activation/planning and independent
Spec-owned source/tests in an isolated non-main branch. It permits a partial
source checkpoint while the distribution writer slot is unavailable. Dispatcher
is the sole writer of this Spec, its Task records and generated projections;
one serial Builder Worker writes only the candidate source and scoped test.
No parallel group is released.

No safe slot is established for `workbench/manifest.json`,
`workbench/tools/workbench-layout.mjs`, `workbench/skills/README.md`, count-bearing
documents/templates or RUNBOOK's operations index. The scheduled S-003Z
TK-008D writer holds manifest/layout/runtime files at
`97ad26c8eb661843ef88fdfaa7fca87e19332897`; S-004L TK-008L holds
bundle/catalog/count files at `61ed0855b6edba0fd4155c0de86c36c84bcc078d`,
with S-004M's manifest/diagnostics work reserved next. S-004C's separate writer
holds AGENTS/RUNBOOK/LEXICON changes. These paths, neighboring skills, the
shared Wiki router, pending/personal source and other Specs stay untouched.
The release identity stays with S-00O. No scheduled Claude lane is changed or
contacted. The Director must establish the shared writer slot before that
unfinished work can proceed.

Fresh-context disposable-room scenarios, final Wiki reconciliation, assembled
Verify review, integration delivery, owner Human QA and owner main verification
remain open. Structural source checks do not establish conversational behavior
or whole-Spec acceptance. No acceptance box is checked by this source checkpoint.

## Vertical Implementation Slices

One authorized source Task is cut from live Actuality at activation with
`/to-tasks`; its staged contract is a checkable partial checkpoint, not a claim
that a managed room can invoke the skill. [TK-006U — Stage the accepted domain
modeling contract](tasks/TK-006U/TASK.md) advances the source behavior and keeps
its unexercised conversational proof open. It continues until its named proof
holds; later distribution, routing and Wiki work is uncut while the required
writer slot remains unavailable. Execution is serial with Dispatcher owning
Spec/Task/projections and the Worker owning the two source/test paths.

Remaining direction: managed distribution plus catalog/count/operations routing;
fresh-context disposable-room scenarios; final Wiki article reconciliation.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [ ] A fresh clone discovers `domain-modeling` through both adapters; the
  manifest, layout bundle, catalog and count-bearing documents agree.
- [ ] A RUNBOOK operations index row points to the skill.
- [ ] In a grilling scenario, a proposed rename or boundary is traced to named
  owners, identifiers and tests before the owner chooses, and the room diff stays
  empty.
- [ ] A conflicting term, an overloaded term and an edge case each draw a
  specific challenge; a stated behavior is classified against named source.
- [ ] After a locked and confirmed answer, the settled term reaches the Lexicon
  only through promotion or a scoped Task; no inline Lexicon write occurs.
- [ ] An easily reversed, an unsurprising and a no-alternative choice each fail
  the decision-record offer; a qualifying one is offered as ADR or DDR by the
  scope test.
- [ ] Grilling completes without the skill; no parallel terminology store is
  created.
- [ ] The Wiki article separates upstream method, Workbench adaptation and
  verified behavior and limits.

## Testing Seams

A scoped source test over the lane `SKILL.md` (operating contract and absent
parallel stores); `tools/test-skill-catalog.mjs`, `tools/test-workbench-layout.mjs`
and `tools/test-skills-lane.mjs` for distribution; fresh-context agents in
disposable rooms with scripted owner turns for behavior, asserting observed
turns and room diffs, not exact prose. Structural checks prove routing, not
conversation.

## Verification Procedure

Capture guardrail and self-drift baselines, demonstrate each red, implement,
rerun the targeted test, then the full suite in RUNBOOK Test And Build from a
committed candidate, Wiki validation, `render` and `doctor`, and the post
self-drift receipt. Record scenario transcripts and limits. Separate-context
review before integration; owner Human QA decides approval.

## Documentation Impact

Delivery maintains the skill source, the skills catalog, count-bearing
documents, the RUNBOOK operations index row, the
[Domain Modeling article](../../wiki/skill-domain-modeling.md) and its router.
Record `Docs checked; no update needed` for any other owner checked.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-04 | planning | Authored from the owner's remap direction, replacing S-002H; no Task cut | Live sources read at 46ad9789: manifest, layout, skills catalog, grilling, pending source, ledger answers PW-4, GX-2, FND-Q09 and FND-Q13, DDR-000J, ADR-000M, ADR-000S, ADR-000W, ADR-000X, ADR-000Y; PR #251 candidate at e3e0b5f0; personal copy read-only | Spec authored; Wiki article and router now point here | Activation, Tasks, delivery and every verification gate |
| 2026-10-06 | planning | Assigned non-Astra Director released one isolated staged-source Task and authorized native activation; no shared writer slot | Actuality ef704e366da478f5d5ecfdab0947ab16d2520f0e; native remote claims contain no S-004J claim; next-id proposed TK-006U with no visibleIdKey alias across local and remote tips (first-free allocator, not the handoff's TK-008Y expectation); PR #251 input e3e0b5f068bff80861d68c254441b2c94d7015fb, inherited source commit 84779a9058727c40db9c0077f5c19f3bd1b42a5e by r; pre guardrail 73/100; pre self-drift blocked/cleanUpdate false with 21 findings (10 blocked-slice, 5 stale-claim, 5 stale-seed, 1 unverified-provenance), receipts at /Users/kayden/Documents/Codex/2026-10-06/task-2/s004j-evidence | Source/Wiki/controls checked; only S-004J records and derived board/catalog may change during planning; generic mirrors exempt because this is isolated room-specific source scaffolding | Shared writer slot, distribution/Runbook, fresh-context proof, Wiki reconciliation, release identity, Verify review, integration and owner gates; no clean-update or outcome claim |

## Completion Result

Not complete.

## Supersession

- Supersedes: S-002H (Domain Modeling Skill for the Workbench)
- Superseded by: none
