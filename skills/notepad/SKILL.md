---
name: notepad
description: The durable, non-canonical working record of one in-progress decision session — a stable-ID entry list with open/tentative/locked tags, held as a GitHub Issue. A primitive that grilling, brainstorm, and scribe run over; never invoked directly.
disable-model-invocation: true
---

# Notepad

The shared record primitive for the thinking/decision skills. `grilling`,
`brainstorm`, and `scribe` each **run a notepad** and add only their own stance;
this file owns what a notepad *is*, how it is stored, and its lifecycle. You never
invoke `/notepad` on its own — there is no such thing as starting a bare notepad.

A notepad is **working memory, not canon.** It survives context compaction and
machine hops so nothing is lost, but it is never authoritative until `/make-it-so`
promotes its locked decisions into specs and docs. Durable is not the same as
canonical: the Issue is durable; the spec is canon.

## Scale

- A **notepad** records one decision session (one sitting, one context).
- A **map** is a notepad at multi-session scale — a `wayfinder` effort whose
  child **tickets** each hold one decision. Same primitive, larger grain.

## Storage — a GitHub Issue

A notepad is held as a GitHub Issue so it is durable and resumable from any
machine by construction, with no separate push step.

- **Create** an Issue labelled `notepad` in the scope's repo (project work → the
  project repo; workspace work → the GPT_OS mirror). The title is the topic; the
  body holds the entry list.
- **Append** per decision by editing the Issue body (or adding a comment for long
  detail). This per-entry write is the entire storage cost.
- **Resume** by reading the Issue — never the chat. Continue at the first `open`
  entry; never re-ask a `locked` one.
- **Fallback:** when the scope has no Issues enabled or no tracker is reachable,
  fall back to a local markdown notepad at `.agents/notepad/<topic-slug>-<YYYY-MM-DD>.md`
  and say so. The markdown path is the documented fallback, not the default.

## Format

Stable IDs that are never renumbered; one status tag per line.

```markdown
# <topic>
STATUS: PROVISIONAL — not canonical until /make-it-so

## Entries
1. [open]      <entry>
2. [locked]    <entry> — <one-line result>
   2A. [open]  <sub-entry / dependency of 2>
```

- Sub-entries nest as `2A`, `2B` under their parent. A newly opened line appends
  as the next top-level number; never renumber existing lines.
- Tags: `[open]` (undecided), `[tentative]` (leaning, revisit), `[locked]`
  (decided). Flip the tag and append the one-line result the moment a line
  resolves, before moving on.

## Lifecycle

1. **Create** at the start of the session, before the first entry.
2. **Append/flip** one entry at a time as the session proceeds.
3. **Resume** from the Issue after any compaction, model switch, or machine hop.
4. **Promote** with `/make-it-so`, which reads the `locked` entries as settled
   decisions and marks the notepad `STATUS: PROMOTED`. Promotion is the only path
   to canon; the notepad itself writes no canonical file.
