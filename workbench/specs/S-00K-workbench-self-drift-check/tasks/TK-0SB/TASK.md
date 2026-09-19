# TK-0SB - Define seed and provenance identity semantics for self-drift findings

**Task ID:** TK-0SB
**Spec ID:** S-00K
**Slice:** Define seed and provenance identity semantics for self-drift findings
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00K Acceptance Criteria
**Planned verification:** Red: same-named or same-byte seeded artifacts with different source generations are treated as current; green: source repository/release/commit/hash identity classifies drift without rewriting historical evidence

**Stance:** Builder

Define the self-drift identity tuple for seeded documents and manifest
provenance. Preserve historical receipts and name unresolved identity limits;
do not repair seeded artifacts in this Task.

## Progress

Implemented in the read-only self-drift seam and covered by focused fixtures at
`e7b0906025909b9edd626e967b15e526e5d02509`. Historical source identity, installed
source and unverified native callability remain distinct. Shared full proof and
independent semantic read-back remain pending; no installed files changed.
