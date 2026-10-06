# TK-008T - Manifest legibility block, declare-legibility command and the Workbench's own declaration

**Task ID:** TK-008T
**Spec ID:** S-004M
**Slice:** Manifest legibility block, declare-legibility command and the Workbench's own declaration
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The Workbench's own manifest declares all six entries and each named command or path exists.
**Planned verification:** Red then green in tools/test-workbench-layout.mjs (validate accepts a full block; refuses an array, an unknown key, a non-string entry or a confirmation other than pending with invalid-manifest; declare-legibility writes the block and leaves every other manifest key byte-equal) and tools/test-workbench-dogfood.mjs (every path and script the Workbench's block names exists); then the full suite, render and doctor on the committed candidate.

## Scope

Add the optional `legibility` block to `validateManifest` in `workbench/tools/workbench-layout.mjs`: six entries `run`, `operate`, `inspect`, `errors`, `journey`, `measure` as non-empty strings, optional `confirmation: "pending"`, nothing else; export the entry list and a reader that classifies declared, missing, placeholder and pending entries for the next Task. Add `declare-legibility --project PATH --run ... --operate ... --inspect ... --errors ... --journey ... --measure ... [--pending]` under the identity lock, rewriting only that key. Declare the Workbench's own surface in `workbench/manifest.json` per the Spec's Desired Behavior 3. No doctor finding in this Task, so integration's own doctor stays clean at the merge.

## Boundaries

No registry code, no doctor change, no Genesis or adoption change, no Runbook or AGENTS line. Rebase onto the fresh integration tip before the PR because the landmark lane also edits the manifest.
