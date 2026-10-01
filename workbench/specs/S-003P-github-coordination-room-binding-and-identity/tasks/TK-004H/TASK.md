# TK-004H - P2: Add a durable RUNBOOK entry route - bounded entry-owner lookup at394 finds no route to the binding procedure.

**Task ID:** TK-004H
**Spec ID:** S-003P
**Slice:** P2: Add a durable RUNBOOK entry route - bounded entry-owner lookup at394 finds no route to the binding procedure.
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 5 (fail verdict at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 on 2026-10-01): P2: Add a durable RUNBOOK entry route - bounded entry-owner lookup at394 finds no route to the binding procedure.
**Proof:** Independent394 missing-route evidence answered by RUNBOOK -> existing adapter procedure -> existing public command read-back; control-fidelity checks PASS. Behavior and generic claim workflow unchanged.

## Assigned Scope

Add one RUNBOOK route to the existing binding procedure. Preserve optional metadata-only behavior and all active claim/owner boundaries. Read back the route and run relevant documentation checks. One writer: codex-github-binding. Full AGENTS verification and native Receipt/close proof are required before the assembled correction candidate lands.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | 41f13b31ef1c8ac268fcc9c0159171af63de80d3 | ahead 0 behind 0 | 1 | Manual missing-route red at394 confirmed by independent review. RUNBOOK ordinary-entry route now resolves existing procedure and public inspector command; control-fidelity check passes. Full final assembled suite remains pending. | RUNBOOK eight-line navigation route; procedure remains the command/limitations owner. Optional metadata-only behavior and ADR000O preserved. | Final assembled full suite, fresh independent exact-candidate review and integration containment remain. No wholeSpec, liveIssue, ownerQA or main claim. | c552e84d841f3b25b0d854f532d8fc47cf718c602407758d6c9550bb3d952775 |
| 2 | codex/github-binding-corrections | baf6b5cf306ec6083c5a9c99e3dc88d40d5b9a32 | ahead 0 behind 0 | 0 | Independent394 missing-route evidence answered by RUNBOOK -> existing adapter procedure -> existing public command read-back; control-fidelity checks PASS. Behavior and generic claim workflow unchanged. | RUNBOOK now routes the optional binding procedure without duplicating its command contract. | Required full assembled candidate suite and independent review before integration. Later artifact identity, Issue and actor-dependent slices uncut; full Spec acceptance and owner gates remain open. | 657569855ae7317ce037b59e0f0d85c31d127817695fbd7922ad666d92771fe3 |
