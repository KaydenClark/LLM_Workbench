---
status: accepted
date: 2026-09-08
supersedes:
  - 0002-binding-rules-stay-in-current-controls.md
  - 0025-planes-classify-claims-not-whole-artifacts.md
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
  - LEXICON.md
---

# Active ADR decisions are architectural Canon

An ADR is an atomic cross-cutting architecture decision record. Its accepted,
non-superseded decision claim is architectural Canon; rationale, alternatives,
provenance, and historical explanation retain the Governance Plane appropriate
to the operation. Operational controls explain how the decision is applied;
they do not need to duplicate the decision to make it binding.

ADRs have four lifecycle states: `proposed` has no Canon, `accepted` has active
Canon, `superseded` is replaced only by an explicit whole-record successor, and
`deprecated` intentionally ends Canon without a successor and explains why.
Ordinary routing exposes active accepted records. Superseded and deprecated
records remain at stable paths and are reached by lifecycle links or a
history-focused investigation. Partial supersession is prohibited.

Considered and rejected: retaining the earlier rule that every ADR decision
must first be copied into another current control. It obscures the architectural
decision and turns a current rule into historical reconstruction. Treating a
whole ADR as a single plane was also rejected: only its active decision claim
is Canon.

Consequences: `AGENTS.md` distinguishes instruction authority from applicable
architectural Canon; `RUNBOOK.md` defines ADR operation; `LEXICON.md` owns the
Context Map and the shared lifecycle vocabulary. The ADR tooling and register
must validate lifecycle relationships and present an active default view while
preserving historical paths.

Provenance: owner-locked Blueprint and ADR ownership decisions promoted on
2026-09-08. The full source record remains local working context; this ADR is
the durable architectural decision.
