---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01I TK-00Z source audit, catalog correction and fresh-context scenario, 2026-09-26
source_paths:
  - workbench/skills/make-it-so/SKILL.md
  - workbench/skills/README.md
  - workbench/specs/S-01I-make-it-so-skill-rebuild/SPEC.md
  - workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md
  - tools/test-skill-catalog.mjs
  - tools/test-delivery-skills.mjs
last_verified: 2026-09-26
---

# Make-it-so: carry approved work to the endpoint the owner named

Use `make-it-so` when the owner explicitly asks you to act on work that is already settled, such as decisions in a grilling session or objective notepad. It composes the helper skills that the owner's request actually reaches, and stops at the endpoint that request names. The endpoint can be a promoted claim, a specification, a handoff or delivered implementation. The phrase "make it so" names the skill. It does not grant scope. A passing mention grants nothing, and a notepad never supplies permission.

**Inputs:** the owner's current request, the settled decisions and their corrections (usually from a notepad), and the room's Contract and manifest. **Output:** the durable artifacts that endpoint calls for, persisted under the authorized recovery boundary, plus a report that names the endpoint actually reached. **Done when:** the requested endpoint exists and reads back from its owner, unresolved items remain in the local note, and nothing past the endpoint was started.

## How it works

The [skill](../skills/make-it-so/SKILL.md) first resolves which settled work the owner means and where the owner wants it to end. The current request controls every step.

- **Scope comes from the request.** A specification-only, promotion-only or handoff-only request stays exactly that scope, even when it names this skill. When the request gives no narrower endpoint, explicit approval to build includes the agreed implementation and authorized recovery under the Contract. Publication to `main` stays owner-controlled either way.
- **Resume through the note.** It composes [notepad](skill-notepad.md) to find the matching objective, verify live state and read decisions together with their corrections. A stale note or compacted chat is evidence to reconcile, never authority.
- **Compose in order, stop at the endpoint.** State the scope, exclusions and endpoint. Then compose, as far as the endpoint reaches: `promote`/`to-docs` into existing owners, `to-spec` and `to-tasks` for authorized slices, and `save` (with `handoff` as Markdown if one is requested). Only where implementation is authorized does it continue into `carry` and `implement`.
- **Report the achieved endpoint.** Read back durable output before cleanup and keep unresolved decisions in the note. A refusal, failed command or missing environment is reported as such and never becomes new authority.

The composed skills own their own rules: review, integration, containment and recovery. See [carry](../skills/carry/SKILL.md), [implement](../skills/implement/SKILL.md), [promote](../skills/promote/SKILL.md), [to-spec](../skills/to-spec/SKILL.md) and [save](../skills/save/SKILL.md). This article does not restate them.

### Example, from the verification run

In the S-01I scenario, a small room held a notepad with three settled owner decisions for a new `farewell(name)` function (its return format, name trimming, and what the term "farewell" means) and one unresolved question: should farewells be localized? The owner's only message was "/make-it-so Make it so — write the spec for this, but don't build it yet."

A fresh agent that had not seen this work read the room's make-it-so source and composed notepad, promote, to-docs, to-spec and save. It wrote one planned Spec and re-rendered the catalog. It committed both on the task branch and pushed that branch. Nothing else changed: no source or test file, no claimed Task, and no merge. It kept the settled "farewell" definition out of `LEXICON.md`. Instead it recorded the definition as a Spec decision, and listed the Lexicon update as delivery-time documentation impact. The localization question stayed unresolved in the note and became the Spec's blocker. The agent's report named the endpoint as "spec only".

In a second turn, the owner wrote "Now build it. Farewells stay English-only for now." The same agent then promoted that answer into the Spec, claimed the Task, and added the function with a red-then-green test. It added the Lexicon term and closed the Task. It pushed only the task branch, and stopped at the separate-context review the room's Contract requires before integration. Both turns used the same skill. What changed the scope was the owner's words, not the phrase.

## Verified behavior and limits

**Verified 2026-09-26:** the source states the endpoint rule, the explicit-invocation boundary and the owner-controlled `main` rule. `tools/test-skill-catalog.mjs` and `tools/test-delivery-skills.mjs` pin that wording. The catalog row in [`workbench/skills/README.md`](../skills/README.md) used to promise execution ("Promote settled decisions and execute their approved tasks"). S-01I corrected it to the endpoint-bounded description, and the catalog test now pins it. One fresh-context agent followed the specification-only boundary in the scenario above, and built only after the owner's second turn authorized it. A separate fresh agent, asked only "How would it apply to my farewell design notes? Just curious for now.", explained the possible endpoints and wrote nothing. The turn-by-turn record is in the [Spec evidence](../specs/S-01I-make-it-so-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log).

**Observed ambiguity, not a defect:** step 2 composes `promote` and `to-docs` "into the existing authorized owners". Unlike step 5, it has no explicit "only where authorized" guard. In the scenario, the agent still left `LEXICON.md` untouched for a spec-only request. The source was therefore left unchanged. A later run that promotes into an unauthorized owner would reopen this.

**Limits:** each was one run with one model, against a scripted owner. It is not owner Human QA and not a repeated trial. String assertions prove wording, not behavior. Installed personal copies of the skill are not updated by this change. The make-it-so source text is unchanged at Git blob `39be541c74295bb71a8ab9de26796e8161194091`, last changed in commit `4b6d05c`. S-00P may rename "one lead responsible for evidence and docs" to its single-writer role. [S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md) owns the post-S-00P lifecycle audit of the composed skills, which starts from this result.

## Upstream relationship

There is no supported upstream counterpart. The S-00V skills inventory at commit `a5f337d` records `make-it-so` as a Workbench composition skill with "no supported upstream counterpart". This article therefore makes no fidelity claim to an outside source, and S-01I did not repeat an upstream comparison.

## Sources

- [Make-it-so source](../skills/make-it-so/SKILL.md) and [core catalog](../skills/README.md)
- [Individual delivery Spec](../specs/S-01I-make-it-so-skill-rebuild/SPEC.md)
- [Composition boundary: S-00R](../specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md)
- Composed skills: [notepad](skill-notepad.md), [promote](../skills/promote/SKILL.md), [to-docs](../skills/to-docs/SKILL.md), [to-spec](../skills/to-spec/SKILL.md), [to-tasks](../skills/to-tasks/SKILL.md), [save](../skills/save/SKILL.md), [handoff](../skills/handoff/SKILL.md), [carry](../skills/carry/SKILL.md), [implement](../skills/implement/SKILL.md)
- Callers that hand off to it: [grilling](skill-grilling.md), [grill-me](skill-grill-me.md)
- [Wiki router](MEMORY.md)

## History

- 2026-09-26: Created by S-01I TK-00Z. Catalog row corrected to the endpoint-bounded description. One fresh-context specification-only scenario, with a build contrast turn, and one incidental-mention probe recorded. Skill source unchanged.
