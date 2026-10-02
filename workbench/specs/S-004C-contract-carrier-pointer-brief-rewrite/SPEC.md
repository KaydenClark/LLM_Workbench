# S-004C - Contract Carrier Pointer-Brief Rewrite

**Spec ID:** S-004C
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Rewrite AGENTS.md as a short standing brief and RUNBOOK.md as an operations index of context pointers, with each operation's procedure and binding requirements in a tracked skill the carrier points to.
**Blockers:** none for specification. Whether this is one Spec or a landmark with several Specs was not stated by the owner. The role skills must exist before role detail leaves the controls. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner-confirmed Contract-carrier decision record of 2026-10-02, which calls the rewrite its own work with its own Destination Packet; no Task is cut.
**Next gate:** At Plan, inspect live Actuality, decide with the owner whether this stays one Spec, and cut small Tasks within it.

> **Citation anchors.** pre=`cbb3d5b81c0081c45d92e0d284078ca13fd54c03` post=`cbb3d5b81c0081c45d92e0d284078ca13fd54c03`.

## Outcome

`AGENTS.md` is the project's standing brief: short, declarative lines that apply in every session and that an agent cannot derive from the code. `RUNBOOK.md` is an index of operations, a sentence per topic with a context pointer, whose procedures live in tracked skills. `LEXICON.md` says what terms mean and where each kind of information belongs. A skill a carrier points to for an operation carries Contract force for that operation, and nothing is lost: every line removed from a carrier landed in a named home first.

## Why It Matters

The owner adopted the AI Coding Dictionary definitions of AGENTS.md, progressive disclosure, context pointer and skill for the Workbench, and confirmed that the always-loaded file pays for everything in it on every turn. At the pre anchor `AGENTS.md` fails that definition, and the accepted decision records the rewrite as an implementation gap, not as delivered. It also records that the Instruction Authority list changes only when the rewrite delivers it, so the Contract and the accepted destination disagree until this work lands.

## Current Verified State

At the pre anchor:

- `AGENTS.md` is 618 lines and 35,903 bytes, loaded on every turn; `RUNBOOK.md` is 2,393 lines and 138,342 bytes with 15 top-level and 41 second-level sections holding full procedures; `LEXICON.md` is 283 lines and 60,892 bytes; `BLUEPRINT.md` is 340 lines.
- The Instruction Authority list in `AGENTS.md` names the user request, `AGENTS.md` with platform limits, the assigned Spec as a bounded delegate, and the Runbook and Lexicon as the other Contract carriers. It does not name a pointed skill or a landmark.
- The Contract's shape is depended on by code. Ten runtime tools name `AGENTS.md` (`adr.mjs`, `claim-coordination.mjs`, `diagnostics.mjs`, `self-drift.mjs`, `sessions.mjs`, `spec-workbench.mjs`, `task-packet.mjs`, `template-placeholders.mjs`, `wiki.mjs`, `workbench-layout.mjs`), and 21 test files read `AGENTS.md` or `RUNBOOK.md` content. Two tests extract the text between the `### Instruction Authority` and `### State Resolution` headings.
- The root `LEXICON.md` states the accepted definitions of the carriers' jobs; the controls do not yet follow them.
- `workbench/skills/` holds 27 skills; the role skills the rewrite points to for role detail do not all exist yet (see [Captain Role And Landmark Director](../S-004B-captain-role-and-landmark-director/SPEC.md)).

No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. `AGENTS.md` answers "What must I obey?": the agent's operating rules, authority, permissions, boundaries, required behavior and the conditions for accepting work, in short declarative lines. Anything that can be progressively disclosed is a context pointer or a skill. Rules that apply in every session stay lines in `AGENTS.md`.
2. `RUNBOOK.md` answers "How do I do it?" as an operations index: a sentence per topic and a context pointer, meaning a stable path plus a description of when following it is worth it, written to match how tasks present.
3. `LEXICON.md` answers "What does that mean, and where do I look?". Where `AGENTS.md` says independent review is required before integration, the Runbook points to the commands that prepare, record and check it, and the Lexicon says what counts as independent review and links to both.
4. Authority flows through the pointer: a skill in the room's tracked skills lane that a carrier points to for an operation is part of the Contract for that operation, and its binding requirements carry Contract force while that operation is performed. Only the lane copy binds, and it wins over a drifted installed copy. A skill no carrier points to, including a room-added skill, teaches but does not instruct.
5. The Instruction Authority list says so, and names an assigned `LANDMARK.md` as a bounded delegate once that artifact is delivered, with the same limits as an assigned Spec.
6. Role detail leaves the controls: the role skills own what each role does, `AGENTS.md` keeps role-free rules such as scope by branch, the independence of review and owner-only approval and promotion to main, and the Lexicon keeps one sentence per role.
7. No line is removed before its new home exists. A recorded inventory maps every removed line to its home, and a mechanical check proves each landed.
8. Because a skill edit can now change binding behavior, a skill change gets the same review care as a Contract change; the lane's receipt hashes and the integration review already cover them.
9. The generic `templates/` mirrors and the update route carry the same shape, and updating a room preserves its own controls and any visible, deliberate divergence it records.

## Decisions And Contracts

- The Contract carriers follow progressive disclosure and each has the job stated above, with the placement test the owner restated from the ownership schema. See [Contract carriers are briefs that point to skills and authority flows through the pointer](../../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md) and the AI Coding Dictionary definitions it adopts.
- The Contract is still the claim set carried by `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` with the assigned Spec as a bounded delegate; a pointed lane skill now carries part of that set for its operation. This refines [skill composition within inherited scope](../../docs/adr/0045-skill-composition-within-inherited-scope.md) for pointed lane skills only.
- Authority does not come from a link a work record carries: a skill a Destination Packet assigns gains no instruction authority from the packet, only from a carrier's pointer.
- This is relocation, not a change of policy. No rule's meaning is changed by moving it; a rule that would change belongs to its own decision.
- The rewrite is its own work with its own Destination Packet: this Spec, the accepted decision, the role skills and the Lexicon definitions are the destination it links, and there is no second record that restates the destination.
- The current `AGENTS.md` text governs until this work delivers; until then the accepted decision is an implementation gap recorded in that decision.

Open, not decided here:

- Whether the rewrite is one Spec or a landmark with several Specs. The owner asked for "own packet" and did not say which.
- Which line-landing check form is used and where its inventory lives.

## Non-Goals

Changing the meaning of any rule, the owner's approval or main-promotion authority, the content of any skill beyond what carries a moved procedure, the Blueprint, the `LANDMARK.md` runtime, the Captain and Director skills, GitHub coordination, a version release or Template update, implementing another capability.

## Dependencies And Blockers

- The role skills must exist first so role detail has a home: [Captain Role And Landmark Director](../S-004B-captain-role-and-landmark-director/SPEC.md) and [Worker Role](../S-002E-worker-role/SPEC.md). No line leaves `AGENTS.md` before its home exists.
- [LANDMARK.md Artifact And Lane Runtime](../S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md) delivers the artifact whose delegate status the Instruction Authority list names; until then the list names only what exists.
- [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md) is the current owner of Contract rewrites and is at its owner gate. Two concurrent rewrites of `AGENTS.md` must not happen: [Completion Claims Against Repository State](../S-00M-completion-claims-against-repository-state/SPEC.md) already holds a Task until that Spec's `AGENTS.md` rewrite is contained in integration, and this rewrite follows the same rule. `AGENTS.md`, `RUNBOOK.md` and `LEXICON.md` are shared writers: one writer lane per file, coordinated with [Decision Record Tooling](../S-003X-decision-record-tooling/SPEC.md) and [Notepad Concurrent-Write Safety](../S-003Y-notepad-concurrent-write-safety/SPEC.md), which also touch them.
- The [Ownership Map root control](../S-00G-ownership-map-root-control/SPEC.md) states each artifact's ownership; coordinate so the moved lines land in owners it names.
- The tools and tests that read the Contract's structure must change with it. Treat them as part of this capability, not as a later cleanup.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains release ordering, version, Template and owner gates. Whether this rewrite precedes the v4 release is not claimed here.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices and safe parallel groups; a first slice is likely the non-destructive inventory of every line and its home, since nothing may be removed before its destination exists. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home (stays, skill, pointer, Lexicon, Wiki, or restates another owner and goes nowhere), and a check shows every removed line landed.
- [ ] `AGENTS.md` meets the brief definition: short declarative always-true lines and pointers, with its size and loaded cost recorded before and after.
- [ ] `RUNBOOK.md` is an operations index in which each pointer has a stable path and a when-to-follow description, and each operation's procedure is reachable in a skill.
- [ ] The Instruction Authority list states that a pointed lane skill binds for its operation and the lane copy wins, and names an assigned landmark once that artifact is delivered.
- [ ] A skill no carrier points to teaches and does not instruct, and a room-added skill is shown not to bind.
- [ ] Every tool and test that read the old shape passes against the new one, and the full suite is green.
- [ ] A fresh agent given only the rewritten controls and a Destination Packet can find and perform a representative operation (for example integration review and branch completion) through its pointer without the removed prose.
- [ ] The generic templates and the update route agree, and updating a room preserves its own controls and deliberate divergence.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The Contract carriers and the pointed skills in a fixture room, and a real before and after of this repository's own controls. The mechanical line-landing check, the tests that read the Contract's structure, and a one-minute scenario in which a fresh agent follows a pointer to an operation and performs it. Red/green cases cover a removed line with no home, an unpointed skill, a drifted installed copy, and an update of a room with its own controls. Routing or string checks support discovery but do not prove behavior.

## Verification Procedure

Run the targeted control-fidelity, vocabulary and governance tests and the full AGENTS suite, then `render` and `doctor`. Pin the candidate before source-identity checks. Capture the guardrail baseline before editing and the after-score, the remaining recommendations and the outcome limitation after, and never weaken a criterion to raise the score. Capture Workbench self-drift pre and post receipts with the bounded semantic check; a clean update is not claimed while known current-facing drift remains. Obtain separate-context review of the immutable candidate before integration, and keep owner Human QA separate. This Map record claims none of that proof.

## Documentation Impact

This Spec rewrites the Contract carriers and their `templates/` mirrors. Update the Lexicon's Root controls row and each carrier's definition, the Context Map routes, the README setup text if it names the old shape, and the routed Wiki articles for the changed operations. The accepted decision is history; its stated implementation gap is closed in this Spec's evidence, not by editing it.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-02 | none | Authored at the Map step from the owner-confirmed Contract-carrier decision record of 2026-10-02 at integration cbb3d5b81c0081c45d92e0d284078ca13fd54c03. | Map only; the control sizes and the tools and tests that read them were counted, no runtime proof claimed. | This Spec. | Plan, implementation and proof remain; one-Spec-or-landmark and the line-landing check form are open. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

If Plan finds this too large for one Spec, the owner decides whether it becomes a landmark with several Specs. The Worker role skill follows [Worker Role](../S-002E-worker-role/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
