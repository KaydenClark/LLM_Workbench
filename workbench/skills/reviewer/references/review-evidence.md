# Review evidence and hand-back

Use the assigned controls and `/code-review`; this reference adds no authority,
new workflow, required review service or machine-verifiable report format.

## Fix the question and evidence

Record the requested scope and gate, independent-review eligibility, exact
base and candidate SHA, and changed file set. For an assembled Spec also
record the report's content digest and the Spec/Task records it covers.
Verify both commits exist. An empty comparison is an explicit empty-range
result, not proof that all acceptance passed. If the requested comparison is
ambiguous or unavailable, return the missing facts without guessing a pin.

Read the candidate at the pin, not a moving branch label. Before reporting,
recheck that the requested candidate and digest still match; changed content
needs a fresh review, and a rebase that leaves the content unchanged needs no fresh review. Preserve the old report as history, never transfer its PASS.
Tests run on a different or dirty checkout must say so and cannot silently
stand for checks of the pinned candidate.

Keep evidence classes distinct:

- Source inspection proves what the inspected revision says or implements.
- A deterministic test proves its exercised seam and inputs. String assertions
  check a source contract, not an agent's decisions.
- A behavioral observation records what an actual agent did in the named host,
  configuration, installed/source revision and scenario. An explicit path does
  not prove automatic discovery. A single run is not repeated reliability.
- A source review, suite, fixture or behavioral sample is not owner Human QA,
  assembled delivery, remote acceptance or main approval.

Trace consequential claims to original checks or tool-call/result pairs where
available. Distinguish not attempted, approval rejected before execution,
command failed, local success and independently read-back remote acceptance.
Name missing or truncated evidence; a summary's silence proves no absence.
Do not transfer private scenarios or raw records without the required approval.

## Findings and limits

Follow `/code-review`'s Findings, Verification gaps, Summary order. Each finding
has severity, a pinned `path:line@<sha>` or equivalent exact evidence locator,
the violated control or acceptance requirement, user impact and the smallest
safe correction. Put blocking consequences first; severity follows impact,
not how easy the correction is. Use the project's severity scale if declared;
otherwise explain the urgency in plain language instead of inventing a rubric.
Mark a reproduced finding **proven**, with its command, failing input or trace.
Mark inference **uncertain**, explain the missing evidence and what would
settle it. Do not present uncertain suspicion as a reproduced failure.

When there are no findings, say **no findings** within the examined scope,
then list unverified seams and residual risks. A missing check is a verification
gap; if it prevents the required gate, do not report that gate as passed.
Remain read-only on the candidate. Findings authorize no repair or release.

## Inability and return

Return an inability hand-back when the fixed candidate, required evidence,
permitted checks or independent eligibility cannot be established. Name the
exact unavailable item, attempted operation and result, completed scope,
remaining uncertainty, and the responsible author, Dispatcher, Director or
owner who can supply it. Continue safe independent checks when useful; do not
manufacture a verdict, bypass a refusal or invent another Task.

Return findings to the author for authorized correction, Task self-check to
the Dispatcher, and the assembled result to the assigned Director review gate.
Preserve ongoing or failed Human QA findings in their owner. The owner alone
approves and promotes to main; a Reviewer report never performs those actions.
