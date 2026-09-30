# S-002K - Resolve citation groups and file identity faithfully

**Spec ID:** S-002K
**Status:** active
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Correct three independently reproduced citation-checker defects without reopening completed S-045.
**Blockers:** none
**Latest event:** User-authorized bounded follow-up captured from independent late review of PR77.
**Next gate:** Activate one bounded corrective Task, reproduce durable reds, then verify an immutable repair candidate.

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

## Completion Result

Pending. Existing S045 completion and owner approval state are not changed by this follow-up.

## Remaining Limitations Or Follow-Up Specs

- No reliability, installed-distribution or whole-project acceptance claim.

## Supersession

- Follows up: [completed S-045](../S-045-v3-1-2-follow-ups/SPEC.md) and merged PR77 late review; no supersession of its historical delivery.
- Supersedes: none
- Superseded by: none
