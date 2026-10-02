---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
---

# Contract carriers are briefs that point to skills and authority flows through the pointer

## Decision

The Contract carriers follow progressive disclosure. The owner confirmed these
points in a grilling on 2026-10-02:

1. **What AGENTS.md is.** The Workbench uses the definition in the
   [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary/agents-md):
   AGENTS.md is the file the harness loads into the context window at session
   start, the project's standing brief to the agent. It holds short,
   declarative lines that apply in every session and that the agent cannot
   derive from the code: commands, conventions the code does not make obvious,
   and hard constraints. It is a brief, not documentation, because everything in
   it is loaded on every turn and a long file both costs tokens and dilutes
   itself.
2. **Each carrier's job.** The owner restated the jobs from the ownership
   schema, with a placement test. AGENTS answers "What must I obey?": the
   agent's operating rules, authority, permissions, boundaries, required
   behavior and the conditions for accepting work. RUNBOOK answers "How do I do
   it?": how to perform an operation, with its prerequisites, commands, expected
   results and recovery. LEXICON answers "What does that mean, and where do I
   look?": what terms mean, how concepts differ and where each kind of
   information belongs. For example, AGENTS says independent review is required
   before integration, RUNBOOK gives the commands that prepare, record and check
   it, and LEXICON says what counts as independent review and links to both.
3. **RUNBOOK follows the same principles.** RUNBOOK, like AGENTS, follows the
   dictionary's
   [progressive disclosure](https://www.aihero.dev/ai-coding-dictionary/progressive-disclosure),
   [context pointer](https://www.aihero.dev/ai-coding-dictionary/context-pointer)
   and [skill](https://www.aihero.dev/ai-coding-dictionary/skill) definitions:
   a small layer, a sentence per topic with a context pointer to where the
   detail lives. A pointer gives a stable path and enough description for the
   agent to know when following it is worth it, written to match how tasks
   present. RUNBOOK becomes an index of operations whose procedures live in
   skills.
4. **Authority flows through the pointer.** A skill in the room's tracked skills
   lane that a Contract carrier points to for an operation is part of the
   Contract for that operation, and its binding requirements carry Contract
   force while that operation is performed. Only the lane copy binds; where an
   installed host copy differs, the lane copy wins. A skill that no carrier
   points to, including a room-added skill, teaches but does not instruct. A
   rule that applies in every session stays a line in AGENTS. Because a skill
   edit can now change binding behavior, skill changes get the same review care
   as Contract changes; the lane's receipt hashes and the integration review
   already cover them.
5. **The rewrite is its own work.** Rewriting AGENTS and RUNBOOK to these
   definitions is its own work with its own Destination Packet. No line is
   removed before its new home exists.

Considered and rejected: keeping long procedures inside RUNBOOK sections so
operation-only rules stay binding (it keeps the cost the owner wants gone);
giving instruction authority to any skill a Destination Packet assigns (the
authority would come from a link a work record carries rather than from the
Contract); and leaving AGENTS as the full rulebook (at 618 lines, about 9,000
tokens loaded on every turn, it fails the brief definition).

## Consequences

This extends [ADR-000C](000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md):
the Contract is still the claim set carried by AGENTS, RUNBOOK and LEXICON with
the assigned Spec as a bounded delegate, and a skill a carrier points to for an
operation now carries part of that claim set for that operation. It refines
[ADR-0045](0045-skill-composition-within-inherited-scope.md), whose skills
teach within inherited scope, for pointed lane skills only. The Instruction
Authority list in AGENTS changes when the rewrite delivers it; until then the
current AGENTS text governs and this accepted decision is an implementation gap
recorded here. Landmarks join the assigned Spec as bounded delegates through
[ADR-000U](000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)
when that work delivers them.

The root Lexicon states the accepted definitions. This record performs no
delivery: the AGENTS and RUNBOOK rewrite, moving each removed line to its owner,
a check that every removed line landed, the template mirrors and the change to
the Instruction Authority list belong to that work, which is not yet specified.

Provenance: owner-confirmed grilling of 2026-10-02 under the objective
"ddr-and-control-surface". The dictionary definitions were supplied by the
owner from the AI Coding Dictionary at aihero.dev.
