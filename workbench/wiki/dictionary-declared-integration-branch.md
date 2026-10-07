---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Declared integration branch
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md
last_verified: 2026-10-07
---

# Declared integration branch: where reviewed work merges

The declared integration branch is the branch, named by exact case in `workbench/manifest.json` `git.integrationBranch`, into which the independent review gate merges task branches. `git.defaultBranch` names the branch it is created from. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** A declaration, not a prose convention: tools and root files resolve it from the manifest, `doctor` reports it undeclared or missing without blocking selection, and only generation, adoption, and upgrade completion fail closed on it ([ADR-0039](../docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)).

**Neighbouring words.** It is declared by the [Support root](dictionary-support-root.md)'s manifest. Its two [Diagnostics](dictionary-diagnostic.md), `integration-branch-undeclared` and `integration-branch-missing`, have effect `none`. Work reaches it after [Review](dictionary-review.md) and is [Verified](dictionary-verify.md) there before the owner promotes it to `main`.

**In use.** This room declares `git.integrationBranch: integration` and `git.defaultBranch: main`, so pull requests default to `integration` and only the owner promotes to `main`, as `AGENTS.md` says.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The integration branch decision (ADR-0039)](../docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md): the integration branch is a manifest-declared fact.
- [Declared Integration And Recoverable Completion](features/declared-integration-and-recoverable-completion.md): the feature article.
- [Declared Integration Branch (S-029)](../specs/S-029-declared-integration-branch/SPEC.md): the Spec that delivered it.
