# S-00K - Workbench Self-Drift Check On Update

**Spec ID:** S-00K
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-10
**Catalog description:** Check the canonical Workbench's own artifacts for semantic drift before an update is called complete.
**Blockers:** explicit implementation activation; specification and handoff are complete, implementation is not authorized by this record alone
**Latest event:** Planned from the owner-requested self-drift correction and passive drift review.
**Next gate:** Activate S-00K for implementation in a clean task worktree.

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

S-00K is planned until explicitly activated. The implementation must first read
the current manifest and applicable controls, create a clean task worktree from
the declared integration/default base, and preserve unrelated dirty state in
the current checkout. It must inspect current provider/host availability only
when a chosen seam needs it; local self-drift diagnosis cannot depend on an
unavailable external service.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state | deferred | explicit S-00K activation | Red stale-current-claim cases; green current/history classification and blocking behavior; pre/post update receipt; focused and full suites; fresh no-memory read-back; independent review |

### TK-001 - Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state

**Stance:** Builder

Start with red disposable fixtures for S-014/S-022-style stale blockers,
resolved blocker text, version/provenance drift, generated projection drift,
and unreadable required artifacts. Implement the smallest read-only seam that
can inspect the declared artifact inventory and distinguish bounded history from
current guidance. Integrate the seam into the canonical Workbench update
procedure before and after update, retain a machine-readable receipt, and
repair the baseline current-facing records through their existing owners. Prove
that a target project drift check is not counted as the Workbench self-check.

## Acceptance Criteria

- [ ] ADR-0055 and its operational owners agree on the separate Workbench
      self-drift versus target-project drift boundary.
- [ ] The public self-drift seam inventories the declared current-facing
      Workbench artifacts and reports its source revision and Workbench version.
- [ ] A deterministic regression demonstrates that completed or superseded work
      still presented as current fails the self-drift check.
- [ ] Historical, append-only, planned, and bounded unavailable claims remain
      readable without being misclassified as current work.
- [ ] Current-facing drift and unreadable required steering artifacts prevent a
      clean update result and identify the smallest owning correction.
- [ ] Update procedures record the self-drift result before and after a
      Workbench update; a project drift result is recorded separately.
- [ ] The known S-014/S-022 stale projection, README/LEXICON stale release
      wording, and v3.1 seed/provenance findings are either repaired or named as
      explicit, owner-routed limitations.
- [ ] A clean no-memory cold-start read-back reaches the current owner and
      current gate without treating historical v3.1 work as active.
- [ ] The full required verification suite, render, doctor, and independent
      exact-candidate review pass before integration.

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
this spec. The future implementation owns its tool, tests, receipt shape and
any diagnostic registration. No current runtime behavior is changed by this
planning record.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-10 | spec | Owner requested a Workbench self-drift check as a mandatory part of every Workbench update; planned S-00K and ADR-0055 from the passive review | Preflight at `c0ac60a179235ef22fa6ea81aec74735087e06e5`; `doctor --json` reported five stale seeds and one provenance mismatch; `next --json` returned `null`; focused spec and diagnostic tests passed; notepad allocation exposed five unreadable legacy records | ADR, root/template routes, update skill and handoff authored; no implementation or stale-record repair performed | Implement S-00K in a clean task worktree, repair or owner-route baseline drift, run full verification and fresh no-memory review |

## Completion Result

Pending. This is a planned capability and implementation handoff only. No
Workbench self-drift checker or update integration has been implemented.

## Remaining Limitations Or Follow-Up Specs

The current repository remains a useful baseline for the first regression but
does not yet pass the new semantic self-drift standard. Existing unreadable
legacy continuity records need their own safe reconciliation path. No new
follow-up spec is authorized by this record.

## Supersession

- Supersedes: none.
- Superseded by: none.
