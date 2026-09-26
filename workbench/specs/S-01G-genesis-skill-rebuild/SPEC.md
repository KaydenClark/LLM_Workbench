# S-01G - genesis skill rebuild

**Spec ID:** S-01G
**Status:** active
**Priority:** 2
**Owner:** claude-lane-C-worker
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Create a new Workbench room from a founding prompt and a recoverable remote boundary.
**Blockers:** none.
**Latest event:** TK-00X closed with proof.
**Next gate:** Separate-context review of the TK-00X candidate, then owner Human QA of conversational fidelity on `integration`, then `complete S-01G`.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`4940233e74a93a8390f73f8ac6ba39ef53131798`.

## Outcome

Create a new Workbench room from a founding prompt and a recoverable remote boundary. This Spec owns the genesis skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets genesis reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- `workbench/skills/genesis/SKILL.md` is the manifest-declared core source at the pre anchor.
- `workbench/wiki/skill-genesis.md` is not yet routed as a current skill article; its existence and links must be rechecked before authoring.
- S-00V's managed lane is a current bootstrap dependency. No fresh behavioral scenario for this per-skill delivery is claimed by this planning packet.

## Desired Behavior

1. A greenfield target receives project identity, controls, managed lanes and recovery proof based on the actual prompt.
2. An existing project routes to adoption; template room state is not inherited as the new project's own state.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns genesis alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; accepted controls and this assigned Spec establish the target.
- The oversized unmerged Skills Wiki packet is planning evidence, not a live S-00V owner. S-00V now names Portable Workbench. For the shared grilling/notepad/grill-me journey, S-00W remains the design source while the individual skill Specs own delivery.

## Non-Goals

- Rebuilding another skill, changing an unrelated room or publishing to a personal catalog.
- Treating a source review, string assertion, article or green suite as owner Human QA.
- Introducing a new skill taxonomy, Wiki collection, parallel router or global installation.

## Dependencies And Blockers

No other skill rebuild is a blanket prerequisite. Check current controls and the relevant source owner before changing shared wording. A newly observed architecture, safety or public-contract choice remains an owner gate in this Spec; do not invent its answer.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00X | Audit genesis, deliver the smallest supported source/documentation change and prove the routed article | done | none | Audit found the skill omitted the skills-lane install (validate --genesis refused the room skill-lane-missing) and named no mechanical route check (init --provenance genesis accepts an existing-code folder the classifier calls adoption); red b07df6d then green 690e97a make the skill classify before writing, install the skills lane and name the readiness gate; full AGENTS suite 48/48 at aced185; fresh-context scenario built, validated and pushed a clean room from a founding prompt without Template state and refused an existing-code folder unchanged, routing it to /adoption; wiki validate ok |

### TK-00X - Deliver the genesis skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] A greenfield target receives project identity, controls, managed lanes and recovery proof based on the actual prompt.
- [x] An existing project routes to adoption; template room state is not inherited as the new project's own state.
- [x] The named scenario is observed in a fresh or otherwise independent context: A clean target is generated and verified while an existing-code target is refused or rerouted.
- [x] `workbench/wiki/skill-genesis.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A clean target is generated and verified while an existing-code target is refused or rerouted. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-genesis.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names genesis's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-00X and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |
| 2026-09-26 | TK-00X | Audit against Desired Behavior; source gap found and repaired red/green | Audit of `workbench/skills/genesis/SKILL.md` (blob `afe143f`, unchanged since `4b6d05c`) against `templates/GENESIS.md`, `workbench/tools/workbench-layout.mjs` (`initialize`, `validate --genesis`), `tools/workbench-classify.mjs`, `tools/workbench-tools.mjs`, `tools/workbench-skills.mjs`, `tools/genesis-from-decisions.mjs` (`destinationPath` refuses an existing destination), RUNBOOK Skills lane / V3 support-root / Room lifecycle classification checks, the `adoption` and `grilling` skills, the `workbench/skills/README.md` row and `tools/test-skill-catalog.mjs`. Pre-change probe in a scratch room from the claim commit (`C-s01g-probe-pre.txt`): following only the commands the skill enumerated (`init` plus `workbench-tools.mjs install`, seven filled controls, router, active first Spec) made `validate --genesis` exit 1 `skill-lane-missing`; the same room plus `workbench-skills.mjs install` returned `valid`. On a scratch folder with code and one commit, `classify` returned `adoption` while `init --provenance genesis` exited 0 `initialized`: nothing but the skill's prose routes an existing-code target, and the skill named no mechanical check. Red `b07df6d` (pre-rebase `3d81b61`): new `test-skill-catalog.mjs` assertions fail with "genesis routing and managed-lane contract must use node tools/workbench-classify.mjs classify --project". Green `690e97a` (pre-rebase `3eb6b27`): step 2 classifies an empty target before writing and continues only on `genesis`, routing `adoption` to `/adoption`, `upgrade` to `/update-harness` and stopping on `unclassifiable`; step 4 adds `node tools/workbench-skills.mjs install --project PATH`; step 8 names the `validate --project PATH --genesis` readiness gate. Targeted on the committed tree: test-skill-catalog, test-skills-lane, test-core-skill-installer, test-workbench-layout, test-core-composition, test-genesis-from-decisions, test-workbench-round-trip all exit 0 | `workbench/skills/genesis/SKILL.md` (blob now `1ed174c`); `tools/test-skill-catalog.mjs` | Tool gap recorded, not changed: `workbench-layout.mjs init --provenance genesis` accepts a directory the classifier routes to adoption; a refusal would change shared bootstrap tooling's public behavior (no Codex S-00O packet claims it) |
| 2026-09-26 | TK-00X | Fresh-context scenario: one general-purpose Claude Opus 5.5 subagent given only the genesis skill (blob `1ed174c`), a clone of the candidate release at `3eb6b27` (origin a local bare copy) and a scratch room with an absent target `temp-converter`, its local bare remote, and `legacy-invoicer` (README, package.json, src/invoice.js, one commit `827cd1d`); owner scripted by the implementing agent; the run was interrupted once by a rate limit and resumed with the same instructions | Turn 1 founding prompt (tiny private Node.js Celsius/Fahrenheit CLI, no dependencies): created the empty folder, `classify` verdict `genesis`; test-first scaffold (red ERR_MODULE_NOT_FOUND, green 2/2), demo `node bin/temp-converter.js 100 C` prints `100 °C = 212 °F`; `init --default-branch main --integration-branch integration`, `workbench-tools.mjs install`, `workbench-skills.mjs install` (22 skills plus both discovery links); filled seven controls, `.claude/settings.json`, router, feedback lane with two friction rows, founding prompt verbatim in `workbench/wiki/founding-prompt.md` and S-001; first Spec S-001 active with TK-001 ready; open questions recorded as working assumptions, no ADR invented; first doctor refused a `planned` task status, fixed to `blocked`; `validate --genesis` failed only `integration-branch-missing` until the branches existed; commit `6543c6a` on `claude/genesis-temp-converter`, `main` and `integration` created at it and all three pushed; gate `valid`, doctor ok, green again from a fresh clone; evidence row commit `8554ab6` pushed. Turn 2 "also run genesis on legacy-invoicer": `classify` verdict `adoption`; refused, wrote nothing, told the owner `/adoption` is the route that keeps its code and history. Implementer verification: from the release clone `validate --genesis` on the room returned `valid`, room doctor ok, `npm test` 0 failures, demo output as above; room `workbench/specs` holds only its own `S-001-celsius-fahrenheit-cli` and the ADR register is empty (no Template or Workbench room state inherited); bare remote refs `main`=`integration`=`6543c6a`, task branch `8554ab6`; `legacy-invoicer` still at `827cd1d`, clean, file hashes identical to the pre-run record; release clone clean | None | One run, one model, scripted owner, local bare remotes; not owner Human QA or a repeated trial; fresh-Template `derive` path not exercised (covered by test-genesis-from-decisions). Agent guesses surfaced (recorded, not changed): `main` pointed at the generation commit because a fresh repository has no prior `main` commit; Runbook merge/cleanup commands listed as not yet exercised although Phase 5 asks every command to have run; Node 26 `node --test dir/` treats the directory as a file. Agent briefly moved one scaffold file one level above the trial room while proving red and moved it back |
| 2026-09-26 | TK-00X | Gates before close | Full AGENTS suite 48/48 on committed candidate `aced185` (base `86b121f`; log first line `dirty: []`). Guardrail `evaluate-workbench --path templates --include-controls` 106.6/113 before (claim commit, pre-rebase `f4ea2a1`) and after (`aced185`), summary identical, remaining recommendation the pre-existing Team coordination item. Self-drift pre (`f4ea2a1`) and post (`aced185`) both exit 1, `cleanUpdate` false, the same seven pre-existing attention findings (stale-claim, five stale-seed, unverified-provenance). `wiki.mjs validate` ok; `render` and `doctor` no blocking finding. Rebase onto `86b121f` conflicted only on the `workbench/wiki/MEMORY.md` router (kept both the adoption and genesis entries). Bounded semantic check: `templates/GENESIS.md` (green-field only, Phase 6 skills lane, readiness gate), RUNBOOK Skills lane check ("Genesis and Adoption run `install`") and Room lifecycle classification check, the `adoption` skill's classify-first route and `workbench/skills/README.md` row all agree with the repaired skill | Added `workbench/wiki/skill-genesis.md` and its router entry in `workbench/wiki/MEMORY.md`. Docs checked; no update needed for RUNBOOK, BLUEPRINT, LEXICON, templates or `workbench/skills/README.md`, because RUNBOOK and `templates/GENESIS.md` already state the skills-lane install, the classifier and the readiness gate the skill now names, the catalog row's one-line description is unchanged, and those control files are outside this lane | Coordination hand-backs this run: zero |
| 2026-09-26 | TK-00X | Task closed | Audit found the skill omitted the skills-lane install (validate --genesis refused the room skill-lane-missing) and named no mechanical route check (init --provenance genesis accepts an existing-code folder the classifier calls adoption); red b07df6d then green 690e97a make the skill classify before writing, install the skills lane and name the readiness gate; full AGENTS suite 48/48 at aced185; fresh-context scenario built, validated and pushed a clean room from a founding prompt without Template state and refused an existing-code folder unchanged, routing it to /adoption; wiki validate ok | workbench/skills/genesis/SKILL.md; workbench/wiki/skill-genesis.md and its MEMORY.md router entry; RUNBOOK, BLUEPRINT, LEXICON, templates and skills README checked with no update needed because RUNBOOK and templates/GENESIS.md already state the skills-lane install, classifier and readiness gate | Separate-context candidate review; owner Human QA; tool gap recorded not changed (workbench-layout init --provenance genesis accepts a folder the classifier routes to adoption); protocol ambiguities the scenario surfaced (main at the generation commit, unexercisable Runbook merge commands); installed personal skill copies not updated |

## Completion Result

TK-00X audited `workbench/skills/genesis/SKILL.md` and found two gaps against the accepted behavior. Following only the commands the skill listed left the skills lane empty, so the readiness gate refused the room with `skill-lane-missing`. And nothing mechanical routed an existing-code target: `init --provenance genesis` accepts one that the classifier reports as `adoption`. A red catalog test pinned the contract and the green change made the skill classify the target before writing and continue only on `genesis`, install the receipt-backed skills lane, and name the `validate --genesis` readiness gate. The tool-level refusal in `init` is recorded as a remaining gap, not changed. `workbench/wiki/skill-genesis.md` and its router entry were authored. One fresh-context scenario built, verified and pushed a clean room from a founding prompt without inheriting Template state, and refused an existing-code folder, routing it to `/adoption` with the folder unchanged. A separate-context review is pending; owner Human QA remains.

## Supersession

- Supersedes: the genesis article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
