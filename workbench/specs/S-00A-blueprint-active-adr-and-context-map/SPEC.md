# S-00A - Blueprint, Active ADR, And Context Map Rebuild

**Spec ID:** S-00A
**Status:** complete
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-09
**Catalog description:** Make destination ownership, active ADR Canon, and Context Map routing coherent across the Workbench and generic controls.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

> **Citation anchors.** pre=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

LLM Workbench and its generic controls make one ownership model legible: the
Blueprint describes the desired finished product, active ADR decisions carry
cross-cutting architectural Canon, the Lexicon owns the Context Map, and Specs
own scoped delivery from verified Actuality.

## Why It Matters

The earlier controls required an ADR decision to be duplicated into another
control before it could bind, while the Blueprint mixed destination, version,
status, evidence, and a generated capability inventory. That makes ordinary
routing depend on reconstruction and obscures which claims are current.

## Current Verified State

This section records the pre-implementation state at the declared `pre` anchor.
The Completion Result and later evidence rows record the delivered state.

The prior promotion claim was overstated: no successor ADR-000A exists in the
live ADR collection. The locked decisions are durably recorded in this spec and
the named Contract owners below; the active-ADR implementation remains this
spec's work. `adr.mjs` still recognizes only proposed, accepted, superseded, and
rejected records and renders every record in one default register. The required
deprecated state, whole-record successor validation, active-only default
projection, historical view, and claim-disposition evidence are implementation
gaps.

## Desired Behavior

1. Accepted, non-superseded ADR decision claims are architectural Canon without
   becoming instruction authority or turning the whole record into one plane.
2. ADR lifecycle is explicit: proposed, accepted, superseded, and deprecated;
   supersession is whole-record with a valid successor, while deprecated records
   have a durable explanation and no active Canon.
3. The default ADR register and ordinary Context Map expose active decisions;
   historical records remain stable and reachable through lifecycle links or an
   explicit history route.
4. The root and generic Blueprints use the eight locked destination sections
   and contain no release/status/evidence/catalog claims.
5. A lossless inventory records the disposition and lineage of every claim
   removed from the prior root and generic Blueprints.
6. The main-readiness review checks semantic ownership and ADR relevance in
   addition to mechanical structure and link validation.

## Decisions And Contracts

- ADR-000A wholly supersedes ADR-0002 and ADR-0025; no partial supersession is
  introduced.
- `canonicalized_in` names operational owners; it is not a condition that
  prevents an accepted active ADR decision from being Canon.
- The Lexicon's Context Map is the only navigation map. `AGENTS.md` requires
  traversal and `RUNBOOK.md` owns the ordinary entry procedure.
- The Blueprint is adaptable destination narrative, not a status report,
  generated catalog, decision inventory, or proof archive.
- The exact mechanics and schema for active/history ADR views are selected by
  the red/green implementation only if they preserve the stated boundary.

## Blueprint Definition And Rebuild Contract

The Blueprint is the adaptable narrative of the desired finished product. It
answers what the product is trying to become and how its parts form one useful
whole; it is not a record of the current room, a delivery plan, or a decision
ledger. Its first reusable shape has these eight sections, with headings adapted
to the product and a genuinely inapplicable section omitted rather than filled
with boilerplate:

1. **Product destination** — what the finished product is.
2. **People and problems served** — who benefits and what it changes for them.
3. **Promised outcomes** — the durable results the product must achieve.
4. **Desired experience and behavior** — what use should feel and act like.
5. **Integrated system design** — how the major parts work together.
6. **Cross-cutting qualities and constraints** — qualities that apply across
   the product, including client-wide requirements.
7. **Desired lifecycle** — how the product should be created, updated,
   repaired, validated, and deployed.
8. **Non-goals** — what the finished product intentionally is not.

The rebuild is deliberate, not a prose cleanup:

1. Make the active/history ADR lifecycle testable under TK-00A, without
   deleting historical records.
2. Inventory every current root and generic Blueprint claim before editing.
3. Give each claim one destination: retain it in the destination narrative;
   move cross-cutting choice/rationale to an ADR; move scoped delivery to a
   spec; move procedures to RUNBOOK; move shared definitions/routes to LEXICON;
   or retain evidence/history with its existing owner.
4. Rewrite `BLUEPRINT.md` and `templates/BLUEPRINT.md` around the eight
   sections. An active ADR is linked inline only when it materially explains or
   constrains the destination; the ADR register remains the complete inventory.
5. Record the claim disposition and source lineage, then render the generated
   catalog/Taskboard from a tree that contains every referenced spec.

## Blueprint Review Checklist

A reviewer accepts the rebuilt Blueprint only when all of the following are
true:

- It tells a coherent future-product story using the applicable eight sections.
- It contains no version/release chronology, current status or health,
  implementation evidence, or generated spec catalog.
- It does not become an ADR list: inline ADR links explain the destination, and
  the active ADR register remains the complete decision inventory.
- Every removed claim has one durable destination and preserved lineage; no
  claim is merely dropped or copied into several owners.
- Its links route to the actual owner, and root/template controls express the
  same ownership boundary.
- The independent main-readiness review records a semantic pass/fail verdict
  against this checklist, in addition to mechanical checks.

## Grilling Record Reconciliation

Source: the local JSON grilling notepad
`workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json`.
The source is retained locally for recovery, not cited as durable evidence. This
table is the durable disposition of every locked question; `planned` means the
decision is an accepted requirement of the named spec, not implemented Actuality.

| Questions | Settled decision | Durable owner and state |
|---|---|---|
| 1, 3, 6, 6A | Active non-superseded ADR decisions are Canon; whole-record supersession preserves history and ordinary routing exposes active decisions. | This spec, Desired Behavior 1–3 and TK-00A; planned implementation. |
| 2, 4 | Universal entry is AGENTS -> RUNBOOK -> LEXICON; the Lexicon owns the sole Context Map. | `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`; current Contract. |
| 5, 5A, 8A–8C | Blueprint is an adaptable destination narrative; Specs own scoped delivery; ADRs own cross-cutting choices and rationale; current-state material stays out. | This spec, Desired Behavior 4 and Decisions And Contracts; planned root/template rebuild. |
| 8D, 8E | Rewrite only after a lossless claim disposition; independent main-readiness review judges semantic ownership and ADR relevance. | TK-00B; planned implementation. |
| 7, 7A, 7B, 7B1 | v3.2 repairs upstream controls and proves them by updating Workbench Template, without claiming later personalization. | `S-050`, this spec, and `S-00B`; active/planned as named. |
| 7B2 | Project evidence/grilling, Genesis derivation, and fresh-copy proof are staged capabilities. | `S-00C`, `S-00D`, and `S-00E`; planned and explicitly not v3.2 delivery. |
| 7C | A real project is updated only when Kayden names the target and requests it; no portfolio rollout or automation suite. | `S-00B` through `S-00E` Non-Goals and dependencies; planned constraint. |
| 8F, 8F1 | Integration review is task-level; main readiness reviews whole-Workbench drift. A readiness request authorizes review only; Kayden owns main approval and merge. | `AGENTS.md` Git Rules and Branch Completion; TK-00B adds the whole-Workbench checklist. |

## Non-Goals

- Deleting or rewriting historical ADRs to hide them.
- Claiming current delivery of later Blueprint grilling, Genesis, or fresh-copy
  proof capabilities.
- Adding a graph service, second truth store, or mandatory coordination layer.

## Dependencies And Blockers

This spec is part of S-050 v3.2.0 and must complete before the Workbench
Template update. The release's separately recorded host/transport gates remain
outside this documentation-and-tooling capability.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00A | Validate active ADR lifecycle and render active/history projections | done | none | b490657 ADR14 and full43PASS; c1600d1 independent S00A semantic/evaluator PASS and targeted checks |
| TK-00B | Reconcile Blueprint claim disposition and main-readiness review contract | done | TK-00A | c1600d1 independent semantic/evaluator PASS;166root+59template source segments byte-exact; destination/owner tests GREEN; full43b490PASS |

### TK-00A - Validate active ADR lifecycle and render active/history projections

**Stance:** Builder

Add deterministic red cases for deprecated records, missing or cyclic successor
links, partial-supersession attempts, and active versus history register output.
Implement the smallest lifecycle parser/validator/renderer change that keeps
historical file paths and makes ordinary routing active-only.

### TK-00B - Reconcile Blueprint claim disposition and main-readiness review contract

**Stance:** Builder

Create a durable, source-linked claim-disposition inventory for the replaced
root and generic Blueprints. Add mechanical checks for the destination-only
shape and active ADR links, then update the whole-Workbench main-readiness
review procedure to require an independent semantic ownership verdict.

## Acceptance Criteria

- [x] Lifecycle validation distinguishes proposed, accepted, superseded, and
      deprecated records and rejects broken whole-record successor links.
- [x] Default ADR routing/register exposes only active accepted decisions, with
      a tested history path that preserves every historical record.
- [x] Root and generic controls agree on the ownership model and Context Map.
- [x] Root and generic Blueprints satisfy the eight-section destination shape.
- [x] Every removed Blueprint claim has a lossless disposition and lineage.
- [x] A main-readiness reviewer has a concrete semantic ownership checklist.
- [x] Full required verification passes and a separate-context reviewer checks
      the immutable candidate before integration.

## Testing Seams

- `workbench/tools/adr.mjs` and `tools/test-adr.mjs` for lifecycle and views.
- Root/template control checks for destination-only Blueprint structure and
  Context Map links.
- A checked claim-disposition fixture and the documented release-review input.

## Verification Procedure

Drive the lifecycle and projection cases red/green. Run `node tools/test-adr.mjs`,
the affected control/doctor tests, the full suite named in `AGENTS.md`, render,
and doctor. Capture the required guardrail baseline and after-score before
claiming an outcome. Obtain a separate-context review of the exact candidate
before integration.

## Documentation Impact

ADR-000A, the ADR register, `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`,
`BLUEPRINT.md`, generic counterparts, review skills/procedures, and the S-050
release owner. The claim-disposition inventory is the durable migration record.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Created from the locked Blueprint and ADR grilling record under explicit make-it-so | Read current controls, ADR-0002/0025, ADR tooling/tests, the release owner, and the locked decision record; doctor has no blocker | Successor ADR and root/template ownership wording promoted; durable implementation scope recorded | Lifecycle tooling, complete claim disposition, review contract, full verification, and independent review remain pending |
| 2026-09-09 | spec | Corrected overstated promotion status and recorded complete question-to-owner reconciliation | Live ADR directory contains no claimed ADR-000A; JSON source current view lists 22 locked questions; every question is mapped above to a Contract owner or stable spec | This spec now carries the durable disposition; source remains local for recovery | Implement the named planned capabilities; no source cleanup requested |
| 2026-09-09 | spec | Made the Blueprint definition, rebuild sequence, and future review test explicit after handoff review | The prior handoff and spec named an eight-section shape but did not enumerate it or provide a receiver-facing rebuild/check procedure | Eight sections, claim-disposition sequence, and semantic review checklist now live in this spec and the refreshed Markdown handoff | TK-00A/TK-00B remain unimplemented; current root/template Blueprints are not yet rebuilt |
| 2026-09-09 | TK-00A | Ticket closed | b490657 ADR14 and full43PASS; c1600d1 independent S00A semantic/evaluator PASS and targeted checks | Active/history ADR projections and owning root/template controls reconciled; historical bodies and claim source bytes preserved | TK-00B closure and final candidate integration remain |
| 2026-09-09 | TK-00B | Ticket closed | c1600d1 independent semantic/evaluator PASS;166root+59template source segments byte-exact; destination/owner tests GREEN; full43b490PASS | Eight-section Blueprint, exact claim dispositions, active ADR Canon and independent main-readiness checklist reconciled in both root and generic controls | Final full repeat and exact integration review remain; no main publication approval |
| 2026-09-09 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |
| 2026-09-09 | spec | v3.2.1 manager recovery independently revalidated completed A without reopening its implementation | Luna read-only review: c1600d1, b490657 and 6e024ec contained by integration c0ac60a; ADR14, Blueprint, citation and composition checks pass; 225 unique disposition claims retain owners | Clarified pre-implementation state as historical; original evidence preserved | v3.2.1 C-E delivery remains separate; prior main-publication statements describe the original run |
| 2026-09-09 | spec | Anchored live post-implementation sections to recovered integration c0ac60a | Citation-anchor tests3/3PASS; pre-implementation anchor and append-only rows preserved | Current revalidation reads the delivered control tree | none for the completed capability |

## Completion Result

Complete for this capability. The root and generic destination Blueprints,
active/history ADR lifecycle, Context Map routes and independent semantic
review criteria are implemented and reviewed at c1600d1. The 166 root and 59
generic source segments remain byte-exact against their pinned originals.
Full suites passed 43/43 at b490657 and 357791d; c1600d1 repeated all commands,
with three projection-state failures caused by lead ticket updates during the
run. Rendering the changed owners and rerunning configured-host, dogfood and
doctor cleared all three; no criterion was weakened. Targeted destination,
privacy/evidence, lifecycle and installed-composition checks pass.

This completion enables the named Template update. It does not claim completed
release integration, native Claude/Windows support or main publication. Those
remain with their assigned release owners.

## Remaining Limitations Or Follow-Up Specs

S-00B proves the Workbench Template update. S-00C through S-00E own the later
project-evidence, Genesis, and fresh-copy capabilities; none is v3.2 delivery.

## Supersession

- Supersedes: none.
- Superseded by: none.
