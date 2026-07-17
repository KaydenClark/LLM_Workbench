# Blueprint-To-Spec Coverage

**Scope:** LLM Workbench reusable harness product
**Verified:** 2026-07-17
**Canonical repo:** `/Users/kayden/GPT_OS/Workbench Factory`
**Remote:** `KaydenClark/LLM_Workbench`

This matrix records the canon harvest from current Blueprint, README, Runbook,
templates, skills, tools, tests, stable specs, live GitHub refs, and staged
branches. “Before conversion” describes the gap found; “Canonical owner after
conversion” is the durable spec that now owns the capability. The matrix is not
a tracker: live execution remains in stable specs and generated `TASKBOARD.md`.

## Branch And Staging Reconciliation

- The canonical checkout began clean on `claude/s-011-skills-import` at
  `32e99a49cf58a95320fdfaeff56266dec6ff2bbb`, with eighteen branch-side commits
  not present on `origin/integration` and ten integration-side commits absent
  from that checkout.
- Live `origin/integration` was
  `60f62917d4ed1ae8000478d62fab56a7afc54816`; live `origin/main` was
  `08ab78e5a59a68d2b04028fe71a2be488d5ae10e`.
- This checkpoint preserves the newer S-011 skill work and merges the already-
  reviewed integration state, including S-014 and PR #33's escaped-table parser
  repair, into `codex/workbench-canon-spec-coverage`.
- The reconciled `tools/*.mjs` and tool-test diffs are pre-existing remote
  integration work, not Planner implementation from this canon harvest.

## Coverage Matrix

| Capability | Evidence inspected | Before conversion | Canonical owner after conversion | Coverage result |
|---|---|---|---|---|
| Safe autonomy, scope, escalation, Git, docs, and proof rules | root/template `AGENTS.md` | covered by a current stable spec | [S-001](../specs/S-001-progressive-disclosure/SPEC.md) | covered |
| Progressive disclosure and single truth ownership | Blueprint, Taskboard, spec tool/tests | covered by a current stable spec | [S-001](../specs/S-001-progressive-disclosure/SPEC.md) | covered |
| Stable spec lifecycle, render, doctor, claim, close, and complete | `tools/spec-workbench.mjs`, lifecycle tests | covered by a current stable spec | [S-001](../specs/S-001-progressive-disclosure/SPEC.md), [S-004](../specs/S-004-safe-direct-claim/SPEC.md) | covered |
| Escape-safe Markdown table persistence | shared parser, lifecycle/feedback consumers, merged PR #33 tests | implemented but missing a cohesive durable capability owner | [S-021](../specs/S-021-escape-safe-table-persistence/SPEC.md); [S-014](../specs/S-014-workbench-release-candidate/SPEC.md) retains release evidence | covered |
| Generic copyable six-file harness and dogfood boundary | templates, root controls, evaluator | covered by a current stable spec | [S-001](../specs/S-001-progressive-disclosure/SPEC.md) | covered |
| Greenfield Genesis | `templates/GENESIS.md`, skill catalog | implemented but missing a durable capability spec | [S-015](../specs/S-015-bootstrap-adoption/SPEC.md) | covered |
| Existing-project Adoption and plan retirement | `templates/ADOPTION.md`, README, tests | implemented but missing a durable capability spec | [S-015](../specs/S-015-bootstrap-adoption/SPEC.md) | covered |
| Mechanical Claude scope permissions | `templates/.claude/settings.json`, docs | implemented but missing a durable capability spec | [S-015](../specs/S-015-bootstrap-adoption/SPEC.md) | covered |
| Constrained Git-write fallback | adoption test and S-009 | covered by a current stable spec | [S-009](../specs/S-009-git-write-constrained-adoption/SPEC.md), [S-015](../specs/S-015-bootstrap-adoption/SPEC.md) | covered |
| Fresh-clone adoption provenance | adoption test and S-012 | covered by a current stable spec | [S-012](../specs/S-012-adoption-provenance-proof/SPEC.md), [S-015](../specs/S-015-bootstrap-adoption/SPEC.md) | covered |
| Windows and canonical-path portability | portability and evaluator tests | covered by current stable specs | [S-008](../specs/S-008-windows-verification-portability/SPEC.md), [S-010](../specs/S-010-canonical-evaluator-entry/SPEC.md) | covered |
| Workbench skill catalog, discovery, and core delivery flow | active/pending skill folders and catalog tests | covered, but incomplete ticket decomposition | [S-011](../specs/S-011-agent-skills-adoption/SPEC.md) | covered with full remaining tickets |
| Remaining 17 selected skill rewrites | `skills-pending/`, README catalog | settled but not implemented and incompletely ticketed | [S-011](../specs/S-011-agent-skills-adoption/SPEC.md) TK-011 through TK-015 | covered |
| Cross-agent discovery and skill-catalog release input | discovery links and S-011 evidence | unresolved owner decision for Claude auth plus settled catalog work | [S-011](../specs/S-011-agent-skills-adoption/SPEC.md) TK-003 and TK-016; S-018 owns manifest/rollout | covered; owner gate explicit |
| Static local and GitHub branch evaluation | evaluator source, tests, benchmark docs | implemented but missing a durable capability spec | [S-016](../specs/S-016-static-evaluation-guardrails/SPEC.md) | covered |
| Stable 100-point guardrail audit and ranked gaps | audit source/tests and live report | implemented but missing a durable capability spec | [S-016](../specs/S-016-static-evaluation-guardrails/SPEC.md) | covered |
| Held-out second-domain grading | eval fixture and S-002 | covered by a current stable spec | [S-002](../specs/S-002-heldout-evaluation/SPEC.md) | covered |
| Portable outcome-trial runner and synthetic honesty proof | outcome tools/tests | implemented but missing a cohesive durable spec | [S-017](../specs/S-017-controlled-outcome-measurement/SPEC.md) | covered |
| Provider-neutral Git-ref trials and statistics | `evals/`, provider self-test | implemented but missing a cohesive durable spec | [S-017](../specs/S-017-controlled-outcome-measurement/SPEC.md) | covered |
| Multi-task uncertainty report | eval docs and current scorer behavior | settled but not implemented and missing a spec | [S-017](../specs/S-017-controlled-outcome-measurement/SPEC.md) TK-003 | covered |
| Real repeated outcome evidence | guardrail audit and result ledgers | unresolved owner decision for model/API spend | [S-017](../specs/S-017-controlled-outcome-measurement/SPEC.md) TK-004 and TK-005 | covered; owner gate explicit |
| Prospective Dungeon Friends pilot | S-003 and portfolio authorization | prior owner-authorization wording superseded; apparatus dependency remains | [S-003](../specs/S-003-dungeon-friends-pilot/SPEC.md), [S-017](../specs/S-017-controlled-outcome-measurement/SPEC.md) | covered and deferred |
| Downstream feedback return channel | HARNESS feedback template and Runbook | covered by a current stable spec | [S-006](../specs/S-006-feedback-automation/SPEC.md) | covered |
| Feedback discovery, ranking, locking, and independent gate | feedback source/tests and S-006/S-007 | covered by current stable specs | [S-006](../specs/S-006-feedback-automation/SPEC.md), [S-007](../specs/S-007-feedback-helper-import/SPEC.md) | covered |
| Normalized automation run outcomes and idle streaks | feedback source/tests and S-013 | covered by a current stable spec | [S-013](../specs/S-013-automation-run-outcomes/SPEC.md) | covered |
| Public MIT package and bounded publish scope | README, LICENSE, remote | implemented but missing an ongoing delivery owner | [S-018](../specs/S-018-versioned-delivery-rollout/SPEC.md) | covered |
| Exact-SHA audit, evidence status, and owner promotion | live PRs #33/#34, commit status, S-014 | implemented; S-014 canon stale after release | [S-014](../specs/S-014-workbench-release-candidate/SPEC.md) closeout, [S-018](../specs/S-018-versioned-delivery-rollout/SPEC.md) future contract | covered |
| Release history and merge-mode preservation | live `main` and `integration` graph | contradicted by live source: shipped tree, missing integration ancestry | [S-018](../specs/S-018-versioned-delivery-rollout/SPEC.md) TK-003 | covered with explicit repair |
| Deterministic release manifest | public package inventory, update skill, and S-011 catalog boundary | settled but not implemented and missing a spec | [S-018](../specs/S-018-versioned-delivery-rollout/SPEC.md) TK-002 and TK-004 consume S-011/TK-016 | covered |
| Downstream version upgrade and rollout proof | README, update-harness, adoption provenance | settled but not implemented and missing a spec | [S-018](../specs/S-018-versioned-delivery-rollout/SPEC.md) TK-004 and TK-005 | covered |
| Context packaging | context tool and self-test | implemented but missing a durable capability spec | [S-019](../specs/S-019-context-research-tools/SPEC.md) | covered |
| Durable question-focused research scaffolding | research template/tool/test | implemented but missing a durable capability spec | [S-019](../specs/S-019-context-research-tools/SPEC.md) | covered |
| Optional small-team coordination | `team templates/` versus v2.3 controls | contradicted by live source: duplicate Taskboard/proof model | [S-020](../specs/S-020-spec-native-team-coordination/SPEC.md) | covered with modernization tickets |
| Retired four-control-doc and Taskboard proof-log wording | bootstrap docs, S-005, old team templates | superseded | [S-005](../specs/S-005-bootstrap-doc-alignment/SPEC.md), [S-020](../specs/S-020-spec-native-team-coordination/SPEC.md) | covered |
| Visual and asset guardrails without a house style | root/template AGENTS and evaluator rubric | covered by a current stable spec | [S-001](../specs/S-001-progressive-disclosure/SPEC.md) | covered |

## Result

- Meaningful capability rows: 35
- Rows lacking stable spec ownership after conversion: 0
- Unjustified uncovered Blueprint items: 0
- Explicit owner choices: Claude authentication for S-011/TK-003; bounded
  model/API spend for S-017/TK-004.
- Live contradictions retained as work rather than hidden: PR #34 history shape
  in S-018 and pre-v2.3 team templates in S-020.
