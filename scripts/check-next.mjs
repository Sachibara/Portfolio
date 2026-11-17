// Smoke checks for the layout preview at /next: same guarantees as the main page check.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = process.cwd();
const html = fs.readFileSync(path.join(root, 'next', 'index.html'), 'utf8');
const get = (regex) => Array.from(html.matchAll(regex), (m) => m[1]);
const ids = get(/\bid="([^"]+)"/g);
const unique = new Set(ids);
assert.equal(ids.length, unique.size, 'Duplicate HTML IDs in next/index.html');
for (const anchor of get(/\bhref="#([^"]+)"/g)) assert(unique.has(anchor), 'Unresolved section: #' + anchor);
for (const id of get(/getElementById\('([^']+)'\)/g)) assert(unique.has(id), 'Script references a missing element: #' + id);
for (const file of [...get(/\bsrc="([^"]+)"/g), ...get(/\bhref="([^"]+)"/g)]) {
  if (!file || file.startsWith('#') || /^(https?:|mailto:|tel:|data:)/i.test(file)) continue;
  assert(file.startsWith('/'), 'Preview assets must use absolute paths: ' + file);
  const resolved = path.resolve(root, decodeURIComponent(file.split(/[?#]/)[0]).replace(/^\//, ''));
  assert(resolved.startsWith(root + path.sep), 'Escaping repository root: ' + file);
  assert(fs.existsSync(resolved), 'Missing local asset or route: ' + file);
}
for (const code of get(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
  if (!code.trim() || code.trim().startsWith('{"@context"')) continue;
  new vm.Script(code, { filename: 'next/index.html' });
}
for (const tag of ['header', 'main', 'footer', 'nav', 'section', 'article', 'div', 'span', 'dialog', 'aside', 'button', 'form', 'dl']) {
  const starts = (html.match(new RegExp('<' + tag + '(?:\\s|>)', 'g')) || []).length;
  const ends = (html.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  assert.equal(starts, ends, 'Unbalanced <' + tag + '> tags');
}
for (const name of ['work', 'services', 'skills', 'about', 'experience', 'sywtc', 'credentials', 'contact', 'caseStudy', 'assistant', 'worldClock']) {
  assert(unique.has(name), 'Missing expected section or dialog: ' + name);
}
assert(!/siteSearch|searchOpen|Ctrl K/.test(html), 'The Ctrl+K search should not be present in the preview');
assert(html.includes('noindex'), 'The preview must not be indexed by search engines');
assert(html.includes('prefers-reduced-motion'), 'Reduced-motion styles not found');
console.log('Preview page checks passed: links, assets, scripts, sections and tag balance.');
