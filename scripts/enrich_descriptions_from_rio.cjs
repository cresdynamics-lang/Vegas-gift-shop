/**
 * Fetches full HTML descriptions from riogiftshop.com and adds packageSections
 * to products in src/data/products.ts (Rio-style: What's included, Features, Perfect for).
 *
 * Usage: node scripts/enrich_descriptions_from_rio.cjs
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE = 'https://riogiftshop.com/wp-json/wc/store/v1';
const PER_PAGE = 100;
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'products.ts');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ json: JSON.parse(data), headers: res.headers, status: res.statusCode });
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function decodeHtml(str) {
  return (str || '')
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function htmlToPlainText(html) {
  return decodeHtml(html)
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const SECTION_DEFS = [
  { title: "What's included", patterns: [/what'?s included:?/i, /^set includes:?/im, /^gift set includes:?/im] },
  { title: 'Features', patterns: [/^key features:?/im, /^features:?/im] },
  { title: "Why you'll love it", patterns: [/^why you(?:'|')?ll love it:?/im] },
  { title: 'Perfect for', patterns: [/^perfect for:?/im, /^ideal for:?/im] },
];

function extractListItems(block) {
  const items = [];
  for (const line of block.split('\n').map((l) => l.trim()).filter(Boolean)) {
    const bullet = line.match(/^[-•*–—]\s*(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet) items.push(bullet[1].trim());
    else if (numbered) items.push(numbered[1].trim());
    else if (line.length > 2 && !/^(features?|perfect for|set includes):?$/i.test(line)) items.push(line);
  }
  return [...new Set(items.filter((i) => i.length > 2))];
}

function parseDescription(raw) {
  const text = raw.replace(/\r\n/g, '\n').trim();
  const markers = [];
  for (const def of SECTION_DEFS) {
    for (const pattern of def.patterns) {
      const m = pattern.exec(text);
      if (m) {
        markers.push({ index: m.index, title: def.title, len: m[0].length });
        break;
      }
    }
  }
  markers.sort((a, b) => a.index - b.index);
  if (!markers.length) return { intro: text, sections: [] };

  const intro = text.slice(0, markers[0].index).trim();
  const sections = [];
  for (let i = 0; i < markers.length; i++) {
    const body = text.slice(markers[i].index + markers[i].len, markers[i + 1]?.index ?? text.length).trim();
    const items = extractListItems(body);
    if (items.length) sections.push({ title: markers[i].title, items });
  }
  return { intro, sections };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function fetchAllRio() {
  const all = [];
  let page = 1;
  let total = Infinity;
  while (all.length < total) {
    const url = `${BASE}/products?per_page=${PER_PAGE}&page=${page}`;
    console.log(`Fetching Rio page ${page}...`);
    const { json, headers, status } = await fetchJson(url);
    if (status !== 200 || !Array.isArray(json)) break;
    total = parseInt(headers['x-wp-total'] || '0', 10);
    all.push(...json);
    if (json.length < PER_PAGE) break;
    page++;
    await new Promise((r) => setTimeout(r, 250));
  }
  return all;
}

async function main() {
  const content = fs.readFileSync(OUTPUT, 'utf8');
  const match = content.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error('Could not parse products.ts');
  const products = JSON.parse(match[1]);
  console.log(`Loaded ${products.length} local products`);

  const rioProducts = await fetchAllRio();
  console.log(`Fetched ${rioProducts.length} Rio products`);

  const rioBySlug = new Map();
  for (const p of rioProducts) {
    const slug = p.slug || slugify(p.name);
    rioBySlug.set(slug, p);
    if (p.id) rioBySlug.set(`rio_${p.id}`, p);
  }

  let updated = 0;
  for (const product of products) {
    const rio = rioBySlug.get(product.id);
    if (!rio) continue;

    const html = rio.short_description || rio.description || '';
    const plain = htmlToPlainText(html);
    if (!plain) continue;

    const { intro, sections } = parseDescription(plain);
    product.description = intro.slice(0, 2000) || product.description;
    if (sections.length > 0) {
      product.packageSections = sections;
      updated++;
    }
  }

  const typeBlock = `export type ProductPackageSection = {
  title: string;
  items: string[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  categories?: string[];
  isNew?: boolean;
  isSale?: boolean;
  description: string;
  packageSections?: ProductPackageSection[];
  features?: string[];
};

export type { Category, SubcategoryGroup } from './navigation';
export { categories } from './navigation';
`;

  fs.writeFileSync(
    OUTPUT,
    `${typeBlock}\n\nexport const products: Product[] = ${JSON.stringify(products, null, 2)};\n`,
    'utf8'
  );
  console.log(`Updated ${updated} products with package sections → ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
