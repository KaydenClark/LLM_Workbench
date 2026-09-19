# TK-002 - Ratchet the registry so every diagnostic carries remediation text

**Task ID:** TK-002
**Spec ID:** S-00N
**Slice:** Ratchet the registry so every diagnostic carries remediation text
**Status:** ready
**Blockers:** none
**Destination:** spec-acceptance: S-00N Acceptance Criteria
**Planned verification:** Red: temporarily empty one registry remediation and observe the test fail; green: the whole real registry passes unchanged

**Stance:** Builder

Replace the two-code spot check with a whole-registry assertion. Record that
the green result is a future-addition ratchet, not a repair of existing entries.
