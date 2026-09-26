# S-01U - Lexicon Design-Concept Reconciliation

**Spec ID:** S-01U
**Status:** planned
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Audit the whole Lexicon against current design concepts and their governing sources, repair supported drift, and expose unresolved conflicts without promoting proposals or claiming undelivered behavior.
**Blockers:** none for source inventory and independent reconciliation; overlapping workflow and ownership changes retain S-00P and S-00G gates.
**Latest event:** Owner requested a specification for checking and updating the stale Lexicon against all new design concepts; implementation remains unassigned.
**Next gate:** Assign the first bounded reconciliation slice; this request delivers the specification only.

## Outcome

A reader can trust the Lexicon's shared meanings, distinctions and routes against
current accepted design and verified behavior. Every concept source and every
Lexicon section has an inspectable audit disposition. Incorrect, superseded,
missing, duplicated or misleading claims are corrected where evidence settles
them; unresolved conflicts remain explicit and cannot masquerade as definitions.

The result is a reconciled `LEXICON.md`, applicable generic-template updates,
and source-backed coverage evidence in this Spec. It is not merely a newer
review date or a successful structural check.

## Why It Matters

The Lexicon sits on ordinary agent entry and can therefore spread an obsolete
model into planning, implementation and review. Recent workflow, artifact,
continuity, skill and Landmark Tracker concepts have changed the surrounding
model. Piecemeal additions leave older definitions, distinctions and ownership
rows capable of contradicting those additions.

## Current Verified State

Planning baseline: `89d4042fb8931b9d720af75bffea1c28803d72aa`, inspected on
2026-09-26. Read baseline claims with `git show` at that commit; the links below
are navigation to maintained owners, not timeless proof of their future text.

- [LEXICON](../../../LEXICON.md) says Last reviewed September 22, yet already
  includes September 26 DQC, landmark, Tracker and continuity definitions.
  The stamp alone cannot establish whole-file freshness.
- Its Artifact Boundaries describes Task records as still awaiting S-00H
  migration, while its own Core Terms and the
  [Task artifact explanation](../../wiki/design-concepts/task-artifact-and-lifecycle.md)
  describe delivered standalone Tasks. This is a concrete contradictory pair
  to disposition, not proof that every migration obligation is complete.
- Its Spec definition describes a durable capability record, while
  [Blueprint Integrated System Design](../../../BLUEPRINT.md#integrated-system-design)
  calls SPEC and TASK transient working artifacts and assigns enduring
  knowledge to Wiki, ADRs, source and Git. Resolve the scoped destination,
  active record lifetime and durable knowledge distinctions explicitly.
- [Lexicon Freshness Repair — S-00L](../S-00L-lexicon-freshness-repair/SPEC.md)
  is complete. It repaired three release/boundary/date claims and expressly
  excluded definition changes. Preserve that historical result.
- [Workflow Canon Rework — S-00P](../S-00P-workflow-canon-rework/SPEC.md)
  already owns TK-004 Lexicon/ADR reconciliation and TK-005 generic mirrors,
  gated by its existing workflow dependencies. This Spec adds comprehensive
  coverage; it does not quietly reassign or bypass that work.
- [Landmark Tracker Foundation — S-01T](../S-01T-landmark-tracker-foundation/SPEC.md),
  [its accepted ADR](../../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md)
  and [readable concept](../../wiki/design-concepts/landmark-tracker.md)
  preserve the new design. The manifest does not yet declare its proposed
  record collections. Accepted definitions do not establish runtime availability.
- The manifest-declared design-concepts collection includes both cross-cutting
  articles and historical capability explanations. The Tracker article's 23
  candidate directions are an evolving starting map, not an exhaustive taxonomy.
- Baseline doctor has no blocking finding and seven attention findings. The
  read-only self-drift receipt has `cleanUpdate: false`; structural health
  does not certify semantic freshness.

These are planning observations, not a completed audit of every concept.

## Desired Behavior

1. **Establish complete, versioned coverage.** At execution, enumerate every
   tracked article in the manifest's design-concepts collection, the Wiki router
   and relevant linked knowledge, current Blueprint concept sections, active ADR
   decisions and current/planned Spec contracts affecting shared language.
   Include accepted new concepts not yet given a dedicated Wiki article. Record
   path, revision, claim status and governing source. Explain exclusions of
   historical or unrelated material; no silent omissions or date-only filter.
2. **Include emerging understanding safely.** Follow available referenced
   DQCs/landmarks, grilling sources, corrections and existing working records
   when they expose newer concept direction. Use installed runtime only.
   Separate confirmed understanding, authorized Canon promotion, unresolved
   proposals, historical claims and verified Actuality. An unavailable private
   source is an evidence gap, never a reason to guess or silently mark coverage
   complete. Persist supported substance in durable owners so the result does
   not depend on ignored notes or personal memory.
3. **Audit both directions.** Map each concept to affected definitions,
   distinctions, aliases, ownership rows and routes; then review every Lexicon
   section for stale, unsupported, missing, ambiguous or duplicated meaning.
   A concept may need a route or no glossary entry rather than a new term.
   Shared language belongs here; capability details remain with their owner.
4. **Keep a checkable coverage matrix.** Each row identifies the source concept
   and revision, Lexicon claim/location (or missing term), governing evidence,
   semantic assessment, disposition, responsible owner, and verification or open
   gate. Distinguish checked-unchanged, repaired, historical-only, not-applicable,
   implementation-gap, owned-elsewhere and unresolved. A source with no impact
   needs a brief reason; a deferred discrepancy needs a named owner and condition.
5. **Reconcile from evidence.** Follow AGENTS State Resolution and correction/
   supersession lineage. Fix settled documentation drift; label accepted target
   behavior whose runtime is absent; investigate unclear ordering. File recency,
   Wiki placement, a completed Task or green tests never automatically win.
   Surface consequential unresolved meaning to the owner without reopening
   already settled questions. Do not choose an answer just to finish the table.
6. **Cover the integrated concept map.** Review the 23 starting directions in the
   Tracker article plus concepts discovered through the source inventory. At
   minimum cover room/project relationships and portability; workflow and its
   recursive loops; Spec/Task lifetimes and durable knowledge; ownership and
   authority; Context Map and Wiki; roles/stances and skill composition; grilling,
   notepads and Markdown handoffs; DQCs/landmarks/Tracker versus Taskboard;
   verification, feedback, Human QA and correction; Genesis/Adoption, updates,
   Template proof, transport and product boundaries. This list is a coverage
   seed, not a fixed vocabulary or one-term-per-landmark requirement.
7. **Preserve semantics and history.** Preserve source-faithful workflow notation,
   nesting, loops and corrections; distinguish exact source from interpretation.
   Keep retired aliases readable as history. Do not rewrite completed Spec
   evidence, checkpoint history or unresolved answers into apparent consensus.
   Do not conflate Worker/Dispatcher/Director responsibilities, stances, branches
   and approval authority; trace their latest governing decisions explicitly.
8. **Repair the right surface.** Update settled shared definitions and routes in
   root Lexicon and mirror generic changes in `templates/LEXICON.md`. Keep root
   controls filled and templates copy-ready. Check immediate consumers and
   route external obligations to existing owners; this is not a repository-wide
   rewrite or permission to implement another capability. Record explicit
   exemptions for project-specific terms absent from the generic template.
9. **Recheck before completion.** Re-enumerate source coverage at the final
   candidate, review changes since the baseline and reopen affected rows. A
   cold-start reader must recover current meanings and find unresolved gates
   without a private note. Update the review stamp only to the actual review
   scope/date; no clean-Lexicon or clean-Workbench claim with unresolved drift.

## Decisions And Contracts

- The current owner request authorizes creating this Spec, not performing the
  Lexicon rewrite, promoting open design choices, or starting implementation.
- This is a distinct comprehensive reconciliation successor to the completed
  S-00L repair. Existing active delivery owners retain their work and evidence.
- The Lexicon owns shared meanings and navigation. Requirements, operations,
  architectural decisions, evolving understanding and durable explanations keep
  their existing owners. No new glossary, tracker, schema or universal gate.
- Source coverage is required for the whole Lexicon, including unchanged rows.
  Keyword matches and link checks support review but cannot prove semantics.
- Known cross-owner contradictions are not excused by a green suite. Their
  unresolved disposition prevents claiming fully reconciled language until the
  responsible correction or explicit owner resolution is verified.

## Non-Goals

- Editing the Lexicon, other Canon or runtime as part of this specification pass.
- Implementing Landmark Tracker, OWNERSHIP.json, workflow tooling or new skills.
- Resolving provisional design by inference; changing instruction/review authority.
- Rewriting historical evidence, bulk deleting notes, or repeating all grilling.
- Updating other rooms, publishing a version or promoting integration to main.

## Dependencies And Blockers

- [Workflow Canon Rework — S-00P](../S-00P-workflow-canon-rework/SPEC.md)
  owns its existing workflow definitions, ADR reconciliation and mirror work.
  Record overlapping findings here, link to its Tasks, and consume verified
  outcomes; transfer work only through an explicit, recorded scoped decision.
  Its S-00I/S-00J correction and Human QA gates are not bypassed or reset.
- [Ownership Map Root Control — S-00G](../S-00G-ownership-map-root-control/SPEC.md)
  retains unresolved origin/ownership design and proposed ADR gates. This audit
  does not move the schema or claim the eighth root control already exists.
- [Workbench Self-Drift Check — S-00K](../S-00K-workbench-self-drift-check/SPEC.md)
  supplies read-only receipts; use its current runtime without expanding it.
- S-01T supplies accepted Tracker meaning, while S-00W and the individual skill
  Specs supply composition contracts. Neither planned implementation nor whole
  completion of those Specs is a prerequisite to identifying or fixing an
  independent, settled definition.
- No missing owner choice blocks this planning packet or source inventory.
  If a particular correction is gated, block that correction and retain the
  finding; continue independent checks. Whole-Spec acceptance stays open while
  any required semantic conflict remains unresolved.

## Vertical Implementation Slices

The documentation stack is governing evidence -> shared definition and route ->
generic mirror where applicable -> cold-start readback and verification.
Seed only the smallest end-to-end slice; detailed decomposition follows the
coverage inventory under a later assignment, preserving the full acceptance below.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-01Q | Reconcile the Landmark Tracker concept family from accepted sources through Lexicon distinctions, applicable generic mirror and a cold-start readback | ready | none | pending |

### TK-01Q - Reconcile the Landmark Tracker concept family

**Stance:** Builder

Pin current ADR-000N, S-01T and the readable concept; assess DQC, landmark,
Tracker, Taskboard, Expected result, Wiki and notepad claims in all affected
Lexicon sections. Record one coverage row per affected claim; make only
source-settled corrections and mirror generic changes when needed. If the
wording is already correct, preserve it and record checked-unchanged proof.
Demonstrate in under a minute that a reader can distinguish concept sources,
generated documentation progress, implementation work and available runtime.
This slice does not implement Tracker or complete the whole audit. The planning
row does not claim or execute the Task; use the existing Task-record conversion
route before assigned execution where required by current controls.

## Acceptance Criteria

- [ ] A revision-pinned inventory covers all current design-concept articles,
      newer linked concept contracts and every Lexicon section; omissions have
      explicit, justified dispositions and inaccessible evidence stays visible.
- [ ] The coverage matrix traces every finding and every no-change conclusion
      to sources, affected claims, disposition, owner and verification.
- [ ] Definitions, distinctions, aliases, ownership and navigation agree with
      supported current design; missing shared terms are added only when agreed,
      and requirements/status detail is routed to its proper owner.
- [ ] Accepted-but-unimplemented concepts are labeled accurately; proposals,
      superseded answers, historical wording and authority remain distinguishable.
- [ ] The concrete Task-record and Spec-lifetime discrepancies above and all
      other audit findings have verified resolutions; cross-owner obligations
      remain reachable and their gates are satisfied before full completion.
- [ ] The current concept map, including all 23 starting directions and later
      additions, has explicit coverage; exact workflow source notation survives.
- [ ] Applicable generic corrections reach the template; exclusions have reasons;
      links and immediate consumers remain valid without expanding scope.
- [ ] A final source-delta review and cold-start readback demonstrate current
      meaning from tracked owners; the review date reflects actual review scope.
- [ ] Targeted checks, the full AGENTS suite, self-drift pre/post receipts and
      bounded manual semantic review are recorded with remaining limitations.
- [ ] Separate-context review of the immutable implemented candidate and owner
      Human QA meet existing completion gates; planning approval is not QA proof.

## Testing Seams

The main semantic seam is source claim -> Lexicon wording -> a cold-start
reader's answer. Record concrete before/after examples and source-based readbacks.
Prose judgment cannot be established by a test that merely expects the new words.
For mechanical behavior changes, use red/green at existing public seams; do not
add a new tool or phrasing-only tests to manufacture audit evidence.

Existing checks include `tools/test-controls-vocabulary-sweep.mjs`,
`tools/test-governance-core.mjs`, `tools/test-control-fidelity.mjs`,
`tools/test-spec-citation-anchors.mjs`, Wiki validation and spec render/doctor.
Check local links and anchors against the candidate; treat historical commit
citations separately. Structural passes support, but never replace, semantics.

## Verification Procedure

For planning: render, show this Spec, doctor, `git diff --check` and the full
AGENTS suite. Inspect the generated catalog and board for honest planned state.
No behavior is changed, so no new red/green test is needed for this packet.

For implementation: capture immutable baseline and pre receipts; perform the
source inventory and two-way semantic audit; confirm a failing example for each
repair; make the smallest correction and record the successful readback. Run
relevant targeted checks then the full AGENTS suite. Recheck source deltas,
post receipts and unchanged-history boundaries. Preserve a brief demo of finding
the right definition, source and implementation limitation. Report exactly which
claims are verified, blocked or externally owned; do not equate 100% row
coverage with zero semantic defects.

## Documentation Impact

This planning change adds this Spec and regenerates Taskboard/catalog only;
project-specific planning has no generic-template counterpart. Future execution
updates root/generic Lexicon and only justified immediate consumers. The coverage
matrix and verification belong in this Spec or linked evidence beside it.
Shared meaning is authored once in the Lexicon, not duplicated as another Wiki
glossary. Completed knowledge follows existing reconciliation/lifecycle rules.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-26 | none | Owner requests a Spec for updating the stale Lexicon against all new design concepts. Baseline 89d4042fb8931b9d720af75bffea1c28803d72aa in isolated codex/lexicon-design-reconciliation; original checkpoint edit preserved. | Read entry controls, manifest, catalog, Wiki routes and selected concept/Spec/ADR sources. Doctor: zero blockers, seven attention findings. Self-drift pre: cleanUpdate false. Guardrail 78/100. | Authored comprehensive audit contract and minimal first slice; no Lexicon changes. | Planning verification pending; whole concept audit and corrections unexecuted. |

## Completion Result

Specification authored; capability implementation, semantic audit and owner QA
remain pending. No acceptance box is satisfied merely by creating this file.

## Remaining Limitations Or Follow-Up Specs

- Source inventory is refreshed at execution; today's starting map is not a
  claim that all concepts have already been inspected.
- Existing self-drift attention findings remain outside this planning change.
- No new follow-up Spec is invented; reconcile overlaps with existing owners.

## Supersession

- Supersedes: none. Follows the completed, narrower S-00L repair without rewriting it.
- Superseded by: none.
