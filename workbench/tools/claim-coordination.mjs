#!/usr/bin/env node
// S-00V TK-01L (ADR-000O): claims are visible across instances.
//
// `claim` commits the claim on its task branch and pushes it; `next` and
// `claim` fetch origin, read the declared integration branch as the base and
// overlay Task state from every other remote tip, so a Task claimed on any tip
// is taken. A room this cannot coordinate - no Git work tree, no `origin`, no
// declared integration branch, no `origin/<integration>` to read as the base,
// or an explicit `--local` - keeps today's local behavior and reports why.
//
// The overlay follows `occupiedIdentities` in spec-workbench.mjs (read the
// specs lane at every `refs/remotes` tip); branch, upstream and dirty state
// come from `readRepositoryState` (workbench-layout.mjs), never a second
// reader.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { readRepositoryState } from './workbench-layout.mjs';
import { declaredGit } from './workbench-paths.mjs';
import { parseMarkdownTableRow } from './markdown-table.mjs';
import { TASK_STATUSES } from './task-record.mjs';

export const COORDINATION_REMOTE = 'origin';

// A tip that moved a Task to one of these, away from the base, has claimed it:
// in-progress is the claim itself, done is a claim closed and awaiting review.
const TAKEN = new Set(['in-progress', 'done']);

// Never let a credential prompt hang a claim: a fetch or push that needs one
// fails, and the failure is reported.
const GIT_ENV = { ...process.env, GIT_TERMINAL_PROMPT: '0' };

function git(root, args, timeout) {
  return spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', env: GIT_ENV, maxBuffer: 64 * 1024 * 1024, ...(timeout ? { timeout } : {}) });
}

function gitOk(root, args, message) {
  const result = git(root, args);
  if (result.status !== 0) throw new Error(`${message}: ${(result.stderr || result.error?.message || `git exited ${result.status}`).trim()}`);
  return result.stdout.trim();
}

function failure(result) {
  return (result.stderr || result.error?.message || `git exited ${result.status}`).trim().replace(/\s+/g, ' ');
}

// Resolve how this session coordinates. `requireFetch` (claim) refuses when a
// remote exists but cannot be fetched: a claim that cannot read the remote
// cannot be made visible to it either. `next` answers from the last fetched
// refs instead and reports the failure.
export function coordinationContext(root, { specsPrefix, local = false, fetch = true, requireFetch = false } = {}) {
  if (local) return { mode: 'local', reason: 'requested with --local' };
  const state = readRepositoryState(root);
  if (!state.known) return { mode: 'local', reason: `not a Git work tree (${state.reason})` };
  if (!state.remotes.includes(COORDINATION_REMOTE)) return { mode: 'local', reason: `no remote named ${COORDINATION_REMOTE}` };
  const declared = declaredGit(root);
  if (!declared) return { mode: 'local', reason: 'no integration branch declared in workbench/manifest.json' };
  let fetched = false;
  let fetchError = null;
  if (fetch) {
    const result = git(root, ['fetch', '--prune', '--quiet', COORDINATION_REMOTE], 120000);
    if (result.status === 0) fetched = true;
    else fetchError = failure(result);
    if (fetchError && requireFetch) {
      throw new Error(`claim refused: cannot fetch from ${COORDINATION_REMOTE} (${fetchError}); a claim that cannot read the remote cannot be made visible to other instances`);
    }
  }
  const base = `${COORDINATION_REMOTE}/${declared.integrationBranch}`;
  const baseRef = `refs/remotes/${base}`;
  if (git(root, ['rev-parse', '--verify', '--quiet', baseRef]).status !== 0) {
    return { mode: 'local', reason: `${base} does not exist, so there is no shared base to coordinate against` };
  }
  // The session's own branch is not a competing claim: its upstream and its
  // same-named remote branch are where this instance's own claim lives.
  const own = new Set();
  if (state.head.branch) own.add(`refs/remotes/${COORDINATION_REMOTE}/${state.head.branch}`);
  if (state.upstream?.name) own.add(`refs/remotes/${state.upstream.name}`);
  const listed = gitOk(root, ['for-each-ref', '--format=%(refname)%00%(symref)', `refs/remotes/${COORDINATION_REMOTE}`], 'cannot list remote refs');
  const tips = listed.split('\n').filter(Boolean).map((line) => line.split('\0'))
    .filter(([ref, symref]) => !symref && ref !== baseRef && !own.has(ref)).map(([ref]) => ref);
  const statuses = readTaskStatusesAt(root, [baseRef, ...tips], specsPrefix);
  const baseStatuses = statuses.get(baseRef) ?? new Map();
  const claims = new Map();
  for (const tip of tips) {
    for (const [key, status] of statuses.get(tip) ?? []) {
      if (!TAKEN.has(status) || baseStatuses.get(key) === status) continue;
      if (!claims.has(key)) claims.set(key, []);
      claims.get(key).push(tip.slice('refs/remotes/'.length));
    }
  }
  return { mode: 'remote', remote: COORDINATION_REMOTE, base, baseRef, integrationBranch: declared.integrationBranch, defaultBranch: declared.defaultBranch, fetched, fetchError, state, claims };
}

// Task status per `SPEC-ID/TK-ID` at each ref, from Task records and the
// slice rows of table-backed Specs, in one `git grep` across every ref.
export function readTaskStatusesAt(root, refs, specsPrefix) {
  const statuses = new Map();
  if (refs.length === 0) return statuses;
  const pattern = '^\\*\\*(Spec ID|Task ID|Status):\\*\\*|^\\|[[:space:]]*TK-';
  const result = git(root, ['grep', '-I', '-E', pattern, ...refs, '--', specsPrefix]);
  if (![0, 1].includes(result.status)) throw new Error(`Cannot read remote claims: ${failure(result)}`);
  const byLength = [...refs].sort((a, b) => b.length - a.length);
  const files = new Map();
  for (const line of result.stdout.split('\n')) {
    if (!line) continue;
    const ref = byLength.find((candidate) => line.startsWith(`${candidate}:`));
    if (!ref) continue;
    const rest = line.slice(ref.length + 1);
    const cut = rest.indexOf(':');
    if (cut < 0) continue;
    const file = rest.slice(0, cut);
    const text = rest.slice(cut + 1);
    const key = `${ref}\0${file}`;
    if (!files.has(key)) files.set(key, { ref, file, fields: {}, rows: [] });
    const entry = files.get(key);
    const field = text.match(/^\*\*(Spec ID|Task ID|Status):\*\*\s*(\S+)/);
    if (field) entry.fields[field[1]] ??= field[2];
    else entry.rows.push(text);
  }
  for (const { ref, file, fields, rows } of files.values()) {
    if (!statuses.has(ref)) statuses.set(ref, new Map());
    const map = statuses.get(ref);
    const specId = fields['Spec ID'];
    if (!specId) continue;
    if (path.posix.basename(file) === 'TASK.md') {
      if (fields['Task ID'] && TASK_STATUSES.includes(fields.Status)) map.set(`${specId}/${fields['Task ID']}`, fields.Status);
      continue;
    }
    if (path.posix.basename(file) !== 'SPEC.md') continue;
    for (const row of rows) {
      const cells = parseMarkdownTableRow(row);
      if (/^TK-[0-9A-Za-z]{3,}$/.test(cells[0] ?? '') && TASK_STATUSES.includes(cells[2])) map.set(`${specId}/${cells[0]}`, cells[2]);
    }
  }
  return statuses;
}

// The JSON a caller sees: where the session coordinated and what it skipped.
export function publicCoordination(context, remoteClaimed = []) {
  if (context.mode !== 'remote') return { mode: 'local', reason: context.reason };
  return {
    mode: 'remote',
    remote: context.remote,
    base: context.base,
    fetched: context.fetched,
    ...(context.fetchError ? { fetchError: context.fetchError } : {}),
    remoteClaimed
  };
}

// `claude-lane-F` claiming S-00V TK-01L -> `claude/s00v-tk01l`: the agent's
// leading word is the branch prefix AGENTS.md's Git rules ask for.
export function defaultClaimBranch(agent, specId, taskId) {
  const prefix = String(agent).toLowerCase().split(/[^a-z0-9]+/).find(Boolean) ?? 'claim';
  return `${prefix}/${specId.replace('-', '')}-${taskId.replace('-', '')}`.toLowerCase();
}

function pendingPaths(root, paths) {
  const result = git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', ...paths]);
  if (result.status !== 0) throw new Error(`claim refused: cannot read the working tree: ${failure(result)}`);
  const entries = result.stdout.split('\0').filter(Boolean);
  const pending = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    pending.push({ code: entry.slice(0, 2), file: entry.slice(3) });
    if (/^[RC]/.test(entry)) index += 1;
  }
  return pending;
}

function listFiles(files) {
  return files.length > 10 ? `${files.slice(0, 10).join(', ')}, and ${files.length - 10} more` : files.join(', ');
}

// Commit the claim on its task branch and push it. On the integration
// branch, the default branch or a detached HEAD, claim cuts the task branch
// from the fetched integration base; on any other branch (a lane that already
// cut its own) it commits and pushes there. `apply` performs the ordinary
// claim in the working tree and returns `{ result, specId, taskId }`;
// `project` re-renders the projections the claim changes. Any failure after
// the first write - including a rejected push - restores the exact prior
// checkout and removes the branch it cut, so nothing reports a claim that did
// not reach the remote.
export function publishClaim(root, context, { agent, branch: requestedBranch, specsPrefix, apply, project }) {
  const { state } = context;
  const cuts = state.head.detached || [context.integrationBranch, context.defaultBranch].includes(state.head.branch);
  const where = state.head.detached ? 'the detached HEAD' : state.head.branch;
  if (cuts && state.dirty.length > 0) {
    throw new Error(`claim refused: ${where} has uncommitted changes (${listFiles(state.dirty)}); claim cuts the task branch from ${context.base} and must not carry them - commit or set them aside first`);
  }
  // Only the claim's own writes may enter the claim commit.
  const claimPaths = [specsPrefix, 'TASKBOARD.md', 'BLUEPRINT.md'].filter((item, index, all) => all.indexOf(item) === index);
  const preexisting = pendingPaths(root, claimPaths);
  if (preexisting.length > 0) {
    throw new Error(`claim refused: uncommitted changes under the claim's own paths would be swept into the claim commit (${listFiles(preexisting.map((item) => item.file))}); commit them first`);
  }
  const startSha = gitOk(root, ['rev-parse', 'HEAD'], 'claim refused: cannot read HEAD');
  // Porcelain paths are repository-relative; the room may be a subdirectory.
  const top = gitOk(root, ['rev-parse', '--show-toplevel'], 'claim refused: cannot find the repository root');
  let moved = false;
  let committed = null;
  let created = null;
  const rollback = () => {
    const notes = [];
    const attempt = (args, what, at = root) => { const result = git(at, args); if (result.status !== 0) notes.push(`${what}: ${failure(result)}`); };
    for (const { code, file } of pendingPaths(root, claimPaths)) {
      if (code === '??') {
        try { fs.rmSync(path.join(top, file), { force: true }); } catch (error) { notes.push(`remove ${file}: ${error.message}`); }
      } else attempt(['restore', '--source=HEAD', '--staged', '--worktree', '--', file], `restore ${file}`, top);
    }
    if (cuts && moved) {
      if (state.head.detached) attempt(['checkout', '--quiet', '--detach', startSha], 'return to the detached HEAD');
      else attempt(['switch', '--quiet', state.head.branch], `return to ${state.head.branch}`);
      if (created) attempt(['update-ref', '-d', `refs/heads/${created}`, committed], `remove branch ${created}`);
    } else if (committed) attempt(['reset', '--quiet', '--keep', startSha], 'undo the claim commit');
    return notes;
  };
  try {
    if (cuts) {
      gitOk(root, ['checkout', '--quiet', '--detach', context.baseRef], `claim refused: cannot check out ${context.base}`);
      moved = true;
    }
    const claimed = apply(context.claims);
    project();
    if (pendingPaths(root, claimPaths).length === 0) throw new Error('claim refused: the claim wrote nothing to commit');
    const branch = cuts ? (requestedBranch ?? defaultClaimBranch(agent, claimed.specId, claimed.taskId)) : state.head.branch;
    if (cuts) {
      if (git(root, ['check-ref-format', '--branch', branch]).status !== 0) throw new Error(`claim refused: ${branch} is not a valid branch name; pass --branch NAME`);
      if (git(root, ['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`]).status === 0
        || git(root, ['rev-parse', '--verify', '--quiet', `refs/remotes/${COORDINATION_REMOTE}/${branch}`]).status === 0) {
        throw new Error(`claim refused: branch ${branch} already exists; pass --branch NAME`);
      }
    }
    const present = claimPaths.filter((item) => fs.existsSync(path.join(root, item)));
    gitOk(root, ['add', '-A', '--', ...present], 'claim refused: cannot stage the claim');
    gitOk(root, ['commit', '--quiet', '-m', `Claim ${claimed.specId} ${claimed.taskId}`, '-m', `Claimed by ${agent}.`, '--', ...present], 'claim refused: cannot commit the claim');
    committed = gitOk(root, ['rev-parse', 'HEAD'], 'claim refused: cannot read the claim commit');
    if (cuts) {
      gitOk(root, ['switch', '--quiet', '-c', branch], `claim refused: cannot create ${branch}`);
      created = branch;
    }
    // Always the same-named remote branch, never the upstream: a lane cut with
    // `git switch -c X origin/integration` tracks integration, and pushing
    // there would be the direct integration claim commit ADR-000O rejects.
    if ([context.integrationBranch, context.defaultBranch].includes(branch)) throw new Error(`claim refused: will not push a claim to ${branch}`);
    const push = git(root, ['push', '--quiet', '-u', COORDINATION_REMOTE, `HEAD:refs/heads/${branch}`], 120000);
    if (push.status !== 0) throw new Error(`claim refused: push to ${COORDINATION_REMOTE} failed (${failure(push)})`);
    return {
      ...claimed.result,
      coordination: { ...publicCoordination(context, claimed.remoteClaimed ?? []), branch, created: cuts, commit: committed, pushed: true }
    };
  } catch (error) {
    const notes = rollback();
    const restored = notes.length === 0 ? 'the checkout is restored and nothing was claimed' : `restore incomplete - ${notes.join('; ')}`;
    const wrapped = new Error(`${error.message}; ${restored}`);
    wrapped.cause = error;
    throw wrapped;
  }
}
