// Maintainer skills: skills in this producer repository's skills lane that
// only its maintainers run (S-004C TK-006L, from the owner's 2026-10-04 choice
// of option A on TK-005K). The lane is also the release source lane, so the
// closed-bundle checks hold it to exactly the core skills; the repository's own
// `workbench/manifest.json` may name maintainer skills under `maintainerSkills`,
// which those checks accept beside the core and which no route ever installs
// or lays down. This is a producer-only declaration: a generated room has no
// maintainer skills and its manifest never names any.
import fs from 'node:fs';
import path from 'node:path';
import { coreSkills } from '../workbench/tools/workbench-layout.mjs';

export const MAINTAINER_SKILLS_KEY = 'maintainerSkills';
const SKILL_NAME = /^[a-z][a-z0-9-]*$/;

export class MaintainerSkillsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MaintainerSkillsError';
    this.code = 'invalid-maintainer-skills';
  }
}

function lstatOrNull(target) {
  try { return fs.lstatSync(target); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

// Read the declaration from a producer checkout's manifest. Absent means none.
// A malformed declaration throws rather than being ignored, so a typo can never
// silently widen or narrow what the closed-bundle checks accept.
export function readMaintainerSkills(root) {
  const manifestPath = path.join(root, 'workbench', 'manifest.json');
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (error) {
    throw new MaintainerSkillsError(`${manifestPath} is unreadable: ${error.message}`);
  }
  if (!Object.hasOwn(manifest, MAINTAINER_SKILLS_KEY)) return [];
  const declared = manifest[MAINTAINER_SKILLS_KEY];
  if (!Array.isArray(declared)) {
    throw new MaintainerSkillsError(`${MAINTAINER_SKILLS_KEY} in workbench/manifest.json must be an array of skill names.`);
  }
  const seen = new Set();
  for (const name of declared) {
    if (typeof name !== 'string' || !SKILL_NAME.test(name)) {
      throw new MaintainerSkillsError(`Maintainer skill ${JSON.stringify(name)} is not a lowercase skill name.`);
    }
    if (coreSkills.includes(name)) {
      throw new MaintainerSkillsError(`Maintainer skill ${name} is a core skill; a core skill ships to every room and cannot also be a maintainer skill.`);
    }
    if (seen.has(name)) throw new MaintainerSkillsError(`Maintainer skill ${name} is declared twice.`);
    seen.add(name);
  }
  return [...declared].sort();
}

// The closed-bundle source check shared by the provider-home installer and the
// one-time upgrade: the lane holds exactly the core skills plus the declared
// maintainer skills, each as an ordinary directory with SKILL.md. Returns null
// or the failure's code, message and details for the caller's report shape.
export function bundledSourceFailure(root) {
  const skillsRoot = path.join(root, 'workbench', 'skills');
  let maintainerSkills;
  try { maintainerSkills = readMaintainerSkills(root); } catch (error) {
    if (!(error instanceof MaintainerSkillsError)) throw error;
    return { code: error.code, message: error.message, details: {} };
  }
  for (const skill of maintainerSkills) {
    const entry = lstatOrNull(path.join(skillsRoot, skill));
    if (!entry?.isDirectory() || entry.isSymbolicLink() || !lstatOrNull(path.join(skillsRoot, skill, 'SKILL.md'))?.isFile()) {
      return {
        code: 'invalid-maintainer-skills',
        message: `Declared maintainer skill ${skill} must be an ordinary directory holding SKILL.md in workbench/skills.`,
        details: { skill }
      };
    }
  }
  const names = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => !maintainerSkills.includes(name))
    .sort();
  const expected = [...coreSkills].sort();
  if (JSON.stringify(names) !== JSON.stringify(expected)) {
    return {
      code: 'invalid-bundled-core',
      message: 'The checked-out LLM Workbench skills directory must contain exactly the required core skills and the declared maintainer skills.',
      details: { expected, actual: names, maintainerSkills }
    };
  }
  for (const skill of coreSkills) {
    if (!lstatOrNull(path.join(skillsRoot, skill, 'SKILL.md'))?.isFile()) {
      return { code: 'invalid-bundled-core', message: `Bundled skill ${skill} is missing SKILL.md.`, details: { skill } };
    }
  }
  return null;
}
