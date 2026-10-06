# TK-008I - A reached landmark retires into its Landmark Wiki page with LANDMARK.md as the page's recorded source

**Task ID:** TK-008I
**Spec ID:** S-003Z
**Slice:** A reached landmark retires into its Landmark Wiki page with LANDMARK.md as the page's recorded source
**Status:** done
**Stance:** Builder
**Blockers:** TK-008H
**Destination:** spec-acceptance: A reached landmark retires into its Landmark Wiki page with `LANDMARK.md` as its recorded source.
**Planned verification:** Red: `retire-landmark LMK-0AA --wiki workbench/wiki/design-concepts/landmark-x.md` is an unknown command; green: the command refuses by name a landmark that is not `reached`, one with an open child Spec or Task, one without a current `pass` verdict on its current digest, a dirty tree, a Wiki page outside the Wiki lane, and a page whose `source_paths` does not name the landmark's historical `LANDMARK.md` route (reusing `durableOwnerRefusal`); then moves the whole landmark folder (nested Specs and Tasks included) to `<collection>/retired/LMK-###-slug/` with the link-safe move, appends the retirement row to the landmark's evidence log, re-renders and stages. Owner approval is the Spec's `approve` seam one size up and is recorded by the owner only; the command refuses without it and never records it. `show LMK-###` finds the retired landmark by its historical route. Targeted tests in `tools/test-spec-workbench.mjs` and `tools/test-landmark-wiki.mjs`, then the full Runbook suite on the committed candidate.
**Proof:** PR #380 merged into integration at b25e40a396bea49d48d1a6a9605647dcae805cf5 (merge of candidate d9e1708417344dc9ef26d4adf1d646f6b9d3a6a9, base 662b1989); red at 5590ead3 (retire-landmark unknown command; approve LMK-0EA Unknown spec ID); full Runbook suite 51/51 on d9e17084 (DONE total=51 fail=0); test-spec-workbench 60/60 plus inline block, test-landmark-wiki 79/79, test-spec-report exit 0; render no diff; doctor no blocking finding; check-append-only CLEAN; manual scratch-room retirement walk

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003z-tk008k | b25e40a396bea49d48d1a6a9605647dcae805cf5 | ahead 0 behind 0 | 0 | PR #380 merged into integration at b25e40a396bea49d48d1a6a9605647dcae805cf5 (merge of candidate d9e1708417344dc9ef26d4adf1d646f6b9d3a6a9, base 662b1989); red at 5590ead3 (retire-landmark unknown command; approve LMK-0EA Unknown spec ID); full Runbook suite 51/51 on d9e17084 (DONE total=51 fail=0); test-spec-workbench 60/60 plus inline block, test-landmark-wiki 79/79, test-spec-report exit 0; render no diff; doctor no blocking finding; check-append-only CLEAN; manual scratch-room retirement walk | Docs checked; no update needed in this Task: retire-landmark, approve LMK-###, the historical route and the retirement row are routed to TK-008J by the Spec's slice plan | Retirement unverified in a remote-coordinated room or fresh clone; durableOwnerRefusal also admits a guidebook or features article as the page; retire-landmark performs no branch cleanup; landmark-tracker.mjs still reads JSON records (other lane) | b130c582215f3596623eac736d5c28b282685c630bd400305d6df39cf11bf2bb |
