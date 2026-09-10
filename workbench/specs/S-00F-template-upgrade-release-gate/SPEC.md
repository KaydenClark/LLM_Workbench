# S-00F - Template Upgrade Release Gate

**Spec ID:** S-00F
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-10
**Catalog description:** Require each new LLM Workbench version to upgrade the named Workbench_Template repository and pass its installed update checks before release readiness can be claimed
**Blockers:** none
**Latest event:** TK-001 claimed by codex.
**Next gate:** Close TK-001 with verification and documentation proof.

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
| TK-001 | Deliver the named upgrade and its acceptance record | in-progress | none | pending |

### TK-001 - Deliver the named upgrade and its acceptance record

**Stance:** Builder

Preserve the baseline inventory, exercise the public update, verify actual
installed behavior and preservation, reconcile owned documentation, and obtain
independent review before integration.

## Acceptance Criteria

- [ ] AGENTS owns a mandatory version-matched named Template upgrade gate; RUNBOOK owns its executable procedure and README routes to it.
- [ ] Workbench_Template v3.2.1 managed update preserves room identity, historical provenance, completed evidence and product behavior; its full suite and installed byte checks pass.
- [ ] Independent immutable-candidate review precedes both integration merges; remote containment and a fresh Template clone are verified.
- [ ] Full source verification and unchanged-criteria guardrail comparison are recorded, without claiming main approval or broader rollout.

## Testing Seams

Installed receipt hashes and public CLI, root control contract, full documented
suites, preservation inventory, and remote reviewed-commit containment.

## Verification Procedure

Run the full local AGENTS/RUNBOOK suite, source byte verification and guardrail
comparison. The Template also exercises the installed project-evidence command
and full tests in a fresh remote clone. Preserve all command failures and limits.

## Documentation Impact

AGENTS.md, RUNBOOK.md, README.md and the existing S-014 release owner route to this gate. Generic templates are exempt: this names the harness producer reference repository and must not impose that external dependency on ordinary projects.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-10 | spec | Owner explicitly assigned the v3.2.1 Template upgrade and recurring release condition | Live GitHub identity, both integration tips and green 19-test Template baseline verified; isolated worktrees preserve unrelated work | This new owner preserves completed prior upgrade evidence | Update, verification and reviewed integration pending |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Main remains owner-only; optional cross-device transport and global skills are
outside this update. Guardrail scores do not establish agent reliability.

## Supersession

- Supersedes: none; follows the completed v3.2.0 Template update.
- Superseded by: none.
