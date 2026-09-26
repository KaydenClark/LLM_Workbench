// S-00V TK-00H: the session-start host floor check (Desired Behavior 5,
// grilling decision-008). A Portable Workbench session needs exactly this
// floor and nothing else: Node 18+, Python 3.9+, git, `gh` authenticated with
// push rights to the room's remote, and network to GitHub. Anything beyond it
// is an optional capability a Task names in its Packet (TK-00K), not a floor
// item.
//
// The check runs only in the session-start invocation, `spec-workbench.mjs
// doctor --host`. Plain `doctor` never calls a probe: the suite and read-only
// reviewers run it with no network and no `gh` credentials, so it must stay
// deterministic offline. A missing floor item is the registered `all` finding
// `host-floor-unmet`, so `doctor --host` exits non-zero on it; `next` and
// `claim` never run the probes and so never see it.
//
// Every probe sits behind one injectable seam (`probes`). A probe returns the
// raw fact it observed; the thresholds are judged here, so a test injects
// facts and never reads the real host, the network or real credentials. A
// probe that throws is reported as a failed item with its error, never
// swallowed and never a crash.
import { spawnSync } from 'node:child_process';
import { finding } from './diagnostics.mjs';

export const HOST_FLOOR = Object.freeze([
  Object.freeze({ item: 'node', requirement: 'Node 18+' }),
  Object.freeze({ item: 'python', requirement: 'Python 3.9+' }),
  Object.freeze({ item: 'git', requirement: 'git' }),
  Object.freeze({ item: 'gh', requirement: "gh authenticated with push rights to the room's remote" }),
  Object.freeze({ item: 'network', requirement: 'network to GitHub' })
]);

const PROBE_TIMEOUT_MS = 20_000;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: PROBE_TIMEOUT_MS, ...options });
  if (result.error) return { ok: false, output: result.error.message };
  return { ok: result.status === 0, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim() };
}

function firstLine(text) {
  return String(text ?? '').split('\n')[0].trim();
}

// `owner/repo` for a GitHub remote URL in https, ssh or scp form, else null.
export function githubRepository(url) {
  const match = /^(?:https?:\/\/(?:[^@/]+@)?github\.com\/|ssh:\/\/git@github\.com\/|git@github\.com:)([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/.exec(String(url ?? '').trim());
  return match ? `${match[1]}/${match[2]}` : null;
}

// The real host. Each returns the raw fact; nothing here judges a threshold.
export const defaultProbes = Object.freeze({
  node: () => process.version,
  python: () => {
    for (const command of ['python3', 'python']) {
      const result = run(command, ['--version']);
      if (result.ok) return firstLine(result.output);
    }
    return null;
  },
  git: () => {
    const result = run('git', ['--version']);
    return result.ok ? firstLine(result.output) : null;
  },
  // The room's remote is `origin`, the remote the Git rules push to.
  gh: (root) => {
    const version = run('gh', ['--version']);
    if (!version.ok) return { version: null, authenticated: false, repository: null, push: null };
    const authenticated = run('gh', ['auth', 'status', '--hostname', 'github.com']).ok;
    const remote = run('git', ['-C', root, 'remote', 'get-url', 'origin']);
    const repository = remote.ok ? githubRepository(firstLine(remote.output)) : null;
    let push = null;
    if (authenticated && repository) {
      const permission = run('gh', ['api', `repos/${repository}`, '--jq', '.permissions.push']);
      push = permission.ok ? firstLine(permission.output) === 'true' : null;
    }
    return { version: firstLine(version.output), authenticated, repository, push };
  },
  network: () => {
    const script = "fetch('https://github.com',{method:'HEAD',signal:AbortSignal.timeout(15000)}).then(r=>{console.log('https://github.com answered HTTP '+r.status)},e=>{console.log(String(e.cause?.code??e.message));process.exitCode=1})";
    const result = run(process.execPath, ['-e', script]);
    return { reachable: result.ok, detail: firstLine(result.output) || 'no response' };
  }
});

function versionAtLeast(text, pattern, minimum) {
  const match = pattern.exec(String(text ?? ''));
  if (!match) return false;
  const actual = match.slice(1).map(Number);
  for (let index = 0; index < minimum.length; index += 1) {
    if (actual[index] !== minimum[index]) return actual[index] > minimum[index];
  }
  return true;
}

const judges = {
  node: (fact) => fact ? { pass: versionAtLeast(fact, /v?(\d+)\.(\d+)/, [18, 0]), observed: fact } : { pass: false, observed: 'not found' },
  python: (fact) => fact ? { pass: versionAtLeast(fact, /(\d+)\.(\d+)/, [3, 9]), observed: fact } : { pass: false, observed: 'not found' },
  git: (fact) => fact ? { pass: true, observed: fact } : { pass: false, observed: 'not found' },
  gh: (fact) => {
    if (!fact?.version) return { pass: false, observed: 'not found' };
    if (!fact.authenticated) return { pass: false, observed: `${fact.version}; not authenticated to github.com` };
    if (!fact.repository) return { pass: false, observed: `${fact.version}; authenticated; no GitHub remote named origin to push to` };
    if (fact.push !== true) return { pass: false, observed: `${fact.version}; authenticated; no push rights to ${fact.repository}${fact.push === null ? ' (permission unreadable)' : ''}` };
    return { pass: true, observed: `${fact.version}; authenticated; push to ${fact.repository}` };
  },
  network: (fact) => ({ pass: fact?.reachable === true, observed: fact?.detail ?? 'no response' })
};

// Reports every floor item with pass or fail and its observed value, plus one
// `host-floor-unmet` finding per failed item.
export function checkHostFloor(root, { probes = defaultProbes } = {}) {
  const items = HOST_FLOOR.map(({ item, requirement }) => {
    let judged;
    try {
      const probe = probes[item];
      if (typeof probe !== 'function') throw new Error(`no ${item} probe`);
      judged = judges[item](probe(root));
    } catch (error) {
      judged = { pass: false, observed: `probe failed: ${error?.message ?? error}` };
    }
    return { item, requirement, pass: judged.pass, observed: judged.observed };
  });
  const findings = items.filter((entry) => !entry.pass).map((entry) => finding(
    'host-floor-unmet',
    `host floor item ${entry.item} is unmet (needs ${entry.requirement}): ${entry.observed}`,
    { item: entry.item, observed: entry.observed }
  ));
  return { items, findings };
}

export function formatHostFloor(items) {
  const lines = [`host floor (${items.length} items)`];
  for (const entry of items) lines.push(`  ${entry.pass ? 'pass' : 'fail'} ${entry.item}: ${entry.observed} (needs ${entry.requirement})`);
  return lines.join('\n');
}
