# S-005H - Optional project Grilling Board deployment

**Spec ID:** S-005H
**Status:** active
**Priority:** 1
**Owner:** codex-board-worker
**Stance:** Builder
**Updated:** 2026-10-09
**Catalog description:** Deploy the existing Grilling Board optionally into an adopted project with safe initialization, project framing, links and isolated owner answers.
**Blockers:** none
**Latest event:** TK-001 claimed by codex-board-worker.
**Next gate:** Close TK-001 with verification and documentation proof.
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

- [ ] Public optional deployment initializes and verifies a fresh project, is clone-portable, and refuses unsafe/colliding states without lost data.
- [ ] Project title/topics, repository links and browser state isolation behave as configured; named gun sources and drafts are readable.
- [ ] Disposable owner answer/revise/confirm flow preserves words/history, refuses stale application and keeps answers untracked; loopback/source/Markdown protections retained.
- [ ] Independent review passes immutable candidate; full required verification passes, bounded PR integrates with remote commit and CI evidence.
- [ ] RingWorld feature deployment uses tested integration source and verifies Board plus all 64 unchanged runtime files; PC access limitation is explicit.

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

## Remaining Limitations

Existing unrelated source drift is retained, not silently cleared. PC access
needs its own authorized route; existing localhost service is left alone.
