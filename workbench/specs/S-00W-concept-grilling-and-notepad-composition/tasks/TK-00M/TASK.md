# TK-00M - Compose grilling with reusable notepad continuity

**Task ID:** TK-00M
**Spec ID:** S-00W
**Slice:** Compose grilling with reusable notepad continuity
**Status:** deferred
**Blockers:** TK-00L
**Destination:** spec-acceptance: S-00W Acceptance Criteria lines 5-6
**Stance:** Builder
**Planned verification:** Red: an entry/resume scenario loses whether the owner's answer is pending or confirmed, fails to preserve a correction, or requires a grilling-specific runtime for unrelated notes; green: grill-me starts grilling with revision-checked notepad capture, resumes at the correct decision, and unrelated notepad work remains valid. Run targeted notepad, core-composition, project-evidence and catalog checks, then the required suite; inspect installed distribution separately without asserting native invocation.

## Delivery

**2026-09-24 planning correction:** This original slice is retained as historical planning context and is not executable. S-00Y notepad and S-00Z grill-me now own the skill-sized delivery. Do not claim or close this Task as implementation proof.

After TK-00L establishes the inquiry contract, add a repository-owned `grill-me` entry at the then-current manifest skill source lane and compose grilling with the existing `notepad` primitive. Make the smallest notepad skill wording change needed to explain provisional capture, corrected readback and confirmed meaning for this composition while retaining independent objective use. Keep the existing runtime, schema, privacy scan, revision checks, corrections, resume and cleanup guarantees. Align manifest/catalog/distribution references with the canonical source and distinguish source from installed copies. Resolve source location against S-00V's landed layout and preserve S-00R's archive gate.

## Done Criteria

- `grill-me` provides a clear entry point for grilling plus notepad, within the caller's scope.
- Resume preserves pending versus confirmed meaning and linked corrections; silence never becomes confirmation.
- Notepad remains useful for an unrelated objective without grilling-specific fields or a runtime migration.
- Repository and distribution references name the actual canonical source; no global installation is claimed without separate proof.

## Preservation And Rollback

Do not migrate or rewrite live or legacy notes. If the composition fails, revert the new skill source and inventory changes together while leaving existing note bytes and the archived wrapper untouched.
