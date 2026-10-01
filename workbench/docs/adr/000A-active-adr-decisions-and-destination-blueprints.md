---
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

Specs, Tasks, DQCs, notepads and handoffs are transient scaffolding for reaching
the product destination. They own the assigned work and evolving understanding
while needed. Once their useful content has been reconciled into maintained
durable owners and the intended result exists, the implementation and its
documentation become the continuing reference; retaining the scaffolding is
unnecessary. Still-needed obligations, corrections, rationale and evidence must
remain reachable at their proper owners before cleanup. Obsolete release
promises become explicitly historical or superseded without turning unperformed
proof into completed work. Spec/Task closure and discard retain
[ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)'s
gates; notes and handoffs retain
[ADR-0054](0054-direct-promotion-into-durable-owners.md)'s verified promotion and
dependency checks. DQC reconciliation belongs to
[ADR-000N](000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md).

Correct or expand the existing ADR when refining the same architectural
decision. Preserve its identity, reasons and consequential alternatives, and
record the changed premise or correction so history remains recoverable.
A new ADR must contribute a valuable distinct architectural lens or layer,
including why that decision was made; a slightly different restatement of an
existing decision does not justify another record. A genuine replacement still
uses the whole-record supersession rule below.

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

Rationale for this clarification: delivery records help reach the destination;
the implemented thing and its maintained documentation serve readers better
afterward. Keeping every scaffold indefinitely duplicates truth and exposes old
release promises as current assignments. Adding near-duplicate ADRs makes
readers reconstruct one decision from competing accounts instead of improving
the architectural explanation.

Consequences: tools validate lifecycle links and expose active/history views.
Blueprint rebuilds preserve lossless claim disposition. Independent integration
review checks the scoped candidate; whole-Workbench readiness additionally
checks semantic ownership and drift and never authorizes a main merge.

Provenance: the locked owner decisions and full question disposition in
[S-00A](../../specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md).
This record wholly supersedes [ADR-0002](archive/0002-binding-rules-stay-in-current-controls.md)
and [ADR-0025](archive/0025-planes-classify-claims-not-whole-artifacts.md).

The scaffolding lifecycle and amendment-first rule were confirmed and approved
by the owner on 2026-09-30 through FND-Q16 in the
[grilling destination ledger](../../wiki/grilling-destination-audit-ledger.json).
This documentation reconciliation creates no new cleanup command and deletes
no artifact. Existing frozen checkpoints and permanent ADR history retain their
separate preservation rules.
