# TK-008F - A Spec moves into, out of or between landmarks through the link-safe move that rewrites every live reference

**Task ID:** TK-008F
**Spec ID:** S-003Z
**Slice:** A Spec moves into, out of or between landmarks through the link-safe move that rewrites every live reference
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-008E
**Destination:** spec-acceptance: Moving a Spec into a landmark through the link-safe operation rewrites every live reference and counts the historical ones; moving it out or to another parent also works.
**Planned verification:** Red: `move-spec S-0AB --landmark LMK-0AA` is refused as an unknown option; green: `move-spec S-### --landmark LMK-###` moves an active-roster Spec directory (Tasks and all, `git mv`) under `<landmark>/specs/`, `--landmark none` moves it back to `workbench/specs/`, and a second `--landmark` moves it between parents, each reusing `collectSpecReferenceFiles`, `lifecycleMoveLocations`, `rewriteReferenceFile` and `writeDecisionRegisters` so every live Markdown reference (root controls, Wiki, skills, ADR and DDR collections, every SPEC.md and TASK.md at both homes, the landmark's own LANDMARK.md) is rewritten, the Append-Only Evidence rows are counted as historical, and the result reports `referencesRewritten` and `historicalReferencesLeft`. Refusals by name: dirty tree, no Git tree, unknown Spec or landmark, a retired landmark, a Spec already under that landmark, an occupied destination. Any status moves (a planned or active Spec gains its landmark); only `retired` keeps the complete-only rule. Targeted tests in `tools/test-spec-workbench.mjs` and `tools/test-lifecycle-directory-links.mjs`, then the full Runbook suite on the committed candidate.
