export const TRACKING_CURRENCY = 'KES';

export type TrackingProduct = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

export type PurchaseTrackingPayload = {
  orderId: string;
  total: number;
  items: TrackingProduct[];
  eventId?: string;
};
