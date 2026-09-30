# Combined repair verification

Source candidate: `58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c`. Base: `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Date: 2026-09-19.

All **51 commands passed**, using a detached clean worktree. HEAD and tracked/untracked Git status were identical and clean before and after the run. Two independent fixture commands ran concurrently; only one append-only history regression ran. This result belongs to this source commit; subsequent proof/state-only documentation changes receive their own checks and exact-candidate review.

## Command results

| Command | Exit | Seconds |
|---|---|---|
| `node tools/test-spec-workbench.mjs` | 0 | 17.15 |
| `node tools/test-skill-catalog.mjs` | 0 | 0.55 |
| `node tools/test-skill-inspection.mjs` | 0 | 0.1 |
| `node tools/test-core-composition.mjs` | 0 | 1.09 |
| `node tools/test-project-evidence.mjs` | 0 | 0.89 |
| `node tools/test-genesis-from-decisions.mjs` | 0 | 19.62 |
| `node tools/test-blueprint-contract.mjs` | 0 | 0.08 |
| `node tools/test-session-transport.mjs` | 0 | 21.23 |
| `node tools/test-configured-host.mjs` | 0 | 1.51 |
| `node tools/test-core-skill-installer.mjs` | 0 | 8.11 |
| `node tools/test-workbench-layout.mjs` | 0 | 30.28 |
| `node tools/test-workbench-adoption.mjs` | 0 | 5.22 |
| `node tools/test-workbench-upgrade.mjs` | 0 | 5.78 |
| `node tools/test-workbench-tools.mjs` | 0 | 6.43 |
| `node tools/test-diagnostics.mjs` | 0 | 15.96 |
| `node tools/test-adr.mjs` | 0 | 4.53 |
| `node tools/test-governance-core.mjs` | 0 | 0.08 |
| `node tools/test-branch-closeout.mjs` | 0 | 4.9 |
| `node tools/test-wiki.mjs` | 0 | 2.66 |
| `node tools/test-sessions.mjs` | 0 | 0.58 |
| `node tools/test-notepads.mjs` | 0 | 9.04 |
| `node tools/test-visible-ids.mjs` | 0 | 0.07 |
| `node tools/test-workbench-identity.mjs` | 0 | 3.33 |
| `node tools/test-visible-id-consumers.mjs` | 0 | 2.17 |
| `node tools/test-direct-promotion.mjs` | 0 | 3.64 |
| `node tools/test-workbench-round-trip.mjs` | 0 | 3.03 |
| `node tools/test-cross-provider-fixture.mjs` | 0 | 2.05 |
| `node tools/test-portability-matrix.mjs` | 0 | 0.45 |
| `node tools/test-workbench-dogfood.mjs` | 0 | 0.5 |
| `node tools/test-evaluate-workbench.mjs` | 0 | 0.21 |
| `node tools/test-guardrail-audit.mjs` | 0 | 0.11 |
| `node tools/test-context-tools.mjs` | 0 | 0.22 |
| `node tools/test-outcome-trials.mjs` | 0 | 0.57 |
| `node tools/test-eval-runner.mjs` | 0 | 0.95 |
| `node tools/test-feedback-automation.mjs` | 0 | 0.55 |
| `node tools/test-symlink-invocation.mjs` | 0 | 0.69 |
| `node tools/test-control-fidelity.mjs` | 0 | 1.03 |
| `node tools/test-spec-citation-anchors.mjs` | 0 | 0.42 |
| `node tools/test-controls-vocabulary-sweep.mjs` | 0 | 0.06 |
| `node tools/test-spec-report.mjs` | 0 | 4.89 |
| `python3 tools/test-check-append-only.py` | 0 | 15.27 |
| `python3 evals/tasks/task_b_path_safety/test_grade.py` | 0 | 0.4 |
| `node tools/evaluate-workbench.mjs --path templates --include-controls` | 0 | 0.06 |
| `node workbench/tools/spec-workbench.mjs doctor` | 0 | 0.3 |
| `node tools/test-team-coordination.mjs` | 0 | 0.06 |
| `node tools/test-team-coordination-demo.mjs` | 0 | 0.1 |
| `node tools/test-socket-contract.mjs` | 0 | 0.06 |
| `node tools/test-self-drift.mjs` | 0 | 0.31 |
| `node tools/test-feedback-inventory.mjs` | 0 | 0.12 |
| `node workbench/tools/wiki.mjs validate` | 0 | 0.07 |
| `node workbench/tools/self-drift.mjs --phase post --json` | 0 | 0.35 |

## Regressions and evidence boundaries

- Approval binding first failed on uncommitted content; report fixtures now bind committed Spec/live/retired Task content, preserve administrative completion, separate premerge review from postmerge owner QA and exercise approval -> completion -> retirement continuously.
- Discard regressions exercise latest path incarnation, current directory recovery, historical citation conversion, refusal for operational links/missing owners, final-Task persistence after a fresh clone, allocation reservations and duplicate correction refusal.
- The strengthened retired corrective fixture failed when selection omitted its Task. The repair covers board/show/next/claim/close, blockers, unchanged retired completion/location and exclusion of ordinary historical Tasks.
- Active dependency diagnostics first disagreed with selection for a retired completed predecessor; both now agree. Discard of a ready corrective Task with a stale board first succeeded; the repaired gate refuses unfinished work without writing or staging anything.
- The history helper uses batched Git reads. The original and optimized checker produced exactly the same 6,978 bytes at `e7b0906025909b9edd626e967b15e526e5d02509` (SHA-256 `e4570a4dacefad9c634d97b3a7f1b43080d00ea6a2735845c61c5fe7c3f84820`). Its unchanged clean and four corruption cases passed. Commit order, row identities, retired history and orphan detection are unchanged.
- Earlier parallel lane suites and the initial combined run were incomplete; they are preserved as partial evidence and are not counted as full PASS. One dirty-source fixture attempt refused initialization before exercising the final discard regression; the committed rerun then failed at the expected missing refusal and passed after repair.

## Documentation and semantic review

Exactly 50 baseline completed Specs have 50 individual Wiki articles. A separate-context read compared principal capabilities, decisions and limitations for all 50; two omissions in S-051/S-053 were corrected and read back. The Q migration matrix pins source, article and owner identities and retains consumer/retirement gates. S reconciliation preserves all 33 feedback representations and verifies the 181-record lineage without claiming native consumer or export-generator proof. N dispositions preserve original reports and research vocabularies, including explicit missing-owner gaps.

Independent cold-start readback reached S-00O as current release owner, S-050/S-052 as live private/device proof owners, and the real I/J Human QA gates. Historical S-014/S-022 records remain blocked with explicit successor routes because unfinished historical Tasks cannot be silently closed. Installed-source identity does not prove native host callability. The self-drift machine report remains bounded and never certifies semantic freshness alone.

## Limits and checkable demo

Run `node tools/test-spec-report.mjs` for the bounded approval-to-retirement regression demo. No real record was retired or discarded. No owner approval, main promotion, installation, external-room update or release was performed. Unexpected I/O after successful removal remains a disclosed recoverable partial-mutation risk; known preflight failures refuse before writes. Static guardrail scores remain 78/100 for the root and do not demonstrate agent reliability.
