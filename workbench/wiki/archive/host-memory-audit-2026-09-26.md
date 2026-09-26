---
type: meta
status: archived
sensitivity: normal
knowledge_role: historical
provenance:
  - S-00V TK-00I host-memory audit by claude-lane-F worker, 2026-09-26, read-only against the owner's Claude Code auto-memory directory for this project
  - Owner decision PW-8 in the grilling destination ledger ("This is what the wiki is for")
source_paths:
  - workbench/wiki/archive/host-memory-audit-2026-09-26.md
  - workbench/specs/S-00V-portable-workbench/tasks/TK-00I/TASK.md
  - workbench/wiki/grilling-destination-audit-ledger.json
last_verified: 2026-09-26
---

# Host-Memory Audit, 2026-09-26

Provenance record for [S-00V](../../specs/S-00V-portable-workbench/SPEC.md)
TK-00I. It names every file in the owner's Claude Code auto-memory directory for
this project on 2026-09-26 and what happened to it. The audit read that
directory and never edited or deleted it; host memory stays a per-machine
convenience the Workbench never depends on. Audited against branch commit
`d1c75e7` (the TK-00I claim). This record is history: current knowledge lives in
the destinations it names.

The directory held 27 files: 26 notes and their `MEMORY.md` index (the S-00V
pre anchor counted 17). Nothing was copied for a file marked already owned,
stale or excluded. Credentials, personal details, machine paths and other
projects' content were not carried into any destination.

## Inventory

| Memory file | Disposition | Destination or reason |
|---|---|---|
| `MEMORY.md` | Excluded: index only | Pointer list to the files below; two of its links (`workbench-controls-are-the-product`, `master-workbench-purpose`) name files that do not exist. |
| `finish-authorized-work.md` | Promoted | [finish-authorized-work](../finish-authorized-work.md); control wording recorded in the TK-00I close |
| `dont-manufacture-owner-gates.md` | Promoted (merged) | [finish-authorized-work](../finish-authorized-work.md); control wording recorded in the TK-00I close |
| `owner-authored-adrs-are-accepted.md` | Promoted; needs control wording | [owner-authored-adrs-are-accepted](../owner-authored-adrs-are-accepted.md); keeps the open ledger `ACC-1` contradiction visible |
| `derive-before-asking-the-owner.md` | Promoted | [derive-before-asking-the-owner](../derive-before-asking-the-owner.md); machine transcript paths generalized to "when the host has them" |
| `design-interviews-are-forward-looking.md` | Promoted | [design-interviews-are-forward-looking](../design-interviews-are-forward-looking.md) |
| `prefers-visual-over-prose-reports.md` | Promoted | [recurring-results-are-visual](../recurring-results-are-visual.md); other-project framing dropped |
| `pc-test-only-at-main-readiness.md` | Promoted | [pc-test-at-main-readiness](../pc-test-at-main-readiness.md) |
| `workbench-core-rhythm-and-rework.md` | Promoted | [core-rhythm](../core-rhythm.md); its pointer to a local grilling note is stale, superseded by the ledger (`FND-Q04`) |
| `suite-needs-a-committed-candidate.md` | Promoted | [suite-needs-a-committed-candidate](../suite-needs-a-committed-candidate.md); `invalid-source-identity` re-verified in `workbench-layout.mjs` |
| `spec-workbench-lifecycle-tool-quirks.md` | Promoted, corrected | [lifecycle-tool-behaviors](../lifecycle-tool-behaviors.md); the "literal ready" quirk now holds only for table rows, since record-backed Tasks derive readiness from Blockers |
| `promote-draft-lives-in-recovery.md` | Promoted (merged) | [lifecycle-tool-behaviors](../lifecycle-tool-behaviors.md); the rule itself is RUNBOOK -> Direct Owner Promotion |
| `v4-dispatcher-lane-pattern.md` | Promoted in part; rest stale | Durable lessons in [parallel-lane-dispatch](../parallel-lane-dispatch.md) and [lifecycle-tool-behaviors](../lifecycle-tool-behaviors.md). Phase history, PR numbers and suite counts are stale and owned by their Specs' evidence logs (S-00H, S-00I, S-00J, S-00O). |
| `parallel-spec-merge-pipeline.md` | Promoted (merged) | [parallel-lane-dispatch](../parallel-lane-dispatch.md); the closeout commands are RUNBOOK -> Version-Control Procedures |
| `check-for-an-existing-lane-first.md` | Promoted (merged) | [parallel-lane-dispatch](../parallel-lane-dispatch.md); S-00V push-on-claim will supersede the need once delivered |
| `codex-separate-context-review-route.md` | Promoted | [separate-context-review-with-codex](../separate-context-review-with-codex.md), marked as an optional host capability with dated observations |
| `per-skill-rebuild-specs.md` | Already owned; one fact promoted | Delivery state belongs to S-00X to S-01S and S-00W and is not copied into the Wiki. The planned-Spec claim refusal is in [lifecycle-tool-behaviors](../lifecycle-tool-behaviors.md). |
| `qa-destination-is-the-grilling-answers.md` | Already owned | [MEMORY.md](../MEMORY.md) -> Grilling Destination Audit Ledger, the [ledger](../grilling-destination-audit-ledger.json), and AGENTS -> Git Rules (Human QA findings are reconciled, not waited on) |
| `wiki-as-knowledge-base.md` | Already owned | Ledger `TT-Q8`; the [SCHEMA](../SCHEMA.md) flat-entry rules; the MEMORY.md Skills Reference and Individual Spec Articles; this audit |
| `landmarks-are-the-design-concept-rung.md` | Already owned | [Landmark Tracker](../design-concepts/landmark-tracker.md) and S-01T; the landmark mapping held only in an external rendered page was not copied |
| `notepad-cli-note-path.md` | Already owned | RUNBOOK notepad section (bare names resolve under `notepads/work/`; explicit project-relative paths select other live collections) |
| `notepads-concurrent-write-loss.md` | Already owned | RUNBOOK ("revision checks are not simultaneous-writer locks"), the `notepad` skill and [skill-notepad](../skill-notepad.md) keep one writer per note. Re-verified: `writeSafeFile` still publishes with an unconditional rename. The defect still has no owning Spec; that finding authorizes no work. |
| `example-workbench-reference-room.md` | Already owned; detail stale | AGENTS and RUNBOOK -> Template Upgrade Release Gate own the reference room, now Workbench_Template (formerly Example_Workbench); its pinned v3.1.2 provenance is stale |
| `llm-workbench-upgrade-route.md` | Stale | A recipe pinned to the v3.1.1 to v3.1.2 transition; the current route is RUNBOOK's upgrade and installed-state sections, the `update-harness` skill and the Template Upgrade Release Gate |
| `notepad-cleanup-blocked-by-legacy-records.md` | Excluded: machine-local state | The blocking records are untracked files in one checkout and never reach a clone; the fail-closed retention check is `notepads.mjs` behavior documented in RUNBOOK. Its bypass-by-`rm` workaround was deliberately not promoted. |
| `skills-root-is-a-git-repo.md` | Excluded: machine state | Describes one machine's personal catalog checkout; the durable part (core skills ship in `workbench/skills`, the catalog is backup) is S-00V's Decisions And Contracts and the Lexicon's Portable Workbench row |
| `master-workbench-upstream-fix-list.md` | Excluded: another project | About a separate review application and its machine paths, not how this repository operates |

## Runs without the memory directory

`tools/test-workbench-round-trip.mjs`, in the AGENTS full suite, runs Genesis,
claim, interruption, fresh-clone resume, close and push with `HOME` set to a
fresh empty directory. TK-00I added two assertions: the scrubbed `HOME` starts
with no entries at all, so no provider memory directory exists for any step to
read, and at the end neither `.claude` nor `.codex` exists under it. Before the
change `HOME` was the shared system temp directory, which held 54005 entries,
and the new start assertion failed there. No tracked tool reads a provider
memory path: a `git grep` for `claude/projects` and auto-memory finds only
documentation and this Task's records.

## History

- 2026-09-26: created by the TK-00I audit.
