---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed Wiki-first navigation for the historical LLM Workbench Release Spec (S-022) for v3.1, 2026-09-29
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-022-llm-workbench-v3-1-release/SPEC.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
  - workbench/specs/S-052-private-session-transport/SPEC.md
  - workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md
  - workbench/docs/adr/archive/0033-workbench-contract-is-a-claim-set.md
last_verified: 2026-10-04
---

# Historical v3.1 Release Proof Packet

The packet gathered the proposed v3.1 release proof in one place: portable
Workbench source, a cross-provider clean-clone resume after a pushed planning
checkpoint, a portability and privacy matrix, and an independent exact-SHA
audit before owner promotion. The LLM Workbench Release Spec (S-022) for v3.1
assembled it. **The LLM Workbench Release Spec (S-022) is a superseded Spec, not
a completed release.** It was retired on 2026-10-04: v3.1.0 was never released,
the owner promoted v3.2.0 to `main` instead, and current work is v4, so its
unrun audit and stamp step was withdrawn rather than finished. Its own Why
Retired section gives the reason. This article records what the packet
preserved and where release state lives now; it does not describe a delivered
release.

## What It Does

- **Gathers the proof in one packet.** Its surrounding capabilities included
  the manifest and managed runtime, governance and diagnostics, Wiki knowledge,
  and workflow composition.
- **Preserves useful proof.** The packet preserves useful proof for the
  cross-provider round trip and the portability checks.
- **Routes to current owners.** Current release work is the
  Workbench v4.0.0 Release Spec (S-00O); the Workbench Release Spec (S-050) for v3.2.0 is
  superseded history too. The live cross-device proof stays with the Private
  Session Transport Spec (S-052), run inside the owner's own PC test at v4 main
  readiness. A reader uses those owners for release state instead of treating
  the old packet as an active queue.

## Why It Matters

The packet's proof is still useful for the cross-provider round trip and the
portability checks, and a cold reader needs to know it is superseded history so
it is not mistaken for an active release queue.

## Limits

- Its final audit, version stamp and handoff to the Workbench Release Candidate Spec (S-014) were not completed.
- The original packet described a seven-file root and the then-current
  Workbench Contract. Those statements are dated design history. The accepted
  successor decisions are the eight-file root decision (ADR-000B) for the
  eight-file root destination and the three-carrier Contract decision (ADR-000C)
  for the three Contract carriers plus the bounded assigned Spec. The archived
  Contract claim-set decision (ADR-0033) remains a source for the historical
  claim-set model.
- This article is a navigation and explanation layer; the Spec, the ADRs and
  the verified runtime own their respective requirements, decisions and
  actuality.

## Evidence and Sources

- [Historical LLM Workbench Release Spec (S-022) for v3.1](../../specs/S-022-llm-workbench-v3-1-release/SPEC.md). The superseded historical packet; its eventual retired route is named in this article's `source_paths`.
- Immutable source: `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md` (the commit used for the sibling per-Spec articles; read the Spec for its superseded disposition).
- [Current release owner, the Workbench v4.0.0 Release Spec (S-00O)](../../specs/S-00O-workbench-v4-0-0-release/SPEC.md)
- [Superseded v3.2.0 release record, the Workbench Release Spec (S-050)](../../specs/S-050-workbench-v3-2-0-release/SPEC.md)
- [Cross-device proof, the Private Session Transport Spec (S-052)](../../specs/S-052-private-session-transport/SPEC.md)
- [Accepted root destination, The Workbench root surface is eight files and Contract membership is separate from root placement (ADR-000B)](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md)
- [Accepted Contract decision, The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec (ADR-000C)](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md)
- [Archived historical Contract decision, The Workbench Contract is a claim set carried by the seven controls and the assigned spec (ADR-0033)](../../docs/adr/archive/0033-workbench-contract-is-a-claim-set.md)

## History

- 2026-09-29: Created on the owner's explicit direction in the Wiki-first navigation grilling question (ACC-5) to route agents through Wiki feature articles before archival sources. The current LLM Workbench Release Spec (S-022) for v3.1 was read and its blocked historical disposition preserved.
- 2026-10-04: The LLM Workbench Release Spec (S-022) was superseded together with the Workbench Release Candidate Spec (S-014), the Workbench Release Spec (S-050) and the v3.2.1 Review-Boundary Integrity docket (S-054); routes now point at the Workbench v4.0.0 Release Spec (S-00O) for release work and the Private Session Transport Spec (S-052) for the cross-device proof.
- 2026-10-04: Moved from `design-concepts/spec-S-022-llm-workbench-v3-1-release.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move And Retype The Remaining Per-Spec Articles). Every live link to it was rewritten by the move; no claim was changed. The Spec is superseded, not delivered, so the article keeps its historical disposition under a feature heading as the migration requires. This move checked that the named current source paths (the first entry names the Spec's eventual retired route, which does not exist yet) and the immutable commit exist, not the behavior of the capability itself.
