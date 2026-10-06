# TK-008T - Manifest legibility block, declare-legibility command and the Workbench's own declaration

**Task ID:** TK-008T
**Spec ID:** S-004M
**Slice:** Manifest legibility block, declare-legibility command and the Workbench's own declaration
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The Workbench's own manifest declares all six entries and each named command or path exists.
**Planned verification:** Red then green in tools/test-workbench-layout.mjs (validate accepts a full block; refuses an array, an unknown key, a non-string entry or a confirmation other than pending with invalid-manifest; declare-legibility writes the block and leaves every other manifest key byte-equal) and tools/test-workbench-dogfood.mjs (every path and script the Workbench's block names exists); then the full suite, render and doctor on the committed candidate.
**Proof:** Full RUNBOOK suite 52/52 on 1938da8f (lane head merged with integration c5194960); Receipt at 785aecee; layout and dogfood red/green at 6b0140b0

## Scope

Add the optional `legibility` block to `validateManifest` in `workbench/tools/workbench-layout.mjs`: six entries `run`, `operate`, `inspect`, `errors`, `journey`, `measure` as non-empty strings, optional `confirmation: "pending"`, nothing else; export the entry list and a reader that classifies declared, missing, placeholder and pending entries for the next Task. Add `declare-legibility --project PATH --run ... --operate ... --inspect ... --errors ... --journey ... --measure ... [--pending]` under the identity lock, rewriting only that key. Declare the Workbench's own surface in `workbench/manifest.json` per the Spec's Desired Behavior 3. No doctor finding in this Task, so integration's own doctor stays clean at the merge.

## Boundaries

No registry code, no doctor change, no Genesis or adoption change, no Runbook or AGENTS line. Rebase onto the fresh integration tip before the PR because the landmark lane also edits the manifest.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004m-dispatcher-land | 1938da8fcefb7e62c51f1a299ee43d50c28865aa | ahead 174 behind 0 | 0 | Full RUNBOOK suite 52/52 pass on committed candidate 1938da8f (merge of origin/integration c5194960 into lane head 0cf58e63; clean tree before and after); targeted red/green in tools/test-workbench-layout.mjs and tools/test-workbench-dogfood.mjs recorded at 6b0140b0; render and doctor clean (attention only) | workbench/manifest.json declares the Workbench legibility surface; Spec plan and Task records; projections re-rendered | none for TK-008T; doctor finding is TK-008U | d26142fd7a2689c971db77c94c5a832c2acb026a9f6841c5b30d86d67c2a81eb |
| 2 | claude/s004m-dispatcher-land | 785aecee535c26241a47737874179083ed79932f | ahead 0 behind 0 | 0 | Full RUNBOOK suite 52/52 on 1938da8f (lane head merged with integration c5194960); Receipt at 785aecee; layout and dogfood red/green at 6b0140b0 | workbench/manifest.json legibility declaration and the S-004M Spec/Task records updated; Wiki checked, no page describes the manifest legibility block yet (TK-008U onward owns the doctor and docs surface) | none | d5d47e5c7e19994751016ce751b0cd7775f7fb0ddb970f200a865d3481f9d127 |
