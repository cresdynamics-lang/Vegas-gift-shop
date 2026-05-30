export interface SubcategoryGroup {
  title: string;
  items: string[];
}

export interface Category {
  id: string;
  name: string;
  navLabel?: string;
  icon: string;
  subcategories: string[];
  groups?: SubcategoryGroup[];
}

export const categories: Category[] = [
  {
    id: 'men',
    name: 'Men Gifts',
    navLabel: 'Men',
    icon: '',
    subcategories: [
      'Secret Santa', 'Gift for Dad', 'Gift for Boss', 'Romantic Gifts', 'Wedding Gifts',
      'Graduation Gifts', 'Anniversary Gifts', 'Just Because Gifts', "Father's Day Gifts",
      "Valentine's Day Gifts", 'Birthday Gifts For Men',
      'Watches', 'Mugs', 'Keychains', 'Gift Cards', 'Name Tags', '2026 Diaries',
      'Card Holder', 'Thermal Flask', 'Desk Organizers', 'Hip Flask Gift Set',
      'Belts', 'Jewelry', 'Wallets', 'Tie Sets', 'Cufflinks', 'Bracelets',
      'Happy Socks', 'Watch Organizers', 'Tie Clips', 'Maasai Blankets',
      'Loafers', 'Sneakers', 'Perfumes', 'Official Shoes', 'I Love Cosmetics',
    ],
    groups: [
      {
        title: 'Gifts By Occasion',
        items: [
          'Secret Santa', 'Gift for Dad', 'Gift for Boss', 'Romantic Gifts', 'Wedding Gifts',
          'Graduation Gifts', 'Anniversary Gifts', 'Just Because Gifts', "Father's Day Gifts",
          "Valentine's Day Gifts", 'Birthday Gifts For Men',
        ],
      },
      {
        title: 'Most Popular Gifts',
        items: [
          'Watches', 'Mugs', 'Keychains', 'Gift Cards', 'Name Tags', '2026 Diaries',
          'Card Holder', 'Thermal Flask', 'Desk Organizers', 'Hip Flask Gift Set',
        ],
      },
      {
        title: 'Accessories',
        items: [
          'Belts', 'Jewelry', 'Wallets', 'Tie Sets', 'Cufflinks', 'Bracelets',
          'Happy Socks', 'Watch Organizers', 'Tie Clips', 'Maasai Blankets',
        ],
      },
      {
        title: 'Other Gifts',
        items: ['Loafers', 'Sneakers', 'Perfumes', 'Official Shoes', 'I Love Cosmetics'],
      },
    ],
  },
  {
    id: 'women',
    name: 'Women Gifts',
    navLabel: 'Women',
    icon: '',
    subcategories: [
      'Secret Santa', 'Gifts for Boss', 'Gifts For Mom', 'Romantic Gifts', 'Graduation Gifts',
      'Maasai Blankets', 'Anniversary Gifts', 'Just Because Gifts', "Valentine's Day Gifts",
      'Birthday Gifts For Her', 'Jewelry', 'Ladies Watches', 'Ladies Bracelets', 'Clutch Bags',
      "Mother's Day Gifts", 'Ladies Giftsets', 'Hair Straightener', 'I Love Cosmetics',
      'Watch Organizers', 'Perfumes & Fragrances', 'Mugs', 'Keychains', 'Gift Cards',
      'Name Tags', '2026 Diaries', 'Card Holders', 'Thermal Flasks', 'Hip Flask Gift Set',
      'Desk Organizers', 'Loafers',
    ],
    groups: [
      {
        title: 'Gifts By Occasion',
        items: [
          'Secret Santa', 'Gifts for Boss', 'Gifts For Mom', 'Romantic Gifts', 'Graduation Gifts',
          'Maasai Blankets', 'Anniversary Gifts', 'Just Because Gifts', "Valentine's Day Gifts",
          'Birthday Gifts For Her',
        ],
      },
      {
        title: 'Most Popular',
        items: [
          'Jewelry', 'Ladies Watches', 'Ladies Bracelets', 'Clutch Bags', "Mother's Day Gifts",
          'Ladies Giftsets', 'Hair Straightener', 'I Love Cosmetics', 'Watch Organizers',
          'Perfumes & Fragrances',
        ],
      },
      {
        title: 'Everyday Gifts',
        items: [
          'Mugs', 'Keychains', 'Gift Cards', 'Name Tags', '2026 Diaries', 'Card Holders',
          'Thermal Flasks', 'Hip Flask Gift Set', 'Desk Organizers',
        ],
      },
      {
        title: 'Women Shoes',
        items: ['Loafers'],
      },
    ],
  },
  {
    id: 'trophies',
    name: 'Awards & Trophies',
    navLabel: 'Trophies',
    icon: '',
    subcategories: ['Trophies', 'Crystal Items', 'Schools Awards', 'Individuals Awards', 'Companies Awards'],
    groups: [],
  },
  {
    id: 'corporate',
    name: 'Corporate Gifts',
    navLabel: 'Corporate Gifts',
    icon: '',
    subcategories: [
      'Mugs', 'Tumblers', 'Water Bottles', 'Thermal Flasks', 'Maasai Blankets',
      'Gift Sets', 'Notebooks', '2026 Diaries', 'Desk Organizers',
      'Schools Awards', 'Individuals Awards', 'Companies Awards', 'Crystal Desk Organizers',
      'Power Banks', 'Smart Watches',
    ],
    groups: [
      { title: 'Drinkware', items: ['Mugs', 'Tumblers', 'Water Bottles', 'Thermal Flasks'] },
      { title: 'For Ladies', items: ['Maasai Blankets'] },
      { title: 'Stationery Gifts', items: ['Gift Sets', 'Notebooks', '2026 Diaries', 'Desk Organizers'] },
      { title: 'For Men', items: ['Maasai Blankets'] },
      { title: 'Awards & Trophies', items: ['Schools Awards', 'Individuals Awards', 'Companies Awards', 'Crystal Desk Organizers'] },
      { title: 'Tech', items: ['Power Banks', 'Smart Watches'] },
    ],
  },
  {
    id: 'promotional',
    name: 'Promotional Gifts',
    navLabel: 'Promotional',
    icon: '',
    subcategories: [
      'Watches', 'Keychain', 'Tie Sets', 'Name Tags', 'Leather Belts', 'Leather Wallets',
      'Pens', 'Notebooks', '2026 Diaries', 'Mugs', 'Water Bottles', 'Thermal Flask',
      'Desk Organizers', 'Awards and Trophies',
    ],
    groups: [
      { title: 'Gifts', items: ['Watches', 'Keychain', 'Tie Sets', 'Name Tags', 'Leather Belts', 'Leather Wallets'] },
      { title: 'Stationery', items: ['Pens', 'Notebooks', '2026 Diaries'] },
      { title: 'Drinkware', items: ['Mugs', 'Water Bottles', 'Thermal Flask'] },
      { title: 'Crystal Products', items: ['Desk Organizers', 'Awards and Trophies'] },
    ],
  },
  {
    id: 'personalized',
    name: 'Personalized Gifts',
    navLabel: 'Personalized',
    icon: '',
    subcategories: [
      'Belts', 'Pens', 'Wallets', 'Keychains', 'Notebooks', 'Name Tags', '2026 Diaries',
      'Thermal Flask', 'Thermal Mugs', 'Watch Organizer', 'Mugs', 'Crystal Items',
    ],
    groups: [
      {
        title: 'Engraving',
        items: ['Belts', 'Pens', 'Wallets', 'Keychains', 'Notebooks', 'Name Tags', '2026 Diaries', 'Thermal Flask', 'Thermal Mugs', 'Watch Organizer'],
      },
      { title: 'UV Printing', items: ['Mugs', 'Keychain', 'Name Tags', 'Crystal Items', 'Leather Belts', 'Leather Wallets'] },
      { title: 'Digital Printing', items: ['Mugs', 'Keychain', 'Name Tags', 'Crystal Items', '2026 Diaries'] },
      { title: 'Sublimation', items: ['Mugs', 'Water Bottles'] },
    ],
  },
  {
    id: 'wholesale',
    name: 'Wholesale',
    navLabel: 'Wholesale',
    icon: '',
    subcategories: [],
    groups: [],
  },
  {
    id: 'cards',
    name: 'Cards',
    navLabel: 'Cards',
    icon: '',
    subcategories: ['Gift Cards', 'Greeting Cards', 'Card Holder', 'Card Holders'],
    groups: [
      { title: 'Cards', items: ['Greeting Cards', 'Gift Cards'] },
      { title: 'Accessories', items: ['Card Holder', 'Card Holders'] },
    ],
  },
  {
    id: 'watches',
    name: 'Watches Gifts',
    navLabel: 'Watches',
    icon: '',
    subcategories: [
      'All Watches', 'Smart Watches', 'Gift Sets', 'Couple Watches', 'Kids Watches',
      'Curren', 'Olevs', 'Crrju', 'Chenxi', 'Poedagar', 'Lige', 'Naviforce', 'Skmei', 'Wwoor',
      'Automatic Watches', 'Jesou Collection', 'Forsining', 'Fngreen', 'Sanda',
    ],
    groups: [
      { title: 'Ladies', items: ['All Watches', 'Smart Watches', 'Gift Sets'] },
      { title: 'Couple Watches', items: ['Couple Watches'] },
      { title: 'Kids Watches', items: ['Kids Watches'] },
      { title: 'Ladies By Brand', items: ['Curren', 'Olevs', 'Crrju', 'Chenxi', 'Poedagar', 'Lige', 'Naviforce', 'Skmei', 'Wwoor'] },
      { title: 'Gentlemen', items: ['All Watches', 'Smart Watches', 'Automatic Watches', 'Jesou Collection'] },
      { title: 'Men By Brand', items: ['Curren', 'Olevs', 'Crrju', 'Chenxi', 'Poedagar', 'Skmei', 'Lige', 'Naviforce', 'Forsining', 'Fngreen', 'Sanda', 'Wwoor'] },
    ],
  },
  {
    id: 'gifts-below-1000',
    name: 'Gifts below 1000',
    navLabel: 'Gifts below 1000',
    icon: '',
    subcategories: [],
    groups: [],
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    navLabel: 'Jewelry',
    icon: '',
    subcategories: [
      'Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Cufflinks',
      'Matching Set', 'Couple Necklaces', 'Pendant Necklaces', 'Personalized Jewelry',
      'Jewerly', 'Romantic Gifts', "Men's Bracelets", 'Ladies Bracelets',
    ],
    groups: [
      { title: 'Most Popular Gifts', items: ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Cufflinks'] },
      {
        title: 'Romantic Gifts',
        items: ['Matching Set', 'Couple Necklaces', 'Pendant Necklaces', 'Personalized Jewelry', "Valentine's Day Gifts"],
      },
      {
        title: 'By Type',
        items: ["Men's Bracelets", 'Ladies Bracelets', 'Romantic Gifts'],
      },
    ],
  },
];
