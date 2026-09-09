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
| `implement` | Drive one eligible ticket through red/green, review, and remote recovery. |
| `make-it-so` | Promote settled decisions and execute their approved tickets. |
| `to-docs` | Route settled truth into its existing documentation owner. |
| `to-spec` | Create or update one stable capability specification. |
| `to-tickets` | Decompose a capability into dependency-aware implementation slices. |
| `tracer-bullet` | Cut a capability into vertically testable slices. |
| `update-harness` | Reconcile an adopted project with the current Workbench contract. |
| `carry` | Own an assigned spec or ticket to its already-authorized endpoint and record what the owner still had to supply. |
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

It supplies a missing core skill only from this directory into the user-scoped
Codex-compatible `.agents/skills` and Claude `.claude/skills` roots. Normal
setup is presence-only: an existing same-named skill is accepted without a
content comparison or replacement. A Git-owned or linked discovery root permits missing-only installation into
its resolved directory without changing tracked source. Unsafe path collisions
block before either discovery root is changed and return exact remediation. Replacing an existing skill is reserved for the
explicit-update flow, not normal setup.

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

## Stance discovery

Builder, Auditor, Reviewer and Reconciler ship as flat canonical directories with Claude adapters in the
user discovery roots, so Claude's one-level scan sees them directly. If a user
separately stores a stance below `stances/`, that nested installation also needs
a flat top-level symlink. The missing-only installer never replaces a foreign
symlink or rearranges existing installations. SPEC and TASK assign a stance;
loading one changes method without changing authority or spawning an agent.

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
