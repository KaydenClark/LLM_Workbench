# S-005D - Decision Relocation Link Repair

**Spec ID:** S-005D
**Status:** active
**Priority:** 2
**Owner:** codex-confirmed-followup
**Stance:** Builder
**Updated:** 2026-10-08
**Catalog description:** Decision lifecycle moves preserve outgoing relative targets and repair incoming Grill Board references without rewriting historical evidence.
**Blockers:** none
**Latest event:** Independent round-one review failed; bounded correction underway. Earlier event: TK-007P claimed by codex-confirmed-followup.
**Next gate:** Close TK-007P with verification and documentation proof.

> **Citation anchors.** pre=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad` post=`45d79a453cf21520317ff7ec48e2d299a2f6a0ad`.

## Outcome

Decision lifecycle moves preserve outgoing relative targets and repair incoming Grill Board references without rewriting historical evidence.

## Why It Matters

The owner requested faster, clearer skill building and confirmed this concrete scope and reviewed delivery into integration.

## Current Verified State

Baseline at the `pre` citation anchor:

S-003X delivered record lifecycle tools and has owner Human QA; this is a later narrow defect, not a reopening of its accepted result.

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

One complete-path Task, [TK-007P - workbench/tools/adr.mjs](tasks/TK-007P/TASK.md), owns this capability's implementation and proof. The native Task record owns its state.

## Acceptance Criteria

- [x] ADR and DDR accept/archive moves preserve unmoved glossary, Spec and Wiki targets, queries, fragments and encoding.
- [x] The Grill Board README and current glossary are incoming-reference surfaces.
- [x] Evidence bytes and unrelated files remain unchanged; already-valid link spelling is preserved.

## Testing Seams

Existing tools/test-adr.mjs regressions, Wiki relocation checks and Grill Board tests; full RUNBOOK verification.

## Verification Procedure

Use the named focused seams while editing, then the one full suite listed in RUNBOOK.md on the final assembled candidate. A changed candidate needs fresh review.

## Documentation Impact

Owning files: workbench/tools/adr.mjs; tools/test-adr.mjs; workbench/skills/to-docs/SKILL.md. Update existing owners, preserve evidence and avoid copied procedures.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-08 | TK-007P | Task closed | code ffa941905c0667c92065d58894f78f35302b31be; canonical 55/55 commands pass in 849.3s; focused ADR/Wiki/Board, catalog/lane, workflow pointers and staged-hook regressions pass; fresh native readback 3 synthetic cases; unchanged 23 drift findings and 73 score | workbench/tools/adr.mjs; tools/test-adr.mjs; workbench/skills/to-docs/SKILL.md | none in implementation Git state at close: dirty-tree (9 files: workbench/specs/S-005D-decision-relocation-link-repair/SPEC.md, workbench/specs/S-005D-decision-relocation-link-repair/tasks/TK-007P/TASK.md, workbench/specs/S-005E-readback-skill/proof/native-readback.txt, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-guardrail-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-post.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/followup-self-drift-pre.json.gz, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/full-suite.txt, workbench/specs/S-005G-repository-ci-and-fast-hooks/proof/verification.json) and unpushed (ahead 4 behind 0 of origin/integration); recorded reason: Owner requires independent review before publication; this is a local verified completion checkpoint, not remote recovery or owner Human QA |
| 2026-10-08 | review | Review verdict: fail at b5571bf8ec6bbc9a4f5918e942ca3aa5f248dbc0 [57e47a3e2070] #1 | continue TK-007P: Separate Markdown destination wrappers and titles before rebasing, preserving the path target and exact wrapper/title bytes, with narrow regressions. | OpenAI Codex CLI 0.159.3; fresh thread 01a11ac6-b41b-74c0-a8b4-b326021cae37; configured gpt-6.1-sol/high; read-only ephemeral | 1 |

## Completion Result

Implementation verified locally at `ffa941905c0667c92065d58894f78f35302b31be`. The canonical RUNBOOK suite passed all 55 commands in 849.3 seconds, with focused red/green and source checks. Native Codex discovered readback and produced the three bounded outputs recorded in the Reusable Readback Skill proof. Mandatory self-drift findings remained unchanged at 23; score remained 73, so no globally clean Workbench or agent-outcome claim is made. Independent review and integration delivery are the next gates. Hosted CI and canonical hook installation will be observed after delivery; owner Human QA and main remain separate later gates.

Current correction: the separate review findings are implemented under the same continued Task. Focused and final verification, fresh assembled review and reviewed integration delivery remain pending; the earlier local pass above is bounded to its named candidate.

## Remaining Limitations Or Follow-Up Specs

- Existing Workbench drift remains separately owned; passing this patch's tests cannot establish a globally clean Workbench or agent reliability.

## Supersession

- Supersedes: none
- Superseded by: none
