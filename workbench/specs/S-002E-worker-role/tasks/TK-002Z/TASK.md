# TK-002Z - Stage the bounded Worker entry and recoverable hand-back

**Task ID:** TK-002Z
**Spec ID:** S-002E
**Slice:** Stage the Worker operating entry, explanation and scenario proof
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Load the assigned Task, its owning Spec and branch, acceptance, write scope and required stance before acting; a Worker has no authority over neighboring Tasks merely because their files are visible.
**Planned verification:** Focused source contract red/green; actual configured-agent vertical slice and conflict refusal; full AGENTS and RUNBOOK suite; self-drift pre/post.

## Assignment

One attempt on `codex/s002e-worker-candidate`, based on integration `95176a4`.
Single durable writer: codex-s002e-worker for this Spec and its Task records.
Write scope: this Spec and Tasks, Spec-local `candidate/worker/SKILL.md`,
`tools/test-worker-role.mjs`, `workbench/wiki/skill-worker-role.md`.
Generated projections are refreshed by native tooling; no manual shared index edits.
No managed discovery, manifest, layout, root controls, frozen v3.2.1 or Factory edits.
Stop at immutable candidate ready for separate independent review; no self-approval.

## Scoped acceptance

- Stage a portable Worker entry composing assigned stance and one Task/attempt.
- Explain its inputs, refusal boundary and recoverable Dispatcher hand-back in Wiki.
- Exercise an actual configured agent on an assigned branch with red/green proof,
  conflicting-writer and out-of-scope refusals, exact output/tests/docs/gaps.
- Record verification and all installation/publication limits truthfully.
