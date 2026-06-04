import { getCatalogProductId } from './catalogId';
import { TRACKING_CURRENCY, type PurchaseTrackingPayload, type TrackingProduct } from './types';

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: Fbq;
  loaded: boolean;
  version: string;
};

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim();

let initialized = false;

export function isMetaPixelEnabled(): boolean {
  return Boolean(PIXEL_ID);
}

export function initMetaPixel(): void {
  if (!PIXEL_ID || initialized || typeof window === 'undefined' || window.fbq) return;

  const f = window;
  const b = document;
  const e = 'script';
  const v = 'https://connect.facebook.net/en_US/fbevents.js';

  const n: Fbq = function (...args: unknown[]) {
    if (n.callMethod) {
      n.callMethod.apply(n, args);
    } else {
      n.queue.push(args);
    }
  } as Fbq;

  f.fbq = n;
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  const t = b.createElement(e) as HTMLScriptElement;
  t.async = true;
  t.src = v;
  const s = b.getElementsByTagName(e)[0];
  s?.parentNode?.insertBefore(t, s);

  f.fbq('init', PIXEL_ID);
  initialized = true;
}

function track(event: string, params?: Record<string, unknown>, options?: { eventID?: string }) {
  if (!PIXEL_ID || !window.fbq) return;
  if (options?.eventID) {
    window.fbq('track', event, params ?? {}, { eventID: options.eventID });
  } else {
    window.fbq('track', event, params ?? {});
  }
}

export function trackMetaPageView(): void {
  if (!PIXEL_ID || !window.fbq) return;
  window.fbq('track', 'PageView');
}

function productParams(product: TrackingProduct) {
  const id = getCatalogProductId(product.id);
  return {
    content_ids: [id],
    content_type: 'product',
    content_name: product.name,
    value: product.price * (product.quantity ?? 1),
    currency: TRACKING_CURRENCY,
  };
}

export function trackMetaViewContent(product: TrackingProduct): void {
  track('ViewContent', productParams(product));
}

export function trackMetaAddToCart(product: TrackingProduct): void {
  track('AddToCart', productParams(product));
}

export function trackMetaPurchase(payload: PurchaseTrackingPayload): void {
  const contentIds = [
    ...new Set(payload.items.map((i) => getCatalogProductId(i.id))),
  ];
  const eventId = payload.eventId || `purchase-${payload.orderId}`;

  track(
    'Purchase',
    {
      content_ids: contentIds,
      content_type: 'product',
      value: payload.total,
      currency: TRACKING_CURRENCY,
      num_items: payload.items.reduce((n, i) => n + (i.quantity ?? 1), 0),
    },
    { eventID: eventId }
  );
}
