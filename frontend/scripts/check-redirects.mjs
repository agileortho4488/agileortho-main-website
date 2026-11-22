// Redirect check: every URL of the old site must land on a real page of the new one, never on home.
// Old URLs come from the live sitemap (until the new site replaces it), cached in .cache/ so later
// builds can still check them. The old URL list is not committed: old slugs carry brand names.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const OUT = fileURLToPath(new URL('out/', root));
const CACHE = fileURLToPath(new URL('.cache/old-sitemap-paths.txt', root));
const OLD_SITEMAP = process.env.OLD_SITEMAP_URL || 'https://www.agilehealthcare.in/sitemap.xml';
const { redirects = [] } = JSON.parse(readFileSync(fileURLToPath(new URL('vercel.json', root)), 'utf8'));

// Vercel source (path-to-regexp style) -> RegExp. Handles literals, :name, :name*, :name(regex).
export function sourceToRegExp(src) {
  let re = '';
  for (let i = 0; i < src.length; ) {
    if (src[i] !== ':') { re += src[i].replace(/[.+?^${}()|[\]\\]/g, '\\$&'); i++; continue; }
    i++;
    while (i < src.length && /\w/.test(src[i])) i++;
    let custom = null;
    if (src[i] === '(') {
      let depth = 0, j = i;
      do { if (src[j] === '\\') j++; else if (src[j] === '(') depth++; else if (src[j] === ')') depth--; j++; } while (depth && j < src.length);
      custom = src.slice(i + 1, j - 1);
      i = j;
    }
    const star = src[i] === '*';
    if (star) i++;
    if (custom) re += `(?:${custom})`;
    else if (star) re = re.replace(/\/$/, '') + '(?:/.*)?';
    else re += '[^/]+';
  }
  return new RegExp(`^${re}$`);
}

const rules = redirects.map(r => ({ ...r, re: sourceToRegExp(r.source) }));
const norm = p => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';
const isPage = p => {
  const clean = norm(p.split('#')[0].split('?')[0]);
  if (clean === '/') return existsSync(OUT + 'index.html');
  return existsSync(OUT + clean.slice(1) + '.html') || existsSync(OUT + clean.slice(1) + '/index.html') || existsSync(OUT + clean.slice(1));
};

async function oldPaths() {
  try {
    const res = await fetch(OLD_SITEMAP, { signal: AbortSignal.timeout(15000) });
    const xml = await res.text();
    const paths = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => norm(new URL(m[1]).pathname));
    if (paths.some(p => p.startsWith('/catalog/'))) {
      mkdirSync(fileURLToPath(new URL('.cache/', root)), { recursive: true });
      writeFileSync(CACHE, paths.join('\n'));
      return { paths, from: OLD_SITEMAP };
    }
  } catch { /* offline, or the new sitemap is already live */ }
  if (existsSync(CACHE)) return { paths: readFileSync(CACHE, 'utf8').split('\n').filter(Boolean), from: CACHE };
  return { paths: [], from: null };
}

// Old route shapes, checked on every build even without the sitemap.
const SHAPES = ['/catalog', '/catalog/x', '/catalog/products/x', '/catalog/products/x/md', '/districts', '/districts/x',
  '/divisions/x', '/solutions/x', '/evidence', '/evidence/x', '/insights', '/insights/x', '/quote', '/faq', '/llms-catalog.txt'];

const problems = [];
for (const r of rules) {
  if (norm(r.destination.split('#')[0]) === '/') problems.push(`rule ${r.source} goes to home`);
  else if (!isPage(r.destination)) problems.push(`rule ${r.source} goes to ${r.destination}, which is not a page in out/`);
  if (!r.permanent) problems.push(`rule ${r.source} is not permanent`);
}

const { paths, from } = await oldPaths();
const tally = { page: 0, redirect: 0 };
for (const p of [...new Set([...SHAPES, ...paths])]) {
  if (isPage(p) && !rules.some(r => r.re.test(p))) { tally.page++; continue; }
  const r = rules.find(x => x.re.test(p));
  if (!r) problems.push(`no rule for ${p}`);
  else tally.redirect++;
}

if (problems.length) {
  console.error(`Redirect check FAILED (${problems.length}):\n` + problems.slice(0, 50).join('\n'));
  process.exit(1);
}
console.log(`Redirect check passed: ${rules.length} rules; ${tally.redirect} old URLs redirect, ${tally.page} still exist.` +
  (from ? ` Old URLs from ${from}.` : ' WARNING: old sitemap not available; only route shapes were checked.'));
