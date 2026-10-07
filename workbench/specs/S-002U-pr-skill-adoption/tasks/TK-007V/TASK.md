# TK-007V - Ship pr in required Core with discovery and compatibility

**Task ID:** TK-007V
**Spec ID:** S-002U
**Slice:** Ship pr in required Core with discovery and compatibility
**Status:** ready
**Stance:** Builder
**Blockers:** TK-007U
**Destination:** spec-acceptance: Both adapters discover the required skill in a fresh clone; manifest, bundle, catalog and counts agree.
**Planned verification:** Red catalog and layout checks requiring pr in Core and the prior-cohort transition, then green; fresh-clone discovery through `.agents/skills` and `.claude/skills`; valid prior28 and legacy21 v3.2.1 cohorts accepted, malformed subset and unsupported version refused; full RUNBOOK suite and doctor on the committed candidate.

## Scope

Add `pr` to the manifest's required skill policy, the runtime Core list, the skills catalog and every count/operation owner that states the bundle, following the package precedent for required skill adoption. Preserve readable installed-room transitions for the cohorts that exist on this base (current, prior28 and legacy21 at v3.2.1) and refuse malformed subsets and unsupported versions. Add an operations-index route for writing a PR body that leaves Git operations with implement and the Runbook.

## Out of scope

The writing-for-agents and retro package Tasks (S-002P TK-006Y, S-002V TK-006Z) and their receipts; release stamping; personal installs.
