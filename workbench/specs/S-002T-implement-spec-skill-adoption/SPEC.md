# S-002T - implement-spec skill adoption

**Spec ID:** S-002T
**Status:** active
**Priority:** 2
**Owner:** codex-s002t
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Run a sliced Spec through Worker implementation and assembly to a PR ready for integration review.
**Blockers:** none; the skills draft wiki collection (S-002L) is delivered on integration.
**Latest event:** TK-006X claimed by codex-s002t.
**Next gate:** Close TK-006X with verification and documentation proof.

> **Citation anchors.** pre=`9aa0c30e99bb7da26f5c2b89b5e5c04a507da513` post=`9aa0c30e99bb7da26f5c2b89b5e5c04a507da513`.

## Outcome

An owner-invoked implement-spec operation takes an authorized Spec already sliced into Tasks, orchestrates Workers on an assembly branch, evaluates and corrects their assembled result, and leaves a discoverable assembly-to-integration PR ready for review. This Spec owns source, documentation and the minimal existing-owner reconciliation needed to use it.

## Why It Matters

The owner wants to launch one Spec delivery operation without supervising individual Tasks. Deliver the agent workflow first; deterministic execution and observers remain deferred.

## Current Verified State

At the pre anchor, the draft wiki and Template 2 are delivered. The lane has 28 Core skills and three declared maintainer skills; implement-spec is absent. Dispatcher and Spec Manager permit Dispatcher implementation when Workers are unavailable and route every cross-Spec prerequisite to a Director. Those instructions conflict with the confirmed operation. Original September 30 planning is preserved in Git history and the evidence below.

## Desired Behavior

- Dispatcher orchestrates; Workers implement every change and correction. Directors coordinate multiple Dispatchers and Specs.
- Recover the planned Task graph; dispatch compatible work concurrently with claims and one durable state writer.
- Branch Workers from assembly, merge verified results serially and check the resulting assembly SHA before releasing dependencies. Readiness requires verified containment in this assembly.
- Necessary directly connected prerequisite Tasks from other Specs may join assembly, preserving original links, claims, writers and proof. Their original Specs are not complete. Without a Director, take only the smallest reversible unblocking actions.
- Use one full building-side evaluation and one correction pass, merge corrections through the same assembly path, then focus verification on the final candidate. Remaining findings leave a recoverable draft PR.
- Publish ready PR, candidate, proof and next gate in the owning Spec and regenerate its projection. Cleanup preserves proof and assembly. Stop before later integration review/merge and owner approval.

## Decisions And Contracts

- Owner confirmation on October 6: "This looks good. confirm." followed by implement, then "continue as you were to get this working. I want to be able to start using it". The complete nine-step draft is accepted.
- Initial installation uses this Workbench's existing maintainer-skill declaration: one source at `workbench/skills/implement-spec/SKILL.md`, declared in the manifest and reached through both discovery adapters. This supersedes the earlier Pending-only proposal, without adding to the 28-skill Core bundle or installing in other rooms. Portable Core promotion is separate.
- Necessary reconciliation may touch Dispatcher, Spec Manager, their Wiki owners and relevant controls/procedures for the confirmed boundaries only. Existing capability ownership is retained through links.
- Owner-authorized implement-spec runs use Task -> assembly -> integration. The Task-PR bootstrap default remains outside those runs. No deterministic runner or scheduler is added.
- One correction Worker may address explicitly scoped findings across implicated Tasks, serializing claims and preserving per-Task ownership. This does not grant a Worker general multi-Spec authority.
- This first version is owner-invoked. Do not assume disable-model-invocation enforces the same behavior on each host or enables autonomous Director invocation.
- Source/routing checks prove structure only; a fresh-context exercise names observed behavior and its limits. Installation is neither independent integration approval nor owner Human QA approval.

## Non-Goals

Initial Task planning; executing real backlog during installation; deterministic execution; watchers/webhooks; other room updates; portable Core promotion; changing owner Human QA or main promotion.

## Dependencies And Blockers

Skills draft wiki collection (S-002L) delivered the location and Template 2 on the pinned integration base. Its owner closure does not block use of those delivered artifacts. Existing claim/receipt/close, manifest, safety and review rules remain. Workbench v4.0.0 Release (S-00O) retains the bootstrap default and records this operation-specific assembly exception. Missing host capabilities block dependent execution; no API is invented.

## Vertical Implementation Slices

Owner-authorized activation: [TK-006X - Install and exercise the confirmed implement-spec operation](tasks/TK-006X/TASK.md) pierces source, declaration, discovery, operating boundaries, Wiki and verification. codex-s002t is the single durable writer. No backlog implementation is assigned.

## Acceptance Criteria

- [ ] The installed entry preserves the confirmed nine-step wording with the draft notice removed, and is declared/discoverable in this Workbench.
- [ ] Dispatcher and Spec Manager no longer implement as fallback; cross-Spec and correction procedures agree with the operation.
- [ ] The assembly route and later independent integration gate are explicit, with the ordinary bootstrap default preserved.
- [ ] Template 2 article records neighbor overlap, pinned upstream comparison, inputs/outputs, use and evidence limits, and is linked from its index.
- [ ] Focused and full RUNBOOK checks pass; self-drift and guardrail pre/post evidence preserves pre-existing findings.
- [ ] Fresh-context exercise observes the installed entry and actual execution or its honest missing-capability exit; routing checks are distinguished from runtime proof.

## Native selection support

The live runtime silently ignored `--task` on claim/close, always selecting the first eligible or active Task. A public CLI test reproduced wrong-target mutation. This delivery adds optional exact Task selection through the existing eligibility and close paths; it preserves default behavior and all blocker/capability/remote-claim/Git/recovery checks. This is a native primitive, not a deterministic runner.

## Testing Seams

Declaration/catalog rejects a declared skill without source, then accepts the installed source. Adapter paths resolve to identical bytes. Exercise a fresh agent with the installed entry in a disposable scenario, observing assembly readiness, ownership and stop boundaries without changing real backlog state. Missing capabilities must preserve state and refuse Dispatcher implementation. A text check does not prove autonomous delivery.

## Verification Procedure

Run focused catalog/discovery/Wiki checks, touched-page lint and whole-Wiki lint at review, the full Test And Build list in RUNBOOK, self-drift pre/post and guardrail before/after. Obtain separate-context immutable-candidate review before integration under the owner-supplied AGENTS requirement. Record actual merge answers, receipt, remote recovery and integration containment. Main remains owner-only.

## Documentation Impact

Maintain catalog, draft article/index, relevant Runbook/AGENTS procedures, role Wiki owners and roles-and-stances model. Mirror portable role boundaries in generic controls. New Workbench-only entry and its index row are exempt from template installation; generated rooms do not declare it. Keep state, proof and limitations here and in the Task.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Read `spec-manager`, `implement`, `carry` and `dispatcher` sources at the pre anchor; confirmed no `implement-spec` source or Spec exists; Matt's skill not read | This Spec authored; no skill, article, manifest or test changed | S-002L, activation, Tasks and all implementation remain open; distinct-or-fold decision not made |
| 2026-10-06 | planning | Owner confirmed complete draft and authorized usable installation | Nine-step design confirmed; base 9aa0c30e; draft wiki delivered; no entry installed yet | Existing Spec reconciled and TK-006X cut under the activation request | Installation, exercise, checks, review and integration remain |

| 2026-10-06 | TK-006X | Exact Task selection red/green | CLI selected wrong Task before --task support (4 failures; default test passed); after filtering through existing validation paths, 5/5 pass. The earlier full run was superseded when source edits invalidated its clean-source premise; its pre-existing landmark retirement assertion is being isolated | implement primitive procedure and native selector test | Fresh full committed-candidate run and review remain |

| 2026-10-06 | TK-006X | Behavioral exercise and bounded checks | Real concurrent Workers, serialized checked merges, Task-branch containment and cross-Spec ownership observed; full fixture 24/24, focused 8/8; building-side evaluation passed with no correction needed. Guardrail 73/100 before and after, with repeated real outcome trials and fresh board proof still recommended. Self-drift pre/post retains the same findings and cleanUpdate false. Earlier retirement assertion did not reproduce in an isolated clean-candidate check; earlier broad run was superseded, not a clean pass | [Scenario evidence](scenario-evidence.md), installed entry and Template 2 draft | Final full suite, immutable review, remote closure and integration remain; fixture has no real GitHub PR and uses local lifecycle adapters |

| 2026-10-06 | TK-006X | Independent review finding corrected | Review of e59cb5eb failed on terminal --task silently falling back in claim and close. Public CLI regressions reproduced both mutations (5 pass, 2 expected failures); distinguishing option presence from value turned all 7 tests green, including missing, empty and whitespace values with byte-for-byte no-mutation checks. The e59cb5eb full run was deliberately stopped after 10 passing commands because this correction supersedes that candidate | Native selector and regression test | Fresh full committed-candidate run and immutable review remain |

| 2026-10-06 | TK-006X | Wiki review findings reconciled | Independent lint found a stale maintainer count, the router saying no draft exists and older correction-Worker summaries. Reconciled the existing Wiki owners and linked the newer bounded correction exception without rewriting question cards. Source review of a1697896 passed; its full run was superseded by these documentation corrections after the first ten commands passed | Maintainer article, router, Dispatcher composition and two landmark syntheses | Full final-candidate suite and fresh review remain; unrelated pre-existing Wiki drift is preserved |

| 2026-10-06 | TK-006X | Whole-Wiki reading and index regression correction | Three contexts read all 145 pages and relevant current card answers. Corrected the remaining Dispatcher exit and lifecycle selector guidance; inherited drift stays visible in the reading evidence. The full run on 7836ecba reached 49 commands: 48 passed and one draft-index test failed because it required permanent plain-text rows. Replaced that obsolete assumption with existing-draft link and missing-draft plain-text checks; Wiki tests 25/25 green. The failed run was stopped before completing the remaining history checks, not counted as a full pass | [Wiki reading evidence](wiki-lint-evidence.md), owning articles and catalog regression | Final clean full run and immutable review remain; global clean-update/Wiki claims are not made |

## Completion Result

Not complete.

## Supersession

The owner-confirmed October 6 design supersedes the earlier open distinct-or-fold choice, Pending-only proposal and prohibition on necessary neighboring-skill reconciliation. Dated evidence is preserved.
