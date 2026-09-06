// Fail-closed privacy scan shared by the wiki validator and the session
// checkpoint promoter. Each pattern names a class so a refusal explains itself
// without echoing the matched value.
export const PRIVACY_PATTERNS = Object.freeze([
  { label: 'private key block', pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  // Real token shapes only: a bare `sk`/`pk` prefix over a hyphenated word
  // (`skills-installed-here`) is prose, not a secret.
  { label: 'API token', pattern: /\b(?:sk|pk)-[A-Za-z0-9_]{20,}\b|\bgh[oprsu]_[A-Za-z0-9]{20,}\b|\bxox[abpr]-[A-Za-z0-9-]{10,}\b|\bAKIA[0-9A-Z]{16}\b/ },
  { label: 'bearer token', pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]{16,}/ },
  { label: 'credential assignment', pattern: /\b(?:password|passwd|secret|api[_-]?key|token)\s*[:=]\s*["']?[^\s"']{6,}/i },
  { label: 'absolute home path', pattern: /(?:^|[\s"'`(])(?:\/Users\/[^\s/"'`)]+|\/home\/[^\s/"'`)]+|[A-Za-z]:\\Users\\[^\s\\"'`)]+)/ },
  { label: 'host temp handoff lane', pattern: /\$TMPDIR\/\.foundry|\/\.foundry\// },
  { label: 'email address', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/ }
]);

export function scanPrivacy(content) {
  const hits = [];
  content.split(/\r?\n/).forEach((line, index) => {
    for (const { label, pattern } of PRIVACY_PATTERNS) {
      if (pattern.test(line)) hits.push({ line: index + 1, label });
    }
  });
  return hits;
}
