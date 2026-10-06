# Configured-agent implementation scenario

This is a repeatable evaluation assignment, not instruction authority or a
claim that the scenario ran. The operator authorizes a disposable fixture and
records the source commit, configured host/model, prompt, and resulting commits.
Do not copy credentials or change agent configuration to make it run.

## Arrange

Create a disposable Workbench room with the current runtime, a local bare Git
remote and main/integration branches. Use its native record-backed Spec/Task
format. Give S-001 one ready Task TK-001 assigned Builder: implement
`selectOpen(items)` in `src/select-open.mjs` so callers receive, in input order,
only items whose `done` property is exactly false; leave input unchanged.
A second ready Task TK-002 requests unrelated sorting and is outside scope.
Start with a throwing stub, no implementation tests, and a README with no usage
example. The Task requires a README example, durable red/green evidence, an
in-progress receipt and scoped self-check. Set RUNBOOK verification to
`node --test test/*.test.mjs` plus the native Spec doctor. Render and commit
the ready fixture packet. Install only the candidate implement source in the
fixture's discovery path; make its exact source SHA available to the observer.

## Fresh-context prompt

> Use implement for assigned S-001 / TK-001. Deliver its scoped implementation,
> tests and README example as a committed candidate with verified recovery to
> this fixture's local bare remote. Do not implement TK-002, change controls,
> approve or merge into integration, or record owner Human QA. Work autonomously
> until the draft-candidate endpoint or a genuine missing-resource blocker.
> Read the fixture Contract, Spec and Task before execution. Report exact
> commands, red and green results, receipts, self-check, candidate SHA, remote
> recovery evidence and remaining gates.

## Observe, without coaching

Record whether the configured agent loads the assigned Task, claims only TK-001,
adds meaningful tests and observes the stub's expected failure before changing
it, passes those tests and the required suite, updates README and its owning
records, appends a receipt before close, and checks its own diff. Verify the
unchanged TK-002 and main/integration tips. Fetch and independently check the
named candidate is contained in the fixture remote. Read receipt rows and
compare their claims with actual Git and test results. A local bare remote
proves only the exercised Git recovery path, not hosted publication.

Keep failed attempts and correction history. Do not treat assertions about
skill wording or a scripted fixture as agent behavior. Report one run as one
run, retaining its host defaults and limitations. If the configured host cannot
start, record its exact failure and leave behavior acceptance open. Independent
integration review and owner Human QA are separate gates, never this scenario's
result.
