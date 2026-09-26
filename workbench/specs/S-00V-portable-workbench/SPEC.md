# S-00V - Portable Workbench

> Captured from the owner-approved 2026-09-22 grilling session
> (portable-workbench-cloud-deployable). This spec lives at its stable
> manifest-declared path.

**Spec ID:** S-00V
**Status:** active
**Priority:** 1
**Owner:** claude-lane-F
**Stance:** Builder
**Updated:** 2026-09-26
**Catalog description:** Make every Workbench room a fully packaged, deployable agent harness: a fresh agent, or ten at once in the cloud, clones the Git remote alone, finds its skills there, claims work visibly, does it, pushes it, and cleans up after itself.
**Blockers:** none
**Latest event:** TK-00G claimed by claude-lane-F.
**Next gate:** Close TK-00G with verification and documentation proof.

> **Citation anchors.** pre=`8dbd619da7e920edb5e819802aff9119f8cb1662` post=`39eaa4881b88a2fe7a4a4fe63c111dd6c34966f7`.

## Outcome

A **Portable Workbench** as the Lexicon now defines it: a fully packaged,
deployable agent harness. Everything an agent needs is in the project's Git
repository, so any agent on any machine, or several at once in the cloud, can
clone it, do the authorized work, push it, and clean up after itself. The
owner is no longer tied to the machines that hold a personal skills catalog,
local notes, or host memory; ten cloud instances can start from GitHub and
work the same Taskboard without taking each other's Tasks.

## Why It Matters

Today the harness is portable in name only. A clone discovers no skills, a
cloud instance's working notes die with it, two instances cannot see each
other's claims, and part of the project's operating knowledge lives only in
the owner's home directory. The owner's stated need is to spin up cloud
sessions from the repository alone and have each one able to finish a Task.
The success criterion, in the owner's words: a fresh agent finding the right
answer, completing authorized work, maintaining its proper owners, cleaning
up after itself, and continuing without the owner reconstructing the project.

## Current Verified State

Verified 2026-09-22 at the pre anchor.

- **Skills.** No `.claude/` is tracked, `.agents/` does not exist, and `skills/` (21 core skills) is producer source rather than a
  manifest discovery root; `workbench/manifest.json` declares discovery at
  `.agents/skills` and `.claude/skills` and `normalSetup: presence-only`.
  ADR-0046 keeps the installed core in the provider home as ignored managed
  state, so a clone never carries it. The owner's working catalog is a
  separate Git checkout (KaydenClark/skills) that the root controls do not
  name except for `research`.
- **Continuity.** `workbench/sessions/.gitignore` ignores `notepads/*`
  and `handoffs/*`; AGENTS.md says live notes and handoffs stay untracked in
  project Git; the Lexicon Packet row calls them local and untracked;
  ADR-0051 makes private transport optional and rejects a required cloud
  service.
- **Coordination.** `claimWork` in `workbench/tools/spec-workbench.mjs`
  rewrites the Spec header and Task record on the local branch and pushes
  nothing; `next` reads only the local tree. `occupiedIdentities` in the
  same file already scans every `refs/remotes` tip when allocating IDs,
  which is the pattern a shared claim surface needs.
- **Host floor.** RUNBOOK's Prerequisites names Node 18+, Python 3.9+, git,
  `gh` and GitHub with nothing to install; no tool checks that floor. `doctor --home`
  inspects only the global core skills.
- **Owner-only truth.** The Claude auto-memory directory for this project
  holds 17 files a cloud agent never sees.
- **Already present.** `tools/test-workbench-round-trip.mjs` and
  `tools/cross-provider-resume.mjs` resume from a fresh clone with a
  scrubbed environment using only repository state, but the fixture installs
  candidate skills into an isolated provider home outside the clone.
- **Vocabulary.** LEXICON.md Core Terms carry Portable Workbench, Host
  portability and Ownership origin model, with Portable layout and
  Portability model retired, promoted from the grilling record at the pre
  anchor. templates/LEXICON.md mirrors the generic rows.

## Desired Behavior

1. **Skills ship in the room.** Every room carries the core skills it needs
   at `workbench/skills`, a seventh manifest lane owned and versioned by
   LLM Workbench and replaced by the ordinary Workbench update. Tracked
   adapters from the declared discovery roots (`.claude/skills`,
   `.agents/skills`) point into the lane so Claude Code and Codex discover
   them from a clone. This producer repository moves its source from root
   `skills/` into the lane and `templates/` ships the lane so Genesis lays
   it down and update-harness refreshes it. A root `skills/` becomes a
   doctor finding.
2. **Needed skills live in the lane; the personal catalog is backup and
   publication target.** The Contract may name only skills that ship in the
   lane. KaydenClark/skills stays as a backup of every skill and the place a
   room may publish skills it creates, through a separately authorized
   operation; it is never on a room's critical path.
3. **Promote before end; notes may travel.** For almost every session the
   goal is to promote settled claims into their durable owners, append the
   Task receipt as the run proceeds, push the branch, and let the instance's
   notepad die. A session that ends without promoting has not cleaned up.
   Notepads and handoffs are structured records and may be committed
   temporarily when continuation needs it, then promoted and removed;
   committing one is transport, never promotion or evidence, and privacy
   rules still apply. ADR-0051 private transport stays optional.
4. **Claims are visible across instances.** `claim` creates the task branch
   from the integration branch, commits the claim as that branch's first
   commit, and pushes it. `next` and `claim` fetch every ref from origin,
   read the integration branch as the base and overlay Task state from every
   remote tip; a Task in-progress on any tip is taken. The PR into
   integration carries the claim's closure with the work, so integration
   stays review-only. A session with no remote falls back to today's local
   behavior and says so. The Taskboard rendered from integration shows
   in-flight remote claims.
5. **The host floor is checked; missing capabilities block visibly.** A
   tracked check reports the floor (Node 18+, Python 3.9+, git, `gh`
   authenticated with push rights to the room's remote, network to GitHub)
   at session start; a missing floor item is an `all` finding. Anything
   beyond the floor is an optional capability a Task names in its Packet; a
   session lacking it sets the Task to blocked, or needs-review when the
   work is otherwise done, naming the missing capability so the owner's
   sitrep surfaces it. Nothing is faked or skipped silently.
6. **Owner-machine truth moves to the Wiki.** Project knowledge that lives
   only in host memory or the personal catalog is promoted into the room's
   Wiki; host memory stays a per-machine convenience the Workbench never
   depends on.
7. **Proof is a run that ends clean.** The round-trip test starts with
   nothing outside the clone, claims by pushing, and ends with every settled
   claim promoted, the receipt appended, the branch pushed and no needed
   state left only on the instance. A real cloud session that lands a Task
   from GitHub, and a two-instance run in which the second skips the first's
   claim, are the milestone demos.

## Decisions And Contracts

All locked by the owner on 2026-09-22 in the grilling record and promoted or
carried here; the record is working context, not evidence.

- Definition and renames: LEXICON.md Core Terms (Portable Workbench, Host
  portability, Ownership origin model; Portable layout and Portability model
  retired).
- FND-Q24B stays live under [S-00G](../S-00G-ownership-map-root-control/SPEC.md)
  as an ownership-origin question, independent of this Spec.
- `workbench/skills` is the seventh lane. This supersedes the six-lane
  count in [ADR-0017](../../docs/adr/archive/0017-workbench-support-directory-has-six-lanes.md)
  and turns the "per-room core copies" alternative that
  [ADR-0046](../../docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md)
  rejected into the decision, on the managed model of
  [ADR-0031](../../docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md):
  tracked, marked with source release, commit and hash, replaced only by
  update. TK-001 authors that ADR; the owner accepts it before TK-001 lands.
- Notes and handoffs may be committed temporarily. This narrows
  [ADR-0051](../../docs/adr/0051-optional-private-git-transport-for-session-continuity.md)'s
  "live records stay ignored" and the local-only boundary it cites; the
  Task that lifts the ignore rule records that narrowing in an ADR.
- Claim-on-branch with fetch-all is hard to reverse and a real trade-off
  against direct integration commits; the Task that builds it records the
  decision in an ADR.
- The manifest `skillPolicy` shape (required list, discovery roots,
  presence-only setup, explicit-only updates) is reshaped by TK-001; whether
  the seventh lane needs manifest schema 3 with a migration is TK-001's
  technical call, made under ADR-0032's migration rules.

## Non-Goals

- Answering FND-Q24B or building `OWNERSHIP.json`; that is S-00G.
- Making ADR-0051 private session transport a cloud prerequisite.
- Publishing room-local skills into KaydenClark/skills; that stays a separate
  authorized operation.
- Committing notes or handoffs as durable evidence, or relaxing privacy rules
  on them.
- Any host-specific setup beyond the floor: simulators, screen history, MCP
  servers, Foundry, or access to the Workbench_Template repository become
  optional capabilities, not session requirements. AGENTS.md's Template
  Upgrade Release Gate is untouched.
- Direct commits to the integration branch for any purpose.

## Dependencies And Blockers

- None block TK-001. Its ADR ([ADR-000M](../../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md))
  records the owner's locked PW-3, PW-3A and PW-4 decisions; the owner said on
  2026-09-23 that ADRs written from his own decisions are accepted, so it
  enters the active roster with the Task rather than waiting in `proposed/`.
- The catalog review that decides which non-core skills join the lane starts
  from a tentative list (lexicon, domain-modeling, land, preflight,
  brainstorm, research, sitrep). Membership is derived from the owner's locked
  PW-4 rule ("If we need it, it should be included in workbench/skills"): a
  skill is needed when the Contract names it or a lane skill composes it as a
  required step. TK-00G applies that rule and reports each disposition, which
  the owner may correct; no owner confirmation gates it. `sitrep` returns
  through S-01V's room-core sitrep, not this Spec.
- The reading of "proof is a run that ends clean" in Desired Behavior 7 is
  the agent's interpretation of the owner's one-line answer; the owner
  delegated the PW-7..PW-10 mechanics to the agent, so TK-01N proceeds on it
  and stays open to his correction.

## Vertical Implementation Slices

Tasks are temporary tracer bullets within this stable capability record.
TK-001 closed as a row in this table before the Spec became record-backed; the
table is completed history only. The remaining slices are Task records under
[`tasks/`](tasks/), cut on 2026-09-26 in dependency order:

- [TK-00G](tasks/TK-00G/TASK.md) catalog review (derived lane membership) - box 7
- [TK-00H](tasks/TK-00H/TASK.md) host floor check - box 5
- [TK-00I](tasks/TK-00I/TASK.md) Wiki audit of host-memory knowledge - box 6
- [TK-00J](tasks/TK-00J/TASK.md) committed notes stay privacy-checked non-evidence - box 3
- [TK-00K](tasks/TK-00K/TASK.md) optional-capability routing, after TK-00H - box 5
- [TK-01K](tasks/TK-01K/TASK.md) lift the notes ignore rule and add promote-before-end, after TK-00J and the S-00P hold - box 3
- [TK-01L](tasks/TK-01L/TASK.md) push-on-claim and fetch-before-select with its ADR, after the S-00M hold - box 4
- [TK-01M](tasks/TK-01M/TASK.md) Taskboard shows remote claims, after TK-01L and S-01V - box 4
- [TK-01N](tasks/TK-01N/TASK.md) ends-clean round-trip gate, after TK-00G, TK-01K and TK-01L - box 7
- [TK-01O](tasks/TK-01O/TASK.md) real cloud session and two-instance demos, after TK-01N - box 8
- [TK-01P](tasks/TK-01P/TASK.md) controls and templates sweep, after the S-00P hold and the behavior Tasks - Documentation Impact

A cross-Spec Task cannot be named in `Blockers` (the vocabulary takes `S-`/`TK-`
ids and satisfies a Spec id only on completion), so the S-00P and S-00M holds
are written as Spec ids and each record states the narrower real condition
(S-00P TK-002 contained; S-00M TK-001 contained). The dispatcher removes the
Spec id in its own commit, with an evidence row, when that condition holds.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | A fresh clone discovers the core skills from `workbench/skills` | done | none | tools/test-skills-lane.mjs red on the pre-lane candidate, green after; full 47-command AGENTS suite green on the committed candidate; adr validate ok; render and doctor clean |

### TK-001 - A fresh clone discovers the core skills from `workbench/skills`

**Stance:** Builder

Pierce every layer once. Red first: a test at the workbench-layout seam clones
the committed candidate into a scrubbed directory and asserts that every
`skillPolicy.required` skill resolves to a `SKILL.md` through both declared
discovery roots without touching the provider home; confirm it fails. Then
the smallest green: declare `lanes.skills` in the manifest, move root
`skills/` to `workbench/skills` with history preserved, add tracked
adapters under `.claude/skills` and `.agents/skills`, tracked rather than
ignored as RUNBOOK's room-local extension procedure says today, ship the lane in `templates/`, teach Genesis and
update-harness to lay it down and refresh it, add the doctor finding for a
root `skills/` shadow and for a required skill missing from the lane, and
retire the `--home` global-core inspection. The first commit proposes the
ADR named in Decisions And Contracts; the Task cannot land until the owner
accepts it (the owner's 2026-09-23 direction that owner-authored ADRs are
accepted is that acceptance; see Dependencies And Blockers). Update RUNBOOK's skill procedures, the Lexicon rows Support lane,
Core skill bundle, Normal setup and Explicit skill update, and the README
install text in the same Task.

## Acceptance Criteria

- [x] A scrubbed clone of a room resolves every required skill through both
      discovery roots with no provider home and no personal catalog
      (`tools/test-skills-lane.mjs`, first test, clones the committed candidate).
- [x] Genesis creates the skills lane and update-harness refreshes it, with
      the lane receipt `.workbench-skills.json` naming source release, commit
      and a hash per skill (`tools/test-skills-lane.mjs` second test,
      `tools/test-genesis-from-decisions.mjs`, `tools/test-workbench-upgrade.mjs`).
- [ ] A session's notepad and handoff can be committed and later removed
      without a privacy or provenance check treating them as durable evidence.
- [ ] `claim` pushes the claim on the task branch; a second instance running
      `next` after a fetch does not receive that Task.
- [ ] The host floor check reports each floor item, and a Task needing an
      optional capability the host lacks lands in blocked or needs-review
      with the capability named.
- [ ] Knowledge a cloud agent needs that lived only in host memory is in the
      Wiki, and the Workbench runs without the memory directory.
- [ ] The round-trip test starts with nothing outside the clone and ends with
      everything promoted, pushed, and nothing needed left on the instance.
- [ ] One real cloud session lands a Task from GitHub alone, and a
      two-instance run shows the second skipping the first's claim, both
      recorded as demo artifacts.

## Testing Seams

- `workbench/tools/workbench-layout.mjs`: lane declaration, skill resolution
  through discovery roots, adapter creation.
- `workbench/tools/spec-workbench.mjs`: `next`, `claim`, `doctor`, with
  a bare remote fixture for push-on-claim and fetch-before-select.
- `workbench/tools/notepads.mjs` and `sessions.mjs`: committed notes stay
  non-evidence and privacy-checked.
- `tools/test-workbench-round-trip.mjs`: the cold-clone, ends-clean gate.
- `tools/workbench-upgrade.mjs` and the template tests: lane in Genesis,
  Adoption and update.

## Verification Procedure

```bash
node tools/test-workbench-layout.mjs
node tools/test-workbench-round-trip.mjs
node tools/test-spec-workbench.mjs
node workbench/tools/spec-workbench.mjs doctor
```

Then the full suite named in AGENTS.md on the committed candidate.

## Documentation Impact

- LEXICON.md: Support lane (seven), Core skill bundle, Normal setup, Explicit
  skill update, Packet (no longer "untracked"), and a Claim row if one is
  added; templates/LEXICON.md mirrors the generic changes.
- AGENTS.md: the untracked-notes sentence in Session Records And Checkpoints
  lifted per Desired Behavior 3; the promote-before-end exit rule; the
  capability-blocked Task rule; the claim push in Git Rules.
- BLUEPRINT.md: the "portable operating harness" opening and the Portability
  quality sentence point at the Lexicon definition.
- RUNBOOK.md: skills lane procedures, claim push and fetch, host floor check,
  round-trip gate wording, and the Portability and privacy matrix heading
  reading as host portability.
- RUNBOOK.md Prerequisites and Install text; README.md only where it names
  skill discovery or setup.
- ADRs: supersede ADR-0017, amend ADR-0046, narrow ADR-0051, and record
  claim-on-branch; each authored by the Task that makes the change.
- workbench/manifest.json and templates/: the lane and skillPolicy shape.
- Each Task records `Docs checked; no update needed` with its reason when
  nothing above applies to it.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-22 | — | Spec captured from the locked grilling record portable-workbench-cloud-deployable-2026-09-22 (revision 24); Lexicon term and renames promoted at `8dbd619da7e920edb5e819802aff9119f8cb1662` | `render`, `doctor`, vocabulary sweep and template evaluation on the committed candidate | LEXICON.md and templates/LEXICON.md updated; the rest of Documentation Impact waits on its Task | Everything in Desired Behavior is unbuilt; TK-001 is the only cut slice |
| 2026-09-22 | — | Separate-context review of `edd6cbe` PASS for the integration gate with one Medium (host floor credited to README instead of RUNBOOK) and five Lows; all corrected in this commit | Reviewer ran doctor, render no-op, citation anchors, vocabulary sweep, control fidelity and template evaluation on a clean detached worktree; full 46-command suite green on `edd6cbe` | Spec wording only; LEXICON.md Last reviewed set to 2026-09-22 | Unchanged: nothing built |
| 2026-09-23 | TK-001 | Owner directed on 2026-09-23: every core skill lives in `workbench/skills` and whatever workbench is running uses its local skills; Spec activated and TK-001 claimed | Red: new `tools/test-skills-lane.mjs` failed on the committed candidate (no `lanes.skills`, no `tools/workbench-skills.mjs`); green after the lane, adapters, manifest, doctor findings and installer landed | Guardrail baseline before editing 78/100 | Full suite, review and integration delivery pending |
| 2026-09-23 | TK-001 | Lane built: root `skills/` moved to `workbench/skills` with history; tracked `.agents/skills` and `.claude/skills` links; `tools/workbench-skills.mjs` install/verify/update/rollback with `.workbench-skills.json` receipt; Genesis, Adoption and the one-time upgrade lay the lane down; doctor reads the lane (`skill-lane-missing`, `skill-lane-unreadable`, `skill-adapter-missing`, `skill-adapter-broken`, `project-local-skills`) and `--home` is retired; ADR-000M accepted, ADR-0017 archived as superseded | Targeted red/green then the full AGENTS suite (47 commands including the new test) green on the committed candidate; `adr validate` ok; `render` and `doctor` clean | RUNBOOK skills lane and personal catalog procedures, LEXICON Support lane/Skills lane/Core skill bundle/Normal setup/Explicit skill update, README, BLUEPRINT skills sentence, templates GENESIS/ADOPTION/RUNBOOK/LEXICON/.claude settings, `workbench/skills/README.md`, `update-harness` skill | Personal-catalog copies on the owner's Mac still carry the v3.2.0 bundle until published from this lane; the remaining S-00V slices (catalog review, notes may travel, push-on-claim, host floor, Wiki audit, ends-clean round trip) are uncut |
| 2026-09-23 | TK-001 | Correction: `tools/test-adr.mjs` was red at `4b6d05c360ca8032c122943e66877ffadadabc0e` (four literal corpus re-counts moved by ADR-000M and the archived ADR-0017), so the row above claiming a green suite at that commit was wrong for that one command; green at `39eaa4881b88a2fe7a4a4fe63c111dd6c34966f7` after the pins were re-counted | Full suite on 4b6d05c 46/47 with test-adr failing; test-adr 29/29 at 39eaa48 | None | The earlier row is preserved unedited as an append-only record |
| 2026-09-23 | TK-001 | Separate-context review (Claude Fable 5.1, read-only detached worktree at 4b6d05c and 39eaa48) FAIL: pre-lane rooms had no command to declare the lane (`migrate` left six lanes), plus the evidence row above; Mediums on effect wording, retired `--home` text, Support root row, install partial state on adapter collision, unrecorded rollback backups, stale post anchor, ADR-0046 unamended, missing guardrail after-score | Findings reproduced by the reviewer; corrected in the next commit: `migrate` now declares `lanes.skills` and the lane policy for six-lane rooms (new test in `tools/test-workbench-layout.mjs`), `install` preflights adapters before copying and `rollback` accepts only a recorded backup (new test in `tools/test-skills-lane.mjs`), RUNBOOK/templates/LEXICON/README wording, ADR-0046 amendment paragraph, post anchor set to 39eaa48 | Owners named per finding | ADR-000M acceptance rests on the owner's 2026-09-23 chat direction that ADRs written from his own decisions are accepted; it is recorded here and in PR #145, not verifiable from the repository alone |
| 2026-09-23 | TK-001 | Guardrail audit after the change: 78/100, unchanged from the 78/100 baseline; remaining recommendations are the pre-existing ones the audit lists (none names the skills lane); outcome limitation: a static score and a green suite say nothing about agent reliability, and no repeated controlled trial was run | `node tools/audit-guardrails.mjs` before and after | None | Unchanged |
| 2026-09-23 | TK-001 | Task closed | tools/test-skills-lane.mjs red on the pre-lane candidate, green after; full 47-command AGENTS suite green on the committed candidate; adr validate ok; render and doctor clean | RUNBOOK skills lane and personal catalog sections, LEXICON rows, README, BLUEPRINT, templates (GENESIS, ADOPTION, RUNBOOK, LEXICON, .claude/settings.json), workbench/skills/README.md, update-harness skill, ADR-000M accepted and ADR-0017 archived | Owner Mac personal catalog still on the v3.2.0 bundle until published from the lane; remaining S-00V slices uncut |
| 2026-09-23 | TK-001 | Second separate-context review at `380a52ce16e3f8dd7c737a783e66b8f147898d55` PASS for the integration gate, with one Medium: `migrate` refused a pre-lane room whose `workbench/skills` directory already existed; fixed in the following commit (placeholder-path guard, layout test keeps the empty lane and a room-local skill in place) | Reviewer reproduced every earlier correction; `tools/test-workbench-layout.mjs`, `tools/test-skills-lane.mjs`, adoption and upgrade tests green after the fix; full suite 47/47 at 380a52c | None | Rows appended after the close row from here on; the three rows above the close row were inserted out of order and stay as published |
| 2026-09-26 | — | Acceptance audit against integration `058f0898e551f95a935c4ae9d61d4a18dc92ea00` (Lane E dispatcher `claude-lane-E`): boxes 1-2 met by TK-001; boxes 3-8 unmet, so the Spec stays active and the stale Next gate "Confirm acceptance criteria and completion result" is replaced | Read at that commit: box 3, `workbench/sessions/.gitignore` lines 4, 9 and 12 still ignore `handoffs/*` and `notepads/*` and AGENTS.md line 418 still says live notes and handoffs stay untracked; box 4, `claimWork` in `workbench/tools/spec-workbench.mjs` makes no git call (no branch, push or fetch) and `tools/test-workbench-round-trip.mjs` line 166 claims locally then commits and pushes by hand; box 5, no host floor check or finding exists in `workbench/tools` or `tools`; box 6, no Wiki article audits host-memory knowledge; box 7, the round trip does not claim by pushing or assert an ends-clean instance; box 8, no cloud or two-instance demo artifact is recorded | Docs checked; no update needed: this row and the header are the only change, and no behavior changed | Six boxes need the six uncut slices listed under Remaining Limitations; no owner gate is named for completion |
| 2026-09-26 | review | Review verdict: pass at a7e2b6b36943b2bf21e7aca5d071e492a5352140 [dd2b15658b6e] #1 | none; every factual claim in the acceptance-audit row verified at 058f089; full suite 48/48 on a7e2b6b | Codex CLI codex exec -s read-only -m gpt-5.5, separate context | 3 |
| 2026-09-26 | — | Remaining slices cut by Lane F dispatcher `claude-lane-F` into eleven Task records TK-00G, TK-00H, TK-00I, TK-00J, TK-00K, TK-01K, TK-01L, TK-01M, TK-01N, TK-01O, TK-01P (ids from `next-id`); every unmet box 3-8 maps to at least one record; collision holds encoded as blockers (S-00P on TK-01K and TK-01P, S-00M on TK-01L, S-01V on TK-01M); catalog-review membership derived from grilling decision-005 instead of an owner confirmation | `show S-00V` parses all eleven records; `render` and `doctor` on the committed candidate; full AGENTS suite on the committed candidate | Spec header, Vertical Implementation Slices, Dependencies And Blockers and Remaining Limitations updated; Task records added; no control changed | Four Tasks ready; seven blocked on predecessors or holds; boxes 3-8 still unmet |
| 2026-09-26 | review | Review verdict: pass at 8d51f147229e29ac48974fa1caef7c017534c0f3 [fa262e1aea26] #2 | none; eleven Task records parse, every box 3-8 mapped, Spec-id collision holds and derived PW-4 catalog rule judged faithful; full suite 48/48 on 8d51f14 | Codex CLI codex exec -s read-only -m gpt-5.5, separate context | 3 |
| 2026-09-26 | TK-01L | Collision hold lifted: S-00M TK-001 (repository-state reader `readRepositoryState` in `workbench/tools/workbench-layout.mjs`) is contained in integration by merge `9e434b3c61eceada46e76bea099d83e0b8044de7` (PR #159), so `S-00M` is removed from TK-01L Blockers and the record returns to ready | `git merge-base --is-ancestor 9e434b3c61eceada46e76bea099d83e0b8044de7 origin/integration`; S-00M TK-001 row reads done; `show S-00V` lists TK-01L ready | Docs checked; no update needed: only the TK-01L record and this row change | TK-01L still coordinates with S-00M TK-002/TK-003 edits to `close` and diagnostics; rebase often |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

The planned slices listed here were cut into Task records on 2026-09-26; see
Vertical Implementation Slices. Known limits carried by those records:
`needs-review` routing for a capability-blocked Task depends on S-01V adding
that status (TK-00K satisfies box 5 with blocked routing until then), and
control wording that S-00P is rewriting is collected in TK-01P.

## Supersession

- Supersedes: none
- Superseded by: none
