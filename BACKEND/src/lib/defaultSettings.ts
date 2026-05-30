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
};

export type SettingsData = typeof DEFAULT_SETTINGS;

export function mergeSettings(stored: Partial<SettingsData> | null): SettingsData {
  if (!stored) return DEFAULT_SETTINGS;
  return {
    general: { ...DEFAULT_SETTINGS.general, ...(stored.general as object) },
    payments: { ...DEFAULT_SETTINGS.payments, ...(stored.payments as object) },
    shipping: {
      ...DEFAULT_SETTINGS.shipping,
      ...(stored.shipping as object),
      zones: (stored.shipping as any)?.zones ?? DEFAULT_SETTINGS.shipping.zones,
    },
    branding: { ...DEFAULT_SETTINGS.branding, ...(stored.branding as object) },
    notifications: { ...DEFAULT_SETTINGS.notifications, ...(stored.notifications as object) },
  };
}
