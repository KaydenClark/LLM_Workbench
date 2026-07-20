# LLM Workbench - Blueprint

**Last reviewed:** 2026-07-12
**Status:** active
**Harness version:** v2.3
**Source root:** `/Users/kayden/GPT_OS/Workbench Factory`
**Remote:** `github.com/KaydenClark/LLM_Workbench`

## Product Map

LLM Workbench is a vendor-neutral, local-first control harness for AI-assisted
software projects. `AGENTS.md` is the always-loaded operating system; the other
surfaces reveal product and execution detail only when it is relevant.

Core promise:

> Give an agent enough authority, scope, product truth, executable work, and
> proof requirements to make safe progress without loading project history.

## Goals And Pillars

- **Safe autonomy:** explicit authority, edit scope, safety, Git, and escalation
  rules live in `AGENTS.md`.
- **Progressive disclosure:** the hot board selects one spec/ticket; detailed
  capability truth loads from its stable `SPEC.md` only on demand.
- **Single ownership:** product direction belongs here, shared definitions in
  `LEXICON.md`, execution state on the hot board, capability truth and evidence
  in specs, procedures in `RUNBOOK.md`, and behavior in source/tests.
- **Evidence over taste:** deterministic checks are the release gate; repeated
  controlled trials are required for agent-outcome claims.
- **Portable by default:** plain Markdown and zero-dependency local commands
  work with Codex, Claude Code, Gemini CLI, and ordinary command-line workflows.

## Architecture And Invariants

| Layer | Owner | Invariant |
|---|---|---|
| Agent operating system | `AGENTS.md` | Always loaded; owns how agents work. |
| Product map | `BLUEPRINT.md` | Compact direction, architecture, invariants, and spec catalog; no live task narration. |
| Shared language | `LEXICON.md` | On demand; owns accepted project-wide definitions without requirements or live state. |
| Execution projection | `TASKBOARD.md` | Active specs only: current slice, owner, blocker, event, next gate. |
| Capability record | `specs/S-###-slug/SPEC.md` | Stable path; owns requirements, decisions, acceptance, verification, evidence, and completion. |
| Procedures | `RUNBOOK.md` | Commands, troubleshooting, recovery, and operational detail. |
| Implementation truth | source and tests | Wins when prose disagrees with verified behavior. |

Generated catalog and dashboard regions are deterministic projections of spec
metadata. Human-authored prose stays outside those regions. Completed specs
remain at their stable path, disappear from the hot board immediately, and may
be changed only through a later spec linked by supersession.

## Non-Goals

- A hosted tracker, database, paid service, broad MCP server, or general project
  management app.
- Personal task management or replacement of Command Information Center.
- A permanent Done lane or proof archive in startup context.
- Retrofitting every historical task into a manufactured spec.
- Claiming better agent outcomes from smaller context alone.

## Spec Catalog

<!-- spec-catalog:start -->
| Spec | Description | Status |
|---|---|---|
| [S-001 - Spec-Centered Progressive Disclosure](specs/S-001-progressive-disclosure/SPEC.md) | Make AGENTS the operating system while specs hold durable capability truth and the hot board projects active work only. | complete |
| [S-002 - Held-Out Second-Domain Evaluation](specs/S-002-heldout-evaluation/SPEC.md) | Add a condition-blind held-out task before spending on repeated c0/c1/c2/c3 outcome trials. | complete |
| [S-003 - Prospective Dungeon Friends Pilot](specs/S-003-dungeon-friends-pilot/SPEC.md) | Evaluate v2.3 progressive disclosure in Dungeon Friends only after separate owner authorization. | planned |
| [S-004 - Safe Direct Claim](specs/S-004-safe-direct-claim/SPEC.md) | Prevent direct claim calls from bypassing a ticket's declared blockers. | complete |
| [S-005 - Bootstrap Documentation Alignment](specs/S-005-bootstrap-doc-alignment/SPEC.md) | Remove stale four-control-doc and Taskboard-proof wording from bootstrap and adoption guidance. | complete |
| [S-006 - Automated Harness Feedback Gate](specs/S-006-feedback-automation/SPEC.md) | Build and operate a one-candidate Terra/Sol feedback loop with independent evidence gates. | complete |
| [S-007 - Safe Feedback Helper Import](specs/S-007-feedback-helper-import/SPEC.md) | Allow the feedback helper to be imported when Node has no script path. | complete |
| [S-008 - Windows Verification Portability](specs/S-008-windows-verification-portability/SPEC.md) | Keep context output, spec-doctor, and eval-runner verification stable across Windows and POSIX hosts. | complete |
| [S-009 - Git-Write Constrained Adoption](specs/S-009-git-write-constrained-adoption/SPEC.md) | Keep adoption safe and usable when a host cannot write Git metadata. | complete |
| [S-010 - Canonical Evaluator Entry Detection](specs/S-010-canonical-evaluator-entry/SPEC.md) | Ensure the evaluator runs when a checkout is invoked through a canonicalized path. | complete |
| [S-011 - Agent Skills Adoption](specs/S-011-agent-skills-adoption/SPEC.md) | Curated, Workbench-vocabulary agent skills (grill, to-spec, to-tickets, implement, review) shipped as part of the harness. | active |
| [S-012 - Reproducible Adoption Provenance](specs/S-012-adoption-provenance-proof/SPEC.md) | Preserve enough adoption provenance for an independent fresh-clone verification. | complete |
| [S-013 - Standardized Automation Run Outcomes](specs/S-013-automation-run-outcomes/SPEC.md) | Give scheduled Workbench runs a fail-closed JSON outcome and verified-idle streak contract. | complete |
| [S-014 - Workbench Release Candidate](specs/S-014-workbench-release-candidate/SPEC.md) | Prepare one exact-SHA, independently audited Workbench integration-to-main release candidate for owner approval through CIC. | active |
| [S-020 - Spec-Native Team Coordination](specs/S-020-spec-native-team-coordination/SPEC.md) | Modernize the optional small-team templates so parallel roles coordinate through one owning spec and one durable writer. | complete |
| [S-022 - Thinking/Decision Skill-Family Phase 2](specs/S-022-thinking-decision-skill-family/SPEC.md) | Extract a storage-agnostic `notepad` primitive and reorganize the thinking/decision skill family (save, scribe, wayfinder, research, prototype) onto it, with GitHub Issues as the shared ticket substrate. | active |
<!-- spec-catalog:end -->

## Cross-Cutting Health

- all Workbench self-tests and the template evaluator pass;
- `node tools/spec-workbench.mjs doctor` reports no lifecycle, link, or render
  drift;
- root docs contain no template placeholders and generic templates contain no
  Workbench-specific state;
- harness changes record baseline, after-state, limitations, and documentation
  impact without weakening audit criteria;
- published version changes occur only after behavior is proven.
