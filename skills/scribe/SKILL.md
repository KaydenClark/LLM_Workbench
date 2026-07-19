---
name: scribe
description: Dump issues one at a time, async, and have them captured as individual tickets to act on later — low-friction QA/observation capture with zero questions back. You talk, Claude records; a separate promote pass clusters the pile into specs. The user-driven, capture twin of wayfinder.
---

# Scribe

Low-friction capture for a busy day. You surface issues as you hit them — walking
an app, playing one of the games — and each is recorded as its own tracked ticket
to act on later. No interview, no deep-dive: **you talk, this skill only records.**
It rides the same GitHub Issue substrate as `wayfinder` and runs a `notepad`'s
capture discipline; it is wayfinder's async, user-driven twin.

## Start — scoped to a target

Invoke against an app or game: `/scribe <target>` (e.g. `/scribe CIC Dashboard`).
Open, or reuse, a per-target **container** — a GitHub Issue map like
`CIC Dashboard QA` in that target's repo (fall back to a local markdown container
only when Issues are unavailable, and say so).

## Capture — one at a time, never answer

For each thing the user reports, create **one child ticket** (raw-captured, open),
grouped by whatever context they are in. Then stop and wait for the next.

- **Only record.** Do not investigate, fix, or editorialize.
- **Never answer.** Even a genuine question mid-stream ("how long do done items
  stay?") is logged as an open ticket, not answered — capture never yields to
  investigate mode unless the user explicitly breaks out.
- Keep each ticket close to the user's own words.

## Promote — act on the pile all at once

On the user's command, run the promote pass:

1. Read every raw-captured ticket in the container.
2. **Cluster** related issues into spec-sized groups.
3. Present the proposed grouping and routing for **one approval** — e.g. "4 groups
   → 4 specs, these 2 standalone, this typo → a plain ticket. Go?" Route trivially
   small issues to a plain ticket or an existing spec rather than minting a spec each.
4. After approval, run `/to-spec` then `/to-tickets` for each cluster — the same
   output as any spec.
5. Close each raw ticket as it graduates; close the container when it is emptied.

Two ticket generations, by design: the raw capture tickets **close** on
graduation; fresh execution tickets are born under the spec. The container must
close when emptied — it is capture state, never a second permanent tracker beside
specs and `TASKBOARD.md`.
