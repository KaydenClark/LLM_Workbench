# S-005E - Reusable Readback Skill

**Spec ID:** S-005E
**Status:** active
**Priority:** 2
**Owner:** codex-confirmed-followup
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** The owner can invoke /readback at any time to confirm or correct how an answer, concept or direction is understood.
**Blockers:** none
**Latest event:** TK-007Q closed with proof.
**Next gate:** Fresh independent assembled review, then reviewed integration delivery; owner Human QA and main remain separate.

> **Citation anchors.** pre=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad` post=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad`.

## Outcome

The owner can invoke /readback at any time to confirm or correct how an answer, concept or direction is understood.

## Why It Matters

The owner requested faster, clearer skill building and confirmed this concrete scope and reviewed delivery into integration.

## Current Verified State

Baseline at the `pre` citation anchor:

Grilling already reads answers and final concepts back, but no independently discoverable readback skill exists.

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

One complete-path Task, [TK-007Q - workbench/skills/readback/SKILL.md](tasks/TK-007Q/TASK.md), owns this capability's implementation and proof. The native Task record owns its state.

## Acceptance Criteria

- [x] The small skill exposes understood intent, constraints, intended result, assumptions, unresolved choices and the requested next action.
- [x] Owner reasons are separate from agent inference; unsupported design commitments remain pending.
- [x] Explicit confirmation carries only the requested endpoint; prior authorization is preserved and silence never confirms.
- [x] The Workbench-only first delivery is discoverable through both existing lane adapters and the maintained catalog.

## Testing Seams

Existing skill catalog/lane inspection and bounded fresh-context readback examples; full RUNBOOK verification.

## Verification Procedure

Use the named focused seams while editing, then the one full suite listed in RUNBOOK.md on the final assembled candidate. A changed candidate needs fresh review.

## Documentation Impact

Owning files: workbench/skills/readback/SKILL.md; workbench/manifest.json; workbench/skills/README.md; RUNBOOK.md. Update existing owners, preserve evidence and avoid copied procedures.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-08 | TK-007Q | Task closed | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | workbench/skills/readback/SKILL.md; workbench/manifest.json; workbench/skills/README.md; RUNBOOK.md | none in implementation Git state at close: dirty-tree (11 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/SPEC.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005E-readback-skill/tasks/TK-007Q/TASK.md, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/full-suite.txt, and 1 more) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA |
| 2026-10-08 | review | Review verdict: pass at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 [348fb5c4fa1b] #1 | none | OpenAI Codex CLI 0.159.3; fresh thread 01a11ac6-b41b-74c0-a8b4-b326021cae37; configured gpt-6.1-sol/high; read-only ephemeral | none |
| 2026-10-08 | TK-007Q | Corrected assembled verification | corrected code 65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc; canonical 55/55 commands pass in 948.2s; focused ADR lifecycle 5/5 and real-Git hook cases 4/4 pass; Blueprint semantic assertion and Wiki validation pass; score remains 73 and baseline drift remains 23 | Readback source unchanged; native three-case proof remains bounded | Fresh combined review and integration delivery pending |
| 2026-10-08 | review | Review verdict: pass at 30d211102c28ab0c55e94b910c4e4949541eaec7 [e1e5e324de8e] #2 | none | OpenAI Codex fresh read-only ephemeral CLI context 01a11b05-523b-7a11-a7e0-bf6da36f1de9, configured gpt-6.1-sol/high, runtime 0.159.3 | none |
| 2026-10-08 | TK-007Q | Final corrected assembly verification | code 1711be148b6b0d734c84531b3a122000dfa536c6; canonical 55/55 commands verified in two permission segments on unchanged source (955.8s measured execution); focused ADR 62/62 and real-Git hook scenarios 5/5 pass; range whitespace check clean; score 73 and exact baseline 23 drift findings remain | Existing owned readback/reference docs and proof | Fresh combined review and delivery pending |

## Completion Result

Initial local checkpoint, before round-one review: implementation verified locally at `ffa941905c0667c92065d58894f78f35302b31be`. The canonical RUNBOOK suite passed all 55 commands in 849.3 seconds, with focused red/green and source checks. Native Codex discovered readback and produced the three bounded outputs recorded in the Reusable Readback Skill proof. Mandatory self-drift findings remained unchanged at 23; score remained 73, so no globally clean Workbench or agent-outcome claim is made. At that checkpoint, independent review and integration delivery were the next gates. That local checkpoint claimed no hosted CI or canonical hook installation; owner Human QA and main remain separate later gates.

Corrected implementation verified locally at `65dcac7658f78a0eaaccd6f72efaa83b19cfd5bc`: all 55 canonical commands pass in 948.2 seconds. The continued ADR, workflow and hook Tasks preserve their earlier proof and round-one findings. Targeted edge regressions and the corrected workflow contract pass. The unchanged readback native trace remains bounded to its recorded candidate. This result establishes local implementation verification; actual independent review, hosted CI, integration containment and repository-local hook installation are recorded as they occur in the append-only evidence. Owner Human QA and main remain separate.

Final correction verified locally at `1711be148b6b0d734c84531b3a122000dfa536c6`: canonical 55/55 commands verified on unchanged source across permission segments in 955.8 measured execution seconds, with 62 ADR tests and five real-Git hook cases passing. Earlier local results remain bounded to their candidates. The unchanged readback demo still supports three synthetic outputs only. Independent review and actual delivery observations remain pending in this local snapshot; owner Human QA and main remain separate.

## Remaining Limitations Or Follow-Up Specs

- Existing Workbench drift remains separately owned; passing this patch's tests cannot establish a globally clean Workbench or agent reliability.

## Supersession

- Supersedes: none
- Superseded by: none
