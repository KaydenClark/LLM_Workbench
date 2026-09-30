# TK-003N - Refresh generated readiness after reviewed lifecycle delivery

**Task ID:** TK-003N
**Spec ID:** S-00P
**Slice:** Refresh generated readiness after reviewed lifecycle delivery
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-00P verification procedure requires a current generated projection and clean doctor; this maintenance does not deliver the wider control rewrite.
**Planned verification:** Preserve the render-drift baseline at fad42375; ordinary render changes S-00P TK-002 effective readiness from blocked to ready after contained S-00I delivery. Check render idempotence, doctor, unchanged S-00I bound digest and existing Tasks, append-only evidence, citations, Task gate, self-drift receipts, and the final immutable candidate full 48 AGENTS plus 3 RUNBOOK checks.

## Scope And Limits

Explicitly assigned projection maintenance after PR226 merged at `fad42375a2f9f093913e5782f8a6297a5ce54bdb`. Regenerate through the existing renderer; do not edit readiness by hand. Only this Task, minimal owning Spec evidence and generated TASKBOARD may change. CATALOG must remain unchanged. TK-002 through TK-005, their blockers, controls and templates remain with their existing lanes. S-01W TK-002R is claimed on `claude/s01w-assembled-qa`; no identity or QA branch content is imported. Preserve S-00I review history, bound digest and absent owner approval. Independent exact-candidate review and integration gates remain pending.
