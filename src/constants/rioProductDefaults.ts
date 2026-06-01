/** Rio Gift Shop–style defaults for product pages */

export const RIO_DELIVERY_BULLETS = [
  'Fast delivery',
  'Secure payments',
  'We Deliver Country wide',
] as const;

export type CustomizationFieldId =
  | 'giftWrapping'
  | 'giftCard'
  | 'engraving'
  | 'cardInstructions'
  | 'brandingInstructions';

export const RIO_CUSTOMIZATION_FIELDS = [
  { id: 'giftWrapping' as const, label: 'Gift Wrapping Required', type: 'checkbox' as const },
  { id: 'giftCard' as const, label: 'Want a Card? (birthday card, etc.)', type: 'checkbox' as const },
  { id: 'engraving' as const, label: 'Engraving / Branding required', type: 'checkbox' as const },
  {
    id: 'cardInstructions' as const,
    label: 'Card Instructions',
    type: 'textarea' as const,
    showWhen: 'giftCard' as const,
  },
  {
    id: 'brandingInstructions' as const,
    label: 'Branding Special Instructions',
    type: 'textarea' as const,
    showWhen: 'engraving' as const,
  },
];

export const DEFAULT_WHATSAPP = '254711667733';
export const DEFAULT_ORDER_PHONE = '+254 740 282041';
