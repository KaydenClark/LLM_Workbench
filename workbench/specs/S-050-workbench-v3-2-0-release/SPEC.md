# S-050 - Workbench v3.2.0 Release

**Spec ID:** S-050
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-09
**Catalog description:** Deliver the reconciled v3.2.0 capability set and prove the Workbench Template update and reviewed integration.
**Blockers:** live-device-and-private-repository-access (final rollout readiness only)
**Latest event:** Repaired source PR84 and Template PR5/PR6 delivered; exact receipts reconciled.
**Next gate:** Establish actual S052TK004 private repository and Mac/Windows Claude/Codex access before final readiness.

> **Citation anchors.** pre=`212762774b5cb7c065ab573bb487752fe98eff4c` post=`212762774b5cb7c065ab573bb487752fe98eff4c`.

## Outcome

Deliver the reconciled v3.2.0 capability set and prove the Workbench Template
update through reviewed integration. The later fresh-copy personalization path
has its own planned capability owners and is not v3.2 acceptance.

## Why It Matters

The 2026-09-08 owner request explicitly invokes make-it-so for specification,
promotion and delivery, followed by carry for each named assignment. A pushed
plan or upstream-only green result cannot establish Example readiness.

## Current Verified State

Integration is v3.1.3 at the pre anchor. S-046 runtime is absent there; a newly
fetched unpublished candidate a9bf47c9d029feb662ec79f5240e0439a0fcdb76 implements
part of TK-002 and is under separate-context review. It is evidence to reuse
only after investigation; its v3.1.4 stamp is not v3.2.0 delivery. S-047/048 are
planned. Example main and integration were clean and fast-forwarded to their
remote tips; branch `v3.2.0` starts from bf8a2fa5d7b7403fda07e3c8573db1d8348fe3f4.
Its newer version-history product remains intact. Source feedback is untracked
and retained, never silently staged with the release.

## Desired Behavior

1. Account for every R001–R181 record without renumbering, collapsing source
   history or dropping superseded/out-of-scope items. The [reconciliation](reconciliation.json)
   preserves the complete second-pass rows and appends release destinations.
2. Promote 12 focused ADR concerns A/C/E/F/G/H/J/K/N/O/P/Q; amend existing
   0026/0027/0028/0031/0035/0037/0040/0041/0042 and structural-count references
   only where their own rule changes. Preserve all 28 upstream records and all
   59 historical crosswalk entries. No blanket ADR copy into every room.
3. Complete S-046 JSON continuity, S-047 visible artifact identity, S-048 direct
   promotion/retirement, S-051 skill ownership/composition/compatibility,
   S-052 optional private transport, and S-053 configured-host capability proof.
4. Reconcile every included documentation/contract row in the source inventory,
   including report evidence/model fields, portable parsing, claim freshness,
   preserved evidence partitions, source ownership and reachable unfinished work.
5. Stamp v3.2.0 only after behavior and required proof are green, then validate
   the stamp. Review and integrate the immutable upstream candidate. Consume
   only clean, pinned source including manifest, templates, tools and skills.
6. Complete S-00A's active-ADR, Context Map, and destination-only Blueprint
   rebuild, then deliver the Workbench Template update on exact branch `v3.2.0`.
   Retain that branch through owner acceptance, independently review it, merge
   it to integration, and read the merged state back.
7. Close only after live remote containment, installed identities, successful
   Workbench Template update, and actual Mac/Windows Claude/Codex continuity
   proof exist. S-00C through S-00E own later project-evidence, Genesis, and
   fresh-copy usefulness claims.

## Decisions And Contracts

**Scoped version waiver (owner, 2026-09-09).** Keep v3.2.0 for this repair despite
the previously stamped twenty-skill bundle. This explicit exception permits the
repaired twenty-one-skill core including handoff; it does not repeal the general
stamped-label rule. Preserve the exact earlier twenty-skill manifest policy as
readable legacy input. Source commit and content hashes distinguish generations.
The separate proposed S-054 review-boundary work remains deferred.


Current owner authorization selects the reconciled release direction. Historical
source statuses remain preserved; a source recommendation is not itself proof
or authority. Existing stable specs and append-only evidence remain in place.
The release endpoint is reviewed integration in the two named repositories;
main publication and rollout to other active rooms remain owner-only/outside scope.

### Assigned capability map

| Unit | Owner | Endpoint |
|---|---|---|
| V32-01 and V32-06 | This spec TK-001/002/004/006 plus S-00A | Full scope, active-ADR/Blueprint rebuild, release checks and receipts |
| V32-02 | S-046 and S-047 | Shared JSON lifecycle and compatible visible identity |
| V32-03 | S-048 | Direct promotion and frozen checkpoint history with usable rollback |
| V32-04 | S-051 | Core ownership, composition, installation and tested compatibility |
| V32-05 | S-052 and S-053 | Optional private continuity and agreed configured-host floor |
| V32-07/09 | S-00B and target-room owner | Workbench Template update and reviewed integration |
| Future template-to-project stages | S-00C, S-00D, S-00E | Evidence intake, Genesis derivation, and fresh-copy proof; excluded from v3.2 acceptance |

The recovered five-check host minimum in S-053 is the current implementation
baseline under the renewed owner request. A real second device and
private repository access must be established before cross-device acceptance.
The three suggested Design Concept articles remain proposals, excluded here.


## Non-Goals

New coordination services, Foundry revival, Python runtime rewrite, paid services,
credential changes, raw transcript publication, mass checkpoint deletion, or
unrelated personal skills repository mutation. Proposed Design Concept articles remain
uncreated and outside this implementation absent explicit owner direction.

## Dependencies And Blockers

Ticket edges below govern selection. Independent work continues while an external
gate is pending. A fixture cannot satisfy a named live-host or cross-device gate.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Promote and push the complete reconciled scope | done | none | 33 required commands pass; independent planning PASS cb12c23; 181 records, 19 candidates and 59 mappings preserved; remote plan verified |
| TK-002 | Reconcile ADRs and all included documentation contracts | done | TK-001 | Full 33-command suite passes at fixed 87244cc; independent bounded documentation PASS; guardrail78 unchanged |
| TK-003 | Converge capability implementations and useful continuity proof | done | none | Local capability implementation converged; full42 and focused host review corrections6 pass; useful Genesis/native continuation receipt preserved |
| TK-004 | Verify and integrate the immutable upstream v3.2.0 candidate | done | TK-003 | 16c8278 full42 PASS; configured-host10 and source-identity18 PASS; independent corrective review PASS; PR81 merged as integration5ceef14 with exact candidate containment and zero tree delta |
| TK-005 | Deliver Workbench Template v3.2.0 and reviewed integration | done | TK-004, S-00A | S00A complete;S00B Template PR5 integrationdf63359 contains reviewed d14553c;fresh remote clone19tests/syntax/layout/doctor passes;v3.2.0 retained |
| TK-006 | Reconcile release receipts and readiness verdict | blocked | live-device-and-private-repository-access | Repair receipts reconciled; actual S052TK004 final readiness evidence unavailable |

### TK-001 - Promote and push the complete reconciled scope

**Stance:** Builder

Validate all 181 IDs and 19 candidate/59 crosswalk dispositions; register stable owners; record settled/open distinctions; scan sanitized planning; render/doctor and push before runtime changes.

### TK-002 - Reconcile ADRs and all included documentation contracts

**Stance:** Builder

Write the 12 focused records and targeted amendments; route each rule to current root and generic controls. Update REPORT_FORMAT evaluated/reviewer models, evidence types and missing/interrupted states; retain longitudinal non-retest limits. Resolve R120 by documenting actual UTC calendar comparison after code verification; preserve original scoped local-day history. Keep source evidence rows unchanged. Validate all mapped rows against their real owners, full suite and semantic independent review.

### TK-003 - Converge capability implementations and useful continuity proof

**Stance:** Builder

Carry S-046/047/048/051/052/053 individually; investigate existing S-046 implementation instead of duplicating it. Require each acceptance to name actual evidence. Dependencies are checked in this ticket before closure; capability specs must not depend on completion of this release spec. Local implementation convergence permits upstream and Example verification; S-052/TK-004 actual cross-device proof remains a final TK-006 readiness gate, not a blocker of offline installation or integration.

### TK-004 - Verify and integrate the immutable upstream v3.2.0 candidate

**Stance:** Builder

Verify complete clean consumed lanes, all new tests and full suite. Stamp only after behavior green, rerun affected/full checks, independently review exact final candidate, PR to integration and prove live remote containment. Preserve failed or unavailable acceptance; no main merge.

### TK-005 - Deliver Workbench Template v3.2.0 and reviewed integration

**Stance:** Builder

Carry S-00B and the target room owner through explicit update, room/tour tests,
control-fidelity disposition, separate-context review, v3.2.0 PR merge to
integration, and fresh read-back. Record exact upstream and target commits, PR,
and resulting tree. Do not substitute an isolated fresh clone and Genesis
demonstration, which belong to S-00E.

### TK-006 - Reconcile release receipts and readiness verdict

**Stance:** Builder

Check all requirements and all 181 dispositions; append upstream/Template
immutable receipts, installed manifest/tool/skill and control-fidelity results,
and host/model/machine evidence. State S-00C through S-00E as planned follow-on
work rather than fresh-project proof. Report ready only if every v3.2 acceptance
passes; readiness authorizes no further rollout.

## Renewed Coherence Acceptance

The current owner request adds S-051 TK-004 through TK-006 and S-046 TK-007 as
v3.2 completion requirements. Preserve completed tickets and append-only proof;
those bounded results do not establish repaired installed behavior. S-00A owns
the already-locked Blueprint and independent main-readiness criteria; no new
architecture interview or v3.2.1 activation follows. Review the repaired immutable
candidate independently before upstream integration, then carry S-00B through
Workbench Template integration. Main approval/merge and unrelated rooms remain
excluded. Record unavailable native or cross-device environments explicitly.

## Acceptance Criteria

- [x] All 181 original research records, 19 candidates and 59 ADR mappings are preserved with final disposition and proof routes.
- [x] All included ADRs, amendments and documentation changes are reconciled in current root and generic owners.
- [ ] S-046, S-047, S-048, S-051, S-052 and S-053 satisfy their accepted scope and verification.
- [x] Clean immutable v3.2.0 upstream source passes required suites, separate-context review and live integration containment.
- [x] Workbench Template branch v3.2.0 passes installed conformance and independent review, is merged to integration and remains owner-visible.
- [x] S-00A's destination-only Blueprint, active ADR lifecycle/routing, Context Map, and lossless claim disposition are accepted before the Template update.
- [x] Future fresh generation/customization, useful-project, and saved-note continuation claims remain explicitly owned by S-00C through S-00E and are not presented as v3.2 proof.
- [ ] Real Mac/Windows Claude/Codex transport proof, offline/conflict behavior and configured-host evidence are recorded without fixture substitution.
- [x] Final release receipt distinguishes readiness, publication and actual active-room deployment.

## Testing Seams

Public CLI inputs/results, preservation of source and destination bytes, installed
receipts and discovery paths, clean-clone operation, and independent read-back.
Each ticket above names its concrete failing cases and completion evidence.

## Verification Procedure

Use red/green for changed behavior; run the full union of AGENTS and RUNBOOK
verification commands, plus new public-seam tests. Capture unchanged-criteria
guardrail before/after (starting baseline 78/100), name remaining recommendations,
and do not infer agent-outcome gains from structural scores. Review the immutable
candidate separately before integration; verify live remote containment.

## Documentation Impact

AGENTS/BLUEPRINT/LEXICON/RUNBOOK/README, generic controls, ADR register, report
contract, skills guidance, Wiki router/schema, benchmark/outcome guidance and
assigned specs. Source research remains local; reconciliation stores sanitized
claims/status/lineage, not private transcripts.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Complete release assignment specified from owner request and reconciled packet | All 17 handoff source hashes match; upstream integration 212762774b5cb7c065ab573bb487752fe98eff4c; Example refreshed to bf8a2fa5d7b7403fda07e3c8573db1d8348fe3f4, 12 tour tests pass and doctor has zero blockers | This spec owns its requirements; source packet retained locally | Implementation and acceptance remain pending |

| 2026-09-08 | TK-001 | Planning candidate verified and independently reviewed | All 33 required commands passed on the planning tree beginning at 18d9235, with generated board refreshed during the run; final cb12c23 delta passed independent planning review, doctor and citations; all 181 original row fields, 19 candidates and 59 mappings preserved; privacy scan clean; guardrail 78/100 unchanged | 12 ADRs and owning current direction, stable capability assignments and Example S-003 recorded | Runtime implementation, transport/host gates and release/Example acceptance remain open; no outcome gain claimed |
| 2026-09-08 | TK-001 | Ticket closed | 33 required commands pass; independent planning PASS cb12c23; 181 records, 19 candidates and 59 mappings preserved; remote plan verified | Stable specs and 12 ADRs/current owners promoted; Example S-003 independently reviewed and pushed | TK-002 onward; no v3.2.0 implementation or readiness claim |

| 2026-09-08 | TK-002 | Documentation reconciliation verified after independent corrections | Full 33-command suite passed on clean fixed candidate 87244cc; independent bounded docs review PASS; R088 no pooling, R099 source/use states and R121 exact partition accounting corrected; initial catalog wording regression fixed with tests unchanged, contaminated dirty-source upgrade/diagnostic attempts retained and clean reruns pass; guardrail 78/100 unchanged | Root and generic report/operational/skill/Wiki/evaluation owners reconciled; runtime-specific contracts remain assigned to their capability owners | Runtime implementation and installed/live-host acceptance remain open; no generalized outcome claim |
| 2026-09-08 | TK-002 | Ticket closed | Full 33-command suite passes at fixed 87244cc; independent bounded documentation PASS; guardrail78 unchanged | All included documentation guidance reconciled; runtime-specific owners remain explicit | S-046/047/048/051/052/053 implementation and Example acceptance |

| 2026-09-08 | TK-003 | Convergence found historical cross-provider fixture contradicting current core and host boundaries | Separate public fixture assertions demonstrated RED for duplicate Codex discovery and host permission-bypass configuration. Fixture now retains canonical core installation, leaves host security configuration unchanged, and identifies its planner as a fixture rather than an unobserved provider/model | Runbook procedure reconciled; no generic counterpart exists for this producer-only evaluation launcher | Clean targeted/full verification and independent convergence review pending; no actual native/provider support claim follows |

| 2026-09-08 | TK-003 | Development candidate 157d547 generated a useful independent Queue Summary project and native saved-objective continuation | Bootstrap 429fb1c readiness independently passes; implementation 2f32f51 fresh clone passes fourteen tests, doctor and sample. Native Codex CLI 0.144.3 recovered original/correction, verified empty/mixed inputs and fourteen tests, saved note6 to8; parent corrected earlier readiness-report error and read back note10. Local bare branch recovery85ac45b verified; runtime15 exact hashes and distinct room ID checked | [Bounded technical receipt](genesis-continuation-result.json) preserves model-unreported, explicit-invocation, local-remote and source-version limits; inaccurate post-implementation Genesis-readiness claim explicitly withdrawn | Independent receipt review pending. This development rehearsal does not satisfy final v3.2.0, Example integration, actual private service, Windows or Claude gates |

| 2026-09-08 | TK-003 | Local convergence evidence reviewed; external acceptance remains blocked | Runtime candidate db540ec27a272d61283262ee48d46fe9ebf8f7af passed full 41 of 41 and independent transport review. Evidence candidate 3394cf86b44b4c62a8e695fe8d08bd3749434894 passed full 41 of 41; final receipt qualification 2933a72e43971894f82c2f260ba8d3421024c26a independently PASS. Useful generated project85ac45b fresh-clone tests14, runtime15 hashes, saved original/corrections and native36-command trace independently confirmed. Guardrail78 unchanged, four outcome-evidence recommendations retained | Receipt distinguishes producer-observed launcher facts from independently checked native events; S-052 implementation001-003 closed with live004 explicitly blocked. Existing S-053 owns the unaccepted capability-floor proposal | Owner agreement on host floor and actual private-repository/Mac-Windows-Claude-Codex access are unresolved. No v3.2.0 stamp, upstream integration, Example upgrade/integration or rollout readiness. This is the first explicit blocked continuation audit after completing available local work |
| 2026-09-08 | TK-003 | Ticket closed | Local capability implementation converged; full42 and focused host review corrections6 pass; useful Genesis/native continuation receipt preserved | S053 exact five-check baseline and local result; actual cross-device readiness remains S052TK004 and S050TK006 | Stamp and review upstream; Example integration; actual cross-device final readiness |
| 2026-09-08 | TK-004 | Separate-context review rejected the exact 563a6e69657a6fe2594e86bda523cb60567342b7 candidate after PR80 had already merged it | Full42, append-only, held-out path safety, evaluator106.6 and doctor passed, but an ordinary non-Git root containing expected filenames executed a substituted managed child and reported PASS; review verdict FAIL. Regression reproduced RED, then producer Git root, expected commit/origin and clean consumed-input checks made ten configured-host tests GREEN | RUNBOOK and generic counterpart now require explicit sourceCommit/sourceRepository and name the producer preflight | Commit and push repair, full suite, fresh independent review and corrective integration remain pending; PR80 did not satisfy the review gate |
| 2026-09-08 | TK-004 | Ticket closed | 16c8278 full42 PASS; configured-host10 and source-identity18 PASS; independent corrective review PASS; PR81 merged as integration5ceef14 with exact candidate containment and zero tree delta | RUNBOOK and template producer preflight updated; S050 and S053 evidence record PR80 gate failure and repaired result | Example reviewed integration and actual Mac/Windows Claude/Codex private-transport readiness evidence |
| 2026-09-09 | TK-005 | Ticket closed | S00A complete;S00B Template PR5 integrationdf63359 contains reviewed d14553c;fresh remote clone19tests/syntax/layout/doctor passes;v3.2.0 retained | S00B and targetS00A own Template closeout;repair-integration-acceptance.json preserves exact source,installed and native limits | Repaired source final independent integration review and actual S052 Mac/Windows Claude/Codex private transport remain |

| 2026-09-09 | TK-006 | Repaired source and Template delivered; final readiness remains externally blocked | Independent source PASS 7f9fe2101e5b693f5085c3ed5acee65e73eda445; PR84 integration b937f7deac3669307041e86e4b5fc84cd167f818 exact containment and zero tree delta; TemplatePR5/PR6 at4010003; fresh remote checks pass; all181records/19candidates/59mappings unchanged | repair-integration-acceptance.json links full and adverse results, installed identities, native limits and original version waiver; bounded capability owners reconciled | Actual S052TK004 Mac/Windows Claude/Codex private transport, authenticated Claude and final readiness unavailable; no main approval/merge |

## Completion Result

The repaired v3.2.0 source is delivered through PR84 to integrationb937f7d;
the Workbench Template and its reviewed closeout are delivered through target
PR5/PR6 at integration4010003. Exact reviewed containment and fresh remote checks
are recorded in [the repair acceptance receipt](repair-integration-acceptance.json).
The original181 records,19 candidates and59 ADR mappings remain unchanged.

This is integration delivery, not overall release readiness. TK-006 remains
blocked on S-052/TK-004 actual Mac/Windows Claude/Codex private transport evidence;
Claude authentication is unavailable on the current host. Spark's ordinary
skill-discovery failure and Astra's client-version failure remain failed/unavailable
results. Main was neither approved nor merged, no unrelated Workbench was
updated, and no portfolio automation or future personalization was claimed.

## Remaining Limitations Or Follow-Up Specs

See [release owner](../S-050-workbench-v3-2-0-release/SPEC.md) for the complete assigned set,
source inventory, exclusions and externally gated acceptance. One routine coordination hand-back occurred: the agent missed the recorded five
checks, substituted another list and blocked unrelated release work on optional
live transport. The owner corrected the direction. The smallest correction is
the restored S-053 baseline and operation-scoped dependency edges above; final
readiness still requires the original actual cross-device evidence.

## Supersession

- Supersedes: none; completed capability evidence remains historical.
- Superseded by: none.
