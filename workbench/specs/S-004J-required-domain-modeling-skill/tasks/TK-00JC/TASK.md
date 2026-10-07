# TK-00JC - Reconcile the Domain Modeling Wiki article with delivered behavior

**Task ID:** TK-00JC
**Spec ID:** S-004J
**Slice:** Reconcile the Domain Modeling Wiki article with delivered behavior
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-00JB
**Destination:** spec-acceptance: The Wiki article separates upstream method, Workbench adaptation and verified behavior and limits.
**Planned verification:** Wiki validation and lint on the touched pages, link checks, full RUNBOOK suite on a committed candidate.
**Claimed by:** claude-s004j-worker-jc

## Scope and authority

Owner, 2026-10-06: "New Spec! You will be one of 3 running at the same time." with `/implement-spec` on this Spec.

Update `workbench/wiki/skill-domain-modeling.md` and its router entry so the article separates Matt's upstream method, the Workbench adapters recorded by TK-00JA, and the behavior and limits TK-00JB observed. Route other changed truth through `to-docs`; record `Docs checked; no update needed` for owners checked and unchanged.

## Done criteria

The article and router read back against the delivered source and the scenario evidence; Wiki validation and lint are clean; the full suite passes on a committed candidate.
