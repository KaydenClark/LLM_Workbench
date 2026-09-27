# V4 integration decision and progress reconciliation

**Owner:** [Workbench v4.0.0 Release — S-00O](SPEC.md)  
**Inspection date:** 2026-09-27  
**Base:** `b00a2e338436ef7b281b0cc53e74f891af32f18c` (`integration` and freshly fetched `origin/integration`)  
**Scope:** tracked decision/control/spec/task owners, local and fetched Git refs,
registered worktree dirty-path inventory, and the primary checkout's known
JSON continuity collections. Other machines and unsaved conversations were not
inspected. This is a dated receipt, not a live queue or approval verdict.

## Result and boundaries

The confirmed minimum role/stance model is now recorded in the Lexicon,
Blueprint, AGENTS and Runbook, with generic mirrors where applicable,
[ADR-000P](../../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md),
a [Wiki explanation](../../wiki/design-concepts/roles-and-stances.md), and
five separate planned capability Specs. Reviewer and Auditor retain their
existing stance owners. No new execution Task or operating skill is created.
The generic Blueprint remains a product-fill template; portable role rules
belong in its AGENTS/Lexicon/Runbook companions, not a prescribed product design.

The owner-directed Tracker split and already-authored Task records were found
only on lane branches. Their requirements, source acceptance mapping and
existing receipts are published here without importing implementation. Each
successor explicitly separates lane-candidate proof from integration delivery.
A done Task record is not a claim that its runtime is present on integration.
No pending review or approval is bypassed and no active lane is overwritten.

This reconciliation does not claim that all branch work is ready to merge,
that all v4 capabilities are implemented, or that historical ledger progress
has been freshly re-audited row by row. Accepted decisions remain distinguishable
from proposals, implementation gaps, candidate results and owner gates.

## Decision coverage and current owners

| Source decision family | Durable owner and disposition |
|---|---|
| Foundation FND/RB and Task vocabulary TT | [Destination ledger](../../wiki/grilling-destination-audit-ledger.json), Lexicon, proposed ADR-000B/C/D, [Ownership Map — S-00G](../S-00G-ownership-map-root-control/SPEC.md), lifecycle/QA S-00I/J and workflow S-00P. FND-Q24B remains unanswered; no schema invented or ADR acceptance inferred. |
| WF workflow and SCR review boundary | Blueprint's source-faithful map and labeled interpretation, ADR-000F, S-00J and S-00P. SCR-4A is explicitly superseded by ROLE-3; other review and Human QA answers remain. Old e318f14 promotion is not a candidate to merge. |
| E board, WBID and direct Tasks | S-00O capability map, [WBID — S-01W](../S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md), [JSON Taskboard — S-01X](../S-01X-generated-json-taskboard/SPEC.md), and [direct-Task proposal](direct-blueprint-task-proposal.md). Earlier S-01U/V branch identities are superseded allocation attempts, not new capability owners. |
| PW portable room and continuation | [Portable Workbench — S-00V](../S-00V-portable-workbench/SPEC.md), ADR-000M/O and PW ledger answers. A recorded accepted destination does not prove every managed or remote consumer is implemented. |
| BPR ownership/Blueprint boundary and older V3/WB/U313/CAND decisions | Existing ledger families, their aliases and linked controls/ADRs/Specs preserve the answers. Earlier notes and frozen checkpoints remain history. No broad restoration of obsolete controls or transport policy. |
| Landmark design | ADR-000N, [Landmark Tracker design](../../wiki/design-concepts/landmark-tracker.md), S-01T's 13 original acceptance obligations and the three successor owners below. Later DQC/flat-storage/distribution decisions govern; earlier single-stage/reset/status-folder/ledger-replacement proposals are superseded. |
| Skill workflow entry Q1 | Blueprint Desired Lifecycle already records idea exploration before Align and grill-me/brainstorming/wayfinding entry. The saved Q2A/wayfinder-storage question remains unresolved; no new answer inferred. |
| ROLE-1..4 | Ledger answers, ADR-000P, the role model and S-002C through S-002G. The final concept was explicitly confirmed before promotion. |

The ledger contains the durable answers and distinguishes their status. Its
2026-09-24 progress assessment remains explicitly historical; current Task/Spec
state must be read from the named owners and their generated projection. This
receipt does not rebrand that older progress tally as a current audit.

## Recovered active lane records

| Capability | Immutable source | Integration disposition |
|---|---|---|
| Landmark Tracker — S-001Z | `c1813ba9c21b8b2e089963bcac0524e957a931d6` | Requirements and TK-002U receipt imported; readable-evidence runtime and composed demo/review remain lane work. |
| Landmark Records — S-002A | `92ba4e61356389effc54d3ceebd79f9f6ff49c7a` | Requirements and TK-002T/TK-002W imported; recorded registry omission and pending approval/review remain open. No validator runtime imported. |
| Destination Question Cards — S-002B | `a9e32803e7f7f866f510f529aa677e7aa4f1a40f` | Requirements and TK-002S/TK-002V imported; branch-local Result proof retained, publication/composition gates remain. No Result implementation imported. |
| Foundation acceptance transfer — S-01T | `4e68ca488fa258f7dce0161aeebcd2946e492990` | Exact accepted source mapping and context-only TK-01Z/TK-02A transfer carried forward; completed Task files untouched. |

Existing S-00G packet-plan recovery, S-00J closure planning, S-00P packets,
S-00U audit reconciliation, S-00O's renumbered planning and per-skill S-00W..S-01S
owners are already routed on the base integration. Unmerged branch ancestry
alone does not mean their decisions are missing: later reconciled commits may
carry the corrected content. Old completion and review claims must not
replace current failed/ongoing Human QA or their corrective owners.

## Local continuity inventory

The inventory below records the known source objectives, not raw conversations
or a second copy of decisions. Their historical/provisional content never
outvotes their durable owner. The runtime reports five legacy-schema records
as unreadable; JSON inventory can identify their metadata, but this change does
not migrate them or pretend a runtime read succeeded. The ledger already
preserves the corresponding historical families. Live source files remain
local and are not committed by this reconciliation.

- `v3.2.0-release-2026-09-08.json`: 10 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `cand-n-private-session-transport-2026-09-07.json`: 0 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `decision-triage-second-pass-2026-09-07.json`: 0 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `unblocking-v3-1-3-open-work-2026-09-07.json`: 0 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `s00i-s00j-director-audit-2026-09-19.json`: 6 entries inventoried; lane coordination/progress context; recovered active candidates and remaining gates listed above.
- `grilling-transcript-completeness-2026-09-23.json`: 6 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `integration-branch-convergence-2026-09-26.json`: 3 entries inventoried; lane coordination/progress context; recovered active candidates and remaining gates listed above.
- `v4-phase-two-dispatcher-2026-09-17.json`: 100 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `skill-workflow-catalog-2026-09-24.json`: 3 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `original-foundation-audit-2026-09-10.json`: 38 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `director-dispatch-2026-09-26.json`: 17 entries inventoried; lane coordination/progress context; recovered active candidates and remaining gates listed above.
- `v4-release-readiness-review.json`: 1 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `v4-build-dispatcher-2026-09-16.json`: 39 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `landmark-tracker-director-2026-09-26.json`: 42 entries inventoried; lane coordination/progress context; recovered active candidates and remaining gates listed above.
- `audit-ledger-reconciliation-2026-09-26.json`: 7 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `skill-workflow-redesign-2026-09-24.json`: 6 entries inventoried; Q1 already in Blueprint; next design question remains open.
- `blueprint-adr-boundary-review-2026-09-09.json`: 20 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `separate-context-review-boundary-2026-09-24.json`: 22 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `v4-role-groundwork-2026-09-26.json`: 14 entries inventoried; ROLE decisions reconciled in this change.
- `portable-workbench-cloud-deployable-2026-09-22.json`: 19 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `landmark-definition-2026-09-24.json`: 98 entries inventoried; accepted design routed to ADR-000N, design article and original/three successor Specs.
- `task-ticket-chat-workflow-clarification-2026-09-10.json`: 7 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `wf-workbench-workflow-2026-09-15.json`: 47 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `blocked-obligations-review-2026-09-21.json`: 47 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `fnd-foundation-ownership-2026-09-15.json`: 91 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `workbench-foundation-rework-2026-09-11.json`: 156 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `tt-task-ticket-chat-terms-2026-09-15.json`: 15 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.
- `workbench-workflow-2026-09-10.json`: 0 entries inventoried; historical or provisional source; use the decision-family and current-owner routes above.

## Unmerged-ref inventory

Every local/fetched ref with commits outside the base was inventoried. Equal
local/remote tips are grouped. These pins preserve discovery of candidates;
they are not review passes or instructions to merge. Empty-diff and older
release branches remain historical; active implementation stays in its lane.
The three successor owners above recover the newly split capability decisions
and progress, while release and workflow owners carry the other v4 decisions.

| Ref(s) at inspection | Immutable tip | Files changed from merge base |
|---|---|---:|
| `claude/S-00I-completion`, `origin/claude/S-00I-completion` | `754aa1a7982dbda2af50618b778a2f772f9b633b` | 2 |
| `claude/S-00J-completion`, `origin/claude/S-00J-completion` | `881db815981a572b20fa065f8afd9c2179898d77` | 1 |
| `claude/S-00L-lexicon-freshness`, `origin/claude/S-00L-lexicon-freshness` | `d1407bb97711c8bec2153b290f1f6bb4a745765e` | 3 |
| `claude/S-00P-TK-001-blueprint-workflow-rework`, `origin/claude/S-00P-TK-001-blueprint-workflow-rework` | `a7e83c094703d2d9fd2ae6ed0d7a1f0f90465b1f` | 2 |
| `claude/adr-acceptance-and-lane-model` | `be8d5f67084f6073a6e9667e63ae1c76b90b84d0` | 18 |
| `claude/adr-notepad-objective-ownership`, `origin/claude/adr-notepad-objective-ownership` | `5c6d201bbdf36ca804b94b94c6b4e029b498a436` | 2 |
| `claude/feedback-v3-1-1-adoption-report`, `origin/claude/feedback-v3-1-1-adoption-report` | `9cde3629c7f7bd1a2f61b338bc3d26ac03fabb4e` | 3 |
| `claude/harness-review-acceptance-report` | `cd2020c7cee197353637c93b480af8b5d853ef27` | 3 |
| `claude/harness-review-feedback`, `origin/claude/harness-review-cic-adoption` | `cd5f8ee45f6de69c1d38009ea662dfc0822a5227` | 1 |
| `claude/s00h-tk001-task-record` | `a8daab9d1825504576f36b272fe9ce2864cdacea` | 2 |
| `claude/s00j-closure-contract-plan` | `c202ae576847a64b3001f592206461626053baf5` | 5 |
| `claude/s00o-planning-rebuild`, `origin/claude/s00o-planning-rebuild` | `6eac6cb5bf5accf9d50b6ea184943cc74b124d65` | 8 |
| `claude/s00o-planning-rebuild-v2`, `origin/claude/s00o-planning-rebuild-v2` | `c43b75e9d30ae1781eebb686af46c28c56e0c500` | 8 |
| `claude/s00o-planning-rebuild-v3`, `origin/claude/s00o-planning-rebuild-v3` | `78b94e5cb184a1de502a77635c997a8ba528d3e4` | 8 |
| `claude/s00o-planning-rebuild-v4`, `origin/claude/s00o-planning-rebuild-v4` | `a6a511c2ba4bdfb8bdedc5375e8ba5778a05923b` | 8 |
| `claude/s01m-tk01d-tracer-bullet-rebuild`, `origin/claude/s01m-tk01d-tracer-bullet-rebuild` | `abe7ccb3646af5327260cddb78f22bc7a19740aa` | 7 |
| `claude/s01n-tk01e-update-harness-rebuild`, `origin/claude/s01n-tk01e-update-harness-rebuild` | `b208bc8d5ce29e15d644cca4ec137696c8130978` | 7 |
| `claude/s01w-assembled-qa`, `origin/claude/s01w-assembled-qa` | `1616bbd2fa7ee56fcf8846b0e34f977632a56c41` | 9 |
| `claude/s045-tk004-citation-anchors`, `origin/claude/s045-tk004-citation-anchors` | `9ea18c56a9d938a0019298ef9f06e639b33e65e7` | 12 |
| `claude/s045-v313-carry-install`, `origin/claude/s045-v313-carry-install` | `1f736557243d1d208c7fcd28a2efe618b614c8a7` | 9 |
| `claude/s045-v313-carry-install-clean`, `origin/claude/s045-v313-carry-install-clean` | `1fe4340baa1250f93b1dd316c4f251e31e910b7e` | 7 |
| `claude/s045-v313-carry-install-final`, `origin/claude/s045-v313-carry-install-final` | `322130b8e790408914416528a69b13b5bc341ed6` | 2 |
| `claude/s045-v313-landing`, `origin/claude/s045-v313-landing` | `a4123ec826d93fc2f98122eb9c04ba61489af696` | 2 |
| `claude/scr-review-boundary-promotion` | `e318f144247d4288d2364f8103c78069d64aa919` | 14 |
| `codex/dispatcher-s00p-20260926` | `ebe13cc8fd1b40d1fb609e34a90008dc72e7b751` | 5 |
| `codex/dispatcher-s00u-20260926` | `51dd8f13d98c75f58c9353b121c500d4585492bd` | 1 |
| `codex/dispatcher-s01t-20260926` | `e58655d6a70c27f36f0d6ebf0ab0cf7ed589337c` | 3 |
| `codex/dqc-capability-split` | `a9e32803e7f7f866f510f529aa677e7aa4f1a40f` | 19 |
| `codex/dqc-result-tk002s`, `origin/codex/dqc-result-tk002s` | `882430c01d00a8864711d28082bf4695bf2ad566` | 14 |
| `codex/landmark-article-tk002t`, `origin/codex/landmark-article-tk002t` | `90885bde8c67c8690e1a70371d39c227da65f751` | 13 |
| `codex/landmark-records-delivery` | `92ba4e61356389effc54d3ceebd79f9f6ff49c7a` | 16 |
| `codex/landmark-tracker-split` | `c1813ba9c21b8b2e089963bcac0524e957a931d6` | 19 |
| `codex/lexicon-map-fog-frontier` | `cc53fadc314952972b6a3bc335dfcdff17407355` | 4 |
| `codex/s00g-dispatch-plan-2026-09-26` | `3c8be95a7d1f06f5a2ce0b149d84685a8dbdb598` | 2 |
| `codex/s00j-dispatch-20260926` | `4cf2032b86b69360b3b8cd4881ed7ea588d97c49` | 3 |
| `codex/s00o-release-planning-20260926` | `34dfa2f6f1f4ef6a8cda17f8b78951490a4b1872` | 6 |
| `codex/s00p-tk002-packet-20260926` | `1a24b44174b35a58f371bdddca36f005229b9c4b` | 1 |
| `codex/s00p-tk003-packet-20260926` | `a968f37a78b4e1942b5ea881c356a0a45cb6e03e` | 1 |
| `codex/s00p-tk004-packet` | `e080657a8e14f50b2a0655cc32e99e2dc2b4166d` | 1 |
| `codex/s00p-tk005-packet` | `da1b7efe86ff69c36db9e7b559009c9d0fe5da55` | 1 |
| `codex/skills-wiki-spec` | `a5f337de715f8b6a24dad5d9da0c05e3560d47cd` | 2 |
| `codex/tracker-evidence-tk002u` | `e2b532d6dedb9fddf712bd3804a58508df138dd2` | 16 |
| `codex/tracker-readable-evidence` | `4e68ca488fa258f7dce0161aeebcd2946e492990` | 14 |
| `codex/v3.2.0-release` | `7bee389ed8b6d61fe316a99bc45ef3600272f630` | 22 |
| `origin/backup/s01e-tk00v-prerebase-46f7b47` | `46f7b4737af4273b1ec616c3e8be4c29cce15edd` | 5 |
| `origin/claude/close-s036-s037` | `6d0b206a607c96c3907069858e10b211652a029d` | 4 |
| `origin/claude/close-structured-metadata-t006` | `1f58d77ede024d44e53f6f1dc70ffac6c1be449c` | 0 |
| `origin/claude/dogfood-taskboard` | `c3281bba3413853945dac0a5d7003bbc7eb1771e` | 0 |
| `origin/claude/feedback-loop-t008` | `cc0e297f7a156f542e51e82c269f2e67a706936e` | 0 |
| `origin/claude/grilling-family` | `d4f66bb82f3786456af6c121eb5f158602f9bd27` | 8 |
| `origin/claude/lifecycle-hardening-t005` | `1b8da7c6a21e73786a259c545e2659898d819482` | 0 |
| `origin/claude/make-it-so-implements` | `95e831dcb44ad83b655a749d799f8f9cffc35bd3` | 6 |
| `origin/claude/respec-forge-verticality` | `8a0e489c85c1f811fd7882b619c81116bfe6c769` | 6 |
| `origin/claude/s-011-skills-import` | `32e99a49cf58a95320fdfaeff56266dec6ff2bbb` | 66 |
| `origin/claude/s014-tk002-socket-registry` | `a5d2668c46694be76912c81106a066f414e0b0c7` | 5 |
| `origin/claude/s023-preflight-gate` | `62c7cf16fa9cc421a49ced444d2a040085269f12` | 78 |
| `origin/claude/s046-tk002-notepad-runtime` | `ca7e806e556c1d8fb84c2c77cb97f908d5aff54c` | 6 |
| `origin/claude/scope-enforcement-t007` | `de59f3e11f4fa2932288e0736293ddfcdd4f724b` | 0 |
| `origin/claude/skill-family-phase2` | `d3cbe72b0fd8aa8d030462d3315b138d33b3f27c` | 57 |
| `origin/claude/template-readme-t009` | `4ca2f897f3d57e76e626655789c51ed4f3e06a69` | 0 |
| `origin/claude/v4-dispatch-close-S-00H-TK-003-claim-TK-004` | `be7426ef1ff1e033a98587fa0954e34055d164eb` | 8 |
| `origin/claude/v4-dispatch-close-S-00H-TK-003-claim-TK-004-b` | `643793bac639857f402bb83707a42d311c62de36` | 8 |
| `origin/claude/v4-dispatch-close-S-00H-TK-005-006` | `7976d7c8774e31bdd68672fe5b5f7c98b8d9e1dc` | 3 |
| `origin/claude/workbench-branch-evaluation-paper` | `7d5d7c9b131ca158578e4b7a97d3b03c723c0173` | 4 |
| `origin/codex/feedback-helper-import` | `6872a65c1a1f68295ad5ec18a5200ade195d0f03` | 4 |
| `origin/codex/feedback-plan-windows-verification` | `e4680f56b727d0d33a62c88030ca9411164491fb` | 10 |
| `origin/codex/grilling-decision-reuse` | `8d40b92869bcadc314be4c94c35b5677fc6f1f15` | 57 |
| `origin/codex/harness-feedback-261e2a436463` | `e5dee5db9bba6697bbbdbe7085231b30d6febbb6` | 5 |
| `origin/codex/harness-feedback-automation` | `e6215614befe2352a6fa778eefc6d19e9bdce9c4` | 25 |
| `origin/codex/harness-feedback-automation-closeout` | `95ab84d4c08abaee01132b01a5318cf53d1b630e` | 4 |
| `origin/codex/harness-feedback-ed16c349cdc3` | `93d1520c6378222d249bb72c44c2053b590d1c7e` | 4 |
| `origin/codex/reconcile-repo-skills` | `1f2032f9d27f858e5b3dad215ee05d5bef0181d7` | 2 |
| `origin/codex/rewrite-pending-skills` | `695ca1476e5ae6b88456035377b5bfd9afa501d1` | 77 |
| `origin/codex/s-012-adoption-provenance` | `36c5ca7fb1897c26e9e2961ee65a31acf0007a5b` | 5 |
| `origin/codex/s-013-automation-run-outcomes` | `33669b08242ffc659e5a48d7c24e7e739f43b9b5` | 7 |
| `origin/codex/s-014-workbench-release-candidate` | `b724713304b651838449265237fd1414aa5b6e71` | 3 |
| `origin/codex/s009-spec-workbench-metadata-fix` | `10fc18265df895cef5a435dd9492814dfcf9c933` | 2 |
| `origin/codex/s014-escaped-table-parser` | `26044ac3c12f093ff44d23e43e40acee25ae92a1` | 7 |
| `origin/codex/s014-tk002-transition` | `c214f8742edace7c70eeeb84dcf335f11ec56d82` | 2 |
| `origin/codex/structured-metadata-guardrails` | `8b22855ca71aa2936b03a76b91b2a18161cd0704` | 10 |
| `origin/codex/tracker-readable-evidence` | `bf4ba683153d4b344f6439373a1a11fe27443139` | 11 |
| `origin/codex/workbench-canon-spec-coverage` | `6965a32718fded60b190a8228eb0128b20cf2a92` | 43 |
| `origin/docs/promoted-grilling-audit` | `8a64e1e918f1a88bfe7c6422b55a28adecacc645` | 3 |

## Dirty and unresolved work preserved

- The primary integration checkout has a pre-existing edit to the frozen
  boundaries checkpoint. It was not copied into this candidate or altered.
- S-00I TK-01U's active lane has dirty feature-schema/runtime/template work.
  Its Spec/Task own delivery. No dirty code or feature content was imported.
- Three older audit/migration worktrees have generated Taskboard/catalog dirt;
  this candidate regenerates its own projections and leaves theirs alone.
- FND-Q24B and ADR-000B/C/D acceptance remain with S-00G; broader workflow
  corrections retain their existing S-00P/S-00J owners. Pending wording in a
  grilling record is not silently promoted by this integration request.
- Owner Human QA remains ongoing/failed as already recorded; no approval,
  completion, retirement, discard, version bump or main merge is performed.
- The worktree inventory identifies filesystem state only; it does not prove
  an agent process has finished. Active branches are not deleted here.

## Verification and limits

Baseline self-drift on the clean base reports `cleanUpdate: false`: one stale
S-00Q claim and six historical seed/provenance findings remain in their existing
owners. They are not repaired by changing historical provenance or inventing
fresh activity. Guardrail baseline is 78/100 (20 static, 25 drift resistance,
25 benchmark discipline, 8 outcome evidence). Remaining recommendations are
repeated real outcome trials, controls/prior/candidate comparisons, recent
candidate evidence and uncertainty estimates. Documentation checks establish
consistency and discovery, not improved agent outcomes or role implementation.

The focused Blueprint check initially rejected the new scope model because it
asserted superseded SCR-4A wording. Its assertion now checks ROLE-3 and refuses
the obsolete wording; the existing source-map/QA checks remain. Wiki validation
caught missing required article sections, which were added. Control fidelity,
Blueprint and ledger checks subsequently passed. Final full-suite, post-drift,
immutable-review and remote-containment results are appended below when run.
