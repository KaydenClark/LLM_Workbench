---
status: accepted
date: 2026-09-05
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
  - LEXICON.md
---

# The integration branch is a manifest-declared fact

Every Workbench room declares the branch its independent-review gate merges into as `git.integrationBranch` in `workbench/manifest.json`, beside `git.defaultBranch`, by exact name. Controls, skills, and tools resolve the branch from that declaration instead of a literal that can drift from it; `doctor` reports an undeclared or unresolvable declaration as an `error` finding with effect `none`, and only the Genesis readiness gate and the Genesis, Adoption, and upgrade completion checklists fail closed on it.

Considered and rejected: keeping `integration` a prose convention in `AGENTS.md`, which left two of four live rooms without a merge target and let `Integration` and `integration` pass or fail the same containment check by room; blocking every spec selection on a missing branch, which a room can create in one command and which ADR-0020 forbids for a check that does not evaluate that change; a schema bump, since the block is additive and a manifest without it stays valid.

Consequences: `workbench-layout.mjs init` and `migrate` and `workbench-adoption.mjs migrate` write the block (explicit flags, then an existing integration-named branch by its exact case, then `origin/HEAD` and `integration`); `workbench-paths.mjs` exposes it through `declaredGit`; `diagnostics.mjs` registers `integration-branch-undeclared` and `integration-branch-missing` in the `git` scope; the root and template `AGENTS.md`, the protocols, and the Genesis and Adoption skills refer to the declared branch. Declaring never creates a branch: the skills create it from the default branch when authorization permits, and a recorded omission reason in the owning spec is the only other way to call a run finished.

Provenance: [S-029](../../specs/S-029-declared-integration-branch/SPEC.md), captured from the Master Workbench v3.1.1 upstream fix list (UP-011, UP-006) and the v3.1.1 acceptance report findings F-006 and F-007.
