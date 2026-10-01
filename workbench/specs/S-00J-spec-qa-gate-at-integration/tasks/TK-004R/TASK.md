# TK-004R - P1: Bounded rollback deletes foreign modifications to the first published corrective TASK.md after second publication failure, then removes its FAIL anchor. Snapshot each owned published file and refuse deletion after mutation or replacement while preserving foreign bytes and the durable anchor.

**Task ID:** TK-004R
**Spec ID:** S-00J
**Slice:** P1: Bounded rollback deletes foreign modifications to the first published corrective TASK.md after second publication failure, then removes its FAIL anchor. Snapshot each owned published file and refuse deletion after mutation or replacement while preserving foreign bytes and the durable anchor.
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00J Acceptance Criteria
**Planned verification:** Corrective for independent FAIL at 2e9b8c7caa30032fc17e0ae44881822914116b63: modified or replaced first Task and nested foreign file interference before second write failure preserve foreign bytes and exact durable anchor, with explicit incomplete rollback. Ordinary ten recovery cases stay green. Central Q remains held and allocator with Q reservation selected R.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00j-corrective-batch-recovery | f767cb746ef6fc6c26f0f1b8e4446d8d6489827e | ahead 54 behind 0 | 1 | Committed source f767cb746ef6fc6c26f0f1b8e4446d8d6489827e full51/51 and13publicfaultgroups PASS; redf86e3659/green69b1e5bb preserve foreign modified/replaced Tasks and durable anchors. Independent successor review pending. | Owned recovery contract, regression and exact source verification receipts; prior O FAIL/history preserved. | Independent immutable successor review and integration containment pending; asynchronous process death outside synchronous guarantee; ownerQA/main unapproved. | 784dc897d302feb0eb786a2dd28f3160012c5fcf970dec18d4814bbca3f2649e |
