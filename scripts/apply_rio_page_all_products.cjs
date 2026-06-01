/**
 * Applies Rio product-page fields to EVERY product in products.ts:
 * - enableCustomization, shortDescription, images[], attributes (from Rio API)
 * - Downloads extra gallery images in parallel when missing locally
 *
 * Usage: node scripts/apply_rio_page_all_products.cjs
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
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 90000 }, (res) => {
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
    if (fs.existsSync(dest)) return resolve(true);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 90000 }, (res) => {
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
        return resolve(false);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', () => {
      try {
        fs.unlinkSync(dest);
      } catch {}
      resolve(false);
    });
  });
}

function decodeHtml(html) {
  return (html || '')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstParagraph(text) {
  if (!text) return '';
  const para = text.split(/\n\n+/)[0]?.trim() || text;
  return para.slice(0, 1200);
}

async function fetchAllRio() {
  const all = [];
  let page = 1;
  let total = Infinity;
  while (all.length < total) {
    const url = `${BASE}/products?per_page=${PER_PAGE}&page=${page}`;
    console.log(`Rio API page ${page}...`);
    const { json, headers, status } = await fetchJson(url);
    if (status !== 200 || !Array.isArray(json)) break;
    total = parseInt(headers['x-wp-total'] || '0', 10);
    all.push(...json);
    if (json.length < PER_PAGE) break;
    page++;
    await new Promise((r) => setTimeout(r, 150));
  }
  return all;
}

async function runPool(tasks, concurrency) {
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      await tasks[idx]();
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function main() {
  if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

  const content = fs.readFileSync(OUTPUT, 'utf8');
  const match = content.match(/export const products: Product\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error('Could not parse products.ts');
  const products = JSON.parse(match[1]);
  console.log(`Loaded ${products.length} products`);

  const rioProducts = await fetchAllRio();
  console.log(`Rio catalog: ${rioProducts.length} products`);

  const rioBySlug = new Map();
  for (const p of rioProducts) {
    rioBySlug.set(p.slug, p);
    rioBySlug.set(`rio_${p.id}`, p);
  }

  const downloadTasks = [];

  for (const product of products) {
    product.enableCustomization = true;

    const rio = rioBySlug.get(product.id);

    if (rio?.short_description) {
      product.shortDescription = firstParagraph(decodeHtml(rio.short_description));
    } else if (!product.shortDescription) {
      product.shortDescription = firstParagraph(
        decodeHtml(product.description || product.name)
      );
    }

    if (rio?.attributes?.length) {
      const attrs = rio.attributes
        .map((a) => ({
          name: a.name,
          values: (a.terms || []).map((t) => t.name).filter(Boolean),
        }))
        .filter((a) => a.values.length > 0);
      if (attrs.length) product.attributes = attrs;
    }

    const imagePaths = [];
    if (rio?.images?.length) {
      for (let i = 0; i < rio.images.length; i++) {
        const img = rio.images[i];
        const ext = path.extname(new URL(img.src).pathname) || '.jpg';
        const filename = `rio_${rio.id}_${i}${ext}`;
        const dest = path.join(PRODUCTS_DIR, filename);
        const webPath = `/products/${filename}`;
        imagePaths.push(webPath);
        if (!fs.existsSync(dest)) {
          downloadTasks.push(() => downloadFile(img.src, dest));
        }
      }
    }

    if (imagePaths.length > 0) {
      product.images = imagePaths;
      product.image = imagePaths[0];
    } else if (product.image) {
      product.images = [product.image];
    }
  }

  console.log(`Downloading ${downloadTasks.length} missing gallery images (parallel)...`);
  await runPool(downloadTasks, 25);
  console.log('Downloads complete');

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

  const withGallery = products.filter((p) => (p.images?.length || 0) > 1).length;
  const withAttrs = products.filter((p) => (p.attributes?.length || 0) > 0).length;
  console.log(`Done. Multi-image galleries: ${withGallery}, with size/options: ${withAttrs}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
