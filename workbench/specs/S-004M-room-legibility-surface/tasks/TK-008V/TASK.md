# TK-008V - Adoption drafts the legibility block from what it can see, marked for grilling

**Task ID:** TK-008V
**Spec ID:** S-004M
**Slice:** Adoption drafts the legibility block from what it can see, marked for grilling
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008U
**Destination:** spec-acceptance: Genesis drafts the block for a new room and adoption drafts it for an existing project, both marked for grilling confirmation.
**Planned verification:** Red then green in tools/test-workbench-layout.mjs (draftLegibility reads package.json scripts, Makefile targets and RUNBOOK.md fenced commands under Run Locally, Logs and Test And Build; unseen entries are bracketed placeholders; the draft is always pending) and tools/test-workbench-adoption.mjs (a legacy project with package.json start and test scripts is adopted with run and errors drafted, placeholders elsewhere, confirmation pending, and doctor reports only the attention findings without blocking); then the full suite, render and doctor on the committed candidate.

## Scope

Add `draftLegibility(root)` to `workbench/tools/workbench-layout.mjs` and have `tools/workbench-adoption.mjs migrate` write its draft into the initialized manifest before validation, as the Setup-drafts-and-grilling-confirms decision requires.

## Boundaries

No Genesis change, no Runbook or AGENTS line, no new runtime tool file (the receipt list stays as it is).
