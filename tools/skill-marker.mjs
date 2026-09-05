// The managed skill marker: every core skill the installer or the explicit
// upgrade writes carries `.workbench-skill.json` naming the release and commit
// it came from and a hash of its content, so a reader can tell which
// Workbench generation an installed copy is. Schema 1 markers (source only)
// still read as managed; their generation is unknown.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { MANAGED_SKILL_MARKER, MANAGED_SKILL_SOURCE, readManagedSkillMarker } from '../workbench/tools/workbench-layout.mjs';
import { sourceIdentity } from './workbench-tools.mjs';

export const MANAGED_MARKER = MANAGED_SKILL_MARKER;
export const MARKER_SOURCE = MANAGED_SKILL_SOURCE;
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

// The release identity is one Git lookup per run: callers resolve it once
// with `markerSourceIdentity()` and pass it to every marker they write.
export function markerSourceIdentity() {
  const { release, commit } = sourceIdentity();
  return { release, commit };
}

export function managedMarker(skillDirectory, identity = markerSourceIdentity()) {
  return { schemaVersion: MARKER_SCHEMA_VERSION, source: MARKER_SOURCE, release: identity.release, commit: identity.commit, contentHash: skillContentHash(skillDirectory) };
}

export function writeManagedMarker(skillDirectory, identity = markerSourceIdentity()) {
  const marker = managedMarker(skillDirectory, identity);
  fs.writeFileSync(path.join(skillDirectory, MANAGED_MARKER), `${JSON.stringify(marker)}\n`);
  return marker;
}

// Returns the parsed marker when the skill is Workbench-managed (schema 1 or
// 2 with the core source), otherwise null. Never throws on a foreign file.
export const readManagedMarker = readManagedSkillMarker;
