#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'skills');
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';
import { markerSourceIdentity, writeManagedMarker } from './skill-marker.mjs';
import { lstatOrNull, presentSkillPath, resolveSkillLink } from './skill-presence.mjs';

function fail(code, message, details = {}) {
  return { status: 'blocked', requiredSkills: coreSkills, installed: [], skipped: [], error: { code, message, ...details } };
}

function validateSource() {
  const names = fs.readdirSync(sourceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const expected = [...coreSkills].sort();
  if (JSON.stringify(names) !== JSON.stringify(expected)) {
    return fail('invalid-bundled-core',
      'The checked-out LLM Workbench skills directory must contain exactly the required core skills.',
      { expected, actual: names });
  }
  for (const skill of coreSkills) {
    const skillFile = path.join(sourceRoot, skill, 'SKILL.md');
    if (!lstatOrNull(skillFile)?.isFile()) {
      return fail('invalid-bundled-core', `Bundled skill ${skill} is missing SKILL.md.`, { skill });
    }
  }
  return null;
}

// S-045 TK-005 decided a symlinked and/or Git-owned discovery root is
// supported. `26c34e9` refused both to stop the harness mutating a user's own
// versioned skills collection, which is a real risk, but it left that layout
// with no route at all. The bounded route is: resolve the link and write into
// the real directory, add only a skill that is missing, and never touch Git -
// no `add`, no `commit`, no `stash`. A root inside a Git repository is reported
// rather than refused, so the collection's owner is not surprised by an
// untracked directory appearing in it.
//
// This relaxes installation only. Replacing an existing skill is a different
// question, and `workbench-upgrade.mjs --explicit-update` still refuses a
// Git-owned root with `foreign-git-root`.
function resolveDestinationRoot(destination) {
  const missing = [];
  let current = path.resolve(destination);
  for (;;) {
    const entry = lstatOrNull(current);
    if (entry) {
      if (!entry.isSymbolicLink() && !entry.isDirectory()) {
        return { error: fail('discovery-root-collision',
          `Discovery root ancestor ${current} must be a directory, a link to one, or absent.`,
          { destination, ancestor: current }) };
      }
      let resolved;
      try {
        resolved = fs.realpathSync(current);
      } catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ELOOP' && error.code !== 'ENOTDIR') throw error;
        return { error: fail('discovery-root-collision',
          `Discovery root ancestor ${current} is a link that does not resolve to a directory.`,
          { destination, ancestor: current }) };
      }
      if (!lstatOrNull(resolved)?.isDirectory()) {
        return { error: fail('discovery-root-collision',
          `Discovery root ancestor ${current} must be a directory, a link to one, or absent.`,
          { destination, ancestor: current }) };
      }
      return { root: path.join(resolved, ...missing.reverse()) };
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return { error: fail('discovery-root-collision',
        `Discovery root ${destination} has no existing ancestor to install into.`, { destination }) };
    }
    missing.push(path.basename(current));
    current = parent;
  }
}

function gitOwner(directory) {
  for (let current = directory; ; current = path.dirname(current)) {
    if (lstatOrNull(path.join(current, '.git'))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
  }
}

function validateDestinations(destinations) {
  const resolved = [];
  const gitOwnedRoots = [];
  for (const { engine, root: destinationRoot } of destinations) {
    const outcome = resolveDestinationRoot(destinationRoot);
    if (outcome.error) return { error: outcome.error };
    const owner = gitOwner(outcome.root);
    if (owner && !gitOwnedRoots.includes(owner)) gitOwnedRoots.push(owner);
    resolved.push({ engine, root: outcome.root, declared: destinationRoot });
    for (const skill of coreSkills) {
      const destination = path.join(outcome.root, skill);
      const entry = lstatOrNull(destination);
      if (!entry) continue;
      if (entry.isSymbolicLink()) {
        if (resolveSkillLink(destination)) continue;
        return { error: fail('skill-path-collision',
          `Skill destination ${destination} is a link whose target is not a directory already holding ${skill}/SKILL.md. Remove or relocate the collision, then retry.`,
          { engine, skill, destination }) };
      }
      if (!entry.isDirectory()) {
        return { error: fail('skill-path-collision',
          `Skill destination ${destination} is not an ordinary directory. Remove or relocate the collision, then retry.`,
          { engine, skill, destination }) };
      }
    }
  }
  return { destinations: resolved, gitOwnedRoots };
}

function parseHome(argv) {
  if (argv.length === 0) return os.homedir();
  if (argv.length === 2 && argv[0] === '--home' && argv[1]) return path.resolve(argv[1]);
  throw new Error('Usage: node tools/core-skill-installer.mjs install [--home USER_HOME]');
}

function install(home) {
  const destinations = [
    { engine: 'codex', root: path.join(home, '.agents', 'skills') },
    { engine: 'claude', root: path.join(home, '.claude', 'skills') }
  ];
  const sourceFailure = validateSource();
  if (sourceFailure) return sourceFailure;
  let identity;
  try { identity = markerSourceIdentity(); } catch (error) { return fail('invalid-source-identity', error.message); }
  const validated = validateDestinations(destinations);
  if (validated.error) return validated.error;

  const report = {
    status: 'complete', requiredSkills: coreSkills, installed: [], skipped: [],
    gitOwnedRoots: validated.gitOwnedRoots
  };
  try {
    for (const { engine, root: destinationRoot } of validated.destinations) {
      fs.mkdirSync(destinationRoot, { recursive: true });
      for (const skill of coreSkills) {
        const destination = path.join(destinationRoot, skill);
        const present = presentSkillPath(destination);
        if (present) {
          report.skipped.push({ engine, skill, reason: 'already-present', destination, resolved: present });
          continue;
        }
        fs.cpSync(path.join(sourceRoot, skill), destination, {
          recursive: true,
          force: false,
          errorOnExist: true,
          verbatimSymlinks: true
        });
        const marker = writeManagedMarker(destination, identity);
        report.installed.push({ engine, skill, destination, release: marker.release, commit: marker.commit });
      }
    }
    return report;
  } catch (error) {
    return {
      ...report,
      status: 'partial',
      error: {
        code: 'install-failed',
        message: error.message
      }
    };
  }
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command !== 'install') throw new Error('Usage: node tools/core-skill-installer.mjs install [--home USER_HOME]');
  const report = install(parseHome(args));
  process.stdout.write(`${JSON.stringify(report)}\n`);
  if (report.status !== 'complete') process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify(fail('invalid-invocation', error.message))}\n`);
  process.exitCode = 1;
}
