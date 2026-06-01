import { categories, type Category } from './navigation';

/** Sidebar widget (6 categories). */
export const RIO_GIFT_SHOP_CATEGORY_IDS = [
  'men',
  'women',
  'corporate',
  'promotional',
  'personalized',
  'watches',
] as const;

/** Mobile homepage list — matches riogiftshop.com order. */
export const RIO_HOME_CATEGORY_IDS = [
  'men',
  'women',
  'cards',
  'trophies',
  'corporate',
  'promotional',
  'personalized',
  'watches',
] as const;

export type RioGiftShopCategoryId = (typeof RIO_GIFT_SHOP_CATEGORY_IDS)[number];

function pickCategories(ids: readonly string[]): Category[] {
  return ids.map((id) => categories.find((c) => c.id === id)).filter((c): c is Category => Boolean(c));
}

export function getRioGiftShopCategories(): Category[] {
  return pickCategories(RIO_GIFT_SHOP_CATEGORY_IDS);
}

export function getRioHomeCategories(): Category[] {
  return pickCategories(RIO_HOME_CATEGORY_IDS);
}

/** Short labels on Rio mobile (Men, Women, Trophies, …). */
export function getRioCategoryLabel(cat: Category, short = false): string {
  if (!short) return cat.name;
  if (cat.id === 'trophies') return 'Trophies';
  return cat.navLabel || cat.name.replace(' Gifts', '');
}
