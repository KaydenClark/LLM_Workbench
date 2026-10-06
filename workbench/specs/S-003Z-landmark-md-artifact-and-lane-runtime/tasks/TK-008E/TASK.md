# TK-008E - The Spec tools find, claim, close, report, gate and retire a Spec nested in its landmark's folder

**Task ID:** TK-008E
**Spec ID:** S-003Z
**Slice:** The Spec tools find, claim, close, report, gate and retire a Spec nested in its landmark's folder
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008D
**Destination:** spec-acceptance: A Spec nested in its landmark's folder is found, claimed, closed, reported, gated and retired by the Spec tools, and `unstable-path` no longer reports it.
**Planned verification:** Red: a fixture room with one landmark holding `specs/S-0AB-slug/SPEC.md` (with a `tasks/TK-0AC` record) and one Blueprint-level Spec at `workbench/specs/` fails `doctor` with `unstable-path` and `next`/`show S-0AB` report an unknown Spec; green: `loadSpecs`, `loadRetiredSpecs`, `findSpec`, `resolveSpecId`, `occupiedIdentities`, `collectSpecReferenceFiles`, `render`, `doctor`, `report`, `verdict`, `gate`, `close`, `receipt`, `retire-spec` (into `<landmark>/specs/retired/`) and the Task packet resolve the Spec at either home through one `specHomes(root)` reader that lists `workbench/specs/` and every `<landmarks collection>/LMK-###-slug/specs/`, `spec.specsPrefix` names the home the Spec sits in, `spec.landmarkId` names its parent or null, and `unstable-path` no longer fires; the other lane walkers (`adr.mjs` reference walks, `claim-coordination.mjs`, `sessions.mjs`, `task-packet.mjs`, `tools/test-spec-citation-anchors.mjs`) read the same homes. The twelve public commands in the Spec's Testing Seams run against the fixture. Targeted tests in `tools/test-spec-workbench.mjs` and `tools/test-spec-report.mjs`, then the full Runbook suite on the committed candidate.
