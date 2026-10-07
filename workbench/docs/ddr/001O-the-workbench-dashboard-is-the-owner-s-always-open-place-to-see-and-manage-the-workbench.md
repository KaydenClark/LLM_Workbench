---
date: 2026-10-07
supersedes:
canonicalized_in:
  - LEXICON.md
  - workbench/specs/S-004D-shared-interactive-board/SPEC.md
---

# The Workbench Dashboard is the owner's always-open place to see and manage the workbench

The owner's place to see and manage LLM Workbench is one local website, the
**Workbench Dashboard**. It is the projection surface the owner reads
everything from and makes choices on, and it is always open: it does not
close, and opening it does not need a chat. The Grill Board is its first
working form and becomes its Grilling Board section.

The owner, 2026-10-07: "this larger product site should be called "Workbench
Dashboard" [...] right now we need to create the projection surface for me to
see everything and make smart choices from on the LLM_Workbench. I need
something to see and manage the workbench from, and this is the start of that.
the site shouldnt close, and I shouldnt need to start a chat to get it open."

It has five sections. The owner: "The sections would probably be Destination
Tracker, Taskboard, Grilling board, Drafts to approve, Wiki. that would be at
least enough for me to know what was missing."

- **Destination Tracker:** Landmarks and Destination Question Cards.
- **Taskboard:** Specs and Tasks.
- **Grilling Board:** the questions to answer, with their Priority and Value.
- **Drafts to approve:** current text against the proposed wording.
- **Wiki:** the root files, decision records, Wiki pages, glossary and skills.
  Agent-proposed and owner-confirmed: Architecture, Destination and
  Consequential Decision Records live in this section, and every question that
  uses one links to it.

Two tests hold every part of it. The orchestration-tax test, in the owner's
words: "each concept and question being presented to be is going to progress
the project and doesnt add orchestration tax to me. This should be lowering
that tax, not making it harder." The Wiki test: "if I need it summarized on
this dashboard, it should probably be in the wiki."

Why the owner chose it:

- The page answers the owner's request for "a real website inside of
  LLM_workbench that I can go to, that contains all of the context that I need
  to answer all of the grilling. This should be my website version of the wiki
  basically. I should be able to see the current and drafted/proposed version
  of the artifacts we are making so I can approve the actual prose we are
  trying to implement, not just the decisions behind that text."
- Its return is less orchestration by the owner. The owner: "We dont need to
  track this, but I should be spending less tokens by grilling less and asking
  for where things are and to clarify our process less. We should become more
  efficient because this has been maintained and we know what's stale and
  where to take action."

Considered and rejected: a page that runs only while a chat has started it.
The owner set it aside: the site "shouldnt close", and the owner "shouldnt need to
start a chat to get it open."

Future goals, outside current scope:

- Roll the Workbench Dashboard out to every workbench. The owner: "when we are
  done proving this concept works I would love to roll this out to every
  workbench. But that is further out in the future." It is a producer-room
  capability of LLM Workbench until then.
- Run the Workbench from the Dashboard. The owner: "we could run the workbench
  from this. (Future state goal)".

Consequences: the Lexicon defines the Dashboard, its five sections and its
answer words. The [Workbench Dashboard Spec](../../../specs/S-004D-shared-interactive-board/SPEC.md)
carries the sections, answer controls, self-contained package, Drafts to
approve and always-open service as planned requirements and acceptance; none
of it is delivered by this record. Hosting stays local and small: always open
means a local login service on the owner's Mac, not a hosted site. The
Blueprint already promises that the owner sees what is running, changed,
blocked or waiting on a decision; this record names the place, so the
Blueprint does not change.

Provenance: the owner's words in the Workbench Dashboard conversation of
2026-10-07, read back to the owner and confirmed the same day ("All confirmed").
