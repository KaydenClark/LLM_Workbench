# S-005G - Repository CI And Fast Hooks

**Spec ID:** S-005G
**Status:** active
**Priority:** 2
**Owner:** codex-confirmed-followup
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** Integration PRs and integration updates run the canonical required suite; this repository alone has fast offline staged whitespace and JavaScript syntax checks at commit.
**Blockers:** none
**Latest event:** TK-007S claimed by codex-confirmed-followup.
**Next gate:** Correct the observed CI environment default under TK-007S, verify the final candidate and obtain fresh independent review before delivery.

> **Citation anchors.** pre=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad` post=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad`.

## Outcome

Integration PRs and integration updates run the canonical required suite; this repository alone has fast offline staged whitespace and JavaScript syntax checks at commit.

## Why It Matters

The owner requested faster, clearer skill building and confirmed this concrete scope and reviewed delivery into integration.

## Current Verified State

Baseline at the `pre` citation anchor:

Actions are enabled with read-only defaults, the repository is public and has no workflows or installed hooks. S-002R remains a pending-skill alignment Spec with installation outside its scope.

## Desired Behavior

The acceptance below defines this bounded follow-up. Existing claims, source ownership and delivery gates remain in force.

## Decisions And Contracts

- Owner confirmation: Slack T0C7LRB65JS / C0C7HJCEJ13, thread 1791443132.516449; readback 1791445519.027649, owner answer 1791446326.652929: "Yes that matches. you are confirmed for 1-3". The parent relayed reviewed integration delivery authorization; the ADR fix was approved earlier.
- Main promotion remains an owner act. Confirmation adds no design commitments beyond the requested endpoint.
- One writer, `codex-confirmed-followup`, owns these follow-up records and shared projection updates.

## Non-Goals

- No disposable-fixture/shared-fixture-builder proposal or wider harness redesign.
- No glossary-retirement or domain-modeling lane changes.
- No finalized outer workflow ordering, new approval ceremony, paid billing, credentials, security settings, repository permissions, branch protection or other-project hooks.

## Dependencies And Blockers

- Existing glossary and domain-modeling assemblies remain independent; no dependency on merging them.
- Final integration delivery requires mandatory full verification and separate-context review of the assembled candidate.

## Vertical Implementation Slices

One complete-path Task, [TK-007S - .github/workflows/verify.yml](tasks/TK-007S/TASK.md), owns this capability's implementation and proof. The native Task record owns its state.

## Acceptance Criteria

- [x] One standard Linux workflow reads the existing canonical RUNBOOK suite and has bounded concurrency and runtime.
- [x] Hooks check staged bytes, including partially staged files, and avoid network work or the full suite at commit.
- [x] Install and recovery are repository-local, idempotent where safe, and refuse existing-hook collisions and other repositories.
- [x] Hosted CI and canonical hook installation have explicit post-delivery checks scoped to LLM_Workbench; pre-publication success is not claimed.

## Testing Seams

Public git commit scenarios for valid/invalid/partially staged content, collision and repository scope; workflow checks and full RUNBOOK verification.

## Verification Procedure

Use the named focused seams while editing, then the one full suite listed in RUNBOOK.md on the final assembled candidate. A changed candidate needs fresh review.

## Documentation Impact

Owning files: .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md. Update existing owners, preserve evidence and avoid copied procedures.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-08 | TK-007S | Task closed | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md | none in implementation Git state at close: dirty-tree (15 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005E-readback-skill/tasks/TK-007Q/TASK.md, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005F-workflow-reference/tasks/TK-007R/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/SPEC.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, and 5 more) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA |
| 2026-10-08 | review | Review verdict: fail at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 [31d6e0c017e5] #1 | continue TK-007S: Inspect index modes and syntax-check ordinary staged file blobs only, with a real Git symlink regression; continue TK-007S: Refuse multiply linked hook snapshot files before writes and add a refusal regression. | OpenAI Codex CLI 0.159.3; fresh thread 01a11ac6-b41b-74c0-a8b4-b326021cae37; configured gpt-6.1-sol/high; read-only ephemeral | 2 |
| 2026-10-08 | TK-007S | Task closed (run 2) | corrected code 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc; canonical 55/55 commands pass in 948.2s; focused ADR lifecycle 5/5 and real-Git hook cases 4/4 pass; Blueprint semantic assertion and Wiki validation pass; score remains 73 and baseline drift remains 23 | .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md | none in implementation Git state at close: dirty-tree (15 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/readback-identity.json, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005F-workflow-reference/proof/control-fidelity-home-red.txt, workbench/specs/S-005F-workflow-reference/tasks/TK-007R/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/SPEC.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/corrected-full-suite.txt, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/corrected-guardrail.json.gz, and 5 more) and unpushed (ahead 12 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication, local verified completion is not remote delivery or owner Human QA |
| 2026-10-08 | review | Review verdict: fail at 30d211102c28ab0c55e94b910c4e4949541eaec7 [5979835a5767] #2 | continue TK-007S: Honor ordinary .js CommonJS and staged package module context, retain .mjs and .cjs modes, and add narrow real-Git regressions. | OpenAI Codex fresh read-only ephemeral CLI context 01a11b05-523b-7a11-a7e0-bf6da36f1de9, configured gpt-6.1-sol/high, runtime 0.159.3 | 1 |
| 2026-10-08 | TK-007S | Round-two corrective return | Default CommonJS .js red reproduces module-mode rejection; five real-Git hook cases now pass, including explicit extensions and staged nearest-package metadata. | Owned raw proof with whitespace stored as gzip without changing its bytes; review-round-two.md.gz preserves the independent report | Full clean-candidate verification and fresh review pending |
| 2026-10-08 | TK-007S | Task closed (run 3) | code 1711be148b6b0d734c84531b3a122000dfa536c6; canonical 55/55 commands verified in two permission segments on unchanged source (955.8s measured execution); focused ADR 62/62 and real-Git hook scenarios 5/5 pass; range whitespace check clean; score 73 and exact baseline 23 drift findings remain | .github/workflows/verify.yml; .githooks/; tools/setup-pre-commit.mjs; tools/verify.mjs; tools/test-pre-commit.mjs; RUNBOOK.md | none in implementation Git state at close: dirty-tree (13 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/proof/adr-round-three-green.txt.gz, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005F-workflow-reference/SPEC.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/SPEC.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/hooks-round-three-green.txt.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/round-three-guardrail.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/round-three-sandbox-suite.txt.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/round-three-self-drift.json.gz, and 3 more) and unpushed (ahead 15 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication, locally verified completion is not remote delivery or owner Human QA |
| 2026-10-08 | review | Review verdict: pass at 29b1da5759755d9cce38d9d037553fbc700dac48 [fa450aa952c8] #3 | none | OpenAI Codex fresh independent Director thread 01a11b15-797c-72a1-8886-b2e20df641e8, read-only ephemeral CLI 0.159.3, configured gpt-6.1-sol/high, exact model not independently exposed within reviewer context | none |
| 2026-10-08 | delivery | Draft PR publication | Four native assembled gates pass; submitted e21e5e8a20a219cccb7c52e4ff64da80b3a4753f | [Maintained hosted CI, integration containment and hook observations](https://github.com/KaydenClark/LLM_Workbench/pull/438) | No hosted CI or integration/hook success claimed at this publication snapshot; owner Human QA and main remain separate |
| 2026-10-08 | review | Review verdict: fail at 308d0afb083e5b14316f0eb73543759d5896087b [fa450aa952c8] #4 | continue TK-007S: Hosted CI proved fixture Git initialization uses another default branch, while existing lifecycle fixtures require main, set an ephemeral Git init default only for the CI step and add a narrow effective-configuration regression without harness redesign. | codex-confirmed-followup Builder CI QA, observed hosted run 37767424255 only, own failure evidence not independent approval | 1 |
| 2026-10-08 | TK-007S | Hosted CI corrective return | [Hosted failure](proof/hosted-initial-failure.txt.gz): existing fixture checked out main after default initialization created another branch; narrow effective-config regression red then green, six hook/CI cases pass | CI-only environment default, no fixture-builder or configuration-file redesign; [canonical hook proof](proof/canonical-hook-installation.json) records reviewed snapshot installation while CI was pending | Fresh full verification and independent review before the corrective draft update |

## Completion Result

Initial local checkpoint, before round-one review: implementation verified locally at `ffa941905c0667c92065d58894f78f35302b31be`. The canonical RUNBOOK suite passed all 55 commands in 849.3 seconds, with focused red/green and source checks. Native Codex discovered readback and produced the three bounded outputs recorded in the Reusable Readback Skill proof. Mandatory self-drift findings remained unchanged at 23; score remained 73, so no globally clean Workbench or agent-outcome claim is made. At that checkpoint, independent review and integration delivery were the next gates. That local checkpoint claimed no hosted CI or canonical hook installation; owner Human QA and main remain separate later gates.


Corrected implementation verified locally at `65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc`: all 55 canonical commands pass in 948.2 seconds. The continued ADR, workflow and hook Tasks preserve their earlier proof and round-one findings. Targeted edge regressions and the corrected workflow contract pass. The unchanged readback native trace remains bounded to its recorded candidate. This result establishes local implementation verification; actual independent review, hosted CI, integration containment and repository-local hook installation are recorded as they occur in the append-only evidence. Owner Human QA and main remain separate.

Final correction verified locally at `1711be148b6b0d734c84531b3a122000dfa536c6`: canonical 55/55 commands verified on unchanged source across permission segments in 955.8 measured execution seconds, with 62 ADR tests and five real-Git hook cases passing. Earlier local results remain bounded to their candidates. The unchanged readback demo still supports three synthetic outputs only. Independent review and actual delivery observations remain pending in this local snapshot; owner Human QA and main remain separate.

## Remaining Limitations Or Follow-Up Specs

- Actual hosted CI and hook installation can only be observed after the reviewed candidate is published and delivered. This Task carries that final proof to the owner's requested integration endpoint; the pre-integration gate checks the implementation and the named verification route.
- Existing Workbench drift remains separately owned; passing this patch's tests cannot establish a globally clean Workbench or agent reliability.

## Supersession

- Supersedes: none
- Superseded by: none
