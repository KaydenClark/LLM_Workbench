---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Landmark
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
  - workbench/wiki/design-concepts/landmarks-one-size-above-specs.md
last_verified: 2026-10-07
---

# Landmark: the map at its largest scale below the Blueprint

A landmark is a direction toward the destination, written down as a
`LANDMARK.md` artifact. It is shaped like a Spec, a product requirements
document with a destination and success criteria, but covers far more ground:
it says where a whole area of work is going and what success looks like there.
The canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Landmarks and Specs are the map at different scales; Tasks are the steps. A landmark forms when groupings appear in the DQCs and DDRs, parents Specs (nested in its `specs` folder) and may hold Tasks directly (in its `tasks` folder), and retires into its Landmark Wiki page once reached and all its children are done. A Spec or DDR has at most one landmark, otherwise it sits under the Blueprint. A landmark is a lane, not a branch, reviewed one size above a Spec. Its statuses are `planned`, `active` and `reached`, and its identifier prefix is `LMK-`. The JSON landmark records in the Landmark Tracker remain until their migration into question cards ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md); [the Landmarks article](design-concepts/landmarks-one-size-above-specs.md)).

**Neighbouring words.** A landmark is one scale of [Map](dictionary-map.md);
a Spec is the smaller one, and the Tasks under either are the steps. It forms
from [Destination Question Cards](dictionary-destination-question-card.md),
and once reached it retires into its
[Landmark Wiki page](dictionary-landmark-wiki-page.md). Its edge of open,
unblocked Tasks is the [Frontier](dictionary-frontier.md). Landmarks are
architecture artifacts, scaffolding cleared away once their knowledge is kept
([Clean Up](dictionary-clean-up.md)), so they need confirmed enduring context
behind them rather than the whole workflow ([Writer verb](dictionary-writer-verb.md)).

**In use.** This room's landmarks live under `workbench/landmarks/`, one folder
each: for example `LMK-001I-owner-idea-alignment/LANDMARK.md`, the Owner Idea
Alignment landmark, status `planned`. The Lexicon retirement decision names its
landmark as "Repo is the System of Record" (`LMK-000Y`). A Spec moves under a
landmark with `spec-workbench.mjs move-spec S-### --landmark LMK-###`, and a
reached landmark retires with `retire-landmark LMK-### --wiki PAGE`.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): the artifact, nesting, statuses and retirement.
- [Landmarks: the LANDMARK.md artifact one size above a Spec](design-concepts/landmarks-one-size-above-specs.md): the full account.
- [LANDMARK.md Artifact And Lane Runtime (S-003Z)](../specs/S-003Z-landmark-md-artifact-and-lane-runtime/SPEC.md): the Spec that delivered the artifact and its commands.
