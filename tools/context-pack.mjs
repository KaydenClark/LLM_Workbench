#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_IGNORE_DIRS = new Set([
  '.git',
  'node_modules',
  '.next',
  'dist',
  'build',
  'coverage',
  '.DS_Store'
]);

const EXT_TO_LANG = {
  c: 'c',
  cpp: 'cpp',
  css: 'css',
  html: 'html',
  js: 'javascript',
  json: 'json',
  md: 'markdown',
  mjs: 'javascript',
  py: 'python',
  sh: 'bash',
  ts: 'typescript',
  txt: '',
  yaml: 'yaml',
  yml: 'yaml'
};

function parseArgs(argv) {
  const args = {
    paths: [],
    extensions: [],
    ignore: [],
    includeHidden: false,
    ignoreGitignore: false,
    markdown: false,
    cxml: false,
    lineNumbers: false,
    output: null
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--extension' || arg === '-e') args.extensions.push(normalizeExt(argv[++index]));
    else if (arg === '--ignore') args.ignore.push(argv[++index]);
    else if (arg === '--include-hidden') args.includeHidden = true;
    else if (arg === '--ignore-gitignore') args.ignoreGitignore = true;
    else if (arg === '--markdown' || arg === '-m') args.markdown = true;
    else if (arg === '--cxml' || arg === '-c') args.cxml = true;
    else if (arg === '--line-numbers' || arg === '-n') args.lineNumbers = true;
    else if (arg === '--output' || arg === '-o') args.output = argv[++index];
    else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}`);
    else args.paths.push(arg);
  }

  if (args.paths.length === 0) args.paths.push('.');
  if (args.markdown && args.cxml) throw new Error('Use only one output format: --markdown or --cxml');
  return args;
}

function normalizeExt(value) {
  return value.startsWith('.') ? value.slice(1) : value;
}

function loadGitignoreRules(dir) {
  const file = path.join(dir, '.gitignore');
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

function shouldIgnore(relative, basename, isDirectory, args, gitignoreRules) {
  if (!args.includeHidden && basename.startsWith('.')) return true;
  if (isDirectory && DEFAULT_IGNORE_DIRS.has(basename)) return true;
  const candidates = [relative, basename, isDirectory ? `${basename}/` : basename];
  return [...args.ignore, ...gitignoreRules].some((pattern) => {
    return candidates.some((candidate) => matchGlob(candidate, pattern));
  });
}

function matchGlob(value, pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replaceAll('*', '.*')
    .replaceAll('?', '.');
  return new RegExp(`^${escaped}$`).test(value);
}

function collectFiles(inputPaths, args) {
  const absoluteInputs = inputPaths.map((input) => path.resolve(input));
  const base = commonBase(absoluteInputs);
  const files = [];
  for (const absolute of absoluteInputs) {
    if (!fs.existsSync(absolute)) throw new Error(`Path not found: ${absolute}`);
    walk(absolute, []);
  }
  return { base, files: [...new Set(files)].sort() };

  function walk(absolute, inheritedRules) {
    const stat = fs.statSync(absolute);
    const relative = path.relative(base, absolute) || path.basename(absolute);
    const basename = path.basename(absolute);
    if (shouldIgnore(relative, basename, stat.isDirectory(), args, inheritedRules)) return;

    if (stat.isFile()) {
      const ext = normalizeExt(path.extname(absolute).slice(1));
      if (args.extensions.length > 0 && !args.extensions.includes(ext)) return;
      files.push(absolute);
      return;
    }

    if (!stat.isDirectory()) return;

    const rules = args.ignoreGitignore ? inheritedRules : [...inheritedRules, ...loadGitignoreRules(absolute)];
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      walk(path.join(absolute, entry.name), rules);
    }
  }
}

function commonBase(absoluteInputs) {
  const bases = absoluteInputs.map((input) => {
    if (!fs.existsSync(input)) return path.dirname(input);
    return fs.statSync(input).isDirectory() ? input : path.dirname(input);
  });
  if (bases.length === 1) return bases[0];
  const split = bases.map((base) => base.split(path.sep).filter(Boolean));
  const prefix = [];
  for (let index = 0; ; index += 1) {
    const value = split[0][index];
    if (!value || !split.every((parts) => parts[index] === value)) break;
    prefix.push(value);
  }
  return `${path.sep}${prefix.join(path.sep)}`;
}

function addLineNumbers(content) {
  const lines = content.split('\n');
  const width = String(lines.length).length;
  return lines.map((line, index) => `${String(index + 1).padStart(width)}  ${line}`).join('\n');
}

function renderFile(file, base, args, index) {
  const relative = path.relative(base, file) || path.basename(file);
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
  if (args.lineNumbers) content = addLineNumbers(content);

  if (args.cxml) {
    return [
      `<document index="${index}">`,
      `<source>${escapeXml(relative)}</source>`,
      '<document_content>',
      escapeXml(content),
      '</document_content>',
      '</document>'
    ].join('\n');
  }

  if (args.markdown) {
    const ext = normalizeExt(path.extname(file).slice(1));
    const lang = EXT_TO_LANG[ext] ?? '';
    let fence = '```';
    while (content.includes(fence)) fence += '`';
    return [relative, `${fence}${lang}`, content, fence].join('\n');
  }

  return [relative, '---', content, '---'].join('\n');
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { base, files } = collectFiles(args.paths, args);
  const rendered = files
    .map((file, index) => renderFile(file, base, args, index + 1))
    .filter(Boolean);
  const output = args.cxml
    ? `<documents>\n${rendered.join('\n')}\n</documents>\n`
    : `${rendered.join('\n')}\n`;

  if (args.output) fs.writeFileSync(args.output, output);
  else process.stdout.write(output);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
