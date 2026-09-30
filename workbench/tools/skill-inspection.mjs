// Read-only skills-lane inspection (S-00V). The core skills ship inside the
// room at the manifest-declared skills lane, and the declared discovery roots
// (`.agents/skills`, `.claude/skills`) are tracked adapters into it. Doctor
// reads the project tree only: it never reads the provider home and never
// writes. Discovery is filesystem evidence, never proof that a configured
// application can invoke a skill.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { finding } from './diagnostics.mjs';

// One hash over a skill directory's ordinary files, in stable order. The
// managed marker a personal-catalog install writes beside the files is
// excluded so the hash describes the skill, not its installation.
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

// The earliest room release the personal-catalog installer's marker may
// claim compatibility from; the lane itself carries a receipt, not markers.
export const CORE_COMPATIBILITY_MINIMUM = 'v3.1.4';

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function realpathOrNull(target) {
  try { return fs.realpathSync(target); } catch { return null; }
}

// The declared discovery roots are the only ones a Codex or Claude host reads
// at the project root; a policy naming anything else is not one this room's
// tools can reason about.
const SUPPORTED_DISCOVERY = ['.agents/skills', '.claude/skills'];

export function inspectSkills(manifest, project) {
  if (manifest?.schemaVersion !== 2) return [];
  const required = manifest.skillPolicy?.required, discovery = manifest.skillPolicy?.discovery;
  if (!Array.isArray(required) || !Array.isArray(discovery) ||
      required.some(name => typeof name !== 'string' || !/^[a-z][a-z0-9-]*$/.test(name)) ||
      discovery.some(root => !SUPPORTED_DISCOVERY.includes(root))) {
    return [finding('invalid-skill-policy', 'Core inspection requires safe declared skill names and supported discovery roots.')];
  }
  const root = path.resolve(project);
  const findings = [];
  const shadow = lstatOrNull(path.join(root, 'skills'));
  if (shadow) findings.push(finding('project-local-skills', 'a root skills/ directory shadows the skills lane; move its contents into the lane or remove it', { path: 'skills' }));
  const laneRelative = manifest.lanes?.skills;
  if (typeof laneRelative !== 'string' || !laneRelative.startsWith('workbench/') || laneRelative.includes('..')) {
    findings.push(finding('skill-lane-missing', 'the manifest declares no skills lane under workbench/; run workbench-layout.mjs migrate --project PATH once', { lane: laneRelative ?? null }));
    return findings;
  }
  const lane = path.join(root, laneRelative);
  const laneEntry = lstatOrNull(lane);
  if (!laneEntry) {
    findings.push(finding('skill-lane-missing', `${laneRelative} is absent; run workbench-skills.mjs install from the release checkout`, { lane: laneRelative }));
    return findings;
  }
  if (laneEntry.isSymbolicLink() || !laneEntry.isDirectory()) {
    findings.push(finding('skill-lane-unreadable', `${laneRelative} must be an ordinary directory`, { lane: laneRelative }));
    return findings;
  }
  // Each adapter is judged once: a discovery root that is absent, or that
  // resolves outside the lane, is reported by root rather than per skill.
  const adapters = {};
  for (const discoveryRoot of discovery) {
    const adapter = path.join(root, discoveryRoot);
    const entry = lstatOrNull(adapter);
    if (!entry) {
      findings.push(finding('skill-adapter-missing', `${discoveryRoot} is absent, so that host cannot discover ${laneRelative}; run workbench-skills.mjs install from the release checkout`, { root: discoveryRoot }));
      adapters[discoveryRoot] = null;
      continue;
    }
    const resolved = realpathOrNull(adapter);
    if (!resolved || !fs.statSync(resolved).isDirectory()) {
      findings.push(finding('skill-adapter-broken', `${discoveryRoot} does not resolve to a directory`, { root: discoveryRoot }));
      adapters[discoveryRoot] = null;
      continue;
    }
    adapters[discoveryRoot] = resolved;
  }
  const laneReal = fs.realpathSync(lane);
  // A lane holding none of the required skills is one condition (it was
  // never installed), not one finding per skill.
  if (required.every((skill) => !lstatOrNull(path.join(lane, skill, 'SKILL.md')))) {
    findings.push(finding('skill-lane-missing', `${laneRelative} holds none of the ${required.length} required core skills; run workbench-skills.mjs install --project PATH from the release checkout`, { lane: laneRelative }));
    return findings;
  }
  for (const skill of required) {
    const skillDir = path.join(lane, skill);
    const skillEntry = lstatOrNull(skillDir);
    const skillFile = lstatOrNull(path.join(skillDir, 'SKILL.md'));
    if (!skillEntry || !skillFile) {
      findings.push(finding('skill-lane-missing', `${laneRelative}/${skill}/SKILL.md is missing; run workbench-skills.mjs update --project PATH --explicit-update from the release checkout`, { skill, lane: laneRelative }));
      continue;
    }
    if (skillEntry.isSymbolicLink() || !skillEntry.isDirectory() || !skillFile.isFile() || skillFile.isSymbolicLink() || skillFile.nlink !== 1) {
      findings.push(finding('skill-lane-unreadable', `${laneRelative}/${skill} must be an ordinary directory holding an ordinary, unshared SKILL.md`, { skill, lane: laneRelative }));
      continue;
    }
    for (const discoveryRoot of discovery) {
      if (adapters[discoveryRoot] === null) continue;
      const resolved = realpathOrNull(path.join(root, discoveryRoot, skill, 'SKILL.md'));
      if (resolved !== path.join(laneReal, skill, 'SKILL.md')) {
        findings.push(finding('skill-adapter-broken', `${discoveryRoot}/${skill} does not resolve into ${laneRelative}/${skill}`, { skill, root: discoveryRoot }));
      }
    }
    const extra = lstatOrNull(path.join(root, '.codex', 'skills', skill));
    if (extra) findings.push(finding('skill-duplicate-discovery', `.codex/skills/${skill} adds a second Codex discovery entry; preserve and reconcile it explicitly.`, { skill, root: '.codex/skills' }));
  }
  return findings;
}
