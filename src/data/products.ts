export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  description: string;
  features?: string[];
};

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export const categories: Category[] = [
  {
    id: 'men-gifts',
    name: 'Men Gifts',
    icon: '👨',
    subcategories: ['Belts', 'Men Watches', 'Anniversary Gifts', 'Desk Organizers', 'Father’s Day Gifts', 'Birthday Gifts For Men', 'Gift Cards', 'Gift for Dad', 'Gift for Boss', 'Leather Belts', 'Happy Socks', 'Graduation Gifts', 'Name Tags', 'Secret Santa', 'Romantic Gifts', 'Men’s Bracelets', 'Hip Flask Gift Set', 'Just Because Gifts', 'Jewelry', 'Wedding Gifts', 'Maasai Blankets', 'Valentine’s Day Gifts', 'Personalized Gift Items']
  },
  {
    id: 'women-gifts',
    name: 'Women Gifts',
    icon: '👩',
    subcategories: ['Gift Cards', 'Card Holders', 'Gifts for Boss', 'Maasai Blankets', 'Anniversary Gifts', 'Birthday Gifts For Her', 'Gifts For Mom', 'Graduation Gifts', 'I Love Cosmetics', 'Hip Flask Gift Set', 'Just Because Gifts', 'Personalized Gift Items', 'Name Tags', 'Secret Santa', 'Leather Belts', 'Romantic Gifts', 'Ladies Giftsets', 'Mother’s Day Gifts', 'Jewelry', 'Ladies Watches', 'Ladies Bracelets', 'Watch Organizers', 'Valentine’s Day Gifts']
  },
  {
    id: 'corporate-gifts',
    name: 'Corporate Gifts',
    icon: '💼',
    subcategories: ['Awards & Trophies Gifts', 'Drinkware', 'Stationery Gifts', 'Tech Gifts', 'Promotional Gifts']
  },
  {
    id: 'awards-trophies',
    name: 'Awards & Trophies',
    icon: '🏆',
    subcategories: ['Trophies', 'Crystal Items', 'Schools Awards', 'Individuals Awards', 'Companies Awards']
  },
  {
    id: 'drinkware',
    name: 'Drinkware',
    icon: '☕',
    subcategories: ['Tumblers', 'Mugs', 'Thermal Flask', 'Water Bottles']
  },
  {
    id: 'stationery',
    name: 'Stationery Gifts',
    icon: '📝',
    subcategories: ['Notebooks', 'Card Holder', '2026 Diaries', 'Power Banks', 'Desk Organizers', 'Keychains', 'Promotional Gifts', 'Promotional Pens', 'Watch Organizer']
  },
  {
    id: 'tech-gifts',
    name: 'Tech Gifts',
    icon: '📱',
    subcategories: ['Power Banks', 'Promotional Tech Gifts', 'Multi Charging Cable Sets']
  },
  {
    id: 'personalized-gifts',
    name: 'Personalized Gifts',
    icon: '✨',
    subcategories: ['Custom Engraving', 'Photo Gifts', 'Name Gifts']
  },
  {
    id: 'watches',
    name: 'Watches Gifts',
    icon: '⌚',
    subcategories: ['Men Watches', 'Ladies Watches', 'Smartwatches']
  }
];

export const products: Product[] = [
  // Awards & Trophies
  {
    id: 'golden-prestige-velvet-plaque',
    name: 'Golden Prestige Velvet Award Plaque',
    price: 4500,
    oldPrice: 5500,
    rating: 5,
    reviews: 24,
    image: '/src/assets/hero.png',
    category: 'Awards & Trophies',
    isSale: true,
    description: 'A premium velvet-lined award plaque for high-level recognition and corporate prestige.'
  },
  {
    id: 'custom-crystal-award-black-base',
    name: 'Custom Crystal Award on Black Base',
    price: 3800,
    rating: 5,
    reviews: 18,
    image: '/src/assets/gifts for men 1.jpg',
    category: 'Awards & Trophies',
    description: 'Elegant custom crystal award with a deep black base for a modern, sophisticated look.'
  },
  {
    id: 'crystal-star-appreciation-trophy',
    name: 'Crystal Star Appreciation Trophy',
    price: 4200,
    rating: 5,
    reviews: 15,
    image: '/src/assets/hero.png',
    category: 'Awards & Trophies',
    isNew: true,
    description: 'A stunning crystal star trophy designed to show deep appreciation for outstanding achievements.'
  },
  {
    id: 'crystal-office-desk-organizer',
    name: 'Crystal Office Desk Organizer',
    price: 3500,
    rating: 4,
    reviews: 12,
    image: '/src/assets/hero.png',
    category: 'Awards & Trophies',
    description: 'A sophisticated crystal desk organizer that doubles as a prestigious office accessory.'
  },
  {
    id: 'elegant-golden-base-crystal-trophy',
    name: 'Elegant Golden Base Crystal Trophy',
    price: 4800,
    rating: 5,
    reviews: 9,
    image: '/src/assets/hero.png',
    category: 'Awards & Trophies',
    description: 'High-end crystal trophy featuring a solid golden base for maximum impact.'
  },
  // Drinkware
  {
    id: 'personalized-stainless-travel-mug',
    name: 'Personalized Stainless Steel Travel Mug',
    price: 2500,
    rating: 5,
    reviews: 42,
    image: '/src/assets/mug gift 1.jpg',
    category: 'Drinkware',
    isNew: true,
    description: 'Durable stainless steel travel mug with custom engraving options for everyday use.'
  },
  {
    id: 'smart-led-temperature-flask',
    name: 'Smart LED Temperature Display Thermal Flask',
    price: 1800,
    oldPrice: 2200,
    rating: 4,
    reviews: 56,
    image: '/src/assets/mug gift 2.jpg',
    category: 'Drinkware',
    isSale: true,
    description: 'Modern thermal flask featuring an LED display that shows the internal temperature of your beverage.'
  },
  {
    id: '500ml-travel-thermal-bottle',
    name: '500ml Travel Thermal Bottle',
    price: 1500,
    rating: 4,
    reviews: 31,
    image: '/src/assets/mug gift 2.jpg',
    category: 'Drinkware',
    description: 'Sleek 500ml thermal bottle for maintaining your drink temperature on the move.'
  },
  {
    id: 'corporate-sip-signature-mug',
    name: 'Corporate Sip Signature Mug',
    price: 1200,
    rating: 5,
    reviews: 44,
    image: '/src/assets/mug gift 1.jpg',
    category: 'Drinkware',
    description: 'A classic signature mug designed for corporate gifting and daily office use.'
  },
  {
    id: 'personalized-pink-stanley-tumbler',
    name: 'Personalized Pink Stanley-Inspired Tumbler',
    price: 3500,
    rating: 5,
    reviews: 89,
    image: '/src/assets/mug gift 1.jpg',
    category: 'Drinkware',
    description: 'A trendy, high-capacity tumbler inspired by classic designs, personalized with your name.'
  },
  // Stationery
  {
    id: 'executive-wooden-diary-2026',
    name: 'Executive Wooden Style Diary 2026',
    price: 3200,
    rating: 5,
    reviews: 34,
    image: '/src/assets/scented candles 1.jpg',
    category: 'Stationery Gifts',
    isNew: true,
    description: 'A luxurious 2026 diary with a unique wooden-style cover, perfect for executive planning.'
  },
  {
    id: 'corporate-prestige-2026-diary',
    name: 'Corporate Prestige 2026 Diary',
    price: 2500,
    rating: 5,
    reviews: 67,
    image: '/src/assets/scented candles 1.jpg',
    category: 'Stationery Gifts',
    description: 'A professional 2026 diary designed for the modern executive.'
  },
  {
    id: 'bamboo-eco-engraved-pen',
    name: 'Bamboo Eco Engraved Ballpoint Pen',
    price: 850,
    rating: 4,
    reviews: 88,
    image: '/src/assets/scented candles 2.jpg',
    category: 'Stationery Gifts',
    description: 'Eco-friendly bamboo pen with custom engraving, combining sustainability and style.'
  },
  {
    id: 'personalized-a5-leather-notebook',
    name: 'Personalized A5 Leather Notebook Organizer',
    price: 2800,
    rating: 4,
    reviews: 27,
    image: '/src/assets/scented candles 2.jpg',
    category: 'Stationery Gifts',
    description: 'High-quality leather notebook organizer with pockets for cards and pens.'
  },
  // Tech
  {
    id: 'smart-10000mah-powerbank',
    name: 'Smart 10000mAh Portable Power Bank',
    price: 3500,
    rating: 5,
    reviews: 112,
    image: '/src/assets/perfume gift.jpg',
    category: 'Tech Gifts',
    isNew: true,
    description: 'Slim and powerful 10000mAh power bank for keeping your devices charged on the go.'
  },
  // Watches
  {
    id: 'crrju-men-business-watch',
    name: 'CRRJU Men’s Business Stainless Steel Wrist Watch',
    price: 6500,
    oldPrice: 8500,
    rating: 5,
    reviews: 45,
    image: '/src/assets/gifts fior men 3.jpg',
    category: 'Watches Gifts',
    isSale: true,
    description: 'Classic business watch for men with a stainless steel band and minimalist design.'
  },
  {
    id: 'luxury-ladies-jewelry-watch-set',
    name: 'Luxury Ladies Jewelry & Watch Gift Set',
    price: 9500,
    rating: 5,
    reviews: 38,
    image: '/src/assets/gifts for women 6.jpg',
    category: 'Watches Gifts',
    isNew: true,
    description: 'An exquisite gift set featuring a luxury watch paired with matching fine jewelry.'
  },
  // Personalized
  {
    id: 'personalized-maasai-fleece-blanket',
    name: 'Personalized Maasai Fleece Blanket',
    price: 3800,
    rating: 5,
    reviews: 92,
    image: '/src/assets/hero.png',
    category: 'Personalized Gifts',
    isNew: true,
    description: 'Traditional Maasai blanket with a warm fleece lining, personalized with custom embroidery.'
  },
  {
    id: 'personalized-calendar-date-keychain',
    name: 'Personalized Calendar Date Keychain',
    price: 1200,
    rating: 5,
    reviews: 143,
    image: '/src/assets/gifts for women 4.jpg',
    category: 'Personalized Gifts',
    description: 'Mark your most special date with this elegant personalized calendar keychain.'
  },
  // Romantic
  {
    id: 'luxury-romantic-pampering-box',
    name: 'Luxury Romantic Self-Care & Pampering Box for Her',
    price: 7500,
    rating: 5,
    reviews: 29,
    image: '/src/assets/gifts for women 5.jpg',
    category: 'Romantic & Valentine Gifts',
    isNew: true,
    description: 'A curated gift box containing luxury self-care items, perfect for romantic occasions.'
  },
  {
    id: 'romantic-red-teddy-bear',
    name: 'Romantic Red Plush Soft Teddy Bear with Heart',
    price: 2500,
    rating: 5,
    reviews: 64,
    image: '/src/assets/teddy bear gift.jpg',
    category: 'Romantic & Valentine Gifts',
    description: 'A soft, cuddly red teddy bear holding a heart, the perfect messenger for your love.'
  },
  {
    id: 'cream-romantic-teddy-bear',
    name: 'Cream Romantic Teddy Bear',
    price: 2200,
    rating: 4,
    reviews: 35,
    image: '/src/assets/teddy bear gift 2.png',
    category: 'Romantic & Valentine Gifts',
    description: 'A classic cream-colored teddy bear, soft to the touch and perfect for gifting.'
  },
  // Bags & Accessories
  {
    id: 'men-reversible-leather-belt',
    name: 'Men’s Reversible Genuine Leather Belt',
    price: 2200,
    rating: 4,
    reviews: 52,
    image: '/src/assets/gifts fom men 2.jpg',
    category: 'Bags & Accessories',
    description: 'Versatile reversible leather belt, black on one side and brown on the other.'
  },
  {
    id: 'personalized-jute-tote-bag',
    name: 'Personalized Jute Tote Bag',
    price: 1500,
    rating: 5,
    reviews: 73,
    image: '/src/assets/gifts for women 1.jpg',
    category: 'Bags & Accessories',
    description: 'Eco-friendly jute tote bag with custom name embroidery, perfect for daily use.'
  },
  // Jewelry
  {
    id: 'personalized-stainless-gold-bracelet',
    name: 'Personalized Stainless Steel Gold Bracelet',
    price: 3200,
    rating: 5,
    reviews: 41,
    image: '/src/assets/gifts for women 3.jpg',
    category: 'Jewelry Products',
    description: 'A sleek stainless steel bracelet with a gold finish, personalizable with an engraving.'
  },
  // Footwear
  {
    id: 'men-classic-tassel-loafers',
    name: 'Men’s Classic Brown Tassel Slip-On Loafers',
    price: 5800,
    rating: 5,
    reviews: 19,
    image: '/src/assets/gifts for men 1.jpg',
    category: 'Footwear Products',
    description: 'Sophisticated brown tassel loafers for the modern gentleman, combining comfort and style.'
  },
  {
    id: 'lightweight-breathable-espadrilles',
    name: 'Lightweight Breathable Espadrilles Slip-On Shoes',
    price: 3500,
    rating: 4,
    reviews: 22,
    image: '/src/assets/hero.png',
    category: 'Footwear Products',
    description: 'Comfortable and stylish espadrilles, perfect for casual luxury outings.'
  },
  // Men's Gift Sets
  {
    id: 'luxury-brown-all-in-one-set',
    name: 'Luxury Brown All-in-One Men’s Gift Set',
    price: 8500,
    rating: 5,
    reviews: 21,
    image: '/src/assets/gifts for men 1.jpg',
    category: 'Men’s Gift Sets',
    isNew: true,
    description: 'A comprehensive luxury gift set for men, featuring curated accessories in a premium brown finish.'
  },
  {
    id: 'chess-whisky-flask-hamper',
    name: 'Chess & Whisky Flask Hamper',
    price: 12500,
    rating: 5,
    reviews: 14,
    image: '/src/assets/gifts fior men 3.jpg',
    category: 'Men’s Gift Sets',
    description: 'The ultimate gentleman\'s hamper, combining the classic game of chess with a premium whisky flask.'
  },
  {
    id: 'personalized-mini-book-pendant',
    name: 'Personalized Mini Book Pendant Necklace – 6 Page Love Message Locket',
    price: 4500,
    rating: 5,
    reviews: 28,
    image: '/src/assets/gifts for women 6.jpg',
    category: 'Personalized Gifts',
    isNew: true,
    description: 'A unique 6-page love message locket in the shape of a mini book, perfect for intimate gifting.'
  },
  {
    id: 'personalized-engraved-bracelet',
    name: 'Personalized Engraved Silicone & Stainless Steel Bracelet',
    price: 2800,
    rating: 4,
    reviews: 56,
    image: '/src/assets/gifts fior men 3.jpg',
    category: 'Personalized Gifts',
    description: 'A durable and stylish silicone bracelet with a stainless steel plate for custom engraving.'
  },
  {
    id: 'luxury-ladies-watch-jewelry-gift-set',
    name: 'Luxury Ladies Watch & Jewelry Gift Set',
    price: 8800,
    rating: 5,
    reviews: 42,
    image: '/src/assets/gifts for women 5.jpg',
    category: 'Women Gifts',
    isNew: true,
    description: 'A premium gift set for her, featuring a sophisticated watch and matching jewelry pieces.'
  },
  {
    id: 'maasai-blanket-premium',
    name: 'Premium Maasai Fleece Blanket',
    price: 3500,
    rating: 5,
    reviews: 110,
    image: '/src/assets/hero.png',
    category: 'Men Gifts',
    description: 'The iconic Maasai blanket, upgraded with a luxury fleece lining for ultimate warmth.'
  },
  {
    id: 'hip-flask-gift-set-luxury',
    name: 'Luxury Hip Flask Gift Set',
    price: 4200,
    rating: 5,
    reviews: 33,
    image: '/src/assets/mug gift 2.jpg',
    category: 'Men Gifts',
    description: 'A sophisticated hip flask set, perfect for the modern gentleman who appreciates fine details.'
  }
];
