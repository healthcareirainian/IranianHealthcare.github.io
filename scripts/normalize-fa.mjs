#!/usr/bin/env node
// Persian text hygiene for content files: Arabic Yeh/Kaf (ي ك) → Persian (ی ک), Arabic-Indic digits → Persian.
// Usage: node scripts/normalize-fa.mjs --check   (CI: exit 1 if anything needs fixing)
//        node scripts/normalize-fa.mjs --fix     (rewrite files in place)
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = 'src/content';
const EXTS = new Set(['.md', '.mdx', '.yaml', '.yml']);
const MAP = {
  'ي': 'ی', // U+064A Arabic Yeh
  'ى': 'ی', // U+0649 Alef Maksura
  'ك': 'ک', // U+0643 Arabic Kaf
  '٠': '۰', '١': '۱', '٢': '۲', '٣': '۳', '٤': '۴', '٥': '۵', '٦': '۶', '٧': '۷', '٨': '۸', '٩': '۹',
};
const RE = new RegExp(`[${Object.keys(MAP).join('')}]`, 'g');

const mode = process.argv.includes('--fix') ? 'fix' : 'check';

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXTS.has(extname(p))) yield p;
  }
}

let bad = 0;
for (const file of walk(ROOT)) {
  const text = readFileSync(file, 'utf8');
  const hits = text.match(RE);
  if (!hits) continue;
  bad++;
  if (mode === 'fix') {
    writeFileSync(file, text.replace(RE, (c) => MAP[c]));
    console.log(`fixed ${hits.length} char(s): ${file}`);
  } else {
    console.error(`${hits.length} non-Persian char(s) in ${file}`);
  }
}

if (mode === 'check' && bad) {
  console.error(`\n${bad} file(s) need normalising. Run: node scripts/normalize-fa.mjs --fix`);
  process.exit(1);
}
if (!bad) console.log('Persian text check passed.');
