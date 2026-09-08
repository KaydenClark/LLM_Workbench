import { randomBytes } from 'node:crypto';
// Visible labels are identities, not timestamps or a second global key.
// Legacy numeric labels are compared as occupied text, never decoded as a
// base-62 high-water mark or rewritten during allocation.
export const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const PREFIX = /^[A-Z][A-Z0-9]{0,15}$/;

export function visibleIdParts(value) {
  if (typeof value !== 'string') return null;
  const match = /^([A-Z][A-Z0-9]{0,15})-([0-9A-Za-z]+)$/.exec(value);
  return match ? { prefix: match[1], suffix: match[2] } : null;
}

export function visibleIdKey(value) {
  const parsed = visibleIdParts(value);
  return parsed ? `${parsed.prefix}-${(parsed.suffix.replace(/^0+/, '') || '0').toUpperCase()}` : null;
}

export function encodeBase62(value) {
  if (typeof value !== 'bigint' || value < 0n) throw new Error('Base-62 encoding requires a nonnegative bigint');
  let suffix = '';
  do {
    suffix = BASE62_ALPHABET[Number(value % 62n)] + suffix;
    value /= 62n;
  } while (value);
  return suffix;
}

export function compareVisibleIds(left, right) {
  const a = visibleIdParts(left);
  const b = visibleIdParts(right);
  if (!a || !b || a.prefix !== b.prefix) return left === right ? 0 : left < right ? -1 : 1;
  const x = a.suffix.replace(/^0+/, '') || '0';
  const y = b.suffix.replace(/^0+/, '') || '0';
  return x.length - y.length || (x === y ? 0 : x < y ? -1 : 1);
}

export function allocateVisibleId(prefix, ids, { width = 3, requireLetter = false } = {}) {
  if (!PREFIX.test(prefix)) throw new Error('A type prefix must be 1-16 uppercase letters/digits, starting with a letter');
  if (!Number.isInteger(width) || width < 1 || width > 32) throw new Error('Minimum identifier width must be an integer from 1 through 32');
  if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new Error('Occupied identifiers must be an array of strings');
  const occupied = new Set();
  for (const id of ids) {
    if (visibleIdParts(id)?.prefix !== prefix) continue;
    const key = visibleIdKey(id);
    if (occupied.has(key)) throw new Error(`Visible identifier collision: ${id}`);
    occupied.add(key);
  }
  // One writer per artifact inventory. The caller must publish exclusively
  // and surface collisions; this allocator does not provide a distributed lock.
  for (let ordinal = 1n; ; ordinal++) {
    const id = `${prefix}-${encodeBase62(ordinal).padStart(width, '0')}`;
    if (requireLetter && !/[A-Za-z]/.test(visibleIdParts(id).suffix)) continue;
    if (!occupied.has(visibleIdKey(id))) return id;
  }
}

// Connection identities namespace independent rooms; visible artifact labels
// remain scoped inside them. Reuse the alphabet without reallocating artifacts.
export function isWorkbenchId(value) {
  return typeof value === 'string' && /^WB-[0-9A-Za-z]{22}$/.test(value);
}

export function allocateWorkbenchId(occupied = []) {
  if (!Array.isArray(occupied) || occupied.some(id => !isWorkbenchId(id))) throw new Error('Occupied Workbench identities must be valid WB identifiers');
  const keys = new Set(occupied.map(visibleIdKey));
  if (keys.size !== occupied.length) throw new Error('Workbench identity collision in the selected inventory');
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const entropy = BigInt('0x' + randomBytes(16).toString('hex'));
    const id = 'WB-' + encodeBase62(entropy).padStart(22, '0');
    if (!keys.has(visibleIdKey(id))) return id;
  }
  throw new Error('Could not allocate an unoccupied Workbench identity');
}
