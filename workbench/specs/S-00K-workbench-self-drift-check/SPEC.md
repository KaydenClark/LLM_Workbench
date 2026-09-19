# S-00K - Workbench Self-Drift Check On Update

**Spec ID:** S-00K
**Status:** active
**Priority:** 1
**Owner:** drift-reconciler
**Stance:** Builder
**Updated:** 2026-09-19
**Catalog description:** Check the canonical Workbench's own artifacts for semantic drift before an update is called complete.
**Blockers:** none
**Latest event:** Implementation proof is complete at 58a1b3b: all 51 checks and independent source review pass; owner Human QA remains open.
**Next gate:** Finish exact proof-state review and integration delivery, then owner Human QA; do not mark complete or retire without that approval.

> **Citation anchors.** pre=`c0ac60a179235ef22fa6ea81aec74735087e06e5` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

Every canonical LLM Workbench update checks the Workbench's own current-facing
artifacts for semantic drift and refuses a clean-completion claim when stale or
contradictory guidance could misroute a fresh agent. A target project's own
drift check remains separate and is not substituted for this check.

## Why It Matters

The Workbench is its own cold-start interface. At the pre anchor its manifest
declares v3.2.0 while the hot board still projects S-014 and S-022 as blocked on
v3.1-era release work. Those specs remain pending and name no successor. The
same review found five v3.1.4-seeded artifacts, a v3.1.0 provenance mismatch,
and unreadable legacy continuity records. `render`, `doctor`, and focused tests
can remain structurally green while this stale context changes what a memoryless
agent believes is current.

## Current Verified State

At `c0ac60a179235ef22fa6ea81aec74735087e06e5`:

- `workbench/manifest.json` declares `workbenchVersion: v3.2.0` and the
  integration branch `integration`.
- `TASKBOARD.md` projects S-014 and S-022 with v3.1-era blocked/pending release
  work, while S-050 and S-052 carry the current v3.2 external gate.
- S-014 and S-022 both report `Status: blocked`, `Completion Result: Pending`,
  and `Superseded by: none`.
- `README.md` still names S-014 as the integration-to-main release gate, and
  `LEXICON.md` still describes v3.1.4 as the current candidate.
- `doctor --json` reports five `stale-seed` findings and one
  `unverified-provenance` finding as attention-only; `next --json` returns
  `null`.
- `node tools/test-spec-workbench.mjs` and `node tools/test-diagnostics.mjs`
  pass, establishing structural diagnostic behavior rather than semantic
  currentness.
- Notepad identifier allocation was blocked by unreadable legacy records. The
  requested note therefore uses an explicit objective-scoped path and preserves
  the unreadable files as an implementation-review finding.

These are baseline findings for the planned capability, not repairs performed
by this specification-only run. Historical evidence remains valid when its
scope and time are explicit.

## Desired Behavior

1. A Workbench update runs a Workbench self-drift check before and after the
   update. Updating a downstream project runs its project drift check as a
   separate operation; neither result substitutes for the other.
2. The check inventories every artifact that can steer a cold start or describe
   current Workbench operation: root controls and projections, manifest,
   current/planned Specs and catalog, active ADRs/register, Wiki router, update
   and review procedures, templates, managed tools/skills and receipts, seeded
   contract documents, and readable continuity metadata.
3. It resolves each current-facing claim against the owning source and classifies
   it as current, historical, planned, blocked, stale, contradictory, or
   unreadable. A historical or append-only claim is not stale merely because it
   names an older version when its boundary is explicit.
4. It detects at least: completed work presented as pending; resolved blockers
   still presented as live; current version or route disagreement; generated
   projection mismatch; stale paths or owners; unreadable required artifacts;
   and provenance/seed drift that can confuse the active generation.
5. It produces a bounded report naming the artifact, claim, expected owner/state,
   observed state, source revision, severity/effect, and smallest correction.
   Current-facing drift and unreadable required steering artifacts block a clean
   update result. Historical bounded findings remain visible without forcing
   destructive cleanup.
6. The update procedure records the pre/post self-drift result, source revision,
   Workbench version, checked inventory, unresolved findings, and the owner of
   each accepted limitation.
7. A no-memory cold-start demonstration proves that the repaired Workbench
   exposes only current work as current, keeps real external gates explicit, and
   leaves historical context reachable without presenting it as an assignment.

## Decisions And Contracts

- [ADR-0055](../../docs/adr/0055-workbench-update-requires-self-drift-check.md)
  is the binding cross-cutting decision. The root controls carry the procedure;
  this spec owns the capability and proof.
- The implementation may extend an existing diagnostic seam or add a dedicated
  Workbench self-drift command, but it must expose a read-only public seam with
  human and machine-readable results. The chosen seam and diagnostic codes are
  recorded before implementation changes land.
- `render`, `doctor`, generated-region checks, and test suites remain useful
  component evidence but cannot be the sole self-drift proof.
- The current S-014/S-022 lifecycle records and the five stale seeds are
  preserved as baseline evidence. The implementation must route their
  correction to existing owners rather than deleting history or silently
  changing completed evidence.
- A known unreadable continuity record is a truthful finding, not an absent
  record. The check must preserve the path and reason and must not invent a
  replacement or delete it as part of diagnosis.

## Non-Goals

- Implementing or publishing the v3.2.0 release.
- Running a named downstream project's drift check or changing another project.
- Deleting, rewriting, or renumbering historical Specs, ADRs, research, notes,
  handoffs, or recovery records.
- Requiring a network provider, private repository, new coordination service,
  paid integration, or owner approval for ordinary local diagnosis.
- Claiming improved agent reliability from a clean structural score or a single
  cold-start demonstration.

## Dependencies And Blockers

The owner explicitly activated S-00K on 2026-09-18. The implementation must first read
the current manifest and applicable controls, create a clean task worktree from
the declared integration/default base, and preserve unrelated dirty state in
the current checkout. It must inspect current provider/host availability only
when a chosen seam needs it; local self-drift diagnosis cannot depend on an
unavailable external service.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

### TK-0SA - Reconcile the old release hot-queue with its current owner and Sol-coordinated disposition

**Stance:** Reconciler

Trace old release hot-queue claims through their existing Specs and current
owner. Coordinate the intended disposition with Sol where that is the named
feedback/review dependency, without reopening completed evidence or silently
deleting historical release records. The self-drift result must say whether the
claim is current, historical, blocked, or owner-routed.

### TK-0SB - Define seed and provenance identity semantics for self-drift findings

**Stance:** Builder

Establish the identity tuple the self-drift seam needs for seeded documents and
manifest provenance: source repository, release, commit and content hash where
available. Prove that matching names or bytes do not erase source-generation
meaning, and preserve historical receipts and unresolved provenance limits.

### TK-0SC - Inspect installed-source compatibility and explicit-update/native-callability limits

**Stance:** Auditor

Bound installed-state findings to read-only inspection. Distinguish the
repository source from `.agents`/`.claude` installed copies, identify that
replacement requires an explicit update operation, and record preservation and
rollback limits. Do not perform installation, infer native host callability, or
turn a home-directory finding into a repository repair.

## Acceptance Criteria

- [x] ADR-0055 and its operational owners agree on the separate Workbench
      self-drift versus target-project drift boundary.
- [x] The public self-drift seam inventories the declared current-facing
      Workbench artifacts and reports its source revision and Workbench version.
- [x] A deterministic regression demonstrates that completed or superseded work
      still presented as current fails the self-drift check.
- [x] Historical, append-only, planned, and bounded unavailable claims remain
      readable without being misclassified as current work.
- [x] Current-facing drift and unreadable required steering artifacts prevent a
      clean update result and identify the smallest owning correction.
- [x] Update procedures record the self-drift result before and after a
      Workbench update; a project drift result is recorded separately.
- [x] The known S-014/S-022 stale projection, README/LEXICON stale release
      wording, and v3.1 seed/provenance findings are either repaired or named as
      explicit, owner-routed limitations.
- [x] A clean no-memory cold-start read-back reaches the current owner and
      current gate without treating historical v3.1 work as active.
- [x] The full required verification suite, render, doctor, and independent
      exact-candidate review pass before integration.

The selected public seam is `node workbench/tools/self-drift.mjs --json`. It emits a read-only receipt with source revision, version, inventory, findings and explicit semantic-review limits. Machine checks do not certify arbitrary prose as current.

## Testing Seams

- A read-only CLI or exported seam for the self-drift report with stable JSON
  fields and human-readable output.
- Disposable Workbench fixtures containing current, completed, planned,
  historical, stale, contradictory, and unreadable artifact cases.
- The real repository baseline, including S-014/S-022, S-050/S-052, manifest
  version/provenance, seeded files, and generated projections.
- The update procedure's pre/post receipt and a clean no-memory cold-start
  read-back using only repository state.

## Verification Procedure

Use red/green on the stale-current-claim and current/history classification
fixtures. Run the focused self-drift tests, the full suite named in `AGENTS.md`,
`node workbench/tools/spec-workbench.mjs render`, `node workbench/tools/spec-workbench.mjs doctor`,
and a clean no-memory cold-start read-back. Independently review the exact
candidate before integration. Verify that the update receipt separates the
Workbench self-check from any target-project drift result and preserves all
unresolved limitations.

## Documentation Impact

ADR-0055, `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md`,
`skills/update-harness/SKILL.md`, the generic `templates/AGENTS.md`,
`templates/LEXICON.md`, and `templates/RUNBOOK.md` carry the rule or route to
this spec. The read-only runtime and focused regression now implement the machine-evidence seam; source update procedures and semantic reconciliation remain required before completion.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-10 | spec | Owner requested a Workbench self-drift check as a mandatory part of every Workbench update; planned S-00K and ADR-0055 from the passive review | Preflight at `c0ac60a179235ef22fa6ea81aec74735087e06e5`; `doctor --json` reported five stale seeds and one provenance mismatch; `next --json` returned `null`; focused spec and diagnostic tests passed; notepad allocation exposed five unreadable legacy records | ADR, root/template routes, update skill and handoff authored; no implementation or stale-record repair performed | Implement S-00K in a clean task worktree, repair or owner-route baseline drift, run full verification and fresh no-memory review |
| 2026-09-12 | spec | Bounded manual post-update self-drift check (no implementation exists yet, per Remaining Limitations below): this Git-recovery PR is itself a Workbench update, landing ADRs 000B-000K, specs S-00G-S-00K/S-054, and root/template control edits into `integration` | Inventoried the recovered ADRs, Specs, `CATALOG.md`, `HISTORY.md`/`REGISTER.md` (regenerated via `adr.mjs register`), and every cross-reference among them; found and repaired the S-00F/S-00K ID collision, wrong baseline counts in S-00I (also found still-stale in ADR-000I; see that ADR's own evidence), an unreachable S-054 citation anchor, broken links from file relocation, false tool-coverage claims in ADR-000K and a Spec, missing ADR-000H requirements in S-00H's scope, and unowned migrations claimed in ADR-000J/000K. `doctor --json` at the final commit: 48 findings, all `attention`/blocks-none (6 stale-seed/provenance findings confirmed pre-existing on `origin/integration` itself, unrelated to this recovery; 42 are locally-installed skill-core-version notices, not repository content); `next --json` returns `null` (expected — every recovered spec is gated on its own ADR's acceptance) | Every fix above is a linked commit on this PR's branch; this row and its sibling ADR/Spec corrections are the docs | The 6 stale-seed/provenance attention findings are known, pre-existing Workbench drift unrelated to this recovery and are not repaired here (separate scope); S-00K's own implementation remains not started |

| 2026-09-19 | TK-001 | Activated by owner request; implemented read-only machine-evidence seam at `7f28eb8` | `node tools/test-self-drift.mjs` passed after missing-seam red; fixtures cover historical/planned classification, complete/pending contradiction, resolved blocker, unreadable JSON/symlink, seed generation identity and read-only JSON CLI; template guardrail before/after both 48.9, byte-identical reports | Public seam and limitations recorded here; shared procedures remain coordinator-owned | Full verification, source update integration, semantic cold-start read-back and owner reconciliation remain open; a machine report does not prove semantic freshness |

| 2026-09-19 | TK-0SA | Reconciled S-014/S-022 duplicate release assignments as superseded, never completed; README now routes current release ownership to S-00O and surviving live-device gate to S-050/S-052 | Full source-owner read-back at `1a26de9`; render removes both old release packets from hot projection; doctor has no blocker; existing acceptance boxes, unfinished rows and prior evidence bytes preserved | Room-specific README release route changed; generic template exemption because no named room release owners belong in the template | CIC/Sol current consumer read-back unverified and explicitly preserved; no publication, installation, file movement or old acceptance claim |

| 2026-09-19 | TK-0SA correction | Retracted the preceding doctor no-blocker claim for the supersession candidate `4338087` | Captured doctor output actually reports contradictory-state for both S-014 and S-022 because the runtime forbids superseded Specs with unfinished tasks; the shell continued after doctor and only the final command status was observed | Original row retained as append-only history; correction is explicit here | Resolve through the current lifecycle owner or retain blocked owner-routed historical packets; never mark unexecuted Tasks done just to silence the check |

| 2026-09-19 | TK-0SA correction result | Preserved blocked S-014/S-022 historical records and current successor routes without changing lifecycle semantics | Both packets retain all original tasks and acceptance; no runtime expansion or false task completion; remaining historical hot rows explicitly disclose owner routing | Room-specific README and both current-disposition sections reconciled | Formal supersession remains limited by existing unfinished-task validation; this is an owner-routed limitation allowed by S-00K acceptance, not a clean projection claim |

| 2026-09-19 | assembled pre/post | Exercised the public self-drift seam against baseline and fixed candidate | CLI from `e7b0906025909b9edd626e967b15e526e5d02509` inspected baseline `bc370fe742d5ddb8348bf361fccea31205f6cee7`: v3.2.1, 274 inventoried artifacts, one blocking resolved S-00H dependency in S-00P; assembled post check: v3.2.1, 272 artifacts and no machine-blocking finding | Root/generic update procedures and skill route to pre/post seam; S-00P live header corrected; S-014/S-022 retain blocked historical records with S-00O/S-050/S-052 routes | Inventory counts differ because live continuity and candidate source differ; hashes are bounded evidence, not semantic certification. Independent cold-start read-back, common suite and review pending; historical seed and installed/native limitations remain explicit |
| 2026-09-19 | TK-001 | Task closed | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. |
| 2026-09-19 | TK-0SA | Task closed | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. |
| 2026-09-19 | TK-0SB | Task closed | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. |
| 2026-09-19 | TK-0SC | Task closed | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. |

| 2026-09-19 | assembled verification | Full source proof and independent review passed at `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` | All 51 commands passed in a detached clean tree; before/after HEAD and status identical; separate-context reviewer reran retired-corrective and unfinished-discard probes | Shared S-00U VERIFICATION.md plus owning documentation | Final metadata review and integration delivery pending; owner Human QA, retirement, release and native/external proof are not supplied |

## Completion Result

The public self-drift seam, pre/post update procedure, source-generation boundaries and historical release owner routes are implemented. Source `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c` passed the full 51-command suite and separate-context source review. Shared [verification](../S-00U-approval-binding-and-lifecycle-digest/VERIFICATION.md) records commands, red/green cases and limits. Task delivery proof is complete; **whole-Spec closure is not approved**. Final proof-state review, integration delivery and real owner Human QA remain separate. No real record was retired/discarded and no main promotion or native-host proof is inferred.

## Remaining Limitations Or Follow-Up Specs

The original-checkout baseline recorded unreadable legacy continuity records;
the clean candidate does not contain those local records and does not prove
their reconciliation. Its machine report has no unreadable finding. The
historical blocked release packets, installed-source/native limits and absent
external consumer read-back remain explicit limitations. No new follow-up Spec
or local-record deletion is authorized by this record.

## Supersession

- Supersedes: none.
- Superseded by: none.
