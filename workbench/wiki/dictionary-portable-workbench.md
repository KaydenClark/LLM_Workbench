---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Portable Workbench
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000H-the-context-lives-in-github-so-work-can-move-to-the-cloud-at-any-time.md
  - workbench/docs/ddr/000I-many-agents-work-one-project-in-parallel-across-the-cloud-and-the-owner-s-devices.md
last_verified: 2026-10-07
---

# Portable Workbench: everything an agent needs is in the repository

A Portable Workbench is a fully packaged, deployable agentic management system.
Everything an agent needs to do the work is in the project's Git repository, so
any agent on any machine, or several at once in the cloud, can clone it, do the
authorized work, push it, and clean up after itself. Nothing the agent needs
lives only on the owner's machine. The canonical definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** It describes the repository, not a host or a session. Host portability and the support root are things it depends on, not the thing itself. Its success criterion, in the owner's words (2026-09-22): a fresh agent finding the right answer, completing authorized work, maintaining its proper owners, cleaning up after itself, and continuing without the owner reconstructing the project.

**Neighbouring words.** It is a property of the
[Workbench](dictionary-workbench.md) as a repository. [Host
portability](dictionary-host-portability.md) is one thing it depends on, and so
is the [support root](dictionary-support-root.md), `workbench/`, which has its own glossary entry. The
[Environment](dictionary-environment.md) and
[Filesystem](dictionary-filesystem.md) entries describe where a cloned room
lives once it is checked out.

**In use.** Parallel Workers on one Spec each check out their own worktree of
this repository, do one Task on its own branch, push it and open a pull request;
nothing they need lives only on the owner's machine, so the work can move to
another agent or to the cloud at any time ([the GitHub context
decision](../docs/ddr/000H-the-context-lives-in-github-so-work-can-move-to-the-cloud-at-any-time.md);
[the parallel agents
decision](../docs/ddr/000I-many-agents-work-one-project-in-parallel-across-the-cloud-and-the-owner-s-devices.md)).

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The GitHub context decision (DDR-000H)](../docs/ddr/000H-the-context-lives-in-github-so-work-can-move-to-the-cloud-at-any-time.md): the context lives in GitHub.
- [The parallel agents decision (DDR-000I)](../docs/ddr/000I-many-agents-work-one-project-in-parallel-across-the-cloud-and-the-owner-s-devices.md): many agents, one project.
- [The Portable Workbench landmark](design-concepts/landmark-portable-workbench.md): the design concept.
- [Portable Workbench installation, adoption and upgrade](features/portable-workbench-installation-adoption-and-upgrade.md): the delivered capability.
