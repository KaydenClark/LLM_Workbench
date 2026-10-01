# S-01R reviewer rebuild evidence

The reviewer stance now makes accepted eligibility, immutable candidate binding,
evidence classification and inability hand-back explicit. The implementation
is review-only and composes the existing code-review method. No new workflow,
role, runtime, manifest, identity or shared control meaning is introduced.
Core skills are the portable source; no generic control/template change is
needed because this patch expresses existing accepted contracts.

## Source and evidence

- Integration base: `d90785908b26517068a474bb88136c81995a2f18`.
- Existing TK-01I activation: `c1b0f08a`; remote native claim:
  `41c39c6f79ab24d195100458a99136064efb1471`.
- Skill/article/test source: `02a30100443e725cbb1baad6fe5e771bfe85f648`.
- [Source red/green](source-regression.json): structural wording/route checks,
  explicitly not behavioral proof. Original red 0/3; corrected green 3/3.
- [Fresh-context scenario](scenario-observation.md): exact synthetic candidate,
  observed findings, commands, preservation check and limits. Recreate inputs
  with `node workbench/specs/S-01R-reviewer-skill-rebuild/proof/scenario.mjs`.
- [Pre self-drift](self-drift-pre.json) and [post self-drift](self-drift-post.json).
  Source revision, dirty state and findings are recorded by the real tool.

## Required verification

The exact command union is extracted from AGENTS.md's full-suite block and
RUNBOOK.md's Full verification block at the source candidate, preserving order
and removing duplicates. The union contains 51 commands. Three additional
scoped commands are reviewer-stance, delivery-skills and Wiki validation.
The dated result matrix will record every actual exit and immutable run source.

An initial working-tree sweep started before the source commit. Four installers
refused `invalid-source-identity` because skill source was uncommitted; this
was an execution-precondition failure, not a pass. Preserve that sweep and run
the exact full union again from the committed candidate. No criteria were
weakened, environment refusals bypassed or runtime fixes introduced.

## Drift, documentation and boundaries

Bounded semantic inspection follows root entry to accepted role/stance meanings,
review/closure procedures, release Task-PR exemption, S-01R source/article and
native Task state. Planning-only current state is reconciled in S-01R; old
planning evidence remains append-only. The native claim/render updates only
S-01R's generated Taskboard/catalog state. MEMORY is untouched: the coordinator
owns the single route hunk `- [Reviewer](skill-reviewer.md)` beside the other
individual skill articles. That missing route remains an explicit open gate.

The baseline has seven existing findings: S-00Q stale claim, five historical
seed identities and one historical adoption provenance mismatch. These belong
to other owners; no global clean-update claim is made. Guardrail score before
and after is 78/100. Remaining recommendations are repeated real outcome
trials, matched controls/prior/candidate comparisons, recent observations and
uncertainty reporting. Static score and this single scenario cannot establish
improved agent outcomes.

Independent review of this rebuild is pending. No verdict/approve/close/complete
or merge was performed. TK-01I stays in progress until its full acceptance,
coordinator route and independent gate are satisfied. Owner Human QA and main
remain owner-only. Private scenario transfer is still approval-gated; no raw
private material was used or exported. This packet is a draft hand-back, not a
release or whole-Spec PASS.

## Review hand-back

Compare this branch against the integration base above and pin its final remote
SHA. Review source, bundled reference, individual Wiki, owned Spec/Task/proof,
focused tests and native S-01R projection deltas. A changed SHA or assembled
digest needs fresh review. Coordinator should assemble the reserved MEMORY
route and account for subsequent integration drift before presenting that new
candidate. Main and carry remain untouched.

Git publication works in this saved Workbench; `gh pr list --head
codex/s01r-tk01i-reviewer-rebuild --json number,url,isDraft` returned GraphQL
`Forbidden`. If draft creation is likewise unavailable, parent Servitor can
open the draft from the verified public branch. No API bypass is required.
