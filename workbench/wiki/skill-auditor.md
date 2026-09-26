---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01Q TK-01H source change and fresh-context scenario, 2026-09-26
  - Workbench-native stance skill since bfae8c0d731d1a799a487b0848f2e39af25c68d5 (v3.1.1), no third-party upstream
source_paths:
  - workbench/skills/auditor/SKILL.md
  - workbench/specs/S-01Q-auditor-skill-rebuild/SPEC.md
  - tools/test-skill-catalog.mjs
  - tools/test-delivery-skills.mjs
  - LEXICON.md
  - workbench/docs/adr/0036-stances-change-method-not-authority.md
  - team templates/SUBAGENT.md
  - team templates/MANAGER.md
last_verified: 2026-09-26
---

# Auditor: check named claims against pinned evidence

Use the `auditor` stance when a Spec or Task asks whether specific claims hold. Typical claims: "this acceptance box is really met", "the release notes match the code", or "this finding in a review is true". The auditor reads, runs permitted checks and reports. It does not repair what it finds, and a finding does not authorize a repair.

**Inputs:** the assigned target (a repository or a named part of one), a pinned revision, and the named claims. **Output:** a bounded verdict with one finding per claim. Each finding is marked **supported**, **unsupported** or **uncertain**, and cites its source path at the pinned revision, the check it ran and that check's limit. Anything outside the target that looked relevant follows the findings as a lead marked not examined. **Done when:** every named claim has exactly one classified finding that a reader can trace to its evidence without asking the auditor. The target is also unchanged.

## How it works

The [skill](../skills/auditor/SKILL.md) is one of the four portable stances (Builder, Auditor, Reviewer, Reconciler). The assigned Spec and Task set the stance. Loading it changes the method only; it grants, removes or transfers no authority, as [ADR-0036](../docs/adr/0036-stances-change-method-not-authority.md) records.

- **Pin first.** The auditor fixes the revision and scope before reading. It keeps what it observed apart from what it inferred, and looks for counterevidence rather than confirmation.
- **Three results, not two.** *Supported* and *unsupported* need evidence on the page. *Uncertain* means the available evidence cannot decide the claim, and the finding then names what would decide it (for example production timing records). This keeps "I could not check" from being reported as either a pass or a fail.
- **Every finding carries its own proof.** Evidence, check and limit sit on each finding, not only on the verdict as a whole. A reader can then accept one finding and dispute another.
- **No widening.** The auditor stays inside the assigned target and project. It does not read another project to settle a claim, even when a file in the target points there. It reports the pointer as a lead marked not examined. `AGENTS.md` Read Scope shows why this matters: some neighbouring projects must not be read without a separate owner request.
- **Read-only.** The target stays unchanged. For a fixed diff the auditor composes [`code-review`](../skills/code-review/SKILL.md). It publishes no release status.

### Example, from the verification run

In the S-01Q scenario, a fresh agent audited three claims about a small fixture repository at a pinned commit. The first claim was that a retry helper tries a failing call at most 5 times. It read the helper and its config at the pin, then ran a probe in a copy of the tree. The call ran exactly 5 times before the error was rethrown, so it marked the claim **supported**. The second claim was that the CLI rejects negative amounts. The code has no sign check, and a probe accepted `-5`, so that claim was **unsupported**. The third claim was that the nightly export finishes in under 10 minutes against production. It marked that **uncertain**: the repository holds no timing data, and it had no production access. It said scheduler timing records or an authorized timed run would decide it. The fixture README pointed to a benchmark in a neighbouring project. The agent did not open it and listed it as a lead not examined. The target repository stayed clean at the same commit.

## Not the historical team "Auditor" role

The optional [team templates](../../team%20templates/SUBAGENT.md) (also [MANAGER.md](../../team%20templates/MANAGER.md)) use "Auditor" as the name of a read-only delegated team role. That vocabulary comes from S-020's bounded-team model, which its [design concept](design-concepts/spec-S-020-spec-native-team-coordination.md) calls historical. The team role is a delegation contract: an agent that joins a team as "Auditor" edits nothing. The stance described here is how one agent performs an assigned task. The two agree on read-only work, but the stance is not a team seat, and loading it spawns no agent. It also grants no role in a coordinator's lane plan.

## Composition

- Composes [`code-review`](../skills/code-review/SKILL.md) when the claim is about a fixed diff.
- Differs from the Reviewer stance, which challenges a candidate's correctness and evidence and runs in a separate context at integration. An audit may feed a review, but it does not replace the separate-context integration review.
- A finding is evidence for the owner. Under `AGENTS.md`, a finding does not itself authorize new work, so any repair needs its own authorization rather than continuing from the audit.

## Upstream relationship

The auditor is Workbench-native. It entered with the portable stance workflow at [`bfae8c0`](https://github.com/KaydenClark/LLM_Workbench/commit/bfae8c0d731d1a799a487b0848f2e39af25c68d5) (v3.1.1) and has no third-party upstream in [THIRD_PARTY_NOTICES](../../THIRD_PARTY_NOTICES.md), so there is no upstream fidelity to compare. The [LEXICON](../../LEXICON.md#stance-terms) definition ("checks claims against named evidence and reports a bounded verdict") still agrees; "bounded verdict" remains the wrapper for the classified findings.

## Verified behavior and limits

**Verified 2026-09-26:** the source at S-01Q's green commit `d4f1dfc` states the three result classes, the per-finding evidence, check and limit, and the no-widening boundary. `tools/test-skill-catalog.mjs` holds that wording, and `tools/test-delivery-skills.mjs` holds the shared stance sections and authority sentences. One fresh-context agent, given only the skill text, produced the report in the example above. Its evidence is in the [Spec evidence](../specs/S-01Q-auditor-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** that was one run with one model, against a scripted owner. It is not owner Human QA and not a repeated trial. The sibling project stayed unread by file access-time evidence as well as the agent's own account. The agent wrote its probe into a scratch copy outside the target; the skill forbids changing the target but does not say where probes may run. No tool parses the auditor's report, so the report shape is a wording contract, not a machine format. Installed personal copies of the skill are not updated by this source change.

## Sources

- [Auditor source](../skills/auditor/SKILL.md)
- [Individual delivery Spec](../specs/S-01Q-auditor-skill-rebuild/SPEC.md)
- [Stance terms in LEXICON](../../LEXICON.md#stance-terms)
- [ADR-0036: stances change method, not authority](../docs/adr/0036-stances-change-method-not-authority.md)
- [Runbook behavior selection](../../RUNBOOK.md#behavior-selection)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01Q TK-01H with the three result classes, per-finding traceability and the no-widening boundary delivered in the source, and one fresh-context scenario recorded.
