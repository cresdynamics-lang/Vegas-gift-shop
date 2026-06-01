import type { Product } from '../data/products';
import { isBrokenProductImage } from './imageUtils';

/** Second gallery image for Rio / WPZoom hover swap on product cards. */
export function getProductSecondaryImage(product: Product): string | null {
  const gallery =
    product.images && product.images.length > 0
      ? product.images.filter(Boolean)
      : product.image
        ? [product.image]
        : [];

  if (gallery.length < 2) return null;

  const primary = gallery[0];
  const secondary = gallery.find(
    (src, i) => i > 0 && src !== primary && !isBrokenProductImage(src)
  );

  return secondary ?? null;
}

/** Thumbnail strip below main image (Rio-style). Pads single-image products to 4 thumbs. */
export function getProductGallery(product: Product): string[] {
  const base =
    product.images && product.images.length > 0
      ? [...product.images]
      : product.image
        ? [product.image]
        : ['/hero.png'];

  if (base.length >= 2) return base;

  const main = base[0];
  return [main, main, main, main];
}

export function getShortProductIntro(product: Product): string {
  if (product.shortDescription?.trim()) {
    return product.shortDescription.trim();
  }
  const first = product.description.split(/\n\n+/)[0]?.trim();
  if (first && first.length < 600) return first;
  return product.description.slice(0, 500).trim();
}

const RELATED_LIMIT = 4;

function hashString(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function getProductCategorySet(product: Product): Set<string> {
  return new Set(
    [product.category, ...(product.categories ?? [])].filter(
      (c): c is string => Boolean(c?.trim())
    )
  );
}

function categoryOverlap(a: Product, b: Product): number {
  const setA = getProductCategorySet(a);
  let overlap = 0;
  for (const cat of getProductCategorySet(b)) {
    if (setA.has(cat)) overlap++;
  }
  return overlap;
}

/** Same-category picks like WooCommerce / Rio related products (stable per product id). */
export function getRelatedProducts(
  current: Product,
  catalog: Product[],
  limit = RELATED_LIMIT
): Product[] {
  const candidates = catalog
    .filter((p) => p.id !== current.id)
    .map((p) => ({
      product: p,
      overlap: categoryOverlap(current, p),
      samePrimary: p.category === current.category,
    }))
    .filter((entry) => entry.overlap > 0 || entry.samePrimary)
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      if (b.samePrimary !== a.samePrimary) return Number(b.samePrimary) - Number(a.samePrimary);
      if (b.product.rating !== a.product.rating) return b.product.rating - a.product.rating;
      return b.product.reviews - a.product.reviews;
    })
    .map((entry) => entry.product);

  let pool = candidates;
  if (pool.length > limit) {
    const offset = hashString(current.id) % (pool.length - limit + 1);
    pool = pool.slice(offset, offset + limit);
  } else if (pool.length < limit) {
    const seen = new Set([current.id, ...pool.map((p) => p.id)]);
    const seed = hashString(current.id);
    const fallback = catalog
      .filter((p) => !seen.has(p.id))
      .sort((a, b) => hashString(a.id + current.id + seed) - hashString(b.id + current.id + seed));
    pool = [...pool, ...fallback.slice(0, limit - pool.length)];
  }

  return pool.slice(0, limit);
}

export function buildWhatsAppOrderUrl(
  phoneDigits: string,
  productName: string,
  price: number,
  extras?: string
): string {
  const lines = [
    `Hello Vegas Gift Shop, I'd like to place an order:`,
    ``,
    `*${productName}*`,
    `Price: KShs ${price.toLocaleString()}`,
  ];
  if (extras) lines.push('', extras);
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phoneDigits.replace(/\D/g, '')}?text=${text}`;
}

/** Share product link via WhatsApp (Rio-style share button). */
export function buildWhatsAppShareUrl(productName: string, pageUrl: string): string {
  const text = `Check out *${productName}* on Vegas Gift Shop:\n${pageUrl}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
