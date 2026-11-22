// Brand scan: fails the build if the static output names a supplier or brand, makes a claim,
// or shows a percentage. The repo is public, so banned words are stored only as SHA-256 hashes
// of the lowercase word. To add a word: node -e "console.log(require('crypto').createHash('sha256').update('word').digest('hex'))"
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../out', import.meta.url));

const BANNED = new Set([
  'dd9ad1f900233e1bf04989e9298b745f37c81fac591ab4bced0aece6c2391c66',
  '124e2bc685c36c9118de69eefcf404b83937c254009a24e4545b130d15de37f7',
  '8edacc5261da8c1c2f72b4a941f714709175c6f36923874461dada8056c7466c',
  'ff47bb1aedd9ede5de2a7bad5131d5d109bdf397b52c2b95f5fda6e2d755dc67',
  '507bc52351e341c2f3c90cd495f60b883f51b4cf42f91a3ccd8db8bd7431403e',
  '4aae3f2d9f71fb5ea44ce85b0731aa883eb78f50ff7d63ab25f79dde5cb30c89',
  '5ad344f2d9a7bc5ab3291f7c5722b57ea7a416e25eaaaeed8067f7f57f835f67',
  '13b1f7ec5beaefc781e43a3b344371cd49923a8a05edd71844b92f56f6a08d38',
  'f72dc2cb53e42f108c86d01ffd7d20edf6c6bb306839c5585d7c8ead355ba166',
  '6ae899dc5a10c54fcd146d524e25b0c2b7a07c371aa0ab5bd48306c0ee31390d',
  '14b328a080d4961261470fb30e8336887477a4490fa9fe191a60f4a5320981f0',
  '50a6c6dfb3f93018d8f1d1b9b0779b1fb3d0a83411b4571e1f7d44c99c1e0f86',
  'd1cbb9d8761308e7aea78650ce7126bdedfe1db53167dc1c4081cdd5f2af9039',
  'a4cfe19c4ee80ba54516eac304e7e9870b248f7f8e64a7e7f3a777cf969fab0e',
  '417f02f9ea56337a1ad4178748fe0572825551920d69d610dc59139ea18833ff',
  'e47ed0a3f28f5c958dc7a021b9b5cb4ad752091461672b5aec690592b0114670',
  '46586b5be813ebd58e789146de9666826435b66dfe7d67169f5bfa0f299f7674',
  '2399d39a1edd6bf60b40916a8d12f3f2a18abc7d13ed37bd88d42b3ad411e6cb',
  'c04c538ae8499d3260155152f546cfd3a016ccf4bba438c93857427d2f72cc91',
  '3b49fcef1c7acb2e66586d0fe81064592243668f209db49b62b1e89a2fb2bacf',
  'c2619f1ff842206bdf36feac24d78e1e7609b6432731dd781c579c0da51ef9bd',
  '2d244c7239a7e9606182c281d7492ba063db17b586140fd2a7a520460f8a820e',
  'eafff92abbda18f614fd764bf84ab23a20ac2d547f13ffde50edf2b47d1babfe',
  'c8a674c6090bcd4640efe5b03560fe915200874944ee938b01519f6a82da2846',
  'c51fd19aa3fc3b789b17612d0ce2998e5573058fe4ab68f2a43185bcc2a294dc',
  'dd58827988b66ed837e7fc55512087824aefca3b0b840eda4b7b996ac7df578f',
  '03c5fdefe35673d9954ee2550b72ab73313bf22c211c7acf3f5901f6a947a526',
  '208e0b63cfd4753beca3707eed15dc4dac331382defbdec74bc426f4b940c77e',
  'a64d8f69bd4e52798a1dea7d6e8afacc5538204e61e722f82b07e26cb547792c',
  '845a238c16cac06a74c821712f07b1870e6ef224971735f158f83a8962e8492b',
  '3bb69575743b612cbed51082bab2f7c072965def4d14ee86a3de1670beb2107b',
  'fce22b11e4fc64e5c8c55f3b5e9a8a8250e05bb8d5b1c5be881a5544f5046fa3',
  '8779405d7a1a5725982c725bb31d12b0adf5d9e93f24d05c46c9acdc88c6e725',
  '1c61425b1ba94748e725edd6fbc902b80e08483116a8affb4b8829143e486f1e',
  'd55549f395dd0b37fae072b7b947e8cea1b008acc878a24b824be3ccdbecba42',
  '0b8cfe2861469d9afb534d4cab48ce9dd96e744aa9e655a7f103ada63d04981e',
  '3e5512d4db8d08612c73db540c0513c1aacba9f28360510f449ebd3a469b5291',
  'c00a62eb73af7d85d62d8e1d0a59abf001e85bf1a8a9f4aeabda343096c07858',
  'e6a25ed3ad6134b8da9ab8598f6dd1d759750065aa1c9c5d2cc31e37d4186e7a',
  '8a08e9844efb1bb81575852f9705522a596feff29111ef4b696e030df1d80c8f',
  '2c8a8bf9a740b4d9b27fb3acf8f1738fc4e93d834662b859fe33d20b3e02a0e0',
  'abfd3f1357c52d8fbf9d89912080b84a28430e19eb7a27bc50f15776fdb5394f',
]);

// Claim words are not secret; they must not appear in visible text.
const CLAIMS = /\b(best|leading|biggest|no\.?\s?1|number one|guaranteed?|cures?|cured|safe|seamless|cutting-edge|world-class)\b/i;
const PERCENT = /\d\s?%/;

const TEXT = new Set(['.html', '.js', '.json', '.txt', '.xml', '.css', '.svg', '.webmanifest', '.map', '.rsc']);
const sha = s => createHash('sha256').update(s).digest('hex');
const tokens = s => s.toLowerCase().match(/[a-z0-9]+/g) || [];

const walk = dir => readdirSync(dir).flatMap(n => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// Visible text of an HTML page: drop scripts, styles and tags, keep alt/title/aria-label and meta content.
const visible = html => {
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|content)="([^"]*)"/g)].map(m => m[1]).join(' ');
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  return (body + ' ' + attrs).replace(/&nbsp;/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&amp;/g, '&');
};

// Some banned words are also plain English, and framework code uses them as names
// (a React event method shares a name with one). In JS, an occurrence used as a property (obj.word, word: or word()
// is code, not text. Any other occurrence, such as inside a sentence, still fails.
const onlyCode = (text, t) => {
  const re = new RegExp(`(^|[^a-z0-9])${t}(?![a-z0-9])`, 'gi');
  for (const m of text.matchAll(re)) {
    const prev = m[1], next = text[m.index + m[0].length];
    if (prev !== '.' && next !== ':' && next !== '(') return false;
  }
  return true;
};

const problems = [];
let files = 0;
for (const file of walk(OUT)) {
  files++;
  const rel = relative(OUT, file).replace(/\\/g, '/');
  const hit = (where, tok) => problems.push(`${rel}: ${where} token sha256:${sha(tok).slice(0, 16)}`);
  for (const t of tokens(rel)) if (BANNED.has(sha(t))) hit('file name', t);
  if (!TEXT.has(extname(file))) continue;
  const text = readFileSync(file, 'utf8');
  for (const t of new Set(tokens(text))) if (BANNED.has(sha(t)) && !(rel.endsWith('.js') && onlyCode(text, t))) hit('content', t);
  if (rel.endsWith('.html') || rel === 'llms.txt') {
    const v = rel.endsWith('.html') ? visible(text) : text;
    const c = v.match(CLAIMS);
    if (c) problems.push(`${rel}: claim word "${c[0]}"`);
    const p = v.match(new RegExp('.{0,30}' + PERCENT.source + '.{0,10}'));
    if (p) problems.push(`${rel}: percentage "${p[0].trim()}"`);
  }
}

if (problems.length) {
  console.error(`Brand scan FAILED (${problems.length}):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`Brand scan passed: ${files} files in out/.`);
