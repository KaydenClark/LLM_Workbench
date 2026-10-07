# TK-008U - doctor reports an undeclared or unconfirmed legibility surface as attention

**Task ID:** TK-008U
**Spec ID:** S-004M
**Slice:** doctor reports an undeclared or unconfirmed legibility surface as attention
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-008T
**Destination:** spec-acceptance: A fixture room with the block passes `doctor` silently for it, and one without it receives one attention finding that blocks nothing.
**Planned verification:** Red then green in tools/test-diagnostics.mjs (a fixture without the block reports exactly one legibility-undeclared and cliDoctor exits 0; with the block none; a placeholder or empty entry is named; a pending draft reports legibility-unconfirmed; the registry table carries both codes as attention/manifest/none) and tools/test-workbench-layout.mjs (migrate, record-source, identify and collection additions inject no block and change nothing else); every fixture helper that expects an empty doctor report declares the block; then the full suite, render and doctor on the committed candidate.
**Claimed by:** codex-cloud-tk008u

## Scope

Register `legibility-undeclared` and `legibility-unconfirmed` in `workbench/tools/diagnostics.mjs` (attention, manifest, none). Add `legibilityFindings(project)` to `workbench/tools/workbench-layout.mjs` and push it from `doctor` in `workbench/tools/spec-workbench.mjs` beside `provenanceFindings`. Update the fixture helpers in the test files that assert an empty report (the `untracked-controls` precedent in tools/test-diagnostics.mjs) so they declare the block, with the reason in a comment. Add both codes to the diagnostics table in `workbench/skills/workbench-runtime/SKILL.md`.

## Boundaries

No Genesis or adoption change, no Runbook or AGENTS line (the Runbook's installed-state paragraph stays as written; the code list lives in the skill).

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s004m-tk008u-cloud | 6049f79af3c7c0515c1aabab6873f881ca254725 | none | 0 | Red 5a1974a5: missing legibility diagnostic, expected failure. Green focused doctor case at 35ab07ba; diagnostics 37/37, layout 82/82. Full Runbook suite: all other commands pass, append-only regression still running after 240s timeout; tools 34/34 with umask022, landmark79/79 with isolated TMPDIR outside sandbox. Guardrails73/100 pre/post; self-drift21 unchanged findings; Wiki validation passes. | Runtime diagnostics skill and existing manifest feature article updated; touched-page semantic lint and Wiki validation pass. | Append-only regression suite pending; Task closure and assembly merge wait for it. Whole Spec setup drafting, dedicated article, QA and owner gates remain. | 5cc62bce4705b1be2371e3a59559fe52d44b38c735bb0871033bbb20a9306d15 |
| 2 | codex/s004m-tk008u-cloud | fe51899d5ac770fad7ebf6e365f28472888153e7 | none | 1 | Full RUNBOOK suite 54/54 commands PASS; red5a1974a5 expected missing diagnostic, green35ab07ba; diagnostics37/37, layout82/82. Cloud fixture reruns: tools34/34 under umask022; landmark79/79 isolated TMPDIR outside sandbox; append-only clean baseline and eight corruption cases PASS without initial240s deadline. Summary proof/tk008u-cloud-verification.json; guardrails73/100 pre/post, self-drift21 unchanged baseline findings. | Runtime diagnostic skill table/repair guidance and existing manifest feature article updated. Wiki validation and touched-page semantic lint PASS; proof summary preserves pre/post receipts and limits. | none for TK-008U; setup drafting, dedicated article, whole-Spec review and owner gates remain in S-004M. | caa9c2cd886684f5b32badff81515659409e379f6e92890e22a95c0c62adf5cb |
