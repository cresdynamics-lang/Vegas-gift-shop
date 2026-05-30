const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE = 'https://riogiftshop.com/wp-json/wc/store/v1';
const PER_PAGE = 100;
const PRODUCTS_DIR = path.join(__dirname, 'public', 'products');
const OUTPUT = path.join(__dirname, 'src', 'data', 'products.ts');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ json: JSON.parse(data), headers: res.headers, status: res.statusCode });
        } catch (e) {
          reject(new Error(`Parse error ${url}: ${data.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(dest);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        return resolve(null);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    }).on('error', () => {
      try { fs.unlinkSync(dest); } catch {}
      resolve(null);
    });
  });
}

function decodeHtml(str) {
  return (str || '')
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function slugify(text) {
  return decodeHtml(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function sanitize(str) {
  return (str || '').replace(/[^\x00-\x7F]/g, '').trim();
}

async function fetchAllProducts() {
  const all = [];
  let page = 1;
  let total = Infinity;

  while (all.length < total) {
    const url = `${BASE}/products?per_page=${PER_PAGE}&page=${page}`;
    console.log(`Fetching page ${page}...`);
    const { json, headers, status } = await fetchJson(url);
    if (status !== 200 || !Array.isArray(json)) break;
    total = parseInt(headers['x-wp-total'] || '0', 10);
    all.push(...json);
    console.log(`  Got ${json.length} (total so far: ${all.length}/${total})`);
    if (json.length < PER_PAGE) break;
    page++;
    await new Promise((r) => setTimeout(r, 300));
  }
  return all;
}

async function downloadBatch(items, concurrency = 15) {
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const { imgUrl, dest, product } = items[i];
      const ok = await downloadFile(imgUrl, dest);
      product.image = ok ? `/products/${path.basename(dest)}` : imgUrl;
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  console.log('Fetching all products from riogiftshop.com...');
  const rawProducts = await fetchAllProducts();
  console.log(`Fetched ${rawProducts.length} products`);

  const seenSlugs = new Set();
  const products = [];
  const downloadQueue = [];

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const slug = p.slug || slugify(p.name);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const name = sanitize(decodeHtml(p.name));
    if (!name) continue;

    const price = parseInt(p.prices?.price || '0', 10);
    const regular = parseInt(p.prices?.regular_price || '0', 10);
    const onSale = p.on_sale && regular > price;

    const catNames = (p.categories || []).map((c) => sanitize(decodeHtml(c.name))).filter(Boolean);
    const primaryCategory = catNames.find((c) => !['Best Selling Products', 'Flash Sales', 'Featured'].includes(c)) || catNames[0] || 'Gifts';

    const product = {
      id: slug,
      name,
      price: price || regular || 0,
      ...(onSale && regular > 0 ? { oldPrice: regular } : {}),
      rating: 5,
      reviews: Math.floor(Math.random() * 50) + 5,
      image: '/hero.png',
      category: primaryCategory,
      categories: catNames,
      ...(onSale ? { isSale: true } : {}),
      description: sanitize(decodeHtml(p.short_description || p.description || `${name} - premium gift from Vegas Gift Shop.`)).slice(0, 500) || `${name} - premium gift available at Vegas Gift Shop Nairobi.`,
    };

    const imgUrl = p.images?.[0]?.src;
    if (imgUrl) {
      const ext = path.extname(new URL(imgUrl).pathname) || '.jpeg';
      const filename = `rio_${p.id}${ext}`;
      const dest = path.join(PRODUCTS_DIR, filename);
      downloadQueue.push({ imgUrl, dest, product });
    }

    products.push(product);
  }

  console.log(`Downloading ${downloadQueue.length} images in parallel...`);
  await downloadBatch(downloadQueue, 20);
  console.log(`Unique products: ${products.length}`);

  // Preserve original Vegas products at the top if they exist
  let existingOriginal = [];
  if (fs.existsSync(OUTPUT)) {
    const content = fs.readFileSync(OUTPUT, 'utf8');
    const match = content.match(/export const products: Product\[\] = \[([\s\S]*?)\n\];/);
    if (match) {
      try {
        const existing = eval(`[${match[1]}]`);
        existingOriginal = existing.filter((p) =>
          !p.id.startsWith('rio_') &&
          !p.image?.includes('rio_') &&
          (p.image?.startsWith('/') && !p.image.startsWith('/products/rio_'))
        );
      } catch {}
    }
  }

  const mergedMap = new Map();
  for (const p of existingOriginal) mergedMap.set(p.id, p);
  for (const p of products) {
    if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
  }
  const merged = Array.from(mergedMap.values());
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
  console.log(`Written ${merged.length} products to ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
