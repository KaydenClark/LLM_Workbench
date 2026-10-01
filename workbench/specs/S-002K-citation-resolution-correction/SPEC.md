# S-002K - Resolve citation groups and file identity faithfully

**Spec ID:** S-002K
**Status:** active
**Priority:** 1
**Owner:** codex-servitor-pr-resolution
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Correct three independently reproduced citation-checker defects without reopening completed S-045.
**Blockers:** none
**Latest event:** TK-003Y claimed by codex-servitor-pr-resolution.
**Next gate:** Close TK-003Y with verification and documentation proof.

## Outcome

Citation enforcement selects the declared tree for every citation in an explicitly labelled list, checks digit-leading file basenames, and keeps dotted non-path values from replacing the nearest file scope.

## Why It Matters

A green checker must not silently resolve a shipped citation against the pre-change tree or skip a valid file reference. Completed [S-045](../S-045-v3-1-2-follow-ups/SPEC.md) and its prior review remain historical results; these verified late findings need their own linked owner.

## Current Verified State

Base integration 933708707fd45332f032ef37906743af563aa861 contains the reviewed PR77 checker at tools/test-spec-citation-anchors.mjs. Independent reviewer thread 01a0f455-9401-77f4-a66a-8097f754d01b reproduced three defects at merged983af08: the second shipped shorthand in S040 selects pre, digit-leading bare ADR basenames are skipped, and backticked v3.1.2 replaces a valid file path. The existing seven checker tests passed despite these defects. S045 post anchor18ffc0d predates its Spec and checker; historical1c74fa7c9951c689717be086cbfefedd0ec14a8e contains both. S045 currently has no post-selected live citation, so that anchor defect is a provenance correction rather than a demonstrated current citation misresolution.

## Desired Behavior

- Each member of a comma/and-separated citation list retains its explicit shipped or base label until a new label, path or prose boundary supersedes it.
- Digit-leading file basenames participate in anchor and range enforcement just as their qualified paths do.
- Dotted version/prose values do not become a file scope; repository file basenames and qualified paths do.
- Restore a truthful historical S045 post anchor without altering completed status, old Tasks, approval state or evidence rows.

## Decisions And Contracts

- This is one owner-authorized corrective slice, not a general citation grammar redesign.
- Keep range, unique-path, unresolved shorthand and immutable-anchor refusal checks; do not relax enforcement to obtain green tests.
- Preserve first-published evidence, prior PASS verdicts, failed receipts and completed S045.
- Separate exact-head independent review is required before integration. Main remains the owner's explicit approval gate.

## Non-Goals

- No new citation syntax, unrelated corpus sweep, runtime product feature, live Issues/Projects, permissions, release or main action.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

One native Task will cover the three source-qualified checker defects and truthful historical anchor correction.

## Acceptance Criteria

- [ ] Shipped/base citation groups resolve every member to the intended tree with explicit overrides and boundaries preserved.
- [ ] Digit-leading bare filename citations cannot evade missing-anchor or range checks.
- [ ] Dotted non-path values preserve nearest file scope while genuine basename/path references establish scope.
- [ ] Historical S045 post provenance is truthful and its completed result, original Tasks and evidence remain intact.
- [ ] Durable reds, required verification and separate independent exact-head review substantiate the bounded correction.

## Testing Seams

- liveCitations parser regressions and corpus enforcement in tools/test-spec-citation-anchors.mjs, plus synthetic file/range controls and the actual S040 shipped pair.

## Verification Procedure

Run the citation checker red before changing its parser, then green with positive/negative controls. Run the full48 AGENTS plus3 RUNBOOK commands at frozen source, actual first-published append-only validation, native Task gate and read-only pre/post self-drift. Fresh independent final-head review remains a distinct gate.

## Documentation Impact

S045 gets a truthful historical post anchor and a follow-up link; this linked Spec/Task owns the new correction. Render TASKBOARD through the native tool. No accepted contract or completed historical result is reopened.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Linked follow-up for independently verified late PR77 findings | Separate reviewer supplied three actionable parser reproductions and qualified the historical anchor defect; producer read the designated synthetic probe and verified historical1c74fa7 contains Spec/checker. No new implementation or PASS claimed | Bounded linked owner; completed S045 preserved | Native activation, durable reds, bounded repair, required verification and independent final-head review |
| 2026-09-30 | TK-003U | Reproduced durable reds and implemented bounded citation correction | Published test-only red93c41eafbeaa6634c7eb06561e3f6e891d65c348: seven existing tests PASS and three new regressions FAIL before parser changes. Label lists now retain explicit tree until a new label/path/prose boundary; digit-leading basenames are scanned; dotted non-file values preserve scope. Historical1c74fa7c9951c689717be086cbfefedd0ec14a8e contains S045 and checker | S045 post anchor restored to that truthful historical tree; completed status, Tasks, evidence and original verdicts preserved. Linked owner and native projection route remain | Frozen required verification and separate independent final-head review pending; no owner approval or whole-S045 reopening |
| 2026-09-30 | TK-003U | Assemble current integration without rewriting history | Exact published sourcef8b0f932c0fbf916e1524473e82be1198ff260c6 passed all51 required commands, focused10/10 and five full-pipeline synthetic controls; first-published append-only CLEAN. Ordinary merge brings independently reviewed PR232 integration644511bbe3051555fc3349a03c0f3656cf758cbc into this repair with conflict-free expected tree11c1946d2fce81cac63c468c654e715238387222. Citation checker bytes unchanged fromf8b0f932 | S045 live event/gate now routes late findings to S002K rather than presenting merged PR77 initial review as pending; completed status, original Tasks, acceptance and prior rows preserved | Exact assembled verification and separate independent final-head review before integration; no whole-S045 or owner QA approval inferred |
| 2026-09-30 | TK-003U | Task closed | Exact published current-base source7696888ce4266f4b017e75bff4ed56870936e574 passed all51 required commands (48 AGENTS plus3 RUNBOOK), including citation checker10/10. Original published sourcef8b0f932 also passed51/51, tenfocused and five full-pipeline synthetic controls: bare/qualified digit-leading references refuse missing anchors and invalid ranges; version text preserves valid file scope. Published red93c41eafbeaa6634c7eb06561e3f6e891d65c348 had unchanged parser with seven existing PASS and exactly three new FAIL. Checker bytes identical across ordinary assembly with reviewed integration644511bbe3051555fc3349a03c0f3656cf758cbc. First-published append-only CLEAN. Pre/post drift retains seven prior attention findings; no clean-update, reliability or installed-distribution claim. | Linked S002K and native TK003U own three confirmed late PR77 checker findings. Native catalog/projection routes preserved. S045 truthful post anchor1c74fa7c9951c689717be086cbfefedd0ec14a8e and linked follow-up plus live owner-routing headers corrected; completed status, original Tasks, acceptance checkboxes, historical evidence and prior verdict rows unchanged. No contract, main, unrelated code or owner decision changed. | Separate independent exact-final-head review required before integration. New S002K acceptance and owner approval remain open; completed S045 historical delivery is not reopened and its old PASS is not asserted for newly changed bytes. No main, release, live Issues/Projects, permissions or whole-v4 acceptance action. |
| 2026-10-01 | review | Review verdict: fail at b0fc8909995d98b0d2e72c2dbea28fdf626bd305 [ff5baad1d5bf] #1 | P2 file-token classification correction: an explicitly missing bare filename such as missing-review-target.mjs must replace prior valid scope and refuse rather than validate tools/test-diagnostics.mjs. Also numeric endpoint127.0.0.1:8080 must not be a file citation, while digit-leading actual filenames remain enforced. Independent full51 and focused10 passed but twelve corpus probes proved both regressions. Add durable full-pipeline reds and bounded correction. Preserve completed TK003U and its Receipt, prior three fixes, historical S045 anchor/status and evidence. | Independent Servitor reviewer thread01a0f455-9401-77f4-a66a-8097f754d01b separate context, pr233-final-review.md supplied through Vespar | 1 |

## Completion Result

Pending. Existing S045 completion and owner approval state are not changed by this follow-up.

## Remaining Limitations Or Follow-Up Specs

- No reliability, installed-distribution or whole-project acceptance claim.

## Supersession

- Follows up: [completed S-045](../S-045-v3-1-2-follow-ups/SPEC.md) and merged PR77 late review; no supersession of its historical delivery.
- Supersedes: none
- Superseded by: none
