// The managed skill marker: every core skill the installer or the explicit
// upgrade writes carries `.workbench-skill.json` naming the release and commit
// it came from and a hash of its content, so a reader can tell which
// Workbench generation an installed copy is. Schema 1 markers (source only)
// still read as managed; their generation is unknown.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { sourceIdentity } from './workbench-tools.mjs';

export const MANAGED_MARKER = '.workbench-skill.json';
export const MARKER_SOURCE = 'LLM Workbench core';
export const MARKER_SCHEMA_VERSION = 2;

// SHA-256 over the sorted relative paths and bytes of every regular file in
// the skill, excluding the marker itself. Symlinks and special files are
// refused: a managed skill is ordinary content only.
export function skillContentHash(directory) {
  const hash = crypto.createHash('sha256');
  (function walk(current, relative) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name === MANAGED_MARKER) continue;
      const target = path.join(current, entry.name);
      const child = path.posix.join(relative, entry.name);
      const stat = fs.lstatSync(target);
      if (stat.isSymbolicLink()) throw new Error(`Skill content ${target} must not contain a symlink.`);
      if (stat.isDirectory()) walk(target, child);
      else if (stat.isFile()) hash.update(`${child}\0`).update(fs.readFileSync(target)).update('\0');
      else throw new Error(`Skill content ${target} must be a regular file or directory.`);
    }
  })(directory, '');
  return hash.digest('hex');
}

export function managedMarker(skillDirectory) {
  const { release, commit } = sourceIdentity();
  return { schemaVersion: MARKER_SCHEMA_VERSION, source: MARKER_SOURCE, release, commit, contentHash: skillContentHash(skillDirectory) };
}

export function writeManagedMarker(skillDirectory) {
  const marker = managedMarker(skillDirectory);
  fs.writeFileSync(path.join(skillDirectory, MANAGED_MARKER), `${JSON.stringify(marker)}\n`);
  return marker;
}

// Returns the parsed marker when the skill is Workbench-managed (schema 1 or
// 2 with the core source), otherwise null. Never throws on a foreign file.
export function readManagedMarker(skillDirectory) {
  const file = path.join(skillDirectory, MANAGED_MARKER);
  let stat;
  try { stat = fs.lstatSync(file); } catch { return null; }
  if (!stat.isFile()) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    return [1, MARKER_SCHEMA_VERSION].includes(parsed?.schemaVersion) && parsed.source === MARKER_SOURCE ? parsed : null;
  } catch { return null; }
}
