import { create } from 'zustand';
import { formatDisplayText } from '../utils/formatText';
import { persist } from 'zustand/middleware';
import { trackAddToCart } from '../tracking';

export interface CartItemOptions {
  /** @deprecated Use variants — kept for older cart entries */
  size?: string;
  variants?: Record<string, string>;
  giftWrapping?: boolean;
  giftCard?: boolean;
  engraving?: boolean;
  cardInstructions?: string;
  brandingInstructions?: string;
}

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  options?: CartItemOptions;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any, quantity?: number, options?: CartItemOptions) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, options) => {
        const items = get().items;
        const variants =
          options?.variants && Object.keys(options.variants).length
            ? options.variants
            : options?.size
              ? { Size: options.size }
              : undefined;
        const cartId =
          variants && Object.keys(variants).length
            ? `${product.id}__${Object.entries(variants)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, v]) => `${k}=${v}`)
                .join('__')}`
            : String(product.id);
        const baseName = formatDisplayText(product.name);
        const variantLabel = variants
          ? Object.entries(variants)
              .map(([k, v]) => `${k} ${v}`)
              .join(', ')
          : '';
        const displayName = variantLabel ? `${baseName} (${variantLabel})` : baseName;
        const existingItem = items.find((item) => item.id === cartId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === cartId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: cartId,
                name: displayName,
                price: product.price,
                image: product.image,
                quantity,
                options,
              },
            ],
          });
        }

        trackAddToCart({
          id: product.id,
          name: baseName,
          price: product.price,
          quantity,
        });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'vegas-gift-cart',
    }
  )
);
