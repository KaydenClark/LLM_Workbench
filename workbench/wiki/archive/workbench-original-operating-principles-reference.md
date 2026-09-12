---
type: meta
status: archived
sensitivity: normal
knowledge_role: historical
provenance:
  - Reconstructed from photographed handwritten source sheets, 2026-09-10 session
source_paths:
  - workbench/wiki/archive/workbench-original-operating-principles-reference.md
last_verified: 2026-09-12
---

# Workbench: Original Operating Principles and Unfinished Sketches

Reconstructed: 09/10/2026  
Status: Historical reference, Part 2. Not an implementation specification, approval, or current-state audit.

## Basis and reading key

This continuation reviews seven supplied images containing six unique sheets. The full-screen **Que thoughts** screenshot repeats the content of the larger cropped **Que thoughts** image. The sheets are undated; their dates and chronological order cannot be established from the handwriting alone.

**[Notes]** means directly recorded material, with ordinary spelling and spacing normalized where the reading is clear. **[Synthesis]** means an interpretation of those notes. **[Online context]** means separately researched supporting material. Uncertain readings and incomplete decisions remain identified.

The previous reference, *Workbench: Original Workflow Reference*, describes the delivery sequence. These sheets add ideas about failure prevention, agents, continuity, governance, operational visibility, and the practical work the system was meant to help with. They also contain broader GPT OS / Foundry ideas. They do not establish that every idea belongs inside Workbench core.

## Source register

| ID | Sheet | Uploaded source |
| --- | --- | --- |
| A1 | Code is Free / What's an Agent | `1000040893.jpg` |
| A2 | Que thoughts: completion, objectives, Scout, Captain, upcoming work | `1000040894.jpg`; duplicate view: `d65dfa54-d84f-4d46-9e7a-29a350507e7b-1_all_88857.jpg` |
| A3 | Planes of Authority / Planes of Governance | `1000040896.jpg` |
| A4 | Six-box stack: Frontline through Projection | `1000040897.jpg` |
| A5 | Roles across governance planes / claim-level classification | `1000040898.jpg` |
| A6 | Domain legend / Fall short / source-driven maintenance | `1000040901.jpg` |

## 1. Address classes of failure, not only individual mistakes

**[Notes: A1]**

The sheet begins with **Code is Free** and **Classes of Failure**, followed by an instruction to systematically eliminate the class of misbehavior.

Nearby mechanisms or reminders are:

- ADRs.
- Context.
- Reviewer agents.
- Add instructions at the end.
- Better error messages that actually explain how to fix the problem.
- `lint?`, with a question about searching every line for `fetch`.

**[Synthesis]** The intended improvement is larger than fixing the latest defective output. Identify what keeps going wrong, then improve the surrounding instructions, checks, or feedback so the same kind of mistake is less likely to recur.

A compact synthesis is:

**Observe repeated failure -> identify the shared cause -> add a reusable safeguard -> check subsequent work.**

This loop is editorial synthesis, not a diagram drawn on the sheet.

The ADR/context/reviewer/lint notes suggest several ways to carry an expectation forward. They are not presented as a mandatory sequence, and the page does not say that every failure requires all of them.

**Limits:** “Code is Free” is a framing statement, not a demonstrated claim that computation, review, hosting, or maintenance costs nothing. The `fetch` note is a question, not a completed lint specification. “Add instructions at end” does not identify which prompt, file, output, or stage is meant.

The small yellow annotation appears to read **Agents who check code when pushed**. This suggests review triggered by a push, but does not specify a CI configuration or merge gate.

## 2. Error messages are supposed to guide repair

**[Notes: A1]**

The requirement for better errors is explicit: they should tell the recipient how to fix the problem, rather than merely announce that something failed.

**[Synthesis]** A failure report is part of the agent's next working context. Its useful output is an actionable correction, not simply a red status.

*Illustration, not text from the notes:*

- Unhelpful: “Network policy violation.”
- Actionable: “This call bypasses the approved network helper. Use the helper and rerun the network-policy check.”

The upload does not prescribe that particular helper or a particular networking policy.

## 3. The agent sketch combines loops, tools, and memory

**[Notes: A1]**

Under **What's an Agent**, three components are written side by side:

| Component | Nearby annotation |
| --- | --- |
| Loops | Retry failed attempt. |
| Tools | Context engineer. |
| Memory | State, with “aware” in parentheses. |

A separate margin note reads `TUI?`.

**[Synthesis]** This sketches an agent as something that can act repeatedly, use capabilities, retain relevant state, and respond to failed attempts. The nearby annotations point toward retries, context engineering, and state awareness.

The arrangement should not be turned into a rigid formal definition. The notes do not specify a retry budget, stopping condition, memory format, persistence boundary, or mechanism for maintaining awareness. `TUI?` is not expanded or tied to an interface requirement.

## 4. Always-on assistance is a separate, broader sketch

**[Notes: A1]**

The bottom of the agent sheet lists:

| Capability label | What is actually specified |
| --- | --- |
| Heartbeat | Name only. |
| Channels | Name only. |
| Persistent memory | Name only. |
| Always-on daemon | Name only. |
| Alerts | Name only. |
| Continual learning | Name only. |

**Gemma 3** appears near the daemon note. **Auto skill** appears near continual learning.

**[Synthesis]** The cluster suggests an assistant that can remain available beyond one foreground conversation, receive or surface information, and carry experience forward. This is broader than executing a single development ticket.

**Limits:** The source does not define heartbeat frequency, supported channels, alert conditions, storage, hosting, or permission boundaries. The two blue annotations are not enough to establish a selected model or a specific skill-learning system. “Continual learning” does not, by itself, mean model retraining, automatic rule rewriting, or unsupervised self-modification.

## 5. Completion has to be consistent with the work left behind

**[Notes: A2]**

At the top, **complete?!** is paired with **Contains uncommitted work**.

A6 separately lists GitHub repository maintenance and **push / commit** among the areas that fall short.

**[Synthesis]** These notes question a completion report that does not account for the remaining repository work. Producing a satisfactory response and bringing the requested work to its intended finishing state are not necessarily the same event.

The concern can be retained as:

**A completion statement should make outstanding work visible rather than conceal it.**

The notes do not define a universal clean-working-tree requirement, require every artifact to be tracked, or authorize committing every outstanding change. They also do not specify branch, push, merge, or approval policy.

## 6. Objectives and roles appear, but their contracts are incomplete

**[Notes: A2]**

| Label | Recorded meaning |
| --- | --- |
| GPT OS | Project/system label. A smaller blue annotation beneath it is not confidently legible. |
| Master Objective | Large goal; durable state. |
| Scout | Read only; find information. |
| Captain | Label only on this sheet. |

**[Synthesis]** A broad objective should remain available while narrower information-gathering or execution work happens. Scout has a clear read-only boundary in the notes. Captain does not receive a complete definition here.

The sheet does not establish an objective schema, a role hierarchy, a delegation protocol, or who owns persistent state. Later interpretations of Captain, Director, Architect, Steward, or stances should not be inserted into this historical sketch.

## 7. Investigate uncertainty and make upcoming work visible

**[Notes: A2]**

Two diagonal prompts ask for attention to uncertainty:

- List what you are least confident about and investigate it. The first handwritten word appears to be “Numerate.”
- What do I not realize about the situation?

Below them, the sheet asks:

**Why don't I know what is about to be worked on?**

**Spec managers?** appears as a possible response, with a question mark.

**[Synthesis]** There are two distinct concerns: investigate weak assumptions, and make the selected next work understandable to the human.

They can be preserved without inventing a new role:

**Surface the uncertain points. Investigate them. Explain the next intended work.**

The note does not require exhaustive narration, give every task a separate approval gate, or establish a Spec Manager as a permanent system component. The small yellow wave drawing is unlabeled and cannot support a specific scheduling or performance interpretation.

## 8. Use the existing work records instead of repeatedly re-explaining the whole system

**[Notes: A2]**

At the bottom, the note questions why the whole Foundry is summarized when specifications and tickets already exist. It ends with a direction approximately reading **Just deploy @ issues**.

**[Synthesis]** The intended improvement is to make the existing work records useful enough to start from. Work should not depend on reconstructing the whole project narrative every time a particular issue is dispatched.

This connects to the earlier notes about keeping starting context small and implementing one ticket at a time. It does not eliminate the need to read relevant contracts, dependencies, or surrounding code. Nor does it select GitHub Issues as the only allowed task system or prescribe a dispatch API.

## 9. The governance notes distinguish different kinds of claims

**[Notes: A3]**

The upper list is headed **Planes of Authority**. Its terms and definitions are:

| Upper-list label | Written definition |
| --- | --- |
| Actuality | What exists. |
| Contract | Canon, written “Cannon.” |
| Evidence | What was proven. |
| Command | Asked for, not yet applied. |
| Memory | Enduring context. |
| Projection | What is rendered from all layers. |

The lower **Planes of Governance** list reads:

1. Actuality.
2. Canon, written “Cannon.”
3. Grounding.
4. Enduring Context.
5. Intent.
6. Projection.

**[Synthesis]** The apparent correspondences are Actuality/Actuality, Contract/Canon, Evidence/Grounding, Memory/Enduring Context, Command/Intent, and Projection/Projection.

These are apparent correspondences between two lists on the same sheet, not proof that every term has an identical final definition. In particular, the sheet does not separately define the full scope of Grounding.

The durable conceptual distinction is among observed state, governing statements, substantiation, retained context, requested change, and derived presentation.

## 10. The written precedence order needs clarification before it can become a rule

**[Notes: A3]**

Under **Who wins?**, the numeric chain is:

`1 > 3 > 2 > 5 > 6 > 4`

The next line reads:

**What is real > our claim > our plan > context > what is shown > what we want.**

There is a visible numbering correction above: Command changes from 4 to 5, and Memory changes from 5 to 4. The lower governance list uses Enduring Context as 4 and Intent as 5.

**[Source discrepancy]** The numeric chain and the numbering correction have not been reconciled on the page:

| Reading of the digits | Resulting order |
| --- | --- |
| Original upper-list numbering | Actuality > Evidence > Contract > Memory > Projection > Command. |
| Corrected upper-list numbering | Actuality > Evidence > Contract > Command > Projection > Memory. |

The plain-language line places context before what is shown and what is wanted, which resembles the original ordering, but it does not resolve the numeric discrepancy by itself.

**[Synthesis]** This is a draft conflict-resolution idea, not a settled executable precedence policy.

There is also an unresolved question about the scope of “wins”: does it identify the best description of current behavior, the authority to change behavior, or both? Observing that code behaves a certain way does not, by logic alone, establish that the behavior is allowed. That distinction is an interpretive caution, not a new governance rule supplied by the notes.

## 11. The six-box picture is a related sketch, not a confirmed crosswalk

**[Notes: A4]**

The boxes, from top to bottom, are:

1. Frontline.
2. The Source of Truth.
3. The Rules / Reports about the Truth.
4. Memory / Structure.
5. Intent.
6. Projection.

The third box contains both “Rules” and “Reports”; neither should be silently removed. Lines on the left visually group the boxes into three pairs, but those groups are not named.

**[Synthesis]** The picture appears related to the six-plane lists, but its labels are not explicitly mapped to them. Treating Frontline as exactly Actuality or The Source of Truth as exactly Canon would require a decision not recorded here.

The labels **Frontline** here and **Frontier** in the previous workflow notes should also remain distinct unless another source connects them. Similar names are not sufficient evidence of equivalence.

## 12. Planes classify claims, not entire files, directories, or artifact types

**[Notes: A5]**

The handwritten statement says that planes classify claims used in operations, not files, directories, or artifacts. The typed text below makes this explicit:

> The governance stack classifies individual claims and how they're used during operations. Not entire files, directories, or artifacts types.

The grammatical form “artifacts types” is preserved in this quotation.

**[Synthesis]** This is a more precise classification unit than assigning every document permanently to one plane. A single document may contain a governing statement, a requested change, retained explanation, or a report of a result. Its filename does not make all of those statements equivalent.

*Illustration, not an example from the upload:* a document might contain a required validation rule, a link to a scoped test result, and a proposed next task. Those statements have different uses even when stored in the same file.

The notes do not prohibit conventional artifact homes. They say that file or artifact type alone is not the unit being classified.

### Roles are shown as a different dimension

**[Notes: A5]** The diagram labels horizontal bands **Governance Planes** and vertical colored bars **Roles**. Five bars span different portions of six horizontal bands. The individual roles and individual bands are unlabeled in this drawing.

**[Synthesis]** Role and plane are separate dimensions: a role can operate across several planes. The drawing does not specify whether each span represents reading, writing, responsibility, review, or permission. Its colors cannot be converted into named roles or access rights without further evidence.

## 13. The practical target extended beyond software development

**[Notes: A6]**

A color legend identifies **Work, Dev, AI, Worldbuild, Game, Finance, Relationships**, and a separate outlined **System** category.

**[Synthesis]** The surrounding project was being considered across multiple areas of work and life, not solely as a code-generation workflow. The legend is a domain sketch, not a module architecture or a claim that every domain is Workbench scope.

Under **Fall short**, the recorded list is:

| Area | Recorded detail |
| --- | --- |
| WBRs | Exports -> definitions -> validation. |
| Invoices | Exports -> validations. |
| Excel automation | Written as “Excel Auto”; no further mechanism specified. |
| Operations reporting | Posting things such as the coaching log. |
| SOPs | Listed without elaboration. |
| GitHub repository maintenance | Push / commit. |
| Taskboard / Blueprint | Listed without elaboration. |
| Testing Workbench | “Complete” is written nearby; the status meaning and scope are not established. |
| Game playtesting | Listed without elaboration. |

A side note also mentions other material Jason sends. Its exact allocation across the adjacent tasks is not fixed by the drawing.

**[Synthesis]** These are practical shortcomings or candidate uses, not proof of implemented automation. The desired value included retrieving inputs, understanding definitions, validating results, maintaining records, and finishing the surrounding operational steps.

The “complete” annotation does not establish that Workbench testing is complete now, or even identify exactly what had been completed then.

## 14. A source-driven maintenance workflow is written explicitly

**[Notes: A6]**

The page records the concern that **projects inside GPT online are stale**.

A bracketed sequence below it says:

**Read the source -> Analyze -> Update canon -> Produce an exception list -> Ask only for decisions that cannot be safely inferred.**

Two additional lines propose:

- Give GPT permission to get its own data.
- A safe list of automatically allowed work.

The red line at the bottom lists limitations involving Team/Teams, SharePoint, Paycom, and PBI.

**[Synthesis]** The intended operating pattern is to retrieve source material, do the analysis and authorized maintenance, then return the genuinely unresolved cases to the human. It aims to reduce repeated manual feeding of information and avoid asking the human to settle what the available sources can already answer.

The safe-list note is important: the autonomy being considered has a boundary. The page does not define that list, grant current access, authorize unrestricted canon changes, or eliminate approval for consequential actions.

The stale-project observation and access limitations are historical observations in the source. They are not a current assessment of the user's tools or of product capabilities.

## 15. Supporting online context

**Research date: 09/10/2026.** These sources are separate from the handwritten record.

### O1. A close source match

Ryan Lopopolo's AI Engineer talk closely matches A1's recurring failures, reviewers, linting, and actionable errors around 11:21-15:10. Its networking example specifies retries and timeouts, details absent from A1. Publication date and Kayden's viewing date remain unconfirmed. [O1]

### O2. A dated companion

Lopopolo's OpenAI article, published **02/11/2026**, describes enforceable checks, remediation instructions, and a small navigation entry point into deeper repository knowledge. These support the failure-prevention and task-focused-context themes without defining this project's architecture. [O2]

### O3. Agent background

Anthropic's agent article, published **12/19/2024**, discusses tools, memory, and feedback-driven loops. It is compatible background for A1, not a confirmed source attribution or a requirement for an always-on assistant. [O3]

### Attribution boundary

The research did not establish the source of the six-plane vocabulary, the precedence rule, or the Gemma 3 / Auto skill annotations. Those remain unresolved.

## 16. What these sheets add to the earlier workflow

**[Synthesis across both sets of notes]**

The earlier notes describe the delivery path:

**Idea -> Research -> Prototype -> PRD -> human alignment -> Taskboard -> Implement -> QA / Verify.**

These sheets add several concerns around that path rather than a replacement sequence:

| Addition | Relationship to the earlier workflow |
| --- | --- |
| Reusable failure prevention | Improve the checks and guidance surrounding repeated implementation and validation. |
| Truthful completion | Ensure the reported finish accounts for remaining work. |
| Uncertainty and next-work visibility | Improve exploration and the human's understanding of what is about to happen. |
| Claim-level governance | Distinguish what exists, what governs, what is supported, what is remembered, what is requested, and what is displayed. |
| Source-driven maintenance | Retrieve and reconcile available information before escalating unresolved decisions. |
| Persistent assistant ideas | Explore continuity and availability beyond a single development session. |
| Operational use cases | Test whether the system reduces real work, rather than only generating code or documentation. |

This organization does not make every candidate mechanism mandatory or assign each one to Workbench, Foundry, or GPT OS.

## 17. Compact reference statement

**[Synthesis]**

> Keep the intended outcome and the relevant work records available. Investigate weak assumptions and make upcoming work visible. Work from the necessary sources instead of repeatedly reconstructing the whole project. Use loops, tools, state, and verification to carry tasks through to an honestly reported finishing state. When failures recur, improve the system's guidance or checks so the class of mistake is addressed. Distinguish individual claims by how they are used, not merely by their file names. Perform clearly authorized maintenance and return genuinely unresolved decisions to the human.

The always-on assistant and broader-domain ideas remain adjacent possibilities, not prerequisites for that statement.

## 18. Items to preserve as unresolved

| Item | Why it remains unresolved |
| --- | --- |
| Precedence chain | Command/Memory were renumbered without a matching revision to the chain. |
| Meaning of “wins” | Descriptive precedence and permission to act are not separately defined. |
| Upper/lower terminology | Apparent correspondences exist, but complete definitions and equivalences are not supplied. |
| Six-box crosswalk | No explicit mapping to the two numbered lists; “Rules / Reports” remains mixed wording. |
| Role spans | No legend, role names, or read/write/authority semantics. |
| Captain and Spec managers | Captain is only a label; Spec managers remains a question. |
| Master Objective | Large goal/durable state is recorded, but storage and ownership are not. |
| Reviewer annotation | Appears to read “Agents who check code when pushed”; the exact trigger and enforcement are not specified. |
| Add instructions at end | Destination and timing are not specified. |
| `lint?` and `fetch?` | Exploratory note, not a formal checker specification. |
| `TUI?`, Gemma 3, Auto skill | Marginal references without a settled integration. |
| GPT OS sub-annotation | Not confidently legible. |
| Continual learning | No learning mechanism, approval model, or change boundary. |
| “Testing Workbench / complete” | Annotation scope and historical status unclear. |
| Safe list | Proposed but not enumerated. |
| Commit/push completion | Pain point is recorded; exact completion and authorization policy is not. |

## Verification and boundaries

All seven new images were reviewed visually. There are six unique sheets; the duplicate Que thoughts screenshot contributes no additional substantive text. Uncertain handwriting and the governance-numbering discrepancy are recorded rather than silently resolved. Source dates were not inferred from upload dates. No current repository, account, connected application, or project implementation was audited. No actions described inside the notes were executed.

The original workflow reference was preserved unchanged. This continuation can be read separately or as Part 2 of the combined historical reference.

## Online source register

- **O1.** AI Engineer, *Harness Engineering: How to Build Software When Humans Steer, Agents Execute*, Ryan Lopopolo. Organizer page and linked talk. Publication date not established from retrieved text; accessed 09/10/2026. https://ai.engineer/talks/am_oeAoUhew-harness-engineering
- **O2.** Ryan Lopopolo, OpenAI, *Harness engineering: leveraging Codex in an agent-first world*. Published 02/11/2026; accessed 09/10/2026. https://openai.com/index/harness-engineering/
- **O3.** Anthropic, *Building effective agents*. Published 12/19/2024; accessed 09/10/2026. https://www.anthropic.com/engineering/building-effective-agents
