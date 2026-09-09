# S-053 - Configured Host Capabilities

**Spec ID:** S-053
**Status:** complete
**Priority:** 2
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-09
**Catalog description:** Verify the agreed minimum operations in the actual host while keeping capability, enforcement and agent reliability separate.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

> **Citation anchors.** pre=`212762774b5cb7c065ab573bb487752fe98eff4c` post=`212762774b5cb7c065ab573bb487752fe98eff4c`.

## Outcome

Verify the agreed minimum operations in the actual host while keeping capability, enforcement and agent reliability separate.

## Why It Matters

The 2026-09-08 owner request explicitly invokes make-it-so for specification,
promotion and delivery, followed by carry for each named assignment. A pushed
plan or upstream-only green result cannot establish Example readiness.

## Current Verified State

Existing portability/cross-provider tests are structural fixtures. S-036 native
Claude permission probing did not reach a permission decision. The owner chose
a small minimum contract but expressly reserved agreement on its contents.
The owner renewed implementation after the recorded five-check proposal was recovered. This is current authorization, not evidence of an earlier checklist approval.

## Desired Behavior

Accepted boundary: actual configured-host checks, unavailable/inconclusive
remains unverified, and missing capabilities block only dependent work. New
provider-native enforcement adapters/hooks are outside core; discovery adapters
and existing evaluation launchers are different mechanisms.

The implementation baseline is the five checks recorded in Claude's decision docket:

1. Declared writable lanes work in supported relative, home-relative and absolute forms.
2. A skill in the declared discovery root is discoverable and invocable by the configured provider.
3. The declared Node runtime executes managed tools.
4. The host supports the selected directory discovery adapter (symlink or junction).
5. Record syntax survives checkout, including its line endings.

Git network access and optional sync, provider enforcement hooks and model output
quality are outside this floor. A producer-run filesystem/parser probe cannot
prove native provider discovery or invocation. Record those separately; an
unavailable provider stays unverified and blocks only its dependent operation.
A standalone conformance command is sufficient; no new manifest or diagnostic
framework is required.

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
| TK-001 | Agree the concrete host capability floor | done | none | Recorded five-check docket recovered; owner renewed implementation on 2026-09-08 |
| TK-002 | Implement operation-scoped host conformance checks | done | TK-001 | New public probe seam RED missing module then GREEN 4 tests; missing lanes and runtimes remain operation-scoped; no native discovery inference |
| TK-003 | Verify supported hosts and reconcile evidence claims | done | TK-002 | Actual local report four runner checks pass; native discovery and unavailable hosts explicitly unverified; full42 before review repair and focused6 after repair |

### TK-001 - Agree the concrete host capability floor

**Stance:** Builder

Use the recovered five-check docket and current renewed implementation authorization. Preserve the historical distinction between proposal and approval; do not substitute the later agent-authored checklist.

### TK-002 - Implement operation-scoped host conformance checks

**Stance:** Builder

Design smallest test seam after agreement. Exercise actual authorized temporary reads/writes, Node checks, discovery adapters, checkout record syntax and skill invocation through available configured host; distinguish runner self-check from native host invocation. Missing/unavailable results cannot become blanket support or enforcement PASS.

### TK-003 - Verify supported hosts and reconcile evidence claims

**Stance:** Builder

Record host application/model/configuration/OS and exact candidate. Test approved operations in each claimed setup; separate fixture, capability, enforcement and model reliability evidence. Full suite and separate-context integration review; unsupported setups remain explicit.

## Acceptance Criteria

- [x] Owner-agreed minimum precedes schema, diagnostic and test architecture choices.
- [x] Actual host results name each capability and unavailable/inconclusive limits.
- [x] Missing capability affects dependent work only; discovery and real callability are distinct.
- [x] No inferred enforcement or model-reliability claim follows from operational/structural success.

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

Configured-host guidance in RUNBOOK and generic counterpart, CAND-P and ADR-0005 clarification, report contract and portable evaluation guidance.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Complete release assignment specified from owner request and reconciled packet | All 17 handoff source hashes match; upstream integration 212762774b5cb7c065ab573bb487752fe98eff4c; Example refreshed to bf8a2fa5d7b7403fda07e3c8573db1d8348fe3f4, 12 tour tests pass and doctor has zero blockers | This spec owns its requirements; source packet retained locally | Implementation and acceptance remain pending |

| 2026-09-08 | TK-001 | Recovered Claude docket five-check proposal and applied renewed owner implementation authorization | Original proposal covers writable path forms, discovery/invocation, Node, adapters and checkout syntax; later substituted checklist withdrawn | This spec restores the exact baseline before implementation; no historical approval invented | Actual native provider and unavailable device results must remain qualified |
| 2026-09-08 | TK-002 | Ticket closed | New public probe seam RED missing module then GREEN 4 tests; missing lanes and runtimes remain operation-scoped; no native discovery inference | Root and generic Runbook document exact five checks and explicit temporary write contract | Full suite and actual local report; native discovery and unavailable Windows/provider claims remain unverified |

| 2026-09-08 | TK-003 | Actual local report and independent probe corrections | 39ee853 full42 passes; review found relative-cwd alias, linked ADR and malformed-status defects. New tests demonstrated RED and six tests GREEN at 2320164a5a704b1d3659b3228fa0af12644054b9; actual Darwin25.5 arm64 Node26.3 runner report checks writable forms, managed doctor, symlink and40 ADRs | [Local result](local-host-result.json) keeps native discovery, enforcement and reliability unverified; current environment only | Final stamped full suite and separate-context integration review; actual unavailable hosts remain unverified |
| 2026-09-08 | TK-003 | Ticket closed | Actual local report four runner checks pass; native discovery and unavailable hosts explicitly unverified; full42 before review repair and focused6 after repair | S053 local-host-result.json and Runbook distinguish actual local runner from native/provider/enforcement claims | Final stamped full suite and upstream integration review; Windows/native Claude and native discovery are unverified |
| 2026-09-08 | TK-003 | Upstream integration review found the host probe could execute substituted managed bytes from an unverified root | Synthetic ordinary non-Git root reproduced child execution and false PASS at 563a6e6; regression RED, then non-Git, wrong-commit and dirty-producer cases plus the existing seven cases GREEN after exact root/commit/origin/clean-input preflight | RUNBOOK and template procedure now name the required sourceCommit/sourceRepository and verified producer inputs | Fresh full suite, independent review and corrective upstream integration remain with S050 TK-004; native provider and Windows evidence stay unverified |

| 2026-09-09 | spec | Repaired v3.2.0 integration gate reconciled | Fresh independent PASS 7f9fe2101e5b693f5085c3ed5acee65e73eda445; PR84 remote integration b937f7deac3669307041e86e4b5fc84cd167f818 contains exact candidate with zero tree difference; full6e43PASS and63540/43 plus3corrected clean7f9rerunsPASS; fresh remote clone core/catalog/Blueprint/doctor PASS | Current root/template and core owners agree; S050 repair receipt retains actual native failures and unavailable environments; historical evidence unchanged | No main readiness or real Windows/private cross-device claim; S052TK004 remains external |
| 2026-09-09 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Local conformance command implemented. The [actual local result](local-host-result.json)
records four runner checks passing and native discovery/invocation unverified.
Windows and native Claude are not claimed supported by this result. The final upstream integration gate now passes under S-050; no rollout readiness claim.

The repaired v3.2.0 candidate7f9fe21 passed fresh independent integration review
and is remotely contained by PR84 integrationb937f7d with no tree difference.
Full6e43checks passed; later635 had three catalog-projection failures, all
corrected and rerun successfully on7f9. Original guardrail comparison78 to66.9
is retained; the reviewed owner-aware rubric restores78 with the same four
outcome-evidence recommendations. S051 owns the actual21-core installation and
bounded native save/correction/handoff/resume proof. Real Windows/private
continuity and authenticated Claude behavior remain explicitly unverified.

## Remaining Limitations Or Follow-Up Specs

See [release owner](../S-050-workbench-v3-2-0-release/SPEC.md) for the complete assigned set,
source inventory, exclusions and externally gated acceptance. A routine coordination hand-back occurred: the implementing agent missed the
recorded checklist and replaced it with a different proposal. The owner corrected
this; the existing spec now restores the five checks and operation-scoped gates.

## Supersession

- Supersedes: none; completed capability evidence remains historical.
- Superseded by: none.
