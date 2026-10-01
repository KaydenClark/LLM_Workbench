# TK-01Q — Landmark Tracker language reconciliation

Scope: the DQC/Landmark/Tracker family and its immediate Lexicon consumers,
reviewed 2026-10-01. This is a bounded semantic audit, not the whole S-01U audit.
All ten whole-Spec acceptance boxes remain open. No owner Human QA, main
publication, workflow delivery, runtime change or concept taxonomy is inferred.

## Source pin and current union

The execution base is `d90785908b26517068a474bb88136c81995a2f18` (integration).
Read every source below at that tree with `git show <base>:<path>`;
[source inventory](tk01q-sources.json) records exact Git blob identities.
The current candidate changes only the named Lexicon claims and S-01U state/proof,
plus native board/catalog projections. Final source-delta and verification
results are in [the verification receipt](tk01q-verification.json).

- ADR-000N is accepted in the ADR register. Its decision defines the model;
  its September 26 planning-only runtime text is historical delivery context.
- S-01T Delivery Transfer preserves the foundation and directs unfinished work
  to Tracker S-001Z, Records S-002A and DQC S-002B. Original completed proof and
  deferred source packets are retained; they are not new execution assignments.
- The Wiki `design-concepts/landmark-tracker.md` supplies the readable model,
  including its 23 evolving candidate directions, without freezing vocabulary.
- The actual manifest, `landmark-tracker.mjs`, `landmark-wiki.mjs`, existing
  public tests/demo and record procedures establish the exercised operations.
- S-00P's settled controls are consumed at this base. Its workflow, ownership
  and QA gates are not reassigned. No runtime, ADR, Tracker source, Wiki router,
  ownership map, Taskboard JSON or carry TK-004Q file is changed.

## Operation readback

At the pinned base and this documentation candidate:

| Reader's question | Observed answer and evidence | Limit / responsible owner |
|---|---|---|
| What records preserve a concept before delivery? | DQC capture/revise, Expected result, source lineage, corrections, claims and later landmark linking execute through the existing CLI; Tracker tests 23/23 and the disposable public demo pass. | Confirmation is understanding, not permission. DQC S-002B owns additional composition and Result operations. |
| What does the generated percentage measure? | Documentation assessments. The real demo produces 30% Journey / 20% Review / 50% Verified from two distinct contributions and proves cross-scope deduplication. The live `rebuild --check` reports current. | It is not implementation effort or automatic Verified from done Tasks/accepted ADRs. Tracker S-001Z owns the view. |
| Where is implementation work? | Spec and TASK.md records, projected in TASKBOARD.md; TK-01Q is a native record under S-01U. | Tracker cannot close a Task or approve a Spec. Taskboard JSON rollout belongs to its existing owner. |
| Can I use expanded readable assessment evidence here? | `show --expand --json` refuses `invalid-invocation`. JSON has foundation assessment evidence, but the proposed expanded readable operation is absent. | S-001Z's done TK-002U and candidate proof do not establish integration availability. Consume its reviewed candidate only through its owner. |
| Can I author achieved Result here? | `revise DQC-000A --result ... --expect-revision 1 --reason ... --json` refuses `invalid-invocation` before mutation. The schema's readable nullable result field is not a public write operation. | S-002B owns this candidate-only operation; retain the meaning of Result without claiming the writer ships. |
| Can I validate a readable Landmark article here? | `landmark-wiki.mjs validate workbench/wiki/design-concepts/landmark-tracker.md --json` returns valid. Existing validator tests exercise hidden/encoded identities, bytes/index preservation and installed CLI/API. | This is identifier/readability validation, not actual-claim assessment or Verified. S-002A retains shared Wiki wiring, assessment and lifecycle gaps. |
| May I delete a Verified DQC or its notes? | No deletion follows from the label. ADR-000N requires useful substance and lineage verified in durable owners, unresolved obligations reachable and live references reconciled. Needed notepad origins/corrections remain. | No DQC cleanup command is delivered by this reconciliation. Private source material was not imported or used as durable proof. |

These are local source/fixture observations, not host-agent reliability,
installed-room universal availability, complete successor delivery or owner QA.

## Claim coverage and dispositions

Sources abbreviate A = accepted ADR-000N, F = S-01T including Delivery Transfer,
W = readable Landmark Tracker article, P = actual record procedure/runtime,
R = S-002A and article validator, D = S-002B, T = S-001Z, C = AGENTS/current
S-00P controls. All use the pinned source tree above. Each row is one affected
claim or explicitly unchanged immediate consumer; definitions and routes are
mirrored generically unless the row says project-only.

| Lexicon claim/location | Evidence / claim status | Semantic assessment and disposition | Owner and verification/open gate |
|---|---|---|---|
| Review stamp | S-01U ten criteria; bounded assignment | Repaired: existing date cannot mean whole-audit freshness; scope note makes the limit explicit. | S-01U; this coverage, whole audit open. Project-specific, no template date substitution. |
| Task Routing: Tracker meaning | A/F/W accepted model | Repaired: accepted decision and preserved foundation are explicit sources. | Lexicon; follow links to register/model/transfer. Project-specific IDs not copied to generic template. |
| Task Routing: Tracker delivery | F/T/R/D transfer and candidate status | Repaired: a foundation-only route hid successor owners and candidate limits. | Lexicon; all three successor routes present; no duplicated task state. |
| Task Routing: operation availability | P/R actual versus T/D candidates | Repaired: direct procedure, validator and pinned-readback routes separate available operations from acceptance. | Lexicon; live read-only checks and refusals above. Generic route requires room-local verification. |
| Ownership: Evolving concept understanding | A/W accepted; P demonstrated | Checked-unchanged: source records own understanding, view presents it, room runtime establishes availability. | Lexicon/P; public capture/reload/link demo. |
| Ownership: Work state | C/native TASK.md | Checked-unchanged: Spec/Tasks own execution; board projects it. | Existing workflow owner S-00P; native show/render. |
| Ownership: Evidence | A/F/C evidence requirements | Checked-unchanged: provenance/method/results/limits required; a recorded assessment is not self-certifying. | Spec evidence owner; independent semantic readback. |
| Ownership: Capability and Execution | P/C | Checked-unchanged: declaration/procedure alone proves no actual operation. | Runtime owner; Result/expand refusals versus validator pass. |
| Ownership: Working context | A/C/notepad runtime | Checked-unchanged: local unfinished context, settled truth moves to its owner. | Notepad runtime; local revision readback, no transfer or purge. |
| Boundaries: DQCs/landmarks/Tracker | A/W | Checked-unchanged: adds understanding/documentation coverage without replacing existing artifacts. | Lexicon; compare four-piece model. |
| Boundaries: Wiki article/guidebook | A/W/Wiki schema | Checked-unchanged: explanation and procedure retain owners; neither authorizes work. | Wiki owner; no index/schema changes. |
| Boundaries: Projection and index | A/P | Repaired: explicitly includes generated Landmark Tracker among source-derived views. | Lexicon; live rebuild check, no Tracker source edits. |
| Core: DQC synthesis, early/ungrouped existence | A/F/W; P tests | Checked-unchanged: concept synthesis is not one raw prompt per card or a mandatory parent/destination. | DQC; existing capture/reload and no-landmark demo. |
| Core: DQC retention | A accepted lifecycle clarification | Repaired: temporary scaffolding needs verified durable reconciliation and preserved obligations/references before removal; Verified alone is insufficient. | DQC/Records owners; no cleanup mechanism or deletion asserted. |
| Core: Landmark identity and scope | A/F/W | Checked-unchanged: overlapping evolving pillar, not a Spec/PRD and not itself implemented. | Records; existing later-link and overlap tests. |
| Core: Landmark inventory | A/W evolving 23-direction seed | Repaired: no closed taxonomy or one-term-per-candidate requirement. | Lexicon; no new landmark records, IDs or mandatory entries. |
| Core: Tracker distributions | A/F/P | Repaired: name the eight documentation steps and distinguish them from effort, Task status and runtime. Existing generated/no-reset/no-authority meaning preserved. | Tracker; 30/20/50, deduplication and no-status-proxy tests. |
| Core: Landmark Wiki page | A/W/R | Repaired: WBID absence covers metadata/link targets; syntax validation is distinct from claim assessment and Verified. | Records; public validator and tests. No claim that all Wiki pages follow the Landmark-only rule. |
| Core: Expected result versus Result | A/F/D/P | Repaired: intended versus achieved remains; achieved Result and Task completion do not establish Verified or an available writer. | DQC; unsupported public Result option reproduced. |
| Core: Frontier | A/W/C | Checked-unchanged: technical ready-Task sense survives informal broader use; Tracker's scope remains documentation. | Workflow owner; no Frontier rename. |
| Core: Task/Packet/Task receipt/Hot projection | C/current S-00P | Checked-unchanged for this family: implementation state/proof stays in Task/Spec; board is generated. | S-00P/native task owner. Broader Spec-lifetime audit remains S-01U whole scope. |
| Continuity: Notepad | A/C/P | Repaired: conditional on available DQC/landmark operations; cards do not license discarding needed origins or corrections. | Local notepad owner; generic mirror retained without project ADR path. |
| Core: Feature article; Governance: Design Concept article | Wiki schema/C | Checked-unchanged: distinct durable explanation routes, not copied task state; Landmark rule is not imposed on all Wiki knowledge. | Wiki owner; shared integration remains Records' gap. |
| Continuity: Scoped handoff and evidence boundaries | C/local notepad policy | Checked-unchanged: Markdown handoff and private-transport authority remain separate from concept records. | Existing continuity owners; no private transfer. |

## Two-way section sweep and exclusions

Task Routing, Artifact Ownership Schema, Core Terms and Continuity Terms contain
the family claims audited above. Ownership Rules, Feedback Dispositions, Stance
Terms, Governance Core and Continuity And Evidence Boundaries were read for
immediate conflicts with that family; no further family correction was found.
Project-Specific Terms adds no affected family claim. This section sweep does
not audit every unrelated meaning or every one of the 23 starting directions.
Their comprehensive inventory/semantic proof remains the existing S-01U work,
not a new Task or one-term-per-direction backlog.

Immediate external consumers were checked without taking their writer lanes:
AGENTS preserves conditional runtime use and authority; the Tracker README
matches foundation operations; LANDMARK-WIKI distinguishes validation from
assessment. RUNBOOK still routes delivery to the foundation and contains
planning-era availability wording, though it tells readers to inspect actual
runtime. Disposition: owned elsewhere by S-00P's procedure lane, consume this
scoped Lexicon direct route and report the finding; do not edit Runbook here.
The Wiki availability paragraph matches foundation behavior and keeps content
assessment/lifecycle open. S-001Z/S-002B candidate-only notices remain essential.
Completed S-00L and original S-01T proof remain historical-only, unchanged.
Ignored grilling sources are not present in this checkout and were not copied;
accepted durable sources suffice for these settled corrections, while full
emerging-concept/private-source coverage remains unverified for the whole audit.

## Before/after semantic seam

Before: following the only Tracker delivery route stopped at the planned
foundation even though it transferred delivery; neither the DQC term's lifetime
nor the Wiki term's byte-wide requirement was explicit. The Result definition
could not tell a reader whether its writer existed, and the notepad transition
was unconditional. These are bounded navigation/meaning gaps, not proof that
all existing definitions were wrong.

After: follow Task Routing to the accepted model, the three actual delivery
owners and the operation readback. A DQC can have no parent/answer, a distribution
can be complete without implementation being complete, and accepted Result
meaning can coexist with a refused Result-writing option. A valid article still
needs actual-claim assessment; Verified still cannot authorize deleting a card.
An independent timed reader exercise, reported against an immutable candidate,
must demonstrate these distinctions. Mechanical word and link checks support
this seam but cannot substitute for that reader observation.

## Final source-delta review

Integration advanced during verification from the execution base to
`25d3f4d23b3719693065336a4ba66349d0a95907`. A conflict-free disposable union
of that integration tree and the tested lexical candidate has tree
`7a7b29f50edda3c0fbfa20a2bacf3f701195ddd8` and local detached verification
commit `445972e26b376f3b5646f3928bbe72fd26bfda86`. This is a verification
fixture, not a merge into integration or main.

Reopened availability, ownership, progress and continuity rows against that
delta: the manifest adds GitHub coordination binding; Runbook adds its
inspection/collision procedures. Tracker/validator source, accepted ADR-000N,
readable model, foundation/successor contracts and Lexicon sources retain
their prior meanings. DQC-000B revision 4 -> 7 and DQC-000C 5 -> 7 add related
Specs without assessments; DQC-000D 5 -> 12 preserves new relations, uncertainty,
specific affected-claim corrections and later re-evidence for the binding
inspector. These reinforce the distinction between relation, assessment and
actual capability; they do not turn their related Tasks into Verified or make
Result writing/expanded view available. No fixed-taxonomy glossary additions
follow from those cards. Their new source revisions are pinned in the source
inventory. The union check results and their exact scope belong in the receipt.

Validator test qualification: the real-room article check passed. Additional
fixture tests initially failed because an unmanifested temporary room inherited
the sandbox's synthetic parent `.git` root; an alternate temporary writable root
had the same marker. The unchanged 18-case test passed outside that synthetic
ancestry. Preserve the failed attempts and the environment qualification;
no runtime/test repair is attributed to TK-01Q.
