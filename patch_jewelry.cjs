const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE = 'https://riogiftshop.com/wp-json/wc/store/v1';
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const OUTPUT = path.join(__dirname, 'src', 'data', 'products.ts');

// Rio category IDs for empty or under-populated sections
const CATEGORY_IDS = {
  jewerly: 123,
  cards: null, // search by name
  wholesale: null,
};

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ json: JSON.parse(data), headers: res.headers, status: res.statusCode });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function decodeHtml(str) {
  return (str || '')
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function sanitize(str) {
  return (str || '').replace(/[^\x00-\x7F]/g, '').trim();
}

function slugify(text) {
  return sanitize(decodeHtml(text))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function fetchByCategory(categoryId) {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${BASE}/products?category=${categoryId}&per_page=100&page=${page}`;
    const { json, status } = await fetchJson(url);
    if (status !== 200 || !Array.isArray(json) || json.length === 0) break;
    all.push(...json);
    if (json.length < 100) break;
    page++;
    await new Promise((r) => setTimeout(r, 200));
  }
  return all;
}

async function fetchAllCategories() {
  const all = [];
  let page = 1;
  while (true) {
    const { json, status } = await fetchJson(`${BASE}/products/categories?per_page=100&page=${page}`);
    if (status !== 200 || !Array.isArray(json) || json.length === 0) break;
    all.push(...json);
    if (json.length < 100) break;
    page++;
  }
  return all;
}

function mapProduct(p, extraCategories = []) {
  const slug = p.slug || slugify(p.name);
  const name = sanitize(decodeHtml(p.name));
  const price = parseInt(p.prices?.price || '0', 10);
  const regular = parseInt(p.prices?.regular_price || '0', 10);
  const onSale = p.on_sale && regular > price;
  let catNames = (p.categories || []).map((c) => sanitize(decodeHtml(c.name))).filter(Boolean);
  catNames = [...new Set([...catNames, ...extraCategories])];

  const imgUrl = p.images?.[0]?.src;
  let image = '/hero.png';
  if (imgUrl) {
    const ext = path.extname(new URL(imgUrl).pathname) || '.jpeg';
    image = `/products/rio_${p.id}${ext}`;
  }

  return {
    id: slug,
    name,
    price: price || regular || 0,
    ...(onSale && regular > 0 ? { oldPrice: regular } : {}),
    rating: 5,
    reviews: Math.floor(Math.random() * 50) + 5,
    image,
    category: catNames.find((c) => !['Best Selling Products', 'Flash Sales', 'Featured'].includes(c)) || catNames[0] || 'Gifts',
    categories: catNames,
    ...(onSale ? { isSale: true } : {}),
    description: sanitize(decodeHtml(p.short_description || p.description || `${name} - premium gift from Vegas Gift Shop.`)).slice(0, 500),
  };
}

async function main() {
  console.log('Fetching Jewerly category products...');
  const jewProducts = await fetchByCategory(CATEGORY_IDS.jewerly);
  console.log(`Fetched ${jewProducts.length} Jewerly products`);

  console.log('Fetching all WooCommerce categories...');
  const wcCategories = await fetchAllCategories();

  const targetNames = ['Cards', 'Wholesale', 'Schools Awards', 'Gift Cards', 'Couple Watches', 'Kids Watches'];
  const extraFetches = [];
  for (const name of targetNames) {
    const cat = wcCategories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (cat && cat.count > 0) {
      console.log(`Fetching ${cat.name} (${cat.count} products)...`);
      const prods = await fetchByCategory(cat.id);
      extraFetches.push(...prods.map((p) => ({ p, extra: [cat.name] })));
    }
  }

  // Load existing products
  const content = fs.readFileSync(OUTPUT, 'utf8');
  const existing = JSON.parse(content.match(/export const products: Product\[\] = (\[[\s\S]*\]);/)[1]);

  const map = new Map(existing.map((p) => [p.id, p]));

  // Merge Jewerly - tag all with Jewerly category
  for (const p of jewProducts) {
    const mapped = mapProduct(p, ['Jewerly', 'Jewelry']);
    const existingProd = map.get(mapped.id);
    if (existingProd) {
      const mergedCats = [...new Set([...(existingProd.categories || [existingProd.category]), ...mapped.categories, 'Jewerly', 'Jewelry'])];
      map.set(mapped.id, { ...existingProd, categories: mergedCats, category: existingProd.category || mapped.category });
    } else {
      map.set(mapped.id, mapped);
    }
  }

  // Merge extra category fetches
  for (const { p, extra } of extraFetches) {
    const mapped = mapProduct(p, extra);
    const existingProd = map.get(mapped.id);
    if (existingProd) {
      const mergedCats = [...new Set([...(existingProd.categories || [existingProd.category]), ...mapped.categories])];
      map.set(mapped.id, { ...existingProd, categories: mergedCats });
    } else {
      map.set(mapped.id, mapped);
    }
  }

  // Tag existing jewelry products with Jewerly/Jewelry if name matches
  for (const [id, p] of map.entries()) {
    const text = `${p.name} ${p.description || ''}`.toLowerCase();
    if (/necklace|earring|bracelet|pendant|cufflink|jewelry|jewellery|jewerly|locket|bangle/.test(text)) {
      const cats = [...new Set([...(p.categories || [p.category]), 'Jewerly', 'Jewelry'])];
      map.set(id, { ...p, categories: cats });
    }
  }

  const merged = Array.from(map.values());
  const tsProducts = JSON.stringify(merged, null, 2);

  const finalContent = `export type Product = {
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
  features?: string[];
};

export type { Category, SubcategoryGroup } from './navigation';
export { categories } from './navigation';

export const products: Product[] = ${tsProducts};
`;

  fs.writeFileSync(OUTPUT, finalContent, 'utf8');
  console.log(`Updated ${merged.length} products`);

  const jewCount = merged.filter((p) => (p.categories || []).some((c) => /jew/i.test(c))).length;
  console.log(`Products tagged with Jewerly/Jewelry: ${jewCount}`);
}

main().catch(console.error);
