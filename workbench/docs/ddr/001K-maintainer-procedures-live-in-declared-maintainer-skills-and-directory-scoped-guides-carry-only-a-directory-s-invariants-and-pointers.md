---
date: 2026-10-05
supersedes:
canonicalized_in:
  - AGENTS.md
---

# Maintainer procedures live in declared maintainer skills and directory-scoped guides carry only a directory's invariants and pointers

Landmark: Progressive Disclosure.

The two homes for maintainer-only text are merged into one shape. A procedure only this repository's maintainers run lives in a skill declared under `maintainerSkills` in the manifest, excluded from the core bundle, reached from the operations index and binding through the pointer while that operation runs: the owner's choice of 2026-10-04, delivered. A directory-scoped `AGENTS.md`, loaded by location when an agent works in that directory, carries only what is always true of that directory: its invariants, who owns each kind of file there, and pointers to the maintainer-skill rows for any procedure. It never carries a procedure, never restates a skill, never binds a skill, and never ships to a generated room. One Instruction Authority line says a directory-scoped guide binds while working in that directory.

Why the owner chose it:

- The owner, in his own words (2026-10-05): "Both declaired maintainers should be following the same principals. Do they contradict each other?"
- Shown that they share the principle and differ only in trigger, by operation for a skill and by location for a guide, the owner decided (2026-10-05): "Merge the two concepts. Take the 10.4 that fits better and add the parts from the nested guide that you can that dont conflict."
- The owner's earlier answer stands as the base (2026-10-04): "A ) maintainer skills."

Considered and rejected: the nested guide as the home for procedures, recorded on 2026-10-05 as [Maintainer-only procedures live in a directory-scoped AGENTS.md](archive/001F-maintainer-only-procedures-live-in-a-directory-scoped-agents-md.md) and deprecated because it was confirmed on a stale reading; a release or Template procedure touches several directories at once, so a location trigger would miss it or fire for unrelated work. Also rejected: a guide that repeats a skill's steps, which would give one truth two homes.

Consequences: the delivered maintainer skills are unchanged. Directory invariants that today sit in the root brief, such as the dogfood boundary for `templates/`, become candidates for a directory-scoped guide, which shrinks the root brief under the context test ([An agent pays context only for information that can change what it does next](001A-an-agent-pays-context-only-for-information-that-can-change-what-it-does-next.md)). The Instruction Authority line is owned by the Contract carrier rewrite; the guides themselves are a new small Spec. Which guide files each host loads by location is established at that Spec's Plan, not assumed here.

Provenance: the owner's question and decision in chat on 2026-10-05, read back in the same conversation.
