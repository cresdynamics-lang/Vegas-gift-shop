import { API_URL } from '../config';
import type { Product } from '../data/products';

export type SyncedApiProduct = {
  id: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  images?: unknown;
  packageSections?: unknown;
  attributes?: unknown;
  enableCustomization?: boolean;
  isSale?: boolean;
  isNew?: boolean;
};

const inflight = new Map<string, Promise<SyncedApiProduct | null>>();

function buildSyncBody(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.image,
    images: product.images,
    category: product.category,
    packageSections: product.packageSections,
    attributes: product.attributes,
    features: product.features,
    enableCustomization: product.enableCustomization,
    isSale: product.isSale,
    isNew: product.isNew,
    rating: product.rating,
    reviews: product.reviews,
  };
}

/**
 * Registers the storefront product in the API DB and returns the saved record.
 * Dedupes concurrent calls for the same product id (avoids Strict Mode double-fetch races).
 */
export async function syncProductToBackend(
  product: Product
): Promise<SyncedApiProduct | null> {
  const existing = inflight.get(product.id);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${product.id}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildSyncBody(product)),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn(
          `[sync] ${product.id} failed:`,
          res.status,
          (err as { error?: string }).error || res.statusText
        );
        return null;
      }

      return (await res.json()) as SyncedApiProduct;
    } catch (err) {
      console.warn('[sync] network error, is the backend running on port 5000?', err);
      return null;
    } finally {
      inflight.delete(product.id);
    }
  })();

  inflight.set(product.id, promise);
  return promise;
}
