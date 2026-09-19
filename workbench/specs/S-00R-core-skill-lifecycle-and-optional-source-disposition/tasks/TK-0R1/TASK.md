# TK-0R1 - Reconcile core lifecycle and inherited-scope instructions after Canon publication

**Task ID:** TK-0R1
**Spec ID:** S-00R
**Slice:** Reconcile core lifecycle and inherited-scope instructions after S-00P publishes its Canon/list interface
**Status:** deferred
**Stance:** Builder
**Blockers:** S-00P, S-00I, S-00J
**Destination:** spec-acceptance: No core skill says completed transient records are permanent history or lifecycle paths never move; it routes lifecycle operations to tools and durable owners
**Planned verification:** Red: focused assertions fail on `to-docs` permanent-history and `to-spec` stable-path wording and on a copied full verification list. Green: `to-docs` distinguishes preserved proof/ADR provenance from transient records and routes `reconcile -> retire -> verified discard`; `to-spec` preserves IDs while routing moves to tools; audit `promote`, `save`, `make-it-so`, `carry`, and `implement`, changing only evidence-required drift. Verify S-00P TK-002/TK-003 interface on one immutable candidate, then core-composition, catalog/inspection, and full RUNBOOK checks.
**Preservation and rollback:** No root controls/templates/ADRs/lifecycle tools/completed evidence/home copies. Preserve `promote -> to-docs -> save` and `carry -> implement`; revert only core/test commit if it conflicts with S-00P Canon and return conflict to S-00P.
**Bounded source evidence:** Pre-anchor core skill sources and S-00I/S-00J/S-00P records; S-00P TK-002/TK-003 after completion.

## Done Criteria

The minimal core wording change matches landed Canon, its red assertion holds
the drift, no core skill copies the full list, and composition remains tested.
