# S-01T - Landmark Tracker Foundation

**Spec ID:** S-01T
**Status:** active
**Priority:** 1
**Owner:** claude-lane-J
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Preserve evolving understanding in DQCs and landmarks and generate evidence-backed documentation progress alongside implementation tracking.
**Blockers:** none
**Latest event:** 2026-09-26 TK-01X closed with proof: the Tracker root is declared and validated, `landmark-tracker.mjs` captures, revises, links and rebuilds, and `node tools/landmark-tracker-demo.mjs` reproduces 30/20/50; TK-01Y released to ready.
**Next gate:** Claim and deliver TK-01Y (distributions across source types and scopes), now eligible; TK-01Z and TK-02A stay deferred until S-00I TK-01U is done on integration.

## Outcome

A room can capture a Destination Question Card (DQC) before any landmark or
delivery record exists, preserve its source lineage and evolving understanding,
connect it to landmarks as they emerge, and generate an inspectable account of
its progress toward durable documentation. Landmarks can overlap and outlive
several Specs. Wiki explanations become correct, readable knowledge through
ordinary delivery. Tracker monitors documenting; Taskboard monitors implementation.

This is one capability encompassing records, their generated view and the
workflow/documentation integration needed to make that view truthful. It is
not one Spec per candidate landmark or one Spec per implementation layer.

## Why It Matters

Confirmed understanding can remain buried in grilling notes while completed
Tasks create the impression that it reached its durable destination. The owner
needs to see what is understood, what changed, what still needs documentation
and whether actual knowledge matches the expected result. The foundation must
work with incomplete answers and an evolving inventory instead of demanding
that all content be finalized first.

## Current Verified State

Baseline tree: `147ad3fec3f6df1bcf9a002e7ecf7e78d726bc3c`.
Read the following observations at that immutable tree using `git show`:

- `workbench/manifest.json` declares the existing seven lanes and collections;
  it declares no Tracker root, DQC/landmark collection or Wiki features collection.
- `workbench/tools/spec-workbench.mjs` loads Specs/Tasks and generates
  `TASKBOARD.md`; it does not implement the proposed Tracker.
- `workbench/tools/notepads.mjs` maintains local JSON context with revision,
  privacy and dependency checks. That is available continuity, not DQC storage.
- `workbench/tools/visible-ids.mjs` and `workbench/tools/workbench-paths.mjs`
  provide identity and manifest-resolution seams. Historical numeric Task IDs
  retain their Spec-qualified scope; do not assume every old label is globally unique.
- `RUNBOOK.md` documents move/retire/discard and immutable historical citations;
  `tools/test-spec-workbench.mjs` contains recovery fixtures. Existing Markdown
  reference support does not prove proposed JSON reference support.
- `workbench/wiki/SCHEMA.md` and its design-concepts README define readable
  knowledge ownership. The historical ledger's WF-8H already selects a future
  features collection and routine feature documentation; that support is absent.
- No Landmark Tracker capability owner was found through the catalog and
  selected controls. The read-only next-ID proposal returned this Spec identity.

This planning candidate adds accepted definitions, direction, an ADR and a
readable design article. It creates no Tracker records, runtime, manifest
collection, Task, new command or release. Actuality remains as described above.

## Desired Behavior

### Concept records and identity

1. A DQC synthesizes related grilling questions into a meaningful concept. It
   preserves source question identities, questions/answers as appropriate,
   uncertainty, corrections, reasons, changes, related artifacts and alignment
   assessments with evidence. It is not one raw interview prompt per card.
2. DQCs may exist without a landmark, Spec, Task, final answer or known Wiki
   destination. Show no landmark explicitly; do not create a placeholder parent.
   An answered question has Expected result describing intended durable change
   and its home when known. Result records achieved delivery separately.
3. A landmark is an evolving feature/framework-pillar account and its importance.
   It links related concepts and work, can overlap others, and can begin before
   delivery or remain after several Specs finish. It is not implemented itself.
4. DQCs and landmarks use WBIDs, with type/room scoping and legacy identity
   preservation. Retitling does not renumber origins. Use linked growth instead
   of destructive record conversion; future mechanics must preserve lineage.
5. Current pre-delivery understanding lives in DQCs and landmarks. Grilling
   notepads remain historical and handoff-like working context. Preserve useful
   original discussion, corrections and continuity; no automatic purge or
   mandatory archival ceremony follows reconciliation.
6. The approved root is `workbench/landmark-tracker/`, containing generated
   `TRACKER.json`, flat `destination-questions/` and flat `landmarks/` JSON files.
   Implement manifest discovery and layout compatibility before using these
   paths. Do not silently add an eighth support lane or place records under the
   old grilling/status-folder proposals. Exact type prefixes and schema fields
   are implementation choices subject to existing identity rules.

### Projection and documentation evidence

7. Generate a compact view with meaningful titles, relationships and per-step
   distributions. Source lineage and assessments can be expanded. The view is
   rebuildable from source records; manual card movement must not create a
   competing author or a single-stage/reset lifecycle.
8. Preserve this exact ordered vocabulary: Idea, Aligning, Confirmed, Mapped,
   Planned, Journey, Review, Verified. These describe concept/documentation
   progress, not Task status or implementation effort.
9. Related grilling questions, Specs, ADRs, Tasks and DQCs can contribute. Each
   distinct related item contributes one unit total in the first version. A
   mixed item contributes fractions summing to one. For each step:

   `percentage = sum(item contributions to step) / distinct item count * 100`

   A DQC at 0.6 Journey / 0.4 Review plus one Verified item gives 30% Journey,
   20% Review and 50% Verified. Preserve the mixed DQC as one contribution;
   never flatten it into child counts to obtain that contribution. Shared items
   remain visible beneath each related question but count once in a shared
   aggregate. Apply the same semantics at DQC, landmark and Workbench scope.
10. Make the counted identities and evidence inspectable. Do not introduce the
    withdrawn supporting-reference exclusion, implementation-effort weights or
    automatic completion proxy. Context navigation and arithmetic traversal
    must not silently change the accepted set of related constituent items.
11. Empty inputs display no items, never completion or a zero-denominator
    calculation. Unknown identities, missing assessments and invalid fractions
    produce explicit incomplete/invalid results rather than fabricated stages.
    Preserve navigable relationship cycles; refuse arithmetic dependency cycles
    with a useful explanation. Do not silently drop records to make totals pass.
12. Each stage assessment names its supporting evidence and revision. A practical
    assessment contract is: recorded need (Idea); investigated alternatives or
    unanswered alignment (Aligning); scoped confirmation (Confirmed); reconciled
    applicable destination/map owners (Mapped); bounded documentation delivery
    plan (Planned); that work underway (Journey); actual candidate documentation
    assessed against expected claims (Review); satisfactory evidence against
    actual durable contents with applicable owner gates respected (Verified).
    Use this meaning across source types; never map `done` or ADR acceptance
    straight to Verified. Mixed assessments state the basis of their fractions;
    no arbitrary progress numbers are invented by the renderer.
13. On changed understanding, preserve what changed and why, assess specific
    affected claims against their evidence, and expose supported reconciliation
    needs. A relation alone does not make every target stale. Keep earlier
    evidence interpretable at its original revision.

### Workflow, Wiki and recovery

14. Workflow activity, including planning/building/review and continuing alignment,
    maintains records with reasons and evidence. Composition handles this work;
    the grilling primitive stays unaware of Tracker machinery. Record maintenance
    remains within the caller's authority and does not create assignments.
15. Create or update readable Landmark Wiki explanations during normal authorized
    Spec/Task delivery; planning and review also reconcile documentation. Several
    Specs may contribute to one article. No separate publishing ceremony or
    pre-answer Wiki destination requirement is introduced.
16. Landmark Wiki pages contain no WBIDs anywhere, including metadata, URLs/link
    targets and hidden structured text. Keep identity-bearing provenance in DQC,
    landmark and delivery records, and use readable identifier-free source routes
    in the article. Do not weaken this to a prose-only check. Wiki claims retain
    existing ownership/authority boundaries. Feature explanations and cross-cutting
    design-concept articles keep distinct jobs; deliver the missing collection,
    schema and retirement compatibility needed by the approved feature route.
17. Preserve existing grilling sources and ledger authorship. Durable accepted
    decisions belong in their designated owners; a generated Tracker, notepad,
    Wiki article or confirmed answer never supplies implementation authority.
18. Resolve live record references after supported moves and retirement. Preserve
    immutable commit/path citations for historical proof and use existing discard
    recovery rules for tracked records. Extend and verify JSON link consumers;
    do not claim ignored local notes are recoverable from ordinary Git history.
19. Landmarks emerge from DQCs as important features or framework pillars warrant
    Blueprint representation. Overlap and additional landmarks are expected.
    The [readable starting map](../../wiki/design-concepts/landmark-tracker.md)
    carries the endorsed 23-candidate direction. It is not a closed taxonomy,
    mandatory numerical threshold or prerequisite to building the foundation.

## Decisions And Contracts

The accepted architecture and rejected alternatives are owned by
[Landmark Tracker connects evolving understanding to durable knowledge](../../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md).
Shared definitions belong to [LEXICON](../../../LEXICON.md), cross-cutting
direction to [BLUEPRINT](../../../BLUEPRINT.md), agent obligations to
[AGENTS](../../../AGENTS.md), and availability/procedure to [RUNBOOK](../../../RUNBOOK.md).

Owner-approved source lineage, promoted here without depending on an ignored
notepad path for recovery:

| Grilling branch | Accepted result and supersession |
|---|---|
| Q1/Q1A/Q1B, later inventory confirmation | Start with the endorsed candidate map; discover more landmarks from DQCs. Overlap is allowed; exhaustive curation is not a gate. |
| Q2/Q3/Q4/Q22B/Q28/Q31 | Four distinct pieces; DQCs are concept syntheses, landmarks are evolving accounts, Tracker projects, Wiki explains. Not a Spec/PRD. |
| Q5/Q9/Q16/Q23 | Additive documentation view beside implementation Taskboard; ledger replacement and sole-board exclusivity are superseded. |
| Q6/Q15 | WBIDs preserve source identities; live navigation and immutable historical evidence have different recovery jobs. |
| Q7/Q8/Q29/Q30, corrected Q8 confirmed September 26 | No parent Spec/landmark prerequisite; DQCs/landmarks hold current pre-delivery understanding; grilling notes become historical/handoff-like. |
| Q10/Q12/Q13/Q23 | Evolving source understanding, no reset lifecycle; exact eight steps and evidence-backed affected-claim assessment. |
| Q14/Q19 | Claim-level planes and existing authority remain; confirmation is not promotion or execution permission. |
| Q20/Q21 | Primitive unaware; workflow composition maintains records; Wiki writing is ordinary delivery. |
| Q22A/Q28 | Approved root with flat JSON collections; no status folders or selected root relocation. |
| Q24/Q25/Q26/Q27 | Equal distinct-item units, mixed fractions, shared-item deduplication, documentation meaning at all three scopes. Later contributor/reference filtering was withdrawn. |
| Q11/Q17 and approved review | Clear concept names, compact projection and expandable evidence; no mandatory per-utterance card or implicit Frontier redefinition. |
| Foundation-first confirmation | Ungrouped DQC -> later landmark connection -> generated documentation progress is the first useful delivery path. |
| September 26 promotion request | Document and specify now; no Tasks yet and no runtime implementation in this planning change. |

Implementation latitude includes concrete field names, commands, JSON shape,
assessment mechanisms and UX presentation, constrained by the above acceptance.
No currently identified owner design choice blocks this Spec. New contradictions
must be evidenced in this owner, not turned into a repeat of settled grilling.

## Non-Goals

- Runtime implementation, Task creation or allocation in the original planning
  change (the 2026-09-26 owner instruction to continue the dispatch run later
  authorized Task decomposition and delivery; see Vertical Implementation Slices).
- Replacing the ledger, Taskboard, Contract, source artifacts or Wiki.
- One landmark per Spec, one DQC per utterance, or a finalized inventory gate.
- A hosted service, database, paid dependency, new agent authority or scheduler.
- Release/version changes or changes to other Workbench rooms.
- Relocating TRACKER.json directly under `workbench/` or forcing ungrouped
  questions onto a main-project placeholder.
- Automatically converting/deleting source records, changing established review
  gates, or claiming owner Human QA from tests or documentation approval.

## Dependencies And Blockers

- Existing manifest/path, visible-ID, notepad, Wiki and Spec/Task consumers are
  integration seams, not proof that Tracker is already available.
- Coordinate shared collection and lifecycle work with [Folder Lifecycle](../S-00I-folder-lifecycle-for-records/SPEC.md),
  workflow controls with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md),
  information ownership with [Ownership Map](../S-00G-ownership-map-root-control/SPEC.md),
  and workflow composition with [Concept Grilling And Notepad Composition](../S-00W-concept-grilling-and-notepad-composition/SPEC.md).
  These existing owners retain their obligations; their whole completion is
  not invented as a prerequisite for a bounded foundation implementation.
- This Spec carries the Tracker's need for feature-article collection/schema
  compatibility identified by WF-8H; reconcile with existing owners before
  implementing shared consumers, without discarding their unfinished work.
- No owner design blocker. On 2026-09-26 the owner's instruction to continue
  the dispatch run authorized Task decomposition and delivery; the earlier
  specification-only endpoint is superseded, and its planning evidence stands.

## Vertical Implementation Slices

The original planning change created no Tasks. On 2026-09-26 the owner told
the Claude Director to continue the dispatch run; that instruction authorized
decomposition. Lane J converted the Codex dispatcher's four unallocated packet
drafts (candidate `e58655d`, input only, not carried) into Task records,
allocating each ID with `next-id S-01T --prefix TK` on integration `ec848e5`
immediately before saving it. The records in `tasks/` are authoritative:

| Task | Slice | Status | Blockers or release |
|---|---|---|---|
| [TK-01X](tasks/TK-01X/TASK.md) | Capture an ungrouped DQC, keep it through a later landmark, and rebuild its view | done | none |
| [TK-01Y](tasks/TK-01Y/TASK.md) | Inspect documentation distributions across source types and scopes | ready | none (TK-01X done) |
| [TK-01Z](tasks/TK-01Z/TASK.md) | Assess actual Landmark Wiki content so two Specs maintain one readable article | deferred | TK-01Y done and S-00I TK-01U done on integration |
| [TK-02A](tasks/TK-02A/TASK.md) | Keep live Tracker references and historical proof through record moves | deferred | TK-01X done and S-00I TK-01U done on integration |

Cross-Spec conditions are expressed as `deferred` plus a Release section,
because the runtime resolves only this Spec's Task IDs and whole Spec IDs.

### Compatibility pins (2026-09-26)

- **Features single writer.** [S-00I TK-01U](../S-00I-folder-lifecycle-for-records/tasks/TK-01U/TASK.md)
  writes the Wiki `features` collection, its schema and type, and its manifest
  and path consumers; this Spec consumes them and never writes them. Feature
  articles keep the Spec-ID-bearing retirement `source_paths` provenance.
  Requirement 16's no-WBID rule governs Landmark Wiki pages, a different
  article type, so the draft's structured bridge between the two contracts is
  unnecessary and neither is weakened. Requirement 16's collection, schema and
  retirement compatibility is delivered by consuming TK-01U.
- **Identity.** DQCs and landmarks allocate WBIDs through the existing
  `allocateVisibleId` seam, unique within their type prefix and the Workbench;
  `visible-ids.mjs` changes only for a proved gap. S-00O carries no pending
  DQC or landmark identity change that this would race.
- **Shared files.** TK-01X and S-00I TK-01U both edit `workbench/manifest.json`,
  `workbench-paths.mjs` and `workbench-layout.mjs` under different keys; the
  second to land rebases. TK-02A serializes its `spec-workbench.mjs` lane
  behind S-00J TK-01S/TK-01T and S-00I TK-01U.
- **Root controls.** `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `BLUEPRINT.md`
  and `templates/` root controls stay with S-00P during its rewrite. Tracker
  procedure lives in `workbench/landmark-tracker/README.md`; Runbook and suite
  wording the Tasks need is listed under Remaining Gaps below for S-00P.

The confirmed first delivery scenario (capture one ungrouped DQC with source
lineage, preserve it, connect it to a landmark when one emerges, and generate
evidence-backed progress) is TK-01X. It exercises persistence,
identity/relationships, calculation and a readable projection together.

## Acceptance Criteria

- [ ] A fresh clone can discover and use the delivered capability from tracked
      controls and declared collections without the author's ignored notes.
- [ ] An unanswered, ungrouped DQC is valid and visible without a Spec, Task,
      landmark or predetermined Wiki destination; confirmation and Expected
      result can be added without destroying origin history.
- [ ] A later landmark connection and retitling preserve DQC/source identities;
      overlapping landmark relationships and discovery of new landmarks work.
- [ ] Generated Tracker can be rebuilt from records and displays meaningful
      concepts, expanded lineage and evidence-backed documentation distributions.
- [ ] Exact eight-step vocabulary, the 30/20/50 example, shared identity
      deduplication, mixed-question contribution and Workbench-wide aggregation
      pass deterministic examples without filtering or flattening away meaning.
- [ ] Empty, unknown, missing-assessment, invalid-fraction and cyclic dependency
      cases terminate with explicit outcomes; invalid writes preserve prior data.
- [ ] Completing a linked Task without the expected durable documentation does
      not produce Verified; actual content comparison and applicable gates do.
- [ ] Changed understanding exposes evidence-backed affected claims and preserves
      earlier proof without blanket invalidation or card-reset behavior.
- [ ] Workflow composition maintains sources while the grilling primitive stays
      independent; notes retain needed history and handoff dependencies.
- [ ] Several delivery Specs can maintain one readable article; the article has
      no WBIDs in any bytes, and structured provenance remains recoverable.
- [ ] Feature/design-concept routes and collection/schema/retirement consumers
      agree with delivered Wiki behavior; no invented command or undeclared path
      is required and ordinary Wiki delivery adds no extra publishing gate.
- [ ] Live and historical references survive supported movement/retirement;
      discarded tracked source proof can be recovered from the named commit.
- [ ] Full checks, self-drift receipts and an under-one-minute end-to-end demo are
      recorded at the implemented candidate. Separate-context integration review
      and applicable owner Human QA are satisfied before capability completion.

## Testing Seams

Future implementation defines public record validation/read/write and projection
boundaries; no command names are invented in this planning packet. Exercise them
through disposable rooms using current `workbench/tools/workbench-paths.mjs`,
`visible-ids.mjs`, `notepads.mjs`, `wiki.mjs` and `spec-workbench.mjs` seams.

Use table-driven examples for fractions/identity; invalid-input tests must prove
no partial write. A completed-Task/missing-Wiki-content fixture distinguishes
implementation from documentation. Test no-WBID compliance against the complete
article bytes. Use current recovery fixtures for move/discard extension, plus a
fresh-room workflow demonstration for composition and discoverability. Passing
source-wording tests alone cannot establish these outcomes.

## Verification Procedure

For implementation, first add failing tests at the selected public seams, prove
the expected failures, implement the minimum correct behavior, then run targeted
and full checks in AGENTS. Capture guardrail and self-drift pre/post receipts,
state remaining findings and limits, and demonstrate the first path in under a
minute. Assess actual Wiki content and applicable owner gates separately.

For this documentation/specification change, run existing documentation and
full repository checks without creating behavior tests for absent runtime:

```bash
node workbench/tools/adr.mjs register
node workbench/tools/wiki.mjs validate
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs show S-01T
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

Definitions/ownership routes: Lexicon. Product direction: Blueprint. Authority
and workflow maintenance: AGENTS. Availability and recovery: Runbook. Rationale:
accepted ADR. Readable explanation and evolving initial map: Wiki and its router.
Shared agent/control guidance is mirrored in generic templates. The generic
Blueprint remains unchanged: this product-specific direction belongs to the
filled root Blueprint, and preserving its existing placeholder vocabulary keeps
Genesis compatibility without a runtime change. The project
Spec, ADR and owner-directed Wiki article are project truth, not generic seeds.
No manifest or managed runtime/skill bytes are changed by this planning work.
The original workflow diagram is preserved byte-for-byte.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none | Owner invokes to-docs and to-spec; no Tasks. Planning baseline at 147ad3fec3f6df1bcf9a002e7ecf7e78d726bc3c in isolated codex/landmark-tracker-foundation. | Doctor: zero blockers, seven attention findings. Self-drift pre: same seven findings, cleanUpdate false. Guardrail baseline 78/100; four outcome-evidence recommendations. | Prior confirmed design and correction lineage synthesized above; unrelated checkpoint edit preserved in original checkout. | Verification of authored planning candidate pending; capability not implemented. |
| 2026-09-26 | none | Planning verification at 541aac0a1e167f7d93cd72783a48bf740f2e9a64; corrected only the ADR corpus expected-link count afterward. | All 48 required commands executed: 47 passed; ADR count 61 versus actual 62 failed, then all 29 ADR tests passed with the count reconciled. Wiki/ADR validation, render, doctor, exact workflow-map preservation and no-WBID/no-Task checks passed. See [planning verification receipt](planning-verification.json). | Root/generic owners, accepted ADR-000N, readable article, router and historical reconciliation links documented. Initial independent review passed 84eaf20; final immutable candidate review follows. | Seven existing attention findings remain; guardrail 78/100 unchanged with four outcome-evidence recommendations. No runtime, Tasks or Human QA completion claimed. |
| 2026-09-26 | none | Lane J (Claude Director dispatch, owner instruction to continue the run) rebuilt the planning candidate on integration ec848e5: four Task records TK-01X, TK-01Y, TK-01Z, TK-02A converted from the Codex packet draft at e58655d (input only; PACKET-PLAN.md and dispatch-verification.json not carried), each ID proposed by next-id S-01T --prefix TK immediately before its record was saved; features single-writer (S-00I TK-01U), identity and root-control compatibility pinned. | render; doctor no blocking finding (seven existing attention findings plus the untracked-record notice before commit); show S-01T; full AGENTS suite, fresh-clone doctor and separate-context review are recorded on the committed candidate in the review verdict row. | SPEC header, Non-Goals, Dependencies, Vertical Implementation Slices, Completion Result and Remaining Limitations updated; four TASK.md records; TASKBOARD.md rendered. No root control, runtime, manifest, Wiki or template change. | No runtime yet; TK-01X is next. Runbook and suite-list wording for the Tracker is owed to S-00P once TK-01X lands. |
| 2026-09-26 | review | Review verdict: pass at 98b8b18c8d60d377e9c3ed289d373406c8982cf8 [3f607c74c281] #1 | No High/Medium/Low findings. Full AGENTS suite 48/48 at the committed candidate (read-only runner, dirty []); fresh-clone doctor no blocking finding; render idempotent in the clone. Reviewer ran show and doctor; did not rerun render or the suite (read-only sandbox). | codex exec gpt-5.5, read-only sandbox, separate context from the Lane J dispatcher | 4 |
| 2026-09-26 | TK-01X | Task closed | Red 0a365b0 (tools/test-landmark-tracker.mjs 1/12 pass: declaredTracker absent, malformed declarations validate, landmark-tracker.mjs missing; layout Tracker test fails missing-collection; tools test fails RUNTIME_TOOLS lacks landmark-tracker.mjs). Green 2592f28, docs d5c0951. node tools/test-landmark-tracker.mjs 13/13; test-workbench-layout 71/71; test-workbench-tools 19/19. Full AGENTS suite TOTAL pass=48 fail=0 at candidate d5c0951ed03a70ccdc0a1a87660aa3be30a6b8c2 dirty [] (also 48/48 at 2592f28). Doctor no blocking finding (seven pre-existing attention findings). Self-drift pre (a2b6e68) and post: same seven pre-existing findings plus detached-head only in the detached base worktree; no new finding; cleanUpdate false. Guardrail 78/100 before and after, same four outcome-evidence recommendations. Demo: node tools/landmark-tracker-demo.mjs, 0.8s, 30/20/50 PASS. | workbench/landmark-tracker/README.md (new procedure: capture, revise, link, rebuild, concurrency guarantee); workbench/landmark-tracker/TRACKER.json (generated empty); workbench/landmark-tracker/destination-questions/.gitkeep; workbench/landmark-tracker/landmarks/.gitkeep; workbench/manifest.json (landmarkTracker block); workbench/wiki/design-concepts/landmark-tracker.md (availability sentence, route, history); TK-01X TASK.md (Delivered Shape, Remaining Gaps with S-00P wording); SPEC.md slice table and limitation bullet; TASKBOARD.md rendered. No root control or templates/ change. | TK-01Y distributions, TK-01Z Landmark Wiki evidence, TK-02A reference recovery remain; only DQCs are counted items so far. No doctor-level Tracker drift finding (rebuild --check is the seam). New Genesis rooms do not declare the Tracker by default. Revision check is not a lock. Owed to S-00P: AGENTS suite line node tools/test-landmark-tracker.mjs and the RUNBOOK paragraph, verbatim in TK-01X Remaining Gaps. |
| 2026-09-26 | review | Review verdict: fail at 46df44295f4cc8ec5ff7800ce3f149f99747faa2 [33effcbc794e] #2 | Medium: TK-01X Receipt run 1 names HEAD d5c0951 while its Docs cell includes close-time writes (TASKBOARD re-render, Spec slice table, TK-01Y release) that land only in close commit 46df442, mixing the verified candidate with the close commit's provenance. No runtime behavior finding; root controls, templates and visible-ids untouched; manifest/path changes additive. Reviewer sandbox could not mkdtemp for targeted tests. | codex exec gpt-5.5, read-only sandbox, separate context from the Lane J dispatcher and worker | 3 |
| 2026-09-26 | TK-01X | Correction: TK-01X Receipt run 1 provenance | `close` requires a clean pushed tree, so Receipt run 1 records HEAD d5c0951 (claim 77225a7, red 0a365b0, green 2592f28, docs d5c0951), the verified implementation and documentation candidate: full AGENTS suite 48/48 there, dirty []. The run's Docs cell also lists writes the close itself made - the TK-01X and TK-01Y status and header changes, the Spec slice table, Completion Result and limitation bullets, and the TASKBOARD.md re-render - which exist only in close commit 46df442, not at d5c0951. At 46df442 the full AGENTS suite is also 48/48 (dirty []), fresh-clone doctor has no blocking finding, and `landmark-tracker.mjs rebuild --check` is current. | Receipt run 1 and the Task closed row are unchanged (append-only); this row supersedes their provenance reading only. | none |
| 2026-09-26 | review | Review verdict: pass at 957034a90deae657a24d379de60061dcd24f7dc3 [6a5558de90bc] #3 | No High/Medium/Low findings on the corrective and re-merge delta: the correction row resolves the receipt-provenance Medium without editing published rows; merge e0c7ef1..957034a matches the branch delivery, RUNTIME_TOOLS keeps host-floor.mjs and landmark-tracker.mjs; Tracker uses default allocateVisibleId width, compatible with planned S-01W. Full AGENTS suite 48/48 at 957034a (dirty []); test-landmark-tracker 13/13, test-workbench-tools 19/19, test-workbench-layout 71/71; doctor no blocking finding; rebuild --check current. | codex exec gpt-5.5, read-only sandbox, separate context from the Lane J dispatcher and worker | 6 |

## Completion Result

Capability delivery pending. The documentation/specification packet does not
satisfy runtime acceptance or owner Human QA. Four Tasks are authored; TK-01X
(the foundation path) is delivered on its branch, and TK-01Y, TK-01Z and TK-02A
remain. No acceptance box is checked: each spans later Tasks, separate-context
review or owner Human QA.

## Remaining Limitations Or Follow-Up Specs

- Implementation proceeds through TK-01Y, TK-01Z and TK-02A; TK-01X is done.
- Owed to S-00P (root controls): Runbook procedure for the Tracker and the
  suite-list line for its test; the exact wording is in
  [TK-01X Remaining Gaps](tasks/TK-01X/TASK.md#remaining-gaps).
- Initial content can evolve; no exhaustive catalog approval is required.
- Pre-existing attention findings remain with their current owners; neither this
  planning change nor structural checks establish a clean Workbench update.

## Supersession

- Supersedes: no existing capability Spec. Source interpretations superseded by
  owner corrections are preserved in the decision lineage above.
- Superseded by: none.
