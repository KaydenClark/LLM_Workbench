# Upstream Summary Report - LLM Workbench v3.1.1

## Target And Scope

- **Target:** LLM Workbench, harness version **v3.1.1** as installed across the
  reviewed portfolio, checked against the source checkout `E:/LLM_Workbench` on
  branch `integration` at `b3633e5` (a **v3.1.2** candidate, unpublished).
- **Reviewing repository:** Audit Workbench (Master Workbench), branch
  `codex/restore-site-renderer` at `73a2407`.
- **Report date:** 2026-09-06.
- **Question:** Across the whole v3.1.1 feedback set, what does LLM Workbench
  still need to fix, and which items has the v3.1.2 candidate already closed?
- **Method:** Read all eighteen v3.1.1 reports in `workbench/feedback/`, plus
  the three rows already logged in `WORKBENCH_FEEDBACK.md`. Deduplicated the
  findings by cause, discarded the ones the sources themselves attribute to a
  project or to the host, then re-checked every surviving item against the
  current source at `b3633e5` and, where it could be reproduced locally,
  against this room's own installation. No reviewed project was written to; the
  source checkout was read only.

## Evidence And Limitations

- **Source set:** 18 reports (`agent_dvr_room_security`,
  `ai_agents_presentation`, `audit_workbench`, `budgeting`,
  `cashflow_calculator`, `cic_dashboard`, `digitaltome`, `dnd_api`,
  `dnd_client`, `dungeon_friends`, `gpt_os`, `local_agent_town`, `openbrain`,
  `peptides_website`, `personal_intelligence_platform`, `puffer_pond`,
  `resume_portfolio`, `timewell_prototype`), all dated 2026-09-05/06.
- **Outcome split:** 5 rooms produced installed-state v3.1.1 reviews (AI Agents
  Presentation, Audit Workbench, Cashflow Calculator, GPT_OS, Peptides
  Website). 13 stopped before any target mutation, every one of them naming the
  shared user-scoped `code-review` skill as the blocking gate; a fourteenth (AI
  Agents Presentation) hit the same refusal and recorded it as a benign false
  failure before completing its adoption. Of the 13, eleven met the refusal in
  the upgrade preflight (UP-016) and two in the core-skill installer (UP-015).
- **Reproduced in this room (2026-09-06):**
  - `node workbench/tools/spec-workbench.mjs doctor` printed 10 `error` lines
    and 1 `attention` line, then `ok - no blocking finding`.
  - `node E:/LLM_Workbench/tools/workbench-tools.mjs verify --project
    E:/Audit_Workbench` returned `tools-receipt-drift` with `reason: hash` for
    all 11 managed runtime tools, against a receipt naming v3.1.1 `fa04e27`.
    The same `doctor` run reported no blocking finding.
  - `node E:/LLM_Workbench/workbench/tools/workbench-layout.mjs` prints a usage
    string that now lists `--source-commit`.
  - Diffing `templates/feedback/REPORT_FORMAT.md` against this room's installed
    copy shows the upstream file corrected and the installed copy unchanged.
- **Limitations.** The eighteen reports assess **v3.1.1**; the source has since
  moved to a v3.1.2 candidate, so an item's status here means "verified in the
  source at `b3633e5`", not "verified in a published release". Five reports
  could not obtain a product baseline because the runner denied child processes
  (`spawn EPERM`); that is a host condition and is evidence about neither the
  harness nor those products. Nothing here is agent-outcome evidence: no
  benchmark, guardrail, or behavioral trial was run for this report. Several
  source reports classify the shared-skill gate as `project-specific`; this
  report reclassifies part of it as harness-caused and says so explicitly under
  UP-015 and UP-016 rather than restating their attribution silently.
- **Identifiers.** IDs continue the earlier twelve-item v3.1.1 fix list
  (UP-001 - UP-012), whose dispositions are recorded in the source's
  `workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md`. Nothing below
  re-opens one of those twelve.

## Findings

Ordered by impact. Each item states what the portfolio observed, what the
current source shows, and the smallest bounded change.

### UP-013 - `doctor` never emits the managed-runtime integrity check it registers

- **Severity:** high. **Cause:** defective-canon. **Status at `b3633e5`:** open.
- **Location:** `workbench/tools/diagnostics.mjs:25-26`;
  `tools/workbench-tools.mjs:163-183`.
- **Claim:** `tools-receipt-missing` and `tools-receipt-drift` are registered
  with scope `tools` and effect `all` - the strongest blocking class - but no
  installed tool emits them. The word `receipt` appears in the installed
  `diagnostics.mjs` only in those two catalogue rows, and not at all in
  `spec-workbench.mjs`. The hash check lives in `tools/workbench-tools.mjs`,
  which stays in the release checkout and is never installed into a room.
- **Demonstrated impact:** reproduced above. This room's runtime disagrees with
  its own receipt on all 11 tools, and its own `doctor` reports no blocking
  finding. A room therefore has no installed command that can verify the
  integrity of the runtime it is executing, and its status check passes while a
  registered blocking condition is live. Audit Workbench's HFR-AW-001 recorded
  the same mismatch from the other side.
- **Smallest bounded next action:** emit the receipt check from `doctor`'s
  `tools` scope, or install a `verify` entry point into the tools lane. Either
  way the registered effect and the observed behavior must agree.

### UP-014 - A drift report cannot distinguish a stale receipt from a modified runtime

- **Severity:** high. **Cause:** defective-canon. **Status at `b3633e5`:** open.
- **Location:** `tools/workbench-tools.mjs:172-182`.
- **Claim:** `verify` computes `sourceDrift` at line 180 - the comparison
  against the release checkout - but returns it only on the `valid` path (line
  182, as `updateAvailable`). When file drift exists, line 181 returns
  `tools-receipt-drift` with per-file `reason: hash` and discards the source
  comparison it just made.
- **Demonstrated impact:** Audit Workbench observed 11 tools byte-identical to
  the source it was compared against while the receipt asserted an older hash
  set. The operator is told only that the lane "differs from its receipt",
  which reads as tampering; the fact that would settle it is computed one line
  earlier and thrown away. The report could not name a safe remedy and stopped
  for owner authorization.
- **Smallest bounded next action:** include the source comparison in the drift
  error, so the result distinguishes *runtime matches the source, receipt is
  stale* from *runtime differs from both*, and name the supported remedy
  (`update --explicit-update`, which writes a rollback backup) in the message.

### UP-015 - Presence-only skill install fails closed on a linked skill path

- **Severity:** high. **Cause:** defective-canon. **Status at `b3633e5`:** open.
- **Location:** `tools/core-skill-installer.mjs:63-76` versus its own install
  loop at `:86-105`.
- **Claim:** `validateDestinations` rejects a destination that is a symlink or
  junction with `skill-path-collision`, before any mutation. But the install
  loop skips an ordinary existing directory as `already-present` without
  reading it, and both paths that consume this bundle check presence only:
  `tools/workbench-adoption.mjs:59-60` and the layout-only upgrade at
  `tools/workbench-upgrade.mjs:54-57` accept a skill present in *either*
  discovery root. The check is stricter than the operation it guards.
- **Demonstrated impact:** on this host `~/.claude/skills/code-review` is a
  junction to `~/.agents/skills/code-review`. dndAPI (F-001) and dndclient
  (F-001) both recorded the installer's `skill-path-collision` as a high
  blocker and stopped without migrating, and both asked the owner whether the
  junction should be replaced. AI Agents Presentation hit the same refusal,
  recorded it as a benign setup check reporting failure (F-003), and completed
  its adoption through the presence check using the `.agents` root. Two of
  eighteen reviews ended on a gate that did not have to hold.
- **Smallest bounded next action:** resolve the link and accept a destination
  whose realpath is a directory containing the skill, reporting the resolved
  target in the result; keep the hard refusal for a destination that resolves
  to a file or to a missing target.

### UP-016 - The upgrade gate never names the route that clears it

- **Severity:** high. **Cause:** meta-caused. **Status at `b3633e5`:**
  partially landed; discoverability open.
- **Location:** `tools/workbench-upgrade.mjs:126-127`, compared with the route
  named at `:101`.
- **Claim:** `explicit-update-required` names both routes (`--explicit-update`
  and `--layout-only`). The two refusals an operator actually hits on a real
  host - `skill-path-collision` (`:126`) and `unmanaged-skill` (`:127`) - name
  neither. `--layout-only` landed after these reviews ran and takes the
  presence-only path that both refusals are irrelevant to.
- **Demonstrated impact:** eleven reports stopped at this refusal and every one
  of them recommended the same expensive remedy: an owner-authorized
  reconciliation of the shared skill, with inventory and backup, before any
  migration could be retried (Agent DVR HFR-001, Budgeting F-001, CIC HFR-001,
  DigitalTome HFR-001, Dungeon Friends HFR-001, Local Agent Town HFR-001,
  OpenBrain HFR-001, Personal Intelligence Platform HFR-001, Puffer Pond
  HFR-001, Resume Portfolio HFR-001, Timewell HFR-001). The safety boundary was
  correct in every case; the cost was that the whole portfolio treated a
  route-selection problem as a workstation-ownership problem. The v3.1.2 route
  fixes the mechanism, but nothing in the failure output would have redirected
  those eleven agents.
- **Smallest bounded next action:** name the layout-only route in the
  `unmanaged-skill` and `skill-path-collision` failure messages, and have
  `update-harness` state the route-selection rule before the refusal is met.

### UP-017 - The green-baseline gate has no recorded "baseline unavailable" path

- **Severity:** high. **Cause:** meta-caused. **Status at `b3633e5`:** open.
- **Location:** `templates/ADOPTION.md` Phase 0; the update-harness baseline
  procedure.
- **Claim:** Adoption Phase 0 requires a reproducible green baseline and the
  update procedure requires stopping on a red one unless the owner separately
  authorizes a repair. There is no supported way to record that a baseline
  cannot be established and still proceed with a harness-only change, so any
  unrelated product or host condition blocks the migration outright.
- **Demonstrated impact:** five rooms stopped here after the skill gate - CIC
  Dashboard (HFR-002), DigitalTome (HFR-003), OpenBrain (HFR-002), Personal
  Intelligence Platform (HFR-002), Puffer Pond (migration update). Their causes
  were a missing npm dependency, an unreadable sibling remote, a Vite config
  load, and in five reports across the set a `spawn EPERM` from a restricted
  runner. Dungeon Friends and Resume Portfolio hit the same wall through
  pre-existing `render-drift` in their legacy v2.x projections. Three more rooms
  (Budgeting, Local Agent Town, Timewell) declined to run a baseline at all
  because doing so would write into a reviewed project or read private data. In
  none of these cases was the blocking condition caused by, or repairable by,
  the harness change being requested.
- **Smallest bounded next action:** let the owning spec record a baseline as
  unavailable with its reason and let the harness-only change proceed against
  that record, or state plainly in the Adoption contract that a room without a
  runnable baseline is out of scope for migration. Either answer is workable;
  the absence of one is what stalled eight rooms.

### UP-018 - Seeded lane documents are installed once and never managed

- **Severity:** medium. **Cause:** defective-canon. **Status at `b3633e5`:**
  open.
- **Location:** `tools/workbench-tools.mjs:24-36` (`RUNTIME_TOOLS`);
  `templates/feedback/REPORT_FORMAT.md`; `templates/wiki/`.
- **Claim:** the managed receipt covers exactly the eleven `.mjs` runtime tools.
  Installed skills gained generation markers and `stale-skill` /
  `skill-generation-unknown`; wiki contract files gained `stale-stamp`. Seeded
  documents in the other lanes have none of that - no receipt entry, no stamp
  check, and no refresh command.
- **Demonstrated impact:** this room's `workbench/feedback/REPORT_FORMAT.md`
  still tells a reviewer to store the report in the reviewed project's own
  feedback lane. Upstream corrected exactly that instruction
  (`templates/feedback/REPORT_FORMAT.md:3-7`), and it is the correction this
  review application depends on to keep evidence out of the projects it
  measures. Nothing in the room reports the divergence; it was found by diffing
  against the source by hand. The same shape applies to the four seeded wiki
  documents discussed in UP-020.
- **Smallest bounded next action:** cover seeded lane documents with the tools
  receipt or a parallel seed receipt, and register one diagnostic that reports a
  seeded document whose generation is behind the manifest.

### UP-019 - Error-level findings that block nothing make a healthy room read as failed

- **Severity:** medium. **Cause:** defective-canon. **Status at `b3633e5`:**
  open.
- **Location:** `workbench/tools/diagnostics.mjs:42-48`; `doctor` output format.
- **Claim:** `invalid-adr`, `invalid-note`, `copied-task-state`, and
  `secret-like-content` are registered `error` with effect `none`. `doctor`
  prints them at error severity above its final verdict.
- **Demonstrated impact:** reproduced above - ten error lines, then `ok - no
  blocking finding`. GPT_OS (HFR-GO-001) recorded 28 such lines in a current,
  valid installation and made the operator-facing point directly: it obscures
  actionable diagnostics and makes a clean setup look failed. Cashflow
  Calculator, Peptides Website, and this room all carry the same output, so the
  condition is not profile-specific.
- **Smallest bounded next action:** render the registered effect in the line
  itself, or lower the display severity of `blocks: none` document-shape
  findings. Keep the blocking semantics unchanged and cover the intended
  distinction with a test.

### UP-020 - No normalize path for existing ADRs and wiki notes without frontmatter

- **Severity:** medium. **Cause:** mixed. **Status at `b3633e5`:** template half
  landed, repair half open.
- **Location:** `workbench/tools/adr.mjs` (`validate | register | new`);
  `workbench/tools/wiki.mjs` (`validate`).
- **Claim:** `adr new` scaffolds correct frontmatter and all four wiki templates
  now carry it upstream, but neither tool can bring an existing document into
  shape. A room seeded before that fix, or whose ADRs were authored by hand, can
  only be repaired by editing every file.
- **Demonstrated impact:** this room reports six `invalid-adr` and four
  `invalid-note` findings; GPT_OS reports 24 and 4. The four wiki files in each
  case are harness-seeded. The validator and the artifacts the harness itself
  installed disagree, and no command closes the gap.
- **Smallest bounded next action:** add a `normalize` (or `--fix`) mode to both
  tools that inserts only the required frontmatter keys and leaves the body
  untouched, with a red/green test for a document that already has partial
  frontmatter.

### UP-021 - Provenance fixes do not reach rooms already carrying a placeholder

- **Severity:** medium. **Cause:** meta-caused. **Status at `b3633e5`:** tool
  half landed, backfill open.
- **Location:** `workbench/manifest.json` `provenance.source`;
  `workbench/tools/.workbench-tools.json` `source`.
- **Claim:** `init` no longer writes `unrecorded` - the usage string lists
  `--source-commit`, the placeholder is absent from the tools, and
  `tools/test-workbench-layout.mjs:823` guards it. But no diagnostic reports a
  placeholder sitting in an existing manifest, and no command records the source
  identity after the fact.
- **Demonstrated impact:** Peptides Website (HFR-PW-001) is byte-current and
  verifies `valid`, while its manifest provenance reads `unrecorded` and its
  receipt source reads `unknown`. Its report states the consequence precisely: a
  later version-over-version review cannot reproduce that installation from its
  own provenance. That is the exact input this review application compares
  releases with.
- **Smallest bounded next action:** register a diagnostic for placeholder
  provenance, and provide a supported way to record source identity for an
  existing room without a reinstall.

### UP-022 - Adoption demands seven filled controls with no scaffold-then-reconcile route

- **Severity:** medium. **Cause:** meta-caused. **Status at `b3633e5`:** open.
- **Location:** Adoption preflight control inventory.
- **Claim:** the preflight requires seven filled root controls before it will
  run, and the contract does not name a supported order for producing the
  missing ones from a legacy room.
- **Demonstrated impact:** eight rooms found their control inventory
  structurally incomplete for v3 adoption, most often a missing `LEXICON.md`
  (Agent DVR HFR-002, Local Agent Town HFR-002, Budgeting F-002, Timewell
  HFR-002, DigitalTome HFR-002, dndAPI F-002, dndclient F-002, and CIC's v2.3
  inventory). Each report independently invented the same remedy - author the
  control on an isolated migration branch first - and each warned against
  copying a template blindly, because a template would overwrite a
  project-specific privacy or boundary rule.
- **Smallest bounded next action:** have the preflight name each missing control
  and the reconcile-before-migrate order, so eight agents do not each derive it.

### UP-023 - No classifier for an unversioned legacy control set

- **Severity:** low. **Cause:** meta-caused. **Status at `b3633e5`:** open.
- **Location:** adoption-versus-upgrade route selection.
- **Claim:** a room with harness-shaped controls but no version stamp, manifest,
  or lifecycle tool cannot be classified from its own contents.
- **Demonstrated impact:** DigitalTome (HFR-002) could not establish whether it
  was an established Workbench installation eligible for upgrade or an
  unversioned legacy dialect requiring adoption, and recorded that treating it
  as an upgrade could misclassify a first adoption and lose live roadmap truth.
- **Smallest bounded next action:** a read-only classify command reporting
  `genesis | adoption | upgrade | unclassifiable` with the evidence for the
  verdict.

## Already Closed Since v3.1.1

Verified in the source at `b3633e5`. Listed so the next fix list can say what
the release removed, and so these are not re-reported against v3.1.2.

| Reported as | Closed by | Verification |
|---|---|---|
| `init` records `unrecorded` provenance; `--source-commit` undiscoverable (feedback row 2026-09-04; Peptides HFR-PW-001, tool half) | S-032 | usage string lists `--source-commit`; no `unrecorded` in the tools; `tools/test-workbench-layout.mjs:823` |
| Adoption may be called complete while its result is uncommitted (feedback row 2026-09-04; Cashflow HFR-CF-001) | S-029 | `templates/ADOPTION.md:303-308` requires a commit on a prefixed branch and a declared integration branch or a recorded reason |
| `REPORT_FORMAT.md` sends an independent reviewer's evidence into the reviewed project (feedback row 2026-09-04) | S-028 / S-035 | `templates/feedback/REPORT_FORMAT.md:3-7` names an explicitly supplied destination first |
| Seeded wiki documents fail the wiki schema (template half of GPT_OS HFR-GO-001) | S-033 | all four `templates/wiki/` documents now carry frontmatter; `stale-stamp` registered |
| No supported v2-root upgrade route (UP-003, and the mechanism half of the portfolio's shared-skill gate) | S-032 | `tools/workbench-upgrade.mjs --layout-only` migrates the support root without touching skills; residual discoverability is UP-016 |

## Challenged Or Rejected Findings

- **`spawn EPERM` is not harness evidence.** Five reports (DigitalTome,
  OpenBrain, Personal Intelligence Platform, Puffer Pond, AI Agents
  Presentation) recorded Node failing to spawn test children under a restricted
  runner. Each classified it as a host condition, and each was right. It is not
  a v3.1.1 defect and it is not proof that those products are broken. It appears
  here only because it is a large share of the "red baseline" input to UP-017.
- **The shared-skill refusal itself is correct.** Nothing in UP-015 or UP-016
  asks the harness to overwrite unmanaged user content. Both items are about a
  gate that is stricter than the operation it guards, or that withholds the
  route that clears it. Agent DVR, Dungeon Friends, Local Agent Town, Resume
  Portfolio, and Timewell all state the safety boundary is sound; that
  assessment is upheld.
- **Legacy `render-drift` is not a v3.1.1 defect.** Dungeon Friends (HFR-002)
  and Resume Portfolio (HFR-002) report stale generated regions in their own
  v2.x projections. Those belong to those rooms' lanes. They appear here as an
  instance of UP-017, not as a separate item.
- **Project and host conditions excluded:** dndclient's nested `vi.mock`
  deprecation warning (F-003, project code); OpenBrain's missing
  `@supabase/supabase-js` and its unreadable sibling remote; Dungeon Friends'
  macOS-only Godot suite; Timewell not being a standalone Git repository (an
  owner lifecycle decision, not a harness defect); and the `safe.directory`
  override this room needs because its checkout is owned by a different local
  Windows account.
- **No agent-outcome claim.** Nothing in this report establishes that v3.1.1
  made an agent better or worse than v2.x, or that v3.1.2 will. Every item is a
  control-surface or tool-behavior finding. The portfolio's guardrail and
  benchmark evidence is unchanged by this document.
- **Cause reclassification stated openly.** Ten reports label the shared-skill
  gate `project-specific`. This report accepts that for the workstation's skill
  ownership and separates out the part that is not: the refusal messages
  withhold the supported route (UP-016), and the installer's link check is
  stricter than its own install behavior (UP-015). Both are properties of the
  harness, verified in its source.

## Next Action And Open Questions

- **Next executable action:** deliver this report to LLM Workbench so its owner
  can accept or decline UP-013 through UP-023 and record each disposition, the
  way S-035 recorded UP-001 through UP-012. Nothing in this report authorizes a
  change to the harness or to any reviewed project.
- **Recommended order.** UP-013 and UP-014 first: they are small, sit in one
  file each, and restore the integrity check the rest of the evidence chain
  assumes. UP-015 and UP-016 next: between them they account for all thirteen
  of the eighteen reviews that stopped before touching their target. UP-017 is the largest and is a contract decision
  rather than a code fix, so it needs the owner before it needs an agent.
- **Open question 1:** should a harness-only migration be permitted against a
  recorded unavailable baseline (UP-017)? Either answer unblocks eight rooms;
  the absence of an answer is the blocker.
- **Open question 2:** should the shared `code-review` junction on this
  workstation be supported as-is (UP-015) or replaced with an ordinary managed
  directory after backup? dndAPI and dndclient both raised this for the owner
  and neither acted on it.
- **Open question 3:** what replaced this room's runtime without updating its
  receipt? UP-014 explains why the report cannot tell; the receipt carries no
  backup and no update event that would answer it.
- **Blocker carried forward:** this room's own `tools-receipt-drift` remains
  live and unrepaired. It needs an owner decision under UP-013/UP-014 before
  Audit Workbench's managed-tool verification can be cited as evidence.

## Review Boundary

This is a single-context aggregation of eighteen bounded reports, written by an
agent inside the reviewing repository. It is not an independent review of the
harness, and it is not a separate-context review of any candidate. Its factual
re-checks against `b3633e5` were performed by reading the source and running
read-only commands; where an item is marked landed, that means the source
contains the change, not that a release was published or that a room received
it. Every consequential recommendation here awaits owner authorization, and any
resulting harness change needs its own separate-context review before
integration.
