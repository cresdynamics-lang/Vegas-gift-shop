const preloaded = new Set<string>();

/** Hint the browser to fetch an image early (e.g. product hero). */
export function preloadImage(src: string): void {
  if (!src || preloaded.has(src)) return;
  preloaded.add(src);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}

export const PRODUCT_CARD_FALLBACK = '/collection-bg.png';
