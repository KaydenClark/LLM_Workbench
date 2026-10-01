# TK-004F - Interrupted record Task close publishes Receipt and done status before Spec evidence and retry either refuses recovery or closes another Task - independent public CLI failure injection at integration3b5b76bf reproduced both single-claim and two-claim cases

**Task ID:** TK-004F
**Spec ID:** S-00I
**Slice:** Interrupted record Task close publishes Receipt and done status before Spec evidence and retry either refuses recovery or closes another Task - independent public CLI failure injection at integration3b5b76bf reproduced both single-claim and two-claim cases
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00I Acceptance Criteria
**Planned verification:** Answers evidence row 41 (fail verdict at 3b5b76bfd62aa98118cb73cc4947e0658f4040c6 on 2026-10-01): Interrupted record Task close publishes Receipt and done status before Spec evidence and retry either refuses recovery or closes another Task - independent public CLI failure injection at integration3b5b76bf reproduced both single-claim and two-claim cases
**Proof:** Exact0d4ad14afaeaf7c552aa2afe453d38f14947abad passed required51/51 and12focused public CLI recovery cases. Durable baseline3b5b76bf reds: single retry noopenTask and two retry wrongtarget/missing original evidence. Process-exit, cleanup retry, prior Receipt preservation and malformed/tampered/conflicting/linked no-write cases green.

## Acceptance

- Receipt, done status and pending evidence publish together for record-backed Spec close.
- Separate public CLI retry recovers the same Task with original proof and no duplicate Receipt/evidence.
- A second in-progress Task stays unchanged during recovery.
- Task publication failure, Spec publication failure, abrupt exit, cleanup failure and inconsistent recovery are exercised.
- Existing history, completed Tasks, global selection/parser and other lifecycle operations stay outside the repair.
- Exact required51 union and parent independent review precede integration.

## Implementation Boundary

`closeTask` and close-local `finishRecordClose` in `workbench/tools/spec-workbench.mjs`,
using existing pure Receipt and Git-fact seams. Public regressions are added near
the top of `tools/test-spec-workbench.mjs`; coordinator-owned verdict fixture
preparation and gate/report code are reserved for serial assembly. Main and
original dirty checkouts are preserved.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00i-close-recovery | 7a51c53a528ff4dba407042a4de860bc66bb2d66 | ahead 0 behind 0 | 5 | Public close recovery12cases green. Baseline3b5b76bf single-claim durable red: retry has no open task to close. Full51 and independent review pending. | S-00I correction semantics and TK-004F acceptance recorded. Templates unchanged: existing runtime contract repair. | Full51, immutable parent review and serialized shared-file assembly remain open. | f2bae7819fccee79c4bb0a047e6f5849cb0d01729806472b9f35a59de06e7f55 |
| 2 | codex/s00i-close-recovery | 0ea331dba3014df03e2a03b6f1f2808f4c14f358 | ahead 1 behind 0 | 1 | Candidate0ea331db public12cases PASS and full51 completed47/51; runtime lifecycle/report passed. Four projection-dependent failures traced to render before Receipt. | S-00I records durable baseline single/two red, public12green and failed aggregate. Refresh generated Taskboard after this Receipt. | New immutable full51, parent independent review and serial S00J assembly remain open. | ac727c212a26a956cf76747c02d684b3b1efb96c643ca5dcc7caebef2082f5d0 |
| 3 | codex/s00i-close-recovery | 0d4ad14afaeaf7c552aa2afe453d38f14947abad | ahead 0 behind 0 | 0 | Exact0d4ad14afaeaf7c552aa2afe453d38f14947abad passed required51/51 and12focused public CLI recovery cases. Durable baseline3b5b76bf reds: single retry noopenTask and two retry wrongtarget/missing original evidence. Process-exit, cleanup retry, prior Receipt preservation and malformed/tampered/conflicting/linked no-write cases green. | S-00I Interrupted Close Correction and TK-004F acceptance/boundary updated. Generic templates unchanged because this repairs existing runtime contract. Native Receipt and Taskboard projection refreshed after close. | Final metadata-only exact51, parent independent exact-head review, serial assembly with S00J binding correction and integration remain open. LaterS003P duplicateF repair is separately coordinated. Owner Human QA unapproved and main promotion absent. | f622f184e9788fdd1f50556e2291557bc293e25b152fa8407f225453652b14bc |
