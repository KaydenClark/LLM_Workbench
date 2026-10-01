# S-003E - foundry-origin skills triage

**Spec ID:** S-003E
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Decide, skill by skill, whether the eleven Foundry-origin and unrelated personal skills are adopted into the Workbench, retired, or handed back to the Foundry, without adopting any of them.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

A recorded per-skill decision, adopt, retire or hand back to the Foundry, for eleven skills that exist only in the owner's personal install (`~/.agents/skills/<name>/SKILL.md`, read-only), plus a draft Wiki article for each. This is the owner's accepted exception to one Spec per capability: one triage Spec for two groups. The `foundry` group (nine): `preflight`, `land`, `launch-flight`, `in-flight`, `landing-check`, `postflight-check`, `foundry-slice`, and two that are not Foundry skills but not Workbench-related either, `chronicle` and `clean-my-ai-harness-codex`. The `stances` group (two, origin foundry): `role-engineer` and `first-responder`. Every Foundry-origin article carries `origin: foundry` in its front matter and says in its text that the skill came from the Foundry, so the decision is revisited. This Spec adopts nothing by itself: any adoption gets its own later Spec, and no skill source moves or is copied into this repository.

## Why It Matters

The owner wants the draft skills wiki to expose skills that should connect and do not. These eleven are the largest unexamined block: a launch-to-closure chain (`preflight`, `launch-flight`, `in-flight`, `landing-check`, `land`, `postflight-check`) written against Foundry vocabulary and machinery. Until each is decided, neither the Core bundle nor the draft wiki can say whether the Workbench has a landing story of its own or only borrows the Foundry's. ADR-0026 (`workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md`) makes the stakes plain: the Foundry is a downstream extension and never the Workbench's source, copy target or prerequisite, so adoption must mean a Workbench-owned rewrite, never a dependency.

## Current Verified State

All eleven read from the personal install on 2026-09-30; none has an in-repo copy under `workbench/skills`, `skills-pending` or `skills-archive`. Matt counterpart: none for any of them.

- **Chain.** `preflight` verifies recorded state against Actuality and Canon, gating one launch on an exact Spec, ticket and Job Order, and calls `tools/preflight.mjs`, which is absent from this repository. `launch-flight` opens one Steward-serialized lane and hands `bootstrap-ready` to `in-flight`; `in-flight` monitors it and emits an Intent handoff to `landing-check`; `landing-check` independently verifies one candidate (it carries `scripts/landing-check.mjs`; `launch-flight` and `in-flight` carry `scripts/check-fixtures.mjs`); `land` repairs what blocks a merge into `integration` and names "combat medic" as itself; `postflight-check` reconciles records after Land and hands a missing delivery back to `/land`. Both `launch-flight` and `in-flight` mark six lifecycle fields `bootstrap-unavailable`, so the chain describes machinery its own text says is not built.
- **`foundry-slice`** cuts slices between Foundry layers through `K-###` socket contracts and defers execution to `Scheduled/Captain/FOUNDRY_SLICE_RUN.md`; it names `/tracer-bullet` for component-local work.
- **`role-engineer`** is a short Engineer stance (one claimed slice, TDD, push, hand off via `/handoff`) that defers to a Captain; `first-responder` stabilizes one recovery boundary from a deterministic flag under a Job Order and escalates to Combat Medic, citing S-017 TK-003 and TK-006.
- **`chronicle`** reads Codex's screen-recording buffer and Codex memories. **`clean-my-ai-harness-codex`** maps what Codex can see and prepares an approved cleanup; it ships `scripts/`, `references/`, `assets/` and a `plugin.yaml` with implicit invocation off.
- **Vocabulary.** Job Order, Steward, Captain, Clearance and Combat Medic appear nowhere in `LEXICON.md` or `RUNBOOK.md`; Canon, Actuality, Projection and Grounding are partly defined there. Expect `stale-name` and `dangling` findings throughout.
- **Neighbors already in the repository.** `workbench/skills/builder/SKILL.md`, `workbench/skills/save/SKILL.md`, `workbench/skills/reconciler/SKILL.md`, `workbench/skills/code-review/SKILL.md`, `workbench/skills/reviewer/SKILL.md`, `workbench/skills/tracer-bullet/SKILL.md`, the `doctor` command, the closeout procedure in `RUNBOOK.md`, and `skills-pending/resolving-merge-conflicts`. `RUNBOOK.md` reads `test-portability-matrix.mjs` as forbidding any active surface from naming a Foundry-dependent path, which constrains any adoption.

## Desired Behavior

1. Each of the eleven skills has exactly one recorded decision (adopt, retire, hand back) with the evidence behind it and an owner-facing tradeoff, in this Spec's evidence log and in the skill's article.
2. Each skill has a draft article from Template 2 with every "needs" and "reads and writes" item resolving to something real or logged as a finding (`dangling`, `stale-name`, `overlap`, `gap`, `conflict`, `missing-skill`).
3. The six-skill chain is decided as a chain, not six unrelated items: a partial adoption would leave a `dangling` finding for each missing neighbor, and the article set must show that.
4. Nothing is installed, copied, moved or archived, and no Foundry file is read as Workbench Canon.

## Decisions And Contracts

- ADR-0026 governs. "Adopt" can only mean a new, Workbench-owned Spec that rewrites the skill in Workbench vocabulary with no Foundry path, tool or Job Order dependency. "Hand back" means the article records the skill and its Foundry coupling for the owner's Foundry work and the Workbench does nothing further. "Retire" means the skill is not wanted by the Workbench and stays only in the owner's personal install.
- Starting hypotheses for step 1 to confirm or overturn, not decisions: hand back `preflight`, `launch-flight`, `in-flight`, `landing-check`, `postflight-check` and `foundry-slice` (Job Order, Steward and `K-###` machinery; Workbench neighbors are `doctor`, `reviewer`, `reconciler`, `tracer-bullet`); `land` and `first-responder` need a joint decision because `land` names itself as the Combat Medic that `first-responder` escalates to, and an adopted repair-tier landing skill would be a new Workbench Spec beside the Branch Completion rules in `AGENTS.md`; retire `role-engineer` if step 4 finds `builder` already covers it, logging any real gap as a finding against the `builder` Spec S-01P; `chronicle` and `clean-my-ai-harness-codex` are outside the Workbench (Codex-specific surfaces), with the latter compared against the harness-feedback-review family (S-003K) for overlap.
- Template 2's `origin` values are `workbench`, `matt` and `foundry`. Whether `chronicle` and `clean-my-ai-harness-codex` take a fourth value is open for S-002L; they are not Foundry skills and should not be mislabeled `foundry`.
- A decision is an owner-facing tradeoff (options, recommendation, cost), recorded in this Spec; it does not authorize implementation (`AGENTS.md`).

## Non-Goals

- Adopting, installing, copying, moving, archiving or editing any of the eleven, or editing `~/.agents/skills`.
- Reading or relying on Foundry repositories, `tools/preflight.mjs` as it exists there, or `Scheduled/Captain/FOUNDRY_SLICE_RUN.md`; the skill text is the evidence.
- Defining Job Order, Steward, Captain or Combat Medic in the Lexicon, or cutting the Foundry's coordination machinery into the Workbench.
- Changing the Core bundle, the skills README catalog, the manifest or any test.
- Evaluating whether the Foundry lifecycle (S-017) is correct.

## Dependencies And Blockers

S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 1 (reading) may start earlier. The `builder` Spec S-01P is the neighbor for `role-engineer`, S-003K for `clean-my-ai-harness-codex`, and S-01S for `postflight-check`; read their current state, do not edit them. No answer to the owner's pending question Q2A is needed here.

## Vertical Implementation Slices

No Task is cut yet; Tasks are cut from live Actuality at activation with `/to-tasks`. Intended slice direction, repeated per skill as a compact list (the chain skills are taken together first, since they carry the connections):

1. **Investigate ours.** For each skill, read `SKILL.md` and any `scripts/`, `references/`, `agents/` or `plugin.yaml` at a named commit of the personal repo (HEAD was `8832f07` on 2026-09-30). Record inputs, outputs, writes and composition: who calls whom, what a skill needs that is absent from this repository (`tools/preflight.mjs`, the `K-###` registry, Job Order issuance), and what is dangling when it runs alone. Record the true `origin` and provenance (`chronicle` appears to ship with Codex; confirm). Confirm no in-repo copy exists, so the "which copy is canonical" question is answered as not applicable.
2. **Draft the article.** Fill Template 2 for each at `workbench/wiki/skills-draft/foundry/<skill>.md` or `workbench/wiki/skills-draft/stances/<skill>.md` (tentative until S-002L decides), `skill_source: personal`, `origin: foundry` where it applies, with the Foundry origin stated in the text.
3. **Investigate the neighbor.** There is no Matt counterpart. Read the nearest Workbench neighbor per skill (listed under Current Verified State) and Matt's tree at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` for any skill that overlaps `land`, `foundry-slice` or `role-engineer`; name the nearest per skill.
4. **Compare.** Fill "Compared with Matt's" (neighbor, verdict, differences) and log findings, one per greppable line, including each Foundry term absent from `LEXICON.md` and `RUNBOOK.md`.
5. **Align the article.** Rewrite until each article matches real behavior, and record the per-skill decision with an owner-facing tradeoff in the evidence log and the article.
6. **Replaced.** This Spec has no skill-source step. Any adoption becomes its own later Spec under the S-00R route; nothing moves or is copied here.

## Acceptance Criteria

- [ ] Each of the eleven skills has a draft article with every Template 2 section filled, `origin: foundry` where applicable, and the Foundry origin stated in its text.
- [ ] Every "needs" and "reads and writes" item resolves to a real artifact or is a logged finding.
- [ ] Each skill has one recorded decision (adopt, retire or hand back) with an owner-facing tradeoff, and the six-skill chain is decided with its connections shown.
- [ ] Each article's "Compared with Matt's" section names its nearest neighbor and a verdict.
- [ ] No skill source, `~/.agents/skills` file, manifest, catalog row, Lexicon row or test is changed, and no adoption is claimed.
- [ ] Wiki validation and the full suite stay green for the draft-wiki changes.

## Testing Seams

Steps 1-5 are documentation. The seams are the draft-wiki structural checks owned by S-002L (front matter fields, sections, the draft-only stripped block) and `node workbench/tools/wiki.mjs validate`. Greppable finding lines (`F:<skill>:NN`) let a roll-up list every connection problem. No skill behavior is exercised, so no behavioral scenario is claimed.

## Verification Procedure

Run Wiki validation and the current full suite in `AGENTS.md`, then `node workbench/tools/spec-workbench.mjs render` and `doctor`. Confirm by `git status` and a diff that no file outside the draft wiki and this Spec changed, and that no path under `~/.agents/skills` was written. Record the commands and results here; separate-context review of the immutable candidate precedes integration.

## Documentation Impact

Eleven draft articles at `workbench/wiki/skills-draft/foundry/<skill>.md` (nine) and `workbench/wiki/skills-draft/stances/<skill>.md` (two), tentative until S-002L decides, linked from the collection's README index. No control is touched: no step 6 exists, so no `workbench/skills/README.md` row, Lexicon vocabulary, manifest or router entry changes beyond what S-002L delivers.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored for the 11-skill Foundry-origin triage under owner decisions 2 and 3; no Task cut | Personal-install sources and repository neighbors read at the pre anchor; no behavior change or scenario trial | This Spec authored; articles and decisions remain future work | S-002L and Tasks remain open |

## Completion Result

Not complete.

## Supersession

None.
