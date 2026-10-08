# S-005C - Promote Confirmed Decisions

**Spec ID:** S-005C
**Status:** active
**Priority:** 2
**Owner:** codex-promote
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** Orchestrate one confirmed decision through delegated Record, Map, Plan and verified stage publication to integration.
**Blockers:** none
**Latest event:** PR #434 published the reviewed source to integration b7515137d08668ae2b974c5bab08c5b63a91aae1; fresh containment and all 27 changed files read back with identical bytes.
**Next gate:** Owner delivered-content Human QA for S-005C at verified integration; after actual approval, owner main promotion and completion.

## Outcome

Deliver `promote-decision` as a thin Workbench maintainer skill for one
confirmed decision per invocation. Its coordinator dispatches Record through
`to-docs`, a publisher, Map through `to-spec`, then Plan through `to-tasks`.
The flow is Confirm -> Record -> Publish -> Map -> Publish -> Plan -> Publish.
A nearer endpoint limits the run; Workers author every stage and correction.

## Why It Matters

A confirmed decision held only in one chat or an unmerged branch cannot serve as shared Workbench state. Publish the accepted records before later work depends on them, while keeping unfinished implementation and unresolved decisions separate.

## Current Verified State

At integration `d9a353590644f957ae24636d13ce9a41ef1987e9`, promote is a selected-note reconciliation primitive. Save proves remote branch recovery. To-spec creates a planned Spec without Tasks, and to-tasks cuts Tasks only with activation authority.

The [Promote Skill Rebuild (S-01B)](../S-01B-promote-skill-rebuild/SPEC.md)
header and append-only evidence record owner QA approval at integration
`42431879fab3057db9e26ae661b4e92512c281f0`; its older Completion Result still
says Human QA remains. That source contradiction stays with S-01B. This new
capability preserves its existing records and claims no owner QA for S-005C.

## Desired Behavior

- Cold-start from a saved source pointer, decision ID and confirmed revision; recover the readback, rationale, corrections, scope and endpoint before dispatch.
- Dispatch explicit subagent Record, Map and Plan Workers and a publisher; return corrections to the authoring Worker.
- Publish each applicable record stage to the manifest's integration branch and read it there before advancing.
- Preserve selected-claim and docs-only callers without creating Specs, Tasks or publication authority they did not request.
- The confirmed endpoint supplies planning and native activation authority for its capability. Task planning does not claim or implement the Tasks.
- Resume from live owners, PR state and remote containment, reusing published records and retaining unresolved context.
- Use bounded handoffs and one writer per owner; each receiving context gets source pointers and its exact endpoint.
- The Grill Board dispatcher starts one run per individually confirmed current item/revision, ordering dependencies and shared owners inside batches. Grill-me hands off at session end after the final confirmed readback, one run per decision.

## Decisions And Contracts

The owner confirmed the single-decision skill and entry-point design on
2026-10-07 and authorized delivery through integration after its gates. The
earlier broad parent draft is superseded by that confirmed design. Record
precedes the destination map, and the map precedes authorized Task planning.
Publish means verified integration availability, distinct from local
application, branch push, implementation acceptance and main promotion.

Reuse to-docs, to-spec, to-tasks, save and the existing review/merge route.
Keep `/promote` as its original selected-claim primitive and preserve its safe
`save` composition. Register the new skill under `maintainerSkills`, alongside
implement-spec, through the existing lane adapters. It stays outside Core and
home catalogs; shared generic verb definitions change with this source,
while the Workbench-only orchestration route is exempt from template shipment.

## Non-Goals

- Automatic agent refresh or consumption, a new tracker or publication service.
- Implementing promoted capabilities, changing role names or the rest of Journey.
- Main promotion, owner Human QA or repair of unrelated dirty work and self-drift.

## Dependencies And Blockers

None for this scoped delivery. Existing review and publication gates remain in force.

## Vertical Implementation Slices

Task records own the scoped delivery work; the generated board projects them.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [x] The tracked maintainer skill is reachable through the declared lane adapters and coordinates one confirmed decision through delegated Record, Map, Plan and stage publication, within its endpoint.
- [x] Its cold-start source contract and board/grill-me entry routes retain decision identity, confirmed revision, rationale, corrections, scope, pending state, dependency ordering and recovery from live owners/PRs/containment.
- [x] Existing selected-note reconciliation safeguards and caller scope remain available without recursive save/promote composition.
- [x] A disposable Git-remote scenario publishes docs, then a planned Spec, then unclaimed Task records; a separate clone reads every stage while unfinished code stays off integration. It exercises a docs-only endpoint and retry after an interrupted publication.
- [x] Skills, catalog, Wiki routes and relevant shared definitions agree; the Workbench-only template exemption, required checks and before/after room checks are recorded with their actual limits.
- [x] The publication contract requires fresh per-stage integration containment and changed-owner read-back before dependent work; local application or branch push alone never releases a stage.

## Testing Seams

Workbench lane reachability and Core exclusion; existing public session/Spec
runtime commands in a disposable room with a bare Git remote and independent
reader. Source contract checks pin stage order and caller bounds; fixture
publication proves Git and lifecycle mechanics with simulated merge authority,
not autonomous agent reliability or live GitHub gates. A separate cold-start
delegated scenario can assess coordinator behavior within its observed bounds.
That scenario uses an explicit skill path; ordinary-prompt model discovery is
not established by it or by the filesystem checks.

## Verification Procedure

Outcome hypothesis: a cold-start coordinator recovers one confirmed corrected
decision, delegates authoring and corrections, and holds dependent stages until
the previous stage is read back from integration. Source and fixture checks
cover instruction/command seams; a delegated scenario supplies bounded behavior
observations. Static benchmark scores are separate from that outcome evidence.

Targeted skill-catalog, core-composition and direct-promotion checks; Wiki validation and lint of touched pages; the current Runbook full suite; self-drift pre/post and bounded semantic comparison; independent assembled review at an immutable candidate; fresh remote containment and byte read-back after publication.

Source and fixture acceptance can be assessed before merging this delivery.
The authorized delivery endpoint remains the reviewed source on integration,
with fresh containment and owner-byte read-back recorded in the evidence and
completion result. That final real publication proof is a later delivery gate,
separate from the disposable fixture's simulated publication.

## Documentation Impact

New maintainer skill and manifest/catalog registration; Record, Map, Plan and
grilling callers; board and grill-me entry routes; Wiki article and router;
Runbook operation; shared Lexicon verb definitions and matching generic
definitions. Restore the original core primitive and safe save composition.
Retain prior decision history and S-01B's existing owner QA records.

## Completion Result

The Workbench-only maintainer skill routes one confirmed decision through
delegated Record, Map and Plan, with publication and changed-owner read-back
between dependent stages. The original selected-claim `promote` primitive and
its `save` composition remain available. Source and lane checks cover the
declared routes, Core exclusion, caller bounds and template exemption.

The public-runtime fixture covers sequential publication, a docs-only endpoint,
pending and correction retention, unfinished-code isolation and publication
retry. One separate cold-start trial observed the coordinator dispatch distinct
Record, Map and Plan Workers and a publisher, then read each stage from a local
simulated integration branch. The complete Runbook suite passed at the source
candidate named in the append-only evidence.

These observations do not establish ordinary-prompt skill discovery, repeated
agent reliability, live GitHub stage gates or owner Human QA. Existing unrelated
room drift remains. Read the header's next gate and append-only evidence for
current source delivery state and actual integration proof.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | planning | Captured the owner-directed parent workflow | Current integration source inspected; doctor exits 0 with unrelated attention and blocked-slice findings; fast evaluator passes | This Spec | Implementation, scenario, review and publication remain |
| 2026-10-07 | TK-007K | Reconciled the earlier broad draft to the owner-confirmed single-decision design | New skill source-contract RED: absent maintainer registration; original promote/save recovered from integration d9a353590644f957ae24636d13ce9a41ef1987e9 | Confirmed design reflected in this Spec, caller routes and proposed ADR | Targeted/full checks, delegated behavioral proof, independent assembled review and integration publication remain |
| 2026-10-07 | TK-007K | Captured clean pinned-integration room and benchmark baselines before final delivery | Source d9a353590644f957ae24636d13ce9a41ef1987e9: self-drift has 21 findings, machine blocked and cleanUpdate false; evaluator templates+controls 106.6/113; guardrail templates 43.9/100 evidence-poor | Baseline findings remain under their existing owners; this Spec names the scoped comparison | Unrelated blocked slices, stale claims, stale seeds and provenance remain; detached-head finding came from the inspection clone |
| 2026-10-07 | TK-007K | Corrected the disposable publication fixture setup | Candidate 9353fb32f1dc32ee62b69c64ebb37980848935cf: core-composition fixture failed because render required BLUEPRINT.md; direct-promotion, skills-lane, runbook-index, grill-board and evaluator self-test passed | Added the fixture's Blueprint input; no skill behavior changed | Affected scenario rerun and full suite remain; this was not a clean first pass |
| 2026-10-07 | TK-007K | Completed the publication fixture's renderer prerequisites | Rerun at f36f975ad7d5adddcbb9421d9f87288f3fbc992d identified missing TASKBOARD.md; inspected render's exact Blueprint and hot-specs projection inputs before correction | Seeded the required Taskboard markers; no runtime or skill behavior changed | Affected scenario rerun and full suite remain |
| 2026-10-07 | TK-007K | Corrected the fixture's CLI output contract and clarified the delivery gate | Rerun at aad172c8 used show without --json; inspected showSpec/publicSpec and native activation before correcting its JSON read | Product acceptance now checks truthful stage publication; actual source integration remains the later delivery endpoint | Affected scenario rerun, full suite, assembled review and actual integration proof remain |
| 2026-10-07 | TK-007K | Corrected the proposed ADR source link before full verification | Core-composition rerun at cccdf5000016e072fffaa388003391d99fc9b0dc passed 3/3; full-suite attempt interrupted during its first command after a bounded source-link finding | Proposed ADR now resolves the Spec from its nested folder; added local Markdown targets read back and resolve | The final corrected committed candidate still needs a complete full-suite run, assembled review and integration publication |
| 2026-10-07 | TK-007K | Ran all 54 Runbook commands and reconciled the two ADR failures | Candidate 0b60c49ac3df30ed914d183c42eeeccb834324ad: 52/54 passed; ADR corpus expected 48 carrying records/120 edges but actual 49/121, all literal targets resolving; governance check rejected direct skill canonicalized_in | Re-count evidence supports 49/121 with one new confirmation-DDR edge; canonicalized_in routes through Runbook/Lexicon and body links the skill; router now names maintainer operations; S-01B QA record contradiction reported without changing that Spec | Focused affected checks and a complete full run on the corrected candidate remain; no clean-first-pass claim |
| 2026-10-07 | TK-007K | Completed the corrected committed-source verification | Candidate 10e69cbb86c7a0c8f103dbde411139bd58b6fe6d: all 54 current Runbook commands passed in exact order, 893.18 seconds total; append-only test 264.24 seconds. Corrected ADR/governance/source-route checks, Wiki validation and touched-page lint passed | Six acceptance criteria and this stable Completion Result summarize bounded source and fixture evidence; later edits are limited to Spec/Task evidence and lifecycle projections | Native Task close, fresh independent assembled review and actual source publication to integration remain; prior failed and interrupted checks stay recorded |
| 2026-10-07 | TK-007K | Observed one separate cold-start delegated decision promotion | Explicit-path same-provider trial used unchanged skill SHA256 6409e1786c321ed1f7b10e1c903ed8fe42ae380b50c53abd71390ce24a010648 with d9 runtime. Separate Record, Map and Plan Workers plus publisher produced contained stage candidates d306c6deb2d69e38c8602f97a532f0176e6734a5, 6ba468bc7a9ace9427e55bc92be903d4cf42ac38 and 630b4fb8dd67d2339d46593bdaf16a34e79d8f06; independent reader and root read back owner bytes at final local integration 0fa03d444df75e6d4956bf86b714f2a39e17821a | Decision decision-001 / REPORT-NAME revision 6 retained its date-first correction and unrelated pending question; planned Spec preceded unclaimed ready Task; code commit a5dc29ffe92f38d1579c67f46097fa2a20873ddb stayed excluded | Local bare-remote merge authority was simulated. Fixture board scaffolding and native Priority repair were needed; this is one bounded observation, not ordinary discovery, repeated reliability, live GitHub gates, implementation or owner QA proof |
| 2026-10-07 | TK-007K | Compared final clean source room against pinned integration | Final source 10e69cbb86c7a0c8f103dbde411139bd58b6fe6d: self-drift exits 1, machine blocked, cleanUpdate false and 20 findings; exact code/artifact/claim comparison introduces none against the 21 baseline findings, removing only the inspection clone's detached-head. Skills, managed-tools and layout checks passed at 0b60c49ac3df30ed914d183c42eeeccb834324ad with unchanged skill/manifest/runtime bytes afterward | Bounded owner/route comparison reconciles this capability; templates+controls evaluator remains 106.6/113 and template guardrail audit 43.9/100 evidence-poor before/after | Unrelated blocked slices, stale claims, seeds and historical provenance remain under their existing owners; static scores and room checks do not prove coordinator outcomes or a clean overall Workbench |
| 2026-10-07 | TK-007K | Checked the final evidence and lifecycle handoff | After the full-tested 10e69cbb86c7a0c8f103dbde411139bd58b6fe6d source, only this Spec, TK-007K and its generated Taskboard row changed. Native receipt/render/report/doctor, Wiki validation, citation anchors, source contract, direct append-only and diff checks passed; report reads 6/6 acceptance, a non-placeholder Completion Result and Task Decisions coverage none | Stable capability/check outcome and bounded evidence recorded; in-progress receipts retain actual Git state and the Next gate names root's remaining delivery work | Report's sole completion gap is the intentionally in-progress Task; root owns its close, fresh assembled review and real integration proof |
| 2026-10-08 | TK-007K | Task closed | Runbook54/54 at10e69cbb86c7a0c8f103dbde411139bd58b6fe6d; final evidence/report/doctor/skills/append-only checks at02c2be01769b0fdaaeff54be2eb11174285f5080; one bounded delegated cold-start trial with stage containment and independent owner-byte read-back; exact in-progress checkpoint02c2be01 fetched from origin/codex/promote-workflow. | Promote Decision maintainer source/routes/catalog; Board and Wiki; root/template verb definitions; proposed ADR; S-005C acceptance and evidence; Task receipt and Decisions none. | Scoped Worker authorship and checks complete. Assembled independent review and actual source integration publication/read-back remain in the parent Spec delivery lane; owner delivered-content QA and main promotion remain later gates. Ordinary-prompt discovery and repeated reliability are unproven; existing unrelated room drift remains. |
| 2026-10-08 | TK-007K | Verified native closure from the clean fetched checkpoint | close -> render -> doctor passed; report reads Task done, 6/6 acceptance, Decisions none and no completion gaps; direct append-only checker clean; citation checks passed 16/16 after fixture-write access was granted | Closed Task and generated projections; substantive skill/caller bytes still match the full-tested source | Initial citation rerun hit sandbox EPERM, and an overlapping report saw its temporary fixture; the authorized rerun and sequential report after cleanup passed. Fresh assembled review and actual source integration proof remain |
| 2026-10-08 | review | Review verdict: pass at c805697ab1acfbf7fe787450f85134a5216b0e2d [74c312cf110f] #1 | none | Codex fresh read-only context /root/promote_review, same-provider OpenAI | none |
| 2026-10-08 | review-evidence | Audited the assembled capability in a fresh same-provider context | Pinned c805697ab1acfbf7fe787450f85134a5216b0e2d against d9a353590644f957ae24636d13ce9a41ef1987e9; all 27 files reviewed. Independent core-composition 3/3, direct-promotion 27/27, ADR 57/57, governance 12/12 and Runbook-index 62/62 passed. All 165 trial call/result pairs matched; stage Git trees, hashes and note preservation independently read back | Native content-bound PASS recorded; original trial metadata records OpenAI provider, gpt-6.1-sol alias and CLI 0.162.0-alpha.2; this does not identify an internal model revision | Seven original trace outputs are explicitly truncated; material final boundaries also read back from Git. Discovery, repeated reliability, multi-decision coordination, live GitHub stage gates and owner QA remain unverified; actual source integration publication is next |
| 2026-10-08 | integration-delivery | Published the reviewed source through [PR #434](https://github.com/KaydenClark/LLM_Workbench/pull/434) | GitHub reports merged at b7515137d08668ae2b974c5bab08c5b63a91aae1. Freshly fetched origin/integration contains reviewed c805697ab1acfbf7fe787450f85134a5216b0e2d and final PR head 69b826cfac7c37fec96e5f2f9175e8c3011a00ec; all 27 changed files matched candidate bytes and SHA256 hashes | Actual source publication and next owner gate recorded; Task stays done and Spec stays active; reviewed content digest 74c312cf110f967dd4a59db1733fc80a6d4f3b2c12a19b4bcadb19e76be2988d is unchanged | Owner delivered-content Human QA and owner main promotion remain. The dirty primary checkout was not pulled forward; no automatic session refresh, ordinary discovery or repeated reliability is established |
