---
name: to-docs
description: Route settled conversation truth into existing Workbench documentation owners without restarting discovery or creating another store.
---

# To Docs

Persist an already-settled conversation. Do not start a new interview. First
state the proposed destinations, then update only owners whose durable truth
changed:

For a v3 project, first read `workbench/manifest.json`. It declares the support
lanes; do not create a root `specs/`, project-local `skills/` core shadow, or parallel
truth store. Authorized room-local extensions follow the Runbook ownership procedure.

- accepted shared definitions -> `LEXICON.md`;
- desired product destination, integrated design, qualities and non-goals ->
  `BLUEPRINT.md`;
- capability requirements, decisions, acceptance, proof, or completion -> the
  assigned `SPEC.md`;
- active assignment, blocker, event, or next gate -> update the owning spec,
  then run `node workbench/tools/spec-workbench.mjs render` for `TASKBOARD.md`;
- install, run, verify, recovery, or operations -> `RUNBOOK.md`;
- human-facing orientation and setup -> `README.md`;
- agent authority, scope, safety, or required behavior -> `AGENTS.md`;
- durable knowledge, reference explanations, and stable personal, project, or
  machine memory -> the canonical wiki owner (`workbench/wiki/`, per its
  `SCHEMA.md`), routed from `workbench/wiki/MEMORY.md`, never a copied live
  queue, task row or Spec evidence;
- rationale, alternatives, and consequences of a consequential decision -> an
  ADR in the manifest `adr` collection (`workbench/docs/adr/`) whose
  `canonicalized_in` names operational owners. Active accepted decision claims
  are architectural Canon; do not duplicate the rule merely to make it bind.

Route each claim once. Split a mixed finding into its claims and give each
exactly one owner by its job: a procedure step to its operational owner, a
definition to the Lexicon, a requirement or proof to the Spec, an explanation
to the Wiki. When another owner needs the claim, link to the owner that holds
it rather than copy it; a Wiki reference article explains why and links the
procedure instead of restating its steps. Never paste the whole finding into
every owner it touches.

Route only supported claims. Read pending meaning the way `notepad` records
it: a `source_record` whose readback is still listed in `current.unresolved`
is pending, however settled it sounds, and only a `decision` entry records a
confirmed owner answer. Leave pending, tentative or disputed material in its
live note. Cite durable owners and exact commits as evidence, never an ignored
live path such as a note, handoff or recovery file. Update Spec state at
meaningful transitions and append evidence rows; do not copy conversation,
working notes or superseded interim states into permanent Spec history.

If capability truth needs a new spec and none is assigned, route to `/to-spec`.
Do not create an ad hoc document or another truth store. Preserve append-only
evidence and completed spec history.

Read each changed owner back and confirm each claim appears once, where its
job belongs. Run the owning documentation checks (for the Wiki,
`node workbench/tools/wiki.mjs validate`). For a spec-backed change, finish with
`node workbench/tools/spec-workbench.mjs render` and
`node workbench/tools/spec-workbench.mjs doctor`. If no owner changed, report exactly
`Docs checked; no update needed` with the reason.
