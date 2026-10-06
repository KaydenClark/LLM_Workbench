---
date: 2026-10-05
supersedes:
canonicalized_in:
  - AGENTS.md
---

# The Runbook lines the workflow verbs up next to their scenarios and binds nothing

Landmark: Durable Plans.

`RUNBOOK.md` stays as a file, playbook-shaped: the workflow verbs in order, each next to the scenario it is used in and the skill that carries it. It does not define the verbs; the Wiki does. Off-path arrivals, such as a room that is not a Workbench yet or a branch that will not merge, are scenario rows too. It is kept small the way the Blueprint and `AGENTS.md` are, with no line limit. It binds nothing.

Why the owner chose it:

- The owner, in his own words (2026-10-05): "It would just be a very simple basically workflow verb step by step. like Idea -> Align -> Confirm. Not defining the verbs, but lining them up next to their senario they are used in?"
- (2026-10-05): "RUNBOOK stays a file, like playbook. but I wouldnt say its a contract file anymore."
- (2026-10-05): "Confirmed, lets keep it small then. No line limit, but same as blueprint and agents. I expect small".

Considered and rejected: no Runbook at all, folding the index into `AGENTS.md`. The owner first asked "if we even really need the runbook" and then kept it as a file. Also rejected: the Runbook as a binding operations index, the shape the carrier rewrite had planned.

Consequences: the Runbook stops being a Contract carrier; the carrier rewrite's acceptance that the Runbook index declares which skill binds moves to `AGENTS.md`. The verbs stay what the workflow decision says ([The workflow is eight verbs and each verb writes the plane its claims live on](../adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)).

Provenance: the owner's answers on the Runbook, 2026-10-05, read back twice and confirmed.
