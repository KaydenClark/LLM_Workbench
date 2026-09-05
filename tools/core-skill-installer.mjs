#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'skills');
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';
import { markerSourceIdentity, writeManagedMarker } from './skill-marker.mjs';

function fail(code, message, details = {}) {
  return { status: 'blocked', requiredSkills: coreSkills, installed: [], skipped: [], error: { code, message, ...details } };
}

function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
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

function validateDestinationRoot(destination, home) {
  const homePath = path.resolve(home);
  for (let current = path.resolve(destination); ; current = path.dirname(current)) {
    const entry = lstatOrNull(current);
    if (entry?.isSymbolicLink() || (entry && !entry.isDirectory())) {
      return fail('discovery-root-collision',
        `Discovery root ancestor ${current} must be an ordinary directory or absent.`, { destination, ancestor: current });
    }
    if (entry && lstatOrNull(path.join(current, '.git'))) {
      return fail('foreign-git-root',
        `Discovery root ${destination} is inside Git-owned directory ${current}. Choose a dedicated user-scoped skills root before installing.`,
        { destination, gitRoot: current });
    }
    if (current === homePath) break;
  }
  return null;
}

function validateDestinations(destinations, home) {
  for (const { engine, root: destinationRoot } of destinations) {
    const rootFailure = validateDestinationRoot(destinationRoot, home);
    if (rootFailure) return rootFailure;
    for (const skill of coreSkills) {
      const destination = path.join(destinationRoot, skill);
      const entry = lstatOrNull(destination);
      if (entry && (entry.isSymbolicLink() || !entry.isDirectory())) {
        return fail('skill-path-collision',
          `Skill destination ${destination} is not an ordinary directory. Remove or relocate the collision, then retry.`,
          { engine, skill, destination });
      }
    }
  }
  return null;
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
  const destinationFailure = validateDestinations(destinations, home);
  if (destinationFailure) return destinationFailure;

  const report = { status: 'complete', requiredSkills: coreSkills, installed: [], skipped: [] };
  try {
    const identity = markerSourceIdentity();
    for (const { engine, root: destinationRoot } of destinations) {
      fs.mkdirSync(destinationRoot, { recursive: true });
      for (const skill of coreSkills) {
        const destination = path.join(destinationRoot, skill);
        if (lstatOrNull(destination)) {
          report.skipped.push({ engine, skill, reason: 'already-present', destination });
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
