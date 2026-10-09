---
date: 2026-10-06
canonicalized_in:
  - workbench/grill-board/README.md
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
---

# Consequential decisions preserve the why and are reused before asking again

## Decision

All three decision-record kinds hold consequential choices. ADRs hold architecture choices; DDRs hold destination choices; CDRs hold the consequential choices that fit neither category. CDR is the residual category, not an umbrella name that replaces ADRs or DDRs.

The Grill Board groups questions by their decision-record homes. The owner answers the underlying principle and why; agents use that rationale, its scope and the preserved approvals to reason through related questions and later issues. Reuse a fitting record or amend it rather than multiplying near-duplicate decisions. Each question has a primary home; mixed claims link other relevant records without merging distinct choices.

## Why

The owner wants less orchestration tax and a recoverable logic path through past decisions and approvals, so the same issue need not be decided repeatedly. Owner, 2026-10-06: “I am trying to build you a logic path to figure out any issues based on all of our past decisions and approvals so we dont have to decide the same things over and over.”

## Alternatives

Continuing a flat per-question inbox defeats the stated goal. Treating every consequential choice as architecture or destination loses the residual category the owner requested. One new record per question repeats the same rationale instead of grouping it.

## Consequences and limits

Keep the choice, rationale, alternatives, scope, consequences, source approvals and conditions for revisiting it together. Before asking again: read the active record and linked operational owner, check the present facts against its scope, and state the derivation. Ask only for a missing consequential premise, a conflict or a proposed change. A rationale does not establish facts or create permission outside its approved scope. A group answer never automatically approves a member Spec or chooses every supporting proposal.

Revise or supersede a decision when its premise or approved scope changes; retain earlier owner words and history. Proposed text remains proposed until explicitly confirmed.

## Provenance

The owner's direct board-reconciliation request, 2026-10-06, introduces CDRs and decision-centered grouping. Existing linked decisions retain their own provenance.
