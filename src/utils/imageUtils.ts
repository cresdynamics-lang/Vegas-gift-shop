import { API_URL } from '../config';

const preloaded = new Set<string>();

export const PRODUCT_CARD_FALLBACK = '/collection-bg.png';

/** Card thumbnails (~2-col mobile); detail hero; gallery thumbs */
export const IMAGE_WIDTH = {
  card: 420,
  thumb: 96,
  detail: 960,
  hero: 1200,
} as const;

/** Hint the browser to fetch an image early (e.g. product hero). */
export function preloadImage(src: string): void {
  if (!src || preloaded.has(src)) return;
  preloaded.add(src);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getProductImageUrl(src, IMAGE_WIDTH.detail);
  document.head.appendChild(link);
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
