<!-- checkpoint: promoted 2026-09-04 from workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md -->
# Grilling — Standalone Workbench boundaries redesign
STATUS: PAUSED — CHECKPOINT 2026-09-04 18:06 MDT · by Codex
RESUME WITH: "resume standalone Workbench boundaries redesign"

## Resume header

- What this is: the locked v3.1.1 design for an autonomous, low-ceremony LLM Workbench.
- Done so far: Q1-Q16 are locked; their complete question-and-decision list follows below.
- Next step: invoke `/make-it-so` to promote the decisions and implement the smallest v3.1.1 slice.
- Blockers / open decisions: none. Reconcile Q1/Q13 wording with Q14's chat-only Round One outcome, state that Q6 autonomy remains within an assigned task under Q15, and sequence Q11's feedback workflow after Round One during promotion.

Started 2026-09-04. Preparation complete; interview began and all planned questions are locked.

## Read this first

The proposed product is a project-local handoff and execution environment.
A capable agent should enter without the previous conversation, find the
relevant project memory and executable work, produce a useful result, verify
it, and leave the repository truthful enough for the next agent to continue.

This packet reviews the existing design, records inspected evidence, sketches
the smallest redesign, and maps the owner decisions. It is a working design,
not an accepted spec, a release verdict, or an instruction to resume Foundry.
The owner requested preparation through the point where grilling is needed.

## Direction supplied by the owner

- Focus development on LLM Workbench. Set Foundry development down until
  several functioning Workbenches have demonstrated a need to connect and
  a Workbench can build the connecting system.
- Treat project prose, Wiki, decisions, specs, and instructions as the memory
  that enables cold starts, continuation, and recovery: one distributed handoff.
- Use Builder, Auditor, Reviewer, and Reconciler as stances. They are ways of
  approaching work, not permanent departments or agent identities.
- Start proving the base through harness feedback reviews and reports.
- Park Master Workbench implementation. Its initial intended scope is a
  registry, auditing observations, and a simple visualization of those observations.
  Foundry orchestration and CIC redesign are outside this redesign's first scope.

These points come from the current request and the referenced conversation,
"Designing Workbench Boundaries" (conversation
`6a9b3084-96e4-83e8-8f1f-c5f6c8bf342c`, both turns read in full). The assistant's
suggestions in that conversation remain proposals except where the owner
expressly adopted them. Named example projects are not pilot assignments.

## Current baseline and progress

Inspected on 2026-09-04 before changing any product file:

| Surface | Observation | Implication |
|---|---|---|
| Working branch | `codex/workbench-pivot-baseline` at `4ff649358f50767e7e19017c1a5c984aa4f5ba69`; existing untracked local agent material | Continue preparation without taking another agent's release ticket |
| Preserved release candidate | Local and remote `claude/v3.1-release` at `4ce74f8de1da30a3bffd9286e32c3b63e417a08b` | Preserve as evidence; it is not an independently accepted release |
| Remote staging and main | `integration` at `9e1c935d1027d3818578070c9bbdb88809af3dcd`; `main` at `08ab78e5a59a68d2b04028fe71a2be488d5ae10e` | Read-only remote checks agree with the local branch tips; no v3.1.0 tag returned |
| Selection | `doctor` passes; `next --json` selects S-022/TK-004, in progress under its existing owner | Structurally valid state still points to the previous release objective |
| Pivot checkpoint | Records the interrupted independent audit and deliberate release pause | No final audit PASS or S-014 handoff can be inferred |
| S-023 through S-026 | Recorded complete; schema 2, managed runtime tools, Wiki/ADR/diagnostic support, skill routing and resume fixtures exist | Reuse the implementation; a rewrite from zero would discard useful progress |
| S-022/TK-002 evidence | Claude planned; Codex resumed a greeting CLI and pushed a verified result on an earlier exact candidate | Real but narrow agent evidence, not proof of the entire redesigned lifecycle |

The v3.1 name already belongs to an unreleased candidate. The design should
carry a descriptive name until Q8 resolves its release relationship. Do not
silently relabel historical proof or reopen completed capability records.

## What the Foundry experience teaches

Historical diagnosis from 2026-09-01 described heavy investment in governance,
receipts, and individually tested components before a continuous useful workflow.
That is historical evidence, not a fresh runtime audit. Its old counts and
runtime descriptions have not been reverified for this design packet.

Current read-only checks of the deployment's Taskboard and S-037/S-038/S-039
add a more recent picture:

- S-037 remains blocked at its hot-spec size ceiling; S-039 explains that the
  size limit plus pinned sections prevented the record from accepting its
  own next receipt. Individually reasonable controls composed into friction.
- S-039 records a reviewed live Land candidate, with delivery still pending.
  It would be inaccurate to repeat the older diagnosis as "no progress."
- S-039's PostFlight continuation remains blocked, and S-038's owner-visible
  CIC work is still planned behind the preceding workflow work.
- These are inspected source records. No Foundry runtime, installed skill
  deployment, active scheduler, or remote delivery was audited in this turn.

Design consequences:

1. Prove a useful result early, and keep the whole route short enough to exercise.
2. Every new mandatory artifact or check must explain which observed failure it
   prevents. Avoid adding another container for facts already owned elsewhere.
3. Preserve narrow scope, meaningful review, reversible delivery, provenance,
   and honest incomplete state. Simplicity is not permission to waive these.
4. Keep project-local work functional without a factory, dispatcher, or dashboard.
5. Judge this redesign by output and cold continuation, not by document counts
   or a static score. A new vocabulary alone does not change the outcome.

## Proposed architecture

The existing seven controls and six support lanes can express the proposed
product. Start by improving their routing and behavior rather than inventing
a new root file, database, lifecycle engine, or mandatory record type.

| Question an arriving agent must answer | Existing owner to reuse | Proposed change to assess |
|---|---|---|
| What may I do, and how do I enter? | `AGENTS.md`, with provider entrypoint | Make orientation and exit obligations explicit and task-sized |
| What is this project trying to accomplish? | `BLUEPRINT.md`; assigned spec for the immediate outcome | Replace the interim Foundry-runway framing with the accepted standalone mission |
| What do shared terms mean? | `LEXICON.md` | Define stance, cold continuation, and reconciliation without introducing authority by title |
| What context and rationale matter? | Wiki router, design-concept articles, ADRs | Route to the few records needed for this work; verify against current controls and implementation |
| What work is eligible? | Stable specs; `doctor`, `next`, `show`; generated Taskboard | Compose the existing selection mechanism with owner intent; do not add a second queue |
| How do I perform and check this work? | `RUNBOOK.md`, skills, selected spec, source/tests | Make stance and verification choices discoverable; add only demonstrated missing behavior |
| What must the next agent know? | Touched truth owners plus existing spec evidence and checkpoints | Reconcile material changes and save recoverable incomplete work at interruption |
| Where does the harness learn about friction? | Manifest feedback lane | Preserve observations and trace them to bounded follow-up without granting repair authority |

The Workbench Contract is already defined as a claim set owned by the root
controls and assigned spec. The conversation's word "Contract" does not
require a new `CONTRACT.md`. Keep the existing meaning unless the owner
chooses to change it during grilling.

### The proposed operating loop

Owner request -> orient -> retrieve relevant memory -> select or refine one
piece of work -> use the appropriate stance/skill -> produce the result ->
verify/review -> reconcile the touched owners -> leave the next executable state.

Stances are optional approaches within that loop, not four compulsory ceremonies:

| Stance | Responsibility | Boundary |
|---|---|---|
| Builder | Produce the authorized artifact or implementation | Tests and completion claims must name concrete evidence |
| Auditor | Establish what is true and where intent, proof, and observed state disagree | Findings do not authorize repairs or changes to the audited target |
| Reviewer | Challenge a proposal, finding, or fixed change against its acceptance | A stance switch in the same context is self-review; independence needs separate scrutiny where required |
| Reconciler | Check and update the touched documentation and execution state | Do not rewrite accepted intent to match a defect, manufacture completion, or append duplicate truth everywhere |

Shared skill discovery contains examples of stances (Engineer and First
Responder), but the four requested names are not present as a portable set.
The Engineer contract still refers to Captain and transfers. The Workbench
bundle contains exactly twelve skills, including implementation and fixed-diff
review, without four separate stance skills. Porting the desired behavior is
a design task; do not copy the private coordination dependencies along with it.

### Reconciliation as handoff maintenance

For every material change, compare accepted intent, observed implementation,
and the record of work. Fix the affected owner only. A new decision may need
an ADR; a changed explanation may need Wiki maintenance; a changed requirement
belongs in its live owning control/spec. Ordinary changes do not require all
of these files to be touched. Completed spec evidence stays append-only;
future capability changes use a linked successor.

At interruption, leave the exact achieved result, unfinished step, blocker,
verification limits, and recovery location. At completion, leave the output,
named verification and review, truthful ticket/acceptance state, and next work.
An untracked diary alone does not survive a clean clone. Existing checkpoint
promotion supplies that transport when intentionally saved and committed.

### First useful proof: a harness feedback review

Proposed first workload: review this Workbench at a fixed revision and produce
one bounded, evidence-backed report the owner can use. Use its real history
and current implementation rather than inventing a toy harness problem.

The existing shared harness-feedback-review assembly is relevant prior art:
it gathers evidence, diagnoses disagreements, and reports findings without
repairing its target. It is outside the portable twelve-skill bundle today.
Reading that contract does not establish that a clean installation can run it.

The existing `feedback-automation.mjs` solves a different problem: discover
feedback rows, rank one candidate, classify decisions and run outcomes. Its
discovery includes an owner-specific origin restriction, and the Runbook
describes scheduled repair/merge actors. Passing those helper tests does not
prove portable harness review/report generation. Do not import the scheduled
repair/merge policy as the first report workflow.

Proposed report content: target revision and scope, evidence limitations,
prioritized findings with source references and demonstrated impact, challenged
or rejected findings, bounded next actions, and unresolved questions. A clean
review may report no findings; it must not invent a defect to create work.

Proposed demonstration, after the interview accepts its scope:

1. A fresh agent orients from repository instructions and produces the report.
2. An independent reviewer checks the report's consequential claims against the
   same target, including whether a claimed harness cause actually explains friction.
3. The report and accepted next step become recoverable in their existing owners.
4. A fresh session, without the prior chat, finds the result and resumes the
   bounded next step or correctly reports that owner acceptance is pending.
5. Only after that works, package a dedicated Harness Feedback Workbench and
   try ordinary product work in an owner-selected separate project.

A finding is not permission to fix it. The report artifact is the first useful
output; a later accepted repair supplies implementation and red/green proof.

## Proposed acceptance and evidence limits

| Scenario | Observable success | What it does not prove |
|---|---|---|
| Existing project orientation | Fresh agent identifies scope, current objective, authority, and relevant memory with no chat | Directory presence alone does not prove understanding |
| Discovery and decomposition | Owner answers become decisions, an outcome, and executable bounded work | A scripted toy spec does not prove real discovery |
| Useful execution | A real report or product slice meets the agreed acceptance | File changes and green structural checks alone are insufficient |
| Cold continuation | New context reconstructs the result, pending decision, and correct next action | The same agent paraphrasing its previous turn is insufficient |
| Changed decision | Accepted change updates the proper owners and invalidates affected proof without erasing history | A reconciliation checklist alone is insufficient |
| Interrupted or blocked work | Recoverable state and an honest next action survive; no false completion | "Blocked" without a recoverable remainder is insufficient |
| Later generalization | Several owner-selected Workbenches complete useful work independently | The recursive tooling project alone cannot establish portability across workloads |

Repeated controlled trials remain necessary for comparative claims such as
"this harness improves agent outcomes." The first report establishes a
bounded capability, not longitudinal improvement or release readiness.

## Verification performed during preparation

- PASS: `node workbench/tools/spec-workbench.mjs doctor`.
- PASS: `node tools/test-cross-provider-fixture.mjs` (provider-free planning
  and fail-closed verification; no new model-provider run).
- PASS: `node tools/test-feedback-automation.mjs`.
- PASS: `node tools/test-sessions.mjs` (two tests).
- FAIL: `node tools/test-workbench-round-trip.mjs`, final assertion
  `no private home path leaked into the transcript`. The test records absolute
  producer commands from a checkout under the local home; other captured Git
  output can also contain source locations. Execution reached the final
  privacy assertion, so do not misreport this as a failing greeting implementation.
- FAIL: same round-trip command in a disposable clean clone outside the home
  tree; the privacy assertion still fails. Relocation alone is not an adequate
  fix. No test was weakened or changed, and no further retry was attempted.
- Historical evidence inspected: S-022's Claude-to-Codex greeting proof,
  including its failed fresh-Claude authentication leg and sandbox limitation.
  Those provider legs were not rerun and their recorded outcome is not a new
  audit of the current candidate.
- The full suite and a fresh independent release audit were not run. This is
  design preparation, not a release-verification or code-repair task.

Record the round-trip failure as a candidate follow-up in the eventual owning
spec. Diagnose all transcript producers and retain the privacy criterion;
do not hide the failure by reusing an older green checkpoint.

## Planned questions

Stable IDs; no interview answers have been supplied. All recommendations below
remain tentative. Ask one question at a time, starting at Q1.

1. [locked] What exact first outcome should establish that the redesigned Workbench works: a reviewed harness report, or a report followed by an implemented repair?
   - Decision: Build the redesigned workflow, then complete Round One: a fresh agent uses the reduced route, Wiki, and ADRs to determine that the Workbench is set up correctly and leaves a recoverable outcome. Only after Round One succeeds, produce a reviewed, evidence-backed harness-feedback report and demonstrate cold continuation to its accepted next action. The report must not authorize or include a repair to the harness it evaluates.
2. [locked] Which artifacts and entrypoints should an agent need for ordinary work, and should the present seven-control contract remain?
   - Decision: Retain the seven-control Workbench Contract. Shrink ordinary agent entry to `AGENTS.md`, `RUNBOOK.md`, and `LEXICON.md`; the Lexicon routes agents to other owners only when their task requires them. The Blueprint is not default reading, but is linked and consulted for architecture or cross-cutting product direction. The selected `SPEC.md` remains mandatory after work selection because it delegates the accepted scope and verification for that work.
3. [locked] How should Builder, Auditor, Reviewer, and Reconciler stances be packaged and invoked within the portable skill bundle?
   - Decision: Package Builder, Auditor, Reviewer, and Reconciler as portable stance skills: a stance says how an agent performs one task with the authority, responsibilities, good practices, and composing skills appropriate to that work. Loading a stance never spawns a sub-agent. For example, Builder must ensure the relevant review and verification practices are used rather than treating implementation as sufficient. Preserve cross-provider discovery: a stance stored below `~/.agents/skills/stances/` also needs a flat top-level symlink for Claude's one-level scan.
4. [locked] When must a review be independent, and what separation is sufficient for the first report and later code changes?
   - Decision: Independent review is required only when work is ready to merge into `integration`: the proposed integration candidate triggers a separate-context review before branches combine. The reviewer checks the candidate and its evidence, and this gate is sufficient to challenge consequential claims, code changes, and report recommendations. Earlier review, verification, and audit practices are supports that help work reach the gate, not independent mandatory ceremonies.
5. [locked] What information must survive completion or interruption, and which reconciliation checks establish a truthful cold continuation?
   - Decision: A cold start must have the Workbench Contract, the selected work packet and its linked task-relevant owners, the exact achieved output or commit, current ticket/spec state, named verification, and the next executable action or blocker. An interrupted agent cannot be forced to save, but should document this state as it works using the existing owners and promote a checkpoint when its session reasoning is material. Do not add a universal handoff artifact or duplicate truth.
6. [locked] How much task construction should pickup perform when existing work is blocked, stale, or insufficiently specified?
   - Decision: The Workbench is autonomous within its standing authority. An arriving agent should make the best supported choice after investigating the Contract, relevant ADRs, specs, task state, Wiki, and project evidence. It may construct the next decision from that evidence. Only after it cannot identify a confident good next decision should it record the blocker and stop; the owner can open a grilling session on return. This does not waive platform safety or explicit owner-only boundaries.
7. [locked] Where should the report and its accepted follow-up live, and what separates review/report work from automated repair?
   - Decision: Store harness-feedback reports in the manifest-declared `workbench/feedback/` lane, never loose, in the Wiki, or in an ad-hoc directory. Record accepted follow-up work in its owning linked spec. A report does not repair its target or authorize automated repair.
8. [locked] How should the redesign relate to the preserved unreleased v3.1 candidate and the pending S-022/S-014 release path?
   - Decision: This is continuing LLM Workbench work under the v3.1.1 direction, not a separate pivot away from an abandoned candidate. Treat existing v3.1 work, specs, and proof as the baseline to continue and improve. This provisional design label does not itself publish a version, create a release claim, or rewrite historical evidence.
9. [locked] Which later Workbenches and what evidence count as "several working" before considering Master Workbench?
   - Decision: Validate the workflow through real, contrasting existing Workbenches and products rather than constructing artificial pilot Workbenches. Candidates include LLM Workbench, Master Workbench, GPT_OS, Cashflow Calculator, CIC, OpenBrain, and Foundry; select the next suitable systems from live owner priorities. Each proof must demonstrate owner-useful delivery, named verification, and truthful fresh-session continuation. Revisit Master Workbench only when several such real proofs demonstrate a concrete need for its registry, observation audit, or visualization role.

## Decision preparation

| ID | Recommendation | Strongest opposing case | Credible alternative | Main risk or cost |
|---|---|---|---|---|
| Q1 | Start with one reviewed report on this repository and cold continuation to its accepted next action | Report-only work could repeat the old pattern of producing analysis without improvement | Include one owner-accepted repair in the same first proof | A report is useful only if its findings are actionable and independently supported |
| Q2 | Retain the seven controls and manifest; improve the routes and remove demonstrated duplication | Existing structure may itself make orientation too expensive | Prototype a shorter entrypoint in a disposable example before deciding on migration | Familiar architecture can preserve unnecessary reading and conceptual burden |
| Q3 | Define four small portable stance contracts, compose with existing skills, and add no role hierarchy | Four new skills could increase maintenance without changing behavior | Embed stance sections in the existing implementation/review/report procedures | Standalone skill packaging conflicts with the currently closed twelve-skill promise |
| Q4 | Require separate-context review for consequential report claims and changes where the project requires independence; allow explicit self-review elsewhere | A second agent costs time and may repeat the same blind spots | Owner review at the same evidence boundary | Review separation can become ceremony if it lacks independent evidence checks |
| Q5 | Update touched truth owners and checkpoint unfinished work; test a fresh-session resume | Distributed memory can make omissions hard to see | Add a short generated orientation summary that points to owners | A summary can become a competing stale truth store |
| Q6 | Reuse next/show/claim; allow bounded decomposition inside accepted capability scope, with owner decisions surfaced when scope changes | Conservative selection may need too much owner intervention | Start with explicitly assigned work only, then measure pickup friction | More automatic slicing can turn assumptions into unintended scope |
| Q7 | Keep observations in the feedback lane, reports as project output, and authorized repairs in specs; choose one report home during the interview | Several linked artifacts can scatter a single finding's history | Let a dedicated report Workbench own reports while the target owns feedback and repairs | A dedicated Workbench before the local proof adds setup work too early |
| Q8 | Preserve the exact candidate and use a new linked pivot spec for forward work; settle version and release ownership explicitly | Completing the existing release first would give a clean public baseline | Keep v3.1 unreleased and supersede only its pending release direction | Continuing design while next still selects S-022 can mislead an unbriefed agent |
| Q9 | Prove this Workbench, a dedicated review Workbench, and an ordinary product Workbench before revisiting the observer | Three similar or carefully selected successes may conceal generality problems | Require two contrasting workloads plus a measured cross-project observation need | Arbitrary counts can become another gate with little evidence value |

## Spawned branches

10. [locked] What concrete evidence should show that an imposed step enables direct delivery rather than creating bureaucracy?
    - Decision: A required step must name its immediate delivery value and leave a checkable artifact, decision, or risk reduction. When that value is uncertain, keep the step optional and visible for review until the owner can open a grilling session about it; do not silently make it mandatory or discard it.
11. [locked] What is the smallest v3.1.1 implementation slice that must exist before the first harness-feedback report can exercise this redesigned workflow?
    - Decision: Build only the four stance skills, the reduced ordinary entry route (`AGENTS.md` -> `RUNBOOK.md` -> `LEXICON.md`), and the feedback-report workflow and report format in the existing feedback lane before running the first report. Implement this slice step by step.
12. [locked] What common minimum contract should every stance skill contain, beyond its stance-specific practices and composing skills?
    - Decision: A stance never grants, removes, or transfers authority; task authority comes from the owner request, Workbench controls, repository permissions, and other governing context established before adoption. A stance changes only how the model behaves within that authority. Every stance defines: (1) Purpose, (2) Method / Posture, (3) Obligations, and (4) Completion / Exit Condition. It may add intrinsic stance constraints that govern existing authority, such as Reviewer independently evaluating rather than quietly repairing. Handoff belongs only to the Workbench continuation mechanism when work crosses a meaningful execution boundary; changing stance does not create a handoff, so one task may move Builder -> Reviewer -> Builder -> Reconciler uninterrupted.
13. [locked] What exactly must the first harness-feedback report prove about the newly built workflow, beyond identifying findings about the harness?
    - Decision: Round One is not a harness-feedback or review test. It succeeds when a fresh agent can use the reduced entry route, consult the Wiki and relevant ADRs, and determine that the Workbench is set up correctly. That agent leaves a recoverable outcome. Passing this orientation-and-configuration proof is mission success for Round One; review and feedback testing follows afterward.
14. [locked] What exact, checkable outcome should a Round One agent leave to demonstrate that it verified the Workbench setup correctly?
    - Decision: The agent inspects the Workbench using the intended route and returns to the current chat to verify that it works. Round One creates no feedback report, handoff, checkpoint, self-created task, or other prose artifact.
15. [locked] When an autonomous agent creates its own next task, what minimum information must make that task eligible for pickup rather than merely a note?
    - Decision: It does not create a next task for itself. An agent picks up its assigned task and works it autonomously. If needed information is absent, it investigates and resolves the issue within that task using the project evidence. Only when it cannot do so is a separate new task needed for a new agent; the current agent does not manufacture that queue item or treat its absence as routine process blockage.
16. [locked] How should an agent choose the appropriate stance for an assigned task without turning stance selection into another required ritual?
    - Decision: Normal task stance is set in the assigned SPEC and TASK; an agent does not choose or record its own stance. A stance decision may arise only after the work enters troubleshooting mode. What happens in troubleshooting mode is outside this grilling session's scope.

## Provisional ADR decision

The Workbench is about process, not ceremony. A required step must enable
direct delivery; if it exists only to satisfy another step, it is bureaucracy.
Where its value is uncertain, retain it as an optional, reviewable practice
until an owner grilling session resolves it. This is a cross-cutting decision
requiring an ADR when the grilling record is promoted; it is not yet canonical.

## Proposed implementation order after grilling

This is a tentative sequence, not an assigned backlog:

1. Create one linked pivot spec recording accepted direction, proof scope,
   release relationship, and explicit exclusion of connector work. Reconcile
   future selection with S-022/S-014 without rewriting completed records.
2. Repair the smallest demonstrated obstacle to the first report and cold
   continuation. Capture guardrail baseline before harness changes, use
   red/green at behavior seams, and update generic templates with root controls.
3. Deliver the reviewed report and fresh-session continuation. Add only the
   stance/routing/reconciliation support that the proof actually needs.
4. Package the proven workflow for a dedicated Harness Feedback Workbench,
   then evaluate a separately assigned ordinary project.
5. Revisit Master Workbench only after observed needs justify connecting them.

No implementation change, source-to-installed skill synchronization, Foundry
development, automation mutation, version bump, release, or terminal lifecycle
mutation is performed by this preparation packet.

## Source map and resumption

Read this packet first, then refresh current repository state and doctor/next.
The live interview record belongs to the manifest's `grilling` collection;
its saved checkpoint is a recoverable snapshot, not acceptance of proposals.
Do not resume the release ticket just because it remains selected by next.

Repository evidence reviewed:

- `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`, `RUNBOOK.md`.
- `workbench/manifest.json`, `workbench/wiki/MEMORY.md`.
- `workbench/sessions/checkpoints/workbench-pivot-stability-2026-09-04.md`.
- `workbench/sessions/checkpoints/s022-cross-provider-resume-2026-09-04.md`.
- `workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md`.
- `workbench/specs/S-014-workbench-release-candidate/SPEC.md`.
- `workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md`.
- `skills/README.md`, `skills/code-review/SKILL.md`.
- `tools/test-workbench-round-trip.mjs`, `tools/cross-provider-resume.mjs`,
  `tools/feedback-automation.mjs`, `workbench/tools/sessions.mjs`.

Additional read-only background: the deployment Wiki router and current
S-037/S-038/S-039 records; the shared Engineer stance and harness-feedback-review
contracts; the September 1 Foundry traction diagnosis. These are evidence
sources for this review, not dependencies an installed Workbench must access.

Immediate next action: begin Q1. No answers need to be re-collected for the
owner direction already recorded above.
