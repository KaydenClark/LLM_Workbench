# S-004G - Workbench Terms And Workflow Verb Rows

**Spec ID:** S-004G
**Status:** active
**Priority:** 2
**Owner:** claude-lane-g
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Put the owner's Workbench terms and one row per workflow verb into the Lexicon, repair the rows that contradict the Blueprint teardown's locked answers, and record the changed Journey point of the workflow-verbs decision in a decision record.
**Blockers:** none. The Lexicon rows take one writer at a time, so this Spec's first Task waits on the last Task of the AI Coding Dictionary Terms Spec. The `ddr` collection and the commands that write, accept and supersede a decision record are installed.
**Latest event:** TK-006F closed with proof.
**Next gate:** Complete TK-006G.

> **Citation anchors.** pre=`5cfa987bacb0f6a9273d93e8d989e34000d75ad9` post=`5cfa987bacb0f6a9273d93e8d989e34000d75ad9`.

## Outcome

The Lexicon carries the words the owner confirmed for the Workbench itself (Owner, Room, Workbench Template, Scaffolding, the three artifact kinds and Control), a definition of what makes a workflow verb, and one row per workflow verb, each in the owner's confirmed meaning. The rows that contradict the teardown's locked answers (Align, Workflow, Blueprint, Root controls and Foundry) say what the owner now says. The accepted workflow-verbs decision stops presenting Journey as Map, Plan, Implement, Review and Verify, because a decision record carries the owner's correction.

## Why It Matters

The owner confirmed these meanings on 2026-10-03 and asked that each artifact kind get its own row ("Define them in the lexicon too please") and that each verb get its own ("And yes, one row per verb"). Today the Lexicon has no row for any of these Workbench terms, has verb rows only for Align and for Map as a noun, calls the workflow eight verbs that are "the official workflow verbs everywhere" with Journey as Map, Plan, Implement, Review and Verify, says confirmation "is not itself implementation permission", describes the Blueprint by its eight sections, and defines the Foundry as a downstream coordination extension. Each of those now contradicts a locked owner answer, so an agent that looks a word up gets the old meaning.

## Current Verified State

At the pre anchor:

- `LEXICON.md` has no row for Owner, Room, Workbench Template, Scaffolding, Contract artifact, Routing artifact, Architecture artifact, Control or Workflow verb, and no row for the verbs Idea, Confirm, Prototype, Plan, Implement, Check, Review, Verify, Journey, Approve, Delivered or Clean Up. Rows that touch them: the Map row (the noun, "The direction to a destination, at two scales"), the Align row, the Workflow row, the Writer verb row, the Template row in Artifact Boundaries ("A template owns a reusable starting shape"), the Reviewer stance row, the Human QA row and the Workbench Contract row.
- The Align row's distinction says confirmation "precedes the authorized documentation or delivery endpoint and is not itself implementation permission."
- The Workflow row says "The eight verbs Idea, Align, Confirm, Map, Plan, Implement, Review and Verify, the official workflow verbs everywhere. Journey is Map, Plan, Implement, Review and Verify", and that the workflow loops "Align, Confirm, Journey, then Align again".
- The Blueprint row defines it as "The adaptable narrative of the desired finished product: destination, people, outcomes, experience, integrated design, cross-cutting qualities, lifecycle and non-goals", and notes that the present Blueprint still links ADRs and that its split is planned, not done.
- The Artifact Boundaries table's Root controls row assigns each root file its job ("AGENTS governs agents; Blueprint describes destination; Lexicon defines and routes; Runbook gives operations and procedures; README orients people") and cites the root-surface record. `AGENTS.md`, `RUNBOOK.md`, `README.md`, the Lexicon and the templates call these files "controls" or "root controls" throughout, and public names carry the word: `tools/control-fidelity.mjs`, `tools/test-controls-vocabulary-sweep.mjs` and the Ownership Map root control Spec's slug.
- The Foundry row, under Project-Specific Terms, says "The owner's downstream coordination extension that adopts released Workbench versions and adds sockets, modules, scheduling, and monitoring", with the distinction that it is read-only evidence and never the Workbench's source, copy target, tool runtime or prerequisite (the sole-source record, ADR-0026).
- The Workbench and Project rows call the Workbench a harness and the Workbench row opens "A room: the operating harness"; the [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) Spec owns rewriting them under the owner's harness answer.
- The accepted [workflow verbs decision](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md) (ADR-000X, `canonicalized_in` the Lexicon and the Blueprint) says in point 1 that the eight verbs "are the official workflow verbs everywhere", in point 2 that "Journey is Map, Plan, Implement, Review and Verify", and in its consequences that the Blueprint's Desired Lifecycle map "is kept verbatim" and unchanged. It also says it performs no delivery and that the Tracker's step list still uses the earlier names. `workbench/tools/landmark-tracker.mjs` still lists the earlier steps, and the [Landmark Record Migration And Tracker Regrouping](../S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) Spec leaves open whether its work renames them.
- `templates/LEXICON.md` carries the Map, Align, Template, Root controls and Blueprint rows and has no Workflow, Writer verb or Foundry row.
- "Delivered" already has another meaning: the `S-###:delivered` blocker qualifier in `AGENTS.md`, the Runbook and the runtime is satisfied by a reviewed PASS contained in integration, before owner approval or main, and `AGENTS.md` calls that stage "reviewed delivery on integration". The `complete` command and status remain the closure names.
- `AGENTS.md`, Session Records And Checkpoints, says "Confirmation of understanding never grants implementation or promotion authority", about confirmation recorded on question cards and landmarks.
- The [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) Spec was written before the workflow verbs were accepted and does not own the verb rows; its Lexicon and control changes are delivered and at its owner gate.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. **Workbench terms.** The Lexicon has one row each for Owner, Room, Workbench Template, Scaffolding, Contract artifact, Routing artifact, Architecture artifact and Control, stating the owner's confirmed meaning (Decisions And Contracts) in its definition and its neighbors in its distinction: Room against Project, Environment and Filesystem; Workbench Template against the Template row and the `templates/` folder; Scaffolding and Architecture artifact against each other and the Retired row; the artifact kinds against the Workbench Contract row; Control against the Source, tool and test and Managed runtime tool rows and the dictionary's Tool.
2. **Retired words.** "Root controls", and "controls" for files, are retired as stale. The Root controls row is rewritten in the artifact-kind terms, and the Lexicon's own uses of the retired words are repaired. Current-facing uses in `AGENTS.md`, `RUNBOOK.md`, `README.md` and the templates are inventoried and either corrected here, one writer per file, or recorded as drift for the [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md), whichever lands first. Public names that carry the word are not renamed.
3. **What a workflow verb is.** A Workflow verb row states the owner's definition, and the Workflow row is rewritten: workflows are composed from workflow verbs, the set stays open, and the delivery workflow reads Idea, Align, Confirm, Map, Plan, Journey, Approve, Delivered, Clean Up.
4. **One row per verb.** Each of the fourteen verbs (Idea, Align, Confirm, Prototype, Map, Plan, Implement, Check, Review, Verify, Journey, Approve, Delivered, Clean Up) has exactly one row stating its confirmed meaning. The Align row is that verb's row and drops the clause saying confirmation is not implementation permission. Each row's distinction names the existing term or command it sits beside: Review against the Reviewer stance, Assembled-Spec review and the dictionary's Automated review; Check against the Worker self-check; Approve against the `approve` command and the Human QA row; Delivered against the `complete` command and the `S-###:delivered` qualifier; Verify against verification on main; Idea against Fog.
5. **Other repaired rows.** The Blueprint row describes every room's Blueprint as the four-part short page and says what the Blueprint is for, in the owner's words; [Blueprint Short Page](../S-004H-blueprint-short-page/SPEC.md) updates only the row's present-state sentence when the page is swapped. The Foundry row says what the owner said the Foundry is and keeps the sole-source boundary, which no locked answer changed.
6. **The decision record.** A decision record carries the owner's Journey correction and states the current workflow-verb decision with the open verb set, the added verbs and the delivery workflow; it narrows or supersedes ADR-000X for the points the owner changed, and the Writer verb row and other citations follow it. Nothing is superseded merely because verbs were added.
7. **Mirror.** `templates/LEXICON.md` carries the generic rows, or the exemption is recorded with its reason under the dogfood boundary.

## Decisions And Contracts

The owner confirmed every meaning below on the Blueprint teardown review page or in chat on 2026-10-03. Only the locked text is promoted; the wording here is the confirmed card text unless marked as the owner's own words.

Workbench terms:

- **Owner:** "The person whose ideas the project realizes: the one who aligns, confirms, approves and unblocks, approves delivered work, and alone promotes it to main."
- **Room:** "A project, seen as the place its work happens. The workbench is the table set in it; agents take what they need from the table and work on the project in the center." The owner's note, verbatim: "File system, and Environment are going to be some sibling definitions to this one." Environment and Filesystem were adopted as dictionary terms in the AI Coding Dictionary Terms Spec's batch 2. Room has always meant project, in the owner's harness answer of the same day.
- **Workbench Template:** "LLM Workbench's product: the starting installation every new project is made from, and the room every release is proven on."
- **Scaffolding:** "The architecture artifacts used to reach a destination (Specs, Tasks, landmarks, handoffs and notepads), cleared away once their knowledge is kept." The owner's note, verbatim: "transient has been the other word I have been using." Transient is an accepted alternative word.
- **The three artifact kinds**, each its own row at the owner's request ("Define them in the lexicon too please"):
  - **Contract artifact:** "An artifact the agent loads, and pays tokens for, on every turn of every session: today AGENTS.md, with the host adapter that loads it. It holds only lines that apply everywhere."
  - **Routing artifact:** "A durable artifact an agent reaches by pointer when its work needs it, and that routes to the detail: the Blueprint, the Lexicon, the Runbook and the README."
  - **Architecture artifact:** "An artifact built to reach a destination and cleared away once its knowledge is kept: landmarks, Specs, Tasks, handoffs and notepads. Also called scaffolding, or transient."
- **Control, and the contract and routing meanings**, in the owner's last confirmed answer on these words (approved in chat, verbatim "Yes, approved."): "A contract artifact is what the agent loads, and pays tokens for, on every turn of every session (the owner's definition, which does not change because artifacts drifted). A routing artifact is what the contract routes to. A control is a one-action tool; 'root controls' and 'controls' for files retire as stale. How the Runbook becomes more important belongs to the existing Contract Carrier Pointer-Brief Rewrite Spec (S-004C), not to the teardown." The owner's confirmed controls answer of the same day, locked text: "Agents work the workbench through controls, each one action, and open the underlying record only to verify a claim, audit, debug a control, or when a control is missing or disagrees with its record." Earlier the same day the owner wrote, verbatim: "RUNBOOK is 100% a contract artifact. we can debate lexicon later."

Workflow verbs:

- **Workflow verb:** "A workflow verb is a defined action or process that workflows are built from and that people use in ordinary language. Each verb gets its own Lexicon row". The owner's own words, verbatim: "A workflow verb is an defined action/process that we can use to create workflows and actually use in regular language. And yes, one row per verb".
- **The workflow and the open set:** "Workflows are composed from workflow verbs, and the verb set stays open. ... What each verb means is its own Lexicon row." With the two later corrections below, the delivery workflow "reads Idea, Align, Confirm, Map, Plan, Journey, Approve, Delivered, Clean Up." On adding verbs, the owner's words, verbatim: "why cant we add more workflow verbs? They are verbs. those 8 were our first standardization", and "We shouldnt need to Lock in a list. We lock in verbs. We use verbs to create workflows."
- **Idea:** "The owner's starting thought, recorded as given, before any alignment." The owner's note, verbatim: "Between idea and Align is the Fog of war mentioned in the Wayfind Skill."
- **Align:** "The inquiry, usually grilling, in which an idea becomes a design concept the owner and the agents share."
- **Confirm:** "The owner's agreement to a readback that names the concept, its direction, cost, reason and what will be created. It authorizes the agents to carry the concept to its endpoint." This follows the owner's confirmed answer that confirmation is the authorization: "Once the owner confirms a concept, the agents are authorized to carry it to its endpoint, unless the confirmation names a nearer one."
- **Prototype:** "Building a rough version to answer a question words cannot. Optional; it needs no map and lands nothing in enduring context." The owner's confirmed Prototype answer places it before Confirm or between Confirm and Plan.
- **Map:** "Writing the direction to a destination: landmarks, Specs and decision records."
- **Plan:** the owner's own wording replaces the proposal: "The slicing of Map into bounded, executable, planned units of work with provable outcomes and results."
- **Implement:** "Changing the source of truth, or what the project is working on."
- **Check** (a new verb): "The automated checks the building agent runs on its own Task before handing it back."
- **Review:** "Automated review of a Task by an agent that did not build it, before it merges into its Spec's branch."
- **Verify:** "Confirming the work once it has merged to integration."
- **Journey:** "Journey is Implement, Check, Review and Verify, repeated until the confirmed concept is built. Map and Plan come before it and are not part of it." The owner's reason, verbatim: "Journey is the build loop." This corrects the workflow text confirmed earlier the same day, which put Map and Plan inside the Journey, and supersedes the Journey point of ADR-000X.
- **Approve:** "The owner's Human QA judgment that the delivered result is viable; the alternative is sending it back."
- **Delivered**, replacing the proposed Complete: "The verb is Delivered, not Complete: the owner's approved work is on main and the concept is delivered." The owner's words, verbatim: "Let's change this to Delivered", and on the earlier question of which verb Delivered replaces: "It would be complete. we have to say delivered to define it."
- **Clean Up:** "Clearing away the scaffolding once its knowledge is kept."

Rows the locked answers repair:

- **Align**, by the owner's confirmation answer above.
- **Workflow**, by the open verb set and the delivery workflow above.
- **Blueprint**, by the owner's answer that the four-part short page (what it is, who it serves, promised outcomes, non-goals) replaces the eight-section shape for every room's Blueprint, and the confirmed statement of what the Blueprint is for: "The Blueprint is a high-level summary of the direction we want to head and the choices that got us this far. Each sentence can serve as a map toward an implementation plan, sometimes through maps at several scales; a sentence big enough to need its own map becomes a landmark. A decision is placed by asking whether it maps to a destination at the Blueprint's scale or to a more bounded one. The Blueprint makes us ask questions; it does not give definite answers. Definite answers and their details live on other artifacts, and a decision record answers why for one specific decision."
- **Root controls**, by the Control answer above.
- **Foundry**, by the owner's correction of the Foundry non-goal, verbatim: "The workbench is not the foundry yes, but say what that means. The workbench is a management system. the foundry was an autonomous factory. how they related is the Foundry was a factory of many rooms, each with a workbench producing work. The workbench is still designed to work like this. and we will still need it for the foundry. The foundry needs us to prove it works through." The confirmed Blueprint sentence: "Every workbench is built to run as one room among many in an autonomous factory, the Foundry, and the Foundry needs the workbench proven first." The Software factory term in the AI Coding Dictionary Terms Spec's batch 2 is the closest dictionary term for it.

Contracts:

- Lexicon rows define; they set no policy. A verb row changes no command, status, folder or gate; renaming `complete`, `approve` or the `S-###:delivered` qualifier is not decided here.
- The decision record is written at Map and composed by `to-docs`, per ADR-000X and the [promotion decision](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md). Whether it is an ADR or a DDR follows the decision-record test and the owner's locked teardown rule that an ADR recording a destination choice becomes a DDR only when next touched.

Open, settled at Plan from project evidence unless it needs the owner:

- Whether the Map verb shares the existing Map row with the noun or takes its own row. Settled by TK-006D: it shares the row, because the verb is writing the noun the row defines; the Map row's definition gains one sentence for the verb and its distinction says one row serves both, so no term has two rows.
- How "delivered" is kept to one meaning: the Delivered verb (approved work on main), the Approve row's "delivered result", `AGENTS.md`'s "reviewed delivery on integration" and the `S-###:delivered` qualifier. A distinction in the rows is Plan's; renaming the public qualifier would change a public contract and is the owner's call. Settled in part by TK-006D: the Delivered row states the distinction (the verb is approved work on main; the `S-###:delivered` qualifier and `AGENTS.md`'s "reviewed delivery on integration" name the earlier stage, reviewed PASS contained in integration, before owner approval). The Approve row's "delivered result" is the owner's card text and means the integration result awaiting approval, the earlier stage. Renaming the qualifier stays the owner's call and is not made.
- Whether the Confirm row and `AGENTS.md`'s "Confirmation of understanding never grants implementation or promotion authority" speak of the same confirmation, and how they are reconciled, one writer per file. Settled by TK-006D from project evidence: they do not. The `AGENTS.md` sentence sits in Session Records And Checkpoints and speaks of the Confirmed state the Landmark Tracker records on question cards and landmarks, which is evidence of understanding; the Confirm verb is the owner's agreement to a readback, which authorizes the agents. The Confirm row says so and leaves any rewording of the `AGENTS.md` sentence to the Contract Carrier Pointer-Brief Rewrite, which owns that file.
- How the Contract artifact and Routing artifact rows relate to the Workbench Contract row and the accepted three-carrier records (ADR-000C, ADR-000W). The owner deferred the Lexicon's own status ("we can debate lexicon later"), and the Runbook's belongs to the Contract carrier rewrite; this Spec states the distinction and changes neither record. Settled by TK-006C: the Contract artifact row is defined by being loaded every turn and says the Workbench Contract row names a different thing (the binding claim set and its carriers); the owner's later Runbook and Lexicon statements are quoted on the Contract artifact row and the Routing artifact row leaves their kind to the Contract carrier rewrite, so neither record changes.
- Whether the Scaffolding and Architecture artifact rows stay separate or one becomes the other's alias, without letting one word mean two things. Settled by TK-006C: they stay separate rows because the owner asked for each artifact kind to have its own; the Scaffolding row says it names the architecture artifacts taken together and the Architecture artifact row says it is one of them, so the two are one concept seen as a whole and as a single artifact.
- Which plane, if any, the new verbs write at. The owner assigned planes to the first eight verbs only; this Spec assigns none. Settled by TK-006D: none; the Writer verb row says the owner assigned planes to the first eight verbs only.

Settled at TK-006C: `templates/LEXICON.md` carries the Owner, Room, Scaffolding, three artifact-kind and Control rows and the retired Root controls row, with the producer owner's quotations left out. It carries no Workbench Template row: that term is LLM Workbench's own product (the producer and product decision), so a generic room has nothing to define there. This is the recorded exemption for that one row.

## Non-Goals

Rewriting the Workbench, Project, Portable Workbench, Evaluation or Harness rows (the AI Coding Dictionary Terms Spec owns them); carrying the verbs into skills, tools, templates beyond the Lexicon mirror, or the Landmark Tracker; renaming any command, status, tool, test, file or Spec slug; the Contract carrier rewrite; the Blueprint page itself; deciding the Runbook's or the Lexicon's artifact kind; implementing another capability.

## Dependencies And Blockers

- `LEXICON.md` and `templates/LEXICON.md` have one writer at a time. The owner's Codex Lexicon reconciliation (Task TK-01Q of the [Lexicon Design-Concept Reconciliation](../S-01U-lexicon-design-concept-reconciliation/SPEC.md), from branch `codex/s01u-tk01q-lexicon-reconciliation`) landed in integration on 2026-10-03 through PR #281; that Spec stays active for its whole-Lexicon audit, so its later writes and this Spec's rows still take turns, as do [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) and [Corrective Work Rules](../S-004F-corrective-work-rules/SPEC.md).
- The AI Coding Dictionary Terms Spec's harness reconciliation rewrites the Workbench and Project rows that the Room, Owner and Workbench Template rows sit beside, and its batch 2 adds Environment, Filesystem, Automated check, Automated review and Software factory, which several rows here name. Land in either order, but each row names its neighbors as they stand when it lands.
- The [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) does not share the verb rows; it predates the workflow verbs and is at its owner gate, so this Spec starts from the integration text and does not reopen it.
- [Decision Record Tooling](../S-003X-decision-record-tooling/SPEC.md) installed the `ddr` collection, the command that writes a DDR and the accept, supersede and deprecate moves for both kinds on 2026-10-03; the decision record, of either kind, uses them.
- The [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) owns `AGENTS.md`, `RUNBOOK.md` and how the Runbook becomes more important; the inventory of retired "controls" uses hands to it unless this Spec lands first.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices. A likely order: the Workbench term rows with the Root controls retirement; the Workflow verb and Workflow rows with the fourteen verb rows; the Blueprint and Foundry repairs; the decision record and its citations; then the template mirror and the controls inventory. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] `LEXICON.md` has exactly one row each for Owner, Room, Workbench Template, Scaffolding, Contract artifact, Routing artifact, Architecture artifact, Control and Workflow verb, each stating the owner's confirmed meaning and its distinction from its neighbors.
- [ ] Each of the fourteen workflow verbs has exactly one row stating its confirmed meaning, and the Workflow row states the open verb set and the delivery workflow Idea, Align, Confirm, Map, Plan, Journey, Approve, Delivered, Clean Up.
- [ ] The Align, Workflow, Blueprint, Root controls and Foundry rows no longer contradict the owner's answers recorded above, and the Lexicon no longer uses "controls" for files except in public names and retired-name rows.
- [ ] A decision record carries the Journey correction and the current verb decision, ADR-000X is narrowed or superseded for the changed points through the record lifecycle, and no active accepted decision claim still says Journey is Map, Plan, Implement, Review and Verify.
- [ ] No row assigns a meaning the owner did not confirm; each open question above is answered in the Spec with its evidence or left recorded as open.
- [ ] The template mirror carries the generic rows, or the exemption is recorded with its reason.
- [ ] Current-facing uses of the retired "controls" wording outside the Lexicon are inventoried and either corrected or recorded as drift for the Contract carrier rewrite.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`LEXICON.md`, `templates/LEXICON.md` and the decision record. A check that each term and verb named here has exactly one row; a retired-term sweep for "root controls" and "controls" meaning files, shaped like `tools/test-controls-vocabulary-sweep.mjs`, with each kept line excused by its exact text; the decision-record validator; and a cold-reader probe in which a fresh agent given only the Lexicon names the delivery workflow and says what Journey contains. String checks support the rows but do not prove a reader understands them.

## Verification Procedure

Run the targeted vocabulary, control-fidelity and decision-record tests and the full AGENTS suite against the committed candidate, then `render` and `doctor`. Capture the Workbench self-drift pre and post receipts with the bounded semantic check. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

`LEXICON.md` (new rows, the five repaired rows and the Last reviewed date), `templates/LEXICON.md` or a recorded exemption, a new decision record and the register and history derived from it, and the Wiki's [Workflow Verbs](../../wiki/design-concepts/workflow-verbs.md) article, which describes the eight verbs and the verbatim workflow map. Lines in `AGENTS.md`, `RUNBOOK.md` and `README.md` change only as Desired Behavior 2 states.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-03 | none | Authored at the Map step from the owner's Workbench term, workflow-verb and workflow answers confirmed on 2026-10-03 in the Blueprint teardown, at integration 5cfa987bacb0f6a9273d93e8d989e34000d75ad9. | Map only; the quoted Lexicon rows, the workflow-verbs decision, the template Lexicon's rows, the `delivered` qualifier and the related Spec records were read at that tip; no runtime proof claimed. | This Spec and the generated Spec catalog. Docs checked; no Lexicon, decision-record or Wiki update is due until delivery, because a planned Spec changes no accepted meaning. | Plan, implementation and proof remain; six questions are open for Plan. |
| 2026-10-03 | none | Plan: activated the Spec and cut five serial Tasks from live Actuality at integration f91bfd72; each Lexicon Task mirrors its generic rows into the template as it lands, and the last Task inventories the retired controls wording outside the Lexicon. The open questions are settled Task by Task, each recorded here with its evidence when its Task closes. | Plan only; the Lexicon rows, the workflow verbs decision, the decision-record commands and the DDR collection were read at that tip; no runtime proof claimed. | This Spec only. | Implementation and proof remain in the five Tasks. |
| 2026-10-03 | TK-006C | Task closed | Red 9381d06f then green: test-control-fidelity 32/32, templates evaluator, full AGENTS suite 48/48 on clean 0120bfcc | LEXICON.md and templates/LEXICON.md carry the Workbench term rows and the retired controls wording is repaired in both; Spec settled questions recorded | Verb rows, Blueprint and Foundry repairs, decision record and controls inventory remain in four Tasks |
| 2026-10-03 | TK-006D | Task closed | Red 73e4610e then green: control-fidelity 33/33, test-adr 56/56, full suite on clean 75af5dbf all pass except one temp-directory race in test-spec-workbench that passes alone 59/59 | Lexicons carry the workflow verb rows; Align meaning check updated | Blueprint and Foundry repairs, decision record, controls inventory and Workflow Verbs article remain |
| 2026-10-03 | TK-006E | Task closed | Red c0092e9c then green: control-fidelity 35/35, test-adr 56/56, full AGENTS suite 48/48 on clean ce96ae40 | Blueprint and Foundry rows repaired; the Wiki router routes the two delivery pages and names the four-part Blueprint | Decision record, controls inventory and Workflow Verbs article remain |
| 2026-10-03 | TK-006F | Task closed | Red bb222f94 then green: control-fidelity 36/36, test-adr 56/56, full AGENTS suite 48/48 on clean ff89e6a0 | ADR-000X amended in place under ADR-000A's amendment-first rule: open verb set and the Journey correction; nothing superseded | Controls inventory, Workflow Verbs article and cold-reader probe remain; the release proof DDR needs a visible correction |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Carrying the verbs into the skills, controls, templates and Landmark Tracker is a separate rollout: the owner confirmed in the teardown that the workflow map moves to the Workflow landmark and the Wiki in the verbs, and that a rollout carries each verb out as it locks. No Spec for that rollout exists yet. Whether Harness Feedback Review becomes an eighth landmark or a verb family under Workflow is open in the owner's confirmed landmark set.

## Supersession

- Supersedes: none
- Superseded by: none
