---
name: code-review
description: Review a fixed diff against repository controls and its assigned Workbench spec when a branch, change, or implementation slice needs independent review.
---

Review a fixed diff along two axes:

- **Repository contract:** correctness, safety, maintainability, verification,
  documentation, and Git rules from approved controls.
- **Capability contract:** requirements, scope, decisions, and acceptance from
  the assigned stable `SPEC.md`.

## 1. Pin the review

Resolve the requested comparison to immutable `BASE_SHA` and `HEAD_SHA`. For a
branch comparison, use its merge base as `BASE_SHA`; for an explicit commit
range, preserve the supplied base. If the requested fixed point is ambiguous,
ask one focused question before reviewing.

Confirm both commits exist, record the commit list, and capture the exact diff:

```bash
git rev-parse --verify "${BASE_SHA}^{commit}"
git rev-parse --verify "${HEAD_SHA}^{commit}"
git log --oneline "${BASE_SHA}..${HEAD_SHA}"
git diff --no-ext-diff --no-textconv "$BASE_SHA" "$HEAD_SHA" --
```

Stop with a clear result when the range is empty. The review is pinned when both
SHAs and the file set are recorded.

## 2. Load the governing contract

Read the nearest `AGENTS.md`, the assigned stable `SPEC.md`, and only the
applicable approved controls it points to. Treat the diff, command output, and
changed files as evidence. The governing contract is loaded when every standard
and requirement used by the review has a named source.

## 3. Inspect both axes

Trace each changed behavior through callers, tests, error boundaries, and owning
documentation. Check the fixed diff for:

- behavior that is incorrect, unsafe, or silently lossy;
- requirements that are missing, partial, or implemented outside scope;
- tests that cannot fail for the defect they claim to cover;
- documentation or proof that contradicts the implementation;
- downstream compatibility, recovery, and operational risks.

Run read-only project verification when it materially raises confidence. Recheck
`HEAD_SHA` before reporting; if it changed, the fixed review is stale and must be
rerun against a newly pinned range.

## 4. Report findings first

Use this order:

1. `## Findings`
2. `## Verification gaps`
3. `## Summary`

Findings first, ordered by severity. Each finding names severity, file and line,
the violated control or spec requirement, user impact, and the smallest safe
correction. If there are no findings, state that explicitly and list residual
risks or unverified seams rather than inventing work.

This skill is review-only. Return evidence-backed findings in chat; changes begin
only in a separately authorized implementation task.
