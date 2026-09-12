# Historical decision triage — second pass

**The architecture is substantially decided. All five owner questions have direct answers. The remaining work is to preserve those answers accurately, place them in their proper owners, and implement the accepted behavior.** This review accounts for all 181 historical items, all 19 first-pass candidates, and all 59 original ADR crosswalk entries.

My final recommendation is **12 new ADRs, rather than 19**. Seven candidates belong in existing ADRs, operational documentation, the current concurrency contract, or historical extension evidence. Keep independently changing decisions small: reducing the count is useful only when it removes duplicated rationale. I retained the whole-Workbench continuity decision as its own candidate after reconsidering the original owner wording; merging it into the JSON-notepad ADR would wrongly make a storage mechanism own the product promise.

This is a proposed map, not twelve approved ADR texts. Five architectural choices are explicitly owner-decided; the other seven new-record recommendations concern existing accepted directions or preferences. Their historical statuses remain distinct in the ledger. Nothing was promoted, installed, synchronized, merged or published by this review.

## Deliverables

- [A. Decision ledger — all 181 items](decision-ledger.md), with [CSV](decision-ledger.csv) and [JSON](decision-ledger.json).
- [B. ADR candidate register — all 19 reconciled candidates](candidate-register.md).
- [C. Automatically reconciled items](automatically-resolved.md).
- [D. Kayden adjudication queue — no remaining historical questions](adjudication-queue.md).
- [E. Proposed final ADR map — all 59 original mappings retained](final-adr-map.md).
- [Changes from the first pass](changes-from-first-pass.md), [cluster membership](clusters.json), [direct owner answers](owner-answers.json), and [evidence and limitations](evidence.md).

## Your answers, including the later clarifications

| Choice | Settled direction | Implementation or promotion still required |
|---|---|---|
| F — skills | Three ownership scopes: upstream core, optional personal/shared, and room-local. One selected global installed core release with an explicit supported compatibility range. Core copies tracked in the personal repo are legacy migration state. Promote/save belong in core if the promised base lifecycle depends on them; the earlier answer explicitly selected their inclusion. | Reconcile implementations, remove duplicate ownership through the proper repository migration, install ignored managed copies, test compatibility and recreate discovery adapters. Do not move unrelated personal skills into core. |
| N — cross-device continuity | Optional private `workbench_sessions` Git repository, selected live collections, stable Workbench identity, explicit remote confirmation, offline status and preserved conflicts. Git history retention is accepted. | Implement and verify a real Mac/Windows, Claude/Codex round trip. Narrow current local-only wording. Add Workbench connection identity without replacing existing artifact identities. |
| O — runtime | Keep Node/JavaScript; Python retains the existing evaluation and append-only-check lane. | Record the selection while correcting the inaccurate technical comparison described below. No rewrite is requested. |
| P — provider support | A small capability contract tested in the actual configured host; capability, enforcement and agent reliability are different evidence claims. Native enforcement adapters/hooks remain outside the core commitment for now. | Agree the minimum capabilities before choosing schema fields, diagnostics or test architecture. Unavailable checks remain unverified; a missing capability blocks only dependent work. |
| Q — checkpoints | Promote selected material directly into its named durable owner. Freeze old checkpoints so citations survive. Notepads and handoffs remain temporary working/transfer records. | Preserve rollback consumers before retiring checkpoint promotion. Carry privacy and validity checks into the new crossing and verify destination recovery before source cleanup. |

The later skill answer matters: the target is not merely “two tiers.” It includes one global installed version and an explicit compatibility range across rooms. A diagnostic that treats every release difference as wrong would contradict that target. Likewise, room-local skills are a real development scope, not a second maintained copy of Workbench core.

## My perspective on what the Workbench is

Your conversations describe a system that lets a capable replacement agent find the truth needed to continue authorized work without making you reconstruct the conversation. The controls, stable specs, Wiki, source and evidence provide that continuity together. A notepad preserves the unfinished reasoning that has not yet reached those owners. The Context Map supplies the routes between them.

That model is coherent. It also explains the repeated friction better than a missing governance layer does: a decision can be accepted yet unavailable to the next agent because it stayed in an obsolete note, a different chat, an installed skill from the wrong source, or a completed spec with an unreachable follow-up. Fixing those routes and installed boundaries is more valuable than writing another general rule that “agents must remember.”

The practical acceptance test should be a useful bounded task, saved while work is still in progress, continued by another supported agent from the real saved state. Check whether it preserves corrections, distinguishes finished work from intended work, verifies the actual checkout and finishes the authorized outcome with less owner coordination. This is a recommendation for later verification, not a claim that this report demonstrated it. Crashes or Stop can preempt unsaved writes; the promise must name the last confirmed saved boundary.

Private Git transport fits this model if it stays optional. It adds recoverability for working context, without making every stored statement true, canonical or suitable as project evidence. “Temporary” can describe the active record's purpose even when private Git retains earlier revisions. “Committed” cannot be used as a synonym for “promoted.”

## Corrections I would make before promotion

**1. Keep the original propositions as well as the latest answer.** R136 originally concerned selected harness/Wiki synchronization. N selects session transport and explicitly leaves schemas, templates and promoted documents in project Git. These are complementary boundaries; replacing R136 with a sessions-only statement loses part of the history. R051 originally discussed checkpoint/handoff not terminating a session; Q is a later choice about the durable destination. The ledger preserves both rather than changing what the old question meant.

**2. Keep Node, but correct the rationale.** The recorded answer says Node handles JSON with no conversion step while Python's dict/list conversion is structurally worse. Both languages deserialize JSON text into language values and serialize values back to text. JavaScript's object-model affinity can be a preference, but those APIs alone establish no structural deficiency or performance disadvantage in Python. Preserve the owner's original reasoning as history, mark this factual correction, and recommend describing Node's suitability and continuity with the implemented portable tooling without inventing an owner-accepted replacement rationale. [JavaScript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse), [Python documentation](https://docs.python.org/3/library/json.html).

**3. Separate discovery adapters from enforcement adapters.** F requires Codex/Claude discovery adapters; P defers new native enforcement hooks. These decisions do not conflict. Existing provider launchers used by evaluations are another distinct category. “No shipped adapters” is too broad. Also, ADR-0005 requires a running mechanism that controls the operation; it does not require that the Workbench itself own that mechanism.

**4. Do not overstate S-036.** Its native Claude write attempt never reached a permission decision because of trust/authentication state. It supports correcting the assumed permission model and recording the failed verification attempt. It does not prove live host enforcement passed or failed. This limit appears explicitly in the spec's TK-001 evidence.

**5. Correct the installer description from live code.** Current installer tests pass for missing skills in Git-owned and symlinked roots. The blanket refusal still described in RUNBOOK and skills/README is documentation drift. Explicit replacement remains separately guarded. The new skill architecture still needs migration and compatibility work, but “first make any installation into a Git root possible” is no longer the right implementation task.

**6. Preserve rollback when retiring checkpoints.** Adoption writes recovery metadata and relocated legacy skills under the checkpoint collection; upgrade writes recovery metadata there too. The source confirms this overload. Freezing session history cannot silently disable operational recovery. I recommend a separately declared recovery destination with compatible migration, without fixing its path here. Existing privacy scan reuse is useful, but the scanner alone does not verify destination correctness, semantic fidelity, authorization or safe cleanup.

**7. Do not turn scoped historical decisions into universal rules.** R053 asks for a clear resume source, not exactly one note; S-046 allows several linked notes per objective. R152 proposed an optional specialist ensemble; stances do not prove that proposal superseded. R063's advice to omit empty prose does not authorize deleting required empty collections. R149's UI acceptance applies to products with a UI. R061's valid distinction between mention and invocation survives rejection of a proposed metadata schema.

**8. Make the freshness finding precise.** The upstream code does define an algorithm: UTC calendar dates with a greater-than-one-day comparison. The prose says “working day.” The older local-day ruling was scoped to GPT_OS Preflight. There is a real code/prose mismatch worth recording; it does not automatically authorize importing that separate algorithm into the Workbench.

**9. Avoid false coverage and false gaps.** ADR-0040/S-046 already have a handoff contract. ADR-0037 already separates review from publication authority. S-020 already has broader shared-write ownership than the first pass acknowledged. Conversely, REPORT_FORMAT's recurrence keys do not by themselves implement the complete longitudinal finding lifecycle. Every claim should say whether coverage is normative, structural, exercised or still missing.

## Proposed ADR treatment

| Treatment | Candidates |
|---|---|
| New focused ADRs | A continuity; C outcome evidence; E composition; F skill ownership; G setup preservation; H layered provenance; J unavailable baseline; K control fidelity; N private transport; O Node runtime; P host capability floor; Q direct promotion |
| Amend or cross-link existing rationale | B into ADR-0027/0037; I into ADR-0037 plus H; S into ADR-0042 |
| Operational documentation / existing contract | D report contract with C rationale; L portable parsing; M existing shared-write contract |
| Historical extension evidence | R; preserve the full source corpus without creating a new base archive ADR or Design Concept article |

Keep all 28 existing upstream ADR records. If every new-record recommendation is accepted, the collection has 40 records, with ADR-0028 partially superseded and retained as history. The other 31 original crosswalk entries remain accounted for in their GPT_OS/Audit scope. This is not 40 independent new decisions for you to answer.

The map separates concerns that can change independently: skill ownership versus composition; session transport versus durable promotion; runtime language versus provider capability; migration effects versus evidence identities. It combines repeated general rules only where an existing owner already carries the rationale. That preserves the reason behind your preference for small ADRs.

## What should happen next

Promote the five answered directions into the appropriate current owners, with their explicit limits and compatible root/template wording. Then implement the bounded capabilities in their owning work: local JSON foundation, promotion/checkpoint consumer migration, skill ownership/compatibility, and optional session transport. These are dependencies to plan, not a new autonomous queue created by this report. The provider capability set has its own reserved agreement gate before schema or diagnostic implementation.

Do not wait for every historical extension idea to become an ADR before proving the useful continuity workflow. And do not declare the work finished merely because these reports now agree: the installed skills, actual save/retrieval behavior and cross-device recovery still need their own evidence.

## Verification and risks

The original packet's 181 records, 178 source hashes and 59 ADR mappings passed integrity checks. Current targeted checks passed: core installer 12/12, fidelity 15/15, cross-provider fixture and doctor. The remote integration identity matches the inspected checkout. The [companion validation report](validation.json) checks ledger IDs, allowed dispositions, counts, source references, original proposition preservation, candidate accounting and output links.

No runtime, control, spec, ADR or first-pass report was changed. These are local review artifacts. Principal remaining risks are incomplete runtime delivery, falsely treating a recommendation as owner acceptance, making private sync equivalent to durable promotion, and breaking recovery/provenance during retirement. Full-suite, live host enforcement, real cross-device continuation and agent-outcome claims are outside the checks performed here. See [evidence and limitations](evidence.md).
