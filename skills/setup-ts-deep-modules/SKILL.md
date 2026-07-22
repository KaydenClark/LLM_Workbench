---
name: setup-ts-deep-modules
description: Establish enforceable TypeScript module boundaries after the project chooses a deep-module architecture.
---

# Setup TS Deep Modules

Confirm the project has chosen explicit module boundaries and identify the
public APIs, dependency direction, and migration constraints. Configure the
smallest compatible enforcement mechanism, add one permitted and one forbidden
example, and make the rule fail visibly.

Document the convention and verification command in `RUNBOOK.md`; capture the
architectural rationale in `BLUEPRINT.md` or the owning spec. Do not impose
this structure on a project that has not selected it.
