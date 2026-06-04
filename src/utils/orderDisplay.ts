export type OrderLineItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options?: {
    variants?: Record<string, string>;
    giftWrapping?: boolean;
    giftCard?: boolean;
    engraving?: boolean;
    cardInstructions?: string;
    brandingInstructions?: string;
  };
};

export type OrderSnapshot = {
  lineItems: OrderLineItem[];
  shippingMethod?: string;
  customerEmail?: string;
};

export function parseOrderSnapshot(raw: unknown): OrderSnapshot {
  if (!raw) return { lineItems: [] };
  if (Array.isArray(raw)) {
    return {
      lineItems: raw.map((item) => ({
        id: String(item.id ?? ''),
        productId: String(item.productId ?? String(item.id ?? '').split('__')[0]),
        name: String(item.name ?? 'Product'),
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 1),
        image: String(item.image ?? ''),
        options: item.options,
      })),
    };
  }
  if (typeof raw === 'object' && raw !== null && 'lineItems' in raw) {
    const obj = raw as OrderSnapshot;
    return {
      lineItems: Array.isArray(obj.lineItems) ? obj.lineItems : [],
      shippingMethod: obj.shippingMethod,
      customerEmail: obj.customerEmail,
    };
  }
  return { lineItems: [] };
}

export function formatOrderInstructions(options?: OrderLineItem['options']): string[] {
  if (!options) return [];
  const lines: string[] = [];
  if (options.variants) {
    Object.entries(options.variants).forEach(([key, val]) => {
      if (val) lines.push(`${key}: ${val}`);
    });
  }
  if (options.giftWrapping) lines.push('Gift wrapping: Yes');
  if (options.giftCard) {
    lines.push(
      options.cardInstructions
        ? `Gift card: ${options.cardInstructions}`
        : 'Gift card: Yes'
    );
  }
  if (options.engraving) {
    lines.push(
      options.brandingInstructions
        ? `Engraving/branding: ${options.brandingInstructions}`
        : 'Engraving/branding: Yes'
    );
  }
  return lines;
}
