/** Kenya / international digits for WhatsApp API (no + prefix). */
export function normalizeWhatsAppPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9) return null;
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0') && digits.length >= 10) return `254${digits.slice(1)}`;
  if (digits.length === 9 && digits.startsWith('7')) return `254${digits}`;
  return digits;
}
