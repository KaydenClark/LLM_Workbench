# Workbench Core Skills

This directory is the self-contained, versioned LLM Workbench skill source. It
is a closed 12-skill bundle for a brand-new installation, not a general catalog
or a project-local discovery tree. The checked-out LLM Workbench release owns
the exact source versions.

<!-- core-skills:start -->
| Skill | Purpose |
|---|---|
| `adoption` | Migrate an existing project into the Workbench once while preserving project truth and recovery. |
| `checkpoint` | Save an in-progress decision record as a recoverable handoff. |
| `code-review` | Independently review a fixed implementation diff against its owning spec. |
| `genesis` | Create a new greenfield Workbench project from a founding prompt. |
| `grilling` | Run the question-at-a-time decision interview. |
| `implement` | Drive one eligible ticket through red/green, review, and remote recovery. |
| `make-it-so` | Promote settled decisions and execute their approved tickets. |
| `to-docs` | Route settled truth into its existing documentation owner. |
| `to-spec` | Create or update one stable capability specification. |
| `to-tickets` | Decompose a capability into dependency-aware implementation slices. |
| `tracer-bullet` | Cut a capability into vertically testable slices. |
| `update-harness` | Reconcile an adopted project with the current Workbench contract. |
<!-- core-skills:end -->

## Normal setup

Run the checked-out helper on a brand-new host:

```bash
node tools/core-skill-installer.mjs install [--home USER_HOME]
```

It supplies a missing core skill only from this directory into the user-scoped
Codex-compatible `.agents/skills` and Claude `.claude/skills` roots. Normal
setup is presence-only: an existing same-named skill is accepted without a
content comparison or replacement. A Git-owned discovery root or a path
collision blocks before either discovery root is changed and returns exact
remediation in its JSON result. Replacing an existing skill is reserved for the
explicit-update flow, not normal setup.

## Retired and preserved source

The optional router, convenience, and reference skills removed from live
discovery are retained under `skills-archive/optional-active-2026-09-01/`.
`skills-pending/` remains historical rewrite source outside discovery. Neither
directory participates in the portable core bundle.

The upstream baselines are covered by the [tracked third-party notice](../THIRD_PARTY_NOTICES.md).
