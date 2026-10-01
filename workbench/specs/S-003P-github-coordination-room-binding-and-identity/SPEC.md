# S-003P - GitHub Coordination Room Binding And Identity

**Spec ID:** S-003P
**Status:** active
**Priority:** 1
**Owner:** codex-github-binding
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Resolve an explicit GitHub coordination repository and room-scoped artifact identities from immutable repository sources.
**Blockers:** No prerequisite blocks the first read-only binding slice. Native Issue mapping awaits the Issue graph seam. Live actor trust belongs to the assignment owner.
**Latest event:** TK-004P closed with proof.
**Next gate:** Frozen repaired-candidate full suite, installed runtime proof and independent immutable Task-PR review before integration containment. Later artifact lookup and Issue correspondence slices remain uncut; whole-Spec and owner gates remain open.

> **Citation anchors.** pre=`282dc043ab7dad92826a6d5447369238c35df0a3` post=`282dc043ab7dad92826a6d5447369238c35df0a3`.

## Outcome

Resolve an explicit GitHub coordination repository and room-scoped artifact identities from immutable repository sources.

## Why It Matters

GitHub Coordination is part of the owner-directed v4 package. A bounded capability owner makes the accepted destination executable without one oversized Spec or a second coordination queue.

## Current Verified State

At the pre anchor, PR235 concept sources are contained in integration. The proposed [GitHub coordination decision](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md) records the accepted destination and conditional effect. The active [claim decision](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md) and `workbench/tools/claim-coordination.mjs` remain operative. No Issue-backed assignment runtime or binding inspector exists at this anchor. Existing room identity, typed visible IDs, Tracker, lifecycle and review tools are reused, not reimplemented.

## Desired Behavior

1. Read an explicit noncredential repository binding and the existing room identity from a named immutable source commit. Never infer a configured coordination service from a Git remote.
2. Resolve typed identities including legacy Spec-qualified Tasks, former spellings, ungrouped concepts and source paths; ambiguity refuses before any write.
3. Preserve identity through retitles, folder moves and retirement, and retain native Issue identity and pinned source lineage without reallocating Workbench IDs.

## Decisions And Contracts

- Scope and permission remain with the request, Contract and assigned Spec/Task. Issue metadata is coordination evidence, never blanket instruction authority.
- Accepted concept lineage is LMK-000A and DQC-000B/000C/000D; extended outage recovery remains DQC-000E and is off the v4 critical path.
- Exact actor trust and Projects availability/requirement are unresolved. Preserve these gates without blocking independent read-only work.
- Source proof, installed behavior, integration containment, failed ongoing owner Human QA and owner-only main promotion are distinct.

## Non-Goals

Custom scheduler or atomic lock; a parallel local queue; extended outage recovery; main promotion; version bump; private-catalog publication; unrelated room rollout; Dungeon Friends work.

## Dependencies And Blockers

No prerequisite blocks the first read-only binding slice. Native Issue mapping awaits the Issue graph seam. Live actor trust belongs to the assignment owner.

[Workbench v4 release](../S-00O-workbench-v4-0-0-release/SPEC.md) owns package/release ordering. S-01X retains the six-lane composed Taskboard destination. Consume immutable delivered seams rather than requiring peers' owner/main closure and creating a circular release dependency.

## Vertical Implementation Slices

[TK-004A](tasks/TK-004A/TASK.md) delivers the first read-only binding inspector. One Worker owns its named source/test/registration lanes. Identity mapping and remote operations stay uncut until their source and dependency seams are verified; no other Task is activated here.

## Acceptance Criteria

- [x] A read-only public command resolves committed room binding at an exact commit, rejects malformed input with named errors and leaves the checkout unchanged.
- [ ] Artifact lookup distinguishes identically labelled legacy Tasks in different Specs and resolves supported former spellings without choosing an ambiguous record.
- [ ] Moves and retirement retain room/artifact/Issue correspondence and immutable source references.
- [ ] The adapter is registered in the managed runtime and its delivered seams work from a receipt-backed fresh-room installation.

## Testing Seams

Public CLI or supported GitHub operation with controlled repository/Issue fixtures; red/green refusal, identity, retry and preservation cases. For setup, use receipt-backed installed commands; for continuation and cutover, name actual host and remote evidence separately from fixtures.

## Verification Procedure

Run the Task's public red/green seam and one-command demo, then the complete AGENTS required suite, render and doctor. Pin the candidate before source-identity checks. Record read-only self-drift pre/post receipts and bounded semantic findings; capture guardrail before/after for harness changes. Obtain independent review before integration. Live remote/installed/host proof is required only when the named acceptance needs it and must never be inferred from a fixture.

## Documentation Impact

This Spec owns capability requirements, open gates and proof. Shared operational controls and generic mirrors stay with S-00P and the cutover owner; no new command is claimed before implementation. Adapter commands are documented in their support-lane procedure owner. S-00O retains release/Template gates and S-01X retains composed-view acceptance.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-01 | none | Owner-directed capability capture from integration 282dc043ab7dad92826a6d5447369238c35df0a3; reviewed concept seed PR235. | Planning only; runtime proof not claimed. | Capability owner authored; generic operational template changes deferred to implemented seams/cutover, because no operative workflow changes here. | Acceptance unchecked; unresolved choices and later independent review preserved. |
| 2026-10-01 | TK-004A | Candidate de53544083201d66e76c7f56a95b975911ec8ed5 implements an optional committed-manifest binding inspector; native claim99643c2 is pushed. | Public red: absent inspector exits1. Green: 7/7 including immutable source, refusal/no-write and receipt-backed installed command/hash; live repository demo resolves metadata with access unverified. Full initial run45/49 exposed stale Taskboard after Receipt; regenerate and rerun final candidate. | Procedure, manifest declaration and managed registration; workflow/templates unchanged because no active service or claim rule changes. Native DQC links preserve origins/evidence. | Final full suite and independent integration review; native Issue operations, artifact mapping, actor policy and cutover remain. No Human QA/main or clean-update claim. |
| 2026-10-01 | TK-004A | Frozen candidate4d9a24b8692e90ab63c11b07515b12cae0ab2ee7 self-checked; Task remains in-progress pending independent review/integration. Zero coordination hand-backs in this continuation. | 51/51 required plus inspector/Tracker commands PASS; inspector7/7 with receipt hash and fresh installed invocation; Tracker23/23 and exact projection; demo reports metadata with access unverified. Guardrail78/100 before/after; repeated real outcome trials/control comparisons/uncertainty evidence remain recommendations. Self-drift pre/post keeps7 existing findings and cleanUpdatefalse; projection drift from first run repaired. | Procedure, source/managed registration and capability/concept routes; generic workflow/templates intentionally unchanged because active claims/required service are unchanged. | No live Issue/auth/cross-host proof, independent review or containment yet. Failed ongoing owner Human QA and owner-only main remain separate. |
| 2026-10-01 | TK-004A | Task closed | Public inspector7/7 after combining integration3b5b76bf at pushed7722ccbb; receipt-backed managed hash/invocation pass. Historical38762772 source51/51 and6e04b54c fresh remote clone51/51 preserved; final assembled-candidate suite and independent integration review remain. | Binding procedure, manifest binding, runtime registration, Specs and DQC lineage maintained; no generic claim/control change. | Task behavior self-checked; independent immutable-candidate integration review and containment pending. Full Spec artifact lookup, native Issue graph, trusted actor policy, operations, continuation, setup and cutover remain open. Seven inherited self-drift findings; no live access, owner QA or main claim. |
| 2026-10-01 | review | Review verdict: fail at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 [75b31d585a50] #1 | P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.; P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.; P2: Add a durable RUNBOOK entry route - bounded entry-owner lookup at394 finds no route to the binding procedure. | codex-github-binding self-check, corroborating independent reviewer01a0f686 exact394 adversarial traces, not independent approval | 3 |
| 2026-10-01 | review | Independent exact394 FAIL confirmed by parent relay | Reviewer01a0f686-0291-71d7-a754-53a5027ad029 checked base3b5b76bfd62aa98118cb73cc4947e0658f4040c6/head394a5d869d2630a069a5ba2fd90fee0cad28bf49/tree6b1e44e2e2c7c86b2d3740258fb04e79c77be9d0. Full51/51, inspector7/7 and Tracker23/23 pass but two P1 Git-boundary repros and P2 missing route require correction. Model unrecorded. Local public CLI independently confirms both P1s. | TK-004A and prior receipts retained; native self-check FAIL creates TK-004F/G/H answering the three findings. | Freeze released for corrections; fresh final-candidate review required, no integration or owner approval. |

| 2026-10-01 | TK-004G | Correct premature Receipt1 green claim | Actual initial dirty-source result7/8: installed-source identity refusal, not8/8. Committed5f3ce522 rerun passes8/8 including exact managed hash and invocation. Public redcce88dc6 and all prior rows preserved. | Lazy-fetch procedure and regression current. | Full assembled suite and independent review still pending. |
| 2026-10-01 | TK-004G | Task closed | Promisor regression expectedredcce88dc6, committed5f3ce522 inspector8/8 including fresh installed hash/invocation and absent promised commit/tree/blob refusal without transport or any Git metadata change. Receipt1 premature8/8 corrected append-only by Receipt2 and Spec evidence. | Binding procedure states no lazy fetch, optional locks and fail-closed Git compatibility. | TK004F environment and TK004H route remain. Required full final assembly suite and independent review/integration pending, no fullSpec or ownerQA claim. |
| 2026-10-01 | TK-004F | Task closed | Redaa32ff2f foreign ambient Git environment resolved incorrectly. Greend337006d10/10 inspector tests including receipt-backed installed hash/invocation, selector/object-store/config isolation, true linked worktrees and promised-object no-write checks. | Existing binding procedure updated; active claim/control authority unchanged. | TK004H entry route and full final assembled suite/independent review/integration remain; full Spec and owner gates open. |
| 2026-10-01 | TK-004H | Task closed | Independent394 missing-route evidence answered by RUNBOOK -> existing adapter procedure -> existing public command read-back; control-fidelity checks PASS. Behavior and generic claim workflow unchanged. | RUNBOOK now routes the optional binding procedure without duplicating its command contract. | Required full assembled candidate suite and independent review before integration. Later artifact identity, Issue and actor-dependent slices uncut; full Spec acceptance and owner gates remain open. |

| 2026-10-01 | TK-004F/G/H | Expand final verification to the full documented union | Producer historical51-command runs covered AGENTS48 plus inspector, Tracker test and rebuild. RUNBOOK additionally requires team-coordination, team-coordination-demo and socket-contract checks. Final assembled verification will run all54 unique commands; earlier named command results remain preserved and are not a full RUNBOOK-union claim. | Verification scope clarified without weakening gates. | Full54 frozen-candidate results and independent exact-candidate review pending. |
| 2026-10-01 | coordination | Director collision disposition and replacement reservation | Earlier S-00I/TK-004F claim7a51c53a528ff4dba407042a4de860bc66bb2d66 retains its identity. TK-004I is centrally reserved solely for later S-003P/TK-004F recovery from exact5e8803f673898dd0eb716446fba5f61881d6a106, with qualified immutable provenance and no collisional Former ID alias. TK-004J is reserved for the narrow native recovery mechanism implementation. | Existing first-published rows, original Task and receipts remain preserved. | Native dry-run/refusal/rollback proof and independent mechanism plus actual repair review before integration, no identity mutation yet. |
| 2026-10-01 | review | Review verdict: fail at 5e8803f673898dd0eb716446fba5f61881d6a106 [60f5a7e1490b] #2 | P1: Repair later S-003P/TK-004F native identity collision with earlier published S-00I/TK-004F through a guarded move-task transaction preserving immutable history and Receipt bytes. | codex-github-binding self-check, corroborating independent exact5e review and Director collision disposition, not independent approval | 1 |

| 2026-10-01 | coordination | Preserve reservation authoring correction at f8051a8ed93c90e549ee1fa1b51e3b0d4835836c | Publishing J alongside I consumed J in native reference inventory. Director retained that published row and centrally reserved K after fresh origin inventory. Native exact5e FAIL allocated only TK-004K, with no allocator override. | Independent exact5e review confirms all three earlier defects corrected and54/54 PASS, with collision alone blocking integration. | Mechanism review precedes actual F-to-I repair; no identity mutation or approval transfer yet. |

| 2026-10-01 | review | Independent mechanism FAIL at1fb97872ac44c10ab69c1d1791980bb1cb510c66, preserved | Reviewer01a0f689-cb20-717c-97ff-213d82289036 independently reproduces P1 omitted current-manifest and legacy table-backed replacement identities and P2 unexecuted Runbook example. Public22/22 plus six additional refusal controls pass; mandatory suite was incomplete at early handback. Producer exact1fb54/55 independently names the same round-trip failure. | In-progress TK-004K corrects both findings without reopening done records; originalF and receipts unchanged. | No mechanism approval or actual repair at1fb; fresh corrected mechanism review then separate actual repaired assembly review required. |
| 2026-10-01 | S-003P/TK-004F | Collision identity recovered to TK-004I | S-003P/TK-004F@5e8803f673898dd0eb716446fba5f61881d6a106:workbench/specs/S-003P-github-coordination-room-binding-and-identity/tasks/TK-004F/TASK.md; retained S-00I/TK-004F@7a51c53a528ff4dba407042a4de860bc66bb2d66:workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-004F/TASK.md | Director retains earlier S-00I identity and reserves TK-004I for later S-003P recovery | Identity repair only; no review or owner approval transferred. |

| 2026-10-01 | review | Independent bounded mechanism PASS at2791caa13afcb5b304ea013c678856abbc0a2341, then native actual recovery at7be6a245 | Separate reviewer01a0f689-cb20-717c-97ff-213d82289036 independently passes55 commands including51 mandatory, installed27/27 and eight additional refusal probes, with exact remote2791 confirmed. Model unrecorded. Producer55/55, source/installed27/27, guardrails78/100 and seven inherited self-drift findings remain separately named. Native actual move preserves all17 existing evidence/header rows and originalF Task body/Receipt bytes except canonicalID/title and qualified immutable provenance. | Binding command acceptance is rechecked by public10/10 plus prior independent correction evidence; full artifact lookup, Issue correspondence and whole adapter acceptance remain open. | Actual repaired assembly still requires full exact-candidate suite and separate independent integration review; mechanism PASS transfers no wholeSpec/owner approval. |
| 2026-10-01 | TK-004K | Task closed | Guarded native collision recovery red/green: old1fb remote table cases accept occupiedI, corrected2791 full55/55 and public/installed27/27 pass with independent mechanism PASS. Actual7be6a245 preserves all original Task body/Proof/Receipt bytes except canonicalID/title/qualified provenance, all17 existing Spec rows and every unrelated tracked file. Actual-source public27/27 PASS; original and failed histories remain recoverable. | Root/template Runbook recovery mode, original Task/Spec histories and immutable qualified provenance updated; existing move-task API and scope retained. | Exact repaired-assembly full55 and independent Task-PR integration review/containment pending. FullSpec artifact lookup/Issue correspondence/whole adapter acceptance and owner gates remain open. |
| 2026-10-01 | review | Review verdict: fail at 6aa92668f77dcbe3c56d169701d7fb44d5174898 [4e74a8eb57ed] #3 | P1: Reject malformed replacement and unsupported dry-run modes before dispatch - exact6aa public empty replacement plus retirement dry-run and ordinary retirement dry-run both write despite the no-write request. | Independent reviewer01a0f689 exact6aa FAIL relayed by Director01a0f684, corroborated by public self-check. Valid F-to-I preservation passed. No approval transferred. | 1 |
| 2026-10-01 | TK-004P | Task closed | Public red72130 expected failure and green combined2d99ebc1 34/34. Unsupported CLI/API dry-run modes refuse without file or Git metadata mutation; ordinary retirement, documented collision dry-run/apply and guarded rollback pass. Full assembled candidate review remains separate. | Root/template RUNBOOK mode bounds clarified; done I/K and original receipt/evidence history preserved. | Final full suite, installed runtime checks and independent Task-PR review/containment pending. Full Spec acceptance and owner QA/main gates remain open. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Extended outage recovery is deferred and remains reachable in DQC-000E. Read/write access and Project-view requirements are not proved by a Git push. Cutover is separately gated; operative claim authority remains ADR-000O.

## Supersession

- Supersedes: none
- Superseded by: none
