import { DEFAULT_WHATSAPP } from '../constants/rioProductDefaults';

export function normalizeWhatsAppPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP;
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith('7')) return `254${digits}`;
  return digits;
}

export function buildOrderReceivedMessage(params: {
  orderId: string;
  total: number;
  customerName?: string;
}): string {
  const shortId = params.orderId.slice(0, 8).toUpperCase();
  const name = params.customerName?.trim() || 'there';
  const total = `KShs ${params.total.toLocaleString('en-KE')}`;

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

/** Opens WhatsApp with confirmation text (fallback when server API is not configured). */
export function buildCustomerOrderConfirmationUrl(
  customerPhone: string,
  message: string
): string {
  const phone = normalizeWhatsAppPhone(customerPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
