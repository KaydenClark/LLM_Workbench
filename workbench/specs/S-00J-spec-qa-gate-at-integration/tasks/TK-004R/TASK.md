# TK-004R - P1: Bounded rollback deletes foreign modifications to the first published corrective TASK.md after second publication failure, then removes its FAIL anchor. Snapshot each owned published file and refuse deletion after mutation or replacement while preserving foreign bytes and the durable anchor.

**Task ID:** TK-004R
**Spec ID:** S-00J
**Slice:** P1: Bounded rollback deletes foreign modifications to the first published corrective TASK.md after second publication failure, then removes its FAIL anchor. Snapshot each owned published file and refuse deletion after mutation or replacement while preserving foreign bytes and the durable anchor.
**Status:** ready
**Blockers:** none
**Destination:** spec-acceptance: S-00J Acceptance Criteria
**Planned verification:** Corrective for independent FAIL at 2e9b8c7caa30032fc17e0ae44881822914116b63: modified or replaced first Task and nested foreign file interference before second write failure preserve foreign bytes and exact durable anchor, with explicit incomplete rollback. Ordinary ten recovery cases stay green. Central Q remains held and allocator with Q reservation selected R.
