# [PROJECT_NAME] - Blueprint

**Last reviewed:** [YYYY-MM-DD]
**Status:** [blank / active / partial / stale]
**Source root:** `[ABSOLUTE_PROJECT_PATH]`

This is the stable reference for what the project is. Keep it factual,
source-backed, and short. Delete sections that do not apply instead of leaving
placeholders that look like facts.

## What This Project Is

[One paragraph describing the app/service/tool, who uses it, and what problem it
solves.]

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

## Direction And Build Order

Use this section for stable product direction and sequencing logic. Put the
current executable task queue in `TASKBOARD.md`, not here.

Current phase:

- [phase name and what it means]

Build order:

1. [Phase or milestone] - [why this comes first]
2. [Phase or milestone] - [why this comes next]
3. [Phase or milestone] - [why this is later]

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
├── AGENTS.md      <- agent behavior and read/edit scope
├── BLUEPRINT.md   <- stable project definition and direction
├── TASKBOARD.md   <- live task queue, blockers, proof log
└── RUNBOOK.md     <- setup, operation, verification, recovery
```

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

List stable architectural or product risks that future agents must stay aware
of. Immediate blockers belong in `TASKBOARD.md` -> Blocked.

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

Verification commands live in `RUNBOOK.md`. Current task status and proof
history live in `TASKBOARD.md`.
