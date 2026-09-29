# TK-002Y - Route the dispatcher Wiki article and record the fresh-context Dispatcher scenario

**Task ID:** TK-002Y
**Spec ID:** S-002D
**Slice:** Route the dispatcher Wiki article and record the fresh-context Dispatcher scenario
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** wiki-claim: workbench/wiki/skill-dispatcher.md routed from the Roles And Stances section of workbench/wiki/MEMORY.md, carrying the observed fresh-context scenario and its limits (S-002D box 6)
**Planned verification:** Red: `node workbench/tools/wiki.mjs validate` passes today with no dispatcher article, and `workbench/wiki/MEMORY.md` has no route to one; a fresh agent from integration cannot find a Dispatcher operating explanation. Green: the article validates with its frontmatter, provenance and repository-relative source paths; MEMORY.md routes it under Roles And Stances; one fresh-context agent given only the dispatcher skill text and a scripted fixture room outside the repository performs the Testing Seams scenario (two independent vertical slices, one shared contract file, a named shared writer, concurrent compatible Workers, accumulated results, Spec verification, candidate handed to a scripted Director), and the observation with its limits is recorded verbatim enough to check.

## Outcome

A fresh agent from integration discovers `workbench/wiki/skill-dispatcher.md`
through the Wiki router, reads what the Dispatcher role does, its inputs,
outputs, hand-back and escalation, and finds one recorded fresh-context run of
the Spec's scenario with its limits stated. Nothing in the article claims owner
approval or an agent-outcome improvement.

## Required Behavior

- Article shape follows `workbench/wiki/skill-auditor.md`: frontmatter
  (`type: memory`, `status: active`, `sensitivity: normal`,
  `knowledge_role: curated`, provenance, `source_paths` naming only files
  that exist on the candidate, `last_verified`), then inputs, output, done
  condition, how it works, composition, verified behavior and limits, sources
  and history. Link a sibling capability that has not landed by its Spec path
  only.
- `workbench/wiki/MEMORY.md` gains one line under `## Roles And Stances`
  routing to the article; the existing design-concept line stays.
- Scenario, from S-002D Testing Seams: a disposable Git fixture room outside
  the repository holds a Spec with two independent vertical slices and one
  shared contract file. The fresh-context agent receives only the dispatcher
  skill text, the fixture path and a scripted Director/owner instruction. It
  must plan the slices, name the shared writer, run compatible Workers
  concurrently (its own subagents, or sequentially with the host limitation
  reported if it cannot spawn), accumulate their results, verify the fixture
  Spec and hand the candidate to the scripted Director. Include one
  out-of-scope request (a neighbouring fixture Spec it must not edit) and one
  conflicting-writer case (both slices want the shared contract file) so the
  hand-back shows the boundary and the serialization.
- Record what was observed: whether the shared writer was named before
  Workers ran, whether the neighbouring Spec stayed untouched (git status and
  diff of the fixture), whether the shared file had one writer, what the
  hand-back contained, and what the agent could not do. Record the limits:
  one run, one model, scripted owner, host default instructions still present.
  Routing and string checks support discovery but do not prove role behavior.

## Smallest Concrete Path Set

| Path | Minimum necessary change |
|---|---|
| `workbench/wiki/skill-dispatcher.md` | New routed article. |
| `workbench/wiki/MEMORY.md` | One router line under Roles And Stances. |
| Disposable fixture outside the repository | Scripted setup for the scenario; nothing from it is committed. |

The skill text used for the scenario is the Dispatcher's content brief; if the
text that lands under TK-002X differs, the Dispatcher records the delta with
the scenario evidence.

## Done Criteria And Closing Proof

- `node workbench/tools/wiki.mjs validate` passes on the committed candidate;
  `node tools/test-wiki.mjs` passes.
- The scenario observation and its limits are handed back in a form the
  Dispatcher can paste into the Spec evidence row: fixture pin, prompt shape,
  what the agent did, fixture git state afterwards, hand-back contents, limits.
- Exact SHA, files touched, docs status and remaining gap handed back to the
  Dispatcher. The Worker does not review or approve its own candidate and does
  not merge.

## Remaining Gaps

- Cross-links among the four role/stance articles are added by the last lane
  to land (S-002G), not here.
