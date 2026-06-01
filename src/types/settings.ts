export interface ShippingZone {
  id: string;
  zone: string;
  rate: number;
  time: string;
  enabled: boolean;
}

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  source?: 'google';
}

export interface GoogleReviewsSettings {
  enabled: boolean;
  mapsUrl: string;
  placeName: string;
  aggregateRating: number;
  totalReviews: number;
  reviews: GoogleReview[];
}

export interface StoreSettings {
  general: {
    storeName: string;
    supportEmail: string;
    phone: string;
    phoneSecondary: string;
    currency: string;
    address: string;
    tagline: string;
  };
  payments: {
    mpesaEnabled: boolean;
    mpesaPaybill: string;
    mpesaTill: string;
    cardEnabled: boolean;
    codEnabled: boolean;
  };
  shipping: {
    freeShippingThreshold: number;
    zones: ShippingZone[];
  };
  branding: {
    primaryColor: string;
    accentColor: string;
    goldColor: string;
    logoUrl: string;
    topBarMessage: string;
    topBarSubMessage: string;
  };
  notifications: {
    orderEmailEnabled: boolean;
    lowStockEmailEnabled: boolean;
    adminNotificationEmail: string;
    smsEnabled: boolean;
    smsPhone: string;
  };
  googleReviews: GoogleReviewsSettings;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  general: {
    storeName: 'Vegas Gift Shop',
    supportEmail: 'support@vegasgifts.co.ke',
    phone: '+254792 943753',
    phoneSecondary: '+254711667733',
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
        source: 'google',
      },
      {
        id: 'g2',
        author: 'James K.',
        rating: 5,
        text: 'Ordered via WhatsApp, super helpful team. My wife loved the personalized necklace.',
        date: '2026-03-18',
        source: 'google',
      },
      {
        id: 'g3',
        author: 'Faith W.',
        rating: 5,
        text: 'Great variety for men and women gifts. Packaging felt premium. Will shop again.',
        date: '2026-03-05',
        source: 'google',
      },
      {
        id: 'g4',
        author: 'Brian O.',
        rating: 4,
        text: 'Solid experience. Same-day delivery worked for my anniversary gift in Westlands.',
        date: '2026-02-22',
        source: 'google',
      },
      {
        id: 'g5',
        author: 'Diana A.',
        rating: 5,
        text: 'Best gift shop in CBD for trophies and crystal awards. Professional and on time.',
        date: '2026-02-10',
        source: 'google',
      },
      {
        id: 'g6',
        author: 'Michael T.',
        rating: 5,
        text: 'Corporate gift boxes for our team event were stunning. Quick WhatsApp support and delivery to Kilimani.',
        date: '2026-01-28',
        source: 'google',
      },
      {
        id: 'g7',
        author: 'Lucy N.',
        rating: 5,
        text: 'Found the perfect anniversary watch. Gift wrap was elegant, my husband was thrilled.',
        date: '2026-01-15',
        source: 'google',
      },
    ],
  },
};
