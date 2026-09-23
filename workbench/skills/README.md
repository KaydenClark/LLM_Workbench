# Workbench Core Skills

This directory is the self-contained, versioned LLM Workbench skill source. It
is a closed 21-skill bundle (seventeen workflow skills and four stances),
counted from the manifest and catalog below, for a
brand-new installation, not a general catalog or a project-local discovery tree.
The checked-out LLM Workbench release owns the exact source versions.

<!-- core-skills:start -->
| Skill | Purpose |
|---|---|
| `adoption` | Migrate an existing project into the Workbench once while preserving project truth and recovery. |
| `checkpoint` | Compatibility notice for retired checkpoint copying; route scoped continuity to notepad. |
| `code-review` | Independently review a fixed implementation diff against its owning spec. |
| `genesis` | Create a new greenfield Workbench project from a founding prompt. |
| `grilling` | Run the question-at-a-time decision interview. |
| `implement` | Drive one eligible task through red/green, review, and remote recovery. |
| `make-it-so` | Promote settled decisions and execute their approved tasks. |
| `to-docs` | Route settled truth into its existing documentation owner. |
| `to-spec` | Create or update one stable capability specification. |
| `to-tasks` | Decompose a capability into dependency-aware implementation slices. |
| `tracer-bullet` | Cut a capability into vertically testable slices. |
| `update-harness` | Reconcile an adopted project with the current Workbench contract. |
| `carry` | Own an assigned spec or task to its already-authorized endpoint and record what the owner still had to supply. |
| `save` | Persist authorized work and verify its actual local or remote recovery boundary. |
| `promote` | Reconcile selected supported claims directly into their existing durable owners. |
| `handoff` | Author readable, scope-preserving Markdown continuation for the requested destination. |
| `notepad` | Keep one objective's local JSON working context: save it as it appears, retrieve a topic with its corrections, trim only what is reconciled. |
| `builder` | Deliver the assigned result with useful verification and truthful documentation. |
| `auditor` | Determine whether named claims hold on the assigned target and evidence. |
| `reviewer` | Challenge candidate correctness, downstream impact and consequential claims. |
| `reconciler` | Leave achieved work and its existing truth owners consistent for continuation. |
<!-- core-skills:end -->

## Normal setup

Run the checked-out helper on a brand-new host:

```bash
node tools/core-skill-installer.mjs install [--home USER_HOME]
```

This directory is the `workbench/skills` lane: every room carries these core
skills inside its repository, laid down by Genesis and Adoption from the
release (`tools/workbench-skills.mjs install`) with a receipt and reached by
the tracked project-level `.agents/skills` (Codex) and `.claude/skills`
(Claude Code) links, so a fresh clone discovers them with no provider home.
The Workbench update refreshes the lane (`workbench-skills.mjs update
--explicit-update`). The helper above is the separate personal-catalog
publication route: it supplies a missing core skill only from this directory
into the user-scoped `.agents/skills` and `.claude/skills` roots. That
publication is presence-only: an existing same-named skill is accepted
without a content comparison or replacement. A Git-owned or linked discovery
root permits missing-only installation into its resolved directory without
changing tracked source. Unsafe path collisions block before either discovery
root is changed and return exact remediation. Replacing a published skill is
reserved for the installer's explicit-update flow, never normal setup, and a
room never depends on the personal catalog.

## Managed skill marker

Each skill the installer or the explicit upgrade (`tools/workbench-upgrade.mjs`)
writes carries `.workbench-skill.json` beside its `SKILL.md`:

```json
{"schemaVersion":2,"source":"LLM Workbench core","release":"vX.Y.Z","commit":"<40-hex>","contentHash":"<sha256>","compatibleRooms":{"minimum":"v3.1.4","maximum":"vX.Y.Z"}}
```

The verified clean source checkout supplies the producing release and commit.
The hash covers relative file paths and bytes, excluding this marker. The room
inspector distinguishes unknown generation, changed content, missing/broken
entries, duplicate sources and an incompatible declared room range. The valid
range starts at the v3.1.4 notepad baseline and ends at the producing release;
legacy or widened declarations remain unknown. Different releases within that
range are compatible by this structural check. Read-only inspection neither
repairs the home nor proves native-host callability or workflow reliability.
The Runbook owns the diagnostic codes and explicit update/recovery procedures.

## Retired and preserved source

The optional router, convenience, and reference skills removed from live
discovery are retained under `skills-archive/optional-active-2026-09-01/`.
`skills-pending/` remains historical rewrite source outside discovery. Neither
directory participates in the portable core bundle.

The upstream baselines are covered by the [tracked third-party notice](../THIRD_PARTY_NOTICES.md).

### Optional-source review

Review scope: tracked repository sources at `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`, including
core/optional skill text, catalog tests and feedback references. Name mentions
are evidence of a reference, not proof that an installed skill consumes these
bytes. No external installation was inspected. A repository no-consumer result
does not authorize removal or establish absence of outside consumers.

Every row covers its directory and supporting files. The pinned commit plus the
row path is the recovery route: `git show <commit>:<path>/SKILL.md` reads the
entry point, and `git ls-tree -r <commit> -- <path>` inventories all recoverable
files. Pending sources entered in `6943c106acb8de56d55599ece4fcf29a59da4f41`;
archived optional skills moved out of core in
`26c34e976f479460d70574aaabe4e1c8c9f8792a`. These are repository provenance,
not a claim that every item is wholly upstream-authored. The existing notice
owner retains attribution for upstream-derived material; this review does not
change or narrow its coverage.

All items remain preserved outside discovery while the owner decides whether
their recovery/reference purpose merits continued retention. The dispositions
below authorize no removal, relocation, installation or promotion into core.
Historical source can contain retired instructions; consult current controls
before any reuse. Potential removal needs per-item approval, a complete
consumer/reference review, preserved notices and a pinned recovery commit.

<!-- optional-source:start -->
| Source path | Consumer / recovery route | Provenance / attribution owner | Reviewed | Disposition |
|---|---|---|---|---|
| `skills-archive/optional-active-2026-09-01/ask-workbench` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this ask-workbench source pending retention or recoverable removal choice. |
| `skills-archive/optional-active-2026-09-01/brainstorm` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this brainstorm source pending retention or recoverable removal choice. |
| `skills-archive/optional-active-2026-09-01/grill-me` | Archived `ask-workbench/SKILL.md` routes here. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this grill-me source pending retention or recoverable removal choice. |
| `skills-archive/optional-active-2026-09-01/sitrep` | Archived `ask-workbench/SKILL.md` routes here. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this sitrep source pending retention or recoverable removal choice. |
| `skills-archive/optional-active-2026-09-01/writing-great-skills` | Archived `ask-workbench/SKILL.md` routes here. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this writing-great-skills source pending retention or recoverable removal choice. |
| `skills-pending/codebase-design` | Pending `improve-codebase-architecture` and `setup-ts-deep-modules` name this skill. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this codebase-design source pending retention or recoverable removal choice. |
| `skills-pending/design-an-interface` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this design-an-interface source pending retention or recoverable removal choice. |
| `skills-pending/diagnosing-bugs` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this diagnosing-bugs source pending retention or recoverable removal choice. |
| `skills-pending/domain-modeling` | Pending `wayfinder` and `improve-codebase-architecture` name this skill. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this domain-modeling source pending retention or recoverable removal choice. |
| `skills-pending/improve-codebase-architecture` | Pending `diagnosing-bugs` routes here. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this improve-codebase-architecture source pending retention or recoverable removal choice. |
| `skills-pending/loop-me` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this loop-me source pending retention or recoverable removal choice. |
| `skills-pending/prototype` | Pending `wayfinder` names this skill; foundation audit records it as unshipped. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this prototype source pending retention or recoverable removal choice. |
| `skills-pending/research` | Foundation audit records this source as unshipped. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this research source pending retention or recoverable removal choice. |
| `skills-pending/resolving-merge-conflicts` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this resolving-merge-conflicts source pending retention or recoverable removal choice. |
| `skills-pending/setup-pre-commit` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this setup-pre-commit source pending retention or recoverable removal choice. |
| `skills-pending/setup-ts-deep-modules` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this setup-ts-deep-modules source pending retention or recoverable removal choice. |
| `skills-pending/tdd` | Core `tracer-bullet/SKILL.md` mentions `/tdd`; this is not proof this optional copy supplies invocation. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this tdd source pending retention or recoverable removal choice. |
| `skills-pending/teach` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this teach source pending retention or recoverable removal choice. |
| `skills-pending/ubiquitous-language` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this ubiquitous-language source pending retention or recoverable removal choice. |
| `skills-pending/wayfinder` | Foundation audit records this source as unshipped. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this wayfinder source pending retention or recoverable removal choice. |
| `skills-pending/wizard` | No operational consumer established by this bounded repository review. Recover the complete directory from the pinned provenance commit. | `bcfa55d4d33b3a815e899eeb9e60c7629d462d82`; [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 2026-09-19 | owner decision required: preserve this wizard source pending retention or recoverable removal choice. |
<!-- optional-source:end -->

## Stance discovery

Builder, Auditor, Reviewer and Reconciler ship as flat directories in the lane,
so both hosts' one-level scan through the discovery adapters sees them
directly. If a user separately stores a stance below `stances/` in a personal
catalog, that nested installation also needs a flat top-level symlink there.
The missing-only publication installer never replaces a foreign symlink or
rearranges existing installations. SPEC and TASK assign a stance; loading one
changes method without changing authority or spawning an agent.

## Composition And Authoring

Invocation is distinct from mention or routing. Avoid incidental everyday-word
triggers; renaming or retiring an existing public entrypoint needs an explicit
compatibility change. `implement` remains supported. Compose independently
usable primitives within inherited authorization and retain one behavior owner.
The accepted ownership/adapter target is described in BLUEPRINT; S-051 owns its
implementation. A globally available optional skill is not thereby a core feature.

Evaluate repeatable process and achieved state, not identical generated wording.
Omit inapplicable empty prose where it adds no meaning, while preserving required
empty collections and intentional schema/template scaffolding. A proposed metadata
schema is not part of the contract merely because it can be searched mechanically.
