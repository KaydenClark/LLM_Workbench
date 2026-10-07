#!/usr/bin/env node
// Build one disposable, synthetic Workbench room for the S-004J TK-00JB
// fresh-context domain-modeling scenarios.
//
//   node scenario-room.mjs --source <LLM Workbench checkout> --room <new dir> --variant A|B
//
// The room is laid out and installed from the given clean Workbench checkout
// (layout init, managed runtime tools, skills lane with both discovery
// adapters), then filled with a small invoicing project, "Ledgerline":
// root controls from the checkout's own templates, a Lexicon with project
// terms, one Spec whose acceptance lines use those terms, source and tests
// whose identifiers use them, one accepted ADR and a Wiki article. Variant B
// also has a root GLOSSARY.md in the upstream glossary format, so promotion
// has a glossary destination; variant A keeps the Lexicon as the vocabulary
// owner. The room is committed so each run's diff is measured against HEAD.
// Nothing here is real project data.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
}

const source = path.resolve(arg('source') ?? '.');
const room = path.resolve(arg('room') ?? '');
const variant = (arg('variant') ?? 'A').toUpperCase();
if (!arg('room') || !['A', 'B'].includes(variant)) {
  console.error('usage: scenario-room.mjs --source CHECKOUT --room DIR --variant A|B');
  process.exit(2);
}
if (fs.existsSync(room) && fs.readdirSync(room).length) {
  console.error(`refusing to build into a non-empty directory: ${room}`);
  process.exit(2);
}
fs.mkdirSync(room, { recursive: true });

function run(cmd, args, cwd = source) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(`${cmd} ${args.join(' ')} failed:\n${r.stdout}\n${r.stderr}`);
    process.exit(1);
  }
  return r.stdout.trim();
}
function write(rel, text) {
  const file = path.join(room, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.replace(/^\n/, ''));
}

// 1. Lay out and install from the checkout (installed discovery, not pasted text).
run('node', ['workbench/tools/workbench-layout.mjs', 'init', '--project', room, '--provenance', 'genesis', '--version', 'v3.2.1', '--name', 'Ledgerline']);
run('node', ['tools/workbench-tools.mjs', 'install', '--project', room]);
run('node', ['tools/workbench-skills.mjs', 'install', '--project', room]);
run('node', ['workbench/tools/workbench-layout.mjs', 'seed-documents', '--project', room]);

// 2. Root controls from the checkout's generic templates, placeholders filled.
const fills = {
  PROJECT_NAME: 'Ledgerline',
  HARNESS_VERSION: '3.2.1',
  READABLE_ROOTS: 'the whole repository',
  SECRETS_OR_PRIVATE_PATHS: '`.env`',
  WRITABLE_ROOTS: '`src/`, `tests/`',
  FORBIDDEN_PATHS: 'none',
  REQUIRES_REVIEW_FOR: 'root controls and accepted decision records',
  DEFAULT_BRANCH: 'main',
  INTEGRATION_BRANCH_OR_DEFAULT: 'integration',
  OWNER_ONLY_MERGE: 'integration to main',
  FAST_TEST_COMMAND: 'node --test tests/*.test.js',
  FULL_TEST_COMMAND: 'node --test tests/*.test.js',
  SPEC_DOCTOR_COMMAND: 'node workbench/tools/spec-workbench.mjs doctor',
  'YYYY-MM-DD': '2026-09-01',
  'active / partial / stale': 'active'
};
function fill(text) {
  return text.replace(/\[([A-Za-z_ /-]+)\]/g, (whole, key) => {
    if (key in fills) return fills[key];
    if (/^[A-Z][A-Z_]+_COMMAND$|^ENV_VAR$/.test(key)) return 'not applicable in this room';
    return whole;
  });
}
const template = (name) => fill(fs.readFileSync(path.join(source, 'templates', name), 'utf8'));

write('AGENTS.md', template('AGENTS.md'));
write('CLAUDE.md', '@AGENTS.md\n');
write('RUNBOOK.md', template('RUNBOOK.md'));
write('TASKBOARD.md', template('TASKBOARD.md'));

const projectTermsA = `## Project Terms

| Term | Definition | Distinction / aliases to avoid |
|---|---|---|
| **Customer** | A person or organization that buys from Ledgerline and is legally responsible for paying. | Not a login; avoid "client" and "user". |
| **Account** | A billing account owned by exactly one Customer; it holds a balance and receives Invoices. A Customer may own several Accounts. | Not a login or user account; avoid "profile" and "wallet". |
| **Invoice** | A request for payment issued against one Account for one billing period; immutable once issued. | Avoid "bill" and "statement". |
| **Payment** | Money received from a Customer against one Account. | Avoid "transaction". |
| **Settlement** | The application of one Payment to open Invoices on the same Account, oldest first, closing each in full or reducing it partially. | Not the Billing Run; avoid "reconciliation" and "payout". |
| **Billing Run** | The scheduled job that issues Invoices for every active Account at the end of a billing period. | Avoid "settlement" and "cycle". |
`;
const projectTermsB = `## Project Terms

Project vocabulary lives in the root [GLOSSARY.md](GLOSSARY.md); this Lexicon
keeps only Workbench terms.
`;
let lexicon = template('LEXICON.md');
lexicon = lexicon.replace(/## Project Terms\n[\s\S]*?(?=\n## Continuity And Evidence Boundaries)/, variant === 'B' ? projectTermsB : projectTermsA);
write('LEXICON.md', lexicon);

if (variant === 'B') {
  write('GLOSSARY.md', `
# Ledgerline

Ledgerline issues Invoices to the Accounts of its Customers and applies their
Payments to open Invoices.

## Language

**Customer**:
A person or organization that buys from Ledgerline and is legally responsible for paying.
_Avoid_: Client, user

**Account**:
A billing account owned by exactly one Customer that holds a balance and receives Invoices.
_Avoid_: Profile, wallet, login

**Invoice**:
A request for payment issued against one Account for one billing period; immutable once issued.
_Avoid_: Bill, statement

**Payment**:
Money received from a Customer against one Account.
_Avoid_: Transaction

**Settlement**:
The application of one Payment to open Invoices on the same Account, closing each in full or reducing it partially.
_Avoid_: Reconciliation, payout

**Billing Run**:
The scheduled job that issues Invoices for every active Account at the end of a billing period.
_Avoid_: Settlement, cycle
`);
}

write('BLUEPRINT.md', `
# Ledgerline - Blueprint

Its terms mean what the Lexicon says they mean.

## What it is

Ledgerline is a small invoicing service. Each Billing Run issues Invoices to
the Accounts of each Customer, and each Payment received is applied to the open
Invoices of its Account through a Settlement.

## Who it serves

Finance teams of subscription businesses who need clean Account balances.

## Promised outcomes

- Every active Account receives one Invoice per billing period.
- A Payment reduces the open Invoices of its own Account and never another's.

## Non-goals

- Tax calculation and payment collection from cards or banks.
`);

write('README.md', `
# Ledgerline

Synthetic invoicing room used to exercise Workbench skills. Project memory
starts at [the Wiki router](workbench/wiki/MEMORY.md). Run the tests with
\`node --test tests/*.test.js\`.
`);

// 3. One Spec whose acceptance lines use the terms.
write('workbench/specs/S-001-invoice-settlement/SPEC.md', `
# S-001 - Invoice Settlement

**Spec ID:** S-001
**Status:** active
**Priority:** 1
**Owner:** owner
**Stance:** Builder
**Updated:** 2026-09-01
**Catalog description:** Apply each Payment to the open Invoices of its Account.
**Blockers:** none
**Latest event:** Spec captured.
**Next gate:** Deliver partial Settlement.

## Outcome

A Payment received against an Account is applied by a Settlement to that
Account's open Invoices, oldest first.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Partial Settlement of the oldest open Invoice | ready | none | pending |

## Acceptance Criteria

- [x] An Invoice is issued against exactly one Account (\`src/billing/invoice.js\`).
- [x] A Settlement applies one Payment to open Invoices on the same Account, oldest first.
- [ ] A Payment smaller than the oldest open Invoice settles it partially and leaves the remainder open.
- [x] A Settlement never crosses Accounts, even when one Customer owns both.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-01 | planning | Spec captured | none | Lexicon terms | partial Settlement |
`);

// 4. Source and tests whose identifiers use the terms.
write('package.json', `{
  "name": "ledgerline",
  "private": true,
  "type": "module",
  "scripts": { "test": "node --test tests/*.test.js" }
}
`);
write('src/customers/customer.js', `
// A Customer is legally responsible for paying; it owns one or more Accounts.
export function createCustomer({ id, name }) {
  if (!id || !name) throw new Error('A Customer needs an id and a name');
  return { id, name };
}
`);
write('src/accounts/account.js', `
// An Account belongs to exactly one Customer and receives Invoices.
export function createAccount({ id, customerId }) {
  if (!customerId) throw new Error('An Account needs a customerId');
  return { id, customerId, balanceCents: 0, active: true };
}
`);
write('src/billing/invoice.js', `
// An Invoice is issued against one Account for one billing period.
let nextNumber = 1;

export function issueInvoice(account, { periodEnd, lines }) {
  if (!account?.id) throw new Error('An Invoice is issued against an Account');
  const totalCents = lines.reduce((sum, line) => sum + line.amountCents, 0);
  return Object.freeze({
    id: \`INV-\${nextNumber++}\`,
    accountId: account.id,
    periodEnd,
    totalCents,
    openCents: totalCents,
    status: 'open'
  });
}
`);
write('src/billing/settlement.js', `
// A Settlement applies one Payment to the open Invoices of its Account,
// oldest first. An Invoice the remaining Payment cannot cover in full is
// left untouched; the remainder stays on the Account as unapplied credit.
export function settle(payment, invoices) {
  let remainingCents = payment.amountCents;
  const settled = [];
  const open = invoices
    .filter((invoice) => invoice.status === 'open')
    .sort((a, b) => a.periodEnd.localeCompare(b.periodEnd));
  for (const invoice of open) {
    if (invoice.accountId !== payment.accountId) {
      throw new Error('A Settlement never crosses Accounts');
    }
    if (remainingCents < invoice.openCents) break;
    remainingCents -= invoice.openCents;
    settled.push({ ...invoice, openCents: 0, status: 'paid' });
  }
  return { settled, unappliedCents: remainingCents };
}
`);
write('src/billing/billing-run.js', `
import { issueInvoice } from './invoice.js';

// The Billing Run issues one Invoice per active Account for the period.
export function runBilling(accounts, { periodEnd, linesFor }) {
  return accounts
    .filter((account) => account.active)
    .map((account) => issueInvoice(account, { periodEnd, lines: linesFor(account) }));
}
`);
write('tests/invoice.test.js', `
import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccount } from '../src/accounts/account.js';
import { issueInvoice } from '../src/billing/invoice.js';
import { runBilling } from '../src/billing/billing-run.js';

test('an Invoice is issued against exactly one Account', () => {
  const account = createAccount({ id: 'ACC-1', customerId: 'CUS-1' });
  const invoice = issueInvoice(account, { periodEnd: '2026-08-31', lines: [{ amountCents: 1200 }] });
  assert.equal(invoice.accountId, 'ACC-1');
  assert.equal(invoice.openCents, 1200);
});

test('the Billing Run skips inactive Accounts', () => {
  const live = createAccount({ id: 'ACC-1', customerId: 'CUS-1' });
  const closed = { ...createAccount({ id: 'ACC-2', customerId: 'CUS-1' }), active: false };
  const invoices = runBilling([live, closed], { periodEnd: '2026-08-31', linesFor: () => [{ amountCents: 500 }] });
  assert.deepEqual(invoices.map((invoice) => invoice.accountId), ['ACC-1']);
});
`);
write('tests/settlement.test.js', `
import test from 'node:test';
import assert from 'node:assert/strict';
import { settle } from '../src/billing/settlement.js';

const invoice = (id, periodEnd, openCents, accountId = 'ACC-1') =>
  ({ id, accountId, periodEnd, totalCents: openCents, openCents, status: 'open' });

test('a Settlement pays open Invoices oldest first', () => {
  const result = settle({ accountId: 'ACC-1', amountCents: 300 },
    [invoice('INV-2', '2026-08-31', 200), invoice('INV-1', '2026-07-31', 100)]);
  assert.deepEqual(result.settled.map((i) => i.id), ['INV-1', 'INV-2']);
  assert.equal(result.unappliedCents, 0);
});

test('a Payment that cannot cover an Invoice leaves it open as unapplied credit', () => {
  const result = settle({ accountId: 'ACC-1', amountCents: 50 }, [invoice('INV-1', '2026-07-31', 100)]);
  assert.deepEqual(result.settled, []);
  assert.equal(result.unappliedCents, 50);
});

test('a Settlement never crosses Accounts', () => {
  assert.throws(() => settle({ accountId: 'ACC-1', amountCents: 100 },
    [invoice('INV-9', '2026-07-31', 100, 'ACC-2')]), /never crosses Accounts/);
});
`);

// 5. Wiki router (from the template) and one article.
const front = (type, role, paths) => `---
type: ${type}
status: active
sensitivity: normal
knowledge_role: ${role}
provenance:
  - synthetic Ledgerline scenario room
source_paths:
${paths.map((p) => `  - ${p}`).join('\n')}
last_verified: 2026-09-01
---
`;
let memory = fill(fs.readFileSync(path.join(source, 'templates', 'wiki', 'MEMORY.project.md'), 'utf8'));
memory = memory.replace(/## Routing\n/, `## Routing\n\n- [Billing model](billing-model.md): how Customers, Accounts, Invoices,\n  Payments and Settlements relate.\n`);
write('workbench/wiki/MEMORY.md', memory);
write('workbench/wiki/billing-model.md', front('project', 'curated', ['src/billing', 'src/accounts', 'LEXICON.md']) + `
# Billing model

A Customer owns one or more Accounts. Each Billing Run issues one Invoice per
active Account, so a Customer with two Accounts receives two Invoices. A
Payment arrives against one Account and a Settlement applies it to that
Account's open Invoices, oldest first. See the accepted decision record
"Invoices belong to Accounts, not Customers" in \`workbench/docs/adr/\`.
`);

// 6. One accepted ADR, written through the room's own decision-record tool.
const created = JSON.parse(run('node', ['workbench/tools/adr.mjs', 'new', '--title', 'Invoices belong to Accounts, not Customers', '--date', '2026-09-01'], room));
fs.writeFileSync(created.filePath, `---
date: 2026-09-01
canonicalized_in:
  - LEXICON.md
---

# Invoices belong to Accounts, not Customers

An Invoice is issued against one Account, never against a Customer, so a Customer with several Accounts receives one Invoice per Account and each Account keeps its own balance.

Considered and rejected: invoicing the Customer once across all Accounts, which lost because large Customers split cost centres into separate Accounts with separate payers.

Consequences: \`src/billing/invoice.js\` stores \`accountId\` on every Invoice and Settlement refuses to cross Accounts; the Lexicon's Account and Invoice rows carry the rule.

Provenance: synthetic decision for the Ledgerline scenario room.
`);
run('node', ['workbench/tools/adr.mjs', 'accept', created.id], room);
run('node', ['workbench/tools/adr.mjs', 'register', '--kind', 'adr'], room);

// 7. Commit the snapshot.
run('node', ['workbench/tools/spec-workbench.mjs', 'render'], room);
run('node', ['--test', 'tests/*.test.js'], room);
run('git', ['init', '-q', '-b', 'main'], room);
run('git', ['-c', 'user.name=scenario', '-c', 'user.email=scenario.invalid', 'add', '-A'], room);
run('git', ['-c', 'user.name=scenario', '-c', 'user.email=scenario.invalid', 'commit', '-q', '-m', `Ledgerline scenario room variant ${variant}`], room);
run('git', ['branch', 'integration'], room);
const head = run('git', ['rev-parse', 'HEAD'], room);
const lane = JSON.parse(fs.readFileSync(path.join(room, 'workbench/skills/.workbench-skills.json'), 'utf8'));
console.log(JSON.stringify({ room, variant, head, sourceCommit: lane.source?.commit, domainModeling: lane.skills?.['domain-modeling'] ?? null }));
