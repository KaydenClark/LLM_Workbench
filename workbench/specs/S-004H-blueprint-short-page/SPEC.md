# S-004H - Blueprint Short Page

**Spec ID:** S-004H
**Status:** active
**Priority:** 2
**Owner:** claude-lane-e
**Stance:** Builder
**Updated:** 2026-10-03
**Catalog description:** Replace the eight-section Blueprint with the owner-confirmed four-part short page, give every room's Blueprint that shape, and move the current page's decisions, workflow map and rules to their homes first so nothing is dropped.
**Blockers:** none. The Decision Record Tooling (S-003X) installed the `ddr` collection and the 24 destination decision records are accepted (`workbench/docs/ddr/000A` to `000X`), so the root page swap is unblocked. One open owner item, the hosted-service non-goal, is withheld from the page rather than blocking it (see Dependencies And Blockers).
**Latest event:** TK-005R closed with proof.
**Next gate:** Complete TK-005Q.

> **Citation anchors.** pre=`5cfa987bacb0f6a9273d93e8d989e34000d75ad9` post=`5cfa987bacb0f6a9273d93e8d989e34000d75ad9`.

## Outcome

`BLUEPRINT.md` is the short page the owner confirmed on 2026-10-03: what LLM Workbench is, who it serves, the outcomes it promises and what it is not, in 631 words by `wc -w`. Every room's Blueprint, including the generic `templates/BLUEPRINT.md`, takes the same four-part shape. Nothing the current page says is lost on the way: its decisions live in decision records, its directions in the confirmed landmarks, its workflow map in the Workflow landmark and the Wiki, and its rules in the Contract. The tests, evaluators and guidance that assume eight sections change with the page.

## Why It Matters

The owner's locked answers make the current page wrong in shape and in content. It opens "LLM Workbench is a portable operating harness", which the owner's harness answer rejects; it carries decisions, a verbatim workflow map, qualities and procedures that the owner placed in decision records, landmarks, the Wiki and the Contract; and its eight sections are the shape the owner replaced for every room. The owner said what the Blueprint is for: "a high-level summary of the direction we want to head and the choices that got us this far", which "makes us ask questions; it does not give definite answers." Until the swap lands, an agent that opens the Blueprint learns the old product and the old shape.

## Current Verified State

At the pre anchor:

- `BLUEPRINT.md` is 341 lines and 2,954 words (`wc -w`) under eight `##` headings: Product Destination, People And Problems Served, Promised Outcomes, Desired Experience And Behavior, Integrated System Design, Cross-Cutting Qualities And Constraints, Desired Lifecycle and Non-Goals. It opens "LLM Workbench is a portable operating harness", links four ADRs, one Wiki page and the Lexicon's Task Routing, and carries the owner's 2026-09-24 workflow map verbatim in a `text` block with a labeled interpretation, the corrective-work and closure passages, roles, stances and branch topology. It has not changed since the teardown read it at integration 6057e347be7e4ac2506fdc9d2dddeff131f3c09f.
- `templates/BLUEPRINT.md` has the same eight headings with bracketed placeholders, and its Desired Lifecycle section carries a generic workflow paragraph (Align to a confirmed design concept, an optional prototype, Worker self-check, Dispatcher QA and Director review, owner evaluation, main before completion, feature capture and transient cleanup).
- `tools/test-blueprint-contract.mjs` asserts that both files' `##` headings are exactly the eight; that the root page keeps the owner's workflow map byte for byte as carried at commit 482dc6beaa9fd4a0f85fe2f7c401781b0020c4ff, with mutation controls; 47 workflow, altitude, loop, role, Human QA, closure and topology claims by regular expression; and three claims the page must not make. It also checks the claim-disposition inventory of the blueprint and active-ADR Spec (S-00A), which reads historical commits and does not depend on the current page.
- The evaluator `tools/evaluate-workbench.mjs` scores the project model from Blueprint patterns: `## Product Destination` with `## Promised Outcomes`, `## Integrated System Design`, `## Cross-Cutting Qualities And Constraints` with privacy and evidence words, and Non-Goals with privacy or safety words. `tools/test-evaluate-workbench.mjs` asserts that removing any of those four headings leaves a project-model criterion unmet. The full suite runs the evaluator against `templates`.
- `tools/audit-guardrails.mjs` treats a Blueprint with a `## Product Destination` heading as a destination-shaped Blueprint and otherwise falls back to the legacy checks, which expect a "Last reviewed" date and a harness-version stamp in the Blueprint; `tools/test-guardrail-audit.mjs` and `tools/test-workbench-layout.mjs` build fixture Blueprints with that heading.
- Genesis and adoption tooling parses no Blueprint section. `tools/genesis-from-decisions.mjs` requires a filled Blueprint to have a `#` and a `##` heading, no template placeholder and no generated catalog region; `workbench/tools/workbench-layout.mjs` exempts the Blueprint from the version stamp; `workbench/tools/spec-workbench.mjs` touches the Blueprint only for a legacy catalog region; `tools/control-fidelity.mjs` compares it line by line with its template, and `workbench/tools/self-drift.mjs` and `tools/test-controls-vocabulary-sweep.mjs` read it whole; none of them parses a section. The guidance does name the sections: `templates/GENESIS.md` tells Genesis to fill the eight sections by name.
- Descriptions of the Blueprint's content elsewhere follow the eight sections: the Lexicon's Blueprint row and its template mirror, `AGENTS.md` Instruction Authority ("the routed product destination and cross-cutting architecture owner", pinned by `tools/test-control-fidelity.mjs`) and its Documentation Ownership table ("cross-cutting product direction and invariants"), `templates/README.md`, the Wiki router `workbench/wiki/MEMORY.md` and its template, the `to-docs` skill, and the Wiki's Workflow Verbs article, which points to the Desired Lifecycle map.
- The Decision Record Tooling Spec (S-003X) is active: the `ddr` collection exists at `workbench/docs/ddr/` with `proposed/` and `archive/` folders and an empty register, `workbench/tools/adr.mjs new --kind ddr` writes a DDR into `proposed/`, and `accept`, `supersede` and `deprecate` move ADRs and DDRs by folder; the read words are its next Task. No DDR has been written yet. The Landmark Tracker holds the 24 starting landmark records; the `LANDMARK.md` artifact is not installed ([LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md)), and regrouping the records belongs to [Landmark Record Migration And Tracker Regrouping](../S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md).
- The v4 release Spec already carries one full cycle on another workbench as a release task and acceptance line.

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. **Homes first.** Before the root page is replaced, every claim the current page makes has a home that exists, following the teardown's locked answers:
   - a claim an accepted decision record already carries goes nowhere, and no DDR repeats it;
   - the destination decisions the owner locked in the teardown are DDRs, written at Map through `to-docs` into the `ddr` collection, with the reasons the owner confirmed, and accepted;
   - nesting (a room can hold other rooms, each project with its own workbench; a parent workbench owns what its children share, and a child owns only what is its own) is a DDR, and possibly also an ADR for the mechanism;
   - directions follow the confirmed landmark set, in the landmark records as they exist at swap time;
   - the owner's workflow map moves to the Workflow landmark and the Wiki, rewritten in the workflow verbs and no longer kept verbatim;
   - the privacy rule, the rule that no record grants authority, and the rule that the workbench never publishes or changes another project on its own live in `AGENTS.md` or the Runbook;
   - the full cycle on another workbench stays with the v4 release Spec;
   - explanations go to their Wiki articles.
   The teardown prepared a paragraph-by-paragraph disposition of the current page; Plan re-verifies it against the page as it then stands and records each paragraph's home before the swap.
2. **The page.** `BLUEPRINT.md` becomes the owner-confirmed candidate quoted in Decisions And Contracts, word for word. It links no record that carries an identifier.
3. **Every room.** `templates/BLUEPRINT.md` takes the same four parts (what it is, who it serves, promised outcomes, non-goals) with generic bracketed placeholders, and its generic workflow paragraph's claims are each given a home in the generic mirrors first. Genesis guidance in `templates/GENESIS.md` asks for the four parts.
4. **Checks follow the shape.** `tools/test-blueprint-contract.mjs` checks the four-part shape in both files and stops pinning the workflow map and the eight-section claims, which move with their content to the tests of their new owners where a test is warranted. `tools/evaluate-workbench.mjs`, `tools/test-evaluate-workbench.mjs` and `tools/audit-guardrails.mjs` recognize the four-part Blueprint and look for each criterion at the owner that now holds it; no criterion is dropped to keep a score, and the guardrail score is captured before and after.
5. **Descriptions follow the page.** The routing and description lines listed in Current Verified State describe the four-part page and what the Blueprint is for. The Lexicon's Blueprint row meaning belongs to [Workbench Terms And Workflow Verb Rows](../S-004G-workbench-terms-and-workflow-verbs/SPEC.md); this Spec updates only that row's present-state sentence when the swap lands. `AGENTS.md` lines change here only if the Contract carrier rewrite has not already changed them, one writer per file.

## Decisions And Contracts

The destination page, labeled as the owner-confirmed candidate of 2026-10-03. The owner confirmed draft 6 of the short page on the Blueprint teardown review page and then, in chat, approved the efficiency clause on the smart-zone outcome (verbatim "Yes, approved."). The text below is draft 6 as the review page showed it, with that clause applied; draft 6 itself was draft 5 with four edits (agents map and plan each confirmed concept and carry it through the Journey; "then see it delivered and clean up"; the smart-zone outcome without its earlier progress clause; the project-management non-goal without the Command Information Center line). The teardown records draft 6's confirmation as the page's final concept readback.

> # LLM Workbench - Blueprint
>
> Its terms mean what the Lexicon says they mean.
>
> ## What it is
>
> LLM Workbench is an agentic management system: the workbench Claude Code and Codex use to align the owner's ideas and implement the owner's design concepts. Agents map and plan each confirmed concept and carry it through the Journey, and the owner approves the result or sends it back until the concept is realized.
>
> A harness runs one agent in one session; it does not know what the owner wants built, what has already been decided, what another agent is doing or what is left. The workbench manages exactly that, so the owner does not have to.
>
> In LLM Workbench's own room, the project is the next workbench, built with the current one. Every workbench is built to run as one room among many in an autonomous factory, the Foundry, and the Foundry needs the workbench proven first.
>
> ## Who it serves
>
> ### The owner
>
> The owner brings ideas and aligns on them with the agents, usually by grilling, until the design concept is shared, then confirms it. After that the owner is needed only to unblock, and to judge the finished result in Human QA: approve it or send it back. The owner gets a checked result without managing agents, sees what is running, changed, blocked or waiting on a decision, never explains the project twice, and can step in at any time.
>
> ### The agents
>
> The agents, in Claude Code and Codex, on any of the owner's devices or in the cloud, carry a confirmed concept the rest of the way: they map and plan it, implement it, check their own work, have it reviewed by an agent that did not build it before it merges, verify it once it lands, then see it delivered and clean up. They get a workbench that hands each session only the context its work needs, tells them what is decided and who owns each part, and carries their progress to the next agent.
>
> ## Promised outcomes
>
> - Work reaches the owner's Human QA only after automated checks and automated review pass it.
> - Many agents work one project at once, on any of the owner's devices or in the cloud, and combine their checked results.
> - Work is mapped and planned so every session stays in the smart zone and spends its tokens efficiently.
> - Everything a session needs lives in the project's GitHub repository; through progressive disclosure, a fresh session loads only what its work needs.
> - Every kind of truth has one maintained home, so an agent knows where to read it and where a change is written, and nothing is kept twice.
> - Claims of done say what actually happened; gaps are flagged, never faked.
> - What the work teaches lives on in the Wiki and decision records; the scaffolding is cleared away.
> - The skills agents need ship inside every room, where the workbench regulates and monitors them; a room adds the skills, scaffolding and procedures its work needs without tearing apart what is proven to work.
> - Setup drafts the workbench from one line or an existing project, and grilling confirms it; updates never cost a project its knowledge, unfinished work or deliberate choices.
> - Every release is proven by a project made from the Workbench Template taking a confirmed concept to the owner's approval in one pass.
>
> ## Non-goals
>
> - Not a harness.
> - Not a source of permission, and not proof that an agent always follows instructions.
> - Not a general-purpose project-management application or personal task manager.
> - Not a hosted service, database or paid service of its own: it lives in the project's repository and coordinates through its Git host.
> - Not a transcript or proof archive.

The owner's other Blueprint answers, all locked in the teardown on 2026-10-03:

- **Every room's Blueprint is the short page:** "The four-part short page (what it is, who it serves, promised outcomes, non-goals) replaces the eight-section shape for every room's Blueprint, not only LLM Workbench's."
- **What the Blueprint is for:** "The Blueprint is a high-level summary of the direction we want to head and the choices that got us this far. Each sentence can serve as a map toward an implementation plan, sometimes through maps at several scales; a sentence big enough to need its own map becomes a landmark. A decision is placed by asking whether it maps to a destination at the Blueprint's scale or to a more bounded one. The Blueprint makes us ask questions; it does not give definite answers. Definite answers and their details live on other artifacts, and a decision record answers why for one specific decision."
- **The workflow map:** "Your workflow map moves to The recursive workflow landmark and the Wiki, rewritten in the workflow verbs. It is no longer kept verbatim." The confirmed landmark set names that landmark Workflow.
- **The landmark set:** "Seven landmarks replace the 24-item starting inventory: Workflow, Context efficiency, Work from anywhere, Enduring context, Workbench artifacts, Workbench Template, and GitHub Coordination", the last kept because it is the only landmark already working. Whether Harness Feedback Review becomes an eighth landmark or a verb family under Workflow is open in that answer.
- **Nesting is a decision record:** "Nesting is recorded as a decision record, not on the Blueprint, because it is bounded and situational: a room can hold other rooms, each project with its own workbench; a parent workbench owns what its children share, and a child owns only what is its own." The owner's note, verbatim: "If not also an ADR". The owner's words on the same point: "This is bounded and situational. It does not land on the final blueprint. We do need this record though. a DDR."
- **Restatements go nowhere:** "When an accepted ADR already records a Blueprint claim, the claim goes nowhere and no DDR repeats it. ADRs written before DDRs existed that really record destination choices stay ADRs and become DDRs only when next touched."
- **Rules leave the page:** the privacy clause "is a rule, so it is promoted to AGENTS, whose Safety section already forbids committing private data"; and "Private content stays private, no record grants authority, and the workbench never publishes or changes another project on its own. These are bounded and situational rules, so they go to AGENTS or the Runbook, not the Blueprint."
- The accepted [workflow verbs decision](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md) says the Blueprint is written at Implement and goes through the verbs, not through a Spec and Tasks. This Spec therefore carries what must change with the page (the template, the contract test, the evaluator and audit checks, the Genesis guidance and the descriptions) and the homes-first gate; Plan decides whether the root page itself lands in one of this Spec's Tasks or as an Implement step those Tasks bracket.

Open, settled at Plan:

- The template's four-part placeholder wording. The owner confirmed the shape for every room, not template wording.
- Which of the 47 rung checks have a new owner whose tests should carry them, and which retire with the verbatim map.

## Non-Goals

Writing the DDRs or landmark artifacts themselves (written at Map and by the landmark Specs); the Lexicon rows beyond the Blueprint row's present-state sentence; the Contract carrier rewrite; the Setup and Genesis behavior that drafts a Blueprint from one line; renaming any file or tool; changing the confirmed page text; implementing another capability.

## Dependencies And Blockers

- **Open owner item (not a blocker): the hosted-service non-goal.** The candidate's non-goal "Not a hosted service, database or paid service of its own: it lives in the project's repository and coordinates through its Git host." is not carried by any accepted decision record: none of the 24 destination decision records carries it, and the Director's instruction for this Spec's build is that it is not an owner-locked claim and needs an owner decision. The swap leaves that one line out of `BLUEPRINT.md` and treats it as undecided; the owner decides whether it returns, and in what words. The other four non-goals stay: not a harness is carried by the accepted decision that the workbench is an agentic management system and not a harness; not a source of permission by the accepted instruction-authority and stance decisions; not a transcript archive by the accepted continuity and notepad decisions; and not a project-management application is the owner's confirmed draft 6 wording. The current page's "network access for ordinary local work" non-goal is dropped: the owner called it wrong in round 1 of the teardown.
- [Decision Record Tooling](../S-003X-decision-record-tooling/SPEC.md) installed the `ddr` collection, the command that writes a DDR and the move that accepts it. The root page is not replaced before the teardown's DDRs exist and are accepted.
- The confirmed landmark set lives in the Landmark Tracker's records until [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md) delivers the artifact, and [Landmark Record Migration And Tracker Regrouping](../S-004A-landmark-record-migration-and-tracker-regrouping/SPEC.md) regroups the records; the workflow map's landmark home is whichever exists at swap time.
- [Workbench Terms And Workflow Verb Rows](../S-004G-workbench-terms-and-workflow-verbs/SPEC.md) owns the Lexicon's Blueprint row meaning, and [AI Coding Dictionary Terms](../S-004E-ai-coding-dictionary-terms/SPEC.md) owns Smart zone, Automated check, Automated review and Harness, which the page uses; the page swap does not wait for those rows, but each takes its turn in the Lexicon, which has one writer at a time.
- [Corrective Work Rules](../S-004F-corrective-work-rules/SPEC.md) changes the rules the current page's corrective passages state; whichever Spec lands first removes or corrects those passages and their test pins.
- The [Contract Carrier Pointer-Brief Rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) owns `AGENTS.md` and `RUNBOOK.md`, where the three rules leaving the page land; one writer per file.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) keeps release ordering, version, Template and owner gates; a changed managed byte in `templates/` needs the normal bundle, version and install proof.

## Vertical Implementation Slices

Planned 2026-10-03 at integration 64c2c524, with the destination decision records already accepted. Three Tasks: TK-005Q records the re-verified paragraph disposition and writes the Wiki pages that hold the workflow and the altitudes; TK-005R teaches the evaluator and guardrail audit the four-part shape beside the eight-part one; TK-005S, after both, swaps the root page and the template, rewrites the contract test and updates the Genesis guidance. The three rules that leave the page have nearest existing homes in the Contract (`AGENTS.md` Safety And Change Control, Instruction Authority and Edit Scope); promoting the owner's explicit wording of the three into `AGENTS.md` or the Runbook belongs to the Contract carrier rewrite, which owns those files, and the disposition records that handoff.

## Acceptance Criteria

- [ ] Every paragraph of the current `BLUEPRINT.md` has a recorded home that exists at swap time, and a reviewer can follow each to it.
- [ ] `BLUEPRINT.md` matches the owner-confirmed candidate quoted in Decisions And Contracts word for word, except the one non-goal line named in Dependencies And Blockers that is withheld until the owner decides it, and links no record that carries an identifier.
- [ ] `templates/BLUEPRINT.md` has the four parts with generic bracketed placeholders, each claim of its former workflow paragraph has a home, and `templates/GENESIS.md` asks for the four parts.
- [ ] `tools/test-blueprint-contract.mjs` checks the four-part shape in both files and no longer pins the eight sections or the verbatim map, and every check that left it either moved to a new owner's test or is recorded as retired with its reason.
- [ ] The evaluator and guardrail audit recognize the four-part Blueprint, no criterion was removed to keep a score, and the before and after scores are recorded.
- [ ] The description lines named in Current Verified State describe the four-part page, or are recorded as drift handed to the Contract carrier rewrite.
- [ ] The full AGENTS suite passes on the committed candidate, and named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-blueprint-contract.mjs` against both Blueprints; `scoreWorkbench` in `tools/evaluate-workbench.mjs` and the audit in `tools/audit-guardrails.mjs` against four-part and eight-part fixtures; the Genesis guidance and a fresh-project generation that carries the new template; and a byte comparison of the root page with the quoted candidate. Red/green cases cover an eight-section Blueprint refused by the new contract, a four-part Blueprint scored at its actual owners, and the audit's destination detection on the new shape. A cold reader given only the new page should be able to say what the product is and is not.

## Verification Procedure

Run the targeted Blueprint-contract, evaluator, guardrail-audit, Genesis and layout tests and the full AGENTS suite against the committed candidate, then `render` and `doctor`. Capture the guardrail baseline before editing and the after-score, remaining recommendations and outcome limitation after, and never weaken a criterion to raise the score. Capture the Workbench self-drift pre and post receipts with the bounded semantic check. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

`BLUEPRINT.md`, `templates/BLUEPRINT.md`, `templates/GENESIS.md`, the Blueprint row's present-state sentence in `LEXICON.md` and its mirror, `templates/README.md`, `workbench/wiki/MEMORY.md` and its template, the `to-docs` skill, the Wiki's Workflow Verbs article and the Wiki home of the workflow map, and the `AGENTS.md` description lines unless the Contract carrier rewrite has already changed them.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-03 | none | Authored at the Map step from the owner-confirmed Blueprint candidate of 2026-10-03 and the teardown's Blueprint answers, at integration 5cfa987bacb0f6a9273d93e8d989e34000d75ad9. | Map only; the quoted page is draft 6 as the review page's confirmed version showed it, compared word for word after extraction, with the approved efficiency clause applied; the Blueprint, template, tests, evaluator, audit, Genesis and layout tooling and the description lines were read at that tip; no runtime proof claimed. | This Spec and the generated Spec catalog. Docs checked; no Blueprint, template or Wiki update is due until delivery, because a planned Spec changes no accepted claim. | Plan, implementation and proof remain; the swap waits for the DDRs. |
| 2026-10-03 | TK-005R | Task closed | Separate-context review of 72e2e624 PASSED against the written acceptance (after eight rounds that closed real holes and one accepted gap). Full AGENTS suite 48/48 on cfad0cbb. Guardrail audit 78/100 before and after; template evaluation 106.6/113 before and after, and 106.6/113 with a four-part Blueprint; remaining recommendations unchanged (outcome evidence 8/30: no real repeated outcome trials, so no agent-outcome claim). Four-part page and template score project model 8/8 and are destination-shaped; eight-part files score identically to origin/integration. | Docs checked; no update needed: tools and tests only, the Blueprint, template and Wiki change in later Tasks | Raw-HTML and other synthetic Markdown edge cases of isFourPartBlueprint are not exhaustively handled (named in the receipt); no known gap against the written acceptance |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Writing the DDRs from the teardown is Map work, possible now that the Decision Record Tooling has installed the collection. Carrying the workflow verbs into skills, controls, templates and the Landmark Tracker is a separate rollout with no Spec yet.

## Supersession

- Supersedes: none
- Superseded by: none
