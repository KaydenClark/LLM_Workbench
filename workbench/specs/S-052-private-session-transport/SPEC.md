# S-052 - Private Session Transport

**Spec ID:** S-052
**Status:** active
**Priority:** 2
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Optionally synchronize selected working records through private Git with explicit acknowledgment and lossless offline/conflict handling.
**Blockers:** none
**Latest event:** Owner assigned the reconciled v3.2.0 release through Example integration.
**Next gate:** Allocate stable room identity and preserve it across lifecycle operations.

> **Citation anchors.** pre=`212762774b5cb7c065ab573bb487752fe98eff4c` post=`212762774b5cb7c065ab573bb487752fe98eff4c`.

## Outcome

Optionally synchronize selected working records through private Git with explicit acknowledgment and lossless offline/conflict handling.

## Why It Matters

The 2026-09-08 owner request explicitly invokes make-it-so for specification,
promotion and delivery, followed by carry for each named assignment. A pushed
plan or upstream-only green result cannot establish Example readiness.

## Current Verified State

The pre-anchor has no transport tool or stable Workbench connection identity.
S-046 local runtime is pending integration. No actual private repository,
Windows host or Claude/Codex round-trip access is verified in this task.
Read-only lookup on 2026-09-08 could not resolve the selected
KaydenClark/workbench_sessions repository with current credentials; unavailable
or inaccessible is the verified result, not proven nonexistence. The exposed
connected-host capability offers local only; Windows access is not established.

## Desired Behavior

- A stable manifest Workbench identity survives clones/worktrees, renames and
  moves; independent instantiation creates a new identity. Artifact IDs under
  S-047 remain separately scoped visible identifiers, not duplicated globals.
- Explicitly configured private `workbench_sessions` transport uses
  `workbenches/<WBID>/sessions/` and small `workbench.json`. Machine paths stay
  local configuration. Agents use existing manifest collections; the sync tool
  maps live notepads, grilling records and handoffs only.
- Project schemas/templates/promoted documents stay in project Git. Live notes
  remain ignored there and never become authority/proof via private commit.
- Fetch before resume; push after meaningful saves and device switching. Offline
  saves remain intact and report pending upload and last confirmed remote SHA.
- Serialize local operations, one active writer per note, reject unsafe paths
  and privacy violations; preserve competing revisions and surface conflicts.
  No silent overwrite, force push, automatic credential or remote provisioning.
- Git history retention is accepted; deleting current resolved records does not
  erase history. Notes do not transport unpushed code or running processes.
- Local note operations work without configuring or reaching the transport.

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
| TK-001 | Allocate stable room identity and preserve it across lifecycle operations | ready | none | pending |
| TK-002 | Synchronize selected safe notes and report acknowledgment | ready | TK-001 | pending |
| TK-003 | Preserve conflicting/offline revisions under serialized sync | ready | TK-002 | pending |
| TK-004 | Prove real Mac Windows Claude Codex continuation | blocked | live-device-and-private-repository-access | pending |

### TK-001 - Allocate stable room identity and preserve it across lifecycle operations

**Stance:** Builder

Red/green same-room clone/worktree versus independent Genesis/adoption identity, rename stability, collision/invalid input rejection and existing artifact references. Share implementation with S-047 without changing its uniqueness scope.

### TK-002 - Synchronize selected safe notes and report acknowledgment

**Stance:** Builder

After S-046 schema/layout seam exists, implement opt-in configured local clone mapping, explicit private remote validation and acknowledgment; test offline pending state, clean fetch/push, idempotence, exclusion of project-owned data, path and privacy refusal.

### TK-003 - Preserve conflicting/offline revisions under serialized sync

**Stance:** Builder

Two isolated clones edit the same note and different notes; verify no loss/no force push and named conflict recovery; interrupted/rejected pushes never report confirmation. Keep fixtures labeled fixtures.

### TK-004 - Prove real Mac Windows Claude Codex continuation

**Stance:** Builder

Actual configured Mac/Windows and Claude/Codex save/resume a useful assigned objective with correction and next action intact; exercise offline and conflict recovery. Record exact devices/hosts/models/refs and explicit remote read-back. An unavailable environment leaves this acceptance open.

## Acceptance Criteria

- [ ] Stable Workbench connection identity and independent-room regeneration preserve artifact semantics.
- [ ] Opt-in transport maps only selected safe live collections and leaves local work independent.
- [ ] Remote acknowledgment, offline pending state, serialized sync and conflicting revisions are proven at public seams.
- [ ] Real Mac/Windows Claude/Codex round trip preserves objective/corrections/next action; fixtures are not substituted.
- [ ] Privacy, Git history retention, code/process exclusions and source/destination recovery are documented and reviewed.

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

AGENTS/BLUEPRINT/LEXICON/RUNBOOK and generic owners, lifecycle manifests/tools, CAND-N/ADR-0040/0041 relationships, notepad skill and source identity tests.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Complete release assignment specified from owner request and reconciled packet | All 17 handoff source hashes match; upstream integration 212762774b5cb7c065ab573bb487752fe98eff4c; Example refreshed to bf8a2fa5d7b7403fda07e3c8573db1d8348fe3f4, 12 tour tests pass and doctor has zero blockers | This spec owns its requirements; source packet retained locally | Implementation and acceptance remain pending |

## Completion Result

Pending. No v3.2.0 readiness, publication, or downstream delivery claim.

## Remaining Limitations Or Follow-Up Specs

See [release owner](../S-050-workbench-v3-2-0-release/SPEC.md) for the complete assigned set,
source inventory, exclusions and externally gated acceptance. Zero routine
coordination hand-backs so far; the reserved host decision is a real owner gate.

## Supersession

- Supersedes: none; completed capability evidence remains historical.
- Superseded by: none.
