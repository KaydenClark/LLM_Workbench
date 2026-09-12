# Historical Decision Triage - 2026-09-07

Read at `1628a65`, re-verified at `2127627` (manifest v3.1.3, 28 accepted ADRs, 45 specs). S-045 and S-049
landed mid-triage; every item they touch was re-read at the new tip. Source packet:
`workbench/feedback/llm-workbench-decision-recovery.zip` (181 records, 178 evidence snapshots).

**Full interactive docket:** https://claude.ai/code/artifact/2e52dcab-2888-43cc-ac1c-dc031844dff1

This is a Grounding report. It changed no ADR, control or spec, and it authorizes no repair.

## Owner decisions recorded

### CAND-O / R150 - The portable runtime stays Node/JavaScript (2026-09-07)

**Reasoning of record.** JSON is JavaScript's native object syntax. Node parses and produces it as first-class
language values with no conversion step, which directly serves the JSON-notepad direction (ADR-0040, S-046).
Python's `json` module works but always mediates through dict/list conversion - a structurally worse fit for
JSON-heavy tooling, not merely a costlier migration. Rewrite cost (~63 tools, tests, installer, receipt format)
confirms; it is not the basis. Rejected reading: "we are using more JSON now" is evidence for Node, not Python.
Python keeps the evals lane plus `tools/check-append-only.py` and `tools/test-check-append-only.py` - verified
as exactly the 20 `.py` files in the tree against 61 `.mjs` tools.

### CAND-F / R038 R068 R162 - Three skill ownership scopes, two distribution tiers (2026-09-07)

**Decision.** Option C, amended.

1. **Workbench core** - owned and versioned by LLM_Workbench; small, tested, portable, and sufficient for every
   workflow the Workbench promises. A fresh Workbench must function without the personal skills repository.
   `promote` and `save` move into core because the base decision/promotion lifecycle depends on them, and are
   reconciled to current architecture rather than copied.
2. **Shared / global** - `KaydenClark/skills` remains the canonical Git-backed home for personally accepted
   reusable skills. Available to every room on these machines, but optional from the product's perspective;
   global availability does not make a skill a Workbench feature. `land`, Flight lifecycle and `sitrep` stay here.
3. **Room-local** - a room may create skills in its own source folder. They stay local until explicitly accepted
   into the shared catalog, may stay local forever, and promotion upward retires the local discovery copy.

**Invariant.** One authoritative source per skill. One discovery entry per application. No independently
maintained duplicate implementations.

**Discovery vs source.** Codex reads `~/.agents/skills/`, Claude reads `~/.claude/skills/`. Discovery adapters,
not repositories; both point at the same authoritative sources. No third `.codex/skills/` catalog.

**Portability.** Git provides PC/Mac portability; machine-local setup recreates discovery links and adapters from
Git-backed sources. Absolute machine paths and generated links are installation state, not canonical source.

**The Workbench declares** required core; optional/global capabilities it can detect but does not own; supported
discovery roots; compatibility/source identity for required skills.

**`doctor` detects** missing required core skills; duplicate or conflicting same-named skills; wrong or
incompatible skill source or generation; broken discovery links. It never treats the personal shared catalog as
mandatory for Workbench health.

**Not fixed in the ADR.** The bundle count. The durable decision is that `promote` and `save` become core
dependencies; the number derives from the actual catalog. `tools/test-skill-catalog.mjs` already derives prose
counts from `coreSkills.length`.

#### Verified state at decision time

- **Already correct:** `~/.agents/skills` is the one real directory; `~/.claude/skills` and `~/.codex/skills` are
  both symlinks to it. No third catalog exists to remove. The shape is incidental to this machine, not recreated
  by a declared setup step.
- **The violation:** all 17 core skills are tracked in `KaydenClark/skills`, and **12 of 17 have drifted** from
  the LLM_Workbench source - `update-harness` 137 lines, `grilling` 72, `implement` 55, `adoption` 48,
  `make-it-so` 45, `checkpoint` 43, `genesis` 31, `to-docs` 18, `to-spec` 16, `to-tickets` 13, `tracer-bullet` 4,
  `code-review` 3. Only 5 are identical. The `grilling diary` path defect is one symptom of this, not a separate bug.
- **One skill is in the target state:** `carry` alone carries a generation marker (source LLM Workbench core,
  release v3.1.3, commit `f5c9f18`), because it is the only one the installer placed after S-045 taught it to
  write into a Git-owned discovery root.
- **Diagnostic bug exposed:** the 32 `skill-generation-unknown` findings are 16 skills counted twice, once per
  symlinked root. `doctor` models the two roots as independent catalogs; this decision says they are two adapters
  onto one source.
- **Consequence for the ADR:** the global discovery root is itself a Git repository, so anything in it is either
  committed (a duplicate implementation) or gitignored (not carried by that repository). The clean reading of the
  invariant is that each scope carries its own Git portability - core from LLM_Workbench at a pinned release,
  shared from `KaydenClark/skills`, local from the room - which makes installed core skills gitignored
  installation state inside the personal repo.

#### Reconciliation audit - before `promote` and `save` enter core

**`save`, four conflicts.** Intent home is the hardcoded absolute path `$TMPDIR/.foundry/` - Foundry-specific and
the kind of absolute machine path this decision calls installation state; must resolve through manifest lanes and
collections. Authorization reads "a Job Order or the owner's direct instruction"; ADR-0015, ADR-0026 and GO-0021
keep Job Orders out of the base. Its plane table states "docs, specs, tickets, and decisions are Canon" - the exact
categorical rule ADR-0025 supersedes. Its durable mechanism is "commit and push", bypassing branch-per-spec,
PR-into-declared-`integrationBranch` and independent review (ADR-0037, ADR-0039, AGENTS Git Rules).

**`promote`, three conflicts and one thing to keep.** Same Job Order reference in its next-gate clause. Routes to
"an ADR or equivalent durable record" where the manifest `adr` collection and `adr.mjs` are the concrete owner.
Step 5 flips `[locked]` markers in a Markdown notepad; ADR-0040 and S-046 move notepads to JSON, so that half is
sequenced behind S-046 TK-002. `disable-model-invocation: true` is provider-specific frontmatter and becomes an
adapter concern. **Keep:** `promote`'s plane routing is already ADR-0025-correct and states that an accepted
decision record is Enduring Context, not Canon. `save` contradicts it, so reconcile `save` to `promote`.

### CAND-Q / R051 - Direct owner promotion replaces the checkpoint collection (2026-09-07)

**Decision.** Option A with direct owner promotion as the replacement boundary. `sessions/checkpoints/` retires as
an active collection; its contents stay read-only so existing durable references keep resolving, and no new material
is promoted there.

**The new boundary is an operation, not an artifact.** A promotion tool takes selected material from a local notepad
or handoff, performs the required privacy and validity checks, writes that material directly into its named durable
owner, and then allows the promoted source to be trimmed or discarded.

**What stays temporary.** Notepads remain temporary structured working state; handoffs remain temporary transfer
artifacts created only for actual handoffs. Either may be a source for promotion; neither becomes the durable owner
merely by being committed. A tracked handoff as permanent destination would recreate the checkpoint collection under
another name.

**ADR-0028 superseded in part.** Preserved: untracked working records are not durable evidence, and the privacy check
stands at the durability crossing. Retired: the requirement that the crossing terminate in `sessions/checkpoints/`.
Its `untracked-provenance` diagnostic survives and matters more, since promotion now targets arbitrary named owners.

**S-048 scope.** Inventory existing checkpoint citations; preserve the collection as frozen history; remove future
checkpoint creation from Runbook and tooling; route all future durable promotion directly into ADRs, specs, wiki
knowledge, controls, or another explicitly named owner.

#### Citation inventory (S-048's first task, supplied)

The collection holds five records plus `.gitkeep`, all six tracked. They are not equally cited.

- **14 of the 28 accepted ADRs cite a checkpoint record as provenance.** `llm-workbench-v3-1-plan-2026-09-04.md` is
  cited by nine (ADR-0025 through ADR-0033, the whole governance-core block).
  `workbench-boundaries-grilling-2026-09-04.md` is cited by five more (ADR-0034 through ADR-0038) and by S-027.
  `s022-cross-provider-resume-2026-09-04.md` is cited by S-022. Deleting rather than freezing would break the
  recorded provenance of half the accepted ADR set.
- **Two records have no durable dependent.** `workbench-boundaries-redesign-2026-09-04.md` and
  `workbench-pivot-stability-2026-09-04.md` are referenced only from inside the collection and from untracked
  grilling notes.

#### Retirement hazard - the collection is overloaded

`collections.checkpoints` is also the destination for adoption and upgrade rollback state, which is unrelated to
session promotion. `tools/workbench-adoption.mjs` writes `adoption-recovery.json` and moves project-local skills to
`adoption-legacy-skills/` there; `tools/workbench-upgrade.mjs` writes `upgrade-recovery.json` there. Documented at
`RUNBOOK.md` lines 462, 464 and 514, and protected by `tools/test-workbench-layout.mjs` ("checkpoints must never be
ignored", "checkpoints stay trackable"). That is ADR-0031 rollback state and must not retire. S-048 must either give
recovery its own declared destination or keep `checkpoints` declared with only its session-promotion role removed.
Recommend the former: the point of the decision is that the name stops meaning durable promotion.

#### Two things that make this cheaper than it looks

- **The privacy check needs no reimplementation.** `workbench/tools/sessions.mjs` already exposes `scan --file` as a
  command separate from `checkpoint`, emitting `secret-like-content` with the offending line. The core `promote` tool
  calls the existing scan at the crossing; only the `checkpoint` subcommand retires.
- **It confirms CAND-F's instruction not to fix the bundle count.** The `checkpoint` skill is in
  `skillPolicy.required` today. Retiring checkpoint creation changes the required-core list at the same moment
  `promote` and `save` enter it, so the catalog moves twice from two decisions.

### CAND-N / R054 R136 - A private `workbench_sessions` repository carries cross-device continuity (2026-09-07)

Each Workbench declares a stable identity in its manifest, shared by clones and worktrees and unchanged by rename or
relocation; records live under `workbenches/<ID>/sessions/` beside a small `workbench.json`. Agents keep using the
project's manifest-declared sessions location while a shared sync tool maps those live collections into a local clone;
machine-specific paths stay local configuration. Live notepads, grilling records and handoffs sync; project-owned
schemas, templates and promoted documentation stay in the project repository, and live records stay excluded from
project Git. Fetch before resuming, push after meaningful saves and before switching devices; offline saves remain
available with pending-upload status and the last confirmed remote revision. Local sync serializes with one active
writer per note, preserving competing revisions and surfacing conflicts without silent overwrites or force-pushing.
Git's retention tradeoff is accepted. The capability is optional; ordinary local operation stays independent of it.
Verified by a real Mac/Windows round trip plus offline recovery and conflicting edits. Selects the design only.

**Term collision to settle.** `LEXICON.md:74` and ADR-0041 define **WBID** as an *artifact's* visible identifier,
unique within the type and Workbench, "not globally; no parallel secondary ID". This decision needs a global,
Workbench-level identity. On substance there is no conflict - ADR-0041 deferred global uniqueness "until connected
Workbenches actually need a connection identity", and this is that trigger - but the term collides. Recommend
reassigning WBID to the Workbench identity and giving ADR-0041's concept an artifact-scoped name; S-047 is `planned`
and unstarted, so the rename is free today.

**Tracked is not durable.** ADR-0028's rule survives verbatim: live records stay untracked *in the project
repository*. Tracking in a separate private transport repository confers no durability, because CAND-Q's durable
boundary is the promotion operation into a named owner. ADR-0040's local-only clause is what is amended.

**Consequences.** The privacy check gains a second, routine crossing at every sync push, and with the accepted
retention tradeoff a secret reaching the remote cannot be removed by deleting the file. An unconfigured or
unreachable remote must produce findings with effect `none`. `handoff` does not become a core skill: the crossing is
a sync tool and handoffs are synced content, so CAND-F's core membership list stands.

### CAND-P / R151 - A minimum host capability contract, verified in the real environment (2026-09-07)

Option A with qualifications. Define a small minimum capability contract for supported hosts and verify it in the
actual configured environment. Distinguish operational capability, machine enforcement and agent instruction-following;
evidence for one must not imply the others. Provider-native adapters and hooks stay outside the core commitment for
now. Claim enforcement only where a running mechanism controls the operation and the claim has supporting evidence;
an unavailable or inconclusive check remains unverified. A missing capability blocks only work that requires it.
Agree the minimum requirements before selecting manifest fields, diagnostic behavior or test architecture.

**Next gate - candidate minimum requirements, each traced to a real failure.**

1. Declared writable lanes are actually writable in the supported relative, home and absolute path forms (S-036, R105).
2. A skill in a declared discovery root is actually discoverable and invocable (R060, R068).
3. The declared runtime executes the managed tools lane - now checkable since CAND-O fixes it as Node.
4. The host supports the discovery adapter mechanism, symlink or junction (CAND-F's adapter, CAND-N's round trip).
5. Record syntax survives the host's checkout (S-037, R176).

Deliberately excluded: Git remote reachability and session sync (CAND-N is optional), provider hooks (held back), and
model output quality (CAND-C's evaluation contract, not a host capability).

**Today's tests are the gap, not the coverage.** `tools/test-portability-matrix.mjs` is entirely static - case
collisions, path-string safety, retired-path and privacy greps over source text. `tools/test-cross-provider-fixture.mjs`
builds an isolated home and does a real `git ls-remote`, but in a synthetic temp directory. Neither verifies the
environment the agent is configured in. That fixture also asserts the installer writes `bundleSize x 2` skills into
both discovery roots, which is CAND-F's duplicate-copy model and must be updated by that migration.

**Two inherited patterns.** "Unavailable stays unverified" is the same third-state shape as CAND-J (S-041), and the
two should cross-reference rather than each invent it. "Blocks only work that requires it" is ADR-0029's registered
`selected-slice` effect, where `claim` refuses a slice whose named dependency is unmet - noted as a fit, not selected,
since diagnostic behavior comes after the requirements are agreed.

## Disposition summary

| Disposition | Items |
|---|---:|
| NEEDS KAYDEN | 4 |
| RESOLVED | 4 |
| KEEP - ADR | 12 |
| KEEP - CONTRACT | 4 |
| KEEP - DOC | 11 |
| ALREADY COVERED | 56 |
| OUT OF SCOPE | 12 |
| SUPERSEDED | 2 |
| REJECT | 1 |
| MERGE WITH <candidate> (all targets) | 75 |
| **Total** | **181** |

146 items need no durable artifact of their own; 8 are closed by owner decision. ~60 ADR candidates reduce to 19:
5 decided by the owner on 2026-09-07 and 14 proposed and awaiting review. Plus 3 amendments to existing ADRs.

**No item is awaiting an owner decision.** The remaining work is migration, specification and implementation.

## Proposed new ADRs (14)

| Candidate | Decision | Source items |
|---|---|---:|
| CAND-A | The perpetual handoff is the acceptance boundary | 5 |
| CAND-B | Proof, independent judgment and owner authorization are three different facts | 3 |
| CAND-C | The harness is judged by agent outcomes against held-out baselines | 7 |
| CAND-D | Feedback carries model provenance, evidence class and durable finding identity | 2 |
| CAND-E | Skills compose as primitives; invocation, composition and authority are separate axes | 6 |
| CAND-G | Genesis, adoption and upgrade are distinct operations over validated sources | 6 |
| CAND-H | Provenance is layered: release, adoption, installed generation, present bytes, running runtime | 6 |
| CAND-I | Delivery is proven by the exact ref and object, not by local state | 4 |
| CAND-J | An unavailable baseline is a third state, recorded with evidence | 1 |
| CAND-K | Control fidelity: filling a placeholder preserves the surrounding rule | 3 |
| CAND-L | Record syntax is portable; reading never rewrites | 1 |
| CAND-M | One durable writer per shared surface | 2 |
| CAND-R | Extension architecture is retained as lineage, not revived | 35 |
| CAND-S | An open follow-up needs a reachable current owner | 2 |

## Amendments to existing ADRs (3)

- **ADR-0026** - Add the inter-room interface and the public/private packaging boundary (R080 R096). ADR-0026 names LLM_Workbench the sole source but not the deployer and auditor roles that GPT_OS and Audit_Workbench actually play, nor the rule that a public product excludes private instance state.
- **ADR-0037** - Name target movement as a trigger for fresh review (R077). ADR-0037 says a changed candidate needs fresh review; it does not say that a moved integration target producing a different merge result is such a change.
- **ADR-0040** - Preserve question identity across notepad merges (R052). ADR-0040 requires preserving sources, uncertainty and corrections but not stable question identities, which is how earlier recovery attempts lost dozens of settled answers.

## Verified findings outside the triage

- `diagnostics.mjs` `stale-claim` says "older than one working day"; no tool defines the day boundary or
  timezone (R120).
- `REPORT_FORMAT.md` requires target revision and installed-skill provenance but never requires the evaluated
  model to be named separately from the reporting model (R089).
- R041 is reconciled, not changed: `REGISTER.md` is generated by `adr.mjs`, marked do-not-edit, and
  `stale-register` is `attention`/blocks-none. The 2026-09-03 no-hand-index ruling is intact.
- The `grilling diary` path defect first reported here is now understood as one symptom of the CAND-F
  duplicate-implementation violation, not an independent bug.

## Per-item ledger

`decision-triage-2026-09-07.csv` and `decision-triage-2026-09-07.json`. Every one of the 181 source items
appears with a disposition, target artifact, confidence and the evidence the disposition rests on.
