# TK-005M - Carry the new shape through Genesis and the update route without losing a room's own controls

**Task ID:** TK-005M
**Spec ID:** S-004C
**Slice:** Carry the new shape through Genesis and the update route without losing a room's own controls
**Status:** blocked
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
