// S-00J TK-001: report the assembled Spec state for a reviewer at a stable
// seam, bound to a named candidate SHA.
//
// A separate-context reviewer needs one call that assembles a Spec's Tasks,
// acceptance lines, evidence rows, completion result and gaps, so the
// reviewer reads the assembled Spec rather than a diff. This module informs;
// it refuses nothing (TK-002 records a verdict from what it reports, TK-004
// binds a gate to that verdict). It composes this room's own existing
// readers rather than reparsing a Spec or a Task record itself - the same
// traversal-not-copy pattern `assembleTaskPacket` in task-packet.mjs uses for
// one Task's Packet:
//   - `loadSpecs` / `findSpec` / `slicesOf` in spec-workbench.mjs give the
//     one merged Task list (a table row or a Task record, one source of
//     truth per Spec) in the same shape `show --json` calls `tasks`.
//   - `readReceiptFromFile` in task-receipt.mjs gives a record-backed Task's
//     append-only run history, when it has one.
//
// The evidence table's columns vary by Spec (older Specs use
// `Date | Commit | Claim | Method | Result`; newer rows are six cells), so
// rows are parsed as cell arrays with the header preserved, never by fixed
// column names.
//
// Binding to the candidate: this reads the Spec and its records from the
// working tree, then names the candidate it was asked about, its full commit
// SHA once `git rev-parse <sha>^{commit}` resolves it in the room's own
// repository, and whether the working tree's own HEAD is that same commit -
// so a reviewer can see when the two differ. Normalized committed content
// equality is exposed separately from HEAD equality; the report remains
// informational even when that content is missing or differs. No checkout is
// changed. Verdict and gate refuse missing or mismatched candidate content.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { escapeMarkdownTableCell, parseMarkdownTableRow } from './markdown-table.mjs';
import { appendEvidence, atomicWrite, findLandmarkParent, findSpec, isLandmarkId, loadRetiredSpecs, loadSpecs, occupiedIdentities, resolveIntegrationContainmentRef, slicesOf, updateFields } from './spec-workbench.mjs';
import { appendContinuationToContent, formatTaskRecord, listTaskRecords, parseTaskRecord, readContinuations, taskStatus, updateTaskFields } from './task-record.mjs';
import { readReceipt, readReceiptFromFile } from './task-receipt.mjs';
import { assertSafeWritePath } from './workbench-paths.mjs';
import { allocateArtifactId, compareVisibleIds, visibleIdKey } from './visible-ids.mjs';

const PLACEHOLDER_COMPLETION = /^pending\.?$/i;

export function assembleSpecReport(rootDir, specId, options = {}) {
  // S-00J TK-004: candidate is now optional. A human reviewer still names
  // one (the `report` verb keeps asking for it) so the report can show
  // whether it exists and matches this checkout's HEAD, but `completeSpec`
  // and `gate` only need the Spec's content digest to find the latest
  // verdict, and never had a candidate SHA of their own to name - "content
  // binds, location does not" applies to reading a report exactly as it
  // does to recording a verdict.
  const candidateSha = options.candidate ?? null;
  const root = path.resolve(rootDir);
  const spec = findSpec(root, specId);

  const tasks = mergedTasks(spec);
  const acceptance = parseAcceptance(spec.content);
  const evidence = parseEvidence(spec.content);
  const completionResult = section(spec.content, 'Completion Result').trim();
  const candidate = candidateSha ? candidateBinding(root, candidateSha) : null;
  const specDigest = computeSpecDigest(root, spec);
  if (candidate) Object.assign(candidate, candidateContentBinding(root, spec, candidateSha, specDigest));
  const verdicts = parseVerdicts(evidence);
  const latestVerdict = latestVerdictFor(verdicts, specDigest);
  // S-00J TK-005: owner Human QA on `integration`, read the same way a
  // review verdict is - every recorded `owner-qa` row, and whichever of them
  // (if any) binds to the Spec's CURRENT content digest. "content binds,
  // location does not" applies here exactly as it does to the review verdict
  // above: an approval recorded in one checkout is recognized from any other
  // as long as the Spec's own files are unchanged.
  const ownerApproval = parseOwnerApprovals(evidence);
  const latestOwnerApproval = latestOwnerApprovalFor(ownerApproval, specDigest, root, spec);

  // S-00J TK-01R: an unresolved durable Task decision is a named gap, kept
  // separately as `decisionGaps` too so `completeSpec` can refuse exactly it
  // without adopting every other report gap as a new closure rule.
  const decisionGaps = collectDecisionGaps(tasks);
  const gaps = [...collectGaps({ tasks, acceptance, completionResult, evidence }), ...decisionGaps];

  // S-00J TK-002N: which ref integration containment resolves against
  // (`origin/<branch>` when it exists, else the local branch) and the SHA it
  // read, so a reviewer or owner can see a stale fetch. Informational: the
  // report still refuses nothing: a malformed manifest git block is shown
  // as `unresolved` with its reason rather than thrown through the report.
  let integrationContainment;
  try {
    integrationContainment = resolveIntegrationContainmentRef(root);
  } catch (error) {
    integrationContainment = { branch: null, ref: null, source: 'unresolved', sha: null, localSha: null, error: error.message };
  }

  return {
    id: spec.id,
    title: spec.title,
    status: spec.status,
    priority: spec.priority,
    owner: spec.owner,
    updated: spec.updated,
    description: spec.description,
    blockers: spec.blockers,
    latestEvent: spec.latestEvent,
    nextGate: spec.nextGate,
    path: spec.relativePath,
    candidate,
    specDigest,
    tasks,
    acceptance,
    evidence,
    verdicts,
    latestVerdict,
    ownerApproval,
    latestOwnerApproval,
    integrationContainment,
    completionResult,
    decisionCoverage: decisionCoverageOf(tasks),
    decisionGaps,
    gaps,
    complete: gaps.length === 0
  };
}

// S-00J TK-004: "current candidate" redefined. A verdict binds to the
// assembled Spec's CONTENT, never to any checkout's HEAD, so a reviewer's
// detached worktree, a dispatcher whose own HEAD is `integration`, and a
// merge commit that never equals the reviewed tip all recognize the same
// review as long as the Spec's own files are unchanged. The digest is a
// SHA-256 over SPEC.md and live/retired `tasks/<id>/TASK.md` files (sorted by
// directory name for a fixed, deterministic order), each with its own
// volatile, non-reviewed parts excluded first:
//   - SPEC.md: every Append-Only Evidence And Execution Log DATA ROW
//     (`stripEvidenceRows`), so recording a verdict, a later `complete`
//     close row, or a second verdict never changes the digest their own
//     recording depends on; and the `Updated`, `Latest event` and `Next
//     gate` header fields plus administrative completion status (`stripVolatileSpecFields`), which `claimWork` and
//     `closeTask` rewrite on every ordinary lifecycle step, never a change
//     to the reviewed capability itself.
//   - each TASK.md: its `## Receipt` section (`stripReceiptSection`,
//     corrective for TK-004's own review: the Receipt lives inside TASK.md,
//     task-receipt.mjs, so hashing the whole file voided a passed verdict on
//     every `receipt` append, contrary to this comment's original claim
//     that a Receipt was already excluded as "outside the Spec directory").
// Candidate approval computes this same digest from Git blobs and refuses a
// mismatch before writing. Everything else - the Task's own Status/Blockers/Proof/Planned
// verification, a table-backed Spec's slice table, Acceptance Criteria, the
// Completion Result, Decisions prose, and a Task body's `## Decisions` section
// (S-00J TK-01R: substantive, never excluded) - is left untouched, so a real
// change there still moves the digest.
// S-00J TK-01S: exported unchanged so `completeSpec` verifies the Spec's
// committed content on the default branch with this one digest rule; it
// adds no second normalization.
// Immutable candidate reads use the selected repository's real objects. Caller
// Git selectors, replacement refs and promisor fetches cannot substitute bytes
// or turn this read-only verification into network/object-store writes.
function candidateGit(root, args) {
  const environment = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  return spawnSync('git', ['--no-lazy-fetch', '--no-optional-locks', '-C', root, ...args], {
    encoding: 'utf8', timeout: 10000, maxBuffer: 16 * 1024 * 1024,
    env: { ...environment, GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' }
  });
}

export function computeSpecDigest(root, spec, candidate = null) {
  const specDir = path.dirname(spec.filePath);
  // Each entry is hashed as its name, then its byte length, then its own
  // content, each on its own line: the length prefix is what keeps one
  // entry's content from blending into the next entry's name in the digest
  // input, since neither a file name nor a byte count can itself contain a
  // newline. This tool has no adversarial user (it hashes this room's own
  // Spec directory), so the framing only needs to be unambiguous, never
  // tamper-proof.
  const hash = crypto.createHash('sha256');
  function addEntry(name, content) {
    hash.update(name);
    hash.update('\n');
    hash.update(String(Buffer.byteLength(content, 'utf8')));
    hash.update('\n');
    hash.update(content);
    hash.update('\n');
  }
  let relativeDir = path.relative(root, specDir).split(path.sep).join('/');
  function committed(args) {
    const result = candidateGit(root, args);
    if (result.status !== 0) throw new Error(`Cannot read committed content for ${spec.id} at ${candidate}: ${result.stderr?.trim() || result.error?.message || 'Git read failed'}`);
    return result.stdout;
  }
  if (candidate) relativeDir = committedSpecDirectory(root, spec, candidate, relativeDir, committed);
  const specContent = candidate ? committed(['show', `${candidate}:${relativeDir}/SPEC.md`]) : spec.content;
  addEntry('SPEC.md', stripVolatileSpecFields(stripEvidenceRows(specContent)));
  let taskNames;
  if (candidate) {
    taskNames = committed(['ls-tree', '-r', '--name-only', '-z', candidate, '--', `${relativeDir}/tasks/`])
      .split('\0').filter(Boolean).map((name) => name.slice(relativeDir.length + 1));
  } else {
    taskNames = [];
    for (const folder of ['tasks', 'tasks/retired']) {
      const directory = path.join(specDir, folder);
      if (!fs.existsSync(directory)) continue;
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && fs.existsSync(path.join(directory, entry.name, 'TASK.md'))) {
          taskNames.push(`${folder}/${entry.name}/TASK.md`);
        }
      }
    }
  }
  for (const name of taskNames.filter((name) => /^tasks\/(?:retired\/)?[^/]+\/TASK\.md$/.test(name)).sort()) {
    const content = candidate ? committed(['show', `${candidate}:${relativeDir}/${name}`]) : fs.readFileSync(path.join(specDir, name), 'utf8');
    addEntry(name, stripReceiptSection(content));
  }
  return hash.digest('hex');
}

function candidateContentBinding(root, spec, candidate, currentDigest) {
  try {
    const contentDigest = computeSpecDigest(root, spec, candidate);
    return { contentDigest, matchesContent: contentDigest === currentDigest, contentError: null };
  } catch (error) {
    return { contentDigest: null, matchesContent: false, contentError: error.message };
  }
}

// S-00U TK-003K: a retirement changes the lookup path, not the approved
// candidate or digest. Only follow the one canonical active -> retired move,
// proven by Git's staged rename or the latest committed destination addition.
// Never search for another same-ID or same-digest record. In particular, a
// removed/re-added source or destination is a new incarnation: an older
// approval cannot prove it, even when somebody copies the old evidence rows.
function committedSpecDirectory(root, spec, candidate, relativeDir, committed) {
  const currentFile = `${relativeDir}/SPEC.md`;
  const regularBlob = (ref, file) => {
    const entries = committed(['ls-tree', '-z', ref, '--', file]).split('\0').filter(Boolean);
    return entries.length === 1 && /^(100644|100755) blob [0-9a-f]+\t/.test(entries[0])
      && entries[0].slice(entries[0].indexOf('\t') + 1) === file;
  };
  if (regularBlob(candidate, currentFile)) return relativeDir;

  const refuse = () => { throw new Error(`Cannot prove the committed retirement source for ${spec.id} at ${candidate}`); };
  // S-003Z TK-008E: the move stays within the Spec's own home, so a nested
  // Spec's retirement source is `<landmark>/specs/<dir>`.
  const { specsPrefix } = spec;
  const basename = path.posix.basename(relativeDir);
  if (relativeDir !== `${specsPrefix}/retired/${basename}` || !basename.startsWith(`${spec.id}-`)) refuse();
  const sourceDir = `${specsPrefix}/${basename}`;
  const sourceFile = `${sourceDir}/SPEC.md`;
  const missing = (ref, file) => committed(['ls-tree', '-z', ref, '--', file]) === '';
  const ancestor = (older, newer) => candidateGit(root, ['merge-base', '--is-ancestor', older, newer]).status === 0;
  const parentsOf = ref => committed(['rev-list', '--parents', '-n', '1', ref]).trim().split(' ').slice(1);
  const latestAddition = (ref, file) => {
    // Default log hides additions made by merge commits. Per-parent history
    // exposes them, but an ordinary merge importing an existing path is not
    // a new incarnation: at least one parent already carries that path.
    const additions = committed(['log', '--full-history', '--topo-order', '-m', '--no-renames', '--diff-filter=A', '--format=%H', ref, '--', file]).trim().split('\n').filter(Boolean);
    return [...new Set(additions)].find(sha => parentsOf(sha).every(parent => missing(parent, file)));
  };
  // A deletion anywhere on the candidate's surviving ancestry invalidates
  // that incarnation, including a merge that restores another parent's old
  // bytes. Parents predating the candidate are excluded, so ordinary delivery
  // of a newly introduced Spec through a non-FF merge stays valid.
  const deletedSince = (from, to, file) => committed(['log', '--ancestry-path', '--full-history', '-m', '--no-renames', '--diff-filter=D', '--format=%H', `${from}..${to}`, '--', file]).trim() !== '';
  const isRename = (args) => {
    const fields = committed(['diff', '--name-status', '-z', '--find-renames', ...args, '--', sourceFile, currentFile]).split('\0').filter(Boolean);
    return fields.length === 3 && /^R\d+$/.test(fields[0]) && fields[1] === sourceFile && fields[2] === currentFile;
  };
  if (!regularBlob(candidate, sourceFile) || !missing(candidate, currentFile) || !ancestor(candidate, 'HEAD')) refuse();

  let sourceParent;
  if (regularBlob('HEAD', sourceFile) && missing('HEAD', currentFile)) {
    // moveSpecDirectory stages the whole rename before its caller commits.
    if (!isRename(['--cached', 'HEAD'])) refuse();
    sourceParent = 'HEAD';
  } else {
    if (!missing('HEAD', sourceFile) || !regularBlob('HEAD', currentFile)) refuse();
    const move = latestAddition('HEAD', currentFile);
    if (!move) refuse();
    if (deletedSince(move, 'HEAD', currentFile)) refuse();
    const parents = parentsOf(move);
    sourceParent = parents.find(parent => ancestor(candidate, parent)
      && regularBlob(parent, sourceFile) && missing(parent, currentFile)
      && missing(move, sourceFile) && regularBlob(move, currentFile)
      && isRename([parent, move]));
    if (!sourceParent) refuse();
  }
  const sourceAdded = latestAddition(sourceParent, sourceFile);
  if (!sourceAdded || !ancestor(sourceAdded, candidate) || deletedSince(candidate, sourceParent, sourceFile)) refuse();
  return sourceDir;
}

// Blanks the Spec header's `Updated`, `Latest event` and `Next gate` field
// values (never the field name, never any other header field) - the three
// lines `claimWork` and `closeTask` rewrite on every ordinary claim or
// close. Each is a `**Field:** value` line appearing exactly once in a
// well-formed Spec, so a non-global, line-anchored replace touches only that
// literal field's own line, never a prose mention or an evidence-row cell
// that happens to contain the same words.
function stripVolatileSpecFields(content) {
  return content
    // Completion is administrative; Task status, acceptance and proof still bind.
    .replace(/^\*\*Status:\*\* (?:complete|needs-review)$/m, '**Status:** active')
    .replace(/^\*\*Updated:\*\*.*$/m, '**Updated:**')
    .replace(/^\*\*Latest event:\*\*.*$/m, '**Latest event:**')
    .replace(/^\*\*Next gate:\*\*.*$/m, '**Next gate:**');
}

// Strips a Task record's entire `## Receipt` section - heading and body -
// the same way `stripEvidenceRows` finds the Evidence section's boundary,
// but removing the heading too rather than only its data rows: a Receipt is
// task-receipt.mjs's own append-only per-run log, live inside TASK.md,
// never the reviewed capability itself, so a `receipt` call - which appends
// a row there on every run, not only at close - must never move the digest
// a recorded verdict depends on. A record with no Receipt section yet is
// returned unchanged.
function stripReceiptSection(content) {
  const marker = /^## Receipt[ \t]*$/m;
  const match = marker.exec(content);
  let result = content;
  if (match) {
    const nextHeading = content.indexOf('\n## ', match.index + match[0].length);
    const sectionEnd = nextHeading < 0 ? content.length : nextHeading;
    result = content.slice(0, match.index) + content.slice(sectionEnd);
  }
  // Removing the section (or appendReceiptRowToContent's own trailing-
  // whitespace trim before it first wrote one) can leave a different amount
  // of trailing whitespace than a record that never had a Receipt section
  // at all - normalized to exactly one trailing newline either way, so
  // whether a Receipt section ever existed never shows up in the digest as
  // a spurious whitespace difference.
  return result.replace(/\s+$/, '\n');
}

// Strips every DATA row - never the header, never surrounding prose - from
// the Spec's own Append-Only Evidence And Execution Log section, identified
// the same way `parseEvidence` identifies one: a line beginning with
// `| YYYY-MM-DD |`. A review verdict row, a fail verdict's own row, a later
// `complete` close row, and a corrective cycle's second verdict are
// themselves evidence rows, so excluding all of them - not only rows that
// look like a verdict - is what makes the digest stable across the very acts
// of recording review history: a verdict row's own digest would otherwise
// depend on whether it had already been appended when the digest was
// computed. Everything else in SPEC.md - the header fields, Outcome,
// Decisions, the Vertical Implementation Slices table (a table-backed Spec's
// actual reviewed content, never an event log), Acceptance Criteria - is
// left untouched, so a real change there still moves the digest.
function stripEvidenceRows(content) {
  const heading = 'Append-Only Evidence And Execution Log';
  const marker = new RegExp(`^## ${escapeRegExp(heading)}[ \t]*$`, 'm');
  const match = marker.exec(content);
  if (!match) return content;
  const bodyStart = match.index + match[0].length;
  const nextHeading = content.indexOf('\n## ', bodyStart);
  const bodyEnd = nextHeading < 0 ? content.length : nextHeading;
  const body = content.slice(bodyStart, bodyEnd);
  const strippedBody = body
    .split('\n')
    .filter((line) => !/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line.trim()))
    .join('\n');
  return content.slice(0, bodyStart) + strippedBody + content.slice(bodyEnd);
}

// S-00J TK-002 (redefined by TK-004): a reviewer records a pass or fail
// verdict against the current candidate, appended to the Spec's append-only
// evidence log through the same `appendEvidence` seam `closeTask` and
// `completeSpec` already use (never a second append implementation).
// "Current candidate" no longer means this checkout's exact `HEAD` (TK-002's
// original binding, which the live review workflow cannot satisfy: a
// reviewer's detached worktree, a dispatcher whose own HEAD is
// `integration`, and a merge commit that never equals the reviewed tip).
// TK-004 redefines it to bind to the Spec's assembled CONTENT instead
// (`computeSpecDigest` above): the given candidate SHA must still exist in
// this repository (`git cat-file -e`) and contain the normalized reviewed
// content. The digest - not equality with HEAD - is what a
// later reader matches against. Reusing a review after the Spec's content
// moves on is still refused (a stale --digest), exactly as reusing one after
// the candidate SHA moved on used to be.
//
// This only ever appends: there is no update or rewrite entry point here, so
// a second verdict is a second row, never a replacement of the first, and
// `tools/check-append-only.py`'s identity rule (Date, second cell, Event -
// here `review` and `Review verdict: <result> at <sha> [<digest12>]`) is
// satisfied by construction: two verdicts for different candidates, digests
// or results generate different identities, and this module never rewrites
// a row it already wrote.
export function recordReviewVerdict(rootDir, specId, options = {}) {
  const root = path.resolve(rootDir);
  const candidate = requiredString(options.candidate, 'recordReviewVerdict requires a --candidate SHA');
  const result = options.result;
  if (result !== 'pass' && result !== 'fail') {
    throw new Error(`recordReviewVerdict requires --result of pass or fail, got: ${result === undefined ? 'nothing' : result}`);
  }
  const findings = requiredString(options.findings, 'recordReviewVerdict requires --findings ("none" is accepted on a pass)');
  const reviewer = requiredString(options.reviewer, 'recordReviewVerdict requires --reviewer naming the separate context (model and mode)');

  // S-00J TK-003: a fail verdict names at least one actionable finding,
  // checked before the Spec is even loaded (the same fail-fast discipline
  // the candidate checks below already use). "none" (the literal a pass
  // accepts) and a findings string that trims to no item at all once split
  // on ";" (all separators, nothing between them) both count as naming
  // nothing. This is deliberately stricter than the pre-existing empty/
  // whitespace --findings refusal above: that one catches an empty string
  // outright, this one catches a non-empty string that still names no real
  // defect, for either result. A fail with nothing to fix would leave the
  // Spec with no corrective Task, which is refused rather than recorded.
  if (result === 'fail' && splitFindings(findings).length === 0) {
    throw new Error(`A fail verdict for candidate ${candidate} on ${specId} names no corrective finding ("${findings}"); a failed verdict that leaves the Spec with no corrective Task is refused.`);
  }

  // S-00J TK-004: "current candidate" no longer means this checkout's exact
  // HEAD - a reviewer's detached worktree, a dispatcher whose own HEAD is
  // `integration`, and a merge commit that never equals the reviewed tip
  // must all be able to record and recognize the same review. The candidate
  // SHA is still required and still must exist in this repository (a real
  // commit, never an invented or mistyped SHA - the audit trail of what the
  // reviewer actually looked at), but it no longer has to be HEAD.
  if (!commitExists(root, candidate)) {
    throw new Error(`Candidate ${candidate} does not exist in this repository (checked via git cat-file -e); a review must bind to a real commit, never an invented or mistyped SHA.`);
  }

  const spec = findSpec(root, specId);
  // S-004F TK-005R: every finding names its disposition and the Task it names
  // exists, checked before the verdict row is written, so a refused finding
  // leaves no row without its corrective step.
  if (result === 'fail') planCorrectiveFindings(root, spec, splitFindings(findings));
  // Content binds, location does not: the verdict binds to the Spec's
  // current content digest (spec-report.mjs's `computeSpecDigest`), not to
  // this checkout's HEAD. A reviewer names the digest their own `report`
  // call showed them (`--digest`), refused when the working tree's own
  // current digest has since moved on; omitting `--digest` recomputes it
  // fresh from the working tree. Both forms must also match the normalized
  // Spec and Task content actually committed at the immutable candidate.
  const currentDigest = computeSpecDigest(root, spec);
  const givenDigest = options.digest ? String(options.digest).trim() : null;
  if (givenDigest && givenDigest !== currentDigest) {
    throw new Error(`The digest ${givenDigest.slice(0, 12)} named for candidate ${candidate} on ${specId} does not match this working tree's current content digest ${currentDigest.slice(0, 12)}; the Spec's content has changed since that digest was computed. Read a fresh --digest from a new report before recording this verdict, or omit --digest to record against the current content.`);
  }
  const digest = givenDigest ?? currentDigest;
  const committed = candidateContentBinding(root, spec, candidate, digest);
  if (!committed.matchesContent) {
    throw new Error(`Candidate ${candidate} does not contain the reviewed committed content for ${spec.id}: ${committed.contentError ?? `candidate digest ${committed.contentDigest.slice(0, 12)} differs from reviewed content digest ${digest.slice(0, 12)}`}. Commit the assembled content and review that immutable candidate before recording a verdict.`);
  }
  const digest12 = digest.slice(0, 12);

  // Review corrective (Medium): with exact-HEAD gone, a second same-day
  // verdict on unchanged content is ordinarily recordable (a second
  // reviewer confirming, say), but two such rows sharing a candidate,
  // digest and result differed only in their findings/reviewer cells - not
  // part of the Event text - so tools/check-append-only.py's identity rule
  // (Date, second cell, Event) could not tell them apart. Every verdict row
  // now carries its own position among this Spec's verdict rows in the
  // Event cell (`#<n>`), which is unique by construction (it always
  // increments), so no two verdict rows for a Spec can ever share an
  // identity - meanwhile an exact repeat of an already-recorded verdict
  // (same candidate, result, digest, findings and reviewer) is refused
  // outright rather than recorded as a pointless new row.
  const existingVerdicts = parseVerdicts(parseEvidence(spec.content));
  const duplicate = existingVerdicts.find((verdict) =>
    verdict.candidate === candidate && verdict.result === result && verdict.digest === digest12
    && verdict.findings === findings && verdict.reviewer === reviewer);
  if (duplicate) {
    throw new Error(`An identical verdict (${result} at ${candidate} [${digest12}], findings "${findings}", reviewer "${reviewer}") is already recorded for ${specId} as row #${duplicate.ordinal}; recording the exact same review twice is refused rather than duplicated.`);
  }
  const ordinal = existingVerdicts.length + 1;

  const date = new Date().toISOString().slice(0, 10);
  const remainingGap = findingsGap(findings);
  const cells = [date, 'review', `Review verdict: ${result} at ${candidate} [${digest12}] #${ordinal}`, findings, reviewer, remainingGap];
  const row = `| ${cells.map(escapeMarkdownTableCell).join(' | ')} |`;
  const updated = appendEvidence(spec.content, row);
  atomicWrite(spec.filePath, updated);

  // S-00J TK-003: folded into this verb rather than a separate `correct`
  // command, so a caller cannot record a failed verdict and forget the
  // corrective-Task step - the handoff's "same call" design. The verdict
  // row is written first (immediately above), so createCorrectiveTasks
  // re-reads it from disk as the exact row it names in each Task's Planned
  // verification, rather than a caller-supplied guess at its own position.
  //
  // Row-then-Tasks recovery: if the process dies in the gap between the
  // atomicWrite above and the createCorrectiveTasks call below, the Spec's
  // evidence log already durably carries the fail verdict row but no
  // corrective Task exists for it yet - a state indistinguishable from a
  // fail verdict recorded by some other path that never called this
  // function through to the end. Recovery is simply calling
  // createCorrectiveTasks(root, specId, { candidate, findings }) again (or
  // re-running this same verdict command is not an option, since a second
  // `verdict` call would append a second row - the recovery call is to the
  // narrower seam): the duplicate-row check below finds no existing Task
  // naming this row yet, so it proceeds exactly as if this call had reached
  // it the first time.
  let correctiveTasks;
  let continuedTasks;
  if (result === 'fail') {
    ({ created: correctiveTasks, continued: continuedTasks } = createCorrectiveTasks(root, specId, { candidate, findings }));
  }

  return { specId: spec.id, candidate, result, findings, reviewer, date, remainingGap, digest, digest12, ordinal, row, ...(correctiveTasks ? { correctiveTasks, continuedTasks } : {}) };
}

// S-00J TK-005: owner Human QA on `integration` - the owner's own review of
// the assembled behavior, distinct from the separate-context reviewer's
// verdict above. Recorded as an approval naming who, when and the
// `integration` SHA inspected, or as a finding, through the exact same
// `appendEvidence` seam every other evidence row uses (never a new file -
// "the owner asked for accountability, not ceremony"). Unlike a review
// verdict, the candidate must be contained in the declared integration
// branch - never a lane tip, since `integration` is the one surface the
// owner actually inspects - checked with `git merge-base --is-ancestor`
// against `git.integrationBranch` (`workbench-paths.mjs`'s `declaredGit`,
// the same seam `gate` already reads, never a hardcoded branch name).
//
// A `finding` against the existing destination (`findings`, no
// `destinationChange`) creates corrective Tasks through the same
// `createCorrectiveTasks` seam TK-003 built, extended below to anchor on
// this row too. A `finding` that changes the destination (`destinationChange`
// given) is recorded as "Return to Align" and creates nothing: a changed
// destination is a new Spec or a Blueprint change, never corrective work
// under the still-open Spec. A finding naming neither is refused before any
// write - the same fail-fast discipline `recordReviewVerdict` already
// applies to a fail verdict with nothing to fix.
export function recordOwnerApproval(rootDir, specId, options = {}) {
  const root = path.resolve(rootDir);
  const candidate = requiredString(options.candidate, 'recordOwnerApproval requires a --candidate SHA');
  const owner = requiredString(options.owner, 'recordOwnerApproval requires --owner naming who performed Human QA (the name as given, never inferred from Git config)');
  const result = options.result;
  if (result !== 'approve' && result !== 'finding') {
    throw new Error(`recordOwnerApproval requires --result of approve or finding, got: ${result === undefined ? 'nothing' : result}`);
  }
  const findingsInput = options.findings != null ? String(options.findings).trim() : '';
  const destinationChange = options.destinationChange != null ? String(options.destinationChange).trim() : '';
  const returnToAlign = result === 'finding' && destinationChange.length > 0;

  if (result === 'finding' && !returnToAlign && splitFindings(findingsInput).length === 0) {
    throw new Error(`An owner QA finding for candidate ${candidate} on ${specId} names no corrective item and no destination change ("${findingsInput}"); a finding that leaves nothing to act on is refused.`);
  }

  if (!commitExists(root, candidate)) {
    throw new Error(`Candidate ${candidate} does not exist in this repository (checked via git cat-file -e); an owner approval must bind to a real commit, never an invented or mistyped SHA.`);
  }

  // Integration only: the candidate must be contained in the declared
  // integration branch, never a lane tip - the owner's Human QA surface is
  // `integration`, not a reviewer's own branch or a Task PR. Resolved through
  // `declaredGit` (workbench-paths.mjs), the same seam `gate` already reads,
  // never a hardcoded branch name. A room that declares no
  // `git.integrationBranch` at all has nothing to check the candidate
  // against, exactly like `gate`'s own `integrationBranch: null` case above
  // it (never a hardcoded literal, never a refusal over an absent
  // declaration) - the check below only ever runs once a branch is actually
  // named.
  //
  // S-00J TK-002N: the containment ref is `origin/<branch>` when that
  // remote-tracking ref exists, else the local branch
  // (`resolveIntegrationContainmentRef`), so a lagging local `integration`
  // held by another checkout cannot refuse a candidate the remote carries,
  // and an unpushed local branch cannot approve one it does not. The
  // refusal names the ref and the SHA actually checked.
  const integrationContainment = resolveIntegrationContainmentRef(root);
  const integrationBranch = integrationContainment.branch;
  const containmentUnchecked = integrationBranch === null;
  if (integrationBranch && !isAncestorOfBranch(root, candidate, integrationContainment.ref)) {
    const checked = `${integrationContainment.ref} ${integrationContainment.sha ? `at ${integrationContainment.sha}` : '(does not resolve)'}`;
    throw new Error(`Candidate ${candidate} is not contained in the declared integration branch '${integrationBranch}' (checked ${checked} via git merge-base --is-ancestor; local refs only, nothing fetched); an owner approval binds to a SHA on integration, never a lane tip.`);
  }

  const spec = findSpec(root, specId);
  const digest = computeSpecDigest(root, spec);
  const committedDigest = computeSpecDigest(root, spec, candidate);
  if (digest !== committedDigest) {
    throw new Error(`Owner QA candidate content at ${candidate} does not match the current assembled Spec/Tasks for ${spec.id}; inspect and name the committed content being approved before recording Human QA.`);
  }
  const digest12 = digest.slice(0, 12);

  // S-004F TK-005R: an owner finding that keeps the destination follows the
  // same disposition rule as a fail verdict, validated before the row is written.
  if (result === 'finding' && !returnToAlign) planCorrectiveFindings(root, spec, splitFindings(findingsInput));

  const findingsCell = returnToAlign ? `Return to Align: ${destinationChange}` : (findingsInput || 'none');
  // Review corrective (Low): an approval recorded with no declared
  // integration branch at all skipped the ancestor check above with nothing
  // to show for it - its remaining-gap cell read "none" exactly like a
  // genuinely verified approval, making the two indistinguishable on the
  // page. A finding's remaining-gap cell already carries real content (a
  // defect count or "destination change"), so only the otherwise-"none"
  // approve case needs the substitution.
  const remainingGap = result === 'approve'
    ? (containmentUnchecked ? 'integration branch undeclared; containment unchecked' : 'none')
    : (returnToAlign ? 'destination change' : findingsGap(findingsInput));

  // Review corrective (Medium): with no ordinal, two same-day owner-qa rows
  // for the same candidate and content digest - two owners confirming, or
  // two same-day Return-to-Align findings - shared their append-only
  // identity (Date, owner-qa, Event), since neither findings nor owner is
  // part of the Event cell; `tools/check-append-only.py` could not tell them
  // apart. Every owner-qa row now carries its own position among this
  // Spec's owner-qa rows in the Event cell (`#<n>`), mirroring
  // `recordReviewVerdict`'s own ordinal exactly - unique by construction,
  // since it always increments - while an exact repeat of an
  // already-recorded entry (same candidate, result, digest, findings and
  // owner) is refused outright rather than recorded as a pointless new row.
  const existingApprovals = parseOwnerApprovals(parseEvidence(spec.content));
  const duplicate = existingApprovals.find((entry) =>
    entry.candidate === candidate && entry.result === result && entry.digest === digest12
    && entry.findings === findingsCell && entry.owner === owner);
  if (duplicate) {
    throw new Error(`An identical owner QA entry (${result} at ${candidate} [${digest12}], findings "${findingsCell}", owner "${owner}") is already recorded for ${specId} as row #${duplicate.ordinal}; recording the exact same entry twice is refused rather than duplicated.`);
  }
  const ordinal = existingApprovals.length + 1;

  const date = new Date().toISOString().slice(0, 10);
  const cells = [date, 'owner-qa', `Owner QA: ${result} at ${candidate} [${digest12}] #${ordinal}`, findingsCell, owner, remainingGap];
  const row = `| ${cells.map(escapeMarkdownTableCell).join(' | ')} |`;
  const updated = appendEvidence(spec.content, row);
  atomicWrite(spec.filePath, updated);

  let correctiveTasks;
  let continuedTasks;
  if (result === 'finding' && !returnToAlign) {
    ({ created: correctiveTasks, continued: continuedTasks } = createCorrectiveTasks(root, specId, { candidate, findings: findingsInput }));
  }

  return { specId: spec.id, candidate, owner, result, findings: findingsCell, date, remainingGap, digest, digest12, ordinal, row, integrationContainment, ...(correctiveTasks ? { correctiveTasks, continuedTasks } : {}) };
}

// `git merge-base --is-ancestor <sha> <branch>` exits 0 exactly when `sha` is
// contained in `branch` (an ancestor of its tip, or the tip itself) - the
// "integration only" check: an owner approval binds to a SHA `integration`
// actually carries, never a reviewer's own lane. A branch that does not
// resolve, or a candidate genuinely not contained in it, both read as `false`
// here; either way the caller's own refusal names the branch and the SHA.
// S-00J TK-01T: exported unchanged so the `S-###:delivered` resolver checks
// integration containment with this one reader.
export function isAncestorOfBranch(root, sha, branch) {
  const result = candidateGit(root, ['merge-base', '--is-ancestor', sha, branch]);
  return result.status === 0;
}

// S-00J TK-003 (S-00J TK-005 extends the anchor): one Task record per
// diagnosed defect in an already-recorded fail verdict OR owner QA finding,
// through the exact same Task-record seam S-00H delivered (`formatTaskRecord`
// / `parseTaskRecord` - never a second template), allocated with the room's
// own visible-id allocator so a corrective Task never collides with a
// retained table row or an existing record. The event this Task answers is
// never a caller-supplied date or ordinal: it is read back from the Spec's
// own append-only evidence log (`findCorrectiveAnchor` below), so a Task can
// never name an event that was never actually recorded. The anchor is the
// most recent qualifying row for this exact candidate; its position in the
// evidence log (not candidate+date+result alone, which two same-day rows
// could share) is what makes the reference unambiguous.
//
// Blocks nothing already done (`Blockers: none`) and lands with
// `Status: ready` and `Destination: spec-acceptance: <spec> Acceptance
// Criteria`, so `next`, `render` and `doctor` treat it exactly like any
// other ready Task record; it never touches the Spec header or an existing
// record, so a done Task is never reopened.
export function createCorrectiveTasks(rootDir, specId, options = {}) {
  const root = path.resolve(rootDir);
  const candidate = requiredString(options.candidate, 'createCorrectiveTasks requires a --candidate SHA');
  const findings = requiredString(options.findings, 'createCorrectiveTasks requires --findings naming at least one defect');
  const givenItems = splitFindings(findings);
  if (givenItems.length === 0) {
    throw new Error(`A fail verdict or owner QA finding for candidate ${candidate} on ${specId} names no corrective finding ("${findings}"); one that leaves the Spec with no corrective Task is refused.`);
  }

  // S-004F TK-005S (DDR-000M): the Wiki-claim anchor S-00I TK-006 added for a
  // discarded Spec is retired. The Wiki holds knowledge and evidence for the
  // direction and the plan, never the destination, so no corrective Task
  // anchors to a claim; a later gap becomes a new Spec.
  if (options.wikiClaim) throw new Error(`createCorrectiveTasks refuses a Wiki-claim anchor: ${NEW_SPEC_ROUTE}.`);
  // S-003Z TK-008H: a failed whole-landmark verdict answers with corrective
  // Tasks directly under the landmark (`<landmark>/tasks/`), through this same
  // seam; the landmark parent is shaped like a record-backed Spec.
  const spec = isLandmarkId(specId) ? findLandmarkParent(root, specId) : findSpec(root, specId);
  const landmark = spec.kind === 'landmark';
  assertSpecOpenForCorrection(spec);
  const evidence = parseEvidence(spec.content);
  const anchor = findCorrectiveAnchor(evidence, candidate);
  if (!anchor) {
    throw new Error(`No recorded fail verdict or owner QA finding for candidate ${candidate} exists on ${specId}; corrective Tasks are created only from one of those recorded rows.`);
  }
  // The row's own position in the append-only evidence log (1-based, oldest
  // first): unambiguous by construction, unlike candidate+date+result alone,
  // which two rows recorded the same day could share.
  const rowOrdinal = anchor.index + 1;
  const anchorRow = { cells: anchor.cells };
  const verdictDate = anchorRow.cells[0];

  // S-00J TK-003 review corrective (Medium): the anchored row - never the
  // caller's own argument - is the source of truth for what a corrective
  // Task answers, so a caller cannot attach invented findings to a recorded
  // row. `findings` stays a required argument (a caller must still name
  // what it expects to find there) but is used only as an equality check
  // against the row's own findings cell, both sides split and normalized
  // the same way (`splitFindings` below) so the row's own newline-to-space
  // collapsing at write time (`escapeMarkdownTableCell`) can never produce
  // a false mismatch against a caller - such as the internal call from
  // `recordReviewVerdict` above - that passed the original, unescaped text.
  const items = splitFindings(anchorRow.cells[3]);
  if (items.length === 0) {
    throw new Error(`Evidence row ${rowOrdinal} on ${specId} (${anchor.kind} at ${candidate}) names no corrective finding; corrective Tasks cannot be created from it.`);
  }
  if (JSON.stringify(items) !== JSON.stringify(givenItems)) {
    throw new Error(`createCorrectiveTasks findings do not match evidence row ${rowOrdinal}'s own recorded findings for candidate ${candidate} on ${specId}; the recorded row is the source of truth for what a corrective Task answers, so a caller cannot attach different findings to it. Recorded: "${items.join('; ')}"; given: "${givenItems.join('; ')}".`);
  }

  // S-00J TK-003 review corrective (Medium): a second call for the same
  // candidate and row would otherwise create a duplicate set of Tasks
  // answering the same defects twice. Every Task this function has ever
  // created for a row names that row's exact ordinal, candidate and date in
  // its own Planned verification (built from `answeredMarker` below), so
  // detecting "already created" is reading the existing records, never a
  // second ledger that could drift from them.
  const answersText = `evidence row ${rowOrdinal} (${anchor.kind} at ${candidate} on ${verdictDate})`;
  const answeredMarker = `Answers ${answersText}`;
  const specDir = path.dirname(spec.filePath);
  const existingRecords = listTaskRecords(specDir, root);
  // S-004F TK-005R: a continuation answers a row too, and names it in its own
  // `Answers` cell, so "already answered" reads the Task records alone.
  if (existingRecords.some((task) => (task.plannedVerification && task.plannedVerification.startsWith(answeredMarker))
      || readContinuations(task.content, task.id).some((entry) => entry.answers === answersText))) {
    throw new Error(`Corrective work already exists for candidate ${candidate}'s evidence row ${rowOrdinal} on ${specId}; createCorrectiveTasks refuses to answer a row twice.`);
  }

  // S-004F TK-005R: each finding is either more of the same work on a named
  // Task, which continues with an adjusted handoff (DDR-000Y), or a fix that
  // rewrites the Task, which opens a new one. Validated before anything is staged.
  const plan = planCorrectiveFindings(root, spec, items);

  // S-00J TK-003 review corrective (Low): every candidate record is built
  // and parsed back (validated) before anything is written, so a problem
  // partway through the batch - a finding whose text the record vocabulary
  // cannot carry, for instance - never leaves a partial set of corrective
  // Tasks on disk. Ids are allocated from one `loadSpecs` snapshot, each
  // newly allocated id added to the in-memory reservation list before the
  // next is chosen - the shared artifact policy (`allocateArtifactId`)
  // `next-id` uses, without a disk round trip between allocations in this batch:
  // nothing is written until every id is already reserved in memory, so two
  // allocations in the same batch can never collide, and there is nothing
  // for a later allocation to fail to see.
  const reservations = occupiedIdentities(root, 'TK');
  const staged = [];
  const continuedContent = new Map();
  const continuedRuns = [];
  for (const entry of plan) {
    if (entry.kind === 'continue') {
      // Each continuation appends to the Task's own record and, for a done
      // Task, moves it back to ready; Receipt rows, Proof and the Spec's
      // evidence rows are never rewritten. Two findings continuing one Task
      // in one call build on the same staged content, so runs stay in order.
      const record = entry.record;
      const base = continuedContent.get(record.id) ?? record.content;
      let content = appendContinuationToContent(base, { date: verdictDate, answers: answersText, handoff: entry.text }, record.id);
      if (record.status === 'done') content = updateTaskFields(content, { Status: 'ready' });
      parseTaskRecord(content, record.filePath, root);
      continuedContent.set(record.id, content);
      continuedRuns.push({ id: record.id, filePath: path.relative(root, record.filePath).split(path.sep).join('/'), handoff: entry.text, run: readContinuations(content, record.id).length, previousStatus: record.status });
      continue;
    }
    const id = allocateArtifactId('TK', reservations);
    reservations.push(id);
    const filePath = path.join(specDir, 'tasks', id, 'TASK.md');
    const plannedVerification = `${answeredMarker}: ${entry.text}${entry.rewrites ? ` (rewrites ${entry.rewrites})` : ''}`;
    const content = formatTaskRecord({
      id,
      ...(landmark ? { landmarkId: spec.id } : { specId }),
      slice: entry.text,
      status: 'ready',
      blockers: 'none',
      destination: landmark ? `spec-acceptance: ${spec.id} What Success Looks Like` : `spec-acceptance: ${specId} Acceptance Criteria`,
      plannedVerification
    });
    // Parsed back before it is staged, matching `convertSpecSlices`'s own
    // safety discipline: a record this refuses to produce is never written,
    // and here it is not even added to the batch the write loop below runs.
    parseTaskRecord(content, filePath, root);
    staged.push({ id, filePath, content, slice: entry.text });
  }

  // Only once every record in the batch is already known good does the
  // write loop run. A disk failure partway through THIS loop (as opposed to
  // the row-then-Tasks gap `recordReviewVerdict` documents above) leaves a
  // genuine partial set on disk with no automatic resume: the answered-row
  // check above only refuses a second call once at least one matching Task
  // or continuation has landed, so recovering from a partial batch means
  // completing or removing the partial `tasks/<id>/` directories by hand
  // before createCorrectiveTasks is called again for this same row.
  const created = [];
  for (const item of staged) {
    assertSafeWritePath(root, item.filePath);
    fs.mkdirSync(path.dirname(item.filePath), { recursive: true });
    atomicWrite(item.filePath, item.content);
    created.push({ id: item.id, filePath: path.relative(root, item.filePath).split(path.sep).join('/'), slice: item.slice });
  }
  const continued = [];
  for (const [id, content] of continuedContent) {
    const record = existingRecords.find((task) => task.id === id);
    assertSafeWritePath(root, record.filePath);
    atomicWrite(record.filePath, content);
    continued.push(...continuedRuns.filter((entry) => entry.id === id));
  }

  return { specId, candidate, verdictRow: { ordinal: rowOrdinal, date: verdictDate }, created, continued };
}

// S-004F TK-005S (DDR-000M): the route a gap against delivered work takes.
// Every retired corrective path names it, so a refusal tells the caller what to
// do instead. Exported so spec-workbench.mjs refuses with the same words.
export const NEW_SPEC_ROUTE = 'a later gap against delivered work becomes a new Spec under its landmark or the Blueprint (it may cite Wiki pages as evidence for its direction and plan), never a revived Spec and never a correction anchored to a Wiki claim';

// Delivered work - a Spec that is complete or superseded, or that sits in the
// `retired` folder - is not corrected by a Task. While a Spec is still open, a
// miss found by a check continues its Task or opens a new one (DDR-000Y);
// after delivery it is a new Spec. Checked before any write.
function assertSpecOpenForCorrection(spec) {
  // S-003Z TK-008H: a reached or retired landmark is delivered work too.
  if (spec.kind === 'landmark') {
    const delivered = spec.lifecycleFolder ? `retired in ${spec.lifecycleFolder}/` : (spec.status === 'reached' ? 'reached' : null);
    if (delivered) throw new Error(`${spec.id} is ${delivered}; a corrective Task is not written under a delivered landmark: ${NEW_SPEC_ROUTE}.`);
    return;
  }
  const state = spec.lifecycleFolder === 'retired' ? 'retired' : (['complete', 'superseded'].includes(spec.status) ? spec.status : null);
  if (state) throw new Error(`${spec.id} is ${state}; a corrective Task is not written against delivered work: ${NEW_SPEC_ROUTE}.`);
}

// S-004F TK-005R (DDR-000Y): the disposition every finding of a fail verdict
// or an owner QA finding names. `continue TK-###: <text>` means the fix is more
// of the same work, so that Task continues with `<text>` as its adjusted
// handoff; `new Task: <text>` (optionally `new Task rewriting TK-###: <text>`)
// means the fix changes the Task enough that it has to be rewritten, so a new
// Task opens. The recorder judges which, per finding, because the recorder
// holds the finding; the Spec's evidence row carries the text as written, so
// the record says which case applied. Findings are split on ";", so a
// disposition's own text holds none.
const CONTINUE_PATTERN = /^continue\s+(TK-[0-9A-Za-z]+)\s*:\s*(\S.*)$/i;
const NEW_TASK_PATTERN = /^new Task(?:\s+rewriting\s+(TK-[0-9A-Za-z]+))?\s*:\s*(\S.*)$/i;
const CONTINUABLE_STATUSES = Object.freeze(['done', 'ready', 'in-progress', 'needs-review']);

export function parseFindingDisposition(item) {
  let match = CONTINUE_PATTERN.exec(item);
  if (match) return { kind: 'continue', taskId: match[1], text: match[2].trim() };
  match = NEW_TASK_PATTERN.exec(item);
  if (match) return { kind: 'new', rewrites: match[1] ?? null, text: match[2].trim() };
  return null;
}

// Validates every finding against the Spec's own Task records and returns the
// plan, reading nothing it will not use and writing nothing, so a caller can
// refuse before it appends a row.
function planCorrectiveFindings(root, spec, items) {
  assertSpecOpenForCorrection(spec);
  const specDir = path.dirname(spec.filePath);
  const records = [...listTaskRecords(specDir, root)];
  const find = (taskId) => records.find((record) => visibleIdKey(record.id) === visibleIdKey(taskId));
  const unnamed = [];
  const parsed = [];
  for (const item of items) {
    const disposition = parseFindingDisposition(item);
    if (disposition) parsed.push(disposition); else unnamed.push(item);
  }
  if (unnamed.length > 0) {
    throw new Error(`Finding${unnamed.length === 1 ? '' : 's'} ${unnamed.map((item) => `"${item}"`).join(', ')} on ${spec.id} name${unnamed.length === 1 ? 's' : ''} no disposition; write each finding as "continue TK-###: <what the check found and what the fix must do>" when the same Task continues with an adjusted handoff, or "new Task: <finding>" (optionally "new Task rewriting TK-###: <finding>") when the fix changes the Task enough that it has to be rewritten. Findings are separated by ";", so a finding's own text holds none.`);
  }
  return parsed.map((entry) => {
    if (entry.kind === 'continue') {
      const record = find(entry.taskId);
      if (!record) throw new Error(`${spec.id} holds no Task record ${entry.taskId} to continue; a continued Task is a record under the Spec's tasks/ folder (convert-tasks moves a slice-table row into one), or write the finding as "new Task: <finding>".`);
      if (!CONTINUABLE_STATUSES.includes(taskStatus(record))) throw new Error(`${record.id} is ${taskStatus(record)}; only a ${CONTINUABLE_STATUSES.join(', ')} Task continues. Clear its blocker first, or write the finding as "new Task: <finding>".`);
      if (/^\*\*Close pending:\*\*/m.test(record.content)) throw new Error(`${record.id} has a close pending; finish that close before continuing the Task.`);
      return { ...entry, record };
    }
    if (entry.rewrites && !find(entry.rewrites)) throw new Error(`${spec.id} holds no Task record ${entry.rewrites} to rewrite; name a Task the Spec holds, or write the finding as "new Task: <finding>".`);
    return entry;
  });
}

function requiredString(value, message) {
  if (!value || !String(value).trim()) throw new Error(message);
  return String(value).trim();
}

// `git cat-file -e <sha>^{commit}` exits 0 exactly when the SHA names a
// commit object in this repository, never a checkout or a blob read -
// matching the "exists" half of "current candidate" the handoff names.
function commitExists(root, sha) {
  const result = candidateGit(root, ['cat-file', '-e', `${sha}^{commit}`]);
  return result.status === 0;
}

// The remaining-gap cell: the literal count of findings when there are any
// (findings given as a semicolon-separated list), or "none" when the
// reviewer named none - never re-deriving pass/fail from it, only counting
// what was actually reported.
function findingsGap(findings) {
  if (findings.trim().toLowerCase() === 'none') return 'none';
  const items = splitFindings(findings);
  return String(items.length || 1);
}

// The findings string split into its individual items - "none" (the literal
// a pass accepts) yields no items at all, everything else is split on ";"
// with each item's internal whitespace normalized to single spaces, blanks
// dropped after normalization. Shared by `findingsGap` above (the
// remaining-gap evidence cell) and `createCorrectiveTasks` below (one Task
// per item and the row-vs-caller equality check), so the two never drift
// into disagreeing about what counts as a finding.
//
// S-00J TK-003 review corrective (Medium): a finding is destined for a
// single-line `**Slice:**` / `**Planned verification:**` field in a Task
// record (`task-record.mjs`'s field regex is line-anchored and `.` never
// matches a newline), so an embedded newline - or a tab, or a run of extra
// spaces - previously survived into those fields verbatim, truncating the
// field on read and leaving the rest as orphan text in the record body.
// Collapsing every whitespace run to one space mirrors what
// `escapeMarkdownTableCell` already does for the evidence row's own findings
// cell (it replaces a literal newline with a space); doing the same
// normalization here, rather than only at the evidence-row boundary, is
// also what keeps the row-vs-caller equality check above from a false
// mismatch when the caller's raw text still carries the newline the row's
// own cell already collapsed.
function splitFindings(findings) {
  const trimmed = findings.trim();
  if (trimmed.toLowerCase() === 'none') return [];
  return trimmed.split(';').map((item) => item.trim().replace(/\s+/g, ' ')).filter(Boolean);
}

// Every verdict row in the evidence log, parsed from its cells alone - never
// a second source of truth - in the document's own order (oldest first,
// newest last, since the log is append-only). A verdict row is identified by
// its literal second cell `review` (recordReviewVerdict's own literal,
// distinguishing it from a Task-id row) and a third cell matching
// `Review verdict: pass|fail at <sha> [<digest12>] #<n>`; any row that fails
// either test is not a verdict row and is silently skipped, matching the
// same never-assume-column-identity discipline `parseEvidence` above already
// uses for the rest of the table. S-00J TK-004 adds the trailing
// `[<digest12>]` group (the 12-hex-character prefix of the content digest
// the verdict was recorded against, which is what a later reader actually
// matches on - never the candidate SHA, kept only as the audit trail of what
// commit the reviewer looked at) and the review corrective `#<n>` ordinal
// (this row's own position among the Spec's verdict rows, 1-based - unique
// by construction, since it always increments, so no two verdict rows for a
// Spec can ever share a check-append-only.py identity even when their
// candidate, digest and result are all identical).
const VERDICT_PATTERN = /^Review verdict: (pass|fail) at (\S+) \[([0-9a-f]{12})\] #(\d+)$/;

function parseVerdicts(evidence) {
  const verdicts = [];
  for (const row of evidence.rows) {
    const cells = row.cells;
    if (cells.length < 6 || cells[1] !== 'review') continue;
    const match = VERDICT_PATTERN.exec(cells[2]);
    if (!match) continue;
    verdicts.push({
      date: cells[0],
      result: match[1],
      candidate: match[2],
      digest: match[3],
      ordinal: Number(match[4]),
      findings: cells[3],
      reviewer: cells[4],
      remainingGap: cells[5]
    });
  }
  return verdicts;
}

// The latest verdict bound to the Spec's CURRENT content digest, or `null`
// when none matches it - read fresh from the evidence log every time, never
// cached. S-00J TK-004: matched against the digest, never against a
// candidate SHA or which checkout is asking - "content binds, location does
// not". A verdict recorded in a detached worktree, read back from the
// dispatcher's own checkout, or read after a merge commit that never equals
// the reviewed tip, is recognized exactly the same as long as the Spec's own
// files are unchanged.
function latestVerdictFor(verdicts, specDigest) {
  const digest12 = specDigest.slice(0, 12);
  for (let index = verdicts.length - 1; index >= 0; index -= 1) {
    if (verdicts[index].digest === digest12) return verdicts[index];
  }
  return null;
}

// S-00J TK-005 (review corrective, Medium): an owner-qa row, parsed from its
// cells alone exactly as `parseVerdicts` above parses a review row -
// identified by its literal second cell `owner-qa` and a third cell matching
// `Owner QA: approve|finding at <sha> [<digest12>] #<n>`. The `#<n>` ordinal
// (this row's own position among the Spec's owner-qa rows, 1-based) mirrors
// `recordReviewVerdict`'s own: two same-day owner-qa rows for one candidate
// and digest - two owners confirming, or two same-day Return-to-Align
// findings - would otherwise share their append-only identity (Date,
// owner-qa, Event), since neither findings nor owner is part of the Event
// cell.
const OWNER_QA_PATTERN = /^Owner QA: (approve|finding) at (\S+) \[([0-9a-f]{12})\] #(\d+)$/;

function parseOwnerApprovals(evidence) {
  const approvals = [];
  for (const row of evidence.rows) {
    const cells = row.cells;
    if (cells.length < 6 || cells[1] !== 'owner-qa') continue;
    const match = OWNER_QA_PATTERN.exec(cells[2]);
    if (!match) continue;
    approvals.push({
      date: cells[0],
      result: match[1],
      candidate: match[2],
      digest: match[3],
      ordinal: Number(match[4]),
      findings: cells[3],
      owner: cells[4],
      remainingGap: cells[5]
    });
  }
  return approvals;
}

// The latest owner-qa entry bound to the Spec's CURRENT content digest, or
// `null` when none matches it - mirrors `latestVerdictFor` exactly, same
// "content binds, location does not" rule.
function latestOwnerApprovalFor(approvals, specDigest, root, spec) {
  const digest12 = specDigest.slice(0, 12);
  for (let index = approvals.length - 1; index >= 0; index -= 1) {
    if (approvals[index].digest !== digest12) continue;
    // Earlier versions could record a local digest against unrelated Git content.
    // Retain those rows as history, but never treat one as valid authorization.
    try {
      if (computeSpecDigest(root, spec, approvals[index].candidate) === specDigest) return approvals[index];
    } catch { /* Missing content or an unproven lifecycle move cannot prove approval. */ }
  }
  return null;
}

// S-00J TK-005: the anchor `createCorrectiveTasks` answers, generalized
// beyond TK-003's review-fail-only lookup to also accept an owner-qa finding
// row - "extend its anchor lookup to accept an owner-qa finding row" per the
// handoff. Scanned from the most recent row backward exactly as the original
// fail-verdict-only lookup was, so the most recent qualifying event for this
// candidate is always the one answered. Each kind keeps its own literal
// phrase (`fail verdict` / `owner QA finding`), which lands verbatim in every
// corrective Task's `Planned verification` - the existing fail-verdict-
// anchored wording (and the tests asserting it) is unchanged by this
// generalization.
function findCorrectiveAnchor(evidence, candidate) {
  for (let index = evidence.rows.length - 1; index >= 0; index -= 1) {
    const cells = evidence.rows[index].cells;
    if (cells.length < 6) continue;
    if (cells[1] === 'review') {
      const match = VERDICT_PATTERN.exec(cells[2]);
      if (match && match[1] === 'fail' && match[2] === candidate) {
        return { index, kind: 'fail verdict', cells };
      }
    } else if (cells[1] === 'owner-qa') {
      const match = OWNER_QA_PATTERN.exec(cells[2]);
      if (match && match[1] === 'finding' && match[2] === candidate) {
        return { index, kind: 'owner QA finding', cells };
      }
    }
  }
  return null;
}

// The one merged Task list `slicesOf` gives (a Task record where the Spec
// has one, a table row otherwise) union'd with any retained slice-table row
// that has no matching record. `completeSpec` in spec-workbench.mjs already
// unions both sources when it checks for an unfinished slice
// (`[...slicesOf(spec).map(...), ...spec.rows.map(...)]`); a record-backed
// Spec's retained table row is completed history rather than a live slice
// (`assertOneSliceTruth`), but it still carries the landed proof a reviewer
// needs, so it is reported too - marked `source: 'row'` and `history: true`
// rather than silently dropped. For a table-only Spec every row already came
// through `slicesOf`, so this union adds nothing there. The merged list is
// kept in visible-id order, matching how `listTaskRecords` already orders
// standalone records.
function mergedTasks(spec) {
  const liveTasks = slicesOf(spec).map((slice) => taskEntry(slice));
  const liveIds = new Set(liveTasks.map((task) => visibleIdKey(task.id)));
  const historyRows = spec.rows
    .filter((row) => !liveIds.has(visibleIdKey(row.id)))
    .map((row) => historyTaskEntry(row));
  // S-00I TK-004: a retired Task record is out of `slicesOf` entirely (its
  // roster reads only the top level of `tasks/`), but a reviewer of an
  // assembled Spec still needs to see every Task's proof, retired or not -
  // this is the one seam that shows it, as history alongside a retained
  // table row's.
  const retiredTasks = (spec.retiredRecords ?? [])
    .filter((task) => !liveIds.has(visibleIdKey(task.id)))
    .map((task) => retiredTaskEntry(task));
  return [...liveTasks, ...historyRows, ...retiredTasks].sort((a, b) => compareVisibleIds(a.id, b.id));
}

// A retired Task record, shown as history exactly like `historyTaskEntry`
// below but sourced from the record itself (a retired Task carries no
// table-row cells to read instead), enriched with its own Receipt when it
// has one - the same enrichment `taskEntry` gives a live record-backed Task,
// so a reviewer sees a retired Task's run history too, not only its Proof.
function retiredTaskEntry(task) {
  const entry = {
    id: task.id,
    slice: task.slice,
    status: taskStatus(task),
    blockers: task.blockers.length > 0 ? task.blockers.join(', ') : 'none',
    proof: task.proof ?? null,
    source: 'retired-record',
    history: true,
    plannedVerification: task.plannedVerification ?? null,
    decisions: taskDecisions(task.content)
  };
  if (task.filePath && fs.existsSync(task.filePath)) {
    const rows = readReceiptFromFile(task.filePath);
    entry.receipt = { runCount: rows.length, latestRow: rows.length > 0 ? rows[rows.length - 1] : null };
  }
  return entry;
}

// One Task entry, enriched from whichever source `slicesOf` resolved for it.
// A table-row Task carries no Task record, so it carries no Receipt or
// planned-verification field at all - both are `undefined`, not `null`,
// because neither member exists for that source rather than existing empty.
function taskEntry(slice) {
  const task = {
    id: slice.id,
    slice: slice.slice,
    status: slice.declared,
    blockers: slice.blockers,
    proof: slice.proof ?? null,
    source: slice.source,
    // S-00J TK-01R: a table-row Task has no body, so its decision coverage
    // is unknown; a record's is read from its own `## Decisions` section.
    decisions: slice.source === 'record' ? taskDecisions(slice.record.content) : unknownDecisions()
  };
  if (slice.source === 'record') {
    task.plannedVerification = slice.record.plannedVerification ?? null;
    if (slice.record.filePath && fs.existsSync(slice.record.filePath)) {
      const rows = readReceiptFromFile(slice.record.filePath);
      task.receipt = { runCount: rows.length, latestRow: rows.length > 0 ? rows[rows.length - 1] : null };
    }
  }
  return task;
}

// A retained slice-table row with no matching Task record: completed
// history, carried verbatim from the row's own cells, never enriched with a
// Receipt or planned verification because it names no record file to read
// either from.
function historyTaskEntry(row) {
  return {
    id: row.id,
    slice: row.slice,
    status: row.status,
    blockers: row.blockers,
    proof: row.proof ?? null,
    source: 'row',
    history: true,
    decisions: unknownDecisions()
  };
}

// Every `- [ ]` / `- [x]` line in the Acceptance Criteria section, in
// document order, with its checked state and text kept separate from the
// bullet syntax.
function parseAcceptance(content) {
  const body = section(content, 'Acceptance Criteria');
  const lines = [];
  for (const match of body.matchAll(/^- \[([ xX])\]\s*(.*)$/gm)) {
    lines.push({ checked: match[1].toLowerCase() === 'x', text: match[2].trim() });
  }
  return lines;
}

// The evidence table's header row (cell array, wording kept verbatim) and
// its data rows (also cell arrays), never read by a fixed column name: the
// header wording is decorative and differs across Specs, and this module
// never assumes which column is which.
function parseEvidence(content) {
  const body = section(content, 'Append-Only Evidence And Execution Log');
  const lines = body.split('\n').map((line) => line.trim()).filter(Boolean);
  const header = lines[0] && lines[0].startsWith('|') ? parseMarkdownTableRow(lines[0]) : [];
  const rows = [];
  for (const line of lines) {
    if (!/^\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(line)) continue;
    rows.push({ cells: parseMarkdownTableRow(line) });
  }
  return { header, rows };
}

function collectGaps({ tasks, acceptance, completionResult, evidence }) {
  const gaps = [];
  for (const task of tasks) {
    if (task.status !== 'done') gaps.push(`Task ${task.id} is ${task.status}, not done`);
  }
  acceptance.forEach((line, index) => {
    if (!line.checked) gaps.push(`Acceptance line ${index + 1} is unchecked: ${line.text}`);
  });
  if (!completionResult || PLACEHOLDER_COMPLETION.test(completionResult)) {
    gaps.push('Completion Result is missing or still a placeholder');
  }
  const doneTaskIds = tasks.filter((task) => task.status === 'done').map((task) => task.id);
  for (const id of doneTaskIds) {
    const named = evidence.rows.some((row) => row.cells.some((cell) => cell.includes(id)));
    if (!named) gaps.push(`Evidence log names no row for done Task ${id}`);
  }
  return gaps;
}

// S-00J TK-01R: the minimum `## Decisions` Task-body interface Lane H
// disposed for this Task (TK-01R "Released Lane And Disposed Interface"),
// read from the Task record's own content with this module's line-anchored
// `section` resolver - no new shared parser. Coverage is one of:
//   - `unknown`: no `## Decisions` heading (a legacy Task, or a retained
//     table row with no body at all). Informational only: neither a gap nor
//     a verified reconciliation.
//   - `none`: the section is exactly the line `None.`.
//   - `declared`: a `| Choice | Scope | Disposition | Durable owner |` table.
//   - `malformed`: anything else under the heading, or a table whose header
//     or cells fall outside the interface. Fails closed as a gap, because an
//     unreadable declaration cannot show that no durable choice is pending.
// Each problem is a string naming what is wrong; `collectDecisionGaps` turns
// problems and pending durable rows into the report's named gaps.
const DECISION_HEADER = ['choice', 'scope', 'disposition', 'durable owner'];
const DECISION_SCOPES = ['task-local', 'durable'];
const DECISION_DISPOSITIONS = ['unresolved', 'reconciled'];
const NO_OWNER = /^(?:|-|none|n\/a|tbd)$/i;

function unknownDecisions() {
  return { coverage: 'unknown', rows: [], problems: [] };
}

function taskDecisions(content) {
  if (typeof content !== 'string' || !/^## Decisions[ \t]*$/m.test(content)) return unknownDecisions();
  const body = section(content, 'Decisions');
  if (body === 'None.') return { coverage: 'none', rows: [], problems: [] };
  const lines = body.split('\n').map((line) => line.trim()).filter(Boolean);
  const problems = [];
  if (lines.length === 0) return { coverage: 'malformed', rows: [], problems: ['the section is empty; write `None.` or the decision table'] };
  if (lines.some((line) => !line.startsWith('|'))) {
    return { coverage: 'malformed', rows: [], problems: ['the section holds text other than `None.` or the decision table'] };
  }
  const header = parseMarkdownTableRow(lines[0]).map((cell) => cell.toLowerCase());
  if (header.length !== DECISION_HEADER.length || header.some((cell, index) => cell !== DECISION_HEADER[index])) {
    return { coverage: 'malformed', rows: [], problems: ['the table header is not `| Choice | Scope | Disposition | Durable owner |`'] };
  }
  const dataLines = lines.slice(1).filter((line) => !/^\|[\s:|-]*\|$/.test(line));
  if (dataLines.length === 0) problems.push('the table declares no decision; write `None.` instead');
  const rows = [];
  for (const line of dataLines) {
    const cells = parseMarkdownTableRow(line);
    if (cells.length !== DECISION_HEADER.length) {
      problems.push(`the row "${line}" has ${cells.length} cells, not ${DECISION_HEADER.length}`);
      continue;
    }
    const [choice, scope, disposition, durableOwner] = cells;
    rows.push({ choice, scope, disposition, durableOwner });
    if (!choice) problems.push(`a decision row names no choice`);
    if (!DECISION_SCOPES.includes(scope)) problems.push(`decision "${choice}" has Scope "${scope}", not ${DECISION_SCOPES.join(' or ')}`);
    if (!DECISION_DISPOSITIONS.includes(disposition)) problems.push(`decision "${choice}" has Disposition "${disposition}", not ${DECISION_DISPOSITIONS.join(' or ')}`);
  }
  return { coverage: problems.length > 0 ? 'malformed' : 'declared', rows, problems };
}

// A `durable` + `unresolved` row, and a `reconciled` row naming no durable
// owner route, stay named gaps; `durable` + `reconciled` with an owner route
// clears (its route stays on the row for the reviewer). `task-local` rows
// never gap. Structural clearance is not approval: it neither proves the
// claimed reconciliation is supported nor settles TT-Q12's evidence
// threshold, which review still judges.
function collectDecisionGaps(tasks) {
  const gaps = [];
  for (const task of tasks) {
    const decisions = task.decisions;
    if (!decisions) continue;
    for (const problem of decisions.problems) gaps.push(`Task ${task.id} decision section is malformed: ${problem}`);
    for (const row of decisions.rows) {
      if (row.scope !== 'durable') continue;
      const hasOwner = !NO_OWNER.test(row.durableOwner);
      if (row.disposition === 'unresolved') {
        gaps.push(`Task ${task.id} durable decision "${row.choice}" is unresolved; escalate it to its durable owner (${hasOwner ? row.durableOwner : 'no durable owner named'}) and mark it reconciled`);
      } else if (row.disposition === 'reconciled' && !hasOwner) {
        gaps.push(`Task ${task.id} durable decision "${row.choice}" is marked reconciled but names no durable owner route`);
      }
    }
  }
  return gaps;
}

function decisionCoverageOf(tasks) {
  const coverage = { declared: [], none: [], unknown: [], malformed: [] };
  for (const task of tasks) coverage[task.decisions?.coverage ?? 'unknown'].push(task.id);
  return coverage;
}

// Named exactly as asked (`sha`, whatever length the caller gave, verbatim),
// plus the full commit SHA it resolves to in the room's own repository
// (`resolvedSha`, `null` when it does not resolve) and whether the working
// tree's own HEAD is that same commit - never a checkout, never a blob read
// at that SHA. Both `resolvedSha` and `headSha` are resolved through
// `git rev-parse <ref>^{commit}`, so an abbreviated candidate SHA (or any
// other ref `git` accepts) compares correctly against a HEAD that is the
// same commit; comparing the raw strings instead would report `matchesHead:
// false` for a short candidate even when it is exactly HEAD.
function candidateBinding(root, sha) {
  const headSha = resolveCommitSha(root, 'HEAD');
  const resolvedSha = resolveCommitSha(root, sha);
  return {
    sha,
    resolvedSha,
    existsInRepository: resolvedSha !== null,
    headSha,
    matchesHead: resolvedSha !== null && resolvedSha === headSha
  };
}

// Resolves any ref `git` accepts (a full or abbreviated SHA, or `HEAD`) to
// its full commit SHA, or `null` when it does not resolve to a commit in
// this repository - never a throw, matching "inform, never refuse".
function resolveCommitSha(root, ref) {
  const result = candidateGit(root, ['rev-parse', `${ref}^{commit}`]);
  return result.status === 0 ? result.stdout.trim() : null;
}

// Section extraction anchored to a whole line, matching the resolver
// `assembleTaskPacket` uses in task-packet.mjs for the same reason: a
// heading is a `## Name` line and only that line - a strict-prefix
// reference, a `###` subsection sharing the title, or a prose sentence that
// merely mentions the heading text mid-line must never be mistaken for it.
// The naive `content.indexOf('## ' + heading)` this replaced matched
// whichever of those came first in the file, not the real heading.
function section(content, heading) {
  const marker = new RegExp(`^## ${escapeRegExp(heading)}[ \t]*$`, 'm');
  const match = marker.exec(content);
  if (!match) return '';
  const bodyStart = match.index + match[0].length;
  const end = content.indexOf('\n## ', bodyStart);
  return content.slice(bodyStart, end < 0 ? content.length : end).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// S-00J TK-002N: one line naming the ref integration containment resolves
// against and the SHA it read, so a stale fetch (or a lagging local branch)
// is visible in the plain-text report.
function formatIntegrationContainment(containment) {
  if (!containment || containment.source === 'undeclared') return 'Integration containment: no integration branch declared; containment unchecked';
  if (containment.source === 'unresolved') return `Integration containment: unresolved (${containment.error})`;
  const at = containment.sha ? `at ${containment.sha}` : '(does not resolve)';
  if (containment.source === 'remote-tracking') {
    const local = containment.localSha ? `local ${containment.branch} at ${containment.localSha}` : `no local ${containment.branch} branch`;
    return `Integration containment: ${containment.ref} ${at} (remote-tracking ref, local refs only, never fetched; ${local})`;
  }
  return `Integration containment: ${containment.ref} ${at} (local branch; no origin/${containment.branch} remote-tracking ref)`;
}

// The short human-readable form the `report` CLI verb prints without
// `--json`: a Spec line, the candidate line with its resolution and HEAD
// match, the verdict, owner QA and integration containment lines, one line
// per Task with its status, source and Receipt run count when it has one,
// and the gap count followed by each gap. `--json` keeps
// printing the full object this module returns; this is a rendering of the
// same data, never a second source of it.
export function formatSpecReport(report) {
  const lines = [];
  lines.push(`${report.id} - ${report.title} [${report.status}]`);
  lines.push(`Spec digest: ${report.specDigest.slice(0, 12)}`);
  const c = report.candidate;
  lines.push(c
    ? `Candidate ${c.sha} (resolved ${c.resolvedSha ?? 'none'}) exists=${c.existsInRepository} matchesHead=${c.matchesHead} matchesContent=${c.matchesContent} (head ${c.headSha ?? 'none'}; committed digest ${c.contentDigest ?? 'unavailable'}${c.contentError ? `; ${c.contentError}` : ''})`
    : 'Candidate: none named');
  const v = report.latestVerdict;
  lines.push(v ? `Verdict: ${v.result} at ${v.candidate} by ${v.reviewer} (${v.date}) [digest ${v.digest}]` : 'Verdict: none for this candidate');
  const a = report.latestOwnerApproval;
  lines.push(a ? `Owner QA: ${a.result} at ${a.candidate} by ${a.owner} (${a.date}) [digest ${a.digest}]` : 'Owner QA: none for this candidate');
  lines.push(formatIntegrationContainment(report.integrationContainment));
  lines.push('Tasks:');
  for (const task of report.tasks) {
    const runs = task.receipt ? `, runs ${task.receipt.runCount}` : '';
    const history = task.history ? ' [history]' : '';
    lines.push(`  ${task.id} ${task.status} (source: ${task.source}${runs})${history}`);
  }
  if (report.decisionCoverage.unknown.length > 0) {
    lines.push(`Decision coverage unknown: ${report.decisionCoverage.unknown.join(', ')} (no ## Decisions section; informational, not a gap)`);
  }
  lines.push(`Gaps (${report.gaps.length}):`);
  for (const gap of report.gaps) lines.push(`  - ${gap}`);
  return lines.join('\n');
}

// ---- S-003Z TK-008H: the whole-landmark review, one size above a Spec's ----
// A landmark (ADR-000U) is reviewed as a whole once its children have landed:
// `report LMK-###` assembles it for a reviewer, `verify LMK-###` says whether
// it can be verified at all, and `verdict LMK-###` records the separate
// context's judgement on the landmark's own evidence log. The rung reuses the
// Spec review's seams rather than copying them: the same verdict row grammar
// (`parseVerdicts`), the same content-binding rule ("content binds, location
// does not"), the same corrective dispositions (`createCorrectiveTasks`, here
// writing landmark-direct Tasks) and each child Spec's own digest
// (`computeSpecDigest`). A landmark is a lane, not a branch: nothing here
// reads or changes a child Spec's verdict, gate or merge, so a failed
// whole-landmark review never blocks a child's integration.

// A landmark's child Specs are the Specs nested in its own folder's `specs/`
// home (TK-008E), active and retired, located by path so a landmark elsewhere
// that declares the same identity never lends its children.
function landmarkChildren(root, parent) {
  const landmarkDir = path.dirname(parent.filePath);
  return [...loadSpecs(root), ...loadRetiredSpecs(root)]
    .filter((spec) => spec.filePath.startsWith(`${landmarkDir}${path.sep}`))
    .sort((a, b) => compareVisibleIds(a.id, b.id));
}

// One child Spec as the reviewer sees it: its status, its latest verdict for
// its own current content, and whether it is retired. A child is open until
// it is complete or retired.
function childSpecEntry(root, spec) {
  const specDigest = computeSpecDigest(root, spec);
  const verdicts = parseVerdicts(parseEvidence(spec.content));
  const retired = Boolean(spec.lifecycleFolder);
  return {
    id: spec.id,
    title: spec.title,
    status: spec.status,
    path: spec.relativePath,
    lifecycleFolder: spec.lifecycleFolder ?? null,
    retired,
    open: !(retired || spec.status === 'complete'),
    specDigest,
    verdictCount: verdicts.length,
    latestVerdict: latestVerdictFor(verdicts, specDigest)
  };
}

// The landmark's direct Tasks, live and retired, enriched exactly as a Spec's
// Tasks are. A live Task is open until it is done; a retired one is history.
function directTaskEntries(parent) {
  const live = slicesOf(parent).map((slice) => ({ ...taskEntry(slice), retired: false }));
  const retired = parent.retiredRecords.map((task) => ({ ...retiredTaskEntry(task), retired: true }));
  return [...live, ...retired]
    .map((task) => ({ ...task, open: !task.retired && task.status !== 'done' }))
    .sort((a, b) => compareVisibleIds(a.id, b.id));
}

function openChildrenOf(childSpecs, directTasks) {
  return [
    ...childSpecs.filter((child) => child.open).map((child) => ({ kind: 'spec', id: child.id, status: child.status })),
    ...directTasks.filter((task) => task.open).map((task) => ({ kind: 'task', id: task.id, status: task.status }))
  ];
}

function openChildReason(child) {
  return child.kind === 'spec'
    ? `Child Spec ${child.id} is ${child.status}, not complete or retired`
    : `Direct Task ${child.id} is ${child.status}, not done`;
}

// The landmark's content digest: SHA-256 over its normalized LANDMARK.md, its
// direct Task records (Receipt sections excluded) and each child Spec's own
// content digest, framed exactly as `computeSpecDigest` frames its entries.
// The volatile parts excluded are the Spec digest's equivalents: every
// evidence DATA row (so recording a verdict never moves the digest it binds
// to), the `Updated`, `Latest event` and `Next gate` header values, and the
// administrative `reached` status a passing verdict writes. A child Spec is
// hashed by identity, not location, so its retirement into
// `<landmark>/specs/retired/` leaves the digest unchanged, as its own digest
// already does. With a candidate, the same entries are read from that commit
// (each child through `computeSpecDigest`'s own committed read), and the set of
// child Spec folders committed under the landmark must equal the working
// tree's, so a child moved in or out after the candidate refuses rather than
// matching by omission.
export function computeLandmarkDigest(root, parent, children, candidate = null) {
  const hash = crypto.createHash('sha256');
  function addEntry(name, content) {
    hash.update(name);
    hash.update('\n');
    hash.update(String(Buffer.byteLength(content, 'utf8')));
    hash.update('\n');
    hash.update(content);
    hash.update('\n');
  }
  const landmarkDir = path.dirname(parent.filePath);
  const relativeDir = path.relative(root, landmarkDir).split(path.sep).join('/');
  function committed(args) {
    const result = candidateGit(root, args);
    if (result.status !== 0) throw new Error(`Cannot read committed content for ${parent.id} at ${candidate}: ${result.stderr?.trim() || result.error?.message || 'Git read failed'}`);
    return result.stdout;
  }
  const landmarkContent = candidate ? committed(['show', `${candidate}:${relativeDir}/LANDMARK.md`]) : parent.content;
  addEntry('LANDMARK.md', stripVolatileLandmarkFields(stripEvidenceRows(landmarkContent)));
  let taskNames;
  if (candidate) {
    taskNames = committed(['ls-tree', '-r', '--name-only', '-z', candidate, '--', `${relativeDir}/tasks/`])
      .split('\0').filter(Boolean).map((name) => name.slice(relativeDir.length + 1));
  } else {
    taskNames = [];
    for (const folder of ['tasks', 'tasks/retired']) {
      const directory = path.join(landmarkDir, folder);
      if (!fs.existsSync(directory)) continue;
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && fs.existsSync(path.join(directory, entry.name, 'TASK.md'))) taskNames.push(`${folder}/${entry.name}/TASK.md`);
      }
    }
  }
  for (const name of taskNames.filter((name) => /^tasks\/(?:retired\/)?[^/]+\/TASK\.md$/.test(name)).sort()) {
    const content = candidate ? committed(['show', `${candidate}:${relativeDir}/${name}`]) : fs.readFileSync(path.join(landmarkDir, name), 'utf8');
    addEntry(name, stripReceiptSection(content));
  }
  if (candidate) {
    const committedChildren = committed(['ls-tree', '-r', '--name-only', '-z', candidate, '--', `${relativeDir}/specs/`])
      .split('\0').filter(Boolean).map((name) => name.slice(relativeDir.length + 1))
      .filter((name) => /^specs\/(?:retired\/)?[^/]+\/SPEC\.md$/.test(name)).map((name) => name.split('/').at(-2)).sort();
    const currentChildren = children.map((spec) => path.basename(path.dirname(spec.filePath))).sort();
    if (JSON.stringify(committedChildren) !== JSON.stringify(currentChildren)) {
      throw new Error(`The child Specs committed under ${parent.id} at ${candidate} (${committedChildren.join(', ') || 'none'}) differ from the working tree's (${currentChildren.join(', ') || 'none'})`);
    }
  }
  for (const spec of children) addEntry(`spec ${spec.id}`, computeSpecDigest(root, spec, candidate));
  return hash.digest('hex');
}

function stripVolatileLandmarkFields(content) {
  return content
    .replace(/^\*\*Status:\*\* reached$/m, '**Status:** active')
    .replace(/^\*\*Updated:\*\*.*$/m, '**Updated:**')
    .replace(/^\*\*Latest event:\*\*.*$/m, '**Latest event:**')
    .replace(/^\*\*Next gate:\*\*.*$/m, '**Next gate:**');
}

function landmarkContentBinding(root, parent, children, candidate, currentDigest) {
  try {
    const contentDigest = computeLandmarkDigest(root, parent, children, candidate);
    return { contentDigest, matchesContent: contentDigest === currentDigest, contentError: null };
  } catch (error) {
    return { contentDigest: null, matchesContent: false, contentError: error.message };
  }
}

// `report LMK-### [--candidate SHA]`: informs and refuses nothing. Each open
// child (a child Spec not complete or retired, a live direct Task not done)
// and each unticked reached check is a named gap; `openChildren` carries the
// children alone, which is what `verify` refuses on.
export function assembleLandmarkReport(rootDir, landmarkId, options = {}) {
  const root = path.resolve(rootDir);
  const parent = findLandmarkParent(root, landmarkId);
  const children = landmarkChildren(root, parent);
  const childSpecs = children.map((spec) => childSpecEntry(root, spec));
  const directTasks = directTaskEntries(parent);
  const landmarkDigest = computeLandmarkDigest(root, parent, children);
  const candidate = options.candidate ? candidateBinding(root, options.candidate) : null;
  if (candidate) Object.assign(candidate, landmarkContentBinding(root, parent, children, options.candidate, landmarkDigest));
  const evidence = parseEvidence(parent.content);
  const verdicts = parseVerdicts(evidence);
  const openChildren = openChildrenOf(childSpecs, directTasks);
  const uncheckedSuccessChecks = parent.successChecks.filter((check) => !check.done).map((check) => check.text);
  const gaps = [
    ...openChildren.map(openChildReason),
    ...uncheckedSuccessChecks.map((text) => `Reached check is unticked: ${text}`)
  ];
  return {
    kind: 'landmark',
    id: parent.id,
    title: parent.title,
    status: parent.status,
    priority: parent.priority,
    owner: parent.owner,
    updated: parent.updated,
    description: parent.description,
    blockers: parent.blockers,
    latestEvent: parent.latestEvent,
    nextGate: parent.nextGate,
    path: parent.relativePath,
    lifecycleFolder: parent.lifecycleFolder ?? null,
    candidate,
    landmarkDigest,
    successChecks: parent.successChecks,
    uncheckedSuccessChecks,
    childSpecs,
    directTasks,
    decisionRecords: parent.decisionRecords,
    evidence,
    verdicts,
    latestVerdict: latestVerdictFor(verdicts, landmarkDigest),
    openChildren,
    gaps,
    complete: gaps.length === 0
  };
}

// `verify LMK-###`: refused by name while any child Spec is not complete or
// retired or any live direct Task is not done - a landmark with an open child
// cannot be verified (and so cannot retire). When it passes it returns the
// verification result: every child closed, each child's status and latest
// verdict, the reached checks still unticked, the landmark's latest verdict
// for its current content, whether it is already reached, and the next step.
// It writes nothing and needs no candidate: it checks the children's state,
// while the candidate-bound judgement is the verdict's.
export function verifyLandmark(rootDir, landmarkId) {
  const report = assembleLandmarkReport(rootDir, landmarkId);
  if (report.openChildren.length > 0) {
    throw new Error(`verify refused: ${report.id} has open children: ${report.openChildren.map((child) => `${child.id} (${child.status}, ${child.kind === 'spec' ? 'not complete or retired' : 'not done'})`).join(', ')}; a landmark is verified only once every child Spec is complete or retired and every direct Task is done`);
  }
  const reached = report.status === 'reached';
  let nextStep;
  if (reached) nextStep = `Retire ${report.id} into its Landmark Wiki page.`;
  else if (report.uncheckedSuccessChecks.length > 0) nextStep = `Tick each reached check that has landed on integration, then run the whole-landmark review: report ${report.id} --candidate SHA, then verdict from a context with no part in the landmark.`;
  else nextStep = `Run the whole-landmark review: report ${report.id} --candidate SHA, then verdict from a context with no part in the landmark.`;
  return {
    mode: 'landmark-verify',
    landmarkId: report.id,
    verified: true,
    status: report.status,
    reached,
    landmarkDigest: report.landmarkDigest,
    openChildren: [],
    childSpecs: report.childSpecs.map(({ id, status, retired, latestVerdict }) => ({ id, status, retired, latestVerdict })),
    directTasks: report.directTasks.map(({ id, status, retired }) => ({ id, status, retired })),
    uncheckedSuccessChecks: report.uncheckedSuccessChecks,
    latestVerdict: report.latestVerdict,
    nextStep
  };
}

// `verdict LMK-### --candidate SHA [--digest D] --result pass|fail --findings
// TEXT --reviewer CONTEXT`: the Spec verdict's refusals (no candidate commit,
// a stale digest, committed content that differs, a fail naming no
// disposition, an exact repeat), plus the landmark's own: a retired landmark,
// and a reviewer that took part in the landmark (`landmarkParticipation`) -
// the separate landmark review comes from a context with no part in it, and
// self-review never counts. The row lands on LANDMARK.md's evidence log. A
// fail answers with corrective Tasks directly under the landmark; a pass with
// every child closed and every reached check ticked sets the landmark
// `reached`, otherwise it records the pass and names what keeps it short.
export function recordLandmarkVerdict(rootDir, landmarkId, options = {}) {
  const root = path.resolve(rootDir);
  const candidate = requiredString(options.candidate, 'verdict LMK-### requires a --candidate SHA');
  const result = options.result;
  if (result !== 'pass' && result !== 'fail') {
    throw new Error(`verdict LMK-### requires --result of pass or fail, got: ${result === undefined ? 'nothing' : result}`);
  }
  const findings = requiredString(options.findings, 'verdict LMK-### requires --findings ("none" is accepted on a pass)');
  const reviewer = requiredString(options.reviewer, 'verdict LMK-### requires --reviewer naming the separate context (model and mode)');
  if (result === 'fail' && splitFindings(findings).length === 0) {
    throw new Error(`A fail verdict for candidate ${candidate} on ${landmarkId} names no corrective finding ("${findings}"); a failed verdict that leaves the landmark with no corrective Task is refused.`);
  }
  if (!commitExists(root, candidate)) {
    throw new Error(`Candidate ${candidate} does not exist in this repository (checked via git cat-file -e); a review must bind to a real commit, never an invented or mistyped SHA.`);
  }
  const parent = findLandmarkParent(root, landmarkId);
  if (parent.lifecycleFolder) throw new Error(`${parent.id} is retired in ${parent.lifecycleFolder}/; a retired landmark is not reviewed again: ${NEW_SPEC_ROUTE}.`);
  const children = landmarkChildren(root, parent);
  const participation = landmarkParticipation(parent, children, reviewer);
  if (participation.length > 0) {
    throw new Error(`Reviewer "${reviewer}" took part in ${parent.id}: ${participation.join('; ')}. The whole-landmark review comes from a separate context with no part in that landmark; self-review never counts.`);
  }
  if (result === 'fail') planCorrectiveFindings(root, parent, splitFindings(findings));

  const currentDigest = computeLandmarkDigest(root, parent, children);
  const givenDigest = options.digest ? String(options.digest).trim() : null;
  if (givenDigest && givenDigest !== currentDigest) {
    throw new Error(`The digest ${givenDigest.slice(0, 12)} named for candidate ${candidate} on ${parent.id} does not match this working tree's current landmark digest ${currentDigest.slice(0, 12)}; the landmark or a child record has changed since that digest was computed. Read a fresh --digest from a new report before recording this verdict, or omit --digest to record against the current content.`);
  }
  const digest = givenDigest ?? currentDigest;
  const committed = landmarkContentBinding(root, parent, children, candidate, digest);
  if (!committed.matchesContent) {
    throw new Error(`Candidate ${candidate} does not contain the reviewed committed content for ${parent.id}: ${committed.contentError ?? `candidate digest ${committed.contentDigest.slice(0, 12)} differs from reviewed content digest ${digest.slice(0, 12)}`}. Commit the assembled landmark and review that immutable candidate before recording a verdict.`);
  }
  const digest12 = digest.slice(0, 12);
  const existingVerdicts = parseVerdicts(parseEvidence(parent.content));
  const duplicate = existingVerdicts.find((verdict) =>
    verdict.candidate === candidate && verdict.result === result && verdict.digest === digest12
    && verdict.findings === findings && verdict.reviewer === reviewer);
  if (duplicate) {
    throw new Error(`An identical verdict (${result} at ${candidate} [${digest12}], findings "${findings}", reviewer "${reviewer}") is already recorded for ${parent.id} as row #${duplicate.ordinal}; recording the exact same review twice is refused rather than duplicated.`);
  }
  const ordinal = existingVerdicts.length + 1;

  const date = new Date().toISOString().slice(0, 10);
  const remainingGap = findingsGap(findings);
  const cells = [date, 'review', `Review verdict: ${result} at ${candidate} [${digest12}] #${ordinal}`, findings, reviewer, remainingGap];
  const row = `| ${cells.map(escapeMarkdownTableCell).join(' | ')} |`;
  let content = appendEvidence(parent.content, row);
  let reached = false;
  let notReached = [];
  if (result === 'pass') {
    const openChildren = openChildrenOf(children.map((spec) => childSpecEntry(root, spec)), directTaskEntries(parent));
    notReached = [
      ...openChildren.map(openChildReason),
      ...parent.successChecks.filter((check) => !check.done).map((check) => `Reached check is unticked: ${check.text}`)
    ];
    if (notReached.length === 0) {
      content = updateFields(content, {
        Status: 'reached',
        Updated: date,
        'Latest event': `Whole-landmark review passed at ${candidate} by ${reviewer}; ${parent.id} reached.`,
        'Next gate': `Retire ${parent.id} into its Landmark Wiki page.`
      });
      reached = true;
    }
  }
  atomicWrite(parent.filePath, content);

  // Row-then-Tasks, exactly as `recordReviewVerdict`: the row is durable
  // first, and `createCorrectiveTasks(root, LMK-###, ...)` is the recovery
  // call if the process stops between the two.
  let correctiveTasks;
  let continuedTasks;
  if (result === 'fail') {
    ({ created: correctiveTasks, continued: continuedTasks } = createCorrectiveTasks(root, parent.id, { candidate, findings }));
  }
  return {
    landmarkId: parent.id, candidate, result, findings, reviewer, date, remainingGap, digest, digest12, ordinal, row,
    ...(result === 'pass' ? { reached, notReached } : {}),
    ...(correctiveTasks ? { correctiveTasks, continuedTasks } : {})
  };
}

// Every place the reviewer's context appears as a participant in the
// landmark, as a list of where. A participant name is structured: the
// landmark's Owner (the Director holding the lane), a child Spec's Owner (its
// claimant), any `claimed by <agent>` in a Latest event or evidence row, and a
// child Spec verdict's reviewer; these match when either the reviewer names
// the participant or the participant names the reviewer. Free text - a
// direct or child Task's Receipt rows, and the child Specs' and the
// landmark's own evidence rows - matches when it names the reviewer. The
// landmark's own earlier verdict rows are excluded, so a reviewer may review
// again after corrective work. A name matches as a whole token, ignoring
// case: bounded by anything other than a letter, digit, `_` or `-`.
const NO_PARTICIPANT = /^(?:|unassigned|none|-|n\/a)$/i;

function landmarkParticipation(parent, children, reviewer) {
  const hits = [];
  const named = (participant, where) => {
    const name = String(participant ?? '').trim();
    if (NO_PARTICIPANT.test(name)) return;
    if (namesContext(reviewer, name) || namesContext(name, reviewer)) hits.push(`${where} names ${name}`);
  };
  const claimants = (text, where) => {
    for (const match of String(text ?? '').matchAll(/\bclaimed by (\S+)/gi)) named(match[1].replace(/[.,;:)]+$/, ''), where);
  };
  const mentioned = (text, where) => {
    if (namesContext(text, reviewer)) hits.push(`${where} names ${reviewer}`);
  };
  const receipts = (records, where) => {
    for (const record of records) {
      for (const row of readReceipt(record.content, record.filePath)) {
        mentioned([row.branch, row.testsRun, row.docsTouched, row.remainingGap].join(' | '), `${where}/${record.id} Receipt run ${row.run}`);
      }
    }
  };

  named(parent.owner, `${parent.id} Owner`);
  claimants(parent.latestEvent, `${parent.id} Latest event`);
  parseEvidence(parent.content).rows.forEach(({ cells }, index) => {
    if (cells[1] === 'review') return;
    claimants(cells.join(' | '), `${parent.id} evidence row ${index + 1}`);
    mentioned(cells.join(' | '), `${parent.id} evidence row ${index + 1}`);
  });
  receipts([...parent.records, ...parent.retiredRecords], parent.id);
  for (const spec of children) {
    named(spec.owner, `${spec.id} Owner`);
    claimants(spec.latestEvent, `${spec.id} Latest event`);
    parseEvidence(spec.content).rows.forEach(({ cells }, index) => {
      if (cells[1] === 'owner-qa') return;
      if (cells[1] === 'review' && VERDICT_PATTERN.test(cells[2] ?? '')) {
        named(cells[4], `${spec.id} review verdict row ${index + 1}`);
        return;
      }
      claimants(cells.join(' | '), `${spec.id} evidence row ${index + 1}`);
      mentioned(cells.join(' | '), `${spec.id} evidence row ${index + 1}`);
    });
    receipts([...(spec.records ?? []), ...(spec.retiredRecords ?? [])], spec.id);
  }
  return [...new Set(hits)];
}

function namesContext(text, name) {
  const haystack = String(text ?? '').toLowerCase();
  const needle = String(name ?? '').trim().toLowerCase();
  if (!needle) return false;
  for (let index = haystack.indexOf(needle); index >= 0; index = haystack.indexOf(needle, index + 1)) {
    const before = index === 0 ? '' : haystack[index - 1];
    const after = haystack[index + needle.length] ?? '';
    if (!/[a-z0-9_-]/.test(before) && !/[a-z0-9_-]/.test(after)) return true;
  }
  return false;
}

// The plain `report LMK-###` form, a rendering of the same object `--json`
// prints: the landmark line, its digest and candidate, its latest verdict,
// the reached checks, each child Spec and direct Task, and the gaps.
export function formatLandmarkReport(report) {
  const lines = [];
  lines.push(`${report.id} - ${report.title} [${report.status}]`);
  lines.push(`Landmark digest: ${report.landmarkDigest.slice(0, 12)}`);
  const c = report.candidate;
  lines.push(c
    ? `Candidate ${c.sha} (resolved ${c.resolvedSha ?? 'none'}) exists=${c.existsInRepository} matchesHead=${c.matchesHead} matchesContent=${c.matchesContent} (head ${c.headSha ?? 'none'}; committed digest ${c.contentDigest ?? 'unavailable'}${c.contentError ? `; ${c.contentError}` : ''})`
    : 'Candidate: none named');
  const v = report.latestVerdict;
  lines.push(v ? `Verdict: ${v.result} at ${v.candidate} by ${v.reviewer} (${v.date}) [digest ${v.digest}]` : 'Verdict: none for this content');
  lines.push('Reached checks:');
  for (const check of report.successChecks) lines.push(`  [${check.done ? 'x' : ' '}] ${check.text}`);
  const state = (item) => `${item.open ? ' (open)' : ''}${item.retired ? ' [retired]' : ''}`;
  lines.push('Child Specs:');
  if (report.childSpecs.length === 0) lines.push('  none');
  for (const child of report.childSpecs) {
    const verdict = child.latestVerdict ? `${child.latestVerdict.result} by ${child.latestVerdict.reviewer}` : 'none';
    lines.push(`  ${child.id} ${child.status}${state(child)} verdict ${verdict}`);
  }
  lines.push('Direct Tasks:');
  if (report.directTasks.length === 0) lines.push('  none');
  for (const task of report.directTasks) lines.push(`  ${task.id} ${task.status}${state(task)}`);
  lines.push(`Decision records: ${report.decisionRecords.length}`);
  lines.push(`Gaps (${report.gaps.length}):`);
  for (const gap of report.gaps) lines.push(`  - ${gap}`);
  return lines.join('\n');
}
