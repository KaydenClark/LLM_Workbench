# S-00I Directory Link Correction

The independent assembled review of `f7361483b445d7295399cc7e81fecd1abe77f958`
failed on one P2: successful Spec and Task retirement left live links to the
record directory at its old path. Paired `SPEC.md` or `TASK.md` links rewrote
correctly. The reviewed tree was
`7b10d435185cc1fa78538dcc218058de74688b75`; the S-00I digest was
`566a88c34996a40ba5358a3f4ed3a78e38f6372489bd021fabf5a2fcd0f14a4a`.
The fail receipt is retained in the Spec's append-only log. Existing TK-003L
owns this directory-target refinement; no additional corrective Task is used.

At that commit, `workbench/tools/spec-workbench.mjs:2079–2085` and
`:2209–2215` populated relocation maps with files only. The shared
`workbench/tools/adr.mjs:547` left unmapped targets unchanged. This primitive
gap predates the checkpoint and affects its newly supported managed skills.

## Red And Green

`tools/test-lifecycle-directory-links.mjs` drives the public lifecycle seams in
fresh managed-layout Git fixtures. With a clean checkout of the reviewed base
passed as `--source`, both commands exit 1 at the named moved-root assertion:

```bash
node tools/test-lifecycle-directory-links.mjs --source ../review-f736 --kind spec
node tools/test-lifecycle-directory-links.mjs --source ../review-f736 --kind task
```

Here `../review-f736` must resolve to a clean checkout of the exact reviewed
commit. This is the runtime source, not a substitute implementation or an
uncommitted producer. Both reds were observed independently before the fix.

At code checkpoint `48ce1da55c28dd6d5f35bd604e72a2b8ad4ceff6`, the focused
command exits 0 and prints one passing line for each move:

```bash
node tools/test-lifecycle-directory-links.mjs
```

The command completes in under one minute. It is also imported by
`tools/test-spec-workbench.mjs`, so the existing full verification command
includes these regressions without introducing a separate unrun gate.

| Behavior | Observed proof |
|---|---|
| Managed and legacy incoming directory routes | Moved root and nested targets resolve; paired primary-record links remain correct. |
| URI and relative syntax | Bare routes, trailing slash, fragments, encoded spaces/hash/percent, self-directory and internal nested links retain their meaning. |
| Outgoing directory routes | Moved Markdown adjusts depth to an unmoved asset directory and repository root. |
| Unchanged live and external routes | An unmoved referrer keeps its original path spelling; external URLs remain untouched. |
| Immutable history | Historical directory-link bytes remain identical and both matches are counted. |
| Hard-linked incoming skill | A directory-only referrer refuses before rename; tracked bytes, index, HEAD, refs and external alias bytes remain unchanged. |
| Linked directory target | Refusal occurs before rename with the same Git/filesystem snapshot. |

## Correction Boundary

Only Spec and Task lifecycle moves build the new directory-target map. They
include the moving root and ordinary descendants, discover live outgoing
directory targets outside frozen history, and validate ordinary paths before
rename. Directory targets never enter the Markdown file-write list. Existing
write preflight checks changed file destinations before `git mv`.

The shared link formatter takes an optional directory-target set supplied
only by these lifecycle moves. ADR migration and identity widening keep their
previous default formatting. `applyIdentityWiden` and its file-only target map
are unchanged; that broader directory-link question belongs to S-01W's other
writer lane. No scanner policy, discard history, approval binding, templates,
version or real record lifecycle was changed.

## Remaining Gates And Limits

This is an in-progress correction checkpoint. Final frozen-candidate full-suite
verification, fresh separate-context safety and assembled review, integration
delivery and Task closeout remain coordinated gates. The implementing context
does not independently approve its final code. Owner Human QA remains ongoing
and unapproved; no main promotion or production disposal is implied.

Before and after the code correction, self-drift reports the same seven
findings: the existing S-00Q stale claim blocks a clean-update claim; five
historical seed findings and one provenance limitation remain. Guardrail audit
remains 78/100 with the same four repeated-outcome-evidence recommendations.
Focused correctness and static guardrail checks do not establish agent-outcome
improvement. The preflight guarantees do not add crash transactionality for
unexpected I/O after mutation starts.

The two intentionally conservative scanner findings in S-002C/TK-002Y remain
visible; this correction introduces no masking or allowlist. Original dirty
rooms and protected main/integration refs are preserved outside the isolated
Task worktree. Publication is limited to a checkpoint on existing draft PR226;
integration still requires the independent review gate.
