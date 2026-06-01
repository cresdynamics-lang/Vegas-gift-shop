// Maps shop subcategories to Rio Gift Shop category names and product keywords
export const SUBCATEGORY_MATCHERS: Record<string, { categories?: string[]; keywords?: string[] }> = {
  // Jewelry
  Jewelry: {
    categories: ['Jewerly', 'Jewelry', 'Jewelry Products'],
    keywords: ['necklace', 'earring', 'bracelet', 'pendant', 'jewelry', 'jewellery', 'cufflink', 'locket', 'bangle'],
  },
  Necklaces: { keywords: ['necklace', 'pendant', 'locket', 'chain necklace'] },
  Earrings: { keywords: ['earring', 'ear ring', 'stud earring'] },
  Bracelets: {
    categories: ['Bracelets', "Men's Bracelets", 'Ladies Bracelets', 'Men Bracelets'],
    keywords: ['bracelet', 'bangle', 'wristband'],
  },
  Rings: { keywords: [' ring', 'ring ', 'rings ', ' rings'] },
  Cufflinks: { categories: ['Cufflinks'], keywords: ['cufflink', 'cuff link'] },
  'Matching Set': { keywords: ['matching set', 'jewelry set', 'necklace and earring', 'necklace & earring', 'set for her', 'set for women'] },
  'Couple Necklaces': { keywords: ['couple necklace', 'couple pendant', 'matching couple', 'his and hers', 'couple jewelry', 'couple gift set'] },
  'Pendant Necklaces': { keywords: ['pendant necklace', 'pendant', 'dog tag necklace', 'locket necklace'] },
  'Personalized Jewelry': {
    keywords: ['personalized necklace', 'personalized bracelet', 'personalized ring', 'personalized pendant', 'personalized jewelry', 'personalized earring', 'engraved necklace', 'engraved bracelet', 'custom necklace', 'custom bracelet'],
  },
  'Romantic Gifts': { categories: ['Romantic Gifts'], keywords: ['romantic gift', 'couple gift', 'love gift', 'valentine'] },
  "Men's Bracelets": { categories: ["Men's Bracelets", 'Men Bracelets'], keywords: ['men bracelet', "men's bracelet"] },
  'Ladies Bracelets': { categories: ['Ladies Bracelets'], keywords: ['ladies bracelet', 'women bracelet'] },
  Jewerly: { categories: ['Jewerly', 'Jewelry', 'Jewelry Products'], keywords: ['necklace', 'earring', 'bracelet', 'pendant', 'jewelry', 'cufflink'] },

  // Men / Women aliases
  'Men Watches': { categories: ['Men Watches', 'Men Watch'], keywords: ['men watch', "men's watch"] },
  'Ladies Watches': { categories: ['Ladies Watches', 'Ladies Watch', 'Women Watches'], keywords: ['ladies watch', 'women watch'] },
  Watches: { categories: ['Watches', 'Men Watches', 'Ladies Watches', 'Couple Watches', 'Smart Watches'], keywords: ['watch'] },

  // Corporate / Trophies
  'For Schools': { categories: ['Schools Awards', 'For Schools', 'School Awards'], keywords: ['school award', 'school trophy'] },
  'Schools Awards': { categories: ['Schools Awards', 'School Awards'], keywords: ['school award', 'school trophy'] },
  Individuals: { categories: ['Individuals Awards', 'Individual Awards'] },
  'Individuals Awards': { categories: ['Individuals Awards', 'Individual Awards'] },
  Companies: { categories: ['Companies Awards', 'Company Awards'] },
  'Companies Awards': { categories: ['Companies Awards', 'Company Awards'] },

  // Cards
  Cards: {
    categories: ['Gift Cards', 'Cards', 'Greeting Cards', 'Card Holder', 'Card Holders'],
    keywords: ['greeting card', 'gift card', 'card holder'],
  },
  'Gift Cards': {
    categories: ['Gift Cards'],
    keywords: ['gift card', 'voucher'],
  },
  'Greeting Cards': {
    keywords: [
      'greeting card',
      'greeting cards',
      'congratulations card',
      'birthday card',
      'valentine card',
      'friends day card',
      'retirement card',
      'thank you card',
      'anniversary card',
      'graduation card',
    ],
  },
  'Card Holders': { categories: ['Card Holder', 'Card Holders'], keywords: ['card holder', 'business card holder'] },
  'Card Holder': { categories: ['Card Holder', 'Card Holders'], keywords: ['card holder', 'business card holder'] },

  // Wholesale
  Wholesale: { categories: ['Wholesale'], keywords: ['wholesale', 'bulk'] },
};

export function normalizeCategory(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function productMatchesTarget(
  product: { name: string; category: string; categories?: string[]; description?: string },
  target: string
): boolean {
  const matcher = SUBCATEGORY_MATCHERS[target];
  const allCats = product.categories?.length ? product.categories : [product.category];
  const searchText = `${product.name} ${product.description || ''}`.toLowerCase();
  const t = normalizeCategory(target);

  // Greeting Cards, physical greeting cards only, not holders/wallets
  if (target === 'Greeting Cards') {
    if (/card holder|business card holder|wallet|credit card slot/i.test(searchText)) return false;
    if (
      /greeting card|congratulations card|birthday card|friends day card|retirement card|valentine.*card|graduation card|thank you card/i.test(
        searchText
      )
    ) {
      return true;
    }
    if (
      allCats.some((c) => normalizeCategory(c).includes('giftcard')) &&
      /card/i.test(product.name) &&
      !/holder|wallet/i.test(product.name)
    ) {
      return true;
    }
    return false;
  }

  // Gift Cards, category match, exclude holders
  if (target === 'Gift Cards') {
    if (/card holder|business card holder/i.test(searchText)) return false;
    return allCats.some((c) => normalizeCategory(c).includes('giftcard'));
  }

  // Direct category match
  const catMatch = allCats.some((c) => {
    const n = normalizeCategory(c);
    return n === t || n.includes(t) || t.includes(n);
  });
  if (catMatch) return true;

  if (matcher?.categories) {
    const aliasMatch = matcher.categories.some((alias) =>
      allCats.some((c) => {
        const n = normalizeCategory(c);
        const a = normalizeCategory(alias);
        return n === a || n.includes(a) || a.includes(n);
      })
    );
    if (aliasMatch) return true;
  }

  if (matcher?.keywords) {
    if (target === 'Personalized Jewelry') {
      const hasPersonalized = /personalized|engraved|custom/i.test(searchText);
      const hasJewelry = /necklace|earring|bracelet|ring|pendant|jewelry|jewellery|cufflink|locket|bangle/i.test(searchText);
      if (hasPersonalized && hasJewelry) return true;
    } else if (target === 'Couple Necklaces') {
      const hasCouple = /couple|his and hers|matching set/i.test(searchText);
      const hasNecklace = /necklace|pendant|jewelry set/i.test(searchText);
      if (hasCouple && hasNecklace) return true;
    } else if (target === 'Gift Cards') {
      // handled above
    } else if (matcher.keywords.some((kw) => searchText.includes(kw.toLowerCase()))) {
      return true;
    }
  }

  // Fallback: product name contains target
  if (normalizeCategory(product.name).includes(t)) return true;

  return false;
}
