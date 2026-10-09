---
date: 2026-10-06
canonicalized_in:
  - workbench/grill-board/README.md
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
---

# Recurring maintenance needs an explicit bounded authorization

## Agent proposal

A recurring maintenance action is an ordinary bounded action whose owner-approved authorization names its exact scope and cadence. Each run records the observed result and any exception in the existing owner. If no present recurring need exists, defer the recurring form while using ordinary Tasks for one-off maintenance.

## Underlying question and why

What invariant should let repeated approved maintenance run without repeated owner orchestration, while keeping its action and authority bounded? The original question has no owner answer. The record proposes a policy, not an accepted recurring capability or authorization of a run.

## Alternatives

Defer recurrence until a concrete need exists; encode a bounded recurring Task; or introduce a distinct recurring artifact only if the ordinary model demonstrably cannot express the need. GB-0088 preserves these choices and the original FND-Q17f uncertainty.

## Consequences and revisiting

A selected policy could guide later capability work. This draft adds no scheduler, cadence or recurring job. Revisit when a real recurring action exposes a gap.

## Provenance

[GB-0088 and its source history](../../../grill-board/README.md), DQC-003B and FND-Q17f. The 2026-09-23 triage's backlog label was an agent classification, not owner approval.
