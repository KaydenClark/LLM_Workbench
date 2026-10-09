# S-005H - Optional project Grilling Board deployment

**Spec ID:** S-005H
**Status:** active
**Priority:** 1
**Owner:** codex-board-worker
**Stance:** Builder
**Updated:** 2026-10-09
**Catalog description:** Deploy the existing Grilling Board optionally into an adopted project with safe initialization, project framing, links and isolated owner answers.
**Blockers:** none
**Latest event:** TK-001 closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.
**Baseline:** green - source evaluator self-test passes, local score 113 at integration e81fe43fdc6273221dbb484c3f7dd9a49b523e0a; doctor has no all/selection blockers, existing drift retained.

## Outcome

An owner can read project gun context and real drafts, answer and confirm through
an optional installation of the existing Grilling Board without copying producer
questions or answers or installing a full Dashboard.

## Authorization And Coordination

Owner, 2026-10-09, RingWorld progress: “Yes, let's get it all fixed an put it on integration please” in response to the bounded reusable deployment proposal.
Base integration e81fe43fdc6273221dbb484c3f7dd9a49b523e0a; authenticated GitHub KaydenClark. Open draft PR440 at f1fa3f2 changes producer tools/grill-board.mjs, index.html, tests, S-004D, Runbook and Wiki. PR441 changes that server's entry guard. Dashboard handoff dashboard-claude-director-first-pass-2026-10-08.md inspected; the wider first pass belongs to that director. Avoid those implementation/content files and do not import those PRs or contact Claude. New optional-component files own this work; root Runbook suite/projections may gain bounded additions without changing the Dashboard workflow. No S-004D Task/claim transfers.

## Desired Behavior

- Optional initialization in an existing ordinary adopted project, receipt-backed exact source; refuse collisions, unsafe paths and malformed configuration before mutations; rerunning initialized installation preserves all questions, answers and configuration.
- Reuse the current Board server/rendering and answer/revision operations. Generic optional component owns project title, group/topic framing, repository links, browser-instance key and loopback port. RingWorld supplies gun questions/drafts and named sources.
- Do not copy producer items or answers. Answers stay ignored/local, owner writes via page only; agents use existing add/revise/apply/withdraw operations. Revision invalidates stale answers; no new direct question editor.
- Keep loopback, bounded ordinary-source reads and inert Markdown protections. Distinguish current sources from drafts and full text from excerpts. Specs/Tasks/gun docs need named-source reading, not a new generic artifact catalogue.
- Installed optional runtime must survive a clean clone without the producer source checkout. No npm/pip installation, hooks, persistent services, credentials or personal catalog changes.
- Refresh RingWorld's existing feature pilot through established tools/skills update with task-local backup storage, pinned tested integration identity; all 64 mod files preserve the approved pistol baseline.

## Non-Goals

Full Dashboard, P/V workflow rewrite, direct question editor, Glossary migration,
producer question content, services/login automation, Workbench main promotion,
RingWorld main changes, PC control, new tunnels/firewall/bind/sharing/access.
PC access beyond localhost is a separate action-specific owner decision.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

### TK-001 - Optional deployment component

**Stance:** Builder

Use separate new files, avoid modifying producer Board source/page/inventory.
Red/green public CLI and server fixtures; preserve questions/answers on refusal
and repeat; browser verification on disposable data; full Runbook suite at clean
candidate and independent assembled-Spec review before integration.

## Acceptance Criteria

- [x] Public optional deployment initializes and verifies a fresh project, is clone-portable, and refuses unsafe/colliding states without lost data.
- [x] Project title/topics, repository links and browser state isolation behave as configured; named gun sources and drafts are readable.
- [x] Disposable owner answer/revise/confirm flow preserves words/history, refuses stale application and keeps answers untracked; loopback/source/Markdown protections retained.
- [x] The installed CLI and HTTP views use configured repository links and validate the same selected project; deployment records the exact clean source commit and verifies its shipped bytes.

## Delivery Gates And Post-Integration Obligations

The source acceptance above describes the component that can be reviewed before
integration. Full required verification and separate immutable-candidate review
must pass before the bounded PR merges. They are delivery gates, not a claim of
owner Human QA. Remote integration identity and CI must then be read back.

After that tested integration exists, refresh RingWorld's feature pilot from its
exact source commit, verify the Board and all 64 unchanged mod files, and report
the source/runtime identities and PC access limitation. This remains required
work before final delivery; it cannot truthfully be checked before the source
has integrated. Preserve the original installation and completed receipts.

## Verification Procedure

Targeted red/green tests, source Runbook Full suite, disposable browser demo,
receipt hashes and installed import/CLI smoke checks, clean-clone preservation.
Root/source self-drift pre/post receipts and bounded semantic readback. No
release-ready, Human QA or agent productivity claim from installation tests.

## Documentation Impact

This Spec/Task/evidence, optional component documentation, bounded Runbook test
entry, Wiki capability explanation, RingWorld installation context/Runbook.
Do not alter existing producer question/answer stores or S-004D.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-09 | TK-001 | Coordinate and pin source before writes | Auth KaydenClark; integration e81fe43f; open PR440/441 exact overlap inspected; baseline evaluator passes; doctor no all/selection blocker; pre self-drift cleanUpdate false, 25 existing findings | Separate Spec and component lane; dashboard handoff read | Component delivery, full checks, review, integration and pilot pending |
| 2026-10-09 | TK-001 | Task closed | All56 required checks pass at clean code e65c2d6a in816.9s;32 deployment checks;exact-head GitHub CI SUCCESS;disposable owner answer/history/revise/stale/refreshed-confirm/apply and isolation browser proof;corrected literal rendering smoke. | Optional guide/Runbook/Wiki;verified acceptance and bounded Completion Result;proof/verification-summary.json and proof/browser-qa.md. | Independent final assembled review then integration merge/readback/CI and required RingWorld feature refresh;owner Human QA and PC route separate. |

## Completion Result

The optional component meets the four source acceptance criteria. Corrected
code at e65c2d6a passed 32 public deployment checks, all 56 required checks in
816.9 seconds, and the exact-head GitHub verify job. Disposable browser proof
covers full current/draft sources, answer history, revision, stale refusal,
fresh confirmation/application, same-origin isolation and literal framing.
The two independent preflight findings were corrected with failing regressions
then green checks. This result is component verification only. Separate final
review, integration identity/CI and the RingWorld refresh remain delivery gates;
owner Human QA, main promotion and PC access are not asserted.

## Remaining Limitations

Existing unrelated source drift is retained, not silently cleared. PC access
needs its own authorized route; existing localhost service is left alone.
