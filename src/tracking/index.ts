import {
  initGa4,
  isGa4Enabled,
  trackGa4AddToCart,
  trackGa4PageView,
  trackGa4Purchase,
  trackGa4ViewItem,
} from './ga4';
import {
  initMetaPixel,
  isMetaPixelEnabled,
  trackMetaAddToCart,
  trackMetaPageView,
  trackMetaPurchase,
  trackMetaViewContent,
} from './metaPixel';
import type { PurchaseTrackingPayload, TrackingProduct } from './types';

export { getCatalogProductId } from './catalogId';
export { TRACKING_CURRENCY } from './types';
export type { PurchaseTrackingPayload, TrackingProduct };

export function initTracking(): void {
  initMetaPixel();
  initGa4();
}

export function isTrackingEnabled(): boolean {
  return isMetaPixelEnabled() || isGa4Enabled();
}

export function trackPageView(path: string, title?: string): void {
  trackMetaPageView();
  trackGa4PageView(path, title);
}

export function trackViewContent(product: TrackingProduct): void {
  trackMetaViewContent(product);
  trackGa4ViewItem(product);
}

export function trackAddToCart(product: TrackingProduct): void {
  trackMetaAddToCart(product);
  trackGa4AddToCart(product);
}

export function trackPurchase(payload: PurchaseTrackingPayload): void {
  const withEventId = {
    ...payload,
    eventId: payload.eventId || `purchase-${payload.orderId}`,
  };
  trackMetaPurchase(withEventId);
  trackGa4Purchase(withEventId);
}

export function buildPurchaseEventId(orderId: string): string {
  return `purchase-${orderId}`;
}
