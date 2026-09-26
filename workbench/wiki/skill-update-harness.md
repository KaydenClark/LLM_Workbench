---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01N TK-01E source audit, red/green change and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/update-harness/SKILL.md
  - tools/workbench-upgrade.mjs
  - tools/workbench-tools.mjs
  - tools/workbench-skills.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/self-drift.mjs
  - workbench/specs/S-01N-update-harness-skill-rebuild/SPEC.md
  - tools/test-skill-catalog.mjs
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Update-harness: move a room to a newer Workbench without losing its truth

Use `update-harness` when a project that already runs the Workbench needs the contract, runtime tools and core skills of a newer checked-out release. The skill reconciles; it does not overwrite. Whatever the room owns stays byte-identical unless the owning upgrade spec says otherwise: its filled controls, product code, specs, Wiki and room-added skills. Workbench-managed files change only through receipt-backed commands that record a backup.

**Inputs:** the target room (a clean, committed Git checkout) and a clean checkout of the LLM Workbench release to update to. **Output:** one commit on a prefixed task branch in the room, pushed to its remote. It carries the updated managed lanes, the stamped manifest, the reconciled control sections and a dedicated upgrade spec with the before/after inventories, verify results, rollback route and feedback harvest. **Done when:** the room's suite matches or improves on its baseline and both managed-byte `verify` commands report no drift. Every changed path must be accounted for in the after inventory, the rollback must be named (and exercised once where recovery is unproven), and the branch must exist on the room's remote. Either the declared integration branch holds the commit, or the spec records why it does not.

## How it works

The [skill](../skills/update-harness/SKILL.md) first picks a route from the room's starting point:

- **v2-root room** (a root `specs/`, no `workbench/`). The one-time [`workbench-upgrade.mjs upgrade`](../../RUNBOOK.md#v3-explicit-upgrade-and-recovery-check) route applies. Its two mode flags, `--layout-only` (the name for an already-adopted room) and `--explicit-update`, do the same work since S-00V: both lay the core skills lane and its `.agents/skills` and `.claude/skills` adapters down inside the room. Both write `workbench/sessions/recovery/upgrade-recovery.json` with `skills: "lane-install"`, the pre-migration SHA and inventory, and both receipts. The provider home is never read.
- **v3 support-root room.** The one-time route refuses these rooms with `support-root-exists`. The skill runs an ordered maintenance procedure from the release checkout instead:
  1. Take a before hash inventory and run `workbench-tools.mjs verify` and `workbench-skills.mjs verify`.
  2. Run `workbench-layout.mjs migrate --version [TARGET_VERSION]`.
  3. Stamp the manifest `workbenchVersion` and set `skillPolicy` to the release's policy, then validate. `provenance.source` stays historical, per S-00N UP-021.
  4. Run `seed-documents` and reconcile the intended control sections.
  5. Run the tools and skills `update --explicit-update`, or `install` for a room stamped before the skills lane existed.
  6. Run both `verify` commands again.
  7. Take an after inventory and name the rollback.

The target version is always the source manifest's `workbenchVersion`. The skill carries no release literal.

Two drift checks stay separate. The room's own `doctor` and validation belong to the target. Running `node workbench/tools/self-drift.mjs --phase pre|post --json` together with a manual semantic check applies only when the canonical Workbench itself changes ([S-00K](../specs/S-00K-workbench-self-drift-check/SPEC.md), [ADR-0055](../docs/adr/0055-workbench-update-requires-self-drift-check.md)). A passing target doctor is never presented as self-drift.

### Example, from the verification run

In the S-01N scenario, a scratch "Lantern" room had been created with v3.2.0 tooling. It held a compact room-authored `AGENTS.md`, a small library and its test, one completed spec, a room-added `lantern-release` skill, and a hand-edited managed `wiki.mjs`. A fresh agent was given only this skill and a clean clone of the candidate release (v3.2.1), and chose the v3 route.

- **Baseline.** The baseline was red: doctor blocked on `tools-receipt-drift` for the hand-edited tool. The agent asked the scripted owner, who said to restore the managed version and keep a backup.
- **Before the update.** It hashed 52 tracked files. Both `verify` commands failed before the update: six new tools were unaccounted for, and no skills lane was declared.
- **The update.** It migrated, stamped the version and skill policy, seeded documents, updated 16 tools (the hand edit went to the recorded backup) and installed 22 core skills and both adapters.
- **Verification.** Both `verify` commands then reported `valid`, and every managed file compared byte-equal with the release. The after inventory had 87 files: 35 added, 15 changed, none removed. The room's `AGENTS.md`, `src/`, `test/`, the S-001 spec, all Wiki files and `lantern-release` were byte-identical.
- **Rollback.** It exercised a tools rollback once. That showed that a tools-only rollback leaves the six new tools behind and cannot restore the room, so the agent named the before commit as the whole-room recovery point. It then reapplied the update and verified again.
- **Publication.** It committed to `claude/update-harness-v3.2.1` and pushed to the room's local remote. It left `main` and `integration` untouched, as the owner had asked.
- **Drift checks.** It did not treat the room's doctor as the source Workbench's self-drift check.

## Composition

[Adoption](../skills/adoption/SKILL.md) is the one-time entry for a project with no Workbench at all. An already-adopted room never reruns it, and the adoption skill points such rooms here. The release producer's [Template Upgrade Release Gate](../../RUNBOOK.md#template-upgrade-release-gate) uses this skill as the required real-room test of each version, applied to Workbench_Template. That gate's proof belongs to the release Spec (S-00O), not to this skill. The [control fidelity report](../../RUNBOOK.md#control-fidelity-report) backs the skill's section 5 diff review. The managed lanes are described in the Runbook's [managed runtime tools](../../RUNBOOK.md#managed-runtime-tools-check) and [skills lane](../../RUNBOOK.md#skills-lane-check) checks.

## Upstream relationship

None is claimed. `update-harness` is Workbench-native: `THIRD_PARTY_NOTICES.md` names only `mattpocock/skills`, and that catalog has no update-harness counterpart at the pinned commit `c55ee46073ed923f86ce59a5eb3b6d895095d1b7`. The skill entered the curated set in PR #27 (`6943c10`, 2026-07-16). The source audited here is git blob `84a6ae7c92734f514f9f86abcb7664e7c8638611` at `d16ef63`, and S-01N changed it to blob `e33cb1c49ece1ac2a3c2a78aa6c669faa108e2c1`.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-skill-catalog.mjs` holds the route wording. That covers the lane-install recovery record, no presence-only or provider-home claims, both `verify` commands, the manifest stamp with skill-policy reconciliation and validation, the historical `provenance.source`, `seed-documents`, no release literal and no stable-spec wording. `tools/test-governance-core.mjs` and `tools/test-control-fidelity.mjs` keep the feedback harvest, the two completion boxes and the fidelity report. The tool behavior the skill relies on is covered by `tools/test-workbench-upgrade.mjs`, `tools/test-workbench-tools.mjs`, `tools/test-skills-lane.mjs` and `tools/test-workbench-layout.mjs`. One fresh-context agent followed the v3 route in the scenario above. The run is recorded in the [Spec evidence](../specs/S-01N-update-harness-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run, with one model, a scripted owner and a synthetic room, and the manifest stamp was a hand edit. It is not owner Human QA, not a repeated trial and not the Workbench_Template release gate. The v2-root one-time route was not exercised in that run; the tool's own tests cover it. The run also surfaced tool behavior this skill cannot fix:

- No command stamps `workbenchVersion` or `skillPolicy` for a current-schema room.
- A tools rollback leaves tools added by the newer release in place, and it drops the earlier backup entry from the receipt.
- A first skills `install` has no skills-level rollback, only the whole-room commit.
- A `stale-seed` finding for a document the newer release no longer seeds has no repair command.
- Before the update, `workbench-tools.mjs verify` stops at `tools-receipt-missing` and does not report a hand edit, which only the room's doctor showed.

Installed personal copies of the skill are not changed by this Spec.

## Remaining intended behavior

- S-00P rewords the Runbook's Template Upgrade Release Gate and self-drift sections, and the closure and publish words in sections 5 and 6 of this skill ("Close it only when…", the two `done` boxes) should follow the rewritten closure contract once S-00P lands. At this candidate they still describe the current accepted shape.
- A runtime stamp command for current-schema rooms, a complete tools rollback, and a first-install skills rollback would replace hand steps; they belong to the owning tools, not to this skill.
- S-00O TK-003 exercises this skill against Workbench_Template for the next release.

## Sources

- [Update-harness source](../skills/update-harness/SKILL.md)
- [Individual delivery Spec](../specs/S-01N-update-harness-skill-rebuild/SPEC.md)
- [Runbook: V3 explicit upgrade and recovery](../../RUNBOOK.md#v3-explicit-upgrade-and-recovery-check), [Template Upgrade Release Gate](../../RUNBOOK.md#template-upgrade-release-gate) and [Workbench self-drift check](../../RUNBOOK.md#workbench-self-drift-check)
- [AGENTS: Workbench update drift boundary](../../AGENTS.md#workbench-update-drift-boundary)
- [Self-drift Spec S-00K](../specs/S-00K-workbench-self-drift-check/SPEC.md) and [ADR-0055](../docs/adr/0055-workbench-update-requires-self-drift-check.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01N TK-01E after red/green changes to the skill's route, verify, stamp and wording, with one fresh-context scenario.
