# TK-007V - Ship pr in required Core with discovery and compatibility

**Task ID:** TK-007V
**Spec ID:** S-002U
**Slice:** Ship pr in required Core with discovery and compatibility
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-007U
**Destination:** spec-acceptance: Both adapters discover the required skill in a fresh clone; manifest, bundle, catalog and counts agree.
**Planned verification:** Red catalog and layout checks requiring pr in Core and the prior-cohort transition, then green; fresh-clone discovery through `.agents/skills` and `.claude/skills`; valid prior28 and legacy21 v3.2.1 cohorts accepted, malformed subset and unsupported version refused; full RUNBOOK suite and doctor on the committed candidate.
**Claimed by:** claude-s002u-worker-v

## Scope

Add `pr` to the manifest's required skill policy, the runtime Core list, the skills catalog and every count/operation owner that states the bundle, following the package precedent for required skill adoption. Preserve readable installed-room transitions for the cohorts that exist on this base (current, prior28 and legacy21 at v3.2.1) and refuse malformed subsets and unsupported versions. Add an operations-index route for writing a PR body that leaves Git operations with implement and the Runbook.

## Out of scope

The writing-for-agents and retro package Tasks (S-002P TK-006Y, S-002V TK-006Z) and their receipts; release stamping; personal installs.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002u-tk007v | 7f824e10c76010e24e1556c8c31fd49596b55ff1 | ahead 0 behind 0 | 0 | Implementation candidate 5e965265a832d931457526601ee0acc3d1719d98 (clean, pushed). RED at 329df8c0 plus test edits: test-skill-catalog exit 1 (pr must ship in the required Core bundle); layout tests: generated room requires pr failed (the runtime Core list carries pr), prior28 failed (accepted only at its known stamped version: before the declaration the 28 list was current, so v9.9.9 accepted it); legacy21 six-lane and legacy-version tests passed before. GREEN at 5e965265a832d931457526601ee0acc3d1719d98: test-skill-catalog exit 0; the 4 layout tests 4/4. Fresh clone of origin claude/s002u-tk007v at 5e965265a832d931457526601ee0acc3d1719d98: .agents/skills/pr/SKILL.md and .claude/skills/pr/SKILL.md resolve to workbench/skills/pr/SKILL.md, sha256 ab63f1cf78647389edcd386c9427c5dfca27ed2836930c24773ffee834c19bcd equal to the pinned upstream bytes; manifest requires pr. Full Runbook suite 53 pass, 0 fail at 5e965265a832d931457526601ee0acc3d1719d98, dirty 0 before and after. doctor ok (attention only); wiki.mjs validate ok. | workbench/skills/README.md (29-skill count, twenty-one workflow, pr catalog row); README.md; LEXICON.md Core skill bundle; templates/GENESIS.md; workbench/skills/workbench-room-checks/SKILL.md; workbench/wiki/skill-genesis.md; workbench/wiki/skills-draft/main-workflow/implement-spec.md made count-free; RUNBOOK.md and templates/RUNBOOK.md Write a PR body index rows | current30 cohort (writing-for-agents and retro, S-002P/S-002V) unlanded, so its transition is the package merge's to add; combined-package proof, assembled review and TK-007W scenario remain. | 5cdd17df9fa53294bf37b8b8139c6fc30cbf5c39265e40a85ea3d2f69df63ab0 |
