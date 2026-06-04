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

export function productIdFromCartId(cartId: string | number): string {
  return String(cartId).split('__')[0];
}

export function buildOrderSnapshot(
  items: Array<{
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    options?: OrderLineItem['options'];
  }>,
  extra?: { shippingMethod?: string; customerEmail?: string }
): OrderSnapshot {
  return {
    lineItems: items.map((item) => ({
      id: String(item.id),
      productId: productIdFromCartId(item.id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      options: item.options,
    })),
    shippingMethod: extra?.shippingMethod,
    customerEmail: extra?.customerEmail,
  };
}

export function parseOrderSnapshot(raw: unknown): OrderSnapshot {
  if (!raw) return { lineItems: [] };
  if (Array.isArray(raw)) {
    return {
      lineItems: raw.map((item) => ({
        id: String(item.id ?? ''),
        productId: productIdFromCartId(item.productId ?? item.id ?? ''),
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
