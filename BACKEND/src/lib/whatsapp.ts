import axios from 'axios';
import prisma from './prisma';
import { mergeSettings, type StoredSettings } from './defaultSettings';
import { normalizeWhatsAppPhone } from './phone';

export type OrderWhatsAppPayload = {
  orderId: string;
  total: number;
  customerName?: string | null;
  customerPhone?: string | null;
};

export function buildOrderReceivedMessage(payload: OrderWhatsAppPayload): string {
  const shortId = payload.orderId.slice(0, 8).toUpperCase();
  const name = payload.customerName?.trim() || 'there';
  const total = `KShs ${payload.total.toLocaleString('en-KE')}`;

  return [
    `Hello ${name}! 🎁`,
    '',
    `Your order at *Vegas Gift Shop* has been received.`,
    '',
    `Order #: *${shortId}*`,
    `Total: ${total}`,
    `Status: Pending — we will review and contact you shortly.`,
    '',
    `Thank you for choosing Vegas Gift Shop!`,
  ].join('\n');
}

async function isWhatsAppEnabled(): Promise<boolean> {
  if (process.env.WHATSAPP_ENABLED === 'false') return false;
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return false;
  }

  try {
    const row = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
    const stored: StoredSettings | null = row
      ? {
          notifications: row.notifications as StoredSettings['notifications'],
        }
      : null;
    const merged = mergeSettings(stored);
    const notifications = merged.notifications as {
      whatsappOrderConfirmationEnabled?: boolean;
    };
    return notifications.whatsappOrderConfirmationEnabled !== false;
  } catch {
    return true;
  }
}

/** Send order-received text via Meta WhatsApp Cloud API. Never throws. */
export async function sendOrderReceivedWhatsApp(
  payload: OrderWhatsAppPayload
): Promise<{ sent: boolean; reason?: string }> {
  const to = normalizeWhatsAppPhone(payload.customerPhone);
  if (!to) {
    return { sent: false, reason: 'invalid_phone' };
  }

  const enabled = await isWhatsAppEnabled();
  if (!enabled) {
    return { sent: false, reason: 'disabled' };
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const templateName = process.env.WHATSAPP_ORDER_TEMPLATE?.trim();
  const body = buildOrderReceivedMessage(payload);

  try {
    if (templateName) {
      const shortId = payload.orderId.slice(0, 8).toUpperCase();
      const name = payload.customerName?.trim() || 'Customer';
      const total = `KShs ${payload.total.toLocaleString('en-KE')}`;

      await axios.post(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANG || 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: name },
                  { type: 'text', text: shortId },
                  { type: 'text', text: total },
                ],
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
    } else {
      await axios.post(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );
    }

    return { sent: true };
  } catch (error) {
    const detail = axios.isAxiosError(error)
      ? JSON.stringify(error.response?.data ?? error.message)
      : String(error);
    console.error('WhatsApp order notification failed:', detail);
    return { sent: false, reason: 'api_error' };
  }
}
