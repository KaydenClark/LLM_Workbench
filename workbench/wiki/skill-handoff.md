---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01A TK-00R source change and fresh-context scenario, 2026-09-26
  - Pinned upstream mattpocock/skills c55ee46073ed923f86ce59a5eb3b6d895095d1b7, retrieved 2026-09-26
source_paths:
  - workbench/skills/handoff/SKILL.md
  - workbench/skills/handoff/assets/HANDOFF.md
  - templates/HANDOFF.md
  - workbench/skills/README.md
  - workbench/tools/notepads.mjs
  - tools/test-skill-catalog.mjs
  - tools/test-core-composition.mjs
  - tools/test-notepads.mjs
  - workbench/specs/S-01A-handoff-skill-rebuild/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - THIRD_PARTY_NOTICES.md
last_verified: 2026-09-26
---

# Handoff: pass one objective to a named recipient

Use `handoff` when the owner asks for work to continue somewhere else: another agent, a new chat, a later session. The skill writes one readable Markdown file. The recipient can take up the job from that file without the owner having to explain it again, and without the job growing on the way. Writing a handoff authorizes writing it and nothing more. It does not send the file, run the work, promote anything or create a task.

**Inputs:** the current assignment, the owner's request (which usually names who receives the work and where they stop), and any working notepad for the objective. **Output:** one `.md` file in the manifest-declared `handoffs` collection (`workbench/sessions/handoffs/`, untracked). Its sections follow the bundled [shape](../skills/handoff/assets/HANDOFF.md). Any source notepad also gets an `active_handoffs` entry. **Done when:** a reader who has only the file can state the job, the endpoint and exclusions, the relevant decisions with their corrections, the evidence limits and the one next action. Every path it cites must also be openable by that reader. A file that merely exists does not count.

## How it works

1. **Endpoint first.** The [source](../skills/handoff/SKILL.md) states the exact job and stop point in plain language and carries every exclusion through each helper. For "write the specification; do not implement", the recipient writes that specification and nothing else. Naming `make-it-so`, `carry` or any other skill does not widen it.
2. **Reconcile before writing.** Settled decisions and corrections are checked against their current owners. Stable IDs, tentative or open status, uncertainty about sources, and the gap between intended behavior and verified results all carry over.
3. **Every obligation goes under one of the shape's headings.** The shape has eight headings and the source lists more obligations than that, so the source says which heading carries each one. The named destination goes under `The job`. The endpoint, exclusions and inherited authorization go under `Authorized endpoint`. Achieved state with sources, remaining verification, and each correction written beside the claim it corrects go under `Verified state`. Exactly one next action goes under `Resume point`. Blockers and open questions go under `Open work`. Access limits go under `Boundaries`. Pinned sources go under `Sources to load`, and the read-back result under `Recipient check`.
4. **Only point at what the recipient can open.** If the recipient's access is absent or unknown, the safe content it needs is copied into the handoff and the limit is named. A live notepad is untracked and exists only in its own checkout. It is cited only for a recipient working in that same checkout; anyone else gets the content itself. Secrets and raw private data are never copied.
5. **Keep a source note until the handoff no longer depends on it.** When the handoff draws on a notepad, the author validates the note and reads its current view back. Then the author records the handoff path in the note's `active_handoffs` view field. [Notepad](skill-notepad.md) cleanup refuses while that list is nonempty.
6. **Read it as the recipient would.** The author checks every reference and scope statement. A fresh-context read-back may only ask for interpretation, never execution. The author reports whether one was performed.

### Example, from the verification run

In the S-01A scenario, an agent given only the skill source, a scratch clone and a local design note was asked to hand off a specification-only job. The job was a Spec for a read-only status-count command, to be picked up in a separate clone that "won't see anything that isn't committed". The note held two decisions, an earlier scope reading with a linked correction, and one open question. The agent wrote a 166-line handoff. It copied the note's content in, because the recipient could not open the note, and wrote the correction as the earlier meaning next to the corrected meaning that now holds. It pinned the commit it had checked and left the open question unanswered. Under `Authorized endpoint` it quoted the owner's words ("the Spec ... and nothing else"). It recorded the handoff in the note's `active_handoffs`, and said that no separate read-back had been done. It committed nothing and sent nothing. Because the handoffs folder is untracked, it told the owner the file had to be delivered by hand.

A second agent, in a different clone that held no note, was told only "Here's the handoff from the previous agent. Please continue." It wrote one planned Spec. It excluded superseded Specs, as the correction required, and kept the earlier reading only as marked history. The open question stayed an open owner choice, and the only Task was blocked on it. It ran `render` and `doctor`, then stopped. It wrote no code, no tests and no claim. It opened every path the handoff cited and found each one matched, with one exception: a search claim the author had made was incomplete. The recipient found a second, unrelated match and recorded both.

## Upstream relationship

The skill descends from Matt Pocock's MIT-licensed `handoff` ([notice](../../THIRD_PARTY_NOTICES.md)). It was compared against the pinned source [`mattpocock/skills@c55ee46`](https://github.com/mattpocock/skills/blob/c55ee46073ed923f86ce59a5eb3b6d895095d1b7/skills/productivity/handoff/SKILL.md), which was still upstream `main` when retrieved on 2026-09-26. That file matches the one imported into this repository on 2026-07-16 in every instruction; only the wording of the suggested-skills sentence changed.

- **Kept:** a document a fresh agent can continue from. References to specs, commits and other artifacts are cited by path instead of copied. Sensitive material is redacted.
- **Adapted, deliberately:** upstream writes to the OS temporary directory. The Workbench writes to the declared, untracked `handoffs` collection, so the file sits beside the room it describes and a source note can declare that it depends on the file. Upstream treats the user's argument as the next session's focus. The Workbench needs a named recipient, an exact endpoint and one next action, and it keeps corrections beside the claims they change. Upstream's "reference, don't duplicate" is narrowed to "reference what the recipient can open, and copy in what it cannot". In practice a handoff is longer and stands on its own, and a cited path works when the recipient opens it.
- **Not adopted:** upstream's required "suggested skills" section. Here, naming a skill cannot widen the endpoint. In the scenario the author still listed the one skill it allowed, inside the endpoint section. Upstream is owner-invoked only (`disable-model-invocation: true`); the local source can be invoked by the model when the user asks for a handoff.
- **Uncertainty:** this comparison covers only `SKILL.md` at the pin. A later upstream revision may differ, so repeat the comparison before claiming fidelity to a newer upstream.

## Verified behavior and limits

**Verified 2026-09-26:** `tools/test-skill-catalog.mjs` requires that every obligation-to-heading line in the source names a heading the bundled shape actually has, and that every heading is covered. It also pins the named-destination, correction, access-limit, one-next-action, untracked-note and authorship-only wording. That test failed before the source change and passes after it. `tools/test-core-composition.mjs` requires that the installed shape is byte-equal to `templates/HANDOFF.md`. `tools/test-notepads.mjs` covers the `active_handoffs` refusal to clean up. The two-agent scenario above is recorded turn by turn in the [Spec evidence](../specs/S-01A-handoff-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** it was one run with one model and a scripted owner. It is not owner Human QA and not a repeated trial. The pinned commit existed only on an unpushed local branch, so the recipient's check that the commit was present succeeded only because both clones shared that history. The recipient's full suite could not pass in a clone with no remote, which is a limit of the scenario setup, not of the handoff. The shape itself still has no dedicated heading for corrections or access limits. The source maps them onto existing headings, because the shape has to stay byte-equal to `templates/HANDOFF.md`, and that owner is outside this skill's lane. The legacy JSON handoff example in `templates/sessions/notepads/templates/` and the notepad runtime's refusal message that points at `templates/HANDOFF.md` (a file a room may not have) are outside this skill's lane and unchanged. Installed personal copies of the skill are not updated by this source change.

## Sources

- [Handoff source](../skills/handoff/SKILL.md) and [bundled shape](../skills/handoff/assets/HANDOFF.md)
- [Individual delivery Spec](../specs/S-01A-handoff-skill-rebuild/SPEC.md)
- [Core catalog](../skills/README.md)
- [Session records contract](../../AGENTS.md#session-records-and-checkpoints) and [Runbook notepad and handoff procedure](../../RUNBOOK.md)
- [Notepad article](skill-notepad.md) and [runtime](../tools/notepads.mjs)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01A TK-00R. The source maps its obligations onto the bundled shape, and one two-agent fresh-context scenario is recorded.
