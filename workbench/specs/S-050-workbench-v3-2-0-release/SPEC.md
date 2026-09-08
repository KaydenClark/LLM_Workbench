# S-050 - Workbench v3.2.0 Release

**Spec ID:** S-050
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Deliver the reconciled v3.2.0 capability set and prove Example integration plus a useful freshly generated project.
**Blockers:** none
**Latest event:** TK-003 claimed by codex.
**Next gate:** Close TK-003 with verification and documentation proof.

> **Citation anchors.** pre=`212762774b5cb7c065ab573bb487752fe98eff4c` post=`212762774b5cb7c065ab573bb487752fe98eff4c`.

## Outcome

Deliver the reconciled v3.2.0 capability set and prove Example integration plus a useful freshly generated project.

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
6. Deliver Example S-003 on exact branch `v3.2.0`, retain that branch through
   owner acceptance, independently review then merge it to integration. Prove
   a freshly generated independent room can become a working concrete project
   and resume from an agent-authored note without personal catalog dependencies.
7. Close only after live remote containment, installed identities, fresh-project
   usefulness, and actual Mac/Windows Claude/Codex continuity proof exist.

## Decisions And Contracts

Current owner authorization selects the reconciled release direction. Historical
source statuses remain preserved; a source recommendation is not itself proof
or authority. Existing stable specs and append-only evidence remain in place.
The release endpoint is reviewed integration in the two named repositories;
main publication and rollout to other active rooms remain owner-only/outside scope.

### Assigned capability map

| Unit | Owner | Endpoint |
|---|---|---|
| V32-01 and V32-06 | This spec TK-001/002/004/006 | Full scope, canonical decisions, release checks and receipts |
| V32-02 | S-046 and S-047 | Shared JSON lifecycle and compatible visible identity |
| V32-03 | S-048 | Direct promotion and frozen checkpoint history with usable rollback |
| V32-04 | S-051 | Core ownership, composition, installation and tested compatibility |
| V32-05 | S-052 and S-053 | Optional private continuity and agreed configured-host floor |
| V32-07/08/09 | Example S-003 | Upgrade, usable fresh project and reviewed Example integration |

The concrete host minimum is proposed in S-053 and awaits the owner; no schema
or diagnostic architecture is selected in its place. A real second device and
private repository access must be established before cross-device acceptance.
The three suggested Design Concept articles remain proposals, excluded here.


## Non-Goals

New coordination services, Foundry revival, Python runtime rewrite, paid services,
credential changes, raw transcript publication, mass checkpoint deletion, or
personal skills repository mutation. Proposed Design Concept articles remain
uncreated and outside this implementation absent explicit owner direction.

## Dependencies And Blockers

Ticket edges below govern selection. Independent work continues while an external
gate is pending. A fixture cannot satisfy a named live-host or cross-device gate.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Promote and push the complete reconciled scope | done | none | 33 required commands pass; independent planning PASS cb12c23; 181 records, 19 candidates and 59 mappings preserved; remote plan verified |
| TK-002 | Reconcile ADRs and all included documentation contracts | done | TK-001 | Full 33-command suite passes at fixed 87244cc; independent bounded documentation PASS; guardrail78 unchanged |
| TK-003 | Converge capability implementations and useful continuity proof | in-progress | TK-002 | pending |
| TK-004 | Verify and integrate the immutable upstream v3.2.0 candidate | ready | TK-003 | pending |
| TK-005 | Deliver Example v3.2.0 and fresh project acceptance | ready | TK-004 | pending |
| TK-006 | Reconcile release receipts and readiness verdict | ready | TK-005 | pending |

### TK-001 - Promote and push the complete reconciled scope

**Stance:** Builder

Validate all 181 IDs and 19 candidate/59 crosswalk dispositions; register stable owners; record settled/open distinctions; scan sanitized planning; render/doctor and push before runtime changes.

### TK-002 - Reconcile ADRs and all included documentation contracts

**Stance:** Builder

Write the 12 focused records and targeted amendments; route each rule to current root and generic controls. Update REPORT_FORMAT evaluated/reviewer models, evidence types and missing/interrupted states; retain longitudinal non-retest limits. Resolve R120 by documenting actual UTC calendar comparison after code verification; preserve original scoped local-day history. Keep source evidence rows unchanged. Validate all mapped rows against their real owners, full suite and semantic independent review.

### TK-003 - Converge capability implementations and useful continuity proof

**Stance:** Builder

Carry S-046/047/048/051/052/053 individually; investigate existing S-046 implementation instead of duplicating it. Require each acceptance to name actual evidence. Dependencies are checked in this ticket before closure; capability specs must not depend on completion of this release spec.

### TK-004 - Verify and integrate the immutable upstream v3.2.0 candidate

**Stance:** Builder

Verify complete clean consumed lanes, all new tests and full suite. Stamp only after behavior green, rerun affected/full checks, independently review exact final candidate, PR to integration and prove live remote containment. Preserve failed or unavailable acceptance; no main merge.

### TK-005 - Deliver Example v3.2.0 and fresh project acceptance

**Stance:** Builder

Carry Example S-003 through explicit upgrade, room/tour tests, isolated fresh clone and Genesis demonstration, separate-context review, v3.2.0 PR merge to integration and fresh read-back. Record exact upstream and Example commits, PR and resulting tree.

### TK-006 - Reconcile release receipts and readiness verdict

**Stance:** Builder

Check all requirements and all 181 dispositions; append upstream/Example immutable receipts, installed manifest/tool/skill and control-fidelity results, fresh project useful-task and saved-note continuation, host/model/machine evidence. Report ready only if every acceptance passes; readiness authorizes no further rollout.

## Acceptance Criteria

- [ ] All 181 original research records, 19 candidates and 59 ADR mappings are preserved with final disposition and proof routes.
- [ ] All included ADRs, amendments and documentation changes are reconciled in current root and generic owners.
- [ ] S-046, S-047, S-048, S-051, S-052 and S-053 satisfy their accepted scope and verification.
- [ ] Clean immutable v3.2.0 upstream source passes required suites, separate-context review and live integration containment.
- [ ] Example branch v3.2.0 passes installed conformance and independent review, is merged to integration and remains owner-visible.
- [ ] Fresh generation/customization produces a useful independent project with new identity, working tools/tests and real saved-note continuation.
- [ ] Real Mac/Windows Claude/Codex transport proof, offline/conflict behavior and configured-host evidence are recorded without fixture substitution.
- [ ] Final release receipt distinguishes readiness, publication and actual active-room deployment.

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

## Completion Result

Pending. No v3.2.0 readiness, publication, or downstream delivery claim.

## Remaining Limitations Or Follow-Up Specs

See [release owner](../S-050-workbench-v3-2-0-release/SPEC.md) for the complete assigned set,
source inventory, exclusions and externally gated acceptance. Zero routine
coordination hand-backs so far; the reserved host decision is a real owner gate.

## Supersession

- Supersedes: none; completed capability evidence remains historical.
- Superseded by: none.
