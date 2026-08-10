// Regenerates src/data/division_index.json from the real catalogue.
//   node scripts/gen_division_index.mjs
//
// The catalogue landing page used to hardcode its division list AND its product counts. Every
// count was wrong (Dental claimed 12 and holds 54; Cardiovascular claimed 160 and holds 64), five
// divisions listed did not exist at all and returned 404 to the customer, and five divisions that
// DO have products had no link anywhere on the site. Deriving the list removes the whole class of
// fault: a division appears if and only if it has products, with the count it actually has.
//
// Re-run this whenever src/data/catalog_products.json changes.
import { readFileSync, writeFileSync } from 'node:fs';

const products = JSON.parse(readFileSync('src/data/catalog_products.json', 'utf8'));

// The [division] route already aliases these two, and both URLs are live and indexed. Keep them.
const SLUG_ALIAS = { 'joint-replacement': 'arthroplasty' };
const DISPLAY = {
  trauma: 'Trauma & Reconstruction',
  arthroplasty: 'Joint Replacement',
  'endo-surgery': 'Endo-Surgical',
  ent: 'ENT',
  'peripheral-intervention': 'Peripheral Intervention',
  'surgical-robotics': 'Surgical Robotics',
};

const counts = new Map();
for (const p of products) {
  const canon = p.division_canonical;
  if (!canon || canon === '_REVIEW') continue;
  const base = canon.toLowerCase().replace(/\s+/g, '-');
  const slug = SLUG_ALIAS[base] || base;
  const cur = counts.get(slug) || { slug, name: DISPLAY[slug] || canon, count: 0 };
  cur.count += 1;
  counts.set(slug, cur);
}

const list = [...counts.values()].sort((a, b) => b.count - a.count);
writeFileSync('src/data/division_index.json', JSON.stringify(list, null, 1) + '\n');
console.log(`wrote ${list.length} divisions, ${list.reduce((n, d) => n + d.count, 0)} products`);
for (const d of list) console.log(`   ${String(d.count).padStart(4)}  ${d.slug}`);
