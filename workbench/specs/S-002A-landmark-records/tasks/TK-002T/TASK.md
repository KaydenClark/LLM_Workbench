# TK-002T - Validate every byte of a Landmark Wiki article before accepting it

**Task ID:** TK-002T
**Spec ID:** S-002A
**Slice:** Validate every byte of a Landmark Wiki article before accepting it
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Public Landmark article validation rejects WBIDs anywhere in actual article bytes while preserving readable identifier-free articles and structured provenance ownership.
**Planned verification:** Red: public validation cannot reject a WBID in body, metadata, comments, link targets or URLs. Green: standalone CLI/module validates actual files and returns explicit malformed/identifier findings without mutation; valid readable article passes. Own focused tests and README, then full AGENTS suite on immutable candidate.

## Scope And Ownership

Independent new validator module/test only; no wiki.mjs, test-wiki.mjs, layout/path/manifest or root controls currently owned by H/S-00P. Records dispatcher fully authors packet before claim.

## Reservation

Director authorized serial allocation; this is the first bounded Task only.
The owning dispatcher completes requirements, test packet, documentation and
worker handoff before dispatch. Source baseline is b00a2e3; preserve completed
S-01T TK-01X/TK-01Y evidence and schema contracts.
