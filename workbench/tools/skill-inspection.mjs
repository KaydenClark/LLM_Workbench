// Read-only global core inspection. Discovery is filesystem evidence, never
// proof that a configured application can invoke a skill.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { readManagedSkillMarker } from './workbench-layout.mjs';
import { finding } from './diagnostics.mjs';

export function skillContentHash(directory) {
  const hash = crypto.createHash('sha256');
  function walk(current, relative = '') {
    for (const name of fs.readdirSync(current).sort((a, b) => a.localeCompare(b))) {
      if (name === '.workbench-skill.json') continue;
      const target = path.join(current, name), child = path.posix.join(relative, name);
      const stat = fs.lstatSync(target);
      if (stat.isDirectory()) walk(target, child);
      else if (stat.isFile() && stat.nlink === 1) hash.update(`${child}\0`).update(fs.readFileSync(target)).update('\0');
      else throw new Error('Core content must contain ordinary unshared files and directories');
    }
  }
  walk(directory);
  return hash.digest('hex');
}

function version(value) {
  const match = typeof value === 'string' && /^v(\d+)\.(\d+)\.(\d+)$/.exec(value);
  return match ? match.slice(1).map(BigInt) : null;
}
function compare(left, right) {
  for (let index = 0; index < 3; index += 1) if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  return 0;
}
export const CORE_COMPATIBILITY_MINIMUM = 'v3.1.4';

function rangeState(range, room, producingRelease) {
  const minimum = version(range?.minimum), maximum = version(range?.maximum), current = version(room);
  if (range?.minimum !== CORE_COMPATIBILITY_MINIMUM || range?.maximum !== producingRelease || !minimum || !maximum || !current || compare(minimum, maximum) > 0) return 'unknown';
  return compare(current, minimum) >= 0 && compare(current, maximum) <= 0 ? 'compatible' : 'incompatible';
}

function discover(home, relative) {
  let current = home;
  try {
    for (const segment of relative.split('/')) {
      current = path.join(current, segment);
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) {
        if (!fs.statSync(current).isDirectory()) return { status: 'broken' };
      } else if (!stat.isDirectory()) return { status: 'broken' };
    }
    const file = fs.lstatSync(path.join(current, 'SKILL.md'));
    if (!file.isFile() || file.nlink !== 1) return { status: 'broken' };
    return { status: 'present', resolved: fs.realpathSync.native(current), linked: fs.lstatSync(current).isSymbolicLink() };
  } catch (error) {
    // An absent path is missing; an extant directory without SKILL.md or a
    // broken intermediate link is a discovery failure.
    let existing;
    try { existing = fs.lstatSync(current); } catch {}
    return { status: error.code === 'ENOENT' && !existing ? 'missing' : 'broken' };
  }
}

export function inspectSkills(manifest, home) {
  if (manifest?.schemaVersion !== 2) return [];
  const required = manifest.skillPolicy?.required, discovery = manifest.skillPolicy?.discovery;
  if (!Array.isArray(required) || !Array.isArray(discovery) ||
      required.some(name => typeof name !== 'string' || !/^[a-z][a-z0-9-]*$/.test(name)) ||
      discovery.some(root => !['.agents/skills', '.claude/skills'].includes(root))) {
    return [finding('invalid-skill-policy', 'Core inspection requires safe declared skill names and supported discovery roots.')];
  }
  const findings = [], generations = new Set();
  const homeDir = path.resolve(home);
  for (const skill of required) {
    const sources = new Set();
    for (const root of discovery) {
      const relative = `${root}/${skill}`, entry = discover(homeDir, relative);
      const details = { skill, root };
      if (entry.status !== 'present') {
        findings.push(finding(entry.status === 'missing' ? 'skill-missing' : 'skill-discovery-broken', `${relative} is ${entry.status}; discovery inspection never repairs it.`, details));
        continue;
      }
      sources.add(entry.resolved);
      if (root === '.agents/skills' && entry.linked) findings.push(finding('skill-source-conflict', `${relative} links its canonical per-skill source; reconcile its ownership before replacement.`, details));
      const marker = readManagedSkillMarker(entry.resolved);
      if (marker?.schemaVersion !== 2 || !version(marker.release) || !/^[0-9a-f]{40}$/.test(marker.commit ?? '') || !/^[0-9a-f]{64}$/.test(marker.contentHash ?? '')) {
        findings.push(finding('skill-generation-unknown', `${relative} has no complete managed generation identity.`, details));
        continue;
      }
      let hash;
      try { hash = skillContentHash(entry.resolved); }
      catch { findings.push(finding('skill-discovery-broken', `${relative} contains unsafe or unreadable core content.`, details)); continue; }
      if (hash !== marker.contentHash) {
        findings.push(finding('skill-content-modified', `${relative} differs from its recorded content hash; preserve its changes.`, details));
        continue;
      }
      generations.add(`${marker.release}@${marker.commit}`);
      const compatible = rangeState(marker.compatibleRooms, manifest.workbenchVersion, marker.release);
      if (compatible === 'unknown') findings.push(finding('skill-compatibility-unknown', `${relative} declares no valid room compatibility range.`, { ...details, release: marker.release, expected: manifest.workbenchVersion }));
      else if (compatible === 'incompatible') findings.push(finding('incompatible-core', `${relative} core ${marker.release} supports ${marker.compatibleRooms.minimum} through ${marker.compatibleRooms.maximum}; this room runs ${manifest.workbenchVersion}.`, { ...details, release: marker.release, expected: manifest.workbenchVersion }));
    }
    if (sources.size > 1) findings.push(finding('skill-source-conflict', `${skill} resolves to separate maintained implementations across discovery roots.`, { skill }));
    const extra = discover(homeDir, `.codex/skills/${skill}`);
    if (extra.status !== 'missing') findings.push(finding('skill-duplicate-discovery', `.codex/skills/${skill} adds a second Codex discovery entry; preserve and reconcile it explicitly.`, { skill, root: '.codex/skills' }));
  }
  if (generations.size > 1) findings.push(finding('core-generation-conflict', 'Installed core skills declare more than one global generation.', { generations: [...generations].sort() }));
  return findings;
}
