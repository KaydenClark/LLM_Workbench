Builder composed execution/planning helpers without explicitly limiting their
broader steps to the already assigned Task. This candidate makes that boundary
explicit and requires completion reports to state the actual result, evidence,
documentation state and remaining risk. Unmet acceptance or required review
keeps the Task incomplete.

Changes are limited to Builder source/references, a focused contract regression,
the individual Wiki explanation, S-01P/TK-01G and native generated projections.
No shared controls, runtime, manifest, bundle identity or Factory changes.
The existing TK-01G was converted and claimed through the native CLI; historical
evidence and original branches are retained.

Validation: durable failing and passing source-contract test commits, Wiki
validation, exact AGENTS suite plus RUNBOOK additions and focused test receipts
under `workbench/specs/S-01P-builder-skill-rebuild/proof/`. Read `suite-results.json`
for exact commands and exits. Self-drift receipts and a bounded semantic check
preserve pre-existing findings; the guardrail score remains 78/100. These checks
are not fresh-agent behavioral validation.

Draft only. TK-01G remains in progress. Before acceptance/merge:

- Run the synthetic Builder scenario in an authorized independent context and
  preserve actual observations; no behavioral PASS is claimed here.
- Obtain independent review of the immutable candidate and record its verdict.
- Have the coordinator serialize the single MEMORY router hunk supplied in
  `proof/memory-route.patch`, then validate and re-review the resulting candidate.

Target: integration. No merge or main update is requested. Owner Human QA and
repeated behavioral reliability remain separate gates.
