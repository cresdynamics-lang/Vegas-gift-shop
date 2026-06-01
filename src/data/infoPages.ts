export type InfoSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type InfoPageContent = {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  sections: InfoSection[];
};

export const INFO_PAGES: Record<string, InfoPageContent> = {
  about: {
    title: 'About Us',
    subtitle: 'Premium gifts, personalization, and reliable delivery across Kenya.',
    lastUpdated: 'May 2026',
    sections: [
      {
        paragraphs: [
          'Vegas Gift Shop is a Nairobi-based online gift boutique helping individuals and businesses celebrate life’s moments with thoughtful, high-quality presents. From personalized jewelry and corporate awards to romantic keepsakes and everyday treasures, we curate gifts that feel special before they are even opened.',
          'We combine a wide product catalog with engraving, branding, gift wrapping, and fast delivery options so you can shop confidently, whether you are ordering for a birthday in Westlands, a company milestone, or a last-minute surprise across Kenya.',
        ],
      },
      {
        heading: 'What we offer',
        list: [
          'Personalized gifts (names, messages, logos, and custom packaging)',
          'Corporate gifting, trophies, and branded merchandise',
          'Jewelry, watches, drinkware, awards, and seasonal collections',
          'Same-day and express delivery within Nairobi (where available)',
          'Secure checkout via M-Pesa, card, and other supported methods',
          'Friendly support by phone, email, and WhatsApp',
        ],
      },
      {
        heading: 'Our promise',
        paragraphs: [
          'We focus on quality products, clear communication, and dependable fulfillment. Every order is handled with care, from customization details to how your gift is packed and delivered.',
          'Thank you for choosing Vegas Gift Shop. We are honoured to be part of your celebrations.',
        ],
      },
    ],
  },

  shipping: {
    title: 'Shipping & Delivery',
    subtitle: 'How we deliver your gifts across Nairobi and Kenya.',
    lastUpdated: 'May 2026',
    sections: [
      {
        paragraphs: [
          'We work to get your order to you, or directly to your recipient, as quickly and safely as possible. Delivery times and fees depend on your location, order size, and product type (especially customized items).',
        ],
      },
      {
        heading: 'Delivery areas',
        list: [
          'Nairobi & environs, same-day or next-day delivery on eligible orders (subject to cut-off times)',
          'Major towns in Kenya, typically 1–3 business days via courier',
          'Remote areas, may require additional time; our team will confirm before dispatch',
          'International shipping, available on select items; contact us for a quote',
        ],
      },
      {
        heading: 'Delivery fees',
        paragraphs: [
          'Shipping costs are shown at checkout based on your selected zone. Free or discounted delivery may apply when your order meets the minimum spend shown on the site or during promotions.',
          'Standard reference rates (subject to change):',
        ],
        list: [
          'Nairobi Express, from KSh 500 (same-day where available)',
          'Rest of Kenya, from KSh 1,000 (1–3 business days)',
          'International, quoted per order',
        ],
      },
      {
        heading: 'Custom & engraved items',
        paragraphs: [
          'Personalized products require production time before shipping. Please allow extra business days for engraving, branding, or made-to-order gifts. We will confirm timelines when you order or via WhatsApp if details need clarification.',
        ],
      },
      {
        heading: 'Order tracking & delivery issues',
        paragraphs: [
          'After dispatch, you may receive updates by SMS or WhatsApp. If your package is delayed, damaged, or incomplete, contact us within 48 hours of delivery with your order number and photos where applicable.',
        ],
      },
    ],
  },

  returns: {
    title: 'Returns & Refunds',
    subtitle: 'Our policy for returns, exchanges, and refunds.',
    lastUpdated: 'May 2026',
    sections: [
      {
        paragraphs: [
          'We want you to be happy with your purchase. If something is not right, contact us as soon as possible so we can help.',
        ],
      },
      {
        heading: 'Eligible returns',
        list: [
          'Non-personalized items in original, unused condition with tags and packaging',
          'Defective or damaged items reported within 48 hours of delivery',
          'Wrong item sent (we will arrange replacement or refund)',
        ],
      },
      {
        heading: 'Non-returnable items',
        list: [
          'Personalized, engraved, or custom-made products (unless defective or our error)',
          'Perishable goods, gift cards, or digital products',
          'Items marked final sale or clearance (where stated on the product page)',
          'Products that show signs of use, damage caused after delivery, or missing parts',
        ],
      },
      {
        heading: 'How to request a return',
        paragraphs: [
          'Email support@vegasgifts.co.ke or message us on WhatsApp with your order number, reason for return, and photos if relevant. We will provide return instructions and whether return shipping applies.',
          'Unauthorized returns (sent without approval) may not be accepted.',
        ],
      },
      {
        heading: 'Refunds & exchanges',
        paragraphs: [
          'Approved refunds are processed to your original payment method (M-Pesa, card, etc.) within 5–10 business days after we receive and inspect the item. Exchange requests are subject to stock availability.',
          'Original delivery fees are non-refundable unless the return is due to our mistake or a defective product.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we collect, use, and protect your information.',
    lastUpdated: 'May 2026',
    sections: [
      {
        paragraphs: [
          'Vegas Gift Shop (“we”, “us”) respects your privacy. This policy explains what data we collect when you use our website, place orders, or contact us, and how we use it.',
        ],
      },
      {
        heading: 'Information we collect',
        list: [
          'Contact details: name, phone number, email address, delivery address',
          'Order information: products purchased, customization text, payment method (we do not store full card numbers on our servers)',
          'Account data: if you register, login credentials and profile preferences',
          'Communications: messages sent via email, WhatsApp, or contact forms',
          'Technical data: IP address, browser type, and cookies used to improve the site',
        ],
      },
      {
        heading: 'How we use your information',
        list: [
          'Process and deliver orders, including sharing delivery details with couriers',
          'Provide customer support and order updates',
          'Improve our website, products, and services',
          'Send marketing communications only where you have agreed (you may opt out anytime)',
          'Comply with legal obligations and prevent fraud',
        ],
      },
      {
        heading: 'Sharing your data',
        paragraphs: [
          'We do not sell your personal data. We may share information with trusted service providers (payment processors, delivery partners, hosting providers) only as needed to operate our business, under confidentiality obligations.',
        ],
      },
      {
        heading: 'Data security & retention',
        paragraphs: [
          'We use reasonable technical and organisational measures to protect your data. No online system is 100% secure; please use strong passwords for your account.',
          'We retain order and account records as required for accounting, legal, and customer-service purposes, then delete or anonymise data when no longer needed.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You may request access, correction, or deletion of your personal data by contacting support@vegasgifts.co.ke. We will respond within a reasonable time as allowed by applicable law.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Our site may use cookies to remember preferences and analyse traffic. You can control cookies through your browser settings; disabling cookies may affect some site features.',
        ],
      },
      {
        heading: 'Updates',
        paragraphs: [
          'We may update this policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the site after changes means you accept the revised policy.',
        ],
      },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Terms governing use of our website and purchases.',
    lastUpdated: 'May 2026',
    sections: [
      {
        paragraphs: [
          'By accessing vegasgiftshop.co.ke (or related domains) and placing an order, you agree to these Terms & Conditions. Please read them carefully before purchasing.',
        ],
      },
      {
        heading: 'General',
        list: [
          'You must be at least 18 years old or have guardian consent to purchase.',
          'Product images are for illustration; slight colour or design variations may occur.',
          'Prices are in Kenyan Shillings (KSh) unless stated otherwise and may change without notice until an order is confirmed.',
          'We reserve the right to refuse or cancel orders (e.g. pricing errors, stock issues, suspected fraud).',
        ],
      },
      {
        heading: 'Orders & payment',
        paragraphs: [
          'An order is confirmed when you receive confirmation from us (email, SMS, or WhatsApp). Customization details you submit are your responsibility, verify spelling, dates, and logos before checkout.',
          'Payment must be completed via the methods offered at checkout (e.g. M-Pesa, card). Orders may be held until payment is verified.',
        ],
      },
      {
        heading: 'Custom products',
        paragraphs: [
          'Personalized and engraved items cannot be cancelled once production has started. Delays caused by incomplete or incorrect customization information provided by the customer are not grounds for automatic refund.',
        ],
      },
      {
        heading: 'Intellectual property',
        paragraphs: [
          'All website content, logos, and designs are owned by Vegas Gift Shop or licensors. You may not copy or reuse content without written permission. If you supply artwork for branding, you confirm you have the right to use it.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          'To the fullest extent permitted by law, we are not liable for indirect or consequential losses. Our liability for any order is limited to the amount you paid for that order, except where law requires otherwise.',
        ],
      },
      {
        heading: 'Governing law',
        paragraphs: [
          'These terms are governed by the laws of Kenya. Disputes shall be subject to the exclusive jurisdiction of Kenyan courts, after good-faith attempt to resolve matters directly with our support team.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'Questions about these terms: support@vegasgifts.co.ke or call +254 792 943753.',
        ],
      },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Quick answers about ordering, delivery, and customization.',
    lastUpdated: 'May 2026',
    sections: [
      {
        heading: 'Ordering',
        list: [
          'How do I place an order? Browse the shop, add items to cart, and checkout online. You can also order via WhatsApp from any product page.',
          'Can I customize a gift? Yes. Many products support engraving, gift cards, and branding. Select options on the product page before adding to cart.',
          'Do you offer corporate/bulk orders? Yes. Contact us with quantities and branding requirements for a quote.',
        ],
      },
      {
        heading: 'Delivery',
        list: [
          'Do you deliver outside Nairobi? Yes, across Kenya via courier. See Shipping & Delivery for zones and timelines.',
          'Is same-day delivery available? Often within Nairobi for in-stock items ordered before our daily cut-off. Custom items need production time first.',
        ],
      },
      {
        heading: 'Payments',
        list: [
          'Which payment methods do you accept? M-Pesa, card, and other methods shown at checkout.',
          'When is my order confirmed? After payment is received and you get confirmation from our team.',
        ],
      },
      {
        heading: 'Returns',
        paragraphs: [
          'See our Returns & Refunds page for full details. Personalized items generally cannot be returned unless defective or our error.',
        ],
      },
    ],
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'We are here to help with orders, customization, and delivery.',
    lastUpdated: 'May 2026',
    sections: [
      {
        paragraphs: [
          'Reach our team for product questions, bulk corporate orders, delivery updates, or help with an existing purchase. We aim to respond within one business day, often much sooner on WhatsApp during working hours.',
        ],
      },
      {
        heading: 'Get in touch',
        list: [
          'Phone: +254 792 943753',
          'Email: support@vegasgifts.co.ke / info@vegasgiftshop.co.ke',
          'WhatsApp: available from product pages and checkout',
          'Address: Nairobi CBD, Kenya (pick-up by appointment, contact us first)',
        ],
      },
      {
        heading: 'Business hours',
        paragraphs: [
          'Monday – Saturday: 9:00 AM – 6:00 PM EAT',
          'Sunday & public holidays: limited support; urgent delivery requests should be placed in advance.',
        ],
      },
    ],
  },
};
