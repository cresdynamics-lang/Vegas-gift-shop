export interface ShippingZone {
  id: string;
  zone: string;
  rate: number;
  time: string;
  enabled: boolean;
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
}

export const DEFAULT_SETTINGS: StoreSettings = {
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
};
