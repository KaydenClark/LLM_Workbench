#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function parseArgs(argv) {
  const args = {
    root: 'research',
    slug: null,
    title: null,
    question: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--root') args.root = argv[++index];
    else if (arg === '--slug') args.slug = argv[++index];
    else if (arg === '--title') args.title = argv[++index];
    else if (arg === '--question') args.question = argv[++index];
    else if (!args.slug) args.slug = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.slug) throw new Error('Provide --slug or a positional slug');
  args.slug = slugify(args.slug);
  args.title = args.title ?? titleFromSlug(args.slug);
  args.question = args.question ?? '[Research question]';
  return args;
}

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dir = path.resolve(args.root, args.slug);
  if (fs.existsSync(dir)) throw new Error(`Research project already exists: ${dir}`);
  fs.mkdirSync(dir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(path.join(dir, 'notes.md'), [
    `# ${args.title} Notes`,
    '',
    `Started: ${today}`,
    '',
    '## Research Question',
    '',
    args.question,
    '',
    '## Notes',
    '',
    '- ',
    ''
  ].join('\n'));

  fs.writeFileSync(path.join(dir, 'README.md'), [
    `# ${args.title}`,
    '',
    '## Question',
    '',
    args.question,
    '',
    '## Summary',
    '',
    '[Write the final answer after the investigation.]',
    '',
    '## Method',
    '',
    '- Context gathered:',
    '- Commands or tools used:',
    '- Sources checked:',
    '',
    '## Findings',
    '',
    '- ',
    '',
    '## Verification',
    '',
    '- [ ] Claims are backed by source links, command output, tests, or artifacts.',
    '- [ ] Any generated code or demos include runnable verification.',
    '- [ ] External repos are linked or represented by diffs, not copied wholesale.',
    ''
  ].join('\n'));

  console.log(`created ${dir}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

