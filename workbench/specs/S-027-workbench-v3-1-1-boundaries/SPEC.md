# S-027 - Workbench v3.1.1 Boundaries

**Spec ID:** S-027
**Status:** blocked
**Priority:** 0
**Owner:** codex
**Updated:** 2026-09-05
**Catalog description:** Deliver the reduced entry route, four portable stances, chat-only Round One setup proof, and the subsequent feedback-report workflow for v3.1.1.
**Blockers:** Explicit owner approval to push the concrete local branch is required after automatic approval review rejected remote publication.
**Latest event:** Independent review found one stale Lexicon claim; corrected locally with adjacent stale adoption wording.
**Next gate:** Obtain explicit push approval after corrected-candidate review, then verify remote recovery. A full integration comparison remains required before merge.
**Stance:** Builder

## Outcome

An assigned agent enters through AGENTS -> RUNBOOK -> LEXICON, follows only
task-relevant memory and owners, and delivers verified, recoverable work.
v3.1.1 continues the preserved v3.1 candidate; this spec owns the changed
behavior and candidate preparation, not publication or downstream adoption.

## Why It Matters

The Workbench must support useful autonomous work without inventing process,
queue items, or external orchestration dependencies.

## Current Verified State

At authorization the checkout is `2538b8ab88991a866d8b97e5d2c1fb72d9571fe7`.
Live remote integration is `9e1c935d1027d3818578070c9bbdb88809af3dcd`, main is
`08ab78e5a59a68d2b04028fe71a2be488d5ae10e`, and the preserved v3.1 candidate is
`4ce74f8de1da30a3bffd9286e32c3b63e417a08b`. Neither version has a remote tag.
Doctor passes; next still selects S-022/TK-004 under its old owner. Schema 2,
Wiki, ADRs, managed tools, and twelve portable skills already exist. The
round-trip transcript captures absolute producer paths; its privacy assertion
must be repaired at the producers, not removed. Guardrail baseline: 68/100.

## Desired Behavior

1. Retain seven controls. Reduce entry to AGENTS.md -> RUNBOOK.md -> LEXICON.md;
   consult Blueprint only for architecture/direction, then the assigned spec,
   relevant Wiki and ADRs as routed by the task.
2. Ship Builder, Auditor, Reviewer, Reconciler as four portable stance skills.
   A stance changes behavior only; it neither grants/removes/transfers authority
   nor spawns an agent or requires a handoff. Each has Purpose, Method / Posture,
   Obligations, Completion / Exit Condition. The assigned SPEC and TASK set the
   normal stance. Missing information is investigated inside assigned scope;
   the agent never creates its own next task. Troubleshooting stance policy is
   outside scope.
3. First complete Round One: a fresh agent follows the reduced route, Wiki and
   relevant ADRs, verifies setup, and returns the result in this chat only.
   It creates no report, handoff, checkpoint, new task, or other prose artifact.
4. After Round One succeeds, implement the feedback-report procedure and format
   in the manifest feedback lane. Produce an evidence-backed report there and
   demonstrate fresh-context continuation to its accepted action or an honest
   owner decision pending. A report never repairs or authorizes repair of its
   target; no findings is a valid outcome.
5. Independent separate-context review is mandatory only at the proposed
   integration merge. It challenges the fixed candidate and evidence, including
   consequential report claims. Earlier verification/review remains useful
   support, without an independent ceremony per ticket.
6. Version stamps change only after behavior and required proof are green.
   No release or integration merge is claimed by a version bump.

## Decisions And Contracts

Source: [locked Q1-Q16](../../sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md),
authorized by the owner on 2026-09-04. Locked answers supersede that record's
older recommendations, tentative sequence, paused header, and stale next action.

| Decisions | Canonical destination |
|---|---|
| Q1, Q11, Q13, Q14 | This spec: build route/stances, chat-only Round One, then reporting and continuation |
| Q2, Q5 | AGENTS, RUNBOOK, LEXICON: reduced entry and existing truth owners |
| Q3, Q12, Q16 | AGENTS, LEXICON, skills: assigned stances and behavior-only contracts |
| Q4 | AGENTS and implementation/review skills: integration review gate |
| Q6, Q15 | AGENTS: autonomy within assigned work; no self-created next task |
| Q7 | RUNBOOK and report format: manifest feedback lane; report/repair boundary |
| Q8 | BLUEPRINT and this spec: continue v3.1 as v3.1.1 without rewriting proof |
| Q9 | BLUEPRINT: real contrasting owner-selected work before any Master Workbench |
| Q10 | AGENTS and ADR-0034: each requirement must enable delivery |

The four stance directories ship flat in both discovery roots, so one-level
Claude discovery works without a second copy. A separately nested installation
under `stances/` must expose a flat top-level symlink. Normal setup preserves
existing skills; real user installations are outside this task.

## Non-Goals

- Foundry, CIC, Master Workbench implementation, connectors, scheduler mutation,
  real user skill synchronization, or assignment of any example pilot project.
- Merging integration to main, publishing a release status/tag, waiving an
  independent integration review, or relabeling historical proof as current.
- A new CONTRACT.md, handoff layer, mandatory stance-selection ritual, or task
  schema engine. TASK means the existing ticket in its assigned SPEC.
- Comparative agent-outcome claims without repeated controlled trials.

## Dependencies And Blockers

- Reuse completed S-023 through S-026 unchanged; link this later capability.
- S-022/TK-004 is paused behind S-027. S-014 remains blocked pending an audited
  integration candidate; its historic CIC flow is not a prerequisite here.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Build and verify v3.1.1 route and stances, run Round One, then deliver feedback reporting and continuation | blocked | owner push approval | Local implementation verified; remote recovery pending |

### TK-001 - Assigned task

**Stance:** Builder. Sequence: route/stances and transcript repair -> fresh
Round One agent -> feedback workflow/report -> fresh continuation -> full suite
-> version update and candidate review. Fresh setup, continuation, and the
integration review may use separate subagents with no inherited conversation;
they return evidence to this spec's single durable writer. The Round One agent
is read-only and reports only in chat. No new queue item is created for it.

## Acceptance Criteria

- [x] Root contract and generic templates agree on entry, authority, stances, continuation and review.
- [x] All four stances install and are discoverable on a fresh disposable host; existing skills remain preserved and unsafe collisions fail before writes.
- [x] Round-trip privacy regression passes without weakening its assertion.
- [x] Fresh Round One agent verifies setup via the intended route and reports only in chat.
- [x] Subsequent report format/workflow and one report live in the feedback lane; a fresh agent finds the bounded next action or owner gate without original chat.
- [x] Full required suite, render, doctor, ADR/Wiki checks and diff check pass; guardrail after-score and limits recorded.
- [ ] v3.1.1 candidate is remotely recoverable; separate-context review covers the exact proposed integration candidate before any integration merge.

## Testing Seams

- Disposable installer CLI, manifest validation, and flat provider discovery.
- Mechanical round trip: producer command/output capture and unchanged final
  private-path assertion; no filtering of an agent transcript to manufacture PASS.
- Fresh read-only agents for setup and continuation; chat results are evidence,
  not comparative outcome trials.

## Verification Procedure

Run the full union of AGENTS.md and RUNBOOK.md verification commands, targeted
installer/catalog/layout/round-trip checks, ADR register/validate, Wiki validate,
guardrail audit, render, doctor, diff check, and remote SHA read-back.

## Documentation Impact

AGENTS, BLUEPRINT, LEXICON, RUNBOOK, README, corresponding generic templates,
portable skills, ADR-0034 through ADR-0038, generated Taskboard/catalog/register,
S-022/S-014 pending gates, and benchmarks/RESULTS.md. The locked checkpoint and
completed spec evidence remain unchanged.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-04 | TK-001 | Owner authorized Q1-Q16; baseline refreshed | doctor PASS; live refs match; guardrail 68/100 | Accepted decisions promoted with current owners | Implement and prove the ordered sequence; publication remains separate |

| 2026-09-05 | TK-001 | Route and stance implementation; original privacy failure reproduced and repaired | Installer red missing four stances then 6/6 green; delivery-contract red on per-ticket independence then 2/2 green; round trip red on private producer paths then green with unchanged assertion; catalog PASS; legacy/new manifest policy test PASS | Root and generic controls, stance skills, installer/layout and tests updated | Round One and reporting sequence; full final suite and review |
| 2026-09-05 | TK-001 | Fresh-context Round One PASS before reporting implementation | Agent round_one followed AGENTS -> RUNBOOK -> LEXICON -> manifest/S-027 -> Wiki and relevant ADRs; doctor, layout, Wiki, ADR and catalog checks PASS; no authored file or prose artifact; observed dirty tree at baseline HEAD 2538b8a | Existing spec records returned chat evidence; no Round One report or handoff created | This proves setup only, not installation, integration or release |
| 2026-09-05 | TK-001 | Implemented subsequent manual reporting workflow and lane-owned format | Format manually checked for revision, scope, evidence, challenged findings, bounded action, review and no-repair boundary | RUNBOOK and template, feedback format, Genesis/Adoption placement and Wiki routing | Produce report and prove fresh continuation |

| 2026-09-05 | TK-001 | First subsequent report delivered | [Feedback report](../../feedback/REPORT-boundaries-2026-09-05.md) pins local behavior checkpoint bfae8c0d731d1a799a487b0848f2e39af25c68d5; F-001 reproduced without repair; 29-command pre-version suite PASS | Report and lane format linked from the assigned spec | Fresh continuation, version verification and review; push approval; F-001 repair not assigned |

| 2026-09-05 | TK-001 | Stamped v3.1.1 after behavior proof | All 29 required commands passed before bump; version-bearing source manifest and usage examples updated; original adoption provenance retained | BLUEPRINT, README, source manifest and active version examples | Run complete post-version verification and review; no release or remote publication implied |

| 2026-09-05 | TK-001 | Fresh continuation PASS | Fresh agent cold_continuation followed the reduced route to S-027 and its report, resolved the exact output and pending decisions, passed doctor/next, and independently reproduced F-001; no authored artifact | Existing spec records returned chat proof | Separate-context candidate review and explicit push approval; F-001 repair remains unassigned |
| 2026-09-05 | TK-001 | Full post-version verification PASS | All 29 commands in the AGENTS/Runbook union passed on v3.1.1; ADR/Wiki validation, report privacy scan, and diff check PASS; measured guardrail 73/100 | Benchmarks records 68 -> 73 with unchanged criteria and the F-001 scoring limitation | Immutable candidate review; remote publication blocked by automatic approval review pending explicit owner approval |

| 2026-09-05 | TK-001 | Clean immutable candidate verified | Detached clean clone at 5ef5b15e0e69d37a207ccccd5c8fc75e79cf75ce passed all 29 union commands; guardrail remained 73/100; original locked checkpoint has no diff from baseline | Existing proof owners retained | Independent delta review then owner approval to push; inherited integration changes need their own review |
| 2026-09-05 | TK-001 | Separate-context candidate delta REJECT, followed by narrow correction | Reviewer candidate_review checked 2538b8a..5ef5b15; sole P2 was stale LEXICON v3.1.0 release designation; installer 6/6, layout 14/14, round trip, catalog/delivery and doctor independently passed; F-001 supported on its pinned target | Corrected Lexicon release distinction and adjacent README/Adoption destination wording; historical evidence preserved | Re-review new immutable local candidate; this delta review does not audit inherited integration changes |

| 2026-09-05 | TK-001 | Corrected current release/adoption wording and checkpointed blocked recovery state | Catalog/delivery, layout, evaluator, portability, ADR/Wiki and diff checks PASS after correction; source behavior unchanged from clean 29-command PASS | LEXICON, README, generic Adoption, this spec and generated Taskboard | Final local-delta review; explicit push approval and remote read-back; full inherited integration comparison before merge |

## Completion Result

v3.1.1 is delivered as a local candidate: contract, five ADRs, four portable
stances, chat-only Round One, feedback workflow/report and fresh continuation
are implemented and verified. Remote recovery is blocked pending explicit push
authorization; no release, integration acceptance, or completed spec is claimed.
The local-delta review result is returned in chat for this immutable checkpoint;
its earlier rejected candidate and correction are retained in the evidence log.


## Remaining Limitations Or Follow-Up Specs

- Installed skills and external deployments are not synchronized by this work.
- Historical provider proof is not a new current-candidate provider run.
- Master Workbench waits for several real contrasting owner-useful deliveries,
  named verification, fresh continuation and a concrete observation need.

## Supersession

- Supersedes: S-026's twelve-skill/routing contract only; completed history preserved.
- Superseded by: none
