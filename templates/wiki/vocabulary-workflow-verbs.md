---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - LLM Workbench template wiki: the glossary's Workflow verbs grouping explained
source_paths:
  - GLOSSARY.md
last_verified: [YYYY-MM-DD]
---

# Workflow verbs: the vocabulary explained

These verbs name the actions every workflow is built from, from the owner's first idea to delivered work and clean-up. Each section says how one verb differs from its neighbours.

The [glossary](../../GLOSSARY.md#workflow-verbs) owns each definition; this article explains how each word differs from its neighbours. It authorizes nothing.

## Align

Grilling supports that inquiry; Confirm is the owner's agreement to the readback that closes it, and what that agreement authorizes is in the Confirm entry.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Workflow

The point is not a locked list but verbs defined one at a time, with workflows built from them. A verb can be passed through: when there is nothing to map, Confirm goes to Plan, and when everything is good, Review and Verify write nothing beyond saying so. A failed Review returns to Map, Plan and Journey before Verify; a send-back at Approve returns to Align.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Workflow verb

A verb entry defines a meaning; it changes no command, status, folder or gate.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Idea

Not Fog: Fog is anticipated work toward a destination that cannot yet be stated as a precise decision question.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Confirm

A claim moves from Intent to Enduring Context only by the owner's confirmation of its readback, in a grilling session or ordinary conversation, for one answer or a batch; an agent's recommendation is intent too, and the owner's yes confirms it as written. A review surface whose items carry their own Confirm button is the one place the confirmation is that button rather than a chat reply. Once the owner confirms a concept, the agents are authorized to carry it to its endpoint, unless the confirmation names a nearer one. The Confirmed label the Landmark Tracker prints for a question card is evidence of understanding and, as `AGENTS.md` says, grants no authority by itself; the verb is the owner's agreement to a readback. Whether `AGENTS.md`'s sentence should say so would change a rule's meaning; it stays open for its own decision. Approve is the owner's later judgment of delivered work.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Prototype

It comes before Confirm or between Confirm and Plan. The `prototype` skill carries the method.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Plan

Tasks are written at Plan, through the `to-tasks` skill. When there is nothing to map, Confirm goes to Plan.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Implement

The first verb of the Journey. What it writes, Canon or Actuality, is in the Writer verb entry.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Check

Checks are deterministic verifications that run in the environment. It is an Automated check, with no judgement in it; QA follows. Worker self-check names Check and QA together from the Worker's side.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## QA

QA is a self-judgement check on the work. It comes after Check and before Submit. It is not Human QA, the owner's evaluation of delivered work, and not a Review, which is another agent's judgement.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Submit

The last verb of the Journey for that Task. The Spec's Dispatcher, Director or next agent validates the answers and merges when the merge is green; a Task gets no Review ([the rule](../../AGENTS.md#task-merge-answers-and-verify-review)).

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Review

An Automated review. Not Human review. Independent review of an assembled Spec at its Verify step is required by `AGENTS.md` [Git Rules](../../AGENTS.md#git-rules); the [Runbook operations index](../../RUNBOOK.md#operations-index) row for reviewing a candidate independently points to the [`code-review` skill](../skills/code-review/SKILL.md#independent-review-boundaries) that prepares, records and checks it; this entry says what counts as one.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Verify

A failed Review goes back to Map, Plan and Journey before the work can be verified. `AGENTS.md`'s closure sequence also has a verification on main, after owner approval; this entry gives the verb's own meaning and changes neither.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Journey

Journey is the build run for each planned Task; Map and Plan stay outside it, and a failed Review sends the work back to Map, Plan and Journey. It is the loop-level name, not a stage a card can sit at.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Approve

The `approve` command records that judgment against integration content; Human QA is the owner-led evaluation that leads to it. Sending it back returns to Align and delivery at the implicated scope, as the Human QA entry says.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Delivered

The `complete` command and status keep their names. Two nearby uses are earlier and different: the `S-###:delivered` blocker qualifier is satisfied by a reviewed PASS contained in integration, and `AGENTS.md` calls that stage reviewed delivery on integration; both come before owner approval and main. Renaming the qualifier changes a public contract and is the owner's call.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).

## Clean Up

Scaffolding names what is cleared; the Retired entry is the staging place, and `retire-spec` and `discard` carry it out for Specs and Tasks.

Definition: [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs).
