// One judgment about whether a discovery root already holds a skill, shared by
// the installer and by both presence-only gates.
//
// S-040 made the installer accept a destination reached through a link while
// `missingUserSkills` and `hasRequiredUserSkills` still judged with
// `lstat(...).isDirectory()`, which does not follow one. The two then disagreed
// about the same host, and the `--layout-only` route the S-040 refusals name
// did not complete there. They live here together so the next change to one is
// a change to all three rather than a new disagreement.
import fs from 'node:fs';
import path from 'node:path';

export function lstatOrNull(target) {
  try {
    return fs.lstatSync(target);
  } catch (error) {
    // ENOTDIR means a path component is a file. That is a collision for the
    // caller to report, not a crash, and it reads the same as absent here.
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
}

// A linked destination is judged by what it resolves to, because a
// presence-only caller skips an existing skill without reading it. Only a
// resolved directory that already holds the skill is accepted; nothing is ever
// written through the link.
export function resolveSkillLink(destination) {
  let resolved;
  try {
    resolved = fs.realpathSync(destination);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ELOOP' || error.code === 'ENOTDIR') return null;
    throw error;
  }
  if (!lstatOrNull(resolved)?.isDirectory()) return null;
  if (!lstatOrNull(path.join(resolved, 'SKILL.md'))?.isFile()) return null;
  return resolved;
}

// The path a caller should treat as already holding the skill, or null. An
// ordinary directory counts as itself; a link counts as its resolved target.
export function presentSkillPath(destination) {
  const entry = lstatOrNull(destination);
  if (!entry) return null;
  if (entry.isSymbolicLink()) return resolveSkillLink(destination);
  if (entry.isDirectory()) return destination;
  return null;
}

export function missingSkills(home, skills) {
  const roots = [path.join(home, '.agents', 'skills'), path.join(home, '.claude', 'skills')];
  return skills.filter((skill) => !roots.some((root) => presentSkillPath(path.join(root, skill))));
}
