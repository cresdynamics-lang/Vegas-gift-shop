import { API_URL } from '../config';

const preloaded = new Set<string>();
const prefetching = new Set<string>();

export const PRODUCT_CARD_FALLBACK = '/collection-bg.png';

/** Card thumbnails (~2-col mobile); detail hero; gallery thumbs */
export const IMAGE_WIDTH = {
  card: 420,
  thumb: 96,
  detail: 960,
  hero: 1200,
} as const;

/** Fetch a URL into the browser cache (parallel-friendly). */
export function prefetchImageUrl(url: string): void {
  if (!url || prefetching.has(url)) return;
  prefetching.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.onload = () => preloaded.add(url);
  img.onerror = () => prefetching.delete(url);
  img.src = url;
}

/** Hint the browser to fetch resized product images early. */
export function preloadImage(src: string, width: number = IMAGE_WIDTH.detail): void {
  if (!src) return;
  const url = getProductImageUrl(src, width);
  if (preloaded.has(url)) return;
  prefetchImageUrl(url);
}

/** Preload several assets at common sizes (gallery + related cards). */
export function preloadProductImages(
  sources: string[],
  widths: number[] = [IMAGE_WIDTH.detail, IMAGE_WIDTH.thumb, IMAGE_WIDTH.card]
): void {
  const unique = [...new Set(sources.filter(Boolean))];
  for (const src of unique) {
    for (const w of widths) {
      preloadImage(src, w);
    }
  }
}

/** Encode local asset paths for use in img src (spaces, etc.). */
export function toBrowserAssetUrl(src: string): string {
  if (
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:') ||
    !src.startsWith('/')
  ) {
    return src;
  }
  return encodeURI(src);
}

const BROKEN_IMAGE_PATHS = new Set([
  '/teddy bear gift 2.png',
  '/products/cream-romantic-teddy-bear.png',
]);

export function isBrokenProductImage(src: string | undefined): boolean {
  return !src || BROKEN_IMAGE_PATHS.has(src);
}

/** Local storefront assets → resized via API; external URLs unchanged. */
export function getProductImageUrl(src: string | undefined, width: number = IMAGE_WIDTH.card): string {
  const clean = src ? sanitizeProductImageSrc(src) : undefined;
  if (!clean) return toBrowserAssetUrl(PRODUCT_CARD_FALLBACK);
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  if (!clean.startsWith('/')) return clean;

  const params = new URLSearchParams({
    path: clean,
    w: String(Math.min(Math.max(width, 64), 1600)),
  });
  return `${API_URL}/api/img?${params.toString()}`;
}

export function sanitizeProductImageSrc(src: string | undefined): string {
  if (!src || BROKEN_IMAGE_PATHS.has(src)) {
    return '/products/cream-romantic-teddy-bear.jpeg';
  }
  return src;
}

/** Direct static URL (Vite/public) — use when skipping the resize API. */
export function getStaticAssetUrl(src: string | undefined): string {
  if (!src) return toBrowserAssetUrl(PRODUCT_CARD_FALLBACK);
  return toBrowserAssetUrl(sanitizeProductImageSrc(src));
}

/** @deprecated Use toBrowserAssetUrl */
export const resolvePublicAssetUrl = toBrowserAssetUrl;
