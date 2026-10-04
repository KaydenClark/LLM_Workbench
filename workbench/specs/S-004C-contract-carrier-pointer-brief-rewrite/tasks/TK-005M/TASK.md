# TK-005M - Carry the new shape through Genesis and the update route without losing a room's own controls

**Task ID:** TK-005M
**Spec ID:** S-004C
**Slice:** Carry the new shape through Genesis and the update route without losing a room's own controls
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005K
**Destination:** spec-acceptance: The generic templates and the update route agree, and updating a room preserves its own controls and deliberate divergence.
**Planned verification:** Red: a fixture room whose `AGENTS.md` and `RUNBOOK.md` hold the old long shape plus its own added lines, a recorded deliberate divergence and a room-added skill is updated to the new release, and the fixture fails because the update either overwrites a room-owned line, drops the recorded divergence, treats the room-added skill as bound, or leaves a pointer that does not resolve. Green: the update preserves the room's own lines and recorded divergence, the control-fidelity report labels the old-shape lines it did not carry (dropped or changed) as a generation difference instead of exact fidelity, every index pointer in the updated room resolves to a lane skill the update installed, the room-added skill stays unpointed and teaches only, and a freshly generated room (Genesis from decisions) carries the new shape with `CLAUDE.md` unchanged. `tools/test-workbench-upgrade.mjs`, `tools/test-workbench-adoption.mjs`, `tools/test-workbench-round-trip.mjs`, `tools/test-genesis-from-decisions.mjs`, `tools/test-control-fidelity.mjs`, `tools/test-skills-lane.mjs`, `tools/test-workbench-dogfood.mjs`, the landing check and the full AGENTS suite pass on the committed candidate.

## Outcome

The rewrite reaches the rooms that already exist and the rooms yet to be
generated. A room that updates keeps its own controls: its added lines, its own
Runbook rows and any divergence it deliberately recorded are never silently
replaced, and the room is told, in the existing fidelity report's terms, which
template lines the new shape no longer carries. A newly generated room gets the
new shape directly. The `update-harness` skill and the Runbook's update
procedure describe how a room reconciles an old long control to the new brief and
index, including that a pointed skill must exist in its lane before a pointer to
it can bind.

## Scope

- The update route (`update-harness` skill text and the Runbook update and
  control-fidelity procedures as they stand after the family Tasks), Genesis and
  Adoption template consumption, and the fixture room and tests above.
- `tools/control-fidelity.mjs` only where it labels a generation difference; no
  new classification unless the red step shows the existing ones mislead.
- Whether the update route needs a dedicated step to install the pointed skills
  before the index lands in a room is settled at the red step and recorded.

## Acceptance

- [ ] A fixture update preserves a room's own lines, recorded divergence and
      room-added skill, and installs every skill the new index points to.
- [ ] A fresh Genesis room carries the new shape and a resolving index.
- [ ] The fidelity report distinguishes a generation difference from a drop the
      room must reconcile.

## Boundaries

No release version bump, no Template (Workbench_Template) update and no release
gate action: the release owner keeps those. Updating this repository's own
controls is not this Task.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005m-update-route | 613ae2fd4c7d5674147984084886accf34275267 | ahead 0 behind 0 | 0 | Red at 511a172f: test-control-fidelity TK-005M test failed (previousTemplates undefined: no earlier template generation used and no line labeled). Green at 6d73c3e8 onward: control-fidelity labels earlier-template, newer-template and template-changed lines from --previous-templates or the room manifest's provenance.source.commit; test-control-fidelity 38/38 (an old-shape room built from templates at d7ffffe9 with its own rule and a recorded divergence: only the room's own lines stay unlabeled added, nothing of its own is dropped, the divergence stays an unlabeled change, index rows are newer-template, Markdown names generation differences). Update fixture (test-skills-lane 5/5): an index landed before the skills update leaves workbench-runtime dangling and doctor reports skill-pointer-dangling; after workbench-skills update --explicit-update every pointer binds a core skill, the room-added skill is unpointed and teaching with its bytes untouched. Genesis (test-genesis-from-decisions ok): the derived room carries the operations index, no dangling pointer, binds only core skills, CLAUDE.md exactly @AGENTS.md. At 613ae2fd: test-workbench-upgrade, test-workbench-adoption, test-workbench-round-trip, test-genesis-from-decisions, test-control-fidelity, test-skills-lane, test-workbench-dogfood, test-runbook-index, test-wiki, test-skill-catalog exit 0; landing check ok vs pin d7ffffe9 (RUNBOOK 1817/1817, AGENTS 287/287); full suite 51/51 at 613ae2fd (dirty []); guardrails 106.6/113 and 78/100 held; wiki validate ok; self-drift post on branch 7 attention findings (stale-claim S-00Q, five stale-seed, unverified-provenance), none about this Task. | tools/control-fidelity.mjs (--previous-templates, generation labels); update-harness skill (reconciling an old long control: skills update before the index, keep room-owned lines, divergence and room-added skills, read generation labels); templates/RUNBOOK.md Upgrading The Harness step 2; workbench-room-checks Control fidelity report section; Wiki features/control-fidelity-without-forced-uniformity (moved there by S-003W on integration); tests test-control-fidelity, test-skills-lane, test-genesis-from-decisions. | The update route has no automated control rewrite: reconciling AGENTS.md and RUNBOOK.md stays the agent's update-harness step, now ordered and labeled; a room whose recorded source commit is not in the release checkout must pass --previous-templates to get labels; no release version bump (release owner). | 379e3967ff17ad714b8039c662e703919f4d42109db51e26133d55d1b40f9f92 |
