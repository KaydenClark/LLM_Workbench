# TK-008J - Source behavior, the generic templates, discovery and managed installation agree, and updating a landmark-free room leaves its work unchanged

**Task ID:** TK-008J
**Spec ID:** S-003Z
**Slice:** Source behavior, the generic templates, discovery and managed installation agree, and updating a landmark-free room leaves its work unchanged
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008I
**Destination:** spec-acceptance: Source behavior, the generic templates, discovery and managed installation agree, and updating a room with no landmarks leaves it unchanged.
**Planned verification:** Red: `tools/test-workbench-upgrade.mjs` or `tools/test-workbench-round-trip.mjs` gains a case that upgrades a fixture room with no landmarks and asserts its Specs, Tasks, projections and seeded documents are byte-identical apart from the manifest's appended `landmarks` collection and its empty folder, and that `templates/RUNBOOK.md`, `templates/LEXICON.md` and the Runbook operations index name the landmark commands; green after the mirror lands. Docs: the Runbook's spec-workbench command rows (`move-spec --landmark`, `report`/`verdict`/`verify` on a landmark, `retire-landmark`, `next-id --prefix LMK`), the Lexicon Landmark, Landmark Wiki page and Map rows (drop "the artifact is not installed yet"), a Wiki design-concept article for the LANDMARK.md artifact routed from the Wiki README and the Spec, the `templates/` mirror of every changed portable rule, `templates/LANDMARK.md` placeholders checked by the template-placeholder test, the guardrail after-score and remaining recommendations, and the self-drift post receipt with the bounded semantic check; `node tools/evaluate-workbench.mjs --path templates --include-controls` keeps the blank templates ahead. Full Runbook suite on the committed candidate.
