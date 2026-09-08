# S-051 - Core Skill Ownership And Compatibility

**Spec ID:** S-051
**Status:** active
**Priority:** 2
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Install one identifiable compatible global core release while preserving optional shared and room-local skill ownership.
**Blockers:** none
**Latest event:** TK-003 claimed by codex.
**Next gate:** Close TK-003 with verification and documentation proof.

> **Citation anchors.** pre=`212762774b5cb7c065ab573bb487752fe98eff4c` post=`212762774b5cb7c065ab573bb487752fe98eff4c`.

## Outcome

Install one identifiable compatible global core release while preserving optional shared and room-local skill ownership.

## Why It Matters

The 2026-09-08 owner request explicitly invokes make-it-so for specification,
promotion and delivery, followed by carry for each named assignment. A pushed
plan or upstream-only green result cannot establish Example readiness.

## Current Verified State

Current source owns 17 required skills; installed make-it-so is older than source.
The inspector reports unknown generation but does not report absent required
core skills. Existing installer tests already allow missing installation into
Git-owned/linked roots; blanket refusal prose is drift. Two separate discovery
copies are the current distribution behavior, not the selected target.

## Desired Behavior

- LLM_Workbench exclusively owns and versions core skill source; the base
  works without the personal catalog. Reconcile `promote` and `save` into core;
  include notepad and every actual base dependency, derive counts from catalog.
- One selected global core release installs as ignored/excluded managed state
  under `.agents/skills`, with Claude discovery adapter to the same source.
  One authoritative implementation and one discovery entry per application;
  no extra `.codex/skills` catalog. Optional personal skills stay optional.
- Room-local skills have room-owned source and room discovery adapters;
  acceptance into the personal catalog is owner-directed, not automatic.
- Explicit tested compatibility range permits compatible differing room versions;
  incompatible, missing, conflicting source, broken link and duplicate cases
  are visible without replacing skills during doctor or normal setup.
- Presence-only setup preserves existing names; explicit replacement verifies
  source identity, backs up differing bytes and supports rollback. Prepare
  legacy tracked-core migration with inventory and recovery; do not mutate
  the external personal repository in this assignment.
- Composition inherits scope. Read-only names its target; helpers may capture
  ignored working context within scope. Mention/routing is not invocation.
  Independently callable primitives remain caller-agnostic and do not grant
  authority; no speculative metadata schema or native enforcement adapter.
- Fresh setup and recreation of adapters from Git-backed source must work with
  isolated homes and no developer checkout/private catalog at runtime.

## Decisions And Contracts

Current owner authorization selects the reconciled release direction. Historical
source statuses remain preserved; a source recommendation is not itself proof
or authority. Existing stable specs and append-only evidence remain in place.
The release endpoint is reviewed integration in the two named repositories;
main publication and rollout to other active rooms remain owner-only/outside scope.


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
| TK-001 | Define and install one authoritative core source with adapters | done | none | d2ecc5cf049509160c9ae1460b970eee48175772: installer 27/27, upgrade 8/8, full 37/37, independent repair review PASS; all seven reproduced ownership and alias findings resolved |
| TK-002 | Diagnose tested compatibility and discovery failures | done | TK-001 | bc1347812d8c7402bade8991a7a41e5023f04e8e: inspection 5/5, installer 27/27, diagnostics 19/19, full 39/39 and independent bounded repair review PASS; range overstatement regression repaired |
| TK-003 | Compose portable save and promote into a self-sufficient bundle | in-progress | TK-002 | pending |

### TK-001 - Define and install one authoritative core source with adapters

**Stance:** Builder

Trace tools/core-skill-installer.mjs, skill-presence.mjs, source-identity and existing installer/upgrade tests. Red/green canonical physical source and adapter behavior, existing Git-root missing-only install, conflicts and rollback; document migration plan.

The physical global core lives in `.agents/skills/<name>`; missing Claude
entries become directory adapters to that same implementation. Existing names
remain untouched and their generation/conflicts stay visible. A missing-only
install does not certify an existing foreign skill as Workbench core. Newly
managed entries are excluded from a containing Git repository without staging
or committing personal source. Tracked core migration remains an explicit
separate plan; no actual personal repository is changed here. Explicit update
and recorded-backup rollback operate on the same canonical source and adapter
topology. The [tracked-core migration plan](tracked-core-migration.md) retains
the separate personal-repository authorization boundary. All installation proof
uses isolated homes.

### TK-002 - Diagnose tested compatibility and discovery failures

**Stance:** Builder

Test compatible differing release versus incompatible range, invalid/unknown marker, missing core, conflicting same names, broken links and valid aliases. No mutation on read-only diagnostics. Keep configured-host callability distinct from file discovery.

Current schema 2 markers add an inclusive `compatibleRooms` range. The floor
is the v3.1.4 typed-notepad baseline; the ceiling is the producing release.
Unknown legacy ranges remain unknown even when release strings match. Matching
recorded content and one canonical generation are separate checks. The range
comparison is structural evidence; exact runtime receipts and configured-host
workflow trials retain their own acceptance gates. Every new skill finding has
registered attention severity and effect none; diagnostics never repair a home.

### TK-003 - Compose portable save and promote into a self-sufficient bundle

**Stance:** Builder

Reconcile existing personal skill behavior by read-only inspection; implement Workbench-native core workflows after S-046/S-048 public seams exist. Verify local skill source/discovery behavior and fresh isolated installation, full suite, documentation and independent integration review.

The machine catalog adds save/promote while retaining the checkpoint retirement
notice. Counts derive from that catalog; v3.1.4's eighteen-skill policy remains
a frozen readable legacy row while this unstamped release candidate develops.
Save persists authorized results without intrinsic file planes or a delivery
grant. Promote handles selected supported material beyond grilling and composes
save on the already-promoted result; neither creates an implementation loop.
Room-local extension source uses project `.agents/skills/NAME` with a generated
Claude adapter, independent of global core and personal catalog acceptance.
Native-host invocation remains separate from installed-path mechanics.

## Acceptance Criteria

- [x] One core source/global identity and provider discovery adapters work without duplicate maintained implementations.
- [ ] Core save/promote/notepad compose through actual public seams without Foundry or personal-catalog dependency.
- [x] Tested explicit compatibility range and missing/conflicting/broken/incompatible diagnostics match actual installation.
- [x] Presence-only preservation, explicit-update backups/rollback and safe external migration plan are verified.
- [ ] Fresh isolated-home setup and configured-host invocation evidence distinguish discovery from real callability.

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

Core catalog, source skills, installer/upgrade/diagnostic procedures, manifests and generic templates; CAND-E/F rationale and release reconciliation.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Complete release assignment specified from owner request and reconciled packet | All 17 handoff source hashes match; upstream integration 212762774b5cb7c065ab573bb487752fe98eff4c; Example refreshed to bf8a2fa5d7b7403fda07e3c8573db1d8348fe3f4, 12 tour tests pass and doctor has zero blockers | This spec owns its requirements; source packet retained locally | Implementation and acceptance remain pending |

| 2026-09-08 | TK-001 | Canonical installer and explicit maintenance candidate prepared; implementation still under full verification | Normal installer 15 tests green at 619aa84; explicit maintenance red/green, incomplete recovery record red/green; current 20 installer and 8 upgrade tests pass. Upgrade now delegates to canonical updater and retains coreRecovery. Legacy separate copies restore, newer edits and damaged backups are preserved, tracked core refuses before mutation | Runbook, public orientation, update-harness and generic adoption procedure reconciled; tracked-core migration plan linked | Immutable full suite and independent review pending; no external personal repository changed |

| 2026-09-08 | TK-001 | Independent review rejected 1392fae with four reproduced ownership and case-alias gaps | Full suite 35 of 37 passed; catalog prose and canonical-adapter diagnostics fixture failed. Review reproduced linked-home Git backup escape, newly tracked rollback overwrite, tracked case-alias overwrite, and duplicate physical roots. Four regression cases demonstrated red; repaired installer 24 tests green, with tracked directory and adapter aliases covered | Restored catalog-checked counts; diagnostics fixture now expects both adapters to expose canonical marker changes | Fresh immutable full suite and independent re-review pending; no integration approval |

| 2026-09-08 | TK-001 | Re-review of 30c9430 confirmed the original four repairs and found two further tracked-path edge cases | Whitespace-trimmed NUL inventory and deleted tracked case-alias regressions both demonstrated red. Preserve exact inventory bytes and reserve tracked core names case-insensitively, including missing leaves; repaired installer 26 of 26 pass without skips | Migration plan names case-insensitive tracked-core preservation | Fresh review and final full verification pending; no personal catalog or integration mutation |

| 2026-09-08 | TK-001 | Re-review of dfdfa8c found deleted case-aliased ancestry still bypassed tracked protection | New deleted Skills ancestor regression demonstrated red; complete planned path reservation fixes it, all 27 installer tests pass. Prior 30c9430 full run passed 35 of 37; doctor and dogfood both exposed stale Taskboard after S-052 claim, now rendered | Migration plan explicitly reserves complete tracked path case aliases on every host | Final independent review and fresh full suite pending; S-052 identity tests separately demonstrated missing behavior and remain unimplemented |
| 2026-09-08 | TK-001 | Ticket closed | d2ecc5cf049509160c9ae1460b970eee48175772: installer 27/27, upgrade 8/8, full 37/37, independent repair review PASS; all seven reproduced ownership and alias findings resolved | Canonical install/update/rollback procedures and generic adoption route reconciled; tracked-core migration plan preserves separate personal-repository authorization | TK-002 compatibility diagnostics and TK-003 composition/native invocation; final S-050 release integration review and downstream gates remain open |

| 2026-09-08 | TK-001 | Frozen candidate d2ecc5cf049509160c9ae1460b970eee48175772 passed full verification and independent repair review | 37 of 37 commands green; installer 27 of 27 and upgrade 8 of 8; independent adversarial read-back confirmed ownership, whitespace and complete path-alias preservation. Guardrail 78 of 100 unchanged | Procedures and migration plan reconciled | Four unchanged outcome recommendations: repeated real trials, matched controls/prior comparison, current dated benchmark, effect and uncertainty ledger. No agent-outcome, native invocation or integration claim |

| 2026-09-08 | TK-002 | Read-only core compatibility and discovery inspection candidate prepared | Initial test draft had a syntax error and was corrected; valid four-case suite then failed against the frozen 434ef6b public doctor behavior through a test adapter. New inspection passes all four: inclusive differing-release bounds, missing/broken entries, unknown/modified content, separate sources/extra Codex discovery/mixed generations, with unchanged home snapshots | Root and generic diagnostic procedures, schema 2 range extension and this bounded decision documented | Integration fixtures, full 39-command union and independent review pending; configured-host workflow proof is not inferred |

| 2026-09-08 | TK-002 | Full checks passed at 7a449cced784edf68aea08ec63c416ea957fed84, but independent review rejected an overstated marker range | 39 of 39 commands passed. Review reproduced a producing release claiming support through v9.0.0. New regression demonstrated red; shared baseline floor and exact producing-release ceiling now reject widened or reversed ranges as unknown. Five focused inspection tests green | Existing declared range policy enforced; inspection remains read-only and attention-only | Fresh immutable full suite and independent re-review pending; no native workflow or integration claim |
| 2026-09-08 | TK-002 | Ticket closed | bc1347812d8c7402bade8991a7a41e5023f04e8e: inspection 5/5, installer 27/27, diagnostics 19/19, full 39/39 and independent bounded repair review PASS; range overstatement regression repaired | Root and generic diagnostic procedures and schema 2 range policy reconciled; read-only attention effects pinned | TK-003 portable composition and actual configured-host invocation; final S-050 integration and downstream gates remain open |

| 2026-09-08 | TK-002 | Repaired candidate bc1347812d8c7402bade8991a7a41e5023f04e8e completed every required check | Full 39 of 39 pass; independent re-review confirms widened ranges unknown, inclusive bounds preserved, read-only snapshots unchanged. Guardrail 78 unchanged with four outcome-evidence recommendations | Diagnostic procedure reconciled | Native workflow, full release integration and Example delivery remain open |
| 2026-09-08 | TK-003 | Portable composition implementation candidate prepared | New installed-project public-seam test demonstrated RED because save was absent from core. Reconciled personal prior art read-only; added core save/promote with existing notepad and direct-promotion seams. Catalog checks pass with twenty skills; installed workflow verification pending clean candidate | Core catalog, root and generic Runbook, composition skills and room-local ownership route reconciled | No personal source mutation, native callability or release stamp; targeted/full verification and independent review pending |

| 2026-09-08 | TK-003 | Candidate bf0bc31c8fcca78ce7bb4e7bb697bb1f3b3ee8c0 passed bounded independent composition review | Installed composition 1 of 1, installer 27 of 27, layout 67 of 67; full run 39 of 40. Adoption fixture still seeded the old eighteen-name catalog and correctly refused missing save/promote. Fixture now imports the runtime catalog; targeted adoption passes. Reviewer verified frozen legacy policy and tracked local-source clone with ignored adapter recreation and matching output | Existing procedure distinguishes filesystem/Git mechanics from native invocation; no new substantive review finding | Fresh corrected-candidate full verification and review pending; native Codex isolated invocation review is still running; no integration claim |

## Completion Result

Pending. No v3.2.0 readiness, publication, or downstream delivery claim.

## Remaining Limitations Or Follow-Up Specs

See [release owner](../S-050-workbench-v3-2-0-release/SPEC.md) for the complete assigned set,
source inventory, exclusions and externally gated acceptance. Zero routine
coordination hand-backs so far; the reserved host decision is a real owner gate.

## Supersession

- Supersedes: none; completed capability evidence remains historical.
- Superseded by: none.
