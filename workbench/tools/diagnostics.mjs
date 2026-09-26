// Registered diagnostic codes for every Workbench runtime tool.
//
// A finding blocks only by the effect registered here; the commands that
// consume findings enforce it (doctor fails on `all` and `selection`, next
// excludes `selected-slice` work, claim refuses it, attention is reported and
// never blocks). No artifact, manifest field, spec row, or projection may
// declare whether its own finding blocks. Adding a code or changing its effect
// is a tool change with a test.

export const SEVERITIES = Object.freeze(['error', 'attention']);
export const SCOPES = Object.freeze(['manifest', 'specs', 'adr', 'wiki', 'sessions', 'feedback', 'tools', 'controls', 'skills', 'git', 'host']);
export const EFFECTS = Object.freeze(['all', 'selection', 'selected-slice', 'none']);

const registry = Object.freeze({
  'session-transport-blocked': entry('error', 'sessions', 'none', 'an optional transport operation was refused; local note use remains independent'),
  'session-transport-pending': entry('attention', 'sessions', 'none', 'optional transport has no fresh acknowledgment; preserve local notes and last confirmed SHA'),
  // manifest and layout: the routing every consumer depends on
  'invalid-workbench-identity': entry('error', 'manifest', 'all', 'a declared Workbench connection identity is malformed; do not silently regenerate it'),
  'identity-busy': entry('error', 'manifest', 'none', 'another local identity writer holds the assignment lock'),
  'identity-write-failed': entry('error', 'manifest', 'none', 'Workbench identity assignment could not be verified'),
  'invalid-manifest': entry('error', 'manifest', 'all', 'the manifest is unreadable or malformed'),
  'upgrade-required': entry('error', 'manifest', 'all', 'the manifest is an older schema; run the one-time migration'),
  'invalid-lane': entry('error', 'manifest', 'all', 'a declared lane path is unsafe or not the v3.1 contract'),
  'unsafe-lane': entry('error', 'manifest', 'all', 'a declared lane is missing, a symlink, or not a directory'),
  'invalid-collection': entry('error', 'manifest', 'all', 'a declared collection path is unsafe or not the v3.1 contract'),
  'missing-collection': entry('error', 'manifest', 'all', 'a required collection directory is missing'),
  'invalid-skill-policy': entry('error', 'manifest', 'all', 'the skill policy is not the closed core bundle'),
  'invalid-wiki-profile': entry('error', 'manifest', 'all', 'the wiki profile is not project or deployment'),
  'sessions-not-ignored': entry('error', 'sessions', 'all', 'live session collections are not ignored by default'),
  'tools-receipt-missing': entry('error', 'tools', 'all', 'the tools lane has no Workbench receipt'),
  'tools-receipt-drift': entry('error', 'tools', 'all', 'an installed runtime tool differs from its receipt hash'),
  'invalid-source-identity': entry('error', 'tools', 'all', 'the Workbench source checkout, release, repository, commit, or managed bytes could not be verified'),
  // spec lifecycle: identity and state consistency selection depends on
  'malformed-spec': entry('error', 'specs', 'selection', 'a spec packet cannot be parsed'),
  'duplicate-id': entry('error', 'specs', 'selection', 'two packets claim one spec ID'),
  'invalid-state': entry('error', 'specs', 'selection', 'a spec or task status is outside the lifecycle vocabulary'),
  'contradictory-state': entry('error', 'specs', 'selection', 'a completed spec still has unfinished tasks'),
  // S-00I TK-004 corrective: the stable-path rule this description named is
  // retired (AGENTS.md Edit Scope; ADR-000I, WF-8F) - lifecycle is folder
  // location now, and a Spec or Task moves through `move-spec`/`move-task`,
  // which keep links correct instead of never moving. This finding still
  // covers a narrower, unchanged fact: only the top level is the active
  // roster, so an active Spec directory must start `<lane>/<id>-` there.
  'unstable-path': entry('error', 'specs', 'selection', 'an active Spec directory is not at `<lane>/<id>-...` on the top level'),
  'missing-evidence': entry('error', 'specs', 'selection', 'a done task has no proof'),
  'render-drift': entry('error', 'specs', 'selection', 'a generated projection region is stale; run render'),
  'broken-render-target': entry('error', 'specs', 'selection', 'a projection control or its generated region is missing'),
  // S-00H TK-003: a Spec may carry both a slice-table row and a standalone
  // Task record for the same id (a room mid-conversion, or one authored
  // both by mistake). That is a distinct condition from an unparseable
  // packet: registering it separately, rather than folding it into
  // `malformed-spec`, lets doctor keep reporting every other spec and every
  // other scope instead of aborting the whole run on the first collision.
  'row-record-collision': entry('error', 'specs', 'selection', 'a spec carries both a slice-table row and a Task record for the same id'),
  // S-00H TK-007 corrective: a Task's Receipt fails its own append-only
  // checksum-chain verification, or its section is otherwise malformed. The
  // Spec and its Task record both still parse fine - only the Receipt is
  // unreadable - so this is registered separately from `malformed-spec` for
  // the same reason `row-record-collision` is: doctor keeps reporting every
  // other spec, slice and scope instead of the raw exception this used to
  // throw straight through `renderHotBoard`.
  'receipt-corrupt': entry('error', 'specs', 'selection', "a Task's Receipt fails its append-only check or is malformed"),
  // selected slice only
  'blocked-slice': entry('error', 'specs', 'selected-slice', 'the selected task names an unmet dependency'),
  // attention: visible, never blocking
  'stale-claim': entry('attention', 'specs', 'none', 'an in-progress claim is older than one working day; verify activity before reclaiming'),
  'complete-on-integration': entry('attention', 'specs', 'none', 'the spec next would select is already complete or superseded at the declared integration ref; the checkout is behind it'),
  'broken-link': entry('attention', 'specs', 'none', 'a spec links to a missing local target'),
  // S-00J TK-01T: a blocker entry carries a qualifier outside the known
  // grammar (`S-###:delivered` is the only one). The resolver already treats
  // it as unmet, so the finding only makes that wait visible; it blocks
  // nothing room-wide, and the slice it gates stays unselectable.
  'unknown-blocker-qualifier': entry('error', 'specs', 'none', 'a Task blocker names a qualifier outside the known blocker grammar; it stays unmet until corrected'),
  // S-00I TK-003: a Spec's lifecycle folder is retired, but its own header
  // Status still disagrees (folder says done with it; the header does not
  // say complete) - the Spec analogue of `disagreeing-status`, visible and
  // never blocking. `loadSpecs` never returns a retired Spec to selection,
  // so this can only ever be raised by doctor's explicit historical-route
  // read, never by `next` or `claim`.
  'retired-not-complete': entry('attention', 'specs', 'none', "a retired Spec's Status is not complete"),
  // S-00I TK-004: the Task analogue of `retired-not-complete` above. A Task
  // record inside `tasks/retired/` is out of the active roster
  // (`listTaskRecords` never returns it, mirroring `loadSpecs`), but its own
  // Status frontmatter can still disagree that it is `done` - visible and
  // never blocking, exactly like the Spec case, and raised only by doctor's
  // explicit historical-route read, never by `next` or `claim`.
  'retired-task-not-done': entry('attention', 'specs', 'none', "a retired Task's Status is not done"),
  // S-00I TK-005: a retired Spec's whole point is that its surviving current
  // claims were transformed into a durable Wiki owner before the move - a
  // precondition `retireSpec` enforces at retirement time, but the Wiki note
  // itself is an ordinary note afterward and nothing stops it going stale or
  // being deleted later. This is the one check that notices, covering both
  // shapes named by the same message class: no active-roster Wiki note names
  // the retired Spec's historical route in its `source_paths` at all
  // ("missing"), or one does but its own `status` is no longer `active`
  // ("stale") - visible and never blocking, exactly like `retired-not-complete`.
  'retired-wiki-owner-stale': entry('attention', 'specs', 'none', "a retired Spec's Wiki durable owner is missing or its status is not active"),
  // S-00I TK-006: the discard gate itself already refuses a discard while
  // any current reference names the record, so this only ever fires when a
  // record whose own discard is recorded in `workbench/specs/DISCARDS.md`
  // still has a live reference naming it - a discard bypassed through a raw
  // `git rm`, or a reference added back afterward. Scoped to a target this
  // room's own register says was actually discarded, not every dead local
  // link in the room (`broken-link` above already covers the ordinary,
  // non-discard case, deliberately as `attention`); this stays `selection`
  // because a reference naming a record Git no longer has at that path is a
  // stronger, room-wide fact than one Spec's own broken link.
  'discarded-reference': entry('error', 'specs', 'selection', "a live reference names a path this room's own discards register says was discarded"),
  'stale-register': entry('attention', 'adr', 'none', 'the derived ADR register is stale; run adr register'),
  // S-00I TK-002: lifecycle now comes from folder location (top level, or
  // ADR_LIFECYCLE_FOLDERS `proposed`/`archive`), not frontmatter `status`. A
  // record inside `proposed/` or `archive/` that still carries an explicit
  // `status` disagreeing with what its folder implies is a half-migrated
  // record - visible, never silently reinterpreted, and never blocking.
  'disagreeing-status': entry('attention', 'adr', 'none', "an ADR's leftover status frontmatter disagrees with its lifecycle folder"),
  'invalid-adr': entry('error', 'adr', 'none', 'an ADR is missing required frontmatter or names an unknown canonicalization target'),
  'untracked-provenance': entry('error', 'adr', 'none', 'a durable reference targets an untracked session path'),
  // notepads: refusals the runtime returns to its caller. None of them blocks,
  // because a live note is local working context that no selection depends on;
  // each is a fail-closed answer to one write or read, not a project state.
  'duplicate-identity': entry('error', 'sessions', 'none', 'a notepad or entry identity already exists in the record'),
  'stale-revision': entry('error', 'sessions', 'none', 'a notepad write names a revision other than the one on disk'),
  'malformed-json': entry('error', 'sessions', 'none', 'a JSON record is not parseable'),
  'legacy-schema': entry('error', 'sessions', 'none', 'a record is an earlier notepad schema with no revision to check; migrate it first'),
  'retained-dependency': entry('error', 'sessions', 'none', 'a trim would strand material that a retained entry still corrects or depends on'),
  'promotion-recovery-required': entry('error', 'sessions', 'none', 'a promotion read-back and restoration failed; retain the reported original backup for recovery'),
  'write-failed': entry('error', 'sessions', 'none', 'a record could not be published; the previous valid file is unchanged'),
  'stale-note': entry('attention', 'wiki', 'none', 'a wiki note is marked stale'),
  // These two are shared: the wiki validator, the checkpoint promoter, and the
  // notepad runtime all emit them. Their `scope` names the lane they were
  // registered for, not the lane of the emitter, so a notepad refusal reports
  // `wiki` - a coarse label in machine-readable output, with no effect on
  // behavior, since both are registered `none`. Splitting them per lane is a
  // registry change with its own test and belongs to the diagnostics owner.
  'invalid-note': entry('error', 'wiki', 'none', 'a wiki note, checkpoint source, or notepad violates its schema'),
  'copied-task-state': entry('error', 'wiki', 'none', 'a wiki note copies live task state'),
  'secret-like-content': entry('error', 'wiki', 'none', 'a wiki note, checkpoint, or notepad write contains secret-like material'),
  'room-brain-unrouted': entry('attention', 'wiki', 'none', 'a root control does not route to the room brain'),
  'stale-stamp': entry('attention', 'wiki', 'none', 'a wiki contract file or the room brain is stamped with a version other than the manifest'),
  // git: the review gate's merge target is a declared fact; its absence is
  // visible in every doctor run and blocks only the Genesis readiness gate
  'integration-branch-undeclared': entry('error', 'git', 'none', 'the manifest declares no git.integrationBranch; declare the branch the independent review gate merges into'),
  'integration-branch-missing': entry('error', 'git', 'none', 'the declared integration branch resolves neither as a local head nor on a remote'),
  // S-00M TK-002 (ADR-000J): the repository state a completion claim can
  // hide. Both are visible in every doctor run and block nothing: detached is
  // a legitimate inspection state, and the false claim is refused at `close`.
  'detached-head': entry('attention', 'git', 'none', 'HEAD is detached; an inspection state that blocks nothing, but switch to a branch before committing work you intend to deliver'),
  'untracked-controls': entry('attention', 'git', 'none', 'untracked files sit under the root controls, the ADR collection or the spec lane; commit or remove them before claiming the work done'),
  'unfilled-control': entry('error', 'controls', 'all', 'a root control is empty, a stub, or carries template placeholders'),
  'unsafe-control': entry('error', 'controls', 'all', 'a root control is not an ordinary file'),
  'version-mismatch': entry('error', 'controls', 'all', 'a control version stamp disagrees with the manifest'),
  'missing-first-spec': entry('error', 'specs', 'all', 'Genesis produced no first spec'),
  'invalid-first-spec': entry('error', 'specs', 'all', 'the first spec is not an actionable packet'),
  'project-local-skills': entry('error', 'controls', 'all', 'a root skills/ directory shadows the skills lane'),
  // skills lane (S-00V): the core skills ship in the room at the manifest's
  // skills lane and the two discovery roots are tracked adapters into it.
  // Doctor reads the project tree only and never writes to it. Like the
  // declared integration branch, a lane that is not installed or a core
  // skill missing from it is an error every doctor run shows and none
  // blocks: the room repairs it with one release command
  // (`workbench-skills.mjs install|update`), and selection must not wait on
  // it. The Genesis readiness gate still fails closed on it.
  'skill-lane-missing': entry('error', 'skills', 'none', 'the skills lane is not installed or a required core skill is missing from it'),
  'skill-lane-unreadable': entry('error', 'skills', 'none', 'the skills lane or a required skill in it is not an ordinary readable directory'),
  'skill-adapter-missing': entry('attention', 'skills', 'none', 'a declared discovery root is absent, so that host cannot discover the lane'),
  'skill-adapter-broken': entry('attention', 'skills', 'none', 'a declared discovery root does not resolve into the skills lane'),
  'skill-duplicate-discovery': entry('attention', 'skills', 'none', 'a deprecated additional discovery entry duplicates the core catalog'),
  // The permission file is the mechanical half of the prose Edit Scope. A
  // withheld lane is reported by name and never blocks: a room may deny a
  // lane deliberately and record why. The Genesis readiness gate still
  // fails closed on it.
  'permission-scope-drift': entry('error', 'controls', 'none', 'the permission file withholds a manifest-declared authorship lane or grants the tools lane'),
  // Installed state the harness itself wrote. Neither blocks: a room repairs
  // both with a command it runs itself, and a byte-managed effect would turn a
  // deliberate local adjustment into a blocking failure. `stale-seed` is scoped
  // to the feedback lane because that is the whole covered set today; widening
  // the set to another lane is a registry change with its own test.
  'stale-seed': entry('attention', 'feedback', 'none', 'a seeded lane document records a release other than the manifest workbenchVersion'),
  'unverified-provenance': entry('attention', 'manifest', 'none', 'the manifest records no verifiable source identity, or one that disagrees with its own workbenchVersion'),
  // S-00V TK-00H: the host floor (Node 18+, Python 3.9+, git, gh authenticated
  // with push rights to the room's remote, network to GitHub). Registered
  // `all` because a session below the floor cannot finish any Task; emitted
  // only by the session-start `doctor --host` invocation (host-floor.mjs),
  // never by plain doctor, next or claim, which stay offline.
  'host-floor-unmet': entry('error', 'host', 'all', 'a host floor item is missing; install or authenticate it (Node 18+, Python 3.9+, git, gh with push rights to the room remote, network to GitHub) before session work')
});

function entry(severity, scope, blocks, summary) {
  return Object.freeze({ severity, scope, blocks, summary });
}

export function describe(code) {
  const registered = registry[code];
  if (!registered) throw new Error(`Unregistered diagnostic code: ${code}`);
  return registered;
}

export function isRegistered(code) {
  return Object.hasOwn(registry, code);
}

export function finding(code, message, details = {}) {
  const { severity, scope, blocks } = describe(code);
  return { code, severity, scope, blocks, message, ...details };
}

export function blocksAll(findings) {
  return findings.some((item) => item.blocks === 'all');
}

export function blocksSelection(findings) {
  return findings.some((item) => item.blocks === 'all' || item.blocks === 'selection');
}

export function blocksSlice(findings, specId, taskId) {
  return findings.some((item) => item.blocks === 'selected-slice' && item.specId === specId && (!item.taskId || item.taskId === taskId));
}

export function attention(findings) {
  return findings.filter((item) => item.severity === 'attention');
}

export function registeredCodes() {
  return Object.keys(registry);
}
