import { getCatalogProductId } from './catalogId';
import { TRACKING_CURRENCY, type PurchaseTrackingPayload, type TrackingProduct } from './types';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID?.trim();

let initialized = false;

export function isGa4Enabled(): boolean {
  return Boolean(MEASUREMENT_ID);
}

export function initGa4(): void {
  if (!MEASUREMENT_ID || initialized || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  // Match gtag.js: push the full `arguments` object onto dataLayer
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments as unknown as Record<string, unknown>);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  initialized = true;
}

function gtagEvent(name: string, params?: Record<string, unknown>) {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', name, params);
}

function toGa4Item(product: TrackingProduct, index = 0) {
  return {
    item_id: getCatalogProductId(product.id),
    item_name: product.name,
    price: product.price,
    quantity: product.quantity ?? 1,
    index,
  };
}

export function trackGa4PageView(path: string, title?: string): void {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
  });
}

export function trackGa4ViewItem(product: TrackingProduct): void {
  gtagEvent('view_item', {
    currency: TRACKING_CURRENCY,
    value: product.price,
    items: [toGa4Item(product)],
  });
}

export function trackGa4AddToCart(product: TrackingProduct): void {
  gtagEvent('add_to_cart', {
    currency: TRACKING_CURRENCY,
    value: product.price * (product.quantity ?? 1),
    items: [toGa4Item(product)],
  });
}

export function trackGa4Purchase(payload: PurchaseTrackingPayload): void {
  gtagEvent('purchase', {
    transaction_id: payload.orderId,
    value: payload.total,
    currency: TRACKING_CURRENCY,
    items: payload.items.map((item, index) => toGa4Item(item, index)),
  });
}
