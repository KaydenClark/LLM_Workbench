# Reconcile achieved work into existing owners

Use this reference from the assigned Reconciler stance. It adds no authority,
state store or required report format. Read the project's Contract and selected
Spec/Task first; resolve paths through its manifest. A portable skill cannot
assume this repository's current branch topology applies to every room.

## Establish the achieved output

Name the repository, actual output, requested endpoint and relevant comparison.
For Git work, resolve the supplied base and candidate to immutable commit SHAs.
Do not substitute HEAD when either is missing. Keep dirty or untracked output
separate from committed proof and preserve unrelated work. These observations
run from the selected repository, with caller-supplied shell variables. Enter
that repository's verified working root first, then define this Bash helper in
the same shell as the observations:

<!-- check:git-helper -->
```bash
reconcile_git() (
  for name in "${!GIT_@}"; do
    unset "$name" || return
  done
  command git --no-replace-objects -c core.fsmonitor=false "$@"
)
```

The subshell clears inherited `GIT_*` settings only for this observation. In
particular, repository/worktree/common-dir/index selectors, object stores,
replacement namespaces and injected configuration must not silently select a
different evidence source. The caller's environment and repository metadata
stay unchanged. `--no-replace-objects` disables replacement refs for every
operation: otherwise Git can print the requested SHA while reading another
commit's tree or ancestry. Disabling diff helpers alone does not prevent that.
Use this helper consistently for pins, owner reads, comparisons and containment;
do not fall back to a plain Git read when a protected observation fails. This
assumes a trusted Git executable and shell; it is not a general sandbox for
arbitrary repository tools. The status read also disables filesystem-monitor
callbacks from repository configuration.

<!-- check:pin -->
```bash
reconcile_git rev-parse --verify "${BASE_SHA}^{commit}"
reconcile_git rev-parse --verify "${CANDIDATE_SHA}^{commit}"
reconcile_git status --porcelain=v1
```

Record the returned SHAs and use those full values for subsequent commands.
Read the exact comparison without running target-controlled diff helpers:

<!-- check:compare -->
```bash
reconcile_git diff --no-ext-diff --no-textconv "$BASE_SHA" "$CANDIDATE_SHA" --
```

Read an evidence owner at the achieved revision; `OWNER_PATH` is its
repository-relative path from the selected packet, not an assumed root folder:

<!-- check:owner -->
```bash
reconcile_git show "${CANDIDATE_SHA}:${OWNER_PATH}"
```

A failed read leaves that evidence unavailable. Record the failure and inspect
the existing route within scope; do not silently replace it with a different
tree. Current controls still govern actions, while historical claims read at
their stated revisions. For non-Git output, name its accessible stable locator,
observed content or digest and verification limits; do not invent a commit.

## Resolve claims without losing their history

For each material mismatch, identify the claim, its current owner, supporting
evidence and whether the proposed correction is already authorized. Apply the
Contract's State Resolution: newer accepted Canon with older implementation is
an implementation gap; newer verified Actuality with older documentation is
documentation drift; unclear ordering stays an ambiguity to investigate. Date
alone, a checked box, a note or a green unrelated test cannot decide this.

- Update supported current-facing claims in their owners. Append corrections
  and new evidence without rewriting append-only rows or completed proof.
- Keep an unmet criterion open. A source fix, scenario result, full suite,
  independent review, integration containment and owner Human QA prove different
  things. Record the command, tested revision, result and limits together.
- For feedback findings use the project's governed **Feedback Dispositions**
  from its `GLOSSARY.md`, with one disposition, reason, owning Spec and evidence
  route per finding. Preserve accepted-open work and explicit ownership gaps;
  do not silently decline a finding, schedule a repair or invent a new category.
- Respect pending, disputed and superseded meaning. Keep unresolved notepad
  entries and corrections/dependencies; promotion does not confirm an answer.
  No private artifact transfer is implied. An inaccessible local record is an
  access limit, not durable evidence for another context.
- Do not repair another writer's lane. Supply the needed claim, its evidence
  and destination to the assigned writer, keeping that reconciliation gap open.

Use the room's existing receipt/render/doctor and documentation procedures after
authorized owner edits. A generated projection cannot repair its source. No
universal handoff, second task queue or extra approval ceremony is introduced.

## Preserve candidate and review boundaries

Read the actual branch-route exception and review gate in the current controls.
Record the reviewed base/head and any required assembled content digest. A new
candidate needs a fresh review; earlier review remains historical support, not
approval of changed content. Changing stance does not make an author independent.
Reconciliation alone never supplies a PASS, owner approval, Task close, Spec
completion or release. Use the existing lifecycle commands only when their
actual prerequisites and the request's endpoint permit them.

When integration containment is relevant, refresh its ref through the authorized
remote path and resolve its SHA before this read-only observation:

<!-- check:containment -->
```bash
reconcile_git merge-base --is-ancestor "$CANDIDATE_SHA" "$INTEGRATION_SHA"
```

Exit 0 proves ancestry in the observed target, not review, unchanged assembled
content or approval. Exit 1 means not contained; other failures mean the check
could not establish containment. A stale local ref cannot prove current remote
state. Verify remote recovery separately when required; do not bypass credentials
or transport limits to turn an inaccessible destination into a success claim.

## Read back for continuation, including inability

Follow the ordinary entry route to the assigned Spec/Task, achieved output and
named proof. Confirm that a reader can state the exact result, current state,
checked and unrun verification, unresolved claims and one next executable action
or blocker without the conversation. The Wiki explains the capability and links
its owners; it does not copy live state or Spec evidence.

If a required read, write, verification or persistence step is unavailable,
record what was attempted and its actual result, the safe recovery point, what
remains unverified, and the smallest next action in the existing owner. Keep
dependent work open, retain needed context, and continue independent authorized
work. Ask for a genuine missing decision or resource only when it is required;
do not invent permission to compensate for uncertainty. A requested handoff may
compose the handoff skill with accessible safe content, but a stance switch or
inability alone does not create one. Normal Task handback remains proof to the
assigned coordinator under the governing route, not an extra Task approval.
