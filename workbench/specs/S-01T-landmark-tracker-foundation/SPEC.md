# S-01T - Landmark Tracker Foundation

**Spec ID:** S-01T
**Status:** planned
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Preserve evolving understanding in DQCs and landmarks and generate evidence-backed documentation progress alongside implementation tracking.
**Blockers:** none
**Latest event:** Owner-confirmed design promoted into documentation and this capability Spec; no Tasks or runtime implementation authored.
**Next gate:** Owner-directed Task decomposition or implementation assignment; current request stops at documentation and specification.

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

- Runtime implementation, Task creation or allocation in this planning change.
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
- No owner design blocker. Tasks and implementation remain unassigned by the
  explicit specification-only endpoint, not an unanswered design question.

## Vertical Implementation Slices

No Task rows, Task IDs or Task files are created: the owner explicitly requested
Specs only. Task decomposition is deferred to a later authorized endpoint. An empty
`tasks/.gitkeep` preserves the existing record-backed parser mode in fresh
clones; it is not a Task record or an allocation.

The confirmed first delivery scenario is recorded as acceptance context, not
an executable Task: capture one ungrouped DQC with source lineage, preserve it,
connect it to a landmark when one emerges, and generate evidence-backed progress.
It must exercise record persistence, identity/relationships, calculation and a
readable projection together. Subsequent decomposition must preserve that
vertical behavior rather than treating isolated layers as completed capability.

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

## Completion Result

Capability delivery pending. The documentation/specification packet does not
satisfy runtime acceptance or owner Human QA, and no Tasks have been authored.

## Remaining Limitations Or Follow-Up Specs

- Implementation and detailed Task decomposition are outside this request.
- Initial content can evolve; no exhaustive catalog approval is required.
- Pre-existing attention findings remain with their current owners; neither this
  planning change nor structural checks establish a clean Workbench update.

## Supersession

- Supersedes: no existing capability Spec. Source interpretations superseded by
  owner corrections are preserved in the decision lineage above.
- Superseded by: none.
