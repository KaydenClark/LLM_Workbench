# TK-008I - A reached landmark retires into its Landmark Wiki page with LANDMARK.md as the page's recorded source

**Task ID:** TK-008I
**Spec ID:** S-003Z
**Slice:** A reached landmark retires into its Landmark Wiki page with LANDMARK.md as the page's recorded source
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008H
**Destination:** spec-acceptance: A reached landmark retires into its Landmark Wiki page with `LANDMARK.md` as its recorded source.
**Planned verification:** Red: `retire-landmark LMK-0AA --wiki workbench/wiki/design-concepts/landmark-x.md` is an unknown command; green: the command refuses by name a landmark that is not `reached`, one with an open child Spec or Task, one without a current `pass` verdict on its current digest, a dirty tree, a Wiki page outside the Wiki lane, and a page whose `source_paths` does not name the landmark's historical `LANDMARK.md` route (reusing `durableOwnerRefusal`); then moves the whole landmark folder (nested Specs and Tasks included) to `<collection>/retired/LMK-###-slug/` with the link-safe move, appends the retirement row to the landmark's evidence log, re-renders and stages. Owner approval is the Spec's `approve` seam one size up and is recorded by the owner only; the command refuses without it and never records it. `show LMK-###` finds the retired landmark by its historical route. Targeted tests in `tools/test-spec-workbench.mjs` and `tools/test-landmark-wiki.mjs`, then the full Runbook suite on the committed candidate.
