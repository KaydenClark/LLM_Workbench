// Registered diagnostic codes for every Workbench runtime tool.
//
// A finding blocks only by the effect registered here; the commands that
// consume findings enforce it (doctor fails on `all` and `selection`, next
// excludes `selected-slice` work, claim refuses it, attention is reported and
// never blocks). No artifact, manifest field, spec row, or projection may
// declare whether its own finding blocks. Adding a code or changing its effect
// is a tool change with a test.

export const SEVERITIES = Object.freeze(['error', 'attention']);
export const SCOPES = Object.freeze(['manifest', 'specs', 'adr', 'wiki', 'sessions', 'feedback', 'tools', 'controls']);
export const EFFECTS = Object.freeze(['all', 'selection', 'selected-slice', 'none']);

const registry = Object.freeze({
  // manifest and layout: the routing every consumer depends on
  'invalid-manifest': entry('error', 'manifest', 'all', 'the manifest is unreadable or malformed'),
  'upgrade-required': entry('error', 'manifest', 'all', 'the manifest is an older schema; run the one-time migration'),
  'invalid-lane': entry('error', 'manifest', 'all', 'a declared lane path is unsafe or not the v3.1 contract'),
  'unsafe-lane': entry('error', 'manifest', 'all', 'a declared lane is missing, a symlink, or not a directory'),
  'invalid-collection': entry('error', 'manifest', 'all', 'a declared collection path is unsafe or not the v3.1 contract'),
  'missing-collection': entry('error', 'manifest', 'all', 'a required collection directory is missing'),
  'invalid-skill-policy': entry('error', 'manifest', 'all', 'the skill policy is not the closed core bundle'),
  'invalid-wiki-profile': entry('error', 'manifest', 'all', 'the wiki profile is not project or deployment'),
  'sessions-not-ignored': entry('error', 'sessions', 'all', 'live session collections are not ignored by default'),
  'tools-receipt-missing': entry('error', 'tools', 'all', 'the tools lane has no Workbench receipt'),
  'tools-receipt-drift': entry('error', 'tools', 'all', 'an installed runtime tool differs from its receipt hash'),
  // spec lifecycle: identity and state consistency selection depends on
  'malformed-spec': entry('error', 'specs', 'selection', 'a spec packet cannot be parsed'),
  'duplicate-id': entry('error', 'specs', 'selection', 'two packets claim one spec ID'),
  'invalid-state': entry('error', 'specs', 'selection', 'a spec or ticket status is outside the lifecycle vocabulary'),
  'contradictory-state': entry('error', 'specs', 'selection', 'a completed spec still has unfinished tickets'),
  'unstable-path': entry('error', 'specs', 'selection', 'a spec is not at its stable declared path'),
  'missing-evidence': entry('error', 'specs', 'selection', 'a done ticket has no proof'),
  'render-drift': entry('error', 'specs', 'selection', 'a generated projection region is stale; run render'),
  'broken-render-target': entry('error', 'specs', 'selection', 'a projection control or its generated region is missing'),
  // selected slice only
  'blocked-slice': entry('error', 'specs', 'selected-slice', 'the selected ticket names an unmet dependency'),
  // attention: visible, never blocking
  'stale-claim': entry('attention', 'specs', 'none', 'an in-progress claim is older than one working day; verify activity before reclaiming'),
  'broken-link': entry('attention', 'specs', 'none', 'a spec links to a missing local target'),
  'stale-register': entry('attention', 'adr', 'none', 'the derived ADR register is stale; run adr register'),
  'invalid-adr': entry('error', 'adr', 'none', 'an ADR is missing required frontmatter or names an unknown canonicalization target'),
  'untracked-provenance': entry('error', 'adr', 'none', 'a durable reference targets an untracked session path'),
  'stale-note': entry('attention', 'wiki', 'none', 'a wiki note is marked stale'),
  'invalid-note': entry('error', 'wiki', 'none', 'a wiki note violates the schema'),
  'copied-task-state': entry('error', 'wiki', 'none', 'a wiki note copies live task state'),
  'secret-like-content': entry('error', 'wiki', 'none', 'a note or checkpoint contains secret-like material'),
  'unfilled-control': entry('error', 'controls', 'all', 'a root control is empty, a stub, or carries template placeholders'),
  'unsafe-control': entry('error', 'controls', 'all', 'a root control is not an ordinary file'),
  'version-mismatch': entry('error', 'controls', 'all', 'a control version stamp disagrees with the manifest'),
  'missing-first-spec': entry('error', 'specs', 'all', 'Genesis produced no first spec'),
  'invalid-first-spec': entry('error', 'specs', 'all', 'the first spec is not an actionable packet'),
  'project-local-skills': entry('error', 'controls', 'all', 'a project-local skills tree shadows user-scoped discovery')
});

function entry(severity, scope, blocks, summary) {
  return Object.freeze({ severity, scope, blocks, summary });
}

export function describe(code) {
  const registered = registry[code];
  if (!registered) throw new Error(`Unregistered diagnostic code: ${code}`);
  return registered;
}

export function isRegistered(code) {
  return Object.hasOwn(registry, code);
}

export function finding(code, message, details = {}) {
  const { severity, scope, blocks } = describe(code);
  return { code, severity, scope, blocks, message, ...details };
}

export function blocksAll(findings) {
  return findings.some((item) => item.blocks === 'all');
}

export function blocksSelection(findings) {
  return findings.some((item) => item.blocks === 'all' || item.blocks === 'selection');
}

export function blocksSlice(findings, specId, ticketId) {
  return findings.some((item) => item.blocks === 'selected-slice' && item.specId === specId && (!item.ticketId || item.ticketId === ticketId));
}

export function attention(findings) {
  return findings.filter((item) => item.severity === 'attention');
}

export function registeredCodes() {
  return Object.keys(registry);
}
