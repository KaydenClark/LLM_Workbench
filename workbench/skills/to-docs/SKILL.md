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
- what the product is, who it serves, its promised outcomes and its
  non-goals (the Blueprint's four parts) -> `BLUEPRINT.md`;
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
- a consequential destination choice, what the finished product must be or do
  and why (it would still hold if the architecture were rebuilt) -> a
  Destination Decision Record written into the `ddr` collection's `proposed/`
  folder with `node workbench/tools/adr.mjs new --kind ddr --title "..."`. Its
  `canonicalized_in` names the owners that carry it, `BLUEPRINT.md` when it
  changes or contradicts the Blueprint, and never the Wiki. One decision that
  needs both records gets both, linked rather than merged.

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

## Citation anchors

The room's `AGENTS.md`
[Documentation Ownership And Proof](../../../AGENTS.md#documentation-ownership-and-proof)
keeps the rule that a citation into a file that changes must say which tree it
reads at; this is how to anchor one.

Every merge into the integration branch moves line numbers, so a bare
`path:line` written against a branch tip points at unrelated content once that
branch lands. Either anchor the citation itself with `git show <sha>:path`,
which is absolute and never needs re-anchoring, or declare the spec's anchors
once near the top:

> **Citation anchors.** pre=`<sha>` post=`<sha>`.

A label immediately before a citation names its tree and wins: "shipped `:M`"
reads at `post`, "base `:N`" at the sha of the `git show` anchor that introduced
the path. Unlabelled, a citation reads at `pre` in Outcome, Why It Matters,
Current Verified State, Desired Behavior and Documentation Impact - all written
before the change - and at `post` in every other live section. The shorthand
`` `:N` `` reads against the nearest path already in scope; a shorthand without
a scoped path is invalid. Evidence rows read at the commit each row names and
are never re-anchored, because they are append-only.
