---
type: meta
status: archived
sensitivity: normal
knowledge_role: historical
provenance:
  - Reconstructed from photographed handwritten source sheets, 2026-09-10 session
source_paths:
  - workbench/wiki/archive/workbench-original-workflow-reference.md
last_verified: 2026-09-12
---

# Workbench: Original Workflow Reference

Reconstructed: 09/10/2026  
Status: Historical reference notes, not a new implementation specification.

## Basis and reading key

The primary source is Kayden's handwritten **AI workflows.pdf**, pages 1-9. Page 10 is blank. The separately uploaded workflow image reproduces the workflow on page 5.

**[Notes]** identifies material directly recorded in the handwriting. **[Synthesis]** connects those statements without treating the connection as a separately recorded decision. **[Online context]** identifies supporting material found outside the upload. Names and incomplete ideas are preserved rather than reconciled into the current Workbench.

## 1. The main workflow

**[Notes: p. 5]**

**Idea -> Research -> Prototype -> PRD -> HITL -> Taskboard -> Implement -> QA / Verify (HITL)**

HITL means **human in the loop**. Page 2 associates it with alignment and planning. Page 5 places it after the PRD and again at QA / Verify.

| Stage | What the notes say |
| --- | --- |
| Idea | Have an idea for an app. |
| Research | An exploration phase using `grill-me` and `wayfind`. Create `research.md` if execution is difficult. |
| Prototype | Hash out ideas in code to get feedback; provide assets. |
| PRD | Product Requirements Document. Describe the destination with user stories and implementation notes. |
| Taskboard | Turn the PRD into tickets with blocking relationships to facilitate parallel agents. |
| Implement | Execute the taskboard's tickets in a loop. Page 7 clarifies the unit: one ticket, repeat. |
| QA / Verify | Human-in-the-loop checking. The notes explicitly say to stop and check the work. |

**[Synthesis]** This is not simply a document-to-code pipeline. Exploration and prototyping help establish what to build; the PRD records the intended result; the taskboard divides the work; repeated implementation moves toward the result; human QA checks what was actually produced.

The diagram records an order, but does not specify which stages may be skipped, mandatory artifacts for every change, or formal approval rules.

## 2. Keep work inside the AI's useful context

**[Notes: pp. 1-2]**

The first page sketches an **AI Smart Zone**, followed by a **Dumb** zone, with a boundary marked around **100k tokens**. Different task sizes illustrate work that fits within or extends beyond that boundary.

Two approaches to large work are recorded:

- **Multi-phase plans:** break the work into bite-size pieces. `prd.md` describes the product requirements; `plan.md` organizes the phases. The margin associates these with **Blueprint** and **Roadmap**.
- **Ralph Wiggum / Ralph Loop:** start from a PRD and repeatedly make a small change toward the destination.

**[Synthesis]** The design lesson is to make large outcomes achievable through small working sessions, rather than relying on one increasingly large conversation.

**Limit of the source:** 100k is the number recorded in the sketch. These notes do not establish a measured, universal threshold for every model or task, or a final Workbench token budget.

## 3. Memory and the shape of a session

**[Notes: p. 2]**

The memory page is headed **Clearing** and divides session context into four parts:

| Context component | Recorded description |
| --- | --- |
| Baked-in default | Keep it small. |
| Exploratory | What is in your project. |
| Implementation | Building, searching, doing. |
| Validation | Testing, updating docs, saving work. |

**[Synthesis]** Default context and working context serve different purposes. An agent needs enough starting information to orient itself, then gathers what it needs for the current work. The document and task records discussed elsewhere provide a way to carry relevant information outside a single conversation.

The notes do not define a specific memory database, notepad schema, retention policy, or handoff protocol. The visible memory concern is keeping the starting context small and structuring work around sessions that can be cleared.

## 4. Shared design understanding comes before execution

**[Notes: p. 4]**

The section **The Design Concept** connects `/grill-me` with Frederick P. Brooks and a book-title note reading approximately *The Design of the Design*.

The recorded argument is that plan mode is too vague by itself: the human and AI need a shared understanding and need to be on the same wavelength. `/grill-me` is intended to help establish that understanding.

A related note says to verbalize software best practices and develop a vocabulary for using them with AI.

**[Synthesis]** The product of grilling is alignment about the design, not merely a completed questionnaire or a longer plan. The written documents carry parts of that understanding forward.

**Attribution limit:** These are notes about Brooks's influence, not quotations verified against the book.

**[Online bibliographic clarification]** The publisher lists the title as *The Design of Design: Essays from a Computer Scientist*, by Frederick P. Brooks, published 03/22/2010. This clarifies the reference, not the content of the handwritten argument. [W7]

## 5. Destination, journey, and the documents supporting them

**[Notes: pp. 1, 3, 5-7]**

The recurring distinction is between the **destination** and the **journey**. The PRD explicitly describes the destination. Plans and tickets organize the work toward it.

| Artifact or label | Recorded purpose or association |
| --- | --- |
| `prd.md` / PRD | Product requirements and destination; user stories and implementation notes. Associated with Blueprint. |
| `plan.md` | Multi-phase planning. Associated with Roadmap. |
| Taskboard / issues / tickets | Break the work into executable pieces, including blocking relationships. `/prd to issues` is described as building the taskboard. |
| `research.md` | Research record when execution is difficult. |
| `context.md` | Language/definitions, relationships, and flagged ambiguities. A margin note says it is like Blueprint. |
| `SPEC.md` | Per-feature, disposable synthesis from one grilling session. |
| `prompt.md` | Prompt input for the Ralph execution setup. |

**Important unresolved naming:** These pages do not establish one final equivalence among PRD, Blueprint, Context, and SPEC. The taskboard also appears near a SPEC annotation. The safest reading preserves the functions without deciding that all of these labels refer to the same artifact.

In particular, **`SPEC.md` is explicitly called disposable** in these notes. The notes do not explain when it is discarded or what must replace it first.

## 6. Slice implementation vertically

**[Notes: pp. 3-4]**

The diagrams contrast two ways of dividing work.

**Horizontal construction:** complete one system layer before moving to the next. The first illustrated layer includes database, schema, and backend work.

**Vertical construction:** divide the work into thin slices that cross the integration layers end to end.

The notes call these **Tracer Bullet issues**, with **Tracer Rounds** written as a possible alternative name. The written definition is a thin vertical slice through all integration layers, not a horizontal slice of one layer.

**[Synthesis]** Small tickets are not sufficient by themselves. Their boundaries should also produce integrated behavior, rather than leaving a pile of separate layers to connect at the end.

*Illustrative example, not an example from the upload:* build one action through its interface, application logic, and storage, rather than building every storage structure first, every API second, and every interface last.

## 7. Plan with parallel work in mind

**[Notes: pp. 4-5]**

The notes say to phase with parallel work in mind and to give tickets **blocking relationships** so parallel agents can work on them.

**[Synthesis]** The taskboard is doing more than displaying a checklist. It records which work depends on other work and which pieces can proceed independently.

The upload does not specify an agent count, scheduling algorithm, branch strategy, claim/lock mechanism, or merge process. Those are not settled by the phrase "parallel agents."

## 8. Repeat one implementation unit, not the whole project

**[Notes: pp. 5-7]**

The workflow says to execute all taskboard tickets in a loop. Page 7 gives the finer instruction: **one ticket, repeat**.

The AFK, or away-from-keyboard, notes outline this arrangement:

| Item | What is recorded |
| --- | --- |
| `prompt.md` | The prompt supplied to execution. |
| `once.sh` | Creates an issues variable, grabs the last five commits, and supplies the prompt. Claude permissions are noted. |
| `AFK.sh` | Repeats the single-run arrangement, with safety checks noted. |
| `promise?` | An unresolved margin note; no complete mechanism is defined. |

**[Synthesis]** The single-run script is the unit being repeated. Combined with the session-validation notes, the intended pattern is: work on one ticket, validate and save the work, then repeat.

The handwritten sketch is not a complete executable script. It does not settle permission settings, sandboxing, retry behavior, failure handling, or stopping conditions.

## 9. Validation is part of execution and a human checkpoint

**[Notes: pp. 2, 5-6, 8]**

Validation appears at two levels:

- Inside a session: testing, updating documentation, and saving work.
- At the workflow's QA / Verify stage: human-in-the-loop checking, with an explicit instruction to stop and inspect the work.

TDD is recorded as **Red / Green Refactor**. The skill list separately includes code review, diagnosing bugs, QA / Verify, and risks.

**[Synthesis]** Automated execution was not meant to eliminate checking. The notes distinguish the work of implementing from the work of deciding whether the result is satisfactory.

No detailed QA plan, test coverage threshold, approval policy, or definition of done is supplied in these pages.

## 10. Shared vocabulary is a concrete artifact

**[Notes: pp. 6-8]**

`context.md` is described in terms of **definitions, relationships, and flagged ambiguities**.

Example vocabulary includes **issue tracker**, **issue**, **decision ticket**, and **triage role**. The example relationship is that an issue tracker holds many issues.

The later page also calls for a **dictionary / lexicon** that Kayden can refer to, with `ubiq-lang` written as a candidate label.

**[Synthesis]** Naming was intended to support shared understanding. It was not just cosmetic: the notes ask for explicit meanings and relationships, with unresolved ambiguity kept visible.

The notes do not define the listed terms in full or establish a complete domain model.

## 11. Skills are supporting recipes, not a replacement workflow

**[Notes: pp. 7-8]**

The skill-list margin contrasts **Recipes** with **Tools**. The list combines proposed names, capabilities, and implementation reminders.

The following groups are editorial organization, not a finalized taxonomy from the notes:

| Group | Names or capabilities recorded |
| --- | --- |
| Clarification and exploration | `grilling`, `grill-me`, `grill-with-docs`, `wayfind`, `research`, `prototype`. |
| Capture and work preparation | `to-docs`, `to-spec`, `to-tickets`. |
| Implementation and checking | `implement`, `TDD`, `code-review`, `diagnosing-bugs`, `QA / Verify`, `risks`, `loop me`. |
| Design | `codebase-design`, `domain-modeling`, `design-interface`. |
| Support and setup | `teach`, `handoff` with a Claude annotation, set-up pre-commit, `wizard` as a utilities/setup wizard, `write-great-skill`, `triage` with a GitHub annotation. |
| Entry and onboarding | `Workbench`, `ask Workbench`, dictionary/`ubiq-lang`, `adopt`, `genesis`. |

`ask Workbench` is described as a router for when the user does not know the relevant "spell."

**[Synthesis]** These are ways of performing and navigating the workflow. The notes do not establish that every name is a separate required skill, that every skill was implemented, or that every change must invoke every recipe.

## 12. Open sketches and proposed naming changes

**[Notes: pp. 7-9]**

| Sketch | What can safely be retained |
| --- | --- |
| Frontier | Proposed instead of Kanban / Taskboard. No detailed replacement model is specified. |
| Wayfind versus Spec-Workbench | A comparison is sketched, with investigation, grilling, research, and "big unknowns" nearby. Exact boundaries remain unclear. |
| Investigate -> Ask -> Research -> Ask -> Implement | A recorded sequence, not a fully specified orchestration protocol. |
| `/design-concept` | Establish or repair Blueprint; check vocabulary. |
| `/incubate` and a partially legible `/find-...` command | Appear near the instruction to choose the next path on the journey toward the destination, based on the design concept. The second command's exact spelling is uncertain. |
| Adopt / genesis | Written as alternatives to "set up project skills." |
| README | A note proposes changing the README without spelling out the revision. |
| "What do you own?" | Followed by "The Workbench-". This is an unfinished ownership statement, not a complete policy. |

## 13. Supporting online context

This section is outside the handwritten source. It supports attribution and interpretation without replacing the workflow above. Web sources were reviewed on 09/10/2026; dates below are the dates displayed by those sources.

**Matt Pocock: Full Walkthrough: Workflow for AI Coding.** The recording's indexed description includes research/prototyping, grilling, writing a PRD, and slicing work into issues. It is a close match to the notes, but the exact July recording or set of talks behind every page was not confirmed. [W1]

**Matt Pocock: My Claude Code Cohort - A Teaser, updated 03/11/2026.** Describes small default steering context, multi-phase plans, tracer bullets, feedback loops, Ralph, and human participation in research, prototyping, and QA. This supports the overall structure. [W2]

**Matt Pocock: Tracer Bullets: Keeping AI Slop Under Control, updated 01/22/2026.** Explains small end-to-end slices and early feedback rather than building complete layers in isolation. This directly supports the diagrams on pages 3-4. [W3]

**Matt Pocock: Getting Started With Ralph, updated 01/08/2026.** Distinguishes a supervised single-run script from a repeated AFK loop, using external task/progress records. Its example is supporting context, not the exact handwritten implementation. [W4]

**Matt Pocock: Skills Changelog: Ubiquitous Language -> /grill-with-docs, updated 04/30/2026.** Records the move from a ubiquitous-language file to `context.md` and combines interviewing with documentation. This helps explain the related names in the notes without proving they are interchangeable in Kayden's system. [W5]

**Addy Osmani: Own the Outer Loop, dated 07/15/2026.** Identifies itself as the written version of his AI Engineer World's Fair 2026 closing keynote. Its distinction between agent execution and human decisions/accountability is useful context for the final ownership question. This is a thematic connection, not proof that page 9 transcribes that talk. [W6]

## 14. A compact reference statement

**[Synthesis of the notes]**

> Begin with an idea. Explore it with the human and use prototypes to get feedback. Establish a shared design concept and vocabulary. Describe the destination, then divide the journey into small, vertically integrated tickets with explicit dependencies. Implement one ticket at a time in a repeatable loop, keeping working context manageable and validating the work. Retain human involvement in alignment and final verification. Use documents and skills to support this process, not to replace it.

## Verification and boundaries

All 10 PDF pages were reviewed visually. Page 10 is blank; the additional image repeats the page-5 workflow. No OCR was used. Ambiguous handwriting and unfinished proposals are marked. The current Workbench repository was not audited, and these notes do not establish which parts of it have drifted.

## Source register

**N.** Kayden, *AI workflows.pdf*, handwritten notes, 10 pages. Undated in the source. Supplemental image: `1000040889.jpg`.

**W1.** Matt Pocock / AI Engineer, *Full Walkthrough: Workflow for AI Coding*. Publication date not independently confirmed in the accessible primary-source page.
https://www.youtube.com/watch?v=-QFHIoCo-Ko

**W2.** Matt Pocock, *My Claude Code Cohort - A Teaser*. Displayed update: 03/11/2026.
https://www.aihero.dev/my-claude-code-cohort-a-teaser

**W3.** Matt Pocock, *Tracer Bullets: Keeping AI Slop Under Control*. Displayed update: 01/22/2026.
https://www.aihero.dev/tracer-bullets

**W4.** Matt Pocock, *Getting Started With Ralph*. Displayed update: 01/08/2026.
https://www.aihero.dev/getting-started-with-ralph

**W5.** Matt Pocock, *Skills Changelog: Ubiquitous Language -> /grill-with-docs*. Displayed update: 04/30/2026.
https://www.aihero.dev/skills-changelog-ubiquitous-language-grill-with-docs

**W6.** Addy Osmani, *Own the Outer Loop*. Dated: 07/15/2026.
https://addyosmani.com/blog/own-the-outer-loop/

**W7.** Addison-Wesley / InformIT, *The Design of Design: Essays from a Computer Scientist*, by Frederick P. Brooks. Published: 03/22/2010.
https://www.informit.com/store/design-of-design-essays-from-a-computer-scientist-9780201362985
