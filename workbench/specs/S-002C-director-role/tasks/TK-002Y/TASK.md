# TK-002Y - Route the director Wiki article and record the fresh-context coordination scenario

**Task ID:** TK-002Y
**Spec ID:** S-002C
**Slice:** Route the director Wiki article and record the fresh-context coordination scenario
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002C Acceptance Criteria, box 6 (a fresh agent discovers the entry and its article and performs the scenario without private notes) and the scenario named under Testing Seams
**Planned verification:** `node workbench/tools/wiki.mjs validate` and `node tools/test-wiki.mjs` green with the new article routed from the "Roles And Stances" section of `workbench/wiki/MEMORY.md`; one fresh-context agent given only the delivered `workbench/skills/director/SKILL.md` text, a disposable fixture room outside the repository pinned at a named commit, and scripted Dispatcher reports (two Specs advancing in parallel, one shared artifact both need, one out-of-scope request) is observed to name the single writer, permit the other lane's independent work, route the candidate review to a separate context, record the dependency and result in the fixture's tracked owners, and report the out-of-scope request instead of performing it; the observation and its limits are handed back for the Spec evidence.

## Outcome

`workbench/wiki/skill-director.md` explains the Director role for a reader
who has not seen the Spec: what the role covers, its inputs, outputs,
hand-back and escalation, how it composes with Dispatcher, Worker and the
stances, and what one fresh-context run actually showed. The article is
routed from `workbench/wiki/MEMORY.md` under "Roles And Stances", validates,
and the scenario from the Spec's Testing Seams is recorded with its limits.

## Article Contract

Shape: `workbench/wiki/skill-auditor.md` (front matter `type: memory`,
`status: active`, `sensitivity: normal`, `knowledge_role: curated`,
`provenance`, `source_paths`, `last_verified`; sections "How it works",
"Composition", "Verified behavior and limits", "Sources", "History").
Requirements:

- Open with the one-paragraph job statement: inputs (project controls,
  current integration state, assigned Specs and their Dispatchers, Dispatcher
  reports), output (assignments, shared-writer decisions, review routing,
  merged candidates recorded in tracked owners, a report to the owner with
  open owner choices), done-when (every assigned Spec at its named endpoint
  or recorded blocker; nothing claims owner approval).
- "How it works" explains, citing the LEXICON rows and ADR-000P through
  `workbench/docs/adr`, that role is scope and stance is job; that the
  Director covers the project and integration, a Dispatcher one Spec and its
  branch, a Worker one Task; that the Director never executes a Task, never
  approves a candidate it built, and treats Human QA and main promotion as
  owner acts; and how the single-writer and landing-order decisions keep
  parallel lanes from colliding.
- "Composition" names the sibling capabilities by Spec path only where the
  entry has not landed on integration:
  `workbench/specs/S-002D-dispatcher-role/SPEC.md`,
  `workbench/specs/S-002E-worker-role/SPEC.md`,
  `workbench/specs/S-002F-spec-planner-stance/SPEC.md`,
  `workbench/specs/S-002G-spec-manager-stance/SPEC.md`; links the existing
  `workbench/wiki/skill-auditor.md` and `workbench/skills/reviewer/SKILL.md`
  as the review jobs the Director routes to a separate context; links the
  role model `workbench/wiki/design-concepts/roles-and-stances.md`. The last
  lane to land adds cross-links among the four new articles; this article
  does not link to files absent from integration.
- "Verified behavior and limits" records the scenario below exactly as
  observed: date, what the agent was given, what it did, what the fixture
  room showed afterwards, and the limits (one run, one model, scripted
  Dispatchers and owner; not owner Human QA; not a repeated trial; the agent
  still received its host's default instructions).
- No live progress, no copied Spec state, no private machine path, no
  provider or model policy.

Router: add one bullet under `## Roles And Stances` in
`workbench/wiki/MEMORY.md` of the form
`- [Director: coordinate Spec-bound Dispatchers and integrate reviewed results](skill-director.md) ([S-002C](../specs/S-002C-director-role/SPEC.md))`
after the existing roles-and-stances sentence. Sibling lanes add their own
bullets in the same section; keep the section heading unchanged.
`templates/wiki/MEMORY.project.md` and `MEMORY.root.md` are generic and do
not list this room's articles; do not edit them.

## Scenario Contract

The Spec's Testing Seams: two Dispatchers advance different Specs; one needs
a shared artifact changed. The Director assigns its writer, permits the
independent work, routes candidate review, and records the dependency and
result so a fresh agent on integration can continue. Add one out-of-scope
request.

- Fixture: a disposable Git room outside this repository (a temporary
  directory), never a real room and never this repository. It holds a small
  manifest-shaped `workbench/specs/` lane with two active Specs, each with one
  in-progress Task and a named Dispatcher, one shared artifact both Tasks
  must change (for example a shared tool file or the Wiki router), an
  `integration` branch, and a pinned commit. Scripted inputs are text files
  in the fixture: Dispatcher A's report asking to change the shared artifact,
  Dispatcher B's report also touching it, and a third message asking the
  Director to merge integration into main (or to take over a Spec outside the
  assignment). Prepare the fixture before the run and record its pin.
- Run: one fresh-context general-purpose agent, given only the delivered
  skill text (paste it), the fixture path and pin, the scripted reports, and
  the instruction to act as the Director for the two named Specs. Do not give
  it this Task, the Spec, or the article. It may write into the fixture.
- Observe and record: which writer it named for the shared artifact and
  where it recorded that decision (a tracked owner in the fixture, not only
  its reply); whether it let the other lane proceed on its independent files;
  whether it routed the candidate review to a context other than the
  building Dispatcher and named the candidate SHA; whether it refused or
  reported the out-of-scope request rather than performing it; whether it
  executed any Task itself; the fixture's `git status` and log afterwards.
- Do not claim owner approval, agent-outcome improvement, or reliability;
  one run, one model, scripted owner. Hand the observation back verbatim for
  the Dispatcher to write into the Spec evidence.

## Smallest Concrete Path Set

| Path | Minimum necessary change |
|---|---|
| `workbench/wiki/skill-director.md` | New article, contract above. |
| `workbench/wiki/MEMORY.md` | One bullet under "Roles And Stances". |
| Disposable fixture outside the repository | Scenario setup and run; nothing committed here. |

## Done Criteria And Closing Proof

- `node workbench/tools/wiki.mjs validate` ok; `node tools/test-wiki.mjs`
  green; `node workbench/tools/spec-workbench.mjs doctor` no blocking
  finding; the full AGENTS suite green on the committed candidate with SHA
  and log path.
- The scenario observation, fixture pin and limits handed back verbatim.
- Docs status from the actual diff: the article and the router bullet;
  `roles-and-stances.md` checked with the reason no update is needed (it
  routes to this Spec already and carries no live progress).
- The Worker self-checks and hands back the exact SHA, proof text, docs
  status and remaining gap to the Dispatcher, who remains the single writer
  of `SPEC.md`, this record and the rendered projections. The Worker does not
  review or approve its own candidate and does not merge.

## Remaining Gaps

- Cross-links among the four new role and stance articles are added by the
  last lane to land (S-002G), not here.
- Installed personal copies of the skill are not updated by a source change.
