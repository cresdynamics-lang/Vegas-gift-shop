import crypto from 'crypto';
import axios from 'axios';
import { parseOrderSnapshot } from './orderSnapshot';
import { getCatalogProductId } from './catalogId';

const CURRENCY = 'KES';

function sha256Normalized(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function isEnabled(): boolean {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN);
}

type PurchasePayload = {
  orderId: string;
  total: number;
  itemsSnapshot: unknown;
  customerEmail?: string | null;
  shippingPhone?: string | null;
  eventSourceUrl?: string;
  /** Match browser Pixel eventID for deduplication */
  eventId?: string;
};

export async function sendMetaPurchaseEvent(payload: PurchasePayload): Promise<{ sent: boolean }> {
  if (!isEnabled()) return { sent: false };

  const pixelId = process.env.META_PIXEL_ID!;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN!;
  const snapshot = parseOrderSnapshot(payload.itemsSnapshot);
  const contentIds = [
    ...new Set(snapshot.lineItems.map((line) => getCatalogProductId(line.productId || line.id))),
  ];

  const userData: Record<string, string> = {};
  if (payload.customerEmail) {
    userData.em = sha256Normalized(payload.customerEmail);
  }
  if (payload.shippingPhone) {
    const digits = payload.shippingPhone.replace(/\D/g, '');
    if (digits) userData.ph = sha256Normalized(digits);
  }

  const eventTime = Math.floor(Date.now() / 1000);
  const eventId = payload.eventId || `purchase-${payload.orderId}`;

  try {
    await axios.post(
      `https://graph.facebook.com/v21.0/${pixelId}/events`,
      {
        data: [
          {
            event_name: 'Purchase',
            event_time: eventTime,
            event_id: eventId,
            action_source: 'website',
            event_source_url:
              payload.eventSourceUrl ||
              `${(process.env.PUBLIC_SITE_URL || 'https://vegasgifts.co.ke').replace(/\/$/, '')}/checkout`,
            user_data: userData,
            custom_data: {
              currency: CURRENCY,
              value: payload.total,
              content_ids: contentIds,
              content_type: 'product',
              num_items: snapshot.lineItems.reduce((n, l) => n + l.quantity, 0),
            },
          },
        ],
        access_token: accessToken,
      },
      { timeout: 15000 }
    );
    return { sent: true };
  } catch (error) {
    const detail = axios.isAxiosError(error)
      ? JSON.stringify(error.response?.data ?? error.message)
      : String(error);
    console.error('Meta CAPI Purchase failed:', detail);
    return { sent: false };
  }
}
