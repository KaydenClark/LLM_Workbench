# S-01U - Lexicon Design-Concept Reconciliation

**Spec ID:** S-01U
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Audit the whole Lexicon against current design concepts and their governing sources, repair supported drift, and expose unresolved conflicts without promoting proposals or claiming undelivered behavior.
**Blockers:** none for source inventory and independent reconciliation; overlapping workflow and ownership changes retain S-00P and S-00G gates. Recovery publication is held after October 3 automatic approval review rejected the GitHub push; explicit owner approval of this payload and destination is required.
**Latest event:** October 1 TK-01Q branch recovered on current integration with later Canon retained; 55/55 fresh required and targeted checks pass. The Task-PR integration gate requires separate-context review of the final immutable commit.
**Next gate:** Obtain explicit owner approval to push the inspected recovery branch to KaydenClark/LLM_Workbench and merge its reviewed PR into integration. The remaining comprehensive audit requires a later bounded assignment; all ten whole-Spec criteria and owner QA/main remain open.

## Current Recovery Instruction — 2026-10-03

The owner asks to fix the unmerged October 1 Lexicon branch so the subsequent
Dictionary Terms work can proceed. Recover only this existing slice against
current integration, retain the later accepted definitions, preserve historical
proof, run current verification and separate-context review, and land the
reviewed Task candidate on integration. This supersedes the earlier no-merge
and held-publication endpoint for this recovery only. It does not assign the
Dictionary Terms implementation, complete the comprehensive audit, approve
Human QA or authorize main. [Recovery assessment](recovery-2026-10-03.md)
records source deltas and the remaining gates.

## Historical Execution Instruction — 2026-10-01

The current user delegation under Kayden's overnight entire-v4 directive
supersedes the planning-only execution endpoint for existing TK-01Q only.
The original planning constraints and evidence below retain their dated meaning.
Owner remains codex. Scope is root and generic Lexicon, this Spec/Task and
Spec-local coverage/readback proof, with native generated projections.
No new Task ID, carry TK-004Q work, ADR acceptance, Tracker source, Wiki index,
Ownership map, runtime/schema or Taskboard JSON rollout is authorized here.
S-00P retains its workflow ownership; consume its settled current controls.
Publish a branch/draft PR when permitted; do not merge. All ten whole-audit
acceptance boxes and owner Human QA/main remain open. Genuine user decisions
route to the coordinator's existing single grilling record, never a new one.

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

| 2026-09-26 | none | Initial planning checks completed; rebased onto concurrent integration ebb01dc9d44f60dcec151e0d074d060af82a0ad4 as 49cf2fd85437165e0f60e1368441b24aa7e5b35f. | All 48 required commands passed before rebase; initial separate-context scope review found no actionable issue. Reviewed concurrent grill-me/core-count and S-00M/S-00V changes. Final rebased verification follows. | [Planning verification receipt](planning-verification.json) retains source delta, check results and pre/post self-drift summaries. Catalog includes the planned Spec; hot Taskboard correctly has no new active row. | Lexicon unchanged; semantic audit and capability acceptance remain unexecuted. |

| 2026-09-26 | none | Final rebased planning verification completed on the 49cf2fd85437165e0f60e1368441b24aa7e5b35f tree plus planning evidence updates. | All 48 required commands passed; Wiki validation, local links, render and diff checks passed. Post self-drift retains the same seven attention findings and cleanUpdate false. Guardrail remains 78/100; four real-outcome evidence recommendations remain, with no agent-outcome claim. See [receipt](planning-verification.json). | Specification and generated catalog only; no root/template Lexicon repair. | Immutable final integration review follows; all audit/update acceptance and Human QA remain pending. |

| 2026-09-26 | none | Correct the prior rebase identity: actual parent of 49cf2fd85437165e0f60e1368441b24aa7e5b35f is be918f0c59158b121e41e97a64dfff3da97f2e53, not the earlier observed ebb01dc. Shared remote-tracking state advanced before rebase. | Verified immutable Git parent and three-file planning diff. S-00M reader and S-00V Task decomposition are inherited integration changes. The final 48-command suite already ran on this actual rebased tree; test results stand. | Corrected current receipt identity; earlier evidence remains with this explicit correction. | Final local review pending. Automatic approval review rejected GitHub push for lack of explicit external-publication authorization; branch remains local. |

| 2026-10-01 | TK-01Q | Current delegation activates and claims only existing TK-01Q; owner codex and original planning history preserved. Native claim pushed fff103b8da212b737b9294579bc337c449899732 before Lexicon edits. | Fresh 124-ref scan found no active S-01U/Task; doctor zero blockers, seven attention findings. Actual Tracker 23/23, public demo 2.39s, live projection current, article valid; Result/expanded readable options refuse. | Root/generic Lexicon and [bounded coverage](tk01q-coverage.md); no runtime/source/schema/ADR or carry TK-004Q changes. | Full required suite, independent timed readback and immutable review pending. Whole audit and owner gates remain open; zero coordination hand-backs. |

| 2026-10-01 | TK-01Q | Scoped candidate 4f9416b4bf13e60aa19b1e8038c7ced3cee331c8 passed full required checks and independent reader exercise. | 51/51 required commands (48 AGENTS plus 3 Runbook), four additional targeted passes; validator initially 3/18 in sandbox, then unchanged 18/18 outside synthetic Git-root guards. All 56 checks satisfied with that environment qualification. Separate AI reader recovered four distinctions in 24.91s; 24 source pins, 77 links and 11 anchors checked. Original four Spec evidence rows/protected source trees preserved; initial refreshed integration was d9078590; later 25d3f4d2 requires separate union verification. | [Verification receipt](tk01q-verification.json), [reader observation](tk01q-reader.md), root/generic meanings and source coverage. | Self-drift cleanUpdate false with unchanged seven attention findings, guardrail 78/100. External S-00P procedure route and whole audit remain; final immutable review follows state/proof updates, no owner QA/main or merge. Zero coordination hand-backs. |

| 2026-10-01 | TK-01Q | Draft PR creation rejected before execution by automatic approval review; no alternate publication route attempted. Earlier branch recovery through 07bb18b3b6beb99aea716884989dbaa3ffb4a093 succeeded before this rejection. | Connector repository read succeeds and confirms public KaydenClark/LLM_Workbench; draft creation refusal says that destination is not established as trusted organization-owned or explicitly user-approved for disclosure. Separate gh GraphQL Forbidden is not this approval rejection. | Final reviewable proof/state prepared locally. Existing scope, history and user no-merge limit retained. | Coordinator must obtain explicit destination/payload approval in its existing single grilling record before final publication. No Servitor workaround; whole audit and owner gates remain open. |

| 2026-10-01 | TK-01Q | Current integration plus lexical candidate verified without merging: integration25d3f4d23b3719693065336a4ba66349d0a95907, lexical4f9416b4, detached fixture445972e26b376f3b5646f3928bbe72fd26bfda86. | 58/58 commands passed in authorized unsandboxed fixture execution: 51 required plus7 targeted, including new upstream coordination/collision tests and validator18/18. Source delta and all output hashes are recorded in the receipt. | Family definitions unchanged by concurrent integration; refreshed DQC relation/correction evidence explicitly assessed. | Seven existing self-drift findings plus fixture detached-head; guardrail78/100. Final administrative closure/review local until explicit public-destination approval. All ten whole criteria remain open; no merge or owner QA/main. |
| 2026-10-01 | TK-01Q | Task closed | TK01Q family reconciliation: original lexical4f9416b with51 required commands; current union445972e58/58; independent reader24.91s; qualified validator18/18; pinned source and history checks. Final exact-head review separate; no whole-Spec acceptance or owner QA. | LEXICON.md, templates/LEXICON.md and S01U scoped coverage/source/reader/verification evidence | Whole S01U audit and all ten criteria remain open; S00P procedure-route finding and owner QA/main retained. Final public branch/PR publication requires explicit destination approval after automatic review rejection. No merge. Git state at close: unpushed (ahead 1 behind 0 of origin/codex/s01u-tk01q-lexicon-reconciliation); recorded reason: Final proof is intentionally local: automatic approval review rejected draft PR disclosure to public KaydenClark/LLM_Workbench for missing explicit destination approval. Remote07bb18b retains earlier checkpoint; no alternate publication route attempted. |

| 2026-10-03 | TK-01Q | Recover the published October 1 branch on integration baseline 2dcde6e90faed0937d7742fdac186db3c14e5e5b under the owner's snag-fix request, superseding the old publication hold and no-merge endpoint for this recovery. | Candidate 394f30f51c07a3d7dd8a86e97a3c3fd2cccc9bea: 55/55 unique required/targeted checks pass after four clean-source initialization retries; 142 link targets, nine prior evidence rows, three Task receipts and three unchanged proof files checked. Pre/post self-drift retains seven findings and cleanUpdate false; guardrails 78/100. Final immutable review is outside its own bytes. | Root/generic Lexicon, scoped recovery/source/coverage proof, current Spec/Task gates and Tracker Wiki explanation. | Whole audit, all ten Spec criteria and owner QA/main remain open. Installed article validator still rejects identifiers permitted by ADR-000R; that existing migration and broader template changes retain their owners. No Dictionary Terms implementation or outcome claim. |

| 2026-10-03 | TK-01Q | Automatic approval review rejected the recovery GitHub push before execution; no PR or integration merge occurred and no alternate publication route was attempted. | Rejection requires explicit owner authorization of the recovery payload for public KaydenClark/LLM_Workbench. Thirteen scoped documentation/proof/projection files inspected; no credential patterns or local notepad material. Separate-context reviewer passed ba0eed2a4e4d66683f4c45fb89b067a8b2934a39; this blocker-only record update requires fresh final-candidate confirmation. | Current Spec and recovery assessment record the publication gate; historical October 1 rejection remains separate dated evidence. | Only external publication/landing waits for approval; local recovery is reviewable. Full audit, owner QA/main and Dictionary Terms implementation remain open. |

## Completion Result

The Landmark Tracker family Task is done; its October 1 proof is preserved
as historical evidence. Its recovered candidate now consumes the October 2
Wiki, landmark and workflow decisions. [Recovery assessment](recovery-2026-10-03.md)
records fresh verification and the integration gate. The former publication
hold and no-merge instruction are superseded by the owner's October 3 request.
A new automatic approval review rejected this recovery's push before execution;
no PR or integration merge has occurred. Its explicit payload/destination
approval requirement is the current publication gate.
The whole-Lexicon inventory, comprehensive audit, all ten Spec acceptance
criteria and owner QA/main gates remain open. This is neither whole-Spec
completion nor a clean-update claim.
## Remaining Limitations Or Follow-Up Specs

- Source inventory is refreshed at execution; today's starting map is not a
  claim that all concepts have already been inspected.
- Existing self-drift attention findings remain outside this planning change.
- No new follow-up Spec is invented; reconcile overlaps with existing owners.

## Supersession

- Supersedes: none. Follows the completed, narrower S-00L repair without rewriting it.
- Superseded by: none.
