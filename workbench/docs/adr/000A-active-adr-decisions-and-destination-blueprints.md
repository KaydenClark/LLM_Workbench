---
status: accepted
date: 2026-09-09
supersedes:
  - 0002-binding-rules-stay-in-current-controls.md
  - 0025-planes-classify-claims-not-whole-artifacts.md
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - BLUEPRINT.md
  - RUNBOOK.md
---

# Active ADR decisions and destination Blueprints

Accepted, non-superseded ADR decision claims are architectural Canon directly.
They do not grant instruction authority. Governance Planes still classify one
claim in one operation, never a whole artifact; an ADR's rationale, provenance
and historic alternatives remain distinct from its active decision.
`canonicalized_in` names operational owners and is not a duplication prerequisite.

The Blueprint is the adaptable narrative of the desired finished product, not
current status, a delivery plan, an ADR inventory or a generated catalog. The
Lexicon owns the only Context Map; Specs own scoped delivery and proof. Relevant
active decisions may be linked inline where they explain the destination.

Supersession replaces a whole record through one valid successor; deprecated
records retain an explanation with no active Canon. The default register shows
active accepted decisions. Complete history remains reachable and original
record bodies are preserved. Rejected records remain historical compatibility.

Considered and rejected: requiring every ADR rule to be duplicated in another
control obscures ownership; treating entire ADRs as Canon confuses decision with
rationale; partial supersession makes ordinary readers reconstruct fragments.

Consequences: tools validate lifecycle links and expose active/history views.
Blueprint rebuilds preserve lossless claim disposition. Independent integration
review checks the scoped candidate; whole-Workbench readiness additionally
checks semantic ownership and drift and never authorizes a main merge.

Provenance: the locked owner decisions and full question disposition in
[S-00A](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md).
This record wholly supersedes [ADR-0002](0002-binding-rules-stay-in-current-controls.md)
and [ADR-0025](0025-planes-classify-claims-not-whole-artifacts.md).
