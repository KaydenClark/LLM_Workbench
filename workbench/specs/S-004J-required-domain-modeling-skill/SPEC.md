# S-004J - Required Domain Modeling Skill

**Spec ID:** S-004J
**Status:** active
**Priority:** 2
**Owner:** claude-s004j-worker-fix
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Ship domain modeling in every room's skills lane as the Align companion that shows the downstream consequences of an upstream name, boundary or relationship before it settles, and hands settled meaning to promotion instead of writing Canon inline.
**Blockers:** none
**Latest event:** TK-00JB claimed by claude-s004j-worker-fix.
**Next gate:** Close TK-00JB with verification and documentation proof.

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

At refreshed integration `42431879fab3057db9e26ae661b4e92512c281f0` on 2026-10-06, the required bundle contains 28 skills and still lacks `domain-modeling`. The original 27-skill observation above stays dated to its pre anchor. The glossary destination is accepted in [refined DDR-001E](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md), with migration owned by [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../S-004O-lexicon-retirement-and-architecture-md/SPEC.md); neither new root owner exists at this integration base. Read [Matt's pinned glossary-based source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/SKILL.md) and [format](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md) rather than treating the old CONTEXT source or rewritten PR #251 candidate as the adoption baseline.

At assembly candidate `345e8754556bb7fade26f2cc1f8fad919136af61` on 2026-10-07, `workbench/skills/domain-modeling/` ships in the lane, the manifest's required bundle holds 29 skills including `domain-modeling`, and a fresh clone resolves the same `SKILL.md` bytes through `.agents/skills` and `.claude/skills`. Root `GLOSSARY.md` is still absent at this base, so the skill reads the current Lexicon; the promote tool's root-glossary destination belongs to S-004O.

At integration `c80cb282` on 2026-10-07 (PR #415 merged), the required bundle holds 30 skills with `domain-modeling` and then `pr` after `improve-harness`; assembled review 1, re-pinned to the merged head `d8b17a6a`, failed on the in-room MIT notice and four should-fix gaps, so the Tasks continue on `claude/s004j-corrections`.

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
   relationship settles, follow it to the owners that would read it (current vocabulary
   definitions and their glossary destination, Specs and acceptance lines, decision records, Wiki pages, source
   identifiers, tests) and put the few consequences that could change the
   choice in front of the owner, with the file or line behind each. This is a
   bounded trace, not a whole-room audit.
4. **Keep Matt's active moves.** Challenge a word used against its accepted
   meaning; split an overloaded word into candidate names; probe a relationship
   with a concrete edge case; check a stated behavior against source and tests
   and classify it as agreement, documentation drift, implementation gap or
   unresolved contradiction, as `AGENTS.md` State Resolution names them. Ask one
   question at a time inside grilling's rhythm.
5. **Preserve capture and promotion.** Intent, pending interpretations and
   proposed vocabulary stay in the objective's notepad; explicit confirmation
   settles meaning. Promotion moves confirmed canonical project vocabulary to
   `GLOSSARY.md`, capability requirements to their Spec and richer explanation
   to the Wiki under [the refined retirement decision](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md).
   The skill adds no inline glossary-writing exception. Before migration, read
   the current Lexicon rather than pretend the glossary is delivered.
6. **Offer decision records sparingly.** Offer one only when the choice is hard
   to reverse, surprising without context and a real tradeoff, naming the test
   that fails otherwise. Choose ADR or DDR by the scope test (would it still
   hold if the architecture were rebuilt differently?) and write it through
   `to-docs` with `adr.mjs` at Map.
7. **A companion, not a dependency.** The owner or a caller invokes it; grilling
   and the destination-question-card flow complete without it.
8. **One vocabulary owner.** Follow S-004O's canonical glossary destination
   and linked Wiki explanations; create no shadow `CONTEXT.md`,
   `UBIQUITOUS_LANGUAGE.md` or local `docs/adr/`. Root glossary placement is
   settled for a single-context room. Actual multi-context layout is inspected
   at Plan; do not infer an unapproved map or new ADR collection.
9. **Minimal source adaptation.** Preserve Matt's active method and glossary
   format. Record each necessary Workbench adapter: capture/promotion instead
   of inline writes, manifest decision-record owners and ADR/DDR scope, and the
   owner's upstream consequence tracing. Retain source pin and credits; do not
   duplicate unrelated Workbench policy in the imported instruction body.

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
- **Canonical vocabulary destination.** Refined DDR-001E owns the confirmed 2026-10-06 glossary/Wiki/architecture split. It replaces this Spec's former blanket ban on `GLOSSARY.md`; FND-Q09's settled-meaning boundary remains. Inline capture remains deferred.
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
  reconciliation and S-004O owns its retirement and new vocabulary layout. The pending source stays where it is.

## Non-Goals

- Performing the glossary migration, rewriting canonical definitions or editing `LEXICON.md`, `lexicon`, `ubiquitous-language`, `grilling` or the
  personal catalog, or deciding the neighbors' verdicts.
  Bounded exemption (recorded 2026-10-07 after assembled review 1): the core-bundle count token in `LEXICON.md`'s Core skill bundle row changes with the bundle, because `tools/test-skill-catalog.mjs` derives it from the runtime and acceptance line 1 requires count-bearing documents to agree; no other Lexicon text changes.
- Removing or relocating `skills-pending/domain-modeling/`.
- Making the skill a required step of grilling or the question-card flow.
- Assigning a release, bumping a version or promoting to main.

## Dependencies And Blockers

No owner blocker. Coordinate one writer with any concurrent lane on the bundle,
catalog and count-bearing files (`workbench/manifest.json`,
`workbench/tools/workbench-layout.mjs`, `workbench/skills/README.md`, RUNBOOK's
operations index), and with S-00R on the pending source. S-003L and S-003O
read this skill's delivered boundary. Coordinate with S-004O for vocabulary layout and
consumer migration; a missing glossary is an implementation dependency, not an
open owner choice. Do not ship references to an absent vocabulary owner or
remove the Lexicon fallback before migration is verified. Promotion into a root `GLOSSARY.md` through the `promote` tool depends on S-004O adding the glossary to the layout's accepted root owners (its TK-009E); until then the scenario proof verifies tool promotion only for the Lexicon fallback, and the glossary variant reached `GLOSSARY.md` only by a manual write at the authorized boundary after the tool refused.

## Vertical Implementation Slices

Tasks cut at activation on 2026-10-06: [TK-00JA](tasks/TK-00JA/TASK.md) ships the adapted source with its bundle, catalog, count and operations-index distribution; [TK-00JB](tasks/TK-00JB/TASK.md) proves behavior in fresh-context disposable rooms; [TK-00JC](tasks/TK-00JC/TASK.md) reconciles the Wiki article. Draft PR #374 (TK-006U, on `codex/s004j-domain-modeling-source-20261006`) staged the superseded PR #251 baseline and stays historical input, unmerged here.
Planning direction at authoring: (1) lane source from Matt's pinned glossary-based source,
with justified minimal Workbench adapters and scoped tests red then green; use
PR #251 only as historical consequence-tracing input; (2) bundle, catalog,
counts and the operations index row; (3) fresh-context scenarios in disposable
rooms; (4) Wiki article reconciliation.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [x] A fresh clone discovers `domain-modeling` through both adapters; the
  manifest, layout bundle, catalog and count-bearing documents agree.
- [x] A RUNBOOK operations index row points to the skill.
- [ ] In a grilling scenario, a proposed rename or boundary is traced to named
  owners, identifiers and tests before the owner chooses, and the room diff stays
  empty.
- [x] A conflicting term, an overloaded term and an edge case each draw a
  specific challenge; a stated behavior is classified against named source.
- [ ] A pending term and its correction remain in the notepad; confirmation
  records settled meaning and promotion reaches the canonical glossary only at
  the authorized boundary. No inline Canon or glossary write occurs.
  - QA scope: the recorded local glossary scenarios used an authorized manual write after `sessions.mjs promote` refused the root glossary destination. The skill boundary passed; the runtime glossary route remains owned by S-004O, with no tool-based promotion or cloud reliability claim. Curated proof retains observed replies, notepads and room diffs; original tool-result streams are not committed.
- [ ] Source and format comparison records the pin, credits and each necessary
  adapter; the upstream language challenges, scenario probes and code checks
  are preserved without unrelated policy rewrites.
- [x] An easily reversed, an unsurprising and a no-alternative choice each fail
  the decision-record offer; a qualifying one is offered as ADR or DDR by the
  scope test.
- [x] Grilling completes without the skill; no parallel terminology store is
  created.
- [ ] The Wiki article separates upstream method, Workbench adaptation and
  verified behavior and limits.

## Testing Seams

A scoped source test over the lane `SKILL.md` (operating contract and absent
shadow stores and preserved glossary format); `tools/test-skill-catalog.mjs`, `tools/test-workbench-layout.mjs`
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
| 2026-10-06 | planning | Reconciled the confirmed glossary destination and capture correction; replaced the blanket glossary ban and old-candidate adoption baseline. | Current bundle and root vocabulary owners inspected at integration 42431879fab3057db9e26ae661b4e92512c281f0; Matt source and GLOSSARY-FORMAT inspected at d81f3a183412e71a5b1e84ca21bc1a35eea03a60. No delivered behavior claimed. | Existing Spec and Domain Modeling article reconciled; DDR-001E and S-004O own vocabulary destination. | Activation, Tasks, migration coordination, skill distribution and behavioral proof. |
| 2026-10-06 | planning-check | Verified documentation reconciliation; all delivery acceptance remains open. | Source `3d40a86505a339096c4629b814eb4fed1c789d5d`: full suite 53/53; ADR/Wiki, citation and diff checks passed. [Shared planning receipt](../S-004O-lexicon-retirement-and-architecture-md/proof/planning-verification.json) preserves the initial Blueprint-link failure, repair, bounded self-drift summaries and existing doctor findings. | Source owners read back; render regenerated projections. | No implementation, independent assembled review, PR or integration delivery claimed; self-drift remains 15 findings and cleanUpdate false. |
| 2026-10-06 | activation | Activated under the owner's `/implement-spec` launch and cut TK-00JA, TK-00JB and TK-00JC with `convert-tasks --activate`; assembly branch `claude/s004j-assembly` from integration `9b524db3` plus the glossary planning commits at `a7d1ef18`. IDs chosen outside the sequential range to avoid collision with two concurrent Dispatchers. | Task IDs checked free across every `origin/*` tip and local Codex worktrees; draft PR #374 (TK-006U) read and left as historical input. | Spec header, slice section and three Task records. | Every delivery, verification and review gate. |
| 2026-10-07 | TK-00JA | Task closed | Full RUNBOOK suite 54/54 on clean bac6db41; scoped domain-modeling 10/10 red-then-green; catalog, skills-lane, layout, runbook-index and installer green; fast-forward into assembly verified at bac6db41 | Skill source, catalog, count tokens, root and template RUNBOOK index row and suite list; THIRD_PARTY_NOTICES and AGENTS checked, no update needed | Behavior proof TK-00JB and Wiki TK-00JC; two Wiki pages still say 28 skills; release identity is the release owner's |
| 2026-10-07 | TK-00JB | Task closed | Eight fresh-context sessions in disposable rooms with installed discovery: all five scenarios PASS (capture and promotion 4/4); full RUNBOOK suite 54/54 on clean c9905d94; fast-forward into assembly verified | proof/scenario-evidence.md with per-scenario observations, curated runs and room/runner scripts; skill checked, no correction needed | promote refuses root GLOSSARY.md until S-004O adds it to the layout controls; single model and run counts, scripted owner, local sessions; Wiki TK-00JC |
| 2026-10-07 | TK-00JC | Task closed | Wiki validate clean, test-wiki 25/25, full RUNBOOK suite 54/54 on clean 989f1b09; article separates upstream method, Workbench adaptation and verified behavior and limits; fast-forward into assembly verified | Domain Modeling article, Wiki router lines, current bundle counts in four Wiki pages; dated count history checked, no update needed | Assembled code review and owner Human QA; promote GLOSSARY.md destination owned by S-004O; release identity unassigned |
| 2026-10-07 | assembly | All three Tasks assembled; integration `621524d9` merged forward into assembly as `345e8754`; acceptance boxes checked against the TK-00JA, TK-00JB and TK-00JC close rows and a fresh clone. | Full RUNBOOK suite 54/54 on clean `345e8754`; fresh `git clone` of `claude/s004j-assembly` at `345e8754` resolves `domain-modeling/SKILL.md` (sha256 `2cf6f46e…5a41`) identically through both adapters and the lane, manifest required 29 with `domain-modeling`. | Spec header, current state line and Completion Result; no other owner changed. | Building-side assembled code review, correction pass, integration review and owner Human QA; promote root-glossary destination (S-004O); release identity (release owner). |
| 2026-10-07 | conflict repair | Merged integration 6101c237 into assembly; retained both required skill additions and exact pre-merge transition policies | Domain-modeling source 10/10; new prior29 regression tests fail on both parent policies before adding the transition cohorts; catalog check exposed the missing twenty-two word token | Counts reconciled to 30, both skill catalog/router entries retained; Docs checked; skill and glossary semantics need no update because the repair preserves them | Final committed checks and fresh assembled integration review remain pending; owner Human QA and release identity unchanged |
| 2026-10-07 | conflict repair | Preserved concurrent remote assembly a5320505 and corrected independent review finding at 9d15b738 | Initial review FAIL: current Domain Modeling article still named 29 skills; changed to 30; partial suite on 9d15b738 stopped to verify the combined remote candidate, no full-pass claim | Skill article count corrected; acceptance 5 explicitly scopes the manual glossary-write proof and unavailable original tool-result streams | Final full suite and fresh content-bound review pending; S-004O runtime glossary route, owner Human QA and release remain open |
| 2026-10-07 | review | Review verdict: pass at f6461f5cb5dc6751b4473dc9fcd23e08d603306b [f07e8bcbee35] #1 | Fresh Codex independent final review PASS: no findings. Full RUNBOOK54/54 at clean f6461f5c; source10/10, catalog3/3, frozenlegacy/prior28/bothprior29 checks4/4 independently pass. Actual published evidence history CLEAN; no new self-drift findings (base23/final22, render-drift removed), cleanUpdate false. Original scenario tool-result streams unavailable; curated replies/notepads/diffs support bounded skill acceptance. Manual authorized glossary proof only; runtime glossary route remains S-004O; cloud reliability, owner QA and release unverified. | Codex fresh-context pr415_final_review | 6 |
| 2026-10-07 | conflict repair | Final combined candidate f6461f5c verified and independently reviewed | Full RUNBOOK54/54 on clean f6461f5c; actual-history append-only CLEAN; self-drift expected-base23/post22 with no added findings, cleanUpdate false; final diff and source tree clean | Conflict resolution retained domain-modeling and pr, exact prior28 and both prior29 policies, both catalogs and histories; Taskboard regenerated | Authorized integration merge and containment follow; original scenario tool-result streams unavailable, runtime glossary route S-004O, owner QA and release remain explicit |
| 2026-10-07 | review | Review verdict: fail at d8b17a6a1f0099b6784ca2b87d3ff25eaadbd8e0 [f07e8bcbee35] #2 | continue TK-00JA: B1 every room receives the verbatim MIT-licensed GLOSSARY-FORMAT.md without the MIT notice, so ship the full notice inside workbench/skills/domain-modeling as the pr skill does with its NOTICE.md and assert it in the scoped test; continue TK-00JA: S1 the scoped test still passes the write-boundary, ADR and DDR direction, promotion-route, Lexicon-fallback and confirmation-rule mutations, so assert each and show each assertion failing on its mutation; continue TK-00JA: S3 and N5 the adapter list claims every change but omits several and adds unrelated authority and evidence policy lines, so remove that policy, list each remaining change with its reason, restore capture as it happens and say the lazy-creation line in GLOSSARY-FORMAT does not apply; continue TK-00JB: S4 and S5 scenario 1 never names the tests it claims to trace and the glossary variant reached GLOSSARY.md only by a manual write after the promote tool refused, so rerun scenario 1 on the corrected skill until the trace names test files or lines and qualify every 4/4 promotion summary in the proof; continue TK-00JC: N2 and S3 the Domain Modeling Wiki article must match the corrected adapter list and name the scenario 4 prompt limit | fresh-context claude-opus-5-5 assembled code review 1, re-pinned to d8b17a6a | 5 |
| 2026-10-07 | integration | PR #415 merged into integration as `c80cb282` (head `d8b17a6a`) while assembled review 1 was in progress; the review, re-pinned to `d8b17a6a`, found the in-room MIT notice missing and the S1, S3, S4 and S5 gaps still present, so verdict #2 failed and the three Tasks continue on `claude/s004j-corrections` from `c80cb282`. Acceptance lines 3, 5, 6 and 9 reopened; the S2 Lexicon count exemption and the S-004O glossary-promotion dependency are recorded. | Reviewer re-pin: full RUNBOOK 54/54 on a fresh clone of `d8b17a6a`, scoped 10/10, counts consistent at 30, guardrail 73/100 at base and head; the evidence table's two stray blank lines removed without changing any row. | Spec header, Non-Goals, Dependencies, current state, acceptance boxes and Completion Result. | Correction pass, fresh assembled review, integration PR and owner Human QA; whether the owner directed the Codex review behind verdict #1 is not recorded here. |
| 2026-10-07 | TK-00JA | Task closed (run 2) | Correction pass: in-directory MIT NOTICE.md installed into rooms; scoped 11/11 with each new assertion failing on its mutation; full RUNBOOK suite 54/54 on clean e30df561; fast-forward into claude/s004j-corrections verified | Skill notice, credit, adapter list and format note; scoped test; THIRD_PARTY_NOTICES checked, no update needed | TK-00JB scenario 1 rerun and promotion qualification; TK-00JC Wiki; fresh assembled review |

## Completion Result

Not complete. The three Tasks reached integration through [PR #415](https://github.com/KaydenClark/LLM_Workbench/pull/415) (`c80cb282`) after a pass verdict at `f6461f5c`; the later verdict at the merged head `d8b17a6a` failed, so TK-00JA, TK-00JB and TK-00JC continue for one correction pass. A fresh assembled review of the corrected candidate, its integration delivery and owner Human QA remain.

## Supersession

- Supersedes: S-002H (Domain Modeling Skill for the Workbench)
- Superseded by: none
