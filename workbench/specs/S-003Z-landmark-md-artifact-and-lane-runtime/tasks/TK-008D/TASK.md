# TK-008D - A room declares a landmarks collection and validates a LANDMARK.md authored from the template

**Task ID:** TK-008D
**Spec ID:** S-003Z
**Slice:** A room declares a landmarks collection and validates a LANDMARK.md authored from the template
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A `LANDMARK.md` can be authored from the template, validated, and assigned in a fixture room, and a Task under the assigned landmark can be selected and claimed.
**Planned verification:** Red: a fixture room with `collections.landmarks` declared and one `workbench/landmarks/LMK-0AA-slug/LANDMARK.md` authored from `templates/LANDMARK.md` is refused by `doctor` (unknown collection) and `next-id --prefix LMK` is refused; green: `workbench-paths.mjs` declares `landmarks` as the third additive collection, `workbench-layout.mjs migrate` appends it to a room on the current pre-landmark shape and creates the empty folder, `landmark-artifact.mjs` parses and validates the header (`Landmark ID`, `Status` in `planned|active|reached`, `Priority`, `Owner`, `Updated`, `Catalog description`, `Blockers`, `Latest event`, `Next gate`) and sections (`Direction`, `What Success Looks Like` with `- [ ]` reached checks, `Decision Records`, `Append-Only Evidence And Execution Log`, `Reached Result`), `doctor` reports a malformed landmark by name and an `unstable-path` for a folder not starting `<collection>/LMK-###-`, and `next-id --prefix LMK` folds the JSON landmark records, the artifacts at both lifecycle folders and every remote tip. The new managed tool joins `RUNTIME_TOOLS` and the installed receipt. This room's manifest gains the collection through the migrate route. Targeted tests in `tools/test-spec-workbench.mjs` and `tools/test-workbench-layout.mjs`, then the full Runbook suite on the committed candidate.
