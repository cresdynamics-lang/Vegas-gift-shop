/**
 * Adds gallery images + size/attributes from Rio API to products in products.ts
 * Usage: node scripts/enrich_product_gallery.cjs
 */
const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE = 'https://riogiftshop.com/wp-json/wc/store/v1';
const PER_PAGE = 100;
const PRODUCTS_DIR = path.join(__dirname, '..', 'public', 'products');
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

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(dest);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 60000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch {}
        return downloadFile(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        file.close();
        try {
          fs.unlinkSync(dest);
        } catch {}
        return resolve(null);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', () => {
      try {
        fs.unlinkSync(dest);
      } catch {}
      resolve(null);
    });
  });
}

function decodeHtml(str) {
  return (str || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .trim();
}

async function fetchAllRio() {
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
    if (json.length < PER_PAGE) break;
    page++;
    await new Promise((r) => setTimeout(r, 200));
  }
  return all;
}

async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const content = fs.readFileSync(OUTPUT, 'utf8');
  const match = content.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error('Could not parse products.ts');
  const products = JSON.parse(match[1]);

  const rioProducts = await fetchAllRio();
  const rioBySlug = new Map();
  for (const p of rioProducts) {
    rioBySlug.set(p.slug, p);
    rioBySlug.set(`rio_${p.id}`, p);
  }

  let galleryCount = 0;
  let attrCount = 0;

  for (const product of products) {
    const rio = rioBySlug.get(product.id);
    if (!rio) continue;

    if (rio.short_description) {
      product.shortDescription = decodeHtml(rio.short_description).slice(0, 1200);
    }

    if (rio.attributes?.length) {
      product.attributes = rio.attributes.map((a) => ({
        name: a.name,
        values: (a.terms || []).map((t) => t.name).filter(Boolean),
      })).filter((a) => a.values.length > 0);
      if (product.attributes.length) attrCount++;
    }

    product.enableCustomization = true;

    const imagePaths = [];
    for (let i = 0; i < (rio.images || []).length; i++) {
      const img = rio.images[i];
      const ext = path.extname(new URL(img.src).pathname) || '.jpg';
      const filename = `rio_${rio.id}_${i}${ext}`;
      const dest = path.join(PRODUCTS_DIR, filename);
      const ok = await downloadFile(img.src, dest);
      imagePaths.push(ok ? `/products/${filename}` : img.src);
    }
    if (imagePaths.length > 0) {
      product.images = imagePaths;
      product.image = imagePaths[0];
      galleryCount++;
    }
  }

  const typeBlock = `export type ProductPackageSection = {
  title: string;
  items: string[];
};

export type ProductAttribute = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  category: string;
  categories?: string[];
  isNew?: boolean;
  isSale?: boolean;
  description: string;
  shortDescription?: string;
  packageSections?: ProductPackageSection[];
  attributes?: ProductAttribute[];
  enableCustomization?: boolean;
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
  console.log(`Gallery updated: ${galleryCount}, attributes: ${attrCount}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
