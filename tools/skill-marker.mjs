// The managed skill marker: every core skill the installer or the explicit
// upgrade writes carries `.workbench-skill.json` naming the release and commit
// it came from and a hash of its content, so a reader can tell which
// Workbench generation an installed copy is. Schema 1 markers (source only)
// still read as managed; their generation is unknown.
import fs from 'node:fs';
import path from 'node:path';
import { MANAGED_SKILL_MARKER, MANAGED_SKILL_SOURCE, readManagedSkillMarker } from '../workbench/tools/workbench-layout.mjs';
import { skillContentHash } from '../workbench/tools/skill-inspection.mjs';
export { skillContentHash } from '../workbench/tools/skill-inspection.mjs';
import { sourceIdentity } from './workbench-tools.mjs';

export const MANAGED_MARKER = MANAGED_SKILL_MARKER;
export const MARKER_SOURCE = MANAGED_SKILL_SOURCE;
export const MARKER_SCHEMA_VERSION = 2;

// The release identity is one Git lookup per run: callers resolve it once
// with `markerSourceIdentity()` and pass it to every marker they write.
export function markerSourceIdentity() {
  const { release, commit } = sourceIdentity({ managedPaths: ['skills'] });
  return { release, commit };
}

export function managedMarker(skillDirectory, identity = markerSourceIdentity()) {
  return { schemaVersion: MARKER_SCHEMA_VERSION, source: MARKER_SOURCE, release: identity.release, commit: identity.commit, contentHash: skillContentHash(skillDirectory), compatibleRooms: { minimum: 'v3.1.4', maximum: identity.release } };
}

export function writeManagedMarker(skillDirectory, identity = markerSourceIdentity()) {
  const marker = managedMarker(skillDirectory, identity);
  fs.writeFileSync(path.join(skillDirectory, MANAGED_MARKER), `${JSON.stringify(marker)}\n`);
  return marker;
}

// Returns the parsed marker when the skill is Workbench-managed (schema 1 or
// 2 with the core source), otherwise null. Never throws on a foreign file.
export const readManagedMarker = readManagedSkillMarker;
