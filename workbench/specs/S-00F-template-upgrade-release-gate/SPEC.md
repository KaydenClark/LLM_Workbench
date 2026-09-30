# S-00F - Template Upgrade Release Gate

**Spec ID:** S-00F
**Status:** complete
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-10
**Catalog description:** Require each new LLM Workbench version to upgrade the named Workbench_Template repository and pass its installed update checks before release readiness can be claimed
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

Require each new LLM Workbench version to upgrade the named Workbench_Template repository and pass its installed update checks before release readiness can be claimed. Deliver the missing v3.2.1 upgrade as the first application.

## Why It Matters

The owner uses the example Workbench Template to test updating an existing
Workbench. Source-template tests and a newly generated project do not prove that
this installed reference was updated.

## Current Verified State

Source integration 385218a declares v3.2.1; Workbench_Template integration 4010003 and main e4e1985 still declare v3.2.0. Prior upstream tests and fresh-project proof did not upgrade this repository.

## Desired Behavior

1. AGENTS owns a mandatory version-matched named Template upgrade gate; RUNBOOK owns its executable procedure and README routes to it.

2. Workbench_Template v3.2.1 managed update preserves room identity, historical provenance, completed evidence and product behavior; its full suite and installed byte checks pass.

3. Independent immutable-candidate review precedes both integration merges; remote containment and a fresh Template clone are verified.

4. Full source verification and unchanged-criteria guardrail comparison are recorded, without claiming main approval or broader rollout.

## Decisions And Contracts

- The target is https://github.com/KaydenClark/Workbench_Template, formerly
  Example_Workbench. Repository identity must be resolved live; a local folder
  name or upstream template directory is not the acceptance target.
- This owner request authorizes this named update and the release gate, including
  reviewed integration. Main promotion remains owner-only in both repositories.
- Use the already-v3 update route: additive layout check, explicit managed tool
  update with backup, and minimal control/seed reconciliation. Preserve personal
  skills; this assignment does not replace the global core bundle.
- The source remains v3.2.1: the release gate is producer policy and this change
  does not change the stamped core bundle or runtime bytes.

## Non-Goals

Other rooms, personal skill updates, rewriting completed proof, main publication,
new release automation, and claims of repeated agent reliability.

## Dependencies And Blockers

None within the named assignment. Unavailable native environments are separate
capability limits, not a reason to skip the Template update.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Deliver the named upgrade and its acceptance record | done | none | Policy618d1b8 full45 and independent PASS; Template PR8/9 atfc0fc18 with independent reviews,fresh21tests and16 exact hashes |

### TK-001 - Deliver the named upgrade and its acceptance record

**Stance:** Builder

Preserve the baseline inventory, exercise the public update, verify actual
installed behavior and preservation, reconcile owned documentation, and obtain
independent review before integration.

## Acceptance Criteria

- [x] AGENTS owns a mandatory version-matched named Template upgrade gate; RUNBOOK owns its executable procedure and README routes to it.
- [x] Workbench_Template v3.2.1 managed update preserves room identity, historical provenance, completed evidence and product behavior; its full suite and installed byte checks pass.
- [x] Independent immutable-candidate review precedes both integration merges; remote containment and a fresh Template clone are verified.
- [x] Full source verification and unchanged-criteria guardrail comparison are recorded, without claiming main approval or broader rollout.

## Testing Seams

Installed receipt hashes and public CLI, root control contract, full documented
suites, preservation inventory, and remote reviewed-commit containment.

## Verification Procedure

Run the full local AGENTS/RUNBOOK suite, source byte verification and guardrail
comparison. The Template also exercises the installed project-evidence command
and full tests in a fresh remote clone. Preserve all command failures and limits.

## Delivered Template Evidence

[Release-gate proof](template-upgrade-proof.json) pins both repositories and
links this version to its installed acceptance. Source385218a supplies v3.2.1;
[Template PR8](https://github.com/KaydenClark/Workbench_Template/pull/8) delivers
reviewed8ff9dfe at integration7125c8f.
[Template PR9](https://github.com/KaydenClark/Workbench_Template/pull/9) delivers
reviewed closeoutdb40c87 at integrationfc0fc18. Both merges contain their exact
reviewed candidate with zero tree delta. A fresh remote clone at7125c8f and its
update tofc0fc18 pass21 tests, syntax, layout and doctor; all16 managed hashes
match the source and receipt. The Template's
[upgrade spec](https://github.com/KaydenClark/Workbench_Template/blob/fc0fc18c2c1752c8c98a4fed20304e803c71f53c/workbench/specs/S-00B-v3-2-1-harness-upgrade/SPEC.md)
owns all69 baseline inventory entries, full control fidelity and recovery limits.

The managed rollback rehearsal restored replaced files but retained the new
module. Whole-room recovery uses the preserved original commit; no complete
rollback claim is made. Source guardrail78 and target58.3 are unchanged. Remaining
source recommendations are repeated real outcomes, comparison to controls/prior
versions, recency and uncertainty. Template recommendations additionally concern
producer-oriented static/version surfaces, benchmark ledger and held-out tasks.
These are diagnostic limits, not an agent reliability claim. Existing installed
global v3.2.0 skills remain unchanged and report compatibility attention.

## Coordination Corrections

The owner first had to clarify that Template meant the named Workbench_Template
repository after the assistant answered with upstream source-test approval.
Cause: the readiness check used the wrong artifact, despite the existing named
reference route (not followed). Correction: resolve the GitHub repository identity
and inspect its own manifest, PRs and exact installed evidence before answering.
The owner then supplied this release requirement after the missing update was
confirmed. This is an explicit new release decision; the smallest correction is
this producer gate and the named v3.2.1 update, not a portfolio rollout.

## Documentation Impact

AGENTS.md, RUNBOOK.md, README.md and the existing S-014 release owner route to this gate. Generic templates are exempt: this names the harness producer reference repository and must not impose that external dependency on ordinary projects.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-10 | spec | Owner explicitly assigned the v3.2.1 Template upgrade and recurring release condition | Live GitHub identity, both integration tips and green 19-test Template baseline verified; isolated worktrees preserve unrelated work | This new owner preserves completed prior upgrade evidence | Update, verification and reviewed integration pending |

| 2026-09-10 | TK-001 | Policy candidate618d1b8 independently passed; all45 source commands pass | Guardrail78 unchanged; no core/runtime delta; named Template reviewed and delivered through PR8/9 atfc0fc18 with fresh21-test and16-hash proof | Gate owns the requirement in AGENTS; Runbook procedure, README and S014 route agree; complete target proof linked | Final evidence candidate verification and independent integration review remain branch delivery gates; one wrong-artifact coordination correction recorded |
| 2026-09-10 | TK-001 | Ticket closed | Policy618d1b8 full45 and independent PASS; Template PR8/9 atfc0fc18 with independent reviews,fresh21tests and16 exact hashes | AGENTS release gate, Runbook procedure, README/S014 routes and target proof reconciled | none for the Template gate; main remains owner-only |
| 2026-09-10 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

The producer release contract now requires the named Template's version-matched
installed upgrade, review, remote integration and fresh-clone evidence. Its first
application delivered v3.2.1 to Workbench_Template integrationfc0fc18 with21 tests
and16 managed hashes verified. The policy-only candidate618d1b8 passed all45
source commands and independent bounded review; the final evidence-bearing
candidate retains the separate immutable integration review required by AGENTS.
No core/runtime bytes or release label changed. Main remains owner-only in both
repositories; this result proves the Template upgrade gate, not every optional
cross-device or global-skill capability.


## Remaining Limitations Or Follow-Up Specs

Main remains owner-only; optional cross-device transport and global skills are
outside this update. Guardrail scores do not establish agent reliability.

## Supersession

- Supersedes: none; follows the completed v3.2.0 Template update.
- Superseded by: none.
