# S-004I - Template Release Proof: Puffer Pond

**Spec ID:** S-004I
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Prove each Workbench release by running the release-updated Workbench Template, deployed in the cloud, through a prewritten grill-me-and-genesis script that builds Puffer Pond in a single workflow pass with Approve as the owner's only step.
**Blockers:** none for specification. The proof can run only after a release's Template has passed the Template Upgrade Release Gate, and the cloud form, the script's content and where the build lands are open for Plan. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner-locked release-proof decision of the Blueprint teardown grilling (2026-10-02 to 2026-10-03); no Task is cut.
**Next gate:** At Plan, inspect live Actuality, settle the open items below with the owner, and cut small Tasks within this Spec.

> **Citation anchors.** pre=`bbfcd37b650fec0ac6ec54867f5e4eec701df7ad` post=`bbfcd37b650fec0ac6ec54867f5e4eec701df7ad`.

## Outcome

Every Workbench release is proven by a project made from the Workbench Template, updated to that release and deployed in the cloud. That project is run through a grilling session from a prewritten grill-me-and-genesis script and builds Puffer Pond, the small full-screen living pond illustration at [github.com/KaydenClark/Puffer-Pond](https://github.com/KaydenClark/Puffer-Pond). It takes the workflow in a single pass, with no second Align, and the owner's only step is Approve.

Landmark: Workbench Template, the lane the Blueprint teardown grilling placed this decision in. No `LANDMARK.md` record exists for it yet; this Spec claims none.

## Why It Matters

The owner's decision, locked in the Blueprint teardown grilling (question BT-D15, 2026-10-02 to 2026-10-03):

> Among its other gates, a Workbench release is proven when the Template, updated to that release and deployed in the cloud, is run through a grilling session from a prewritten grill-me-and-genesis script and produces the website asked for, correctly, without being blocked by anything that should not block it. It must take the workflow in a single pass (Idea, Align, Confirm, Journey, Complete) with no second Align; the owner's only step is Approve, judging whether the website is viable.

The owner's own reason (why WHY-D2, round 4, 2026-10-03): "The idea is the workbench can do the workflow in a single pass without a second align needed. It theoretically should just be the human QA step."

The owner confirmed the choice of product and the cloud (why WHY-D2a): "The release proof builds Puffer Pond (github.com/KaydenClark/Puffer-Pond), the small full-screen living pond illustration, from the prewritten grilling script, with the Template deployed in the cloud. The why stands: a website is a product you can judge viable by using it, so Approve stays your only step, and running it in the cloud from a script proves the pass needs nothing from your machine or memory."

The teardown notepad that holds these entries is local and untracked: it is origin, not durable evidence. The decision is not yet in a tracked decision record; the teardown's decision-record drafting lane carries it, so this Spec holds the owner's words until that record lands.

## Current Verified State

At the pre anchor:

- [Workbench v4.0.0 Release](../S-00O-workbench-v4-0-0-release/SPEC.md) is `blocked` and owns the Template Upgrade Release Gate task and a full-cycle task on another workbench (its TK-003 and TK-004). Its acceptance does not name this proof.
- The Template Upgrade Release Gate in [AGENTS.md](../../../AGENTS.md) and in [RUNBOOK.md](../../../RUNBOOK.md#template-upgrade-release-gate) requires each new version to update [Workbench_Template](https://github.com/KaydenClark/Workbench_Template) through the public `update-harness` route and to prove matching versions, exact managed bytes, the Template's full suite, separate-context review, containment on its integration branch and a fresh-clone rerun. It does not run the Template to build a product.
- Its first application, [Template Upgrade Release Gate](../S-00F-template-upgrade-release-gate/SPEC.md), is `complete`. The earlier fresh-copy proof, [Fresh Workbench Template To Project Proof](../S-00E-fresh-template-project-proof/SPEC.md), is `complete` and is stated there to be distinct from the Template-update acceptance.
- `workbench/manifest.json` declares `workbenchVersion` `v3.2.1`. The `grill-me` and `genesis` skills exist in `workbench/skills/`. The workflow itself is owned by [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md), which is `active`.
- The Puffer Pond repository is public and already holds a built project (a deployed page, its four control documents and a capability spec for the pond) last pushed 2026-09-10, read with the `gh` CLI at this anchor. The owner's decision names that repository as what the proof builds.
- No prewritten script, cloud run procedure or per-release proof record exists in this repository.

## Desired Behavior

1. A release is not called proven until a run of this proof is recorded for that release. The run starts from the Workbench Template updated to the release (the Template the Template Upgrade Release Gate produces), deployed in the cloud.
2. The run is driven by a prewritten grill-me-and-genesis script, kept as a tracked file in this repository, that supplies the idea and the answers a grilling session needs, so the run needs nothing from the owner's machine or memory.
3. The run builds Puffer Pond and produces the website the script asks for, correctly, without being blocked by anything that should not block it. Each stop in the run is recorded and classified as one the Contract requires or one that should not have blocked; the second kind fails the proof.
4. The run takes the workflow in a single pass: Idea, Align, Confirm, Journey, then the delivery step, using the verb names the Lexicon holds when the run happens. A second Align, for any reason, fails the proof.
5. The owner's only step is Approve, judging whether the website is viable by using it. Agents never record Approve for the owner.
6. The evidence of a run lives in the current release owner's Spec, as the Template Upgrade Release Gate's evidence does, and identifies the release, the Template commit, the script version, the environment and each stop.
7. The proof does not replace the Template Upgrade Release Gate or any other release gate: it is one of them ("among its other gates").

## Decisions And Contracts

- The decision is the owner's, quoted above; nothing in this Spec adds to it as an owner reason.
- Relation to the Template Upgrade Release Gate (derived from the owner's phrase "the Template, updated to that release", not a new owner answer): the gate proves the update itself, that the installed Template is exactly the release and recoverable. This proof starts from the Template the gate produced and proves that Template can then do real work. The gate's output is this proof's input, so a Template still on an older version blocks the proof, and neither stands in for the other. Source-template tests and fresh-project generation still do not substitute for the installed upgrade, and a green gate does not substitute for this run.
- Relation to the v4 release Spec: this Spec does not edit [Workbench v4.0.0 Release](../S-00O-workbench-v4-0-0-release/SPEC.md) and does not claim v4 readiness. The full-cycle task there (TK-004, defaulting to the Template the gate updated) overlaps in spirit and differs in form: that task has LLM_Workbench agents run a cycle on another workbench, while this proof is a scripted single pass from the cloud where the owner only approves. Whether the v4.0.0 run satisfies, replaces or sits beside that task is for the v4 release's owner to reconcile; until it does, locked BT-D15 against that Spec's acceptance is an implementation gap recorded here.
- The Contract does not yet name this proof as a release gate. Naming it in the Template Upgrade Release Gate text is a Contract change and takes its turn under the one-writer-per-control rule; it is planned as a Task here, not done by this Map record.
- Safety is unchanged: the script and its evidence carry no credentials, tokens or private data, and the cloud run uses only what the current authorization permits.
- A run proves a release only for the Template commit and script version it names; a changed Template or script needs a fresh run.

Open, not decided here:

- What "in the cloud" is for this proof: which cloud environment runs the Template, how it is started and how its evidence returns. The owner's words fix only that it is deployed in the cloud, from a script, with nothing from his machine or memory.
- How the script stands in for the owner's grilling answers while keeping Approve the only live owner step.
- Where the build lands. The Puffer Pond repository already holds a built project, so whether a run builds into it, beside it or elsewhere, and what counts as "the website asked for" when judging correctness, is not stated.
- What counts as "blocked by anything that should not block it", as a checkable record per stop.
- Which release first needs the proof, and the time and cost of a cloud run. The owner sets that, and no paid service is added without his approval.

## Non-Goals

Editing the v4 release Spec or declaring any version release-ready, changing the Template Upgrade Release Gate's own steps, updating or releasing any version, running the proof, building Puffer Pond, changing the workflow or its verbs, any Dungeon Friends work, writing or promoting decision records, Lexicon or Blueprint edits, and any `main` promotion.

## Dependencies And Blockers

- A release's Template must have passed the [Template Upgrade Release Gate](../../../RUNBOOK.md#template-upgrade-release-gate) before this proof can run against it. No run is possible until a Template at a release version exists on its integration branch.
- The workflow it runs is owned by [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) (active); the script must follow the workflow and verb names as delivered at Plan, not as they stand in this record.
- The release owner [Workbench v4.0.0 Release](../S-00O-workbench-v4-0-0-release/SPEC.md) holds release ordering, version and the recorded evidence. This Spec delivers the script, procedure and record form; each release's run is recorded there.
- Editing the Template Upgrade Release Gate text touches `AGENTS.md` and `RUNBOOK.md`, shared writers: coordinate with the Contract carrier rewrite ([Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md)) and any other open change to those files, one writer at a time.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices and safe parallel groups. Likely cuts, not assignments: the prewritten script as a tracked file with its authoring rules; a cloud run procedure that starts from a release's Template and returns evidence; the per-run record form and the stop classification; the Contract and Runbook text that names this proof beside the Template Upgrade Release Gate; and a first end-to-end rehearsal on the current Template. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] A tracked prewritten grill-me-and-genesis script exists, carries no credentials or private data, and builds Puffer Pond from the Template without anything from the owner's machine or memory.
- [ ] A cloud run procedure starts from a named release's Template commit and returns evidence, and one run is recorded end to end.
- [ ] The run record shows one Align and no second, each stop classified as required or one that should not have blocked, and the owner's only step as Approve.
- [ ] The run produces the website the script asked for, checked as Puffer Pond's own controls require (tests, production build, and desktop and phone-sized browser proof), with the owner's Approve or return recorded separately by the owner, never by an agent.
- [ ] The proof's relation to the Template Upgrade Release Gate is stated in the Contract, and the Template Upgrade Release Gate's steps are unchanged.
- [ ] The v4 release owner has reconciled this proof with its acceptance and full-cycle task, or the gap is recorded there by that Spec's owner.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The script run against a fixture room in a clean checkout of the Template, then the same script in the cloud environment the Plan selects. A real run records its stops, Align count and evidence. Red/green cases cover a run that needs a second Align, a stop that should not have blocked, a script that depends on local state, and a Template not at the release version. A string check that the script names the right steps supports discovery but does not prove the pass.

## Verification Procedure

Run the Template-side checks the Template Upgrade Release Gate names, then this proof's run on the same Template commit, then the full AGENTS suite, `render` and `doctor`. Pin the candidate before source-identity checks. Capture the guardrail baseline before editing and the after-score, remaining recommendations and outcome limitation after, and never weaken a criterion to raise the score. Capture Workbench self-drift pre and post receipts with the bounded semantic check. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA and Approve separate. This Map record claims none of that proof.

## Documentation Impact

When this capability delivers, update the Template Upgrade Release Gate text in `AGENTS.md` and `RUNBOOK.md` to name this proof, their `templates/` mirrors only where the gate is generic, the release owner's evidence record, and the Wiki page for release proof. The Lexicon needs no row from this Spec. The owner's locked decision becomes a tracked decision record through the teardown's decision-record work, not through this Spec.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-03 | none | Authored at the Map step from the owner-locked release-proof decision and its two whys of the Blueprint teardown grilling at integration bbfcd37b650fec0ac6ec54867f5e4eec701df7ad. | Map only; the release Spec, the gate text, the manifest version and the Puffer Pond repository were read at that tip or through `gh`; no runtime proof claimed. | This Spec. | Plan, the script, the cloud procedure, the run record, the Contract text and every run remain; the open items above are unsettled. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The v4 release Spec is not edited here; its owner reconciles the proof with its acceptance. The decision-record form of the owner's decision belongs to the teardown's decision-record work.

## Supersession

- Supersedes: none
- Superseded by: none
