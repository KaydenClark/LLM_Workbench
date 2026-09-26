# TK-01X - Capture an ungrouped DQC, keep it through a later landmark, and rebuild its view

**Task ID:** TK-01X
**Spec ID:** S-01T
**Slice:** Capture an ungrouped DQC, keep it through a later landmark, and rebuild its view
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: An unanswered, ungrouped DQC is valid and visible without a Spec, Task, landmark or predetermined Wiki destination; confirmation and Expected result can be added without destroying origin history; a later landmark connection and retitling preserve DQC and source identities; the generated Tracker is rebuilt from records
**Planned verification:** Red: in a disposable room, a manifest declaring the Tracker root fails path resolution and layout validation, and the public capture, revise, link and rebuild seams are absent. Green: the declared root resolves and validates while an undeclared seven-lane room is unchanged; an unanswered ungrouped DQC persists, survives a fresh-process reload and a clone, is retitled and confirmed with Expected result without losing origin, source lineage or correction history, later links to a landmark, and `TRACKER.json` rebuilds deterministically with an explicit no-landmark display and the exact two-item 30/20/50 distribution; every invalid write leaves prior source and projection bytes unchanged. Targeted tests, then the full AGENTS suite; a one-command demo in under a minute.
**Proof:** Red 0a365b0 (tools/test-landmark-tracker.mjs 1/12 pass: declaredTracker absent, malformed declarations validate, landmark-tracker.mjs missing; layout Tracker test fails missing-collection; tools test fails RUNTIME_TOOLS lacks landmark-tracker.mjs). Green 2592f28, docs d5c0951. node tools/test-landmark-tracker.mjs 13/13; test-workbench-layout 71/71; test-workbench-tools 19/19. Full AGENTS suite TOTAL pass=48 fail=0 at candidate d5c0951ed03a70ccdc0a1a87660aa3be30a6b8c2 dirty [] (also 48/48 at 2592f28). Doctor no blocking finding (seven pre-existing attention findings). Self-drift pre (a2b6e68) and post: same seven pre-existing findings plus detached-head only in the detached base worktree; no new finding; cleanUpdate false. Guardrail 78/100 before and after, same four outcome-evidence recommendations. Demo: node tools/landmark-tracker-demo.mjs, 0.8s, 30/20/50 PASS.

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

## Delivered Shape (implementation choices within the Task's latitude)

- **Discovery.** An additive top-level `landmarkTracker` manifest block
  (`root` plus exactly the `destination-questions` and `landmarks`
  collections, each flat directly under the root; projection fixed at
  `<root>/TRACKER.json`), beside `git`. `collections` and `lanes` are
  untouched, so S-00I TK-01U's `collections.features` key cannot collide and
  an undeclared room validates byte-for-byte as before. Resolver:
  `declaredTracker`, `trackerDeclaration`, `trackerRootPath`,
  `trackerCollectionPath`, `trackerProjectionPath` in `workbench-paths.mjs`
  (undeclared -> `tracker-undeclared`, malformed -> `invalid-tracker`).
  Validator: `validateManifest` reuses the registered `invalid-collection`
  (shape, lane/collection overlap) and `missing-collection` (absent or linked
  directory) codes and reports `tracker` only when declared.
- **Identity.** `DQC-` and `LMK-` prefixes through `allocateVisibleId`
  (default width 3; neither prefix occurs anywhere in the repository);
  `visible-ids.mjs` unchanged.
- **Runtime.** `workbench/tools/landmark-tracker.mjs` (in `RUNTIME_TOOLS`):
  `capture`, `add-landmark`, `revise ID --expect-revision N`,
  `link ID --landmark LMK-... --expect-revision N`, `rebuild [--check]`,
  `show [ID]`, each with `--json` and `--path`. Procedure:
  [README](../../../../landmark-tracker/README.md).
- **Demo.** `node tools/landmark-tracker-demo.mjs` (release-side, like
  `tools/team-coordination-demo.mjs`).

## Remaining Gaps

- Distributions (TK-01Y), Landmark Wiki evidence (TK-01Z) and reference
  recovery (TK-02A) remain. Other source types (grilling questions, Specs,
  ADRs, Tasks) are not yet counted items; only DQCs are.
- No doctor-level Tracker drift finding: `rebuild --check` is the seam
  (refuses `projection-drift`), and this repository's test asserts the shipped
  projection is current. Wiring it into `doctor` needs a registered code.
- New Genesis rooms do not declare the Tracker root by default (`init` and
  `COLLECTIONS` are unchanged); declaring it for new rooms is a Genesis and
  template decision, not made here.
- `--expect-revision` is a stale-read check, not a lock (stated in the README);
  concurrent writers are not isolated.
- Owed to S-00P (root controls, not edited here):
  - AGENTS full-suite line, after `node tools/test-notepads.mjs`:
    `node tools/test-landmark-tracker.mjs`
  - RUNBOOK, section "Landmark Tracker: accepted design and available
    operations": replace "No Tracker runtime is implemented by this
    documentation change." and "These paths are a delivery contract, not
    evidence of installed collections or commands." with this paragraph:
    "The foundation runtime is `workbench/tools/landmark-tracker.mjs`, and its
    record procedure lives in `workbench/landmark-tracker/README.md`. A room
    declares the Tracker with the manifest's additive `landmarkTracker` block
    (the root and its flat `destination-questions` and `landmarks`
    collections); without it every Tracker command refuses with
    `tracker-undeclared`. Capture a DQC with `capture --title ... --question
    ... [--source ID@REV] --reason ...`, add a landmark with `add-landmark`,
    change either with `revise ID --expect-revision N --reason ...`, connect a
    DQC with `link ID --landmark LMK-... --expect-revision N --reason ...`, and
    regenerate `TRACKER.json` with `rebuild`; every write also rebuilds it and
    `rebuild --check` refuses projection drift. `--expect-revision` refuses a
    stale read but is not a lock: keep one writer per record. Never hand-edit
    `TRACKER.json`."
  - AGENTS "When the Landmark Tracker capability is available ..." stays
    accurate while S-01T is incomplete; revisit when S-01T completes.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s01t-tk01x-dqc-foundation | d5c0951ed03a70ccdc0a1a87660aa3be30a6b8c2 | ahead 0 behind 0 | 0 | Red 0a365b0 (tools/test-landmark-tracker.mjs 1/12 pass: declaredTracker absent, malformed declarations validate, landmark-tracker.mjs missing; layout Tracker test fails missing-collection; tools test fails RUNTIME_TOOLS lacks landmark-tracker.mjs). Green 2592f28, docs d5c0951. node tools/test-landmark-tracker.mjs 13/13; test-workbench-layout 71/71; test-workbench-tools 19/19. Full AGENTS suite TOTAL pass=48 fail=0 at candidate d5c0951ed03a70ccdc0a1a87660aa3be30a6b8c2 dirty [] (also 48/48 at 2592f28). Doctor no blocking finding (seven pre-existing attention findings). Self-drift pre (a2b6e68) and post: same seven pre-existing findings plus detached-head only in the detached base worktree; no new finding; cleanUpdate false. Guardrail 78/100 before and after, same four outcome-evidence recommendations. Demo: node tools/landmark-tracker-demo.mjs, 0.8s, 30/20/50 PASS. | workbench/landmark-tracker/README.md (new procedure: capture, revise, link, rebuild, concurrency guarantee); workbench/landmark-tracker/TRACKER.json (generated empty); workbench/landmark-tracker/destination-questions/.gitkeep; workbench/landmark-tracker/landmarks/.gitkeep; workbench/manifest.json (landmarkTracker block); workbench/wiki/design-concepts/landmark-tracker.md (availability sentence, route, history); TK-01X TASK.md (Delivered Shape, Remaining Gaps with S-00P wording); SPEC.md slice table and limitation bullet; TASKBOARD.md rendered. No root control or templates/ change. | TK-01Y distributions, TK-01Z Landmark Wiki evidence, TK-02A reference recovery remain; only DQCs are counted items so far. No doctor-level Tracker drift finding (rebuild --check is the seam). New Genesis rooms do not declare the Tracker by default. Revision check is not a lock. Owed to S-00P: AGENTS suite line node tools/test-landmark-tracker.mjs and the RUNBOOK paragraph, verbatim in TK-01X Remaining Gaps. | a23631badb86de47e2a7d3550f43dfa46f593680841259042da9582ac21681a4 |
