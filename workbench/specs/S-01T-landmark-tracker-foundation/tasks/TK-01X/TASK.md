# TK-01X - Capture an ungrouped DQC, keep it through a later landmark, and rebuild its view

**Task ID:** TK-01X
**Spec ID:** S-01T
**Slice:** Capture an ungrouped DQC, keep it through a later landmark, and rebuild its view
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: An unanswered, ungrouped DQC is valid and visible without a Spec, Task, landmark or predetermined Wiki destination; confirmation and Expected result can be added without destroying origin history; a later landmark connection and retitling preserve DQC and source identities; the generated Tracker is rebuilt from records
**Planned verification:** Red: in a disposable room, a manifest declaring the Tracker root fails path resolution and layout validation, and the public capture, revise, link and rebuild seams are absent. Green: the declared root resolves and validates while an undeclared seven-lane room is unchanged; an unanswered ungrouped DQC persists, survives a fresh-process reload and a clone, is retitled and confirmed with Expected result without losing origin, source lineage or correction history, later links to a landmark, and `TRACKER.json` rebuilds deterministically with an explicit no-landmark display and the exact two-item 30/20/50 distribution; every invalid write leaves prior source and projection bytes unchanged. Targeted tests, then the full AGENTS suite; a one-command demo in under a minute.

## Outcome

The first useful delivery path the owner confirmed: capture one ungrouped DQC
with source lineage, preserve it, connect it to a landmark when one emerges,
and generate an evidence-backed view. One vertical behavior across manifest
discovery, record persistence, identity, calculation and projection; not
separate schema, runtime and view Tasks.

## Compatibility Pins (settled at planning, 2026-09-26)

- **Features collection.** [S-00I TK-01U](../../../S-00I-folder-lifecycle-for-records/tasks/TK-01U/TASK.md)
  is the single writer of the Wiki `features` collection, its schema and type,
  and its manifest and path consumers. This Task declares only the Tracker
  root and its two record collections and never writes `features`. Both touch
  `workbench/manifest.json`, `workbench-paths.mjs` and `workbench-layout.mjs`
  under different keys; whichever lands second rebases onto the first.
- **Identity.** DQCs and landmarks are WBIDs allocated through the existing
  `allocateVisibleId` seam in `workbench/tools/visible-ids.mjs`, unique within
  their type prefix and the Workbench. The two type prefixes are an
  implementation choice; they must not collide with an existing prefix
  (`S`, `TK` and any other allocated prefix). Change `visible-ids.mjs` only for
  a gap a failing test proves. Retitling never reallocates an identity.
- **Root controls.** `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`, `BLUEPRINT.md`
  and `templates/` root controls belong to S-00P. The Tracker procedure lives in
  `workbench/landmark-tracker/README.md`; needed Runbook wording goes to this
  Spec's Remaining Gaps for S-00P. Generic non-control mirrors that an existing
  layout or fidelity test requires stay in scope.

## Required Behavior

1. **Discovery.** A manifest-declared Tracker root at
   `workbench/landmark-tracker/` with flat `destination-questions/` and
   `landmarks/` JSON collections resolves through `workbench-paths.mjs` and
   validates in `workbench-layout.mjs`. The resolver rejects undeclared keys
   and the layout validator compares exact collection sets today; both seams
   must agree. No eighth support lane; a room without the declaration keeps
   validating exactly as before; readable legacy layout shapes still load.
2. **Capture.** Persist an unanswered, meaningful DQC with an empty landmark
   relation, retained source identities and revisions, uncertainty and
   correction lineage. Neither a final answer nor a Wiki destination is
   required. Expected result (intended durable change and home when known) is
   distinct from Result (achieved delivery).
3. **Evolve.** Retitle, confirm, add Expected result and later connect zero,
   one or several landmarks without changing origin, type or identity or
   deleting useful history. A landmark is its own record and may exist before
   or after any Spec.
4. **Safe writes.** Validate before writing. Stale revisions, identity
   collisions, unsafe or symlinked paths and invalid shapes are refused by name
   and leave prior source and projection bytes unchanged. State the actual
   concurrency guarantee in the README: a revision comparison is not a lock
   and does not prove isolation between concurrent writers.
5. **Projection.** Rebuild generated `workbench/landmark-tracker/TRACKER.json`
   from records only: meaningful titles, an explicit no-landmark display,
   inspectable origins and assessments, and per-step distributions over the
   exact ordered vocabulary Idea, Aligning, Confirmed, Mapped, Planned,
   Journey, Review, Verified, using
   `percentage = sum(contributions to step) / distinct item count * 100`.
   The two-item example (one DQC at 0.6 Journey / 0.4 Review plus one Verified
   item) gives 30% Journey, 20% Review, 50% Verified. Empty input shows no
   items, never completion or a zero-denominator result. The renderer invents
   no progress: an unanswered card with no assessment is shown as unassessed,
   not inferred as Idea; `done` never maps to Verified. Generated output never
   authors source.

Full source-type/scope coverage, arithmetic cycles and claim revisions are the
Distributions Task; Wiki evidence and lifecycle recovery are later Tasks.

## Smallest Concrete Path Set

New: `workbench/tools/landmark-tracker.mjs`, `tools/test-landmark-tracker.mjs`,
`workbench/landmark-tracker/README.md`,
`workbench/landmark-tracker/destination-questions/.gitkeep`,
`workbench/landmark-tracker/landmarks/.gitkeep`, generated
`workbench/landmark-tracker/TRACKER.json` (empty rebuild; no real owner
concepts invented as records).

Shared enabling: `workbench/manifest.json`, `workbench/tools/workbench-paths.mjs`,
`workbench/tools/workbench-layout.mjs`, `tools/test-workbench-layout.mjs`.
Runtime propagation extends the closed `RUNTIME_TOOLS` inventory in
`workbench-layout.mjs` and its installer tests (`tools/workbench-tools.mjs`,
`tools/test-workbench-tools.mjs`) using the actual distribution inventory.
Add `node tools/test-landmark-tracker.mjs` to the suite only through the
existing owner of that list; if that owner is a root control, record the
needed line as a Remaining Gap and prove the test runs in the Task proof.

## Expected Red And Green

Red first at the public seams in a disposable room: the declared root is
refused by resolver and validator; capture, revise, link and rebuild are
absent; then persistence, identity, revision, association and distribution
assertions fail at the stable boundary. Green: a fresh reader after restart
and a clone rebuild the same view without ignored notes; invalid mutations
write nothing; the full path runs end to end.

## Demo

One command runs a disposable-room scenario that captures and reloads an
ungrouped card, evolves it, adds a landmark and prints the rebuilt lineage and
distributions in under one minute. Record the exact command in the proof.

## Done Criteria And Closing Proof

Red and green SHAs, targeted test tallies, full AGENTS suite on the committed
candidate with its header, doctor, the demo command and output summary, the
README procedure, and Remaining Gaps (Runbook wording for S-00P, suite-list
line if not directly editable, anything deferred). Close with
`node workbench/tools/spec-workbench.mjs close S-01T ...` after commit and push.

## Remaining Gaps

- Distributions, Documentation and Recovery Tasks remain.
- A doctor-level Tracker drift check is not in this slice unless trivial.
