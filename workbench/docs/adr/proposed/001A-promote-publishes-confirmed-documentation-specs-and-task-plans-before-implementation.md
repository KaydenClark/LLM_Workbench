---
date: 2026-10-07
canonicalized_in:
  - workbench/skills/promote/SKILL.md
  - LEXICON.md
  - RUNBOOK.md
---

# Promote publishes confirmed documentation Specs and Task plans before implementation

Promote is the parent workflow for a confirmed bounded concept: author its durable documentation, publish it to integration, map its capabilities into Specs and publish them, then plan its authorized Tasks and publish them. Each stage reaches integration before the next depends on it. A nearer owner endpoint limits the sequence. Explore groups Idea and Align and can remain unfinished; Promote starts at confirmation.

Why: The owner wants a confirmed decision to move from intent into durable Workbench owners and become shared published state. Documentation, Specs and Task plans can be published independently of unfinished implementation. A local application or pushed branch does not establish integration availability.

Considered and rejected: Equating Promote with Map or with to-docs alone would omit the owner's requested parent composition. Requiring another owner approval for each child action would repeat authority the confirmed scope already carries.

Consequences: The promote skill owns the stage sequence and publication action. Full promotion includes Task planning and its native activation route, leaving Tasks unclaimed until implementation is assigned. Narrow selected-claim callers retain their existing endpoint. Existing review, owner Human QA and main promotion gates remain in force. Automatic refresh or consumption by other agents remains deferred.

Provenance: The owner's 2026-10-07 Explore Promotion design and its corrections, followed by the current request to make promote work like implement-spec and carry confirmed decisions into durable Workbench state on integration. The scoped delivery owner is [S-005C](../../specs/S-005C-promote-confirmed-decisions/SPEC.md). This extends the open verb set in [ADR-000X](000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md) and preserves confirmation authority from [DDR-000C](../ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md).
