# TK-003Q - Share source-qualified To-do eligibility across preview and dispatch

**Task ID:** TK-003Q
**Spec ID:** S-01X
**Slice:** Share source-qualified To-do eligibility across preview and dispatch
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01X shared lane calculation and dependency filtering, bounded stage 2A only.
**Planned verification:** Red public next chooses in-progress ahead of eligible To-do; selection and preview ordering disagree; doctor misses non-head To-do unmet dependencies. Green source-qualified shared lane calculation across preview/next/claim/doctor, priority/title/WBID order, visible unoffered dependencies, capability and remote-claim gates, scoped selectors, collision/no-write controls. Focused public fixtures/demo, full48 AGENTS plus3 RUNBOOK immutable checks, append-only and drift pre/post; independent exact-head review before integration.

## Assigned Boundary

Stage 2A follows reviewed PR228 integration 2780fe66754abf69b2ab6dea23337a7be0f6d801. The assigned writer owns workbench/tools/taskboard.mjs, selection/claim/dependency-diagnostic sections of workbench/tools/spec-workbench.mjs, tools/test-taskboard-json.mjs and corresponding tools/test-spec-workbench.mjs fixtures. Extract pure source-qualified lane/eligibility entries, offer only eligible To-do Tasks from ordinary next, preserve dependency visibility and priority/title/WBID order, and reuse eligibility in claim and doctor. Preserve capability routing, remote-claim exclusions, numeric Task scope and existing explicit selectors. Flat JSON collision refusal remains fail-closed with no output write. No second canonical source.

Source needs-review vocabulary, review mode, minimal Backlog validation, root/template Markdown switch, identity migration and whole-Spec delivery remain subsequent slices. No S01W QA takeover; RUNBOOK and its partially owned Visible Identifiers section are excluded. Reconcile broader shared-reader scope before expansion. No owner approval or completed Spec claim.
