---
doc_type: blueprint
version: 1
project_name: "[PROJECT_NAME]"
status: template
source_root: "[ABSOLUTE_PROJECT_PATH]"
last_reviewed: "[YYYY-MM-DD]"
tracks:
  - architecture
  - contracts
  - invariants
  - trust_boundaries
---

# [PROJECT_NAME] - Blueprint

**Last reviewed:** [YYYY-MM-DD] ← update whenever any section content changes  
**Status:** [blank / active / partial / stale]  
**Source root:** `[ABSOLUTE_PROJECT_PATH]`

This is the stable reference for what the project is. Keep it factual, source-backed, and short. **Delete any section with no real content rather than leaving placeholders** — a placeholder looks like data and isn't.

## What This Project Is

[One paragraph describing the app/service/tool, who uses it, and what problem it solves.]

Core promise:

> [Concrete user-facing promise in plain language.]

Primary users:

- [User/persona]
- [User/persona]

## Non-Goals

This project is not trying to:

- [Non-goal]
- [Non-goal]
- [Non-goal]

## Current Product Shape

When the project is working, a user can:

- [Workflow or capability]
- [Workflow or capability]
- [Workflow or capability]

The most important quality bar is:

- [correctness / speed / reliability / privacy / ease of use / other]

## Architecture

| Layer | Choice | Source / Notes |
|---|---|---|
| Runtime | [RUNTIME] | [version/source] |
| Frontend | [FRONTEND_OR_NONE] | [notes] |
| Backend | [BACKEND_OR_NONE] | [notes] |
| Database/storage | [STORAGE_OR_NONE] | [notes] |
| Auth | [AUTH_OR_NONE] | [notes] |
| Testing | [TEST_STACK] | [notes] |
| Deployment/runtime | [DEPLOYMENT_OR_NONE] | [notes] |

Architecture constraints:

- [Constraint]
- [Constraint]
- [Constraint]

## Directory Map

```text
[PROJECT_ROOT]/
├── [path]/        <- [purpose]
├── [path]/        <- [purpose]
├── AGENTS.md      <- agent behavior and edit/read scope
├── BLUEPRINT.md   <- stable project definition
├── ROADMAP.md     <- active work plan and proof log
└── RUNBOOK.md     <- setup, operation, verification, recovery
```

Machine-use directory index:

| Path | Purpose | Owner | Agent editable? | Generated? | Sensitive? | Criticality | Proof source |
|---|---|---|---|---|---|---|---|
| `[path/]` | [purpose] | [owner] | [yes/no] | [yes/no] | [yes/no] | [low/medium/high] | [file/test/check] |

## Main Contracts

Use only the sections that apply. Delete irrelevant sections.

### Routes / Screens

| Route or screen | Purpose | Status | Source |
|---|---|---|---|
| `[ROUTE_OR_SCREEN]` | [purpose] | [working/partial/missing] | [file/test] |

### API Endpoints

| Method | Path | Auth | Purpose | Status | Source |
|---|---|---|---|---|---|
| `[METHOD]` | `[PATH]` | [yes/no] | [purpose] | [working/partial/missing] | [file/test] |

### Commands

| Command | Purpose | Required for done? |
|---|---|---|
| `[COMMAND]` | [purpose] | [yes/no] |

### Data Model

| Entity | Key fields | Stored where | Notes |
|---|---|---|---|
| `[ENTITY]` | `[FIELDS]` | [table/file/service] | [notes] |

## Core Logic And Invariants

[Describe the most important domain logic and where it lives.]

Rules:

- [Invariant]
- [Invariant]
- [Invariant]

Do not duplicate this logic in:

- [places where reimplementation would cause bugs]

## Trust, Privacy, And Safety Boundaries

Sensitive data:

- [secret/private/local data type]

Rules:

- [what must stay local / ignored / encrypted / redacted]
- [what must never be logged or committed]
- [what requires explicit user approval]

## Known Risks

List only stable architectural risks that future agents must stay aware of. Immediate blockers belong in `ROADMAP.md` → Blocked Or Deferred instead.

| Risk | Impact | Mitigation / owner |
|---|---|---|
| [Risk] | [impact] | [mitigation] |

## Design Decisions

Record only decisions that future agents must preserve.

| Decision | Rationale | Date / Source |
|---|---|---|
| [Decision] | [why] | [YYYY-MM-DD / source] |

## Health Criteria

The project is healthy when:

- [baseline test command] passes;
- [build/type/lint command] passes when relevant;
- the primary user workflow succeeds end-to-end;
- empty, error, and degraded states do not crash;
- secrets and local data are not exposed in committed or built output.

Verification commands live in `RUNBOOK.md`. Proof of past runs lives in the `ROADMAP.md` Verification Log.
