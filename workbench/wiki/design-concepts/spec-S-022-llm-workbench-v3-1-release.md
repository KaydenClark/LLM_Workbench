---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed Wiki-first navigation for historical S-022, 2026-09-29
source_paths:
  - workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
  - workbench/specs/S-052-private-session-transport/SPEC.md
  - workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md
  - workbench/docs/adr/archive/0033-workbench-contract-is-a-claim-set.md
parent: none
authorized_by: owner
last_verified: 2026-10-04
---

# The Historical v3.1 Release Packet (S-022)

S-022 gathered the proposed v3.1 release proof in one packet: portable
Workbench source, a cross-provider clean-clone resume after a pushed planning
checkpoint, a portability and privacy matrix, and an independent exact-SHA
audit before owner promotion. Its surrounding capabilities included the
manifest and managed runtime, governance and diagnostics, Wiki knowledge,
and workflow composition.

The packet preserves useful proof for the cross-provider round trip and
portability checks. Its final audit, version stamp and S-014 handoff were not
completed. **S-022 is a superseded Spec, not a completed release.** It was
retired on 2026-10-04: v3.1.0 was never released, the owner promoted v3.2.0
to `main` instead, and current work is v4, so its unrun audit and stamp step
was withdrawn rather than finished. Its own Why Retired section gives the
reason. Current release work is the Workbench v4.0.0 Release (S-00O); the
v3.2.0 release record (S-050) is superseded history too; the live cross-device
proof stays with Private Session Transport (S-052), run inside the owner's own
PC test at v4 main readiness.

The original packet described a seven-file root and the then-current
Workbench Contract. Those statements are dated design history. The accepted
successor decisions are ADR-000B for the eight-file root destination and
ADR-000C for the three Contract carriers plus the bounded assigned Spec.
The archived ADR-0033 remains a source for the historical claim-set model.
This article is a navigation and explanation layer; the Spec, ADRs and
verified runtime own their respective requirements, decisions and actuality.

## Evidence and Sources

- [Historical S-022 packet](../../specs/S-022-llm-workbench-v3-1-release/SPEC.md)
- [Current release owner: Workbench v4.0.0 Release (S-00O)](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md)
- [Superseded v3.2.0 release record (S-050)](../../specs/S-050-workbench-v3-2-0-release/SPEC.md)
- [Cross-device proof: Private Session Transport (S-052)](../../specs/S-052-private-session-transport/SPEC.md)
- [Accepted root destination ADR-000B](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md)
- [Accepted Contract decision ADR-000C](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md)
- [Archived historical Contract ADR-0033](../../docs/adr/archive/0033-workbench-contract-is-a-claim-set.md)

## History

- 2026-09-29: Created on the owner's explicit ACC-5 direction to route agents through Wiki feature articles before archival sources. The current S-022 Spec was read and its blocked historical disposition preserved.
- 2026-10-04: S-022 superseded with S-014, S-050 and S-054; routes now point at S-00O for release work and S-052 for the cross-device proof.
