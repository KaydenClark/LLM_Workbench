---
name: to-docs
description: Route settled conversation truth into existing Workbench documentation owners without restarting discovery or creating another store.
disable-model-invocation: true
---

# To Docs

Persist an already-settled conversation. Do not start a new interview. First
state the proposed destinations, then update only owners whose durable truth
changed:

- accepted shared definitions -> `LEXICON.md`;
- product direction, cross-cutting architecture, invariants, and non-goals ->
  `BLUEPRINT.md`;
- capability requirements, decisions, acceptance, proof, or completion -> the
  assigned `SPEC.md`;
- active assignment, blocker, event, or next gate -> update the owning spec,
  then run `node tools/spec-workbench.mjs render` for `TASKBOARD.md`;
- install, run, verify, recovery, or operations -> `RUNBOOK.md`;
- human-facing orientation and setup -> `README.md`;
- agent authority, scope, safety, or required behavior -> `AGENTS.md`;
- stable personal, project, or machine memory -> the canonical Wiki owner when
  its schema permits it, never a copied live queue.

If capability truth needs a new spec and none is assigned, route to `/to-spec`.
Do not create an ad hoc document or another truth store. Preserve append-only
evidence and completed spec history.

Run the owning documentation checks. For a spec-backed change, finish with
`node tools/spec-workbench.mjs render` and
`node tools/spec-workbench.mjs doctor`. If no owner changed, report exactly
`Docs checked; no update needed` with the reason.

