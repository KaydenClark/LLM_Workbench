# Harness Feedback Report Format

A report is an evidence-backed assessment of an assigned harness target. Store
it in the feedback lane declared by `workbench/manifest.json`, with a descriptive
name such as `REPORT-topic-date.md`. This file describes the format, not findings.
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
