---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The owner's adopted AI Coding Dictionary term, 2026-10-03
  - The owner's answers of 2026-10-05 on review timing, the Journey verbs and provider spend (grilling note review-timing-and-codex-spend-2026-10-05)
source_paths:
  - LEXICON.md
  - AGENTS.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-05
---

# Automated review: the Review verb, after the Journey

An automated review is an agent forming a judgement on work it did not do. It
is a judgement, so it can catch what a check cannot and miss what a check would
not. The owner adopted the term from the AI Coding Dictionary on 2026-10-03:
"We have been using the separate context review for this, we can use this
term." Separate-context review is the Workbench's earlier name for it.

**What it means here.** Review is the workflow verb, and an automated review is
how it is done. The delivery workflow reads Idea, Align, Confirm, Map, Plan,
Journey, Review, Verify, Approve, Delivered, Clean Up. The Journey is the
build run for each Task: Implement, Check, QA and Submit. Check is
deterministic and runs in the environment; QA is the building agent's own
judgement of its work; Submit is the merge request that carries the Task's
merge answers. Review comes after the Journey is over. In the owner's words,
"It is the deciding factor in if we need to start another Journey": when it
fails, the work goes back to Map, Plan and Journey before it can be verified.

**What it reviews.** A Spec, once its last Task has landed. Sometimes a
landmark, and sometimes the Workbench as a whole, to test its decision records
and Blueprint. Never a single Task: "Tasks do not need to be reviewed until we
are reviewing the whole spec. Because while reviewing the whole spec, we will
find tasks that were not done." A Task is judged by its Check, its QA and the
merge answers it submits, which the Spec's Dispatcher, Director or next agent
validates before merging.

**Who reviews, and on whose account.** A fresh context, meaning a new chat or
subagent that did not build the work and starts from the diff, its Spec and
the controls. It runs on the host the owner opened the session with: a Claude
session reviews with Claude and a Codex session with Codex. Another provider
is used only when the owner says exactly what to do with it in that request.
The Director gives the approval; agents that built Tasks in the candidate, and
the Dispatcher, cannot. Which model reviews is the Director's choice, not a
rule.

**How often.** Once per assembled candidate. There is no set number of
rounds: a failed Review produces the next Map, Plan and Journey, and the new
assembled candidate is reviewed once. A rebase that leaves the content
unchanged needs no fresh review, only its Check rerun.

**Why it changed.** Until 2026-10-05 the bootstrap route reviewed every Task
pull request into integration, and again after every rebase. Agents met that
by running another provider's command line on the owner's account. Those
reviews used up his Codex allowance and, in his words, "did absolutely no
work".

**Neighbouring words.** An automated check (Check) is deterministic and has no
judgement. Human review is a person reading the change itself. Human QA is the
owner's evaluation of delivered work, ending in Approve. QA, the workflow verb,
is the building agent judging its own work, so it is never an automated
review.

## Sources

- [Lexicon](../../LEXICON.md): the Review, QA, Submit, Journey and Automated
  review rows.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/automated-review):
  attribution only; the Workbench restates the meaning in its own words.
- [AGENTS.md, Task Merge Answers And Verify Review](../../AGENTS.md#task-merge-answers-and-verify-review):
  the operative rule for Tasks, Review placement and providers.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md):
  amended 2026-10-05 for the Journey change.
