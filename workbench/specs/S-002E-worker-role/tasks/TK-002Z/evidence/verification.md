# Worker candidate verification

Base: integration `95176a4f216cc3d684301a355d6d23369ab275a1`.
Source entry and scenario inspector: `606d7fb`.

Focused source check: expected red (candidate absent / ENOENT), then green.
`node tools/test-worker-role.mjs --scenario /tmp/s002e-worker-scenario`:
PASS source contract and inspected configured-agent candidate. The inspector
also compares the scenario's committed skill bytes with the current staged entry.
`node workbench/tools/wiki.mjs validate`: PASS.

The required AGENTS and RUNBOOK union is run serially. Initial results remain
in the local `/tmp/s002e-full-suite.log` and `/tmp/s002e-suite-results.json`.
The initial run overlapped authoring and one extra citation-anchor check:
configured-host failed while the staged skill was untracked, then passed 10/10
after committing it; untouched base also passed 10/10. Dogfood and citation-anchor
checks observed the extra check's temporary S-0990 citation fixtures. These are
harness execution interference, not accepted passes. A final serial run on the
committed tree, without concurrent repository tests or edits, supersedes this
first run; its command-level results are in final-suite.json: **51/51 passed**, tested commit 89f7593fefd5975c03733c6c038a2dcd3873f258. Initial command results remain in initial-suite.json. Final closeout changes only receipts, evidence and generated state; focused source/scenario, Wiki, citation and doctor checks are repeated after closeout.

## Self-drift and semantic read-back

Raw read-only receipts: self-drift-pre.json (clean base) and
self-drift-post.json (committed staged implementation). Both retain the same
seven baseline findings: S-00Q stale claim blocks clean-update; five seed rows
and one provenance row are historical limitations. No globally clean update is
claimed. A transient untracked-controls finding during authoring disappeared
once the staged entry was committed.

Read-back follows AGENTS/Runbook/Lexicon, manifest and S-002E into its Task,
staged entry and Wiki. The new route explicitly says staged; the full-capability
acceptance remains open. Neither main nor managed discovery, manifest, root
controls, templates, frozen v3.2.1, other Specs or Factory changed. Generated
Taskboard/catalog reflect native activation/claim. The MEMORY link is reserved
for coordinator assembly, not silently represented as installed discovery.
Current source contains no claim of Worker release completion. Historical
planning rows are preserved. The unrelated S-00Q stale claim belongs to its
owner; bundle/install/provenance reconciliation belongs to release assembly.

Guardrail baseline and after-score: **78/100** both times. Recommendations remain
real repeated non-synthetic outcomes, comparison against controls and prior
harness, current candidate observations, and uncertainty reporting. This staged
single-scenario check does not satisfy those recommendations.

## Publication and gates

Native claim fetched ownership and pushed 648e00f. Git push is available.
`gh api repos/KaydenClark/LLM_Workbench --jq .full_name` returned
`Get "https://api.github.com/repos/KaydenClark/LLM_Workbench": Forbidden`.
No draft PR was created, and no credential workaround was attempted. Normal
current target is integration under release exemption 2. Separate immutable
review is required before any merge; no approval, merge or owner closure is
claimed. S-002E remains active and TK-002Z in progress for Dispatcher review.
Managed bundle identity/install and the coordinator's MEMORY hunk remain open.
