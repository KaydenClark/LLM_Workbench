# LLM Workbench - Blueprint

Its canonical project vocabulary belongs in a concise root `GLOSSARY.md`, with richer explanations and examples in the Wiki.

## What it is

LLM Workbench is an agentic management system: the workbench Claude Code and Codex use to align the owner's ideas and implement the owner's design concepts. Agents map and plan each confirmed concept and carry it through the Journey, and the owner approves the result or sends it back until the concept is realized.

A harness runs one agent in one session; it does not know what the owner wants built, what has already been decided, what another agent is doing or what is left. The workbench manages exactly that, so the owner does not have to.

In LLM Workbench's own room, the project is the next workbench, built with the current one. Every workbench is built to run as one room among many in an autonomous factory, the Foundry, and the Foundry needs the workbench proven first.

## Who it serves

### The owner

The owner brings ideas and aligns on them with the agents, usually by grilling, until the design concept is shared, then confirms it. After that the owner is needed only to unblock, and to judge each finished landmark and the concept in Human QA: approve it or send it back. The owner gets a checked result without managing agents, sees what is running, changed, blocked or waiting on a decision, never explains the project twice, and can step in at any time.

### The agents

The agents, in Claude Code and Codex, on any of the owner's devices or in the cloud, carry a confirmed concept the rest of the way: they map and plan it, implement it, check their own work, have it reviewed by an agent that did not build it before it merges, verify it once it lands, then see it delivered and clean up. They get a workbench that hands each session only the context its work needs, tells them what is decided and who owns each part, and carries their progress to the next agent.

## Promised outcomes

- The Owner can evaluate Grill Board questions by separate Priority and Value classifications, inspect their reasons when needed, and filter them into an answering queue of the Owner's choosing.
- Review climbs a ladder: a Task is proven by automation, a Spec is reviewed by an agent that did not build it, a landmark passes integrated automated review, and the owner judges the concept. Work reaches the owner's Human QA at the landmark, after every automated check and review has passed it.
- An agent pays context only for information that can change what it does next; everything else is reached by a pointer when the work needs it.
- Many agents work one project at once, on any of the owner's devices or in the cloud, and combine their checked results.
- Work is mapped and planned so every session stays in the smart zone and spends its tokens efficiently.
- Everything a session needs lives in the project's GitHub repository; through progressive disclosure, a fresh session loads only what its work needs.
- Every kind of truth has one maintained home, so an agent knows where to read it and where a change is written, and nothing is kept twice.
- Claims of done say what actually happened; gaps are flagged, never faked.
- Every room declares how an agent runs, operates, inspects and measures its product, so a claim of done can show the running product and not only the repository.
- What the work teaches lives on in the Wiki and decision records; the scaffolding is cleared away.
- The skills agents need ship inside every room, where the workbench regulates and monitors them; a room adds the skills, scaffolding and procedures its work needs without tearing apart what is proven to work.
- Setup drafts the workbench from one line or an existing project, and grilling confirms it; updates never cost a project its knowledge, unfinished work or deliberate choices.
- Every release is proven by a project made from the Workbench Template taking a confirmed concept to the owner's approval in one pass.

## Non-goals

- Not a harness.
- Not a source of permission, and not proof that an agent always follows instructions.
- Not a general-purpose project-management application or personal task manager.
- Not a transcript or proof archive.
