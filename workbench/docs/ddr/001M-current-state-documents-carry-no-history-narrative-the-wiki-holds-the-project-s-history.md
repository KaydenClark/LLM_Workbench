---
date: 2026-10-07
supersedes:
canonicalized_in:
  - workbench/specs/S-004Z-project-history-lives-in-the-wiki/SPEC.md
---

# Current-state documents carry no history narrative; the Wiki holds the project's history

The project's history summaries are kept, and they live in the Wiki: a plain-language history of the progress made and a summary of every choice made. Current-state documents (the README, Runbook, `AGENTS.md`, Blueprint, landmarks, Specs, Tasks, Destination Question Cards and decision records) carry no history narrative. Any history or context in those documents, Spec evidence rows included, answers one value test: does it bring us closer to the destination? Trim it when it is not as useful as we thought or when it is available elsewhere (GitHub, or the Wiki history); otherwise keep it.

Why the owner chose it: content on a current-state document must earn its place. GitHub holds the raw history; the Wiki holds the readable story.

Considered and rejected: deleting the history summaries outright and relying on GitHub alone, and keeping history narrative on the current-state documents themselves.

Consequences: the history page belongs to the Wiki of every room, so the template Wiki gains it and LLM_Workbench keeps its own; the owning Spec is [Project history lives in the Wiki](../../../specs/S-004Z-project-history-lives-in-the-wiki/SPEC.md). The README's release-history paragraph moves into that page under the READMEs Spec, which is blocked by the history Spec. One design item stays open for the owning Spec: how a trim coexists with append-only Spec evidence and checksummed Task Receipt rows, for example whether a trimmed row leaves a pointer.

Provenance: the owner's answers in the retro guardrail grilling of 2026-10-07, read back and confirmed in that session.
