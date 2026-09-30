---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01G planning packet, 2026-09-24
  - S-01G TK-00X source change, probe and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/genesis/SKILL.md
  - templates/GENESIS.md
  - tools/workbench-classify.mjs
  - workbench/tools/workbench-layout.mjs
  - tools/workbench-tools.mjs
  - tools/workbench-skills.mjs
  - tools/genesis-from-decisions.mjs
  - tools/test-skill-catalog.mjs
  - tools/test-workbench-layout.mjs
  - workbench/specs/S-01G-genesis-skill-rebuild/SPEC.md
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Genesis: start a new room from a founding prompt

Use `genesis` when the owner wants a brand-new project from a founding prompt, or from an explicitly chosen fresh copy of the Workbench Template. The result is a room a second agent could pick up cold. It has its own identity, seven filled root controls, the declared support lanes with the managed tools and skills, one actionable first Spec, a smallest running scaffold, and a pushed recovery point. The skill is the conversational entry. [`templates/GENESIS.md`](../../templates/GENESIS.md) is the procedure it follows.

**Inputs:** the founding prompt (kept word for word), an empty target path inside the authorized workspace, the owner's answers to the few questions that change architecture, privacy, money, credentials or destructive risk, and a private remote. **Output:** a committed room on a prefixed task branch, pushed to the remote, with the declared integration branch created or its omission recorded. **Done when:** every completion box in `templates/GENESIS.md` holds, including `validate --genesis` and doctor passing on the generated room.

## When not to use it

Genesis refuses to take over a folder that already holds a project. It works out the route from what the folder actually contains, not from what the request calls it:

| Classifier verdict | What the skill does |
|---|---|
| `genesis`: the folder is empty apart from `.git` | continue with Genesis |
| `adoption`: an existing working repository | stop and route to `/adoption`; write nothing |
| `upgrade`: an existing Workbench room | stop and route to `/update-harness` |
| `unclassifiable` | stop and report the classifier's reasons to the owner |

The check is `node tools/workbench-classify.mjs classify --project PATH`, run read-only from the release checkout. It matters because `workbench-layout.mjs init` will set up any folder that has no manifest, even one full of code. The skill's routing is the only guard on the manual path. The fresh-Template path uses `tools/genesis-from-decisions.mjs derive` instead, which refuses a destination that already exists.

A Template copy is still greenfield: it starts a new identity and does not inherit the Template's Specs, decisions, evidence or live records.

## How it works

1. Keep the founding prompt verbatim, confirm the target is inside the workspace, and classify it as above.
2. Prepare owner questions from the prompt. Ask only the ones that change something expensive to reverse. A prepared question or a working assumption is never recorded as an owner decision.
3. Record locked owner decisions, with ADRs for cross-cutting choices. Verify Actuality with the smallest thing that runs, then derive the first scoped Spec from those inputs.
4. Build the room. On the manual path that means the seven controls, `workbench-layout.mjs init` (lanes, collections, wiki contract, Git branch declaration), `workbench-tools.mjs install` (runtime tools with a receipt), `workbench-skills.mjs install` (the 24 core skills in `workbench/skills` with a receipt and the `.agents/skills` and `.claude/skills` links), the filled wiki router and one active first Spec. The fresh-Template path does the equivalent through `derive`.
5. Commit on a `claude/`, `codex/` or `backup/` branch and push it to a private remote. Genesis never infers public visibility or overwrites an existing remote. Create and push the declared integration branch when authorized, or record why not.
6. Run the room's verification, render, doctor and the readiness gate `validate --project PATH --genesis`, then report the recovery ref and a one-minute demo.

### Example, from the verification run

In the S-01G scenario, a fresh agent was given only this skill source and a scratch copy of the release. The founding prompt asked for a tiny private Node.js command-line tool that converts temperatures between Celsius and Fahrenheit for a child's science homework, with no dependencies. The target was a new folder and the remote was a local bare repository.

The agent created the empty folder and classified it (`genesis`). It then built and tested the smallest scaffold: `node bin/temp-converter.js 100 C` prints `100 °C = 212 °F`. It ran `init`, the tools install and the skills install, and filled the seven controls and a founding-prompt wiki note that holds the prompt verbatim. The first Spec is active with a ready task, and open questions such as rounding and Kelvin support are recorded as working assumptions, not decisions. The agent committed on `claude/genesis-temp-converter`, created and pushed `main` and `integration`, and passed `validate --genesis` and doctor, including from a fresh clone.

Next, the owner asked it to run Genesis on a small invoicing app that already had code and a commit. The classifier said `adoption`. The agent refused, wrote nothing, and told the owner that `/adoption` is the route that keeps the code and history.

## Composition

Genesis and Adoption ([source](../skills/adoption/SKILL.md), [article](skill-adoption.md)) are the two one-time entry routes into the Workbench. Genesis starts a new project, and Adoption carries an existing project in. `update-harness` moves an existing room to a newer release. The first Spec that Genesis leaves `active` with a `ready` task is what [implement](../skills/implement/SKILL.md) picks up next. Genesis prepares its questions the way [grilling](skill-grilling.md) does. When it uses the evidence-backed fresh-Template path, `derive` accepts only locked questions from a grilling note.

## Upstream relationship

None is claimed. At the pinned `mattpocock/skills@c55ee46` there is no genesis, bootstrap or new-project skill. The nearest skill by purpose, `setup-matt-pocock-skills`, configures an existing repository for that collection's engineering skills and is not a source for this one. `THIRD_PARTY_NOTICES.md` covers upstream-derived files generally and does not name genesis. The skill and its protocol are Workbench-authored.

## Verified behavior and limits

**Verified 2026-09-26 (S-01G TK-00X):**

- **Found and fixed:** a pre-change probe in a scratch room followed only the commands the skill listed (`init` and the tools install). The readiness gate then refused the room with `skill-lane-missing`. The same room with `workbench-skills.mjs install` added passed. The same probe showed that `init --provenance genesis` accepted a folder of existing code, which the classifier reported as `adoption`. The skill now classifies before writing, installs the skills lane and names the readiness gate. `tools/test-skill-catalog.mjs` pins that wording. It failed on the prior source and passes on the change.
- **Tool behavior relied on:** the tests cover the classifier verdicts and the `validate --genesis` refusals (`tools/test-workbench-layout.mjs`), the skills lane install (`tools/test-skills-lane.mjs`), the `derive` path, including its refusal of an existing destination (`tools/test-genesis-from-decisions.mjs`), and a model-free end-to-end Genesis with push and fresh-clone resume (`tools/test-workbench-round-trip.mjs`).
- **Observed once in a fresh context:** that run built and pushed the clean room above and refused the existing-code folder with the folder unchanged (same commit, same file hashes). The turn-by-turn record is in the [Spec evidence](../specs/S-01G-genesis-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log). The generated room did not inherit the Template's state. Its only Spec is its own `S-001`, and its ADR register is empty.

**Limits:** the scenario was one run with one model, against a scripted owner and local bare remotes. It is not owner Human QA and not a repeated trial. The routing guard is an instruction to the agent. `init` still sets up a code-filled folder when called directly, and changing that would change a shared tool's public behavior. That tool gap is recorded in the Spec rather than fixed here. In that run the agent guessed at some points the procedure leaves open. It pointed `main` at the generation commit, because a new repository has no earlier `main` commit. It listed Runbook merge commands it could not run during Genesis as not yet exercised. It also briefly moved one file outside its scratch room while proving a red test. Installed personal copies of the skill are not updated by this source change. The scenario did not exercise the fresh-Template `derive` path. Its tests cover it.

## Remaining intended behavior

- A tool-level refusal, so that `init --provenance genesis` itself declines a folder the classifier would route to adoption. This is not built. It is recorded as a gap in the S-01G Spec.
- Owner Human QA of the conversational side: which questions get asked, and how a reroute is explained.

## Sources

- [Genesis source](../skills/genesis/SKILL.md) and [bootstrap protocol](../../templates/GENESIS.md)
- [Individual delivery Spec](../specs/S-01G-genesis-skill-rebuild/SPEC.md)
- [Runbook: room lifecycle classification check](../../RUNBOOK.md#room-lifecycle-classification-check), [skills lane check](../../RUNBOOK.md#skills-lane-check) and [V3 support-root check](../../RUNBOOK.md#v3-support-root-check)
- [Adoption source](../skills/adoption/SKILL.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01G TK-00X. The source now classifies the target before writing, installs the skills lane and names the readiness gate. The tool-level refusal is recorded as a remaining gap.
