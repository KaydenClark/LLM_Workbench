# TK-008U - doctor reports an undeclared or unconfirmed legibility surface as attention

**Task ID:** TK-008U
**Spec ID:** S-004M
**Slice:** doctor reports an undeclared or unconfirmed legibility surface as attention
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008T
**Destination:** spec-acceptance: A fixture room with the block passes `doctor` silently for it, and one without it receives one attention finding that blocks nothing.
**Planned verification:** Red then green in tools/test-diagnostics.mjs (a fixture without the block reports exactly one legibility-undeclared and cliDoctor exits 0; with the block none; a placeholder or empty entry is named; a pending draft reports legibility-unconfirmed; the registry table carries both codes as attention/manifest/none) and tools/test-workbench-layout.mjs (migrate, record-source, identify and collection additions inject no block and change nothing else); every fixture helper that expects an empty doctor report declares the block; then the full suite, render and doctor on the committed candidate.

## Scope

Register `legibility-undeclared` and `legibility-unconfirmed` in `workbench/tools/diagnostics.mjs` (attention, manifest, none). Add `legibilityFindings(project)` to `workbench/tools/workbench-layout.mjs` and push it from `doctor` in `workbench/tools/spec-workbench.mjs` beside `provenanceFindings`. Update the fixture helpers in the test files that assert an empty report (the `untracked-controls` precedent in tools/test-diagnostics.mjs) so they declare the block, with the reason in a comment. Add both codes to the diagnostics table in `workbench/skills/workbench-runtime/SKILL.md`.

## Boundaries

No Genesis or adoption change, no Runbook or AGENTS line (the Runbook's installed-state paragraph stays as written; the code list lives in the skill).
