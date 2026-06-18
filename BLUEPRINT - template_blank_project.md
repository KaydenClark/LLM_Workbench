# [PROJECT_NAME] - Blueprint

**Created:** [YYYY-MM-DD]  
**Status:** blank project starting spec

This is the stable target for the project. Keep it short enough that a new agent can read it at the start of every session.

## What This Project Is

[One paragraph describing the app/service/tool, who uses it, and what problem it solves.]

Core promise:

> [A concrete user-facing promise, written in plain language.]

## Non-Goals

- [Thing this project should not try to do yet]
- [Thing this project should not try to do yet]
- [Thing this project should not try to do yet]

## MVP

The first useful version must let a user:

- [MVP workflow 1]
- [MVP workflow 2]
- [MVP workflow 3]

MVP is complete when:

- [Acceptance criterion 1]
- [Acceptance criterion 2]
- [Acceptance criterion 3]

## Architecture Decision

| Layer | Choice | Rationale |
|---|---|---|
| Runtime | [RUNTIME] | [why this is enough] |
| Frontend | [FRONTEND_OR_NONE] | [why this is enough] |
| Backend | [BACKEND_OR_NONE] | [why this is enough] |
| Database/storage | [STORAGE_OR_NONE] | [why this is enough] |
| Auth | [AUTH_OR_NONE] | [why this is enough] |
| Testing | [TEST_STACK] | [why this is enough] |

Constraints:

- Use free/local tooling unless approved otherwise.
- Prefer the smallest stack that can support the MVP.
- Add complexity only when the current workflow proves it needs it.

## Initial Directory Plan

```text
[PROJECT_ROOT]/
├── [path]/        <- [purpose]
├── [path]/        <- [purpose]
├── README.md      <- setup and run commands
├── AGENTS.md      <- agent operating rules
├── BLUEPRINT.md   <- stable product/architecture reference
└── GAME_PLAN.md   <- active execution plan
```

## Core Workflows

### [Workflow Name]

User goal: [goal]

Expected flow:

1. [step]
2. [step]
3. [step]

Empty/error states:

- [empty state]
- [error state]

## Data Model

| Entity | Fields | Notes |
|---|---|---|
| `[ENTITY]` | `[FIELDS]` | [notes] |

## Verification Bar

The project is not considered working until:

- [test/build command] passes;
- the app/service starts locally;
- the primary MVP workflow has been manually verified;
- empty and error states do not crash.

Commands, once implemented:

```bash
[INSTALL_COMMAND]
[TEST_COMMAND]
[RUN_COMMAND]
```

## Open Decisions

Only list decisions that truly block implementation.

- [Decision] - [options / owner / deadline]
