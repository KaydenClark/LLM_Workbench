# Harness Feedback Report Format

A report is an evidence-backed assessment of an assigned harness target. Store
it at an explicitly supplied destination when an independent review application
owns the evidence; otherwise use the feedback lane declared by
`workbench/manifest.json`, with a descriptive name such as
`REPORT-topic-date.md`. This file describes the format, not findings.
Use the existing assigned spec for accepted follow-up work and current gates.
A report never repairs its target or grants repair or automated-merge authority.

## Target And Scope

Name the assigned spec, exact target revision, inspected paths, report date,
question being answered, and method. If inspecting uncommitted work, identify
that limitation and use content hashes for the inspected files; do not call it
an exact committed candidate review.

## Evidence And Limitations

List executed commands and actual results, source references, and evidence
limitations. Distinguish observed behavior, inferences, historical evidence and
hypotheses. Static checks do not establish agent-outcome improvements.

## Findings

Order supported findings by impact. For each, give its ID, severity, location,
claim, reproduced effect or demonstrated impact, and the smallest bounded next
action. Explain why the harness causes the friction when making that causal
claim. Report no findings when that is what the evidence supports; do not
invent work or label every limitation a defect.

Finding identifiers are report-scoped. Cross-report aggregation keys on the
report identity plus finding ID, or on an explicit shared recurrence key; a bare
`F-001` never silently aliases another report's `F-001`.

A claim about a skill names the copy it was read from. A Canon claim cites
the canonical `skills/<name>/SKILL.md` path and the commit read; a claim about
an installed copy says so and names the discovery root (for example
`.agents/skills` or `.claude/skills` under the user home) and, when present,
the `release` and `commit` in its `.workbench-skill.json` marker. Text read
from an installed copy is evidence about that host, never about the release.

## Challenged Or Rejected Findings

Record consequential claims considered but unsupported, contradicted, or outside
scope, with the evidence that changed the conclusion. Do not quietly repair the
target while reviewing it.

## Next Action And Open Questions

Point to the existing spec for accepted work, or clearly state that a proposed
repair awaits owner authorization. Name the next executable action or blocker.
Cold continuation follows the report and linked spec without the original chat;
it does not create a new task or a universal handoff artifact.

## Review Boundary

A separate-context reviewer checks consequential claims and recommendations
with the fixed candidate before integration. Earlier reviews are supports,
not mandatory independent ceremonies. Record actual review coverage and limits;
never manufacture an independent PASS from self-review.

## Models And Evidence States

Record `evaluated_model` separately from `reviewer_model`, plus the actual
host/application, configuration, OS and tested revision. For a structural
inspection with no evaluated model, use `not-applicable`; when unknown, say
`unknown`. The reporting agent's model is not automatically the evaluated one.

Label each claim's evidence: source inspection, observed use, behavioral test,
or repeated outcome trial. Record passed, failed, unavailable, interrupted,
inconclusive and missing-evidence states without turning absent proof into a
pass. A host operation succeeding proves that operation in that configuration;
it establishes neither forbidden-operation enforcement nor future model reliability.
An execution failure alone does not identify a harness defect: reproduce the
failing assumption and separate environmental limits from causal findings.

One finding may have several observations and recurrences. Preserve each
observation's target revision, scope and state. `not-retested` is not `resolved`;
closing a finding requires the relevant correction and verification. Existing
report keys disambiguate occurrences; they do not implement a central longitudinal
finding store. Independent review applications may own that store; this portable
format keeps a standalone destination and imposes no service prerequisite.
