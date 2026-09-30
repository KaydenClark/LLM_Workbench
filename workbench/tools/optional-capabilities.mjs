// S-00V TK-00K: optional-capability routing (Desired Behavior 5, grilling
// decision-008: "When we lack something, flag the task as blocked or needs
// review so when I do sitrep I find it").
//
// The host floor (host-floor.mjs) is everything every session needs. Anything
// beyond it - a simulator, screen history, an MCP server, Foundry, access to
// another repository - is an optional capability that a Task names in its
// own record:
//
//   **Capabilities:** simulator, screen-history
//
// A session that cannot positively establish a named capability treats it as
// absent. Established means one of exactly two things: the session declared
// it explicitly (`--capabilities simulator,foundry` on `next`, `claim` or
// `close`), or an injected probe for it returned `true`. No declaration and no
// probe is absence; a probe that returns anything but `true` is absence; a
// probe that throws is absence with its error, never a crash. Fail closed:
// nothing is guessed from the host.
//
// `defaultCapabilityProbes` is deliberately empty. `next`, `claim` and
// `close` run in the suite and in read-only review with no host guarantees,
// so they probe nothing real; a room or a later Task adds a probe here only
// when it can observe the capability deterministically. The seam mirrors the
// host floor's injectable `probes`, so tests inject facts and never read the
// real host.
//
// Where a session lacks a capability, the lifecycle commands route rather
// than skip silently: `claim` writes `**Status:** blocked` and
// `**Missing capabilities:** <names>` onto the record, `close` does the same
// and refuses to report success, and `next` names every capability-blocked
// Task in its output. The record field is separate from `Blockers`, which
// stays a closed list of `S-`/`TK-` ids.

export const CAPABILITY_NAME_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export const defaultCapabilityProbes = Object.freeze({});

// Reads a record's capability list field: `none` or a comma list of
// kebab-case names. An unreadable name or a repeated one fails closed.
export function parseCapabilityList(value, label) {
  if (value === undefined || value === null) return [];
  const text = String(value).trim();
  if (text === 'none') return [];
  const names = text.split(',').map((item) => item.trim()).filter(Boolean);
  if (names.length === 0) throw new Error(`${label} has an empty capability list; write none or name each capability`);
  const seen = new Set();
  for (const name of names) {
    if (!CAPABILITY_NAME_PATTERN.test(name)) throw new Error(`${label} has an invalid capability name "${name}"; a capability is a lowercase kebab-case name`);
    if (seen.has(name)) throw new Error(`${label} names capability ${name} twice`);
    seen.add(name);
  }
  return names;
}

// The session's explicit declaration, from the CLI's `--capabilities` string
// or an array. Absent means nothing is declared.
export function declaredCapabilities(value) {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return parseCapabilityList(value.join(','), '--capabilities');
  return parseCapabilityList(value, '--capabilities');
}

// Resolves one session's view of the named capabilities. Returns a lookup
// that answers, for each name, whether the session established it and why.
// Probes run at most once per name, and only for names some Task needs.
export function capabilitySession(root, options = {}) {
  const declared = new Set(declaredCapabilities(options.capabilities));
  const probes = options.capabilityProbes ?? defaultCapabilityProbes;
  if (typeof probes !== 'object' || probes === null) throw new Error('capabilityProbes must be an object mapping capability names to probe functions');
  const cache = new Map();
  const check = (name) => {
    if (cache.has(name)) return cache.get(name);
    let result;
    if (declared.has(name)) result = { present: true, reason: `${name}: declared` };
    else if (!Object.hasOwn(probes, name) || typeof probes[name] !== 'function') result = { present: false, reason: `${name}: no probe and no declaration` };
    else {
      try {
        const observed = probes[name](root);
        result = observed === true ? { present: true, reason: `${name}: probe reported present` } : { present: false, reason: `${name}: probe reported absent` };
      } catch (error) {
        result = { present: false, reason: `${name}: probe failed: ${error?.message ?? error}` };
      }
    }
    cache.set(name, result);
    return result;
  };
  return {
    check,
    // The names in `required` this session cannot establish, in record order,
    // with one reason line per missing name.
    missing(required) {
      const absent = required.filter((name) => !check(name).present);
      return { names: absent, reason: absent.map((name) => check(name).reason).join('; ') };
    }
  };
}
