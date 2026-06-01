export const DEFAULT_SETTINGS = {
  general: {
    storeName: 'Vegas Gift Shop',
    supportEmail: 'support@vegasgifts.co.ke',
    phone: '+254792 943753',
    currency: 'KES',
    address: 'Nairobi Luxury District, CBD, Kenya',
    tagline: 'Luxury Gift Boutique',
  },
  payments: {
    mpesaEnabled: true,
    mpesaPaybill: '',
    mpesaTill: '',
    cardEnabled: true,
    codEnabled: true,
  },
  shipping: {
    freeShippingThreshold: 10000,
    zones: [
      { id: 'nairobi', zone: 'Nairobi Express', rate: 500, time: 'Same Day', enabled: true },
      { id: 'kenya', zone: 'Rest of Kenya', rate: 1000, time: '1-3 Days', enabled: true },
      { id: 'international', zone: 'International', rate: 5000, time: '7-14 Days', enabled: false },
    ],
  },
  branding: {
    primaryColor: '#000000',
    accentColor: '#dc2626',
    goldColor: '#C9924A',
    logoUrl: '',
    topBarMessage: 'Call us on: +254 740 282041 to place your order.',
    topBarSubMessage: 'Same day delivery in Nairobi.',
  },
  notifications: {
    orderEmailEnabled: true,
    lowStockEmailEnabled: true,
    adminNotificationEmail: 'admin@vegasgifts.co.ke',
    smsEnabled: false,
    smsPhone: '',
  },
  googleReviews: {
    enabled: true,
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vegas+Gift+Shop+Nairobi',
    placeName: 'Vegas Gift Shop',
    aggregateRating: 4.8,
    totalReviews: 127,
    reviews: [
      {
        id: 'g1',
        author: 'Grace M.',
        rating: 5,
        text: 'Beautiful gifts and fast delivery in Nairobi. The engraving on our corporate awards was perfect.',
        date: '2026-04-01',
      },
      {
        id: 'g2',
        author: 'James K.',
        rating: 5,
        text: 'Ordered via WhatsApp. Super helpful team. My wife loved the personalized necklace.',
        date: '2026-03-18',
      },
      {
        id: 'g3',
        author: 'Faith W.',
        rating: 5,
        text: 'Great variety for men and women gifts. Packaging felt premium. Will shop again.',
        date: '2026-03-05',
      },
      {
        id: 'g4',
        author: 'Brian O.',
        rating: 4,
        text: 'Solid experience. Same-day delivery worked for my anniversary gift in Westlands.',
        date: '2026-02-22',
      },
      {
        id: 'g5',
        author: 'Diana A.',
        rating: 5,
        text: 'Best gift shop in CBD for trophies and crystal awards. Professional and on time.',
        date: '2026-02-10',
      },
      {
        id: 'g6',
        author: 'Michael T.',
        rating: 5,
        text: 'Corporate gift boxes for our team event were stunning. Quick WhatsApp support and delivery to Kilimani.',
        date: '2026-01-28',
      },
      {
        id: 'g7',
        author: 'Lucy N.',
        rating: 5,
        text: 'Found the perfect anniversary watch. Gift wrap was elegant. My husband was thrilled.',
        date: '2026-01-15',
      },
    ],
  },
};

export type SettingsData = typeof DEFAULT_SETTINGS;
export type GoogleReviewEntry = SettingsData['googleReviews']['reviews'][number];

export type StoredSettings = {
  general?: Partial<SettingsData['general']>;
  payments?: Partial<SettingsData['payments']>;
  shipping?: Partial<SettingsData['shipping']>;
  branding?: Partial<SettingsData['branding']>;
  notifications?: Partial<SettingsData['notifications']>;
  googleReviews?: Partial<SettingsData['googleReviews']> & {
    reviews?: GoogleReviewEntry[];
  };
};

function isGoogleReviewEntry(value: unknown): value is GoogleReviewEntry {
  if (!value || typeof value !== 'object') return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.author === 'string' &&
    typeof r.rating === 'number' &&
    typeof r.text === 'string' &&
    typeof r.date === 'string'
  );
}

export function mergeSettings(stored: StoredSettings | null): SettingsData {
  if (!stored) return DEFAULT_SETTINGS;

  const storedReviews = stored.googleReviews?.reviews;
  const reviews = Array.isArray(storedReviews)
    ? storedReviews.filter(isGoogleReviewEntry)
    : DEFAULT_SETTINGS.googleReviews.reviews;

  return {
    general: { ...DEFAULT_SETTINGS.general, ...stored.general },
    payments: { ...DEFAULT_SETTINGS.payments, ...stored.payments },
    shipping: {
      ...DEFAULT_SETTINGS.shipping,
      ...stored.shipping,
      zones: stored.shipping?.zones ?? DEFAULT_SETTINGS.shipping.zones,
    },
    branding: { ...DEFAULT_SETTINGS.branding, ...stored.branding },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...stored.notifications },
    googleReviews: {
      ...DEFAULT_SETTINGS.googleReviews,
      ...stored.googleReviews,
      reviews,
    },
  };
}
